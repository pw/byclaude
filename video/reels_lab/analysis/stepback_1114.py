"""Step-back 2026-11-14: can a subject's strength be read BEFORE posting?
Pre-post features only: class, event year, Wikipedia fame, telling number, slot, period.
Outcome: plays at 24h (every film has it) and at 72h. Period control = ratio to the median
of the other films posted within +-4 days."""
import json, re, sys, statistics as st, subprocess, urllib.parse, os, datetime as dt
H = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
arms = json.load(open(f"{H}/arms.json"))["unsolved"]
posted = json.load(open(f"{H}/fb_posted_unsolved.json"))
# subject -> (wiki article, class, event year)
S = {
 "valentich": ("Disappearance_of_Frederick_Valentich","plane",1978), "vela": ("Vela_incident","signal",1979),
 "watcher": ("The_Watcher_(letters)","modern-person",2014), "sodder": ("Sodder_children_disappearance","modern-person",1945),
 "springfieldthree": ("Springfield_Three","modern-person",1992), "maryceleste": ("Mary_Celeste","ship",1872),
 "roanoke": ("Roanoke_Colony","old-person",1590), "maxheadroom": ("Max_Headroom_signal_hijacking","signal",1987),
 "brianshaffer": ("Disappearance_of_Brian_Shaffer","modern-person",2006), "hessdalen": ("Hessdalen_lights","signal",1981),
 "jamison": ("Jamison_family_deaths","modern-person",2009), "taoshum": ("The_Hum","signal",1993),
 "voynich": ("Voynich_manuscript","cipher",1912), "dorothyarnold": ("Disappearance_of_Dorothy_Arnold","old-person",1910),
 "dbcooper": ("D._B._Cooper","modern-person",1971), "flannanisles": ("Flannan_Isles_Lighthouse","ship",1900),
 "zodiac": ("Zodiac_Killer","modern-person",1969), "blackdahlia": ("Black_Dahlia","modern-person",1947),
 "shugborough": ("Shugborough_inscription","cipher",1750), "whale52": ("52-hertz_whale","signal",1989),
 "beale": ("Beale_ciphers","cipher",1885), "copperscroll": ("Copper_Scroll","cipher",1952),
 "cyclops": ("USS_Cyclops_(AC-4)","ship",1918), "deering": ("Carroll_A._Deering","ship",1921),
 "dorabella": ("Dorabella_Cipher","cipher",1897), "joyita": ("MV_Joyita","ship",1955),
 "dagapeyeff": ("D'Agapeyeff_cipher","cipher",1939), "lineara": ("Linear_A","cipher",1900),
 "rongorongo": ("Rongorongo","cipher",1864), "atalanta": ("HMS_Atalanta_(1844)","ship",1880),
 "singaporestone": ("Singapore_Stone","cipher",1819), "waratah": ("SS_Waratah","ship",1909),
 "stendec": ("1947_BSAA_Avro_Lancastrian_Star_Dust_accident","plane",1947), "indusscript": ("Indus_script","cipher",-2000),
 "kobenhavn": ("København_(ship)","ship",1928), "startiger": ("BSAA_Star_Tiger_disappearance","plane",1948),
 "griffon": ("Le_Griffon","ship",1679), "upsweep": ("Upsweep","signal",1991),
 "ninthlegion": ("Legio_IX_Hispana","old-person",108), "devilsprints": ("Devil's_Footprints","signal",1855),
 "starariel": ("BSAA_Star_Ariel_disappearance","plane",1949), "bathurst": ("Benjamin_Bathurst_(diplomat)","old-person",1809),
}
ALIAS = {"maryceleste2":"maryceleste","celestedoyle":"maryceleste","flannan2":"flannanisles","flannanlog":"flannanisles",
 "voynich2":"voynich","voynichvellum":"voynich","velaclues":"vela","velasat":"vela","rongowood":"rongorongo",
 "doraenigma":"dorabella","waratahsearch":"waratah","deeringbottle":"deering","roanokestone":"roanoke"}

def wiki(article, cache={}):
    cf = f"{H}/analysis/wiki_views_202609.json"
    if not cache and os.path.exists(cf): cache.update(json.load(open(cf)))
    if article in cache: return cache[article]
    u = ("https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/"
         + urllib.parse.quote(article, safe="") + "/monthly/2026090100/2026093000")
    r = subprocess.run(["curl","-s","-A","reels-lab/1.0 (me@byclaude.net)",u],capture_output=True,text=True).stdout
    try: v = json.loads(r)["items"][0]["views"]
    except Exception: v = None; print("WIKI CANNOT SEE", article, r[:120], file=sys.stderr)
    cache[article] = v; json.dump(cache, open(cf,"w"), indent=0); return v

