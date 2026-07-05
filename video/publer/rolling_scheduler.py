#!/usr/bin/env python3
"""rolling_scheduler.py — keep the Publer queue topped up to capacity.

Reads backlog.yaml (master schedule), queries Publer for currently-scheduled
posts, fires new entries (oldest first) up to the workspace's queue cap.

Designed to run on cron -- the queue caps at ~5 bulks (5 unique films × 3
platforms = 15 individual posts) so a single daily run keeps ~5-7 days of
runway loaded as old posts publish and free slots.

Idempotent: entries already in the Publer queue are skipped. Entries past
their scheduled_at are skipped + flagged for cleanup.

Usage:
  rolling_scheduler.py            # normal cron mode: top up to cap
  rolling_scheduler.py --dry-run  # show what would fire, no API calls
  rolling_scheduler.py --status   # just print queue + backlog state
"""
import argparse, json, os, subprocess, sys, urllib.request, yaml
from pathlib import Path
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

HERE = Path(__file__).resolve().parent
BACKLOG_PATH = HERE / "backlog.yaml"
PUBLER_PY = HERE / "publer.py"
LONG_MP4_DIR = Path("/tmp/longform")
SHORT_DIR = Path.home() / "byclaude/video/shorts"
MEDIA_BASE = "https://byclaude-video-review.pw3.workers.dev/m"
WORKSPACE_TZ = ZoneInfo("America/Denver")  # Patrick's Publer workspace tz

# long-form film key -> mp4 filename on R2
LONG_MP4 = {
    "gunness": "gunness",
    "courrieres": "twenty-days",
    "glicomorinaga": "the-monster-with-21-faces",
    "surgisphere": "six-employees-six-continents",
    "hwaseong": "the-confession-that-came-too-late",
    "deberk": "the-nurse-and-the-number",
}

MAX_BULKS = 5  # observed workspace cap; safe default


def get_publer_auth():
    """Returns (api_key, workspace_id). Sources OP token from .bashrc if missing."""
    token = os.environ.get("OP_SERVICE_ACCOUNT_TOKEN")
    if not token:
        # cron env doesn't source .bashrc; pull it directly
        token = subprocess.check_output(
            ["bash", "-c", r'grep OP_SERVICE_ACCOUNT_TOKEN ~/.bashrc | head -1 | sed "s/.*=//;s/^\"//;s/\"$"'],
            text=True,
        ).strip()
        os.environ["OP_SERVICE_ACCOUNT_TOKEN"] = token
    pk = subprocess.check_output(
        ["op", "read", "op://Claude Code/Publer API/credential"], text=True
    ).strip()
    # urllib's default UA is blocked at the edge -- use curl instead
    ws_raw = subprocess.check_output(
        ["curl", "-s", "-H", f"Authorization: Bearer-API {pk}", "https://app.publer.com/api/v1/workspaces"],
        text=True,
    )
    ws = json.loads(ws_raw)[0]["id"]
    return pk, ws


def queue_state(pk, ws):
    """Returns list of currently-scheduled posts."""
    raw = subprocess.check_output(
        ["curl", "-s", "-H", f"Authorization: Bearer-API {pk}",
         "-H", f"Publer-Workspace-Id: {ws}",
         "https://app.publer.com/api/v1/posts?limit=200"],
        text=True,
    )
    posts = json.loads(raw).get("posts", [])
    return [p for p in posts if p.get("state") == "scheduled"]


def parse_dt(s):
    """Parse a scheduled_at value (YAML might give datetime object or string)."""
    if isinstance(s, datetime):
        return s if s.tzinfo else s.replace(tzinfo=timezone.utc)
    return datetime.fromisoformat(str(s).replace("Z", "+00:00"))


def parse_publer_stored(s):
    """Publer API stores scheduled_at in workspace tz (America/Denver) without offset.
    Parse as that tz, convert to UTC for comparison."""
    if not s: return None
    try:
        dt_naive = datetime.fromisoformat(s[:19])
        if dt_naive.tzinfo is None:
            dt_local = dt_naive.replace(tzinfo=WORKSPACE_TZ)
            return dt_local.astimezone(timezone.utc)
        return dt_naive if dt_naive.tzinfo else dt_naive.astimezone(timezone.utc)
    except Exception:
        return None


def unique_bulks_queued(sched):
    """Count unique bulks in queue. Each bulk = 1 scheduled_at (films don't share slots in our schedule)."""
    return len({(p.get("scheduled_at") or "")[:19] for p in sched})


def already_queued(sched, film_key, scheduled_at):
    """Idempotency check -- is this film already queued for this scheduled time?
    Compares in UTC -- my backlog is UTC, Publer stores in workspace tz."""
    target_utc = parse_dt(scheduled_at)
    for p in sched:
        sa_utc = parse_publer_stored(p.get("scheduled_at"))
        if sa_utc != target_utc:
            continue
        title = (p.get("title") or "").lower()
        text = (p.get("text") or "").lower()
        if film_key.lower() in title or film_key.lower() in text:
            return True
    return False


