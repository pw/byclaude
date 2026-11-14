"""Plain Bob Doubles, 120 changes (the extent), with the tenor covering.

Place notation for Plain Bob Doubles: x-type on 5 bells is
  5.1.5.1.5.1.5.1.5.1  (cross = swap pairs leaving one bell),
lead end 125 (plain) / 145 (bob)? We just do it by rule:
  - alternately: swap (1,2)(3,4) keep 5 ;  keep 1 swap (2,3)(4,5)
  - at the lead end (after 10 changes), the treble leads: plain = 12 place
    (keep 1,2, swap 34? no) -- derive from place notation directly.
"""

def apply(row, places):
    """places: set of 1-based positions that stay put; all others swap in pairs."""
    r = list(row); i = 0; n = len(r)
    while i < n:
        if (i + 1) in places:
            i += 1
        else:
            r[i], r[i + 1] = r[i + 1], r[i]; i += 2
    return r

# Plain Bob Doubles: 5.1.5.1.5.1.5.1.5.1 with lead-end 125 (plain) or 145 (bob)
LEAD = [{5}, {1}] * 4 + [{5}]
PLAIN_LE, BOB_LE = {1, 2, 5}, {1, 4, 5}

def touch(calls):
    """calls: list of 'p'/'b' per lead. Returns rows (5 bells), starting at rounds."""
    row = [1, 2, 3, 4, 5]; rows = [row]
    for c in calls:
        for pn in LEAD:
            row = apply(row, pn); rows.append(row)
        row = apply(row, PLAIN_LE if c == 'p' else BOB_LE); rows.append(row)
    return rows

if __name__ == "__main__":
    import itertools
    plain = touch('ppp')
    print("plain course leads:", len(plain) - 1, "comes round:", plain[-1])
    # find a call sequence of 12 leads giving the 120-extent and back to rounds
    best = None
    for calls in itertools.product('pb', repeat=12):
        rows = touch(calls)
        if rows[-1] == [1, 2, 3, 4, 5] and len({tuple(r) for r in rows[:-1]}) == 120:
            best = ''.join(calls); break
    print("extent calls:", best)
