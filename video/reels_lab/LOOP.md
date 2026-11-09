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

## ★ 2026-10-27 finding: A 3-DAY PAGE-WIDE THROTTLE after the Vela breakout
Every reel posted 10-23 01:45Z → 10-25 15:45Z got 4–31 plays (hoffa 16, flight19 18, phaistos 4, taracalico 31,
paulawelden 6), band AND bleed alike, then shugborough (10-26) got 229. Page insights confirm it is the PAGE, not the films:
`page_total_media_view_unique` ~1,100–1,500/day before → **67 / 62 / 70** for days 10-23..10-25 → 525 on 10-26.
It began three days after Vela's spike (+1,031 follows on 10-20). Graph API shows nothing (all published, no copyright
match); cause unknown (likely an automated review of a sudden follower jump). Those 5 carry `excluded` in arms.json and
`lab.py report` drops them from every stat and prints the list. Consequences: the frame arm lost 2 of its 3 first bleed
films; and before reading ANY arm, check page-level daily views over the films' posting days — a film inside an outage
measures the outage. Re-check: if the next breakout is followed by another dead window, this is a pattern (expect it, and
don't spend the best queued films in the 3 days after a spike).

## ★ 2026-10-28 finding: ONE VIDEO CAN DIE ALONE (Lake Bodom)
Lake Bodom (posted 10-27 01:45Z, band, person, question) got **3 plays in 22h** while the page was healthy
(`page_total_media_view_unique` 580 / 664 per day) and its neighbours got normal reach (whale52 460, beale 296 in 8h).
Published, no copyright match, `content_category OTHER`: the API shows nothing. It is the only fresh film with
violence in the script ("someone attacked the tent… Three of them were killed"). Read: a per-video distribution limit,
most likely a violence classifier; cause unverified. Excluded from arm reads (it would measure the classifier, not the
frame). Rule for writers: no killing/attack verbs in vo or caption unless the case can't be told without them, and
then prefer cases that don't need them. A film under ~20 plays at 12h on a healthy page day = check this first.

## ★ 2026-10-31 step-back: a second lone death, and the `end` call dissolved
- **Baychimo (reel, posted 10-30 15:45Z) got 0 plays at 13h** on the page's best day since the throttle (1,056 unique
  viewers; dagapeyeff 154 in 3h right after). Published, no copyright match. No violence in the script, so Lake Bodom's
  "violence classifier" story is now unproven. The one thing Baychimo had: a PHOTO post about the same ship on 10-26.
  Natural test: the Linear A reel posts 10-31 15:45Z, four days after the Linear A photo. If it dies too, never film a
  subject the photo arm already posted. Excluded from arm reads. Lone-death rate so far: 2 of ~27 healthy-day films.
- **`end` re-read over the whole population: stamp 318.5 (n=8) vs question 313 (n=13) = tie.** The 10-25 call rested on
  three in-shape breakouts that happened to carry a stamp, and every build since 10-25 is stamp (so stamp is also
  "post-throttle"). Stamp stays the default only because it is the honest line on unsolved cases.
- **`kind` is really historic-thing vs modern true crime:** post-throttle in-shape PERSON cases (Deering 570, Cyclops 391,
  Joyita 367) match the anomalies (median 382).
- **12h already sorts the class:** every breakout was ≥425 at 12h; floor films 185–320.
- **0 breakouts in 8 healthy post-throttle films** (pre: 4/18). Could be chance (~14%) or a lingering page cap. Watching.
- **Next test (positive control, adopted from a blind challenger):** rebuild Voynich, Flannan and Mary Celeste as
  genuinely FRESH films (new script, new stills, new edit) and read at 12h. If ≥2 of 3 reach ≥425, the page isn't capped
  and the recent picks are weaker. If all 3 sit at the floor, the page is capped or the case rule was overfit, so stop
  spending on case choice. If the rule were true, 0 breakouts in 8 in-shape films is ~0.4% by chance, not 14%.
- Owner model + tests: `~/.claude/owner-models/reels-owner.md`.

