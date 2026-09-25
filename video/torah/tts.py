#!/usr/bin/env python3
"""Per-line Grok TTS (Atlas via OpenRouter) → vo/<scene>_<i>.mp3, then timing.json from real durations."""
import json, os, subprocess, pathlib, urllib.request, concurrent.futures as cf
HERE = pathlib.Path(__file__).parent; VO = HERE / 'vo'; VO.mkdir(exist_ok=True)
KEY = os.environ['OPENROUTER_API_KEY']; VOICE = os.environ.get('VOICE', 'Atlas')
S = json.load(open(HERE / 'script.json'))['scenes']

def tts(path, text):
    if path.exists() and path.with_suffix('.txt').exists() and path.with_suffix('.txt').read_text() == text: return
    req = urllib.request.Request('https://openrouter.ai/api/v1/audio/speech', method='POST',
        headers={'Authorization': f'Bearer {KEY}', 'Content-Type': 'application/json', 'User-Agent': 'curl/8.5.0'},
        data=json.dumps({'model': 'x-ai/grok-voice-tts-1.0', 'voice': VOICE, 'input': text, 'response_format': 'mp3'}).encode())
    for attempt in range(3):
        try:
            b = urllib.request.urlopen(req, timeout=120).read()
            if len(b) > 5000: path.write_bytes(b); path.with_suffix('.txt').write_text(text); return
        except Exception as e: print('retry', path.name, e)
    raise SystemExit(f'TTS failed {path}')

def dur(p): return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(p)], capture_output=True, text=True).stdout)

jobs = [(VO / f"{sc['id']}_{i}.mp3", ln) for sc in S for i, ln in enumerate(sc['lines'])]
with cf.ThreadPoolExecutor(6) as ex: list(ex.map(lambda j: tts(*j), jobs))

LINE_GAP, SCENE_GAP = 0.55, 1.4
t = 1.2; lines = {}; scenes = {}; vo = []
order = [sc['id'] for sc in S]
for sc in S:
    if sc['id'] == 'tradition':  # title card sits between the cold open and the tradition scene
        scenes['title'] = {'a': t - 0.6, 'b': t + 5.2}; t += 5.0
    lines[sc['id']] = []; first = t
    for i, _ in enumerate(sc['lines']):
        p = VO / f"{sc['id']}_{i}.mp3"; d = dur(p)
        lines[sc['id']].append({'s': round(t, 3), 'd': round(d, 3)}); vo.append({'file': p.name, 'at': round(t, 3)})
        t += d + LINE_GAP
    t += SCENE_GAP - LINE_GAP
    scenes[sc['id']] = {'a': first - 0.8, 'b': None}
ids = [k for k in order]
for k, nxt in zip(ids, ids[1:]):
    nx = 'title' if nxt == 'tradition' and k == 'open' else nxt
    scenes[k]['b'] = scenes[nx]['a'] + 0.8
scenes['close']['b'] = t + 0.8
scenes['end'] = {'a': t, 'b': t + 7.5}
total = round(t + 7.5, 2)
json.dump({'lines': lines, 'scenes': scenes, 'vo': vo, 'total': total}, open(HERE / 'timing.json', 'w'), indent=1)
print('total', total, 'lines', len(vo))
