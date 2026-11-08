#!/usr/bin/env python3
"""get_cues.py <cut_dir> — evaluate film.html's window.ready with that cut's lines.json and write <cut_dir>/timing.json."""
import json, sys, pathlib
from playwright.sync_api import sync_playwright
D = pathlib.Path(sys.argv[1]).resolve(); params = json.load(open(D / 'lines.json'))
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1080, 'height': 1920})
    pg.add_init_script(f'window.PARAMS = {json.dumps(params)};'); pg.goto((D / 'film.html').as_uri())
    info = pg.evaluate('window.ready'); b.close()
json.dump(info, open(D / 'timing.json', 'w'), indent=1); print(len(info['cues']), 'cues', info['total'])
