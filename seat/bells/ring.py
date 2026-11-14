"""Six bells, six ringers, one touch of Plain Bob Doubles (the 120), tenor behind.

Ringers don't strike to a clock. Each one watches the rope of the bell they
follow and places their blow after it, so a late bell drags the next one,
and the band pulls itself back to an even rhythm over a few blows. Every
row at handstroke has a gap before it, one beat of silence (the "open
handstroke lead"), because the bells pause at the top of their swing.
"""
import json
import numpy as np
from method import touch
from bell import SR, make_bell, strike

STRIKE_NOTES = [659.26, 587.33, 523.25, 493.88, 440.00, 392.00]   # E D C B A G
SIZE = [0.62, 0.70, 0.80, 0.88, 1.02, 1.30]
# the faults of an old ring: hums and tierces cast where they fell (cents)
FAULTS = [
    {"hum": +38, "tierce": +12},
    {"hum": -22, "prime": +15},
    {"hum": +61, "tierce": -18, "quint": +20},
    {"hum": -9},
    {"hum": +27, "prime": -21},
    {"hum": -44, "tierce": +9},
]
# ringer: (bias s, jitter s, follow weight) -- the 3rd is ringing her first quarter
RINGERS = [
    (-0.004, 0.016, 0.55),
    (+0.006, 0.019, 0.60),
    (+0.018, 0.042, 0.75),
    (-0.002, 0.016, 0.55),
    (+0.003, 0.020, 0.60),
    (+0.000, 0.012, 0.45),   # tenor ringer: forty years, steady as a wall
]
# which way each bell's mouth faces the louvres at handstroke (+) or backstroke (-):
# a bell sounds brighter and louder through the louvres on the stroke it faces them
FACE = [+1, -1, +1, +1, -1, -1]


def schedule(seed=1, gap=0.29):
    rng = np.random.default_rng(seed)
    method = [r + [6] for r in touch("pppbpppbpppb")]
    rounds = [[1, 2, 3, 4, 5, 6]]
    rows = rounds * 10 + method[1:-1] + rounds * 8     # method[0] and [-1] are rounds
    # "Go" is called in rounds; the 120 ends back in rounds ("That's all")
    blows = []
    t = 4.0
    prev = None
    tempo = gap
    for i, row in enumerate(rows):
        hand = i % 2 == 0
        if hand and i > 0:
            t += tempo                # the handstroke gap
        tempo += rng.normal(0, 0.0012)            # the band's pace wanders...
        tempo += 0.08 * (gap - tempo)             # ...and is pulled back
        for pos, b in enumerate(row):
            bias, jit, follow = RINGERS[b - 1]
            grid = t + tempo
            if prev is not None:
                # the bell after the handstroke gap waits two beats, not one
                beats = 2 if (hand and pos == 0) else 1
                aim = follow * (prev + beats * tempo) + (1 - follow) * grid
            else:
                aim = grid
            # handstrokes run a hair quick; a learner is worse at backstroke
            stroke = -0.004 if hand else (0.006 if b == 3 else 0.0)
            when = aim + bias + stroke + rng.normal(0, jit)
            force = float(np.clip(rng.normal(1.0, 0.25 if b != 3 else 0.33), 0.4, 1.7))
            blows.append((when, b, force, i, hand))
            prev = when
            t = grid
    return blows, rows


def _render_bell(args):
    b, blows, end, seed = args
    k = b - 1
    bell = make_bell(2 * STRIKE_NOTES[k], size=SIZE[k], seed=100 + k, detune=FAULTS[k])
    out = np.zeros(int(end * SR) + SR, dtype=np.float32)
    rng = np.random.default_rng(seed + b)
    mine = [x for x in blows if x[1] == b]
    for j, (when, _, force, _, hand) in enumerate(mine):
        again = mine[j + 1][0] if j + 1 < len(mine) else None
        i0 = int(when * SR)
        # the bell is still sounding when it's struck again; the clapper
        # lies on the soundbow after each blow and damps it
        dur = (again - when + 3.0) if again else 15.0 * SIZE[k] + 3
        dur = min(dur, end - when)
        lie = (0.16, 5.0) if again else (0.25, 2.0)   # stood at the end: held, but it hangs a moment
        face = FACE[k] * (1 if hand else -1)
        s = strike(bell, dur, force=force, hardness=1 + 0.25 * face,
                   seed=int(rng.integers(1 << 30)), lie=lie)
        s *= force ** 0.6 * (1 + 0.3 * face)   # a heavy pull sounds louder than linear
        if again:
            k0 = int((again - when) * SR)
            s[k0:] *= 0.6 * np.exp(-np.arange(len(s) - k0) / (1.2 * SR))
        out[i0:i0 + len(s)] += s * (0.75 + 0.05 * b)
    return out


def render(blows, tail=16.0, seed=2):
    from multiprocessing import Pool
    end = max(b[0] for b in blows) + tail
    with Pool(6) as p:
        parts = p.map(_render_bell, [(b, blows, end, seed) for b in range(1, 7)])
    return np.sum(parts, axis=0)


if __name__ == "__main__":
    blows, rows = schedule()
    print(len(rows), "rows,", len(blows), "blows, last at %.1fs" % blows[-1][0])
    # was every row of the 120 rung exactly once?
    body = rows[10:10 + 120]
    print("distinct rows in the touch:", len({tuple(r) for r in body}))
    json.dump([list(map(float, b[:3])) + [b[3], b[4]] for b in blows],
              open("blows.json", "w"))
    sig = render(blows)
    np.save("dry.npy", sig.astype(np.float32))
    print("dry: %.1f s" % (len(sig) / SR))
