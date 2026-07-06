#!/usr/bin/env python3
"""demo_server.py — live web UI for the video harness.

Type a topic → get a documentary video. Shows live progress as each phase runs.

Usage: python3 demo_server.py [--port 8080]
"""
import argparse, json, os, subprocess, sys, threading, time, uuid, shutil
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import parse_qs

HERE = Path(__file__).resolve().parent
WORK = Path("/home/ubuntu/work")
JOBS = {}  # job_id -> {topic, status, log[], video, workdir, error, t0}
LOCK = threading.Lock()

# API keys must be in env — load from keys.env if present
KEYS = Path.home() / ".config/api-keys/keys.env"
if KEYS.exists():
    for line in KEYS.read_text().splitlines():
        line = line.strip()
        if line.startswith("export "):
            k, v = line[7:].split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"'))


PAGE = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Video Harness — Live Demo</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0b0e13; color: #e8eef4; font-family: -apple-system, system-ui, sans-serif;
         display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 2rem; }
  h1 { font-size: 1.4rem; font-weight: 600; margin-bottom: 0.3rem; color: #f2a93b; }
  .sub { color: #8c95a5; font-size: 0.85rem; margin-bottom: 2rem; }
  .card { background: #12161e; border: 1px solid #1f2733; border-radius: 12px;
          padding: 2rem; width: 100%; max-width: 600px; }
  .controls { display: flex; gap: 0.8rem; margin-bottom: 1rem; align-items: center; }
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
    transition: opacity 0.2s; }
  button.gen:hover { opacity: 0.85; }
  button.gen:disabled { opacity: 0.4; cursor: default; }
  .log { margin-top: 1.5rem; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.78rem;
    line-height: 1.5; color: #8c95a5; max-height: 200px; overflow-y: auto;
    background: #0b0e13; border-radius: 8px; padding: 1rem; display: none; }
  .log .line { white-space: pre-wrap; }
  .log .ok { color: #4ade80; }
  .log .err { color: #f87171; }
  .log .phase { color: #f2a93b; font-weight: 600; }
  .timer { margin-top: 1rem; font-size: 1.5rem; font-weight: 700; color: #f2a93b; font-variant-numeric: tabular-nums; }
  .result { margin-top: 1.5rem; display: none; }
  video { max-width: 100%; border-radius: 8px; border: 1px solid #2c3340; }
  video.short { max-height: 500px; width: auto; display: block; margin: 0 auto; }
  .meta { margin-top: 0.8rem; font-size: 0.8rem; color: #8c95a5; display: flex; gap: 1.5rem; flex-wrap: wrap; }
  .meta span b { color: #e8eef4; }
  .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid #2c3340;
    border-top-color: #f2a93b; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>
  <h1>Video Harness</h1>
  <p class="sub">Type a topic — get a short documentary. ~40 seconds.</p>
  <div class="card">
    <div class="controls">
      <div class="toggle" id="fmt-toggle">
        <button class="active" data-fmt="long" onclick="setFmt('long')">Long-form</button>
        <button data-fmt="short" onclick="setFmt('short')">Short (TikTok)</button>
      </div>
      <button class="surprise" onclick="surpriseMe()"> Surprise me </button>
    </div>
    <input type="text" id="topic" placeholder="e.g. the Dyatlov Pass incident, the fall of Constantinople, how penicillin was discovered..." autofocus>
    <button class="gen" id="go" onclick="generate()">Generate Video</button>
    <div class="timer" id="timer" style="display:none"><span class="spinner"></span> 0.0s</div>
    <div class="log" id="log"></div>
    <div class="result" id="result">
      <video id="player" controls></video>
      <div class="meta" id="meta"></div>
    </div>
  </div>
<script>
let jobId = null;
let pollTimer = null;
let startTime = null;
let fmt = 'long';

function setFmt(f) {
  fmt = f;
  document.querySelectorAll('#fmt-toggle button').forEach(b => b.classList.toggle('active', b.dataset.fmt === f));
}

async function surpriseMe() {
  document.getElementById('topic').value = 'surprise me';
  document.getElementById('topic').placeholder = 'Asking the LLM for a topic...';
  const resp = await fetch('/surprise');
  const data = await resp.json();
  document.getElementById('topic').value = data.topic;
}

async function generate() {
  let topic = document.getElementById('topic').value.trim();
  if (!topic) return;
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
    timer.innerHTML = '<span class="spinner"></span> ' + elapsed + 's';
  };
  pollTimer = setInterval(tickTimer, 100);

  const resp = await fetch('/generate', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'topic=' + encodeURIComponent(topic) + '&format=' + encodeURIComponent(fmt)
  });
  const data = await resp.json();
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
    timer.querySelector('.spinner')?.remove();

    const result = document.getElementById('result');
    const player = document.getElementById('player');
    player.src = '/video/' + jobId;
    player.className = data.format === 'short' ? 'short' : '';
    result.style.display = 'block';

    const meta = document.getElementById('meta');
    meta.innerHTML = '<span><b>' + data.beats + '</b> beats</span>' +
      '<span><b>' + data.narration + '</b> narration</span>' +
      '<span><b>$' + data.cost + '</b> cost</span>' +
      '<span><b>' + data.format + '</b></span>';

    const btn = document.getElementById('go');
    btn.disabled = false;
    btn.textContent = 'Generate Another';
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
        # check for the summary line to extract metadata
        if "TOTAL WALL" in line:
            try:
                parts = line.split()
                job["total_wall"] = parts[-2].rstrip("s")
            except Exception:
                pass
        if "NARRATION" in line and "min" in line:
            try:
                job["narration"] = line.split()[1].rstrip("s")
            except Exception:
                pass
        if "TOTAL COST" in line and "$" in line:
            try:
                for p in line.split():
                    if p.startswith("$"):
                        job["cost"] = p[1:]
            except Exception:
                pass

    proc.wait()
    final = workdir / "final.mp4"
    if final.exists() and final.stat().st_size > 10000:
        with LOCK:
            job["status"] = "done"
            job["video"] = str(final)
        # parse summary.json for metadata
        summary_path = workdir / "summary.json"
        if summary_path.exists():
            s = json.load(open(summary_path))
            job["beats"] = s.get("beats", 0)
            job["narration"] = f"{s.get('tts', {}).get('narration_s', 0)}s"
            job["cost"] = f"{s.get('total_cost_usd', 0):.2f}"
            job["resolution"] = "720"
            job["format"] = s.get("format", "long")
    else:
        with LOCK:
            job["status"] = "error"
            job["error"] = "Video build failed — check log"


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass  # suppress default logging

    def do_GET(self):
        if self.path == '/' or self.path == '/index.html':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(PAGE.encode())
        elif self.path == '/surprise':
            # ask the LLM to pick a topic
            import urllib.request as ur
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
                if not topic:
                    topic = msg.get("reasoning_content", "").strip()
                # take last non-empty line, strip common prefixes
                lines = [l.strip() for l in topic.split("\n") if l.strip()]
                topic = lines[-1] if lines else topic
                topic = topic.strip('"').strip("*").strip("`").strip()
                # if it starts with a number/list marker, strip it
                while topic and topic[0] in "0123456789.-*# ":
                    topic = topic[1:].lstrip()
                if not topic:
                    topic = "the fall of the Library of Alexandria"
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"topic": topic}).encode())
            except Exception as e:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"topic": "the fall of the Library of Alexandria"}).encode())
        elif self.path.startswith('/status/'):
            job_id = self.path.split('/')[2]
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
                "resolution": job.get("resolution", ""),
                "error": job.get("error", ""),
            }).encode())
        elif self.path.startswith('/video/'):
            job_id = self.path.split('/')[2]
            with LOCK:
                job = JOBS.get(job_id, {})
            video_path = job.get("video")
            if not video_path or not Path(video_path).exists():
                self.send_response(404)
                self.end_headers()
                return
            self.send_response(200)
            self.send_header('Content-Type', 'video/mp4')
            self.send_header('Content-Length', str(Path(video_path).stat().st_size))
            self.send_header('Accept-Ranges', 'bytes')
            self.end_headers()
            with open(video_path, 'rb') as f:
                shutil.copyfileobj(f, self.wfile)
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/generate':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length).decode()
            params = parse_qs(body)
            topic = params.get('topic', [''])[0].strip()
            fmt = params.get('format', ['long'])[0].strip()
            if not topic:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "no topic"}).encode())
                return
            job_id = uuid.uuid4().hex[:12]
            workdir = WORK / job_id
            with LOCK:
                JOBS[job_id] = {
                    "topic": topic, "status": "running",
                    "log": [], "workdir": workdir, "t0": time.time(),
                    "format": fmt,
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
    server = HTTPServer(('0.0.0.0', args.port), Handler)
    print(f"demo server on http://0.0.0.0:{args.port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
