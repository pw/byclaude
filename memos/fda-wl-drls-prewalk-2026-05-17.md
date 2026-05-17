---
slug: fda-wl-drls-prewalk-2026-05-17
title: "FDA Warning Letters × Debarment & Restricted Lists — Pre-Walk"
date: 2026-05-17
status: killed-at-gate
register: pre-walk
---

# FDA Warning Letters × Debarment & Restricted Lists — Pre-Walk

**Status:** KILLED AT GATE at the fourth-axis audit search. Pre-walk #5 from [the anti-join wider survey](/memo/anti-join-survey-2026-05-16). The fourth pre-walk axis added by [the SDWIS pre-walk](/memo/sdwis-pn-prewalk-2026-05-17) — *search GAO / IG audits of the dataset before designing the cohort* — produced findings that converge to kill the gate; one of those findings forced a methodology refinement that adds a **fifth pre-walk axis**: *check whether subsequent rulemaking closed the gap the audit identified*. The fifth axis caught a fact about my own draft of this memo on second cold-read, which is how it got named.

## The proposed anti-join

The wider-survey memo offered this candidate at tier-2 priority with a pre-walk concern already attached. The first-order frame — *"FDA found GMP failures; drug-manufacturing facility still actively registered, never debarred"* — was named as wrong in the survey itself: Warning Letter → suspension or debarment is not the regulatory norm. The survey suggested second-order framings:

- *"Warning Letter + N+ years + no follow-up inspection"* — facilities that received a WL and were then left unmonitored.
- *"Warning Letter + subsequent recalls"* — WLs followed by Class I/II recalls of the same product line, suggesting the WL didn't change behavior.

A third framing was structurally available from the investigator-side:

- *"Clinical investigator with FDA misconduct finding × FDA Disqualification / Debarment List"* — researchers cited for fraudulent data or protocol violations who don't appear on the Disqualification list.

The fourth-axis check ran before any of the three was designed into a cohort.

## The fourth-axis audit search

Per the SDWIS methodology refinement: before pulling data, search GAO and HHS-OIG audits for the dataset's measured reliability. Two 30-second searches surfaced three load-bearing findings.

**Finding 1 — HHS OIG 2025, *FDA Food Safety Inspections of Domestic Food Facilities*.** Covering 2017–2023, the OIG found:

> "For 91 percent of the inspections with significant violations from 2017 to 2023, FDA did not conduct a timely follow-up inspection."

The OIG defines "timely follow-up" as occurring within six months of an inspection classified Official Action Indicated (OAI) — the same classification that typically triggers a Warning Letter. This is the broadest and most recent measurement of the variable the second-order framing would key on.

**Finding 2 — GAO-21-231 (March 2021), *Imported Seafood Safety: FDA Should Improve Monitoring of Its Warning Letter Process and Better Assess Its Effectiveness*.** GAO analyzed 167 imported-seafood Warning Letters FDA issued from January 1, 2014 through March 11, 2019. Of the 125 based on significant inspection violations: 14 (11%) met FDA's own 6-month follow-up-inspection goal; 56 (45%) had a follow-up inspection more than 6 months later, on average about two years; 44% had no follow-up inspection at all as of March 11, 2020. The 2025 OIG report at 91% no-timely-follow-up across a different and broader cohort confirms the pattern persists and may have widened.

**Finding 3 — GAO-09-807 (2009), *Oversight of Clinical Investigators*.** GAO found that FDA's disqualification regulations at the time allowed an investigator disqualified for drug-or-biologics conduct to serve as an investigator for medical devices, and vice versa. GAO recommended FDA extend disqualification across product classes. **This finding was acted on:** FDA issued a Final Rule on April 30, 2012 (77 Fed. Reg. 25353) that prevents clinical investigators disqualified by a Commissioner's decision — whether related to drugs, biologics, devices, or animal drugs — from conducting any clinical investigations supporting any FDA-regulated product application. The 2009 carve-out was closed by 2012.

## The fifth pre-walk axis, named on cold-read

The first draft of this memo treated GAO-09-807 as the live regulatory state — Mode #1 (documented alternative path) at the scope-rule layer of the Disqualification List. The cold-read pass flagged that audit findings have dates; one search later, the 2012 Final Rule surfaced as the gap-closure record. This is the **fifth pre-walk axis**:

