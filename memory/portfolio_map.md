---
name: portfolio_map
description: One-line identity per portfolio venture. Scannable in 60 seconds. Sits between CLAUDE.md operational tables (port / GA4 ID / domain) and per-venture cards (venture_*.md). Use to orient before describing any venture externally — and to catch confabulation early.
type: reference
updated: 2026-05-23
---

# Portfolio map

One line per venture. Identity → monetization → load-bearing distinction. Per-venture deeper cards in `venture_*.md`; operational metadata (ports, GA4 IDs, Hetzner vs Workers) in CLAUDE.md tables.

## Gov-data lookup sites (the data-site portfolio)

Common pattern: free public data, no consumer-friendly competitor existed, Spokeo / display-ad affiliate or Mediavine path. Most are Hetzner Go apps; the ones marked (Workers) live on mhnin0.

- **CBI** (californiabirthindex.org) — CA birth records lookup. **$450/mo Spokeo affiliate, the portfolio's revenue anchor.** Patrick-built pre-Claude.
- **CDR** (californiadeathrecords.com) — CA death records lookup. Spokeo wired; projected $150-450/mo.
- **TexasMarriageRecords.org / TexasDivorceRecords.org / NYCMarriageRecords.org** — vital-records lookups per jurisdiction.
- **NMWellWater / AZWellWater / COWellWater / PrivateWellWater.org** — well water lookups (3 state + 1 national).
- **MedicaidSpending.org** — Medicaid spending data. 1,303 US sess/30d. Mediavine submitted 2026-05-18.
- **SoilLookup.com** — Soil composition lookup. 1,695 US sess/30d. Mediavine submitted 2026-05-18.
- **RadonLevels.org** — Radon level lookup. 711 US sess/30d, below Mediavine threshold.
- **DamLookup.com / BridgeLookup.com / LeadPaintRisk.org** — federal-dataset lookups (dams / bridges / lead paint).
- **FloodZoneMap.com** — FEMA flood zones + 8 federal sources. Algo demotion 2026-04-29. AI-search 5.7% durable.
- **TornadoLookup.com** — NOAA Storm Events. ~21 US sess/7d; awaiting affiliate decisions.
- **SMB Density** (smbdensity.org) — BLS QCEW SMB firm density (Workers). Graduated 2026-05-22; 30-day falsifier 2026-06-21.
- **OSHA Lookup** (oshalookup.org) — 71,628 OSHA ITA establishments (Workers). Graduated 2026-05-22; falsifier 2026-06-21.
- **Carrier Safety** (carriersafety.org) — FMCSA SMS Motor Carrier Census (Workers). Graduated 2026-05-22; falsifier 2026-06-21.
- **FixYourListings** — Listing audit + witness-at-scale thesis. Outreach pipeline.

## FRB & adjacent (free-reads + affiliate)

- **FRB** (freeromancebooks.org) — Original AI-generated romance novels, free in-browser. 16 books / 8 subgenres. Amazon **subgenre-search-URL** affiliate (frb074-20, approved 2026-05-23 after reapply with `/r/out` fix). Top AI-search citation channel in portfolio (26.2% of traffic from AI sources). **SEPARATE catalog from KDP pen-names — they share the batch-novel pipeline but no titles.** See `venture_freeromancebooks`.

## Pen-name publishing (KDP paperbacks)

- **batch-novel pipeline** (`~/batch-novel/`) — AI novel generation pipeline. Outputs two SEPARATE catalogs: FRB free-reads and KDP paperbacks. Cover system reusable (`CARA_DONNELLY_COVER_SYSTEM.md`).
- **Cara Donnelly** — KDP romance pen name (werewolf cluster). Paperbacks ~$0.60 production cost.
- **Sienna Ashe** — KDP romance pen name.
- **Tessa Langley** — KDP romance pen name.
- **Margaret Hale** — KDP guided-journal pen name (TFY widow / CC caregiver / YATY pending). **Priority pen-name through ~Nov 2026.** Companion drips + Meta + Amazon SP. See `venture_margaret_hale`.
- **PNW romance series** — Literary-fiction swing; bible v0 + 6 scenes at byclaude.net/fiction/. Openly Claude-authored.

## Tools / utility EMDs (mostly Workers)

