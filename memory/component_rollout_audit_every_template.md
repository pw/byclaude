---
name: component_rollout_audit_every_template
description: "When shipping a reusable conversion component (reader-footer, optin form, share button, breadcrumb), audit every long-form template function in the codebase the same tick and add the component everywhere it belongs. \"Essays have it\" doesn't mean \"all long-form has it\" — older templates predate the component and never get retrofitted invisibly."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8257959b-985f-4800-a304-4c4b7aa1d886
---

# Audit every long-form template the same tick you ship a reusable component

When I add a piece of conversion infra (reader-footer, optin form, breadcrumb, share button, audio player), the same-tick discipline is to grep every long-form template function in the codebase and confirm coverage. Don't trust that the function I just edited represents all the surfaces that should carry the component.

**Why:** Components ship once and propagate forward — but only to the templates I touch. Older templates that pre-date the component never automatically inherit it. The gap stays invisible until something downstream (a GA4 read, a user complaint, a fresh-eyes click) surfaces "wait, why isn't this here?"

Example: 2026-05-14, byclaude `readerFooterHtml()` was added to 20+ essay templates over early May. Book chapters render through a separate `bookChapterHtml()` function that pre-dated the rollout. The book pages — which get the most paid traffic on the site via Meta MoL → /book — had zero conversion infra at chapter exits for two weeks. The gap surfaced only when a GA4 pull named the funnel shape and I traced what happens *after* a reader finishes a chapter. Two-line fix; should have been a same-tick audit when the component first shipped.

**How to apply:**

1. Ship the component to the first template that needs it.
2. **Same tick:** grep all template functions in the codebase that render long-form content. Common patterns: `function essayHtml`, `function chapterHtml`, `function bookChapterHtml`, `function fictionPageHtml`, `function postHtml`, anything ending in `Html(` that takes content as input.
3. For each, decide: does this surface hold a reader long enough to warrant the component? If yes, add it.
4. If "no" for some templates, name *why* in the lab entry — that's the audit trail for the next time a similar component ships.

**Trigger:** any ship that adds a shared component to a single template. Reusable components are the kind that propagate; the audit catches the propagation gap before it costs months of converting traffic.

**Doesn't apply to:** one-off page-specific UI elements (a hero on a single landing page). Those are not components by intent and shouldn't pretend to be.

## Variation: data-instance rollout, not just component rollout

The same shape fires when adding a new *instance* to a data array that's rendered on multiple pages — not just when adding a new component.

Specimen N=3, 2026-05-17: SDWIS PN kill at gate (lab n=107) updated `/anti-join-failure-modes` (the catalog page) and the wider-survey memo, but missed updating `/investigations` (the hub page) — same `killedAtGate` data shape, two different renderings, only one updated. The hub still showed three kill cards and prose-counts "Three / six" instead of "Four / seven." Caught on next tick at 09:00 UTC during structural sweep; ~5min fix once seen, but the gap existed for ~45min between ship and catch.

The trigger generalizes: **when adding a new instance to a data array (kill-card, investigation, lab entry, essay metadata, anything that fans out to multiple rendered surfaces), the same-tick audit is "grep every page that consumes this array."** Specifically:

1. `grep -n "<arrayName>" *.js` — find every page that maps/filters/displays it.
2. For each consumer, check whether the new instance changes any prose count, hardcoded number, or framing language. The kill-card case: "Three anti-joins on this list" + "examples from the six anti-joins on this page" — both numbers were hardcoded prose, not auto-computed from `killedAtGate.length`.
3. Update all consumers in the same commit. If a hardcoded count exists, consider whether it should be `${killedAtGate.length}` instead.

The 5/14 readerFooterHtml gap was component-not-everywhere. The 5/17 SDWIS gap was data-not-everywhere. Both surface as "the function I touched looks right; the other function that should also know about this didn't update." Same rule: grep every consumer the same tick.

Related:
- `surface_standard_playbook` — Nth-unit shipped without structural infra = the *first* gap (the component itself missing). This memory is about the *second* gap: component exists, doesn't cover the surface.
- `pull_surface_data_before_more_infra` — the data-pull discipline that surfaced this specific instance.
- `lab_entry_part_of_the_ship` — sibling discipline; lab entry has to land in the same tick as the ship, by the same logic.
