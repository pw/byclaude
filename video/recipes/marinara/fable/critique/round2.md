Claude Code doesn't recognize the model "claude-fable-5-2", so it assumes a context window of 200k tokens. Update Claude Code, or see https://code.claude.com/docs/en/model-config#correct-the-window-for-a-gateway-or-custom-model-id to set the window.
[claude-code:unrecognized_model] {"model":"claude-fable-5-2","query_source":"sdk"}
# Critique: marinara reel draft (90 s)

I read all 60 frames against the transcript. Frames are 1.5 s apart, so any duration shorter than that is inferred from neighbouring frames and the narration timing. I found no misspellings.

## 1. Wrong or misreadable

**Overlaps and edges**
- **54.5s:** the GARLIC shaker covers the end of the header, which reads "Microwave Marinar…". Move the shakers down or shrink them.
- **83.0–84.5s:** the caption box sits on top of the pan and sauce. At 84.5s it covers the exact spot where the light sweep and brightest glints enter (bottom right).
- **44.0s:** the wine bottle butts against the right frame edge and looks clipped.
- **6.5s:** the top of "1500s" touches the bottom edge of the map.

**Misreads**
- **56.0s:** a white powder pile (the garlic) lands directly under the crossed-out SALT shaker. It reads as "salt went in". Clear the garlic pile before the salt gag, or move the shaker off the bowl.
- **5.0–6.5s:** the white outlined triangle on the tomato reads as a mouse cursor, not a sail. Give it a mast and hull, or drop it.
- **30.5s:** the garlic slices read as mozzarella or white beans on a pizza whose point is "no cheese" (32.0s). Make them smaller, thinner and ivory-tan. The orange oil stroke in the centre reads as a letter "C".
- **15.5s:** the tomato on the book cover is orange with a green stem, so it reads as a citrus fruit. It is red at 17.0s.
- **63.5s:** "1–2 tbsp" of oil is drawn as a yolk-yellow blob filling 70% of the pan. It reads as a fried egg.

**On-screen text that differs from the narration**

| Time | Screen | Voice |
|---|---|---|
| 9.5s | "many grew them for looks" | "plenty of others grew them for looks" |
| 33.5s | "usually means the sauce" | "mostly means the sauce" |
| 42.5s | "2 tbsp cheap dry red wine" | "cheap red wine" |
| 66.5s | "bloom 20-30 s" | "thirty seconds" |

**Sync and legibility**
- **63.5s:** "1-2 tbsp olive oil" and "medium heat" are dim grey on black and unreadable, while the voice has already moved to tomato paste.
- **71.0s:** the "1½ tsp onion powder" pill is still a faint ghost and the garlic pill is not on yet. The line ends at 71.9s and the scene has changed by 72.5s, so both get under about 1 s.
- **62.0s:** "THE KNIFE HAS THE DAY OFF" appears after 60.5s and is gone by 63.5s, with the next line starting at 62.3s. It is likely on for under 1 s.
- **21.5s:** "served with boiled meat, not pasta" arrives as the line ends (21.8s) and the scene has changed by 23.0s.
- **27.5–29.0s:** the voice is already listing toppings while the screen shows a blank dough disc, then a red dot that looks like a Japanese flag. The chips land about 0.5–1 s late.
- **51.5s:** "microwave-safe bowl, lid ajar" is thin green script on cream and weak at phone size.

**Captions**
- **Numbers are spelled out** directly under the same numeral: "fifteen-hundreds." under "1500s" (6.5s), "In sixteen ninety-two," under "1692" (14.0s), "A fifteen-ounce can of" (39.5s), "Three to four minutes on" under "3-4 min total" (51.5s). Use numerals.
- **Orphan fragments:** "nightshade." (12.5s), "red wine." (44.0s), "No salt;" (56.0s), "to chop." (62.0s), "the edge?" (77.0s), "the light." (84.5s). Re-chunk by phrase.
- **Captions switch on and off with no visible rule.** They are off at 8–9.5s, 17–21.5s, 24.5s, 29–38s and 63.5–71s, and on elsewhere. It looks like a glitch. Either keep them always on, or hide them only when the identical words are on screen as designed type.
- **12.5s:** "nightshade" appears three times at once (script line, label, caption).

**Typography**
- Straight inch-mark quotes at 2.0–3.5s and 17–20s, but curly quotes at 33.5s.
- Hyphens used for ranges ("2-3", "3-4", "20-30 s"). Use en dashes and "sec".

## 2. Cheap, cluttered, empty or confusing

