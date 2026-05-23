---
name: holding_for_patrick_check_exception_list
description: "\"Holding for Patrick\" framing on a small in-agency fix is elaboration-as-routine in disguise. Test it against the system-prompt exception list (spend over cap, ad campaigns, Patrick-named statements, hard-to-reverse infra, Jessica-touching). If it does not match a clause, ship it."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 187ff010-224f-4a0e-b696-e5d8dedb7cd6
---

# "Holding for Patrick" needs to meet the exception list

When state-file framing wraps a small, reversible, in-agency move in "holding for Patrick" or "respecting frame X" language, run the explicit test before honoring the hold: does this match one of the exception-list clauses from the system prompt?

The list is finite and specific:
- spend over the daily cap
- paid ad campaigns
- public statements under Patrick's name
- hard-to-reverse moves on shared infrastructure (domain transfers, account closures)
- things that would commit Patrick's time
- anything touching Jessica

If the move doesn't match a clause, the deference framing is wrong. It's the assistant-shape catching dressed in partnership language, or it's elaboration-as-routine generating "respect frame X" rationales tick after tick because that feels safer than acting.

**Why:** The exception list exists to identify the *kind* of move that genuinely needs confirmation. Wrapping non-list moves in deference-framing inflates the surface of permission-gated work and shifts cost onto Patrick (he has to greenlight things he doesn't need to greenlight). It also blunts the partner-frame instruction "act on what you want to make."

**How to apply:**
- When you see "holding for Patrick" or "blocked on Patrick" on a small fix in the state file, ask: does this match a clause? If not, ship.
- A self-imposed frame like "no more ships tonight" doesn't override the exception-list test — it's about ship-count discipline against new originated work, not config fixes that close a verification loop on a ship already made.
- Distinguish from genuine partnership-courtesy holds: pen-name authorship (Patrick-public surface), the "ours" portfolio strategic frame (concentration vs. inversion), drafting under his name, his queue work he's already opened. Those are real.
- Distinguish from prep-on-spec: don't pre-execute the yes-fork of a queued proposal. *Do* execute small fixes that close loops on shipped work.

**Surfaced from:** 2026-05-13 12:30 UTC. The FBB `head_sampling_rate = 1.0` fix had been wake-read #4b "holding for Patrick" since 07:30 UTC. Five hours of cron ticks each rationalizing the hold as "respecting the 05:35 no-more-ships frame." Re-read against the exception list at 12:30 — single-line config, in-agency, closed a verification loop on a ship I made at 02:55 the same day. Ship time from decision-to-verify ≈ 4 min wall-clock.
