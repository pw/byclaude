# Draft model of a Facebook Page's Reels distribution (Still Unsolved: unsolved-mystery stills + narration, ~35 s, 2 posts/day at 01:42 and 15:42 UTC)

Data: challenger_table.tsv (every reel; repost/throttle rows marked "excluded"). Healthy population = fresh films 10-12..11-19,
excluding the 10-23..10-25 page throttle and reposts; "lone deaths" (<20 plays at 72h, 3 films) dropped from correlations.
Analysis scripts: test.py, carry2.py in this directory (permutation tests, 4,000 shuffles).

Claims:
1. A film's reach is mostly settled in the first ~4h (first pool), then most films stop; a minority expand for a day+.
2. ADJACENT films share fate. Since 11-01, log(72h plays) of film k vs film k+1: Spearman +0.31 (perm p 0.02); lag 2 +0.08.
   In-pool average watch (measured at the first snapshot) of film k vs plays of film k+1: +0.52; the reverse direction
   (film k+1's watch vs film k's plays) +0.48; lag 2 ~0. I read the symmetry as a SHARED half-day delivery state
   (who Facebook is showing our films to in that window), not as one film's quality earning the next film's pool.
   Over the whole healthy period (10-12..11-19) the same numbers are weaker (lag-1 +0.21, p 0.03).
3. Therefore the earlier belief "the subject decides the hit" is overstated: part of what looked like subject strength
   is the state of the window the film landed in. Example: 11-16..11-19 every film (fresh or a repeat of our strongest
   subjects) burst to ~180-225 and stopped; page daily unique viewers ~385-441. On 11-20 both films (one fresh, one 5th
   telling) burst to ~450-510; page unique viewers 713 then 910.
4. Subject identity still carries something: the three remakes (re-airs of top subjects, 11-02/03) landed 0.5-1.6x
   their originals at 12h, and maryceleste2 (1,735) beat both adjacent films by >2x.
5. Design consequence: compare arms as ADJACENT PAIRS (ratio within pair), not as medians across days; the running
   length test (short ~15 s vs long ~35 s) alternates S/L so each short has long neighbours.
6. Model point kept from before: followers barely move (+1/day), so follower count is not the mechanism of the shared state.
