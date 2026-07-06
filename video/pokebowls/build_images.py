#!/usr/bin/env python3
"""Generate the 'still' beats via gpt-image-2 (parallel)."""
import json, subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

BASE = Path.home() / "byclaude/video/pokebowls"
GEN = Path.home() / ".claude/skills/ai-image-generation/generate-image.js"
data = json.load(open(BASE / "script.json"))
grade = data["grade"]
imgdir = BASE / "images"; imgdir.mkdir(exist_ok=True)

def run(b):
    out = imgdir / f"{b['id']}.png"
    if out.exists() and out.stat().st_size > 50000:
        return (b['id'], 'skip (exists)')
    prompt = b["img"] + " " + grade
    r = subprocess.run(["node", str(GEN), prompt, "--ratio", "16:9", "--out", str(out)],
                       capture_output=True, text=True)
    ok = out.exists() and out.stat().st_size > 50000
    return (b['id'], 'ok' if ok else f"FAIL: {r.stdout[-150:]} {r.stderr[-200:]}")

stills = [b for b in data["beats"] if b["vtype"] == "still"]
print(f"[img] {len(stills)} stills → {imgdir}", flush=True)
with ThreadPoolExecutor(max_workers=5) as ex:
    for res in ex.map(run, stills):
        print("[img]", res, flush=True)
print("[img] done", flush=True)
