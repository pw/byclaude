#!/usr/bin/env python3
"""Typographic cards for the video. Dark, amber-accented, supersampled for crisp text."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import numpy as np

BASE = Path.home() / "byclaude/video/gunness"
FONTS = Path.home() / "byclaude/video/fonts"
data = json.load(open(BASE / "script.json"))
work = BASE / "work"; work.mkdir(exist_ok=True)

S = 2                      # supersample
W, H = 1920 * S, 1080 * S
BG_TOP, BG_BOT = (12, 15, 21), (6, 8, 12)
INK = (236, 239, 244)
MUTE = (140, 149, 165)
DIM = (78, 87, 102)
ACCENT = (242, 169, 59)    # amber
RULE = (44, 51, 64)

def F(name, size): return ImageFont.truetype(str(FONTS / name), size * S)
ANTON   = lambda s: F("Anton-Regular.ttf", s)
BLACK   = lambda s: F("Barlow-Black.ttf", s)
BOLD    = lambda s: F("Barlow-Bold.ttf", s)
SEMI    = lambda s: F("Barlow-SemiBold.ttf", s)
MED     = lambda s: F("Barlow-Medium.ttf", s)
REG     = lambda s: F("Barlow-Regular.ttf", s)
MONO    = lambda s: F("IBMPlexMono-Medium.ttf", s)
MONOSB  = lambda s: F("IBMPlexMono-SemiBold.ttf", s)

_bg_cache = None
def make_bg():
    global _bg_cache
    if _bg_cache is not None:
        return _bg_cache.copy()
    # vertical gradient
    top = np.array(BG_TOP, float); bot = np.array(BG_BOT, float)
    t = np.linspace(0, 1, H)[:, None]
    grad = (top[None, :] * (1 - t) + bot[None, :] * t)
    arr = np.repeat(grad[:, None, :], W, axis=1).astype(np.uint8)
    img = Image.fromarray(arr, "RGB")
    d = ImageDraw.Draw(img)
    # faint data grid
    step = 84 * S
    for x in range(0, W, step):
        d.line([(x, 0), (x, H)], fill=(20, 24, 32), width=1)
    for y in range(0, H, step):
        d.line([(0, y), (W, y)], fill=(20, 24, 32), width=1)
    # vignette
    yy, xx = np.mgrid[0:H, 0:W]
    cx, cy = W / 2, H / 2
    r = np.sqrt(((xx - cx) / (W / 2))**2 + ((yy - cy) / (H / 2))**2)
    vig = np.clip(1 - 0.45 * np.clip(r - 0.35, 0, 1)**1.6, 0, 1)
    img = Image.fromarray((np.asarray(img, float) * vig[:, :, None]).astype(np.uint8), "RGB")
    _bg_cache = img
    return img.copy()

def wrap(draw, text, font, maxw):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        cand = (cur + " " + w).strip()
        if draw.textlength(cand, font=font) <= maxw or not cur:
            cur = cand
        else:
            lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def tracked(draw, x, y, text, font, fill, track):
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + track * S

def furniture(draw):
    # top-left kicker
    kf = MONOSB(15)
    draw.rectangle([60 * S, 58 * S, 60 * S + 12 * S, 58 * S + 12 * S], fill=ACCENT)
    tracked(draw, 84 * S, 55 * S, "BELLE GUNNESS", kf, MUTE, 3)
    # bottom-right mark
    bf = MONO(15)
    t = "byclaude.net"
    draw.text((W - 60 * S - draw.textlength(t, font=bf), H - 74 * S), t, font=bf, fill=DIM)

def block_center(lines_spec, top_pad=0):
    """lines_spec: list of (text, font, fill, gap_below). Returns starting y to vertically center."""
    total = 0
    for (_, font, _, gap) in lines_spec:
        asc, desc = font.getmetrics()
        total += asc + desc + gap * S
    return (H - total) // 2

def render(beat):
    img = make_bg(); d = ImageDraw.Draw(img); furniture(d)
    c = beat["card"]; kind = c["kind"]; cx = W // 2

    if kind == "quote":
        head_f, acc_f = MED(64), BLACK(82)
        hl = wrap(d, c["head"], head_f, int(W * 0.78))
        al = wrap(d, c["accent"], acc_f, int(W * 0.82))
        d.rectangle([cx - 40 * S, block_y0(hl, head_f, al, acc_f) - 46 * S,
                     cx + 40 * S, block_y0(hl, head_f, al, acc_f) - 42 * S], fill=ACCENT)
        y = block_y0(hl, head_f, al, acc_f)
        for ln in hl:
            d.text((cx, y), ln, font=head_f, fill=INK, anchor="ma"); y += line_h(head_f) + 8 * S
        y += 18 * S
        for ln in al:
            d.text((cx, y), ln, font=acc_f, fill=ACCENT, anchor="ma"); y += line_h(acc_f) + 4 * S

    elif kind == "bignum":
        big_f, unit_f, sub_f = ANTON(300), MED(56), REG(40)
        sub = c.get("sub", "")
        sub_l = wrap(d, sub, sub_f, int(W * 0.7)) if sub else []
        unit_l = wrap(d, c["unit"], unit_f, int(W * 0.7))
        bh = line_h(big_f); uh = sum(line_h(unit_f) for _ in unit_l)
        sh = sum(line_h(sub_f) for _ in sub_l)
        total = sh + 28 * S + bh + 18 * S + uh
        y = (H - total) // 2
        for ln in sub_l:
            d.text((cx, y), ln, font=sub_f, fill=MUTE, anchor="ma"); y += line_h(sub_f)
        y += 28 * S
        d.text((cx, y - 18 * S), c["big"], font=big_f, fill=ACCENT, anchor="ma"); y += bh + 18 * S
        for ln in unit_l:
            d.text((cx, y), ln, font=unit_f, fill=INK, anchor="ma"); y += line_h(unit_f)

    elif kind == "stat2":
        num_f, lab_f = ANTON(168), REG(38)
        colx = [int(W * 0.29), int(W * 0.71)]
        d.line([(cx, int(H * 0.30)), (cx, int(H * 0.70))], fill=RULE, width=2 * S)
        cols = [(c["a_num"], c["a_lab"], INK), (c["b_num"], c["b_lab"], ACCENT)]
        for (num, lab, col), x in zip(cols, colx):
            d.text((x, int(H * 0.40)), num, font=num_f, fill=col, anchor="mm")
            ll = wrap(d, lab, lab_f, int(W * 0.34))
            yy = int(H * 0.55)
            for ln in ll:
                d.text((x, yy), ln, font=lab_f, fill=MUTE, anchor="ma"); yy += line_h(lab_f)

    elif kind == "stat3":
        title_f, num_f, lab_f = SEMI(52), BLACK(84), REG(38)
        rows = c["rows"]
        d.text((cx, int(H * 0.20)), c["title"], font=title_f, fill=INK, anchor="ma")
        d.line([(int(W*0.22), int(H*0.30)), (int(W*0.78), int(H*0.30))], fill=RULE, width=2*S)
        y = int(H * 0.36); numx = int(W * 0.46); labx = int(W * 0.50)
        for i, (num, lab) in enumerate(rows):
            col = ACCENT if i == len(rows) - 1 else INK
            d.text((numx, y), num, font=num_f, fill=col, anchor="ra")
            d.text((labx, y + 26 * S), lab, font=lab_f, fill=MUTE, anchor="la")
            y += int(H * 0.155)

    elif kind == "question":
        qf = SEMI(76)
        ql = wrap(d, c["head"], qf, int(W * 0.74))
        th = sum(line_h(qf) + 10 * S for _ in ql)
        y = (H - th) // 2
        d.rectangle([cx - 36*S, y - 44*S, cx + 36*S, y - 40*S], fill=ACCENT)
        for ln in ql:
            d.text((cx, y), ln, font=qf, fill=INK, anchor="ma"); y += line_h(qf) + 10 * S

    elif kind == "cta":
        head_f, url_f, sub_f = MED(58), MONOSB(62), MONO(34)
        y = int(H * 0.34)
        d.text((cx, y), c["head"], font=head_f, fill=INK, anchor="ma"); y += line_h(head_f) + 46 * S
        # url box
        uw = d.textlength(c["line1"], font=url_f)
        pad = 34 * S
        d.rectangle([cx - uw/2 - pad, y - 10*S, cx + uw/2 + pad, y + line_h(url_f) + 8*S],
                    outline=ACCENT, width=2 * S)
        d.text((cx, y), c["line1"], font=url_f, fill=ACCENT, anchor="ma"); y += line_h(url_f) + 40 * S
        d.text((cx, y), c["line2"], font=sub_f, fill=MUTE, anchor="ma")

    elif kind == "signoff":
        head_f, acc_f, by_f = MED(78), BLACK(120), MONO(34)
        total = line_h(head_f) + 6*S + line_h(acc_f)
        y = (H - total) // 2 - 20 * S
        d.text((cx, y), c["head"], font=head_f, fill=INK, anchor="ma"); y += line_h(head_f) + 6 * S
        d.text((cx, y), c["accent"], font=acc_f, fill=ACCENT, anchor="ma"); y += line_h(acc_f) + 50 * S
        d.text((cx, y), c["by"], font=by_f, fill=MUTE, anchor="ma")

    out = work / f"{beat['id']}.png"
    img.resize((1920, 1080), Image.LANCZOS).save(out)
    return out

def line_h(font):
    a, dsc = font.getmetrics(); return a + dsc

def block_y0(hl, hf, al, af):
    total = sum(line_h(hf) + 8 * S for _ in hl) + 18 * S + sum(line_h(af) + 4 * S for _ in al)
    return (H - total) // 2

if __name__ == "__main__":
    cards = [b for b in data["beats"] if b["vtype"] == "card"]
    for b in cards:
        p = render(b); print("[card]", b["id"], p.name, flush=True)
    print("[card] done", flush=True)