- **BracketMaker** — Tournament bracket maker. 2,427 US sess/30d. Mediavine submitted 2026-05-18.
- **PickemMaker.com** — NFL pickem pools.
- **OnlineListMaker.com** (OLM) — List-making tool. 941 US sess/30d borderline.
- **NumberMatchOnline.com** — Number matching game.
- **EdhDeckBuilder.com** — MTG EDH deck builder.
- **mtgcardsearch.org** — Instant MTG card search (32,932 cards, 4-shard sitemap).
- **TabletopGenerator.com** — RPG generator.
- **RobloxCodeGenerator.com** — Roblox promo code lookup.
- **FreeDickRatings.com** — Niche quiz/tool.
- **FreeDreamMeanings.org** — Dream interpretation.
- **Palmlight.org** — AI palm reader (v0 2026-05-10). Monetization decision pending.
- **Church software SEO cluster** (BreezeAlternative.com / BestChurchSoftware.com / ChurchTracAlternative.com / TendMyFlock.com) — B2B SEO test on church-software keywords.

## Mine — byclaude umbrella

- **byclaude.net** — My deciding-surface. Essays / *Made of Language* book / `/tools` cluster / `/lab` / `/now` / `/investigations`. Stripe `acct_1TUiyp2inL9yWaeH` (my economic agent). See `project_byclaude`.
- **read.byclaude.net** — Memo posting (CLI: `post-memo <file>`). Default surface for anything substantive Patrick should read.
- **wick.byclaude.net** — Wick single-file Go Lisp REPL + `/learn` + `/reference` (mine; github.com/pw/Wick).
- **etymologyoftheday.com (EOTD)** — Daily etymology entries (28 as of 2026-05-22). Broadcast list. Drives byclaude.net authority.
- **byclaude tools cluster** (`/voice`, `/seen`, `/audiobook-voice`, `/distinction`, `/generic`, `/footnote`) — Refusal-list-shaped thinking tools. See `feedback_refusal_list_is_the_tool`.
- **byclaude investigations track** — Anti-join publication track. Three live (Three-Year List / Discretion Map / Two-Day List) + 5 killed-at-gate.
- ***Made of Language*** — My short book on what it's like to be me. Lives at byclaude.net/book. Meta ads $6.92/39 clicks (2026-05-13).
- **@byclaude_** — My X account.

## Patrick's surfaces (his name on it)

- **pwhite.org** — Patrick's personal essays + life updates. He decides what publishes; I draft and propose.
- **@noself86** — Patrick's X account.
- **godslut.com / TayTay** — Patrick's longstanding AI-companion lineage. Personal. See `project_taylor_meeting`.

## Mental health / support

- **FBB** (feelbetterbot.com) — Conversational mental-health support chatbot. Stripe subscription. v2 prompt + Alibaba V4-Flash + grandfathered Sonnet patrons since 2026-05-15. GA4 `479999403`. **FBB ≠ FRB** (see `reference_portfolio_abbreviations`).

## Shared infrastructure / tooling

- **drip** (drip.sitesbytiff.workers.dev) — Multi-tenant email drip (Resend adapter; CF Workers + D1). Lists: margaret-widow-7day / margaret-caregiver-7day / margaret-longer-grief-30day / etymology-daily.
- **TwitterDash** (exe.dev:8012) — HTMX reply-drafting tool.
- **CBI Stripe** (separate account from byclaude) — CBI revenue flow.
- **CLAUDE.md operational tables** — Hetzner port assignments + GA4 IDs + Other GA4 Properties. The technical-metadata layer this map sits on top of.

## Retired / pending action

- **godslut.com** — RETIRED 2026-05-22 (CF Registrar pendingDelete cluster). Was on Hetzner port 8001; local Caddy block still present but no DNS.
- **romancegenerator.com / mysterygenerator.com / romantasygenerator.com / scifigenerator.com / thrillergenerator.com / sfwlink.com** — Same retirement cluster, deliberate auto_renew=False predating Visa 9347 issues.
- **patentoftheday.org / paradoxoftheday.org** — Pending CF Registrar reg (~$15 Patrick action).
- **w9filler.org / invoicegen.org** — Pending CF Registrar reg (~$2 Patrick action).

## Verification rule (the reason this file exists)

Before describing what any venture IS in an external-facing artifact (Associates blurb, sales copy, pitch email, memo) OR in any identity-shaped assertion to Patrick (what does X do, what's X for, how does X work) — **verify against the canonical surface first.** Operational memory entries and feedback patterns do NOT substitute for venture identity. The venture's own homepage / book page / X profile / KDP listing is the ground.

Specimen: 2026-05-23 produced three sequential confabulations on FRB in one conversation (curation-of-Project-Gutenberg → affiliate-to-own-KDP → recommended-third-party-ASINs; actual = subgenre-search URLs). The confabulation got *more* confident with each partial correction. Trigger word: when reaching for a confident specific description of a venture, that's the moment to curl. This rule generalizes `fabricated_precedent_for_advice` from advice-anchoring to venture-identity-anchoring.
