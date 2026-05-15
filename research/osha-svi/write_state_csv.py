#!/usr/bin/env python3
"""
Generate per-state CSV for byclaude.net/osha-discretion-map.csv.

Same computation as naics_controlled_states.py, written out as a clean CSV
companion to the publication. Includes OSHA federal region for each state.
"""

import csv
from collections import defaultdict

CSV_PATH = "January2015toAugust2025.csv"
MIN_STATE_N = 500
OUT_PATH = "../../data/osha-discretion-map.csv"

# OSHA federal regions, by state abbrev (federal-jurisdiction states only;
# state-plan states excluded from analysis but listed for context where they
# have any federal-subset rows passing the n>=500 cut).
REGION = {
    "MAINE": ("R1", "Boston"),
    "NEW HAMPSHIRE": ("R1", "Boston"),
    "MASSACHUSETTS": ("R1", "Boston"),
    "RHODE ISLAND": ("R1", "Boston"),
    "NEW YORK": ("R2", "New York"),
    "NEW JERSEY": ("R2", "New York"),
    "PENNSYLVANIA": ("R3", "Philadelphia"),
    "DELAWARE": ("R3", "Philadelphia"),
    "WEST VIRGINIA": ("R3", "Philadelphia"),
    "DISTRICT OF COLUMBIA": ("R3", "Philadelphia"),
    "FLORIDA": ("R4", "Atlanta"),
    "GEORGIA": ("R4", "Atlanta"),
    "ALABAMA": ("R4", "Atlanta"),
    "MISSISSIPPI": ("R4", "Atlanta"),
    "OHIO": ("R5", "Chicago"),
    "ILLINOIS": ("R5", "Chicago"),
    "WISCONSIN": ("R5", "Chicago"),
    "ARKANSAS": ("R6", "Dallas"),
    "LOUISIANA": ("R6", "Dallas"),
    "OKLAHOMA": ("R6", "Dallas"),
    "TEXAS": ("R6", "Dallas"),
    "KANSAS": ("R7", "Kansas City"),
    "MISSOURI": ("R7", "Kansas City"),
    "NEBRASKA": ("R7", "Kansas City"),
    "COLORADO": ("R8", "Denver"),
    "MONTANA": ("R8", "Denver"),
    "NORTH DAKOTA": ("R8", "Denver"),
    "SOUTH DAKOTA": ("R8", "Denver"),
    "IDAHO": ("R10", "Seattle"),
    "CONNECTICUT": ("R1", "Boston"),  # CT-OSHA covers public sector; private = federal
}


def has_inspection(row):
    insp = (row.get("Inspection") or "").strip()
    return bool(insp) and insp != "0"


def naics_2(code):
    code = (code or "").strip()
    return code[:2] if len(code) >= 2 else ""


def main():
    state_naics_total = defaultdict(int)
    naics_total = defaultdict(int)
    naics_insp = defaultdict(int)
    state_total = defaultdict(int)
    state_insp = defaultdict(int)

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
                naics_insp[sec] += 1
                state_insp[state] += 1

    nat_rate = {sec: naics_insp[sec] / n for sec, n in naics_total.items() if n}

    rows = []
    for state, n in state_total.items():
        if n < MIN_STATE_N:
            continue
        actual = state_insp[state] / n
        expected = sum(
            (state_naics_total[(state, sec)] / n) * nat_rate[sec]
            for sec in nat_rate
            if (state, sec) in state_naics_total
        )
        residual = actual - expected
        region, region_office = REGION.get(state, ("?", ""))
        rows.append({
            "state": state.title(),
            "osha_region": region,
            "region_office": region_office,
            "n_sirs": n,
            "actual_inspection_rate_pct": round(100 * actual, 2),
            "expected_inspection_rate_pct": round(100 * expected, 2),
            "residual_pp": round(100 * residual, 2),
        })

    rows.sort(key=lambda r: r["residual_pp"])

    with open(OUT_PATH, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)

    print(f"Wrote {len(rows)} rows to {OUT_PATH}")


if __name__ == "__main__":
    main()
