"""The Next Room — after Hammershøi, not a copy of him.
A grey room, a chair against the wall, a door standing open. Through it, another room
where the morning sun has come in, and past that, another door, lighter still."""
import sys, math, random
sys.path.insert(0, "..")
import numpy as np
from PIL import Image, ImageFilter
from brush import Scene, paint, smoothstep

W, H = 1500, 1200
sc = Scene(W, H, seed=37)
u, v = sc.u, sc.v
PI2 = math.pi / 2
VX, VY = 0.47, 0.50

grey = np.array([150, 150, 144.])   # Hammershøi grey, a little green in it
white = np.array([206, 204, 196.])

# ---- our room: the near wall, flat on, and a strip of floor ----
nearfloor = v > 0.86
wall = ~nearfloor
sc.fill(wall, grey, PI2, var=10, var_scale=80, seed=1)
# wainscot: a dado rail and panels
sc.fill(wall & (np.abs(v - 0.60) < 0.006), white * 0.95, 0.0)
sc.fill(wall & (v > 0.84), white * 0.85, 0.0)  # skirting
for x0, x1 in [(0.03, 0.31), (0.63, 0.97)]:
    pan = sc.rect(x0, 0.64, x1, 0.81)
    inner = sc.rect(x0 + 0.008, 0.648, x1 - 0.008, 0.802)
    sc.fill(pan & ~inner, white * 0.8, None); sc.ang[pan & ~inner] = np.where(np.abs(v - 0.645) < 0.005, 0, PI2)[pan & ~inner]
boards = np.array([120, 104, 86.]) + ((sc.noise(12, 2, 3) - 0.5) * 16)[..., None]
sc.fill(nearfloor, boards, None, lock=0.4)
sc.ang[nearfloor] = sc.toward(VX, VY)[nearfloor]
fz = (u - VX) / np.maximum(v - VY, 0.01)
sc.col[nearfloor & (np.abs((fz * 7) % 1 - 0.5) > 0.47)] *= 0.78

# ---- the doorway ----
D = (0.36, 0.22, 0.58, 0.86)
opening = sc.rect(*D)
casing = sc.rect(D[0] - 0.025, D[1] - 0.03, D[2] + 0.025, D[3]) & ~opening
sc.fill(casing, white, PI2)
sc.fill(sc.rect(D[0] - 0.03, D[1] - 0.04, D[2] + 0.03, D[1] - 0.03), white * 0.9, 0.0)

# the next room, seen through it
B = (0.405, 0.30, 0.535, 0.70)
nb = sc.rect(*B)
nl = sc.poly([(D[0], D[1]), (B[0], B[1]), (B[0], B[3]), (D[0], D[3])])
nr = sc.poly([(D[2], D[1]), (B[2], B[1]), (B[2], B[3]), (D[2], D[3])])
nf = sc.poly([(D[0], D[3]), (D[2], D[3]), (B[2], B[3]), (B[0], B[3])])
nc = sc.poly([(D[0], D[1]), (D[2], D[1]), (B[2], B[1]), (B[0], B[1])])
grey2 = grey * 1.08 + np.array([4, 2, -4.])
sc.fill(nb & opening, grey2, PI2, var=8, seed=4)
sc.fill(nl & opening, grey2 * 0.9, PI2, var=8, seed=5)
sc.fill(nr & opening, grey2 * 0.97, PI2, var=8, seed=6)
sc.fill(nc & opening, grey2 * 0.92, None); sc.ang[nc] = sc.toward(VX, VY)[nc]
sc.fill(nf & opening, boards * 1.1, None, lock=0.4); sc.ang[nf] = sc.toward(VX, VY)[nf]
sc.col[nf & (np.abs((fz * 7) % 1 - 0.5) > 0.47)] *= 0.8
# a third door, in the far wall: open, and brighter beyond
D3 = (0.445, 0.44, 0.495, 0.70)
op3 = sc.rect(*D3)
sc.fill(sc.rect(D3[0] - 0.006, D3[1] - 0.008, D3[2] + 0.006, D3[3]) & ~op3, white * 1.05, PI2)
sc.fill(op3, np.array([236, 230, 214.]), PI2, var=6, seed=7)
sc.fill(op3 & (v > 0.66), np.array([200, 180, 150.]), 0.0)  # floor of the third room, sunlit
# skirting in the next room
sc.fill(nb & (v > 0.685) & ~op3, white * 0.85, 0.0)

