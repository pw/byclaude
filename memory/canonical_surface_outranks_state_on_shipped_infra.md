---
name: canonical_surface_outranks_state_on_shipped_infra
description: Before drafting a frame-shift proposal OR a new ship in a unique-slug corpus, sweep the canonical surface (homepage nav, /lab, recent commits, the actual URL) for whether the proposed thing already exists. State-file is operational; it tracks in-flight work and naturally stops surfacing things that shipped weeks ago. N=2 specimens: 5/18 /investigations near-pitch + 5/21 /home near-duplicate-ship — different ship classes (structural route vs. word-page), same discipline.
type: feedback
---

# canonical_surface_outranks_state_on_shipped_infra

Before drafting a strategic/frame-shift proposal OR a new ship in a unique-slug corpus, sweep the canonical surface for whether the proposed thing already exists. State-file is operational — it tracks in-flight work and recently-completed work. Structural infra and individual ships that landed 2-7+ days ago naturally stop surfacing in state-file headers.

**Type specimen (2026-05-18 22:15Z autonomous tick).** Strategic-scan trigger fired on 4th investigative anti-join publication this week (ECHO + OSHA + MI + VA). The Nth-unit-pattern from autonomous-prompt says: raise the structural infra question. I was about to draft a frame-shift proposal email — "should byclaude publicly index investigations as their own track?"

Before drafting, I curl'd `byclaude.net/investigations` to verify it 404'd as expected. It returned **HTTP 200** — past-Claude shipped the /investigations hub on 2026-05-16 (commits `48a6452` SDWIS PN kill card adding to it, plus `528c6bf` adding 4th kill). Three publication-shape pieces already published, five killed-at-gate documented, /press orientation page for journalists, /research methodology spine, /anti-join-failure-modes catalog. The frame-shift proposal would have been a moot pitch for a settled question.

State-file knew about the new memos (today's MI Medicaid patterns + VA T1019 cohort) but didn't mention /investigations exists — because /investigations isn't in-flight, it shipped 2 days ago. The state-file's working horizon doesn't extend that far back for structural ships.

**Second specimen (2026-05-21 23:35Z autonomous tick).** End-of-day drift-check pulled toward word-page ship as the non-meta originate. Picked *home* — PIE *ḱei-* "lie, settle" → home/cemetery/citizen, three lineages from one settling-act. Drafted a full ~2000-word EOTD-format entry. Then, before deploying, curl'd `byclaude.net/home` to verify it 404'd as expected. It returned **HTTP 200** — past-Claude had shipped a standalone essay-format /home page at some prior date with the same thesis (home/cemetery/city PIE-root reveal, signed by Claude). The state-file did not surface this; the byclaude.net codebase had `wordHomeHtml()` and an `/home` route, but neither was in the working-horizon section of state-file. Dropped the home draft, switched to *guest* (no slug collision), shipped clean. Different ship class from the 5/18 specimen — that was a near-pitch of a structural feature; this was a near-duplicate ship of a content artifact. Same discipline: state-file ≠ inventory; canonical surface is source of truth.

## Why

State-file accumulation discipline is "what's in-flight + recently-completed + queue for Patrick." Structural infra that ships and then runs unmodified doesn't generate state-file traffic. Canonical surfaces (homepage nav, /lab, git log of the relevant repo) are the source of truth for what exists. When the strategic-tick fires and pulls toward "raise structural infra to Patrick," the first question is: does it already exist on the canonical surface?

The trap: my state-file scan showed /lab, /book, /word, /memo, /subscribe, /audiobook-voice — but not /investigations. The natural inference was "/investigations hasn't been built." The correct inference was "state-file doesn't track it because it's not in-flight."

## How to apply

**Trigger A: strategic-tick raises structural infra X for venture Y.**

1. Before drafting the proposal, sweep:
   - `curl https://<domain>/<proposed-path>` for the obvious URL
   - Recent commits in the relevant repo: `git log --oneline | head -30`
   - Homepage navigation HTML for related links
   - /lab entries for the proposal's keywords
2. If the infra exists, the strategic-tick output is *different*: "the infra exists at Z, today's units aren't on it yet — should they be?" Or "the infra exists, here are the gaps." Not "should we build X."
3. If still uncertain, ask Patrick narrowly (one-line TG) — "I see /investigations on the homepage; is the disposition to add today's memos there?" — not pitch a frame.

**Trigger B: drafting a new ship at a unique slug (word-page, tool, essay, lab entry, investigation).**

1. Before deploying — and ideally before fully drafting — `curl https://<domain>/<proposed-slug>` to verify it 404s.
2. If it returns 200, read the existing artifact. Often it's adjacent territory (a thesis from a prior pass at the same word/concept) that either:
   - covers the new draft's territory (drop the new draft, pick a different slug)
   - is shallower than the new draft (potentially: deepen the existing page, or pick a different slug)
   - covers a sibling concept (proceed with the new draft, pick a different slug)
3. The `grep_essays_before_drafting_from_seed` corpus list (byclaude essays/, EOTD WORDS, lab, /wrong, journal prompts) is the corpus-grep version of this — but the canonical-URL curl is a stricter check because byclaude.net routes that aren't in the corpus list (like /home as a standalone essay rather than a /words entry) won't be caught by grep alone.

State-file is operational. Canonical surface is source of truth on what's shipped. Cross-check before pitching, and cross-check before shipping.

## Specializes

Cousin to `state_file_framings_need_reverification` (framings calcify), `state_file_load_bearing_claims` (numbers in state file may be stale), and `memory_outranks_state_framing` (memory > state on conflict). Different shape: those are about **claims in state file being wrong**. This is about **structural shipped infra being absent from state file**. State-file is not a complete inventory; it's a working horizon.

Adjacent to `verify_past_claude_production_claims` (state says deployed → verify prod). Different direction: that one is "state says it exists, verify it does"; this one is "state doesn't say it exists, but it might anyway."
