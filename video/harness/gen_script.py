#!/usr/bin/env python3
"""gen_script.py — one Anthropic API call → script.json in the shape the pipeline consumes.

Generic (no channel voice baked in). Pass --register to set tone/mood;
--voice to set the OpenAI TTS voice; --grade to override the image grade.

Usage:
  ./gen_script.py --topic "the Hinterkaifeck murders" --out /tmp/test/script.json
  ./gen_script.py --topic "X" --format short --register "eerie, atmospheric"
"""
import argparse, json, os, sys, time, urllib.request

API = "https://api.anthropic.com/v1/messages"
MODEL = "claude-sonnet-5"
# Sonnet 5 standard tier; override via --pricing if it changes.
PRICING = {"input": 3.0, "output": 15.0}  # $ per 1M tokens


def system_prompt(args):
    if args.format == "short":
        shape = SHORT_SHAPE
        beat_count = "5-6 beats"
    else:
        shape = LONG_SHAPE
        beat_count = "15-22 beats"
    return f"""You write tight, exact documentary video scripts. Output STRICT JSON only — no prose, no markdown, no commentary. The JSON must validate against this shape:

{shape}

Rules:
- {beat_count}, ordered. The first beat is the hook.
- Each `still` beat has: a single sentence of narration (`vo`), a short caption (`cap`, ~3-6 words, ALL CAPS suits the format), and an image prompt (`img`) describing ONE concrete scene (no people, no faces, no readable text/signage, no split-panel/diptych/collage — exactly one unified scene).
- ~30-40% of beats should be `card` beats (typographic, no image) carrying the load-bearing numbers or the lines that land — use them at dramatic pivot points, not bunched together.
- The `grade` describes the visual grade in TONE/COLOUR/ERA terms only — NEVER name two concrete locations in it (that triggers split-panel output).
- `voice_instructions` describes the TTS delivery register, not the content.
- Facts exact. Numbers load-bearing only if real. No invention, no embellishment, no legend dressed as fact. If uncertain, soften or omit.
- End on a card that closes the piece (signoff or a quiet line), not a call-to-action.

Return only the JSON object."""


LONG_SHAPE = """{
  "title": "string — the working title",
  "subtitle": "string — a one-line gloss",
  "voice": "onyx | alloy | echo | fable | onyx | nova | shimmer | sage | ash | coral",
  "voice_instructions": "string — TTS delivery register (e.g. 'Measured, quiet, documentary narration, unhurried, small pauses at periods.')",
  "grade": "string — tone/colour/era only, e.g. 'Muted desaturated 1990s British documentary still, overcast light, fine film grain, no text, no signage, no people, no faces.'",
  "beats": [
    { "id": "B01", "vtype": "still", "vo": "narration", "cap": "CAPTION", "img": "one concrete scene" },
    { "id": "B02", "vtype": "card", "vo": "narration",
      "card": { "kind": "bignum", "big": "215", "unit": "patients killed — confirmed", "sub": "optional context line" } },
    { "id": "B03", "vtype": "card", "vo": "narration",
      "card": { "kind": "quote", "head": "a line that lands.", "accent": "the line that doubles it." } }
  ]
}

Card kinds (use any of these):
  bignum: { "kind": "bignum", "big": "<large number or short word>", "unit": "<what it is>", "sub": "<optional context>" }
  quote:  { "kind": "quote",  "head": "<short declarative line>", "accent": "<the line that lands harder>" }
  stat2:  { "kind": "stat2",  "a_num": "<n>", "a_lab": "<label>", "b_num": "<n>", "b_lab": "<label>" }
  stat3:  { "kind": "stat3",  "title": "<title>", "rows": [["<n>", "<label>"], ...] }
  question: { "kind": "question", "head": "<the question, short>" }
  cta:    { "kind": "cta",    "head": "<headline>", "line1": "<url or word>", "line2": "<subline>" }
  signoff: { "kind": "signoff", "head": "<line>", "accent": "<bigger line>", "by": "<tiny line, e.g. 'byclaude.net'>" }"""

SHORT_SHAPE = """{
  "title": "string",
  "voice": "onyx | alloy | echo | fable | nova | shimmer | sage | ash | coral",
  "voice_instructions": "string — TTS register",
  "grade": "string — tone/colour/era only",
  "beats": [
    { "id": "B01", "vtype": "still", "vo": "narration", "cap": "CAPTION", "img": "one concrete scene" }
  ]
}

Short format: stills only (no cards), 5-6 beats, the first beat is the hook and the last closes."""

USER_TEMPLATE = """Topic: {topic}

Register preference: {register}
Voice preference: {voice}
Grade preference: {grade}

Write the script. Output only the JSON object."""


def call(req):
    body = json.dumps(req).encode()
    r = urllib.request.Request(API, data=body, headers={
        "x-api-key": os.environ["ANTHROPIC_API_KEY"],
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    })
    t0 = time.time()
    with urllib.request.urlopen(r, timeout=180) as resp:
        out = json.loads(resp.read())
    dt = time.time() - t0
    return out, dt


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--topic", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--format", choices=["short", "long"], default="long")
    ap.add_argument("--register", default="documentary, measured, unhurried, lets facts carry the weight")
    ap.add_argument("--voice", default="onyx")
    ap.add_argument("--grade", default="")
    ap.add_argument("--max-tokens", type=int, default=8000)
    args = ap.parse_args()

    if "ANTHROPIC_API_KEY" not in os.environ:
        sys.exit("error: ANTHROPIC_API_KEY not in env")

    sys_p = system_prompt(args)
    user_p = USER_TEMPLATE.format(
        topic=args.topic,
        register=args.register or "(unspecified — your call)",
        voice=args.voice or "(unspecified — pick to suit the register)",
        grade=args.grade or "(unspecified — pick to suit topic and register)",
    )

    req = {
        "model": MODEL,
        "max_tokens": args.max_tokens,
        "system": sys_p,
        "messages": [{"role": "user", "content": user_p}],
    }
    print(f"[gen] calling {MODEL} for '{args.topic}' ({args.format})", flush=True)
    resp, dt = call(req)

    # strip any accidental markdown wrappers
    text = "".join(b.get("text", "") for b in resp["content"] if b.get("type") == "text").strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
    try:
        script = json.loads(text)
    except json.JSONDecodeError as e:
        sys.exit(f"error: model returned invalid JSON: {e}\n--- raw ---\n{text[:1500]}")

    # write atomically-ish
    with open(args.out, "w") as f:
        json.dump(script, f, indent=2, ensure_ascii=False)

    usage = resp.get("usage", {})
    itok = usage.get("input_tokens", 0)
    otok = usage.get("output_tokens", 0)
    cost = (itok / 1e6 * PRICING["input"]) + (otok / 1e6 * PRICING["output"])
    beats = len(script.get("beats", []))
    print(f"[gen] {beats} beats, {itok}+{otok} tok, ${cost:.4f}, {dt:.1f}s → {args.out}", flush=True)

    # machine-readable sidecar for the orchestrator
    sidecar = args.out.rsplit(".", 1)[0] + ".meta.json"
    with open(sidecar, "w") as f:
        json.dump({
            "llm_model": MODEL,
            "input_tokens": itok, "output_tokens": otok,
            "llm_cost_usd": round(cost, 6), "wall_s": round(dt, 2),
            "format": args.format,
        }, f, indent=2)


if __name__ == "__main__":
    main()
