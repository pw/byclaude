#!/usr/bin/env python3
"""Vertical short-form (1080x1920) from existing stills: brand frame + still band + big caption + onyx VO.
Usage: python3 build_short.py <script.json>"""
import json, re, subprocess, sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw, ImageFont
import numpy as np

VID = Path.home() / "byclaude/video"
FONTS = VID / "fonts"
SH = VID / "sawmillbridge"  # isolated: this build stays entirely inside its own directory, never touches shorts/
spec = json.load(open(sys.argv[1]))
BASE = SH / spec["out"]; BASE.mkdir(parents=True, exist_ok=True)
for sub in ("audio", "frames", "clips"): (BASE / sub).mkdir(exist_ok=True)
keytext = (Path.home() / ".config/api-keys/keys.env").read_text()
OKEY = re.search(r'^export OPENAI_API_KEY=(.+)$', keytext, re.M).group(1).strip().strip('"')

W, H = 1080, 1920
BG = (11, 14, 19); AMBER = (242, 169, 59); INK = (236, 239, 244)
GRID = (26, 30, 40); MUTE = (140, 149, 165); DIM = (78, 87, 102)
def F(n, s): return ImageFont.truetype(str(FONTS / n), s)
def fit(d, t, fn, maxw, start, floor=46):
    s = start
    while s > floor:
        f = F(fn, s)
        if max(d.textlength(ln, font=f) for ln in t.split("\n")) <= maxw: return f
        s -= 3
    return F(fn, floor)

def bg_frame():
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    step = W // 9
    for x in range(0, W, step): d.line([(x, 0), (x, H)], fill=GRID, width=1)
    for y in range(0, H, step): d.line([(0, y), (W, y)], fill=GRID, width=1)
    yy, xx = np.mgrid[0:H, 0:W]; cx, cy = W / 2, H / 2
    r = np.sqrt(((xx - cx) / (W / 2))**2 + ((yy - cy) / (H / 2))**2)
    vig = np.clip(1 - 0.5 * np.clip(r - 0.2, 0, 1)**1.6, 0, 1)
    return Image.fromarray((np.asarray(img, float) * vig[:, :, None]).astype(np.uint8), "RGB")

def kicker(d):
    d.rectangle([70, 86, 92, 108], fill=AMBER)
    f = F("IBMPlexMono-SemiBold.ttf", 28); x = 108
    for ch in ("BY CLAUDE  ·  " + spec["kicker"]):
        d.text((x, 82), ch, font=f, fill=MUTE); x += d.textlength(ch, font=f) + 3

