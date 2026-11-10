Read `fix_briefs/_round2_common.md`, then `FIX_BRIEF.md`, then `critique/round2.md`.

YOUR SCOPE: the first 34 seconds and the caption engine. Files you own: `js/s_hook.js`, `js/s_history.js`,
`js/s_latini.js` (Latini + the legend beat), `js/s_pizza.js`, `js/captions.js`.

TO DO: every round-2 item that falls in 0-34 s, and the caption items for the whole film. In particular:
- Hook (0-4 s): still reads as a static title card with the promise in a small pill and an empty lower 40%. Keep the
  sailor-style fact as the hook, but make the first second move and make the promise ("2 NO-CHOP MARINARA RECIPES")
  big enough to read at phone size; use the whole frame.
- Misreads: the sail on the tomato reads as a mouse cursor (give it a mast and hull or drop it); "1500s" touches the
  map; the book-cover tomato is orange (make it the same red as inside); pizza garlic reads as mozzarella on a
  no-cheese pizza (smaller, thinner, ivory-tan) and the oil stroke reads as a letter C; the lone red dot on the dough
  reads as a flag (bring the toppings and their chips in with the words).
- Thin or late beats: "1692" alone on blank cream at 14.0 (bring NAPLES and the portrait in with it); "served with
  boiled meat, not pasta" arrives as the line ends (bring it in earlier); the nightshade layout and flower drawing;
  the Latini portrait reads as clip art (give it some character in the print style); too many elements at 21.5
  (retire what is finished); the DOCUMENTED card's tick lands under the wipe.
- Captions (`js/captions.js`, whole film): no orphan chunks (the critic lists "nightshade.", "red wine.", "No salt;",
  "to chop.", "the edge?", "the light."): re-chunk by phrase so a one- or two-word tail joins its neighbour whenever
  the width cap allows. Where a spelled-out number caption sits under the same numeral on screen ("fifteen-hundreds."
  under "1500s", "In sixteen ninety-two," under "1692"), mute that chunk via `capOff` in your own scenes, under the
  caption rule in the common notes. Do not change caption wording (it is the narration verbatim). Check the result
  across the film with two sheets.
