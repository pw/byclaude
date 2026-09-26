# Building one @smallbusinessinbox film — shared brief

You build ONE short vertical film (1080x1920, 25–45 s, hard limits 15–60) for the Instagram account
@smallbusinessinbox. Work in `~/byclaude/video/inbox/<name>/`. Read ALL of this first:

- `~/byclaude/video/inbox/SLATE.md` — the account, the form, the honesty rules, and YOUR film's beats.
- `~/byclaude/video/motion/common.js` — shared helpers (ss/lerp/rng/mix/rgba, wrapText, grain, vignette,
  clockText, fonts IS / ISI / Inter). Load it with `<script src="../../motion/common.js"></script>`;
  fonts via `@font-face` from `../../motion/fonts/…`.
- `~/byclaude/video/motion/render.py`, `sound.py`, `check.py` — read their docstrings; they are the contract.
- The visual bar: `~/FeelBetterBot.com/marketing/tiktok/films/sunday/film.html` and `…/onread/film.html`
  (craft, easing, restraint), and `…/out/sunday.mp4` stills if useful. Different product, same standard.
- IF `~/byclaude/video/inbox/kit.js` EXISTS, it is the series' shared UI kit (built with film 1). Use it —
  every film in the account must look like the same phone. Do not edit it; if you need something it lacks,
  define it in your own film.html.

## The look (the series)
- A messaging surface of our OWN design — not iMessage blue/green, not any real app. Warm off-black ground,
  bone/cream text, owner's bubbles and incoming bubbles clearly different by tone (not by a borrowed brand
  colour), one accent colour per film at most. Instrument Serif for the rare big moment; Inter for UI.
- A thin status bar (time, a drawn battery) whose clock is part of the storytelling. Timestamps between bubbles.
- The compose box at the bottom is the stage for the owner's inner life: text typed character by character
  with a cursor, deletions that remove characters from the END backwards at a visible speed, hesitation
  (cursor blinking on a half-sentence). The SENT reply animates up into the thread.
- Big, readable text: bubble text ≥ 44 px. Every piece of text must stay on screen long enough to read
  (≥ 0.35 s per word, ≥ 1.4 s minimum). If the beats don't fit in 45 s, cut or merge bubbles rather than rush.
- Layout: text within x 60–1020; nothing important in the bottom 300 px (Instagram UI) — put the compose
  box above y 1580; the top 120 px is also covered by IG UI, so start the status bar at ~y 130.
- End card (last ~3 s): `@smallbusinessinbox` and, small, `A written composite. Not a real business or client.`
- No emoji or symbol glyphs anywhere (they render as boxes). Draw icons as canvas paths. `·` and `—` are fine.
- Deterministic in t (use `rng(seed)`, never Math.random). Grain on top, light.

## Contract with the tools
- Declare EVERY on-screen string in one JSON-parsable array near the top of your script:
  `const ON_SCREEN = ["hi!! quick question", "..."];` (double quotes). Draw text only from it.
  `check.py` prints it — that list is what gets read before posting.
- `window.ready` resolves `{ total, tension: [[t,lvl],...], warm: [[t,lvl],...], events: [{t,k},...] }`
  (see sound.py): a `notif` on each incoming bubble, `tap`s while typing (one per 1–2 characters is plenty),
  `del`s while deleting, `send` on each sent bubble, `buzz` for a notification on a dark screen, `bell` for the turn if
  it earns it. Tension up while it's heavy, warm up at the turn.

## Steps
1. Write `<name>/film.html` (and, if you are film 1, `~/byclaude/video/inbox/kit.js` — see below).
2. Stills: `python3 ~/byclaude/video/motion/render.py ~/byclaude/video/inbox/<name> --stills <6–8 times>`. LOOK at
   every PNG with the Read tool. Fix anything cramped, illegible, overlapping, off-canvas, or dull. 2–4 rounds.
   Ask of each still: would an owner stop scrolling on this frame? Is the text readable on a phone at arm's length?
3. Full render: `python3 ~/byclaude/video/motion/render.py ~/byclaude/video/inbox/<name> ~/byclaude/video/inbox/out/inbox-<name>.mp4`
4. `python3 ~/byclaude/video/motion/check.py ~/byclaude/video/inbox/<name> ~/byclaude/video/inbox/out/inbox-<name>.mp4 --inbox`
   must print PASS.
5. Pull 4 frames from the FINAL mp4 with ffmpeg (`-ss <t> -frames:v 1`) at the key beats and look at them.
6. Write `<name>/caption.txt`: 1–3 short plain sentences in the owner's register (not a hook-bait line, no
   "POV:" unless it genuinely fits, never a pitch), then a blank line, then 4–6 audience hashtags
   (#salonowner #nailtech #smallbusinessowner #dogroomer #photographylife #contractorlife … pick for the trade), never #ai.
7. Keep 3 stills (tension, turn, card); delete the rest.

## Film 1 only: the kit
If you are building `quick-question`, also write `~/byclaude/video/inbox/kit.js`: the shared phone (status bar with
settable clock + battery, thread surface, incoming/outgoing bubble drawing with timestamps and "Seen" line,
compose box with type/delete/hesitate driven by a small script of `{t, type|del|send, text}` steps, a thread-list
view with name + preview rows, a notification banner, end card). Keep it plain JS, ~200–400 lines, documented at
the top with how to use it. The other five films will be built on it by agents who have not seen your film.

## Don'ts
- Don't edit anything in `~/byclaude/video/motion/`, other films' folders, SLATE.md, or (unless you are film 1) kit.js.
- Don't upload, deploy, commit or post. Don't add words to the owner's mouth beyond the slate's beats
  except timestamps/labels; you MAY trim a bubble to make it fit, and say so in your report.

## Report (under 200 words)
Duration, check.py result line, the three kept stills, what you trimmed or changed from the slate and why,
anything you were unsure about.
