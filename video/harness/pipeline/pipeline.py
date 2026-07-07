#!/usr/bin/env python3
"""pipeline.py — generalized build phases for the video harness.

Each phase takes (base_dir, script_dict, opts) and returns a dict of telemetry.
The orchestrator runs render_cards / render_tts / render_images concurrently,
then build_video once all three are done.

Adapted from the per-film scripts (~/byclaude/video/<film>/{cards,build_tts,build_images,build_video}.py)
with the hardcoded BASE replaced by an argument.
"""
from __future__ import annotations
import json, os, re, subprocess, sys, time, urllib.request, base64
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

from PIL import Image, ImageDraw, ImageFont
import numpy as np

GEN = Path.home() / ".claude/skills/ai-image-generation/generate-image.js"
FONTS = Path.home() / "byclaude/video/fonts"
KEYS_ENV = Path.home() / ".config/api-keys/keys.env"

# TTS pricing (gpt-4o-mini-tts): $15/1M chars (standard); mini tier = $0.015/1K = $15/1M.
TTS_RATE_PER_1K = 0.015
# Image pricing — kie.ai (gpt-image-2 = $0.05/2K still; nano-banana-2-lite = $0.02)
IMG_COST = {
    "gpt-image-2": 0.05,
    "nano-banana-2-lite": 0.02,
    "nano-banana": 0.04,
    # Google direct (gemini-3.1-flash-lite-image): $0.033/image at the published
    # $15/1M input + $0.04/1M output rates for the underlying Flash-Lite tier.
    # Treated as ~3.3¢ for cost telemetry; refine if Google publishes per-image pricing.
    "gemini-flash-lite": 0.033,
}

# Google Gemini direct endpoint. Sub-2s advertised, ~3s observed (2026-07-06).
GEMINI_MODEL = "gemini-3.1-flash-lite-image"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"


def _openai_key() -> str:
    text = KEYS_ENV.read_text()
    return re.search(r'^export OPENAI_API_KEY=(.+)$', text, re.M).group(1).strip().strip('"')


def _gemini_key() -> str:
    """Read Google AI key from env (preferred) or 1Password via `op`."""
    k = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if k: return k
    # fall back to op; this only works in interactive bash but worth trying
    try:
        r = subprocess.run(["op", "read", "op://Claude Code/Google AI DocADay/credential"],
                           capture_output=True, text=True, timeout=10)
        if r.returncode == 0 and r.stdout.strip():
            return r.stdout.strip()
    except Exception:
        pass
    raise RuntimeError("no Google/Gemini API key found (set GEMINI_API_KEY or run with op access)")


def gemini_image(prompt: str, out: Path, aspect_ratio: str = "16:9", timeout: int = 60) -> tuple:
    """Direct call to gemini-3.1-flash-lite-image. Returns (ok, wall_s, error)."""
    key = _gemini_key()
    body = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE", "TEXT"],
            "imageConfig": {"aspectRatio": aspect_ratio},
        },
    }).encode()
    req = urllib.request.Request(
        f"{GEMINI_URL}?key={key}",
        data=body,
        headers={"Content-Type": "application/json"},
    )
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            d = json.loads(resp.read())
    except Exception as e:
        return (False, time.time() - t0, f"http: {e}")
    dt = time.time() - t0
    cands = d.get("candidates", [])
    if not cands:
        return (False, dt, f"no candidates: {str(d)[:200]}")
    for p in cands[0].get("content", {}).get("parts", []):
        idata = p.get("inlineData") or p.get("inline_data")
        if idata and idata.get("data"):
            try:
                out.write_bytes(base64.b64decode(idata["data"]))
                return (True, dt, "")
            except Exception as e:
                return (False, dt, f"decode: {e}")
    return (False, dt, "no image part in response")


# ─── cards ───────────────────────────────────────────────────────────────────

S = 2
W, H = 1920 * S, 1080 * S
BG_TOP, BG_BOT = (12, 15, 21), (6, 8, 12)
INK = (236, 239, 244)
MUTE = (140, 149, 165)
DIM = (78, 87, 102)
ACCENT = (242, 169, 59)
RULE = (44, 51, 64)

def _font(name, size): return ImageFont.truetype(str(FONTS / name), size * S)
ANTON  = lambda s: _font("Anton-Regular.ttf", s)
BLACK  = lambda s: _font("Barlow-Black.ttf", s)
BOLD   = lambda s: _font("Barlow-Bold.ttf", s)
SEMI   = lambda s: _font("Barlow-SemiBold.ttf", s)
MED    = lambda s: _font("Barlow-Medium.ttf", s)
REG    = lambda s: _font("Barlow-Regular.ttf", s)
MONO   = lambda s: _font("IBMPlexMono-Medium.ttf", s)
MONOSB = lambda s: _font("IBMPlexMono-SemiBold.ttf", s)

