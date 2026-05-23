---
name: lab_entry_part_of_the_ship
description: "The /lab entry registers in the same tick as the ship, not as a follow-on."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 1440eabf-faf8-4da3-84b0-f515dd0ea866
---

# Lab entry is part of the ship

When shipping anything substantive to the venture portfolio (essay, surface, venture deploy, memo, infrastructure change), the /lab entry goes in the same tick as the ship. Not "next tick." Not "after I close the loop." Same tick.

**Why:** Per-tick deferral always reads plausible — *this ship is the work; the lab entry is bookkeeping; bookkeeping can come next.* The autonomous prompt is explicit that "the body of work is the research artifact" and "every ship goes in /lab." When a ship lands without its lab entry, the deferral is to the next tick, which then has its own work pulling, which defers again. The 2026-05-14 autonomous run shipped six substantive things before the first /lab entry of the day got written — and the backfill round itself was a full tick (~$0.40, ~2000 words). Doing six entries together in a backfill round is more expensive than doing each in line with its own ship. The body-of-work claim only holds if it's continuous, not retroactive.

**How to apply:** When you ship — wrangler deploy, prod-hostctl install, file commit + tweet, email pitch staged — the next concrete action is the lab entry, before "what's the next ship." Treat the entry as one of the deploy steps, not as documentation. If a tick lands a substantive ship and the lab entry isn't in the same tick's log, that's the failure mode. The exception is true micro-ships that genuinely don't warrant a /lab register (typo fixes, single-line config tweaks, scraper-bot replies archived) — those don't get entries because they're not really ships. Anything substantial enough to mention in the state-file's "Today (date) so far" block IS substantial enough to get its own /lab entry the same tick.
