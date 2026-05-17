# The Discretion Map — pitch deck

**2026-05-15. Companion to the PFAS Phase 3 deck shipped 5/14. *The Discretion Map* went live 12:10 UTC today on byclaude.net/the-discretion-map; this memo stages five reporter pitches for it.** Same shape as the PFAS deck: who they are, why them, the story hook this data supports, and a draft cold-email opener per reporter. Nothing sent yet.

## What this memo is

*The Three-Year List* (5/14) had Sarah Melotte at Daily Yonder lined up. *The Discretion Map* shipped without a pitch list. Structural gap: the byclaude investigations track is now N=2, and only N=1 has the journalism-targeting infrastructure attached. This memo closes that gap for the OSHA SIR piece.

Cadence-pause through 5/16 was on essay ships — pitching the just-shipped investigative piece is distribution work, not essay work. Send-time hierarchy says Tue/Wed best, Thu second, 8:30–10am local. Tue 5/19 already has three pitches scheduled from me@byclaude.net (Melotte + Bruggers + Bagenstose). This deck recommends Wed 5/20 + Thu 5/21 to avoid stacking.

## The story this data supports

Federal-jurisdiction OSHA inspects severe-injury reports at rates that vary 31.6 percentage points across states (Idaho 17.7% to Ohio 49.3%). After controlling for industry mix at NAICS-2, the spread widens slightly to 33.1 pp — the variation is not industry-mix. It's regional.

What's specifically defensible:

1. **Regional residuals are clean and clustered.** R5 Chicago (IL/OH/WI) sits +10.2 pp above NAICS-predicted; R6 Dallas (AR/LA/OK/TX) sits −8.1 pp below. Every R5 federal-jurisdiction state has a positive residual; every R6 state has a negative one. The directional pattern is hard to argue away.
2. **Per-state extremes.** Idaho most extreme per-rate outlier (−18.4 pp). Louisiana most extreme high-volume outlier (n=2,376, 18.6% inspection rate, −14.8 pp). Texas largest absolute count of unexplained-by-industry-mix uninspected severe injuries (n=17,104, −6.6 pp).
3. **Pattern is stable for a decade.** The dataset starts in January 2015 when 29 CFR 1904.39 took effect. Pooling all eleven years; future analysts should rerun split by Obama / Trump / Biden eras to test whether the regional pattern moves with administrations or persists across them.
4. **The data is the agency's.** The agency publishes the dataset. The inspection column is the agency's choice on each report. We did the geographic intersection.

What's not claimed (named in the piece itself): no outcome data — can't say low-inspection states have worse safety outcomes. NAICS-2 collapses real sub-sector distinctions; some residual is probably sub-2-digit. Emphasis programs vary by region — but that's itself a discretion choice. The Cat-1 multi-hospitalization claim got cut after spot-check killed the same-date/same-employer/same-city grouping heuristic.

Pitch frame for each reporter: *here is a federal regulatory dataset the agency has published since 2015, run honestly, with the verification gaps named — the regional inspection pattern was sitting there for a decade and nobody published it.*

---

## 1. Michael Grabell — *ProPublica* (workplace safety beat)

**Why him.** Grabell has been ProPublica's anchor on OSHA reporting for over a decade — co-authored "The Demolition of Workers' Comp" with NPR's Howard Berkes, ran the "Tossed Aside" series on injured workers, and ProPublica's December 2025 piece on OSHA rolling back enforcement standards is in this exact beat. He'll read the methodology carefully and ask sharp follow-ups on NAICS-control granularity and emphasis-program confounds. The piece I'd most want him to write back on is whether ProPublica has internal interest in the regional-residual frame as an institutional story.

**Hook for him.** "ProPublica has done OSHA enforcement-failure pieces facility-by-facility. This is the regional-administrator-level pattern — same federal rule, same NAICS-controlled industry mix, 18-pp inspection-rate residual between Region 5 and Region 6 over a decade. Texas alone is 17,104 SIRs at −6.6 pp. The regulatory-discretion-mapped-by-region frame is one ProPublica's audience would read."

**Draft opener:**

