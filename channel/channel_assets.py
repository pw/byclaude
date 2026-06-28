#!/usr/bin/env python3
"""By Claude channel assets — banner, watermark, thumbnail. Exact video design system."""
from PIL import Image, ImageDraw, ImageFont
import numpy as np
from pathlib import Path

FONTS = Path.home() / "byclaude/video/fonts"
CH = Path.home() / "byclaude/channel"; CH.mkdir(exist_ok=True)
STILLS = Path.home() / "byclaude/video/slurry/images"
BG = (11, 14, 19); AMBER = (242, 169, 59); INK = (236, 239, 244)
GRID = (26, 30, 40); MUTE = (140, 149, 165); DIM = (78, 87, 102)

def F(n, s): return ImageFont.truetype(str(FONTS / n), s)

def fit(d, text, fontname, maxw, start=170, floor=40):
    s = start
    while s > floor:
        f = F(fontname, s)
        if d.textlength(text, font=f) <= maxw: return f
        s -= 3
    return F(fontname, floor)

def grid_vig(W, H, vig=0.5):
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    step = max(W, H) // 16
    for x in range(0, W, step): d.line([(x, 0), (x, H)], fill=GRID, width=1)
    for y in range(0, H, step): d.line([(0, y), (W, y)], fill=GRID, width=1)
    yy, xx = np.mgrid[0:H, 0:W]; cx, cy = W / 2, H / 2
    r = np.sqrt(((xx - cx) / (W / 2))**2 + ((yy - cy) / (H / 2))**2)
    v = np.clip(1 - vig * np.clip(r - 0.25, 0, 1)**1.6, 0, 1)
    return Image.fromarray((np.asarray(img, float) * v[:, :, None]).astype(np.uint8), "RGB")

# BANNER 2048x1152 — keep all text inside the center 1235x338 safe band (y 407..745)
def banner():
    W, H = 2048, 1152; img = grid_vig(W, H, 0.55); d = ImageDraw.Draw(img)
    cx, cy = W // 2, H // 2
    sq = 44; d.rectangle([cx - sq/2, cy - 150, cx + sq/2, cy - 150 + sq], fill=AMBER)
    d.text((cx, cy - 95), "BY CLAUDE", font=F("Anton-Regular.ttf", 150), fill=INK, anchor="ma")
    d.text((cx, cy + 72), "An AI that read the whole case file.", font=F("Barlow-Medium.ttf", 56), fill=AMBER, anchor="ma")
    d.text((cx, cy + 150), "dark, true documentary   ·   byclaude.net", font=F("IBMPlexMono-Medium.ttf", 32), fill=MUTE, anchor="ma")
    img.save(CH / "banner.png")

# WATERMARK 300x300 transparent — BC monogram (matches avatar B)
def watermark():
    img = Image.new("RGBA", (300, 300), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    d.text((150, 150), "BC", font=F("Anton-Regular.ttf", 150), fill=AMBER + (255,), anchor="mm")
    img.save(CH / "watermark.png")

# THUMBNAIL 1280x720 — darkened grey-town still + bold text
def thumbnail():
    W, H = 1280, 720
    base = Image.open(STILLS / "B01.png").convert("RGB").resize((W, H))
    base = Image.fromarray((np.asarray(base, float) * 0.42).astype(np.uint8))
    d = ImageDraw.Draw(base, "RGBA")
    for y in range(H):  # bottom scrim
        a = int(170 * max(0, (y - H * 0.30) / (H * 0.70)))
        d.line([(0, y), (W, y)], fill=(4, 6, 9, a))
    d.rectangle([60, 56, 82, 78], fill=AMBER)
    d.text((96, 54), "THE NATIONAL DAM RECORD", font=F("IBMPlexMono-SemiBold.ttf", 30), fill=MUTE)
    white = fit(d, "I READ ALL 91,678 DAMS", "Anton-Regular.ttf", W - 120, start=72)
    d.text((60, 346), "I READ ALL 91,678 DAMS", font=white, fill=INK)
    a = fit(d, "SAFETY RECORD", "Anton-Regular.ttf", W - 120, start=118)
    d.text((60, 430), "21 HAVE NO", font=a, fill=AMBER)
    d.text((60, 556), "SAFETY RECORD", font=a, fill=AMBER)
    base.save(CH / "thumbnail.png")

for fn in (banner, watermark, thumbnail): fn()
print("wrote banner.png, watermark.png, thumbnail.png to", CH)
