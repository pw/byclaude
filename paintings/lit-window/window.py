"""Lit Window — a painting, stroke by stroke.
No image model, no reference. A scene function says what colour the world is
at each point; then a few hundred thousand bristle strokes go down, coarse to fine,
each one following the grain of the scene."""
import math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 1800, 1200
rng = np.random.default_rng(7)
random.seed(7)

def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)

def noise(scale, octaves=4, seed=0):
    r = np.random.default_rng(seed)
    out = np.zeros((H, W))
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        s = max(2, int(scale / (2 ** o)))
        g = r.random((H // s + 2, W // s + 2))
        img = Image.fromarray((g * 255).astype(np.uint8)).resize((W + 2 * s, H + 2 * s), Image.BICUBIC)
        out += amp * (np.asarray(img, float)[:H, :W] / 255.0)
        tot += amp; amp *= 0.5
    return out / tot

yy, xx = np.mgrid[0:H, 0:W].astype(float)
u, v = xx / W, yy / H

# ---------------- the scene ----------------
horizon = 0.62 + 0.015 * np.sin(u * 5.0) + 0.01 * (noise(300, 3, 1) - 0.5)
sky = v < horizon

# sky: deep prussian at top, toward a bruised violet-grey near the horizon, faint warmth far left (town glow)
top = np.array([10, 16, 38.]); mid = np.array([30, 40, 78.]); low = np.array([78, 76, 104.])
t = np.clip(v / 0.62, 0, 1)[..., None]
col = np.where(t < 0.6, top + (mid - top) * (t / 0.6), mid + (low - mid) * ((t - 0.6) / 0.4))
glow = np.exp(-(((u - 0.08) / 0.25) ** 2 + ((v - 0.6) / 0.12) ** 2))[..., None]
col = col + glow * np.array([60, 38, 20.])
cloud = noise(260, 5, 2)
col = col + ((cloud - 0.5) * 38)[..., None] * smoothstep(0.1, 0.55, v)[..., None]

# far mountains: a low ragged band, barely lighter than sky, snow-touched
ridge = 0.555 + 0.035 * noise(180, 4, 3)[0][None, :].repeat(H, 0) * 1.0
ridge = 0.545 + 0.05 * (noise(220, 5, 3) * 0 + np.interp(u, np.linspace(0, 1, 40), rng.random(40) * 0.6 + np.sin(np.linspace(0, 6, 40)) * 0.2))
mtn = (v > ridge) & sky
col = np.where(mtn[..., None], np.array([52, 56, 88.]) + ((noise(40, 3, 4) - 0.5) * 30)[..., None], col)

# snow field: blue in shadow, faint lavender, a long drift line
field_t = smoothstep(0.62, 1.0, v)[..., None]
snow = np.array([70, 84, 128.]) + (np.array([118, 128, 168.]) - np.array([70, 84, 128.])) * field_t
drift = noise(160, 4, 5)
snow = snow + ((drift - 0.5) * 40)[..., None]
col = np.where(~sky[..., None], snow, col)

# house: small, off-centre right, a dark gable shape sitting on the horizon
hx0, hx1 = 0.60, 0.74
base = 0.645; eave = 0.575; peak = 0.535
inwall = (u > hx0) & (u < hx1) & (v > eave) & (v < base)
roofpoly = (v > peak + (eave - peak) * np.abs(u - (hx0 + hx1) / 2) / ((hx1 - hx0) / 2 + 0.012)) & (v <= eave + 0.002) & (u > hx0 - 0.012) & (u < hx1 + 0.012)
# lean-to shed
shed = (u > hx1) & (u < hx1 + 0.05) & (v > 0.6 + (u - hx1) * 0.5) & (v < base)
house = inwall | roofpoly | shed
col = np.where(house[..., None], np.array([16, 14, 24.]) + ((noise(30, 2, 6) - 0.5) * 14)[..., None], col)
# snow on roof
roofsnow = roofpoly & (v < peak + (eave - peak) * np.abs(u - (hx0 + hx1) / 2) / ((hx1 - hx0) / 2 + 0.012) + 0.012)
col = np.where(roofsnow[..., None], np.array([120, 130, 172.]), col)
# chimney
chim = (u > 0.695) & (u < 0.706) & (v > 0.515) & (v < 0.56)
col = np.where(chim[..., None], np.array([20, 16, 26.]), col)

# THE window
wx0, wx1, wy0, wy1 = 0.637, 0.666, 0.592, 0.628
win = (u > wx0) & (u < wx1) & (v > wy0) & (v < wy1)
wc = np.array([255, 196, 102.]) + ((noise(12, 2, 7) - 0.5) * 50)[..., None] * np.array([0.3, 0.6, 1.0])
col = np.where(win[..., None], wc, col)
# muntins
mun = win & ((np.abs(u - (wx0 + wx1) / 2) < 0.0016) | (np.abs(v - (wy0 + wy1) / 2) < 0.0022))
col = np.where(mun[..., None], np.array([60, 30, 18.]), col)

# light spilling onto the snow: a skewed trapezoid below/right of the window
cx = (wx0 + wx1) / 2
du = (u - cx - (v - base) * 0.35) / (0.022 + (v - base) * 0.12)
spill = np.exp(-(du ** 4)) * np.exp(-((v - base - 0.03) / 0.028) ** 2) * (v > base)
spill = np.asarray(Image.fromarray((spill*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(5)), float)/255
col = col + (spill * 115)[..., None] * np.array([1.0, 0.66, 0.34])
# halo in the air around the window (cold air, moisture)
halo = np.exp(-(((u - cx) / 0.09) ** 2 + ((v - (wy0 + wy1) / 2) / 0.07) ** 2)) * (~win)
col = col + (halo * 38)[..., None] * np.array([1.0, 0.7, 0.4])

# fence posts running away to the left, half buried
for i, px in enumerate(np.linspace(0.12, 0.56, 11)):
    k = (px - 0.12) / 0.44
    pv = 0.72 - k * 0.07
    hgt = 0.05 - k * 0.025
    pw = 0.0022 - k * 0.0011
    lean = 0.08 * math.sin(i * 2.3)
    post = (np.abs(u - px - (pv - v) * lean) < pw) & (v > pv - hgt) & (v < pv)
    col = np.where(post[..., None], np.array([28, 24, 36.]), col)

scene = np.clip(col, 0, 255)

# ---------------- grain of the scene (stroke direction) ----------------
lum = scene.mean(2)
blur = np.asarray(Image.fromarray(lum.astype(np.uint8)).filter(ImageFilter.GaussianBlur(6)), float)
gy, gx = np.gradient(blur)
gmag = np.hypot(gx, gy)
# default grain: sky drifts in long slow horizontal currents, field lies flat
sky_ang = 0.18 * np.sin(u * 7 + noise(400, 2, 9) * 6) + 0.1 * (noise(200, 3, 10) - 0.5)
field_ang = 0.05 * (noise(300, 3, 11) - 0.5) - 0.04
base_ang = np.where(sky, sky_ang, field_ang)
edge_ang = np.arctan2(gy, gx) + math.pi / 2  # along edges
wedge = smoothstep(1.0, 6.0, gmag)
ang = base_ang * (1 - wedge) + edge_ang * wedge
ang = np.where(house & ~win, np.where(roofpoly, 0.6 * np.sign(u - (hx0 + hx1) / 2) * -1, math.pi / 2), ang)

# ---------------- paint ----------------
canvas = Image.new("RGB", (W, H), (28, 24, 30))  # warm umber ground, shows through at the edges
# canvas weave
weave = (np.sin(xx * 1.9) * np.sin(yy * 1.9) * 6 + (rng.random((H, W)) - 0.5) * 8)
draw = ImageDraw.Draw(canvas)

def stroke(x, y, length, width, a, base_col, bristles, curve):
    # a short curved stroke made of parallel bristles, each slightly different in value
    nx, ny = -math.sin(a), math.cos(a)
    for b in range(bristles):
        off = (b - (bristles - 1) / 2) * width / max(1, bristles - 1) if bristles > 1 else 0
        jit = rng.normal(0, 4, 3) + rng.normal(0, 4)
        c = tuple(int(max(0, min(255, base_col[i] + jit[i]))) for i in range(3))
        bl = length * (0.75 + 0.35 * random.random())  # bristles don't all reach the end
        pts = []
        steps = 6
        for s in range(steps + 1):
            tt = s / steps
            along = (tt - 0.5) * bl
            bend = curve * (tt - 0.5) ** 2 * length
            px = x + math.cos(a) * along + nx * (off + bend)
            py = y + math.sin(a) * along + ny * (off + bend)
            pts.append((px, py))
        bw = max(1, int(width / max(1, bristles) * 1.6))
        draw.line(pts, fill=c, width=bw, joint="curve")

def layer(n, length, width, bristles, jitter_c, mask=None, detail_bias=0.0):
    for _ in range(n):
        x = random.random() * W; y = random.random() * H
        xi, yi = min(W - 1, int(x)), min(H - 1, int(y))
        if mask is not None and not mask[yi, xi]:
            continue
        if detail_bias and random.random() > min(1, detail_bias * gmag[yi, xi] + 0.15):
            continue
        a = ang[yi, xi] + rng.normal(0, 0.12)
        c = scene[yi, xi] + rng.normal(0, jitter_c, 3)
        stroke(x, y, length * (0.7 + 0.6 * random.random()), width, a, c, bristles, rng.normal(0, 0.25))

print("underpainting"); layer(5000, 150, 48, 7, 6)
print("body");          layer(16000, 70, 22, 5, 4)
print("modelling");     layer(30000, 28, 9, 3, 3, detail_bias=0.12)
fine = np.asarray(Image.fromarray((wedge * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9))) > 40
fine |= win | (halo > 0.2) | (spill > 0.15)
print("detail");        layer(60000, 10, 3, 2, 3, mask=fine)

# the window gets painted last, a few thick loaded strokes, warmer at the centre
for _ in range(220):
    x = W * (wx0 + (wx1 - wx0) * random.random()); y = H * (wy0 + (wy1 - wy0) * random.random())
    xi, yi = int(x), int(y)
    if mun[yi, xi]: continue
    d = abs(x / W - cx) / ((wx1 - wx0) / 2)
    c = np.array([255, 214 - 30 * d, 130 - 50 * d]) + rng.normal(0, 8, 3)
    stroke(x, y, 7, 3, math.pi / 2 + rng.normal(0, 0.2), c, 2, 0)
# re-cut the muntins with a thin dark brush
mx, my = int(W * cx), int(H * (wy0 + wy1) / 2)
draw.line([(mx, int(H * wy0)), (mx, int(H * wy1))], fill=(58, 30, 20), width=3)
draw.line([(int(W * wx0), my), (int(W * wx1), my)], fill=(58, 30, 20), width=3)

# snow: falling dabs, bigger and softer in front, tiny and dense far off; lit where they cross the light
over = Image.new("RGBA", (W, H), (0, 0, 0, 0)); od = ImageDraw.Draw(over)
for _ in range(900):
    x = random.random() * W; y = random.random() * H
    depth = random.random() ** 2.2
    r = 0.8 + depth * 4.5
    xi, yi = min(W - 1, int(x)), min(H - 1, int(y))
    lit = halo[yi, xi] * 3 + spill[yi, xi] * 1.5
    c = np.array([200, 208, 235.]) * (1 - min(1, lit)) + np.array([255, 220, 160.]) * min(1, lit)
    a = int(70 + depth * 120)
    a = int(a * 0.8)
    od.ellipse([x - r, y - r * 1.15, x + r, y + r * 1.15], fill=(int(c[0]), int(c[1]), int(c[2]), a))
over = over.filter(ImageFilter.GaussianBlur(0.9))
canvas = Image.alpha_composite(canvas.convert("RGBA"), over).convert("RGB")

dp = ImageDraw.Draw(canvas)
for i, px in enumerate(np.linspace(0.12, 0.56, 11)):
    k = (px - 0.12) / 0.44
    pv = 0.72 - k * 0.07; hgt = 0.05 - k * 0.025; lean = 0.08 * math.sin(i * 2.3)
    x0, y0 = W * px, H * pv; x1, y1 = W * (px + hgt * lean), H * (pv - hgt)
    dp.line([(x0, y0), (x1, y1)], fill=(30, 26, 38), width=max(2, int(9 - 6 * k)))
    dp.line([(x1 - 1, y1 + 1), (x1 + 3, y1 + 2)], fill=(150, 156, 190), width=2)  # snow cap
    if i < 10:
        nx_ = np.linspace(0.12, 0.56, 11)[i + 1]; nk = (nx_ - 0.12) / 0.44
        dp.line([(x0, y0 - H * hgt * 0.55), (W * nx_, H * (0.72 - nk * 0.07) - H * (0.05 - nk * 0.025) * 0.55)], fill=(44, 40, 56), width=1)
# three stars that made it through the cloud
for sx, sy in [(0.23, 0.09), (0.81, 0.14), (0.47, 0.05)]:
    d2 = ImageDraw.Draw(canvas)
    d2.ellipse([W * sx - 2, H * sy - 2, W * sx + 2, H * sy + 2], fill=(226, 228, 240))

# finish: canvas tooth, a whisper of varnish warmth, soft vignette
arr = np.asarray(canvas, float)
arr += weave[..., None] * 0.6
vig = 1 - 0.35 * (((u - 0.55) / 0.75) ** 2 + ((v - 0.55) / 0.7) ** 2)
arr *= np.clip(vig, 0.55, 1)[..., None]
arr = arr * np.array([1.02, 1.0, 0.97])
Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save("lit_window.png")
print("done")
