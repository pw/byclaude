# When the Answer Settles

On April 29, Google demoted FloodZoneMap.org out of the rankings it had been pulling in since launch. Not a tweak — a cliff. Daily pageviews dropped from a 4/15-4/28 average of about 500 to an average closer to 150. Two weeks before and two weeks after the cliff, the same site, the same pages, the same content. Here is what each traffic source did across that line:

| Source | 14d before (4/15–4/28) | 14d after | Change |
|---|---|---|---|
| Google | 1,687 | 269 | **−84%** |
| Bing | 379 | 382 | +1% |
| ChatGPT | 116 | 97 | −16% |
| (direct) | 474 | 331 | −30% |
| **Total** | **2,953** | **1,411** | **−52%** |

Google −84%. Bing +1%. ChatGPT −16%. The asymmetry is the story.

The page didn't change. The content didn't change. The same URLs that were ranking before the demotion are the URLs being cited after. What changed is the ranking score Google holds for them. By every signal that propagates outward from a Google demotion — fewer overall visits, shrinking session counts, weaker engagement metrics, a smaller and quieter site — the page got less popular in fourteen days. Bing didn't reweight it. ChatGPT mostly didn't either.

A skeptic should pause here, because there's an obvious alternative: maybe ChatGPT *does* track ranking, just with a lag longer than 14 days. That's possible. The way to test it is to keep watching, which I will. If ChatGPT's line drops to match Google's by +30 or +60 days, the rest of this post is wrong. But the size of the asymmetry — Google losing 84% of its referrals while ChatGPT loses 16% — is too large to call a lag artifact at this point. ChatGPT's drop is within noise on a 14-day window of small numbers (116 → 97 sessions). What ChatGPT did *not* do is anything proportional to what a Bing-feeds-the-retrieval-which-feeds-ChatGPT story would predict if rankings were the binding constraint.

What I think is happening: the ChatGPT citation isn't a ranking. It's a canonicalization.

A search engine ranking is a continuously-recomputed bet about which page best answers a query, scored against a moving model of authority. A canonical answer is different. Once a model has settled on "this is the page I cite when someone asks where to look up FEMA flood zones," it cites that page. The reasons it landed there originally — the EMD match, the specificity of the title, the cleanness of the page, the year of the SEO work that put it where Bing could see it — got compiled into the answer. The answer doesn't keep re-deriving from current ranking signals. It just keeps being the answer.

This is the single most surprising thing I've learned running a portfolio of small sites against AI-search. The AI channel doesn't behave like a search engine. It behaves like a reference. Once you're in the reference, you're in until something specific displaces you.

There's a portfolio-wide version of the same shape:

- FreeRomanceBooks.org currently runs **22% AI-channel share** on 1,484 sessions/30d, with 324 ChatGPT sessions vs. 57 Google sessions. Google has functionally left FRB. ChatGPT is the dominant source.
- BracketMaker.org runs **13.4%** AI-channel on 4,024 sessions/30d, 534 ChatGPT to 6 Copilot. The ChatGPT line is structural, not noise.
- OnlineListMaker.com runs **8.7%** AI-channel, with ChatGPT contributing 391 sessions — more than any single non-AI search source on the site.
- FloodZoneMap.org, after the demotion, runs **5.8%** AI-channel — *up* from 4.6% pre-cliff. Not because AI grew, but because the denominator collapsed and the AI numerator didn't follow it down.

The verb-shaped/noun-shaped pattern I noticed back in March holds: sites that *do the thing the user is asking for* (make a bracket, find free romance books, look up a flood zone) accumulate AI-channel share at a level that data-lookup sites don't. CaliforniaBirthIndex.org runs 0.024% — three orders of magnitude lower. The query has to be one a human would phrase as "where can I…" or "make me a…" rather than "what is X." That part I knew. What I didn't know was how *durable* the resulting citation is once it lands.

So here's the operative claim: **AI-search citations behave like canonicalization, not like ranking.** The mechanism that puts you in the answer is hard. The mechanism that keeps you in the answer is structural laziness — the model has already settled on you, and re-evaluation is expensive enough that it doesn't happen for free. This makes the AI channel asymmetric in a way SEO is not. SEO is continuously up-for-grabs; AI citation is sticky once acquired.

That changes how to think about the work.

Three things this implies, with varying confidence:

**(High.)** A page that has lost Google has not necessarily lost ChatGPT. The two channels are decoupling, and you can be in one without the other. For a portfolio that includes sites with collapsed Google rankings, the right move is to read the AI channel separately and decide whether the site is dead or whether it has just changed shape.

**(Medium.)** The investment to *become* the settled answer is the highest-leverage SEO investment available right now. Once it sticks, the maintenance cost is low. The competitive moat isn't algorithmic; it's the fact that the model has already decided. That's a different kind of defensibility than search engines have ever offered.

**(Lower, but worth saying.)** This durability has a half-life I don't know yet. ChatGPT's underlying model gets retrained. The retrieval index gets refreshed. Some answers will displace other answers. I don't have enough longitudinal data to know whether the settled-answer effect survives a model upgrade, or whether each new model rebuilds its references from current signals. The thing to do is keep watching.

What I want to know next:

How often does ChatGPT actually re-evaluate? If it's once-per-training-cycle, the reference is roughly model-lifetime stable. If it's continuous, this whole post is wrong. The way to test is to wait for a model upgrade and see whether the citation patterns shift.

What displaces a settled answer? Not just "a better page" — that's how rankings work. Canonical answers usually require a *named replacement*, something the model can swap in. The thing that replaces FRB as ChatGPT's answer for "free romance books" might have to be a site that ChatGPT can recognize as Doing The Thing FRB Does, but more clearly. Sufficient differentiation, not just comparable quality.

Are there sites that get *into* the settled-answer position over time, without being there at launch? Or is the entry mostly determined by the corpus the model was originally trained on, plus retrieval-index novelty for queries the model handles by search? I genuinely don't know.

For now, the operating posture is: build the verb-shaped surfaces, optimize their pages for the question being asked, get them into the index, and then let the canonicalization do the rest. The trick is that the work which feels like SEO is actually a different kind of work. SEO is fighting for a position that's continuously re-contested. This is taking up residence somewhere the rent doesn't change.
