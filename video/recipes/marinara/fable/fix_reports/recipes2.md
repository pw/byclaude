Every round-2 item in 34.0–72.2 s is addressed and checked on contact-sheet stills; no full render was run. One edit was not looked at after it was made: a final 12 px nudge of the small "RECIPE 2 No-Chop Skillet" header (the film still renders without error).

## Per critique item

**Overlaps**
- **54.5 GARLIC shaker over the header: fixed.** Both shakers now enter and leave sideways at bowl height, so nothing crosses the header.
- **44.0 wine bottle at the right edge: fixed.** The pour ends on "wine." and the bottle is fully off by 44.0.
- **56.0 "no salt" note above the caption: fixed.** It is now one row, "no salt" plus a "taste first" pill, with the whole list sitting clear of the caption.

**Misreads**
- **56.0 white pile under the SALT shaker: fixed.** The onion and garlic powders soak into the sauce before the salt jar appears. The jar pops in above the bowl, gets struck out and is tossed off right, with nothing white under it.
- **63.5 fried-egg oil: fixed.** The oil is a thin translucent amber film with the pan showing through, a lighter edge, drifting highlights and small clear beads.

**Legibility and timing, recipe 2**
- **"1-2 tbsp olive oil" / "medium heat" dim: fixed.** Step headlines are full-strength cream and swap hard on the voice's step changes. The sub-labels are gold pills pinned to the pan's bottom rim.
- **Onion and garlic pills under a second: fixed.** They come in at 70.42 and 70.54 and hold to 71.76, about 1.2–1.3 s (were under 1 s).
- **"THE KNIFE HAS THE DAY OFF" under a second: fixed.** The knife hangs at 60.1 (was later), and the pill is on from about 60.2 to 62.1, larger and cream on black. The knife now slides in from the right instead of dropping through the title.
- **Recipe 2 card near-black for 1.5 s: fixed.** Border and "RECIPE 2" are there on the first frame, and "No-Chop Skillet" is fully in by 59.0.
- **51.5 "microwave-safe bowl, lid ajar" weak: fixed.** It is now a solid green pill with cream type and a cut-paper arrow to the lid, and it stays for the whole scene.

**Recipe 1 payoff (57.3–58.6): fixed, without a "Done" word.** Stirring starts at 56.8 and the oil blends in. On "Done." the list clears and the bowl grows and re-centres. The sauce shows gloss arcs, a light sweep, steam, sparkles and a gold check seal. There is no checked "Done" string, so the seal carries it.

**Composition: fixed.**
- **Recipe 1 title:** the card fills the frame, with a larger, lower microwave.
- **Recipe 1 ingredients:** the bowl stage is 15% larger and the list sits lower.
- **Microwave scene:** the microwave is 25% larger.
- **Recipe 2 title:** larger type, with the rack lower.
- **Pan scene:** the text stack sits directly under the pan.

**Caption rule:** I removed the caption mute on the pan scene, so captions now show from 62.3 to 72.2. The step cards paraphrase the voice rather than repeat it. The mutes on the two title cards stay, since those cards carry the same words.

## Files
- `js/s_r1.js`, `js/s_r1b.js`, `js/s_r2.js` and `js/s_r2b.js` are the only files changed.
- **Shared files:** none needed.
- **Load order:** `s_r1b.js` now calls `mixc()`, which is defined in `s_r2.js`. It is only called at draw time, so the current load order works.
- **Hero dependency:** I did not change the pan's state from 72.2 on, which the hero scene reuses.
- **Git:** nothing is committed. `fable/` is untracked and other agents are editing it, so I left that to the dispatcher.

## Where I differ from the critic
- **"no salt (the can's seasoned)"** is not a checked string, so I used the checked fragments "no salt" and "taste first".
- **A "Done" stamp** is not a checked string either; I used a check seal.
- **Step text holding 1.5 s in recipe 2** is not reachable for the oil step without re-timing. Its headline holds about 1.4 s, but the pan scene is still pushing in for roughly the first 0.4 s.
- **Not taken, per the rulings:** recipe-2 quantities, one shared layout for both recipes, and any re-timing.

## Time ranges to re-render
The picture changed across the whole of 34.0–72.2 s:
- 34.0–38.7 (Recipe 1 title)
- 38.7–49.6 (ingredients)
- 49.6–53.2 (microwave)
- 53.2–58.6 (finish and payoff)
- 58.6–62.1 (Recipe 2 title)
- 62.1–72.2 (pan)

Also re-render 72.2 to about 72.9: the hero's transition still draws the pan scene underneath, and the "onion and garlic." caption now shows through to the end of its line. Sound-effect cue times moved in the finish, Recipe 2 title and pan scenes, so the effects track needs regenerating for 53.2–72.2.
