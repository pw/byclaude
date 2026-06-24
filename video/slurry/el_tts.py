#!/usr/bin/env python3
"""Render narration per beat via ElevenLabs (quality voice). Mirrors build_tts.py's
outputs exactly (audio/<id>.mp3 + work/durations.json) so build_video.py runs unchanged.

Usage:  ELEVENLABS_API_KEY=... python3 el_tts.py <voice>
  <voice> = a name from VOICES below (brian|george|daniel|bill|river) OR a raw voice_id.
Then:   python3 build_video.py   # re-assembles with the new narration
"""
import os, sys, json, subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

BASE = Path.home() / "byclaude/video/slurry"
KEY = os.environ["ELEVENLABS_API_KEY"]
data = json.load(open(BASE / "script.json"))
adir = BASE / "audio"; adir.mkdir(exist_ok=True)
(BASE / "work").mkdir(exist_ok=True)

# staged candidates (id, note) — same set as the three-year-list voice picker
VOICES = {
    "brian":  "nPczCjzI2devNBz1zQrb",   # deep, resonant — classic doc narrator
    "george": "JBFqnCBsd6RMkjVDRZzb",   # warm British storyteller
    "daniel": "onwK4e9ZLuTAKqWW03F9",   # steady British broadcaster
    "bill":   "pqHfZKP75CvOlQylNhV4",   # mature, gravitas
    "river":  "SAz9YHcvj6GT2YYXdXww",   # neutral/synthetic — leans into the AI framing
}
# match the staged sample settings so Patrick's pick is faithful to what he heard.
# (can dial stability down / style up afterward for more uncanny edge on the dark register.)
SETTINGS = {"stability": 0.5, "similarity_boost": 0.8, "style": 0.15, "use_speaker_boost": True}
MODEL = "eleven_multilingual_v2"

if len(sys.argv) < 2:
    sys.exit(f"usage: el_tts.py <voice>   names={list(VOICES)} or a raw voice_id")
arg = sys.argv[1].strip()
vid = VOICES.get(arg, arg)
vname = arg if arg in VOICES else f"id:{arg[:8]}"

def render(b):
    out = adir / f"{b['id']}.mp3"
    payload = json.dumps({"text": b["vo"], "model_id": MODEL, "voice_settings": SETTINGS})
    subprocess.run(["curl", "-s",
        f"https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_128",
        "-H", f"xi-api-key: {KEY}", "-H", "Content-Type: application/json",
        "-d", payload, "-o", str(out)], capture_output=True, text=True)
    sz = out.stat().st_size if out.exists() else 0
    bad = sz < 3000 or (sz and out.read_bytes()[:1] == b"{")   # JSON body = API error
    d = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", str(out)], capture_output=True, text=True)
    try: dur = round(float(d.stdout.strip()), 3)
    except Exception: dur = None
    return (b['id'], dur, sz, bad)

res = {}; fails = []
print(f"[el] {len(data['beats'])} beats, voice={vname}", flush=True)
with ThreadPoolExecutor(max_workers=4) as ex:
    for bid, dur, sz, bad in ex.map(render, data["beats"]):
        res[bid] = {"dur": dur, "sz": sz}
        if bad: fails.append(bid)
        print(f"[el] {bid} dur={dur}s sz={sz}{'  ⚠ FAIL' if bad else ''}", flush=True)
json.dump(res, open(BASE / "work/durations.json", "w"), indent=2)
total = sum(v["dur"] for v in res.values() if v["dur"])
print(f"[el] total ~{total:.1f}s ({total/60:.2f} min) · ~{sum(len(b['vo']) for b in data['beats'])} credits", flush=True)
if fails: sys.exit(f"[el] FAILED beats: {fails} — check key/quota; durations.json may be partial")
