import numpy as np, os, sys, time
from scipy.ndimage import gaussian_filter
import land

N = land.N; rng = np.random.default_rng(int(os.environ.get("SEED", 7)))
y, x = np.mgrid[0:N, 0:N] / N - 0.5
# island footprint: an ellipse roughened by smooth noise
noise = gaussian_filter(rng.standard_normal((N, N)), N/14); noise /= noise.std()
fine  = gaussian_filter(rng.standard_normal((N, N)), N/60); fine /= fine.std()
r = np.hypot(x/0.40, y/0.30) + 0.10*noise + 0.03*fine
sea = r > 1.0
sea[0,:]=sea[-1,:]=sea[:,0]=sea[:,-1]=True
U = np.where(sea, 0.0, 1e-3 * np.clip((1.0 - r) / 0.25, 0, 1)**0.5)
K = np.full((N, N), 2e-5)
h = np.where(sea, 0.0, rng.random((N, N)) * 0.5)

steps_up, steps_down = int(os.environ.get("UP", 4000)), int(os.environ.get("DOWN", 6000))
every = int(os.environ.get("EVERY", 25))
out = os.environ.get("OUT", "frames"); os.makedirs(out, exist_ok=True)
np.save(f"{out}/sea.npy", sea)
t0 = time.time()
for s in range(steps_up + steps_down + 1):
    Uu = U if s < steps_up else U*0.0
    A, rec = land.step(h, Uu, K, land.dt, 1e-4, land.D, sea)
    if s % every == 0:
        np.savez_compressed(f"{out}/f{s:05d}.npz", h=h.astype(np.float32), A=A.astype(np.float32))
    if s % 500 == 0:
        print(s, f"{s*land.dt/1e6:.1f} Myr", f"max {h.max():.0f} m", f"mean {h[~sea].mean():.0f} m", f"{time.time()-t0:.0f}s", flush=True)
