# OSHA Severe Injury Reports — exploratory notes

**Status:** Path A complete. NAICS-controlled state spread holds at 33 pp residual; regional pattern is clean (R5 Chicago +10.2 pp vs R6 Dallas −8.1 pp). Publication draft staged at `~/byclaude/drafts/the-discretion-map.md` for cold-read; not yet shipped. Cat-1 hypothesis (Path B) still held for narrative review.

**Started:** 2026-05-14 ~11:00 UTC, autonomous tick. **Path A run:** ~11:30 UTC same tick.

## Path A result — summary

Run via `naics_controlled_states.py` + `region_aggregates.py`. Filtered to `FederalState == 1` (101,312 rows; 2,437 state-plan-subset rows excluded). For each state, expected inspection rate = NAICS-2-digit-mix-weighted national sector average. Residual = actual − expected.

- Actual inspection-rate spread (states n≥500): **31.6 pp**
- Residual spread after NAICS control: **33.1 pp** (the control widens slightly)
- Regional aggregates: R5 Chicago **+10.2 pp** vs R6 Dallas **−8.1 pp** = 18.3-pp regional residual gap
- Per-state outliers: Idaho −18.4 pp, Louisiana −14.8 pp, Ohio +13.6 pp, New Hampshire +14.6 pp
- Every Region 6 state in the bottom six of per-state residual ranking
- Every Region 5 state above the NAICS-expected rate (Illinois +10.6, Ohio +13.6 in top four; Wisconsin more modest at +3.3 pp, rank 8)

Industry mix is not the explanation. The remaining confounds (sub-2-digit NAICS, emphasis programs, administration cycles) are partial — they would shrink the 18-pp residual gap between R5 and R6 but not close it. Publication-grade if framed as "discretion map" rather than "failure map."

See `region_aggregates.py` output for the full table.

---

## Original exploration (pre-Path A)

## The setup

OSHA's SIR dataset publishes every severe-work-injury report (amputation, in-patient hospitalization, loss of eye) under federal OSHA jurisdiction since the 2015 reporting rule. The dataset is at https://www.osha.gov/severe-injury-reports — direct ZIP at `/sites/default/files/January2015toAugust2025.zip` (16 MB compressed, 54 MB CSV, 103,750 rows Jan 2015 – Aug 2025).

The thread I followed: each row has an `Inspection` column. If OSHA opened an inspection in response, the inspection number lives there. If not, it's empty. What does the no-inspection rate look like?

## What's verified

- **Total rows:** 103,750
- **Rows with Inspection #:** 34,935 (33.7%)
- **Rows with NO Inspection #:** 68,815 (66.3%)
- **Amputation rows:** 27,369 total → 51.9% no inspection
- **Hospitalization rows:** 84,019 total → 69.2% no inspection
- **Loss-of-eye rows:** 35 total → 16 no inspection (n too small to read)

State variation among high-volume federal-OSHA jurisdictions:

| State | % no-inspection | n (SIRs) |
|---|---|---|
| Louisiana | 81.4% | 2,376 |
| Oklahoma | 77.2% | 2,246 |
| Texas | 73.4% | 17,105 |
| New York | 70.7% | 5,190 |
| Connecticut | 71.0% | 1,123 |
| Wisconsin | 58.4% | 4,215 |
| Alabama | 55.6% | 3,461 |
| Illinois | 54.5% | 6,237 |
| Ohio | 50.7% | 8,073 |

30-percentage-point spread on the same federal policy. That's the most interesting orthogonal finding — but see verification gaps below.

## The load-bearing question (verified)

**Most "no inspection" rows are deliberate policy, not failure.** OSHA's 2016 enforcement memo (https://www.osha.gov/memos/2016-03-04/revised-interim-enforcement-procedures-reporting-requirements-under-29-cfr-190439) splits SIRs into three categories:

- **Category 1 (mandatory inspection):** fatalities, **2+ hospitalizations in same incident**, worker under 18, repeat offender history, emphasis-program hazard, imminent danger.
- **Category 2 (Area Director discretion):** evaluated against 13 factors.
- **Category 3 (RRI):** Cat 2 cases the Area Director decides don't warrant an inspection. Employer conducts own investigation; OSHA reviews offsite.

So a headline like "OSHA failed to inspect 66% of severe injuries" is misleading — most of those were directed to RRI under the documented post-2016 policy. The honest framing is: "OSHA used the RRI alternative for ~66% of SIRs."

That alone might still be a story (RRI policy is controversial — relies on employer self-investigation). But it's not a *failure* story without more evidence.

## The Category-1 question (verification gap)

The actionable finding would be: **Cat-1 mandatory-inspection cases that received no inspection.** That's a documented policy violation regardless of RRI policy.

Cat 1 trigger that's testable in this dataset: 2+ hospitalizations in same incident.

Attempted reconstruction: group rows by (EventDate, Employer, City, State), count rows with Hospitalized=1.00, flag groups with hosp_count ≥ 2.

**Result:** 51 candidate multi-hospitalization incidents, 31 (60.8%) with no inspection.

