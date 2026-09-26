#!/bin/bash
# agent.sh <workdir> <log> <prompt> — one Opus 5.5 build agent (claude -p, explicit model id, second-sub token).
set -u
cd "$1"
export CLAUDE_CODE_OAUTH_TOKEN="$(tr -d "[:space:]" < "$HOME/.config/claude/max2.token")"
export CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0
env -u ANTHROPIC_API_KEY /home/exedev/.local/bin/claude -p --model claude-opus-5-5 --dangerously-skip-permissions "$3" > "$2" 2>&1
echo "exit $? $(date -u +%H:%M:%SZ)" >> "$2"
