import numpy as np, sys
from PIL import Image, ImageDraw
from scipy.ndimage import zoom, distance_transform_edt

S = 3  # upscale
def receivers(h, sea):
    n0, n1 = h.shape
    best = np.zeros_like(h); ri = np.tile(np.arange(n0)[:,None], (1,n1)); rj = np.tile(np.arange(n1)[None,:], (n0,1))
    rec_i, rec_j = ri.copy(), rj.copy()
    hp = np.pad(h, 1, constant_values=np.inf)
    for di in (-1,0,1):
        for dj in (-1,0,1):
            if di == 0 and dj == 0: continue
            nb = hp[1+di:1+di+n0, 1+dj:1+dj+n1]
            s = (h - nb) / np.hypot(di, dj)
            better = (s > best) & ~sea
            best = np.where(better, s, best)
            rec_i = np.where(better, ri+di, rec_i); rec_j = np.where(better, rj+dj, rec_j)
    return rec_i, rec_j

def tint(z):
    # elevation 0..1 -> colour: low sage, mid ochre, high warm grey, top bone
    stops = [(0.00,(122,140,104)),(0.12,(150,158,112)),(0.35,(176,160,118)),
             (0.60,(158,138,112)),(0.85,(176,168,156)),(1.00,(232,228,218))]
    out = np.zeros(z.shape+(3,))
    for (a,ca),(b,cb) in zip(stops, stops[1:]):
        m = (z>=a)&(z<=b); t = ((z-a)/(b-a))[m][:,None]
        out[m] = np.array(ca)*(1-t) + np.array(cb)*t
    return out

def render(path, out, zmax=None, label=None):
    d = np.load(path); h = d["h"].astype(float); A = d["A"].astype(float)
    sea = np.load(path.rsplit("/",1)[0]+"/sea.npy")
    zmax = zmax or max(h.max(), 1)
    H = zoom(h, S, order=3); seaS = zoom(sea.astype(float), S, order=1) > 0.5
    H[seaS] = 0
    gy, gx = np.gradient(H, 100.0/S)
    az, alt = np.radians(315), np.radians(40)
    slope = np.arctan(np.hypot(gx, gy)*1.6); aspect = np.arctan2(-gx, gy)
    shade = np.sin(alt)*np.cos(slope) + np.cos(alt)*np.sin(slope)*np.cos(az - aspect)
    shade = np.clip(shade, 0, 1)
    col = tint(np.clip(H/zmax, 0, 1))
    if "hard" in d.files:
        hard = zoom(d["hard"].astype(float), S, order=1)
        col = col*(1-0.28*hard[...,None]) + 0.28*hard[...,None]*np.array([150,104,84])
    col = col * (0.35 + 0.80*shade[...,None])
    # sea: dark slate, lighter in the shallows near the coast
    dist = distance_transform_edt(seaS)
    shallow = np.exp(-dist/(10*S))[...,None]
    seacol = np.array([46,62,74])*(1-shallow) + np.array([92,118,124])*shallow
    col[seaS] = seacol[seaS]
    img = Image.fromarray(np.clip(col,0,255).astype(np.uint8))
    dr = ImageDraw.Draw(img, "RGBA")
    ri, rj = receivers(h, sea)
    thr = 2.5e6
    idx = np.argwhere((A > thr) & ~sea)
    for i, j in idx:
        a = A[i,j]; w = 0.6 + 0.9*np.log10(a/thr)
        al = int(min(230, 90 + 45*np.log10(a/thr)))
        i1, j1 = ri[i,j], rj[i,j]; i2, j2 = ri[i1,j1], rj[i1,j1]
        # cut corners: draw between segment midpoints (one Chaikin-ish pass)
        p0 = ((j+j1)/2*S+0.5*S, (i+i1)/2*S+0.5*S); p1 = ((j1+j2)/2*S+0.5*S, (i1+i2)/2*S+0.5*S)
        dr.line([p0, p1], fill=(38,70,96,al), width=max(1,int(round(w))))
    if label:
        dr.text((12, img.height-22), label, fill=(220,220,210,200))
    img.save(out)

if __name__ == "__main__":
    render(sys.argv[1], sys.argv[2], float(sys.argv[3]) if len(sys.argv)>3 else None, sys.argv[4] if len(sys.argv)>4 else None)
