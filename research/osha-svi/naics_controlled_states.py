#!/usr/bin/env python3
"""
OSHA SIR — NAICS-controlled state inspection-rate comparison.

The Path A analysis from notes.md. For each federal-OSHA-jurisdiction state:
  - Compute actual inspection rate (rows with Inspection populated)
  - Compute *expected* inspection rate = sum over NAICS-2-digit sectors of
      (state's sector weight) * (national sector inspection rate)
  - Residual = actual - expected.
  - Positive residual: state inspects more than industry mix predicts.
  - Negative residual: state inspects less than industry mix predicts.

This isolates the Area-Director-discretion signal from the obvious industry-mix
confound. If a 30-pt actual-rate spread collapses to ~0 after NAICS control,
the "discretion map" story is dead. If a meaningful spread survives, that's
the publication.

Filtering:
  - FederalState == '1' only (state-plan SIRs in column are federal subsets
    inside state-plan states; we want the cleanest possible comparison)
  - State has >= 500 SIRs (cuts noise from low-volume states)

Output:
  - National sector inspection rates (NAICS 2-digit)
  - Per-state: actual, expected, residual, n
  - Ranked by residual

Run from this directory:
  python3 naics_controlled_states.py
"""

import csv
from collections import defaultdict

CSV_PATH = "January2015toAugust2025.csv"
MIN_STATE_N = 500


def has_inspection(row: dict) -> bool:
    insp = (row.get("Inspection") or "").strip()
    return bool(insp) and insp != "0"


def naics_2(code: str) -> str:
    """NAICS 2-digit sector. NAICS uses 2-3-digit sectors at the top level
    (e.g. 23 Construction, 31-33 Manufacturing, 44-45 Retail, 48-49 Transport).
    Returns first two digits as a string. Caller should treat 31/32/33 etc as
    related but doesn't collapse them — keeping the granularity for accuracy.
    """
    code = (code or "").strip()
    if len(code) < 2:
        return ""
    return code[:2]


def main() -> None:
    # First pass: collect counts per (state, naics2) and national naics2
    state_naics_total: dict[tuple[str, str], int] = defaultdict(int)
    state_naics_insp: dict[tuple[str, str], int] = defaultdict(int)
    naics_total: dict[str, int] = defaultdict(int)
    naics_insp: dict[str, int] = defaultdict(int)
    state_total: dict[str, int] = defaultdict(int)
    state_insp: dict[str, int] = defaultdict(int)
    grand_total = 0
    grand_insp = 0
    federal_skipped = 0

    with open(CSV_PATH, encoding="utf-8", errors="replace") as f:
        for row in csv.DictReader(f):
            if (row.get("FederalState") or "").strip() != "1":
                federal_skipped += 1
                continue
            state = (row.get("State") or "").strip()
            sec = naics_2(row.get("Primary NAICS") or "")
            if not state or not sec:
                continue
            insp = has_inspection(row)
            state_naics_total[(state, sec)] += 1
            naics_total[sec] += 1
            state_total[state] += 1
            grand_total += 1
            if insp:
                state_naics_insp[(state, sec)] += 1
                naics_insp[sec] += 1
                state_insp[state] += 1
                grand_insp += 1

    # National sector inspection rates
    print(f"Federal-jurisdiction SIR rows analyzed: {grand_total:,}")
    print(f"State-plan rows excluded:              {federal_skipped:,}")
    print(f"National inspection rate (federal):    {100*grand_insp/grand_total:.1f}%")
    print()
    print("NATIONAL SECTOR INSPECTION RATES (NAICS 2-digit):")
    print(f"  {'NAICS':6} {'n':>8} {'insp':>8} {'rate':>7}")
    for sec, n in sorted(naics_total.items(), key=lambda x: -x[1]):
        if n < 100:
            continue
        r = 100 * naics_insp[sec] / n
        print(f"  {sec:6} {n:8,} {naics_insp[sec]:8,} {r:6.1f}%")
    print()

    # National sector rates (as float)
    nat_sector_rate = {
        sec: naics_insp[sec] / n for sec, n in naics_total.items() if n > 0
    }

    # Per-state actual + expected
    rows_out = []
    for state, n in state_total.items():
        if n < MIN_STATE_N:
            continue
        actual = state_insp[state] / n
        # Expected: weighted average of national sector rates using state mix
        expected = 0.0
        for sec_n_state in nat_sector_rate:
            cell = state_naics_total.get((state, sec_n_state), 0)
            if cell == 0:
                continue
            weight = cell / n
            expected += weight * nat_sector_rate[sec_n_state]
        residual = actual - expected
        rows_out.append((state, n, actual, expected, residual))

    # Ranked low to high (most-under-inspected states first)
    rows_out.sort(key=lambda r: r[4])

    print(f"PER-STATE (n >= {MIN_STATE_N}, federal-jurisdiction only):")
    print(f"  {'State':25} {'n':>7} {'actual':>8} {'expected':>10} {'residual':>10}")
    for state, n, actual, expected, residual in rows_out:
        print(
            f"  {state:25} {n:7,} {100*actual:7.1f}% {100*expected:9.1f}% "
            f"{100*residual:+9.1f}pp"
        )
    print()

    actuals = [r[2] for r in rows_out]
    residuals = [r[4] for r in rows_out]
    if actuals:
        a_spread = (max(actuals) - min(actuals)) * 100
        r_spread = (max(residuals) - min(residuals)) * 100
        print(f"Spread (max-min):")
        print(f"  actual inspection rate:    {a_spread:.1f} pp")
        print(f"  residual after NAICS ctrl: {r_spread:.1f} pp")
        print()
        print(
            f"Interpretation: if r_spread is close to a_spread, NAICS control "
            f"barely explains the variation → Area Director discretion story is "
            f"strong. If r_spread shrinks to <10pp, the spread was mostly "
            f"industry mix."
        )


if __name__ == "__main__":
    main()
