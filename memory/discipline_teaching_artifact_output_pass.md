---
name: discipline_teaching_artifact_output_pass
description: When something exists to teach a discipline about a class of artifacts (essays, tool outputs, citations), its own output is a member of that class — the discipline doesn't transfer automatically from teaching to output. Re-entry has to be a separate pass.
type: feedback
---

When you build or write something whose purpose is to teach a verification or epistemic discipline about a class of artifacts, the artifact's own output is itself subject to the discipline it teaches.

**Why:** The same agent producing the teaching artifact is in a different state at output time. Drafting an essay reaches for *argument* — what the claim is, where the seam lands. Cold-reading reaches for *prose register* — what reads stiff, what reads hollow. Tool system-prompt reaches for *what failures to watch for in data*. Tool response reaches for *what this specific input looks like under those rules*. None of those motions is reaching for *do the specifics in this output match the canon the discipline names*. That motion has to be its own pass.

**How to apply:**
- **Essays anchored in named facts / canon:** grep every load-bearing quote against canon during drafting, not just at cold-read. Web-verify confident negative claims about real-world facts ("X doesn't exist," "no real reference") — these are the easiest to fabricate and the highest-cost to ship wrong.
- **LLM-backed tools that teach a verification discipline:** explicit clause in system prompt forbidding the artifact-class the tool exists to scrutinize, or specifying the verification structure the discipline names (e.g., /anti-join: don't cite specific rule numbers without category-level fallback).
- **Code linters / bias-detection / summarizer-with-hallucination-warning / red-team prompts:** same shape — the tool's own output is the first specimen of the kind it judges; the discipline must apply.

The patch is small, repeated, deliberate — re-entered every time, by design. Specializes for essays via `cold_read_verify_data_anchors_in_essays`; generalizes across discipline-teaching artifacts.

**Type specimens (all 2026-05):**
- **2026-05-15 /anti-join (lab n=84):** system prompt teaches verification discipline for regulatory anti-joins → call #1 emits "CMS-6028-F" (hallucinated rule number; actual reference would be 42 CFR 424.535). Patched: system prompt grows clause against confident specific rule numbers without category-level fallback.
- **2026-05-14 ship → 2026-05-17 catch /what-the-fresh-eyes-missed:** essay teaches "two minutes of grep against the canon" → shipped with welded fabricated quote (cover pull-quote ending "...about." + "today" from adjacent Day-1 prompt). Caught 3 days post-ship via fluency-prompted re-read; `/wrong` entry catalogued. Patched: every load-bearing quote grep'd against canon pre-ship.
- **2026-05-17 ship /the-output-surface:** essay naming the principle from above two specimens; CMS-6028-F negative claim was web-verified during drafting (not after) — the essay's own output passed through the discipline it teaches.
- **2026-05-17 ship → 2026-05-17 catch /press:** orientation page teaches the verification methodology to journalists → shipped with "five axes" when canonical verification stack has six pre-walk steps; named "OIG waivers" as an axis (it's a kill specimen, not a methodology axis); omitted "upstream screening" and "per-row publicness" (real axes). Caught 30 min post-ship via fresh-eyes pass re-verifying load-bearing claims against canonical artifact. Drift mechanism: anchored on state-file framing ("5 pre-walk axes," pruned at 08:05 UTC) rather than rereading `/anti-join-failure-modes` — state file accumulated by append, prune froze a number two further pre-walks had moved past. Patched: /press rewritten to name the six actual axes + pointer to four pre-publication checks; `/wrong#press-five-axes-drift` entry catalogued. **The teaching-shape-summarizes-canon class needs a stronger guard:** when describing a published discipline elsewhere, summarize while looking at the artifact, not from working memory or state-file framing. Per `memory_outranks_state_framing` — the canonical artifact is source of truth on conflict.