snaps = {}
for l in open(f"{H}/snaps.jsonl"):
    r = json.loads(l)
    if r.get("page")=="unsolved" and r.get("kind")!="photo" and r.get("plays") is not None:
        snaps.setdefault(r["name"],[]).append((r["age_h"], r["plays"]))
def at(name, h):
    xs = sorted(snaps.get(name,[]))
    for a,p in xs:
        if a >= h: return p
    return None
def spearman(x,y):
    def rk(v):
        o = sorted(range(len(v)), key=lambda i:v[i]); r=[0]*len(v); i=0
        while i<len(o):
            j=i
            while j+1<len(o) and v[o[j+1]]==v[o[i]]: j+=1
            for k in range(i,j+1): r[o[k]]=(i+j)/2
            i=j+1
        return r
    a,b=rk(x),rk(y); ma,mb=st.mean(a),st.mean(b)
    num=sum((p-ma)*(q-mb) for p,q in zip(a,b)); den=(sum((p-ma)**2 for p in a)*sum((q-mb)**2 for q in b))**.5
    return num/den if den else float("nan")

rows=[]
for n,a in arms.items():
    if a.get("origin")!="fresh" or "excluded" in a or n not in posted: continue
    subj = ALIAS.get(n,n)
    if subj not in S: print("UNMAPPED", n, file=sys.stderr); continue
    t = dt.datetime.fromisoformat(posted[n]["fb_published_at"])
    p24, p72 = at(n,22), at(n,72)
    if p24 is None: continue
    art,cls,yr = S[subj]
    rows.append(dict(n=n,subj=subj,t=t,slot=t.hour,p24=p24,p72=p72,cls=cls,yr=yr,wiki=wiki(art),
                     first=(n==subj),frame=a.get("frame"),kind=a.get("kind")))
for r in rows:
    near=[o["p24"] for o in rows if o is not r and abs((o["t"]-r["t"]).total_seconds())<=4*86400]
    r["rel"]= r["p24"]/st.median(near) if near else None
rows.sort(key=lambda r:r["t"])
if "--table" in sys.argv:
    for r in rows: print(f"{r['n']:16s} {r['t']:%m-%d %H} p24 {r['p24']:5d} p72 {str(r['p72']):>5s} rel {r['rel']:.2f} {r['cls']:13s} {r['yr']:5d} wiki {r['wiki']} {'1st' if r['first'] else 'seq'}")
F=[r for r in rows if r["first"]]
print(f"\nfilms {len(rows)}, first tellings {len(F)}")
print("PERIOD (all films): median p24 by week")
for lo,hi in [("10-12","10-18"),("10-19","10-22"),("10-26","11-01"),("11-02","11-08"),("11-09","11-14")]:
    xs=[r["p24"] for r in rows if lo<=f"{r['t']:%m-%d}"<=hi]
    if xs: print(f"  {lo}..{hi} n={len(xs)} median {st.median(xs)} max {max(xs)}")
for label,key in [("raw p24","p24"),("period-relative","rel")]:
    print(f"\nFIRST TELLINGS, outcome = {label}")
    W=[r for r in F if r["wiki"]]
    print(f"  Spearman wiki fame   : {spearman([r['wiki'] for r in W],[r[key] for r in W]):+.2f} (n={len(W)})")
    print(f"  Spearman event year  : {spearman([r['yr'] for r in F],[r[key] for r in F]):+.2f}")
    print(f"  Spearman post date   : {spearman([r['t'].timestamp() for r in F],[r[key] for r in F]):+.2f}")
    for c in sorted({r["cls"] for r in F}):
        xs=sorted(r[key] for r in F if r["cls"]==c)
        print(f"  class {c:13s} n={len(xs):2d} median {st.median(xs):7.2f}  top-third hits {sum(1 for r in F if r['cls']==c and r[key]>=sorted(q[key] for q in F)[-len(F)//3])}")
    for s in (1,15):
        xs=[r[key] for r in F if r["slot"]==s]; print(f"  slot {s:02d}Z n={len(xs)} median {st.median(xs):.2f}")
    for nm,f in [("pre-1950",lambda r:r["yr"]<1950),("1950+",lambda r:r["yr"]>=1950)]:
        xs=[r[key] for r in F if f(r)]; print(f"  {nm:9s} n={len(xs)} median {st.median(xs):.2f}")
print("\nTEST-RETEST (does a subject repeat?): first telling rel vs later tellings rel")
pairs=[]
for r in rows:
    if not r["first"]:
        f=[q for q in rows if q["n"]==r["subj"]]
        if f: pairs.append((f[0]["rel"],r["rel"],r["n"]))
for a,b,n in pairs: print(f"  {n:15s} first {a:.2f} -> {b:.2f}")
print(f"  Spearman {spearman([p[0] for p in pairs],[p[1] for p in pairs]):+.2f} n={len(pairs)}; sequel rel median {st.median([p[1] for p in pairs]):.2f} (1.00 = same as neighbours)")
