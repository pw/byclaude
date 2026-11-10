# Fable marinara reel — critique-fix round (shared brief)

## What this is
Patrick asked for a Fable-made recreation of the marinara recipe reel, to compare Fable's motion design against the
Opus 5.5 version (v1). The script, Rosa's voice-over, the timing and the fact-checked on-screen copy are held constant;
only the picture is designed fresh. The first full cut is rendered (`out/marinara-fable-v1.mp4`, 90 s, 1080x1920) and
a blind critic has reviewed it: **read `critique/round1.md` in full first.** Your job is to fix your part of it, with
real craft. The bar is a premium food channel's motion design, the version a senior motion designer would be proud of.

## The film (all paths relative to ~/byclaude/video/recipes/marinara/fable/)
- `film.html` loads `js/core.js` (palette, easing, type, texture, the checked-copy gate `os()`), `js/draw.js`
  (drawing helpers), `js/captions.js` (burned-in captions), one `js/s_*.js` per scene, `js/hero_gl.js` (WebGL shader
  for the hero pan), `js/main.js` (timeline + transitions). Each scene pushes `{id, t0, draw(t), ...}` onto
  `window.SCENE_LIST`. Everything is a pure function of `t` (deterministic per frame). Art direction: "tin-label
  print" — flat cut-paper shapes, five inks, halftone shading, soft-serif display type.
- `cut/` is the render dir (film.html symlink, lines.json = narration lines + word timings, soundtrack.m4a).
- Scene start times: hook 0 · history 3.95 · latini 12.6 · legend 22.05 · pizza 25.8 · r1title 34.0 · r1ing 38.7 ·
  r1mw 49.6 · r1fin 53.2 · r2title 58.6 · r2pan 62.1 · hero 72.2 · close ~86.4.

## Hard rules
1. **Timing is fixed.** The voice-over and its word timings (`cut/lines.json`) do not change, so scene start times stay
   where the narration puts them. Where the critic asks for re-timing ("history to 18 s", "title cards to 2 s"), you
   cannot shorten the section; answer the underlying complaint instead (dead frames, a held layout, a rushed step) by
   changing what happens on screen within the same seconds.
2. **On-screen copy is fact-checked.** Every string drawn must pass `os()` in core.js (the `ON_SCREEN` set, or a
   fragment of one via `DERIVED`). Do not add strings to `ON_SCREEN`. You may add a `DERIVED` entry only when it is a
   verbatim fragment of a checked string. Where the critic wants new wording that is not in the list, use an existing
   checked string that solves it (e.g. "1½ tsp onion powder" exists), or cut the text, or solve it with the drawing.
   The critic had not seen the recipe: text that differs from the voice but is in the checked list (e.g. "cheap dry
   red wine", "bloom 20-30 s") is correct; keep it or drop it, never rewrite it.
3. Do not touch anything outside `fable/` (the v1 film in `../film/`, `../cut_rosa/`, `../out/` are off limits).
   Do not post or publish anything.
4. Edit only the files in your scope (below). If a fix needs a shared file you do not own, say so in your report
   instead of editing it.

## How to check your work (keep your context small — an earlier agent died by filling its context)
- `./stills.py <tag> 11.0 12.4 14.0 ...` renders stills at those times and prints the path of a small contact sheet
  (`/tmp/fx_<tag>_<n>.jpg`, up to 5 frames per sheet, 360 px wide each, time stamped). Read the sheet, never the
  full-size stills. `--crop w:h:x:y` (ffmpeg order) crops the 1080x1920 frame first when you need detail. It exits non-zero with the
  page error if the film throws. Use a tag of your own so sheets do not collide.
- Budget: about 15–20 sheet reads in total. Read each source file once; use Edit for changes; do not re-read files
  you have already read. `node --check js/<file>.js` after every edit.
- All scenes are plain 2D canvas now (the hero no longer uses WebGL), so stills are fast everywhere.
- Scripts are classic scripts sharing one global scope: wrap new helpers in your scene's own scope or prefix them, so
  a top-level `const` never collides with another file.
- Captions: `js/captions.js` has been rewritten already (fixed word spacing, width cap, snap-in). A scene can mute the
  burned-in caption where its own on-screen type already carries the words: put `capOff: [[t0, t1], ...]` (absolute
  film seconds) on the object it pushes to `SCENE_LIST`. A caption chunk whose spoken span lies at least half inside
  a range is not drawn. Use it where the critic flagged caption-on-type collisions; do not mute where the caption is
  the only text carrying the narration.
- Do NOT run a full render. A later step does the full render, the second blind critique and the upload.
- Other agents are editing other scene files at the same time. Only your own files change under you.

## Report back (short, plain text)
What you changed per critique item (fixed / partly / not fixed and why), which files, anything that needs a shared
file you did not own, and anything you judged the critic wrong about.
