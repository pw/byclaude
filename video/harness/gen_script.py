#!/usr/bin/env python3
"""gen_script.py — one LLM API call → script.json in the shape the pipeline consumes.

Generic (no channel voice baked in). Pass --register to set tone/mood;
--voice to set the OpenAI TTS voice; --grade to override the image grade.

Usage:
  ./gen_script.py --topic "the Hinterkaifeck murders" --out /tmp/test/script.json
  ./gen_script.py --topic "X" --format short --llm glm-5.2  # fast tier
  ./gen_script.py --topic "X" --llm sonnet-5               # quality tier (default)
"""
import argparse, json, os, sys, time, urllib.request

API_ANTHROPIC = "https://api.anthropic.com/v1/messages"
API_BASETEN = "https://inference.baseten.co/v1/chat/completions"

# (model_id, pricing_per_1M_tokens_in/out, endpoint_family)
LLMS = {
    "sonnet-5":  ("claude-sonnet-5",                {"input": 3.0, "output": 15.0}, "anthropic"),
    "glm-5.2":   ("zai-org/GLM-5.2",                {"input": 0.6, "output": 2.2},  "openai"),
    "glm-5.2-turbo": ("zai-org/GLM-5.2",            {"input": 0.6, "output": 2.2},  "openai"),  # alias
}


def system_prompt(args):
    if args.format == "short":
        shape = SHORT_SHAPE
        beat_count = "5-6 beats, ALL stills (no cards, no vtype=card)"
    else:
        shape = LONG_SHAPE
        beat_count = "15-22 beats"
    return f"""You write tight, exact documentary video scripts. Output STRICT JSON only — no prose, no markdown, no commentary. The JSON must validate against this shape:

{shape}

Rules:
- {beat_count}, ordered. The first beat is the hook.
- Every beat MUST have non-empty `vo` (the narration). Never empty, never null.
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

Short format: stills ONLY — no cards, no vtype=card. 5-6 beats, the first is the hook and the last closes."""


USER_TEMPLATE = """Topic: {topic}

Register preference: {register}
Voice preference: {voice}
Grade preference: {grade}

Write the script. Output only the JSON object."""


def call_anthropic(model, sys_p, user_p, max_tokens):
    body = json.dumps({
        "model": model, "max_tokens": max_tokens,
        "system": sys_p, "messages": [{"role": "user", "content": user_p}],
    }).encode()
    r = urllib.request.Request(API_ANTHROPIC, data=body, headers={
        "x-api-key": os.environ["ANTHROPIC_API_KEY"],
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    })
    t0 = time.time()
    with urllib.request.urlopen(r, timeout=180) as resp:
        out = json.loads(resp.read())
    dt = time.time() - t0
    text = "".join(b.get("text", "") for b in out["content"] if b.get("type") == "text")
    usage = out.get("usage", {})
    usage = {"input_tokens": usage.get("input_tokens", 0), "output_tokens": usage.get("output_tokens", 0)}
    return text, dt, usage


