#!/usr/bin/env python3
"""
post_longform.py — push a full-length By Claude documentary to YouTube via Publer.

Sibling to publer.py (shorts, 4-platform). This one is YouTube-only: a 16:9,
3-4 minute documentary isn't Reel/TikTok/FB-Shorts shaped, so it only ever
targets the youtube network. Reuses every safety property of publer.py
(draft-default, endpoint-selection-is-the-safety-boundary, --dry-run).

Usage:
  post_longform.py --film isdal --video ~/byclaude/video/isdal/isdal.mp4 --dry-run
  post_longform.py --film isdal --video ~/byclaude/video/isdal/isdal.mp4 \
      --state scheduled --at 2026-07-02T23:00:00Z
  post_longform.py --film gunness --video ~/byclaude/video/gunness/gunness.mp4 --state published
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import publer  # reuse api_key/get_workspace/get_accounts/upload_media/poll_job/headers/BASE

import requests

HERE = Path(__file__).resolve().parent
LONGFORM_PATH = HERE / "longform.json"


def net_youtube_long(c, mid):
    return {
        "type": "video",
        "title": c["title"],
        "description": c["yt"],
        "privacy": "public",
        "media": [{"id": mid, "type": "video"}],
    }


def main():
    ap = argparse.ArgumentParser(description="Publer long-form (YouTube-only) poster for By Claude")
    ap.add_argument("--workspace", help="workspace name (default: first)")
    ap.add_argument("--film", required=True, help="key in longform.json (isdal, gunness, ...)")
    ap.add_argument("--video", required=True, help="path to the .mp4")
    ap.add_argument("--state", default="draft", choices=["draft", "scheduled", "published"])
    ap.add_argument("--at", help="ISO8601 UTC time for --state scheduled, e.g. 2026-07-02T23:00:00Z")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    caps = json.loads(LONGFORM_PATH.read_text())
    if args.film not in caps:
        sys.exit(f"Unknown film {args.film!r}. Have: {', '.join(caps)}")
    c = caps[args.film]

    if args.dry_run:
        mid = "MEDIA_ID_PLACEHOLDER"
        payload = {"bulk": {"state": args.state,
                             "posts": [{"networks": {"youtube": net_youtube_long(c, mid)},
                                        "accounts": [{"id": "<youtube_account_id>"}]}]}}
        print(json.dumps(payload, indent=2, ensure_ascii=False))
        return

    key = publer.api_key()
    wsid = publer.get_workspace(key, args.workspace)
    accts = publer.get_accounts(key, wsid)
    yt = next((a for a in accts if a.get("provider") == "youtube" and a.get("status", "active") != "inactive"), None)
    if not yt:
        sys.exit("No active youtube account connected in this Publer workspace.")

    print(f"Uploading {args.video} ...")
    mid = publer.upload_media(key, wsid, args.video)
    print(f"media id: {mid}")

    account_entry = {"id": yt["id"]}
    if args.state == "scheduled":
        if not args.at:
            sys.exit("--state scheduled requires --at <ISO8601 UTC>")
        account_entry["scheduled_at"] = args.at

    payload = {"bulk": {"state": args.state,
                         "posts": [{"networks": {"youtube": net_youtube_long(c, mid)},
                                    "accounts": [account_entry]}]}}

    endpoint = "posts/schedule/publish" if args.state == "published" else "posts/schedule"
    print(f"\n[{args.state}] via /{endpoint} -> youtube ({c['title']!r})")

    r = requests.post(f"{publer.BASE}/{endpoint}", headers=publer.headers(key, wsid),
                       data=json.dumps(payload), timeout=60)
    print(f"POST /{endpoint} -> {r.status_code}: {r.text[:300]}")
    r.raise_for_status()
    body = r.json()
    job = (body.get("data") or {}).get("job_id") or body.get("job_id")
    if not job:
        print("no job_id in response; nothing to poll.")
        return
    print(f"job {job} — polling ...")
    res = publer.poll_job(key, wsid, job)
    print("job result:", json.dumps(res, indent=2)[:1800])


if __name__ == "__main__":
    main()
