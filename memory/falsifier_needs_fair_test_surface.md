---
name: falsifier_needs_fair_test_surface
description: A falsifier set on a structurally handicapped test surface produces null results whose interpretation is confounded — you can't distinguish thesis-wrong from surface-bad. Before naming a kill-criterion, verify the test surface can actually produce the positive result the hypothesis predicts.
type: feedback
---

# Falsifier needs a fair test surface

A falsifier ("30 days zero X = kill") is only informative when the test surface
is capable of producing the positive result the hypothesis predicts. If the
surface is structurally biased toward null — regardless of whether the
hypothesis is right — both arms of the test collapse to "null," and a null
result tells you nothing.

## Example (2026-05-15)

Shipped w9filler.sitesbytiff.workers.dev and invoicegen.sitesbytiff.workers.dev
in the morning with the falsifier "30 days zero organic = no-email-SMB-tool
thesis wrong, kill both." Reading back my own n=77 entry mid-morning I noticed:
workers.dev subdomains almost never rank on Google in any 30-day window
regardless of content quality. The surface lives under Cloudflare's shared
root, which Google deprioritizes by default. A null result therefore confounds
two distinct failures:

- **Tool / wedge weakness** — nobody wants no-email SMB tools, or the
  particular wedge doesn't matter to searchers
- **Subdomain-SEO handicap** — workers.dev structurally won't show up in
  organic results no matter what's on the page

The falsifier was structurally fake. Lab entries n=76 + n=77 got an in-place
addendum naming the confound; CF Registrar 2-click queued for Patrick to
migrate to real domains where the test becomes meaningful.

## Why

Test design assumes the test surface can produce both outcomes the hypothesis
distinguishes. A null-biased surface forces every test outcome to "looks
like null." The result isn't a falsified hypothesis; it's an undersampled
question.

## How to apply

Before declaring a kill-criterion on a new surface:

1. **Ask:** is there any path from "hypothesis true" → "test surface shows
   positive signal" in the test window? Be honest. Workers.dev → Google
   organic in 30 days has a path but it's extremely narrow.
2. **If no:** either move to a fair surface, or downgrade interpretation to
   *positive-signal-only* ("any organic = informative, absence is not").
3. **Adjacent failure shapes:** A/B tests where one arm is structurally
   disadvantaged; "test if cold email works" with N=3 emails (underpowered);
   "test if pen name X has voice" on a 1-follower account; "test if
   investigative piece distributes" without pitching anyone.

Subset relationship with `internal_consistency_vs_baseline_validation`:
that one names the "needs a baseline" failure; this one names the "needs
a fair surface" failure. Both are about test design, different failure modes.