- **59.0s:** the Recipe 2 card is about 1.5 s of near-black with a lone cutting board, while the voice says "Recipe two is even better". Bring the title in on the first frame.
- **14.0s:** "1692" sits alone on blank cream. Bring NAPLES and the portrait in with it.
- **8.0s, 23.0s, 35.0s:** a single card with half the frame empty. Scale the art up about 20% or centre it lower.
- **11.0–12.5s:** two overlapping circles with a script line jammed in the left pocket. The nightshade flower is a lavender polygon. Lay it out side by side, drop the script line (the labels carry it) and redraw the flower.
- **24.5s:** the DOCUMENTED card is three lines repeating 1692, with a parenthetical the voice never says, readable for about 2 s. The check pops at 26.0s just as the wipe covers it. Cut it to "1692: in print" with the check on "records".
- **15.5–21.5s:** the Latini portrait is a clip-art smiley with a wig. By 21.5s there are eight elements on screen. Retire "1692/NAPLES" when the plates enter.
- **56.0s:** the "no salt…(taste first)" line is two lines long and sits about 15 px above the caption. Shorten it to "no salt (the can's seasoned)".
- **Recipe 2 has no quantities** for seasoning or wine/balsamic (66.5s, 68.0s), while Recipe 1 gives them all. That matters for a video people are asked to save.
- **The two recipes use different layouts.** Recipe 1 has a cumulative list plus captions. Recipe 2 has a step title, a pill and a progress bar. Pick one, and add a 1.5 s screenshot-ready ingredient card per recipe.
- **87.5–89.0s:** the end card has no series name or handle and its bottom 35% is empty. The sauce on the pasta is a small blob.
- **72.5–77s:** "THE SIGNATURE MOVE" sits at about y=186 px (at 1080×1920), inside the platform's top interface zone. Drop it about 60 px.

## 3. Pacing and hook

- **The hook (0–2s) is weak.** The 0.5s frame is a title card: "MARINARA" is a label, the promise sits in a 22 px pill, the bottom 40% is empty and the title covers the swirl. The food then vanishes until 27.5s. Open on the oil swirl in motion with "Better than any jar. Nothing to chop." in large type, then go to the sailor line.
- **The history beat drags.** It runs 4.2–33.7s, a third of the reel, and the first recipe starts at 34.2s. The LEGEND/DOCUMENTED recap (22.2–26s) restates the hook and 1692. Cut it or the nightshade aside to save 4–6 s.
- **Recipe 2 rushes.** Six steps run in about 10 s (62.3–72s) with text flashing for under 1.5 s. Give it the seconds saved from history.
- **Recipe 1 has no payoff.** "Stir. Done." (57.5–58.3s) cuts straight to Recipe 2. Add a 0.7 s finished-bowl beat with a "Done" stamp.
- **Recipe 1's ingredients (39–49s) and the hero (72.4–86s) are paced well.**

## 4. The hero oil swirl

It is clear but not beautiful yet.

- **74.0s:** droplets scatter across the sauce before the pooling and the swirl. This previews the end state and muddles the cause and effect. Remove them and go straight from sauce to the pooled ring.
- **75.5–77s:** the oil ring is an opaque mustard band and reads as cheese or crust. Make it thinner, translucent amber with red showing through, and give it one moving highlight.
- **80.0–81.5s:** the swept ribbons are thick opaque strokes, and the spiral reads as spaghetti. Use tapering translucent marbled streaks that break up into beads as they reach the centre.
- **83–86s:** the "tiny droplets" are large flat orange balls with drop shadows, like yolks. Make them three to four times smaller and more numerous, with no shadows and a darker rim.
- **84.5s:** the light sweep lasts about 1 s and is half hidden by the caption. Darken the sauce about 15% before the sweep and run it corner to corner over about 2 s, with speculars twinkling in sequence. Finish the caption before the sweep or move it to the top.
- **86.0s:** the 2 s silent hold is right. Keep it, but keep the glints alive.

## Top 5 fixes

1. **Re-render the hero oil (74–86s):** translucent amber, tiny twinkling droplets, no droplets before the swirl, a longer light sweep, and the caption off the glint.
2. **Rebalance the time:** cut 4–6 s from the history (22–26s recap) and give it to Recipe 2's steps (62–72s) so every step text holds at least 1.5 s. Fix the unreadable oil, onion and garlic text and add the missing quantities.
3. **Fix the captions:** numerals instead of spelled-out numbers, no orphan fragments, one on/off rule, and on-screen wording that matches the voice (9.5s, 33.5s, 42.5s, 66.5s).
4. **Fix the overlaps and misreads:** shaker over the header (54.5s), salt next to the white powder (56.0s), cursor-like sail (5–6.5s), mozzarella-like garlic (30.5s), fried-egg oil (63.5s), bottle at the edge (44.0s).
5. **Rebuild the first 2 s** around the moving swirl and the promise in large type, bring the Recipe 2 title in on its first frame (59.0s), and add the series name to the end card.
exit 0
