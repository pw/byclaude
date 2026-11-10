Every critique item in 34.0–72.2 s is addressed in my four files, and all four pass `node --check`. I checked on contact sheets only (13 read), with no full render, so motion and sound sync are unverified. Nothing is committed: `fable/` is untracked and other agents are still editing it, so I left that to the orchestrating step.

**Fixed**
- **Oil and powders reading as eggs (54.5–57.5, 63.5):** bowl oil is now small amber rings and the powders are speckle dustings. Skillet oil is a translucent golden film with a rim, highlights and a few beads. (`s_r1b.js`, `s_r2b.js`)
- **Weak hands (45.5–47.0):** kept the earlier agent's redraw with fingers, nails and sleeves. (`s_r1.js`)
- **Text overload at 53.0:** the footnote is cut, and the lid note leaves before the HIGH display arrives. (`s_r1b.js`)
- **Label errors (54.5, 56.0):** the tilted jars now read "ONION" and "GARLIC", and the salt cross sits behind the "SALT" label instead of over the L. (`s_r1b.js`)
- **No finished shot for recipe 1 (57.5–59.0):** the stir now starts at 56.95, in the pause before "Stir." On "Done." the bowl enlarges, the list clears, and steam and sparkles come in. (`s_r1b.js`)
- **Recipe 2 steps unreadable (62.3–71.9):** seven rushed steps are now five cards, each held for its own sentence, with one headline, one or two gold tags and a five-segment progress bar. Captions are muted for that line, and the pan is larger. (`s_r2b.js`)
- **"1½ tsp onion" / "the can" (71.0):** replaced with the checked strings "15-oz can tomato sauce", "1½ tsp onion powder" and "¾ tsp garlic powder". (`s_r2b.js`)
- **Stray brown blob outside the pan (66.5):** it was the spoon fading out mid-air; it now slides out along its handle. (`s_r2b.js`)
- **Collisions (39.5, 47.0, 48.5, 63.5):** can and bottles are lowered clear of the header, the can uses a single-label drawing, and the "rub it between your palms" note is removed. (`s_r1.js`, `s_r2b.js`)
- **Caption stacked on type (36.5, 38.0, 47.0):** captions are muted with `capOff` at 34.2–38.2 on the recipe 1 title; the 47.0 collision went with the removed note. (`s_r1.js`)

**Partly fixed**
- **Dead title cards (35.0, 59.0) and their length:** I can't shorten them because timing is fixed, so they got motion instead.
  - Recipe 1 title: taller frame, larger type and microwave, sparkles moved off the "M". (`s_r1.js`)
  - Recipe 2 title: slow push-in, the rack arrives earlier, the board swings, and there are glints on the empty peg and the knife. Its first caption chunk is muted. (`s_r2.js`)
- **Recipe 2 wanting about 15 s:** same constraint; the five-card structure is the answer inside the 9.6 s.

**Where I judged the critic wrong**
- **"dry" (42.5) and "bloom 20-30 s" (66.5):** both are fact-checked strings, so the brief says to keep them.
- **Empty pill at 41.0 and wide captions:** these belong to `captions.js`, which is not mine and has already been rewritten.

**Shared files I did not touch**
- **`stills.py`:** the `--crop` help says `x:y:w:h`, but the value goes straight to ffmpeg, which wants `w:h:x:y`.
- **Soundtrack:** I changed sound-effect cue times in the recipe 1 finish and the recipe 2 pan scenes. If the soundtrack is built from scene cues, it needs rebuilding.
- **`s_hero.js`:** it reuses `panFlat` and `PAN.herbs` from `s_r2b.js`. I kept the end state and herb order unchanged, and the 72.15 frame matches the hero framing.
