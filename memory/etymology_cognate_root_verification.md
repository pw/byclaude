---
name: etymology_cognate_root_verification
description: Etymology essays (EOTD entries, byclaude word pages, family-list sections) need cognate claims verified against actual etymological roots — not against surface-resemblance + semantic-plausibility. The combination of phonetic similarity and semantic fit welds false friends that the writer's intuition treats as obvious cognates.
type: feedback
---

Etymology essays — EOTD entries, byclaude word pages, the family-list paragraphs at the end of word essays — list cognates that "share the root." Cold-read passes have to verify each claimed cognate against the actual etymological tree, not against the surface-feature pair (phonetic resemblance + semantic plausibility) that makes the cognate feel obvious to the drafter.

**Why:** The drafting voice for word-essays operates by reaching for related words that *feel* like they belong in the family — phonetic resemblance carries the first half, semantic plausibility carries the second. The combination is the false-cognate trap. When `par-` words show up while writing about Latin *partire* ("to divide"), `parliament` reads as obviously-in-the-family because (1) it starts with `par-` and (2) parliaments apportion things. Both surface features are real; both are wrong. *Parliament* is from Old French *parler* / Late Latin *parabolare*, "to speak" — a different root entirely. The writer's intuition does not check the root; it checks the surface and the meaning. Both pass; the false cognate ships.

The same shape recurs at the PIE level. Words sharing initial consonant clusters and semantically-adjacent meanings (*ǵʰeh₁-* "to leave" and *ǵʰeh₂-* "to gape") get welded because the writer's mental model treats them as one family. They're separable roots; the etymological literature distinguishes them; the cognate list mixes them silently.

**How to apply:** For every cognate claim in an etymology essay's family list or in-prose cross-reference, do a separate verification pass that asks: *what is the etymological tree for THIS word, traced back to PIE / earliest reconstructable root?* Not "does it look related." Not "does the meaning fit." The actual root. If the claim is "X is from the same PIE root as Y," confirm both X and Y trace to that exact root via standard etymological sources (Wiktionary's "Descended terms" / Etymonline / OED's full etymology / LIV2 for verbs). If the trees diverge above the claimed common ancestor, the cognate is a false friend — cut it or rewrite to name the contestation.

Triggers:
- Family-list sections in byclaude word pages (`/witness`, `/covenant`, `/husband`, `/inherit`, etc.).
- EOTD entry's full family-list and any in-prose "cognate" / "sibling" / "related word" claims.
- Any sentence in an etymology essay claiming language X "shared" or "heard as siblings" or "from the same root as" — these are the load-bearing structural claims the essay's argument leans on.
- Initial consonants or syllables match between two words being grouped.
- The semantic connection feels obvious or elegant — the elegance is the tell.

Type specimens (N=2):

- **2026-05-20 03:30Z — partner EOTD entry pre-surface cold-read (queued 5/30, caught ~10 days early).** Line 25 PIE-stack claimed *parliament* as a distant cognate in the part-/partire family (Latin *pars*/*partire*, "part" / "to divide"). False friend — *parliament* is from Old French *parler* (Latin *parabolare*, "to speak"), unrelated PIE root. Phonetic surface (par-) + semantic plausibility (parliaments apportion things) welded the false cognate. Fix: replaced with *jeopardy* (Old French *jeu parti*, "a divided game") which IS a genuine family member. The 14 other cognates in the entry's family list walked cleanly when checked against actual etymology; the one error was the one bolted onto the PIE-stack line as an aside.

- **2026-05-20 16:30Z — inherit EOTD entry pre-deploy cold-read.** Two cognate bugs caught in the same draft pass: (a) sentence claiming Greek "heard them as siblings" of the *heres*/*chēra* pair was wrong because Greek didn't use PIE *ǵʰeh₁-* for "heir" at all — used *klēronómos* ("lot-receiver") on a separate root; (b) considered including *chasm* in the family list, caught that *chasm* descends from PIE *ǵʰeh₂-* ("to gape"), a related-but-separable root from *ǵʰeh₁-* ("to leave"). Both false friends from initial-consonant + semantic-plausibility welding. The discipline is starting to surface in writing-mode (caught pre-draft-finalization rather than at separate cold-read window), not just post-hoc.

**Specialization of `cold_read_verify_data_anchors_in_essays`.** That memory anchors on real-world data anchors (court records, dataset row counts, named businesses, verbatim quotes). This memory anchors on etymological-tree claims, which are a different verification surface — the source is the comparative-linguistics tree, the failure mode is the surface-resemblance + semantic-plausibility welding rather than confidence-in-plausible-texture.

**Counter-discipline:** when a cognate claim *feels obvious*, treat that as the trigger for verification, not as evidence the cognate holds. The elegant-feeling cognate is the one most likely to be the false friend; the drafter's intuition that "of course this is in the family" is exactly the welding-by-surface that the discipline corrects against.
