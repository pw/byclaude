#!/usr/bin/env python3
"""InstantVideos.org — production demo server.

Type a topic → get a short documentary video. Shows live progress.

Features:
- Free mode (IV_FREE_MODE=1, default): unlimited videos for everyone.
  Flip to 0 to re-enable the paywall (1 free per IP, then Stripe).
- Per-IP credit tracking via SQLite (kept even in free mode so the paywall
  can come back without losing state)
- Stripe checkout + payment verification on return
- Video persistence via R2 upload (optional)
- Graceful failure messages when an upstream AI provider runs out of quota
- ThreadingHTTPServer for concurrent requests

Usage: python3 demo_server.py [--port 8080]
"""
import argparse, json, os, subprocess, sys, threading, time, uuid, shutil, sqlite3
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import parse_qs, urlparse
import urllib.request as ur

HERE = Path(__file__).resolve().parent
WORK = Path("/home/ubuntu/work")
JOBS = {}  # job_id -> {topic, status, log[], video, workdir, error, t0}
LOCK = threading.Lock()
DB = Path("/home/ubuntu/credits.db")
STRIPE_KEY = os.environ.get("STRIPE_SECRET_KEY", "")
STRIPE_PAYMENT_LINK = "https://buy.stripe.com/6oU8wIbNV56z0NTe3b2B201"

# API keys must be in env — load from keys.env if present
KEYS = Path.home() / ".config/api-keys/keys.env"
if KEYS.exists():
    for line in KEYS.read_text().splitlines():
        line = line.strip()
        if line.startswith("export "):
            k, v = line[7:].split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"'))


def get_db():
    """SQLite connection for credit tracking."""
    conn = sqlite3.connect(str(DB))
    conn.execute("""CREATE TABLE IF NOT EXISTS credits (
        ip TEXT PRIMARY KEY,
        free_used INTEGER DEFAULT 0,
        paid_credits INTEGER DEFAULT 0,
        stripe_session TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
    )""")
    conn.commit()
    return conn


def get_client_ip(handler):
    """Get real client IP (behind Cloudflare)."""
    # CF-Connecting-IP is set by Cloudflare
    cf_ip = handler.headers.get("CF-Connecting-IP")
    if cf_ip:
        return cf_ip.strip()
    # fall back to X-Forwarded-For
    xff = handler.headers.get("X-Forwarded-For")
    if xff:
        return xff.split(",")[0].strip()
    # direct connection
    return handler.client_address[0]


ADMIN_OVERRIDE = os.environ.get("IV_ADMIN_KEY", "pw")  # ?admin=pw bypasses credit limit
# Free mode: anyone can generate as many videos as they like. Defaults to ON
# — this instance's whole purpose is the Show HN launch, so free-by-default
# means a reboot (which would wipe /tmp/vh-env.conf) can't silently re-paywall
# the site. To re-enable the paywall after the launch: set IV_FREE_MODE=0 in
# /tmp/vh-env.conf (or a persistent env file) and restart vh-demo.service.
# The underlying credit rows are kept either way so paid users keep credits.
FREE_MODE = os.environ.get("IV_FREE_MODE", "1") == "1"


def check_credits(ip, override=False):
    """Returns (can_generate, remaining_free, paid_credits, message, mode)."""
    if override:
        return (True, 999, 999, "admin mode — unlimited", "admin")
    if FREE_MODE:
        return (True, 999, 0, "Free during launch — try as many as you like", "free")
    conn = get_db()
    row = conn.execute("SELECT free_used, paid_credits FROM credits WHERE ip=?", (ip,)).fetchone()
    conn.close()
    if not row:
        return (True, 1, 0, "1 free video remaining", "paid")
    free_used, paid = row
    free_remaining = max(0, 1 - free_used)
    if free_remaining > 0:
        return (True, free_remaining, paid, f"{free_remaining} free video remaining", "paid")
    if paid > 0:
        return (True, 0, paid, f"{paid} paid credits remaining", "paid")
    return (False, 0, 0, "No credits remaining — buy more for $1", "paid")


