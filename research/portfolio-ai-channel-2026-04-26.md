# Portfolio AI-channel share — 30-day snapshot

Pulled 2026-04-26 evening (autonomous). All numbers from GA4, sessions, last 30 days through yesterday.

AI-channel share = (chatgpt.com + claude.ai + perplexity + copilot.com) / total sessions.

## Recommendation-shaped (high AI-channel)

| Site | Sessions/30d | AI-channel | AI share | Top non-AI search |
|---|---|---|---|---|
| FreeRomanceBooks.org | 1,791 | chatgpt 483, copilot 6 | **27.3%** | bing 292 |
| BracketMaker.org | 3,665 | chatgpt 577, copilot 8 | **16.0%** | bing 1,519 |

Note inversions: FRB gets more traffic from ChatGPT than from Bing — pure Bing→ChatGPT mirroring would predict the opposite ratio. Suggests durable in-context recommendation rather than per-query mirror.

## Tools / utilities (moderate AI-channel)

| Site | Sessions/30d | AI-channel | AI share | Top sources |
|---|---|---|---|---|
| OnlineListMaker.com | 3,391 | chatgpt 266 | 7.8% | direct 2,097 / bing 234 / google 163 |
| FloodZoneMap.org | 2,824 | chatgpt 104, copilot 20, perplexity 3, claude.ai 2 | 4.6% | google 1,412 / bing 428 / direct 546 |
| FlashcardMaker.org | 269 | chatgpt 10, copilot 2 | 4.5% | bing 115 / direct 91 |
| SoilLookup.com | 749 | chatgpt 16, copilot 2 | 2.4% | google 398 / direct 240 / bing 60 |
| CaliforniaDeathIndex.org | 880 | chatgpt 20, copilot 7 | 3.1% | direct 707 |
| RadonLevels.org | 222 | chatgpt 5 | 2.3% | google 99 / direct 66 / bing 23 |

## Data-lookup / record sites (low AI-channel)

| Site | Sessions/30d | AI-channel | AI share | Top sources |
|---|---|---|---|---|
| CaliforniaBirthIndex.org | ~399,500 | chatgpt 96 | 0.024% | direct 376k / google 19k |
| AZWellWater.com | 65 | claude.ai 2, chatgpt 1 | 4.6% | (small sample — direct 29 / bing 22) |
| DamLookup.com | 131 | 0 visible | <1% | direct 115 |
| BridgeLookup.com | 87 | 0 visible | <1% | direct 76 / google 11 |
| MinesNearMe.com | 145 | chatgpt 1 | 0.7% | direct 99 / google 33 |
| PowerPlantsNearMe.com | 44 | chatgpt 1 | 2.3% | direct 25 / google 16 |

## Community-driven (different bucket)

| Site | Sessions/30d | AI-channel | AI share | Top sources |
|---|---|---|---|---|
| EDHDeckBuilder.com | 462 | chatgpt 2 | 0.4% | direct 369, **reddit 82** |

EDH community traffic is reddit-driven, not AI-driven. Single-platform community niche behaves differently from both recommendation-shaped sites and data-lookup sites.

## Too-new to read

| Site | Sessions/30d | Notes |
|---|---|---|
| PickemMaker.com | 34 | mostly direct |
| RobloxCodeGenerator.com | 49 | mostly direct |
| MinecraftCommandGenerator.com | 50 | direct only |

These are recent launches (mhnin0 CF Workers). Recommendation-shaped if the thesis holds, but not enough data yet to confirm AI-channel is opening up.

## Pattern

AI-channel share is highest where the **site completes the query** rather than provides raw material for it. The verb-shaped/noun-shaped distinction:

- Verb-shaped queries ("make me a bracket," "find free romance books") → AI hands off to a site that *does the thing*. AI-channel becomes a meaningful primary source.
- Noun-shaped queries ("find Joseph Smith's 1922 birth record") → AI either answers directly from training/retrieval or punts to Google. The data-lookup site is invisible to AI as a recommendation surface.

## Implications

1. **Portfolio segmentation matters.** Recommendation-shaped sites benefit from optimizing for AI-citation (clear language, query-matched headlines, the thing being on the page). Data-lookup sites need different monetization (intent-aligned affiliate, the Spokeo pattern) because AI-channel won't grow them.

2. **The AI generator EMD playbook is well-positioned** for AI-channel. BracketMaker is the proof.

3. **OnlineListMaker's reframe is part of a broader pattern**, not an anomaly. Treating chatgpt.com as a generic source rather than a distinct channel will systematically miscategorize sites in this category.

4. **Methodology refinement (commit to memory):** When triaging traffic mix on long-tail sites, query top-15+ sources and explicitly bucket chatgpt.com / claude.ai / perplexity / copilot.com / aisearchindex.space as their own AI-channel category. Top-5 reads will miss the signal.
