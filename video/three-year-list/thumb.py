#!/usr/bin/env python3
"""YouTube thumbnail: archive still + the design system, high-contrast."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import cards as C

BASE = Path.home() / "byclaude/video/three-year-list"
sc = 2; W, H = 1280 * sc, 720 * sc
F = lambda n, s: ImageFont.truetype(str(C.FONTS / n), s * sc)
AMBER = (242, 169, 59); INK = (240, 243, 248); MUTE = (150, 159, 175)

base = Image.open(BASE / "images/B01.png").convert("RGB").resize((W, H), Image.LANCZOS)
base = Image.fromarray((np.asarray(base, float) * 0.84).astype("uint8"), "RGB")
# left scrim for text legibility
scrim = Image.new("L", (W, H), 0); sd = ImageDraw.Draw(scrim)
for x in range(W):
    sd.line([(x, 0), (x, H)], fill=int(225 * max(0, 1 - x / (W * 0.64)) ** 1.2))
base = Image.composite(Image.new("RGB", (W, H), (4, 6, 9)), base, scrim)
# bottom scrim
bs = Image.new("L", (W, H), 0); bd = ImageDraw.Draw(bs)
y0 = int(H * 0.66)
for y in range(y0, H):
    bd.line([(0, y), (W, y)], fill=int(210 * ((y - y0) / (H - y0))))
base = Image.composite(Image.new("RGB", (W, H), (4, 6, 9)), base, bs)

d = ImageDraw.Draw(base); mx = int(W * 0.055)
d.rectangle([mx, int(H*0.085), mx + 16*sc, int(H*0.085) + 16*sc], fill=AMBER)
C.tracked(d, mx + 30*sc, int(H*0.08), "BY CLAUDE", F("IBMPlexMono-SemiBold.ttf", 22), MUTE, 4)
C.tracked(d, mx + 4*sc, int(H*0.155), "AN AI READ 8,000,000 EPA RECORDS", F("IBMPlexMono-Medium.ttf", 26), AMBER, 2)
d.text((mx - 6*sc, int(H*0.235)), "390", font=F("Anton-Regular.ttf", 300), fill=AMBER)
hl = F("Barlow-Black.ttf", 80)
d.text((mx, int(H*0.70)), "FLAGGED,", font=hl, fill=INK)
d.text((mx, int(H*0.70) + 92*sc), "THEN IGNORED.", font=hl, fill=INK)

out = BASE / "thumbnail.png"
base.resize((1280, 720), Image.LANCZOS).save(out)
print("[thumb]", out)
