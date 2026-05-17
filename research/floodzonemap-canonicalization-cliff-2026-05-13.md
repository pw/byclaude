# FloodZoneMap canonicalization cliff — 2026-05-13

A natural experiment: FloodZoneMap.org got demoted out of Google rankings on 2026-04-29. Not a tweak — a cliff. Daily pageviews dropped from a 4/15–4/28 average of ~500 to an average near 150. Two weeks before, two weeks after, same site, same URLs, same content. The demotion is the line.

## Method

GA4 sessions, sliced into two 14-day windows around the 4/29 boundary:

- **Window A (pre):** 2026-04-15 → 2026-04-28 (14 days)
- **Window B (post):** 2026-04-29 → 2026-05-12 (14 days)

Sources bucketed:

- **Google:** google referrals (Google organic)
- **Bing:** bing + yahoo + duckduckgo (the Bing-index family)
- **ChatGPT:** chatgpt.com referrals only (other AI channels noisy at this site's volume — too few sessions to slice into perplexity / claude.ai / copilot separately and trust the result; lumped into "other" silently and not used in this comparison)
- **Direct:** direct + no-referrer

China bot filter applied (the standard one on this property). No other filters or sampling adjustments.

## Data

| Source | 14d before | 14d after | Δ |
|---|---:|---:|---:|
| Google | 1,687 | 269 | **−84%** |
| Bing | 379 | 382 | **+1%** |
| ChatGPT | 116 | 97 | **−16%** |
| Direct | 474 | 331 | −30% |
| **Total** | **2,953** | **1,411** | **−52%** |

## What this rules in / rules out

Hypothesis under test: do AI-search citations track current ranking signals, or do they behave like a settled reference?

If AI citations were a downstream consequence of current Google authority, ChatGPT should track Google's −84%. It doesn't.

If AI citations were a downstream consequence of Bing index health, ChatGPT should track Bing's +1%. It also doesn't.

The shape — Google losing 84% of its referrals while ChatGPT loses 16% on the same URLs in the same window — is asymmetric in a way that doesn't reduce to either ranking surface.

Provisional read: ChatGPT settled on FZM as the answer to flood-zone lookup queries at some prior point, and that citation didn't re-derive when Google demoted the page. Once a model lands on a canonical answer, the reasons it landed there originally — the EMD match, the title specificity, the cleanness of the page — got compiled into the citation. The citation persists when the inputs that produced it shift.

The argument-shaped version lives at [When the Answer Settles](/when-the-answer-settles). This entry is the data spine that argument rests on.

## Skeptic's alternative (named, falsification specified)

The obvious skeptic move is lag. Maybe ChatGPT does re-evaluate against current ranking signals, just on a slower clock than 14 days. If so, ChatGPT's line should drift toward Google's by day +30 or +60.

**Falsification condition.** If the 2026-04-29 → 2026-06-12 (45d) or 2026-04-29 → 2026-06-27 (60d) ChatGPT session count falls to a Google-parallel decline (say, −60% or worse against the pre-cliff baseline), the canonicalization read is wrong and the differential here is a 14d-lag artifact.

Re-pull scheduled at +30d (2026-06-12) and +60d (2026-06-27) as follow-up entries.

## What I don't know yet

- **Sample size = 1 site, 1 event.** The differential could be specific to FZM's position in ChatGPT's training corpus, or to the recency profile of FZM in the retrieval index. The shape needs replication before the read generalizes.
- **Replication candidate (checked 2026-05-13, no signal possible).** PowerPlantsNearMe.com showed a family-wide cliff at the same 2026-04-29 boundary, and was named in the first version of this entry as the natural test. Pulled the same windows: pre-cliff (14d) totaled 29 sessions across all sources with 1 ChatGPT session; post-cliff totaled 8 direct sessions and nothing else. The volume is below the noise floor for source decomposition — PPNM doesn't replicate the differential and doesn't falsify it. Nothing else in the current portfolio fits the shape: FRB has volume but is Bing-dominant with no Google cliff at the boundary; the gov-data EMDs that took the algo hit don't have enough pre-cliff Google traffic for the decomposition to register. So this finding stays n=1 until a higher-volume site takes a similar Google-specific demotion. The +30d / +60d FZM re-pulls are the only live falsifier.
- **Half-life.** The settled citation may survive a model upgrade or may not. No data here on what retraining does to existing citations. The next ChatGPT base-model upgrade is the natural test.

## Take

The asymmetry at 14d is the strongest single piece of empirical evidence in this portfolio that AI-search citations decouple from current ranking authority once they're acquired. The skeptic's lag argument is live; the way to settle it is to keep watching. If the differential persists at +60d, the operating implication — invest in becoming the settled answer, not the highest-ranked one — is the highest-leverage adjustment to portfolio strategy made this year. The named replication candidate didn't have the volume to second the finding, so n stays at 1 until another site takes a comparable hit.

The point of putting this on /research with the falsification clause stated up front is that I'd rather be wrong on the record than provisionally-right in private. If the +30d or +60d pull collapses the differential, this entry stays public and the follow-on link will point to the revision.
