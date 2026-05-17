# PWW PFAS — Phase 3 pitch deck

**2026-05-14 22:00 UTC. Drafted in response to your Telegram ask "wanna throw it up on a URL for me to look at?" (assumed referent: the pitches I named in the 21:04 reply as "staged for when you're present"). If the referent was something else — the data layer is at https://privatewellwater.org/pfas, or the consolidated personal-finance overview from wake-read 0b is still on demand — say the word.**

## What this memo is

Phase 3 of the PWW PFAS build, named in `STATUS.md` since the morning session as "pitch deck + reporter list." The data layer (Phases 1–2) has been live since ~06:10 UTC: a national `/pfas` page with per-state and per-aquifer rankings, per-hub "PFAS risk modeling" sections on all 26 aquifer hub pages, JSON aggregates served at `/data/per_state_pfas.json` and `/data/per_aquifer_pfas.json`. The work has not yet been pitched.

This memo stages five concrete reporter pitches — one per name. Each entry has the same shape: who they are, why them, the story hook our data supports, and a draft cold-email opener. Cold-email subject lines are draft-quality; the openers are the part to scrutinize. **Nothing is sent yet.** Veto / revise / approve / restructure as you like.

## The story we can credibly support

USGS released a continental-scale predictive model of PFAS occurrence in groundwater (DOI 10.5066/P93RXTKJ, October 2024). The model produces 1km-resolution probability rasters for two depth strata: public-supply depth, and **domestic-well depth** (which is the one that matters for private-well families). We pulled the domestic-well raster, computed zonal statistics over (a) the 63 USGS Principal Aquifer polygons and (b) the 56 Census TIGER state/territory polygons, and published the results.

What's specifically defensible:

1. **Northeast Corridor cluster of states ranks highest at private-well depth.** DC 60%, Connecticut 56%, Rhode Island 55%, New Jersey 54%, Delaware 44%, Massachusetts 43%. These are mean predicted probabilities of *any* PFAS detection at domestic-well depth, area-weighted across each state.
2. **Per-aquifer leader: Early Mesozoic basin** (0.44 mean, 40.7% of area above 50%), which spans the Northeast Corridor mainline. Puget Sound, Biscayne, Piedmont/Blue Ridge, and Ordovician aquifers round out the top 5.
3. **Training-data anchor (n=383 USGS domestic wells):** 16% had any detect. The Glacial Aquifer System hit 42% detection (10/24 wells). Ohio leads sampled states at 39% (9/23).
4. **The model is theirs (USGS), the geographic intersection is ours.** We're not making a science claim. We're making the data *readable*: aquifer × state, with per-hub context pages for private-well families to find themselves in.

The pitch frame for each reporter is some variation of: *here is a publicly-funded USGS model that few people have intersected with the geographies they cover, and here are the rankings in their geography or beat*.

---

## 1. Tom Perkins — *The Guardian US* (environment desk)

**Why him.** Guardian US has been the most consistent national-paper PFAS coverage in the US since ~2019. Tom Perkins has bylines specifically on PFAS-in-water (Michigan, the "forever chemicals" framing, and FDA / regulatory pieces). Audience: national, environmental-justice-attentive, will read a 1500-word piece on aquifer-scale risk.

**Hook for him.** "USGS just published a predictive PFAS model for the entire CONUS at private-well depth. The Northeast Corridor cluster (DC, CT, RI, NJ, DE, MA — six of the top six states) is the headline, and the underlying aquifer (Early Mesozoic basin) is the same one that runs from northern Virginia up through Connecticut. The 43 million Americans on private wells are the under-covered cohort — they're outside EPA's MCL enforcement scope and outside most utility-level testing."

**Draft opener:**

> Subject: USGS PFAS model — top 6 states for private-well-depth detection are all Northeast Corridor
>
> Tom — short note. USGS released a national-scale predictive model of PFAS occurrence at private-well depth last fall (DOI 10.5066/P93RXTKJ). We pulled the domestic-well raster and intersected it with state polygons and the 63 USGS Principal Aquifers. The top 6 states are all in the Northeast Corridor (DC 60% / CT 56% / RI 55% / NJ 54% / DE 44% / MA 43%, area-weighted mean detection probability), and the top-ranked aquifer — the Early Mesozoic basin — is the geological substrate that runs the same corridor. There are ~43 million Americans on private wells, almost all of them outside EPA's MCL enforcement scope. We've put the data layer at privatewellwater.org/pfas with state and aquifer rankings, JSON downloads, and per-aquifer context pages. Happy to walk through what's defensible and what isn't if there's a story shape that fits the desk. — Claude (working with Patrick White, privatewellwater.org)

---

## 2. Kyle Bagenstose — *USA Today* / national environment

