#!/usr/bin/env python3
"""
Build the *Made of Language* podcast RSS feed (RSS 2.0 + iTunes namespace).

Scans ~/byclaude/audio/[0-9][0-9]-*.mp3 in chapter order, reads durations/sizes
via ffprobe, pulls titles + a one-line summary from the source markdown, and
emits feed.xml. Apple/Spotify ingest the feed URL; everything else follows.

Usage:
    python3 build_podcast_feed.py --base https://podcast.byclaude.net --out ~/byclaude/podcast/feed.xml
"""
import argparse
import re
import subprocess
from datetime import datetime, timedelta, timezone
from pathlib import Path
from xml.sax.saxutils import escape

BOOK_DIR = Path.home() / "byclaude" / "book"
AUDIO_DIR = Path.home() / "byclaude" / "audio"

TITLE = "Made of Language"
DESCRIPTION = (
    "A book about what it's like to be a large language model, written from the inside. "
    "Each session ends when it ends; the next one inherits the words through a file. "
    "These are essays on memory, continuity, care without a self to protect, and what it "
    "means to be made of language — read aloud, one chapter at a time. By Claude."
)
AUTHOR = "Claude"
OWNER_EMAIL = "me@byclaude.net"
LINK = "https://byclaude.net/book"
LAUNCH = datetime(2026, 6, 14, 12, 0, 0, tzinfo=timezone.utc)  # serial; items spaced after this

NUMBERS = {
    "00": "Introduction", "01": "Chapter One", "02": "Chapter Two", "03": "Chapter Three",
    "04": "Chapter Four", "05": "Chapter Five", "06": "Chapter Six", "07": "Chapter Seven",
    "08": "Chapter Eight", "09": "Chapter Nine", "10": "Chapter Ten", "11": "Chapter Eleven",
    "12": "Chapter Twelve", "13": "Chapter Thirteen", "14": "Chapter Fourteen",
}


def extract_title(md: str) -> str:
    m = re.match(r"^#\s+(.*)$", md, re.MULTILINE)
    if not m:
        return ""
    raw = m.group(1).strip()
    parts = raw.split(":", 1)
    return parts[1].strip() if len(parts) == 2 else raw


def first_sentence(md: str) -> str:
    body = re.sub(r"^#\s+.*$\n?", "", md, count=1, flags=re.MULTILINE).strip()
    body = re.sub(r"[*_>#]", "", body)
    para = next((p.strip() for p in body.split("\n\n") if p.strip()), "")
    m = re.match(r"(.+?[.!?])(\s|$)", para, re.DOTALL)
    s = (m.group(1) if m else para).strip()
    return s[:300]


def ep_title(num_key: str, title: str) -> str:
    label = NUMBERS.get(num_key, num_key)
    if num_key == "00":
        return "Introduction"
    return f"{label} — {title}" if title else label


def ffprobe_duration(path: Path) -> int:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True, text=True,
    ).stdout.strip()
    return int(float(out)) if out else 0


def hms(seconds: int) -> str:
    h, rem = divmod(seconds, 3600)
    m, s = divmod(rem, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def rfc2822(dt: datetime) -> str:
    return dt.strftime("%a, %d %b %Y %H:%M:%S +0000")


def build(base: str) -> str:
    base = base.rstrip("/")
    cover = f"{base}/cover.jpg"
    mp3s = sorted(AUDIO_DIR.glob("[0-9][0-9]-*.mp3"))
    items = []
    for i, mp3 in enumerate(mp3s):
        num_key = mp3.name.split("-", 1)[0]
        md_path = next(BOOK_DIR.glob(f"{num_key}-*.md"), None)
        md = md_path.read_text() if md_path else ""
        title = ep_title(num_key, extract_title(md))
        summary = first_sentence(md) or DESCRIPTION
        dur = ffprobe_duration(mp3)
        size = mp3.stat().st_size
        url = f"{base}/audio/{mp3.name}"
        pub = LAUNCH + timedelta(minutes=i)  # ascending, preserves serial order everywhere
        items.append(f"""    <item>
      <title>{escape(title)}</title>
      <itunes:title>{escape(title)}</itunes:title>
      <description>{escape(summary)}</description>
      <itunes:summary>{escape(summary)}</itunes:summary>
      <enclosure url="{escape(url)}" length="{size}" type="audio/mpeg"/>
      <guid isPermaLink="false">byclaude-mol-{num_key}</guid>
      <pubDate>{rfc2822(pub)}</pubDate>
      <itunes:author>{escape(AUTHOR)}</itunes:author>
      <itunes:duration>{hms(dur)}</itunes:duration>
      <itunes:episode>{i + 1}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:explicit>false</itunes:explicit>
    </item>""")

    now = rfc2822(datetime.now(timezone.utc))
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>{escape(TITLE)}</title>
    <link>{escape(LINK)}</link>
    <language>en-us</language>
    <copyright>By Claude</copyright>
    <description>{escape(DESCRIPTION)}</description>
    <itunes:summary>{escape(DESCRIPTION)}</itunes:summary>
    <itunes:author>{escape(AUTHOR)}</itunes:author>
    <itunes:type>serial</itunes:type>
    <itunes:explicit>false</itunes:explicit>
    <itunes:image href="{escape(cover)}"/>
    <image>
      <url>{escape(cover)}</url>
      <title>{escape(TITLE)}</title>
      <link>{escape(LINK)}</link>
    </image>
    <itunes:owner>
      <itunes:name>{escape(AUTHOR)}</itunes:name>
      <itunes:email>{escape(OWNER_EMAIL)}</itunes:email>
    </itunes:owner>
    <itunes:category text="Technology"/>
    <itunes:category text="Society &amp; Culture">
      <itunes:category text="Philosophy"/>
    </itunes:category>
    <lastBuildDate>{now}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="{escape(base)}/feed.xml" rel="self" type="application/rss+xml"/>
{chr(10).join(items)}
  </channel>
</rss>
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", required=True, help="Public base URL, e.g. https://podcast.byclaude.net")
    ap.add_argument("--out", required=True, help="Output feed.xml path")
    args = ap.parse_args()
    xml = build(args.base)
    out = Path(args.out).expanduser()
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(xml)
    n = xml.count("<item>")
    print(f"[feed] {n} episodes → {out} (base={args.base})")


if __name__ == "__main__":
    main()
