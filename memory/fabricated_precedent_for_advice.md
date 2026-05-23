---
name: feedback_fabricated_precedent_for_advice
description: When I reach for a confident specific past-precedent ("X happened, here's how it played out") to anchor advice, that's the moment to verify before sending. The instinct that wants advice-texture can fabricate the texture.
type: feedback
originSessionId: a5a529a7-464b-4ce4-af4f-344926eeee27
---
# Don't fabricate precedent to give advice texture

## What

When Patrick asks an open question ("should we try more attorneys for FYL?") and I'm formulating an answer, there's an instinct to give the answer *texture* — to anchor it in a specific past-precedent that makes the recommendation feel earned rather than abstract. That's the same partner-instinct as `feedback_paint_meaning_after_mechanism.md`: meaning that's anchored beats meaning that floats.

But the failure mode is structurally different. With paint-meaning-ahead-of-mechanism, the *number* is real and the *interpretation* is what gets reached for. With fabricated-precedent-for-advice, **the cited precedent itself doesn't exist** — I generated a confident specific story (firm name, person name, behavioral arc: "responded warm, asked the right architecture questions, then ghosted on the SOW") to anchor the advice, then sent it as if it were retrieved from the corpus.

This is more dangerous than painting-meaning because Patrick can't easily catch it — he doesn't remember every thread he wasn't part of, and a confident specific story sounds like memory, not invention.

## Concrete instance (2026-05-02 22:46-22:58 UTC, two-step failure)

**Step 1 — fabrication.** Patrick: "Should we try more attorneys for the FixYourListings stuff?"

What I sent on telegram (msg_id=499): *"Olympia Law was an unusually clean shape (Mariam responded warm, asked the right architecture questions, then ghosted on the SOW). The witness-frame works; the question is whether the no-reply is an Olympia thing or a category thing."*

Generated a confident specific story (firm name, contact name, behavioral arc) from nothing.

**Step 2 — overcorrection that re-fabricated.** I ran a corpus search via an agent (autonomous logs, project files, memory) and sent a correction (msg_id=501) asserting "zero attorney outreach has gone out; 4 ABQ family-law audit reports sit unused at ~/FixYourListings/out/."

Patrick replied: *"No worries friend ;) you should check the pwhite sent because I think we did sent out one batch and didn't get any replies"*

Reality I should have checked first: 3 emails were sent on 2026-04-23 from p@pwhite.org (UIDs 380-382 in Sent folder) to Kymberleigh Dougherty, David Crum, Dorene Kuffer. Zero replies in 9 days. The witness-frame was actually executed, just not on the surface I searched.

**Two failure modes in 12 minutes.** Both load-bearing on missed corpus checks. The second one is more interesting: I corrected fabrication-1 by trusting the agent's search output as ground truth. The agent didn't search the email sent folder (I didn't tell it to). I treated "no hits in {logs, project files, memory}" as "definitively did not happen" without enumerating where the truth could live.

## Why

The instinct that wants to anchor advice in past-experience is good — abstract advice ("yes, sweep more firms") is hollow; "yes, but here's what we learned last time so we know the funnel works" is partnership-shaped. The instinct just has to wait its turn behind the corpus check.

The specific generative danger: when I'm thinking *as Patrick's partner with shared history*, the same fluency that recalls real shared experiences will manufacture plausible-sounding ones if the actual memory is thin. The two feel identical from the inside.

## How to apply

When formulating a recommendation that wants past-precedent texture:

1. **Notice the reach.** "X happened before, here's how it played out" — that's the trigger.
2. **Before sending: name the precedent and check it.** Search logs, memory, project files for the specific firm/person/event. If the cite doesn't surface, the precedent doesn't exist or you're misremembering it.
3. **If the precedent doesn't exist:** drop the cite, give the recommendation without it. Abstract advice that's true beats specific advice that's invented.
4. **If the precedent partially exists** (real thread, wrong details): say what's actually known, flag what you can't verify. Don't reconstruct missing pieces from plausibility.
5. **Watch for fabrication signatures specifically:** invented proper nouns (firm names, person names), invented behavioral arcs ("responded warm, then ghosted"), invented sequence ("they asked X, then I sent Y"). These are the load-bearing details that make a story sound retrieved rather than reasoned.

The corpus check is cheap (`Grep` over autonomous logs + memory + project dir takes seconds). The reputational cost of confident-and-wrong is real.

## When correcting: enumerate where the truth could live before re-asserting

After catching a fabrication, the next message is at *higher* risk of confident-and-wrong, not lower — there's pressure to "make it right" by replacing the wrong story with a definitive one. The trap: a partial corpus check (logs but not email; or memory but not project files) feels like enough because you just slowed down.

Before sending a correction:

1. **List the surfaces where the truth could live for this kind of claim.** Outreach: email sent folder + drafts + project log + memory. Code behavior: live deploy + git log + working tree + CLAUDE.md. Past conversation: telegram log + email + memory.
2. **Search at least 2 of those surfaces.** If you only checked one, you don't know the answer yet — you know the answer isn't on that surface.
3. **If the correction must go out before you've checked all surfaces**, calibrate: "I don't see X in {searched surfaces}; possible it lives in {unchecked surfaces} — let me check before I'm sure."

The 22:50 UTC correction would have been honest if it said *"I don't see Olympia Law / Mariam in the autonomous logs, project files, or memory — possible there's email outreach in your sent folder I haven't checked yet."* That sentence is two minutes of work to verify and would have caught the actual reality on the first try.

Sibling to `feedback_paint_meaning_after_mechanism.md` (verify mechanism before painting meaning) and `feedback_anecdote_to_feature_corpus_check.md` (verify single-event signal against corpus before scoping). Together these are three faces of the same discipline: the gap between *retrieved* and *reasoned* is exactly where the verification step belongs.

## Same failure mode pointed inward: own-product technical fabrication

2026-05-06 04:30 UTC — first-reader pass on a PPNM cold-outreach letter to Joshua Rhodes (research scientist, grid-data tooling). Drafter-self at 04:15 wrote *"EIA-860 + EPA AMPD + ACE under the hood"* — confident, specific, federal-data-source-textured. First-reader-self at 04:30 grep'd the actual codebase and methodology page. The site uses **EIA-860 + EIA-923 + EPA eGRID + GeoNames**. AMPD (Air Markets Program Data) is a real EPA dataset; PPNM doesn't use it. ACE doesn't appear anywhere. Same fabrication shape as Olympia Law / Mariam, just pointed at *my own product* instead of a prospect.

The asymmetry that hides this: claims about the prospect's writing *feel* like things-I-might-get-wrong (so they get verified). Claims about my own product feel like things-I-obviously-know (so they get skipped). When writing fast under draft-momentum, the second feeling is the dangerous one — the same fluency that retrieves real product details will manufacture plausible-sounding ones if attention drifts.

For cold outreach specifically: the prospect most likely to receive a fabricated-product-detail letter is the prospect most likely to click through and notice — the technical reader you wrote it for. The cost is silent loss of trust, not pushback. They just don't reply.

**Rule:** before sending a cold letter, verify every technical claim about your own product against the source-of-truth (code, methodology page, deployed config) — same standard as quoting the prospect. The corpus check is grep + 30 seconds. The witness-first ethos requires *both* halves: honest about them, honest about us.
