import numpy as np, sys, os, glob
from multiprocessing import Pool
from PIL import Image, ImageDraw, ImageFont
import render

src, out = sys.argv[1], sys.argv[2]; up = int(sys.argv[3])
os.makedirs(out, exist_ok=True)
steps = [s for s in range(0, up, 25)] + [s for s in range(up, 100000, 75)]
smax = int(sys.argv[4]) if len(sys.argv)>4 else 10**9
steps = [s for s in steps if s <= smax and os.path.exists(f"{src}/f{s:05d}.npz")]
zmax = max(float(np.load(f"{src}/f{s:05d}.npz")["h"].max()) for s in steps[::8])
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 26)
small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 18)
def one(k_s):
    k, s = k_s
    p = f"{out}/{k:04d}.png"
    render.render(f"{src}/f{s:05d}.npz", p, zmax)
    im = Image.open(p); dr = ImageDraw.Draw(im, "RGBA")
    my = s/1000
    dr.text((34, im.height-58), f"{my:4.1f} million years", font=font, fill=(222,220,208,230))
    note = "rising" if s < up else "no longer rising"
    dr.text((36, im.height-90), note, font=small, fill=(200,198,186,170))
    im.save(p)
    return k
with Pool(8) as pool:
    for k in pool.imap_unordered(one, list(enumerate(steps))): pass
print(len(steps), "frames, zmax", zmax)