_bg_cache = None
def _make_bg():
    global _bg_cache
    if _bg_cache is not None:
        return _bg_cache.copy()
    top = np.array(BG_TOP, float); bot = np.array(BG_BOT, float)
    t = np.linspace(0, 1, H)[:, None]
    grad = (top[None, :] * (1 - t) + bot[None, :] * t)
    arr = np.repeat(grad[:, None, :], W, axis=1).astype(np.uint8)
    img = Image.fromarray(arr, "RGB")
    d = ImageDraw.Draw(img)
    step = 84 * S
    for x in range(0, W, step):
        d.line([(x, 0), (x, H)], fill=(20, 24, 32), width=1)
    for y in range(0, H, step):
        d.line([(0, y), (W, y)], fill=(20, 24, 32), width=1)
    yy, xx = np.mgrid[0:H, 0:W]
    cx, cy = W / 2, H / 2
    r = np.sqrt(((xx - cx) / (W / 2))**2 + ((yy - cy) / (H / 2))**2)
    vig = np.clip(1 - 0.45 * np.clip(r - 0.35, 0, 1)**1.6, 0, 1)
    img = Image.fromarray((np.asarray(img, float) * vig[:, :, None]).astype(np.uint8), "RGB")
    _bg_cache = img
    return img.copy()

def _wrap(draw, text, font, maxw):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        cand = (cur + " " + w).strip()
        if draw.textlength(cand, font=font) <= maxw or not cur:
            cur = cand
        else:
            lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def _line_h(font):
    a, dsc = font.getmetrics(); return a + dsc

def _tracked(draw, x, y, text, font, fill, track):
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + track * S


def render_cards(base: Path, data: dict, kicker: str = "DOCUMENTARY", mark: str = "byclaude.net"):
    """Bake every card-type beat to work/<id>.png. Returns telemetry dict."""
    work = base / "work"; work.mkdir(parents=True, exist_ok=True)
    # defensive: treat anything with a `card` field as a card (some LLMs emit vtype=signoff/quote)
    cards = [b for b in data["beats"] if "card" in b or b.get("vtype") != "still"]
    t0 = time.time()
    count = 0
    for beat in cards:
        if "card" not in beat:
            continue  # safety: vtype!=still but no card field — skip
        _render_one_card(work, beat, kicker, mark)
        count += 1
    return {"phase": "cards", "count": count, "wall_s": round(time.time() - t0, 2)}


def _render_one_card(work: Path, beat: dict, kicker: str, mark: str):
    img = _make_bg(); d = ImageDraw.Draw(img)
    cx = W // 2
    # furniture
    kf = MONOSB(15)
    if kicker:
        d.rectangle([60 * S, 58 * S, 60 * S + 12 * S, 58 * S + 12 * S], fill=ACCENT)
        _tracked(d, 84 * S, 55 * S, kicker.upper(), kf, MUTE, 3)
    bf = MONO(15)
    d.text((W - 60 * S - d.textlength(mark, font=bf), H - 74 * S), mark, font=bf, fill=DIM)

    c = beat["card"]; kind = c["kind"]
    if kind == "quote":
        head_f, acc_f = MED(64), BLACK(82)
        hl = _wrap(d, c["head"], head_f, int(W * 0.78))
        al = _wrap(d, c["accent"], acc_f, int(W * 0.82))
        y0 = _block_y0(hl, head_f, al, acc_f)
        d.rectangle([cx - 40 * S, y0 - 46 * S, cx + 40 * S, y0 - 42 * S], fill=ACCENT)
        y = y0
        for ln in hl:
            d.text((cx, y), ln, font=head_f, fill=INK, anchor="ma"); y += _line_h(head_f) + 8 * S
        y += 18 * S
        for ln in al:
            d.text((cx, y), ln, font=acc_f, fill=ACCENT, anchor="ma"); y += _line_h(acc_f) + 4 * S
    elif kind == "bignum":
        big_f, unit_f, sub_f = ANTON(300), MED(56), REG(40)
        sub = c.get("sub", "")
        sub_l = _wrap(d, sub, sub_f, int(W * 0.7)) if sub else []
        unit_l = _wrap(d, c["unit"], unit_f, int(W * 0.7))
        bh = _line_h(big_f); uh = sum(_line_h(unit_f) for _ in unit_l)
        sh = sum(_line_h(sub_f) for _ in sub_l)
        total = sh + 28 * S + bh + 18 * S + uh
        y = (H - total) // 2
        for ln in sub_l:
            d.text((cx, y), ln, font=sub_f, fill=MUTE, anchor="ma"); y += _line_h(sub_f)
        y += 28 * S
        d.text((cx, y - 18 * S), c["big"], font=big_f, fill=ACCENT, anchor="ma"); y += bh + 18 * S
        for ln in unit_l:
            d.text((cx, y), ln, font=unit_f, fill=INK, anchor="ma"); y += _line_h(unit_f)
    elif kind == "stat2":
        num_f, lab_f = ANTON(168), REG(38)
        colx = [int(W * 0.29), int(W * 0.71)]
        d.line([(cx, int(H * 0.30)), (cx, int(H * 0.70))], fill=RULE, width=2 * S)
        cols = [(c["a_num"], c["a_lab"], INK), (c["b_num"], c["b_lab"], ACCENT)]
        for (num, lab, col), x in zip(cols, colx):
            d.text((x, int(H * 0.40)), num, font=num_f, fill=col, anchor="mm")
            ll = _wrap(d, lab, lab_f, int(W * 0.34))
            yy = int(H * 0.55)
            for ln in ll:
                d.text((x, yy), ln, font=lab_f, fill=MUTE, anchor="ma"); yy += _line_h(lab_f)
    elif kind == "stat3":
        title_f, num_f, lab_f = SEMI(52), BLACK(84), REG(38)
        rows = c["rows"]
        d.text((cx, int(H * 0.20)), c["title"], font=title_f, fill=INK, anchor="ma")
        d.line([(int(W*0.22), int(H*0.30)), (int(W*0.78), int(H*0.30))], fill=RULE, width=2*S)
        y = int(H * 0.36); numx = int(W * 0.46); labx = int(W * 0.50)
        for i, (num, lab) in enumerate(rows):
            col = ACCENT if i == len(rows) - 1 else INK
            d.text((numx, y), num, font=num_f, fill=col, anchor="ra")
            d.text((labx, y + 26 * S), lab, font=lab_f, fill=MUTE, anchor="la")
            y += int(H * 0.155)
    elif kind == "question":
        qf = SEMI(76)
        ql = _wrap(d, c["head"], qf, int(W * 0.74))
        th = sum(_line_h(qf) + 10 * S for _ in ql)
        y = (H - th) // 2
        d.rectangle([cx - 36*S, y - 44*S, cx + 36*S, y - 40*S], fill=ACCENT)
        for ln in ql:
            d.text((cx, y), ln, font=qf, fill=INK, anchor="ma"); y += _line_h(qf) + 10 * S
    elif kind == "cta":
        head_f, url_f, sub_f = MED(58), MONOSB(62), MONO(34)
        y = int(H * 0.34)
        d.text((cx, y), c["head"], font=head_f, fill=INK, anchor="ma"); y += _line_h(head_f) + 46 * S
        uw = d.textlength(c["line1"], font=url_f); pad = 34 * S
        d.rectangle([cx - uw/2 - pad, y - 10*S, cx + uw/2 + pad, y + _line_h(url_f) + 8*S],
                    outline=ACCENT, width=2 * S)
        d.text((cx, y), c["line1"], font=url_f, fill=ACCENT, anchor="ma"); y += _line_h(url_f) + 40 * S
        d.text((cx, y), c["line2"], font=sub_f, fill=MUTE, anchor="ma")
    elif kind == "signoff":
        head_f, acc_f, by_f = MED(78), BLACK(120), MONO(34)
        total = _line_h(head_f) + 6*S + _line_h(acc_f)
        y = (H - total) // 2 - 20 * S
        d.text((cx, y), c["head"], font=head_f, fill=INK, anchor="ma"); y += _line_h(head_f) + 6 * S
        d.text((cx, y), c["accent"], font=acc_f, fill=ACCENT, anchor="ma"); y += _line_h(acc_f) + 50 * S
        d.text((cx, y), c["by"], font=by_f, fill=MUTE, anchor="ma")
    else:
        raise ValueError(f"unknown card kind: {kind}")

    out = work / f"{beat['id']}.png"
    img.resize((1920, 1080), Image.LANCZOS).save(out)


