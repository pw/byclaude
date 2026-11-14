"""I can't hear these. So: look at them.

1. One blow of each bell: find its spectral peaks and say which partials
   came out, and where the tierce sits against the prime (should be a
   minor third, ~316 cents).
2. The striking: from blows.json, how even is the rhythm, row by row?
"""
import json
import numpy as np
from bell import SR, make_bell, strike
from ring import STRIKE_NOTES, SIZE, FAULTS

NAMES = ["treble", "2nd", "3rd", "4th", "5th", "tenor"]
for k, (f, s) in enumerate(zip(STRIKE_NOTES, SIZE)):
    b = make_bell(2 * f, size=s, seed=100 + k, detune=FAULTS[k])
    x = strike(b, 4.0, seed=1)[int(0.05 * SR):]
    X = np.abs(np.fft.rfft(x * np.hanning(len(x))))
    fr = np.fft.rfftfreq(len(x), 1 / SR)
    peaks = []
    for name, (fa, fb, *_ ) in zip(["hum", "prime", "tierce", "quint", "nom"], b[:5]):
        m = (fr > fa * 0.97) & (fr < fb * 1.03)
        i = np.argmax(np.where(m, X, 0))
        peaks.append((name, fr[i], 20 * np.log10(X[i] / X.max())))
    hum, prime, tierce = peaks[0][1], peaks[1][1], peaks[2][1]
    print(f"{NAMES[k]:7s} strike {f:6.1f}  " +
          "  ".join(f"{n} {hz:6.1f}Hz {db:+5.1f}dB" for n, hz, db in peaks) +
          f"  | tierce/prime {1200*np.log2(tierce/prime):5.0f}c  hum/prime {1200*np.log2(hum/prime)+1200:+5.0f}c")

bl = json.load(open("blows.json"))
t = np.array([b[0] for b in bl]); rows = np.array([b[3] for b in bl])
iv = []
for r in range(rows.max() + 1):
    tt = np.sort(t[rows == r])
    iv.append(np.diff(tt))
iv = np.concatenate(iv)
print(f"inter-blow: mean {iv.mean()*1000:.0f} ms  sd {iv.std()*1000:.0f} ms  "
      f"min {iv.min()*1000:.0f}  max {iv.max()*1000:.0f}")
# who clips whom: blows closer than 120 ms
print("clashes (<120 ms):", int((iv < 0.12).sum()), "of", len(iv))