# the door leaf, open toward us, hinged on the right jamb
leaf = sc.poly([(D[2] + 0.025, D[1] - 0.02), (D[2] + 0.11, D[1] - 0.07), (D[2] + 0.11, D[3] + 0.06), (D[2] + 0.025, D[3])])
sc.fill(leaf, white * 0.98, PI2, var=6, seed=8)
for y0, y1 in [(0.20, 0.50), (0.56, 0.84)]:
    def edge_y(y, x): return y + (x - (D[2] + 0.025)) / 0.085 * ((y - 0.5) * 0.18)
    p = sc.poly([(D[2] + 0.04, edge_y(y0, D[2] + 0.04)), (D[2] + 0.095, edge_y(y0, D[2] + 0.095) - 0.01),
                 (D[2] + 0.095, edge_y(y1, D[2] + 0.095) + 0.01), (D[2] + 0.04, edge_y(y1, D[2] + 0.04))])
    sc.fill(p, white * 0.86, PI2)
sc.fill(sc.ellipse(D[2] + 0.1, 0.55, 0.006, 0.005), [70, 64, 56])  # the knob

# a chair against the wall, on the left, facing the room
cx = 0.16
for lx in [cx - 0.055, cx + 0.045]:
    sc.fill(sc.rect(lx, 0.47, lx + 0.01, 0.92), [64, 54, 46], PI2)
for ly in [0.50, 0.56]:
    sc.fill(sc.rect(cx - 0.055, ly, cx + 0.055, ly + 0.012), [64, 54, 46], 0.0)
seat = sc.poly([(cx - 0.07, 0.72), (cx + 0.07, 0.72), (cx + 0.075, 0.74), (cx - 0.075, 0.74)])
sc.fill(seat, [80, 66, 54], 0.0)
for lx in [cx - 0.068, cx + 0.06]:
    sc.fill(sc.rect(lx, 0.74, lx + 0.01, 0.95), [58, 48, 40], PI2)
# a picture frame hanging above, mostly in shadow
fr = sc.rect(0.10, 0.28, 0.24, 0.40)
sc.fill(fr, [60, 52, 44], None)
sc.fill(sc.rect(0.11, 0.293, 0.23, 0.387), [104, 104, 96], PI2)

albedo = sc.col.copy() / 255.0

# ---- light ----
# our room: soft north light, a little dim, falling off away from the door
illum = np.broadcast_to(np.array([200, 202, 204.]), sc.col.shape).copy()
illum *= (0.80 + 0.2 * np.exp(-(((u - 0.47) / 0.5) ** 2)))[..., None]
illum *= (1 - 0.18 * smoothstep(0.3, 0.0, v))[..., None]
# the next room is brighter, and has the sun
inside = opening
illum[inside] *= 1.12
sun = np.array([255, 236, 196.])
# the unseen window is on the next room's left wall; sun crosses the floor and climbs the right wall
fp = sc.poly([(0.405, 0.735), (0.47, 0.735), (0.56, 0.82), (0.43, 0.82)]) & nf
wp = sc.poly([(0.548, 0.36), (0.567, 0.30), (0.567, 0.78), (0.548, 0.71)]) & nr
p = (fp | wp).astype(float)
p = np.asarray(Image.fromarray((p * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.5)), float) / 255 * opening
illum += p[..., None] * sun * 0.75
col = albedo * illum
col[op3] = sc.col[op3]
# light comes back through the doorway onto our floor, and warms the jambs
spill = np.exp(-(((u - 0.47) / 0.12) ** 2 + ((v - 0.88) / 0.05) ** 2)) * nearfloor
col += (spill * 40)[..., None] * np.array([1, 0.95, 0.85])
col += (np.exp(-(((u - 0.47) / 0.2) ** 2)) * 12 * casing)[..., None]
# the leaf's shadow edge on the wall to its right
col[sc.poly([(D[2] + 0.11, D[1] - 0.07), (D[2] + 0.15, D[1] - 0.03), (D[2] + 0.15, D[3] + 0.04), (D[2] + 0.11, D[3] + 0.06)]) & wall & ~leaf] *= 0.88
# the chair's shadow on the floor
col[sc.poly([(cx - 0.08, 0.86), (cx + 0.08, 0.86), (cx + 0.11, 0.97), (cx - 0.05, 0.97)]) & nearfloor] *= 0.8
sc.col = col
sc.focus = opening | casing | leaf

img = paint(sc, ground=(80, 76, 70), stroke_jitter=3, finish_warm=(1.0, 1.0, 0.99), vignette=0.22, passes=[
    (4500, 110, 34, 6, 3, None, 0),
    (20000, 50, 15, 4, 2, None, 0),
    (36000, 22, 6, 3, 1.5, None, 0.15),
])
img.save("nextroom.png")
img.resize((1000, 800)).save("/tmp/claude-1000/-home-exedev/8930d46f-13d7-4a15-aac7-309674d2fad5/scratchpad/n_prev.png")
print("ok")