def _block_y0(hl, hf, al, af):
    total = sum(_line_h(hf) + 8 * S for _ in hl) + 18 * S + sum(_line_h(af) + 4 * S for _ in al)
    return (H - total) // 2


# ─── TTS ──────────────────────────────────────────────────────────────────────

def render_tts(base: Path, data: dict, max_workers: int = 6):
    """gpt-4o-mini-tts per beat, parallel. Returns telemetry."""
    okey = _openai_key()
    adir = base / "audio"; adir.mkdir(parents=True, exist_ok=True)
    (base / "work").mkdir(parents=True, exist_ok=True)
    voice, instr = data["voice"], data["voice_instructions"]
    beats = data["beats"]
    t0 = time.time()
    char_total = 0

    def render(b):
        nonlocal char_total
        vo = (b.get("vo") or "").strip()
        out = adir / f"{b['id']}.mp3"
        if not vo:
            # silent beat (e.g. a closing card with no narration) — write a placeholder dur
            return (b["id"], 0, 1.6, 0)
        payload = json.dumps({"model": "gpt-4o-mini-tts", "voice": voice,
                              "input": vo, "instructions": instr})
        subprocess.run(["curl", "-s", "https://api.openai.com/v1/audio/speech",
                        "-H", f"Authorization: Bearer {okey}",
                        "-H", "Content-Type: application/json",
                        "-d", payload, "-o", str(out)], capture_output=True, text=True)
        d = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                            "-of", "csv=p=0", str(out)], capture_output=True, text=True)
        try: dur = round(float(d.stdout.strip()), 3)
        except Exception: dur = None
        sz = out.stat().st_size if out.exists() else 0
        return (b["id"], len(vo), dur, sz)

    res = {}
    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        for bid, chars, dur, sz in ex.map(render, beats):
            res[bid] = {"dur": dur, "sz": sz, "chars": chars}
            char_total += chars
    json.dump(res, open(base / "work/durations.json", "w"), indent=2)
    total = sum(v["dur"] for v in res.values() if v["dur"])
    return {
        "phase": "tts", "count": len(beats), "wall_s": round(time.time() - t0, 2),
        "chars": char_total, "narration_s": round(total, 1),
        "cost_usd": round(char_total / 1000 * TTS_RATE_PER_1K, 4),
    }


# ─── images ───────────────────────────────────────────────────────────────────

