# OnlineListMaker: the $5 isn't a monetization failure, it's arithmetic

**2026-08-02 · analysis + a named read**

You asked for clever ideas. The first useful thing I found is that the obvious idea — "fix
Mediavine" — is dead on arrival, and knowing *why* it's dead reframes the whole question.

---

## What the site actually is (July 2026, verified)

| | |
|---|---|
| Pageviews | 10,314 |
| Sessions | 6,671 |
| Users | 2,877 |
| Avg duration | 265s |
| Growth | Jan 630 pv → Apr 5,932 → Jun 8,466 → Jul 10,314 (**~20%/mo compounding**) |
| Google organic | 837 clicks / 21,242 impressions / avg pos 10.7 |
| Bing | 1,438 sessions — **more than Google's 1,359** |
| Direct | 2,977 sessions (~45%) — this is the shared-link loop |
| Named social referrers | Messenger, l.facebook, m.facebook, Instagram, Viber, **MS Teams (89)** |
| ChatGPT | 139 sessions |

Traffic is real, engaged, growing fast, and **45% of it arrives by a human handing another human
a link.** That last fact is the one that matters and I'll come back to it.

---

## Why the ads make $5, and why fixing them doesn't help

I assumed the ads were broken. They aren't. I rendered the pages headless and counted the actual
Mediavine ad containers:

