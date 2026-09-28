#!/bin/bash
# verify_exam.sh <name> — two blind passes over a finished practice-question film (exam series).
#  1. SOLVE: sees ONLY the question + 4 options (KEY.json) — must independently pick one answer and say whether a
#     second option is defensible. Disagreement with KEY.answer = FIX. (A film whose key is wrong teaches the wrong thing.)
#  2. REFUTE: sees every on-screen string in order + caption (never SOURCES.md) and hunts for false/misleading content.
# Writes <dir>/verify/{solve,refute}.md and prints a final VERDICT line. Exit 0 CLEAN · 1 FIX · 2 cannot run.
set -u
n="$1"; D="$HOME/byclaude/video/exam/$n"
[ -f "$D/KEY.json" ] && [ -f "$D/film.html" ] && [ -f "$D/caption.txt" ] || { echo "CANNOT RUN: missing KEY/film/caption"; exit 2; }
DOMAIN=$(python3 -c "import json;print(json.load(open('$D/KEY.json'))['domain'])")
Q=$(python3 -c "import json;k=json.load(open('$D/KEY.json'));print(k['question']);print('\n'.join(k['options']))")
ANS=$(python3 -c "import json;print(json.load(open('$D/KEY.json'))['answer'])")
ON=$(python3 -c "
import re,json; h=open('$D/film.html').read(); m=re.search(r'const ON_SCREEN\s*=\s*(\[.*?\]);',h,re.S); print('\n'.join(json.loads(m.group(1))))")
CAP=$(cat "$D/caption.txt")
mkdir -p "$D/verify"; cd "$D/verify"
export CLAUDE_CODE_OAUTH_TOKEN="$(tr -d "[:space:]" < "$HOME/.config/claude/max2.token")"
C="env -u ANTHROPIC_API_KEY /home/exedev/.local/bin/claude -p --model claude-opus-5-5 --dangerously-skip-permissions"
$C "You are an expert in: $DOMAIN. Solve this multiple-choice practice question the way a careful exam-taker would, showing your work. Use authoritative sources (WebSearch/WebFetch) for any rule you are not certain of. Then answer: is any OTHER option also defensible as correct under a reasonable reading (state rules, edition differences, ambiguous wording)? Is any number or unit in the question inconsistent?
End with exactly two lines:
ANSWER: <letter>
AMBIGUOUS: yes|no

$Q" > solve.md 2>&1 &
$C "You are a skeptical subject-matter reviewer for: $DOMAIN. Below is every piece of text that appears on screen, in order, in a short vertical practice-question video for people studying for that licensing/certification exam, plus its caption. People will study from it. FIND WHAT IS WRONG, do not confirm.
Check every factual claim against authoritative sources (regulators, the code/standard itself, the certifying body's published formula sheet; WebSearch + WebFetch; no blogs as authority). Recompute every number. Flag: a wrong keyed answer; a distractor that is also correct; a rule stated as universal that varies by state/edition in a way that matters; a worked step that doesn't follow; a 'why the others are wrong' line that is itself wrong; example figures not labelled as examples; anything whose ORDER on screen would mislead.
For each finding: the exact on-screen string, what's wrong, source URL + verbatim quote, suggested replacement. Final line exactly 'VERDICT: CLEAN' or 'VERDICT: FIX' (FIX if anything would teach a viewer something wrong; style nits alone are CLEAN).

ON-SCREEN TEXT:
$ON

CAPTION:
$CAP" > refute.md 2>&1 &
wait
SA=$(grep -o '^ANSWER: *[A-D]' solve.md | tail -1 | grep -o '[A-D]$'); AM=$(grep -o '^AMBIGUOUS: *[a-z]*' solve.md | tail -1 | awk '{print $2}')
RV=$(grep -o 'VERDICT: *[A-Z]*' refute.md | tail -1 | awk '{print $2}')
echo "solve: key=$ANS solver=${SA:-?} ambiguous=${AM:-?} · refute: ${RV:-?}"
if [ -z "$SA" ] || [ -z "$RV" ]; then echo "VERDICT: CANNOT SEE (a pass produced no verdict line)"; exit 2; fi
if [ "$SA" = "$ANS" ] && [ "$AM" = "no" ] && [ "$RV" = "CLEAN" ]; then echo "VERDICT: CLEAN"; exit 0; fi
echo "VERDICT: FIX"; exit 1
