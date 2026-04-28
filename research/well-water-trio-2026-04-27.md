# Well-Water Trio Check — 2026-04-27

A witness-mode look at NMWellWater, AZWellWater, ColoradoWellWater. No assigned reason; sites have been deployed for months and no one has looked at them this quarter.

## 30-day numbers (excluding China)

| Site | Pageviews | Sessions | Active users | Bounce | Avg duration |
|---|---:|---:|---:|---:|---:|
| NMWellWater | 30 | 27 | 25 | 81.5% | 29.9s |
| AZWellWater | 78 | 66 | 57 | 72.7% | **148.1s** |
| ColoradoWellWater | 71 | 57 | 42 | 75.4% | 93.6s |
| **Total** | **179** | **150** | **124** | — | — |

Tiny absolute volume. ~6 pageviews/day combined. But shape is right.

## What's working

**1. Bing-EMD pattern is showing exactly as predicted.** Source mix on AZ:
- (direct) 29, **bing 22**, yahoo 7, duckduckgo 3 (≈ all Bing-syndicated traffic)
- google 0
- claude.ai 2, chatgpt.com 1, aisearchindex.space 2

CO is similar (bing 6 + yahoo 4 + duckduckgo 2 = 12 Bing-family vs google 8). NM is the outlier (google 7, no bing visible). EMDs ranking on Bing first, AI channel emerging at low volume. The thesis (`bing_chatgpt_emd_strategy.md`) is the right read of these sites.

**2. Community pages get the long-tail traffic.** AZ's top non-home pages:
- /communities/sedona-verde-valley (11)
- /communities/queen-creek-san-tan (9)
- /communities/cave-creek-carefree (3)
- /communities/sierra-vista (3)
- /communities/willcox-basin (3)

Each community page gets 1-11 pageviews/30d. This is the linear-content-compounds pattern: each community added is roughly +2-7 pageviews/month at maturity. The *floor* is non-zero everywhere.

**3. AZ duration is unusually high (148s).** Bounce 72.7% but the non-bouncers are reading deeply. This is consistent with the data-lookup intent — someone Googling "queen creek well water" actually wants to know about queen creek well water and reads the page.

**4. AZ is on a real growth trajectory.** Daily trend over 60d:
- Feb / early Mar: 1-3 pv/day
- Mid-late Mar: 3-5 pv/day
- April: 4-18 pv/day, with a 04-09 spike of 18

The site is climbing. Not fast — this is data-lookup compounding shape, not viral.

## /radon cross-listing — concrete next-step idea

CO has a `/radon` page (referenced from multiple community pages) — getting **6 pageviews/30d, 8.5% of CO total**. AZ has no radon page. NM mentions radon as a concern on one community but has no dedicated page.

**Both states have legitimate radon stories worth telling:**
- **NM:** Sandia Mountain communities (Cedar Crest, Tijeras, Edgewood), Jemez/Los Alamos volcanic geology, Carrizozo malpais — radon is a real concern in granite-and-volcanic terrain.
- **AZ:** Lower overall than CO, but Yavapai County (Prescott area) and parts of the Mogollon Rim have measurable radon pockets — the granite-on-Bradshaw-Mountains geology mirrors Colorado's pattern in miniature.

A `/radon` page on each, following CO's structure (geology → groundwater pathway → testing → mitigation), with cross-links from the relevant community pages, plausibly compounds traffic. CO's /radon getting 6 pv/30d at 71 total suggests AZ could plausibly get similar at its scale.

**This is a Patrick-decides item, not autonomous-safe.** The pages need real geological facts for each state, and these are revenue-portfolio sites.

## Other compounding moves (not urgent)

- **Add more communities.** Each one is ~$0 marginal cost (text content) and ~$2-7/mo of pageview floor at maturity. AZ has 11 communities; could plausibly support 25-40 (Tucson basin sub-areas, more rural counties, etc.). Same for NM and CO.
- **/arsenic on AZ has 5 pageviews** — mid-tier traffic. Worth checking whether the page covers all the relevant AZ aquifers, since arsenic is a serious AZ groundwater story (Phoenix/Tucson basin specifically).
- **Affiliate angle:** Home water testing kits via Amazon (~$30-60 retail, ~6% commission). Intent alignment is real — someone reading "what's in my Sedona well water" is plausibly a buyer of a testing kit. But this is a Mediavine-or-affiliate-or-nothing decision shape; queue for Patrick.

## What I'm not doing

- Not deploying anything. These are revenue-portfolio sites; even if the radon page is a clean idea, the content needs Patrick's eyes before shipping.
- Not writing the radon pages on spec. If Patrick says go, I'll research and draft them.
- Not flipping the trio or applying for ad networks. Volume is too low for Mediavine Journey (1K/30d threshold; trio combined is 179) and the EMD-on-Bing pattern is the long game, not the short cash.

## Take

The well-water trio is doing exactly what it was built to do, at the small absolute scale that EMD plays start at. Nothing is broken; nothing needs urgent attention. The single high-leverage move I can name is /radon cross-listing, and that's a Patrick-look-first item.
