# Motion-design twin of a business-true-crime short — brief

You rebuild ONE existing narrated-stills film as a CODE-RENDERED MOTION-DESIGN film, same soundtrack,
so we can A/B the FORM on Instagram (byclaude.films): the same words, the same voice, the same timing —
only the picture changes. Film: `lease-30000-judgments` (Northern Leasing). Work in
`~/byclaude/video/bizcrime/motion/lease-30000-judgments/`.

READ FIRST
- `lines.json` here: the six VO lines with exact `at` (start, s) and `dur`, the original on-screen `cap`s, `total`.
  `soundtrack.m4a` here is the ORIGINAL film's audio track, bit for bit. render.py muxes it untouched.
- `~/byclaude/video/bizcrime/stories/lease-30000-judgments/BRIEF.md` — the verified brief. Its DO NOT SAY list
  binds every word you put on screen, exactly as it bound the narration.
- `~/byclaude/video/bizcrime/stories/lease-30000-judgments/sources/EXCERPTS.md` — the only facts you may use.
- `~/byclaude/video/motion/common.js`, `render.py`, `check.py` (docstrings are the contract).
- The original film, to know what you're competing with: pull frames from
  `~/byclaude/video/shorts/short-lease-30000-judgments.mp4` (ffmpeg -ss N -frames:v 1) and look.
- The craft bar for code-drawn film: `~/FeelBetterBot.com/marketing/tiktok/films/sunday/film.html`,
  `…/onread/film.html`, `…/newcity/film.html` — study how each builds a literal METAPHOR and escalates it.

## What the picture should do
Each VO beat gets a drawn visual argument for exactly what is being said, timed to the line's `at`/`dur`:
the few-hundred-dollar card machine vs a payment total climbing into the thousands; the list of shop types;
the non-cancelable lease and the New-York-only lawsuit clause; 30,000 lawsuits as a mass converging on one
court from everywhere (over 95% from outside New York); the court calendar that had to be split off just for
these cases; the default judgment surfacing on a credit report; 29,617 judgments thrown out. Literal-minded
and specific (a docket that fills, a counter that rolls, dots that travel), not abstract swirls.
Register: the cold, exact voice of something that read the whole file. Case-file palette — near-black,
bone paper, ink, ONE amber accent (the original's amber caps). Instrument Serif for the big line, Inter for
labels/data. Motion eased (`ss`), deterministic in t, grain on top. A crude map of the US is worse than none:
if you draw geography, make it abstract (dots converging on one point) rather than a bad outline.

## On-screen text
- Declare EVERY on-screen string in one JSON-parsable array: `const ON_SCREEN = ["...", ...];`. Draw only from it.
- Every word on screen must be supported by the VO line playing under it or by EXCERPTS.md, and must respect
  DO NOT SAY (e.g. "30,000 lawsuits", never "30,000 businesses"; "ordered dissolved", never "dissolved";
  keep 30,000 / 19,000 / 29,617 visibly distinct). Every NUMBER on screen must appear in the sources —
  check.py enforces that.
- Keep the kicker `NORTHERN LEASING` somewhere early. Captions of the VO itself are optional; if you show them,
  they must be the VO words exactly.
- No faces or human figures with features, no real logos/brands, no emoji/symbol glyphs (draw icons as paths).
- Layout: text within x 60–1020, nothing important in the bottom 300 px or the top 120 px (Instagram UI).
- `window.ready` resolves `{ total: <lines.json total> }`. The film must be the same length as the original.

## Steps
1. Write `film.html` (fonts from `../../../motion/fonts/`, helpers `<script src="../../../motion/common.js">`).
2. Stills: `python3 ~/byclaude/video/motion/render.py ~/byclaude/video/bizcrime/motion/lease-30000-judgments --stills <8–10 times, one or two per beat>`.
   LOOK at every PNG with Read. Fix anything cramped, illegible, overlapping or dull. 2–4 rounds. Would this frame
   stop a small-business owner scrolling? Does it say, visually, what the voice is saying at that moment?
3. Full render: `python3 ~/byclaude/video/motion/render.py ~/byclaude/video/bizcrime/motion/lease-30000-judgments ~/byclaude/video/shorts/short-lease-30000-judgments-motion.mp4`
4. Gate: `python3 ~/byclaude/video/motion/check.py ~/byclaude/video/bizcrime/motion/lease-30000-judgments ~/byclaude/video/shorts/short-lease-30000-judgments-motion.mp4 --twin ~/byclaude/video/shorts/short-lease-30000-judgments.mp4 --sources ~/byclaude/video/bizcrime/stories/lease-30000-judgments/sources/EXCERPTS.md --sources ~/byclaude/video/bizcrime/stories/lease-30000-judgments/script.json`
   must PASS.
5. Pull one frame per beat from the FINAL mp4 and look at them against the VO line at that moment.
6. Keep 4 stills; delete the rest. Do not upload, deploy, commit or post.

## Report (under 200 words)
The visual idea per beat (one line each), duration, check result line, kept stills, anything you softened
or left out because the sources didn't support it.
