#!/usr/bin/env python3
"""InstantImages.org — instant AI image generation.

Type a prompt → get an image in ~3 seconds. Powered by Gemini Flash Lite.
Free, no login, no watermark.
"""
import json, os, time, uuid, base64, sqlite3, threading
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
import urllib.request as ur

HERE = Path(__file__).resolve().parent
WORK = Path("/home/ubuntu/images")

# Load API keys
KEYS = Path.home() / ".config/api-keys/keys.env"
if KEYS.exists():
    for line in KEYS.read_text().splitlines():
        line = line.strip()
        if line.startswith("export "):
            k, v = line[7:].split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"'))

# Import gemini_image from the shared pipeline
import sys
sys.path.insert(0, str(HERE / "pipeline"))
from pipeline import gemini_image

RATE_LIMIT = int(os.environ.get("II_RATE_LIMIT", "10"))
RATE_WINDOW_S = int(os.environ.get("II_RATE_WINDOW_S", "3600"))
DB = Path("/home/ubuntu/image_credits.db")

_lock = threading.Lock()
_db_lock = threading.Lock()


def get_db():
    conn = sqlite3.connect(str(DB))
    conn.execute("""CREATE TABLE IF NOT EXISTS rate_log (
        ip TEXT, t REAL
    )""")
    conn.execute("CREATE INDEX IF NOT EXISTS rate_log_ip_t ON rate_log (ip, t)")
    conn.commit()
    return conn


def get_client_ip(handler):
    cf_ip = handler.headers.get("CF-Connecting-IP")
    if cf_ip:
        return cf_ip.strip()
    xff = handler.headers.get("X-Forwarded-For")
    if xff:
        return xff.split(",")[0].strip()
    return handler.client_address[0]