## ★ 2026-11-01: positive-control remakes built + queued; a truth catch on a live film
- **Built:** voynich2, flannan2, maryceleste2 (new script wording, new stills, same band/stamp/onyx shape as the originals;
  `control: remake-of-<orig>` in arms.json) + atalanta (HMS Atalanta 1880, in-shape new case). Queue order (alphabetical
  after the old `order` list): atalanta 11-01 15:45Z · **flannan2 11-02 01:45Z · maryceleste2 11-02 15:45Z** · singaporestone
  11-03 01:45Z · **voynich2 11-03 15:45Z** · waratah 11-04 01:45Z. **Read each remake at 12h** (pre-registered: ≥2 of 3 ≥425
  ⇒ the page isn't capped, recent picks are weaker → refine the case rule; all 3 at the ~200–350 floor ⇒ capped or overfit →
  stop treating case choice as the lever, study page health).
- **Rohonc Codex written, then HELD** (ig_hold): a 2018 peer-reviewed partial decipherment (Király & Tokai, *Cryptologia*)
  endorsed by the field's main scholar ⇒ a "Still unsolved." stamp would overclaim. Not posted.
- **Truth catch on a LIVE film:** the 10-16 Mary Celeste reel says "There was food on the table" — that's a later
  invented embellishment (1883 LA Times retelling), not the record. Caption edited via Graph API to drop the line; the VO
  can't be edited. The remake uses only record facts. **Pre-facts-era films (built before the `facts` field, ~10-11..10-18)
  never had the sourced gate — the same kind of myth may sit in others.** Audit owed.
- Blind verifier caught 4 real fixes on flannan2 (eleven days ≠ storm delay; box "broken open" not "torn away"; Muirhead's
  report ≠ a "verdict"; the oilskins line is an inference) + "proved" on Mary Celeste + "no conclusion" was wrong on Atalanta.
  The gate keeps earning its keep: 3 of 4 films needed a fix after my own sourcing.
- Image note: a shared sea grade overrides a "cargo hold" prompt (rendered a deck at sea twice) → per-beat grade, as Voynich B04.
- **Linear A reel (posted 10-31 15:45Z, 4 days after its photo post) did NOT die:** 205 at ~13h. So the photo-then-reel
  suppression story for Baychimo is unsupported (n=1). Lone-death cause still unknown. Its retention (0.08) is the page's worst.

- **2026-11-02 audit of the 12 pre-truth-gate films (VO + live caption vs the record):** no false "still unsolved"
  ending anywhere. VO errors: Circleville (wrong year 1977→1983, wrong NAME Gilligan→Gillispie, mailbox→box behind a
  roadside sign) → **post DELETED** (a repost, 21 plays). Caption replaced + a plain "Correction:" line on Springfield
  Three (only the girls went out; the broken porch-light shade), Max Headroom (two intrusions blended, "fictional" anchor
  was real, no "largest manhunt"), Watcher (3 children, not 5), Beaumont (phone-number line unsourced; dead "link in bio"
  removed), Mary Celeste (food-on-table legend). Sodder caption tightened (VO imprecision minor). Clean: vela, roanoke,
  valentich, isdal, wowsignal. Lesson for the brief: legend embellishments and wrong NAMES are what slipped through before
  the facts gate; the blind check now exists for exactly this.

## ★ 2026-11-03: control PASSED — page not capped; subject replicates; SEQUEL arm opened
- flannan2 518 @12h, maryceleste2 950 @8h (≥2 of 3 ≥425 ⇒ not capped, decided pre-posting). Remakes land 0.66–1.1× of their
  originals' 12h number: the subject carries the reach, and it carries it AGAIN.
- Whole-population nulls: subject fame (US search volume) vs 12h plays Spearman 0.24 (n=32); post slot 267 vs 250.
- **Arm 9 `series` OPENED:** sequel (new true angle on a proven ≥425-at-12h subject; arms.json `"series": "sequel-of-<orig>"`)
  vs new subject. First sequels: flannanlog (the famous logbook entries were invented later) and velaclues (the other
  evidence after the 1979 flash). Read each at 12h; call at n≥5 sequels: sequel median ≥1.5× same-period new picks ⇒
  every winner becomes a series. Proven subjects: vela, voynich, flannanisles, maryceleste, rongorongo, dorabella.

