#!/bin/bash
# fix_run.sh <name> <seat> [<seat> ...] — run one critique-fix agent detached from the voice line, on Team seats.
# The agent runs with a bare HOME (small context) kept in ~/.cache/fable_fix/<name>, so a run that dies on a
# usage limit is CONTINUED (claude -p --continue) on the next seat instead of starting over. Brief: fix_briefs/<name>.md.
# Writes fix_reports/<name>.md and fix_reports/<name>.done (or .failed).
set -u
NAME="$1"; shift; SEATS=("$@")
D=/home/exedev/byclaude/video/recipes/marinara/fable
H=/home/exedev/.cache/fable_fix/$NAME; mkdir -p "$H" "$D/fix_reports"
export PATH=/home/exedev/.local/bin:/home/exedev/.local/share/fnm/aliases/default/bin:/usr/local/bin:/usr/bin:/bin
cd "$D"
LOG="$D/fix_reports/$NAME.log"; has_session() { find "$H/.claude/projects" -name "*.jsonl" -size +2k 2>/dev/null | grep -q .; }
first=1; has_session && first=0
for cycle in 1 2 3 4 5 6; do
  for SEAT in "${SEATS[@]}"; do
    TOK="$(tr -d '[:space:]' < /home/exedev/.config/claude/$SEAT.token)"
    if [ $first = 1 ]; then ARGS=(); PROMPT="$(cat "$D/fix_briefs/$NAME.md")"
    else ARGS=(--continue); PROMPT="You were stopped by a usage limit (or a restart). Your brief is fix_briefs/$NAME.md in the current directory. Continue the task from where you stopped; your edits so far are on disk. Finish with the short report."; fi
    echo "$(date -u +%H:%M:%SZ) cycle $cycle seat $SEAT first=$first" >> "$LOG"
    HOME="$H" CLAUDE_CODE_OAUTH_TOKEN="$TOK" env -u ANTHROPIC_API_KEY claude -p "${ARGS[@]}" --model claude-fable-5-2 \
      --output-format json --dangerously-skip-permissions --allowedTools "Read,Edit,Write,Bash,Glob,Grep" --disallowedTools "WebSearch,WebFetch,Agent,Task" \
      <<< "$PROMPT" > "$D/fix_reports/$NAME.json" 2>> "$LOG"
    RC=$?
    has_session && first=0
    VERDICT=$(python3 - "$D/fix_reports/$NAME.json" "$D/fix_reports/$NAME.md" <<'PY'
import json, re, sys
try: r = json.load(open(sys.argv[1]))
except Exception as e: print('bad'); sys.exit()
if isinstance(r, list): r = [x for x in r if x.get('type') == 'result'][-1]
txt = r.get('result') or ''
limit = r.get('api_error_status') == 429 or re.match(r"^\W*you'?ve (hit|reached) your", txt, re.I)
if r.get('is_error') or limit: print('limit' if limit else 'error'); sys.exit()
open(sys.argv[2], 'w').write(txt + '\n'); print('ok')
PY
)
    echo "$(date -u +%H:%M:%SZ) rc=$RC verdict=$VERDICT" >> "$LOG"
    if [ "$VERDICT" = ok ]; then touch "$D/fix_reports/$NAME.done"; exit 0; fi
  done
  sleep 900
done
touch "$D/fix_reports/$NAME.failed"; exit 1
