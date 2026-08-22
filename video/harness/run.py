#!/usr/bin/env python3
"""run.py — orchestrator for the video harness.

One command: topic → finished .mp4, with per-phase timing + cost.

  ./run.py --topic "the Hinterkaifeck murders, 1922"
  ./run.py --topic "X" --format short --register "eerie, atmospheric" --model nano-banana-2-lite
  ./run.py --topic "X" --workdir /tmp/test   # reuse a workdir; skips re-gen if script.json exists

Phases (after gen_script writes script.json):
  cards + tts + images  run in PARALLEL (no interdependencies — each reads script.json)
  video                  runs after all three finish
"""
from __future__ import annotations
import argparse, json, os, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE / "pipeline"))
import pipeline as P


def fmt_cost(c):
    return f"${c:.4f}" if c < 1 else f"${c:.2f}"


def run_gen_script(args, workdir: Path):
    script_path = workdir / "script.json"
    if script_path.exists() and not args.regenerate:
        # use existing; skip the LLM call entirely
        meta_path = workdir / "script.meta.json"
        meta = json.load(open(meta_path)) if meta_path.exists() else {}
        print(f"[gen] reusing existing {script_path}", flush=True)
        return meta
    cmd = [
        sys.executable, str(HERE / "gen_script.py"),
        "--topic", args.topic,
        "--out", str(script_path),
        "--format", args.format,
        "--kind", args.kind,
        "--register", args.register,
        "--voice", args.voice,
        "--llm", args.llm,
    ]
    if args.grade: cmd += ["--grade", args.grade]
    env = os.environ.copy()
    needed = {"sonnet-5": "ANTHROPIC_API_KEY", "glm-5.2": "BASETEN_API_KEY",
              "glm-5.2-fireworks": "FIREWORKS_API_KEY", "gpt-oss-120b": "FIREWORKS_API_KEY"}
    key_env = needed.get(args.llm, "ANTHROPIC_API_KEY")
    if key_env not in env:
        sys.exit(f"error: {key_env} not in env (needed for --llm {args.llm})")
    r = subprocess.run(cmd, env=env)
    if r.returncode != 0:
        sys.exit(f"error: gen_script.py failed (exit {r.returncode})")
    return json.load(open(workdir / "script.meta.json"))