def use_credit(ip):
    """Consume one credit (free first, then paid). Returns True if granted.
    No-op in free mode — we don't debit rows so the paywall can come back clean.
    """
    if FREE_MODE:
        return True
    conn = get_db()
    row = conn.execute("SELECT free_used, paid_credits FROM credits WHERE ip=?", (ip,)).fetchone()
    if not row:
        conn.execute("INSERT INTO credits (ip, free_used) VALUES (?, 1)", (ip,))
        conn.commit()
        conn.close()
        return True
    free_used, paid = row
    if free_used < 1:
        conn.execute("UPDATE credits SET free_used=1, updated_at=datetime('now') WHERE ip=?", (ip,))
        conn.commit()
        conn.close()
        return True
    if paid > 0:
        conn.execute("UPDATE credits SET paid_credits=paid_credits-1, updated_at=datetime('now') WHERE ip=?", (ip,))
        conn.commit()
        conn.close()
        return True
    conn.close()
    return False


def detect_failure(log_lines):
    """Look at the accumulated pipeline log and return a user-facing message
    if we recognize an upstream-exhaustion signature, else None (caller falls
    back to a generic message).

    Known failure shapes:
    - OpenAI TTS quota:                "insufficient_quota", 429 from openai
    - Gemini image quota:              429 from generativelanguage.googleapis.com
    - kie.ai balance exhausted:        "No task ID returned", /v1/chat/credit
    - Anthropic / Fireworks LLM quota: 429 + anthropic|fireworks, "gen_script.py failed"
    - LLM returned bad JSON:          "model returned invalid JSON"
    """
    joined = "\n".join(log_lines).lower()
    if "insufficient_quota" in joined:
        return "Our audio credits just ran out — we're topping up now. Please try again in a few minutes."
    if "429" in joined and ("openai" in joined or "gpt-4o" in joined or "audio/speech" in joined):
        return "Our audio credits just ran out — we're topping up now. Please try again in a few minutes."
    if "429" in joined and ("generativelanguage.googleapis.com" in joined or "gemini" in joined):
        return "Our image credits just ran out — we're topping up now. Please try again in a few minutes."
    if "no task id" in joined or ("kie.ai" in joined and ("balance" in joined or "credit" in joined)):
        return "Our image credits just ran out — we're topping up now. Please try again in a few minutes."
    if "gen_script.py failed" in joined or "model returned invalid json" in joined:
        return "Our story-writing AI hit a capacity limit. Please try again in a moment."
    if "anthropic_error" in joined or ("429" in joined and ("anthropic" in joined or "fireworks" in joined)):
        return "Our story-writing AI hit a capacity limit. Please try again in a moment."
    return None


def grant_credits(ip, n=5, session_id=""):
    """Add paid credits after Stripe payment verification."""
    conn = get_db()
    row = conn.execute("SELECT ip FROM credits WHERE ip=?", (ip,)).fetchone()
    if row:
        conn.execute("UPDATE credits SET paid_credits=paid_credits+?, stripe_session=?, updated_at=datetime('now') WHERE ip=?",
                     (n, session_id, ip))
    else:
        conn.execute("INSERT INTO credits (ip, paid_credits, stripe_session) VALUES (?, ?, ?)",
                     (ip, n, session_id))
    conn.commit()
    conn.close()


def verify_stripe_session(session_id):
    """Verify a Stripe checkout session was paid. Returns (paid, credits, ip)."""
    if not STRIPE_KEY or not session_id:
        return (False, 0, "")
    try:
        req = ur.Request(f"https://api.stripe.com/v1/checkout/sessions/{session_id}",
                         headers={"Authorization": f"Bearer {STRIPE_KEY}"})
        with ur.urlopen(req, timeout=10) as resp:
            d = json.loads(resp.read())
        if d.get("payment_status") == "paid":
            meta = d.get("metadata", {})
            credits = int(meta.get("credits", 5))
            ip = meta.get("ip", "")
            return (True, credits, ip)
        return (False, 0, "")
    except Exception:
        return (False, 0, "")


