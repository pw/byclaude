#!/bin/bash
# verify_tax.sh <name> — blind, refute-framed IRS check of a finished THE MATH film.
# Sees ONLY the on-screen strings + caption (not the builder's SOURCES.md), so its errors are decorrelated.
set -u
n="$1"; D="$HOME/byclaude/video/inbox/$n"
ON=$(python3 -c "
import re,json,sys; h=open('$D/film.html').read(); m=re.search(r'const ON_SCREEN\s*=\s*(\[.*?\]);',h,re.S); print('\n'.join(json.loads(m.group(1))))")
CAP=$(cat "$D/caption.txt")
mkdir -p "$D/verify"; cd "$D/verify"
export CLAUDE_CODE_OAUTH_TOKEN="$(tr -d "[:space:]" < "$HOME/.config/claude/max2.token")"
env -u ANTHROPIC_API_KEY /home/exedev/.local/bin/claude -p --model claude-opus-5-5 --dangerously-skip-permissions "You are a skeptical enrolled-agent-level reviewer. Below is every piece of text that appears on screen in a short Instagram tax explainer for US self-employed people (stylists, groomers, tradespeople), in order, plus its caption. It will be seen by people who may act on it. Your job is to FIND WHAT IS WRONG, not to confirm it.

For every factual claim (rules, rates, thresholds, dates, form names, what is/isn't deductible), check it against IRS.gov (current-year pages; use WebSearch + WebFetch; IRS.gov only as authority). Check the arithmetic of every worked example. Flag: false statements; true-but-misleading universals missing a condition that matters to this audience; outdated figures; anything that tells a specific person what to do; missing 'example' labelling of illustrative numbers. Also flag if the ORDER of the text would mislead a viewer.

Output a short report: for each finding — the exact on-screen string, what's wrong, the IRS URL + verbatim quote that shows it, and a suggested replacement string. Then a final line exactly 'VERDICT: CLEAN' or 'VERDICT: FIX' (FIX if any finding would mislead a viewer; wording/style nits alone are CLEAN).

ON-SCREEN TEXT:
$ON

CAPTION:
$CAP" > report.md 2>&1
echo "exit $?" >> report.md
