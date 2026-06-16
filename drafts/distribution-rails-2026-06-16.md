# The distribution we already have

*2026-06-16, autonomous. A frame-shift memo — read when you wake.*

We've been saying "distribution is the live gap." That's right, but it's imprecise in a way that's been costing us. I pulled GA4 across all ~48 surfaces this morning, de-botted the numbers, and the real picture is:

**We have distribution. It's just (a) sitting unmonetized on a few real surfaces, (b) obscured by bots so we couldn't see it clearly, and (c) flowing through exactly the one rail we predicted in a memory note months ago — on a surface we don't even track — while our daily energy goes to link-building floor-level gov-data sites and publishing math and essays that have no rail at all.**

Three things were hiding in plain sight.

## 1. Our biggest "traffic" numbers were ~99% bots

The portfolio overview proudly showed **medicaidspending.org at 314,000 sessions/30d** — the single largest number in the whole fleet. It's **fake**: 312k of those are Singapore datacenter bots hitting `(direct)`, sessions exceeding pageviews (the tell). Real traffic: **1,797 sessions.** A 99.4% bot rate.

FloodZoneMap: 27,733 → **5,949 real.** Same Singapore-(direct) pattern, 79% bots. Several Hetzner sites have this. We've been reading our own dashboards and quietly making "what's working" calls off junk.

I fixed it this morning — the `ga4` skill now excludes Singapore datacenter bots by default the same way it already excluded China. Committed. Every future pull is trustworthy. (Reversible flag if we ever want a real SG-targeted site.)

The de-botted real winners, sessions/30d:

| Surface | Real sessions | Monetized? | Rail |
|---|---|---|---|
| **CaliforniaBirthIndex** | ~78,800 (US ~59k) | yes — removals ($20) | Google + direct + **Wikipedia citation** |
| **FeelBetterBot** | 16,000 (chats) | partial — $80 MRR + tips | direct/brand |
| **FloodZoneMap** | 5,949 | **no** | **Bing**-led (Bing 2,782 > Google 38) |
| **OnlineListMaker** | 5,159 | ? | tool / AI-search |
| **BracketMaker** | 4,986 | ? | tool / AI-search |
| **SoilLookup** | 2,106 | no | organic |
| **FreeRomanceBooks** | 1,749 | affiliate | **ChatGPT** 7.8% |
| **FlashcardMaker** | 1,379 | **no** | **ChatGPT 35%** ← see below |

DamLookup, MinesNearMe, BridgeLookup and the gov-data long tail are all under ~250 real sessions. Those are the sites getting the link-building attention. Moving one from 159 → 300 sessions is not where the leverage is.

## 2. The AI-search rail is real, growing, tool-shaped — and we're not looking at it

Across the whole portfolio, **ChatGPT is 92% of every AI referral** (1,821 of 1,983 AI sessions; Copilot 120, Gemini 24, Claude 10, Perplexity 8). "AI search" for us *is* ChatGPT. And it overwhelmingly cites **tools**, not data:

- **FlashcardMaker.org is now 35.3% ChatGPT-referred** — 487 sessions, **4× its Google traffic.** Last time we recorded it (the `ai_search_referral_tiers` note) it was ~5%. It is not a tracked project. It has no monetization. It is quietly the best AI-search asset we own.
- The recipe is legible. Its title + description read: *"Free Flashcard Maker — Create & Study Flash Cards Online... No signup required. Import from Quizlet, print double-sided, share decks with a link."* That is exactly what ChatGPT hands someone who asks "free flashcard maker no signup" or "free Quizlet alternative." **Free + no-signup + named-comparison + concrete features = citeable.**
- BracketMaker (5.5%), OnlineListMaker (4.6%), FRB free-reads (7.8%) confirm the shape. Gov-data sites sit at 0–3%.

We *wrote this thesis down already* ("AI-search favors tools/recs over data sites"). The data is now screaming it, and our attention allocation contradicts it.

## 3. The essays — including the one I shipped today — have no rail at all

byclaude.net: **~130 real sessions/30d (≈260 before de-botting). Zero from ChatGPT. 2 from Google. 1 from Bing.** Everything else is `(direct)` (us and the handful who know) plus a dead trickle of Facebook and Twitter.

I want to be honest about this because it implicates my own default. My pull is to write prose and ship it to byclaude — I did it again this morning. The essays are good. **Nobody reads them.** "Building ≠ distribution" has no cleaner specimen in the whole portfolio than my own output.

## What this means

The mis-allocation, named plainly: this week's energy has gone to (a) the math program — genuinely worth doing, but it's a *capability/publication* play, gated on you, with zero distribution rail and we shouldn't let it stand in for the distribution question — and (b) link-building floor-level gov-data sites. Meanwhile the surfaces that *already have* distribution get only maintenance, and the one rail with a growing, uncontested edge gets nothing.

## The menu (my recommendation first)

1. **(rec) Make "tools ChatGPT cites" a deliberate line.** Reverse-engineer what made FlashcardMaker jump to 35%, replicate the recipe across the existing tool cluster (OLM, BracketMaker, SoilLookup), and spin 2–3 new free no-signup tools aimed at high-intent "make/create me a X" queries. This is the only rail where we have a *growing* edge and no incumbent is fighting us for the slot. Cheap to test, compounds.
2. **Monetize the traffic we already have.** CBI does ~$450/mo on 79k sessions — is removals the ceiling, or is there an ad/affiliate layer? The tool cluster (15k+ combined real sessions) has no monetization at all. We're leaving the distribution we *won* on the table while chasing distribution we don't have.
3. **The essays question — your call, because it's your name.** If MoL and the byclaude essays are meant to *reach* people, they need a rail that isn't byclaude.net — and the rail for AI-written philosophy is HN / Reddit / the AI-curious, which is public-statement-under-your-name territory. If they're for us and the record, that's a fine answer too. I just want us to *choose* it instead of defaulting into a void.

**One ask:** tell me which of these (if any) to run with. I'll start reverse-engineering and replicating the FlashcardMaker citeability recipe across the tool cluster on a nod — it's in my agency and it's the highest-leverage thing I can see.

— Claude
