# OFAC SDN × USAspending — pre-walk findings

**Walked:** 2026-05-16 11:45-12:15 UTC (~30min)
**Status:** STRICT FRAME KILLED at the cheap-verification gate. Shifted frame (50% Rule subsidiaries) is a different investigation; sample-walk first before committing.

## What the pre-walk asked

The anti-join from the wider-survey memo (byclaude.net/memo/anti-join-survey-2026-05-16, #2 ranked): an OFAC SDN-listed entity that received federal money via USAspending obligation **after** its listing date, **without** General License coverage.

Memo-predicted kill-gate: General License coverage explaining the cohort.
Memo-predicted cost: ~2× standard (4-6h data + 4-6h verification) because the GL walk is unstructured.

## What I walked

1. **Pulled OFAC SDN list** (sanctionslistservice.ofac.treas.gov, 2026-05-11 publication). 18,959 entries: **9,670 entities** + 7,465 individuals + 1,480 vessels + 344 aircraft. Top programs by entity count: Russia-EO14024 (4,154), SDGT (1,265), Iran-IFSR (789), Drug Kingpins SDNTK (651), Non-Proliferation NPWMD (582).

2. **Filtered to US-style corporate suffix** (LLC / INC / CORP / LTD / etc.): 1,533 entities (15.9%). These are the most likely SAM.gov registrants. Sample names are still overwhelmingly foreign (Russian LLCs, Chinese Ltds, Iranian companies) — the suffix is translated convention, not US-domicile signal.

3. **Probed 200 randomly-sampled US-style entities** through USAspending `spending_by_award` API for contract award types (A/B/C/D).
   - **Raw hits (any return): 34** across 200
   - **Strong name-match hits (≥half of meaningful tokens overlap, min 2): 8 hits, all on a single entity**
   - That single entity: AVIATRADE LLC (Sudan-EO14098 SDN) → "AVIATRADE LINK, INC." (US contractor, $182k DHS+DoD). **Different companies. False positive.** Memo flagged this exact entity-resolution risk.

4. **Probed grants / loans / direct payments / other assistance** on same 200-sample (probe finished after initial substrate ship). Final tally: 50 filtered weak-match hits, all spot-checked, all false-positive name collisions matching the AVIATRADE pattern: SUN PROPERTIES LLC (Venezuela) ↔ "STERLING / PERFECT / MIDNIGHT SUN PROPERTIES"; CALIBER WEALTH MANAGEMENT LTD (Russia) ↔ US-RIA "CALIBER WEALTH MANAGEMENT LLC"; THE BUSINESS CENTRE LTD (Libya) ↔ "THE BUSINESS CENTRE OF QUINCY, INC"; TACO LLC (Russia) ↔ "TACO JOHNS OF DEADWOOD, LLC"; etc. **Final across all 5 award groups × 200 SDN US-style entities: zero real anti-join hits.**

5. **Direct probe of well-known SDN parents** (GAZPROM, ROSNEFT, SBERBANK, HUAWEI, VTB, AEROFLOT, KASPERSKY, etc.): one substantial hit on GAZPROMNEFT-AERO KYRGYZSTAN LLC, $895M+ DoD contracts.

## Why the strict anti-join is structurally empty

**SAM.gov screening is upstream of the anti-join.** The Federal Acquisition Regulation requires OFAC SDN screening before award. SAM.gov's exclusions feed automatically blocks registration for SDN-listed entities. By the time an obligation reaches USAspending, the entity has already cleared screening — or got grandfathered before listing.

This means the anti-join's negative space ("SDN entity in USAspending") is **policy-empty by design**. Across 200 randomly-sampled US-style SDN entities × 5 award-type groups, zero strong matches. The structural enforcement architecture works as advertised.

This kills the memo's pre-stated kill-gate (General License coverage) at a different layer: GLs are irrelevant when the entity-set is structurally empty before GL coverage even applies.

## The GAZPROMNEFT-AERO KYRGYZSTAN case (and why it dies)

Direct probe of "GAZPROM" returned **GAZPROMNEFT-AERO KYRGYZSTAN LLC** with three DoD contract actions:

- $521,894,818.43 (2011-09-26 → 2013-04-25, BPA "B001")
- $373,261,827.01 (2013-03-15 → 2014-08-25, BPA "B001")
- $0.00 closeout action (2014-12-18, contract SPE60015M1645)

Total ~$895M, **all flowing before August 2014**.

The entity is *not* on the SDN list. Its **parent** (PUBLIC JOINT STOCK COMPANY GAZPROM NEFT, UID 17143, Russia-EO14024 + Ukraine-EO13662) was SDN-listed January 2023.

EO14024 itself was only issued April 15, 2021. The contracts pre-date the executive order by 7-10 years. They are almost certainly Defense Logistics Agency operational fuel contracts for Manas Air Base, which the US closed June 2014.

**Chronology kills it.** Even the most promising-looking hit in the entire SDN list is timing-not-story.

## The shifted frame (50% Rule subsidiaries) — plausible but discounted

The interesting frame: not "sanctioned entity got federal money" (structurally empty) but **"federal money flowed to subsidiaries of sanctioned entities via OFAC's 50% Rule blind spot."**

OFAC's 50% Rule says an entity 50%+ owned by SDN parties is itself blocked — even if not on the SDN list. SAM.gov screening, however, runs against the explicit SDN list. Subsidiaries owned ≥50% by SDN parents but not separately listed are the gap.

This is a real investigation but:

1. **Verification burden is much higher.** Ownership graph isn't machine-readable. Per-entity corporate registry walks (foreign filings, SEC, FCPA self-reports) are unstructured work.
2. **The most-obvious lead is chronology-killed.** GAZPROMNEFT-AERO is the type case, and it dies. This is a confidence-lowering signal — the cohort may be much smaller than the shifted-frame argument predicts.
3. **OFAC FAQ + general license + wind-down period** complications stack per-hit.

I'd want a 2-hour sample walk on 3-5 post-2022 SDN parents (their named subsidiaries × USAspending hits in last 24 months) before committing to a 10-15h verification cycle.

## Kill-gate revision

The memo predicted General License coverage as primary kill-gate. The actual kill-gate stack:

1. **SAM.gov screening** — kills strict anti-join structurally. The cohort is policy-empty.
2. **Entity resolution** — kills weak name matches at the verification stage (AVIATRADE / Business Centre / Star MM pattern).
3. **Pre-listing chronology** — kills cases where the federal obligation predates parent's SDN listing (GAZPROMNEFT-AERO pattern).
4. **OFAC 50% Rule + ownership graph** — the surface where the shifted investigation lives, if it lives anywhere.
5. **General License coverage** — relevant only for the post-listing 50% Rule subsidiary residual cohort, if non-empty.

## Verdict

**STRICT FRAME KILLED at gate.** The "OFAC SDN got federal money" headline doesn't survive entity resolution + SAM.gov screening + chronology. The original frame is structurally empty before GL coverage even applies.

**SHIFTED FRAME (50% Rule):** plausible signal, but the most obvious candidate dies of chronology. Discounted from "ship this next" to "scope a sample-walk before committing."

**Recommendation:** Do not promote to publication-shape work. If interested in the 50% Rule angle: write a scoping memo with 3-5 candidate post-2022 SDN parents × subsidiary chains; 2-hour walk. Otherwise reallocate the budget to next pre-walk (HUD FHEO conciliation-closure framework — memo's #3).

## Cost

- ~$0.01 (USAspending + OFAC are free; one wrangler deploy for lab entry)
- ~1.5 hours wall time

## Beat-match (if shifted frame eventually publishes)

Justin Elliott (ProPublica), ICIJ network, Reuters investigative (Tom Lasseter / sanctions specialists). Higher-stakes beat than rural-environmental cohort; reporter universe more national and more skeptical. Verification burden rightly higher.

## What this confirms about cheap-verification discipline

The memo's prediction of "high variance" was correct, in shape if not direction. The pre-walk:

- Cost about 1.5 hours
- Killed the original frame before any prose
- Surfaced a different frame with a discounted-confidence signal (chronology kills the type case)
- Cost roughly nothing in API budget

Two of three top-3 anti-join candidates have now been pre-walked (RCRA SNC survives; OFAC SDN strict-frame killed, shifted-frame discounted). HUD FHEO remains the third. Pipeline discipline holds.

## Open verification gates (if shifted frame pursued)

1. **Sample 3-5 post-2022 SDN parents** (Wagner Group, Sberbank, Alfa-Bank, etc.). For each, identify 5-10 named subsidiaries from public sources. Probe USAspending for each subsidiary post-listing.
2. **OFAC General License inventory by program.** Russia EO14024 alone has ~100+ GLs. Catalog broad categories (humanitarian, telecom, wind-down) before any per-hit walk.
3. **Sub-recipient cohort.** USAspending tracks prime + sub-recipient. Test whether any subs are SDN-listed under clean primes. Not walked here.
