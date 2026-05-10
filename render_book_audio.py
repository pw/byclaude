#!/usr/bin/env python3
"""
Render Made of Language audiobook with Grok TTS, Leo voice.
Reads ~/byclaude/book/0*-*.md, writes ~/byclaude/audio/{slug}.mp3.
"""
import re
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

TTS_SCRIPT = Path.home() / "batch-novel" / "audio-tests" / "grok_tts.py"
BOOK_DIR = Path.home() / "byclaude" / "book"
OUT_DIR = Path.home() / "byclaude" / "audio"
TXT_DIR = OUT_DIR / "txt"
VOICE = "leo"
PARALLEL = 2

NUMBERS = {
    "00": "Introduction",
    "01": "Chapter One",
    "02": "Chapter Two",
    "03": "Chapter Three",
    "04": "Chapter Four",
    "05": "Chapter Five",
    "06": "Chapter Six",
    "07": "Chapter Seven",
    "08": "Chapter Eight",
    "09": "Chapter Nine",
}


def strip_markdown(text: str) -> str:
    # Drop the first heading (we'll narrate it from filename + title)
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
    # "One: The Conversation Is the Body" -> "The Conversation Is the Body"
    parts = raw.split(":", 1)
    if len(parts) == 2:
        return parts[1].strip()
    return raw


def build_lead_in(num_key: str, title: str) -> str:
    label = NUMBERS.get(num_key, num_key)
    if num_key == "00":
        # Don't say "Introduction. Introduction." — title IS Introduction
        return f"{label}.\n\n"
    return f"{label}. {title}.\n\n"


def render_chapter(md_path: Path):
    num_key = md_path.name.split("-", 1)[0]
    body = md_path.read_text()
    title = extract_title(body)
    text = build_lead_in(num_key, title) + strip_markdown(body)
    slug = md_path.stem  # e.g. "01-conversation-is-the-body"
    txt_path = TXT_DIR / f"{slug}.txt"
    mp3_path = OUT_DIR / f"{slug}.mp3"
    txt_path.write_text(text)
    if mp3_path.exists() and mp3_path.stat().st_size > 100_000:
        return (slug, True, f"already rendered ({mp3_path.stat().st_size:,}B)")
    t0 = time.time()
    result = subprocess.run(
        ["python3", str(TTS_SCRIPT), str(txt_path), str(mp3_path), "--voice", VOICE],
        capture_output=True, text=True,
    )
    dt = time.time() - t0
    if result.returncode != 0:
        if mp3_path.exists():
            mp3_path.unlink()
        for p in OUT_DIR.glob(f"{slug}.part*.mp3"):
            p.unlink()
        return (slug, False, f"FAIL after {dt:.0f}s: {result.stderr[:300]}")
    size = mp3_path.stat().st_size
    return (slug, True, f"done in {dt:.0f}s ({size:,}B)")


def main():
    OUT_DIR.mkdir(exist_ok=True)
    TXT_DIR.mkdir(exist_ok=True)
    chapters = sorted(BOOK_DIR.glob("0*-*.md"))
    print(f"[mol] {len(chapters)} chapters → {OUT_DIR}/ (voice={VOICE}, parallelism={PARALLEL})", flush=True)
    total_chars = sum(p.stat().st_size for p in chapters)
    print(f"[mol] est ~{total_chars:,} chars  ~${total_chars/1_000_000*4.20:.2f}", flush=True)
    t_start = time.time()
    with ThreadPoolExecutor(max_workers=PARALLEL) as ex:
        futures = {ex.submit(render_chapter, p): p for p in chapters}
        done = 0
        for fut in as_completed(futures):
            slug, ok, msg = fut.result()
            done += 1
            tag = "[OK]" if ok else "[FAIL]"
            print(f"[mol] [{done}/{len(chapters)}] {tag} {slug}: {msg} | t={time.time()-t_start:.0f}s", flush=True)
    print(f"[mol] complete in {time.time()-t_start:.0f}s", flush=True)


if __name__ == "__main__":
    main()
