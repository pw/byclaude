**Hero and close: done.** Both files pass `node --check` and render without errors at every time I sampled, including the critic's own sample times (78.5, 80.0, 81.5, 83.0, 84.5, 86.0, 87.5, 89.0). No full render was run, so motion is judged from stills plus a frame-by-frame check of the spoon's speed. `window.MUSIC` is unchanged.

## Hero (72.2–86.4), `js/s_hero.js`

| Critique item | Status | What changed |
|---|---|---|
| Style break | Fixed (earlier agent) | Kept the 2D-canvas rebuild in the film's own inks. |
| Oil not identified | Fixed | "olive oil" note with arrow at 75.3–77.8 (checked copy; "oil pools here" is not in the list). Surfacing specks are 35% larger with a shade under them. |
| Sweep not shown | Fixed | One full lap; the band is eaten behind the spoon and the wake trails all the way round. |
| Ribbons faint | Fixed | Ribbons are about 40% wider with a higher minimum width, drawn in four inks (shade, dark-gold rim, gold body, pale streak). They narrow as they wind into the middle so it does not clog. |
| Sweep → swirl → beads as one gesture | Fixed | The lap now accelerates from rest and does not brake. The turn inward starts at the speed the lap ended on (about 1,170 units/s either side of 80.3), then eases into the middle. The spoon lifts away while still moving, and the break-up into droplets starts at 81.5 while it is still winding. |
| Droplets and glitter | Fixed | 51 beads of varied size, drawn as lenses. They are dull amber until the light reaches them, then stay lit. |
| Light pass | Fixed | It used to cross the pan in about 7 frames; it now takes about a second (83.7–84.7), centred on "light." and the ding. It is a flat warm bar with halftone feathering. Only the larger beads flash a small four-point glint as it passes, about five at a time. |
| Text over the payoff | Fixed | All labels are off by 81.9, and at full strength at 81.5 so that still is not caught mid-fade. The 84.7–86.4 hold has a slow push-in and an occasional faint twinkle. |

- **Caption at 83.0–84.5 is not muted.** The hero's big type there is gone, so the caption is the only text carrying "until tiny droplets catch the light"; muting it would break the brief's rule.
- **Cue times:** three pop cues moved 0.1 s earlier to match the earlier bead start.

## Close (86.45–end), `js/s_close.js`

- **Caption duplicates (87.5, 89.0):** fixed with `capOff: [[86.6, 88.7]]`. Both sentences are carried word for word by the big type.
- **Sauce looked like a hole:** it was the same red as the background. It is now the hero's deep red with an uneven edge, halftone shade and six lit oil droplets; the largest glints on the sign-off.
- **Layout:** the plate is 12% larger and lower, with the sign-off below it. This fills the space the caption left and gives the steam room under "FOR PASTA NIGHT".
- **Save mark:** it now gets a tick burst when it fills on "this", and one small nudge at 88.9 (with a soft pop cue) so the last 1.3 s is not a frozen card.

`js/hero_gl.js` is unchanged from the earlier agent's stub.

## Shared files (not edited)

- **`stills.py --crop`:** the doc says `x:y:w:h`, but it is passed straight to ffmpeg, which wants `w:h:x:y`. `0:400:1080:1200` fails; `1080:1200:0:400` works.

## Where I disagree with the critic

Nothing in my scope beyond keeping the 83–84.5 caption, as above.

I did not commit: the whole `fable/` directory is still untracked and other agents are editing it, so I left that to the orchestrating step.
