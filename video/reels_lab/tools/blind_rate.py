"""Blind pre-posting reach rater (reels-owner step-back 2026-11-14).
Raters see title/subtitle/VO/caption only, shuffled, anonymous ids. Writes ratings_<model>_<seed>.json."""
import json, random, sys, os, re, urllib.request
films = [f for f in json.load(open(sys.argv[1])) if f['slug'] not in set(sys.argv[4].split(',') if len(sys.argv)>4 else [])]
model, seed = sys.argv[2], int(sys.argv[3])
rng = random.Random(seed); order = films[:]; rng.shuffle(order)
ids = {f['slug']: f'F{i+1:02d}' for i, f in enumerate(order)}
blocks = []
for f in order:
    blocks.append(f"[{ids[f['slug']]}]\nTITLE: {f['title']}\nSUBTITLE: {f['subtitle']}\nVOICE-OVER: {f['vo']}\nPOST CAPTION: {(f.get('caption') or '')[:600]}")
SYS = ("You are predicting how far short videos will travel on Facebook Reels. Each is a ~35-second film of eerie still "
       "images with a calm narrator, about a historical mystery, posted by a small Page to mostly COLD audiences "
       "(strangers scrolling, adults in the US/UK/Australia). Facebook shows each reel to a small test audience first and "
       "expands it if people stop, watch to the end and rewatch. Your job: for EVERY film, predict its reach relative to "
       "the others. Use the full 1-100 scale (spread your scores; the set has a few films that did several times better "
       "than the typical one). Judge the subject's pull on a stranger in the first seconds and whether the story pays off, "
       "not the writing quality alone.")
USER = ("Here are " + str(len(order)) + " films.\n\n" + "\n\n".join(blocks) +
        "\n\nReturn ONLY JSON: {\"scores\": {\"F01\": <1-100>, ...every id...}, \"why_top\": \"one sentence on what your top films share\"}")
def call():
    if model.startswith('claude'):
        kf = os.path.join(os.path.dirname(sys.argv[1]), '.antkey')
        key = open(kf).read().strip() if os.path.exists(kf) else __import__('subprocess').check_output(
            ['op', 'read', 'op://Claude Code/Claude Code WIP Ant Key/credential'], text=True).strip()
        body = {"model": model, "max_tokens": 4000, "system": SYS, "messages": [{"role": "user", "content": USER}]}
        req = urllib.request.Request("https://api.anthropic.com/v1/messages", json.dumps(body).encode(),
              {"x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json", "User-Agent": "curl/8.5.0"})
        r = json.load(urllib.request.urlopen(req, timeout=600))
        return next(b['text'] for b in r['content'] if b['type'] == 'text')
    key = os.environ['OPENROUTER_API_KEY']
    body = {"model": model, "max_tokens": 16000, "messages": [{"role": "system", "content": SYS}, {"role": "user", "content": USER}]}
    req = urllib.request.Request("https://openrouter.ai/api/v1/chat/completions", json.dumps(body).encode(),
          {"Authorization": "Bearer " + key, "content-type": "application/json", "User-Agent": "curl/8.5.0"})
    r = json.load(urllib.request.urlopen(req, timeout=600))
    return r['choices'][0]['message']['content']
txt = call()
j = json.loads(re.search(r'\{.*\}', txt, re.S).group(0))
inv = {v: k for k, v in ids.items()}
scores = {inv[k]: v for k, v in j['scores'].items() if k in inv}
missing = [s for s in ids if s not in scores]
out = {"model": model, "seed": seed, "scores": scores, "why_top": j.get('why_top'), "missing": missing}
json.dump(out, open(os.path.join(os.path.dirname(sys.argv[1]), f"ratings_{model.replace('/','_')}_{seed}.json"), 'w'), indent=1)
print(model, seed, len(scores), 'missing', missing, '|', j.get('why_top'))