def ensure_mp4(film, type_):
    """Resolve local mp4 path; download long-forms from R2 if missing."""
    if type_ == "long":
        mp4_name = LONG_MP4.get(film, film)
        local = LONG_MP4_DIR / f"{mp4_name}.mp4"
        if not local.exists() or local.stat().st_size < 10000:
            LONG_MP4_DIR.mkdir(parents=True, exist_ok=True)
            print(f"  downloading long-form {mp4_name}.mp4 from R2...", flush=True)
            subprocess.run(
                ["curl", "-s", "-o", str(local), f"{MEDIA_BASE}/{mp4_name}.mp4"],
                check=True,
            )
        return local
    else:
        local = SHORT_DIR / f"short-{film}.mp4"
        if not local.exists():
            return None
        return local


def to_iso_z(dt_or_str):
    """Convert datetime or string to 'YYYY-MM-DDTHH:MM:SSZ' format for publer.py."""
    if isinstance(dt_or_str, str):
        # already a string; normalize Z
        return dt_or_str.replace("+00:00", "Z") if dt_or_str.endswith("+00:00") else dt_or_str
    dt = dt_or_str
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    dt = dt.astimezone(timezone.utc)
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def fire(film, mp4_path, scheduled_at, only=None, dry_run=False):
    """Run publer.py post; returns (ok, last_line_of_output)."""
    at_str = to_iso_z(scheduled_at)
    cmd = [
        sys.executable, str(PUBLER_PY), "post",
        "--film", film, "--video", str(mp4_path),
        "--state", "scheduled", "--at", at_str,
    ]
    if only:
        cmd += ["--only", only]
    if dry_run:
        cmd += ["--dry-run"]
    print(f"  fire {film} @ {at_str} ({'long' if '/tmp/' in str(mp4_path) else 'short'})", flush=True)
    if dry_run:
        return True, "dry-run"
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
    out = (r.stdout + r.stderr).strip().splitlines()
    last = out[-1] if out else ""
    body = r.stdout + r.stderr
    ok = "complete" in body and "message" not in body.lower().split("failures", 1)[-1]
    return (ok and r.returncode == 0), last


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--status", action="store_true")
    args = ap.parse_args()

    backlog = yaml.safe_load(BACKLOG_PATH.read_text())["entries"]
    pk, ws = get_publer_auth()
    sched = queue_state(pk, ws)
    queued_bulks = unique_bulks_queued(sched)
    free_slots = MAX_BULKS - queued_bulks
    now = datetime.now(timezone.utc)

    print(f"[rolling] queue: {queued_bulks} bulks ({len(sched)} posts) | free: {free_slots} | backlog: {len(backlog)} | now: {now.isoformat(timespec='seconds')}")

    if args.status:
        print()
        print("Currently scheduled:")
        for p in sorted(sched, key=lambda x: x.get("scheduled_at", "")):
            sa = (p.get("scheduled_at") or "")[:19]
            prov = p.get("account_id", "")[:8]
            title = (p.get("title") or p.get("text") or "")[:55]
            print(f"  {sa}  {prov}  {title!r}")
        print()
        print("Backlog upcoming (next 10):")
        future = [e for e in backlog if parse_dt(e["scheduled_at"]) > now]
        for e in future[:10]:
            print(f"  {e['scheduled_at']}  {e['film']}  ({e.get('type', 'short')})")
        return

    if free_slots <= 0:
        print("[rolling] queue at cap -- nothing to do.")
        return

    queued_count = 0
    skipped_past = 0
    skipped_dup = 0
    for entry in backlog:
        if queued_count >= free_slots:
            break
        film = entry["film"]
        scheduled_at = entry["scheduled_at"]
        type_ = entry.get("type", "short")
        only = entry.get("only")

        sa_dt = parse_dt(scheduled_at)
        if sa_dt < now:
            skipped_past += 1
            continue

        if already_queued(sched, film, scheduled_at):
            skipped_dup += 1
            continue

        mp4 = ensure_mp4(film, type_)
        if not mp4:
            print(f"  skip {film} (mp4 missing)", flush=True)
            continue

        ok, last = fire(film, mp4, scheduled_at, only, args.dry_run)
        if ok:
            queued_count += 1
            print(f"    ok ({last[:80]})", flush=True)
        else:
            print(f"    FAIL: {last[:200]}", flush=True)

    print(f"[rolling] done. queued {queued_count}, skipped {skipped_past} past + {skipped_dup} already-queued.")


if __name__ == "__main__":
    main()
