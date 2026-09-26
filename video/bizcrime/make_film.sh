#!/bin/bash
# make_film.sh <slug> — one Opus 5.5 film agent per verified story (claude -p, explicit model id).
# Runs the BRIEF.md build steps for stories/<slug>/. Log: stories/<slug>/agent.log
set -u
slug="$1"; d="$HOME/byclaude/video/bizcrime/stories/$slug"
[ -f "$d/BRIEF.md" ] || { echo "no verified BRIEF.md for $slug"; exit 2; }
grep -q "KILL" "$d/BRIEF.md" && grep -qi "verdict.*KILL" "$d/BRIEF.md" && { echo "$slug verdict is KILL; refusing"; exit 3; }
cd "$HOME/byclaude/video"
export CLAUDE_CODE_OAUTH_TOKEN="$(tr -d "[:space:]" < "$HOME/.config/claude/max2.token")"
export CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0
env -u ANTHROPIC_API_KEY /home/exedev/.local/bin/claude -p --model claude-opus-5-5 --dangerously-skip-permissions \
  "Build the business-true-crime short film for story slug '$slug'. Follow /home/exedev/byclaude/video/bizcrime/BRIEF.md exactly (read it first, all of it), then stories/$slug/BRIEF.md (the VERIFIED brief — its DO NOT SAY list is binding) and stories/$slug/sources/EXCERPTS.md (the only facts you may use). Read two existing shorts specs in shorts/ for the house register before writing. Do every build step through the R2 upload + review-worker deploy + caption pack, and finish with the report described in BRIEF.md step 9. If a build step fails twice, stop and report exactly where." \
  > "$d/agent.log" 2>&1
echo "exit $? for $slug" >> "$d/agent.log"
