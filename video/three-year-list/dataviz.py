#!/usr/bin/env python3
"""Data-viz beats (PIL, shares the card visual language): anti-join funnel + state bars."""
from pathlib import Path
from PIL import Image, ImageDraw
import cards as C

S, W, H = C.S, C.W, C.H
work = C.work

STAGES = [
    ("1,125", 1125, "in serious violation · 3 quarters"),
    ("864",    864, "minus formal cases since 2023"),
    ("480",    480, "minus any warning letter"),
    ("390",    390, "minus anyone ever taken to court"),
]

def section_label(d, text):
    f = C.MONOSB(16)
    C.tracked(d, 84 * S, 150 * S, text, f, C.MUTE, 4)

def funnel(active, done, fname):
    img = C.make_bg(); d = ImageDraw.Draw(img); C.furniture(d)
    section_label(d, "THE ANTI-JOIN")
    x0 = int(W * 0.085); maxw = int(W * 0.46)
    bh = int(H * 0.118); gap = int(H * 0.045)
    total = len(STAGES) * bh + (len(STAGES) - 1) * gap
    y = (H - total) // 2 + int(H * 0.03)
    num_f, lab_f = C.ANTON(82), C.MONO(28)
    for i, (label, val, desc) in enumerate(STAGES):
        w = int(maxw * val / 1125)
        if i in active:
            d.rounded_rectangle([x0, y, x0 + w, y + bh], radius=10 * S, fill=C.ACCENT)
            ncol, lcol = C.INK, C.INK
        elif i in done:
            d.rounded_rectangle([x0, y, x0 + w, y + bh], radius=10 * S, fill=(34, 40, 51))
            ncol, lcol = C.MUTE, C.MUTE
        else:
            d.rounded_rectangle([x0, y, x0 + w, y + bh], radius=10 * S, outline=C.RULE, width=2 * S)
            ncol, lcol = C.DIM, C.DIM
        nx = x0 + w + 36 * S
        d.text((nx, y - 4 * S), label, font=num_f, fill=ncol, anchor="la")
        d.text((nx + 4 * S, y + bh - 34 * S), desc, font=lab_f, fill=lcol, anchor="la")
        y += bh + gap
    img.resize((1920, 1080), Image.LANCZOS).save(work / fname)
    print("[viz]", fname, flush=True)

def states():
    img = C.make_bg(); d = ImageDraw.Draw(img); C.furniture(d)
    section_label(d, "WHERE THE 390 CLUSTER")
    rows = [("Missouri",77),("Louisiana",63),("West Virginia",51),("Illinois",24),
            ("Massachusetts",21),("Colorado",20),("New York",19),("Ohio",19),
            ("Pennsylvania",16),("Maryland",11)]
    maxv = 77
    barx = int(W * 0.30); maxw = int(W * 0.50)
    name_f, val_f = C.SEMI(34), C.MONOSB(34)
    top = int(H * 0.235); rh = int((H * 0.62) / len(rows))
    for i, (name, val) in enumerate(rows):
        cy = top + i * rh + rh // 2
        d.text((barx - 40 * S, cy), name, font=name_f, fill=C.INK, anchor="rm")
        w = int(maxw * val / maxv)
        bh = int(rh * 0.52)
        col = C.ACCENT if i < 3 else (52, 60, 74)
        d.rounded_rectangle([barx, cy - bh // 2, barx + w, cy + bh // 2], radius=6 * S, fill=col)
        d.text((barx + w + 26 * S, cy), str(val), font=val_f,
               fill=C.INK if i < 3 else C.MUTE, anchor="lm")
    img.resize((1920, 1080), Image.LANCZOS).save(work / "states.png")
    print("[viz] states.png", flush=True)

if __name__ == "__main__":
    funnel(active={0}, done=set(), fname="funnel1.png")
    funnel(active={1, 2}, done={0}, fname="funnel2.png")
    funnel(active={3}, done={0, 1, 2}, fname="funnel3.png")
    states()
    print("[viz] done", flush=True)