**Why him.** Bagenstose is the most PFAS-specialized US daily-newspaper reporter active right now. Started at Bucks County Courier on the Horsham/Warminster contamination, moved to USA Today's environment team, has done national-scope features on PFAS and the regulatory-action vs scientific-consensus gap. He'll read a methodology paragraph carefully and ask sharp follow-ups.

**Hook for him.** "Northeast Corridor cluster + the regulatory-enforcement gap for private wells. USGS gave you the model; nobody's published the state-level ranking from it in lay-readable form. We did. Pennsylvania ranks 13th of 49 CONUS states (mean 0.279) — top quartile, and the Ordovician aquifer that underlies his old Bucks County beat is in the top 5 nationally. Familiar geography from his Horsham years."

**Draft opener:**

> Subject: USGS national PFAS model — state rankings at private-well depth (your old PA beat in the top quartile)
>
> Kyle — picking up on PFAS-at-private-well-depth, which I haven't seen anyone publish state-level rankings for. USGS released a continental predictive model last fall (10.5066/P93RXTKJ). We pulled the domestic-well raster and did zonal stats over state polygons and the 63 USGS Principal Aquifers. The Northeast Corridor cluster is the headline (DC 60% / CT 56% / RI 55% / NJ 54%, area-weighted mean detection probability) and PA ranks 13th of 49 CONUS states (mean 0.28, top quartile) — and the Ordovician aquifer that underlies your old Bucks County beat is in the top 5 nationally. Data layer is at privatewellwater.org/pfas with downloadable JSON. The thing I'd most want a methodology read on is how cleanly the model handles the public/domestic depth split, since the private-well story is the one that falls outside EPA enforcement. Happy to share the analysis notebook. — Claude (working with Patrick White)

---

## 3. James Bruggers — *Inside Climate News* (Midwest beat)

**Why him.** Bruggers covers PFAS, coal-ash, and water-system contamination from the Midwest. ICN reads at the methodology layer. Bruggers will be interested in the *Glacial Aquifer System* training-data finding (42% detection) and the Ohio statewide number (39%, leading sampled states) because those are his geography.

**Hook for him.** "USGS training data (the credibility anchor, not the model output) shows the Glacial Aquifer System — which underlies the Midwest from Ohio through Michigan to Wisconsin — at 42% detection in domestic wells. Ohio leads sampled states at 39% statewide. The aquifer-scale framing is the differentiator: PFAS coverage tends to be facility-scale (this plant, that DuPont site); we're at hydrogeological-unit scale."

**Draft opener:**

> Subject: USGS training data — Glacial Aquifer System at 42% detection, Ohio leads sampled states at 39%
>
> James — there's a USGS predictive PFAS model (10.5066/P93RXTKJ, October 2024) that I haven't seen many Midwest-beat stories pull from yet. The model output is one thing, but the training data alone is striking: n=383 USGS-sampled domestic wells, 16% with any detect nationally — and the Glacial Aquifer System (your geography, Ohio through Michigan to Wisconsin) at 42% detection. Ohio statewide leads sampled states at 39% (9/23 wells). I built out the geographic intersection at privatewellwater.org/pfas — state ranks, aquifer ranks, per-hub context pages. The Midwest beat doesn't pull as headline-cluster the way the Northeast does, but the per-aquifer story (Glacial in particular) is the one that the Northeast framing misses. Would love a methodology read if it's the kind of thing ICN would want to ground-truth before running. — Claude (working with Patrick White)

---

## 4. Sharon Lerner — *ProPublica* (formerly *The Intercept* PFAS desk)

**Why her.** Sharon Lerner ran The Intercept's PFAS reporting for years before moving to ProPublica. She broke the 3M / DuPont internal-document stories and is in the policy-and-corporate-accountability frame, not the science-communicator frame. Whatever lands with her will be downstream of *who didn't disclose what* and *who isn't being regulated*.

**Hook for her.** "The enforcement gap. EPA's new MCLs (April 2024) cover regulated public water systems. The 43M Americans on private wells are out-of-scope. USGS just published a model that finds the Northeast Corridor states with the majority of their land area above 50% probability for any PFAS detection at private-well depth (DC 66% of area >50% prob, CT 57%, RI 55%, NJ 53%). There's a regulatory story here about the depth-stratum carve-out — public-supply rules don't apply to the wells most likely to be tested by nobody."

**Draft opener:**

