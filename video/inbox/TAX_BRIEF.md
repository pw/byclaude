# Building one "THE MATH" tax micro-tutorial — brief

You build ONE film for @smallbusinessinbox in `~/byclaude/video/inbox/<name>/`. Read ALL of this, then:
`TAX_SLATE.md` (the audience, the form, the HARD honesty rules, and your film's section) · `BRIEF.md` (the series
look, layout limits, tool contract, steps — everything there applies except where this file overrides) ·
`kit.js` header · `quick-question/film.html` and `friend-price/film.html` (the worked examples of the series,
incl. a worksheet-style surface in friend-price) · `~/byclaude/video/motion/check.py` docstring.

## Step 0 — verify BEFORE you build (this is the job; the film is the easy part)
The audience will act on this. A wrong rate or date here costs a real person money.
- For every rule, rate, threshold and date in your section, find it on IRS.gov (Publications 334, 505, 463, 535-successor
  guidance, Form 1040-ES instructions, Schedule SE instructions, Topic pages, the Estimated Taxes page) with WebSearch
  + WebFetch. Current-year versions only; check the revision date. If IRS.gov blocks a fetch, try the PDF or another
  IRS page — never a blog as the authority.
- Write `<name>/SOURCES.md`: each claim → IRS URL + a short VERBATIM quote + (for the tax year) the page's revision
  date. Then the worked example with its arithmetic written out line by line, labelled illustrative.
- If the slate overstates or misstates anything, CORRECT the film (soften to "generally"/"usually", add the
  condition, fix the number) and list every change in your report. The slate is my draft, not a source.
- Every number that appears on screen must appear in SOURCES.md (check.py enforces it).

## Build
- Kicker `THE MATH`. Opener in the phone (kit), then the worksheet. Numbers big and readable; one idea per beat;
  ≥ 0.35 s per word on screen. Label example figures `example` on the worksheet.
- End card exactly: `@smallbusinessinbox` and, small, `General information, not tax advice.` on one line and
  `Rules from IRS.gov; your situation may differ.` on the next (both strings in ON_SCREEN).
- 30–60 s. Stills loop as in BRIEF.md (look at every PNG). Render:
  `python3 ~/byclaude/video/motion/render.py ~/byclaude/video/inbox/<name> ~/byclaude/video/inbox/out/inbox-<name>.mp4`
- Gate: `python3 ~/byclaude/video/motion/check.py ~/byclaude/video/inbox/<name> ~/byclaude/video/inbox/out/inbox-<name>.mp4 --explainer`
  must PASS.
- IMPORTANT: run renders in the FOREGROUND (a normal blocking command with a long timeout), never in the background —
  this session ends when you stop replying, and a background render dies with it.
- `caption.txt`: 1–2 plain sentences (neutral voice — no "I"), then `General information, not tax advice.`, a blank
  line, 4–6 audience hashtags (#boothrenter #selfemployed #smallbusinesstaxes #hairstylist …), never #ai.

## Report (under 250 words)
Every correction you made to the slate and why (with the IRS quote that forced it), duration, check result line,
kept stills, anything you could not verify (and what you did about it).
