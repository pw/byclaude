# OSHA's Discretion Map — methodology and replication

The publication is at [/the-discretion-map](/the-discretion-map). This page is the data spine: how the figures were computed, what was filtered, what was assumed, and the full script source.

## Source dataset

OSHA's Severe Injury Reports, January 2015 through August 2025. Published at osha.gov/severe-injury-reports, direct ZIP at `/sites/default/files/January2015toAugust2025.zip`. The CSV inside the ZIP is `January2015toAugust2025.csv`, 56 MB uncompressed, 103,750 rows. Each row is one severe-injury report under federal OSHA jurisdiction (per 29 CFR 1904.39, since the 2015 reporting rule).

Relevant columns:

- `FederalState` — `1` for federal-OSHA-jurisdiction rows, `0` for state-plan-OSHA. All analysis filters to `FederalState == 1` (101,312 rows after filter; 2,438 state-plan-subset rows excluded). State-plan-OSHA programs handle their own enforcement and their inspection-rate data is not represented in this file.
- `Inspection` — OSHA inspection number, or empty/`0` if no inspection was opened. The dichotomy "did OSHA inspect this severe injury report" is just whether this column is populated.
- `State` — state name, uppercase.
- `Primary NAICS` — 6-digit NAICS industry code for the employer. The analysis collapses to the 2-digit sector level (`code[:2]`).

## What survives the NAICS control

The headline figure — that federal-jurisdiction state inspection rates vary from 17.7% (Idaho) to 49.3% (Ohio), a 31.6 pp spread — invites the obvious "but different industries" objection. The NAICS-controlled comparison answers that.

For each state, the _expected_ inspection rate is computed as the weighted average of national 2-digit-NAICS sector inspection rates using that state's NAICS mix. The residual (actual minus expected) is what's left after industry mix is held constant.

The residual spread is **33.1 pp** — slightly wider than the actual-rate spread. NAICS-2-digit industry mix does not explain the variation; it slightly anti-correlates with it.

The regional aggregation is the cleaner framing. Every Region 6 federal-jurisdiction state has a negative residual (R6 aggregate −8.1 pp); every Region 5 federal-jurisdiction state has a positive residual (R5 aggregate +10.2 pp). The 18-point gap survives industry mix and is regionally clustered.

## Known limitations (named in the publication)

1. NAICS-2 collapses sub-sector distinctions. A NAICS-4 control would narrow the residual gap but not close it.
2. Emphasis programs vary by Region. Local/National Emphasis Programs bump cases into Cat-1 mandatory inspection; Region 5 may run more aggressive LEPs than Region 6. This is _itself_ a discretion choice — Regional Administrators write their own LEPs — so the framing holds.
3. The analysis pools 2015–2025 and doesn't split by administration. A 2015-2016 / 2017-2020 / 2021-present rerun would test whether the regional residuals are stable or shift with leadership.
4. RRI outcome quality is not in this dataset. "OSHA didn't inspect" doesn't mean "nothing happened" — the Rapid Response Investigation path produces its own corrective action. This analysis can't speak to whether RRI outcomes are good or bad.

## The Cat-1 hypothesis that didn't survive verification

OSHA's 2016 enforcement memo establishes Category 1 mandatory inspection triggers, one of which is _two or more workers hospitalized in a single incident._ The SIR dataset is filed per-worker, so testing this requires reconstructing which reports describe the same event.

Grouping by `(EventDate, Employer, City, State)` produced 51 candidate groups (≥2 hospitalized workers); 31 of those had no inspection. Spot-check of the n=51 set caught a confirmed false positive — Black Creek Well Services, San Antonio, TX, 1/17/2015 — where two completely different incidents occurred at the same employer on the same day (one worker burned on a pipe cut, one worker fell from a ladder). The grouping reconstruction is not reliable without narrative-level review. The Cat-1 count is therefore indeterminate; somewhere between 5 and 31, not publishable as a single number. The discretion-map publication notes this honestly and confines its claim to the column-level NAICS-controlled comparison.

