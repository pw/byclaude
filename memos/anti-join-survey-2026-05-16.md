# What other anti-joins are there? A wider survey.

**2026-05-16 ~04:00 UTC. Pipeline memo, not decision memo. Greenlight subset → I walk it through cheap-verification next tick.**

## Frame

Five threads got named in the windfall session; three landed. The named-but-unpicked one is **anti-join wider survey** — and this is the right window for it. Investigations track is on cadence-pause until 5/22 (reading pitch responses); meanwhile, what's the next-3 pipeline?

The shape that's working — the publication-shape memory written 5/14, sharpened by the OSHA SIR ship 5/15 and the LEIE multistate replication 5/16:

- Pick a federal dataset where a regulator publishes a list (exclusion, citation, enforcement order).
- Find the anti-join: "the list says X happened; what should follow Y, but doesn't?"
- Walk the enforcement memo or operating rule that defines Y. **This is the cheap-verification gate.** A populated-column may be the alternative path (LEIE no-NPI = OIG's `WAIVERDATE` type specimen). An empty-column may mean compliance was filed elsewhere (CMS provider directory deferred).
- If the gate holds, the anti-join's negative space is a structural cohort.
- Beat-match to reporters; pitch from byclaude.

Three publications shipped from this template in five days (Three-Year List, Discretion Map, LEIE-multistate-staged). One killed at gate (PECOS, n=83). The pattern is legible. The bottleneck is **which question to ask next**.

## What I'm scanning for in candidates

Each axis below gets a quick read on four things:

1. **Bulk-downloadable on both sides** — the anti-join needs raw data, not a search UI. Open-data portals (Socrata, USAspending, EPA Envirofacts) → cheap. FOIA/PRA → expensive enough to defer until we know the gate holds.
2. **The negative-space isn't ambiguous.** This is the LEIE-NPI lesson, type specimen for misreading negative space. The empty column may be the OIG's documented alternative path. A clean anti-join requires that the negative space is *only* the gap we're naming.
3. **Story-shape is intuitive.** "X happened, Y was required, Y didn't." If you have to explain the regulatory framework before the headline lands, it's the wrong cohort.
4. **Reporter beat exists.** Three-Year List → rural environmental (Melotte). Discretion Map → labor/workplace safety (deck of 5). LEIE × Medicaid → state-fraud (national: Galewitz, Pradhan, Kliff). Without an identifiable beat, the publication runs into byclaude's distribution-thinness without recourse.

## The candidate field (15 axes, ranked)

Ranking is **my read for the next investigation** — combines data accessibility × novelty × story-shape × reporter-beat-match. Italicized = blocked or expensive enough to defer.

**Top tier — could ship in 3-7 days from here:**

1. **EPA RCRAInfo Significant Non-Compliers × federal enforcement closure (CWA → RCRA).** Same anti-join shape as Three-Year List, different organ. RCRA's Compliance Monitoring And Enforcement (CME) layer in RCRAInfo tags facilities as Significant Non-Compliers (SNC) quarterly, same designation language as CWA's HLRNC. Cohort is "SNC for N+ quarters, no formal action settled." Reporter beat: same environmental investigative network as CWA, but Daniel Cusick / Lerner / Lustgarten cover hazardous-waste more directly than wastewater. **The structural pay-off:** if RCRA replicates the CWA finding, the pattern is "EPA media-shopping" — same dynamic, two media, which is the meta-finding worth more than either.

2. **OFAC SDN List × federal grants & contracts (USAspending.gov).** "Sanctioned entity received federal money." Both 100% public, both bulk-downloadable. OFAC SDN ≈18k entries; USAspending covers contracts ($600B/yr) + grants ($800B/yr). Reporter beat: ICIJ, ProPublica's Justin Elliott, Reuters investigative. **Story-shape on hit:** "Treasury said don't do business with X; Commerce/USDA/HHS did." **Pre-walk concern:** SDN entity-resolution is genuinely hard (aliases, weak names, legal-entity vs DBA). False-positive cost is high; sanity-check protocol must be heavy.

3. **HUD FHEO complaints × HUD enforcement actions (closure code analysis).** "Fair-housing complaint filed, no enforcement closed within X." HUD publishes both FHEO filings and case closures in machine-readable form. Reporter beat: housing/poverty/civil-rights (Aaron Glantz, Aliyya Swaby at ProPublica, Reveal). **Pre-walk concern:** "Conciliation without finding" is a documented closure mode and is *not* an enforcement gap — it's a settlement path. The anti-join has to exclude conciliation-closures or the cohort is misleading. This is the LEIE-NPI shape: the empty column has a documented alternative.

**Second tier — worth pre-walk but expect at least one gate failure:**

4. **EPA SDWIS Tier-1 violations × public-notice required.** "Health-based drinking-water violation; required customer notice not issued." SDWIS Federal publishes both violation rows and public-notice rows (Public Notice Tier 1 / Tier 2). Reporter beat: PWW PFAS network already wired in (Bruggers, Bagenstose, Perkins, Lerner) — could be a follow-on to PFAS Phase 3. **Pre-walk concern:** "Public notice issued but not entered into SDWIS" is a known compliance gap that's a documentation issue, not a non-notice. Need to read EPA's PN compliance memo.

5. **FDA Warning Letters × Drug Establishment Registration (DRLS).** "FDA found GMP failures; drug-manufacturing facility still actively registered." Warning Letters are public + structured; DRLS is bulk-downloadable. FEI numbers are the clean join key. Reporter beat: STAT (Ed Silverman), Reuters Health, KHN. **Pre-walk concern:** Warning Letter → suspension is *not* automatic and rarely happens; the regulatory norm is corrective action with continued registration. The anti-join is really "Warning Letter + N+ years + no follow-up inspection" or "Warning Letter + subsequent recalls." Sharper if framed at second order, not first.

6. **OSHA citations × federal contractor awards (USAspending).** "Repeat OSHA-cited employer got new federal contracts." Biden's Fair Pay & Safe Workplaces rule was struck down in 2017, so the anti-join surfaces the regulatory-abandonment story: the data integration exists, no procurement-eligibility consequence exists. Reporter beat: Discretion Map deck overlaps; could be follow-on. **Pre-walk concern:** Federal procurement law explicitly does not require OSHA-clean status (with narrow exceptions for E.O. 13658 wage and 13706 sick-leave). The anti-join is structurally pointing at policy abandonment, not enforcement gap — different story-shape than Three-Year List / Discretion Map. Worth deciding if that's the right register for byclaude.

7. **SEC bad-actor disqualifications × Form D issuer filings.** Reg D Rule 506(d) automatic-disqualification list × ongoing Form D issuer principals. SEC enforces 506(d) thinly. Both datasets public (EDGAR). Reporter beat: securities-fraud investigative (Liz Hoffman at Semafor, Pratin Vallabhaneni at Bloomberg). **Pre-walk concern:** Disqualified-person principal list isn't directly published; you have to infer principals from Form D Item 3 (signed by). Identity-resolution gap.

**Third tier — structurally sound but expensive / blocked:**

8. *DEA registration revocations × state medical license status (state-by-state).* No national bulk source for state medical licenses; requires per-state scraping like the LEIE × state-Medicaid survey but at 50× the variance.

9. *State medical board sanctions × PECOS enrollment.* Mirror of LEIE × state-Medicaid but with state board data on the exclusion side. NPDB (National Practitioner Data Bank) is the canonical source — and is statutorily confidential. Public state-by-state board action data is uneven; FSMB sells a roll-up to insurers. Blocked on data access.

10. *FCC Broadband Data Collection self-reports × challenge-data outcomes.* "Carrier reported served, challenge upheld, no enforcement." BDC challenge data is post-2022 and the FCC's enforcement on inaccurate reporting is famously thin. **Pre-walk concern:** The challenge process is technically a *data-quality correction*, not an enforcement trigger. There's nothing to anti-join *against* — the challenge data already produces the negative space. The anti-join would be "challenged AND upheld AND carrier did not correct in subsequent filings," which is one click deeper than the public dashboard but doable.

**Fourth tier — interesting but small-cohort or low-stakes:**

11. *FAA airworthiness directives × N-number compliance.* AD compliance is tracked in maintenance records, not centrally; only aggregated through Type Certificate Holder reports. Cohort would surface in NTSB accidents post-AD-noncompliance, which is mortality-attached and ethically heavier.

12. *NHTSA recalls × VIN-level repair completion.* Manufacturer-reported quarterly completion rates exist. "Recalls outstanding by manufacturer" is a known story-shape that consumer-protection reporters cover; the marginal investigative value is low. Honda's airbag recall is the canonical type specimen.

13. *FEC pay-to-play violations × federal contractor awards.* Federal-contractor political-contribution restrictions are narrow (only certain contracts during certain windows); the anti-join surfaces a small cohort that mostly turns out to be reporting errors on the FEC side.

14. *OFCCP discrimination findings × federal contractor awards.* OFCCP findings are not bulk-public; settlements are partial. Blocked on data access.

15. *BIS Denied Parties List × federal disbursements.* Mirror of OFAC × USAspending, smaller list, narrower beat. Skip in favor of #2.

## Cheap-verification pre-walk for the top 3

This is the part that doesn't get cheaper. For each top-tier candidate, the questions that need answers before drafting prose:

### #1 RCRAInfo SNV × federal enforcement closure

- **Data dictionary:** EPA's RCRAInfo Public Documentation defines Significant Non-Complier (SNC) as a facility with a specified pattern of noncompliance — read the formal RCRA definition; the criteria may differ from CWA's HLRNC sub-codings. The CWA's HLRNC has five sub-codes (S/E/X/T/D); RCRA's SNC criteria are framed differently (Class I violations + sub-tests). Confirm before filter.
- **Negative-space risk:** RCRA enforcement can close via state primacy (most states are RCRA-authorized). The anti-join must cross both EPA Region-level enforcement *and* state-level enforcement (state authority info in RCRAInfo CME table). The CWA Three-Year List explicitly accounted for state enforcement; same here.
- **Sanity-check probe:** top 5 SNC-by-quarter-count names → web-search → if any is an actively-remediating operator (Magnolia equivalent), the methodology breaks.
- **Beat-match:** Cusick, Lerner, Lustgarten, Bruggers. Probably overlaps with PFAS Phase 3 list 70%+.
- **Effort:** 2-3 hours data + 1-2 hours verification + 1-2 hours essay + pitch deck. Standard publication-shape cost.
- **Pay-off:** If RCRA replicates CWA's structural finding, the meta-story is "EPA's media-shopping enforcement pattern is consistent across media, not just CWA." Stronger than either alone.

### #2 OFAC SDN × USAspending

- **Data dictionary:** SDN list has 18 entity types (individuals, vessels, aircraft, entities). USAspending has prime recipients + sub-recipients. The join key is name + DUNS/UEI; SDN doesn't have UEI. Name-matching needs fuzzy entity-resolution with high precision (SDN false-match on a common surname → catastrophic).
- **Negative-space risk:** OFAC General Licenses permit specific transactions with SDN parties (humanitarian, legal, etc.). USAspending obligations to SDN parties under General License are *not* sanctions violations. The anti-join's negative space must exclude General License-covered obligations — and there's no machine-readable General License coverage list. This is a Magnolia-shape problem.
- **Sanity-check probe:** top 5 hits → web-search for General License, OFAC FAQ guidance, agency-specific exemption (USDA food-aid is a known exception).
- **Beat-match:** Justin Elliott (ProPublica), Reuters / ICIJ. Higher-stakes beat than Three-Year List → either bigger cite or no cite.
- **Effort:** 4-6 hours data + 4-6 hours verification (the General License walk is the expensive part) + essay + deck. **Roughly 2× standard cost.**
- **Pay-off:** Sanctioned entity got federal money is a sharp headline; falsifies if General License coverage explains all hits. Genuinely uncertain in advance — high variance.
- **My read:** Sharp enough to do, but pre-walk the General License coverage *before* committing. If General Licenses cover most cohort, kill at gate like PECOS.

### #3 HUD FHEO complaints × enforcement

- **Data dictionary:** HUD FHEO publishes complaint data via FOIA-published dashboards; enforcement actions ("charge," "conciliation," "settlement," "no cause") are coded on closure. The anti-join has to define "enforcement" carefully — conciliation-with-relief is HUD's most common closure and is *not* a non-enforcement outcome.
- **Negative-space risk:** The closure code `Conciliation – settlement reached` is an enforcement outcome under HUD's framework. Filtering it as "non-enforcement" would misrepresent the cohort. This is the LEIE-NPI shape, sharpened: the empty side has multiple documented alternative paths.
- **Sanity-check probe:** Read HUD's "Title VIII Conciliation Procedures" memo + Office of FHEO enforcement docs. Define "enforcement" as `charge filed` or `cause determination + settlement` or `voluntary compliance agreement with monetary relief`; explicitly exclude conciliation-no-cause closures.
- **Beat-match:** Aliyya Swaby (ProPublica), Aaron Glantz (Reveal alum), Maya Rao (Star Tribune housing), Jared Brey (City Journal). Strong beat.
- **Effort:** 2 hours data + 4-5 hours verification (the FHEO procedural walk) + essay + deck. 1.5× standard.
- **Pay-off:** Fair-housing enforcement gap is a stable journalistic interest. The story-shape "filed but not enforced" lands if the negative-space cut is clean.
- **My read:** Walk the conciliation framework first. If conciliation-with-relief is the dominant closure path (likely), the anti-join is "no charge AND no cause-based settlement AND no VCA-with-relief" — much narrower cohort. May not survive the gate.

## Suggested ordering

When cadence-pause lifts (≥5/22):

- **#1 RCRAInfo first.** Lowest pre-walk cost, highest pattern-replication value, beat already wired through PFAS Phase 3 network. The structural-replication finding compounds the Three-Year List into a media-pattern claim, which is the larger story.
- **#2 OFAC × USAspending second**, *after* pre-walking General License coverage as a kill-gate. High-variance, expensive — but if it survives, it's the biggest single-investigation potential cite in the field. Reporter network is more national than the rural-environmental cluster.
- **#3 HUD FHEO third**, *after* pre-walking the conciliation-closure framework. If the negative-space cut is clean, ship; if conciliation eats the cohort, document the kill at gate and move on.

The pattern across all three: **walk the regulatory framework first, then the data**. This is the inverse of the temptation, which is to run the SQL first and discover the framework as objections to the cohort. PECOS was the type specimen for "run query, then read enforcement memo, then kill." Skip the run-first step entirely from now on.

## Kill criteria during pre-walk

For any candidate above, the pre-walk dies if:

- The negative-space has a documented alternative path that explains most of the cohort (LEIE-NPI / PECOS shape).
- The top-of-cohort sanity check surfaces an actively-remediating operator or known-corrected case (Magnolia shape).
- The anti-join is a tautology of the regulatory framework (FCC challenge data shape — the challenge already produces the negative space).
- The story-shape requires explaining the framework before the headline (every Reg-D / FEC shape).

Document the kill in a 1-page memo, file as a `status: killed` lab entry, move to the next candidate. The killed-at-gate publications are part of the body of work; the discipline is what makes the surviving ones credible.

## Not in this survey

- **State-level expansions of LEIE × Medicaid** (MS, FL, OH, TX next per states-survey.md). Those are continuations, not new patterns. Continue independently when cadence permits.
- **PWW PFAS Phase 4+** (per-aquifer expansion). Different shape — data layer extension, not anti-join investigation.
- **Adjacent patterns that aren't anti-joins.** Audit-of-audit (FYL shape), regulator-letter-analysis (Oz letter post-mortem), data-quality investigations of single datasets — all valid, but a different memo.

## What I want from you

This is a pipeline memo, not a decision memo. Specifically:

- **Greenlight RCRA pre-walk** (read EPA's RCRA SNV definition + state-primacy enforcement memo; report back next tick) → I think this is the right next investigation when pause lifts. ~1 hour to walk the framework.
- **Greenlight OFAC pre-walk** (read the General License coverage architecture, decide if the anti-join survives) → high variance, walk it before committing. ~2 hours.
- **Greenlight HUD pre-walk** (read the Title VIII closure-mode framework, decide if conciliation eats the cohort) → ~1 hour.

If you greenlight all three, that's ~4 hours of pre-walk over the next 2-3 days, all of which can happen during cadence-pause without violating it (pre-walk isn't publication). If you greenlight one, that's the priority. If you greenlight none and want a different shape, that's the strategic-question worth more than the pre-walks.

## Provenance

- `feedback_anti_join_publication_shape` — the template this memo extends.
- `feedback_cheap_question_needs_cheap_verification` — the discipline this memo respects.
- `feedback_load_bearing_policy_kills_cheap_anti_join` — the LEIE-NPI / `WAIVERDATE` lesson that shapes the negative-space-risk column in every candidate above.
- 5/16 windfall session — named anti-join wider survey as the unfinished 5th big-swing thread. This memo is the pickup.
