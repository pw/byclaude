#!/usr/bin/env python3
"""Thumbnails for the true-crime pair — darkened still + bold text, byclaude design system."""
from PIL import Image, ImageDraw, ImageFont
import numpy as np
from pathlib import Path

FONTS = Path.home() / "byclaude/video/fonts"
CH = Path.home() / "byclaude/channel"
AMBER = (242, 169, 59); INK = (236, 239, 244); MUTE = (150, 159, 175)

def F(n, s): return ImageFont.truetype(str(FONTS / n), s)

def fit(d, t, fn, maxw, start, floor=40):
    s = start
    while s > floor:
        f = F(fn, s)
        if d.textlength(t, font=f) <= maxw: return f
        s -= 3
    return F(fn, floor)

def thumb(still, kicker, white, amber, out):
    W, H = 1280, 720
    base = Image.open(still).convert("RGB").resize((W, H))
    base = Image.fromarray((np.asarray(base, float) * 0.40).astype(np.uint8))
    d = ImageDraw.Draw(base, "RGBA")
    for y in range(H):
        a = int(180 * max(0, (y - H * 0.26) / (H * 0.74)))
        d.line([(0, y), (W, y)], fill=(4, 6, 9, a))
    d.rectangle([60, 56, 82, 78], fill=AMBER)
    d.text((96, 54), kicker, font=F("IBMPlexMono-SemiBold.ttf", 30), fill=MUTE)
    fw = fit(d, white, "Anton-Regular.ttf", W - 120, start=70)
    d.text((60, H - 300), white, font=fw, fill=INK)
    fa = fit(d, amber, "Anton-Regular.ttf", W - 120, start=124)
    d.text((60, H - 215), amber, font=fa, fill=AMBER)
    base.save(out); print("wrote", out.name)

V = Path.home() / "byclaude/video"
thumb(V / "shipman/images/B03.png", "HAROLD SHIPMAN", "THE FAMILY DOCTOR", "WHO KILLED 215", CH / "thumb-shipman.png")
thumb(V / "hinterkaifeck/images/B03.png", "HINTERKAIFECK · 1922", "SIX MURDERED. UNSOLVED.", "THE KILLER STAYED", CH / "thumb-hinterkaifeck.png")
thumb(V / "isdal/images/B01.png", "THE ISDAL WOMAN · 1970", "SHE ERASED", "EVERY TRACE OF HERSELF", CH / "thumb-isdal.png")
thumb(V / "gunness/images/B01.png", "BELLE GUNNESS · 1908", "A DOZEN MEN", "NEVER LEFT THAT FARM", CH / "thumb-gunness.png")
