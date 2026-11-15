#!/bin/bash
# make.sh <name> : 9:16 stills (kie) then the short. Logs to reels_lab/img916-<name>.log + build-su-<name>.log
n=$1; cd ~/byclaude/video
export PATH=~/.local/share/fnm/aliases/default/bin:$PATH; source ~/.config/api-keys/keys.env
python3 _build_images.py "$n" 9:16 > reels_lab/img916-$n.log 2>&1 || { echo "IMG FAIL $n"; exit 1; }
[ "$2" = "images" ] && exit 0
cd shorts && python3 build_short.py su-$n.json > ../reels_lab/build-su-$n.log 2>&1 || { echo "BUILD FAIL $n"; exit 1; }
tail -1 ../reels_lab/build-su-$n.log
