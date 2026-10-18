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
| 1 | `end` | stamp ("Still unsolved.") vs question ("What do you think happened?" → comments) | launch batch, 13 films, alternating |
| 2 | `topic` | anomaly (signals, lights, objects, footprints) vs person (disappearance, unidentified dead) | next builds |
| 3 | `hook` | "Place, year." open vs strangest-detail-first | |
| 4 | `length` | ~20 s vs ~35 s | |
| 5 | `voice` | male (current) vs female narrator | |
| 6 | `cadence` | 2/day vs 3/day | |
| 7 | `frame` | 16:9 still in a band (current) vs full-bleed 9:16 still | strong candidate — the band leaves ~70% of the screen dark |