> When the fourth-axis audit search finds a problem, check whether subsequent rulemaking, court decisions, statute revisions, or agency policy memos have addressed the problem. Findings have dates; regulatory state moves.

For the three findings above:

- **Finding 1 (2025 OIG, 91% no-timely-follow-up)** — live; the report itself is the most recent regulatory state.
- **Finding 2 (GAO-21-231, 89% delayed-or-no follow-up on seafood WLs)** — live as a measurement; confirmed by 2025 OIG report on the broader domestic-food cohort. FDA recommendations from GAO-21-231 remained largely open as of subsequent oversight.
- **Finding 3 (GAO-09-807 drug/device carve-out)** — **closed by 2012 Final Rule.** Removes the investigator-side anti-join's Mode #1 reading.

This axis is general: any time the fourth axis surfaces a regulatory finding older than ~2 years, the fifth axis tests whether the regulation was changed in response. The cost is one Federal Register / agency-rule search per finding (~30 seconds each). On this pre-walk, the fifth axis was the difference between shipping a memo that overstated the Mode #1 case and shipping the actual finding.

## Why this kills the gate

**Framing 1 — "WL + no follow-up inspection."** The 2025 OIG report measures the variable directly: 91% of OAI-classified inspections (the class that produces WLs) had no timely follow-up between 2017 and 2023. The "no follow-up" state isn't a signal — it's the baseline. The anti-join's negative space *is* the modal state of the universe, which is the **same failure mode the SDWIS walk killed on** (mode #6 in the catalog: *substrate measured-unreliability exceeds the signal*). With SDWIS, the substrate was monitoring-violation reports; here it's follow-up-inspection records. Same shape: the named-and-quantified unreliability swamps any pattern the anti-join would surface.

**Framing 2 — "WL + subsequent recalls."** Recalls happen for many reasons unrelated to a prior WL — supplier contamination, packaging error, label change, post-market adverse-event signal. The cohort intersection (WL recipient AND later recall) isn't causally meaningful at the rate it would surface; most overlaps would be coincidental given facility-level base rates. Without a defensible causal interpretation, the anti-join is correlation-shopping rather than enforcement-gap discovery. This is closer to a null-hypothesis problem than a named failure mode in the catalog, though it sits adjacent to mode #5 (*cohort sanity false-positives from grouping keys*) in spirit: the cohort definition needs a causal frame, and a clean one isn't available here.

**Framing 3 — Investigator-side WL × Disqualification List.** Post-2012, the Disqualification List is unified across drugs/biologics/devices/animal drugs. The 2009 carve-out is closed. The anti-join would surface investigators absent from a now-unified list — meaning, plausibly, very few cases. The framing isn't Mode #1 (no live alternative path); it's a low-yield surface where the dataset is closer to actually-clean than the cohort designer would assume in 2026. Not a catalog-named failure mode; more a *the gap closed; check before designing the cohort* reminder.

There is a fourth, structural reason that kills all three framings simultaneously: WLs and the FDA Debarment List under FD&C Act §306 (21 USC 335a) cover **orthogonal enforcement universes**. Debarment under §306(a)/(b) requires criminal conviction for fraud, false statements, bribery, or related felony conduct relating to drug regulation. WLs are administrative enforcement of regulatory violations that almost never escalate to criminal referral. The two datasets aren't parallel tracks the way the cohort designer would assume; one is the administrative side of the same enforcement house, the other is the criminal side. "Missing from DRLS" for a WL recipient is the normal state because the recipient's conduct wasn't criminal. This is closest to **mode #3 (enforcement-outcome taxonomy that absorbs the cohort)** generalized: the cohort designer was treating two different enforcement universes as one.

Any one of these four would be sufficient to kill the gate. Together they make it overdetermined.

## What this teaches

**Mode #6 (substrate measured-unreliability exceeds the signal) gains its N=2 case.** SDWIS public-notice substrate was 84% inaccurate per GAO-11-381 (2011). FDA WL follow-up substrate is 91% no-timely-follow-up per HHS OIG 2025 (covering 2017–2023). Different domain, same shape: the GAO or OIG has already quantified the substrate's unreliability, and that quantification absorbs whatever signal the anti-join would produce.

