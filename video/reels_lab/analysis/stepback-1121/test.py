import json, datetime as dt, random, math, statistics as st
T=json.load(open('analysis/stepback-1121/table.json'))
T=[(dt.datetime.fromisoformat(p),n,a,b) for p,n,a,b in T]
# population: healthy-page fresh films from 10-12, excluding throttle 10-23..10-25 and reposts; lone deaths (72h<20) kept as 0-ish but flagged
rep={'wychelm','isdal','circleville','wowsignal','beaumont'}
pop=[x for x in T if x[1] not in rep and not (dt.datetime(2026,10,23)<=x[0].replace(tzinfo=None)<dt.datetime(2026,10,26))]
def rank(v):
    s=sorted(range(len(v)),key=lambda i:v[i]); r=[0]*len(v)
    for k,i in enumerate(s): r[i]=k
    return r
def spear(x,y):
    rx,ry=rank(x),rank(y); mx,my=st.mean(rx),st.mean(ry)
    num=sum((a-mx)*(b-my) for a,b in zip(rx,ry)); den=math.sqrt(sum((a-mx)**2 for a in rx)*sum((b-my)**2 for b in ry))
    return num/den
for label,P in [('ALL healthy 10-12..11-19',pop),('since 11-01',[x for x in pop if x[0].month==11])]:
    live=[x for x in P if x[3]>=20]   # drop lone deaths
    v=[math.log(x[3]) for x in live]
    print(f"\n== {label}: n={len(live)} (lone deaths dropped: {len(P)-len(live)})")
    for lag in (1,2,3,4,6,8):
        r=spear(v[:-lag],v[lag:])
        # permutation null
        null=[]
        for _ in range(4000):
            w=v[:]; random.shuffle(w); null.append(spear(w[:-lag],w[lag:]))
        p=sum(1 for z in null if z>=r)/len(null)
        print(f"  lag {lag}: rho {r:+.2f}  perm p(one-sided) {p:.3f}")
    # same-day pairs (01:42 + 15:42 same UTC date)
    by={}
    for x in live: by.setdefault(x[0].date(),[]).append(x)
    pairs=[sorted(v_,key=lambda z:z[0]) for v_ in by.values() if len(v_)==2]
    a=[math.log(p[0][3]) for p in pairs]; b=[math.log(p[1][3]) for p in pairs]
    r=spear(a,b); hits=[(p[0][3]>=425,p[1][3]>=425) for p in pairs]
    both=sum(1 for h in hits if all(h)); one=sum(1 for h in hits if sum(h)==1); none=sum(1 for h in hits if not any(h))
    rate=sum(sum(h) for h in hits)/(2*len(hits)); exp_both=len(hits)*rate*rate
    null=[]
    allv=a+b
    for _ in range(4000):
        w=allv[:]; random.shuffle(w); null.append(spear(w[:len(a)],w[len(a):]))
    p=sum(1 for z in null if z>=r)/len(null)
    print(f"  same-day pairs n={len(pairs)}: rho {r:+.2f} perm p {p:.3f} | hits both {both} one {one} none {none}; expected both under independence {exp_both:.1f}")
