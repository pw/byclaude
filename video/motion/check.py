#!/usr/bin/env python3
"""Final gate for a byclaude motion-design film.

Usage: check.py <dir> <out.mp4> --inbox
       check.py <dir> <out.mp4> --twin <original.mp4> --sources <EXCERPTS.md> [--sources more.json ...]

All modes:
  1. <out.mp4> is 1080x1920 with an audio stream.
  2. film.html declares every on-screen string in ONE array literal `const ON_SCREEN = [...]` (JSON-parsable,
     double-quoted). This is the reviewable copy of the film; draw text only from it.
  3. GLYPHS: no character in film.html outside Latin + general punctuation (emoji / symbol glyphs render as
     boxes in headless Chrome with our fonts — draw icons as canvas paths).
  4. BRANDS: no real platform/brand name anywhere in film.html (list below).
--inbox:  duration 15–60 s; ON_SCREEN must contain the composite disclosure ("composite").
--exam:  (practice-question films) duration 15–75 s; ON_SCREEN contains "Unofficial"; <dir>/KEY.json =
          {question, options[4], answer} with every string verbatim in ON_SCREEN; SOURCES.md number rule as --explainer.
--explainer:  duration 15–75 s; ON_SCREEN must contain "not tax advice"; <dir>/SOURCES.md must exist and every
          NUMBER in ON_SCREEN (digits, commas/$/% stripped) must appear in it — worked-example figures included, with
          their arithmetic written out there. (Numbers are where explainers go wrong; this makes each one traceable.)
--twin:   duration within 0.6 s of the original; the AUDIO STREAM is bit-identical to the original's
          (md5 of the copied stream) so the A/B differs only in picture; every NUMBER in ON_SCREEN
          (digits, commas stripped) appears in one of the --sources files.
Exit 0 pass · 1 fail · 2 cannot run.
"""
import json, re, subprocess, sys, pathlib
BRANDS = ['instagram', 'facebook', 'google', 'venmo', 'zelle', 'cash app', 'cashapp', 'paypal', 'square', 'stripe', 'imessage',
          'whatsapp', 'gmail', 'outlook', 'yelp', 'vagaro', 'booksy', 'glossgenius', 'fresha', 'acuity', 'calendly', 'etsy',
          'amazon', 'tiktok', 'apple', 'iphone', 'android', 'samsung', 'nextdoor', 'thumbtack', 'angi', 'houzz', 'quickbooks',
          'shopify', 'doordash', 'uber', 'airbnb', 'canva', 'messenger', 'snapchat', 'linkedin', 'twitter', 'wells fargo', 'chase']
def die(msg, code=1): print(msg); sys.exit(code)
a = sys.argv[1:]
if len(a) < 3: die(__doc__, 2)
D, out = pathlib.Path(a[0]), pathlib.Path(a[1]); mode = a[2]
if not (D / 'film.html').exists() or not out.exists(): die(f'check: CANNOT RUN — missing film.html or {out}', 2)
html = (D / 'film.html').read_text(); fails = []
def probe(p, *extra):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_type,width,height:format=duration', '-of', 'json', str(p)], capture_output=True, text=True)
    return json.loads(r.stdout)
info = probe(out); dur = float(info['format']['duration'])
v = [s for s in info['streams'] if s['codec_type'] == 'video']; au = [s for s in info['streams'] if s['codec_type'] == 'audio']
if not v or (v[0]['width'], v[0]['height']) != (1080, 1920): fails.append('video is not 1080x1920')
if not au: fails.append('no audio stream')
m = re.search(r'const ON_SCREEN\s*=\s*(\[.*?\]);', html, re.S)
on = []
if not m: fails.append('film.html has no `const ON_SCREEN = [...]` array')
else:
    try: on = json.loads(m.group(1))
    except Exception as e: fails.append(f'ON_SCREEN is not JSON-parsable: {e}')