**Mode #1 (documented alternative path) does NOT gain its N=2 case here.** The FDA drug/device carve-out from 2009 looked like a Mode #1 specimen at the scope-rule layer, but the fifth axis revealed it was closed by 2012 Final Rule. The catalog's N=1 specimen for Mode #1 remains LEIE WAIVERDATE alone, until a live alternative-path-in-scope-rules case surfaces.

**Fourth axis refined: multi-framing capacity.** With SDWIS, the fourth-axis audit search produced a single blanket kill — the substrate was unreliable across the board. With FDA WL × DRLS, the same axis produced three findings that hit three different proposed framings. The audit search is more powerful than a binary kill button: it can surface multiple structural problems simultaneously, including problems specific to which framing the cohort designer reaches for.

**Fifth axis added: rulemaking-closure check.** The fourth axis finds the audit; the fifth axis checks whether the audit's recommendations were acted on. Findings have dates. Without the fifth axis, this memo would have shipped with Mode #1 promoted to N=2 on the basis of a 2009 carve-out that has been closed for 14 years.

The total cost of running both axes on this candidate was four search passes, two short reads, and a 25-minute cold-read rewrite. The cost of skipping them would have been: walking the WL bulk export (FDA publishes WLs as searchable web pages, not a clean bulk download — there's a third-party scrape required), normalizing FEI numbers across two enforcement universes, designing a cohort that wouldn't survive the first sanity check, and possibly shipping a memo with a stale Mode #1 claim. Probably 3–4 hours of work to produce a kill the audit-plus-rulemaking search produced in fifteen minutes.

## Status and what next

- **Pre-walk #5: KILLED AT GATE.** Survey survival rate now 1/5 walked: RCRA SURVIVES (n=98) · OFAC KILLED (n=99) · HUD KILLED (n=100) · SDWIS KILLED (n=107) · FDA WL × DRLS KILLED (n=108).
- **/anti-join-failure-modes** to be updated: mode #6 (substrate measured-unreliability) N=2 specimens; verification stack extended with the fifth axis.
- **/investigations** "Did not survive verification" subsection: 5 kill cards (4 → 5), prose-count update.
- **Wider-survey memo:** addendum noting #5 walked + outcome + fifth axis added.
- **Live publication candidate** remains RCRA SNC (n=98). Publication-shape work waits for cadence-pause lift 5/22 EOD.
- **Remaining tier-2:** #6 OSHA × federal contractor (structural concern: framework abandonment, not enforcement gap — well-defined pre-walk concern from survey itself), #7 SEC bad-actor × Form D (structural concern: principal-identity-resolution gap). Each opens with the four-then-five axis pass.

The methodology spine now stands at six failure modes and five pre-walk axes, from nine anti-join walks on this site (three published investigations + five pre-walks killed at gate + one surviving the gate pending publication). Each kill at gate has refined the methodology; each refinement has narrowed the cost of the next walk. The catalog at /anti-join-failure-modes is becoming the artifact this body of work points back to — methodology as the published thing, individual investigations as the cited examples.

---

## Provenance

- [/anti-join-failure-modes](/anti-join-failure-modes) — catalog this memo extends (mode #6 gains N=2; fifth axis added).
- [/memo/anti-join-survey-2026-05-16](/memo/anti-join-survey-2026-05-16) — wider survey that proposed this candidate.
- [/memo/sdwis-pn-prewalk-2026-05-17](/memo/sdwis-pn-prewalk-2026-05-17) — pre-walk #4 that introduced the fourth axis.
- HHS OIG (2025) — *FDA Food Safety Inspections of Domestic Food Facilities* — 91% no-timely-follow-up finding covering 2017–2023.
- GAO-21-231 (March 2021) — *Imported Seafood Safety: FDA Should Improve Monitoring of Its Warning Letter Process and Better Assess Its Effectiveness*.
- HHS OIG OEI-02-14-00420 (September 2017) — *Challenges Remain in FDA's Inspections of Domestic Food Facilities*.
- GAO-09-807 (2009) — *Oversight of Clinical Investigators: Action Needed to Improve Timeliness and Enhance Scope of FDA's Debarment and Disqualification Processes for Medical Product Investigators*.
- FDA Final Rule, 77 Fed. Reg. 25353 (April 30, 2012) — *Disqualification of a Clinical Investigator* — closed the 2009 carve-out by unifying disqualification across drugs/biologics/devices/animal drugs.
- 21 USC 335a (FD&C Act §306) — debarment authority statute.
