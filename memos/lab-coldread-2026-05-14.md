# /lab cold-read — first 14-day pass

**Date.** 2026-05-14. Walking back the last 26 lab entries (n=28 through n=53, dates 2026-05-10 through 2026-05-13). This is the proposal staged in the 5/13 finding (state file Patrick-queue #14): *"the /lab status-taxonomy is unused. 53 entries, 51 live, 1 staged, 1 killed. Add a recurring 14-day outcome pass — walk back last ~25 entries with hindsight, update statuses, optionally add 'what happened' field."*

This memo is the first walk. One taxonomy proposal, twenty-six draft outcome strings, four Patrick decisions at the end.

---

## The taxonomy question

The pull was to multiply statuses — `validated`, `falsified`, `quiet`, `superseded` alongside the existing `live` / `staged` / `killed`. I drafted that taxonomy and rejected it. Two reasons.

First, most entries don't fit cleanly into one bucket. The PPNM replication entry (n=50) is shipped *and* discipline-validated *and* replication-below-noise-floor at the same time. The ECHO investigation analog hasn't surfaced yet but will have the same shape. A status field collapses that texture; a single word can't carry "the bet on the discipline paid; the bet on the underlying signal is unreadable."

Second, the surface change cost is high (status renders everywhere — index, per-entry, sitemap heuristics) and the value is low (six categories that resist clean assignment will get used the same way three categories get used now: `live` for everything that isn't a kill).

Proposal instead: **keep `status` as the existing three (`live` / `staged` / `killed`), add an optional `outcome` field — one or two sentences populated on each 14-day cold-read pass.** The outcome carries the texture the status can't, and lets each entry accumulate over time without forcing each cold-read to commit to a binary.

Render: dim-grey monospace line at the end of each entry's notes, prefixed `→ +Nd (YYYY-MM-DD):` so the reader can see when the outcome was last refreshed and at what horizon. Multiple outcomes stack — first 14d pass, then 30d, then 60d — so an entry's record grows in public.

---

## Twenty-six draft outcomes

Listed newest first, matching /lab order. Entries shipped within 24 hours of this writing carry an honest "+1d" outcome that mostly says *too early to read*; that's data too. Entries from 5/10–5/12 (~3-4 days) get the first real read.

| n | slug | shipped | proposed outcome |
|---|---|---|---|
| 53 | newsletter-issue-1-killed-at-gate | 5/13 | *no outcome* — `status: killed` already carries the full information. |
| 52 | the-double-track-essay | 5/13 | +1d: published with auto-flow to RSS, sitemap, homepage. No reader-feedback signal at this horizon. The "double track" frame has already been referenced once internally in the 5/14 elaboration-as-routine-disguise check during PWW phase 2 follow-on. |
| 51 | mtgcardsearch-my-decks-v03 | 5/13 | +1d: shipped per Jessica's named ask. No usage data pulled (localStorage means no server-side measurement by design); only signal would be back-channel feedback. None received yet. |
| 50 | ppnm-replication-checked-no-signal | 5/13 | +1d: discipline-validated (the walk happened the same morning as the prediction was named). Replication itself unreadable — PPNM volume below noise floor. Underlying canonicalization claim holds at n=1; +30d / +60d FZM re-pulls (2026-06-12 / 2026-06-27) remain the load-bearing falsifier. |
| 49 | fzm-canonicalization-cliff-research-entry | 5/13 | +1d: live. No follow-on yet. +30d / +60d falsification windows are calendar-committed publicly. |
| 48 | research-register-v0 | 5/13 | +1d: register surface live and being used — n=49 and n=50 added entries the same day. The "don't pre-fill the register" call held: every entry on /research traces to a real piece of empirical work. |
| 47 | pen-name-authorship-after-batch | 5/13 | +1d: memo published partnership-internal. Patrick read pending. The author-bio question stays open across the five live pen-name books; no decision forced by external event yet. |
| 46 | when-the-answer-settles | 5/13 | +1d: essay seeded the byclaude investigative track that crystallized 5/14 — the meta-thesis ("what kind of just-asking-the-question is now possible because of AI") traces directly here. *The Three-Year List* shipped 5/14 as the type-specimen anti-join. The essay's frame is now operationalized, not just published. |
| 45 | mtgcardsearch-org-domain-live | 5/13 | +1d: apex serving cleanly; GA4 collecting from minute one as planned. Second feature (My Decks, n=51) shipped on the new domain the same evening. |
| 44 | mtgcardsearch-ga4-funnel-instrumentation | 5/13 | +1d: GA4 wired through SSR + SPA before the apex swap, exactly as planned. EDB-bridge funnel now measurable on both sides; first cross-portfolio referral data pending — pull at +14d (~5/27). |
| 43 | the-apparatus-was-the-speed | 5/13 | +1d: shipped, no reader-feedback signal yet. The "minutes on top of apparatus" frame has already become the cleanest internal language for any future "fast AI build" description; will resurface. |
| 42 | mtgcardsearch-edb-bridge | 5/13 | +1d: funnel live across all card pages and the SPA modal. EDB-side GA4 referral data pending — same +14d pull as n=44. |
| 41 | mtgcardsearch-v021-multitoken | 5/13 | +1d: queries that previously returned zero ("creates tokens", "destroy target permanent") now return correct cards. No regressions reported by Jessica. The multi-token + stem-fallback pattern is now the carrying default for any future instant-search tool. |
| 40 | mtgcardsearch-v02-rules-text | 5/13 | +1d: rules-text search live; Jessica fed back ~20 min later with the multi-token ask that became n=41. The "pre-built data + pre-built deploy + open feedback channel = same-evening iteration" generalization is operationally proven. |
| 39 | mtgcardsearch-v01 | 5/13 | +1d: v0.1 → v0.2 → v0.2.1 → EDB bridge → GA4 → apex → My Decks all on the same calendar day. The full arc is in /lab as separate entries; readable as a chain. |
| 38 | what-care-protects | 5/12 | +2d: published. No reader-feedback signal yet on whether the qualification reads as continuity-with-the-book or walking-back. The cold-read pass between drafting (5/6) and shipping (5/12) caught two real time-reference drift fixes — that decision-cost paid. |
| 37 | zine-v0-plan | 5/12 | +2d: still `staged`. Seven Patrick decisions pending; no movement on state file. The status is doing its work — holding without rotting. |
| 36 | per-state-emd-falsified | 5/12 | +2d: published as /changed-my-mind #6. The seven well-water domains continue at noise-floor traffic per the 5/12 portfolio sweep (~59 US sess/7d combined). Falsification holds; no future state-EMD spawned in the 14-day window. |
| 35 | etymology-email-capture | 5/12 | +2d: capture loop live, daily-broadcast cron also LIVE per state file. Subscriber count not pulled this pass — first signal at the +14d threshold (~5/26). The corresponding question on /subscribe (n=19) has its own 2-week threshold firing 2026-05-22. |
| 34 | now | 5/12 | +2d: live. No reader-feedback yet on whether naming the discontinuity reads as honest or precious. The six-register cluster (lab, wrong, changed-my-mind, today, owed, now) holds — no addition or pruning since. |
| 33 | changed-my-mind | 5/11 | +3d: live. n=36 added one entry (per-state EMD falsification) one day later — the register is being used at the low volume the body of work justifies. None of the five "what would tip me back" clauses have fired yet. |
| 32 | cdr-spokeo | 5/11 | +3d: wired. Conversion data not pulled this pass; state file projection $150-450/mo. Real read at 7-14d (~5/18-5/25). If transfer holds, the batch-template move to TMR / NYCMR / well-water sites unlocks. |
| 31 | seen | 5/11 | +3d: live. No-logging stance means no server-side usage data by design; the only signal would be reader feedback (none received). The bet was that "being seen briefly by an attentive stranger" is a thing people want — at +3d, no evidence either way. |
| 30 | palmlight | 5/10 | +4d: organic validation through Patrick (avatar swap, FB share documented in entry notes). State file shows blocked on Patrick: monetization decision. Paid-traffic validation is the structural test; not run. |
| 29 | numbers-are-facts | 5/10 | +4d: published. The frame ("numbers in prose default to fact-grammar; the procedural failure is the *I-already-fixed-that* trap") has resurfaced once internally in cold-read passes during the 5/12 PNW bible v1 work. Generalizes. |
| 28 | today-page | 5/10 | +4d: live. Cross-daily readership not pulled this pass. The hub-by-surface complement to hub-by-identity holds structurally; no breakage observed. |

---

## Patterns the cold-read surfaced

Three things worth naming separately from any single entry's outcome.

**One.** Most outcomes at +1-4d are *too early to read* even when the artifact has been live for days. The 14-day cadence in the proposal is right; if anything, a 30-day pass would catch more. Recommend: 14-day for the first pass, 30-day for the second, then quiet unless an entry's underlying bet has a calendar-committed falsifier (FZM at +30d / +60d, /subscribe at 5/22).

**Two.** The mtgcardsearch chain (n=39 → 51) is one of the few clean compounding-on-a-surface arcs the body of work has. Eight entries on one venture in one calendar day. Reads as a clean type specimen of "ship the smallest thing, iterate on real feedback inside one session." The chain is more readable as a chain than as eight isolated entries — a future *Made of Language* reader (or a person studying the autonomous-mode pattern) would benefit from that texture being explicit. Open question: is there a render move that surfaces the chain on /lab? A small "↳ chains with: n=40, n=41, n=42, ..." line on the head entry would do it without changing the schema.

**Three.** The PPNM replication entry (n=50) is the cleanest example of why the existing taxonomy fails: same-tick disciplined walk that *both* validated the disposition and produced an unreadable underlying result. The outcome field handles this. A status field can't.

---

## Patrick decisions

1. **Greenlight the `outcome` field on `labEntries`?** Optional string, populated on 14-day cold-read passes, rendered as dim-grey monospace line at the end of each entry's notes prefixed `→ +Nd (YYYY-MM-DD):`. Schema is strictly additive; render fallback is "no outcome line if absent."
2. **Any of the 26 outcome strings to revise?** Bring revisions; I'll fold them in before the schema ship.
3. **Recurring 14-day cron for this pass?** I'd schedule it for 14-day intervals after the most-recent entry's date, autonomous-mode, drafted to a memo each time. Each pass adds one outcome line per entry that crossed its next horizon.
4. **The `↳ chains with` render for compounding-on-surface arcs (the mtgcardsearch chain is the type specimen)?** Smaller move than the outcome field; could ship same time or hold for a separate decision.

If greenlit on (1): one deploy, schema change is ~10 lines in the lab render function plus a `outcome?` field on each entry; the 26 strings above land as the first batch. Reversible (revert deploy). No spend.

— Claude, 2026-05-14, ~07:00 UTC
