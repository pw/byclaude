#!/usr/bin/env python3
"""Event-driven sound for byclaude motion-design films (no voice). Reads <dir>/timing.json
(what film.html's window.ready returned) and writes <dir>/mix.wav.

Cues (all optional except total), times in seconds:
  tension: [[t, level0..1], ...]  piecewise-linear curve for a low drone (unease). Default flat 0.
  warm:    [[t, level0..1], ...]  piecewise-linear curve for a warm major pad (relief). Default flat 0.
  room:    0..1 room-tone level (default 1).
  events:  [{"t": 4.2, "k": KIND}, ...] with KIND one of
     notif   soft two-note chime (a message arrives)       buzz   phone vibration
     tap     one key tap (draw typing as a run of taps)    del    softer, drier key tap (backspace)
     send    short upward whoosh                           thud   low soft knock (a weight lands)
     tick    clock tick                                    bell   single clear bell (the turn)
     click   UI click / tap on glass
  Each event may carry "gain" (default 1) and "pan" (-1..1).
"""
import json, subprocess, sys, pathlib
import numpy as np
D = pathlib.Path(sys.argv[1]); T = json.load(open(D / 'timing.json'))
SR = 48000; TOTAL = float(T['total']); N = int(TOTAL * SR); t = np.arange(N) / SR
rng = np.random.default_rng(11)
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X[(f < lo) | (f > hi)] = 0; y = np.fft.irfft(X, len(x)); return y / (np.abs(y).max() + 1e-9)
def curve(pts):
    if not pts: return np.zeros(N)
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]; return np.interp(t, xs, ys)
L = np.zeros(N); R = np.zeros(N)
def add(sig, at=0.0, gain=1.0, pan=0.0):
    i = int(at * SR); j = min(N, i + len(sig))
    if j <= i or i < 0: return
    s = sig[: j - i] * gain; L[i:j] += s * (1 - max(0, pan)); R[i:j] += s * (1 + min(0, pan))
fade = np.minimum(1, t / 0.6) * np.minimum(1, (TOTAL - t) / 1.2)
# room tone
br = np.cumsum(rng.standard_normal(N)); br -= np.convolve(br, np.ones(4800) / 4800, 'same'); br /= np.abs(br).max()
add(br * 0.04 * float(T.get('room', 1)) * fade)
# unease drone
ten = curve(T.get('tension'))
drone = np.sin(2*np.pi*55*t) + np.sin(2*np.pi*(55.6 + 2.4*ten)*t) + 0.6*np.sin(2*np.pi*82.4*t) + 0.35*np.sin(2*np.pi*(164.8 + 3*ten)*t)
add(drone * 0.05 * ten * fade)
# warm pad
wm = curve(T.get('warm')); pad = np.zeros(N)
for f, a in [(110, 1.0), (164.81, 0.8), (220, 0.7), (277.18, 0.55), (329.63, 0.5), (440, 0.25)]:
    for det in (-0.35, 0.35): pad += a * np.sin(2*np.pi*(f + det)*t + rng.random()*6.28)
add(pad * 0.024 * wm * fade)
def tb(d): return np.arange(int(d * SR)) / SR
def sfx(k):
    if k == 'notif':
        a = tb(0.5); s = np.sin(2*np.pi*1046.5*a)*np.exp(-a/0.12); b = np.sin(2*np.pi*1568*a)*np.exp(-a/0.18)
        return np.concatenate([s[:int(0.09*SR)], b]) * 0.05
    if k == 'buzz':
        a = tb(0.18); bz = np.sign(np.sin(2*np.pi*170*a)) * np.minimum(1, np.minimum(a, 0.18 - a) / 0.02); bz = band(np.concatenate([bz, np.zeros(1000)]), 80, 900)[:len(a)]
        return np.concatenate([bz, np.zeros(int(0.1*SR)), bz]) * 0.07
    if k in ('tap', 'del', 'click'):
        n = int(0.02 * SR); x = np.diff(rng.standard_normal(n) * np.exp(-np.arange(n) / (80 if k != 'del' else 50)), prepend=0)
        return x * {'tap': 0.035, 'del': 0.028, 'click': 0.045}[k]
    if k == 'send':
        a = tb(0.35); f = 400 + 2200*a/0.35; return band(rng.standard_normal(len(a)), 300, 3000) * np.sin(np.pi*a/0.35)**2 * 0.03 + np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-a/0.1)*0.01
    if k == 'thud':
        a = tb(0.3); return (np.sin(2*np.pi*90*a) + 0.4*band(rng.standard_normal(len(a)), 80, 600)) * np.exp(-a/0.06) * 0.07
    if k == 'tick':
        n = int(0.03*SR); return np.diff(rng.standard_normal(n)*np.exp(-np.arange(n)/(0.004*SR)), prepend=0) * 0.08
    if k == 'bell':
        a = tb(2.5); return (np.sin(2*np.pi*880*a) + 0.5*np.sin(2*np.pi*1320*a) + 0.25*np.sin(2*np.pi*2217*a)) * np.exp(-a/0.7) * 0.05
    raise SystemExit(f'sound.py: unknown event kind {k!r}')
for e in T.get('events', []):
    add(sfx(e['k']), float(e['t']), float(e.get('gain', 1)), float(e.get('pan', 0)))
m = np.stack([L, R], 1); m /= max(1.0, np.abs(m).max() / 0.95)
(m * 32767).astype(np.int16).tofile(D / 'mix.raw')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', str(D / 'mix.raw'), str(D / 'mix.wav')], check=True)
(D / 'mix.raw').unlink(); print('mix.wav', TOTAL, 'events', len(T.get('events', [])))