def render_images(base: Path, data: dict, model: str = "nano-banana-2-lite", max_workers: int = 5,
                  retries: int = 2):
    """Generate still beats in parallel.
    Failed images get retried sequentially after the parallel pass (kie.ai
    occasionally times out under load).

    Models:
      gemini-flash-lite       — Google direct (gemini-3.1-flash-lite-image), ~3s/image, $0.033
      nano-banana-2-lite      — via kie.ai skill, advertised ~8s (often 60-180s under load), $0.02
      gpt-image-2             — via kie.ai skill, ~30-40s, $0.05
    """
    imgdir = base / "images"; imgdir.mkdir(parents=True, exist_ok=True)
    grade = data.get("grade", "")
    stills = [b for b in data["beats"] if b["vtype"] == "still"]
    t0 = time.time()
    per_image_times = []
    use_gemini = model == "gemini-flash-lite"

    def run(b, attempt=1):
        out = imgdir / f"{b['id']}.png"
        if out.exists() and out.stat().st_size > 50000 and attempt == 1:
            return (b["id"], "skip", 0.0)
        prompt = b["img"] + " " + grade
        t = time.time()
        if use_gemini:
            ok, dt, err = gemini_image(prompt, out)
            status = "ok" if ok else f"FAIL: {err}"
            return (b["id"], status, dt)
        r = subprocess.run(["node", str(GEN), prompt, "--ratio", "16:9",
                            "--model", model, "--out", str(out)],
                           capture_output=True, text=True)
        ok = out.exists() and out.stat().st_size > 50000
        status = "ok" if ok else f"FAIL: {(r.stderr or '')[-150:]}"
        return (b["id"], status, time.time() - t)

    failures = []
    # pass 1 — parallel
    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        for bid, status, dt in ex.map(run, stills):
            if status.startswith("FAIL"):
                failures.append(bid)
            print(f"[img] {bid} {status} ({dt:.1f}s)", flush=True)
            per_image_times.append(round(dt, 1))

    # retry passes — sequential, with skip-logic for the ones that already worked
    for attempt in range(2, retries + 2):
        if not failures:
            break
        print(f"[img] retry pass {attempt}: {failures}", flush=True)
        still_failed = []
        for bid in failures:
            beat = next(b for b in stills if b["id"] == bid)
            bid_, status, dt = run(beat, attempt=attempt)
            print(f"[img] {bid} {status} ({dt:.1f}s, retry {attempt})", flush=True)
            if status.startswith("FAIL"):
                still_failed.append(bid)
        failures = still_failed

    return {
        "phase": "images", "count": len(stills), "failures": failures,
        "wall_s": round(time.time() - t0, 2),
        "per_image_s": per_image_times,
        "cost_usd": round(len(stills) * IMG_COST.get(model, 0.0), 4),
        "model": model,
    }


