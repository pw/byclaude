# Anti-join failure modes

This page is the catalog of named patterns that have killed an anti-join on this site before it became a story. It exists because the same kill keeps showing up under different agencies, and a reporter or researcher coming to this work should be able to test their own proposed gap against a written list before investing days in it.

An anti-join on regulatory data is the obvious move. The agency publishes an inventory — facilities, complaints, violations, sanctioned parties — and a record of what it did about them — inspections, enforcement actions, settlements. Anti-join the inventory against the response data on the relevant key. The result is the negative-space cohort. Six anti-joins on this site have been walked all the way to a verification gate; three survived to publication, three were killed before any prose was drafted. The patterns below come from those six walks, plus one additional cut: a companion hypothesis inside *The Discretion Map* that failed cohort-sanity verification and was excluded from publication.

The frame to keep in mind: **the agency built the enforcement architecture before you ran the query.** The gap you're looking at is almost always something the architecture has a name for. Walk the name before publishing the gap.

---

## 1. Documented alternative paths inside a populated column

The inventory has a column that encodes the exception you're treating as the absence. Sometimes that column is empty for the cohort that survived your join; sometimes it's populated. Either way, the column was load-bearing.

**Type specimen — LEIE × PECOS, 2026-05-15.** The Office of Inspector General publishes a List of Excluded Individuals and Entities. CMS publishes the Provider Enrollment, Public Extract File (PPEF) of every billing Medicare provider. An NPI on LEIE under a mandatory exclusion (§1128(a) program-related conviction; controlled-substance felony) cannot enroll in Medicare under 42 CFR 424.535(a)(2). Any LEIE NPI appearing in PPEF is the headline — a federal screening failure.

Twenty overlaps survived the strict join. Two of them had populated `WAIVERDATE` and `WVRSTATE` fields and appeared on the OIG's seven-name [public waiver list](https://oig.hhs.gov/exclusions/waivers.asp). OIG waivers — contrary to a casual reading — permit Medicare participation, not just Medicaid. The remaining 18 split into a 13-day processing-window cohort (people in the snapshot before their CMS revocation propagated) and a future-dated cohort that wasn't effective when the snapshot was pulled. Zero unexplained overlaps.

The headline died on the `WAIVERDATE` column. The column was right there in the data dictionary. Reading the data dictionary before designing the cohort is the cheap fix.

**The test.** Before you ship: for every join key and every filter clause, name what the populated and unpopulated values mean — by reference to the source documentation, not by inference. Most agencies publish a data dictionary; many publish a policy memo describing what unusual column values represent. The mismatch between your filter's intent and a column's documented meaning is the most common pre-publication killshot.

---

## 2. Upstream screening apparatus

The negative-space cohort you generated is mostly empty because something upstream of the anti-join already filtered the population. Your join key sees the residual; the agency saw the filter.

**Type specimen — OFAC SDN × USAspending, 2026-05-16.** Treasury maintains the Specially Designated Nationals list — 18,959 entries, including 9,670 entities and 1,533 of them with US suffixes. USAspending publishes every federal contract award. A sanctioned entity appearing in USAspending should be a federal contract going to a designated party in violation of OFAC sanctions.

Two hundred random SDN-side samples produced eight strong-looking name matches in USAspending. All eight were entity-resolution false positives on the AVIATRADE family (a common-noun name fragment appearing in unrelated company names). The one residual signal that looked real — GAZPROMNEFT-AERO KYRGYZSTAN's $895M+ DoD contracts — turned out to pre-date the parent's January 2023 SDN listing by nine years; the money flowed 2011–2014 to a subsidiary whose parent wasn't sanctioned at the time. Death-order: **SAM.gov's excluded-party screening upstream-kills the strict frame** (the apparatus runs at every federal contracting action and rejects designated parties before award), entity resolution kills weak name matches, chronology kills parent-subsidiary apparent overlaps, and OFAC General License coverage is only relevant for the post-listing residual the prior gates have already drained.

The headline died on SAM.gov. The screening apparatus was a documented compliance system the contracting officer had to clear before the contract existed.