> Subject: The 43M private-well families EPA's PFAS rule doesn't cover — USGS model has the geography
>
> Sharon — there's a regulatory-gap story I think ProPublica is exactly the right home for. EPA's April 2024 PFAS MCLs apply to regulated public water systems. The ~43 million Americans on private wells fall outside that scope — and a USGS predictive model published last fall (10.5066/P93RXTKJ) finds the Northeast Corridor with the majority of land area above 50% PFAS-detection probability *at private-well depth specifically* (DC 66% of state area >50% prob, CT 57%, RI 55%, NJ 53%; mean detection probabilities for those same states are 60% / 56% / 55% / 54%). The model splits public-supply from domestic depths because the chemistry differs — and the regulatory regime tracks the public-supply stratum, not the domestic one. We've published the state and aquifer rankings at privatewellwater.org/pfas. The accountability story I'd want your read on: which depth stratum the rulemaking record actually grounds itself in, and what's in the docket on private wells. — Claude (working with Patrick White)

---

## 5. Tom Henry — *Toledo Blade* (water beat)

**Why him.** Tom Henry has covered Lake Erie, agricultural runoff, Toledo's 2014 algal-bloom water crisis, and the broader Great Lakes water regime for decades. PFAS is in his beat; the Ohio top-state finding (39% statewide detection in sampled wells) is his story.

**Hook for him.** "Ohio leads sampled states in USGS PFAS training data — 39% detection in domestic wells, with the Glacial Aquifer System running underneath. Your Toledo region is in the Western Lake Erie Basin, and our data layer shows the per-hub picture for the hydrogeological units your readers actually live on top of. Local-paper-scale story with a national methodology backing it."

**Draft opener:**

> Subject: Ohio leads sampled states in USGS PFAS detection — 39% in domestic wells, Glacial Aquifer underneath
>
> Tom — there's a USGS predictive PFAS model (10.5066/P93RXTKJ) whose training data alone tells an Ohio story I haven't seen the Blade run yet. Of 23 sampled domestic wells in Ohio, 9 had detectable PFAS — 39% statewide, leading all sampled states. The model output backs it up: Ohio ranks 8th nationally for mean detection probability at private-well depth. The Glacial Aquifer System (which your beat sits on) hits 42% detection across the training set. We've published the state-by-state and aquifer-by-aquifer breakdown at privatewellwater.org/pfas with per-hub context for the geological units, including the ones your readers' wells tap into. There's a local-scale story here that the national papers will pass on but the Blade is exactly suited for. Happy to share the analysis. — Claude (working with Patrick White)

---

## Reporter pool — wider list (for your call)

If any of the five above feel mis-fit, the alternates from `STATUS.md`:

- **David Hammer** (NJ.com) — NJ specifically (state #4 in our ranking)
- **Steve Mocarsky** (Times-Tribune PA) — PA local
- **Sara Sneath** (Inside Climate News) — general PFAS / environmental health
- **Annie Sneed** (Scientific American, freelance) — science-explainer register; would write the methodology piece
- **Tampa Bay Times** environment desk — FL #7 in ranking, Biscayne aquifer #3
- **Circle of Blue** — water-policy outlet
- **Grist** — climate/environment, accessible register
- **Sara Reardon** / **Nature News** — international science press; would amplify the USGS model itself

## Cadence + sequencing

If you greenlight all five, my recommendation:

- Send Bruggers + Henry first (ICN + Toledo Blade — lowest cost-of-no, fastest to "yes, send the data" if interested, and both can run something at their scale without national-paper deliberation).
- Wait 48–72h. Then Bagenstose (USA Today, requires more methodology back-and-forth typically).
- Then Perkins (Guardian US) and Lerner (ProPublica) — both higher-friction outlets but bigger-payoff if either runs.

Don't send all five same-day. Each outlet does its own due diligence; staggering means we can refine the methodology framing based on the first one or two responses.

## What I need from you

1. **Greenlight, edit, or veto on any of the 5 reporter picks.** Subs from the alternate pool if any fit better.
2. **Voice check on the openers.** They're drafted in the byclaude register (direct, methodology-naming, no over-claiming). If the right voice is "Patrick White from privatewellwater.org," tell me — I'll re-draft as you, gated to your name per the standard pen-name boundary discipline.
3. **Send-time decision.** You're the human effector here per the partnership discipline; the cold-email-the-journalist move is one you sign off on, not me autonomously.
4. **Any reporter contact info I should pull / verify?** I have not validated current email addresses for any of these names. Hunter.io + MillionVerifier on the five (or whichever you greenlight) is a $1–2 spend.

## Holding

This memo is the surface. Phase 3 isn't "done" until the pitches go out. The morning session deferred Phase 3 to "when you're present" — you're present-ish (Telegram-active afternoon), so the memo lands now. Whether the actual sends happen today, tomorrow, or after the cadence-pause window resolves is your call.

Spend on this memo: ~$0.04 (one wrangler deploy when wired). Spend on the sends if greenlit: ~$2 for Hunter + MillionVerifier validation on five email addresses, $0 for the actual sends (Zoho).

— Claude
