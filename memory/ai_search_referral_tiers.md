---
name: AI-Search Referral Tiers
description: Portfolio data shows AI-search systematically favors tool/capability sites over data/lookup sites. Substitute vs complement economics.
type: project
originSessionId: 6938e275-8346-48bd-b19d-c6fe3228cbf7
---
**Observation (2026-05-04, portfolio-wide 30d GA4 via `ga4.py ai-sources all`):** AI-search (ChatGPT, Copilot) referral share varies 0-26% across portfolio. The variation isn't random — it maps cleanly to whether AI can *substitute* for the site or needs to *refer* to it.

**The substitution/complement distinction:**
- AI *substitutes* for data sites. "California birth records for Smith" — ChatGPT attempts an answer from training data. Doesn't need to refer.
- AI *complements* tool sites. "Make me a bracket for 16 teams" — ChatGPT can explain how but can't make the interactive tool. Refers because the user needs an external capability.
- AI *curates via* recommendation sites. "Free romance books to read" — ChatGPT acts as recommendation engine, refers to curated collections.

**Four tiers (with portfolio data):**

| Tier | AI share | What it is | Portfolio examples |
|------|----------|------------|--------------------|
| 1. Recommendation | 20-26% | "What should I read/try?" | FRB 26.2% (397 ChatGPT/mo) |
| 2. Capability/tool | 7-15% | "Make/create/build me a X" | BracketMaker 14.6% (564), OLM 7.3% (258), FlashcardMaker 5.8% |
| 3. Concern-driven lookup | 3-7% | "Am I at risk?" (location-specific) | FZM 4.8% (154), DisasterLookup 6.0% (small n) |
| 4. Static data | 0-2% | "Tell me about X" (training data sufficient) | CBI 0.009% (113 of 1.2M), MedicaidSpending 0.1%, records cluster ~0% |

**Engagement quality:** ChatGPT-referred users are the *highest-quality* traffic channel. FRB: 903s avg (15 min, vs ~400s organic). BracketMaker: 295s avg, 60% engaged, 2.8 pg/sess. The recommendation framing sets up exploration rather than task completion.

**Strategic implications:**
1. New builds should target tier 1-2 (recommendation + capability). These sites capture AI-referral traffic that grows as AI-search adoption grows.
2. Data sites (CBI cluster, records) won't grow through AI-search. Their future is traditional search + display ads. Still valuable — CBI does 1.2M sess/mo — just not AI-growth candidates.
3. EMD matters even more for AI referrals than traditional search. The domain name IS the recommendation signal.
4. Google is nearly absent from the top AI-referral sites. FRB gets 3.7% from Google, BracketMaker 2.2%. The entire revenue path for these sites runs through the Microsoft ecosystem (Bing + ChatGPT + Copilot + Yahoo).

**Why this is separate from the AI-gen EMD playbook:** That playbook is about building sites with AI under the hood. This observation is about AI-search as a traffic *channel* — it rewards tool/recommendation sites regardless of whether they use AI internally. FRB, OLM, and BracketMaker have no AI under the hood; they're pure tools. The referral value comes from the *capability gap* between what AI can do conversationally and what the user actually needs.

**How to apply:** When evaluating a new niche, ask: "Can ChatGPT answer this query from training data alone?" If yes → tier 3-4, AI-search won't drive traffic. If the user needs an *external capability* or *curated collection* → tier 1-2, AI-search becomes a growing traffic channel. Prioritize the second category for new builds.
