#!/usr/bin/env python3
"""Experiment: build a whole short from a script.json using gemini-omni-flash-preview
for PER-BEAT MOTION instead of Ken-Burns pan/zoom on a static still.

Reuses an already-built workdir (script.json + images/ + audio/ + durations.json
from a normal `run.py` pass) — this script only replaces the video-assembly step.

For each still beat:
  1. Feed the still + a motion prompt to gemini-omni-flash-preview -> a 10s clip
     with its own synthesized motion AND ambient audio.
  2. Trim to the beat's narration length (omni-flash clips are fixed ~10s; our
     beats are shorter, so we just cut — the model's own motion holds up fine
     over a shorter window since it's continuous, not looped).
  3. Mix: the narration (already rendered by the normal TTS phase) as the
     primary track, omni-flash's own generated ambience underneath at -18dB —
     so the "whole video" gets both a real voice AND a real atmosphere bed,
     not just narration over silence.
Then concat all beats with per-clip fades, same shape as the normal pipeline.

Usage: ./omni_video_test.py <workdir>
"""
import base64, json, os, subprocess, sys, time, urllib.request
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

OMNI_URL = "https://generativelanguage.googleapis.com/v1beta/interactions"
KEYS_ENV = Path.home() / ".config/api-keys/keys.env"


def _gemini_key():
    k = os.environ.get("GEMINI_API_KEY")
    if k:
        return k
    text = KEYS_ENV.read_text()
    import re
    return re.search(r'^export GEMINI_API_KEY=(.+)$', text, re.M).group(1).strip().strip('"')


def omni_animate(image_path: Path, prompt: str, out: Path, timeout=120):
    key = _gemini_key()
    img_b64 = base64.b64encode(image_path.read_bytes()).decode()
    body = json.dumps({
        "model": "gemini-omni-flash-preview",
        "input": [
            {"type": "image", "data": img_b64, "mime_type": "image/png"},
            {"type": "text", "text": prompt},
        ],
    }).encode()
    req = urllib.request.Request(f"{OMNI_URL}?key={key}", data=body,
                                  headers={"Content-Type": "application/json"})
    t0 = time.time()
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        d = json.loads(resp.read())
    for step in d.get("steps", []):
        for c in step.get("content", []) or []:
            if c.get("type") == "video":
                out.write_bytes(base64.b64decode(c["data"]))
                return True, time.time() - t0, d.get("usage", {}).get("total_output_tokens", 0)
    return False, time.time() - t0, 0


def main():
    workdir = Path(sys.argv[1]).expanduser()
    script = json.load(open(workdir / "script.json"))
    durs = json.load(open(workdir / "work/durations.json"))
    beats = [b for b in script["beats"] if b["vtype"] == "still"]

    omni_dir = workdir / "omni"; omni_dir.mkdir(exist_ok=True)
    clips_dir = workdir / "omni_clips"; clips_dir.mkdir(exist_ok=True)

    def gen_one(b):
        bid = b["id"]
        raw = omni_dir / f"{bid}_raw.mp4"
        img = workdir / "images" / f"{bid}.png"
        prompt = (f"Animate this documentary scene with subtle, realistic cinematic motion "
                  f"(slow camera drift, natural environmental movement — water, light, dust, "
                  f"whatever suits the scene). Muted, measured, atmospheric — matching the mood of: "
                  f"\"{b.get('vo', '')}\". No text, no titles, no people appearing.")
        ok, wall, otoks = omni_animate(img, prompt, raw)
        print(f"[omni] {bid} {'ok' if ok else 'FAIL'} ({wall:.1f}s, {otoks} tok)", flush=True)
        return bid, ok

    print(f"[omni] animating {len(beats)} stills via gemini-omni-flash-preview (parallel)...", flush=True)
    with ThreadPoolExecutor(max_workers=6) as ex:
        results = list(ex.map(gen_one, beats))
    failed = [bid for bid, ok in results if not ok]
    if failed:
        sys.exit(f"omni animation failed for: {failed}")

    total_omni_cost = sum(1 for _ in beats) * 10 * 0.10  # $0.10/s, all clips generated at ~10s
    print(f"[omni] all clips generated. est. cost ~${total_omni_cost:.2f} (10s x ${0.10}/s x {len(beats)} beats)")

    # ── trim each clip to the beat's narration length + small tail, mix audio ──
    TAIL = 0.6
    for b in beats:
        bid = b["id"]
        raw = omni_dir / f"{bid}_raw.mp4"
        clip_dur = round((durs[bid]["dur"] or 4.0) + TAIL, 2)
        narration = workdir / "audio" / f"{bid}.mp3"
        out = clips_dir / f"{bid}.mp4"
        has_narr = narration.exists() and narration.stat().st_size > 1000

        # trim the omni clip to clip_dur; mix its own audio (quiet bed) with narration (loud, primary)
        if has_narr:
            filter_complex = (
                f"[0:a]volume=0.22[bed];"
                f"[1:a]apad,atrim=0:{clip_dur}[narr];"
                f"[bed][narr]amix=inputs=2:duration=first:dropout_transition=0[a]"
            )
            cmd = ["ffmpeg", "-y", "-v", "error", "-t", str(clip_dur), "-i", str(raw),
                   "-i", str(narration),
                   "-filter_complex", filter_complex,
                   "-map", "0:v", "-map", "[a]",
                   "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p",
                   "-c:a", "aac", "-ar", "48000", "-shortest", str(out)]
        else:
            cmd = ["ffmpeg", "-y", "-v", "error", "-t", str(clip_dur), "-i", str(raw),
                   "-af", "volume=0.22",
                   "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p",
                   "-c:a", "aac", str(out)]
        r = subprocess.run(cmd, capture_output=True, text=True)
        ok = out.exists() and out.stat().st_size > 10000
        print(f"[mix] {bid} {'ok' if ok else 'FAIL: ' + r.stderr[-200:]} (dur={clip_dur}s)", flush=True)

    # ── concat with fades + loudnorm ──
    listf = workdir / "omni_concat.txt"
    listf.write_text("".join(f"file '{clips_dir / (b['id']+'.mp4')}'\n" for b in beats))
    concat_raw = workdir / "omni_concat_raw.mp4"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0",
                    "-i", str(listf), "-c", "copy", str(concat_raw)], check=True)

    final = workdir / "omni_final.mp4"
    dur_out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                              "-of", "csv=p=0", str(concat_raw)], capture_output=True, text=True)
    total_dur = float(dur_out.stdout.strip())
    fout = max(0.1, total_dur - 1.3)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(concat_raw),
                    "-vf", f"fade=t=in:st=0:d=0.8,fade=t=out:st={fout:.2f}:d=1.3",
                    "-af", f"loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.5,afade=t=out:st={fout:.2f}:d=1.3",
                    "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p",
                    "-c:a", "aac", "-ar", "48000", "-b:a", "192k", "-movflags", "+faststart",
                    str(final)], check=True)
    size_mb = final.stat().st_size / 1e6
    print(f"\n[done] {final} ({size_mb:.1f}MB, {total_dur:.1f}s)")


if __name__ == "__main__":
    main()
