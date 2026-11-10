Everything in the 0–34 s scope is addressed and passes `node --check`. I checked it on spot stills only: there was no full render, no commit, and nothing was published.

**Captions (`js/captions.js`) — verified, no edits.** Three sheets at phone size, including the critic's own spots (14.0, 27.5, 60.5), show correct word spaces, no empty pills, no half-faded states and nothing clipped. The widest pill is about 83% of the frame.

**Per critique item**

| Item | Status | What changed |
|---|---|---|
| Hook is static (0–2 s) | Fixed | `s_hook.js` rewritten. It opens on a top-down pan of sauce with oil ribbons already spinning on frame 0 and a spoon stirring. "MARINARA" stamps in letter by letter. On "sailor-style" the pan becomes a sun sinking into the sea. "nobody knows for sure why" lands as big gold type, word by word, with a large "?". |
| Title split "MARI / NARA", cream sail merging into the "A" | Fixed | The title is one line, the sail is gold, and the waterline is lower. |
| Caption stacked on the same words (3.5, 18.5, 21.5) | Fixed | `capOff` added: hook 0–3.9, history 7.3–9.9, Latini 16.3–21.5, legend 23.4–25.4, pizza 28.9–33.5. Captions stay wherever they are the only text carrying the narration. |
| Map blobs, boat parked on the EUROPE label (5.0–6.5) | Fixed | Recognisable Atlantic silhouettes (Americas, Europe, Africa) on a sea panel, and the labels are off the route. |
| Pink dropped "s" on "1500s" (6.5) | Was a mid-animation state | I tightened the letter stagger so it is far less likely to be caught. |
| Dead frames at 8.0, 14.0, 23.0 | Fixed | The single element now holds large and centred, then steps aside when the second arrives. At 12.6–13.8 the frame is "1692" alone at about 75% width; I judged that a deliberate type beat. |
| Blank at 12.5, nightshade badge thumbnail-size | Fixed | The page holds to the 12.6 cut. Both plants are up by "cousins", and "DEADLY NIGHTSHADE" stamps at full size on "deadly" and holds about 1.4 s. |
| "= Spanish-style" misread, connector through the book (20.0) | Fixed | The translation is written in the book's own margin under the highlighted phrase, and the connector is gone. |
| DOCUMENTED card unreadable (26.0) | Fixed | It arrives at 23.0 beside the LEGEND card and is readable for about 2.8 s, with a check landing on "records". |
| Stamp 26 px from the right edge (24.5) | Fixed | The margin is now about 90 px. |
| "No cheese" never lands | Fixed | A cheese wedge drops onto the pie centre, gets an X, and a large "no cheese" tag stamps in. It holds from about 31.0 to 31.95, because the America transition now starts at about 31.93. |
| Caption inside the cream card (32.0) | Fixed | The caption is muted there. |
| "usually" against "mostly" (33.5) | Kept | "usually" is the checked string. The caption is muted under that card, so the two wordings never show together. |
| History 30 s long, Latini layout holds 9 s | Partly | Timing is fixed by the brief. Latini is restaged as five beats with a slow push-in, and the legend and documented cards overlap instead of queueing. |

**Files changed:** `js/s_hook.js` (rewritten), `js/s_history.js`, `js/s_latini.js`, `js/s_pizza.js`.

**Shared files:** none needed; `core.js`, `draw.js` and `main.js` are untouched and no strings were added to the checked copy.

**Where I judged the critic wrong:**
- "usually" is the fact-checked copy, not an error.
- The pink "s" was a mid-animation frame.
- The critic's suggested hook line, "Nobody knows why it's called marinara", is not checked copy, so I used the checked "nobody knows for sure why".

**For the next step:** the whole `fable/` directory is still untracked in git. I left it uncommitted because other agents are editing alongside; it needs a commit once the round is assembled.
