# An island that rises out of the sea and is carved by rain.
# Stream-power incision (implicit, Braun & Willett 2013) + hillslope diffusion
# + uplift. Lakes silt up instantly (depression filling). No people.
import numpy as np, numba as nb, sys, os

N = int(os.environ.get("N", 384))
dx = 100.0          # m
dt = 1000.0         # yr
m  = 0.5
D  = float(__import__("os").environ.get("DIFF", 0.3))   # m^2/yr hillslope diffusion

D8 = np.array([(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)], dtype=np.int64)
DIST = np.array([np.hypot(a,b) for a,b in D8]) * dx

@nb.njit(cache=True)
def fill(h, eps, sea):
    # priority-flood with epsilon (Barnes 2014), boundary = sea, fixed
    n0, n1 = h.shape
    f = h.copy()
    closed = np.zeros(h.shape, np.bool_)
    # binary heap on (elev, idx)
    cap = n0*n1
    he = np.empty(cap); hi = np.empty(cap, np.int64); sz = 0
    for i in range(n0):
        for j in range(n1):
            if sea[i,j]:
                closed[i,j] = True
                # push
                k = sz; sz += 1; he[k] = f[i,j]; hi[k] = i*n1+j
                while k > 0:
                    p = (k-1)//2
                    if he[p] <= he[k]: break
                    he[p],he[k] = he[k],he[p]; hi[p],hi[k] = hi[k],hi[p]; k = p
    order = np.empty(cap, np.int64); no = 0
    while sz > 0:
        e = he[0]; c = hi[0]
        sz -= 1; he[0] = he[sz]; hi[0] = hi[sz]
        k = 0
        while True:
            l = 2*k+1; r = l+1; s = k
            if l < sz and he[l] < he[s]: s = l
            if r < sz and he[r] < he[s]: s = r
            if s == k: break
            he[s],he[k] = he[k],he[s]; hi[s],hi[k] = hi[k],hi[s]; k = s
        order[no] = c; no += 1
        ci = c // n1; cj = c % n1
        for d in range(8):
            ni = ci + D8[d,0]; nj = cj + D8[d,1]
            if ni < 0 or nj < 0 or ni >= n0 or nj >= n1: continue
            if closed[ni,nj]: continue
            closed[ni,nj] = True
            if f[ni,nj] <= f[ci,cj] + eps:
                f[ni,nj] = f[ci,cj] + eps
            k = sz; sz += 1; he[k] = f[ni,nj]; hi[k] = ni*n1+nj
            while k > 0:
                p = (k-1)//2
                if he[p] <= he[k]: break
                he[p],he[k] = he[k],he[p]; hi[p],hi[k] = hi[k],hi[p]; k = p
    return f, order   # order: outlets first, upward

@nb.njit(cache=True)
def step(h, U, K, dt, eps, D, sea):
    n0, n1 = h.shape
    # uplift (interior)
    for i in range(n0):
        for j in range(n1):
            if not sea[i,j]: h[i,j] += U[i,j]*dt
    f, order = fill(h, eps, sea)
    h[:,:] = f   # lakes silt up
    n = n0*n1
    rec = np.empty(n, np.int64); rd = np.empty(n)
    for c in range(n):
        ci = c // n1; cj = c % n1
        rec[c] = c; rd[c] = 1.0
        if sea[ci,cj]: continue
        best = 0.0
        for d in range(8):
            ni = ci + D8[d,0]; nj = cj + D8[d,1]
            if ni < 0 or nj < 0 or ni >= n0 or nj >= n1: continue
            s = (h[ci,cj] - h[ni,nj]) / DIST[d]
            if s > best:
                best = s; rec[c] = ni*n1+nj; rd[c] = DIST[d]
    A = np.full(n, dx*dx)
    for k in range(n-1, -1, -1):
        c = order[k]
        if rec[c] != c: A[rec[c]] += A[c]
    hf = h.ravel()
    Kf = K.ravel()
    for k in range(n):
        c = order[k]
        r = rec[c]
        if r == c: continue
        F = Kf[c] * dt * A[c]**0.5 / rd[c]
        new = (hf[c] + F*hf[r]) / (1.0 + F)
        if new < hf[r] + 1e-9: new = hf[r] + 1e-9
        hf[c] = new
    # hillslope diffusion (explicit)
    if D > 0:
        g = h.copy()
        a = D*dt/(dx*dx)
        for i in range(1, n0-1):
            for j in range(1, n1-1):
                if sea[i,j]: continue
                h[i,j] = g[i,j] + a*(g[i+1,j]+g[i-1,j]+g[i,j+1]+g[i,j-1]-4*g[i,j])
    return A.reshape(n0, n1), rec

if __name__ == "__main__":
    pass