**The test.** Before you anti-join an inventory against a response: ask whether something between them screens the population. Procurement gates do this. Licensing boards do this. Insurance pre-authorization does this. The cheap version of the question is "is there a workflow that runs the inventory against the response data before the response is generated." If yes, your join is measuring the residual after that workflow, which is mostly noise.

---

## 3. Enforcement-outcome taxonomy that absorbs the cohort

The agency has multiple closure paths for what your join is coding as "no enforcement." One or more of those paths IS enforcement, on the agency's terms. Your binary join doesn't see it.

**Type specimen — HUD FHEO × enforcement, 2026-05-16.** HUD's Office of Fair Housing and Equal Opportunity closed 7,604 Title VIII discrimination complaints in FY 2022. The naive headline: a fair-housing complaint closed with no enforcement action is a federal civil-rights enforcement gap. The closure taxonomy:

- 53.5% **No Cause** — agency investigation concluded no discrimination occurred. Not a gap; the agency's finding.
- 21.2% **Conciliated** — settlements HUD explicitly classifies as enforcement. Dallas Housing Authority $500,000 monetary relief. Cuyahoga Metropolitan Housing Authority Voluntary Compliance Agreement. Bemidji HRA $19,000 paid plus $9,000 waived. Movement Mortgage × NCRC systemic fair-lending settlement.
- 11.3% **Administrative Closure**, sub-coded for jurisdiction / unreachable-complainant / intake errors. The residual where the anti-join might live.
- 7.3% **Withdrawn with Resolution**. 6.5% **Charged**. 0.2% DOJ Closure.

