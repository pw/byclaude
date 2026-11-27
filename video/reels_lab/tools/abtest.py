#!/usr/bin/env python3
"""abtest.py: Facebook's native A/B test for Still Unsolved reels (Graph API, POST /{page}/ab_tests).

  abtest.py create <name> <variantA> <variantB> [...] --at ISO --duration SECS --goal REELS_PLAYS [--control variantA]
      variants are film keys on the review worker (short-su-<variant>.mp4); each is uploaded as an UNPUBLISHED
      (DRAFT) reel with the film's caption, then the test is created. Facebook shows each version to a separate
      slice of the audience for --duration, then publishes the winner to the Page. Writes reels_lab/abtests.json.
  abtest.py read [<test_id>]        per-version plays / impressions / avg watch + declared winner
  abtest.py list                    every test on the Page

Why (reels-owner 2026-11-27): the owner model says the DAY sets the level and inside-day arms need many pairs;
a native test randomizes versions of ONE film at the same moment, so one test = one clean comparison.
Docs: developers.facebook.com/docs/video-api/ab-testing (2-4 unpublished videos, duration 1800..604800 s)."""
import sys, json, time, argparse, urllib.request, urllib.parse, urllib.error, importlib.util
from pathlib import Path
from datetime import datetime, timezone

LAB = Path.home() / "byclaude/video/reels_lab"
spec = importlib.util.spec_from_file_location("ig", str(Path.home() / "FeelBetterBot.com/marketing/ig/ig.py"))
ig = importlib.util.module_from_spec(spec); spec.loader.exec_module(ig)
PAGE = "1324437700761411"
MEDIA = "https://byclaude-video-review.pw3.workers.dev/m"
LEDGER = LAB / "abtests.json"
pt = ig.page_token(PAGE)

def call(path, params=None, method="GET"):
    params = dict(params or {}); params["access_token"] = pt
    data = urllib.parse.urlencode(params).encode()
    url = f"{ig.GRAPH}/{path}" + ("" if method == "POST" else "?" + data.decode())
    req = urllib.request.Request(url, data=data if method == "POST" else None, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as r: return json.load(r)
    except urllib.error.HTTPError as e: return {"error": e.read().decode(errors="replace")}

def upload_draft(variant, caption):
    st = call(f"{PAGE}/video_reels", {"upload_phase": "start"}, "POST")
    if "video_id" not in st: sys.exit(f"start {variant}: {st}")
    vid = st["video_id"]
    up = urllib.request.Request(f"https://rupload.facebook.com/video-upload/{ig.GRAPH.rsplit('/', 1)[1]}/{vid}", method="POST",
                                headers={"Authorization": f"OAuth {pt}", "file_url": f"{MEDIA}/short-su-{variant}.mp4"})
    with urllib.request.urlopen(up, timeout=180) as r: u = json.load(r)
    if not u.get("success"): sys.exit(f"upload {variant}: {u}")
    fin = call(f"{PAGE}/video_reels", {"upload_phase": "finish", "video_id": vid, "video_state": "DRAFT", "description": caption}, "POST")
    if not fin.get("success"): sys.exit(f"finish {variant}: {fin}")
    for _ in range(60):
        s = call(vid, {"fields": "status"}).get("status", {})
        if s.get("video_status") == "ready": return vid, s
        if s.get("video_status") == "error": sys.exit(f"processing {variant}: {s}")
        time.sleep(5)
    sys.exit(f"{variant} {vid} not ready after 5 min: {s}")

def ledger():
    return json.loads(LEDGER.read_text()) if LEDGER.exists() else {}

a = argparse.ArgumentParser(); a.add_argument("cmd"); a.add_argument("args", nargs="*")
a.add_argument("--at"); a.add_argument("--duration", type=int, default=10800); a.add_argument("--goal", default="REELS_PLAYS")
a.add_argument("--control"); a.add_argument("--note", default="")
o = a.parse_args()

if o.cmd == "create":
    name, variants = o.args[0], o.args[1:]
    assert 2 <= len(variants) <= 4, "2-4 versions"
    c = json.loads((LAB / "captions_unsolved.json").read_text())[name]; caption = c["reels"] if isinstance(c, dict) else c
    vids = {}
    for v in variants:
        vids[v], s = upload_draft(v, caption); print(f"{v}: draft reel {vids[v]} {s.get('video_status')} publishing={s.get('publishing_phase')}")
    p = {"name": f"su-{name}", "description": o.note or f"Still Unsolved {name}: " + " vs ".join(variants),
         "optimization_goal": o.goal, "experiment_video_ids": json.dumps(list(vids.values())),
         "control_video_id": vids[o.control or variants[0]], "duration": o.duration}
    if o.at: p["scheduled_experiment_timestamp"] = int(datetime.fromisoformat(o.at.replace("Z", "+00:00")).timestamp())
    r = call(f"{PAGE}/ab_tests", p, "POST")
    print("create:", r)
    if "id" not in r: sys.exit(2)
    L = ledger(); L[name] = {"test_id": r["id"], "videos": vids, "at": o.at, "duration": o.duration, "goal": o.goal,
                            "control": o.control or variants[0], "created": datetime.now(timezone.utc).isoformat(timespec="seconds"), "note": o.note}
    LEDGER.write_text(json.dumps(L, indent=1)); print("ledger:", LEDGER)
elif o.cmd == "read":
    ids = o.args or [t["test_id"] for t in ledger().values()]
    for i in ids: print(json.dumps(call(i, {"fields": "name,publish_status,test_insights,declared_winning_video,experiment_video_ids,control_video_id,scheduled_experiment_timestamp,duration,optimization_goal"}), indent=1))
elif o.cmd == "list":
    print(json.dumps(call(f"{PAGE}/ab_tests", {"since": "1 nov 2026", "until": "today"}), indent=1))
