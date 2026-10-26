#!/usr/bin/env python3
"""photo.py — the `format` arm on the Still Unsolved Page (opened 2026-10-26, Patrick's note b3c16e47):
one real photograph + a 1–3 sentence caption, no video. Measured by lab.py (snap_photos) in the same metric as
reels: unique viewers at 72h (reel plays ~= reel unique viewers).

  photo.py queue                 show approved-but-unposted posts (photos/<slug>/APPROVED marks a post that passed the blind check)
  photo.py post [slug] [--dry-run]   post the next approved photo (or <slug>); record post_id in photos_posted.json

A post is only eligible with: image.* + caption.txt + meta.json + APPROVED (written after the blind verify, never by the writer).
Exit 2 = cannot see/post (no token, upload error, read-back mismatch) — never a silent success.
"""
import json, os, sys, glob, subprocess, datetime as dt
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lab

HERE = os.path.dirname(os.path.abspath(__file__))
DIR = os.path.join(HERE, "photos")
POSTED = lab.PHOTOS_POSTED
PAGE = lab.PAGES["unsolved"]


def posted():
    return json.load(open(POSTED)) if os.path.exists(POSTED) else {}


def queue():
    done = posted()
    order = [l.strip() for l in open(os.path.join(DIR, "order.txt"))] if os.path.exists(os.path.join(DIR, "order.txt")) else []
    q = [os.path.basename(d) for d in sorted(glob.glob(os.path.join(DIR, "*")))
         if os.path.isdir(d) and os.path.exists(os.path.join(d, "APPROVED")) and os.path.basename(d) not in done]
    q.sort(key=lambda s: order.index(s) if s in order else 999)
    return q


def post(slug, dry):
    d = os.path.join(DIR, slug)
    img = next(iter(sorted(glob.glob(os.path.join(d, "image.*")))), None)
    cap = open(os.path.join(d, "caption.txt")).read().strip()
    if not img or not cap: print(f"{slug}: missing image or caption"); sys.exit(2)
    if dry: print(f"DRY {slug}: {img}\n---\n{cap}\n---"); return
    pt = lab.page_tokens().get(PAGE)
    if not pt: print("CANNOT POST: token does not reach the Still Unsolved page"); sys.exit(2)
    r = subprocess.run(["curl", "-s", "-A", "curl/8.5.0", "-F", f"source=@{img}", "-F", f"message=<{os.path.join(d, 'caption.txt')}",
                        "-F", "published=true", "-F", f"access_token={pt}", f"{lab.G}/{PAGE}/photos"], capture_output=True, text=True, timeout=180)
    try: j = json.loads(r.stdout)
    except Exception: print(f"{slug}: unparseable response {r.stdout[:300]} {r.stderr[:200]}"); sys.exit(2)
    pid = j.get("post_id")
    if not pid: print(f"{slug}: post failed {j}"); sys.exit(2)
    back = lab.get(pid, {"fields": "message,permalink_url,created_time"}, pt)   # read back: the receipt is the live post, not the 200
    if (back.get("message") or "").strip()[:60] != cap[:60]: print(f"{slug}: READ-BACK MISMATCH {back}"); sys.exit(2)
    p = posted(); p[slug] = dict(post_id=pid, photo_id=j.get("id"), posted_at=back["created_time"], url=back.get("permalink_url"))
    json.dump(p, open(POSTED, "w"), indent=1)
    print(f"posted {slug}: {back.get('permalink_url')}")


if __name__ == "__main__":
    a = sys.argv[1:] or ["queue"]
    if a[0] == "queue": print("\n".join(queue()) or "(empty)")
    elif a[0] == "post":
        rest = [x for x in a[1:] if not x.startswith("--")]
        q = queue()
        slug = rest[0] if rest else (q[0] if q else None)
        if not slug: print("photo queue empty"); sys.exit(0)
        if slug not in q and "--force" not in a: print(f"{slug}: not approved or already posted"); sys.exit(2)
        post(slug, "--dry-run" in a)
