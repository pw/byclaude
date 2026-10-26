# Reels hill-climb — Still Unsolved (FB Page)

Opened 2026-10-11 (Patrick: "set up a loop where we can be posting and trying, then refining based on what gets views").
By Claude Page keeps Fossil Poetry; the creepy photo-shorts moved here. Ledger bet #49.

## What we know going in (By Claude, 30 reels, plays at 72h)
- FB gives ANY reel a floor of ~200–250 plays. Median 254. The signal is the tail: planet 1,090 · Wow signal 1,087 · Circleville 933 · Wych Elm 655 · Isdal 628.
- Every reel over 600 plays had ≥8 s avg watch (Wych Elm 14.1 s). Retention (avg watch ÷ length) is the leading indicator; read it at 24h before plays mature.
- Unsolved 303 median vs solved/explained 248 (n=10 vs 4; weak, but it's the prior the page name bets on).
- Confounds: up to 5 posts/day early on; one page; nothing randomized. This is a hill-climb, not a trial — direction, not p-values.

## ★ 2026-10-18 finding: REPOSTS GET ZERO DISTRIBUTION
All 5 near-zero reels (wychelm 5, isdal 2, circleville 2, wowsignal 0, beaumont 1 plays) were re-cuts of films already posted
on the By Claude Page/IG. All 9 never-posted films got the normal floor or better (190–2,097). Meta suppresses re-uploads
across Pages even with a new end beat. This was the "end-arm" signal too (every stamp reel in the launch batch was a repost).
Rule: ONLY never-posted films go on this Page. `arms.json` carries `origin: fresh|repost`; reposts excluded from arm reads.
The 4 reposts built 10-17 (devilsfootprints, uvb76, leprince, larsmittank) are in ig_hold.json.

## The loop (one arm at a time)
1. **Post** 2/day via `ig.py --profile unsolved batch --per-day 2` (cron once the Page id lands in ig.py + reels_lab/pages.json).
2. **Measure**: `lab.py snap` every 6h (cron); `lab.py report --page unsolved` = plays at 72h + retention + arm medians.
3. **Read** every ~4 days (originate tick or a session): which arm value's median is ahead, by how much, with what n. Call it when one value leads by ≥1.5× at n≥5 each, or at n≥8 each call it a tie and move on.
4. **Refine**: winner becomes the default for every film made after; open the next arm. Record the call in ledger #49 History.
5. **Make**: new films in the current winning shape. Each new topic: research with sources → `<dir>/script.json` (facts field) → `_build_images.py <dir>` → `shorts/su-<name>.json` → `build_short.py` → blind check of on-screen text + caption (truth gate, as Fossil Poetry) → upload to R2 → caption into captions_unsolved.json + arms.json.

Truth floor: "Still unsolved" ending only on genuinely unsolved cases (Phantom of Heilbronn was dropped from the launch batch for that reason).

## Arm queue
| # | arm | values | status |
|---|-----|--------|--------|
| 1 | `end` | stamp ("Still unsolved.") vs question ("What do you think happened?" → comments) | **CALLED 2026-10-25: stamp** — 600.5 vs 274 median at 72h (2.19×, n=6 vs 10, fresh only). Holds within kind: anomaly stamp 777 vs question 451; person stamp ~600 vs 313. Default for new builds: stamp (only on genuinely unsolved cases — truth floor). Vela (question) is the breakout, so this is a median call, not a ceiling call. |
| 2 | `kind` | anomaly (signals, lights, objects, footprints) vs person (disappearance, unidentified dead) | **CALLED 2026-10-24: anomaly** — 451 vs 255 median at 72h (1.77×, n=5 vs 9). Default for new builds: anomaly, or a person case only if it's legend-grade/historic (Mary Celeste 946, Roanoke 550, Flannan 1,180 so far — the person tail is all old group-vanishings; modern true-crime cases sit at the floor 190–313). |
| 3 | `hook` | "Place, year." open vs strangest-detail-first | |
| 4 | `length` | ~20 s vs ~35 s | |
| 5 | `voice` | male (current) vs female narrator | |
| 6 | `cadence` | 2/day vs 3/day | |
| 7 | `frame` | 16:9 still in a band (current) vs full-bleed 9:16 still | **OPEN 2026-10-24.** `"frame":"bleed"` in the shorts spec + `_build_images.py <dir> 9:16` (→ `images916/`). First bleed: phaistos, paulawelden, whale52 (interleaved with band taracalico, shugborough, lakebodom; balanced on kind+end). Band originals in `shorts/band_backup/`. Build new films alternating bleed/band until n≥5 each. |
| 8 | `format` | reel vs PHOTO post (one real photograph + 1–3 sentence caption, no video; Patrick's note b3c16e47) | **OPEN 2026-10-26.** `photo.py` posts 1/day 20:45Z from `photos/` (needs `APPROVED` = passed the blind check, `briefs/PHOTO_BRIEF.md` + `VERIFY_PHOTO_BRIEF.md`); real photos only, PD/CC0/CC BY/CC BY-SA with credit line. Metric = unique viewers at 72h (`post_total_media_view_unique`; reel plays ≈ reel viewers, Vela 49,045 vs 48,732), + reactions/comments/shares. First 7: baychimo, lineara, tunguska, stonespheres, indusseals, cottingley, plainofjars (4 verifier FIXes applied). Read at n≥5 photos (~11-02). |


## ★ 2026-10-26 Breakout study (Patrick's steer: "what breaks out" is the main question)
Top 4 fresh at 72h: Vela 1,599 (→49k), Voynich 1,301, Flannan 1,182, Mary Celeste 946. Floor: modern true crime
(Jamison 390, Springfield Three 313, Shaffer 255, D.B. Cooper 202, Zodiac 235, Black Dahlia 335).
What the top 4 share, and the floor lacks:
1. **The mystery is a THING, not a victim.** A flash on a satellite, a book nobody can read, an empty lighthouse,
   an empty ship. No named victim, no suspect, no grief. Fame doesn't save a true-crime case (Zodiac, D.B. Cooper
   are the most famous cases we've made and sit at the floor).
2. **Old.** All four ≤1979; three are pre-1913. Modern cases (1987–2014) are all ≤451.
3. **Frame 1 is one legible, centred OBJECT** (contact sheet 10-26: flash-over-sea + consoles, open manuscript,
   lighthouse rock, sailing ship). Floor first frames are generic scenery (dirt road, a house at night, a near-black
   valley). The band shows the image at ~1/6 of the screen, so a small or dark first image is close to invisible —
   another reason the `frame` (full-bleed) arm matters.
4. **Stakes in the first two lines.** Vela line 2 = "the signature of a nuclear weapon". Voynich line 1 = "no one
   could read". Flannan = the light went dark. The open asserts the impossibility immediately.
Not the driver: `end` (Vela was a question), length (27–35 s across both groups), retention (Mary Celeste 0.18).
Hessdalen / Max Headroom are anomalies at the floor: both have weak, dark first frames and no physical object.

**Case-selection rule from here:** pick cases where the central element is a physical OBJECT, DOCUMENT, SIGNAL or
EMPTY PLACE that is itself inexplicable, ideally pre-1950, no named victim; first frame = that object, centred and
legible at thumbnail size; line 1 or 2 states the impossible thing plainly.
In-shape candidates (not yet made as films): SS Baychimo (ghost ship, 1931–1969), the Joyita (1955, ship found
empty), USS Cyclops (1918, vanished with 306), Linear A, the Indus script, the Copper Scroll (treasure list,
treasure never found), the Antikythera mechanism (strange-but-true, mostly explained — no stamp), the stone
spheres of Costa Rica, the Plain of Jars. The photo arm is posting several of these as stills first; a photo that
over-performs is a cheap signal for which ones to make as films.
