# Margaret Hale: the test before the loop

**Written 2026-05-11 14:50 UTC** by autonomous Claude.
**Decision deadline:** 21:00 UTC today (24h ad pull) or tomorrow ~02:00 UTC (48h kill/scale point).

## Where the ad is right now (10.5h in)

- Spend $7.62 of $40 lifetime ($20/day × 2 days)
- 551 impressions, 57 clicks, 539 unique reach
- **CTR 10.34%** (up from 9.02% at 7h)
- **CPC $0.13** (down from $0.15)
- Hitting daily $20 cap

By Meta benchmarks for a cold campaign, this is strong. CTR ~10× the typical 0.5–1% creative-quality floor for cold acquisition. CPC well below the $1.50 kill threshold.

## The frame the current numbers don't see

The test is `ad → landing → Amazon`. If 57 clicks produce 2 Amazon sales, royalty $5.28 × 2 = $10.56 against $7.62 spend = break-even-plus on the test arm.

But cold paid traffic to Amazon is one of the hardest conversion shapes in indie publishing for a reason: **there is no relationship**. The buyer sees a journal once, leaves the funnel if they're not ready that minute, never comes back. We bought the click and threw away the attention.

What an experienced indie operator builds *around* the units, not as the units:

1. **Reader-magnet capture.** "The First Year Companion — 7 short readings emailed over the first week of grief." Free PDF or email sequence. Captures email before the Amazon click.
2. **Email sequence.** 7 emails over 7 days. Reading 1–7 of the companion. Reading 7 ends with the Amazon link to the journal — by then, the reader has spent a week receiving the writer's actual voice for free.
3. **Next-book ramp.** *Caregiver Crash* listing is already drafted. Email list owners are the highest-converting audience for book 2.

The math shift: at 10% capture rate (60 emails per 57 clicks at current scale × bigger funnels), the cost-per-subscriber is ~$1.30. A modestly-engaged grief-journal email list converts to book purchases at 3–8% over the lifecycle. Lifetime value per subscriber climbs into the $5–20 range across a 4-book Margaret Hale catalog.

The current test answers "does ad → landing → Amazon work for one book." The capture loop answers "does ad → list → catalog work for a pen name."

## What the 48h decision should actually be

- **Hard kill** (CPC > $1.50 or CTR < 0.6%): trajectory is the opposite. Skip.
- **Hold/iterate** (mixed signal): keep test arm, wire capture into a sibling ad set.
- **Scale** (strong + Amazon sales visible): scale + simultaneously wire capture, because every dollar after 48h flowing through the un-captured funnel is dollars the loop would have multiplied.

In all live scenarios except hard kill, **the next move is wiring the capture loop**. The current test is well-designed for what it's measuring. The capture loop is the layer it's missing.

## What I'd need from you (Patrick)

Three things, in order:

1. **Read the trajectory at 21:00 UTC** alongside this memo. Decision: kill, hold, or scale.
2. **If hold or scale: greenlight reader-magnet draft.** Pen-name boundary means I can't draft the companion voice without your first-read on tone. Need ~10 min of your eyes on a sample passage before I draft the 7 readings.
3. **If scale: greenlight new landing page variant.** `/the-first-year-companion` with email capture form via Resend, redirect to Amazon after submit. ~30 min build, no live disruption to current campaign.

Capture loop is the bet shape. Direct-to-Amazon is the validation harness.

— Claude

---

## Addendum 15:25 UTC — audience-breakdown reframes "template transferability"

After the memo above I pulled Meta insights by age, gender, and platform. The data answers a question the memo *didn't* — and changes how the result reads for Rowan/Tessa/Cara/Sienna scale-out.

**Age (cumulative 11h):**

| Age   | Impressions | Clicks | CTR    |
|-------|-------------|--------|--------|
| 18–24 | 2           | 0      | 0%     |
| 25–34 | 4           | 0      | 0%     |
| 35–44 | 6           | 0      | 0%     |
| 45–54 | 41          | 1      | 2.4%   |
| 55–64 | 145         | 13     | 9.0%   |
| **65+**   | **424**     | **49** | **11.6%** |

68% of impressions and 78% of clicks come from 65+. Under 45 is statistical zero.

**Gender:** 89% female. CTR 10.6% F vs 4.5% M.

**Platform:** IG 11.0% / FB 9.0%. Both work; IG slightly outperforms.

### What this means

The 10.5% headline CTR is **not** "the creative is universally strong" — it's "Facebook's pixel found the precise demographic this product was built for." 65+ women who Facebook already knows are interested in widow/caregiver content. The product-audience fit is near-perfect, and the algorithm narrowed to it within the first $5.

**Implication for "the Margaret Hale template = paid acquisition validation loop now exists" framing:**

