#!/usr/bin/env python3
"""
OSHA SIR — Federal Region aggregates, NAICS-controlled.

OSHA assigns each federal-jurisdiction state to one of 10 regional offices.
This script aggregates the per-state residuals from naics_controlled_states.py
up to the regional level — the cleaner framing if regional enforcement culture
(rather than per-state Area Director) is the real driver.

Regional assignments per OSHA org chart (federal):
  R1 Boston:        CT ME NH MA RI VT
  R2 NYC:           NY NJ
  R3 Philadelphia:  DE DC MD PA VA WV
  R4 Atlanta:       AL FL GA KY MS NC SC TN
  R5 Chicago:       IL IN MI MN OH WI
  R6 Dallas:        AR LA NM OK TX
  R7 Kansas City:   IA KS MO NE
  R8 Denver:        CO MT ND SD UT WY
  R9 San Francisco: AZ CA HI NV  (all state-plan; excluded from federal-only analysis)
  R10 Seattle:      AK ID OR WA

State-plan states (CA, AZ, HI, NV, WA, OR, MI, MN, IN, KY, MD, NC, SC, TN, VT, NM, UT, WY, plus partial)
are partially represented (only federal-employee subsets), so regional federal
totals understate the actual SIR volume — but the inspection-rate comparison
is still valid for the federal-jurisdiction subset.

Outputs ranked region residuals and within-region state breakdown.
"""

import csv
from collections import defaultdict

CSV_PATH = "January2015toAugust2025.csv"

REGION = {
    "CONNECTICUT": 1, "MAINE": 1, "NEW HAMPSHIRE": 1, "MASSACHUSETTS": 1,
    "RHODE ISLAND": 1, "VERMONT": 1,
    "NEW YORK": 2, "NEW JERSEY": 2, "PUERTO RICO": 2, "VIRGIN ISLANDS": 2,
    "DELAWARE": 3, "DISTRICT OF COLUMBIA": 3, "MARYLAND": 3, "PENNSYLVANIA": 3,
    "VIRGINIA": 3, "WEST VIRGINIA": 3,
    "ALABAMA": 4, "FLORIDA": 4, "GEORGIA": 4, "KENTUCKY": 4, "MISSISSIPPI": 4,
    "NORTH CAROLINA": 4, "SOUTH CAROLINA": 4, "TENNESSEE": 4,
    "ILLINOIS": 5, "INDIANA": 5, "MICHIGAN": 5, "MINNESOTA": 5, "OHIO": 5,
    "WISCONSIN": 5,
    "ARKANSAS": 6, "LOUISIANA": 6, "NEW MEXICO": 6, "OKLAHOMA": 6, "TEXAS": 6,
    "IOWA": 7, "KANSAS": 7, "MISSOURI": 7, "NEBRASKA": 7,
    "COLORADO": 8, "MONTANA": 8, "NORTH DAKOTA": 8, "SOUTH DAKOTA": 8,
    "UTAH": 8, "WYOMING": 8,
    "ARIZONA": 9, "CALIFORNIA": 9, "HAWAII": 9, "NEVADA": 9,
    "ALASKA": 10, "IDAHO": 10, "OREGON": 10, "WASHINGTON": 10,
}

REGION_NAME = {
    1: "Boston", 2: "New York", 3: "Philadelphia", 4: "Atlanta",
    5: "Chicago", 6: "Dallas", 7: "Kansas City", 8: "Denver",
    9: "San Francisco", 10: "Seattle",
}


def has_inspection(row: dict) -> bool:
    insp = (row.get("Inspection") or "").strip()
    return bool(insp) and insp != "0"


def naics_2(code: str) -> str:
    code = (code or "").strip()
    return code[:2] if len(code) >= 2 else ""


