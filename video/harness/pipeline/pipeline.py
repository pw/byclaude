#!/usr/bin/env python3
"""pipeline.py — generalized build phases for the video harness.

Each phase takes (base_dir, script_dict, opts) and returns a dict of telemetry.
The orchestrator runs render_cards / render_tts / render_images concurrently,
then build_video once all three are done.

Adapted from the per-film scripts (~/byclaude/video/<film>/{cards,build_tts,build_images,build_video}.py)
with the hardcoded BASE replaced by an argument.
"""
from __future__ import annotations
import json, re, subprocess, sys, time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

from PIL import Image, ImageDraw, ImageFont
import numpy as np

GEN = Path.home() / ".claude/skills/ai-image-generation/generate-image.js"
FONTS = Path.home() / "byclaude/video/fonts"
KEYS_ENV = Path.home() / ".config/api-keys/keys.env"

# TTS pricing (gpt-4o-mini-tts): $15/1M chars (standard); mini tier = $0.015/1K = $15/1M.
TTS_RATE_PER_1K = 0.015
# Image pricing (kie.ai: gpt-image-2 = $0.05/2K still; nano-banana-2-lite = $0.02)
IMG_COST = {
    "gpt-image-2": 0.05,
    "nano-banana-2-lite": 0.02,
    "nano-banana": 0.04,
}


def _openai_key() -> str:
    text = KEYS_ENV.read_text()
    return re.search(r'^export OPENAI_API_KEY=(.+)$', text, re.M).group(1).strip().strip('"')


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
    cards = [b for b in data["beats"] if b["vtype"] == "card"]
    t0 = time.time()
    count = 0
    for beat in cards:
        _render_one_card(work, beat, kicker, mark)
        count += 1
    return {"phase": "cards", "count": count, "wall_s": round(time.time() - t0, 2)}


def _render_one_card(work: Path, beat: dict, kicker: str, mark: str):
    img = _make_bg(); d = ImageDraw.Draw(img)
    cx = W // 2
    # furniture
    kf = MONOSB(15)
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
    """Generate still beats in parallel via the ai-image-generation skill.
    Failed images get retried sequentially after the parallel pass (kie.ai
    occasionally times out under load)."""
    imgdir = base / "images"; imgdir.mkdir(parents=True, exist_ok=True)
    grade = data.get("grade", "")
    stills = [b for b in data["beats"] if b["vtype"] == "still"]
    t0 = time.time()
    per_image_times = []

    def run(b, attempt=1):
        out = imgdir / f"{b['id']}.png"
        if out.exists() and out.stat().st_size > 50000 and attempt == 1:
            return (b["id"], "skip", 0.0)
        prompt = b["img"] + " " + grade
        t = time.time()
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


# ─── final video assembly ─────────────────────────────────────────────────────

def build_video(base: Path, data: dict, kicker: str = "DOCUMENTARY", mark: str = "byclaude.net",
                out_name: str = "final.mp4"):
    """Per-beat Ken-Burns + captions on stills → concat → fades → loudnorm."""
    durs = json.load(open(base / "work/durations.json"))
    clips = base / "clips"; clips.mkdir(parents=True, exist_ok=True)
    caps = base / "work/caps"; caps.mkdir(parents=True, exist_ok=True)
    FPS = 30; TAIL = 0.5
    beats = data["beats"]
    t0 = time.time()

    def asset(b):
        if b["vtype"] == "still": return base / "images" / f"{b['id']}.png"
        return base / "work" / f"{b['id']}.png"

    def make_caption(b):
        if b["vtype"] != "still": return None
        text = b.get("cap")
        if not text: return None
        img = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
        y0 = int(H * 0.58)
        for y in range(y0, H):
            a = int(205 * ((y - y0) / (H - y0)) ** 1.35)
            d.line([(0, y), (W, y)], fill=(4, 6, 9, a))
        # furniture (caption overlays stills, so include the kicker/mark)
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

    def build_clip(args):
        idx, b = args
        bid = b["id"]; dur = durs[bid]["dur"]; clip = round(dur + TAIL, 3)
        frames = round(clip * FPS)
        img = asset(b); cap = make_caption(b)
        vt = b["vtype"]
        if vt == "still":
            z = "z='min(zoom+0.0009,1.10)'" if idx % 2 == 0 else "z='if(lte(on,1),1.10,max(zoom-0.0009,1.0))'"
        else:
            z = "z='min(zoom+0.00035,1.045)'"
        zp = (f"zoompan={z}:d={frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
              f":s=1920x1080:fps={FPS}")
        out = clips / f"{bid}.mp4"
        audio_path = base / "audio" / f"{bid}.mp3"
        has_audio = audio_path.exists() and audio_path.stat().st_size > 1000
        ins = ["-loop", "1", "-i", str(img)]
        n_inputs = 1
        if cap:
            ins += ["-i", str(cap)]
            n_inputs = 2
        if has_audio:
            ins += ["-i", str(audio_path)]
        else:
            ins += ["-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000"]
        a_idx = n_inputs  # audio is the input right after img(+cap): img=0, cap=1, audio=1or2
        v_chain = f"[0:v]{zp}[kb];[kb][1:v]overlay=0:0[v]" if cap else f"[0:v]{zp}[v]"
        a_filter = "apad" if has_audio else f"atrim=0:{clip}"
        fc = f"{v_chain};[{a_idx}:a]{a_filter}[a]"
        cmd = ["ffmpeg", "-y", *ins, "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
               "-t", str(clip), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(FPS),
               "-crf", "20", "-preset", "medium", "-c:a", "aac", "-ar", "48000", "-b:a", "192k",
               "-movflags", "+faststart", str(out)]
        r = subprocess.run(cmd, capture_output=True, text=True)
        ok = out.exists() and out.stat().st_size > 10000
        return (bid, clip, "ok" if ok else f"FAIL {r.stderr[-300:]}")

    with ThreadPoolExecutor(max_workers=4) as ex:
        clip_results = list(ex.map(build_clip, list(enumerate(beats))))
    for bid, clip, st in clip_results:
        if st != "ok":
            print(f"[vid] WARN {bid}: {st[:150]}", flush=True)

    listf = base / "work/concat.txt"
    listf.write_text("".join(f"file '{clips / (b['id']+'.mp4')}'\n" for b in beats))
    final = base / out_name
    total = sum(c for _, c, _ in clip_results)
    fout = max(0.1, total - 1.3)
    vf = f"fade=t=in:st=0:d=0.8,fade=t=out:st={fout:.2f}:d=1.3"
    af = f"loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.5,afade=t=out:st={fout:.2f}:d=1.3"
    cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listf),
           "-vf", vf, "-af", af, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(FPS),
           "-crf", "19", "-preset", "medium", "-c:a", "aac", "-ar", "48000", "-b:a", "192k",
           "-movflags", "+faststart", str(final)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    ok = final.exists() and final.stat().st_size > 10000
    return {
        "phase": "video", "ok": ok,
        "wall_s": round(time.time() - t0, 2),
        "total_narration_s": round(total, 1),
        "final": str(final),
        "size_mb": round(final.stat().st_size / 1e6, 1) if ok else 0,
        "error": "" if ok else r.stderr[-300:],
    }
