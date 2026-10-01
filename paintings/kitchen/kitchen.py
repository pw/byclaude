"""Kitchen, 4 a.m. — one pendant lamp, two mugs, a cat, the window dark."""
import sys, math, random
sys.path.insert(0, "..")
import numpy as np
from PIL import Image, ImageFilter
from brush import Scene, paint, smoothstep

W, H = 1600, 1200
sc = Scene(W, H, seed=11)
u, v = sc.u, sc.v
VX, VY = 0.44, 0.46
PI2 = math.pi / 2

# ---- albedo (what things are made of) ----
bw = (0.22, 0.17, 0.70, 0.64)  # back wall
ceil = sc.poly([(0, 0), (1, 0), (bw[2], bw[1]), (bw[0], bw[1])])
floor = sc.poly([(0, 1), (1, 1), (bw[2], bw[3]), (bw[0], bw[3])])
lwall = sc.poly([(0, 0), (bw[0], bw[1]), (bw[0], bw[3]), (0, 1)])
rwall = sc.poly([(1, 0), (bw[2], bw[1]), (bw[2], bw[3]), (1, 1)])
back = sc.rect(*bw)
wallc = np.array([196, 176, 140.])  # old cream paint
sc.fill(back, wallc, PI2, var=18, seed=1)
sc.fill(lwall, wallc * 0.92, PI2, var=18, seed=2)
sc.fill(rwall, wallc * 0.95, PI2, var=18, seed=3)
sc.fill(ceil, wallc * 0.85, None, var=10, seed=4); sc.ang[ceil] = sc.toward(VX, VY)[ceil]
# floor: worn linoleum checks fading into dark
fl = np.array([120, 92, 70.]) + 14 * (((np.floor((u - VX) / np.maximum(v - VY, 0.01) * 6) + np.floor(np.log(np.maximum(v - VY, 0.01)) * 9)) % 2) * 2 - 1)[..., None]
sc.fill(floor, fl, None, var=20, seed=5); sc.ang[floor] = sc.toward(VX, VY)[floor]

# window in the back wall: night
win = sc.rect(0.29, 0.25, 0.47, 0.47)
frame = sc.rect(0.285, 0.245, 0.475, 0.475) & ~win
sc.fill(frame, [210, 200, 180], PI2)
night = np.array([22, 30, 58.]) + (np.array([40, 46, 78.]) - np.array([22, 30, 58.])) * smoothstep(0.25, 0.47, v)[..., None]
sc.fill(win, night, 0.0, var=10, seed=6)
mull = win & ((abs(u - 0.38) < 0.0035) | (abs(v - 0.36) < 0.004))
sc.fill(mull, [190, 180, 160], PI2)
# counter under the window, along the back wall
counter = sc.rect(bw[0], 0.53, bw[2], bw[3])
sc.fill(counter, [70, 92, 96], 0.0, var=12, seed=7)  # painted cupboards, teal gone grey
top = sc.rect(bw[0], 0.515, bw[2], 0.535)
sc.fill(top, [200, 190, 170], 0.0)
for cx in [0.30, 0.42, 0.54, 0.64]:
    sc.fill(sc.rect(cx - 0.0015, 0.56, cx + 0.0015, 0.62), [40, 50, 52], PI2)  # cupboard seams
# kettle + a jar on the counter
kettle = (sc.ellipse(0.56, 0.50, 0.03, 0.028) & (v < 0.515)) | sc.rect(0.528, 0.497, 0.592, 0.515)
spout = sc.poly([(0.588, 0.50), (0.612, 0.478), (0.616, 0.482), (0.592, 0.508)])
handle = sc.ellipse(0.56, 0.47, 0.022, 0.016) & ~sc.ellipse(0.56, 0.472, 0.016, 0.011) & (v < 0.474)
knob = sc.ellipse(0.56, 0.47, 0.005, 0.004)
sc.fill(kettle | spout, [140, 34, 30], 0.0)
sc.fill(handle | knob, [30, 26, 26], 0.0)
jar = sc.rect(0.24, 0.47, 0.262, 0.515)
sc.fill(jar, [160, 150, 120], PI2)
# fridge hum on the left wall: a pale tall shape in perspective
fridge = sc.poly([(0.035, 0.18), (0.17, 0.27), (0.17, 0.70), (0.035, 0.80)])
sc.fill(fridge, [205, 205, 196], PI2, var=10, seed=8)
sc.fill(sc.poly([(0.15, 0.36), (0.158, 0.365), (0.158, 0.47), (0.15, 0.47)]), [120, 120, 118], PI2)
paper = sc.poly([(0.07, 0.36), (0.12, 0.38), (0.12, 0.46), (0.07, 0.45)])
sc.fill(paper, [225, 215, 190], PI2)  # a note on the fridge
# a calendar on the right wall
cal = sc.poly([(0.80, 0.28), (0.87, 0.25), (0.87, 0.40), (0.80, 0.41)])
sc.fill(cal, [220, 214, 200], PI2)
sc.fill(sc.poly([(0.80, 0.28), (0.87, 0.25), (0.87, 0.30), (0.80, 0.325)]), [150, 70, 60], PI2)

