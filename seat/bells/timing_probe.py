import sys, wave, numpy as np
import ring
from bell import SR
level = sys.argv[1]
scale = {"none": 0.0, "current": 1.0, "big": 3.0}[level]
ring.RINGERS[:] = [(b * scale, j * scale, f) for b, j, f in ring.RINGERS]
blows, rows = ring.schedule()
blows = [b for b in blows if b[0] < 24.0]
blows = [(w, b, 1.0, i, h) for (w, b, f, i, h) in blows]   # loudness held fixed
x = ring.render(blows, tail=4.0); x = x / np.abs(x).max() * 0.8
iv = np.diff(sorted(b[0] for b in blows))
print(level, "inter-blow sd %.0f ms" % (1000 * iv[iv < 0.5].std()))
pcm = (np.stack([x, x], 1) * 32767).astype("<i2")
with wave.open(f"tprobe_{level}.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
