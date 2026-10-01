"""Reference Desk — a small-town library at the end of an afternoon.
Tall windows on the left, sun lying across the floorboards, the shelves on the right
holding everything, a green lamp on the desk, nobody at it."""
import sys, math, random
sys.path.insert(0, "..")
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from brush import Scene, paint, smoothstep

W, H = 1600, 1200
sc = Scene(W, H, seed=23)
u, v = sc.u, sc.v
VX, VY = 0.55, 0.47
PI2 = math.pi / 2
B = (0.40, 0.27, 0.70, 0.60)  # back wall rectangle

def lerp(a, b, t): return a + (b - a) * t

ceil = sc.poly([(0, 0), (1, 0), (B[2], B[1]), (B[0], B[1])])
floor = sc.poly([(0, 1), (1, 1), (B[2], B[3]), (B[0], B[3])])
lwall = sc.poly([(0, 0), (B[0], B[1]), (B[0], B[3]), (0, 1)])
rwall = sc.poly([(1, 0), (B[2], B[1]), (B[2], B[3]), (1, 1)])
back = sc.rect(*B)

plaster = np.array([178, 160, 128.])
sc.fill(lwall, plaster * 0.9, PI2, var=14, seed=1)
sc.fill(back, plaster, PI2, var=14, seed=2)
sc.fill(ceil, np.array([110, 84, 60.]), None, var=12, seed=3); sc.ang[ceil] = sc.toward(VX, VY)[ceil]
# floorboards: long planks running to the vanishing point
fz = (u - VX) / np.maximum(v - VY, 0.005)
plank = (np.floor(fz * 9) % 3)
boards = np.array([118, 76, 44.]) + (plank * 9 - 9)[..., None] + ((sc.noise(14, 2, 4) - 0.5) * 22)[..., None]
sc.fill(floor, boards, None, lock=0.5); sc.ang[floor] = sc.toward(VX, VY)[floor]
seam = floor & (np.abs((fz * 9) % 1 - 0.5) > 0.47)
sc.col[seam] *= 0.7

# back wall: a doorway into the stacks, a clock above
door = sc.rect(0.50, 0.40, 0.58, 0.60)
sc.fill(door, [44, 32, 26], PI2)
sc.fill(sc.rect(0.495, 0.395, 0.585, 0.40) | sc.rect(0.495, 0.40, 0.50, 0.60) | sc.rect(0.58, 0.40, 0.585, 0.60), [90, 60, 38], PI2)
clock = sc.ellipse(0.54, 0.335, 0.022, 0.03)
sc.fill(clock, [226, 216, 190])
sc.fill(sc.ellipse(0.54, 0.335, 0.024, 0.032) & ~clock, [60, 44, 30])
sc.fill(sc.poly([(0.539, 0.336), (0.541, 0.336), (0.552, 0.322), (0.550, 0.320)]), [30, 26, 24])  # ten to five
sc.fill(sc.poly([(0.539, 0.334), (0.541, 0.334), (0.536, 0.312), (0.534, 0.313)]), [30, 26, 24])

# left wall: tall windows, receding
def ltop(x): return lerp(0.0, B[1], x / B[0])
def lbot(x): return lerp(1.0, B[3], x / B[0])
wins = [(0.03, 0.115), (0.175, 0.235), (0.275, 0.315), (0.34, 0.366)]
winmask = np.zeros_like(u, bool)
for xa, xb in wins:
    ta, tb = ltop(xa), ltop(xb); ba, bb = lbot(xa), lbot(xb)
    ha, hb = ba - ta, bb - tb
    w = sc.poly([(xa, ta + ha * 0.10), (xb, tb + hb * 0.10), (xb, tb + hb * 0.66), (xa, ta + ha * 0.66)])
    arch = sc.poly([(xa, ta + ha * 0.10), (lerp(xa, xb, 0.5), lerp(ta, tb, 0.5) + lerp(ha, hb, 0.5) * 0.03), (xb, tb + hb * 0.10)])
    w = w | arch
    winmask |= w