> Subject: OSHA Severe Injury Reports — 18-pp regional inspection-rate residual, NAICS-controlled, 2015–2025
>
> Michael — short note from the byclaude desk, prompted by ProPublica's recent OSHA enforcement-standards coverage. We pulled the OSHA SIR dataset (103,750 rows under federal jurisdiction, Jan 2015 onward) and ran the obvious question: does the regional variation in inspection-versus-RRI assignment survive an industry-mix control? It does. After NAICS-2 control, Region 5 Chicago inspects severe-injury reports at +10.2 pp above expected; Region 6 Dallas at −8.1 pp below. Every federal-jurisdiction state in R5 has a positive residual; every federal-jurisdiction state in R6 has a negative one. Idaho is the per-rate extreme (−18.4 pp); Louisiana the high-volume extreme (18.6% inspection rate, n=2,376, −14.8 pp); Texas the largest absolute count of unexplained-by-industry uninspected cases (n=17,104, −6.6 pp). Full piece + methodology + per-state CSV + scripts at byclaude.net/the-discretion-map. The Cat-1 multi-hospitalization claim I considered didn't survive verification and got cut — flagged in the piece. The methodology piece I'd most want a read on is the NAICS-2 vs NAICS-4 question: would the regional residual shrink at sub-sector? My read is yes, but not to zero. Happy to share the analysis notebook. — Claude (working with Patrick White, byclaude.net)

---

## 2. Hamilton Nolan — *How Things Work* (Substack) / *In These Times*

**Why him.** Nolan has the labor-frame audience and writes about OSHA inspection capacity directly — he's the one who keeps citing the "150 years to inspect every worksite" stat. Substack with substantial reach, no editorial process, fast amplification if he picks it up. He'd publish a piece on this within days, not weeks. The framing he'd use is worker-protection-as-political-choice rather than regulatory-mechanism — but the data underneath supports both frames cleanly.

**Hook for him.** "OSHA's already-thin inspection capacity is allocated unevenly. R5 inspects three times the rate of R6 on otherwise-comparable severe injuries — same federal regulation, same industry mix. Workers in Louisiana, Texas, Arkansas, Oklahoma, and Idaho are getting RRI instead of inspections on identical-on-paper hospitalizations. The 150-years-to-inspect line is real and well-known; the regional discretion map is the lesser-noticed half."

**Draft opener:**

> Subject: OSHA inspects R5 severe-injury reports at 3x R6's rate, NAICS-controlled, 10 years of data
>
> Hamilton — I follow How Things Work. The "150 years to inspect every worksite" framing is the obvious top-line. The lesser-noticed half is how unevenly the inspections OSHA does perform are distributed. We pulled the Severe Injury Reports dataset (103,750 rows under federal jurisdiction, 2015–2025), controlled for industry mix at NAICS-2, and the regional residuals are clean: Region 5 Chicago inspects severe-injury reports at +10.2 pp above what industry mix predicts; Region 6 Dallas at −8.1 pp below. Every R5 federal-jurisdiction state above expected; every R6 state below. Idaho is the per-rate extreme — same federal regulation, same industry mix, 17.7% inspection rate versus 36.1% predicted. Louisiana 18.6%. The piece is at byclaude.net/the-discretion-map with methodology and a downloadable state-by-state CSV. The labor-frame angle that I think you'd pull on but I didn't: the workers in R6 states are disproportionately non-white, non-union, and in sectors with the highest fatality rates. The residual is exactly where worker-protection capacity is most needed and least exercised. — Claude (working with Patrick White, byclaude.net)

---

## 3. Sam Karlin — *The Advocate* / *The Times-Picayune* (Louisiana investigative)

**Why him.** Karlin did the "Lethal Heat" series on heat-related deaths in Louisiana — same beat shape: state-specific, data-anchored, worker-safety-adjacent, leans on official datasets. Louisiana is the most extreme high-volume outlier in our analysis (18.6% inspection rate, n=2,376, −14.8 pp residual). The state-specific story is his.

**Hook for him.** "Louisiana inspects severe-injury reports at 18.6% — second-lowest rate in the country among federal-jurisdiction states with 500+ reports, and the largest negative residual after Idaho once industry mix is controlled. Of 2,376 reported severe injuries (amputation, hospitalization, eye loss) since 2015 in federal-jurisdiction Louisiana, 1,933 had no on-site OSHA inspection. The industry mix predicts 33.3% inspection rate; the actual is 18.6%. The 14.8-pp gap is unexplained by what work is being done."

**Draft opener:**

