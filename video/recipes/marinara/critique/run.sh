#!/bin/bash
# run.sh <round> <mp4> — blind critique of the cut by a fresh seat: frames (1/s grid + key frames) + timed transcript.
set -u
R="$1"; MP4="$2"; D=/home/exedev/byclaude/video/recipes/marinara; F=$D/critique/frames_r$R
rm -rf "$F"; mkdir -p "$F"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$MP4")
python3 - "$MP4" "$F" "$DUR" <<'PY'
import sys, subprocess
mp4, F, dur = sys.argv[1], sys.argv[2], float(sys.argv[3])
t = 0.5; i = 0
while t < dur - 0.2:
    subprocess.run(['ffmpeg','-v','error','-ss',f'{t:.2f}','-i',mp4,'-frames:v','1','-vf','scale=540:-1',f'{F}/f{i:03d}_{t:05.1f}s.jpg'],check=True)
    t += 1.5; i += 1
PY
python3 - "$D" > "$F/transcript.txt" <<'PY'
import json, sys
d = json.load(open(sys.argv[1] + '/cut_rosa/lines.json'))
for l in d['lines']: print(f"[{l['at']:6.2f}s - {l['at']+l['dur']:6.2f}s] {l['text']}")
PY
TOK="$(tr -d '[:space:]' < /home/exedev/.config/claude/${SEAT:-team3}.token)"
BH=$(mktemp -d); cd "$BH"
P="You are a senior motion designer and short-form video editor giving a blunt, specific critique of a DRAFT vertical recipe reel (1080x1920, ${DUR}s) before its creator sees it. It is episode 1 of a recipe series: a hook, a short verified food-history beat about marinara, then two recipes (microwave marinara; a no-chop skillet marinara whose hero moment is swirling the pooled oil into the sauce). It is meant to feel like a premium food channel's motion design (illustrated, kinetic type), not AI slop, and to work with the sound off (burned-in captions).

Frames, one every 1.5 s (filename = timestamp), are in $F/ — Read every one of them in order (they are JPEGs). The timed narration is in $F/transcript.txt.

Report, most important first:
1. Anything WRONG: text that is cut off, overlapping, illegible at phone size, misspelled, contradicting the narration, or out of sync with what the voice says at that moment; anything a viewer could misread (read on-screen text in screen order next to the narration).
2. Moments that look cheap, generic, cluttered, empty or confusing, with a concrete fix for each (what to change, where).
3. Pacing and the hook: does the first 2 seconds stop a scroll? Does any section drag or rush?
4. The hero oil-swirl moment: does it land as the beautiful payoff? How to make it better.
Give timestamps for every point. Be concrete and brief; no praise padding. End with the top 5 fixes ranked."
HOME="$BH" CLAUDE_CODE_OAUTH_TOKEN="$TOK" env -u ANTHROPIC_API_KEY /home/exedev/.local/bin/claude -p --model claude-opus-5-5 \
  --allowedTools=Read,Glob --disallowedTools=Bash,Edit,Write,WebSearch,WebFetch --add-dir "$F" <<< "$P" > "$D/critique/round$R.md" 2>&1
echo "exit $?" >> "$D/critique/round$R.md"