def call_baseten(model, sys_p, user_p, max_tokens):
    body = json.dumps({
        "model": model, "max_tokens": max_tokens,
        "response_format": {"type": "json_object"},
        "messages": [{"role": "system", "content": sys_p},
                     {"role": "user", "content": user_p}],
    }).encode()
    r = urllib.request.Request(API_BASETEN, data=body, headers={
        "Authorization": f"Bearer {os.environ['BASETEN_API_KEY']}",
        "content-type": "application/json",
    })
    t0 = time.time()
    with urllib.request.urlopen(r, timeout=180) as resp:
        out = json.loads(resp.read())
    dt = time.time() - t0
    text = out["choices"][0]["message"]["content"]
    u = out.get("usage", {})
    usage = {"input_tokens": u.get("prompt_tokens", 0), "output_tokens": u.get("completion_tokens", 0)}
    return text, dt, usage


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--topic", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--format", choices=["short", "long"], default="long")
    ap.add_argument("--register", default="documentary, measured, unhurried, lets facts carry the weight")
    ap.add_argument("--voice", default="onyx")
    ap.add_argument("--grade", default="")
    ap.add_argument("--max-tokens", type=int, default=8000)
    ap.add_argument("--llm", default="sonnet-5", choices=list(LLMS.keys()))
    args = ap.parse_args()

    model_id, pricing, family = LLMS[args.llm]
    if family == "anthropic" and "ANTHROPIC_API_KEY" not in os.environ:
        sys.exit("error: ANTHROPIC_API_KEY not in env")
    if family == "openai" and "BASETEN_API_KEY" not in os.environ:
        sys.exit("error: BASETEN_API_KEY not in env")

    sys_p = system_prompt(args)
    user_p = USER_TEMPLATE.format(
        topic=args.topic,
        register=args.register or "(unspecified — your call)",
        voice=args.voice or "(unspecified — pick to suit the register)",
        grade=args.grade or "(unspecified — pick to suit topic and register)",
    )

    print(f"[gen] calling {model_id} ({family}) for '{args.topic}' ({args.format})", flush=True)
    if family == "anthropic":
        text, dt, usage = call_anthropic(model_id, sys_p, user_p, args.max_tokens)
    else:
        text, dt, usage = call_baseten(model_id, sys_p, user_p, args.max_tokens)

    # strip markdown fences (GLM wraps even with response_format=json_object)
    text = text.strip()
    if text.startswith("```"):
        # drop the opening fence line, then everything from the closing fence onward
        first_nl = text.find("\n")
        rest = text[first_nl + 1:] if first_nl > 0 else ""
        closing = rest.rfind("```")
        if closing >= 0:
            rest = rest[:closing]
        text = rest.strip()
    # sometimes there's still preamble like "Here is the JSON:" before the object
    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace > 0 and last_brace > first_brace:
        text = text[first_brace:last_brace + 1]

    try:
        script = json.loads(text)
    except json.JSONDecodeError as e:
        sys.exit(f"error: model returned invalid JSON: {e}\n--- raw ---\n{text[:1500]}")

    # normalize: ids as "B##" strings; card beats shouldn't carry img; vtypes collapse to {still,card}
    VALID_VTYPES = {"still", "card", "quote", "bignum", "stat2", "stat3", "question",
                    "cta", "signoff", "viz"}
    CARD_LIKE = {"card", "quote", "bignum", "stat2", "stat3", "question", "cta", "signoff"}
    for i, b in enumerate(script.get("beats", []), 1):
        if not isinstance(b.get("id"), str) or not b["id"].startswith("B"):
            b["id"] = f"B{i:02d}"
        vt = b.get("vtype", "still")
        if vt not in VALID_VTYPES:
            vt = "card" if "card" in b else "still"
            b["vtype"] = vt
        # anything with a card object collapses to vtype=card (defensive vs GLM's signoff/quote)
        if "card" in b and vt in CARD_LIKE:
            b["vtype"] = "card"
        if b.get("vtype") == "card" and "img" in b and not b["img"]:
            del b["img"]

    with open(args.out, "w") as f:
        json.dump(script, f, indent=2, ensure_ascii=False)

    itok, otok = usage["input_tokens"], usage["output_tokens"]
    cost = (itok / 1e6 * pricing["input"]) + (otok / 1e6 * pricing["output"])
    beats = len(script.get("beats", []))
    print(f"[gen] {beats} beats, {itok}+{otok} tok, ${cost:.4f}, {dt:.1f}s, "
          f"{otok/dt:.0f} tok/s → {args.out}", flush=True)

    sidecar = args.out.rsplit(".", 1)[0] + ".meta.json"
    with open(sidecar, "w") as f:
        json.dump({
            "llm_model": model_id, "llm_family": family,
            "input_tokens": itok, "output_tokens": otok,
            "llm_cost_usd": round(cost, 6), "wall_s": round(dt, 2),
            "throughput_toks": round(otok / dt, 0) if dt > 0 else 0,
            "format": args.format,
        }, f, indent=2)


if __name__ == "__main__":
    main()
