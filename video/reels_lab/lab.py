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
                    viewers = post_viewers(f"{pid}_{v['id']}", pt)
                    out.write(json.dumps(dict(t=now.isoformat(timespec="seconds"), page=page, vid=v["id"], name=nm.get(v["id"]), viewers=viewers,
                                              age_h=round(age, 1), plays=x.get("blue_reels_play_count"),
                                              watch_s=round((x.get("post_video_avg_time_watched") or 0) / 1000, 1),
                                              len_s=round(v.get("length") or 0, 1), desc=(v.get("description") or "").replace("\n", " ")[:60])) + "\n")
                    n += 1
                after = r.get("paging", {}).get("cursors", {}).get("after")
                if not r.get("paging", {}).get("next"): break
    print(f"snap: {n} reels")
    m = snap_photos(toks, now)
    print(f"snap: {m} photo posts")
    if n == 0: sys.exit(2)


def post_viewers(post_id, pt):
    """Unique viewers, lifetime (post_total_media_view_unique) — the one metric reels AND photo posts share.
    None = could not read (never 0: a failed read must not look like a dead post)."""
    try:
        d = get(f"{post_id}/insights", {"metric": "post_total_media_view_unique"}, pt)
        return next((i["values"][0]["value"] for i in d["data"] if i.get("period") == "lifetime"), None)
    except Exception: return None


PHOTOS_POSTED = os.path.join(HERE, "photos_posted.json")    # {slug: {post_id, posted_at}}  (photo.py writes it)


def snap_photos(toks, now):
    """Format arm (2026-10-26): single-photo + short-caption posts on the Still Unsolved Page."""
    if not os.path.exists(PHOTOS_POSTED): return 0
    pt, n = toks.get(PAGES["unsolved"]), 0
    if not pt: print("CANNOT SEE photos: no unsolved page token"); return 0
    with open(SNAPS, "a") as out:
        for slug, p in json.load(open(PHOTOS_POSTED)).items():
            try:
                f = get(p["post_id"], {"fields": "created_time,shares,comments.summary(true).limit(0),reactions.summary(true).limit(0)"}, pt)
            except Exception as e: print(f"  photo read fail {slug}: {e}"); continue
            age = (now - dt.datetime.fromisoformat(f["created_time"].replace("+0000", "+00:00"))).total_seconds() / 3600
            out.write(json.dumps(dict(t=now.isoformat(timespec="seconds"), page="unsolved", kind="photo", vid=p["post_id"], name=slug,
                                      age_h=round(age, 1), plays=post_viewers(p["post_id"], pt), watch_s=0, len_s=0, desc=slug,
                                      reactions=f.get("reactions", {}).get("summary", {}).get("total_count"),
                                      comments=f.get("comments", {}).get("summary", {}).get("total_count"),
                                      shares=(f.get("shares") or {}).get("count", 0))) + "\n")
            n += 1
    return n


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
        isphoto = last.get("kind") == "photo"
        a = dict(arms.get(pg, {}).get(last["name"] or "", {})) if not isphoto else {}
        a["format"] = "photo" if isphoto else "reel"
        out.append(dict(page=pg, name=last["name"] or last["desc"][:24], plays=r["plays"] or 0, young=at is None, age=r["age_h"],
                        watch=r["watch_s"], now=last["plays"], ret=round(r["watch_s"] / r["len_s"], 2) if r["len_s"] else 0, len=r["len_s"],
                        arms=a, photo=isphoto, eng=(r.get("reactions"), r.get("comments"), r.get("shares"))))
    out.sort(key=lambda o: -(o["plays"] or 0))
    print(f"plays at {age}h ('*' = younger than {age}h, latest shown) — retention = avg watch / length")
    for o in out:
        tail = f"PHOTO  reactions/comments/shares {o['eng']}" if o["photo"] else f"{o['watch']:>5}s {o['ret']:>5} {o['len']:>5}s  {o['arms']}"
        print(f"{o['page']:9} {o['name'][:24]:24} {o['plays']:>6}{'*' if o['young'] else ' '} now {o['now'] or 0:>7}{' <- LATE BREAKOUT' if (o['now'] or 0) >= 3*max(o['plays'] or 1, 1) and not o['young'] else ''} {tail}")
    allmature = [o for o in out if not o["young"]]
    # reposts get ~0 distribution (2026-10-18) — keep them out of every stat except the origin arm itself
    # photos only ever enter the `format` arm (reel plays ~= reel unique viewers: Vela 49,045 vs 48,732, so the arm compares like with like)
    # posts inside a PAGE-WIDE distribution outage measure the outage, not the arm (2026-10-27: page media views
    # ~1,300/day -> ~70/day 10-23..10-25, right after Vela's +1,031 follows) — `excluded` in arms.json, reason printed
    allmature = [o for o in allmature if not o["arms"].get("excluded")]
    mature = [o for o in allmature if o["arms"].get("origin") != "repost" and not o["photo"]]
    for pg in sorted({o["page"] for o in mature}):
        ps = [o["plays"] for o in mature if o["page"] == pg]
        print(f"\n{pg}: n={len(ps)} median {statistics.median(ps)}  p75 {sorted(ps)[int(len(ps)*.75)]}  max {max(ps)}")
    keys = sorted({k for o in allmature for k in o["arms"]} - {"excluded"})
    ex = [o["name"] for o in out if o["arms"].get("excluded")]
    if ex: print(f"\nexcluded from every stat ({len(ex)}): {', '.join(ex)}")
    for k in keys:
        groups = {}
        for o in (allmature if k == "origin" else [o for o in allmature if o["arms"].get("origin") != "repost"] if k == "format" else mature):
            if k in o["arms"]: groups.setdefault(o["arms"][k], []).append(o["plays"])
        print(f"arm {k}: " + "  ".join(f"{v}: n={len(p)} med {statistics.median(p)}" for v, p in groups.items()))


if __name__ == "__main__":
    a = sys.argv[1:] or ["report"]
    if a[0] == "snap": snap()
    else:
        age = int(a[a.index("--age") + 1]) if "--age" in a else 72
        report(age, a[a.index("--page") + 1] if "--page" in a else None)
