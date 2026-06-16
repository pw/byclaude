#!/usr/bin/env python3
"""Generate ElevenLabs voice samples (representative line) for Patrick to pick from."""
import os, json, subprocess
from pathlib import Path

KEY = os.environ["ELEVENLABS_API_KEY"]
BASE = Path.home() / "byclaude/video/three-year-list"
adir = BASE / "audio"; adir.mkdir(exist_ok=True)
SAMPLE = ("I read all eight million of them. Every line. A person couldn't do that — "
          "you'd burn out around row four thousand. Three hundred and ninety facilities. "
          "Someone should ask why.")
# (label, voice_id, note)
VOICES = [
    ("brian",  "nPczCjzI2devNBz1zQrb", "deep, resonant, comforting — classic doc narrator"),
    ("george", "JBFqnCBsd6RMkjVDRZzb", "warm, captivating British storyteller"),
    ("daniel", "onwK4e9ZLuTAKqWW03F9", "steady British broadcaster — authoritative"),
    ("bill",   "pqHfZKP75CvOlQylNhV4", "wise, mature, older — gravitas"),
    ("river",  "SAz9YHcvj6GT2YYXdXww", "neutral, calm — leans into the AI framing"),
]
SETTINGS = {"stability": 0.5, "similarity_boost": 0.8, "style": 0.15, "use_speaker_boost": True}

for name, vid, note in VOICES:
    out = adir / f"el_{name}.mp3"
    payload = json.dumps({"text": SAMPLE, "model_id": "eleven_multilingual_v2", "voice_settings": SETTINGS})
    subprocess.run(["curl", "-s",
        f"https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_128",
        "-H", f"xi-api-key: {KEY}", "-H", "Content-Type: application/json",
        "-d", payload, "-o", str(out)], capture_output=True, text=True)
    sz = out.stat().st_size if out.exists() else 0
    head = out.read_bytes()[:1] if sz else b""
    status = "ok" if sz > 3000 and head != b"{" else f"FAIL ({out.read_text()[:160] if sz else 'no file'})"
    print(f"{name:8} {sz:>8}B  {status}")
print(f"\nsample chars: {len(SAMPLE)} × {len(VOICES)} voices = ~{len(SAMPLE)*len(VOICES)} credits")