sky = np.array([250, 240, 214.]) - (np.array([20, 30, 60.]) * smoothstep(0.1, 0.5, v)[..., None])
sc.fill(winmask, sky, PI2, var=10, seed=5)
# muntins
for xa, xb in wins:
    xm = (xa + xb) / 2
    sc.fill(winmask & (np.abs(u - xm) < 0.0025 * (1 - xm)), [120, 96, 70], PI2)
    for hf in [0.3, 0.48]:
        ym = lerp(ltop(xm), lbot(xm), hf)
        sc.fill(winmask & (np.abs(v - ym - (u - xm) * (lerp(B[1], B[3], hf) - lerp(0, 1, hf)) / B[0]) < 0.003), [120, 96, 70], 0.0)

# right wall: shelves, floor to ceiling
def rtop(x): return lerp(B[1], 0.0, (x - B[2]) / (1 - B[2]))
def rbot(x): return lerp(B[3], 1.0, (x - B[2]) / (1 - B[2]))
hh = (v - rtop(u)) / (rbot(u) - rtop(u))
depth = 1.0 / np.maximum(u - VX, 0.01)   # grows toward the back
boardsh = [0.06, 0.24, 0.42, 0.60, 0.78, 0.96]
shelfwood = np.array([92, 58, 34.])
sc.fill(rwall, shelfwood * 0.6, PI2)
rng = np.random.default_rng(5)
spine_id = np.floor(depth * 7.0).astype(int)
palette = np.array([[120, 36, 30], [40, 60, 92], [52, 78, 50], [150, 120, 70], [90, 40, 60], [180, 160, 120],
                    [30, 30, 36], [140, 70, 36], [70, 90, 100], [160, 50, 40], [200, 190, 160], [60, 50, 80]], float)
for i in range(len(boardsh) - 1):
    lo, hi = boardsh[i] + 0.025, boardsh[i + 1]
    row = rwall & (hh > lo) & (hh < hi)
    key = (spine_id * 7 + i * 131) % 977
    pick = palette[key % len(palette)]
    shade = 0.75 + 0.5 * ((key * 37 % 100) / 100.0)
    topgap = ((key * 53) % 100) / 100.0 * 0.35 * (hi - lo)
    book = row & (hh > lo + topgap)
    gap = ((key * 13) % 11 == 0)  # the odd missing book
    book &= ~gap
    sc.col[book] = (pick * shade[..., None])[book]
    sc.ang[book] = PI2; sc.lock[book] = 0.8
    edge = book & (np.abs((depth * 7.0) % 1) < 0.10)
    sc.col[edge] *= 0.55
for bh in boardsh:
    sc.fill(rwall & (np.abs(hh - bh) < 0.012), shelfwood * 1.15, 0.0)
sc.ang[rwall & (sc.lock == 0)] = sc.toward(VX, VY)[rwall & (sc.lock == 0)]

# the reference desk, middle distance
desk_top = sc.poly([(0.33, 0.655), (0.64, 0.655), (0.62, 0.625), (0.35, 0.625)])
desk_front = sc.rect(0.33, 0.655, 0.64, 0.74)
sc.fill(desk_front, [96, 60, 36], PI2, var=14, seed=7)
sc.fill(desk_top, [130, 88, 56], 0.0)
for px in np.linspace(0.345, 0.625, 6):
    sc.fill(sc.rect(px, 0.67, px + 0.003, 0.73), [70, 44, 28], PI2)
# green banker's lamp
sc.fill(sc.rect(0.407, 0.585, 0.414, 0.63), [170, 140, 70], PI2)  # brass stem
sc.fill(sc.ellipse(0.41, 0.632, 0.02, 0.005), [150, 120, 60])
lampshade = sc.ellipse(0.41, 0.585, 0.04, 0.018) & (v < 0.59)
sc.fill(lampshade, [40, 110, 70], 0.0)
# a stack of books, a bell, a card in a holder
sc.fill(sc.rect(0.52, 0.605, 0.575, 0.616), [120, 40, 34], 0.0)
sc.fill(sc.rect(0.525, 0.594, 0.57, 0.605), [50, 70, 100], 0.0)
sc.fill(sc.rect(0.522, 0.586, 0.56, 0.594), [190, 176, 140], 0.0)
bell = sc.ellipse(0.47, 0.632, 0.008, 0.008) & (v < 0.634)
sc.fill(bell, [200, 170, 90])
card = sc.poly([(0.44, 0.632), (0.46, 0.632), (0.458, 0.612), (0.442, 0.612)])
sc.fill(card, [236, 230, 214], PI2)
# a chair pushed back from the desk
sc.fill(sc.rect(0.585, 0.585, 0.59, 0.66) | sc.rect(0.61, 0.585, 0.615, 0.66) | sc.rect(0.585, 0.585, 0.615, 0.595), [60, 38, 24], PI2)

