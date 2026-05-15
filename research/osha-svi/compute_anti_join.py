#!/usr/bin/env python3
"""
OSHA SIR anti-join exploration.

Inputs:
  January2015toAugust2025.csv (from https://www.osha.gov/sites/default/files/January2015toAugust2025.zip)

Outputs to stdout:
  - Total SIR row count
  - % with / without Inspection column populated
  - Same breakdown for amputations, hospitalizations, loss-of-eye
  - State-level breakdown (absolute + percentage, ranked)
  - Candidate multi-hospitalization same-incident groupings (provisional; see notes.md verification gap)

Run from this directory:
  python3 compute_anti_join.py
"""

import csv
from collections import defaultdict, Counter

CSV_PATH = "January2015toAugust2025.csv"


def main() -> None:
    total = 0
    with_insp = 0
    empty_insp = 0
    amp_total = amp_with = amp_empty = 0
    hosp_total = hosp_with = 0
    eye_total = eye_empty = 0
    by_state_empty: Counter[str] = Counter()
    by_state_total: Counter[str] = Counter()
    incidents: dict[tuple[str, str, str, str], list[dict]] = defaultdict(list)

    with open(CSV_PATH, encoding="utf-8", errors="replace") as f:
        for row in csv.DictReader(f):
            total += 1
            insp = (row.get("Inspection") or "").strip()
            state = (row.get("State") or "").strip()
            amp = float(row.get("Amputation") or 0)
            hosp = float(row.get("Hospitalized") or 0)
            eye = float(row.get("Loss of Eye") or 0)
            by_state_total[state] += 1
            has_insp = bool(insp) and insp != "0"
            if has_insp:
                with_insp += 1
                if amp:
                    amp_with += 1
                if hosp:
                    hosp_with += 1
            else:
                empty_insp += 1
                by_state_empty[state] += 1
                if amp:
                    amp_empty += 1
                if eye:
                    eye_empty += 1
            if amp:
                amp_total += 1
            if hosp:
                hosp_total += 1
            if eye:
                eye_total += 1
            key = (
                row["EventDate"],
                row["Employer"].strip().upper(),
                row["City"].strip().upper(),
                row["State"].strip().upper(),
            )
            incidents[key].append(row)

    print(f"Total SIR rows: {total:,}")
    print(f"  with Inspection: {with_insp:,} ({100*with_insp/total:.1f}%)")
    print(f"  empty Inspection: {empty_insp:,} ({100*empty_insp/total:.1f}%)")
    print(f"Amputations: {amp_total:,}, no inspection {amp_empty:,} ({100*amp_empty/amp_total:.1f}%)")
    print(f"Hospitalizations: {hosp_total:,}, no inspection {hosp_total-hosp_with:,} ({100*(hosp_total-hosp_with)/hosp_total:.1f}%)")
    print(f"Loss of eye: {eye_total}, no inspection {eye_empty}")
    print()

    print("TOP 12 STATES — absolute no-inspection count:")
    for st, cnt in by_state_empty.most_common(12):
        tot = by_state_total[st]
        pct = 100 * cnt / tot
        print(f"  {st:25s}  {cnt:6,} / {tot:6,}  ({pct:.0f}%)")
    print()

    print("TOP 12 STATES — % no-inspection (min 500 total SIRs):")
    ranked = [
        (st, cnt, by_state_total[st])
        for st, cnt in by_state_empty.items()
        if by_state_total[st] >= 500
    ]
    ranked.sort(key=lambda x: -100 * x[1] / x[2])
    for st, cnt, tot in ranked[:12]:
        print(f"  {st:25s}  {100*cnt/tot:5.1f}%  ({cnt:,}/{tot:,})")
    print()

    # Multi-hospitalization candidate detection (provisional; see notes.md)
    print("CANDIDATE multi-hospitalization same-incident groupings:")
    print("  WARNING: same-date+same-employer+same-city does NOT reliably equal same incident.")
    print("  Use narrative-level review before publication-grade claims.")
    print()
    multi = []
    for key, rows in incidents.items():
        if len(rows) < 2:
            continue
        hosp_count = sum(1 for r in rows if float(r.get("Hospitalized") or 0) >= 1)
        if hosp_count < 2:
            continue
        narratives = {(r.get("Final Narrative") or "").strip() for r in rows}
        if len(narratives) < 2:
            continue  # phantom — same narrative across rows
        multi.append((key, rows, hosp_count))

    no_insp = sum(
        1
        for _key, rows, _h in multi
        if not any((r.get("Inspection") or "").strip() and r["Inspection"].strip() != "0" for r in rows)
    )
    print(f"  Candidates: {len(multi)}")
    print(f"  Candidates with NO inspection: {no_insp} ({100*no_insp/max(1,len(multi)):.0f}%)")


if __name__ == "__main__":
    main()
