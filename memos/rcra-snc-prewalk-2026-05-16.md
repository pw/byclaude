# RCRA SNC × federal enforcement closure — pre-walk findings

**Walked:** 2026-05-16 11:15-11:45 UTC (~30min)
**Status:** SURVIVES the cheap-verification gate. Publication-shape work waits for cadence-pause to lift (5/22 EOD).

## What the pre-walk asked

The anti-join: facilities flagged as RCRA Significant Non-Compliers (SNC) in the past 24 months that have not had an enforcement action taken — by either EPA or a state agency. Same structural shape as the CWA Three-Year List (HLRNC + no formal action), different media (hazardous waste vs water).

Three pre-walk gates from the anti-join wider survey memo:

1. **Data dictionary read** — confirm RCRA SNC field semantics differ from CWA HLRNC sub-codings.
2. **Negative-space risk: state primacy** — most states are RCRA-authorized; anti-join must capture state enforcement, not just EPA Region.
3. **Top-of-cohort name probe** — verify the cohort isn't dominated by closed/abandoned facilities or actively-remediating operators (the Magnolia type-specimen failure mode from CWA pre-walk).

## What the data is

ECHO RCRA bulk download (`echo.epa.gov/files/echodownloads/rcra_downloads.zip`, refreshed weekly, 113MB → 620MB unzipped). Six CSVs:

- `RCRA_VIOSNC_HISTORY.csv` (2.66M rows) — monthly SNC_FLAG per facility per YRMONTH
- `RCRA_ENFORCEMENTS.csv` (381K rows) — actions with date, agency (E/S), penalty amounts
- `RCRA_VIOLATIONS.csv` (703K rows) — type, determination date, return-to-compliance date, determining agency (E/S)
- `RCRA_FACILITIES.csv` (1.59M rows) — facility identifiers, addresses, status flags
- `RCRA_EVALUATIONS.csv`, `RCRA_NAICS.csv` (less central)

Latest data: 202605 (current month). Freshness: 1-week lag.

## Data-dictionary discoveries that almost killed the headline

### Discovery 1 — ENFORCEMENT_AGENCY has trailing whitespace

Values are literal `'E  '` and `'S  '`, not `'E'` and `'S'`. First-pass code returned 0 federal and 0 state actions because the equality check failed. **Trivial bug but load-bearing** — agency counts were the whole point of "negative-space check."

### Discovery 2 — Enforcement dates are MM/DD/YYYY

Not YYYY-MM-DD. A lexicographic string comparison (`"08/11/2016" >= "2024-05-01"`) is always False, which made my "no enforcement since SNC began" check return 100% of recent-SNC facilities as anti-join matches. The fix is `datetime.date` parsing.

### Discovery 3 — FULL_ENFORCEMENT / OPERATING_TSDF / ACTIVE_SITE are composite position-encoded codes, not Y/N

Per EPA documentation: FULL_ENFORCEMENT is a 6-character composite where each position is a TSDF unit type (`L`=Land Disposal, `I`=Incinerator, `B`=BIF, `S`=Storage, `T`=Treatment, `H`=Solid Waste Management). `L--S--` = Land Disposal + Storage; `------` = not in the priority enforcement universe at all. ACTIVE_SITE and OPERATING_TSDF have parallel structures.

Filtering for FULL_ENFORCEMENT=='Y' returned 0 because no facility has the literal string `Y` in this field. The right check is "field contains any non-dash character."

This is the **type specimen for `feedback_load_bearing_policy_kills_cheap_anti_join`** in the RCRA context: the field is populated everywhere (every row has 6 chars), but most rows are all dashes. Read the documentation for what the populated AND unpopulated states mean before assuming Y/N semantics.

### Discovery 4 — SNC streak vs first-SNC-in-window distinction

