Read `FIX_BRIEF.md` (shared brief, in the current directory) and `critique/round1.md` (the blind critique) first.
An earlier agent started this job and was cut off by a usage limit; its edits are on disk and pass `node --check`.
The pre-fix version of every js file is in `/tmp/fable_js_r0_backup/` if you need to see what changed (`diff`).

YOUR SCOPE: the first 34 seconds. Files you own: `js/s_hook.js`, `js/s_history.js`, `js/s_latini.js` (Latini + the
legend beat), `js/s_pizza.js`, and `js/captions.js`.

ALREADY DONE (do not redo): the caption engine in `js/captions.js` was rewritten (explicit per-word layout with a
fixed word space, width cap, snap-in, hard swap between consecutive chunks, the `capOff` mute). Spend two sheets
verifying it at phone size across the film (e.g. 1.5 9.0 20.0 41.0 66.0 and 30.0 47.0 55.0 75.0 88.0): no clipped or
overlapping words, no mid-word gaps like the critic's "NOINO"/"SA T". Fix only real bugs.

STILL TO DO: every critique item that falls in 0–34 s. In particular: the hook is static (give the first two seconds
real motion and a reason to stop scrolling); beats that vanish before they can be read (nightshade badge, the
DOCUMENTED card, "no cheese"); anything read as the wrong object; text overload and collisions in these scenes;
add `capOff` ranges on your own scene objects where on-screen type duplicates the caption.
