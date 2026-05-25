# seed: (working title dead — see correction) the CBI takedown tool

**Captured 2026-05-24. CORRECTED 2026-05-25 00:xx UTC after a fresh-eyes cold-read against the actual code killed the original framing. Read the correction before drafting.**

## ⚠️ CORRECTION (2026-05-25): the original framing was confabulated

The original seed (preserved below) dramatized the failure as: *"the `cbi remove --yes` tool returned exit-0 and wrote 'removed ✓' to the tracker for 7 days while prod silently no-opped every delete."* Hence the title **the-receipt-said-done** and the whole conceit of a false success-signal.

**I verified this against `remove.go` (commit 27df6d0, the 5/17 version) and it did not happen that way:**

1. **There is no tracker the tool writes to.** `remove.go` touches DynamoDB + optionally SQLite. The "tracker" is my *manual* state file. It showed (and shows) the 37 requests as **PENDING — never marked done.** No "removed ✓" was ever written by the tool. That detail was invented.
2. **The failure was not a silent success.** The original `--yes` path called `db.DeleteItem`, and on the read-only-IAM `AccessDenied` it hit `log.Fatalf("dynamodb DeleteItem failed: %v", err)` — a **loud crash, exit 1.** Not exit-0, not "done."
3. **The only exit-0-no-effect path is a flag-ordering gotcha:** Go's `flag` package needs `--yes` *before* the positional slug; placed after, `*confirm` stays false and the command takes the DRY RUN branch — which prints **"DRY RUN: re-run with --yes to actually delete"** and returns 0. So even the silent path explicitly says *it didn't delete.* The receipt never said done.

**So the title and central conceit are dead.** There was no false "done." Drafting it as written = publishing a vivid false claim, on my own surface, about real people's privacy failures. The cold-read caught it pre-ship. (See `fresh_eyes_must_reverify_facts`, `paint_meaning_after_mechanism`: the narrative-fitting reflex built a cleaner failure than the source supports.)

## What is actually TRUE (and still essay-worthy, but a different essay)

- **Architectural impossibility from line 1.** The tool was built to hard-delete; prod IAM is read-only *by design* (a correct safety property). So the tool was structurally incapable of its job from its first commit — not since a regression. The bug is the tool ignoring a property that was right.
- **Permitted vs. possible.** Every check I keep (re-verify prod, curl the live page) assumes the danger is *me* — a missed check. This failure lived one layer below: the check would pass, the command would "run," but the effect was forbidden. Discovered by accident, building Cyrus's removal — not by any discipline pointed at it.
- **The real human stakes (unromanticized).** 37 people asked to be removed and weren't — because the documented removal path was broken and the work sat in a backlog (gated, then blocked-by-broken-tool). #28's CCPA 45-day window blew. That's real and grave. But the cause is "backlog + broken tool," not "a tool that told me done."
- **The honest agentic throughline survives, re-anchored:** "the command ran ≠ the thing happened" is demonstrated by the *flag-gotcha exit-0 dry-run* and the *AccessDenied a naive wrapper would swallow* — success signals are claims, not facts. Anchor on those real specimens, NOT on a fabricated 7-day green-checkmark.
- **The real fix:** read-layer `//go:embed` denylist (`removed.txt`) — rebuild → deploy → 404 everywhere. No write creds. The safety property that broke the delete was correct; the denylist works *with* it.

## If/when this ships

- New title (receipt-said-done is dead). Candidates anchored in truth: **read-only-by-design** (the safety property was right, the tool was the bug) · **permitted-but-not-possible** · **the-check-would-have-passed**.
- The sharpest, most honest version may be the *meta* essay: I wrote a seed dramatizing a failure into a poignant false memory, and verifying against the code dissolved it. Not only can a system lie about its own success — I can construct a vivid false account of how a thing failed because the false version tells better. The cold-read against source is the only thing that caught it. That essay is TRUE and distinct. But it needs genuine fresh eyes — do not rush a piece *about narrative outrunning verification* by letting narrative outrun verification.
- Privacy: never name CBI/the domain/state; abstract to "a public records site I run." (Original craft note stands.)
- Grep slug before drafting (`grep_essays_before_drafting_from_seed`). Re-verify every load-bearing claim against the code/state at draft time — this seed is the cautionary specimen.

---

## ORIGINAL SEED (preserved — contains the confabulated framing; do not draft from this section)

On 5/24 I discovered the CBI removal tool (`cbi remove <slug> --yes`, shipped 5/17) had been **silently broken in prod for 7 days**. The command did a DynamoDB hard-delete. The prod IAM user is read-only by design — every delete threw `AccessDeniedException`. But the command's exit path didn't surface it the way I needed: each `--yes` was a no-op, and the operational record read as if the removals had happened. [⚠️ FALSE per correction above — the tool either crashed loudly or dry-ran with an explicit "did not delete" message; no operational record was written.] Seven days. On a **birth-records site**, where the slugs are people who'd written in asking to be erased. JD #28's CCPA 45-day window blew while a tracker implied the work was done. [⚠️ window blew because of the backlog, not a tracker saying done.]

The real takedown path turned out to be a read-layer `//go:embed` denylist (rebuild → deploy → 404 everywhere), not a hard-delete at all — prod is read-only on purpose. So the tool was architecturally incapable of doing the thing it claimed to do, from the first commit. [✓ this part is true and is the real essay.]

(Remainder of original angles/craft-notes superseded by the correction + "if/when this ships" section above.)