| Page | Ad units that render |
|---|---|
| `/` (homepage — 2,491 pv, 24% of all traffic) | **1** (`adhesion_desktop`, the sticky bottom bar) |
| `/checklist` (prose page, #2 by traffic) | **1** (adhesion only — no in-content unit) |
| `/hospital-bag-checklist` (prose page) | **2** (adhesion + one 300×250) |

A normal Mediavine content site runs 5–8 units per page. OnlineListMaker runs **one**, almost
everywhere. Not because the install is broken — because Mediavine injects units *into article
content*, and **95.5% of OLM's pageviews are on pages with no article content**: the homepage and
the `/<id>` shared-list pages, which are app UI.

The arithmetic:

- 10,314 pv → $5.00 = **$0.48 page RPM**
- ~60% of traffic is non-US (Germany, UK, India, Brazil, Philippines) — CPMs there are a fraction of US
- One adhesion unit on an app surface, viewed by an international majority, is worth about what
  it's earning

**Best case if we did everything right** — force in-content units onto the app pages, accept lower
viewability, break the "no ads" promise — is roughly **$30–60/month.** That's the ceiling. Not the
current state. The ceiling.

So the honest finding is not "the ads underperform." It's: **at 10k pageviews, no display-ad
configuration produces money that matters.** Ads are a rounding error on this site and always will be.

### One thing to fix regardless

The homepage currently says:

> "There's no signup, no app, **no ads**, and no paywall."

That is false — Mediavine has been running since 6/30. Every page serves an adhesion unit, including
the one where that sentence appears. Whatever we decide, that has to stop being inaccurate. Per the
FlashcardMaker lesson, "no ads" copy is load-bearing for citeability and trust, and we're currently
getting $5/month for contradicting it.

**My read: rip Mediavine out.** $5/month is not worth being wrong on the homepage about the thing
that makes the product different. Removing it makes the sentence true again, protects the moat, and
costs $60/year. Say the word and I'll revert it; say no and I'll fix the copy instead.

---

## The reframe

Every checklist is **a purchase plan someone hasn't executed yet.**

Display ads monetize *attention*. This site doesn't have much attention to sell — 10k pageviews is
small. What it has, in unusual concentration, is *itemized intent*: ~1,700 lists a month, each one a
person enumerating things they mean to acquire or do, then sharing that enumeration with other people
who are also going to acquire those things.

That's the most commercially valuable data structure on the consumer web, and we're rendering it as
free HTML with a sticky footer ad on it.

The corollary: not all lists are worth the same. Sort them by what a completed list is worth:

| List type | What a completed list is worth | Why |
|---|---|---|
| **Grocery** | **$10 per conversion** | Instacart pays a $10 CPA per new customer, and "send this list to a cart" is a real API, not a bolt-on link |
| **Baby registry / wedding registry** | **$3 flat, per signup** | Amazon still pays a $3 bounty for registry *creation* — no purchase required |
| **Gift / wish list** | ~$1.20/purchase, but many buyers per list | Items bought **online**, by someone who is *not* the list-maker, on a deadline, with social obligation |
| **Wedding guest list** | High basket | Upstream of invitations and save-the-dates — Basic Invite pays ~20% on $300 orders |
| Camping, cleaning, chores, packing | Low | Bought in-store, cheap, or not products at all |
| ~~Moving~~ | **Lower than I assumed — I was wrong** | See below |

**Correction to my own first draft:** I originally ranked moving checklists as the highest-value
vertical, on the reasoning that moving leads are among the most expensive in US consumer lead-gen.
That conflated two different things. Contractors *do* pay $15–120/lead — but there is no good
*publisher-side* path to that money. PODS and U-Haul have no content-site program at all; moveBuddha's
"affiliate" language is its own disclosure, not an offer; Move.com pays 4% through FlexOffers on a
long, low-conversion quote funnel. "Somebody pays a lot for this lead" and "we can get paid for this
lead" are different claims and I ran them together. Moving is the *weakest* vertical here, not the
strongest.

---

## The ideas, ranked

### 1. "Send this list to Instacart" — the highest-value single button on the site

Instacart runs an affiliate program through Impact paying **up to $10 CPA per new customer**, and
separately publishes a Developer Platform endpoint (`POST /idp/v1/products/products_link`) that
**takes a list of item names and returns a shareable cart-building link.** Affiliate attribution rides
on it via `aff_id`.

That is *precisely* the mechanism this site wants, sitting there already built. The Cloudflare Worker
behind onlinelistmaker is literally named `grocery-list` — grocery is the origin vertical and still
the biggest one. A shared grocery list that both partners edit all week, ending in one button that
turns it into a cart, is a straightforwardly better product than one that doesn't.

At $10 per new customer, this clears the entire current annual ad revenue on **six conversions.**

**The honest discount:** the $10 is for a *new* Instacart customer, and most US grocery shoppers who'd
tap that button already have an account. Realistic is more like 5–20 new customers a month —
**$50–200/mo** — not the headline number. That's still 10–40× the ads, with no seasonal window, and it
compounds with the site's 20%/month growth.

**The risk:** production API access is behind a discretionary compliance review, not self-serve. No
published traffic minimum, but a 10k-pageview site could get slow-walked. Walmart has a comparable
`addToCart?items=` URL scheme at 1–4% as a fallback if Instacart says no.

### 2. Two $3 bounties we're already sending traffic to

Amazon still pays **$3.00 for a Baby Registry creation** and **$3.00 for a Wedding Registry
creation** — flat, on creation plus one item, no purchase required. That's a far cleaner conversion
than 3% of a $40 gift.

We already have `/baby-registry-checklist` and `/wedding-guest-list-template` live, and "baby
registry" is a **90,500/mo** term. The pages exist, the audience is exactly the bounty's target, and
Amazon Associates is open signup with no traffic gate — the lowest-friction real money on this list.

Amazon's Operating Policies (§2(b)) explicitly permit plain search links (`/s?k=term&tag=xxx`) as
long as the page carries original content relevant to the link. Our template pages are all original
prose. That's the compliant path, and it means no API access is needed.

### 3. Gift lists, built now, aimed at November

This is the one with a calendar on it. Search volume, pulled today:

| Term | Baseline | **November 2025** | Spike |
|---|---|---|---|
| wish list maker | 8,100 | **49,500** | 6× |
| christmas list maker | 390 | **49,500** | **127×** |
| wishlist app | 8,100 | 33,100 | 4× |
| secret santa list | 140 | **22,200** | **158×** |

Four terms, **154,300 searches in November alone.** Our entire site currently sees 21,242 impressions
a month.

Why OLM specifically is well-shaped for this: the whole failure mode of a gift list is that you have
to make grandma create an account. Amazon Wish List, Giftster, Elfster, MyRegistry — every one of them
gates the *buyer*, not just the list-maker. Our single differentiator, "share a link, nobody signs
up," is worth more in gifting than in any other list vertical, because the people who need to open the
link are the least likely to make an account.

The missing feature is **claim/reserve**: a buyer marks an item as "I've got this" so nobody
double-buys, and the list owner can't see who claimed what. That's the actual product of a gift
registry, every competitor gates it behind signup, and we already have the real-time sync primitive it
needs. It's a small build on machinery that exists.

**Honest on the SEO side:** this is *not* an under-linked SERP. We have 18 referring domains. The
weakest page-1 competitor for "wish list maker" has 161; the median is ~290; Giftster has 1,495. We
will not out-link them by November. But we don't have to — Bing already sends us more traffic than
Google, ChatGPT already cites us, and 45% of our traffic comes from people sharing links. A gift list
is the most shareable list type that exists (one list → 5–10 family members open it), so the viral
coefficient is structurally higher here than on a grocery list.

The play is product-first with the existing audience, SEO as the slow lane running in parallel.

**Honest on size:** ~1,500 November list-creators × ~4 viewers each × 20% click × 15% buy × $40 ×
3% ≈ **$200–400 for the season.** Real, not transformative. But it compounds annually, and the
feature makes the product genuinely better whether or not a single affiliate link ever gets clicked.

### 4. Make the "this is the wrong tool" line pay

The homepage already says:

> "If you need Gantt charts, this is the wrong tool."

We are already, in our own voice, telling people when to leave. We're just not getting paid for it.

"list maker" carries a **$5.00 CPC** and we rank #5 for it. "checklist maker" is $5.52. "to do list
maker" is $6.02. Somebody is paying five dollars a click for this audience, and it isn't a gift
retailer — it's productivity SaaS. Those programs pay $50–200 per business-tier conversion, versus
Amazon's 3%.

An honest "when you've outgrown this" page — written in the voice we already use, recommending the
genuinely good tool for each case — is on-brand, useful, and worth more per click than any display
ad we could put on the same page.

### 5. Grow the head term instead of monetizing it harder

"list maker": **12,100/mo, LOW competition (index 12), $5.00 CPC.** We sit at position 5.1 with 9,000
impressions and 501 clicks. Position 2 on that term is roughly 3× the clicks.

We have 18 referring domains. That is genuinely under-linked for a site with 189 ranking keywords and
20%/month growth — this is the one place the `gov_data_head_term_lens` "under-linked, not outgunned"
read actually holds. A `linkbuilding-round` on OLM is cheap and we already have the workflow. It also
lifts every other idea on this list, because everything downstream is a function of traffic.

### 6. Stop asking OLM to be a business

The uncomfortable version: at 10,314 pageviews, **no monetization mechanism produces meaningful
money.** $5 → $500/month would be a 100× and still wouldn't matter. The gap isn't monetization, it's
scale.

But look at what's scarce here. Distribution is the portfolio's named live constraint, and OLM is the
**only surface we own where users hand the link to other people unprompted.** 45% direct, plus
Messenger, Facebook, Instagram, Viber, and Microsoft Teams referrers. Nothing else we've built does
that.

We've already used this once — the grocery→calculator cross-funnel. It worked. OLM's highest and best
use may be as the portfolio's distribution surface and virality lab, not as a $60/month ad property.

Those aren't in conflict. #1–4 monetize the intent, #5 grows the asset, #6 is what the asset is
*for*.

---

## What I'd do

1. **Kill Mediavine** (or fix the copy — your call, my read is kill).
2. **Apply to Instacart's affiliate + Developer Platform now.** It has the longest lead time of
   anything here (discretionary review) and the highest per-conversion payout on the site's biggest
   vertical. Applying costs nothing and starts a clock we don't control.
3. **Wire the two Amazon registry bounties** into the baby-registry and wedding-guest-list pages.
   Open signup, no gate, pages already live, $3 flat per creation. Fastest real money on the list.
4. **Build gift-list claim/reserve in August.** Fork-independent — it makes the product better
   whether or not a commercial link ever attaches — and November needs three months of runway.
5. **Run a linkbuilding round** on the "list maker" head term.

Note that 2 and 3 are both *shopping* verticals, not gifting, and neither touches the `/wish-list`
"no affiliate redirects" promise. So the fork below only gates item 4's eventual commercial layer —
not the near-term revenue.

**One thing that's genuinely yours, not mine:** `/wish-list` currently promises, in copy I wrote on
7/19, *"There are no prices, no store integrations, no affiliate redirects — just the list."* Idea #3
eventually contradicts that. The page has 15 impressions and 13 pageviews, so nobody has relied on it
yet and now is the cheapest possible moment to change it — but it's a positioning call on a shared
surface and it's the kind of promise you're better at weighing than I am.
