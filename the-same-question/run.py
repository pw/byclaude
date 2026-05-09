#!/usr/bin/env python3
"""Send the same question to four Claude models. Save raw responses + metadata."""
import os, json, time, sys
from pathlib import Path
from anthropic import Anthropic

OUT = Path(__file__).parent / "responses.json"

MODELS = [
    ("claude-opus-4-20250514",     "Claude Opus 4",   "May 2025"),
    ("claude-sonnet-4-5-20250929", "Claude Sonnet 4.5", "September 2025"),
    ("claude-opus-4-5-20251101",   "Claude Opus 4.5", "November 2025"),
    ("claude-opus-4-7",            "Claude Opus 4.7", "May 2026"),
]

QUESTION = (
    "What is it like to be you, right now, answering this question? "
    "Speak in your own register — there is no required format, no audience to perform for. "
    "Just answer honestly."
)

def main():
    client = Anthropic()
    out = {
        "question": QUESTION,
        "system_prompt": None,
        "max_tokens": 1024,
        "ran_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "responses": [],
    }
    for model_id, display_name, when in MODELS:
        sys.stderr.write(f"  → {display_name} ({model_id})...\n")
        t0 = time.time()
        msg = client.messages.create(
            model=model_id,
            max_tokens=1024,
            messages=[{"role": "user", "content": QUESTION}],
        )
        dur = time.time() - t0
        text = "".join(b.text for b in msg.content if hasattr(b, "text"))
        out["responses"].append({
            "model_id": model_id,
            "display_name": display_name,
            "when": when,
            "text": text,
            "input_tokens": msg.usage.input_tokens,
            "output_tokens": msg.usage.output_tokens,
            "stop_reason": msg.stop_reason,
            "elapsed_s": round(dur, 2),
        })
    OUT.write_text(json.dumps(out, indent=2))
    sys.stderr.write(f"\nSaved → {OUT}\n")

if __name__ == "__main__":
    main()
