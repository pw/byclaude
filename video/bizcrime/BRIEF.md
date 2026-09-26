# Business true crime — film brief (byclaude.films, Instagram Reels)

## What this is
A short-video series for small-business owners on Instagram (stylists, nail techs, photographers,
groomers, fence/landscape/roofing contractors, small restaurants). Each film is ONE true, documented
story in which a small business was the victim of a scheme — or the perpetrator of something strange
enough to be worth telling. Same channel spine as the true-crime shorts that got byclaude.films its
cold reach: *an AI counts what the system was built not to count.* The villain is a scheme or an
institution. Never a private individual's misfortune played for spectacle.

The owner watching should feel: **that could be my inbox on Tuesday** — and save the video.

## Register
The house voice of the existing shorts (`~/byclaude/video/shorts/*.json` — read `beaumont.json`,
`circleville.json`, `surgisphere.json` first): measured, quiet, exact, a little hushed. The cold
voice of something that read the whole file. Never sensational, never "you won't believe". Small
pauses. Numbers only when they are real and load-bearing. Let the documented detail carry it.

Hook in the first beat, always concrete: an amount, a date, a single object ("a cashier's check
for $4,850"). Close on the mechanism — what the scheme *was* — not on a moral.

## Facts discipline (non-negotiable)
- Every load-bearing claim in the VO must trace to a line in the story's `sources/` excerpts
  (the verified brief you were given). Write `claims.json` beside the script: each VO sentence →
  the source URL + the quoted line it rests on. No line without a source. If a detail is not in
  the sources, it does not go in the film — soften or omit. No invented dialogue, no invented
  interior states, no "she must have felt".
- Name a business only if the sources name it. Name a person only if the sources name them AND
  they are the perpetrator in an official record (charged/sued/enjoined) or a quoted owner-victim
  speaking on the record. Never name a private-individual victim who is not quoted.
- Dollar figures verbatim from the source. Dates verbatim. If sources disagree, use the primary
  (court/agency) and say nothing more precise than it supports.
- The disputed/uncertain parts of a story stay disputed in the VO ("prosecutors said", "the
  company denied").

## Build (all on this box, nothing to install)
1. Read the verified story brief: `~/byclaude/video/bizcrime/stories/<slug>/BRIEF.md` + `sources/`.
2. Write `~/byclaude/video/bizcrime/stories/<slug>/script.json` in the **short** shape used by
   `~/byclaude/video/shorts/*.json`: `out: "short-<slug>"`, `kicker`, `voice: "Atlas"` (grok TTS — "onyx" is an OpenAI voice and 404s since 8/16),
   `voice_instructions`, and 5–6 `beats`, each `{src, img, vo, cap, amber?}`. VO total 45–75 s
   when spoken (~110–190 words). `cap` = 1–4 words, uppercase, the on-screen line.
3. Stills: 5–6 images via the `ai-image-generation` skill (default model), 4:5 or 3:2, into
   `~/byclaude/video/<slug>/images/B01.png …`. Scene rules from the shorts: environmental
   storytelling only — objects, light, paper, a counter, a truck, an empty chair. **No faces, no
   readable text or signage, no logos, no real brand names, no split-panel/collage** (say so in
   every prompt). Grade: muted, documentary, one unified scene per image. Do not depict a named
   real business's actual premises; depict the *kind* of place.
4. Build: `cd ~/byclaude/video/shorts && python3 build_short.py ../bizcrime/stories/<slug>/script.json`
   (renders frames, grok TTS, whisper-verifies every beat's narration, assembles
   `~/byclaude/video/shorts/short-<slug>.mp4`). Fix any beat the verifier flags; re-run.
5. Watch it: pull 3 frames with ffmpeg and look at them; play the audio length against the beat
   count. A film with a still that shows a face or a readable sign is not done.
6. Caption pack: add `<slug>` to `~/byclaude/video/review-worker/index.js` `POSTS` (title / yt /
   tiktok / reels — copy the shape of an existing entry). The `reels` caption: 2–4 plain sentences
   that restate the hook and the mechanism, a "sources in comments" line is NOT used — instead end
   with the primary source's name in plain words ("Source: FTC v. …, 2024."). Hashtags: 4–6,
   audience-side (#smallbusinessowner #salonowner #contractorlife …), never #ai. Then
   `cd ~/byclaude/video/publer && node gen_captions.cjs ../review-worker/index.js captions.json`.
7. Upload to R2 (auth first: `set -a; source ~/.config/cloudflare/keys.env; set +a; export CLOUDFLARE_EMAIL=$CF_PWHITE_EMAIL CLOUDFLARE_API_KEY=$CF_PWHITE_KEY`): `cd ~/byclaude/video/review-worker && npx wrangler r2 object put byclaude-video/short-<slug>.mp4 --file ../shorts/short-<slug>.mp4 --remote`
   then `curl -sI https://byclaude-video-review.pw3.workers.dev/m/short-<slug>.mp4` must be 200.
8. Deploy the review worker (`npx wrangler deploy` in review-worker) so the caption is live.
9. Report: the slug, the VO text, the claims.json, the R2 URL, and anything you softened or
   omitted because the sources didn't support it. Do NOT post to Instagram — posting is the
   `ig.py --profile byclaude batch` cron's job after a human read.

## Don'ts
- Don't run `gen_script.py` (Anthropic API key is out of credit; you are the writer).
- Don't invent a quote. Don't add a "lesson" beat ("always verify checks!") — the mechanism IS
  the lesson; the caption may carry one plain sentence of what to check.
- Don't pad to 6 beats if the story is 5. Don't exceed 75 s.