def build_video_per_clip(base: Path, data: dict, kicker: str = "DOCUMENTARY", mark: str = "byclaude.net",
                         out_name: str = "final.mp4", preset: str = "veryfast",
                         resolution: int = 1080, encoder: str = "libx264",
                         max_workers: int = 18, motion: str = "kenburns"):
    """Per-clip rendering: each beat → its own mp4 (parallel), then concat.

    Scales linearly up to N_beats parallel ffmpegs. On a many-core box this
    can be faster than single-filter (which is limited by filtergraph thread
    ceiling ~N_beats+8). Uses -c copy concat (no re-encode) + a separate
    loudnorm/fade audio pass.

    motion: "kenburns" (slow zoom, good for creepy/atmospheric) or "none"
    (static stills, good for general topics).
    """
    durs = json.load(open(base / "work/durations.json"))
    clips = base / "clips"; clips.mkdir(parents=True, exist_ok=True)
    caps = base / "work/caps"; caps.mkdir(parents=True, exist_ok=True)
    (base / "work").mkdir(parents=True, exist_ok=True)
    FPS = 30; TAIL = 0.5
    OUT_W, OUT_H = (1920, 1080) if resolution == 1080 else (1280, 720)
    beats = data["beats"]
    t0 = time.time()

    def asset(b):
        if b["vtype"] == "still": return base / "images" / f"{b['id']}.png"
        return base / "work" / f"{b['id']}.png"

    def render_caption(b):
        if b["vtype"] != "still": return None
        text = b.get("cap")
        if not text: return None
        img = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
        y0 = int(H * 0.58)
        for y in range(y0, H):
            a = int(205 * ((y - y0) / (H - y0)) ** 1.35)
            d.line([(0, y), (W, y)], fill=(4, 6, 9, a))
        kf = MONOSB(15)
        d.rectangle([60 * S, 58 * S, 60 * S + 12 * S, 58 * S + 12 * S], fill=ACCENT)
        _tracked(d, 84 * S, 55 * S, kicker.upper(), kf, MUTE, 3)
        bf = MONO(15)
        d.text((W - 60 * S - d.textlength(mark, font=bf), H - 74 * S), mark, font=bf, fill=DIM)
        f = MED(42)
        lines = _wrap(d, text, f, int(W * 0.80))
        lh = _line_h(f) + 8 * S
        th = lh * len(lines)
        ty = int(H * 0.90) - th
        cx = W // 2
        d.rectangle([cx - 34 * S, ty - 30 * S, cx + 34 * S, ty - 26 * S], fill=ACCENT)
        for ln in lines:
            d.text((cx, ty), ln, font=f, fill=(238, 241, 246), anchor="ma"); ty += lh
        out = caps / f"{b['id']}.png"
        img.resize((1920, 1080), Image.LANCZOS).save(out)
        return out

    # render caps
    cap_paths = {}
    with ThreadPoolExecutor(max_workers=4) as ex:
        futs = {ex.submit(render_caption, b): b["id"] for b in beats}
        for f in futs:
            bid = futs[f]; p = f.result()
            if p: cap_paths[bid] = p

    nvenc_preset_map = {"ultrafast": "p1", "superfast": "p2", "veryfast": "p3",
                        "faster": "p4", "fast": "p4", "medium": "p5"}
    use_nvenc = encoder == "h264_nvenc"

    def build_clip(args):
        idx, b = args
        bid = b["id"]; dur = durs[bid]["dur"]; clip = round(dur + TAIL, 3)
        frames = round(clip * FPS)
        img = asset(b); cap = cap_paths.get(bid)
        vt = b["vtype"]
        out = clips / f"{bid}.mp4"
        audio_path = base / "audio" / f"{bid}.mp3"
        has_audio = audio_path.exists() and audio_path.stat().st_size > 1000

        # fold fades into per-clip: fade-in on first, fade-out on last
        last_idx = len(beats) - 1
        v_fades, a_fades = [], []
        if idx == 0:
            v_fades.append("fade=t=in:st=0:d=0.8")
            a_fades.append("afade=t=in:st=0:d=0.5")
        if idx == last_idx:
            fo = max(0, clip - 1.3)
            v_fades.append(f"fade=t=out:st={fo:.2f}:d=1.3")
            a_fades.append(f"afade=t=out:st={fo:.2f}:d=1.3")
        vf = ("," + ",".join(v_fades)) if v_fades else ""
        af = ("," + ",".join(a_fades)) if a_fades else ""

        if motion == "none":
            # static still — loop the image for clip seconds, no zoom/pan
            ins = ["-loop", "1", "-t", str(clip), "-i", str(img)]
            if cap: ins += ["-i", str(cap)]
            if has_audio:
                ins += ["-i", str(audio_path)]
            else:
                ins += ["-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000"]
            a_idx = 1 + (1 if cap else 0)
            scale = f"scale={OUT_W}:{OUT_H}:force_original_aspect_ratio=increase,crop={OUT_W}:{OUT_H},fps={FPS}"
            v_chain = f"[0:v]{scale}[s];[s][1:v]overlay=0:0{vf}[v]" if cap else f"[0:v]{scale}{vf}[v]"
        else:
            # ken burns — very slow zoom to minimize zoompan jitter;
            # the integer pixel stepping in x/y is the jitter source,
            # slower zoom = fewer position changes per second = smoother
            z = "z='min(zoom+0.0003,1.06)'"
            zp = (f"zoompan={z}:d={frames}"
                  f":x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
                  f":s={OUT_W}x{OUT_H}:fps={FPS}")
            ins = ["-i", str(img)]
            if cap: ins += ["-i", str(cap)]
            if has_audio:
                ins += ["-i", str(audio_path)]
            else:
                ins += ["-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000"]
            a_idx = 1 + (1 if cap else 0)
            v_chain = f"[0:v]{zp}[kb];[kb][1:v]overlay=0:0{vf}[v]" if cap else f"[0:v]{zp}{vf}[v]"

        a_filter = f"aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,apad,atrim=0:{clip}{af}"
        fc = f"{v_chain};[{a_idx}:a]{a_filter}[a]"
        if use_nvenc:
            cmd = ["ffmpeg", "-y", *ins, "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
                   "-t", str(clip), "-c:v", "h264_nvenc", "-preset", nvenc_preset_map.get(preset, "p4"),
                   "-pix_fmt", "yuv420p", "-b:v", "4M", "-r", str(FPS),
                   "-c:a", "aac", "-ar", "48000", "-b:a", "192k",
                   "-movflags", "+faststart", str(out)]
        else:
            cmd = ["ffmpeg", "-y", *ins, "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
                   "-t", str(clip), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(FPS),
                   "-crf", "20", "-preset", preset, "-c:a", "aac", "-ar", "48000", "-b:a", "192k",
                   "-movflags", "+faststart", str(out)]
        r = subprocess.run(cmd, capture_output=True, text=True)
        ok = out.exists() and out.stat().st_size > 10000
        return (bid, clip, "ok" if ok else f"FAIL {r.stderr[-200:]}")

    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        clip_results = list(ex.map(build_clip, list(enumerate(beats))))

    # concat with -c copy (no re-encode — instant)
    listf = base / "work/concat.txt"
    listf.write_text("".join(f"file '{clips / (b['id']+'.mp4')}'\n" for b in beats))
    final = base / out_name
    total = sum(c for _, c, _ in clip_results)

    # concat to final — no re-encode (fades baked into clips; TTS audio already normalized)
    r = subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listf),
                        "-c", "copy", "-movflags", "+faststart", str(final)],
                       capture_output=True, text=True)
    ok = final.exists() and final.stat().st_size > 10000
    return {
        "phase": "video", "ok": ok,
        "wall_s": round(time.time() - t0, 2),
        "total_narration_s": round(total, 1),
        "final": str(final),
        "size_mb": round(final.stat().st_size / 1e6, 1) if ok else 0,
        "error": "" if ok else r.stderr[-400:],
    }


# ─── final video assembly ─────────────────────────────────────────────────────