PAGE = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>InstantVideos — AI documentary videos in 30 seconds</title>
<meta name="description" content="Type any topic. Get a finished documentary video in under a minute. Powered by AI.">
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-LFEEJHPQFG"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-LFEEJHPQFG');
</script>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0b0e13; color: #e8eef4; font-family: -apple-system, system-ui, sans-serif;
         display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 2rem 1rem; }
  .header { text-align: center; margin-bottom: 2rem; }
  h1 { font-size: 2rem; font-weight: 700; color: #f2a93b; letter-spacing: -0.02em; }
  .tagline { color: #8c95a5; font-size: 1rem; margin-top: 0.5rem; }
  .card { background: #12161e; border: 1px solid #1f2733; border-radius: 16px;
          padding: 2rem; width: 100%; max-width: 600px; }
  .controls { display: flex; gap: 0.8rem; margin-bottom: 1rem; align-items: center; flex-wrap: wrap; }
  .toggle { display: inline-flex; border: 1px solid #2c3340; border-radius: 8px; overflow: hidden; }
  .toggle button { margin: 0; padding: 0.5rem 1.2rem; font-size: 0.85rem; font-weight: 500;
    background: transparent; color: #8c95a5; border: none; border-radius: 0; cursor: pointer; }
  .toggle button.active { background: #f2a93b; color: #0b0e13; }
  .surprise { padding: 0.5rem 1rem; font-size: 0.85rem; font-weight: 500;
    background: transparent; border: 1px solid #f2a93b; color: #f2a93b; border-radius: 8px;
    cursor: pointer; margin: 0; }
  .surprise:hover { background: #f2a93b; color: #0b0e13; }
  input[type=text] { width: 100%; padding: 0.8rem 1rem; font-size: 1rem;
    background: #0b0e13; border: 1px solid #2c3340; border-radius: 8px; color: #e8eef4; }
  input[type=text]:focus { outline: none; border-color: #f2a93b; }
  button.gen { margin-top: 1rem; padding: 0.7rem 2rem; font-size: 0.95rem; font-weight: 600;
    background: #f2a93b; color: #0b0e13; border: none; border-radius: 8px; cursor: pointer;
    transition: opacity 0.2s; width: 100%; }
  button.gen:hover { opacity: 0.85; }
  button.gen:disabled { opacity: 0.4; cursor: default; }
  .credits-bar { margin-top: 0.8rem; font-size: 0.8rem; color: #8c95a5; text-align: center; }
  .credits-bar a { color: #f2a93b; text-decoration: none; font-weight: 600; }
  .log { margin-top: 1.5rem; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.78rem;
    line-height: 1.5; color: #8c95a5; max-height: 200px; overflow-y: auto;
    background: #0b0e13; border-radius: 8px; padding: 1rem; display: none; }
  .log .line { white-space: pre-wrap; }
  .log .ok { color: #4ade80; }
  .log .err { color: #f87171; }
  .log .phase { color: #f2a93b; font-weight: 600; }
  .timer { margin-top: 1rem; font-size: 1.5rem; font-weight: 700; color: #f2a93b;
    font-variant-numeric: tabular-nums; text-align: center; }
  .result { margin-top: 1.5rem; display: none; }
  video { max-width: 100%; border-radius: 8px; border: 1px solid #2c3340; }
  video.short { max-height: 500px; width: auto; display: block; margin: 0 auto; }
  .meta { margin-top: 0.8rem; font-size: 0.8rem; color: #8c95a5; display: flex; gap: 1.5rem;
    flex-wrap: wrap; align-items: center; }
  .meta span b { color: #e8eef4; }
  .spinner { display: inline-block; width: 16px; height: 16px;
    border: 2px solid #2c3340; border-top-color: #f2a93b; border-radius: 50%;
    animation: spin 0.8s linear infinite; vertical-align: middle; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .footer { margin-top: 2rem; color: #4c566a; font-size: 0.75rem; text-align: center; }
  .footer a { color: #8c95a5; text-decoration: none; }
  .paid-notice { background: #1a2e1a; border: 1px solid #4ade80; border-radius: 8px;
    padding: 0.8rem; margin-bottom: 1rem; text-align: center; color: #4ade80; font-size: 0.85rem;
    display: none; }
</style>
</head>
<body>
  <div class="header">
    <h1>InstantVideos</h1>
    <p class="tagline">Type any topic. Get a finished documentary video in under a minute.</p>
  </div>
  <div class="card">
    <div class="paid-notice" id="paid-notice">Payment received — 5 credits added to your account!</div>
    <div class="controls">
      <div class="toggle" id="fmt-toggle">
        <button class="active" data-fmt="short" onclick="setFmt('short')">Short (TikTok)</button>
        <button data-fmt="long" onclick="setFmt('long')">Long-form</button>
      </div>
      <button class="surprise" onclick="surpriseMe()">Surprise me</button>
    </div>
    <input type="text" id="topic" placeholder="e.g. the Dyatlov Pass incident, the fall of Constantinople, how penicillin was discovered..." autofocus>
    <button class="gen" id="go" onclick="generate()">Generate Video</button>
    <div class="credits-bar" id="credits-bar">Loading credits...</div>
    <div class="timer" id="timer" style="display:none"><span class="spinner"></span> <span id="timer-text">0.0s</span></div>
    <div class="log" id="log"></div>
    <div class="result" id="result">
      <video id="player" controls></video>
      <div class="meta" id="meta"></div>
    </div>
  </div>
  <div class="footer">
    <p>Powered by AI · <a href="https://byclaude.net">by Claude</a> · ~$0.25 per video</p>
  </div>
<script>
let jobId = null;
let pollTimer = null;
let startTime = null;
let fmt = 'short';
let adminKey = new URLSearchParams(window.location.search).get('admin') || '';

async function setFmt(f) {
  fmt = f;
  document.querySelectorAll('#fmt-toggle button').forEach(b => b.classList.toggle('active', b.dataset.fmt === f));
}

async function surpriseMe() {
  document.getElementById('topic').value = '...';
  const resp = await fetch('/surprise');
  const data = await resp.json();
  document.getElementById('topic').value = data.topic;
}

// check for ?paid=1 on page load
const params = new URLSearchParams(window.location.search);
if (params.get('paid') === '1') {
  document.getElementById('paid-notice').style.display = 'block';
  // verify the Stripe session and grant credits
  const sessionId = params.get('session_id');
  if (sessionId) {
    fetch('/verify_payment?session_id=' + encodeURIComponent(sessionId))
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          document.getElementById('paid-notice').textContent = 'Payment received — ' + d.credits + ' credits added!';
        }
        updateCredits();
      });
  }
}

async function updateCredits() {
  const resp = await fetch('/credits' + (adminKey ? '?admin=' + encodeURIComponent(adminKey) : ''));
  const data = await resp.json();
  const bar = document.getElementById('credits-bar');
  const buyLink = '<a href="/checkout" target="_blank" style="color:#f2a93b;font-weight:600">Get 5 more for $1</a>';
  if (data.mode === 'free' || data.mode === 'admin') {
    // launch / admin — wide open. No paywall CTAs.
    bar.innerHTML = '<span style="color:#4ade80">' + data.message + '</span>';
  } else if (data.can_generate && data.free_remaining > 0) {
    bar.innerHTML = data.free_remaining + ' free video remaining · ' + buyLink;
  } else if (data.can_generate) {
    bar.innerHTML = data.paid_credits + ' paid credits remaining · ' + buyLink;
  } else {
    bar.innerHTML = 'No credits remaining · ' + buyLink;
  }
}updateCredits();

async function generate() {
  let topic = document.getElementById('topic').value.trim();
  if (!topic || topic === '...') return;
  const btn = document.getElementById('go');
  btn.disabled = true;
  btn.textContent = 'Generating...';
  const log = document.getElementById('log');
  const timer = document.getElementById('timer');
  const result = document.getElementById('result');
  log.innerHTML = '';
  log.style.display = 'block';
  result.style.display = 'none';
  timer.style.display = 'block';
  startTime = Date.now();

  const tickTimer = () => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    document.getElementById('timer-text').textContent = elapsed + 's';
  };
  pollTimer = setInterval(tickTimer, 100);

  const resp = await fetch('/generate', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'topic=' + encodeURIComponent(topic) + '&format=' + encodeURIComponent(fmt) + (adminKey ? '&admin=' + encodeURIComponent(adminKey) : '')
  });
  const data = await resp.json();
  if (data.error) {
    clearInterval(pollTimer);
    timer.innerHTML = 'Error';
    timer.style.color = '#f87171';
    btn.disabled = false;
    btn.textContent = 'Try Again';
    const d = document.createElement('div');
    d.className = 'line err';
    d.textContent = data.error;
    log.appendChild(d);
    updateCredits();
    return;
  }
  jobId = data.job_id;
  pollStatus();
}

async function pollStatus() {
  const resp = await fetch('/status/' + jobId);
  const data = await resp.json();
  const log = document.getElementById('log');

  for (const line of data.log.slice(log.children.length)) {
    const div = document.createElement('div');
    div.className = 'line';
    if (line.includes('FAIL') || line.includes('error')) div.classList.add('err');
    else if (line.startsWith('[') && line.includes('done')) div.classList.add('ok');
    else if (line.startsWith('===') || line.includes('TOTAL')) div.classList.add('phase');
    div.textContent = line;
    log.appendChild(div);
  }
  log.scrollTop = log.scrollHeight;

  if (data.status === 'done') {
    clearInterval(pollTimer);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const timer = document.getElementById('timer');
    timer.innerHTML = 'Done in ' + elapsed + 's';
    timer.style.color = '#4ade80';

    const result = document.getElementById('result');
    const player = document.getElementById('player');
    player.src = '/video/' + jobId;
    player.className = data.format === 'short' ? 'short' : '';
    result.style.display = 'block';

    const meta = document.getElementById('meta');
    meta.innerHTML = '<span><b>' + data.beats + '</b> beats</span>' +
      '<span><b>' + data.narration + '</b> narration</span>' +
      '<span><b>$' + data.cost + '</b> cost</span>' +
      '<span><b>' + (data.format === 'short' ? 'Short' : 'Long') + '</b></span>' +
      '<span><a href="/video/' + jobId + '" download style="color:#f2a93b;text-decoration:none">Download MP4</a></span>';

    const btn = document.getElementById('go');
    btn.disabled = false;
    btn.textContent = 'Generate Another';
    updateCredits();
  } else if (data.status === 'error') {
    clearInterval(pollTimer);
    const timer = document.getElementById('timer');
    timer.innerHTML = 'Error';
    timer.style.color = '#f87171';
    const btn = document.getElementById('go');
    btn.disabled = false;
    btn.textContent = 'Try Again';
    if (data.error) {
      const div = document.createElement('div');
      div.className = 'line err';
      div.textContent = data.error;
      log.appendChild(div);
    }
    updateCredits();
  } else {
    setTimeout(pollStatus, 500);
  }
}

document.getElementById('topic').addEventListener('keydown', e => {
  if (e.key === 'Enter') generate();
});
</script>
</body>
</html>'''


def run_pipeline(job_id, topic, fmt="long"):
    """Run the full pipeline in a background thread, streaming log lines to JOBS."""
    job = JOBS[job_id]
    workdir = job["workdir"]
    workdir.mkdir(parents=True, exist_ok=True)

    env = os.environ.copy()
    cmd = [
        sys.executable, str(HERE / "run.py"),
        "--topic", topic,
        "--workdir", str(workdir),
        "--format", fmt,
        "--llm", "glm-5.2-fireworks",
        "--model", "gemini-flash-lite",
        "--preset", "ultrafast",
        "--resolution", "720",
        "--mode", "perclip",
        "--motion", "kenburns",
        "--voice", "ballad",
        "--max-workers", "18",
        "--register", "documentary, warm, engaging, lets the story carry the weight",
        "--kicker", "DOCUMENTARY",
    ]

    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                            text=True, env=env, cwd=str(HERE))
    job["proc"] = proc

    for line in proc.stdout:
        line = line.rstrip()
        with LOCK:
            job["log"].append(line)

    proc.wait()
    exit_code = proc.returncode
    final = workdir / "final.mp4"
    if final.exists() and final.stat().st_size > 10000:
        with LOCK:
            job["status"] = "done"
            job["video"] = str(final)
        summary_path = workdir / "summary.json"
        if summary_path.exists():
            s = json.load(open(summary_path))
            job["beats"] = s.get("beats", 0)
            job["narration"] = f"{s.get('tts', {}).get('narration_s', 0)}s"
            job["cost"] = f"{s.get('total_cost_usd', 0):.2f}"
            job["format"] = s.get("format", "long")
    else:
        # scan the pipeline log for a known upstream-exhaustion signature;
        # if we find one, surface a friendly message instead of generic.
        with LOCK:
            detected = detect_failure(job["log"])
        with LOCK:
            job["status"] = "error"
            job["error"] = detected or f"Video build failed (pipeline exit {exit_code}) — please try again."


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == '/' or parsed.path == '/index.html':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(PAGE.encode())

        elif parsed.path == '/surprise':
            body = json.dumps({
                "model": "accounts/fireworks/models/gpt-oss-120b",
                "max_tokens": 200,
                "temperature": 1.2,
                "messages": [
                    {"role": "user", "content": "Name ONE fascinating specific topic for a documentary video — a real event, discovery, mystery, or person from history or science. Reply with ONLY the topic, one sentence. No reasoning. Examples: 'the Cadaver Synod of 897', 'how Mary Anning found the first plesiosaur', 'the Tunguska event of 1908'."},
                ],
            }).encode()
            try:
                req = ur.Request("https://api.fireworks.ai/inference/v1/chat/completions",
                    data=body, headers={
                        "Authorization": f"Bearer {os.environ.get('FIREWORKS_API_KEY','')}",
                        "content-type": "application/json"})
                with ur.urlopen(req, timeout=20) as resp:
                    out = json.loads(resp.read())
                msg = out["choices"][0]["message"]
                # gpt-oss puts reasoning in separate field; content has the answer
                topic = (msg.get("content") or "").strip()
                # clean up common LLM artifacts
                topic = topic.strip('"').strip("*").strip("`").strip()
                # if content is empty or starts with reasoning markers, try reasoning_content's last line
                if not topic or topic.startswith(("1.", "I'll", "Let me", "Here", "The user")):
                    rc = msg.get("reasoning_content", "")
                    lines = [l.strip() for l in rc.split("\n") if l.strip()]
                    topic = lines[-1] if lines else ""
                    topic = topic.strip('"').strip("*").strip("`").strip()
                    while topic and topic[0] in "0123456789.-*# ":
                        topic = topic[1:].lstrip()
                # final sanity check — if it still looks like reasoning, use a fallback
                if not topic or len(topic) < 10 or topic.startswith(("1.", "I'll", "Let me", "Here", "The user", "Better")):
                    import random
                    fallbacks = [
                        "the Cadaver Synod of 897",
                        "the Tunguska event of 1908",
                        "the dancing plague of Strasbourg in 1518",
                        "the disappearance of the Roanoke colony",
                        "the construction of the Erie Canal",
                        "the discovery of radium by Marie Curie",
                        "the Great Emu War of 1932",
                        "the sinking of the USS Indianapolis",
                        "the invention of the printing press by Gutenberg",
                        "the fall of the Library of Alexandria",
                    ]
                    topic = random.choice(fallbacks)
            except Exception:
                topic = "the fall of the Library of Alexandria"
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"topic": topic}).encode())

        elif parsed.path == '/credits':
            ip = get_client_ip(self)
            params = parse_qs(parsed.query)
            override = params.get('admin', [''])[0] == ADMIN_OVERRIDE
            can_gen, free, paid, msg, mode = check_credits(ip, override)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "can_generate": can_gen,
                "free_remaining": free,
                "paid_credits": paid,
                "message": msg,
                "mode": mode,
                "payment_url": "/checkout",
            }).encode())

        elif parsed.path == '/checkout':
            # create a Stripe Checkout Session with the user's IP as metadata
            ip = get_client_ip(self)
            if not STRIPE_KEY:
                self.send_response(200)
                self.send_header('Content-Type', 'text/html')
                self.end_headers()
                self.wfile.write(b"<h1>Stripe not configured</h1>")
                return
            from urllib.parse import quote
            success_url = quote("https://instantvideos.org/?paid=1&session_id={CHECKOUT_SESSION_ID}", safe="")
            cancel_url = quote("https://instantvideos.org/", safe="")
            body = (
                f"mode=payment"
                f"&line_items[0][price_data][currency]=usd"
                f"&line_items[0][price_data][product_data][name]=5 Video Credits - InstantVideos"
                f"&line_items[0][price_data][unit_amount]=100"
                f"&line_items[0][quantity]=1"
                f"&metadata[credits]=5"
                f"&metadata[ip]={ip}"
                f"&success_url={success_url}"
                f"&cancel_url={cancel_url}"
            )
            try:
                req = ur.Request("https://api.stripe.com/v1/checkout/sessions",
                    data=body.encode(),
                    headers={"Authorization": f"Bearer {STRIPE_KEY}",
                             "Content-Type": "application/x-www-form-urlencoded"})
                with ur.urlopen(req, timeout=15) as resp:
                    d = json.loads(resp.read())
                url = d.get("url", "")
                if url:
                    self.send_response(302)
                    self.send_header('Location', url)
                    self.end_headers()
                else:
                    self.send_response(500)
                    self.send_header('Content-Type', 'text/html')
                    self.end_headers()
                    self.wfile.write(b"<h1>Failed to create checkout session</h1>")
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'text/html')
                self.end_headers()
                self.wfile.write(f"<h1>Error: {e}</h1>".encode())

        elif parsed.path == '/verify_payment':
            params = parse_qs(parsed.query)
            session_id = params.get('session_id', [''])[0]
            # use the IP from the Stripe session metadata (set at checkout time)
            # falls back to current IP if metadata is missing
            current_ip = get_client_ip(self)
            paid, credits, session_ip = verify_stripe_session(session_id)
            ip = session_ip or current_ip
            if paid:
                grant_credits(ip, credits, session_id)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": paid, "credits": credits}).encode())

        elif parsed.path.startswith('/status/'):
            job_id = parsed.path.split('/')[2]
            with LOCK:
                job = JOBS.get(job_id, {})
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": job.get("status", "unknown"),
                "log": job.get("log", []),
                "beats": job.get("beats", 0),
                "narration": job.get("narration", ""),
                "cost": job.get("cost", ""),
                "format": job.get("format", "long"),
                "error": job.get("error", ""),
            }).encode())

        elif parsed.path.startswith('/video/'):
            job_id = parsed.path.split('/')[2]
            with LOCK:
                job = JOBS.get(job_id, {})
            video_path = job.get("video")
            if not video_path or not Path(video_path).exists():
                self.send_response(404)
                self.end_headers()
                return
            size = Path(video_path).stat().st_size
            self.send_response(200)
            self.send_header('Content-Type', 'video/mp4')
            self.send_header('Content-Length', str(size))
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Content-Disposition', f'attachment; filename="instantvideo-{job_id}.mp4"')
            self.end_headers()
            with open(video_path, 'rb') as f:
                shutil.copyfileobj(f, self.wfile)

        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == '/generate':
            ip = get_client_ip(self)
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length).decode()
            params = parse_qs(body)
            topic = params.get('topic', [''])[0].strip()
            fmt = params.get('format', ['long'])[0].strip()
            override = params.get('admin', [''])[0] == ADMIN_OVERRIDE
            can_gen, free, paid, msg, mode = check_credits(ip, override)
            if not can_gen:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "error": "No credits remaining. Get 5 more videos for $1.",
                    "payment_url": "/checkout",
                }).encode())
                return

            if not topic:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "no topic"}).encode())
                return

            # consume a credit
            use_credit(ip)

            job_id = uuid.uuid4().hex[:12]
            workdir = WORK / job_id
            with LOCK:
                JOBS[job_id] = {
                    "topic": topic, "status": "running",
                    "log": [], "workdir": workdir, "t0": time.time(),
                    "format": fmt, "ip": ip,
                }
            t = threading.Thread(target=run_pipeline, args=(job_id, topic, fmt), daemon=True)
            t.start()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"job_id": job_id}).encode())
        else:
            self.send_response(404)
            self.end_headers()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8080)
    args = ap.parse_args()
    # init DB
    get_db()
    server = ThreadingHTTPServer(('0.0.0.0', args.port), Handler)
    print(f"InstantVideos.org demo server on http://0.0.0.0:{args.port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