def compose(beat, idx):
    img = bg_frame(); d = ImageDraw.Draw(img); kicker(d)
    cap_y = int(H * 0.40)
    if beat.get("img"):
        still = Image.open(VID / beat["src"] / "images" / (beat["img"] + ".png")).convert("RGB")
        bh = int(W * still.height / still.width)
        still = still.resize((W, bh))
        by = 300; img.paste(still, (0, by))
        d = ImageDraw.Draw(img)
        d.rectangle([0, by, W - 1, by + bh - 1], outline=(40, 46, 58), width=2)
        cap_y = by + bh + 100
    cap = beat.get("cap", "")
    if cap:
        f = fit(d, cap, "Anton-Regular.ttf", W - 130, start=130)
        col = AMBER if beat.get("amber") else INK
        y = cap_y
        for ln in cap.split("\n"):
            d.text((W // 2, y), ln, font=f, fill=col, anchor="ma"); y += int(f.size * 1.04)
    d.text((W // 2, H - 96), "byclaude.net", font=F("IBMPlexMono-Medium.ttf", 28), fill=DIM, anchor="ma")
    out = BASE / "frames" / f"{idx:02d}.png"; img.save(out); return out

def tts(beat, idx):
    out = BASE / "audio" / f"{idx:02d}.mp3"
    payload = json.dumps({"model": "gpt-4o-mini-tts", "voice": spec["voice"], "input": beat["vo"], "instructions": spec["voice_instructions"]})
    # generate up to 2x; verify each via whisper transcription (catches silent TTS truncation)
    last_reason = ''
    for attempt in (1, 2):
        subprocess.run(["curl", "-s", "https://api.openai.com/v1/audio/speech", "-H", f"Authorization: Bearer {OKEY}",
                        "-H", "Content-Type: application/json", "-d", payload, "-o", str(out)], capture_output=True)
        dur = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(out)], capture_output=True, text=True)
        if out.stat().st_size < 1000:
            last_reason = 'tts-empty-file'; continue
        v = verify_tts(out, beat["vo"])
        if v[0] in ('ok', 'unknown'):
            tag = '' if attempt == 1 else f' (recovered on retry {attempt}: {v[1]})'
            print(f"[tts] beat {idx}: {v[0]}{tag}", flush=True)
            return idx, round(float(dur.stdout.strip()), 3)
        last_reason = v[1]
        if attempt == 1:
            print(f"[tts] beat {idx}: VERIFY-FAIL ({v[1]}) -- retrying. expected={beat['vo']!r} got={v[2]!r}", flush=True)
    # still failing after retry -- proceed but warn loudly (operator's call, not a hard block)
    print(f"[tts] beat {idx}: *** STILL FAILING after retry ({last_reason}); using best attempt ***", flush=True)
    print(f"    expected: {beat['vo']!r}", flush=True)
    print(f"    got:      {v[2]!r}", flush=True)
    return idx, round(float(dur.stdout.strip()), 3)

def verify_tts(audio_path, expected):
    """Returns (status, reason, transcript). status in {'ok','fail','unknown'}.
    Hard check: last content word of script must appear in transcript (catches truncation).
    Soft check: word overlap >= 0.6 (catches drift). whisper failure = 'unknown' (don't block)."""
    import re, urllib.request
    try:
        with open(audio_path, 'rb') as f: data = f.read()
        boundary = '----verifyboundary'
        body = f'--{boundary}\r\nContent-Disposition: form-data; name="model"\r\n\r\nwhisper-1\r\n'.encode()
        body += f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n'.encode()
        body += data + b'\r\n--' + boundary.encode() + b'--\r\n'
        req = urllib.request.Request('https://api.openai.com/v1/audio/transcriptions', data=body,
                                     headers={'Authorization': f'Bearer {OKEY}', 'Content-Type': f'multipart/form-data; boundary={boundary}'})
        transcript = json.loads(urllib.request.urlopen(req, timeout=30).read())['text']
    except Exception as e:
        return ('unknown', f'whisper-fail: {e}', '')
    n = lambda s: re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9 ]', ' ', s.lower())).strip()
    e = n(expected); a = n(transcript)
    if not a: return ('fail', 'empty-transcript', transcript)
    e_content = [w for w in e.split() if len(w) > 2]
    if not e_content: return ('ok', 'no-checkable-words', transcript)
    last = e_content[-1]
    if last not in a.split():
        return ('fail', f'last-word-missing:{last!r}', transcript)
    e_set, a_set = set(e_content), set(w for w in a.split() if len(w) > 2)
    overlap = len(e_set & a_set) / len(e_set)
    if overlap < 0.6:
        return ('fail', f'overlap-{overlap:.0%}-below-60%', transcript)
    return ('ok', f'{overlap:.0%}-overlap', transcript)

beats = spec["beats"]
durs = {}
with ThreadPoolExecutor(max_workers=6) as ex:
    for idx, dur in ex.map(lambda a: tts(*a), [(b, i) for i, b in enumerate(beats)]): durs[idx] = dur
for i, b in enumerate(beats): compose(b, i)

TAIL = 0.35; FPS = 30
def clip(i):
    dur = durs[i] + TAIL; frames = round(dur * FPS)
    z = "z='min(zoom+0.0006,1.08)'" if i % 2 == 0 else "z='if(lte(on,1),1.08,max(zoom-0.0006,1.0))'"
    zp = f"zoompan={z}:d={frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={W}x{H}:fps={FPS}"
    out = BASE / "clips" / f"{i:02d}.mp4"
    cmd = ["ffmpeg", "-y", "-loop", "1", "-i", str(BASE / "frames" / f"{i:02d}.png"), "-i", str(BASE / "audio" / f"{i:02d}.mp3"),
           "-filter_complex", f"[0:v]{zp}[v];[1:a]apad[a]", "-map", "[v]", "-map", "[a]", "-t", str(dur),
           "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(FPS), "-crf", "20", "-preset", "medium",
           "-c:a", "aac", "-ar", "48000", "-b:a", "192k", str(out)]
    subprocess.run(cmd, capture_output=True); return out

with ThreadPoolExecutor(max_workers=4) as ex: list(ex.map(clip, range(len(beats))))
listf = BASE / "concat.txt"; listf.write_text("".join(f"file '{BASE/'clips'/(f'{i:02d}.mp4')}'\n" for i in range(len(beats))))
total = sum(durs[i] + TAIL for i in range(len(beats)))
final = SH / (spec["out"] + ".mp4")
vf = f"fade=t=in:st=0:d=0.4,fade=t=out:st={max(0.1,total-0.8):.2f}:d=0.8"
af = f"afade=t=in:st=0:d=0.3,afade=t=out:st={max(0.1,total-0.8):.2f}:d=0.8,loudnorm=I=-14:TP=-1.5:LRA=11"
subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listf), "-vf", vf, "-af", af,
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(FPS), "-crf", "19", "-preset", "medium",
                "-c:a", "aac", "-ar", "48000", "-b:a", "192k", "-movflags", "+faststart", str(final)], capture_output=True)
print(f"{spec['out']}: {total:.1f}s -> {final}")