# the table
tt = sc.poly([(0.17, 0.80), (0.79, 0.80), (0.67, 0.64), (0.29, 0.64)])
wood = np.array([128, 78, 44.]) + ((sc.noise(18, 2, 9) - 0.5) * 30)[..., None] * np.array([1, 0.8, 0.6])
sc.fill(tt, wood, 0.0, lock=0.6)
apron = sc.poly([(0.17, 0.80), (0.79, 0.80), (0.79, 0.835), (0.17, 0.835)])
sc.fill(apron, wood * 0.6, 0.0)
for lx in [0.19, 0.76]:
    sc.fill(sc.rect(lx, 0.835, lx + 0.022, 1.0), [70, 42, 26], PI2)
# chair on the right with the cat
seat = sc.poly([(0.80, 0.83), (0.97, 0.83), (0.95, 0.77), (0.82, 0.77)])
sc.fill(seat, [100, 64, 40], 0.0)
for bx in [0.825, 0.945]:
    sc.fill(sc.rect(bx, 0.52, bx + 0.016, 0.78), [92, 58, 36], PI2)
for by in [0.55, 0.62]:
    sc.fill(sc.rect(0.825, by, 0.961, by + 0.018), [92, 58, 36], 0.0)
sc.fill(sc.rect(0.81, 0.83, 0.826, 1.0), [70, 44, 28], PI2)
sc.fill(sc.rect(0.95, 0.83, 0.966, 1.0), [70, 44, 28], PI2)
# the cat, sitting up, watching the table
body = sc.ellipse(0.888, 0.725, 0.042, 0.062) & (v < 0.775)
haunch = sc.ellipse(0.905, 0.75, 0.035, 0.03)
head = sc.ellipse(0.872, 0.645, 0.026, 0.03)
ears = sc.poly([(0.852, 0.636), (0.853, 0.598), (0.868, 0.622)]) | sc.poly([(0.875, 0.618), (0.892, 0.596), (0.894, 0.632)])
tail = sc.poly([(0.92, 0.77), (0.955, 0.772), (0.96, 0.76), (0.94, 0.755), (0.915, 0.76)])
cat = body | haunch | head | ears | tail
catc = np.array([52, 46, 44.]) + ((sc.noise(8, 2, 10) - 0.5) * 18)[..., None]
sc.fill(cat, catc, PI2, lock=0.3)
# things on the table: two mugs, a notebook, a pen
book = sc.poly([(0.42, 0.75), (0.58, 0.75), (0.56, 0.69), (0.44, 0.69)])
sc.fill(book, [232, 226, 210], 0.0)
sc.fill(sc.poly([(0.497, 0.75), (0.503, 0.75), (0.502, 0.69), (0.498, 0.69)]), [180, 170, 150], PI2)
for ly in np.linspace(0.70, 0.74, 5):
    sc.fill(sc.rect(0.45, ly, 0.49, ly + 0.0025), [150, 150, 170], 0.0)