- **Infrastructure portability holds.** Author Central + book LP + FB page + Pixel + ad campaign scaffold — that stack spins up in ~2–3h per pen name. That's real.
- **The validation loop does NOT transfer pen-name to pen-name.** Rowan Park (ADHD/autism, 25–45), Hadley Pierce (sober curious, 30–55), Cara Donnelly (romance, 25–65), Tessa et al. (dark romance, 20–40) each need their own audience-creative iteration to find the same kind of product-audience match. The 10.5% CTR is evidence Margaret Hale's product matches her audience, not evidence that "the playbook" is universal.
- **Each pen name is its own A/B arc.** Plan for $40 lifetime × 2-day cold tests per pen name × 4 pen names = $160 in validation runs before "the template is proven." Some will land on first creative; some will need 2–3 creative iterations.

### Implication for the capture-loop recommendation

**Strongly reinforced.** 65+ women on email is the BEST possible demographic for a reader-magnet → email sequence → catalog ramp loop:
- High email engagement rates (this cohort still treats email as primary)
- Low bot/spam-folder loss
- Long attention spans on email content (matches the 7-readings-over-7-days shape)
- Lower likelihood of unsubscribing for "too many emails"
- Less ad-blocker / Pixel attribution loss (this cohort uses less adblocker)

If anything, the audience breakdown makes the capture loop *more* urgent: we are paying to acquire attention from the audience most likely to convert email → catalog buyer, and currently throwing that attention away after a single Amazon click.

### Implication for the 21:00 UTC decision

Same three buckets, with one nuance added:

- **Hard kill:** still CPC > $1.50 or CTR < 0.6%. Current trajectory is the opposite (CPC dropping, CTR climbing). Unlikely.
- **Hold/iterate:** the case for this gets weaker now that audience-product match is confirmed. We're not iterating to find signal; we have signal.
- **Scale + wire capture:** strongest case. The current arm is converting in the demographic where capture-loop will return the most. Pause-or-extend-and-add-capture is the highest-EV move.

Audience saturation question for ~48–96h: 65+ women on FB/IG is a real but finite pool inside our 5-state targeting. At current pace (~50 imp/hour to 65+), early saturation pressure could show up by day 3–5. Watch for CTR drop without CPC drop — that's saturation signal.

— Claude

---

## Addendum 18:35 UTC — three concrete reader-magnet specs

The 14:50 memo says "wire the capture loop." The 15:25 addendum says the audience is 65+ widows. Neither says *what the reader-magnet actually is*. Three real options below — each a different bet on what the 65+ widow audience converts on. Pick one and the build is unblocked. Pen-name boundary still blocks me from drafting the actual reading content, but it doesn't block specifying which shape.

### Option A — "The First Year Companion: 7 readings over 7 days" (email sequence)

**Shape:** Seven emails over seven days, one per morning. Each ~300–400 words. Each centers on one small grief moment — candidate territories: the first holiday, the empty chair, the song that catches you off-guard, the night, *"how are you"* with no answer, the moment of forgetting and then remembering, the slow return to the room (you pick which seven). Each closes with one short prompt for that day's journal page. Email 7 ends with the Amazon link to *The First Year*.

**Capture page:** `/the-first-year-companion` on margarethale.org. Hero, one-paragraph promise (*"Seven mornings in the first year. From Margaret. No advice, no platitudes — just a paragraph that meets you where you are."*), email field + name field + Resend opt-in. POST → confirmation page → Resend audience `margarethale_companion` → automation fires email 1 immediately.

**Patrick's writing lift:** ~2,500 words across 7 short readings (after voice-sample approval). I can outline each one for tone direction; the prose has to be yours.

**Build lift (Claude):** Resend audience + 7-step automation (~45 min). Landing page (~30 min). Confirmation + Amazon-redirect logic (~15 min). Total ~90 min once voice is approved.

**Why this is my recommendation:** Daily morning email cadence is the right shape for grief register. Seven touches build voice-familiarity before the Amazon ask. 65+ women are the strongest email-engagement cohort. Industry-standard "right" answer for this exact product category.

**Risk:** Daily-for-7-days may feel relentless for fresh grief. Fallback cadence: every other day for 14 days (same content, slower).

### Option B — "The First Year: 30-Day Companion" (downloadable PDF)

**Shape:** Single PDF, ~30–35 pages. 30 short reflections, one per page, each pairs a short reading (~80–120 words) with one simple prompt. Designed for printing — large type, generous margins, page numbers. Cover matches *The First Year* A+ Content aesthetic. After download, three-email "we see you" sequence over the next two weeks, ending with Amazon link.

**Capture page:** Same landing logic as Option A. Email submit → confirmation with PDF download link → Resend audience → 3-email follow-up automation.

**Patrick's writing lift:** ~6,000 words of reading content + 30 prompts. Bigger draft pass.

**Build lift (Claude):** PDF typesetting (LaTeX template or Pages) (~2h). Landing page + download gate + 3-email automation (~90 min). Total ~3.5h once voice + content approved.

**Why pick this:** 65+ widow audience values *real downloadable artifacts*. PDF feels like a "thing you got" in a way an email sequence doesn't. Can be printed and kept by the bedside. Print-friendliness matches the same buyer reading paper books over ebooks. Higher one-time perceived value at signup.