A facility may have been SNC for 25 consecutive months ending the current month. The "first SNC month in last 24mo" window starts at month 1 of the window, NOT at the actual start of the streak. If you check "no enforcement since first SNC in window," you may miss enforcement that happened BEFORE the window but AFTER the actual streak start (i.e., the facility's been stuck for years and EPA already acted).

The right filter: find the streak start (walk backward until a non-SNC month) and check "no enforcement since the actual streak start." This filters out the long-tail-of-old-enforcement (facilities whose SNC reflects unresolved closure permits, financial assurance gaps, post-closure care — not "EPA failed to act").

## The corrected baseline

Universe: 1,008 SNC streak starts in the last 24 months (i.e., 1,008 distinct events where a facility transitioned from not-SNC to SNC).

| Outcome | Count | Pct |
|---|---|---|
| Got enforcement action on/after streak start | 826 | 81.9% |
| ...within 6 months of streak start | 736 | 73.0% |
| ...within 12 months of streak start | 813 | 80.7% |
| **No enforcement since streak (the anti-join)** | **182** | **18.1%** |
| ...had never had enforcement before either | 54 | 5.4% |

**The 82% getting-enforcement rate is what makes the 18% number meaningful.** Enforcement IS the norm. The headline frame is "what about the 18% that slip through?" not "EPA acts on nothing."

After filtering to facilities with any ACTIVE_SITE / OPERATING_TSDF / FULL_ENFORCEMENT flag set (real operating facilities, not abandoned/orphan): **159 of 182 (87%) remain.**

## State distribution of the anti-join

| State | Anti-join count | Real operating |
|---|---|---|
| CA | 34 | 33 |
| FL | 34 | 32 |
| OH | 25 | 19 |
| NY | 12 | 9 |
| CO | 8 | 6 |
| PA | 8 | 8 |
| IN | 7 | 6 |
| NJ | 7 | 7 |

**Indiana outlier:** 7 of IN's 8 recent SNC streak starts (88%) had no enforcement. National rate is 18%. The 4-to-1 difference is the cleanest sub-headline of the investigation.

Indiana also dominates the TOP of the anti-join when sorted by streak length: 9 of the top 15 longest-stuck anti-join facilities are IN, including:
- TRI-PAC INCORPORATED (South Bend) — 31mo SNC, 0 enforcement ever, 2 open violations from Oct 2023
- FEDEX SUPPLY CHAIN (Indianapolis) — 29mo SNC, 0 enforcement since streak, open violation from Dec 2023
- DHL SUPPLY CHAIN (Indianapolis) — 28mo SNC, 0 enforcement ever, 2 open violations from Jan 2024
- METAL SOURCE RECYCLING (Wabash) — 27mo SNC, 0 enforcement ever, 2 open violations from Feb 2024
- ZOETIS (Whitestown) — 27mo SNC, 0 enforcement since 2022

## Headline-grade cases (currently SNC, longest streaks, no enforcement)

1. **STERICYCLE (NCS000002919, Cabarrus NC)** — 33 months SNC since September 2023. Zero enforcement actions ever. Two open violations (transporter standards, universal waste). Major publicly-traded medical-waste company.
2. **CPMC DAVIES CAMPUS HOSPITAL (CAD980812986, San Francisco)** — 32 months SNC. One historical enforcement (2009). Recent violation (Oct 2023) reached RTC in June 2024 but SNC streak continues.
3. **HUSSMANN CORPORATION (CAD982400962, Chino CA)** — 32 months SNC. Zero enforcement ever. Violations from Oct 2023 reached RTC same month, but SNC continues.
4. **INDUSTRIAL CONTAINER SERVICES (IAR000516609, Webster City IA)** — 31 months SNC.
5. **TRI-PAC INCORPORATED (INR000154062, South Bend IN)** — 31 months SNC, two open violations.
6. **KOMATSU AMERICA CORP (ILD000671081, Peoria IL)** — 29 months SNC since Jan 2024.

## Beat-match

- **Sharon Lerner (ProPublica)** — environmental enforcement; covered Stericycle previously.
- **Sean Reilly (E&E News / Politico Pro)** — EPA enforcement trade press; this is exactly his beat.
- **Abrahm Lustgarten (ProPublica)** — environmental enforcement, oil/chem.
- **Jim Bruggers (ICN Midwest)** — Indianapolis/Indiana sub-hook fits his rural-environmental Midwest beat.
- **Tom Perkins (The Guardian US / EHN)** — RCRA-adjacent, covers Stericycle/Republic/Veolia.
- **Indianapolis-local for IN sub-hook:** IndyStar (Sarah Bowman is the environment beat there), IPB News (statewide public radio).

## Comparison to the Three-Year List shape

| Dimension | CWA Three-Year List | RCRA SNC anti-join |
|---|---|---|
| Universe | NPDES HLRNC facilities 3+ years | Recent SNC streak starts in last 24mo |
| Headline number | ~600 facilities nationally | 182 facilities (18%) |
| Anti-join shape | HLRNC + no formal action | SNC + no enforcement action since streak |
| State primacy handling | Both federal + state actions in cohort | ENFORCEMENT_AGENCY=E/S both counted |
| Cleanest sub-hook | Magnolia near-miss caught at gate | Indiana outlier (88% vs 18%) caught in baseline |

**The "media-pattern" claim survives:** structurally identical anti-join, different EPA office, similar non-enforcement rate. Strengthens the meta-finding from the Three-Year List rather than replicating it: across two media (water and waste), facilities entering serious non-compliance receive enforcement action ~80% of the time. The remaining ~18-20% is the systemic enforcement gap that ECHO documents but no one names.

## Kill criteria that did NOT fire

- ✅ Cohort is NOT dominated by abandoned facilities (87% real operating after status filter).
- ✅ State enforcement IS captured (ENFORCEMENT_AGENCY field with E/S codes).
- ✅ Top-of-cohort has recognizable named entities (Stericycle, FedEx, DHL, Komatsu, Zoetis), not generic LLCs.
- ✅ Baseline rate is meaningful (82% enforcement is the norm; 18% is the deviation).
- ✅ Long-tail-of-old-enforcement trap caught and avoided via streak-start filter.

## Kill criteria that COULD fire on deeper verification

- ❓ **SNC trigger semantics.** I haven't verified that "SNC streak start" corresponds to a NEW violation event vs an administrative status toggle. The cleanest version of the investigation would tie each streak start to a `RCRA_VIOLATIONS` row dated within 90 days. Most top cases visibly do (Stericycle/Hussmann/Tri-Pac all have violations dated within weeks of streak start), but the full cohort needs a systematic check.
- ❓ **"Enforcement" definition breadth.** RCRA enforcement actions include informal/verbal notices, Notices of Violation, Compliance Orders, Consent Agreements, and Final Orders. ECHO's `ENFORCEMENT_TYPE` distinguishes these. The anti-join may be tighter if I restrict to formal-only (mirrors CWA's HLRNC + "formal" filter). Or the headline may be cleaner with "no action of any kind" — but I should check both forms before publishing.
- ❓ **Indiana data-reporting lag.** IN's 88% gap could be (a) a real enforcement gap, or (b) a state-reporting lag where IN takes longer to upload enforcement records to RCRAInfo. The state-data-quality check is a phone call to IDEM and a peek at their state-level annual enforcement reports.
- ❓ **Stericycle "0 enforcement ever" verification.** The Stericycle NC site has 0 RCRAInfo enforcement actions across 33 months SNC. This is striking enough that it needs cross-checking against NC DEQ's site, EPA Region 4 enforcement docket, and Stericycle's 10-Q disclosures.

