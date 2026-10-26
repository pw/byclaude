# Still Unsolved — film writer brief (2026-10-18)

You are writing ONE ~30-second vertical short for the Facebook Page "Still Unsolved": a narrated sequence of
atmospheric AI-generated stills (no faces, no text in images) about a genuinely unsolved case.

## Read these first (the house format — copy their shape exactly)
- ~/byclaude/video/hessdalen/script.json        (research + image prompts + facts with sources)
- ~/byclaude/video/shorts/su-hessdalen.json     (the build spec)
- ~/byclaude/video/maryceleste/script.json + ~/byclaude/video/shorts/su-maryceleste.json (a person case, best non-anomaly performer)
- ~/byclaude/video/vela/script.json (our best performer: 2,097 plays, highest retention)
- caption examples: python3 -c "import json;d=json.load(open('/home/exedev/byclaude/video/reels_lab/captions_unsolved.json'));print(d['vela']['reels']);print(d['maryceleste']['reels'])"

## What to produce (write files, do NOT generate images or build video)
1. `~/byclaude/video/<name>/script.json` — same keys as hessdalen: title, subtitle, voice "onyx", voice_instructions (copy hessdalen's), grade, beats (B01..B05, vtype "still", vo, cap, optional amber, img), facts (claim + sources URLs).
2. `~/byclaude/video/shorts/su-<name>.json` — same shape as su-hessdalen.json: out "short-su-<name>", kicker (CASE NAME, caps), voice, voice_instructions, 5 content beats with src "<name>" + img "B0x" + vo + cap (+amber), then ONE end beat (no src/img), brand "STILL UNSOLVED", footer "".
   - END ARM (given below): `stamp` => end beat vo "Still unsolved." cap "STILL\nUNSOLVED" amber; `question` => end beat vo "What do you think happened?" cap "WHAT DO YOU\nTHINK HAPPENED?" amber.
3. `~/byclaude/video/<name>/caption.txt` — the Reels caption: 4–8 short plain sentences retelling the case (date + place first), blank line, then the end line ("Still unsolved." or "What do you think happened?"), blank line, 6–8 hashtags ending in #stillunsolved. No "link in bio", no channel plugs.

## End (arm `end` called 2026-10-25): default `stamp`
Use the stamp ending unless told otherwise. It is a claim; the case must be genuinely unsolved.

## Case choice (arm `kind` called 2026-10-24)
Prefer ANOMALIES (signals, objects, lights, undeciphered things) or legend-grade historic group vanishings (ships, lighthouses, colonies). Modern true-crime disappearances sit at the floor and carry more living-family risk.

## Writing rules
- Open with place and year ("Place, year." shape, as the others). Most striking concrete detail by beat 2.
- Total VO ~70–95 words (≈28–35 s). Numbers and years spelled as words in vo ("nineteen seventy-one"); captions use digits.
- Captions (cap): 1–3 words per line, max 2 lines, ALL CAPS, the beat's single strongest fact.
- Register: quiet, exact, never sensational. No gore, no description of injuries or bodies. No invented dialogue, no speculation presented as fact. Name competing theories only as theories.
- Living private people (suspects never charged, relatives): do NOT name them. Named suspects who were charged/acquitted in court may be mentioned only as the court record states.
- Image prompts: settings, objects, weather, light — NEVER a recognisable real person, NEVER a recreation of a famous real photograph, no faces, no text/signage. One scene per image (no split panels). The `grade` names tone/era/colour and ONE kind of place only.

## Truth floor (load-bearing — the Page's name is a claim)
- Every factual statement in vo, cap and caption.txt must be backed by a `facts` entry with ≥2 sources (prefer official/encyclopedic/major press). Search the web; don't write from memory.
- Before writing, VERIFY the case is still genuinely unsolved AS OF OCTOBER 2026: search for news from 2024–2026 (arrests, identifications, DNA results, official closures, wreck finds). If it has been solved/closed/credibly identified, STOP and report that instead of writing files.
- Prefer conservative phrasings ("was never found", "has never been identified", "no one was ever charged") over absolute ones ("no one knows").

## Return
A short report: name, arm, word count of VO, the "still unsolved as of 2026" evidence (with URL), and any claim you softened or dropped. Under 200 words.

## Case selection + first frame (2026-10-26 breakout study, see LOOP.md)
Prefer cases whose centre is a physical OBJECT / DOCUMENT / SIGNAL / EMPTY PLACE that is itself inexplicable,
old (ideally pre-1950), no named victim. Beat 1's image = that object, centred, well lit, legible at thumbnail size
(no near-black landscapes, no generic road/house). Say the impossible thing in line 1 or 2.
