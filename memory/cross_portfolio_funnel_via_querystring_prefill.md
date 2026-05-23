---
name: cross_portfolio_funnel_via_querystring_prefill
description: "When two portfolio surfaces share data + audience intent, the structural play is a per-unit CTA deep-linking with state prefilled, not just a generic \"see also\" link."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e7deb325-82df-43ca-94b1-2bbe5c5c8fc7
---

# Cross-portfolio funnel via querystring prefill

When two surfaces in the portfolio serve adjacent intents on shared data (card-search → deck-building, dataset → tool, lookup → directory), the structural play is a per-unit CTA from surface A to surface B with **the user's current state prefilled into surface B's primary input**. Not a generic "also check out X" link.

The prefill is what makes it a funnel rather than a navigation aid. It collapses the friction step where the user has to re-type or re-select their context.

**Why:** A user on a card-page who clicks a generic "build a deck" link lands on an empty form and bounces 80% of the time. The same user landing on a form pre-filled with `Build a Commander deck with Atraxa as the commander` is one button away from a result — the deck-build session is essentially started. The prefill is the conversion mechanic.

**How to apply:** Look for portfolio pairs where (1) surface B's primary form accepts the relevant state via querystring or path param, and (2) surface A has natural per-unit pages where the state is already in scope. If both, ship the deep-link CTA on every unit page. Tag with `utm_source=<surface_a>&utm_medium=<cta_name>` for attribution into surface B's analytics.

If surface B doesn't accept the prefill via querystring, the pre-work is one form-handler change on B (read `?prompt=` and prefill the textarea) — usually a 5-line change. Then ship A's CTA.

**Implementation notes:**
- Distinct visual register from existing CTAs. If A already has an affiliate-yellow buy button, the cross-portfolio CTA should be a different color (blue worked for mtgcardsearch → EDB) so the three intents read as three intents.
- Per-card UTM granularity (`utm_content=<slug>`) is over-engineering for v1. Start with medium-level (`utm_medium=card_cta`) to read "does the funnel fire at all"; the per-unit cut comes after the funnel proves out.
- Don't conditional-render based on data type the regex can't catch reliably. For mtgcardsearch the legendary-creature regex on `type_line` is right for the dominant case; planeswalkers-that-can-be-commanders are a small fraction worth deferring to v0.2.

**Triggers for raising this play:** Nth-unit ticks on a venture (3+ ships of the same unit without structural infrastructure raised). The self_referential_ship_pattern memory's "watch outward" applies — outward includes "up the stack to portfolio-wide funnels," not just "to a different venture."