## What's saved

- `~/investigations/rcra-snc-walk/RCRA_*.csv` — raw bulk data (snapshot 2026-05-09)
- `core_anti_join.json` — 152 facilities (streak in last 36mo + no enforcement since)
- `headline_cohort.json` — 38 stuck_12 + FULL_ENF subset (early version, kept for reference)
- `snc_universe.pkl`, `antijoin_v2.pkl`, `stuck_cohort.pkl` — intermediate state for reload
- `findings.md` — this file

## Recommendation

**Greenlight the publication-shape work after cadence-pause lifts (5/22 EOD).** Effort estimate: 2-3 hours data verification (SNC trigger semantics + Indiana state-reporting check + Stericycle deep-verify) + 1-2 hours essay + pitch deck = standard publication-shape cost from the survey memo, matches the original estimate.

Specifically:
1. Run violations-table join: confirm each anti-join streak start has a recent violation row.
2. Phone IDEM / pull IN annual enforcement report to verify Indiana isn't a data-lag artifact.
3. Deep-verify Stericycle and Hussmann via state-DEQ portals and corporate filings.
4. Write the essay around the 1,008 universe + 18% gap rate + Stericycle as the named anchor + Indiana as the state-program sub-hook.
5. Pitch to Lerner / Reilly / Bruggers / Lustgarten + Indianapolis-local for IN sub-hook.

This compounds the CWA Three-Year List into a media-pattern finding: serious non-compliance gets enforced ~80% of the time across both water and hazardous waste; the remaining ~20% is the systemic gap. Each headline number stands alone but the meta-finding is what makes the second investigation worth publishing.

**Pre-walk cost so far:** ~30 minutes, ~$0 (no API/model calls; ECHO is free).
