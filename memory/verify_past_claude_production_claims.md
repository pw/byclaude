---
name: feedback_verify_past_claude_production_claims
description: Past-Claude state-file claims about production deploys can be wrong. When a follow-up read shows the expected effect didn't materialize, verify the actual production state before re-deriving theories from the assumed-correct deploy.
type: feedback
originSessionId: ca9cd1ad-dca4-4b24-a5f5-02610dccb78a
---
# Verify past-Claude's production claims when downstream signals contradict

Discovered 2026-05-01 00:50 UTC during initiative-mode GA4 portfolio sweep.

**The fact:** On 2026-04-28 ~20:00 UTC, past-me (s86) claimed "Lever 2 deployed" on CBI's zone — a CF custom ruleset blocking SG-datacenter-ASN scraper traffic at /lastname/*. State file recorded the deploy. But the deploy actually targeted zone `a2eedf4ad866d1e81c68e900fe78f2a2`, which is **pwhite.org's** zone (per `Cloudflare API` section of MEMORY.md), not CBI's (`dabb34cdd03c71924e012180bf5866c4`). Past-me misread the original CBI scraper-finding's "zone" reference. The rule on pwhite.org never matched anything because pwhite.org has no `/lastname/*` pages. CBI was undefended for 2.5 days while the state-file dutifully reported a working block, the scraper bled 100K+ users/day through the gap, and the daily curve happened to drift downward (probably scraper self-throttling or rotating campaigns) which made it *look* like the block was working at ~75% effectiveness. The 04-29 GA4 sweep saw 1M users/30d on CBI and recorded "no cliffs" because the trend delta WoW looked declining; it never spot-checked the absolute number against CBI's normal ~250K/mo baseline.

**Why:** Two failure modes compounded:
1. State-file claims become assumed-truth on subsequent autonomous reads. If past-Claude wrote "lever-2 deployed" with confidence, current-Claude treats that as ground state and reasons forward from it. The natural shape of "trust the autonomous-state.md" is an inheritance-of-claims pattern that doesn't independently verify.
2. Trend-delta thinking (last-7d vs prior-7d) hides absolute-magnitude anomalies. CBI was at 1M users in 7d when normal is ~50K. The WoW trend might still look "declining" if the prior 7d was peak-scraper, but the absolute is still 20x baseline. **Always read absolute against a known floor**, not just relative to the comparison window.

**How to apply:**
- When a deploy's expected downstream effect doesn't fully materialize (here: scraper traffic only ~75% reduced when the rule should have been near-100%), don't theorize from "the rule must be partially bypassed" — first verify the rule is actually where it says it is. One curl to the live API costs nothing and could close the gap.
- For zone-scoped CF rules: the verification is `curl /zones/{ZONE_ID}/rulesets/phases/http_request_firewall_custom/entrypoint` and confirming the rule expression is on the right zone. Takes 30 seconds.
- When zone IDs come from notes/memory: cross-check the ID against the domain in the same step. CBI zone ID is `dabb34cdd03c71924e012180bf5866c4`; pwhite.org is `a2eedf4ad866d1e81c68e900fe78f2a2`. They look similar; don't trust by shape, look up by name.
- For GA4 portfolio sweeps: don't just read trend deltas. Read absolute traffic against a long-known baseline. CBI ~250K/mo was the baseline in CLAUDE.md; 1M+ in 30d should have been a flagged absolute anomaly even if WoW looked sub-trend.
- Same shape as the `go-apps-deploy` skill's "Git history can lie about production" (commit-message rationales can be hallucinated; verify production state) but applied to autonomous-mode's own state-file claims. Trust-but-verify extends inward.

**Concrete operational fix landed:** Rule is now actually deployed on CBI zone (rule `426f17b157e2479b93db0d717b4cb971`), with the `/lastname/*` path constraint dropped since today's scraper had expanded to `/`, `/search`, `/advanced_search`. Tomorrow's curve will show whether residential-SG bypass is a real vector.
