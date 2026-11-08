#!/usr/bin/env python3
"""tts.py <voice_key> <script.json> <outdir> [ids...] — one Gemini 3.8 Flash TTS request per narration line
(single designed voice per request = no bleed). Writes <outdir>/<id>.wav (24 kHz mono) + <outdir>/durations.json."""
import os, sys, json, base64, urllib.request, io, wave, time, concurrent.futures as cf
K = os.environ["GEMINI_API_KEY"]; HERE = os.path.dirname(os.path.abspath(__file__))
V = json.load(open(os.path.join(HERE, 'voices.json')))
key, script, out = sys.argv[1], sys.argv[2], sys.argv[3]; only = set(sys.argv[4:])
voice = V.get(key, key)  # a prebuilt name (e.g. Leda) also works
lines = [l for l in json.load(open(script))['lines'] if not only or l['id'] in only]
os.makedirs(out, exist_ok=True)
URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent"
STYLE = os.environ.get('STYLE', '')
def one(l):
    part = {"text": l['text']}
    if STYLE or l.get('style'): part['speechMetadata'] = {"style": l.get('style') or STYLE}
    body = {"contents": [{"role": "user", "parts": [part]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"voice": voice}}}}
    for i in range(8):
        req = urllib.request.Request(URL, data=json.dumps(body).encode(), headers={"x-goog-api-key": K, "Content-Type": "application/json", "User-Agent": "curl/8.5.0"})
        try:
            r = json.loads(urllib.request.urlopen(req, timeout=300).read())
            b = b''.join(base64.b64decode(p['inlineData']['data']) for p in r['candidates'][0]['content']['parts'] if 'inlineData' in p)
            try:
                w = wave.open(io.BytesIO(b)); pcm = w.readframes(w.getnframes()); sr = w.getframerate()
            except wave.Error:
                pcm, sr = b, 24000   # raw L16
            with wave.open(os.path.join(out, l['id'] + '.wav'), 'wb') as o:
                o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr); o.writeframes(pcm)
            return l['id'], round(len(pcm) / 2 / sr, 3)
        except urllib.error.HTTPError as e:
            print('HTTP', e.code, e.read()[:200].decode(), flush=True); time.sleep(6 * (i + 1))
        except Exception as e:
            print('ERR', l['id'], e, flush=True); time.sleep(6 * (i + 1))
    raise RuntimeError('gave up ' + l['id'])
with cf.ThreadPoolExecutor(6) as ex: res = dict(ex.map(one, lines))
dp = os.path.join(out, 'durations.json'); d = json.load(open(dp)) if os.path.exists(dp) else {}
d.update(res); json.dump(d, open(dp, 'w'), indent=1); print(json.dumps(res))
