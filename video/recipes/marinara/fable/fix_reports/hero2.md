All eight items are fixed in the hero and the close. I checked them on contact sheets only (14 sheet reads, no full render), and all three files pass `node --check`.

## Per critique item

| Item | Status | What changed |
|---|---|---|
| 74.0 droplets before pooling | Fixed | The scattered specks are gone. Plain simmering sauce (bubble rings, fading stir marks) goes straight to oil pooling at the rim from 73.55. |
| 75.5–77 oil ring | Fixed | The ring is now a thin, uneven translucent amber film with red showing through and a pale inner edge. One highlight travels around it from 75.35 to 77.75. |
| 80–81.5 "spaghetti" ribbons | Fixed | Three translucent marbled streaks peel off the rim behind the spoon, tapered at both ends. From 81.25 they neck and break into beads, from the centre outward. |
| 83–86 beads | Fixed | About 300 non-overlapping beads sit along the spiral arms, at roughly a quarter of the old size and varied. No drop shadows; each has a dark rim, amber body and one small highlight. |
| Light pass | Fixed | The sauce dims from 83.3. One diagonal bar of light crosses corner to corner from 84.45 to 86.3, starting on the word "light." and running through the silent hold. Bead glints fire in sequence as it reaches them, and a few keep twinkling to the cut at 86.45. Nothing covers it. |
| 83.0–84.5 caption on the pan | Fixed | The camera push keeps the pan's bottom rim at about y 1382–1410, above the caption pill (about 1398–1506 at its tightest), so the caption stays on dark ground. The spoon handle now leaves the frame on the right, above the caption line. |
| Header at y=186 | Fixed | "THE SIGNATURE MOVE" is at y=246; the notes and the "olive oil" label moved down with it. |
| Close 86.4–90 | Fixed | The plate is larger and lower. It carries a generous glossy sauce with the swirl's grooves and the hero's beads, which get a glint run on "More recipes coming." The opening is a match cut: the hero's sauce pulls back and is the sauce on the plate. The sign-off sits under the plate. No series name or handle. |

## Files
- `js/s_hero.js` and `js/s_close.js` were rewritten.
- `js/hero_gl.js` now holds only the shared `HOIL.bead` used by both scenes.
- `window.MUSIC` is unchanged.
- No strings were added or reworded.

## Shared files
None needed editing. The hero's sound cues moved, so the SFX mix needs regenerating from the cues:
- **Removed:** pops at 73.3 and 74.0.
- **Moved:** band shimmer to 75.35; bead pops to 81.7 / 82.15 / 82.6; light shimmer to 84.5; ding to 85.4.
- **Unchanged:** the close's cues.

## Where I differ from the critic
Nothing significant. The critic offered "finish the caption before the sweep or move it to the top"; I kept the caption where it is and kept the pan clear of it instead. The last caption chunk ends at about 84.99, so it overlaps the first half-second of the pass, but on dark ground below the pan.

## Picture changed
**72.2–89.99**: every frame of both scenes, since the hero's camera and header moved from its first frame. The cut into the hero at 72.2 still matches the previous scene's framing.

Nothing was committed (`fable/` is untracked and other agents are editing it), and nothing was published.
