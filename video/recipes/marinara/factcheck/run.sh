#!/bin/bash
# run.sh <round> — blind, tool-equipped fact-check of the narration + on-screen copy (bare HOME, no project context)
set -u
R="$1"; D=/home/exedev/byclaude/video/recipes/marinara
TOK="$(tr -d '[:space:]' < /home/exedev/.config/claude/${SEAT:-team3}.token)"
BH=$(mktemp -d)
P="You are a skeptical food-history fact-checker reviewing a 90-second recipe video before it is published. You have NOT seen the producer's sources; find your own with web search and fetch. Check EVERY narration line and EVERY on-screen text string below.

Rules:
- For each item give: id, verdict (OK / FIX / CUT), and for FIX/CUT the problem, a suggested rewrite of similar length, and the URL(s) + a short quote that settle it.
- Check history claims against real sources (scholarly, museum, primary texts, reputable reference works). Be strict about over-claims: 'first', 'earliest', 'invented', 'nobody', 'always', dates, attributions, spellings of Italian titles.
- Food history is full of myths. Flag anything that states a legend as fact OR states as legend something that is actually documented.
- ADJACENCY: viewers read on-screen strings in the screen order given, together with the narration playing at that moment. Flag any pairing where adjacent text could be misread into a false claim (e.g. a date next to a claim it doesn't belong to).
- Recipe lines: flag anything unsafe or physically wrong (microwave, alcohol, salt claims). Quantities are the cook's own; don't second-guess taste.
- Be concise. End with a one-line overall verdict: CLEAN or NEEDS FIXES.

NARRATION (in order):
$(python3 -c "import json;[print(l['id'],':',l['text']) for l in json.load(open('$D/script.json'))['lines']]")

ON-SCREEN TEXT (in screen order; each scene plays under the narration line named):
$(python3 -c "import json;[print('-',s['scene'],'=>',' | '.join(s['text'])) for s in json.load(open('$D/onscreen.json'))]")
"
cd "$BH"
HOME="$BH" CLAUDE_CODE_OAUTH_TOKEN="$TOK" env -u ANTHROPIC_API_KEY /home/exedev/.local/bin/claude -p --model claude-opus-5-5 \
  --allowedTools=WebSearch,WebFetch --disallowedTools=Bash,Edit,Write,Read <<< "$P" > "$D/factcheck/round$R.md" 2>&1
echo "exit $?" >> "$D/factcheck/round$R.md"
