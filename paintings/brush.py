"""brush.py — the shared hand.
A Scene holds what colour the world is at each point and which way its grain runs.
paint() lays bristle strokes over it, coarse to fine. No image model, no reference."""
import math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


class Scene:
    def __init__(self, W, H, seed=0):
        self.W, self.H = W, H
        self.rng = np.random.default_rng(seed)
        random.seed(seed)
        self.seed = seed
        yy, xx = np.mgrid[0:H, 0:W].astype(float)
        self.x, self.y = xx, yy
        self.u, self.v = xx / W, yy / H
        self.col = np.zeros((H, W, 3))
        self.ang = np.zeros((H, W))          # preferred stroke angle per pixel
        self.lock = np.zeros((H, W))         # 1 = keep region angle even at edges
        self.focus = np.zeros((H, W), bool)  # gets the fine brush

    # ---- geometry ----
    def poly(self, pts):
        """pts in 0..1 units -> bool mask"""
        m = Image.new("L", (self.W, self.H), 0)
        ImageDraw.Draw(m).polygon([(p[0] * self.W, p[1] * self.H) for p in pts], fill=255)
        return np.asarray(m) > 127

    def ellipse(self, cx, cy, rx, ry):
        return ((self.u - cx) / rx) ** 2 + ((self.v - cy) / ry) ** 2 < 1

    def rect(self, x0, y0, x1, y1):
        return (self.u >= x0) & (self.u < x1) & (self.v >= y0) & (self.v < y1)

    # ---- colour ----
    def noise(self, scale, octaves=4, seed=None):
        r = np.random.default_rng(self.seed * 101 + (seed or 0))
        out = np.zeros((self.H, self.W)); amp = tot = 0.0; amp = 1.0
        for o in range(octaves):
            s = max(2, int(scale / (2 ** o)))
            g = r.random((self.H // s + 2, self.W // s + 2))
            img = Image.fromarray((g * 255).astype(np.uint8)).resize((self.W + 2 * s, self.H + 2 * s), Image.BICUBIC)
            out += amp * (np.asarray(img, float)[: self.H, : self.W] / 255.0)
            tot += amp; amp *= 0.5
        return out / tot

    def fill(self, mask, c, ang=None, lock=0.0, var=0.0, var_scale=60, seed=1):
        c = np.asarray(c, float)
        val = np.broadcast_to(c, self.col.shape).copy() if c.ndim == 1 else c
        if var:
            val = val + ((self.noise(var_scale, 3, seed) - 0.5) * var)[..., None]
        self.col[mask] = val[mask]
        if ang is not None:
            a = ang if np.ndim(ang) == 0 else ang[mask]
            self.ang[mask] = a
            self.lock[mask] = lock

    def grad(self, mask, c0, c1, p0, p1):
        """linear gradient from point p0 (colour c0) to p1 (colour c1), 0..1 units"""
        dx, dy = p1[0] - p0[0], p1[1] - p0[1]
        t = ((self.u - p0[0]) * dx + (self.v - p0[1]) * dy) / (dx * dx + dy * dy)
        t = np.clip(t, 0, 1)[..., None]
        val = np.asarray(c0, float) + (np.asarray(c1, float) - np.asarray(c0, float)) * t
        self.col[mask] = val[mask]

    def light(self, cx, cy, r, c, strength=1.0, mask=None, aspect=1.0, power=2.0):
        d = np.sqrt(((self.u - cx) / aspect) ** 2 + (self.v - cy) ** 2) / r
        f = np.exp(-d ** power) * strength
        if mask is not None:
            f = f * mask
        self.col += f[..., None] * np.asarray(c, float)
        return f

    def shade(self, mask, k):
        self.col[mask] *= k

    def toward(self, vx, vy):
        """angle field pointing at a vanishing point (for floors/ceilings in perspective)"""
        return np.arctan2(vy - self.v * 1.0, (vx - self.u) * self.W / self.H)


def paint(sc, passes=None, detail_extra=None, ground=(30, 26, 30), stroke_jitter=4,
          finish_warm=(1.02, 1.0, 0.97), vignette=0.3, weave=0.6, post=None):
    W, H = sc.W, sc.H
    rng = sc.rng
    scene = np.clip(sc.col, 0, 255)
    lum = scene.mean(2)
    blur = np.asarray(Image.fromarray(lum.astype(np.uint8)).filter(ImageFilter.GaussianBlur(5)), float)
    gy, gx = np.gradient(blur)
    gmag = np.hypot(gx, gy)
    edge_ang = np.arctan2(gy, gx) + math.pi / 2
    wedge = smoothstep(0.8, 4.0, gmag) * (1 - sc.lock)
    # blend angles on the doubled-angle circle (strokes are undirected)
    a2 = np.arctan2((1 - wedge) * np.sin(2 * sc.ang) + wedge * np.sin(2 * edge_ang),
                    (1 - wedge) * np.cos(2 * sc.ang) + wedge * np.cos(2 * edge_ang)) / 2
    ang = a2

    canvas = Image.new("RGB", (W, H), ground)
    draw = ImageDraw.Draw(canvas)

    def stroke(x, y, length, width, a, base, bristles, curve):
        nx, ny = -math.sin(a), math.cos(a)
        shared = rng.normal(0, stroke_jitter)
        for b in range(bristles):
            off = (b - (bristles - 1) / 2) * width / max(1, bristles - 1) if bristles > 1 else 0
            jit = rng.normal(0, stroke_jitter * 0.8, 3) + shared
            c = tuple(int(max(0, min(255, base[i] + jit[i]))) for i in range(3))
            bl = length * (0.75 + 0.35 * random.random())
            pts = []
            for s in range(7):
                tt = s / 6
                along = (tt - 0.5) * bl
                bend = curve * (tt - 0.5) ** 2 * length
                pts.append((x + math.cos(a) * along + nx * (off + bend), y + math.sin(a) * along + ny * (off + bend)))
            draw.line(pts, fill=c, width=max(1, int(width / max(1, bristles) * 1.6)), joint="curve")

    def layer(n, length, width, bristles, cj, mask=None, detail_bias=0.0):
        for _ in range(n):
            x = random.random() * W; y = random.random() * H
            xi, yi = min(W - 1, int(x)), min(H - 1, int(y))
            if mask is not None and not mask[yi, xi]:
                continue
            if detail_bias and random.random() > min(1, detail_bias * gmag[yi, xi] + 0.15):
                continue
            a = ang[yi, xi] + rng.normal(0, 0.1)
            c = scene[yi, xi] + rng.normal(0, cj, 3) * np.array([1, 1, 1]) * 0.5 + rng.normal(0, cj) * 0.5
            stroke(x, y, length * (0.7 + 0.6 * random.random()), width, a, c, bristles, rng.normal(0, 0.25))

    s = W / 1800
    passes = passes or [
        (4500, 140, 44, 7, 6, None, 0),
        (16000, 64, 20, 5, 4, None, 0),
        (30000, 26, 8, 3, 3, None, 0.12),
    ]
    for n, L, w, br, cj, m, db in passes:
        layer(n, L * s, w * s, br, cj, m, db)
    fine = np.asarray(Image.fromarray((wedge * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7))) > 50
    fine = fine | sc.focus
    if detail_extra is not None:
        fine = fine | detail_extra
    layer(int(70000 * s * s), 9 * s, 2.6 * s, 2, 2, fine)

    if post is not None:
        canvas = post(canvas, draw, stroke) or canvas
    arr = np.asarray(canvas, float)
    tooth = np.sin(sc.x * 1.9) * np.sin(sc.y * 1.9) * 6 + (rng.random((H, W)) - 0.5) * 8
    arr += tooth[..., None] * weave
    vig = 1 - vignette * (((sc.u - 0.5) / 0.75) ** 2 + ((sc.v - 0.5) / 0.7) ** 2)
    arr *= np.clip(vig, 0.55, 1)[..., None]
    arr *= np.array(finish_warm)
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