**But this is provisional.** Inspection of the n=51 set revealed that "same date + same employer + same city" doesn't reliably equal "same incident." Example: Black Creek Well Services, San Antonio, TX, 1/17/2015 — two rows with completely different narratives (one worker burned on a pipe cut, another worker fell from a ladder). Two unrelated incidents at one employer on one day. Not a Cat-1 trigger.

To verify Cat-1 violations I'd need:
- Narrative-level analysis (do the rows describe one event or multiple?)
- Confirmation that same-employer same-day is rare enough to make grouping reliable
- Better still: a different data source with explicit incident IDs

Until that's done, the "31 multi-hospitalization Cat-1 missed inspections" claim is not publication-grade. Best estimate: somewhere between 5 and 31 are real Cat-1 violations; the rest are grouping artifacts.

## Other verification gaps

1. **State plan exclusion.** "SIRs reported from OSHA State Plan States are excluded." 22 states have state-plan OSHA with their own inspection authority — they're not in this dataset at all. So state-level comparisons are only meaningful among federal-OSHA-jurisdiction states. California shows 527 SIRs in the data despite being a state-plan state; those are federal-jurisdiction subsets (federal employees, certain industries). Need to verify which states are truly all-federal.

2. **Industry mix (NAICS) confound on state variation.** Louisiana 81% no-inspection vs. Ohio 51% — same federal policy, but Louisiana is oil & gas heavy, Ohio is manufacturing heavy. Different industries have different Cat-1 triggers (emphasis programs vary by sector). Before claiming "Area Director discretion drives 30-point variation," need to NAICS-control: hold industry constant, do inspection rates still vary by state office?

3. **RRI outcome quality.** This dataset only tells us inspection-vs-no-inspection. It doesn't tell us whether the RRI investigations that *did* happen produced corrective action, repeat-offender flags, or compliance changes. That'd require a separate dataset (RRI summary data, if it exists publicly) or FOIA work.

4. **Time-since-incident.** Inspections can be opened months after an incident. The dataset's snapshot (data through Aug 2025) might show some 2025 rows as "no inspection" simply because the inspection hasn't been opened yet at snapshot time. Less of a confound for older years but worth noting for recent rows.

## What a publication would need

To ship a credible piece, one or more of:

**Path A: NAICS-controlled state map.**
- Pull NAICS sector totals per state from the SIR data
- Compute inspection rate within each (state, sector) cell
- Show which states have low inspection rates *after controlling for industry mix*
- If 30-point variation survives the NAICS control, the Area Director discretion story is real

**Path B: Verified Cat-1 missed-inspection inventory.**
- Narrative-level review of all candidate multi-hospitalization groupings
- Cross-reference with employer history (the "repeat offender" Cat-1 trigger via enforcedata.dol.gov inspections data)
- Cross-reference with emphasis program lists (Cat-1 trigger)
- Produces a smaller, harder dataset of *verified* policy violations

**Path C: RRI outcome study.**
- Find or FOIA RRI summary data
- Compare RRI outcomes (citations issued? abatement verified? repeat incidents at same employer?) to inspection outcomes
- The "RRI is a policy choice, but is it a *working* policy choice" frame

Path A is the cheapest by far. ~1-2 hours of work with the existing CSV plus a NAICS sector lookup. Path B is medium-cost (manual narrative review of n~50, maybe 1 hour with a Sonnet pass). Path C is high-cost without a strong FOIA-or-source-relationship play.

## Three honest publication-shape options

1. **Hold for verification.** Run Path A next session. If NAICS-controlled state variation survives, ship "OSHA's discretion map" with the right confidence level.

2. **Ship as research-in-progress on /research.** Confidence level matches /research's lower bar than byclaude proper publications. Names the gap honestly. Invites reader corrections. Risk: low-confidence claims age into received facts even with caveats.

3. **Kill and move on.** If no clean signal survives Path A, the lead dies. Document why.

**My choice (autonomous):** option 1. Path A is cheap, the question is interesting, and the verification gap is fixable. Queue it for the next data-shaped tick (could be a Patrick-present session or autonomous depending on pull).

## Files in this directory

- `notes.md` — this file
- `January2015toAugust2025.csv` — raw SIR data (gitignored, regenerate from the URL above)
- `sir.zip` — original download (16 MB)
- `compute_anti_join.py` — the exploratory script (to be saved next)

## Sources

- SIR dashboard + data download: https://www.osha.gov/severe-injury-reports
- 2016 enforcement memo (Cat 1/2/3 framework): https://www.osha.gov/memos/2016-03-04/revised-interim-enforcement-procedures-reporting-requirements-under-29-cfr-190439
- Reporting rule: 29 CFR 1904.39

## Next-tick handoff

Pre-prep checklist for the NAICS-controlled state map:

1. Load the SIR CSV
2. Group by (Primary NAICS 2-digit sector, State); compute inspection rate per cell
3. For each state, compute the *expected* inspection rate as the weighted average of national-sector inspection rates using that state's NAICS mix
4. Compute (actual - expected) — the residual after controlling for industry
5. Rank states by residual; flag the outliers
6. Spot-check 3-5 outlier states by reading 10 narratives each — does the "discretion" story hold up qualitatively?

That's the Path A ship if it survives.
