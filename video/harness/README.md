# Video harness — topic → finished .mp4

A generic speed/cost probe for the video pipeline. One Anthropic API call
produces the full script.json (beats + image prompts + cards + grade),
then cards + TTS + images run in parallel, then ffmpeg assembles.

Built 2026-07-06 to answer "how fast and cheaply can we run the pipeline
end-to-end?" — per-phase wall + cost reported at the end.

## Usage

```bash
# long-form documentary
./run.py --topic "the Hinterkaifeck murders, 1922" \
         --format long --voice onyx \
         --register "atmospheric, eerie, lets documented strangeness carry dread" \
         --grade "Muted desaturated 1920s Bavarian still, snow, fog, no people, no faces" \
         --kicker "HINTERKAIFECK"

# short-form (5-6 stills, no cards)
./run.py --topic "X" --format short

# reuse a workdir (skip LLM, skip existing images)
./run.py --topic "X" --workdir /tmp/vh-test --skip-gen
```

Output: `<workdir>/final.mp4` + `summary.json` (machine-readable timings + costs).

## Defaults

- LLM: `claude-sonnet-5` via Anthropic API (~$0.04-0.07/script, ~15-50s)
- Images: `nano-banana-2-lite` via kie.ai ($0.02/still; advertised ~8s, observed 15-180s under load)
- TTS: `gpt-4o-mini-tts` ($0.015/1K chars, parallel max_workers=6)
- Cards: PIL-rendered (dark + amber house style, kicker + byclaude.net mark)

## What the first runs measured

Long form, 21 beats (13 stills + 8 cards), 2:00-2:40 narration:

| phase    | wall     | cost     | notes |
|----------|----------|----------|-------|
| gen LLM  | 28-48s   | $0.04-07 | one round-trip |
| cards    | 4-20s    | -        | PIL, parallel-safe with images+tts |
| tts      | 11-13s   | $0.03    | gpt-4o-mini-tts, parallel |
| images   | 170-260s | $0.26-28 | kie.ai nano-banana-2-lite, the bottleneck |
| video    | 5-180s   | -        | ffmpeg Ken-Burns + concat; fast when all stills land clean |
| **total** | **225-475s** | **$0.35** | per ~2:30 documentary |

**The clear finding:** image generation dominates wall-clock (kie.ai's
nano-banana-2-lite is advertised at ~8s but regularly takes 60-180s/image
under load, even at max_workers=5). TTS + LLM are negligible.
At the advertised ~8s/image the whole pipeline would land in ~2-3 min,
~$0.35 cost regardless.

## Architecture

- `gen_script.py` — Anthropic API call. Generic system prompt; the
  `script.json` shape it emits is documented inline. Override register /
  voice / grade via flags.
- `pipeline/pipeline.py` — `render_cards`, `render_tts`, `render_images`,
  `build_video` as importable functions. Adapted from the per-film
  scripts (`~/byclaude/video/<film>/*.py`) with the hardcoded BASE
  replaced by a parameter. The per-film clones are unchanged.
- `run.py` — orchestrator. Cards + TTS + images run as three
  `ThreadPoolExecutor` submissions in one process (the GIL is fine — each
  is I/O-bound on subprocess calls). `build_video` runs sequentially
  after they all resolve.

## Notes

- Failed images retry sequentially up to 2× after the parallel pass
  (kie.ai flakes under load).
- Beats with empty `vo` (e.g. a closing card with no narration) get a
  silent `anullsrc` audio track so concat alignment holds.
- Cost numbers bake in Sonnet 5 pricing ($3/$15 per 1M tokens) and
  kie.ai rates ($0.02/nano-banana-2-lite, $0.05/gpt-image-2 at 2K).