def main():
    ap = argparse.ArgumentParser(description="Generic video pipeline harness — topic → finished mp4.")
    ap.add_argument("--topic", required=True)
    ap.add_argument("--workdir", default=None,
                    help="defaults to ~/byclaude/video/_bench/<timestamp>")
    ap.add_argument("--format", choices=["short", "long"], default="long")
    ap.add_argument("--kind", choices=["documentary", "story"], default="documentary",
                    help="documentary=factual nonfiction; story=short literary fiction")
    ap.add_argument("--llm", default="sonnet-5",
                    choices=["sonnet-5", "glm-5.2", "glm-5.2-fireworks", "gpt-oss-120b"])
    ap.add_argument("--preset", default="veryfast",
                    choices=["ultrafast", "superfast", "veryfast", "faster", "fast", "medium"])
    ap.add_argument("--resolution", type=int, default=1080, choices=[720, 1080])
    ap.add_argument("--encoder", default="libx264", choices=["libx264", "h264_nvenc"])
    ap.add_argument("--mode", default="single", choices=["single", "perclip"],
                    help="single=one ffmpeg filtergraph; perclip=N parallel ffmpegs + concat copy")
    ap.add_argument("--motion", default="kenburns", choices=["kenburns", "none"],
                    help="kenburns=slow zoom (good for creepy); none=static stills (general topics)")
    ap.add_argument("--max-workers", type=int, default=18,
                    help="per-clip mode: parallel ffmpeg count (default = N_beats)")
    ap.add_argument("--register", default="documentary, measured, unhurried, lets facts carry the weight")
    ap.add_argument("--voice", default="onyx")
    ap.add_argument("--tts", default="openai", choices=["openai", "gemini"],
                    help="openai=gpt-4o-mini-tts (needs OPENAI_API_KEY, prepaid credit); "
                         "gemini=gemini-2.5-flash-preview-tts (needs GEMINI_API_KEY, no separate top-up)")
    ap.add_argument("--grade", default="")
    ap.add_argument("--model", default="gemini-flash-lite",
                    choices=["gemini-flash-lite", "nano-banana-2-lite", "gpt-image-2", "nano-banana"])
    ap.add_argument("--kicker", default="DOCUMENTARY")
    ap.add_argument("--mark", default="byclaude.net")
    ap.add_argument("--out-name", default="final.mp4")
    ap.add_argument("--regenerate", action="store_true",
                    help="re-run the LLM script-gen even if script.json exists")
    ap.add_argument("--skip-gen", action="store_true",
                    help="skip gen_script entirely (use existing script.json in workdir)")
    args = ap.parse_args()

    workdir = Path(args.workdir).expanduser() if args.workdir else \
        Path.home() / f"byclaude/video/_bench/{time.strftime('%Y%m%d-%H%M%S')}"
    workdir.mkdir(parents=True, exist_ok=True)
    print(f"[run] workdir: {workdir}", flush=True)

    overall_t0 = time.time()

    # ── Phase 1: LLM gen (or skip) ──────────────────────────────────────────
    if args.skip_gen:
        if not (workdir / "script.json").exists():
            sys.exit(f"error: --skip-gen but no script.json in {workdir}")
        gen_meta = {}
        print("[gen] skipped (--skip-gen)", flush=True)
    else:
        gen_meta = run_gen_script(args, workdir)

    script = json.load(open(workdir / "script.json"))
    beats = script.get("beats", [])
    stills = sum(1 for b in beats if b.get("vtype") == "still")
    cards = sum(1 for b in beats if b.get("vtype") == "card")
    print(f"[run] {len(beats)} beats ({stills} stills, {cards} cards), voice={script.get('voice')}", flush=True)

    # ── Phase 2: cards + tts + images IN PARALLEL ───────────────────────────
    fan_t0 = time.time()
    with ThreadPoolExecutor(max_workers=3) as ex:
        fut_cards = ex.submit(P.render_cards, workdir, script, args.kicker, args.mark)
        fut_tts   = ex.submit(P.render_tts,   workdir, script, provider=args.tts)
        fut_imgs  = ex.submit(P.render_images, workdir, script, args.model)
        cards_t = fut_cards.result()
        tts_t   = fut_tts.result()
        imgs_t  = fut_imgs.result()
    fan_wall = time.time() - fan_t0
    print(f"[run] fan-out done (cards+tts+images) in {fan_wall:.1f}s", flush=True)

    if imgs_t["failures"]:
        print(f"[run] WARN: {len(imgs_t['failures'])} image failures: {imgs_t['failures']}", flush=True)

    # ── Phase 3: video assembly ─────────────────────────────────────────────
    if args.format == "short":
        vid_t = P.build_short(workdir, script, args.kicker, args.mark, args.out_name,
                              preset=args.preset, max_workers=args.max_workers,
                              motion=args.motion, encoder=args.encoder)
    elif args.mode == "perclip":
        vid_t = P.build_video_per_clip(workdir, script, args.kicker, args.mark, args.out_name,
                                       preset=args.preset, resolution=args.resolution,
                                       encoder=args.encoder, max_workers=args.max_workers,
                                       motion=args.motion)
    else:
        vid_t = P.build_video(workdir, script, args.kicker, args.mark, args.out_name,
                              preset=args.preset, resolution=args.resolution,
                              encoder=args.encoder)

    overall_dt = time.time() - overall_t0

    # ── Report ──────────────────────────────────────────────────────────────
    total_cost = (gen_meta.get("llm_cost_usd", 0)
                  + tts_t["cost_usd"]
                  + imgs_t["cost_usd"])

    print()
    print("=" * 68)
    print(f"  TOPIC     {args.topic}")
    print(f"  FORMAT    {args.format}  ·  {len(beats)} beats ({stills} stills + {cards} cards)")
    llm_label = {"sonnet-5": "claude-sonnet-5",
                 "glm-5.2": "GLM-5.2 (Baseten)",
                 "glm-5.2-fireworks": "GLM-5.2-fast (Fireworks)",
                 "gpt-oss-120b": "gpt-oss-120b (Fireworks)"}[args.llm]
    tts_label = "gemini-2.5-flash-preview-tts" if args.tts == "gemini" else "gpt-4o-mini-tts"
    print(f"  MODEL     LLM: {llm_label}   images: {args.model}   TTS: {tts_label}")
    print(f"  ENCODER   preset={args.preset}   resolution={args.resolution}p")
    print("-" * 68)
    print(f"  PHASE           WALL       COST        DETAIL")
    print(f"  gen (LLM)       {gen_meta.get('wall_s', 0):>6.1f}s    {fmt_cost(gen_meta.get('llm_cost_usd', 0))}     "
          f"{gen_meta.get('input_tokens', 0)}+{gen_meta.get('output_tokens', 0)} tok")
    print(f"  cards           {cards_t['wall_s']:>6.1f}s    -           {cards_t['count']} baked")
    print(f"  tts             {tts_t['wall_s']:>6.1f}s    {fmt_cost(tts_t['cost_usd'])}     "
          f"{tts_t['chars']} chars → {tts_t['narration_s']}s narration")
    print(f"  images          {imgs_t['wall_s']:>6.1f}s    {fmt_cost(imgs_t['cost_usd'])}     "
          f"{imgs_t['count']} stills")
    if imgs_t["per_image_s"]:
        p = imgs_t["per_image_s"]
        print(f"    per-image     avg {sum(p)/len(p):.1f}s    "
              f"min {min(p):.1f}s    max {max(p):.1f}s    (parallel)")
    print(f"  fan-out wall    {fan_wall:>6.1f}s    -           (cards+tts+images parallel)")
    print(f"  video           {vid_t['wall_s']:>6.1f}s    -           "
          f"{'OK' if vid_t['ok'] else 'FAIL'}  {vid_t['size_mb']}MB")
    print("-" * 68)
    print(f"  TOTAL WALL      {overall_dt:>6.1f}s    {fmt_cost(total_cost)}")
    print(f"  TOTAL COST                {fmt_cost(total_cost)}")
    print(f"  NARRATION                {tts_t['narration_s']}s ({tts_t['narration_s']/60:.2f} min)")
    if vid_t["ok"]:
        print(f"  OUTPUT                   {vid_t['final']}")
    print("=" * 68)

    # machine-readable summary
    summary = {
        "topic": args.topic,
        "format": args.format,
        "beats": len(beats), "stills": stills, "cards": cards,
        "gen": gen_meta,
        "cards": cards_t,
        "tts": tts_t,
        "images": imgs_t,
        "video": vid_t,
        "fan_wall_s": round(fan_wall, 2),
        "total_wall_s": round(overall_dt, 2),
        "total_cost_usd": round(total_cost, 4),
    }
    with open(workdir / "summary.json", "w") as f:
        json.dump(summary, f, indent=2)
    print(f"[run] summary → {workdir}/summary.json", flush=True)


if __name__ == "__main__":
    main()
