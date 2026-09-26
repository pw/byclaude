#!/usr/bin/env python3
"""Render a byclaude motion-design film: <dir>/film.html -> frames -> + sound -> <out.mp4>.

Two sound modes, chosen by what is in <dir>:
  <dir>/soundtrack.m4a exists  -> TWIN mode: that exact audio track is muxed in untouched (-c:a copy).
                                  Used for A/B twins of an existing film, so only the PICTURE differs.
  otherwise                    -> sound.py builds mix.wav from the cues film.html reports.

film.html contract: a <canvas id="c" 1080x1920>, window.render(t) deterministic in t,
window.ready = Promise resolving to {total, ...cues for sound.py}. Fonts in ../fonts or ../../motion/fonts.

Usage: render.py <dir> <out.mp4>               full render
       render.py <dir> --stills 1.5 7 12 ...   writes <dir>/still_<t>.png only
"""
import json, math, subprocess, sys, pathlib
from playwright.sync_api import sync_playwright
HERE = pathlib.Path(__file__).parent.resolve(); FPS = 30
if len(sys.argv) < 3: sys.exit(__doc__)
D = pathlib.Path(sys.argv[1]).resolve()
stills = sys.argv[2] == '--stills'
only = [float(x) for x in sys.argv[3:]] if stills else []
out = None if stills else pathlib.Path(sys.argv[2]).resolve()
params = json.load(open(D / 'lines.json')) if (D / 'lines.json').exists() else {}
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1080, 'height': 1920})
    pg.add_init_script(f'window.PARAMS = {json.dumps(params)};')
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto((D / 'film.html').as_uri()); info = pg.evaluate('window.ready')
    if errs: sys.exit(f'page errors: {errs}')
    print(json.dumps(info)[:400]); canvas = pg.locator('#c')
    if stills:
        for t in only:
            pg.evaluate(f'render({t})'); canvas.screenshot(path=str(D / f'still_{t}.png'))
        if errs: sys.exit(f'page errors: {errs}')
        sys.exit()
    n = math.ceil(info['total'] * FPS - 1e-9)   # ceil, not floor: a short video + -shortest drops the soundtrack's last packet
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'mjpeg', '-i', '-',
                           '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', str(D / 'video.mp4')], stdin=subprocess.PIPE)
    for k in range(n):
        pg.evaluate(f'render({k / FPS})'); ff.stdin.write(canvas.screenshot(type='jpeg', quality=95, timeout=180000))
    ff.stdin.close(); ff.wait(); b.close()
    if errs: sys.exit(f'page errors: {errs}')
json.dump(info, open(D / 'timing.json', 'w'))
out.parent.mkdir(parents=True, exist_ok=True)
if (D / 'soundtrack.m4a').exists():
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(D / 'video.mp4'), '-i', str(D / 'soundtrack.m4a'), '-map', '0:v', '-map', '1:a',
                    '-c:v', 'copy', '-c:a', 'copy', '-movflags', '+faststart', str(out)], check=True)
else:
    subprocess.run([sys.executable, str(HERE / 'sound.py'), str(D)], check=True)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(D / 'video.mp4'), '-i', str(D / 'mix.wav'), '-c:v', 'copy',
                    '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', str(out)], check=True)
print(out, info['total'])
