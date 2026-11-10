Claude Code doesn't recognize the model "claude-fable-5-2", so it assumes a context window of 200k tokens. Update Claude Code, or see https://code.claude.com/docs/en/model-config#correct-the-window-for-a-gateway-or-custom-model-id to set the window.
[claude-code:unrecognized_model] {"model":"claude-fable-5-2","query_source":"sdk"}
Based on all 60 stills plus the transcript. Stills are 1.5 s apart, so sync calls are ±0.7 s, and items marked "verify" may be mid-animation states.

## 1. Wrong

- **Caption word spaces collapse (14.0, 27.5, 60.5):** they read "In sixteenninety-two,", "marinara oftenmeansa" and "andthere's still nothing". The space disappears next to highlighted words, so reserve width or stop scaling the active word.
- **Empty caption pills (20.0, 41.0):** at 20.0 a ghost pill shows with no text while the voice says "Spanish-style". At 41.0 a grey empty pill shows around "I like Cento", and no still shows a "Cento" caption at all, so verify it renders.
- **Captions caught half-faded (5.0, 14.0, 17.0, 26.0, 81.5):** the fade is too slow; snap in within 3 frames.
- **Blank screen at 12.5:** only the header and the caption "nightshade." remain. The nightshade badge is still thumbnail-size at 11.0 on "deadly", so the punchline visual gets under a second. Hold the scene to 12.7 and pop the badge at full size on "deadly".
- **"DOCUMENTED" card unreadable (26.0):** "1692: a Spanish-style tomato sauce in print (not called marinara)" is absent at 24.5 and already under the gingham wipe at 26.0. Bring it in at 23.5 beside the LEGEND card, or cut it.
- **"No cheese" never lands (30.5–32.0):** absent at 30.5, a fading ghost in the top-right at 32.0. It is the point of the pizza beat; give it a centred full second.
- **Misread at 20.0:** "= Spanish-style" sits on the same line as "known printed tomato", so it reads "known printed tomato = Spanish-style". The connector also cuts through the book text and frame. Put the translation in the book margin.
- **"1½ tsp onion" (71.0):** reads as fresh onion in a no-chop recipe; write "onion powder". "the can" should be "the tomato sauce".
- **Text contradicts the voice:**
  - 66.5: "bloom 20-30 s" against "thirty seconds".
  - 33.5: "usually" against "mostly".
  - 42.5: "dry" is added to "cheap red wine".
- **Label errors (54.5, 56.0):** the tilted onion jar reads "NOINO", and the red strike covers the L so the salt jar reads "SA T".
- **Collisions:**
  - 39.5: the can overlaps the "RECIPE 1" header, and its label shows a doubled "TOMATO SAUCE".
  - 47.0: "rub it between your palms" is jammed between the header and the hands.
  - 48.5 and 63.5: the oil bottle touches the header.
  - 32.0: the caption sits inside the empty cream card as it slides up.
  - 24.5: the stamp ends about 26 px from the right edge.
- **Text overload at 53.0:** five text blocks at once, including a 14-word small-type footnote the voice never says. Cut the footnote.
- **Title (0.5, 3.5):** "MARI / NARA" is split with no hyphen, and the cream sail merges into the cream "A". Make the sail gold or lower the waterline.
- **Wide captions (47.0, 78.5):** they span about 7–93% of the width, so the last word risks sitting under the platform's right-hand icon rail. Cap them at about 84%.
- **Verify:** the pink, dropped "s" on "1500s" (6.5) and a stray brown blob outside the pan (66.5).

## 2. Cheap, cluttered, empty or confusing

- **Same sentence stacked twice (3.5, 18.5, 21.5, 36.5, 38.0, 47.0, 83.0–84.5, 87.5, 89.0):** the caption repeats the kinetic type directly above it. Suppress the caption for those phrases or make the on-screen text add something.
- **Oil and powder read as eggs (54.5–57.5, 63.5):** opaque yellow blobs and white ovals look like shakshuka, and the skillet oil looks like a yolk. Use translucent amber with a highlight, and speckle for the powders.
- **Map (5.0–6.5):** the blobs do not read as continents, and the tomato-boat parks on the "EUROPE" label. Use recognisable silhouettes.
- **Hands (45.5–47.0):** peach lozenges with navy sleeves are the weakest drawing in the piece. Redraw them with fingers, or show a pinch of herbs falling.
- **Dead frames (8.0, 14.0, 23.0, 35.0, 59.0):** one small element sits in 60–80% empty space. Centre or scale up the single element, or bring the second in sooner.
- **Recipe 1 has no finished shot (57.5–59.0):** the sauce is still unblended blobs, "stir until the oil ble…" is mid-write, and then it cuts to Recipe 2. Add a 1 s blended-sauce beat on "Done."

## 3. Pacing and hook

- **Hook (0–2 s):** a static title card with a small pill will not stop a scroll. Cold-open with 0.7 s of the swirl, then put "Nobody knows why it's called marinara" as the big type.
- **History (4.2–33.7):** 30 s, a third of the runtime, before the first recipe. The Latini layout alone holds for 9 s (12.8–21.8). Aim for about 18 s.
- **Recipe title cards (34.2–38.5, 58.9–61.9):** 4.3 s and 3 s; 2 s each is enough.
- **Recipe 2 steps (62.3–71.9):** five steps in 9.6 s, each with new text carrying details the voice does not say. It is unreadable with sound off, and this is the "even better" recipe. Give it about 15 s or strip the text to three words per step.
- **Hero opening (72.5–77.0):** three near-identical stills, static right after the rush.

## 4. Hero oil swirl

It does not land.

- **Style break (74.0):** flat vector jumps to a pseudo-photo shader. The herbs become jagged black specks, the flames vanish, and the glowing orange ring reads as lava or a heating element.
- **Oil is not identified (75.5–77.0):** nothing marks it for a sound-off viewer. Add an arrow and "oil pools here".
- **The sweep is not shown (78.5–80.0):** the spoon sits at 4 o'clock in both stills, and the oil band gets wider, the opposite of the instruction. Show one full lap with a wake.
- **Twirl filter (81.5):** it looks like a stock distortion, and the sauce has gone orange. Instead, drag amber ribbons spiralling inward through deep red sauce, in the illustrated style.
- **Droplets and glitter (83.0–86.0):** uniform orange bubbles under hundreds of star glints are the cheapest-looking frames in the reel. Use 30–60 beads of varied size, each with one small highlight, lit once by a passing light sweep.
- **Text over the payoff (83.0–86.0):** the big type and the caption both cover it. Keep one, and leave the 84.7–86.7 hold clean with a slow push-in.

## Top 5 fixes

1. Rebuild 74–86 in the illustrated style: label the oil, show the lap and the inward ribbons, use restrained glints, no star overlay.
2. Fix the caption engine: spacing, empty pills, fade speed, verbatim duplicates, width.
3. Re-time: history to about 18 s, title cards to 2 s, the seconds going to Recipe 2 steps and a Recipe 1 finished shot.
4. Rescue the beats that vanish: nightshade (11–12.5), "DOCUMENTED" (26.0), "No cheese" (31–32).
5. Correct the text: "onion powder", "30 s", "= Spanish-style" placement, "NOINO", header collisions, egg-like oil.
exit 0
