import numpy as np, os, time
from scipy.ndimage import gaussian_filter
import land

N = land.N; rng = np.random.default_rng(int(os.environ.get("SEED", 7)))
y, x = np.mgrid[0:N, 0:N] / N - 0.5
noise = gaussian_filter(rng.standard_normal((N, N)), N/14); noise /= noise.std()
fine  = gaussian_filter(rng.standard_normal((N, N)), N/60); fine /= fine.std()
r = np.hypot(x/0.40, y/0.30) + 0.10*noise + 0.03*fine
sea = r > 1.0
sea[0,:]=sea[-1,:]=sea[:,0]=sea[:,-1]=True
U = np.where(sea, 0.0, 1e-3 * np.clip((1.0 - r) / 0.6, 0, 1)**0.8)
Kbase = float(os.environ.get("K", 1e-5))
h = np.where(sea, 0.0, rng.random((N, N)) * 2.0 + 6*np.clip(1-r,0,1) + 3*fine)
cum = np.zeros((N, N))          # how far the rock now at the surface has been lifted

# Strata: beds dipping toward the SE. A bed's depth coordinate is the rock's
# original elevation (h - cum) plus a tilt; hard beds are 0.3x as erodible.
dip = float(os.environ.get("DIP", 0.06))          # m of bed drop per m horizontal
thick = float(os.environ.get("THICK", 220.0))     # m per bed couplet
along = (x*0.7 + y*0.7) * N * land.dx              # metres along dip direction
warp = gaussian_filter(rng.standard_normal((N, N)), N/8); warp = warp/warp.std()*40
def erodibility():
    z = (h - cum) + dip*along + warp
    ph = (z / thick) % 1.0
    return np.where(ph < 0.32, 0.3*Kbase, Kbase)

up, down = int(os.environ.get("UP", 3000)), int(os.environ.get("DOWN", 15000))
every = int(os.environ.get("EVERY", 25))
iso = float(os.environ.get("ISO", 0.8))
out = os.environ.get("OUT", "frames2"); os.makedirs(out, exist_ok=True)
np.save(f"{out}/sea.npy", sea)
t0 = time.time()
for s in range(up + down + 1):
    Uu = U if s < up else 0.0*U
    isos = iso if s >= up else 0.0
    K = erodibility()
    before = h + Uu*land.dt
    A, rec = land.step(h, Uu, K, land.dt, 1e-4, land.D, sea)
    cum += Uu*land.dt
    # local isostasy, flexurally smoothed: erosion unloads the crust, it floats up
    e = np.where(sea, 0.0, before - h)
    reb = isos * gaussian_filter(e, 40)
    reb[sea] = 0
    h += reb; cum += reb
    if s % every == 0:
        np.savez_compressed(f"{out}/f{s:05d}.npz", h=h.astype(np.float32), A=A.astype(np.float32),
                            hard=(K < Kbase).astype(np.uint8))
    if s % 500 == 0:
        print(s, f"{s*land.dt/1e6:.1f} Myr", f"max {h.max():.0f} m", f"mean {h[~sea].mean():.0f} m", f"{time.time()-t0:.0f}s", flush=True)