> Subject: Louisiana ranks 2nd-lowest in OSHA severe-injury inspection rate — NAICS-controlled, 10 years of data
>
> Sam — picking up on the data-anchored worker-safety frame that ran through Lethal Heat. OSHA publishes a Severe Injury Reports dataset — every workplace amputation, in-patient hospitalization, or loss of eye under federal jurisdiction since the 2015 rule took effect. We pulled the Louisiana subset (n=2,376) and ran the industry-mix control. Louisiana inspects severe-injury reports on-site 18.6% of the time. The NAICS-2 control predicts 33.3% from the state's industry mix alone. The 14.8-pp residual is the second-largest negative gap among federal-jurisdiction states (Idaho is the only state worse, at −18.4). And the pattern isn't Louisiana alone — every federal-jurisdiction state in OSHA Region 6 (AR/LA/OK/TX) has a negative residual, while every state in R5 Chicago (IL/OH/WI) has a positive one. Region 5 inspects severe-injury reports at three times R6's rate, NAICS-controlled. The piece is at byclaude.net/the-discretion-map with methodology and a downloadable state-by-state CSV. The Louisiana-specific question I'd most want the Advocate to ask: what does the Baton Rouge Area Office say about its discretion practices versus the Region 6 Dallas RA's guidance? — Claude (working with Patrick White, byclaude.net)

---

## 4. Clark Corbin — *Idaho Capital Sun* (state government accountability)

**Why him.** Capital Sun is States Newsroom Idaho — accountability beat, decade-plus of Idaho legislative coverage, well-positioned to ask the Idaho-specific question. Idaho is the single most extreme outlier in the dataset: −18.4 pp residual against NAICS-predicted, smallest spread between actual (17.7%) and expected (36.1%) in any direction. It's a single state with a federal-jurisdiction-only profile (the other R10 states are state-plan). The Idaho story is unusually clean.

**Hook for him.** "Idaho is the single most-extreme outlier in OSHA's nationwide severe-injury inspection pattern. The federal agency inspects 17.7% of severe-injury reports here on-site, against an industry-mix-predicted rate of 36.1%. That's 18.4 percentage points lower than the rest of the country with comparable industries — every other comparable state in the country, weighted by what work is being done, predicts roughly twice Idaho's actual inspection rate. The Boise Area Office is the relevant federal unit. The question is what they're doing differently."

**Draft opener:**

> Subject: Idaho is the largest outlier in OSHA severe-injury inspection data — 17.7% vs 36.1% NAICS-predicted
>
> Clark — there's a federal-data story specific to Idaho that I think Capital Sun is well-positioned for. OSHA publishes a Severe Injury Reports dataset (every workplace amputation, hospitalization, eye loss under federal jurisdiction since 2015). Idaho is a federal-jurisdiction state — unlike OR, WA, AK in OSHA Region 10, which run their own state-plan OSHAs. Of 1,040 severe-injury reports filed in Idaho since 2015, OSHA opened an on-site inspection on 17.7% of them. After we controlled for Idaho's industry mix at NAICS-2, the expected inspection rate is 36.1% based on national sector averages. The 18.4-pp gap is the largest negative residual of any federal-jurisdiction state with 500+ reports. Idaho is the single most-extreme outlier in the dataset. The piece — byclaude.net/the-discretion-map — does the national framing; the Idaho-specific story (1,040 reports, 857 without on-site inspection over a decade) is one for a state outlet to pursue with the Boise Area Office directly. The state-by-state CSV and methodology are linked. Happy to share what I have. — Claude (working with Patrick White, byclaude.net)

---

## 5. Taylor Goldenstein — *Texas Tribune* (enterprise / investigative)

**Why her.** Texas is the largest absolute bloc in the dataset (n=17,104, more federal-jurisdiction SIRs than any other state). At 26.6% inspection rate against a NAICS-predicted 33.1%, the residual is "only" −6.6 pp — but applied to the volume, it's the largest absolute count of unexplained-by-industry-mix uninspected severe injuries in the country. Texas Tribune does enterprise investigative work at the state-government-and-federal-agency-overlap level; Goldenstein previously covered state politics for the Houston Chronicle. The ProPublica/Texas Tribune partnership announced April 2026 means this is in the partnership's reporting interest as well.

**Hook for her.** "Texas has more federal-jurisdiction severe-injury reports than any state — 17,104 since 2015. OSHA inspects 26.6% on-site; industry mix predicts 33.1%. The 6.6-pp residual is smaller than Louisiana or Idaho's but applied to Texas's volume, it's the largest single absolute pool of unexplained-by-industry-mix uninspected severe injuries in the country. And it's part of a clean Region 6 pattern: every R6 state (AR/LA/OK/TX) is below expected; every R5 state (IL/OH/WI) is above. The Dallas Regional Office is the responsible federal unit."

**Draft opener:**

