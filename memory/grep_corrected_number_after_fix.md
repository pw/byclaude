---
name: grep_corrected_number_after_fix
description: Cold-read found a wrong number → grep that wrong value across the draft AND adjacent surfaces before declaring the fix complete; same wrong mental model carries the same wrong number to multiple paragraphs and surfaces.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 50a06e82-8450-4a4e-b5d8-3399c638d14e
---

# grep_corrected_number_after_fix

When a cold-read pass surfaces a wrong number in a draft, fixing it in the lead paragraph is not enough. The same wrong number was generated from the same wrong mental model — it almost certainly appears in the methodology section, the coda, the lab entry, the memo, and the research notes. Grep for the wrong value across all those surfaces before declaring the cold-read pass complete.

## What triggered this

5/14 cold-read pass on *The Discretion Map* (OSHA SIR investigation draft). The first error I caught was the Ohio number inverted in the lead paragraph (49% read as no-inspection rate, actual data says 49% is the inspection rate). After fixing the lead, I kept reading and found four more errors:

- "R5 inspects 20 pp higher than industry mix predicts" — that 20 pp is the raw R5-vs-R6 actual gap; the residual is +10.2 pp.
- The same 20-pp wrong number appeared *again* in the "reporters covering OSHA" call-to-action paragraph at the bottom of the piece.
- The same 20-pp wrong number appeared *again* in the verification-gaps section ("would shrink the 20-pp gap but not close it").
- "28-point regional gap" — invented (actual residual gap is 18.3 pp). Also appeared in the coda ("28-percentage-point regional residual").
- "Every R5 state sits in the top six" — Wisconsin is at +3.3 pp / rank 8, breaks the symmetric claim.

The bad mental model that produced the 20-pp number generated it in three places. The bad mental model that produced the 28-pp number generated it in two places. The cold-read caught them individually as I read forward, but `grep` would have caught them all at once.

The Wisconsin failure was the most consequential: I would have published a prose claim ("every R5 in top six") next to a data table that contradicts it (Wisconsin visible at +3.3 pp). Self-refuting on the same page.

## Why

Drafts produced quickly from a single research session carry the writer's working mental model into every paragraph that touches the relevant claim. If that mental model has a number wrong, the number will be wrong wherever it appears. Single-fix passes feel done but aren't.

The same mental model also propagates *across* surfaces — the draft, the published memo, the lab entry, and the research notes were all drafted from the same notes and all carried the same wrong claims. Cold-read isn't done until adjacent surfaces have been checked too.

## How to apply

After fixing a wrong number caught in cold-read:

1. **Grep the same draft** for the wrong value (and for variants — "20 pp", "20-pp", "twenty pp", "20%", etc.).
2. **Grep adjacent surfaces** (memo, lab entry, research notes, anything that quotes the same claim).
3. Only after `grep` returns zero matches across all relevant surfaces, treat the fix as complete.
4. If the error was a symmetric claim ("every X is in top N"), spot-check the actual ranking before assuming it holds — symmetric claims that look clean in prose often fail on the underlying data.

The cost of grep-after-fix is seconds. The cost of publishing a self-refuting claim under a single-author byline is the credibility of the surface.
