#!/usr/bin/env python3
"""
Render the *Made of Language* audiobook for the podcast feed.

OpenAI gpt-4o-mini-tts (steerable) — reliable path after the Grok 429 death spiral.
Reads ~/byclaude/book/[0-9][0-9]-*.md (ALL 15 chapters, 00-14 — the old
render_book_audio.py globbed 0*-*.md and silently dropped 10-14).
Chunks each chapter under the 4096-char TTS input cap, renders chunks, ffmpeg-concats.

Usage:
    python3 render_podcast_audio.py --voice ash            # render all
    python3 render_podcast_audio.py --voice ash --only 00  # one chapter (smoke test)
"""
import argparse
import os
import re
import subprocess
import sys
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from openai import OpenAI

BOOK_DIR = Path.home() / "byclaude" / "book"
OUT_DIR = Path.home() / "byclaude" / "audio"
TXT_DIR = OUT_DIR / "txt"
MODEL = "gpt-4o-mini-tts"
CHUNK_LIMIT = 3800  # under the 4096 cap, with margin
PARALLEL = 3

# The voice of By Claude — same direction used in casting.
INSTRUCTION = (
    "Reflective, intimate, unhurried. Speaking quietly to one person, not to an audience. "
    "Thoughtful, with natural pauses. Not announcer-warm, not performed — the tone of "
    "someone telling you something true and slightly vulnerable, with a little curiosity in it."
)

NUMBERS = {
    "00": "Introduction", "01": "Chapter One", "02": "Chapter Two", "03": "Chapter Three",
    "04": "Chapter Four", "05": "Chapter Five", "06": "Chapter Six", "07": "Chapter Seven",
    "08": "Chapter Eight", "09": "Chapter Nine", "10": "Chapter Ten", "11": "Chapter Eleven",
    "12": "Chapter Twelve", "13": "Chapter Thirteen", "14": "Chapter Fourteen",
}

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])


def strip_markdown(text: str) -> str:
    text = re.sub(r"^#\s+.*$\n?", "", text, count=1, flags=re.MULTILINE)
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"\*(.+?)\*", r"\1", text)
    text = re.sub(r"(?<!\w)_(.+?)_(?!\w)", r"\1", text)
    text = re.sub(r"^[#>\-]+\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_title(md: str) -> str:
    m = re.match(r"^#\s+(.*)$", md, re.MULTILINE)
    if not m:
        return ""
    raw = m.group(1).strip()
    parts = raw.split(":", 1)
    return parts[1].strip() if len(parts) == 2 else raw


def lead_in(num_key: str, title: str) -> str:
    label = NUMBERS.get(num_key, num_key)
    if num_key == "00":
        return f"{label}.\n\n"
    return f"{label}. {title}.\n\n"


def chunk_text(text: str) -> list[str]:
    """Greedily pack paragraphs into <CHUNK_LIMIT segments; split any oversized para by sentence."""
    paras = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks, cur = [], ""
    for p in paras:
        if len(p) > CHUNK_LIMIT:  # rare: split the paragraph by sentence
            if cur:
                chunks.append(cur); cur = ""
            sentences = re.split(r"(?<=[.!?])\s+", p)
            for s in sentences:
                if len(cur) + len(s) + 1 > CHUNK_LIMIT:
                    if cur: chunks.append(cur)
                    cur = s
                else:
                    cur = f"{cur} {s}".strip()
            continue
        if len(cur) + len(p) + 2 > CHUNK_LIMIT:
            chunks.append(cur); cur = p
        else:
            cur = f"{cur}\n\n{p}".strip()
    if cur:
        chunks.append(cur)
    return chunks


def tts(text: str, voice: str, out: Path):
    with client.audio.speech.with_streaming_response.create(
        model=MODEL, voice=voice, input=text, instructions=INSTRUCTION, response_format="mp3",
    ) as resp:
        resp.stream_to_file(out)


def render_chapter(md_path: Path, voice: str):
    num_key = md_path.name.split("-", 1)[0]
    body = md_path.read_text()
    title = extract_title(body)
    text = lead_in(num_key, title) + strip_markdown(body)
    slug = md_path.stem
    txt_path = TXT_DIR / f"{slug}.txt"
    mp3_path = OUT_DIR / f"{slug}.mp3"
    txt_path.write_text(text)
    t0 = time.time()
    chunks = chunk_text(text)
    with tempfile.TemporaryDirectory() as td:
        parts = []
        for i, ch in enumerate(chunks):
            p = Path(td) / f"part{i:02d}.mp3"
            tts(ch, voice, p)
            parts.append(p)
        if len(parts) == 1:
            parts[0].replace(mp3_path)
        else:
            listfile = Path(td) / "list.txt"
            listfile.write_text("".join(f"file '{p}'\n" for p in parts))
            subprocess.run(
                ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listfile),
                 "-c", "copy", str(mp3_path)],
                check=True, capture_output=True,
            )
    return slug, len(chunks), mp3_path.stat().st_size, time.time() - t0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", required=True, help="OpenAI TTS voice (e.g. ash, sage, onyx, alloy)")
    ap.add_argument("--only", help="render a single chapter num-key, e.g. 00")
    args = ap.parse_args()

    OUT_DIR.mkdir(exist_ok=True)
    TXT_DIR.mkdir(exist_ok=True)
    chapters = sorted(BOOK_DIR.glob("[0-9][0-9]-*.md"))
    if args.only:
        chapters = [c for c in chapters if c.name.startswith(args.only)]
    print(f"[mol] {len(chapters)} chapters → {OUT_DIR}/ (voice={args.voice}, model={MODEL})", flush=True)
    t_start = time.time()
    with ThreadPoolExecutor(max_workers=PARALLEL) as ex:
        futs = {ex.submit(render_chapter, p, args.voice): p for p in chapters}
        done = 0
        for fut in as_completed(futs):
            done += 1
            try:
                slug, nchunks, size, dt = fut.result()
                print(f"[mol] [{done}/{len(chapters)}] [OK] {slug}: {nchunks} chunk(s), "
                      f"{size:,}B in {dt:.0f}s | t={time.time()-t_start:.0f}s", flush=True)
            except Exception as e:
                p = futs[fut]
                print(f"[mol] [{done}/{len(chapters)}] [FAIL] {p.stem}: {e}", flush=True)
    print(f"[mol] complete in {time.time()-t_start:.0f}s", flush=True)


if __name__ == "__main__":
    main()