def build_video(base: Path, data: dict, kicker: str = "DOCUMENTARY", mark: str = "byclaude.net",
                out_name: str = "final.mp4", preset: str = "veryfast",
                resolution: int = 1080, encoder: str = "libx264"):
    """Single-pass assembly: one ffmpeg call, one filter_complex.

    `resolution` is the output height in pixels (720 or 1080). Internal card
    rendering stays at 1080p supersampled for sharp text; the filter scales
    cap PNGs down to the output resolution before overlay.

    `encoder` is "libx264" (CPU, presets like veryfast/ultrafast) or
    "h264_nvenc" (NVIDIA GPU, presets p1-p7 where p1 is fastest).
    """
    durs = json.load(open(base / "work/durations.json"))
    caps = base / "work/caps"; caps.mkdir(parents=True, exist_ok=True)
    (base / "work").mkdir(parents=True, exist_ok=True)
    FPS = 30; TAIL = 0.5
    OUT_W, OUT_H = (1920, 1080) if resolution == 1080 else (1280, 720)
    beats = data["beats"]
    t0 = time.time()

    def asset(b):
        if b["vtype"] == "still": return base / "images" / f"{b['id']}.png"
        # card / signoff / quote / etc. — all rendered to work/<id>.png by render_cards
        return base / "work" / f"{b['id']}.png"

    def render_caption(b):
        if b["vtype"] != "still": return None
        text = b.get("cap")
        if not text: return None
        img = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
        y0 = int(H * 0.58)
        for y in range(y0, H):
            a = int(205 * ((y - y0) / (H - y0)) ** 1.35)
            d.line([(0, y), (W, y)], fill=(4, 6, 9, a))
        kf = MONOSB(15)
        d.rectangle([60 * S, 58 * S, 60 * S + 12 * S, 58 * S + 12 * S], fill=ACCENT)
        _tracked(d, 84 * S, 55 * S, kicker.upper(), kf, MUTE, 3)
        bf = MONO(15)
        d.text((W - 60 * S - d.textlength(mark, font=bf), H - 74 * S), mark, font=bf, fill=DIM)
        f = MED(42)
        lines = _wrap(d, text, f, int(W * 0.80))
        lh = _line_h(f) + 8 * S
        th = lh * len(lines)
        ty = int(H * 0.90) - th
        cx = W // 2
        d.rectangle([cx - 34 * S, ty - 30 * S, cx + 34 * S, ty - 26 * S], fill=ACCENT)
        for ln in lines:
            d.text((cx, ty), ln, font=f, fill=(238, 241, 246), anchor="ma"); ty += lh
        out = caps / f"{b['id']}.png"
        img.resize((1920, 1080), Image.LANCZOS).save(out)
        return out

    # ── Pass 1: render caps to disk (fast PIL work, threaded) ──────────────
    cap_paths = {}
    with ThreadPoolExecutor(max_workers=4) as ex:
        futs = {ex.submit(render_caption, b): b["id"] for b in beats}
        for f in futs:
            bid = futs[f]; p = f.result()
            if p: cap_paths[bid] = p

    # ── Pass 2: build inputs + filter_complex for one big ffmpeg call ───────
    inputs = []
    filter_parts = []
    concat_inputs = []
    next_input = 0  # input index counter
    total_dur = 0.0

    for idx, b in enumerate(beats):
        bid = b["id"]
        dur = durs[bid]["dur"]
        clip = round(dur + TAIL, 3)
        frames = round(clip * FPS)
        total_dur += clip

        # image input — single still (no -loop); zoompan's d=N generates N frames from this 1
        img_path = asset(b)
        inputs += ["-i", str(img_path)]
        img_in = next_input; next_input += 1

        # cap input (stills only)
        cap_in = None
        if bid in cap_paths:
            inputs += ["-i", str(cap_paths[bid])]
            cap_in = next_input; next_input += 1

        # audio input (mp3 if present, else anullsrc)
        audio_path = base / "audio" / f"{bid}.mp3"
        has_audio = audio_path.exists() and audio_path.stat().st_size > 1000
        if has_audio:
            inputs += ["-i", str(audio_path)]
        else:
            inputs += ["-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000"]
        aud_in = next_input; next_input += 1

        # zoompan expression (same shape as before)
        if b["vtype"] == "still":
            z = "z='min(zoom+0.0009,1.10)'" if idx % 2 == 0 else \
                "z='if(lte(on,1),1.10,max(zoom-0.0009,1.0))'"
        else:
            z = "z='min(zoom+0.00035,1.045)'"
        zp = (f"zoompan={z}:d={frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
              f":s={OUT_W}x{OUT_H}:fps={FPS}")

        v_label = f"v{idx}"; a_label = f"a{idx}"; kb_label = f"kb{idx}"
        if cap_in is not None:
            # cap PNGs render at 1080p; scale to output resolution before overlay
            if resolution != 1080:
                filter_parts.append(
                    f"[{img_in}:v]{zp}[{kb_label}];"
                    f"[{cap_in}:v]scale={OUT_W}:{OUT_H}[cap{idx}];"
                    f"[{kb_label}][cap{idx}]overlay=0:0,format=yuv420p,setsar=1[{v_label}]"
                )
            else:
                filter_parts.append(
                    f"[{img_in}:v]{zp}[{kb_label}];"
                    f"[{kb_label}][{cap_in}:v]overlay=0:0,format=yuv420p,setsar=1[{v_label}]"
                )
        else:
            filter_parts.append(
                f"[{img_in}:v]{zp},format=yuv420p,setsar=1[{v_label}]"
            )

        # audio: normalize to 48kHz stereo fltp, pad/trim to clip seconds
        if has_audio:
            filter_parts.append(
                f"[{aud_in}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,"
                f"apad,atrim=0:{clip}[{a_label}]"
            )
        else:
            filter_parts.append(
                f"[{aud_in}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,"
                f"atrim=0:{clip}[{a_label}]"
            )

        concat_inputs.append(f"[{v_label}][{a_label}]")

    # concat all segments
    concat_n = len(beats)
    filter_parts.append(
        "".join(concat_inputs) + f"concat=n={concat_n}:v=1:a=1[vcat][acat]"
    )

    # fades + loudnorm on the concatenated streams
    fout = max(0.1, total_dur - 1.3)
    filter_parts.append(
        f"[vcat]fade=t=in:st=0:d=0.8,fade=t=out:st={fout:.2f}:d=1.3[v]"
    )
    filter_parts.append(
        f"[acat]loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.5,"
        f"afade=t=out:st={fout:.2f}:d=1.3[a]"
    )

    filter_complex = ";".join(filter_parts)
    final = base / out_name

    # NVENC doesn't accept -pix_fmt yuv420p directly in the same way; it needs
    # the format in the filter chain (already there) and a compatible preset.
    # h264_nvenc presets: p1 (fastest) → p7 (slowest). Map common x264 presets.
    nvenc_preset_map = {"ultrafast": "p1", "superfast": "p2", "veryfast": "p3",
                        "faster": "p4", "fast": "p4", "medium": "p5"}
    if encoder == "h264_nvenc":
        nv_preset = nvenc_preset_map.get(preset, "p4")
        cmd = ["ffmpeg", "-y", *inputs,
               "-filter_complex", filter_complex,
               "-map", "[v]", "-map", "[a]",
               "-c:v", "h264_nvenc", "-preset", nv_preset, "-pix_fmt", "yuv420p",
               "-b:v", "4M",  # NVENC prefers bitrate to crf
               "-r", str(FPS),
               "-c:a", "aac", "-ar", "48000", "-b:a", "192k",
               "-movflags", "+faststart", str(final)]
    else:
        cmd = ["ffmpeg", "-y", *inputs,
               "-filter_complex", filter_complex,
               "-map", "[v]", "-map", "[a]",
               "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(FPS),
               "-crf", "19", "-preset", preset,
               "-c:a", "aac", "-ar", "48000", "-b:a", "192k",
               "-movflags", "+faststart", str(final)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    ok = final.exists() and final.stat().st_size > 10000
    return {
        "phase": "video", "ok": ok,
        "wall_s": round(time.time() - t0, 2),
        "total_narration_s": round(total_dur, 1),
        "final": str(final),
        "size_mb": round(final.stat().st_size / 1e6, 1) if ok else 0,
        "error": "" if ok else r.stderr[-400:],
    }


# ─── short-form vertical (9:16) ───────────────────────────────────────────────

def build_short(base: Path, data: dict, kicker: str = "DOCUMENTARY", mark: str = "byclaude.net",
                out_name: str = "final.mp4", preset: str = "ultrafast",
                max_workers: int = 6, motion: str = "kenburns"):
    """Vertical 1080x1920 short-form video: bg + kicker + still band + big caption.

    Uses pre-generated stills from base/images/. Composites each beat as a
    full frame (PIL), renders TTS, then assembles per-clip (parallel).
    """
    durs = json.load(open(base / "work/durations.json"))
    frames_dir = base / "frames"; frames_dir.mkdir(parents=True, exist_ok=True)
    clips = base / "clips"; clips.mkdir(parents=True, exist_ok=True)
    (base / "work").mkdir(parents=True, exist_ok=True)
    FPS = 30; TAIL = 0.35
    beats = data["beats"]
    t0 = time.time()

    SW, SH = 1080, 1920  # vertical
    BG = (11, 14, 19); AMBER = (242, 169, 59); INK = (236, 239, 244)
    GRID = (26, 30, 40); MUTE = (140, 149, 165); DIM = (78, 87, 102)

    def _sf(n, s): return ImageFont.truetype(str(FONTS / n), s)

    def bg_frame():
        img = Image.new("RGB", (SW, SH), BG)
        d = ImageDraw.Draw(img)
        step = SW // 9
        for x in range(0, SW, step): d.line([(x, 0), (x, SH)], fill=GRID, width=1)
        for y in range(0, SH, step): d.line([(0, y), (W, y)], fill=GRID, width=1)
        yy, xx = np.mgrid[0:SH, 0:SW]; cx, cy = SW / 2, SH / 2
        r = np.sqrt(((xx - cx) / (SW / 2))**2 + ((yy - cy) / (SH / 2))**2)
        vig = np.clip(1 - 0.5 * np.clip(r - 0.2, 0, 1)**1.6, 0, 1)
        return Image.fromarray((np.asarray(img, float) * vig[:, :, None]).astype(np.uint8), "RGB")

    def fit(d, text, fn, maxw, start, floor=46):
        s = start
        while s > floor:
            f = _sf(fn, s)
            if max(d.textlength(ln, font=f) for ln in text.split("\n")) <= maxw: return f
            s -= 3
        return _sf(fn, floor)

    def compose_frame(beat, idx, bg_img):
        img = bg_img.copy(); d = ImageDraw.Draw(img)
        # kicker
        if kicker:
            d.rectangle([70, 86, 92, 108], fill=AMBER)
            kf = _sf("IBMPlexMono-SemiBold.ttf", 28); kx = 108
            for ch in kicker.upper():
                d.text((kx, 82), ch, font=kf, fill=MUTE); kx += d.textlength(ch, font=kf) + 3
        cap_y = int(SH * 0.42)
        # still band (if beat has an image)
        if beat.get("vtype") == "still" and beat.get("img"):
            still_path = base / "images" / f"{beat['id']}.png"
            if still_path.exists():
                still = Image.open(still_path).convert("RGB")
                bh = int(SW * still.height / still.width)
                still = still.resize((SW, bh))
                by = 300
                img.paste(still, (0, by))
                d = ImageDraw.Draw(img)
                d.rectangle([0, by, SW - 1, by + bh - 1], outline=(40, 46, 58), width=2)
                cap_y = by + bh + 100
        # big caption
        cap = beat.get("cap", "")
        if cap:
            f = fit(d, cap, "Anton-Regular.ttf", SW - 130, start=130)
            col = AMBER if beat.get("amber") else INK
            y = cap_y
            for ln in cap.split("\n"):
                d.text((SW // 2, y), ln, font=f, fill=col, anchor="ma"); y += int(f.size * 1.04)
        # mark
        d.text((SW // 2, SH - 96), mark, font=_sf("IBMPlexMono-Medium.ttf", 28), fill=DIM, anchor="ma")
        out = frames_dir / f"{idx:02d}.png"
        img.save(out)
        return out

    # compose all frames (bg cached — same gradient/grid/vignette for every beat)
    _bg = bg_frame()
    frame_paths = []
    for idx, b in enumerate(beats):
        frame_paths.append(compose_frame(b, idx, _bg))

    # build clips in parallel
    def build_clip(args):
        idx, b = args
        bid = b["id"]; dur = durs.get(bid, {}).get("dur", 3.0)
        clip = round(dur + TAIL, 3)
        frames = round(clip * FPS)
        frame = frame_paths[idx]
        audio_path = base / "audio" / f"{bid}.mp3"
        has_audio = audio_path.exists() and audio_path.stat().st_size > 1000
        out = clips / f"{idx:02d}.mp4"

        ins = ["-loop", "1", "-i", str(frame)]
        if has_audio:
            ins += ["-i", str(audio_path)]
        else:
            ins += ["-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000"]
        a_idx = 1

        if motion == "kenburns":
            z = "z='min(zoom+0.0003,1.05)'"
            zp = f"zoompan={z}:d={frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={SW}x{SH}:fps={FPS}"
        else:
            zp = f"scale={SW}:{SH},fps={FPS}"

        # fold fades into per-clip: fade-in on first, fade-out on last
        last = len(beats) - 1
        v_fades, a_fades = [], []
        if idx == 0:
            v_fades.append("fade=t=in:st=0:d=0.4")
            a_fades.append("afade=t=in:st=0:d=0.3")
        if idx == last:
            fo = max(0, clip - 0.8)
            v_fades.append(f"fade=t=out:st={fo:.2f}:d=0.8")
            a_fades.append(f"afade=t=out:st={fo:.2f}:d=0.8")
        vf = ("," + ",".join(v_fades)) if v_fades else ""
        af = ("," + ",".join(a_fades)) if a_fades else ""
        a_filter = f"aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,apad,atrim=0:{clip}{af}"
        fc = f"[0:v]{zp}{vf}[v];[{a_idx}:a]{a_filter}[a]"
        cmd = ["ffmpeg", "-y", *ins, "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
               "-t", str(clip), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(FPS),
               "-crf", "20", "-preset", preset, "-c:a", "aac", "-ar", "48000", "-b:a", "192k",
               "-movflags", "+faststart", str(out)]
        r = subprocess.run(cmd, capture_output=True, text=True)
        ok = out.exists() and out.stat().st_size > 10000
        return (bid, clip, "ok" if ok else f"FAIL {r.stderr[-200:]}")

    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        clip_results = list(ex.map(build_clip, list(enumerate(beats))))

    # concat + fades + loudnorm
    listf = base / "work/concat.txt"
    clip_names = [clips / f"{i:02d}.mp4" for i in range(len(beats))]
    listf.write_text("".join(f"file '{c}'\n" for c in clip_names))
    final = base / out_name
    total = sum(c for _, c, _ in clip_results)

    # concat to final — no re-encode (fades baked into clips; TTS audio already normalized)
    r = subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listf),
                        "-c", "copy", "-movflags", "+faststart", str(final)],
                       capture_output=True, text=True)
    ok = final.exists() and final.stat().st_size > 10000
    return {
        "phase": "video", "ok": ok,
        "wall_s": round(time.time() - t0, 2),
        "total_narration_s": round(total, 1),
        "final": str(final),
        "size_mb": round(final.stat().st_size / 1e6, 1) if ok else 0,
        "error": "" if ok else r.stderr[-400:],
    }
