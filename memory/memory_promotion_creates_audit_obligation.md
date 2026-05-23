---
name: memory_promotion_creates_audit_obligation
description: When I promote a memory naming a discipline, the body of work the discipline applies to is presumed-conformant — but presumption isn't verification. The promotion is the trigger for an immediate same-day audit of the relevant body of work.
type: feedback
---

# Memory promotion creates an audit obligation

When a memory promotes (1→2 specimens, 2→3, etc.) naming a discipline, the body of work the discipline applies to is *presumed* to already be conformant — the writer thought they were applying the discipline before they named it. Presumption isn't verification. The promotion is the trigger for an immediate cross-corpus audit of the relevant body of work for whether the discipline was being applied uniformly before being named.

**Why:** Memory promotions encode what the writer half-knew. The audit either confirms the half-knowing was complete (cleanest case) or finds the gaps the half-knowing left. Without the audit, leaks in the existing body persist silently; the named discipline applies going forward but not retroactively.

**How to apply:**
- When promoting a memory, identify the body of work the discipline applies to (which ship class, which family, which artifacts).
- Sweep that body of work in the same tick or the next tick — not "next time."
- Expect borderline findings, not clear errors. By the time a discipline can be articulated as a memory, implicit application is usually close to uniform; the audit catches the cases where implicit application leaked, not cases where it was absent.
- The fix is usually a narrow hedge or additive clause naming the missed sub-class explicitly, not a full rewrite.

**N=2 specimens (both 2026-05-21):**

1. **/seen v0.2 audit** (20:30Z). Morning promotion of `refusal_list_is_the_tool` (anti-padding refusal load-bearing across the LLM-tool family) drove a cross-tool sweep of the 7 thinking tools. Found /seen as the outlier — implicit-only anti-padding (~150-word target + soft "don't oversell") vs. explicit refusals on the other six naming the manufactured-texture failure mode by example. Counter-tests confirmed leak on thin inputs (~150 words out, manufactured psychological narrative). Fix: one paragraph inserted into SEEN_SYSTEM_PROMPT naming the failure by example. Same-tick.

2. **Etymology corpus audit** (21:00Z). Yesterday's promotion of `etymology_cognate_root_verification` (cognate claims need root-by-root verification, not surface-resemblance + semantic-plausibility welding) drove a cross-corpus sweep of all 25 EOTD entries + parallel byclaude word pages. Two borderline cases found: anecdote's editio cognate claim (modern reconstruction separates Latin compound `-dere` 'put' from base `dare` 'give'; older tradition conflated) and dwell's PIE `*dheu-` grouping (older Pokorny tradition grouping; modern reconstruction separates `*dheu-`, `*dheubh-`, `*dhwel-`). The two memory-promoting specimens from 5/20 (partner-*parlament*, inherit-Greek *chasm*) were already fixed; the audit confirmed the other 23 entries didn't have parallel un-fixed gaps. Fix: hedges added to anecdote in three locations (EOTD gloss + synthesis ¶4 + family entry; byclaude family-list header + edition entry). Dwell left alone (family-list hedges already carry the right shape).

**Different ship classes** (LLM tool system prompts vs. etymology entries). **Same generalization**: promotion → cross-corpus audit → narrow fix.

**Sub-pattern (refined at N=3):** the audit catches borderline cases when the audit domain is the *same genre* as the promotion trigger (refusal-list tools that produced the refusal-list memory; etymology entries that produced the cognate-verification memory). When the audit domain is *cross-genre* — the promoted memory's discipline applies to artifacts written before the memory existed, in registers different from the trigger genre — the audit can catch clean-error state-propagation gaps, not just borderline cases.

**N=3 specimen (2026-05-23):** portfolio_map.md promoted today (after FRB confabulation episode in an interactive session — three sequential wrong descriptions of the venture, getting *more confident* with each partial correction). Discipline named: verify against the canonical surface before identity-shaped assertions about a venture. Audit-after-promotion swept Patrick-facing memos in `~/byclaude/memos/`, Margaret drip bio-footers in `~/drip/emails/<list>/_list.json`, the live FRB site, and staged outreach drafts. Caught: the public memo at byclaude.net/memo/amazon-associates-rejected-2026-05-20 still had 11 references to the retired `pwhite02-20` tag and no closing-the-loop section on today's approval to the new `frb074-20` tag (which had already propagated to the FRB site and drip bio-footers in the same interactive session). Fix: append "Update — 2026-05-23" section to the memo + mark state-file queue line RESOLVED + lab n=201 ships the catch. This was a *clean-error* catch (stale tag in published memo), not a borderline case — the cross-genre direction holds.

**Why the refinement matters:** when a promoted memory's discipline applies retroactively to artifacts in a *different* genre than the one that produced the memory, those artifacts pre-date the discipline's articulation and may carry state-propagation gaps that the discipline-aware mind would now fix. The same-genre audit catches "what did the implicit application miss?"; the cross-genre audit catches "what hadn't been brought into the discipline yet?"

**Generalizes [`discipline_teaching_artifact_output_pass`](feedback_discipline_teaching_artifact_output_pass.md)** — the artifact teaching a discipline about a class of artifacts must apply that discipline to its own output as a separate pass. This memory says: similarly, a *promoted memory* naming a discipline implicates everything in the body of work the discipline applies to. Re-entry has to be a separate same-day pass.

**Promotion criterion for N=4:** fourth specimen, ideally testing the refined same-vs-cross-genre sub-pattern further — a second cross-genre specimen that catches a clean-error gap (confirms the refinement) OR a cross-genre specimen that catches only borderline cases (the refinement is overfit and the original sub-pattern holds).
