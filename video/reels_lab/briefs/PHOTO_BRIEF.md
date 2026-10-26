# Still Unsolved — PHOTO post brief (arm `format`: photo vs reel, opened 2026-10-26)

Style (Patrick's specimen, a "Mind Boggling" page post): ONE striking real photograph + a 1–3 sentence caption.
No video. The photo does the stopping; the first sentence of the caption does the hooking.

You are making ONE post on the case/topic you are given. Write everything into
`~/byclaude/video/reels_lab/photos/<slug>/`:

1. **The image** — a REAL photograph (or a real artifact photo) from Wikimedia Commons whose licence lets us post it:
   Public Domain, CC0, CC BY, or CC BY-SA. NOTHING else (no fair use, no "copyrighted free use" unless the Commons
   page states a clear free licence, no NC/ND). Check the licence with the Commons API, not by eye:
   `https://commons.wikimedia.org/w/api.php?action=query&titles=File:<name>&prop=imageinfo&iiprop=url|extmetadata&format=json`
   (read extmetadata.LicenseShortName, Artist, Credit, UsageTerms). Use a browser-like User-Agent with curl.
   Pick the MOST striking image available (strange, clear, high-res ≥1000 px wide). Never an AI image, never a
   drawing passed off as a photo. Download the original to `image.jpg` (or .png), ≥1000 px wide if at all possible
   (use the `thumburl` with `iiurlwidth=2048` if the original is huge).
2. **meta.json** — {"slug","topic","commons_file","commons_page_url","licence","author","attribution","image","width","height","kind":"anomaly|person|place|object","status":"unsolved|explained|debated"}
   `attribution` = the exact credit line we will print, e.g. `Photo: Jane Doe, CC BY-SA 4.0, via Wikimedia Commons`
   or `Photo: public domain, via Wikimedia Commons`.
3. **caption.txt** — the post text, in this shape:
   - Sentence 1: the strangest TRUE thing, concrete (place, year, number). No "You won't believe", no clickbait
     punctuation, no emoji, no hashtags. Quiet and exact, like a museum label written by someone who is a little haunted.
   - 1–2 more sentences: what makes it strange / what nobody can explain. 35–75 words total for the body.
   - If (and ONLY if) it is genuinely unsolved as of October 2026, a final line: `Still unsolved.`
     If it has an accepted explanation, do NOT pretend otherwise; let the strangeness carry it.
   - Blank line, then the attribution line from meta.json.
4. **sources.md** — every factual claim in the caption with ≥1 reliable source URL (2 for anything surprising).
   Verify each claim on the web yourself. Today is 2026-10-26; check 2024–2026 news for any "solved" development.

Rules: no living private person named; no suspect named; nothing cruel or sensational about victims; no
speculation stated as fact. Report back in under 120 words: the file chosen, its licence, the caption, any doubt.