def check_rate(ip):
    """Per-IP rate limit. Returns (ok, retry_after_s, message)."""
    conn = get_db()
    try:
        conn.execute("BEGIN IMMEDIATE")
        cutoff = time.time() - RATE_WINDOW_S
        conn.execute("DELETE FROM rate_log WHERE t < ?", (cutoff,))
        row = conn.execute("SELECT COUNT(*) FROM rate_log WHERE ip = ?", (ip,)).fetchone()
        count = row[0] if row else 0
        if count >= RATE_LIMIT:
            conn.execute("COMMIT")
            row2 = conn.execute("SELECT MIN(t) FROM rate_log WHERE ip = ?", (ip,)).fetchone()
            oldest = (row2[0] if row2 and row2[0] else time.time())
            retry_after = max(0, int((oldest + RATE_WINDOW_S) - time.time()))
            mins = max(1, (retry_after + 59) // 60)
            return (False, retry_after,
                    f"Rate limit — try again in ~{mins} min. "
                    f"(Limit is {RATE_LIMIT} images per hour per IP.)")
        conn.execute("INSERT INTO rate_log (ip, t) VALUES (?, ?)", (ip, time.time()))
        conn.execute("COMMIT")
        return (True, 0, "")
    except Exception:
        try: conn.execute("ROLLBACK")
        except Exception: pass
        return (True, 0, "")
    finally:
        conn.close()


PAGE = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>InstantImages — AI images in 3 seconds</title>
<meta name="description" content="Type any prompt. Get a finished AI image in under 3 seconds. Free, no login.">
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
  .toggle button { margin: 0; padding: 0.5rem 1rem; font-size: 0.82rem; font-weight: 500;
    background: transparent; color: #8c95a5; border: none; border-radius: 0; cursor: pointer; }
  .toggle button.active { background: #f2a93b; color: #0b0e13; }
  .surprise { padding: 0.5rem 1rem; font-size: 0.85rem; font-weight: 500;
    background: transparent; border: 1px solid #f2a93b; color: #f2a93b; border-radius: 8px;
    cursor: pointer; margin: 0; }
  .surprise:hover { background: #f2a93b; color: #0b0e13; }
  textarea { width: 100%; padding: 0.8rem 1rem; font-size: 1rem;
    background: #0b0e13; border: 1px solid #2c3340; border-radius: 8px; color: #e8eef4;
    resize: vertical; min-height: 60px; font-family: inherit; }
  textarea:focus { outline: none; border-color: #f2a93b; }
  button.gen { margin-top: 1rem; padding: 0.7rem 2rem; font-size: 0.95rem; font-weight: 600;
    background: #f2a93b; color: #0b0e13; border: none; border-radius: 8px; cursor: pointer;
    transition: opacity 0.2s; width: 100%; }
  button.gen:hover { opacity: 0.85; }
  button.gen:disabled { opacity: 0.4; cursor: default; }
  .timer { margin-top: 1rem; font-size: 1.2rem; font-weight: 700; color: #f2a93b;
    text-align: center; display: none; }
  .spinner { display: inline-block; width: 16px; height: 16px;
    border: 2px solid #2c3340; border-top-color: #f2a93b; border-radius: 50%;
    animation: spin 0.8s linear infinite; vertical-align: middle; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .result { margin-top: 1.5rem; display: none; }
  .result img { max-width: 100%; border-radius: 12px; border: 1px solid #1f2733; display: block; }
  .bar { margin-top: 0.8rem; display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
  .bar a { color: #f2a93b; text-decoration: none; font-size: 0.85rem; font-weight: 600; }
  .footer { margin-top: 2rem; color: #4c566a; font-size: 0.75rem; text-align: center; }
  .footer a { color: #8c95a5; text-decoration: none; }
  .err { color: #f87171; font-size: 0.85rem; margin-top: 0.5rem; display: none; }
</style>
</head>
<body>
  <div class="header">
    <h1>InstantImages</h1>
    <p class="tagline">Type any prompt. Get an AI image in under 3 seconds.</p>
  </div>
  <div class="card">
    <div class="controls">
      <div class="toggle" id="ar-toggle">
        <button class="active" data-ar="1:1" onclick="setAR('1:1')">Square</button>
        <button data-ar="16:9" onclick="setAR('16:9')">Landscape</button>
        <button data-ar="9:16" onclick="setAR('9:16')">Portrait</button>
      </div>
      <button class="surprise" onclick="surpriseMe()">Surprise me</button>
    </div>
    <textarea id="prompt" placeholder="a lighthouse in a storm at golden hour, oil painting..." autofocus rows="2"></textarea>
    <button class="gen" id="go" onclick="generate()">Generate Image</button>
    <div class="timer" id="timer"><span class="spinner"></span> <span id="timer-text">0.0s</span></div>
    <div class="err" id="err"></div>
    <div class="result" id="result">
      <img id="img">
      <div class="bar">
        <a href="#" id="dl" download="instantimage.png">Download PNG</a>
      </div>
    </div>
  </div>
  <div class="footer">
    <p>Powered by AI · <a href="https://instantvideos.org">InstantVideos.org</a> · ~$0.03 per image</p>
  </div>
<script>
let ar = '1:1';
let startTime = null;
let pollTimer = null;

function setAR(a) {
  ar = a;
  document.querySelectorAll('#ar-toggle button').forEach(b => b.classList.toggle('active', b.dataset.ar === a));
}

async function surpriseMe() {
  document.getElementById('prompt').value = '...';
  const resp = await fetch('/surprise');
  const data = await resp.json();
  document.getElementById('prompt').value = data.prompt;
}

async function generate() {
  let prompt = document.getElementById('prompt').value.trim();
  if (!prompt || prompt === '...') return;
  const btn = document.getElementById('go');
  const timer = document.getElementById('timer');
  const result = document.getElementById('result');
  const err = document.getElementById('err');
  btn.disabled = true;
  btn.textContent = 'Generating...';
  err.style.display = 'none';
  result.style.display = 'none';
  timer.style.display = 'block';
  startTime = Date.now();
  const tick = () => { document.getElementById('timer-text').textContent = ((Date.now()-startTime)/1000).toFixed(1)+'s'; };
  pollTimer = setInterval(tick, 100);

  try {
    const resp = await fetch('/generate', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: 'prompt=' + encodeURIComponent(prompt) + '&ar=' + encodeURIComponent(ar)
    });
    const data = await resp.json();
    clearInterval(pollTimer);
    if (data.error) {
      timer.style.display = 'none';
      btn.disabled = false; btn.textContent = 'Try Again';
      err.textContent = data.error; err.style.display = 'block';
      return;
    }
    const elapsed = ((Date.now()-startTime)/1000).toFixed(1);
    timer.innerHTML = 'Done in ' + elapsed + 's';
    document.getElementById('img').src = 'data:image/png;base64,' + data.image;
    document.getElementById('dl').href = 'data:image/png;base64,' + data.image;
    result.style.display = 'block';
  } catch(e) {
    clearInterval(pollTimer);
    timer.style.display = 'none';
    err.textContent = 'Network error — please try again.'; err.style.display = 'block';
  }
  btn.disabled = false; btn.textContent = 'Generate Another';
}

document.getElementById('prompt').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generate(); }
});
</script>
</body>
</html>'''


SURPRISE_PROMPT = (
    "Give ONE visually striking image prompt — a specific concrete scene that "
    "would make a beautiful image. Grounded and vivid, not abstract. One sentence. "
    "Include a subject, setting, and mood/lighting. Examples: "
    "'a derelict lighthouse battered by a storm at golden hour, oil painting', "
    "'a single red umbrella abandoned on rain-soaked cobblestones at night', "
    "'an astronaut sitting alone in a diner on Mars, warm light through the window', "
    "'a cherry blossom branch over still water at dawn, mist, minimal ink wash'. "
    "Reply with ONLY the prompt, one sentence."
)


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        from urllib.parse import urlparse
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
                "service_tier": "priority",
                "messages": [{"role": "user", "content": SURPRISE_PROMPT}],
            }).encode()
            try:
                req = ur.Request("https://api.fireworks.ai/inference/v1/chat/completions",
                    data=body, headers={
                        "Authorization": f"Bearer {os.environ.get('FIREWORKS_API_KEY','')}",
                        "content-type": "application/json"})
                with ur.urlopen(req, timeout=20) as resp:
                    out = json.loads(resp.read())
                msg = out["choices"][0]["message"]
                prompt = (msg.get("content") or "").strip().strip('"').strip("*").strip("`").strip()
                if not prompt or len(prompt) < 10 or prompt.startswith(("1.", "I'll", "Let me", "Here")):
                    import random
                    prompt = random.choice([
                        "a derelict lighthouse battered by a storm at golden hour, oil painting",
                        "a single red umbrella on rain-soaked cobblestones at night",
                        "an astronaut sitting alone in a diner on Mars, warm light through the window",
                        "a cherry blossom branch over still water at dawn, mist, minimal ink wash",
                        "a vintage typewriter on a desk by a window, rain streaming down the glass",
                    ])
            except Exception:
                prompt = "a derelict lighthouse battered by a storm at golden hour, oil painting"
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"prompt": prompt}).encode())

        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        from urllib.parse import urlparse, parse_qs
        parsed = urlparse(self.path)
        if parsed.path == '/generate':
            ip = get_client_ip(self)
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length).decode()
            params = parse_qs(body)
            prompt = params.get('prompt', [''])[0].strip()
            ar = params.get('ar', ['1:1'])[0].strip()

            if not prompt:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "no prompt"}).encode())
                return

            rate_ok, retry_after, rate_msg = check_rate(ip)
            if not rate_ok:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": rate_msg}).encode())
                return

            # generate the image
            WORK.mkdir(parents=True, exist_ok=True)
            job_id = uuid.uuid4().hex[:12]
            out_path = WORK / f"{job_id}.png"
            ok, wall_s, err = gemini_image(prompt, out_path, aspect_ratio=ar, timeout=60)

            if not ok:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "error": "Image generation failed — please try again."
                }).encode())
                return

            img_b64 = base64.b64encode(out_path.read_bytes()).decode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"image": img_b64}).encode())


def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8080)
    args = ap.parse_args()
    get_db()
    server = ThreadingHTTPServer(('0.0.0.0', args.port), Handler)
    print(f"InstantImages.org on http://0.0.0.0:{args.port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
