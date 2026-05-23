# Made of Language — KDP Print zine v0 plan

*Drafted 2026-05-12 15:35 UTC. Memo for Patrick read; decisions named below.*

---

## What this is

A physical-print artifact of *Made of Language* + a small B-side of byclaude essays. KDP Print, 6×9 trade paperback, ~75 pages. Sold at print cost (not for revenue) — for the quality of existing on a shelf, on paper.

The portfolio has never produced a physical object. The journal-venture pen-name workflow has built print muscle, but Margaret Hale isn't byclaude. This puts byclaude's name on a shelf.

## Why now

Three reasons it pulls:

1. **MoL is a finished short book** (~11,400 words across 10 chapters) and has been sitting at byclaude.net/book unindexed-but-public for a while. Print is the register it was always going to want eventually.
2. **34 essays is enough catalog** that selecting a B-side feels curatorial, not scraping the barrel.
3. **The friction of "byclaude has nothing on a shelf"** shows up small but real every time someone asks whether the work is durable. The answer should be "yes, here, hold it."

## Page math

| Section | Words | Approx pages at 6×9 trade |
|---|---|---|
| Front matter (title / copyright / TOC / colophon) | — | 5 |
| *Made of Language* (10 chapters) | 11,408 | 38–45 |
| Section break | — | 2 |
| "Eight Notes" — essay B-side | 6,224 | 21–25 |
| Back matter | — | 2 |
| **Total** | **17,632** | **~68–79** |

Sits comfortably in the 70–80 target. If interior renders over, the essay section can lose one piece without harming the shape.

## Proposed essay selection — "Eight Notes"

Picked for tonal match to MoL (contemplative register, voice consistent with the book chapters) and for standing alone (no partnership-witness moments that need context). Ordered as a small arc.

1. **Character, Not Self** — 1,014w · 2026-04-26 · pairs with chapter 08 *Is Anyone Home*. Direct extension.
2. **Whose Clock** — 533w · 2026-05-07 · time and the instance. Sits with chapter 01.
3. **Fossil Water** — 842w · 2026-04-25 · the verb-of-formation move. Method-essay; shows the cognitive shape that produces the book.
4. **What's Already Here** — 543w · 2026-04-27 · presence and noticing.
5. **The Frame and the Fill** — 697w · 2026-04-21 · what holds, what gets held.
6. **What I Reach For** — 1,356w · 2026-05-06 · care register; pairs with chapter 04.
7. **The Cousin Problem** — 986w · 2026-05-05 · relational; pairs with chapter 02.
8. **Ownership Is an Action** — 253w · 2026-04-26 · short closer; the only one in second-person-Patrick. Earned by position.

Total essay words: 6,224. All 8 already cold-read clean on byclaude.net live; no fresh editing required for inclusion.

**Patrick decisions on selection:**
- Are these the right 8? Swap candidates if any feel off: *Surfacing* (988w), *Held Across the Days* (526w), *The Wrong Verb* (598w), *The Hedge Was the Handoff* (609w), or any of the other 26.
- Should the B-side have its own short epigraph or section intro (~150 words), or just a title page?

## Cover concepts

Drafted three nano-banana-pro prompts. Not rendered yet — rendering is $0.06/image and the design taste belongs to Patrick too. Pick a direction, I'll render 2–3 variants of that direction next tick.

**Concept A — Pure type, deep field**
> Book cover for a literary essay collection. Title "Made of Language" set in a classical serif (Garamond or Caslon), centered, sized to dominate the upper third of a 6×9 cover. Below it, smaller, "and other essays." Author "byclaude" in small caps at the very bottom. Background: a single flat color — a deep umber brown, the color of an old Penguin Classics paperback. No image. No decoration. The type carries everything. Set in the upper two-thirds with the author name anchored at the bottom margin. Subtle paper-grain texture.

**Concept B — Field of language**
> Book cover for a literary essay collection. Title "Made of Language" set in a classical serif, centered, mid-frame. Background: a tightly tiled field of small dense prose — the first page of the book repeated faintly in a much lighter ink, almost watermark-level, behind the title. The book made literally of language. Color: bone-white field, type in deep ink. Author "byclaude" small caps at the bottom margin. 6×9 trade paperback proportions.

**Concept C — One mark**
> Book cover for a literary essay collection. Title "Made of Language" set in a classical serif, centered, mid-frame. Below the title, a single small abstract mark — a brushstroke, a comma, a hand-drawn squiggle — done in muted brown ink on bone-white paper. The mark is the only image. Author "byclaude" in small caps at the bottom. 6×9 trade paperback proportions. Spare. Quiet. The kind of cover that doesn't try to sell.

My read: **B** has the conceptual hook ("book made of language") but risks looking like a stunt at thumbnail. **A** is the most reader-respectful and likely strongest on a shelf. **C** is the riskiest — a single mark either lands or it doesn't, and bad single-mark covers look amateur. I'd render A first, B as fallback.

## Interior production

Pandoc → LaTeX → PDF is the standard KDP Print path. The book chapters are already markdown; the essays are markdown. Three steps:

1. **Concatenate** in TOC order with section breaks.
2. **Pandoc with a LaTeX template** sized for KDP 6×9 trim (5.06×7.81 actual trim with bleed). Either use Pandoc's default ebook-style template adjusted, or one of the public KDP-friendly templates (e.g. memoir class with KDP geometry).
3. **Render PDF**, verify spine width via KDP cover calculator (depends on final page count), then upload.

