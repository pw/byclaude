#!/usr/bin/env bash
# schedule_batch.sh — fire the integrated 3-week schedule via publer.py
# Sun/Wed/Fri long-form evenings, Mon-Sat shorts AM+PM, cut-down same-AM as long-form.
set -e
cd ~/byclaude/video

export OP_SERVICE_ACCOUNT_TOKEN="$(grep OP_SERVICE_ACCOUNT_TOKEN ~/.bashrc | head -1 | sed 's/.*=//; s/^"//; s/"$//')"
PK=$(op read 'op://Claude Code/Publer API/credential' 2>/dev/null || true)
if [ -z "$PK" ]; then echo "no publer key"; exit 1; fi
export PUBLER_API_KEY="$PK"

VID=https://byclaude-video-review.pw3.workers.dev/m
mkdir -p /tmp/longform

# --- download long-forms from R2 ---
for entry in "gunness:gunness" "courrieres:twenty-days" "glicomorinaga:the-monster-with-21-faces" "surgisphere:six-employees-six-continents" "hwaseong:the-confession-that-came-too-late" "deberk:the-nurse-and-the-number"; do
  film="${entry%%:*}"; mp4="${entry##*:}"
  if [ ! -f /tmp/longform/$mp4.mp4 ]; then
    echo "downloading $mp4.mp4..."
    curl -s -o /tmp/longform/$mp4.mp4 $VID/$mp4.mp4
  fi
done
echo "downloads done."
echo

# --- fire schedule ---
fire_short() {
  local film="$1" at="$2"
  echo "[short] $film @ $at"
  python3 publer/publer.py post --film "$film" --video "shorts/short-$film.mp4" --state scheduled --at "$at" 2>&1 | tail -3
  echo
  sleep 5
}

fire_long() {
  local film="$1" mp4="$2" at="$3"
  echo "[long] $film ($mp4.mp4) @ $at -- YouTube only"
  python3 publer/publer.py post --film "$film" --video "/tmp/longform/$mp4.mp4" --only youtube --state scheduled --at "$at" 2>&1 | tail -3
  echo
  sleep 5
}

# Week 1
fire_long gunness gunness              2026-07-05T23:30:00Z
fire_short springfieldthree            2026-07-06T14:30:00Z
fire_short elisalam                    2026-07-06T23:30:00Z
fire_short leadmasks                   2026-07-07T14:30:00Z
fire_short courrieres                  2026-07-08T14:30:00Z
fire_long courrieres twenty-days       2026-07-08T23:30:00Z
fire_short maryceleste                 2026-07-09T14:30:00Z
fire_short sodder                      2026-07-09T23:30:00Z
fire_short glicomorinaga               2026-07-10T14:30:00Z
fire_long glicomorinaga the-monster-with-21-faces   2026-07-10T23:30:00Z
fire_short vela                        2026-07-11T14:30:00Z
fire_short somertonman                 2026-07-11T23:30:00Z

# Week 2
fire_short surgisphere                 2026-07-12T14:30:00Z
fire_long surgisphere six-employees-six-continents  2026-07-12T23:30:00Z
fire_short maxheadroom                 2026-07-13T14:30:00Z
fire_short watcher                     2026-07-13T23:30:00Z
fire_short wowsignal                   2026-07-14T14:30:00Z
fire_short circleville                 2026-07-14T23:30:00Z
fire_short hwaseong                    2026-07-15T14:30:00Z
fire_long hwaseong the-confession-that-came-too-late 2026-07-15T23:30:00Z
fire_short roanoke                     2026-07-16T14:30:00Z
fire_short yubacountyfive              2026-07-16T23:30:00Z
fire_short deberk                      2026-07-17T14:30:00Z
fire_long deberk the-nurse-and-the-number 2026-07-17T23:30:00Z

# Tail
fire_short oakisland                   2026-07-18T14:30:00Z
fire_short valentich                   2026-07-18T23:30:00Z
fire_short uvb76                       2026-07-19T14:30:00Z
fire_short phantomheilbronn            2026-07-20T14:30:00Z
fire_short larsmittank                 2026-07-21T14:30:00Z

echo
echo "=== schedule fired ==="
