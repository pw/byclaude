import os,json,base64,urllib.request
K=os.environ["GEMINI_API_KEY"]
def api(method,path,body=None):
    req=urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/"+path,method=method,
        data=json.dumps(body).encode() if body else None,headers={"x-goog-api-key":K,"Content-Type":"application/json","User-Agent":"curl/8.5.0"})
    try: return json.loads(urllib.request.urlopen(req,timeout=180).read())
    except urllib.error.HTTPError as e: print(e.code,e.read()[:600].decode()); raise
V={
 'rosa':('female','en-US',"A woman in her early fifties, a warm and wry home cook who grew up in an Italian-American family on the East Coast; only a faint trace of that accent. Medium-low, slightly husky voice with a smile in it. Talks like she is showing a good friend a kitchen trick: relaxed, confident, conversational, quick dry humor, unhurried but never slow. Never a TV-host voice, never salesy."),
 'gus':('male','en-US',"A man in his mid-forties, a relaxed, wry home cook. Warm, low, slightly gravelly voice with an easy grin in it; plain-spoken American, no accent to speak of. Sounds like a friend cooking for you late at night and letting you in on his shortcuts: conversational, confident, dry understated humor, a little conspiratorial, never a shouty TV chef, never salesy."),
}
out={}
for k,(g,lang,desc) in V.items():
    r=api("POST","voices",{"store":True,"voice":{"model":"gemini-3.8-flash-tts","type":"prompted","display_name":f"Recipes {k}","gender":g,"language_code":lang,"prompted":{"input":desc}}})
    out[k]=r.get('id') or r.get('name'); print(k,{x:r[x] for x in r if x!='sample_audio'})
    if r.get('sample_audio',{}).get('data'): open(f'voice_{k}_preview.wav','wb').write(base64.b64decode(r['sample_audio']['data']))
json.dump(out,open('voices.json','w'),indent=1)
