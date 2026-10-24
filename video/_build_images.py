#!/usr/bin/env python3
"""Generate the 'still' beats via gpt-image-2 (kie.ai backend). Usage: python3 build_images.py <dir>"""
import json, subprocess, sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

BASE = Path.home() / "byclaude/video" / sys.argv[1]
GEN = Path.home() / ".claude/skills/ai-image-generation/generate-image.js"
data = json.load(open(BASE / "script.json"))
grade = data["grade"]
# optional 2nd arg "9:16" = full-bleed vertical stills for the Still Unsolved `frame` arm -> images916/
RATIO = sys.argv[2] if len(sys.argv) > 2 else "16:9"
imgdir = BASE / ("images916" if RATIO == "9:16" else "images"); imgdir.mkdir(exist_ok=True)
VERT = " Vertical portrait composition, subject in the middle third, quiet dark lower third." if RATIO == "9:16" else ""

def run(b):
    if b.get("vtype") != "still": return (b['id'], 'skip (not still)')
    out = imgdir / f"{b['id']}.png"
    if out.exists() and out.stat().st_size > 50000:
        return (b['id'], 'skip (exists)')
    prompt = b["img"] + VERT + " " + grade
    r = subprocess.run(["node", str(GEN), prompt, "--ratio", RATIO, "--out", str(out)],
                       capture_output=True, text=True)
    ok = out.exists() and out.stat().st_size > 50000
    return (b['id'], 'ok' if ok else f"FAIL: {r.stdout[-200:]} {r.stderr[-200:]}")

stills = [b for b in data["beats"] if b.get("vtype") == "still" and "img" in b]
print(f"[img:{sys.argv[1]}] {len(stills)} stills -> {imgdir}", flush=True)
with ThreadPoolExecutor(max_workers=5) as ex:
    for res in ex.map(run, stills):
        print(f"[img:{sys.argv[1]}]", res, flush=True)
print(f"[img:{sys.argv[1]}] done", flush=True)
