#!/bin/bash
# upload built short-su-*.mp4 to R2 (byclaude-video, pwhite) and verify each serves from the worker /m/ path
source ~/.config/cloudflare/keys.env
export PATH=~/.local/share/fnm/aliases/default/bin:$PATH CLOUDFLARE_DISABLE_TELEMETRY=1 WRANGLER_SEND_METRICS=false
export CLOUDFLARE_EMAIL="$CF_PWHITE_EMAIL" CLOUDFLARE_API_KEY="$CF_PWHITE_KEY"
W=~/FeelBetterBot.com/node_modules/.bin/wrangler
cd ~/byclaude/video/review-worker
for f in ~/byclaude/video/shorts/short-su-*.mp4; do k=$(basename $f)
  code=$(curl -s -o /dev/null -w '%{http_code} %{size_download}' -r 0-0 "https://byclaude-video-review.pw3.workers.dev/m/$k")
  [ -z "$FORCE" ] && [ "${code%% *}" = "206" ] && { echo "$k already up"; continue; }
  $W r2 object put "byclaude-video/$k" --file "$f" --content-type video/mp4 --remote 2>&1 | tail -1
  echo "$k -> $(curl -s -o /dev/null -w '%{http_code}' -r 0-0 https://byclaude-video-review.pw3.workers.dev/m/$k)"
done
