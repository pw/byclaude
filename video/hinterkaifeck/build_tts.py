#!/usr/bin/env python3
"""Render narration per beat via OpenAI gpt-4o-mini-tts; record durations."""
import json, re, subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

BASE = Path.home() / "byclaude/video/hinterkaifeck"
data = json.load(open(BASE / "script.json"))
keytext = (Path.home() / ".config/api-keys/keys.env").read_text()
OKEY = re.search(r'^export OPENAI_API_KEY=(.+)$', keytext, re.M).group(1).strip().strip('"')
adir = BASE / "audio"; adir.mkdir(exist_ok=True)
(BASE / "work").mkdir(exist_ok=True)
voice, instr = data["voice"], data["voice_instructions"]

def render(b):
    out = adir / f"{b['id']}.mp3"
    payload = json.dumps({"model": "gpt-4o-mini-tts", "voice": voice,
                          "input": b["vo"], "instructions": instr})
    subprocess.run(["curl", "-s", "https://api.openai.com/v1/audio/speech",
                    "-H", f"Authorization: Bearer {OKEY}",
                    "-H", "Content-Type: application/json",
                    "-d", payload, "-o", str(out)], capture_output=True, text=True)
    d = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", str(out)], capture_output=True, text=True)
    try: dur = round(float(d.stdout.strip()), 3)
    except Exception: dur = None
    sz = out.stat().st_size if out.exists() else 0
    return (b['id'], dur, sz)

res = {}
print(f"[tts] {len(data['beats'])} beats, voice={voice}", flush=True)
with ThreadPoolExecutor(max_workers=5) as ex:
    for bid, dur, sz in ex.map(render, data["beats"]):
        res[bid] = {"dur": dur, "sz": sz}
        print(f"[tts] {bid} dur={dur}s sz={sz}", flush=True)
json.dump(res, open(BASE / "work/durations.json", "w"), indent=2)
total = sum(v["dur"] for v in res.values() if v["dur"])
print(f"[tts] total narration ~{total:.1f}s ({total/60:.2f} min)", flush=True)