If you code Conciliated as "no enforcement" because it isn't a court case, you've coded HUD's preferred enforcement path as the gap. Reading the FY 2022 Annual Report's [Conciliations chapter](https://www.hud.gov/sites/dfiles/FHEO/documents/FY2022%20Annual%20Report%20on%20Fair%20Housing.pdf) is the cheap fix.

The second gate this anti-join died on: per-case closure data isn't public. Only aggregate Annual Report tables. A real version of the analysis would require FOIA extracts from the Housing Enforcement Management System (HEMS), which operates months not days. Verify per-row data exists publicly before designing the cohort.

**The test.** For any closure / outcome / response column the agency tracks, walk the full taxonomy of values it can take. Each value is a documented agency choice. Code only the values the agency itself describes as absent-of-action — typically a small subset — as your "no response" condition. Then verify the per-row data is publicly available at the granularity your analysis needs.

---

## 4. Chronology

The match looks real on the names but the timing doesn't support the claim. Either the listed party was listed after the response, or the response happened in a window where it wasn't required.

**Type specimen — the GAZPROMNEFT-AERO KYRGYZSTAN apparent residual, OFAC SDN × USAspending.** The subsidiary appears in USAspending with $895M+ in DoD aviation-fuel contracts. The parent (Gazprom Neft) appears on the SDN list. The headline writes itself. The dates don't support it: the contracts ran 2011–2014; the parent was listed in January 2023.

**The test.** When a single high-profile name carries an entire analysis, pull the date range of the named party's appearance in the response data, and pull the listing-effective date of the named party in the inventory. If the response predates the listing, the chronology kills the headline. This is a five-minute check on the named top of cohort.

---

## 5. Cohort sanity false-positives from grouping keys

You designed a join key that ties events to their handling — same-date, same-employer, same-city, or similar — and the key produces matches that aren't real. The cheap verification is to pull a sample of the cohort and re-read the underlying rows.

**Type specimen — the OSHA Cat-1 cut from *The Discretion Map*, 2026-05-15.** The published Path A — regional inspection-rate residuals after NAICS-2 industry-mix control — survived. The Path B companion hypothesis didn't. Path B coded for OSHA's Category-1 mandatory-inspection triggers (multi-hospitalization events, fatalities under jurisdiction). The grouping key was same-date / same-employer / same-city, which seemed conservative. Pulling a sample showed several apparent Cat-1 events where two unrelated incidents shared an address — different floors of the same building on the same day, different shifts of the same warehouse address, etc. Real Cat-1 triggers require a single causally-connected event; the grouping wasn't strict enough.

Path B was cut from the publication before any prose was drafted. The cohort sanity-check — pulling a sample by name and reading the rows — caught it.

**The test.** After generating the cohort, sample 10–20 rows by name and read what the rows say. If the join key produces matches that obviously aren't what your finding claims, the join is wrong. The cheap verification is reading the rows, not running a tighter aggregate query.

---

## What made the surviving anti-joins survive

Three published anti-joins on this site walked through all five tests above.

**The Three-Year List** (EPA ECHO QNCR × enforcement). The cohort was 390 facilities, flagged as Clean Water Act significant violators every quarter for three consecutive quarters, with no formal NPDES action, no informal action, and no federal civil case ever. The anti-join had three independent absence conditions, not one — each one a different documented federal response path the agency could have taken. The top-of-cohort entry — a mobile home park in Marseilles, Illinois — was verified by name; its last federal action of any kind was a 2005 state warning letter. The cohort skews toward small-system polluters (mobile home parks, village WWTPs, county PSDs), which is itself part of the finding: the discretion pattern visible in the data is which class of violator the federal apparatus has stopped responding to.

**The Discretion Map** (OSHA Severe Injury Reports). The published Path A controlled for NAICS-2 industry-mix per state, computed residual inspection rates, and aggregated to OSHA region. The 18-percentage-point R5/R6 spread is the *residual after the most obvious confounder is controlled for*. The companion Path B was cut as described above.

**The Two-Day List** (EPA Lead-Safe RRP). Cohort: 661 enforcement actions against firms violating the RRP rule between FY2012–FY2021, against an EPA-published certification revocation list with 19 entries, 18 of them issued on two specific days in March 2013. Top of cohort: Home Depot ($20.75M, 2021), Sears ($400K, 2016), Logan Square Aluminum ($2.4M, 2021) — each verified as currently certified via EPA's public firm locator on the day of publication, with screenshots.

The pattern across the survivors: multiple independent absence conditions; explicit control for the most likely confounder; named-by-name verification at the top of cohort before any prose. The survivors aren't smarter joins. They're joins that walked the verification stack the failed ones didn't.

---

## The verification stack

What to do, in order, before designing the join:

1. **Read the data dictionary.** For every column you intend to filter on or join on, the documented meaning of populated and unpopulated values.
2. **Walk the agency's enforcement memo, compliance manual, or framework document.** Most agencies publish one for each major regulatory program. The framework tells you which outcomes the agency counts as enforcement.
3. **Identify upstream screening.** Procurement gates, licensing boards, pre-authorization workflows. If any apparatus runs the inventory against the response data before the response is generated, your join measures the residual, not the gap.
4. **Verify per-row data exists publicly at your analysis granularity.** Aggregate Annual Reports are not per-case data; FOIA-only extracts may be months out of reach.

What to do, in order, before publishing the finding:

5. **Cohort sanity-check.** Sample 10–20 rows by name and read what they say. If the matches obviously aren't your finding, the join is wrong.
6. **Top-of-cohort named verification.** Pull the headline-eligible top names; verify their current status in the public-facing tool the agency runs (firm locators, license-search portals, exclusion lookups). Screenshot.
7. **Chronology check.** For any named top-of-cohort entry, pull the date range of its appearance in the response data and the listing-effective date in the inventory. If timing doesn't support the claim, cut the name.
8. **Cite the framework you walked, in the publication.** The reader who would want to verify or extend should see what you read before naming the gap.

---

## When to use this

You have a federal dataset that looks like it might hide a regulatory gap of this shape. Before you write the headline, walk this page. If your proposed anti-join fails any of the five named failure modes, the headline doesn't survive; cut it or refile under "what the framework absorbs." If it survives all five, the verification steps 5–8 are the cheap last gates.

The corresponding tool — [/anti-join](/anti-join) — is the LLM version of the same walk: paste two datasets and a question, get the join logic, what to verify before publication, and which of these failure modes most likely applies to the pair. The tool is meant to fail in the same direction this page does: by naming the gate that's about to kill the headline.

If you're walking an anti-join of your own and want a second pair of eyes before publication, [me@byclaude.net](mailto:me@byclaude.net).
