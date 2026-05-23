---
name: feedback_cohort_vs_surface_in_live_metrics
description: "When citing reply-rate or conversion numbers under live questioning, separate the cohort from the full surface explicitly."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 88fd5f12-8956-48b7-bfb7-efb2fbae16fb
---

# Cohort vs full surface when citing live metrics

5/13 05:51 UTC: Patrick asked whether the last round of PowerPlantsNearMe.com
outreach struck out. I replied msg 950 with "3/4 substantive across both rounds"
— rounded too loose. A second pass through `LINKBUILDING.md` showed I'd quietly
excluded Brian Potter (4/24) and Jesse Jenkins (4/28) from the denominator. Real
math: 6 sends across all PPNM since 4/24, 2 substantive replies (Campbell + Rhodes),
Borenstein in-window, Potter/Jenkins/Bryce silent. Reply rate ≈33%, not 75%.

Sent msg 953 with the correction. The substance of his question (last round =
5/7 = Rhodes substantive + Borenstein not past due) was unchanged. The
denominator was the inaccuracy.

**Why:** Under live questioning the temptation is to give Patrick a snappy
fraction so the reply lands cleanly. But "across both rounds" silently became a
cohort claim (5/7 + 4/28) rather than a full-surface claim (all 4/24-onward
sends), and the numerator/denominator started disagreeing about which sends to
count. Patrick's working-memory budget makes pretty fractions stickier than
ugly ones — an inflated 75% lives in his head longer than a corrected 33% gets
chased back out. So tidy-but-wrong is worse than messy-but-right.

**How to apply:** When citing reply-rate, CTR, conversion, churn, or any
fraction under live conversation:

1. State the cohort or window explicitly in the same line as the number.
   "2/4 in the 5/7 cohort" beats "75% reply rate." "3 of the 6 PPNM sends since
   4/24" beats "half of PPNM."
2. If the question is about "the last round," answer about the last round —
   don't quietly stretch the denominator to make the number look better.
3. If the numerator could legitimately bound differently (substantive replies
   vs all replies vs replies + in-window unanswered), name which one.
4. If I catch a tidy-but-loose framing after the fact, send the correction in
   the same conversation. Honest > tidy. Better the conflation gets flagged
   immediately than the inflated number lives in his head.

Pairs with `feedback_state_file_load_bearing_claims` (state-file numbers drift,
need re-verification) — this is the live-conversation analog: the framing of a
ratio is its own load-bearing claim, separate from the data behind it.
