**Round 2, scope 0–34 s + caption engine: done.** All five files pass `node --check`; checked on 14 contact sheets, no full render run, nothing committed (`fable/` is untracked and shared with other agents, so the commit is left to the orchestrating step).

Files changed: `js/s_hook.js`, `js/s_history.js`, `js/s_latini.js`, `js/s_pizza.js`, `js/captions.js`. Nothing outside `fable/` was touched.

## Per critique item

**Hook (0–3.95)**
- **Static title card, small promise, empty lower 40%: fixed.** A pan of sauce is already spinning in the lower frame on frame 0. "2 NO-CHOP / MARINARA / RECIPES" is now a three-line lockup, with MARINARA 900 px wide. From about 0.95 s the pan becomes the sun over a rising sea with a paper boat, and “sailor-style” plus the "why?" question land on the heard word times.

**Misreads**
- **Sail reads as a cursor: fixed.** It is now a proper ship with hull, mast, red sails, pennant and bow wave.
- **"1500s" touches the map: fixed.** It sits well below the chart.
- **Orange cover tomato: fixed.** It is the same red as inside, on a cream roundel.
- **Garlic reads as mozzarella: fixed.** It is now 17 thin ivory-tan slivers.
- **Oil reads as a letter C: fixed.** It is a thin gold thread spiral with beads.
- **Lone red dot reads as a flag: fixed.** The sauce is ladled on as a spiral from 27.2, and each topping chip appears 0.1 s before its word, with the topping landing on the word.

**Thin or late beats**
- **"1692" alone at 14.0: fixed.** 1692, NAPLES and the portrait are all in by about 13.0.
- **"served with boiled meat, not pasta" late: fixed.** It is revealed 19.75–20.35 instead of at the end of the line.
- **Nightshade layout and flower: fixed.** Two large specimen cards with a "cousins" bracket, redrawn bell flowers and berries, and a DEADLY NIGHTSHADE plate that slams in on the word.
- **Clip-art portrait: fixed.** Redrawn in the engraving style with an oval gold frame, hatching, periwig, moustache, lace and red coat.
- **Too many elements at 21.5: fixed.** The byline and portrait retire at 19.45, leaving the book, plates and one line.
- **DOCUMENTED tick under the wipe: fixed.** The tick lands at 23.25 and rings at "records" (25.2).

**Captions (whole film)**
- **Orphans: fixed.** Chunks are now cut by phrase, and all six listed tails join a neighbour ("of deadly nightshade.", "of cheap red wine.", "No salt; the can's seasoned.", "nothing to chop.", "at the edge?", "catch the light."). Wording is untouched.
- **Spelled-out numbers under numerals: fixed in my scenes, not fixed in two others.** "fifteen-hundreds." and "In sixteen ninety-two," are muted. "A fifteen-ounce can" (38.93–39.95) and "Three to four minutes" (50.88–51.54, under "3-4 min total") sit in the recipe scenes, which I don't own.

## Needs a file I don't own
- **Recipe scene `capOff`:** to mute those two number captions, add roughly `[38.9, 40.0]` and `[50.85, 51.6]` to the owning scenes.
- **Sound cues:** the `cues` times in my four scenes moved with the visuals, so a soundtrack baked from them needs rebuilding.
- **Shared files:** no edits to `core.js`, `draw.js` or `main.js` were needed.

## Judgment calls and disagreements with the critic
- **Captions stay on under two cards** where the checked wording differs from the narration: "many grew them for looks" (spoken "plenty of others") and the America card ("usually" vs spoken "mostly").
- **The whole Latini line (12.7–21.5) is muted**, because every phrase of it is set as type.
- **DOCUMENTED card** reads "1692" + "a Spanish-style tomato sauce in print" with a small "not called marinara" note. I did not use the critic's "1692: in print", which is not a checked string.
- **Curly quotes** are drawn on “sailor-style” and “...alla spagnuola” while the straight-quoted strings are what pass `os()`. This is easy to revert if unwanted.
- **Not taken, per the rulings:** shortening the history section, and opening on the oil swirl.

## Time ranges where the picture changed
- **0.0–34.6:** every frame (all four scenes, plus the transition into the recipe-1 title, which shows the pizza's last frame).
- **34.0–≈85:** every captioned frame, since the captions were re-chunked film-wide. The main spans are 38.9–40.8, 42.1–43.8, 44.2–47.5, 50.9–52.8, 53.4–57.9, 60.4–61.7, 62.3–71.8, 75.2–77.1 and 78.1–84.5.

In practice this is a full re-render.
