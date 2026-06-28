#!/usr/bin/env python3
"""Assemble the final video: per-beat Ken-Burns clips (+ captions on stills) → concat → fades."""
import json, subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw
import cards as C

BASE = Path.home() / "byclaude/video/isdal"
data = json.load(open(BASE / "script.json"))
durs = json.load(open(BASE / "work/durations.json"))
clips = BASE / "clips"; clips.mkdir(exist_ok=True)
caps = BASE / "work/caps"; caps.mkdir(exist_ok=True, parents=True)
FPS = 30; TAIL = 0.5

def asset(b):
    if b["vtype"] == "still": return BASE / "images" / f"{b['id']}.png"
    if b["vtype"] == "viz":   return BASE / "work" / f"{b['viz']}.png"
    return BASE / "work" / f"{b['id']}.png"

def make_caption(b):
    """Full-frame RGBA: bottom scrim + caption text + brand furniture. Stills only —
    viz/cards carry their own baked text, so captioning them double-stacks furniture."""
    if b["vtype"] != "still":
        return None
    text = b.get("cap")
    if not text: return None
    W, H, S = C.W, C.H, C.S
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    y0 = int(H * 0.58)
    for y in range(y0, H):
        a = int(205 * ((y - y0) / (H - y0)) ** 1.35)
        d.line([(0, y), (W, y)], fill=(4, 6, 9, a))
    C.furniture(d)
    f = C.MED(42)
    lines = C.wrap(d, text, f, int(W * 0.80))
    lh = C.line_h(f) + 8 * S
    th = lh * len(lines)
    ty = int(H * 0.90) - th
    cx = W // 2
    d.rectangle([cx - 34 * S, ty - 30 * S, cx + 34 * S, ty - 26 * S], fill=C.ACCENT)
    for ln in lines:
        d.text((cx, ty), ln, font=f, fill=(238, 241, 246), anchor="ma"); ty += lh
    out = caps / f"{b['id']}.png"
    img.resize((1920, 1080), Image.LANCZOS).save(out)
    return out

def build_clip(args):
    idx, b = args
    bid = b["id"]; dur = durs[bid]["dur"]; clip = round(dur + TAIL, 3)
    frames = round(clip * FPS)
    img = asset(b); cap = make_caption(b)
    vt = b["vtype"]
    if vt == "still":
        if idx % 2 == 0:
            z = "z='min(zoom+0.0009,1.10)'"
        else:
            z = "z='if(lte(on,1),1.10,max(zoom-0.0009,1.0))'"
    else:
        z = "z='min(zoom+0.00035,1.045)'"
    zp = (f"zoompan={z}:d={frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
          f":s=1920x1080:fps={FPS}")
    out = clips / f"{bid}.mp4"
    ins = ["-loop", "1", "-i", str(img)]
    if cap:
        ins += ["-i", str(cap)]
        ai = 2
        fc = f"[0:v]{zp}[kb];[kb][1:v]overlay=0:0[v];[{ai}:a]apad[a]"
    else:
        ai = 1
        fc = f"[0:v]{zp}[v];[{ai}:a]apad[a]"
    ins += ["-i", str(BASE / "audio" / f"{bid}.mp3")]
    cmd = ["ffmpeg", "-y", *ins, "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
           "-t", str(clip), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(FPS),
           "-crf", "20", "-preset", "medium", "-c:a", "aac", "-ar", "48000", "-b:a", "192k",
           "-movflags", "+faststart", str(out)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    ok = out.exists() and out.stat().st_size > 10000
    return (bid, clip, "ok" if ok else f"FAIL {r.stderr[-300:]}")

beats = data["beats"]
print(f"[vid] building {len(beats)} clips", flush=True)
total = 0.0
with ThreadPoolExecutor(max_workers=4) as ex:
    for bid, clip, st in ex.map(build_clip, list(enumerate(beats))):
        total += clip
        print(f"[vid] {bid} {clip}s {st}", flush=True)

# concat list in beat order
listf = BASE / "work/concat.txt"
listf.write_text("".join(f"file '{clips / (b['id']+'.mp4')}'\n" for b in beats))
final = BASE / "isdal.mp4"
fout = max(0.1, total - 1.3)
vf = f"fade=t=in:st=0:d=0.8,fade=t=out:st={fout:.2f}:d=1.3"
af = f"loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.5,afade=t=out:st={fout:.2f}:d=1.3"
cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listf),
       "-vf", vf, "-af", af, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(FPS),
       "-crf", "19", "-preset", "medium", "-c:a", "aac", "-ar", "48000", "-b:a", "192k",
       "-movflags", "+faststart", str(final)]
r = subprocess.run(cmd, capture_output=True, text=True)
print(f"[vid] concat {'ok' if final.exists() else 'FAIL'}: {r.stderr[-300:] if not final.exists() else ''}", flush=True)
print(f"[vid] total ~{total:.1f}s ({total/60:.2f} min) → {final}", flush=True)
