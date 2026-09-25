#!/usr/bin/env python3
"""film.html → frames (deterministic t) → video.mp4 ; `render.py still t1 t2 ...` for stills."""
import json, subprocess, sys, pathlib
from playwright.sync_api import sync_playwright
D = pathlib.Path(__file__).parent.resolve(); FPS = 30
T = json.load(open(D/'timing.json')); params = {'timing': T, 'flood': json.load(open(D/'data/flood.json')), 'names': json.load(open(D/'data/names.json'))}
args = sys.argv[1:]
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1920, 'height': 1080})
    pg.add_init_script(f'window.PARAMS = {json.dumps(params)};')
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto((D/'film.html').as_uri()); info = pg.evaluate('window.ready')
    if errs: sys.exit(f'page errors: {errs}')
    cv = pg.locator('#c')
    if args and args[0] == 'still':
        (D/'stills').mkdir(exist_ok=True)
        for t in args[1:]:
            pg.evaluate(f'render({t})'); cv.screenshot(path=str(D/'stills'/f'{float(t):07.2f}.png'))
        if errs: sys.exit(f'page errors: {errs}')
        sys.exit()
    a, z = (float(args[0]), float(args[1])) if len(args) == 2 else (0, T['total'])
    out = D/('video.mp4' if not args else f'part_{a:.0f}.mp4')
    ff = subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate',str(FPS),'-c:v','mjpeg','-i','-',
        '-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',str(out)], stdin=subprocess.PIPE)
    for k in range(int(a*FPS), int(z*FPS)):
        pg.evaluate(f'render({k/FPS})'); ff.stdin.write(cv.screenshot(type='jpeg', quality=93))
    ff.stdin.close(); ff.wait(); b.close()
    if errs: sys.exit(f'page errors: {errs}')
    print(out)