# hanging globe lights (unlit)
for gx, gy, r in [(0.30, 0.20, 0.03), (0.75, 0.18, 0.034), (0.55, 0.30, 0.016)]:
    sc.fill(sc.rect(gx - 0.001, 0.0, gx + 0.001, gy - r), [40, 30, 24], PI2, lock=1)
    sc.fill(sc.ellipse(gx, gy, r, r * 1.3 * W / H / 1.33), [214, 204, 182])

albedo = sc.col.copy() / 255.0

# ---- light: dim warm room + low sun from the left ----
illum = np.broadcast_to(np.array([120, 108, 92.]), sc.col.shape).copy()
illum += (smoothstep(0.6, 0.0, u) * 60)[..., None] * np.array([1, 0.9, 0.75])  # nearer the windows is brighter
sun = np.array([250, 222, 176.])
deskall = desk_top | desk_front
patches = np.zeros_like(u)
beams = np.zeros_like(u)
for xa, xb in wins:
    ba, bb = lbot(xa), lbot(xb)
    s = 1.0 - xa / B[0] * 0.7     # nearer windows throw bigger patches
    L = 0.42 * s
    dy = 0.07 * s
    p = sc.poly([(xa + 0.01, ba - 0.005), (xb, bb - 0.005), (xb + L, bb + dy), (xa + L * 0.95, ba + dy)]) & floor & ~deskall
    p = np.asarray(Image.fromarray((p * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3)), float) / 255
    patches = np.maximum(patches, p)
    ta, tb = ltop(xa), ltop(xb); ha, hb = ba - ta, bb - tb
    bm = sc.poly([(xa, ta + ha * 0.12), (xb, tb + hb * 0.12), (xb + L, bb + dy), (xa + L * 0.95, ba + dy)])
    bm = np.asarray(Image.fromarray((bm * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(14)), float) / 255
    beams = np.maximum(beams, bm * s)
illum += patches[..., None] * sun * 1.15
illum += (desk_top & (u < 0.47))[..., None] * sun * 0.9
illum += (desk_front & (u < 0.40))[..., None] * sun * 0.35
col = albedo * illum
col[winmask] = sc.col[winmask]
col += (beams * 34)[..., None] * np.array([1, 0.9, 0.7])  # dust in the air catches it
# the lamp is on, even now
col += (np.exp(-(((u - 0.41) / 0.05) ** 2 + ((v - 0.61) / 0.02) ** 2)) * 60)[..., None] * np.array([1, 0.85, 0.5])
col[lampshade] = col[lampshade] * 1.2 + np.array([10, 40, 20.])
# shadow under the desk
col[sc.poly([(0.33, 0.74), (0.64, 0.74), (0.66, 0.76), (0.31, 0.76)]) & floor] *= 0.55
sc.col = col
sc.focus = sc.rect(0.32, 0.55, 0.66, 0.76) | sc.ellipse(0.54, 0.34, 0.04, 0.05)

def post(canvas, draw, stroke):
    # dust motes in the beams
    R = random.Random(4)
    for _ in range(500):
        x, y = R.random(), R.random()
        xi, yi = int(x * W), int(y * H)
        if beams[yi, xi] > 0.25 and R.random() < beams[yi, xi]:
            r = R.choice([1, 1, 1, 2])
            draw.ellipse([xi - r, yi - r, xi + r, yi + r], fill=(255, 238, 200))
    return canvas

img = paint(sc, ground=(60, 40, 28), post=post, passes=[
    (5000, 90, 30, 6, 5, None, 0),
    (22000, 44, 14, 4, 3, None, 0),
    (40000, 20, 6, 3, 2, None, 0.15),
])
img.save("library.png")
img.resize((1200, 900)).save("/tmp/claude-1000/-home-exedev/8930d46f-13d7-4a15-aac7-309674d2fad5/scratchpad/l_prev.png")
print("ok")
