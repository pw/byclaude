Read `FIX_BRIEF.md` (shared brief, in the current directory) and `critique/round1.md` (the blind critique) first.
An earlier agent started this job and was cut off by a usage limit; its edits are on disk and pass `node --check`.
The pre-fix version of every js file is in `/tmp/fable_js_r0_backup/` if you need to see what changed (`diff`).

YOUR SCOPE: the hero oil swirl and the close, 72.2 s to the end (89.99 s). Files you own: `js/s_hero.js`,
`js/hero_gl.js`, `js/s_close.js`.

ALREADY DONE: the hero was rebuilt by the earlier agent on the 2D canvas in the film's own inks (the WebGL pan the
critic said "does not land" is retired; `hero_gl.js` is now a small data stub). Sequence: oil specks surface and pool
at the edge, the spoon laps the rim gathering it into ribbons (78.14), the ribbons spiral into the middle (80.32),
break into droplets (81.5), one pass of light crosses them (83.5). It already looks far better and matches the print
style. Do not start over.

STILL TO DO: review it with one strip (`./stills.py hero 73.0 75.5 78.5 79.5 80.5 81.5 82.5 83.7 84.5 86.0`) and
polish what is weak as the payoff of the whole reel: the ribbons are faint, so make the gold oil read clearly against
the red at phone size; the motion from sweep to swirl to beads should feel like one gesture; the light pass should
be the "ahh" moment. Keep `window.MUSIC` as it is. Then `js/s_close.js` (untouched so far): fix the critique items
for the close, and add `capOff` ranges on your own scene objects where on-screen type collides with the caption
(the critic names 83.0–84.5, 87.5 and 89.0).