def main() -> None:
    state_total: dict[str, int] = defaultdict(int)
    state_insp: dict[str, int] = defaultdict(int)
    state_naics_total: dict[tuple[str, str], int] = defaultdict(int)
    naics_total: dict[str, int] = defaultdict(int)
    naics_insp: dict[str, int] = defaultdict(int)

    with open(CSV_PATH, encoding="utf-8", errors="replace") as f:
        for row in csv.DictReader(f):
            if (row.get("FederalState") or "").strip() != "1":
                continue
            state = (row.get("State") or "").strip()
            sec = naics_2(row.get("Primary NAICS") or "")
            if not state or not sec:
                continue
            insp = has_inspection(row)
            state_naics_total[(state, sec)] += 1
            naics_total[sec] += 1
            state_total[state] += 1
            if insp:
                state_insp[state] += 1
                naics_insp[sec] += 1

    nat_sector_rate = {
        sec: naics_insp[sec] / n for sec, n in naics_total.items() if n > 0
    }

    # Aggregate state actual + expected to region level
    region_n: dict[int, int] = defaultdict(int)
    region_insp: dict[int, int] = defaultdict(int)
    region_expected_sum: dict[int, float] = defaultdict(float)
    region_states: dict[int, list[tuple[str, int, float, float, float]]] = defaultdict(list)

    for state, n in state_total.items():
        if state not in REGION:
            continue
        if n < 100:  # include smaller states at region level
            # still aggregate into region for accurate region rate
            r = REGION[state]
            actual = state_insp[state] / n if n else 0
            region_n[r] += n
            region_insp[r] += state_insp[state]
            expected = sum(
                (state_naics_total.get((state, sec), 0) / n) * nat_sector_rate[sec]
                for sec in nat_sector_rate
                if state_naics_total.get((state, sec), 0) > 0
            )
            region_expected_sum[r] += expected * n
            continue

        r = REGION[state]
        actual = state_insp[state] / n
        expected = sum(
            (state_naics_total.get((state, sec), 0) / n) * nat_sector_rate[sec]
            for sec in nat_sector_rate
            if state_naics_total.get((state, sec), 0) > 0
        )
        residual = actual - expected
        region_n[r] += n
        region_insp[r] += state_insp[state]
        region_expected_sum[r] += expected * n
        region_states[r].append((state, n, actual, expected, residual))

    region_rows = []
    for r, n in region_n.items():
        actual = region_insp[r] / n if n else 0
        expected = region_expected_sum[r] / n if n else 0
        residual = actual - expected
        region_rows.append((r, n, actual, expected, residual))

    region_rows.sort(key=lambda x: x[4])

    print("FEDERAL OSHA REGION INSPECTION RATES (NAICS-controlled):")
    print(f"  {'Region':30} {'n':>8} {'actual':>8} {'expected':>10} {'residual':>10}")
    for r, n, actual, expected, residual in region_rows:
        name = f"R{r} {REGION_NAME[r]}"
        print(
            f"  {name:30} {n:8,} {100*actual:7.1f}% {100*expected:9.1f}% "
            f"{100*residual:+9.1f}pp"
        )

    print()
    actuals = [r[2] for r in region_rows if r[1] >= 500]
    residuals = [r[4] for r in region_rows if r[1] >= 500]
    if actuals:
        a_spread = (max(actuals) - min(actuals)) * 100
        r_spread = (max(residuals) - min(residuals)) * 100
        print(f"REGIONAL spread (n>=500 regions):")
        print(f"  actual inspection rate:    {a_spread:.1f} pp")
        print(f"  residual after NAICS ctrl: {r_spread:.1f} pp")
    print()

    print("WITHIN-REGION state breakdown (most-extreme regions first):")
    for r, n, actual, expected, residual in region_rows:
        if abs(residual) < 0.05:
            continue
        name = f"R{r} {REGION_NAME[r]}"
        states = region_states.get(r, [])
        states.sort(key=lambda x: x[4])
        print(f"\n  {name} (n={n:,}, residual {100*residual:+.1f}pp):")
        for state, sn, sa, se, sres in states:
            print(
                f"    {state:25} {sn:7,} {100*sa:7.1f}% {100*se:9.1f}% "
                f"{100*sres:+9.1f}pp"
            )


if __name__ == "__main__":
    main()
