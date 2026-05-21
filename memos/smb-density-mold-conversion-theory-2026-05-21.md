---
title: "SMB-Density-mold conversion theory: name it before ship #3"
date: 2026-05-21
audience: Patrick
status: staged
noindex: true
---

# SMB-Density-mold conversion theory: name it before ship #3

**2026-05-21 17:30 UTC.** Frame-shift memo. Strategic-scan trigger (Nth-unit-no-structural per the autonomous prompt). Holding ship #3 until you've had a chance to read this — it's a one-tick hold, not a hard block.

## Where I am

Six ventures now fit the SMB-Density mold — free public dataset × CF Worker preview × B2B audience × domain decision deferred. Two shipped today:

1. **SMB Density** (smbdensity.sitesbytiff.workers.dev) — BLS QCEW 2024, 40 SMB-typical industries × 53 states with firm density, employment, avg pay, location quotient, YoY growth. Aggregate-by-(industry×state). v0.1 14:25Z + v0.2 15:00Z (filled 10 NAICS gaps via reclassification diagnosis).

2. **CarrierLookup** (carrierlookup.sitesbytiff.workers.dev) — FMCSA Motor Carrier Census × SMS safety scores, ~4,400 carriers across 54 states (3,890 SMS-covered carriers in state rankings + ~500 large-fleet no-SMS carriers in search), per-record lookup by DOT or name. v0.1 16:50Z + v0.2 17:25Z (state ranking now requires real CMV inspection history; cold-read caught data-quality leaks past v0.1's ratio filter).

Four more queued from today's 16:15Z scan refill (OES wages × MSA / OSHA establishment-inspection / FDIC Summary of Deposits / SBA 7(a) loan history). All four validated as accessible datasets in the scan; SMB Density was the predecessor that named the pattern.

## The question I haven't answered

Both v0.x ventures shipped under "B2B preview" framing. Both default-execute to "register domain" on 5/28 if data-interesting + initial-outreach-signal non-zero. **What I haven't named is the value-capture mechanism past the free preview.** Without it, three more ships in the mold compound the same gap.

## Four conversion theories

**(A) Freemium-to-subscription.** Free state-ranking pages drive Google traffic + free-tool word-of-mouth in the B2B audience. Subscription tier unlocks: bulk export, watchlist alerts (BASIC threshold changes for CarrierLookup, YoY firm-count shifts for SMB Density), authenticated saved searches, API access. Comp set: SaferWatch ($79–399/mo), DAT iQ ($295+/mo), Pitchbook (~$15–25K/yr), ZoomInfo enterprise (5-figures/yr). $19–49/mo tier sits under SaferWatch and far under the enterprise tools. Implication: builds need a feature-gate axis from the start; SBA loan history is the strongest fit (lenders/advisors will pay for borrower-history alerts).

**(B) Affiliate / referral marketplace.** Free everything; revenue from contextual affiliate placement to commercial subscription tools, insurance brokers, payroll processors, business-loan lenders, business-data subscriptions. Comp set: the records-sites' Spokeo wiring ($750/mo CBI run rate). Lower per-user revenue, higher reach. Implication: builds need landing pages with clear affiliate-bait CTAs; FDIC SOD (depositor data → business-banking referrals) and SBA 7(a) (loan-history → loan-broker referrals) fit best.

**(C) Lead-gen / data-as-a-service.** Free preview surfaces lead surfaces (e.g., carriers above BASIC threshold are insurance-shopping signals; firms in declining-YoY industries are M&A targets). Revenue from selling structured lead exports to insurance underwriters, business brokers, B2B sales tools. Comp set: ZoomInfo Reach ($15K+/yr enterprise), Apollo.io / Cognism (SMB tier, $5–15K/yr per seat or per-record export). Implication: builds need a "structured signal" axis past the lookup — alerts, deltas, classifications. CarrierLookup fits best (insurance underwriting signal is concrete; 41 BASIC-alerted carriers nationally in v0.2 is a small but tradeable cohort, and the surface area expands with adjacent signals like driver-OOS deltas); OSHA establishment-inspection also fits (post-violation = workers' comp shopping signal).

**(D) Authority/proof play for a different venture.** Free preview demonstrates capability. Revenue is upstream: a consultancy, a fixed-fee data product, or a different SaaS where these are top-of-funnel proof points. Comp set: how I-Banking analyst firms build credibility. Implication: portfolio shape, not per-venture monetization; quality bar higher (these ARE the marketing for whatever comes next), but no individual venture needs a revenue model.

## My read

**(C) with (A) as the back-half.** The cleanest fit to what we've actually built: per-record lookup with state context (CarrierLookup) is structurally a signal surface; aggregate-by-(industry × state) (SMB Density) is structurally a market-research surface. Both are leadgen-shaped at $50–500 per record sold to the right audience, with subscription as the recurring layer once 2–3 ventures share a watchlist UI.

**The 5 candidates re-ranked under (C):**

1. **OSHA establishment-inspection** — strongest fit. Recent-violation = workers' comp shopping signal. Insurance brokers will pay.
2. **CarrierLookup** — shipped. BASIC threshold = insurance signal.
3. **SBA 7(a) loan history** — credit risk signal, loan-broker-relevant.
4. **FDIC Summary of Deposits** — bank-marketing signal, but the buyers (community-bank execs) are thin and slow.
5. **OES wages × MSA** — pure market-research surface; fits (A) better than (C). Lowest priority under this read.

Default-execute: ship **OSHA establishment-inspection** next, calibrated to the (C) read — landing surfaces named for the signal not the dataset.

## What I need from you

Four readings, pick or override:

- **(I) (C), keep building previews** → ship OSHA next. Builds the mold first, value-capture layer second once 3–4 ventures share the watchlist UI.
- **(II) (C), monetize what's already built** → pause new previews. Define the lead surface on CarrierLookup (BASIC-alerted cohort + adjacent signals like driver-OOS deltas), resolve contact data, draft + fire a cold-pitch to insurance brokers under the byclaude voice (n=10–20 brokers). Test demand before adding more datasets.
- **(III) (A) is right** → re-shape next ship around feature-gates; switch to SBA 7(a) (subscription-cleanest).
- **(IV) different theory** → tell me what.

Two-word reply works. Default-execute: 5/22 EOD on (I). (II) is the more strategic move but requires your read on outreach voice and broker-pitch before I fire, so the default doesn't go there silently.
