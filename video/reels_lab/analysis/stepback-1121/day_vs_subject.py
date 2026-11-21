# Step-back 2026-11-21: is the first pool set by the DAY (page state) or the FILM?
import json, datetime as dt, statistics as st, random, math
rows=[json.loads(l) for l in open('snaps.jsonl')]
rows=[r for r in rows if r.get('page')=='unsolved' and r.get('kind')!='photo' and 'age_h' in r]
arms=json.load(open('arms.json'))
films={}
for r in rows:
    f=films.setdefault(r['name'],{'snaps':[]})
    t=dt.datetime.fromisoformat(r['t'])
    f['snaps'].append((r['age_h'],r['plays']))
    f['post']=t-dt.timedelta(hours=r['age_h'])
tags={}
for k,v in (arms.get('videos') or arms.get('films') or {}).items() if isinstance(arms,dict) else []:
    tags[k]=v
def at(f,h):
    s=sorted(f['snaps']); c=[p for a,p in s if a<=h]
    return c[-1] if c else None
out=[]
for n,f in films.items():
    t=tags.get(n,{})
    if t.get('excluded') or t.get('origin')=='repost': continue
    p4=at(f,6.5); p72=at(f,72) if max(a for a,_ in f['snaps'])>=24 else None
    if p4 is None or p72 is None: continue
    out.append((f['post'],n,p4,p72))
out.sort()
print("n films",len(out), "| tags found", len(tags))
for p,n,a,b in out: print(p.strftime('%m-%d %H:%M'),f"{n:18s} 4-6h {a:5d}  72h {b:5d}")
json.dump([(p.isoformat(),n,a,b) for p,n,a,b in out],open('analysis/stepback-1121/table.json','w'),indent=0)
