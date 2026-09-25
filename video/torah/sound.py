#!/usr/bin/env python3
"""Documentary bed: room tone, a slow open-fifth drone that shifts root per scene and ducks under the voice,
a soft paper-swell at scene changes, low bells at the title / 'They kept both' / end; then the VO lines."""
import json, subprocess, pathlib, numpy as np
def mavg(x, k):
    c = np.cumsum(np.concatenate([[0.0], x])); y = (c[k:] - c[:-k]) / k
    pad = len(x) - len(y); return np.concatenate([np.full(pad // 2, y[0]), y, np.full(pad - pad // 2, y[-1])])
D = pathlib.Path(__file__).parent; T = json.load(open(D/'timing.json'))
SR = 48000; TOTAL = T['total']; N = int(TOTAL*SR); t = np.arange(N)/SR; rng = np.random.default_rng(3)
def ss(a, b, x): y = np.clip((x-a)/(b-a), 0, 1); return y*y*(3-2*y)
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1/SR); X[(f < lo) | (f > hi)] = 0; y = np.fft.irfft(X, len(x)); return y/(np.abs(y).max()+1e-9)
L = np.zeros(N); R = np.zeros(N)
def add(sig, at=0.0, g=1.0, pan=0.0):
    i = int(at*SR); j = min(N, i+len(sig))
    if j > i: s = sig[:j-i]*g; L[i:j] += s*(1-max(0, pan)); R[i:j] += s*(1+min(0, pan))
def load(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(p), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)
# voice envelope for ducking
venv = np.zeros(N)
for v in T['vo']:
    a = int(v['at']*SR); d = load(D/'vo'/v['file']); venv[a:a+len(d)] = 1
venv = mavg(venv, int(0.4*SR))
duck = 1 - 0.45*venv
# room tone
br = np.cumsum(rng.standard_normal(N)); br -= mavg(br, 9600); br /= np.abs(br).max()
add(br*0.035)
# drone: root per scene, crossfaded
roots = {'open': 73.42, 'title': 73.42, 'tradition': 65.41, 'names': 73.42, 'creation': 87.31, 'doublets': 77.78, 'flood': 65.41,
         'sources': 73.42, 'history': 58.27, 'modern': 65.41, 'consensus': 87.31, 'close': 73.42, 'end': 73.42}
sc = T['scenes']; drone = np.zeros(N)
for name, r in roots.items():
    w = ss(sc[name]['a'], sc[name]['a']+2.5, t)*(1-ss(sc[name]['b']-1.0, sc[name]['b']+1.5, t))
    if not w.any(): continue
    tone = np.zeros(N)
    for mult, amp in [(1, 1.0), (1.5, 0.55), (2, 0.4), (3, 0.12)]:
        for det in (-0.25, 0.25): tone += amp*np.sin(2*np.pi*(r*mult+det)*t + rng.random()*6.28)
    drone += tone*w
lfo = 0.75 + 0.25*np.sin(2*np.pi*t/23)
add(drone*0.016*lfo*duck*(1-ss(TOTAL-3, TOTAL, t))*ss(0, 3, t))
# paper swells at scene starts
for name, w in sc.items():
    if name in ('open',): continue
    n = int(1.6*SR); tb = np.arange(n)/SR
    add(band(rng.standard_normal(n), 300, 5000)*np.exp(-((tb-0.7)/0.35)**2), w['a']-0.2, 0.022, pan=rng.uniform(-0.3, 0.3))
def bell(at, f=220, g=0.06):
    n = int(5*SR); tb = np.arange(n)/SR
    add((np.sin(2*np.pi*f*tb) + 0.5*np.sin(2*np.pi*f*2.01*tb) + 0.2*np.sin(2*np.pi*f*3.02*tb))*np.exp(-tb/1.6), at, g)
bell(sc['title']['a']+0.6, 146.83); bell(T['lines']['close'][1]['s']-0.1, 146.83, 0.07); bell(sc['end']['a']+0.3, 110, 0.05)
for v in T['vo']:
    d = load(D/'vo'/v['file']); add(d/max(1e-6, np.abs(d).max())*0.8, v['at'])
m = np.stack([L, R], 1); m /= max(1.0, np.abs(m).max()/0.95)
(m*32767).astype(np.int16).tofile(D/'mix.raw')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', str(D/'mix.raw'), str(D/'mix.wav')], check=True)
(D/'mix.raw').unlink(); print('mix.wav', TOTAL)