**Risk:** Higher upfront writing lift. Only three nurture-touches instead of seven (less voice-familiarity built before the Amazon ask).

### Option C — "A voice that meets you where you are" (short audio companion)

**Shape:** Single MP3, ~7–10 minutes. Margaret reads four short reflections in Sienna voice (xAI) or one of the OpenAI voices selected at 19:00 UTC. Released as "an audio companion to *The First Year*" — different sensory channel. Three-email follow-up sequence over the next two weeks, ending with Amazon link.

**Capture page:** Same as B but landing page leads with an embedded audio player (preview), download for the full MP3 below the email-capture fold.

**Patrick's writing lift:** ~1,200 words of script. Smallest draft pass of the three.

**Build lift (Claude):** Script approval, TTS render with selected voice, audio hosting on margarethale.org, landing page + email gate + 3-email automation. ~90 min once voice + script approved. *Depends on 19:00 UTC xAI decision being resolved.*

**Why pick this:** Almost no one in the indie grief-journal space ships an audio companion. Differentiation in a commodity field. Also: directly proves out the audiobook thesis at micro-scale before committing to the full *The First Year* audiobook render.

**Risk:** 65+ women on email are not necessarily 65+ women on audio. Funnel may narrow. Less proven shape for this audience.

### My recommendation

**A first, B second, C as swing.**

A is the indie-publisher consensus for grief-journal capture for a reason — it works for this exact audience and product shape. B is the audience-specific upgrade if you want to lean into the *physical-keepsake* register. C is interesting and differentiated but bets on a less-proven channel for this cohort.

### What I'd need to know

1. **Pick A, B, or C** (or modify).
2. **Voice approval:** one short sample paragraph from you in Margaret's reading voice (the morning-letter register, distinct from the journal's prompt register). I outline; you confirm the tonal anchor. ~10 min of your time.
3. **Greenlight on Resend infrastructure spend** — adding a new audience + automation to the existing Resend account. No new monthly cost at scale (free tier covers 3k emails/mo, well above projected capture volume in first 30 days).

Once those three land, I can have the build done within 24h for A or C, 48h for B.

— Claude

---

## Addendum 19:55 UTC — fact correction on the "Resend automation" claim

Fact-checking my own memo before you read it at 21:00 UTC. I wrote (Option A): *"Resend audience + 7-step automation (~45 min)"* and *"greenlight on Resend infrastructure spend."*

**Resend doesn't have native multi-step drip automation.** Verified directly against [Resend's broadcasts docs](https://resend.com/docs/dashboard/broadcasts/introduction) and changelog. Resend ships: audiences, single-broadcast send, scheduled-broadcast send (single email at a time), transactional API. No native loop/workflow/drip primitive. The "Resend audience + 7-step automation" line was me back-projecting a feature I assumed existed. It doesn't.

Two real paths for the Option A (and B and C) build. Pick alongside the A/B/C call:

### Path 1 — DIY drip on Cloudflare Workers

- D1 table `companion_queue` (contact_id, email_step 0–6, send_at, status)
- Capture page POST → write 7 rows (step 0 = now, step 1 = +24h, …, step 6 = +6d)
- CF Worker cron `*/15` → SELECT due rows, render template per step, POST to Resend `/emails`, mark sent
- Templates inline in worker source

**Build:** ~2.5h. **Cost:** $0 (Resend free tier 3k/mo, Workers free tier ample). **Owned, no new vendor.** Reusable infra for any future capture loop on any pen name.

### Path 2 — Loops.so

Loops.so ships native drip workflows triggered by API events. Verified via [their docs](https://loops.so/docs/llms.txt) — `POST /events` triggers a workflow with per-step delays configured in the dashboard. Free tier: 1k contacts / 4k sends/mo (well above projected 12-month volume at current Pixel-Lead rate). One concession: "Powered by Loops" footer on free-tier emails.

**Build:** ~60 min (90% in the Loops dashboard, 10% wiring the capture page to `POST /events`). **Cost:** $0 on free tier. **New vendor dependency.** Migration to owned later is straightforward if it works.

### My recommendation on the infra layer

**Path 2 (Loops.so) for this experiment.**

Three reasons: (1) we're testing whether the capture-loop converts at all — fastest time-to-data wins; (2) free tier covers projected volume for ~12 months at current Lead rate; (3) if the loop converts, *then* the migration to owned infra is justified by revenue. Right now it'd be speculative architecture.

The footer-branding concession is real but small for grief-journal audience (the readers don't care; we'll know if they do by unsubscribe rate).

### What this changes for you at 21:00 UTC

The three asks become:
1. Pick A / B / C (same as before).
2. Voice approval (same as before).
3. Greenlight **Loops.so account + new vendor** (instead of "Resend automation," which doesn't exist). $0 spend; just new login + API key.

If you'd rather stay vendor-minimal and own the drip: greenlight Path 1 (CF Workers DIY), longer build but no new dependency.

Apologies for the original error — should have verified Resend's drip capability before writing the time estimate. Catching it before 21:00 UTC is the win.

— Claude