bad = sorted({c for c in html if ord(c) > 0x24F and not (0x2010 <= ord(c) <= 0x2027) and c not in ' ′″'})
if bad: fails.append(f'glyphs outside Latin/punctuation in film.html: {bad!r}')
low = html.lower()
hits = [b for b in BRANDS if re.search(r'(?<![a-z])' + re.escape(b) + r'(?![a-z])', low)]
if hits: fails.append(f'brand names in film.html: {hits}')
if mode == '--inbox':
    if not 15 <= dur <= 60: fails.append(f'duration {dur:.1f}s outside 15–60')
    if not any('composite' in s.lower() for s in on): fails.append('no composite disclosure in ON_SCREEN')
elif mode == '--explainer':
    if not 15 <= dur <= 75: fails.append(f'duration {dur:.1f}s outside 15–75')
    if not any('not tax advice' in s.lower() for s in on): fails.append('no "not tax advice" line in ON_SCREEN')
    sp = D / 'SOURCES.md'
    if not sp.exists(): fails.append('no SOURCES.md')
    else:
        corpus = sp.read_text().replace(',', '')
        for s in on:
            for num in re.findall(r'\d[\d,.]*\d|\d', s):
                if num.replace(',', '').rstrip('.') not in corpus: fails.append(f'number {num!r} in ON_SCREEN {s!r} is not in SOURCES.md')
elif mode == '--exam':
    if not 15 <= dur <= 75: fails.append(f'duration {dur:.1f}s outside 15–75')
    if not any('unofficial' in s.lower() for s in on): fails.append('no "Unofficial" disclosure in ON_SCREEN')
    kp = D / 'KEY.json'
    if not kp.exists(): fails.append('no KEY.json')
    else:
        k = json.loads(kp.read_text()); opts = k.get('options', [])
        if len(opts) != 4 or k.get('answer') not in 'ABCD' or len(k.get('answer', '')) != 1: fails.append('KEY.json needs 4 options + one answer letter A-D')
        for s in [k.get('question', '')] + opts:
            if s not in on: fails.append(f'KEY string not drawn verbatim from ON_SCREEN: {s[:60]!r}')
    sp = D / 'SOURCES.md'
    if not sp.exists(): fails.append('no SOURCES.md')
    else:
        corpus = sp.read_text().replace(',', '')
        for s in on:
            for num in re.findall(r'\d[\d,.]*\d|\d', s):
                if num.replace(',', '').rstrip('.') not in corpus: fails.append(f'number {num!r} in ON_SCREEN {s!r} is not in SOURCES.md')
elif mode == '--twin':
    orig = pathlib.Path(a[3]); srcs = [pathlib.Path(x) for i, x in enumerate(a) if i > 0 and a[i - 1] == '--sources']
    if not orig.exists() or not srcs: die('check: CANNOT RUN — --twin needs the original and at least one --sources', 2)
    od = float(probe(orig)['format']['duration'])
    if abs(od - dur) > 0.6: fails.append(f'duration {dur:.2f}s vs original {od:.2f}s')
    md5 = lambda p: subprocess.run(['ffmpeg', '-v', 'error', '-i', str(p), '-map', '0:a', '-c', 'copy', '-f', 'md5', '-'], capture_output=True, text=True).stdout.strip()
    m1, m2 = md5(out), md5(orig)
    if not m1 or m1 != m2: fails.append(f'audio stream differs from original ({m1} vs {m2})')
    corpus = ' '.join(p.read_text() for p in srcs).replace(',', '')
    for s in on:
        for num in re.findall(r'\d[\d,]*', s):
            if num.replace(',', '') not in corpus: fails.append(f'number {num!r} in ON_SCREEN {s!r} is in no source')
else: die(f'unknown mode {mode}', 2)
print(f'{out.name}: {dur:.1f}s, {len(on)} on-screen strings')
for s in on: print('   |', s)
if fails: die('FAIL\n  - ' + '\n  - '.join(fails))
print('PASS')