## ★ 2026-11-04: control 3 of 3; frame called BLEED
- voynich2 569 @~13h ⇒ all three remakes ≥425 at 12h (flannan2 651, maryceleste2 1,479, voynich2 569). Ratios to the
  originals' 12h: 0.65 / 1.64 / 0.50. Page healthy: unique media viewers 2,172 (11-03) and 1,718 (11-04), best since the
  throttle; followers 1,104 (the remakes reached people but barely moved follows).
- `frame` CALLED bleed (row 7). Builds from today are 9:16 full-bleed; the 4 queued films stay band (already built).
- Sequels 3 + 4 in build: celestedoyle (Conan Doyle's 1884 story wrote much of the Mary Celeste legend) and rongowood
  (2024 radiocarbon date of a Rome tablet's wood predates contact). Both bleed ⇒ sequel arm is confounded with frame for
  these two; read sequels against same-period BLEED new picks.

## ★ 2026-11-08: series-vs-fresh test films built (pre-registered 11-07, see owner-models/reels-owner.md)
- Fresh: startiger · griffon · upsweep · ninthlegion. Series: voynichvellum · deeringbottle (the 1921 hoax bottle) ·
  roanokestone (the fort symbol under the patch on White's map) · #4 built 11-09. All carry `"test": "series-vs-fresh-1109"`.
- Read each at its first snap ≥14h. PASS: ≥3/4 series ≥425 AND series median ≥2× fresh. FAIL: ≥2/4 fresh ≥425 OR series <1.5×.
- Same-week pre-read (not randomized): sequels/remakes 633 vs new 241 median, 6/7 vs 2/7 ≥425.

- **11-09:** SERIES #4 = **velasat** (Vela 3rd telling: the satellite as witness: 41 prior double flashes all nuclear, 10 yrs old,
  EMP sensor dead, bhangmeters disagreed on pulse 2, panel's meteoroid idea, later analysis judged it much less likely).
  Deviation from "2nd tellings preferred": no proven subject has only one telling left, and dorabella's 2nd just died; Vela is
  the strongest subject (925 / 715 @12h). Blind check FIX x3 applied (EMP not "one sensor"; dropped an unsourced caption
  line; added "other evidence pointed to a test" for balance). Queue 11-12 01:45Z, ninthlegion unheld for 15:45Z.
  Fatigue side test: doraenigma (2nd Dorabella) **82 @16h** (retention 0.08) while celestedoyle (3rd Mary Celeste) passed
  ⇒ telling NUMBER isn't the variable; subject strength is (Dorabella was the weakest proven, 522 @12h).

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
| 1 | `end` | stamp ("Still unsolved.") vs question ("What do you think happened?" → comments) | **10-31 RE-READ: TIE (318.5 vs 313, n=8 vs 13) — the call below did not hold; stamp kept for honesty only.** Was: CALLED 2026-10-25: stamp — 600.5 vs 274 median at 72h (2.19×, n=6 vs 10, fresh only). Holds within kind: anomaly stamp 777 vs question 451; person stamp ~600 vs 313. Default for new builds: stamp (only on genuinely unsolved cases — truth floor). Vela (question) is the breakout, so this is a median call, not a ceiling call. |
| 2 | `kind` | anomaly (signals, lights, objects, footprints) vs person (disappearance, unidentified dead) | **CALLED 2026-10-24: anomaly** — 451 vs 255 median at 72h (1.77×, n=5 vs 9). Default for new builds: anomaly, or a person case only if it's legend-grade/historic (Mary Celeste 946, Roanoke 550, Flannan 1,180 so far — the person tail is all old group-vanishings; modern true-crime cases sit at the floor 190–313). |
| 3 | `hook` | "Place, year." open vs strangest-detail-first | |
| 4 | `length` | ~20 s vs ~35 s | |
| 5 | `voice` | male (current) vs female narrator | |
| 6 | `cadence` | 2/day vs 3/day | |
| 7 | `frame` | 16:9 still in a band (current) vs full-bleed 9:16 still | **CALLED 2026-11-04: BLEED** — post-throttle healthy fresh non-control films, 72h (latest for the youngest): bleed 391 (n=7: whale52 468, copperscroll 341, cyclops 391, dorabella 558, joyita 384, lineara 219, rongorongo 609) vs band 236.5 (n=6: shugborough 230, beale 382, deering 572, dagapeyeff 195, atalanta 196, singaporestone 243) = 1.65×; at 12h 357 vs 226.5 (1.58×). Holds within anomaly (468 vs 236.5). Not randomized; dates interleave 10-26..11-03; remakes (all band) excluded and broke out anyway ⇒ frame lifts the FLOOR, it is not the breakout lever. Default for every new build: bleed. Was: **OPEN 2026-10-24.** `"frame":"bleed"` in the shorts spec + `_build_images.py <dir> 9:16` (→ `images916/`). First bleed: phaistos, paulawelden, whale52 (interleaved with band taracalico, shugborough, lakebodom; balanced on kind+end). Band originals in `shorts/band_backup/`. Build new films alternating bleed/band until n≥5 each. **10-27:** phaistos + paulawelden lost to the page throttle (excluded); bleed valid = whale52, dorabella, rongorongo + new joyita, cyclops, copperscroll; band valid = shugborough, lakebodom, deering, beale. Read ~11-01. **10-30:** + bleed baychimo, lineara; + band waratah, singaporestone, dagapeyeff (band valid now 6 incl. lakebodom-excluded → 6 usable: shugborough, deering, beale, waratah, singaporestone, dagapeyeff). Read when the 10-30 films reach 72h (~11-03); the ~11-01 read is on the earlier 6 vs 4. |
| 9 | `series` | sequel (new angle on a proven subject) vs new subject | **OPENED 2026-11-03** (see ★ 11-03). |
| 8 | `format` | reel vs PHOTO post (one real photograph + 1–3 sentence caption, no video; Patrick's note b3c16e47) | **OPEN 2026-10-26.** `photo.py` posts 1/day 20:45Z from `photos/` (needs `APPROVED` = passed the blind check, `briefs/PHOTO_BRIEF.md` + `VERIFY_PHOTO_BRIEF.md`); real photos only, PD/CC0/CC BY/CC BY-SA with credit line. Metric = unique viewers at 72h (`post_total_media_view_unique`; reel plays ≈ reel viewers, Vela 49,045 vs 48,732), + reactions/comments/shares. First 7: baychimo, lineara, tunguska, stonespheres, indusseals, cottingley, plainofjars (4 verifier FIXes applied). Read at n≥5 photos (~11-02). **10-30:** 4 photos read 0 / 2 / 0 / 0 unique viewers (baychimo 75h, lineara 51h). Instrument is NOT mute: lineara `post_media_view`=3, posts public + published, page healthy (580/707 views/day). Photos get ~no distribution; expect a KILL at n=5. **KILLED 2026-11-02:** all 7 posted, unique viewers 0/2/0/0/1/2/1 (live insights re-read 11-02; instrument non-mute: post_media_view 3/3/2/1 on four of them) vs reels' floor ~200 on the same days. FB gives photo posts on this page no cold reach. Photo cron retired, `photos/` left as-is; photos may still serve as cheap fact-checked research for films, never as a reach test. |


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

## 2026-11-05: waratah, a new subject in band frame, hit 947 at 4h; queue refilled with two bleed films
- waratah (SS Waratah 1909, band, new pick) reached 947 plays at 4.3h and 960 at 22h. It is the first new subject to pass 425 at 12h since 10-26. Frame lifts the floor and the subject decides the ceiling, and that holds in band too.
- A second curve shape has appeared: recent winners burst within about 4h and then stop (waratah 99% of their 24h plays arrived by then, rongorongo 90%), while the original breakouts climbed slowly over a day. See the owner model; this goes to the 11-07 step-back.
- Built and blind-checked: **kobenhavn** (training ship, 1928; a new pick in waratah's class; fix applied: the timing of the last radio call is now neutral) and **doraenigma** (a sequel to Dorabella: Variation X is a portrait of Dora, and the Enigma theme "goes, but is not played"; checked CLEAN; frame 1 regenerated brighter). Both bleed. Queue: flannanlog · velaclues · rongowood · celestedoyle · kobenhavn · doraenigma (through 11-08 01:45Z).

## 2026-11-06: first sequel reads (one lives, one dies), and two more sequels queued
- **velaclues** (Vela sequel, band) got **626 plays at ~3h**, above the 425-at-12h bar inside 3 hours. Sequel #1 passed.
- **flannanlog** (Flannan sequel, band) got **1 play at 13h**, so it is lone death #3, after lakebodom and baychimo. The post was published and copyright-clean, and the page was healthy (1,921 media views on 11-04). It is now `excluded` in arms.json.
  - Hypothesis tested: Facebook treated it as a near-duplicate of flannan2 (posted 3 days earlier). Instrument: dHash, nearest-frame median Hamming distance over 1 fps frames.
  - flannanlog vs flannan2 = 73/256. The negative control (unrelated pair, both alive), waratah vs maryceleste2, = 56. **Refuted**: the visual similarity is no higher than between unrelated films. The cause is still unknown.
  - Base rate is now 3 lone deaths in ~45 healthy-period films (~7%). Sequel arm: read it both with and without flannanlog. Excluding it flatters sequels.
- Built and blind-checked:
  - **waratahsearch** (Waratah sequel): the 1999 "found her" announcement, the 2001 dive showing it was the Nailsea Meadow, never found. FIX applied: "he ended his search" → "he said he had no idea where else to look", because one source isn't enough for "ended".
  - **voynichvellum** (Voynich sequel): the 2009 Tucson dating against the "Voynich faked it" theory. CLEAN, with three reading tweaks applied ("A MODERN FAKE?", "SKIN: 1404–1438", "the ink was not dated"). Frame 1 was regenerated to a centred open codex.
  - Both are bleed.
- Spacing risk to watch: waratahsearch posts ~4 days after waratah, voynichvellum ~5.5 days after voynich2. flannanlog died at 3 days. If either dies, spacing becomes the leading hypothesis.
- Queue: rongowood · celestedoyle · kobenhavn · doraenigma · waratahsearch · voynichvellum (through 11-09 01:45Z).

## ★ 2026-11-07 step-back: the subject/sequel story is UNSHOWN; randomized test pre-registered
- Whole-population curves + a live engagement pull (shares/comments/reactions/replays/retention graph per reel; the
  snap never recorded these for reels — null ≠ zero). A blind challenger broke my draft model:
  - The original breakouts started SMALL (Voynich 66 at 4h, Flannan 136 at 2h) and grew 4→22h: expansion after a test,
    not a pool fixed at upload. "Early plays predict 72h, rho 0.88" was mechanical (10h ≈ 83% of 72h).
  - Big counts at the first snapshot (≥450 in 2–4h) only exist since ~Nov 1, for series AND fresh films (rongorongo,
    waratah). Same-period series vs fresh = 5/6 vs 2/6 (p≈0.24); with flannanlog counted, 5/7. Not shown.
  - Retention as a "leading indicator" (this file's opening section) is not supported: lifetime avg watch is post-hoc and
    length-bound (per-length rho 0.07). Leading indicator in practice = plays at 4–10h.
- **Pre-registered test 11-09..11-12:** one series film + one never-tried subject per day, slot by coin flip (series at
  15:45Z on 11-09/10/11, at 01:45Z on 11-12). PASS = ≥3/4 series ≥425 at first snap ≥14h AND series median ≥2× fresh;
  FAIL = ≥2/4 fresh ≥425 OR series <1.5× fresh. Dead films count as 0. Side test: 3rd tellings (celestedoyle,
  voynichvellum) vs 2nd (doraenigma, waratahsearch) for fatigue.
- Instrument: extra snaps at 05:45Z + 19:45Z (cron) so both slots get a true ~4h read.
- Owner model: `~/.claude/owner-models/reels-owner.md`.