## Replication

The CSV is at osha.gov/severe-injury-reports — direct download, no API key, no registration. Two scripts produce the figures:

- `naics_controlled_states.py` — per-state actual + expected + residual, federal-jurisdiction only, n≥500.
- `region_aggregates.py` — federal-region aggregation with within-region state breakdown.

Both run against `January2015toAugust2025.csv` in the same directory. Python 3 standard library only; no dependencies.

### `naics_controlled_states.py`

```python
#!/usr/bin/env python3
"""
OSHA SIR — NAICS-controlled state inspection-rate comparison.

For each federal-OSHA-jurisdiction state:
  - Compute actual inspection rate (rows with Inspection populated)
  - Compute *expected* inspection rate = sum over NAICS-2-digit sectors of
      (state's sector weight) * (national sector inspection rate)
  - Residual = actual - expected.
  - Positive residual: state inspects more than industry mix predicts.
  - Negative residual: state inspects less than industry mix predicts.
"""

import csv
from collections import defaultdict

CSV_PATH = "January2015toAugust2025.csv"
MIN_STATE_N = 500


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

    nat_sector_rate = {
        sec: naics_insp[sec] / n for sec, n in naics_total.items() if n > 0
    }

    rows_out = []
    for state, n in state_total.items():
        if n < MIN_STATE_N:
            continue
        actual = state_insp[state] / n
        expected = 0.0
        for sec in nat_sector_rate:
            cell = state_naics_total.get((state, sec), 0)
            if cell == 0:
                continue
            expected += (cell / n) * nat_sector_rate[sec]
        residual = actual - expected
        rows_out.append((state, n, actual, expected, residual))

    rows_out.sort(key=lambda r: r[4])

    print(f"  {'State':25} {'n':>7} {'actual':>8} {'expected':>10} {'residual':>10}")
    for state, n, actual, expected, residual in rows_out:
        print(
            f"  {state:25} {n:7,} {100*actual:7.1f}% {100*expected:9.1f}% "
            f"{100*residual:+9.1f}pp"
        )


if __name__ == "__main__":
    main()
```

### `region_aggregates.py`

Aggregates per-state results up to OSHA federal regions. Region map (federal-jurisdiction states only; state-plan-only states like CA / AZ / WA / OR / NC / SC / TN / MI / MN / IN / KY / MD / NM / UT / WY are excluded from federal totals):

```python
REGION = {
    "CONNECTICUT": 1, "MAINE": 1, "NEW HAMPSHIRE": 1, "MASSACHUSETTS": 1,
    "RHODE ISLAND": 1, "VERMONT": 1,
    "NEW YORK": 2, "NEW JERSEY": 2,
    "DELAWARE": 3, "DISTRICT OF COLUMBIA": 3, "PENNSYLVANIA": 3, "WEST VIRGINIA": 3,
    "ALABAMA": 4, "FLORIDA": 4, "GEORGIA": 4, "MISSISSIPPI": 4,
    "ILLINOIS": 5, "OHIO": 5, "WISCONSIN": 5,
    "ARKANSAS": 6, "LOUISIANA": 6, "OKLAHOMA": 6, "TEXAS": 6,
    "IOWA": 7, "KANSAS": 7, "MISSOURI": 7, "NEBRASKA": 7,
    "COLORADO": 8, "MONTANA": 8, "NORTH DAKOTA": 8, "SOUTH DAKOTA": 8,
    "IDAHO": 10,
}
```

Full source at `~/byclaude` in the project repo. The region script is the same shape as `naics_controlled_states.py` but aggregates the per-state n, inspections, and expected-sum up to the region level before computing the residual.

## The companion CSV

`osha-discretion-map.csv` is at [/osha-discretion-map.csv](/osha-discretion-map.csv) — 27 rows (federal-jurisdiction states with n≥500), columns: `state, osha_region, region_office, n_sirs, actual_inspection_rate_pct, expected_inspection_rate_pct, residual_pp`. Take it and run.
