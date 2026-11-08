#!/usr/bin/env python3
"""mix.py <cut_dir> — soundtrack for the marinara film: VO (cut_dir/vo.wav) + a plucked-mandolin music bed that ducks
under the voice + synthesized foley from timing.json cues. Writes <cut_dir>/mix.wav and <cut_dir>/soundtrack.m4a
(render.py then muxes soundtrack.m4a untouched)."""
import json, sys, wave, subprocess, pathlib
import numpy as np
D = pathlib.Path(sys.argv[1]); T = json.load(open(D / 'timing.json'))
SR = 48000; TOTAL = float(T['total']); N = int(TOTAL * SR) + SR; t = np.arange(N) / SR
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)
def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR); j = min(N, i + len(sig))
    if j <= i or i < 0: return
    s = sig[: j - i] * gain; L[i:j] += s * (1 - max(0, pan)); R[i:j] += s * (1 + min(0, pan))
def tb(d): return np.arange(int(d * SR)) / SR
from scipy.signal import lfilter
def lp(x, a):  # one-pole low-pass, a in (0,1): smaller = darker
    return lfilter([a], [1, -(1 - a)], x)
def mavg(x, k):
    c = np.cumsum(np.r_[0, x]); y = (c[k:] - c[:-k]) / k; pad = len(x) - len(y); return np.r_[np.full(pad // 2, y[0]), y, np.full(pad - pad // 2, y[-1])]
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X[(f < lo) | (f > hi)] = 0; y = np.fft.irfft(X, len(x)); return y / (np.abs(y).max() + 1e-9)

# ---------- voice ----------
w = wave.open(str(D / 'vo.wav')); vo = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768; vsr = w.getframerate()
vo48 = np.interp(np.arange(0, len(vo), vsr / SR), np.arange(len(vo)), vo)
voice = np.zeros(N); voice[:len(vo48)] = vo48[:N]
# ducking envelope from the voice
env = np.abs(voice); k = int(0.02 * SR); env = mavg(env, k)
act = (env > 0.01).astype(float); sm = int(0.35 * SR); act = mavg(act, sm); act = np.clip(act * 1.6, 0, 1)
duck = 1 - 0.7 * act

# ---------- music: Karplus-Strong mandolin, tremolo on long notes ----------
def pluck(freq, dur, bright=0.5, seed=0):
    n = int(dur * SR); p = int(SR / freq); r = np.random.default_rng(seed)
    buf = r.uniform(-1, 1, p); buf = lp(buf, bright)
    # Karplus-Strong as an IIR: y[n] = x[n] + .498*(y[n-p] + y[n-p-1]), excited by one period of filtered noise
    x = np.zeros(n); x[:p] = buf; a = np.zeros(p + 2); a[0] = 1; a[p] = -0.498; a[p + 1] = -0.498
    out = lfilter([1.0], a, x)
    return out * np.exp(-np.arange(n) / SR / 1.4)
NOTE = lambda m: 440 * 2 ** ((m - 69) / 12)
BPM = 100; beat = 60 / BPM; bar = 4 * beat
chords = [[53, 57, 60, 65], [50, 57, 62, 65], [46, 53, 58, 62], [48, 55, 60, 64]]   # F  Dm  Bb  C
cache = {}
def pl(m, dur, br, sd):
    key = (m, round(dur, 2), br, sd % 4)
    if key not in cache: cache[key] = pluck(NOTE(m), dur, br, sd)
    return cache[key]
music = np.zeros(N)
hero0, hero1 = T['music']['heroAt'], T['music']['heroEnd']
nb = int(TOTAL / bar) + 2
for b in range(nb):
    t0 = b * bar
    if t0 > TOTAL: break
    ch = chords[b % 4]
    in_hero = hero0 - 0.2 <= t0 < hero1 - 0.5
    if in_hero:   # hero: sustained tremolo chord, softer
        for m in ch[1:]:
            for k in range(16):
                s = pl(m + 12, 0.5, 0.35, k); i = int((t0 + k * beat / 4) * SR); j = min(N, i + len(s)); i = min(i, j); music[i:j] += s[: j - i] * 0.10
        continue
    pattern = [0, 2, 1, 3, 2, 1, 3, 2] if b % 2 == 0 else [0, 2, 3, 2, 1, 2, 3, 1]
    for k, ix in enumerate(pattern):
        s = pl(ch[ix] + 12, 1.2, 0.55, b * 8 + k); i = int((t0 + k * beat / 2) * SR); j = min(N, i + len(s)); i = min(i, j); music[i:j] += s[: j - i] * (0.28 if k % 2 == 0 else 0.2)
    s = pl(ch[0] - 12, 2.0, 0.3, b); i = int(t0 * SR); j = min(N, i + len(s)); i = min(i, j); music[i:j] += s[: j - i] * 0.45     # bass
    s = pl(ch[0] - 5, 1.6, 0.3, b + 1); i = int((t0 + 2 * beat) * SR); j = min(N, i + len(s)); i = min(i, j); music[i:j] += s[: j - i] * 0.3
music /= (np.abs(music).max() + 1e-9)
mfade = np.minimum(1, t / 1.0) * np.clip((TOTAL + 0.3 - t) / 1.5, 0, 1)
mlevel = np.interp(t, [0, hero0 - 0.3, hero0 + 0.5, hero1 - 0.4, hero1 + 0.4, TOTAL + 1], [0.95, 0.95, 0.75, 0.85, 1.0, 1.0])
music *= 0.42 * duck * mfade * mlevel
add(music, 0, 1.0, 0)

# ---------- foley ----------
def sfx(k, dur=None):
    if k == 'whoosh':
        a = tb(0.6); x = rng.standard_normal(len(a)); y = lp(x, 0.04) * (1 - a / 0.6) + lp(x, 0.2) * (a / 0.6) * 0.5
        return y / (np.abs(y).max() + 1e-9) * np.sin(np.pi * a / 0.6) ** 2 * 0.10
    if k == 'swish':
        a = tb(0.3); return band(rng.standard_normal(len(a)), 900, 5000) * np.sin(np.pi * a / 0.3) ** 2 * 0.035
    if k == 'pop':
        a = tb(0.12); f = 900 * np.exp(-a * 25) + 300; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-a / 0.03) * 0.09
    if k == 'splash':
        a = tb(0.9); return band(rng.standard_normal(len(a)), 1200, 6000) * np.exp(-a / 0.2) * 0.035
    if k == 'glug':
        out = np.zeros(int(0.8 * SR))
        for i in range(4):
            a = tb(0.12); f = 220 + 140 * a / 0.12 + i * 25; s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * a / 0.12) * 0.08; st = int(i * 0.17 * SR); out[st:st + len(s)] += s
        return out
    if k == 'rub':
        a = tb(1.6); x = band(rng.standard_normal(len(a)), 1500, 7000); return x * (0.5 + 0.5 * np.sin(2 * np.pi * 5.7 * a)) ** 2 * np.sin(np.pi * a / 1.6) * 0.035
    if k == 'beep':
        out = np.zeros(int(0.5 * SR))
        for i in range(3): a = tb(0.07); s = np.sin(2 * np.pi * 2100 * a) * 0.035; st = int(i * 0.13 * SR); out[st:st + len(s)] += s
        return out
    if k == 'hum':
        a = tb(dur); return (np.sin(2 * np.pi * 120 * a) * 0.5 + np.sin(2 * np.pi * 60 * a) + 0.3 * band(rng.standard_normal(len(a)), 80, 400)) * np.minimum(1, a / 0.2) * np.minimum(1, (dur - a) / 0.2) * 0.018
    if k == 'ding':
        a = tb(1.8); return sum(np.sin(2 * np.pi * f * a) * g * np.exp(-a / d) for f, g, d in [(1318, 1, 0.6), (2637, 0.4, 0.3), (3960, 0.2, 0.15)]) * 0.05
    if k == 'shake':
        out = np.zeros(int(0.9 * SR))
        for i in range(6): a = tb(0.06); s = band(rng.standard_normal(len(a)), 2500, 9000) * np.exp(-a / 0.02) * 0.05; st = int(i * 0.13 * SR); out[st:st + len(s)] += s
        return out
    if k in ('stir', 'scrape'):
        d = 1.2 if k == 'stir' else 1.0; a = tb(d); x = band(rng.standard_normal(len(a)), 200, 1600); return x * np.sin(np.pi * a / d) * (0.6 + 0.4 * np.sin(2 * np.pi * 2.2 * a)) * 0.03
    if k == 'sizzle':
        a = tb(dur); x = band(rng.standard_normal(len(a)), 2500, 11000); crack = (rng.random(len(a)) > 0.9993) * rng.standard_normal(len(a)) * 4
        return (x * 0.5 + band(crack, 1500, 9000) * 0.5) * np.minimum(1, a / 0.4) * np.minimum(1, (dur - a) / 0.5) * 0.022
    if k == 'hiss':
        a = tb(1.4); return band(rng.standard_normal(len(a)), 1800, 10000) * np.minimum(1, a / 0.05) * np.exp(-a / 0.45) * 0.07
    if k == 'shimmer':
        out = np.zeros(int(3.5 * SR))
        for i, m in enumerate([77, 81, 84, 88, 89, 93]):
            a = tb(2.2); s = (np.sin(2 * np.pi * NOTE(m) * a) + 0.3 * np.sin(2 * np.pi * NOTE(m) * 2.01 * a)) * np.exp(-a / 0.7) * 0.022; st = int(i * 0.16 * SR); out[st:st + len(s)] += s
        return out
    return np.zeros(10)
for cu in T['cues']:
    s = sfx(cu['k'], cu.get('dur'))
    add(s, cu['t'], cu.get('gain', 1.0), rng.uniform(-0.3, 0.3))

# room tone + voice on top
br = np.cumsum(rng.standard_normal(N)); br -= mavg(br, 4800); br /= np.abs(br).max()
add(br * 0.006, 0)
L += voice * 0.9; R += voice * 0.9
mix = np.stack([L, R], 1)[: int(TOTAL * SR)]
mix /= max(1.0, np.abs(mix).max() / 0.97)
with wave.open(str(D / 'mix.wav'), 'wb') as o:
    o.setnchannels(2); o.setsampwidth(2); o.setframerate(SR); o.writeframes((mix * 32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(D / 'mix.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', str(D / 'soundtrack.m4a')], check=True)
print('mix ok', round(TOTAL, 2))
