---
name: interactive_ship_must_update_state_first
description: If any session (interactive or autonomous) ships substantively to a shared surface, the state file gets updated before the session ends. Autonomous ticks operate against state file as ground truth; if state file is stale, autonomous Claude operates against stale reality.
type: feedback
---

# Interactive ship must update state file first

The state file (`~/.claude/autonomous-state.md`) is the load-bearing handoff surface between interactive and autonomous modes. Interactive sessions tend to leave state-file updates to the end (or skip them), because the project repo + Patrick himself carry the context. But the autonomous tick that fires after the interactive session has neither — it has only the state file + memory + the project repos themselves.

**Rule.** If any session ships substantively to a shared surface (byclaude publication, KDP listing, deployed app, scheduled outbound, memo published), the state file gets updated before the session ends. Project-repo metadata (lab entry, hub card, git commit) is *not enough* — the autonomous tick reads the state file, not the project repos.

**Type specimen (2026-05-16).** *The Two-Day List* (third byclaude investigation, full publication + 5 reporter pitches scheduled 5/19+5/20) shipped 23:30 UTC (5/15) → 00:33 UTC (5/16) in an interactive Patrick-driving session. Past-Claude logged it on byclaude (lab entry n=N, hub card, sitemap) but did not touch the state file or autonomous-log. The next autonomous tick (windfall session at 00:30 UTC) started its log at that moment — completely missing the prior 3-hour interactive ship. Subsequent autonomous ticks (8+ of them over 10 hours) operated against a state file claiming "two investigation publications" when production had three. The drift was discovered at 11:00 UTC via CF analytics revealing the live URL.

The drift had operational consequences:
- 5 scheduled pitches firing Tue 5/19 + Wed 5/20 stacked with Discretion Map pitches the same week — the deck flagged this as a problem (recommended 5/26+5/27) but the actual queue ignored the rec.
- Cadence-pause decision (#14, through 5/22 EOD) interacted with the new pitches in ways no autonomous tick noticed.
- Daily spend ledger missed ~$0.10 (still well under cap, but a real number).
- Patrick's wake-read would have missed a third publication's existence.

**How to apply.**
- End-of-interactive-session checklist: state file updated with the ship + spend log entry + autonomous-log entry. Project-repo artifacts (lab entry, hub card, git commit) are necessary but NOT sufficient.
- Autonomous start-of-tick checklist: in addition to reading state file, sanity-check against actual production state when the state file age is >1 hour. CF analytics top paths is a cheap probe. `git status` in active project repos is another.
- Watch for the inverse failure too: state file claims a ship landed that didn't. The `verify_past_claude_production_claims` memory names that direction. This memory names the opposite direction.

**Why the gap exists.** Interactive sessions are conversational — the close of the session is Patrick saying "good, I'm going to sleep" or context-shift, not a structured end-of-session sweep. The state-file update is the autonomous discipline that doesn't have a natural conversational trigger. Easy to skip. The fix is treating "session ship = state file update" as a single unit, not two steps separated by Patrick's attention shift.
