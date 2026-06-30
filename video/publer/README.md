# Publer poster — the By Claude true-crime distribution backbone

One render → TikTok + Instagram Reel + YouTube Short + Facebook Reel, each with its own
caption, in a single API call. The point: **take Patrick out of the posting loop** so the
cadence doesn't depend on anyone remembering to hand-post (the real failure mode for the
channel). He connects the accounts in Publer once; after that, I run `publer.py`.

## One-time setup (Patrick)
1. Account prerequisites (platform rules, not Publer's):
   - **TikTok** @byclaude = a **Business or Creator** account.
   - **Instagram** @byclaude = **Business or Creator**, linked to the By Claude **Facebook Page**.
   - YouTube channel + FB Page already ours.
2. **Publer**: sign up → upgrade to **Business** (~$31/mo for 4 accounts; the API needs Business)
   → **connect** TikTok, Instagram, YouTube, the Facebook Page (OAuth).
3. **Generate the key**: Settings → Access & Login → API Keys → Create API Key
   (name it "Claude posting", give it the posting scopes) → hand it to me.

## Key storage
`op://Claude Code/Publer API Key/credential` (1Password), or `$PUBLER_API_KEY`. Nothing
else in this folder holds a secret.

## Staged test plan (run in this order the first time)
1. `python3 publer.py check` — read-only; confirms the key works and lists every connected
   account with its provider→id. Run this the moment the key lands.
2. `python3 publer.py post --film shipman --video ../shorts/short-shipman.mp4 --only tiktok --state draft`
   — smallest blast radius: one platform, a **draft** (lands in Publer for review, nothing live).
   Eyeball it in the Publer UI.
3. Widen to all four as a draft; review.
4. Flip a real one live: `--state published` (or `--state scheduled --at <ISO8601 UTC>`).

`--state draft` is the **default** on `post` precisely so a stray run never blasts anything live.

## captions.json — generated, don't hand-edit
`captions.json` is lifted verbatim from the live review worker so it never drifts:
```
node gen_captions.cjs ../review-worker/index.js captions.json
```
Re-run that whenever the caption packs in `review-worker/index.js` (the `POSTS` object) change.

## API basis (verified against publer.com/docs, 2026-06-30)
- base `https://app.publer.com/api/v1`; auth `Authorization: Bearer-API <key>` +
  `Publer-Workspace-Id: <id>`.
- `POST /media` (multipart `file`) → `{id,path}` synchronous · `POST /posts/schedule/publish`
  `{bulk:{state,posts:[{networks,accounts}]}}` → `{job_id}` · poll `GET /job_status/<id>`.
- Vertical-video network types: tiktok `video` · instagram `reel` · youtube `short` · facebook `reel`.
- Rate limit 100 req / 2 min.

`--video` takes any .mp4 — these four shorts today, every future short and long-form film after.
