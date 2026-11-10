#!/usr/bin/env python3
"""Parallel, resumable twin of motion/render.py for this film (same page contract, same JPEG capture, same x264 settings).

Why: the hero scene is a WebGL shader and this box has no GPU, so software GL makes those frames slow.
N browser workers each take every Nth frame and write it to a frame cache; frames already in the cache are skipped,
so a fix to one scene only re-renders that scene (delete its frames with --drop A B, in seconds).

Usage: render_par.py <dir> <out.mp4> [--workers 6] [--cache /tmp/fable_frames] [--drop T0 T1 ...]
       render_par.py <dir> --worker I N CACHE      (internal)
"""
import json, math, subprocess, sys, pathlib
FPS = 30
D = pathlib.Path(sys.argv[1]).resolve()


def worker(i, n, cache):
    from playwright.sync_api import sync_playwright
    params = json.load(open(D / 'lines.json'))
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1080, 'height': 1920})
        pg.add_init_script(f'window.PARAMS = {json.dumps(params)};')
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto((D / 'film.html').as_uri()); info = pg.evaluate('window.ready')
        if errs: sys.exit(f'page errors: {errs}')
        total = math.ceil(info['total'] * FPS - 1e-9); canvas = pg.locator('#c')
        for k in range(i, total, n):
            f = cache / f'{k:05d}.jpg'
            if f.exists(): continue
            pg.evaluate(f'render({k / FPS})')
            tmp = cache / f'.{k:05d}.part'
            tmp.write_bytes(canvas.screenshot(type='jpeg', quality=95, timeout=180000)); tmp.rename(f)
        b.close()
        if errs: sys.exit(f'page errors: {errs}')


if sys.argv[2] == '--worker':
    worker(int(sys.argv[3]), int(sys.argv[4]), pathlib.Path(sys.argv[5])); sys.exit()

out = pathlib.Path(sys.argv[2]).resolve(); a = sys.argv[3:]
N = int(a[a.index('--workers') + 1]) if '--workers' in a else 6
cache = pathlib.Path(a[a.index('--cache') + 1] if '--cache' in a else '/tmp/fable_frames'); cache.mkdir(parents=True, exist_ok=True)
if '--drop' in a:
    d = [float(x) for x in a[a.index('--drop') + 1:]]
    for t0, t1 in zip(d[::2], d[1::2]):
        for k in range(math.floor(t0 * FPS), math.ceil(t1 * FPS) + 1):
            (cache / f'{k:05d}.jpg').unlink(missing_ok=True)
info = json.load(open(D / 'timing.json')); total = math.ceil(info['total'] * FPS - 1e-9)
ps = [subprocess.Popen([sys.executable, __file__, str(D), '--worker', str(i), str(N), str(cache)]) for i in range(N)]
bad = [p.wait() for p in ps]
if any(bad): sys.exit(f'worker failed: {bad}')
missing = [k for k in range(total) if not (cache / f'{k:05d}.jpg').exists()]
if missing: sys.exit(f'missing frames: {missing[:10]} ({len(missing)})')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-start_number', '0', '-i', str(cache / '%05d.jpg'), '-frames:v', str(total),
                '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', str(D / 'video.mp4')], check=True)
out.parent.mkdir(parents=True, exist_ok=True)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(D / 'video.mp4'), '-i', str(D / 'soundtrack.m4a'), '-map', '0:v', '-map', '1:a',
                '-c:v', 'copy', '-c:a', 'copy', '-movflags', '+faststart', str(out)], check=True)
print(out, info['total'], 'frames', total)
