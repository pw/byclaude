"""One bell, struck once.

A church bell is not a string. Its partials are not a harmonic series, and
the note you hear (the strike note) is mostly a virtual pitch: the brain
hears the nominal, superquint and octave-nominal (~2:3:4) and infers a
fundamental an octave below the nominal. There is a partial near there too,
the prime, but it isn't what you're hearing.

The minor-third tierce is why bells sound the way they do.

Each mode of a real bell is a doublet: two nearly equal frequencies, because
the bell isn't perfectly round. Struck, the doublet beats. That's the warble
in a hum note that dies away.
"""
import numpy as np

SR = 48000

# (name, ratio to nominal, relative amplitude at strike, T60 seconds for a ~5 cwt bell)
PARTIALS = [
    ("hum",          0.250, 0.22, 26.0),
    ("prime",        0.500, 0.32, 14.0),
    ("tierce",       0.600, 0.60, 11.0),   # minor third above the prime
    ("quint",        0.750, 0.18,  7.0),
    ("nominal",      1.000, 1.00,  6.5),
    ("superquint",   1.495, 0.55,  3.2),
    ("octave nom.",  1.990, 0.40,  2.0),
    ("upper 1",      2.530, 0.22,  1.1),
    ("upper 2",      3.050, 0.16,  0.7),
    ("upper 3",      3.620, 0.10,  0.45),
    ("upper 4",      4.220, 0.06,  0.30),
]


def make_bell(nominal_hz, size=1.0, seed=0, detune=None):
    """Return a bell: a list of (freq_a, freq_b, mix, amp, t60) per partial.

    size scales decay (bigger bell rings longer). detune: dict of name->cents,
    the individual faults of an old bell cast before anyone tuned the hum.
    """
    rng = np.random.default_rng(seed)
    detune = detune or {}
    modes = []
    for name, ratio, amp, t60 in PARTIALS:
        cents = detune.get(name, 0.0) + rng.normal(0, 4)
        f = nominal_hz * ratio * 2 ** (cents / 1200)
        # doublet split grows with frequency; a fraction of a Hz on the hum
        split = f * rng.uniform(0.0006, 0.0018)
        mix = rng.uniform(0.25, 0.75)   # how the strike point excites the pair
        modes.append((f - split / 2, f + split / 2, mix, amp * rng.uniform(0.85, 1.15), t60 * size))
    # above the named partials a bell has dozens more, crowded and inharmonic,
    # that last a fraction of a second: that's the clang, the bronze in it
    for _ in range(44):
        r = rng.uniform(2.2, 8.0)
        f = nominal_hz * r
        split = f * rng.uniform(0.001, 0.003)
        modes.append((f - split / 2, f + split / 2, rng.uniform(0.2, 0.8),
                      0.34 * r ** -0.8 * rng.uniform(0.3, 1.4), 0.55 / r ** 0.7 * size))
    return modes


def strike(modes, dur, force=1.0, hardness=1.0, seed=0, lie=None):
    """Sound of one blow, `dur` seconds long.

    lie: (seconds after the blow, damping factor). In full-circle ringing the
    clapper doesn't bounce away: it rides round with the bell and lies on the
    soundbow, which damps the ring. That's what keeps change ringing crisp.
    """
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for fa, fb, mix, amp, t60 in modes:
        if fa > SR / 2.2:
            continue
        # a harder or heavier blow throws more energy into the upper modes
        lift = (fa / modes[4][0]) ** (0.35 * (hardness * force - 1.0))
        a = amp * force * lift
        tau = t60 / 6.91
        m = min(n, int(1.3 * t60 * SR) + 1)      # past 1.3 x T60 it's below -90 dB
        tm = t[:m]
        env = np.exp(-tm / tau)
        if lie is not None:
            tc, damp = lie
            # damping bites hardest on the upper modes, least on the hum
            d = 1 + (damp - 1) * min(1.0, (fa / modes[4][0]) ** 0.5 + 0.3)
            late = tm > tc
            env[late] = np.exp(-tc / tau) * np.exp(-(tm[late] - tc) * d / tau)
        ph1, ph2 = rng.uniform(0, 2 * np.pi, 2)
        # the clapper never lands on exactly the same spot twice, so the two
        # halves of each doublet are never excited in quite the same mix
        mix = float(np.clip(mix + rng.normal(0, 0.12), 0.05, 0.95))
        a *= rng.uniform(0.85, 1.15)
        out[:m] += a * env * (mix * np.sin(2 * np.pi * fa * tm + ph1)
                              + (1 - mix) * np.sin(2 * np.pi * fb * tm + ph2))
    # the clapper itself: a few ms of bright noise as metal meets metal...
    k = int(0.010 * SR)
    kk = np.arange(k)
    clank = rng.normal(0, 1, k) * np.exp(-kk / (0.0018 * SR))
    clank = np.convolve(clank, np.ones(2) / 2, mode="same")
    out[:k] += 0.9 * force * hardness * clank
    # ...and the thud of its mass: a dull knock that is over in a few tens of ms
    kt = int(0.09 * SR)
    tt = np.arange(kt) / SR
    fq = 210 / max(modes[4][0] / 1000, 0.5) ** 0.5
    thud = np.sin(2 * np.pi * fq * tt) * np.exp(-tt / 0.018)
    thud += 0.5 * np.convolve(rng.normal(0, 1, kt), np.ones(24) / 24, mode="same") * np.exp(-tt / 0.010)
    out[:kt] += 0.55 * force * thud
    # contact: the clapper sits on the bell for ~1 ms, softening the onset
    ramp = int(0.0015 * SR)
    out[:ramp] *= np.linspace(0, 1, ramp)
    return out
