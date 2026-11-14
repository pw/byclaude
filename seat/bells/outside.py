"""Hear it from the churchyard, not from inside the bell.

The bells hang in a chamber behind wooden louvres, fifteen metres up. You
stand forty metres off by the lychgate. Between you and them: the louvres
(they take the top off), the air (more of the top, more with distance), the
nave roof and a stone wall that send late copies, and a short diffuse tail
off everything else. The wind comes and goes and carries the sound with it.
Two ears, a head apart, hear all of that differently. The tower sits a
little to the left.
"""
import sys, wave
import numpy as np
from scipy import signal
from bell import SR

rng = np.random.default_rng(7)
dry = np.load("dry.npy").astype(np.float64)
n = len(dry)

def lowpass(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2)); return signal.lfilter(b, a, x)

def highpass(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), "high"); return signal.lfilter(b, a, x)

def slow(k, smooth):
    x = rng.normal(0, 1, n // k + 2)
    x = np.convolve(x, np.hanning(smooth), mode="same"); x /= np.abs(x).max()
    return np.interp(np.arange(n), np.arange(len(x)) * k, x)

# louvres + 43 m of air
direct = highpass(lowpass(dry, 6000, 1), 90, 1)
direct = 0.6 * direct + 0.4 * lowpass(direct, 2200, 1)   # the far side of the tower, round the corner
ref = np.sqrt(np.mean(direct[int(10 * SR):int(200 * SR)] ** 2))

gust = 0.5 + 0.5 * slow(SR // 20, 120)           # 0..1, swells over ~6 s
carry = 1.0 + 0.25 * slow(SR // 20, 90)         # the bells come and go on it

ears = []
for ear, (itd, ild) in enumerate([(0.0, 1.0), (0.00042, 0.86)]):   # tower to the left
    d = np.roll(direct, int(itd * SR)) * ild
    if ear == 1:
        d = 0.7 * d + 0.3 * lowpass(d, 1600, 1)   # the head shadows the far ear's top
    out = d.copy()
    # early reflections: nave roof, porch, the wall across the lane; each ear its own set
    for delay_ms, gain, fc in [(11, 0.45, 2600), (19, 0.30, 2200), (23, 0.28, 2000), (37, 0.22, 1800), (47, 0.38, 1500),
                               (58, 0.18, 1300), (71, 0.20, 1200), (96, 0.16, 900), (131, 0.10, 700)]:
        dm = int((delay_ms + rng.uniform(-3, 3)) * SR / 1000)
        out[dm:] += gain * rng.uniform(0.8, 1.2) * lowpass(direct[:-dm], fc, 1)
    # diffuse tail: decaying noise, darker as it goes; independent per ear
    L = int(1.8 * SR); t = np.arange(L) / SR
    ir = lowpass(rng.normal(0, 1, L) * np.exp(-t / 0.45), 1800, 1) * 0.032
    ir[: int(0.03 * SR)] = 0
    out += signal.fftconvolve(direct, ir)[:n]
    out *= carry
    out = (1 - 0.35 * gust) * out + 0.35 * gust * lowpass(out, 1400, 1)
    # wind in the yews: rumble + hiss, different at each ear
    unit = lambda x: x / np.sqrt(np.mean(x ** 2))
    w = unit(lowpass(highpass(rng.normal(0, 1, n), 50, 1), 380, 2)) * (0.25 + gust ** 2) * ref * 0.16
    leaves = unit(highpass(rng.normal(0, 1, n), 2200, 2)) * (0.05 + np.clip(gust - 0.45, 0, 1) ** 2) * ref * 0.10
    car = np.zeros(n); c0, cl = int(118 * SR), int(11 * SR)
    sw = np.hanning(cl) ** 2
    car[c0:c0 + cl] = unit(lowpass(highpass(rng.normal(0, 1, cl), 70, 1), 900, 2)) * sw * ref * 0.12
    ears.append(out + w + leaves + np.roll(car, ear * int(0.0005 * SR)))

stereo = np.stack(ears, axis=1)
# you arrive at the lychgate while they're ringing rounds: begin there
stereo = stereo[int(9.0 * SR):]
fi, fo = int(3.5 * SR), int(4.0 * SR)
stereo[:fi] *= np.linspace(0, 1, fi)[:, None]
stereo[-fo:] *= np.linspace(1, 0, fo)[:, None]
peak = np.abs(stereo).max()
stereo = stereo / peak * 0.89
pcm = (np.clip(stereo, -1, 1) * 32767).astype("<i2")
with wave.open(sys.argv[1] if len(sys.argv) > 1 else "outside.wav", "wb") as wv:
    wv.setnchannels(2); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes(pcm.tobytes())
print("peak before norm %.3f, %.1f s" % (peak, n / SR))