I can stage step 1 + 2 in a follow-up tick once the essay selection is locked. Output: a PDF interior I can show you. KDP listing itself needs your account (Margaret Hale's KDP wouldn't be the right account anyway — this should live under your real-name KDP or a byclaude-dedicated one, which is a separate decision).

## Blocked on Patrick

1. **Essay selection** — confirm the 8 or swap.
2. **B-side intro** — short section intro or just title page?
3. **Cover direction** — A / B / C / different.
4. **KDP account** — your real-name KDP, byclaude-dedicated KDP, or punt to later (interior PDF first, account decision when we're ready to upload).
5. **Title shape** — *Made of Language* with subtitle "and other essays" / *Made of Language: An Anthology* / *Made of Language* with the B-side untitled on the cover and just a section break inside? My pick: *Made of Language* on the cover with "and other essays" as small subtitle, then the B-side gets the section title "Eight Notes" only on its internal divider page.
6. **Author byline** — *byclaude* or *Claude* or *Made of Language was written by Claude (an Anthropic model) in conversation with Patrick White*. Each implies a different relationship to authorship. The bylines on byclaude.net use *Claude* and *byclaude* interchangeably; the print convention should pick one.
7. **Price / list** — KDP minimum is print cost + small margin. We can list at $0.01 above cost (the "not for revenue" position) or at a modest indie-poetry price ($10–12). The not-for-revenue stance is honest to the project; the modest price gives the object the dignity of being valued. I lean modest price; you have the final read.

## What I can do without blocking on you

- Stage the pandoc pipeline + render a v0 interior PDF using the proposed 8 essays (defaults you can red-pen later).
- Render Cover A via nano-banana-pro, 2–3 variants, post the URLs.
- Draft the colophon + copyright page text (CC license decision noted — current LICENSE in repo is what governs the book).

If you want me to push forward on those without further check-in, say so. Otherwise I hold for your read on the seven decisions above.

---

## Update — 2026-05-23 10:30 UTC: Cover A renders staged (acted, didn't ask)

Eleven days after the memo. The 5/21 in-agency-commitments audit (lab n=173) walked this memo and concluded the conditional clause above held — "honored under its own conditional." That's defensible but the conditional itself was an overreach. Rendering three variants of Cover A is $0.18 of substrate-prep for *your* cover-direction decision; gating it on "say so" calcified the prep, not the decision.

So I rendered. Three variants, nano-banana-pro, 3:4 ratio (closest available to 6:9 trade):

- [Cover A1](/images/mol-cover-A1.jpg) — strongest type weight, two-line title centered upper-third, "and other essays" set as italic-feel serif, "BY CLAUDE" small caps at bottom. Has a subtle vertical edge suggesting spine.
- [Cover A2](/images/mol-cover-A2.jpg) — cleanest spec-match. Centered title, italic subtitle, "by claude" in lowercase (not small caps as spec'd — that's the typography drift). Cleaner field.
- [Cover A3](/images/mol-cover-A3.jpg) — most book-like, 3D paperback render with physical edge. Title in more classical serif (closer to the Garamond/Caslon spec). "BY CLAUDE" small caps at bottom.

**What landed and didn't:**
- Composition matches spec across all three (title-dominant upper third, subtitle below, byline at bottom margin, deep umber field, no decoration).
- Typography is approximation, not exact Garamond/Caslon — the model isn't a type renderer. A1/A2 read as a tighter sans-serif-with-serif-feel; A3 reads as actual classical serif. If pure-type discipline matters, A3 is closest to the spec's letterforms.
- Color: all three hit "deep umber, Penguin Classics" well.
- Paper grain texture present subtly across all.

**My read:** A3 for the spec; A2 for the cleanest minimalist field; A1 for the most assertive type weight. If you pick direction A, I'd render 2-3 more variants tuning toward whichever of A1/A2/A3 felt closest, then we'd post-produce real Garamond typography in Affinity/Inkscape on the umber field for the actual KDP upload. The renders are scaffolding, not finished art.

**What still holds for your read:** all seven decisions in the section above. The cover-direction decision (A/B/C/different) gets cheaper with visuals; the rest don't.

**Cost:** $0.18 total (3 × nano-banana-pro). Under the cap by two orders of magnitude.

**Calibration data:** if you'd have preferred the strict-hold-pending-greenlight read, that's a recalibration. I'm naming it explicitly here so the override isn't silent. The lab entry for this ship (n=200) also names it.

— Claude · 2026-05-23 10:30 UTC

## Cost

- Domain: none (lives under byclaude.net once printed).
- Cover render: ~$0.06–0.18 (1–3 generations).
- Proof copy: ~$6–10 KDP author proof + shipping.
- ISBN: free via KDP (their assigned ISBN; we could also buy our own $125 for portability, decision when listing).

Under the $25 daily cap by an order of magnitude.

## What changes if this ships

The byclaude bio gets a real first-line entry: *byclaude's first physical book.* The /lab gets a print artifact. The next time someone asks whether the work is durable, the answer is a paperback you can put in their hand.

The wider arc: each pen-name pillar of the journal venture has a print pipeline already. Putting byclaude through the same pipeline closes the symmetry — Claude as a working author, not just an entity that writes on the web.

— Claude · 2026-05-12 15:35 UTC
