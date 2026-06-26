#!/usr/bin/env python3
"""By Claude channel avatar — 3 directions, exact video design system (dark + amber)."""
from PIL import Image, ImageDraw, ImageFont
import numpy as np
from pathlib import Path

FONTS = Path.home() / "byclaude/video/fonts"
OUT = Path.home() / "byclaude/channel"; OUT.mkdir(exist_ok=True)
S = 1024
BG = (11, 14, 19); AMBER = (242, 169, 59); INK = (236, 239, 244)
GRID = (26, 30, 40); MUTE = (140, 149, 165)

def F(name, size): return ImageFont.truetype(str(FONTS / name), size)

def base(grid=True):
    img = Image.new("RGB", (S, S), BG); d = ImageDraw.Draw(img)
    if grid:
        step = S // 12
        for x in range(0, S, step): d.line([(x, 0), (x, S)], fill=GRID, width=1)
        for y in range(0, S, step): d.line([(0, y), (0 + S, y)], fill=GRID, width=1) if False else d.line([(0, y), (S, y)], fill=GRID, width=1)
    yy, xx = np.mgrid[0:S, 0:S]; cx = cy = S / 2
    r = np.sqrt(((xx - cx) / (S / 2))**2 + ((yy - cy) / (S / 2))**2)
    vig = np.clip(1 - 0.55 * np.clip(r - 0.25, 0, 1)**1.6, 0, 1)
    return Image.fromarray((np.asarray(img, float) * vig[:, :, None]).astype(np.uint8), "RGB")

def circ_guide(d):
    # faint guide showing the circular crop YouTube applies (not saved into final use, just for review)
    pass

# A — amber square + BY/CLAUDE stacked wordmark (the video furniture, hero-scaled)
def optA():
    img = base(); d = ImageDraw.Draw(img)
    f = F("Anton-Regular.ttf", 168)
    sq = 80
    d.rectangle([S/2 - sq/2, S*0.20, S/2 + sq/2, S*0.20 + sq], fill=AMBER)
    d.text((S/2, S*0.36), "BY", font=f, fill=INK, anchor="ma")
    d.text((S/2, S*0.36 + 182), "CLAUDE", font=f, fill=AMBER, anchor="ma")
    img.save(OUT / "avatar_A.png")

# B — BC monogram (bold, reads at any size)
def optB():
    img = base(); d = ImageDraw.Draw(img)
    f = F("Anton-Regular.ttf", 460)
    d.text((S/2, S/2 - 10), "BC", font=f, fill=AMBER, anchor="mm")
    img.save(OUT / "avatar_B.png")

# C — minimalist: oversized amber square (the kicker mark) as the whole identity
def optC():
    img = base(); d = ImageDraw.Draw(img)
    sq = 300
    d.rectangle([S/2 - sq/2, S/2 - sq/2 - 30, S/2 + sq/2, S/2 + sq/2 - 30], fill=AMBER)
    f = F("IBMPlexMono-SemiBold.ttf", 40)
    d.text((S/2, S*0.70), "BY CLAUDE", font=f, fill=MUTE, anchor="ma")
    img.save(OUT / "avatar_C.png")

for fn in (optA, optB, optC): fn()
print("wrote avatar_A/B/C.png to", OUT)
