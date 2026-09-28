# Building one exam practice-question film — brief

You build ONE short vertical film (1080x1920) in `~/byclaude/video/exam/<name>/`. Read ALL of this, then
`EXAM_SLATE.md` (the accounts, the form, the HARD honesty rules, your film's section), the `~/byclaude/video/motion/`
docstrings (`render.py`, `sound.py`, `check.py`), `~/byclaude/video/motion/common.js` (helpers: ss/lerp/rng/mix/rgba,
wrapText, grain, vignette), and — for the craft bar — `~/byclaude/video/inbox/tax-profit/film.html` (the closest
sibling: a worked-math explainer) and `~/FeelBetterBot.com/marketing/tiktok/films/sunday/film.html` (easing, restraint).

## Step 0 — verify BEFORE you build (this is the job; the film is the easy part)
People will study from this and some will sit the exam on it. A wrong key teaches a wrong answer.
- Find every rule, figure and formula in your section in an authoritative source (WebSearch + WebFetch): the FDA Food
  Code (name the edition and section; prefer text that is unchanged between the 2022 and the newest edition — say so if
  it changed), the ABC formula sheet / a state operator-training manual, NAIC or a state Department of Insurance
  study outline / statute / standard policy form language. Never a blog or prep-company page as the authority.
- Write `<name>/SOURCES.md`: each claim → URL + short VERBATIM quote; then the worked example line by line, labelled
  illustrative. Every number on screen must appear there (check.py enforces it).
- Write `<name>/KEY.json`: `{"domain": "<e.g. US property & casualty claims adjuster licensing>", "question": "<the exact
  question string from ON_SCREEN>", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "answer": "C"}` — every string
  verbatim as it appears in ON_SCREEN.
- Solve your own question cold after writing it: is exactly one option defensible? Would a state/edition difference
  make another one right? If so, pin the assumption inside the question or change it.
- The slate is my draft, not a source. Correct it where it's wrong and list every change in your report.

## The look
- Full-bleed ground in the Page's colour (EXAM_SLATE table), cream text, the Page's accent for the reveal only.
  Condensed caps display (Anton, `@font-face` from `../fonts/Anton-Regular.ttf`) for hook/kicker/big numbers; Inter
  (`../../motion/fonts/Inter.ttf`) for question, options and worked lines. Kicker top-left: `PRACTICE QUESTION`.
- Question on a card (slightly lighter/darker panel), options as four rows with a lettered disc. Big, readable:
  question ≥ 50 px, options ≥ 46 px, worked-answer numbers ≥ 60 px. Wrap, never shrink below that — cut words instead.
- Layout: text within x 60–1020; keep y 0–150 and the bottom 320 px free of anything important (FB/IG UI). A film
  about arithmetic should feel precise: numbers set in tabular alignment, an equals sign that lines up.
- Motion with intent: options arrive one by one; the ring timer drains; on the reveal the right row fills with the
  accent, the others fade to 35%; each worked line writes on. Gentle, not bouncy. Deterministic in t (rng(seed), never
  Math.random). Grain light.
- No emoji or symbol glyphs (they render as boxes) — draw ticks/crosses/icons as canvas paths. Latin-1 and general
  punctuation are safe: `·` `—` `×` `÷` `°` `½` all pass check.py; `√` `π` `≈` `→` do NOT (write `pi`, `about`, draw arrows).
- Sound (sound.py cues): low `tension` under the question and pause, `tick` each second of the countdown, `bell` on
  the reveal, `warm` rising through the worked answer, a `click` as each option lands.

## Tools
- `ON_SCREEN` array (JSON, double quotes) near the top of the script; draw text only from it.
- Stills: `python3 ~/byclaude/video/motion/render.py ~/byclaude/video/exam/<name> --stills <6–8 times>` → LOOK at every
  PNG with the Read tool; fix anything cramped, illegible, overlapping, off-canvas or dull; 2–4 rounds. Ask of each
  still: would someone studying for this exam stop scrolling here? Readable at arm's length on a phone?
- Full render in the FOREGROUND (blocking, long timeout — a background render dies when you stop replying):
  `python3 ~/byclaude/video/motion/render.py ~/byclaude/video/exam/<name> ~/byclaude/video/exam/out/exam-<name>.mp4`
- Gate: `python3 ~/byclaude/video/motion/check.py ~/byclaude/video/exam/<name> ~/byclaude/video/exam/out/exam-<name>.mp4 --exam`
  must print PASS.
- Pull 4 frames from the FINAL mp4 with ffmpeg at the key beats and look at them.
- `caption.txt` per EXAM_SLATE. Keep 3 stills (question, reveal, card); delete the rest.

## Film 1 only: the kit
If you are `adj-split-limits`, also write `~/byclaude/video/exam/kit.js`: a THEME object per Page (`adj`, `fpm`, `ww`:
ground/card/text/accent/dim colours, handle, disclaimer lines), and drawing + timing helpers for: kicker, hook line,
question card with wrapped text + `example` tag, option rows (arrive / reveal / dim), ring countdown, worked-answer
lines (write-on, aligned equals), trap line, end card — plus a small scheduler that turns a script of beats into
times that respect the reading rule and emits the sound cues. Plain JS, ~200–400 lines, documented at the top. The
other eleven films will be built on it by agents who have not seen your film, in all three themes — render one still
of your question card in the `fpm` and `ww` themes too (a scratch copy, delete after) to prove the themes work.
Everyone else: use kit.js, don't edit it; define anything extra in your own film.html.

## Don'ts
Don't edit `~/byclaude/video/motion/`, other films' folders, the slate, or (unless film 1) kit.js. Don't upload,
deploy, commit or post.

## Report (under 250 words)
Corrections to the slate and why (with the quote that forced it), the question + key as shipped, duration, check.py
result line, kept stills, anything you could not verify and what you did about it.