sc.fill(sc.poly([(0.52, 0.735), (0.555, 0.72), (0.557, 0.724), (0.522, 0.739)]), [30, 30, 40], -0.4)
m1 = sc.rect(0.335, 0.66, 0.375, 0.72) | sc.ellipse(0.355, 0.72, 0.02, 0.008)
sc.fill(m1, [214, 210, 200], PI2)
sc.fill(sc.ellipse(0.355, 0.66, 0.02, 0.007), [70, 40, 26])  # coffee
h1 = sc.ellipse(0.38, 0.69, 0.012, 0.018) & ~sc.ellipse(0.38, 0.69, 0.006, 0.01) & (u > 0.375)
sc.fill(h1, [214, 210, 200])
m2 = sc.rect(0.61, 0.655, 0.645, 0.705) | sc.ellipse(0.6275, 0.705, 0.0175, 0.007)
sc.fill(m2, [52, 78, 120], PI2)
sc.fill(sc.ellipse(0.6275, 0.655, 0.0175, 0.006), [60, 36, 22])
# the lamp: cord + enamel shade
LX, LY = 0.47, 0.37
sc.fill(sc.rect(LX - 0.0015, 0.0, LX + 0.0015, LY - 0.06), [30, 28, 26], PI2, lock=1)
shade = sc.poly([(LX - 0.018, LY - 0.06), (LX + 0.018, LY - 0.06), (LX + 0.07, LY), (LX - 0.07, LY)])
sc.fill(shade, [40, 70, 62], None, var=8, seed=12)
sc.ang[shade] = 0.0
bulb = sc.ellipse(LX, LY + 0.002, 0.066, 0.01)
sc.fill(bulb, [255, 244, 210])

albedo = sc.col.copy() / 255.0

# ---- light ----
amb = np.array([38, 46, 72.])  # blue night coming in
illum = np.broadcast_to(amb, sc.col.shape).copy()
# the lamp throws down and out: strong on the table, softer on walls, little on the ceiling
d = np.sqrt(((u - LX) * 1.0) ** 2 + ((v - (LY + 0.25)) * 1.25) ** 2)
lamp = np.exp(-(d / 0.30) ** 2) * 1.15 + np.exp(-(d / 0.65) ** 2) * 0.45
lamp = lamp * (0.3 + 0.7 * smoothstep(LY - 0.12, LY + 0.06, v))
illum += lamp[..., None] * np.array([255, 196, 128.])
# window cool spill on the counter top
illum += (np.exp(-(((u - 0.38) / 0.12) ** 2 + ((v - 0.52) / 0.03) ** 2)) * 40)[..., None] * np.array([0.6, 0.7, 1.0])
col = albedo * illum
# emissive / self-lit bits
glow_mask = win | bulb
col[win] = sc.col[win]
col[bulb] = sc.col[bulb]
# reflection of the lamp in the window glass, faint
col += (np.exp(-(((u - 0.40) / 0.012) ** 2 + ((v - 0.30) / 0.02) ** 2)) * 90 * win)[..., None] * np.array([1, 0.75, 0.45])
# a streetlight far off
col += (np.exp(-(((u - 0.33) / 0.006) ** 2 + ((v - 0.42) / 0.006) ** 2)) * 160 * win)[..., None] * np.array([1, 0.6, 0.25])
# shade interior glow + air glow under the lamp
col += (np.exp(-(((u - LX) / 0.09) ** 2 + ((v - LY - 0.01) / 0.03) ** 2)) * 70)[..., None] * np.array([1, 0.85, 0.6])
# cast shadows: mugs and the cat's own shadow on the table / chair
sh = (sc.ellipse(0.35, 0.735, 0.03, 0.01) | sc.ellipse(0.635, 0.715, 0.028, 0.009)) & tt & ~m1 & ~m2
col[sh] *= 0.62
under = sc.poly([(0.17, 0.835), (0.79, 0.835), (0.83, 1.0), (0.13, 1.0)]) & floor
col[under] *= 0.55
# steam from the blue mug
steam = np.exp(-(((u - 0.627 - 0.01 * np.sin(v * 90)) / 0.006) ** 2)) * smoothstep(0.66, 0.60, v) * smoothstep(0.55, 0.60, v)
col += (steam * 26)[..., None]
rim = cat & ~sc.poly([(0.87, 0.58), (2, 0.58), (2, 1), (0.85, 1)])
col[rim & (u < 0.865)] = col[rim & (u < 0.865)] * 1.6 + np.array([30, 18, 6.])
sc.col = col
sc.focus = sc.ellipse(0.47, 0.68, 0.22, 0.14) | cat | win | sc.ellipse(LX, LY, 0.1, 0.05)

img = paint(sc, ground=(40, 30, 28), passes=[
    (5000, 90, 30, 6, 5, None, 0),
    (22000, 44, 14, 4, 3, None, 0),
    (40000, 20, 6, 3, 2, None, 0.15),
])
img.save("kitchen.png")
img.resize((1200, 900)).save("/tmp/claude-1000/-home-exedev/8930d46f-13d7-4a15-aac7-309674d2fad5/scratchpad/k_prev.png")
print("ok")
