import json,base64,urllib.request,os,re,concurrent.futures as cf,pathlib
K=os.environ['OPENROUTER_API_KEY']; S=json.load(open('script.json'))['scenes']
def tr(p):
    b=base64.b64encode(open(p,'rb').read()).decode()
    pl={"model":"google/gemini-3.5-flash-lite","messages":[{"role":"user","content":[{"type":"input_audio","input_audio":{"data":b,"format":"mp3"}},{"type":"text","text":"Transcribe this narration audio verbatim. Output only the transcription."}]}]}
    r=urllib.request.Request('https://openrouter.ai/api/v1/chat/completions',data=json.dumps(pl).encode(),headers={'Authorization':'Bearer '+K,'Content-Type':'application/json','User-Agent':'curl/8.5.0'})
    return json.loads(urllib.request.urlopen(r,timeout=90).read())['choices'][0]['message']['content']
n=lambda s:re.sub(r'\s+',' ',re.sub(r'[^a-z0-9 ]',' ',s.lower())).strip()
jobs=[(f"vo/{s['id']}_{i}.mp3",l) for s in S for i,l in enumerate(s['lines'])]
with cf.ThreadPoolExecutor(8) as ex: outs=list(ex.map(lambda j:tr(j[0]),jobs))
bad=0
for (p,l),o in zip(jobs,outs):
    e=[w for w in n(l).split() if len(w)>2]; a=set(n(o).split())
    miss=[w for w in e if w not in a]; ov=1-len(miss)/max(1,len(e))
    last_ok = e[-1] in a
    if miss or not last_ok:
        print(f"{p} ov={ov:.0%} last={'ok' if last_ok else 'MISSING'} miss={miss}\n   T: {o.strip()[:300]}"); bad+=1
print('lines with any diff:',bad,'/',len(jobs))
