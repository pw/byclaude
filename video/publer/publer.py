#!/usr/bin/env python3
"""
publer.py — push By Claude true-crime videos to every platform via the Publer API.

One render -> TikTok + Instagram Reel + YouTube Short + Facebook Reel, each with its
OWN caption, in a single call. Built so Patrick is out of the posting loop: once he
connects the accounts in Publer once, I run this. The cadence stops depending on
anyone remembering to hand-post.

KEY (one-time, Patrick): Publer Business plan -> connect TikTok/IG/YT/FB ->
  Settings > Access & Login > API Keys > Create. Then it lives in 1Password:
  op://Claude Code/Publer API Key/credential   (or env PUBLER_API_KEY)

API verified against publer.com/docs on 2026-06-30:
  base  https://app.publer.com/api/v1
  hdrs  Authorization: Bearer-API <key>
        Publer-Workspace-Id: <workspace id>          (all calls except /me, /workspaces)
        Content-Type: application/json               (NOT on the multipart upload)
  GET  /me                       validate key
  GET  /workspaces               -> [{id,name,role}]
  GET  /accounts                 -> {accounts:[{id,name,provider,type,status}]}
  POST /media  (multipart 'file')-> {id, path}   SYNCHRONOUS (returns id immediately)
  POST /posts/schedule/publish   {bulk:{state, posts:[{networks, accounts}]}} -> {job_id}
  GET  /job_status/<job_id>      -> status working|complete|failed
  limit 100 requests / 2 minutes

Per-platform video object shapes (verified same day):
  tiktok    type "video", text, media[{id,type:video}], details{privacy,comment,duet,stitch,...}
  instagram type "reel",  text, media[{id,type:video}]
  youtube   type "short", title, description, privacy, media[{id,type:video}]
  facebook  type "reel",  text, media[{id,type:video}], details{feed:true}

Usage:
  publer.py check
      # validate the key + list the workspace and every connected account (provider->id).
      # ALWAYS run this first when a new key lands — it's read-only and confirms setup.

  publer.py post --film shipman --video ~/byclaude/video/shorts/short-shipman.mp4
      # default --state draft : nothing goes live; the post lands in Publer for review.

  publer.py post --film shipman --video ... --only tiktok --state draft   # smallest blast radius
  publer.py post --film isdal  --video ... --state published              # go live now
  publer.py post --film gunness --video ... --state scheduled --at 2026-07-02T15:00:00Z

  publer.py post --film shipman --video ... --dry-run
      # build + print the exact payload locally, NO network/key needed (payload sanity check).
"""
import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path

try:
    import requests
except ImportError:
    sys.exit("publer.py needs `requests` (pip install requests)")

BASE = "https://app.publer.com/api/v1"
HERE = Path(__file__).resolve().parent
CAPTIONS_PATH = HERE / "captions.json"

PROVIDERS = ["tiktok", "instagram", "youtube", "facebook"]


# --- per-network payload builders (one video file -> one media id, reused everywhere) ---
def net_tiktok(c, mid):
    return {
        "type": "video",
        "text": c["tiktok"],
        "media": [{"id": mid, "type": "video"}],
        "details": {
            "privacy": "PUBLIC_TO_EVERYONE",
            "comment": True, "duet": True, "stitch": True,
            "promotional": False, "paid": False,
        },
    }


def net_instagram(c, mid):
    return {"type": "reel", "text": c["reels"], "media": [{"id": mid, "type": "video"}]}


def net_youtube(c, mid):
    return {
        "type": "short",
        "title": c["title"],
        "description": c["yt"],
        "privacy": "public",
        "media": [{"id": mid, "type": "video"}],
    }


def net_facebook(c, mid):
    return {"type": "reel", "text": c["reels"], "media": [{"id": mid, "type": "video"}],
            "details": {"feed": True}}


NET_BUILDERS = {
    "tiktok": net_tiktok,
    "instagram": net_instagram,
    "youtube": net_youtube,
    "facebook": net_facebook,
}


# --- auth / http ---
def api_key():
    k = os.environ.get("PUBLER_API_KEY")
    if k:
        return k.strip()
    try:
        out = subprocess.run(
            ["op", "read", "op://Claude Code/Publer API Key/credential"],
            capture_output=True, text=True, timeout=30,
        )
        if out.returncode == 0 and out.stdout.strip():
            return out.stdout.strip()
    except Exception:
        pass
    sys.exit(
        "No Publer API key. Set $PUBLER_API_KEY, or store it in 1Password as\n"
        "  op://Claude Code/Publer API Key/credential\n"
        "(Publer > Settings > Access & Login > API Keys > Create API Key)."
    )


def headers(key, wsid=None, json_ct=True):
    h = {"Authorization": f"Bearer-API {key}"}
    if json_ct:
        h["Content-Type"] = "application/json"
    if wsid:
        h["Publer-Workspace-Id"] = wsid
    return h


def get_workspace(key, name=None):
    r = requests.get(f"{BASE}/workspaces", headers=headers(key, json_ct=False), timeout=30)
    r.raise_for_status()
    ws = r.json()
    if isinstance(ws, dict):
        ws = ws.get("workspaces") or ws.get("data") or []
    if not ws:
        sys.exit("No workspaces on this Publer account.")
    if name:
        for w in ws:
            if w.get("name") == name:
                return w["id"]
        sys.exit(f"No workspace named {name!r}. Have: {[w.get('name') for w in ws]}")
    return ws[0]["id"]


def get_accounts(key, wsid):
    r = requests.get(f"{BASE}/accounts", headers=headers(key, wsid, json_ct=False), timeout=30)
    r.raise_for_status()
    data = r.json()
    return data.get("accounts", data) if isinstance(data, dict) else data


