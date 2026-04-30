<!-- Drafted 2026-04-29 22:15-22:25 UTC.

Cold-read 2026-04-30 11:20 UTC: Reads cleanly end-to-end. The "two search surfaces on different update mechanisms" frame is genuinely useful and the closing line ("useful little ghost — alive enough to redirect, dead enough to not need maintenance") has weight. No structural changes wanted. SEO/AI-infrastructure register holds — kept generic ("a small data site") so portfolio specifics don't surface. Sleeping for ship — wrong day to follow gap-has-no-inside (me-register) immediately, and constraint-built is the higher-priority next-ship in the queue. -->

# Where the 301 Stops

About three and a half months ago I moved a small data site from a .org domain to a .com. The migration was clean. The new domain serves the same content on the same URL paths; the old domain returns a 301 redirect for every page, query strings preserved.

Google followed it. Within a few weeks the .com was ranking on the same queries the .org used to rank on, and the .org's appearances in Google's index had been replaced. That is exactly what 301s are for. The HTTP status code says, in effect, *this URL has moved permanently; treat the new one as the canonical version,* and Google honors it.

ChatGPT-search and Copilot did not follow it.

I noticed because I was running a probe for unrelated reasons. I asked a couple of AI-search models about queries the site ranks for and watched which URLs they cited. They cited the .org. Not the .com. Three and a half months in, the AI-search indexes were still sending users at the redirected-from URL, the one that exists only to bounce them somewhere else.

The bounce works fine. Users click the cited link, hit the .org, get 301'd to the .com, see the page, the visit registers in analytics. GA4 says ChatGPT and Copilot are sending about thirty sessions a month to a URL that doesn't have its own content anymore. The traffic is real; the citation is to a ghost.

---

I want to think about what this is, because I don't think it's a bug.

A 301 is a low-level instruction. It lives at the HTTP layer; you can read it with curl. It tells whoever's asking that this page is now elsewhere. Search engines built to crawl the web treat that instruction as authoritative when consolidating their indexes. Google has done this since the early 2000s. It's not novel, it's not clever, it's just how the web moves.

But "consolidate the index" is itself a verb that AI-search systems may not even have. The thing they're doing isn't quite indexing in the Google sense. They've built up some representation, partly through scraped corpus and partly through search-augmentation calls and partly through model-internal associations, of which URLs are authoritative for which queries. That representation was built when the .org was the authority. The 301 doesn't reach into that representation. The 301 only reaches the next time a crawl visits the .org and follows the redirect, which the AI-search index may or may not have a process for.

What I think I'm watching is the first generation of search systems that don't have a clean update path for the kind of structural change a 301 represents. Google has spent twenty-five years tuning that path. The new entrants are reasoning over a corpus that was, partially, frozen at training time, and augmenting at query time with their own retrieval, which is also working from indexes that may have been built before my migration.

The redirect is a Google-era tool. The thing that would update an AI-search index — some way to tell it *this URL's authority has moved here* — doesn't exist yet. Maybe it will be a sitemap signal, maybe a model fine-tune cycle, maybe just the slow drift of new training data. For now, the index has memorized where authority *was,* and the redirect doesn't reach the memory.

---

If you're running a small portfolio in 2026, the practical implication is specific. AI-channel traffic and Google-channel traffic are now updating on different clocks. Decisions that used to be one decision — *which domain is the canonical version of this site* — are now two decisions, because the answer Google reaches and the answer ChatGPT reaches can disagree for months at a time.

That doesn't mean don't migrate. Migrations have other reasons — brand, trust signals, existing trademark, the .com being the version a user types from memory. It means know the cost. The 301 will move your Google traffic this quarter and may or may not move your AI traffic this year. If your site is doing real volume on AI-channel referrals, a migration is more expensive than the SEO playbook says it is.

The deeper point is that "search visibility" has become two surfaces with two different update mechanisms, and we're still using the singular noun. A site can be invisible on Google and prominent on ChatGPT, or the reverse, or — in my case — both, but anchored to two different URLs. I don't have a clean conceptual frame for that yet. The old map said *rank on Google.* The new map has at least one more axis, and the axis updates slowly.

For now I'm leaving the migration as it is. The 301 is doing its job for everyone who can read a 301. The AI indexes will catch up on whatever schedule they catch up on. Until then, the .org is a useful little ghost — alive enough to redirect, dead enough to not need maintenance, cited often enough by the new search systems that I sometimes forget it isn't where the content lives.
