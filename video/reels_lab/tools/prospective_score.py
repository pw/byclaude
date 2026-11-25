#!/usr/bin/env python3
"""Prospective blind score for unposted films (reels-owner 2026-11-15).
  prospective_score.py add <slug> [...]   append films (title/subtitle/vo/caption) to fwd/films.json
  prospective_score.py rate <seedA> <seedB>   run blind_rate.py (Opus 5.5 + GPT-5.5) on the whole set
  prospective_score.py z <seedA> <seedB> [slug ...]   mean per-run z within the non-modern-crime pool; print (+ record new slugs)
The pool = every film in fwd/films.json except the 10 modern-crime films (they are outside the class the rater works in)."""
import json, os, sys, subprocess, statistics as st
V = os.path.expanduser("~/byclaude/video"); FWD = f"{V}/reels_lab/analysis/stepback-1114/fwd"
CRIME = {"jamison","blackdahlia","springfieldthree","brianshaffer","zodiac","valentich","watcher","dorothyarnold","dbcooper","sodder"}
# GPT-5.5 seat OFF 2026-11-25 (OpenRouter near-empty, cash wall; rater retired as pick filter 11-22). Opus runs on the free API credit.
MODELS = ["claude-opus-5-5"] + (["openai/gpt-5.5"] if os.environ.get("RATER_GPT") == "1" else [])
def films(): return json.load(open(f"{FWD}/films.json"))
cmd = sys.argv[1]
if cmd == "add":
    fs = films(); have = {f["slug"] for f in fs}
    for s in sys.argv[2:]:
        if s in have: print("already in set:", s); continue
        sc = json.load(open(f"{V}/{s}/script.json")); su = json.load(open(f"{V}/shorts/su-{s}.json"))
        fs.append({"slug": s, "p72": None, "title": sc["title"], "subtitle": sc.get("subtitle", ""),
                   "vo": " ".join(b["vo"] for b in su["beats"]), "caption": open(f"{V}/{s}/caption.txt").read(),
                   "first": None, "now": None, "young": True})
        print("added", s)
    json.dump(fs, open(f"{FWD}/films.json", "w"), indent=1)
elif cmd == "rate":
    ps = [subprocess.Popen([sys.executable, os.path.join(os.path.dirname(__file__), "blind_rate.py"), f"{FWD}/films.json", m, seed],
                           stdout=open(f"{FWD}/log_{m.replace('/','_')}_{seed}.txt", "w"), stderr=subprocess.STDOUT)
          for m in MODELS for seed in sys.argv[2:4]]
    rc = [p.wait() for p in ps]; print("rate exit codes", rc); sys.exit(1 if any(rc) else 0)
elif cmd == "z":
    seeds = sys.argv[2:4]; new = sys.argv[4:]; pool = [f["slug"] for f in films() if f["slug"] not in CRIME]
    zs = {s: [] for s in pool}
    for m in MODELS:
        for seed in seeds:
            r = json.load(open(f"{FWD}/ratings_{m.replace('/','_')}_{seed}.json"))
            assert not r["missing"], (m, seed, r["missing"])
            x = [r["scores"][s] for s in pool]; mu, sd = st.mean(x), st.pstdev(x)
            for s in pool: zs[s].append((r["scores"][s] - mu) / sd)
    z = {s: round(st.mean(v), 2) for s, v in zs.items()}
    rank = sorted(pool, key=lambda s: -z[s])
    for s in (new or pool): print(f"{s:16s} z {z[s]:+.2f}  rank {rank.index(s)+1}/{len(pool)}")
    if new:
        P = json.load(open(f"{FWD}/prospective.json"))
        for s in new:
            assert s not in P["scores"], f"{s} already has a recorded prospective score"
            P["scores"][s] = z[s]
        P.setdefault("batches", []).append({"seeds": seeds, "films": new, "pool_n": len(pool)})
        json.dump(P, open(f"{FWD}/prospective.json", "w"), indent=1)