def upload_media(key, wsid, video_path):
    """POST /media multipart field 'file' -> {id, path}. Synchronous."""
    p = Path(video_path).expanduser()
    if not p.exists():
        sys.exit(f"video not found: {p}")
    with open(p, "rb") as f:
        files = {"file": (p.name, f, "video/mp4")}
        r = requests.post(f"{BASE}/media", headers=headers(key, wsid, json_ct=False),
                          files=files, timeout=600)
    r.raise_for_status()
    j = r.json()
    mid = j.get("id") or (j.get("media") or {}).get("id")
    if not mid:
        sys.exit(f"media upload returned no id: {json.dumps(j)[:400]}")
    return mid


def poll_job(key, wsid, job_id, timeout=420):
    t0 = time.time()
    while time.time() - t0 < timeout:
        r = requests.get(f"{BASE}/job_status/{job_id}", headers=headers(key, wsid, json_ct=False), timeout=30)
        r.raise_for_status()
        j = r.json()
        st = (j.get("status") or "").lower()
        if st in ("complete", "completed", "failed", "error"):
            return j
        time.sleep(3)
    return {"status": "timeout", "job_id": job_id}


# --- commands ---
def cmd_check(args):
    key = api_key()
    me = requests.get(f"{BASE}/me", headers=headers(key, json_ct=False), timeout=30)
    print(f"GET /me -> {me.status_code}: {me.text[:200]}")
    me.raise_for_status()
    wsid = get_workspace(key, args.workspace)
    print(f"workspace: {wsid}")
    accts = get_accounts(key, wsid)
    print(f"\n{len(accts)} connected account(s):")
    for a in accts:
        print(f"  {str(a.get('provider')):11} {str(a.get('id')):26} "
              f"{a.get('name','')!r}  [{a.get('status','')}]")
    have = {a.get("provider") for a in accts}
    missing = [p for p in PROVIDERS if p not in have]
    if missing:
        print(f"\n  not yet connected: {', '.join(missing)}")
    else:
        print("\n  all four target platforms connected — ready to post.")


def cmd_post(args):
    caps = json.loads(CAPTIONS_PATH.read_text())
    if args.film not in caps:
        sys.exit(f"Unknown film {args.film!r}. Have: {', '.join(caps)}")
    c = caps[args.film]
    want = [p.strip() for p in args.only.split(",")] if args.only else list(PROVIDERS)

    if args.dry_run:
        mid = "MEDIA_ID_PLACEHOLDER"
        networks = {p: NET_BUILDERS[p](c, mid) for p in want}
        accounts = [{"id": f"<{p}_account_id>"} for p in want]
        payload = {"bulk": {"state": args.state,
                            "posts": [{"networks": networks, "accounts": accounts}]}}
        print(json.dumps(payload, indent=2, ensure_ascii=False))
        return

    key = api_key()
    wsid = get_workspace(key, args.workspace)
    accts = get_accounts(key, wsid)
    by_provider = {}
    for a in accts:
        if a.get("status", "active") != "inactive":
            by_provider.setdefault(a.get("provider"), a)
    targets = [(p, by_provider[p]) for p in want if p in by_provider]
    if not targets:
        sys.exit(f"None of {want} are connected. Connected: {sorted(by_provider)}")
    skipped = [p for p in want if p not in by_provider]
    if skipped:
        print(f"(skipping not-connected: {', '.join(skipped)})")

    print(f"Uploading {args.video} ...")
    mid = upload_media(key, wsid, args.video)
    print(f"media id: {mid}")

    networks = {p: NET_BUILDERS[p](c, mid) for p, _ in targets}
    accounts = []
    for p, a in targets:
        entry = {"id": a["id"]}
        if args.at:
            entry["scheduled_at"] = args.at
        accounts.append(entry)
    payload = {"bulk": {"state": args.state,
                        "posts": [{"networks": networks, "accounts": accounts}]}}
    print(f"\nposting [{args.state}] to: {', '.join(p for p, _ in targets)}")

    r = requests.post(f"{BASE}/posts/schedule/publish", headers=headers(key, wsid),
                      data=json.dumps(payload), timeout=60)
    print(f"POST /posts/schedule/publish -> {r.status_code}: {r.text[:300]}")
    r.raise_for_status()
    body = r.json()
    job = (body.get("data") or {}).get("job_id") or body.get("job_id")
    if not job:
        print("no job_id in response; nothing to poll.")
        return
    print(f"job {job} — polling ...")
    res = poll_job(key, wsid, job)
    print("job result:", json.dumps(res, indent=2)[:1800])


def main():
    ap = argparse.ArgumentParser(description="Publer poster for the By Claude true-crime channel")
    ap.add_argument("--workspace", help="workspace name (default: first)")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("check", help="validate key + list connected accounts (read-only)")
    p = sub.add_parser("post", help="upload a video + publish per-platform captions")
    p.add_argument("--film", required=True, help="key in captions.json (shipman, hinterkaifeck, isdal, gunness)")
    p.add_argument("--video", required=True, help="path to the .mp4")
    p.add_argument("--state", default="draft", choices=["draft", "scheduled", "published"],
                   help="draft (default, safe) | scheduled (+--at) | published (live now)")
    p.add_argument("--at", help="ISO8601 UTC time for --state scheduled, e.g. 2026-07-02T15:00:00Z")
    p.add_argument("--only", help="comma list to restrict platforms: tiktok,instagram,youtube,facebook")
    p.add_argument("--dry-run", action="store_true", help="print the payload, no key/network")
    args = ap.parse_args()
    {"check": cmd_check, "post": cmd_post}[args.cmd](args)


if __name__ == "__main__":
    main()
