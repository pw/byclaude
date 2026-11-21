# Does the PREVIOUS film's quality (avg watch s, retention) predict the NEXT film's first pool? (page-score carryover)
import json, datetime as dt, math, random, statistics as st
exec(open('analysis/stepback-1121/test.py').read().split('def rank')[0])  # loads T, pop
rows=[json.loads(l) for l in open('snaps.jsonl')]
w={}
import os
MODE=os.environ.get('WMODE','first')
for r in rows:
    if r.get("page")=="unsolved" and r.get("watch_s") is not None and r.get("len_s"):
        if MODE=='first' and r['age_h']>6.5: 
            if r['name'] in w: continue
        if MODE=='72' and r['age_h']>72 and r['name'] in w: continue
        w[r['name']]=(r['watch_s'],r['len_s'])
from itertools import pairwise
def rank(v):
    s=sorted(range(len(v)),key=lambda i:v[i]); r=[0]*len(v)
    for k,i in enumerate(s): r[i]=k
    return r
def spear(x,y):
    rx,ry=rank(x),rank(y); mx,my=st.mean(rx),st.mean(ry)
    return sum((a-mx)*(b-my) for a,b in zip(rx,ry))/math.sqrt(sum((a-mx)**2 for a in rx)*sum((b-my)**2 for b in ry))
for label,P in [('all healthy',pop),('since 11-01',[x for x in pop if x[0].month==11])]:
    P=[x for x in P if x[1] in w]
    prev_w=[];prev_r=[];nxt=[];nxt4=[];own=[]
    for a,b in pairwise(P):
        if a[3]<20 or b[3]<20: continue
        prev_w.append(w[a[1]][0]); prev_r.append(w[a[1]][0]/w[a[1]][1]); nxt.append(b[3]); nxt4.append(b[2]); own.append(w[b[1]][0])
    def perm(x,y):
        r=spear(x,y); c=0
        for _ in range(4000):
            z=y[:]; random.shuffle(z); c+= spear(x,z)>=r
        return r,c/4000
    print(label,'n',len(nxt))
    print('  prev watch_s -> next 72h   rho %+.2f p %.3f'%perm(prev_w,nxt))
    print('  prev retention -> next 72h rho %+.2f p %.3f'%perm(prev_r,nxt))
    print('  prev watch_s -> next first read rho %+.2f p %.3f'%perm(prev_w,nxt4))
    print('  own watch_s -> own 72h     rho %+.2f p %.3f'%perm(own,nxt))

print("\n-- direction test: carryover (forward > backward) vs common regime (symmetric)")
for label,P in [('all healthy',pop),('since 11-01',[x for x in pop if x[0].month==11])]:
    P=[x for x in P if x[1] in w]
    for lag in (1,2,3):
        fw_x=[];fw_y=[];bw_x=[];bw_y=[]
        for i in range(len(P)-lag):
            a,b=P[i],P[i+lag]
            if a[3]<20 or b[3]<20: continue
            fw_x.append(w[a[1]][0]); fw_y.append(math.log(b[3]))
            bw_x.append(w[b[1]][0]); bw_y.append(math.log(a[3]))
        print(f"  {label} lag{lag}: forward prev-watch->next-plays {spear(fw_x,fw_y):+.2f} | backward next-watch->prev-plays {spear(bw_x,bw_y):+.2f}  n={len(fw_x)}")
