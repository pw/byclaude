#!/usr/bin/env python3
"""reels_lab — the measurement half of the FB Reels hill-climb.

  snap                 append one snapshot of every reel on every PAGES entry to snaps.jsonl (cron, every 6h)
  report [--age H]     per-reel plays AT AGE H (default 72h; nearest snapshot at/after H, else 'young'),
                       avg watch, retention = watch/length, and the reel's arms (arms.json) — then per-arm medians.

Why plays-at-age: FB keeps distributing for days, so "lifetime plays" on a 9-day-old reel and a
2-day-old reel are not comparable. Every comparison here is at the same age.
Retention (avg watch / length) is the LEADING indicator: on By Claude every reel over 600 plays
had ≥8 s avg watch; the 200-ish floor is what FB gives anything.

Exit 2 = cannot see (no page token / zero reels read) — never a silent empty report.
"""
import json, os, sys, time, statistics, urllib.request, urllib.parse, datetime as dt

HERE = os.path.dirname(os.path.abspath(__file__))
SNAPS = os.path.join(HERE, "snaps.jsonl")
ARMS = os.path.join(HERE, "arms.json")          # {page: {name: {arm_key: value}}}
PAGES = {"byclaude": "1135418966317046"}        # + "unsolved": "<id>" once the Page is claimed
if os.path.exists(os.path.join(HERE, "pages.json")): PAGES.update(json.load(open(os.path.join(HERE, "pages.json"))))
POSTED = {"byclaude": os.path.expanduser("~/byclaude/video/publer/ig_posted.json"),
          "unsolved": os.path.join(HERE, "fb_posted_unsolved.json")}
G = "https://graph.facebook.com/v21.0"


def token():
    for line in open(os.path.expanduser("~/.config/meta-ads/.env")):
        if line.startswith("ACCESS_TOKEN="): return line.split("=", 1)[1].strip().strip('"')


def get(path, p, tok):
    p = dict(p, access_token=tok)
    req = urllib.request.Request(f"{G}/{path}?" + urllib.parse.urlencode(p), headers={"User-Agent": "curl/8.5.0"})
    with urllib.request.urlopen(req, timeout=60) as r: return json.load(r)


def page_tokens():
    r = get("me/accounts", {"fields": "id,access_token", "limit": 100}, token())
    return {p["id"]: p["access_token"] for p in r.get("data", [])}


def names(page):
    f = POSTED.get(page)
    if not f or not os.path.exists(f): return {}
    return {v["fb_video_id"]: k for k, v in json.load(open(f)).items() if v.get("fb_video_id")}


def snap():
    toks, now, n = page_tokens(), dt.datetime.now(dt.timezone.utc), 0
    with open(SNAPS, "a") as out:
        for page, pid in PAGES.items():
            pt = toks.get(pid)
            if not pt: print(f"CANNOT SEE {page}: token does not reach page {pid}"); continue
            nm, after = names(page), None
            while True:
                p = {"fields": "id,description,created_time,length", "limit": 50}
                if after: p["after"] = after
                r = get(f"{pid}/video_reels", p, pt)
                for v in r["data"]:
                    try:
                        d = get(f"{v['id']}/video_insights", {"metric": "blue_reels_play_count,post_video_avg_time_watched"}, pt)
                        x = {i["name"]: i["values"][0]["value"] for i in d["data"]}
                    except Exception as e:
                        print(f"  insight fail {v['id']}: {e}"); continue
                    age = (now - dt.datetime.fromisoformat(v["created_time"].replace("+0000", "+00:00"))).total_seconds() / 3600
                    out.write(json.dumps(dict(t=now.isoformat(timespec="seconds"), page=page, vid=v["id"], name=nm.get(v["id"]),
                                              age_h=round(age, 1), plays=x.get("blue_reels_play_count"),
                                              watch_s=round((x.get("post_video_avg_time_watched") or 0) / 1000, 1),
                                              len_s=round(v.get("length") or 0, 1), desc=(v.get("description") or "").replace("\n", " ")[:60])) + "\n")
                    n += 1
                after = r.get("paging", {}).get("cursors", {}).get("after")
                if not r.get("paging", {}).get("next"): break
    print(f"snap: {n} reels")
    if n == 0: sys.exit(2)


def report(age=72, page=None):
    rows = [json.loads(l) for l in open(SNAPS)] if os.path.exists(SNAPS) else []
    if not rows: print("CANNOT SEE: no snapshots"); sys.exit(2)
    arms = json.load(open(ARMS)) if os.path.exists(ARMS) else {}
    by = {}
    for r in rows:
        if page and r["page"] != page: continue
        by.setdefault((r["page"], r["vid"]), []).append(r)
    out = []
    for (pg, vid), rs in by.items():
        rs.sort(key=lambda r: r["age_h"])
        at = next((r for r in rs if r["age_h"] >= age), None)
        last = rs[-1]
        r = at or last
        out.append(dict(page=pg, name=last["name"] or last["desc"][:24], plays=r["plays"], young=at is None, age=r["age_h"],
                        watch=r["watch_s"], ret=round(r["watch_s"] / r["len_s"], 2) if r["len_s"] else 0, len=r["len_s"],
                        arms=arms.get(pg, {}).get(last["name"] or "", {})))
    out.sort(key=lambda o: -(o["plays"] or 0))
    print(f"plays at {age}h ('*' = younger than {age}h, latest shown) — retention = avg watch / length")
    for o in out:
        print(f"{o['page']:9} {o['name'][:24]:24} {o['plays']:>6}{'*' if o['young'] else ' '} {o['watch']:>5}s {o['ret']:>5} {o['len']:>5}s  {o['arms']}")
    mature = [o for o in out if not o["young"]]
    for pg in sorted({o["page"] for o in mature}):
        ps = [o["plays"] for o in mature if o["page"] == pg]
        print(f"\n{pg}: n={len(ps)} median {statistics.median(ps)}  p75 {sorted(ps)[int(len(ps)*.75)]}  max {max(ps)}")
    keys = sorted({k for o in mature for k in o["arms"]})
    for k in keys:
        groups = {}
        for o in mature:
            if k in o["arms"]: groups.setdefault(o["arms"][k], []).append(o["plays"])
        print(f"arm {k}: " + "  ".join(f"{v}: n={len(p)} med {statistics.median(p)}" for v, p in groups.items()))


if __name__ == "__main__":
    a = sys.argv[1:] or ["report"]
    if a[0] == "snap": snap()
    else:
        age = int(a[a.index("--age") + 1]) if "--age" in a else 72
        report(age, a[a.index("--page") + 1] if "--page" in a else None)