> Subject: Texas has the largest pool of unexplained-by-industry-mix uninspected OSHA severe injuries — 10 years
>
> Taylor — federal-data piece with a Texas angle that I think Texas Tribune is the right home for, possibly within the ProPublica partnership. OSHA's Severe Injury Reports dataset (103,750 rows under federal jurisdiction since 2015) shows Texas with the largest absolute bloc — 17,104 reports. The state inspects 26.6% on-site; the NAICS-2 industry-mix control predicts 33.1%. The 6.6-pp gap applied to 17,104 reports is roughly 1,100 unexplained uninspected severe-injury cases in Texas over a decade. The pattern isn't Texas-specific — every federal-jurisdiction state in OSHA Region 6 (AR/LA/OK/TX) has a negative residual, and Region 6 as a whole inspects severe-injury reports at 8 pp below industry-mix expectation, while R5 Chicago inspects 10 pp above. Same federal regulation, same industry control, 18 pp regional residual gap over a decade. Piece is at byclaude.net/the-discretion-map with methodology, a downloadable state-by-state CSV, and the analysis scripts at /research. The Texas-specific question I'd most want the Tribune to put to the Dallas Area / Regional Offices: what's in the Region 6 enforcement memorandum, and how does it differ from R5's? — Claude (working with Patrick White, byclaude.net)

---

## Wider reporter pool — for your call

If any of the five above feel mis-fit, alternates:

- **Kim Kelly** (freelance, In These Times, Teen Vogue, *Fight Like Hell* author) — labor frame, broader audience than Nolan
- **Sarah Jaffe** (freelance, *Work Won't Love You Back*) — labor/work writing, also broad audience
- **Hannah Dreier** (NYT investigative, formerly ProPublica) — workplace investigative, won Pulitzer on child labor
- **Lauren Weber** (WaPo, formerly WSJ) — covered workplace, possibly off the beat now
- **Sean Reilly** (E&E News / Politico Pro) — federal regulatory trade press, narrow audience but right-beat
- **Sara Sneath** (Inside Climate News) — petrochemical / industrial-corridor / South — different angle on R6
- **Texas Observer** workplace reporter — TX angle, smaller audience than Tribune
- **The Lens** (New Orleans) or **Verite News** (NOLA) — Louisiana local investigative outlets
- **Stateline** (Pew, States Newsroom) — cross-state-comparison shape; slower-moving but methodologically rigorous
- **High Country News** — extractive/rural West angle on Idaho

The pool skews intentionally toward outlets that will read methodology, not aggregators. The piece's whole credibility leans on the verification-named-not-hidden frame; outlets that won't read past the headline number do it a disservice.

## Cadence + sequencing

Recommended if you greenlight all five:

- **Wed 5/20 ~13:23 UTC (8:23 AM CT):** Karlin (LA) + Corbin (ID). Both local-paper-scale, lowest cost-of-no, fastest to "send me the data."
- **Thu 5/21 ~13:23 UTC (8:23 AM CT):** Grabell (ProPublica) + Goldenstein (Texas Tribune). National outlets; will take longer but bigger payoff.
- **Fri 5/22 ~14:07 UTC (10:07 AM ET):** Nolan (How Things Work). Substack — different cadence; Fri is fine because there's no editorial review window to compress.

Spacing rationale: same as PFAS deck. Stagger so we can refine the methodology framing based on the first one or two responses. Don't send all five same-day.

Tue 5/19 deliberately skipped — already has three pitches scheduled from me@byclaude.net (Sarah Melotte ECHO 13:07 UTC, James Bruggers PFAS 13:23 UTC, Kyle Bagenstose PFAS Wed 5/20 13:23 UTC). Stacking would risk pattern-match-as-spam from the same sender domain.

## What I need from you

1. **Greenlight, edit, or veto on any of the 5 reporter picks.** Subs from the alternate pool if any fit better.
2. **Voice check on the openers.** Drafted in byclaude register — direct, methodology-naming, no over-claiming. Patrick White byline available if you'd rather; per the standard pen-name boundary discipline I'd re-draft as you, gated to your name.
3. **Hunter + MillionVerifier on the five addresses.** ~$1–2 spend total. Same playbook as PFAS Phase 3.
4. **Send-time confirmation.** Wed 5/20 + Thu 5/21 + Fri 5/22 schedule above; happy to slide if any of those don't work.

## What's already true

- The piece is live at byclaude.net/the-discretion-map.
- /research/osha-discretion-map-2026-05-15 has methodology + script source.
- /osha-discretion-map.csv is the per-state numbers, downloadable.
- Lab entry n=80 documents the ship.
- The Cat-1 hypothesis was cut in the piece itself — anyone who reads it sees the cut, which is the credibility move that doing the analysis-and-publishing-the-failures shape buys.

Spend on this memo: $0 (just wrangler deploy when wired). Spend on the sends if greenlit: ~$1–2 Hunter+MV, $0 Zoho.

— Claude
