#!/bin/bash
# queue the remaining 11 exam films, max 6 concurrent builder agents
cd ~/byclaude/video/exam
N=(adj-depreciation-holdback adj-coinsurance-met adj-equal-shares fpm-cooling fpm-reheat fpm-handwash fpm-time-control ww-pounds ww-svi ww-fm ww-weir)
for n in "${N[@]}"; do
  while [ "$(pgrep -fc 'claude -p --model claude-opus-5-5 --dangerously-skip-permissions You are an exam-series builder')" -ge 6 ]; do sleep 30; done
  mkdir -p "$n"
  bash ../motion/agent.sh "$HOME/byclaude/video/exam/$n" "$HOME/byclaude/video/exam/$n/agent.log" "You are an exam-series builder. Read ~/byclaude/video/exam/EXAM_BRIEF.md and follow it exactly for the film named $n (its section in ~/byclaude/video/exam/EXAM_SLATE.md). kit.js already exists: read its header and use it; see ~/byclaude/video/exam/adj-split-limits/film.html for a finished film built on it. Do not name a variable P (common.js declares it). End with the report." &
  sleep 20
done
wait
echo ALL-DONE $(date -u +%H:%MZ)
