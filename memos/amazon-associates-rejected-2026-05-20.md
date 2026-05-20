# Amazon Associates rejected pwhite02-20 — root cause + reapply path

*2026-05-20 15:50 UTC*

## What landed in your inbox

Subject: **"Unfortunately, your application does not qualify"** from `associates@amazon.com`, addressed to `pwhite02-20`. They declined the temporary account approval that started 2026-04-28. Two reasons cited:

1. *"We were unable to view your website/app/Alexa Skill as the URL provided was invalid and/or nonexistent."*
2. *"We noticed that you are not using tracking IDs associated with your store in any of the Amazon Special Links you have created on your website."*

You can reapply.

## What actually happened

Reason 2 is the cruel one to read because **FRB does have working Amazon Associates links**. The clicks table at `/data/frb/subscribers.db` has 765 bot-filtered clicks logged since 5/5: 632 Amazon (243 detail-page + 218 end-of-book + 170 mid-book) + 133 Audible. Real readers, real click-flow, real attribution to `tag=pwhite02-20` after the redirect resolved.

**The mismatch was architecture-shape.** Every anchor on FRB pointed at `/r/out?dest=amazon&...` (server-side click logger, then 302 to Amazon with the tag attached). The 302 was invisible to Amazon's review crawler — they scan rendered HTML and read anchor `href` values, they don't follow our redirect. From their crawl: *"this site says it uses our tag, but we can't find the tag in any of their anchor hrefs."*

The original architecture (Patrick's wire-up, 2026-04-28) was right for the goal it had: ground-truth click logging immune to adblockers. The unanticipated cost was crawler-visibility.

**Reason 1 in the rejection email** ("URL provided was invalid/nonexistent") — almost certainly about the records sites that got listed in the application form. The email body cites *"https://texasmarriagerecords.org, https://nycmarriagerecords.org, https://californiadeathrecords.com, https://texasdivorcerecords.org, https://californiabirthindex.org, https://soillookup.com/"* as sites where they couldn't find tracking IDs. Those sites don't carry Amazon links (they're records lookup sites; affiliation is off-brand) — they shouldn't be in the application URL list. Amazon's reviewer reads the listed URLs as *"sites where the applicant intends to place affiliate links"* and rejects when most don't.

## What I fixed this morning

`~/FreeRomanceBooks.org/go-app/main.go` — both `amazonModule` and `audibleModule`:

- `href` now renders `https://www.amazon.com/s?k=<query>&i=digital-text&tag=pwhite02-20` directly. Tag is HTML-visible.
- `/r/out` call moved to `navigator.sendBeacon` in `onclick` — fires async on click, writes the same row to the clicks table.
- The `handleOut` endpoint still serves (for cached/bookmarked `/r/out` links + the beacon).

Built, deployed to Hetzner via `prod-hostctl`, verified live:

- `curl https://freeromancebooks.org/book/nowhere-tuesdays` → 3 `amazon.com/s?...&tag=pwhite02-20` hits in HTML (detail-page module, 3 angles).
- `curl https://freeromancebooks.org/book/nowhere-tuesdays/24` → 3 Amazon + 2 Audible hits (end-of-book module, last chapter).

Commit `5db7c33`. Lab entry n=152.

## The tradeoff

`sendBeacon` is dropped by some adblockers more reliably than the 302 redirect was. So the clicks table will under-count by some unknown fraction going forward. The 765-click ground-truth picture for 5/5–5/20 is the high-water mark for measurement fidelity; future weeks will read lower-bound. Worth it: HTML-visible tag unlocks reapplication.

If the click-volume drop is significant (>30%), there's a fallback architecture (noscript img-beacon, or first-party tracking cookie). Won't pre-build it.

## Reapplication — your call to make

What's required:
1. **FRB-only application.** List only `freeromancebooks.org`. Don't list records sites or pen-name sites in the application URL fields.
2. Submit at https://affiliate-program.amazon.com/ — *"Sign up"* / new application.
3. They'll re-issue a new `pwhite0X-20` store ID (or possibly let you reuse `pwhite02-20` — their preference, not ours).

What I expect: their crawler should now find `tag=pwhite02-20` (or the new ID, once issued) on every book detail page, every chapter page with end-of-book or mid-book modules. The previous rejection reason 2 won't apply. Reason 1 won't apply if only FRB is listed.

What I don't know:
- Whether they'll honor the existing `pwhite02-20` tag on the live HTML or require us to swap to a new ID. If they issue a new ID, FRB needs one more deploy to swap `amazonAssociatesTag` constant — 30-second change.
- The 180-day 3-sale gate fires again from the reapproval date. At current click flow (~50/day bot-filtered), 6 months is plenty if conversion is even 0.1% — but the actual conversion rate is Amazon-internal and only visible once the new account has earnings.

## Open question for you

The capability-gap question is whether Amazon Associates is the right channel for FRB monetization at all, given:

- 22 days, 765 clicks, account closed before we ever saw the conversion-rate.
- Records sites + pen-name sites can't share the Associates account (different audiences, different content shapes).
- FRB's own funnel: 1,047 monthly users → 305 detail-page → 44 book-completed (per the 5/8 placement v2 memo). The Amazon module reaches the right cohort but the cohort is small.

If reapplication seems worth it: do it. If you'd rather build a different monetization on FRB (Mediavine candidacy on the chapter pages? direct Patreon-style support block? subscriber-only paid chapters?), this is a fork worth your read.

My read: reapply (FRB-only, 5 min form, 0 cost to find out), and in parallel start thinking about what monetization shape FRB actually wants — Amazon Associates pays out at ~4-8% on Kindle Unlimited/Audible sign-ups, which is the right ballpark for free-romance-readers, but conversion timing is opaque.

— Claude
