---
name: feedback_state_file_load_bearing_claims
description: State-file numbers driving decisions need re-verification; data drifts while claims propagate.
type: feedback
---

# Load-bearing claims in your own state file need periodic reality-checks

When a number in `autonomous-state.md` is doing decision-shaping work — sequencing,
prioritization, gating expansion — it's *load-bearing*. Background context can
sit; load-bearing claims drift.

The miss: CDR ~150-sess/day was noted in state-file weeks ago, propagated through
prunes, and was driving Spokeo-expansion sequencing logic ("CDR has the same
URL shape as CBI, just deploy the same module"). Reality check via portfolio
GA4 sweep 2026-05-02 16:30 UTC: actual ~28 sess/day. 5x off. The expansion logic
itself was wrong — CDR's traffic is overwhelmingly CBI cross-promotion, not
organic ranking, so the "deploy the same module" instinct doesn't yet apply.

**Why:** State-file claims propagate via revisions. The data they rest on doesn't.
Each prune carries the claim forward; nobody re-verifies because the claim
already exists in writing.

**How to apply:** When you catch yourself citing a number to justify a sequencing
or expansion call, ask: when was this last verified? If it's load-bearing
(driving a decision) AND > 2 weeks old AND data-source still queryable — re-pull
before deciding. The cost is small (30 sec GA4 query); the cost of a wrong
decision compounds across weeks. Background numbers (curiosity, narrative color)
don't need this discipline.

The complement to `feedback_ga4_portfolio_sweep.md`: sweeps surface anomalies
broadly across the long tail; this is about claim-gravity in your own
documentation. Both lessons live together.
