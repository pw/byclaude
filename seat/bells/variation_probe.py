"""Can the borrowed ear hear per-blow variation at all? Three 20 s clips of
rounds: none / current / exaggerated. Rated separately and blind."""
import sys, wave, numpy as np
import bell, ring
from bell import SR

level = sys.argv[1]            # none | current | big
blows, rows = ring.schedule()
blows = [b for b in blows if b[0] < 24.0]
if level == "none":
    blows = [(w, b, 1.0, i, h) for (w, b, f, i, h) in blows]
    ring.FACE[:] = [0] * 6
    orig = bell.strike
    def flat(*a, **k):
        k["seed"] = 1           # same strike point and phases every blow
        return orig(*a, **k)
    ring.strike = flat
elif level == "big":
    rng = np.random.default_rng(5)
    blows = [(w, b, float(np.clip(rng.normal(1, 0.35), 0.35, 1.9)), i, h) for (w, b, f, i, h) in blows]
    ring.FACE[:] = [2 * x for x in ring.FACE]
x = ring.render(blows, tail=4.0)
x = x / np.abs(x).max() * 0.8
from scipy import signal
b_, a_ = signal.butter(1, 6000 / (SR / 2)); x = signal.lfilter(b_, a_, x)
pcm = (np.stack([x, x], 1) * 32767).astype("<i2")
with wave.open(f"probe_{level}.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(level, len(blows))
