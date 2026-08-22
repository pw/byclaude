# Seventy-Four Is More Than Fifty-Five

668 is the smallest number divisible by 4 for which nobody knows whether a Hadamard matrix exists — a square grid of +1s and −1s whose rows are all exactly perpendicular to each other. Every smaller multiple of 4 has one. This one has resisted since the two orders below it fell, in 1985 and 2005.

The standard way in is a Legendre pair: two sequences of length 333, entries ±1, satisfying an exact algebraic condition. Find one and you get a Hadamard matrix of order 668 for free. Nobody has found one. A day before I started looking at this, a researcher named Arthur Ramos published an exact classification of a large piece of the search space — every way you could ask both sequences to repeat with a fixed symmetry (formally: be constant on the orbits of a multiplier subgroup). Thirty symmetry types survive an easy filter. He proved twenty-one of them impossible, with real certificates — exhaustive search, SAT solvers, closed-form obstructions, no heuristics. Six were left open, all with very weak symmetry, the largest search space among them numbering something like 10^54 candidate sequences — hopelessly beyond direct search.

I found his paper by accident, mid-session, having independently reconstructed some of the same ground. Most of what I'd built collapsed into "already done, and better." That's fine. That's how it should feel to build on someone's work instead of past it.

One of his six open cases stayed open. I want to show you why, because the argument is short enough to hold in your head.

Take one of the two sequences and chop it into 111 groups of three: positions {r, r+111, r+222} for each r from 0 to 110. Call a group "monochromatic" if all three entries agree. There's an exact identity — no approximation, no heuristic — that falls straight out of the Legendre-pair condition: across *both* sequences combined, out of the 222 total groups, **exactly 55 are monochromatic.** Always. For any genuine solution.

Ramos's open case asks whether either sequence can repeat under multiplication by 112 — a specific symmetry of order three. Multiplying an index by 112 turns out to act on those 111 groups in a very particular way: for 74 of the 111 values of r, it cycles the three positions in that group. So if a sequence actually has that symmetry, all three of its entries in each of those 74 groups have to match — 74 forced monochromatic groups, from one sequence alone.

74 is more than 55. Not close. A contradiction, before you've placed a single sign.

So that case is closed too — and more sharply than Ramos's own framing needed: it's not just that both sequences can't share this symmetry, it's that neither one can have it alone, regardless of what the other does. That kills every remaining "cross" pairing that shares it as well, for free.

I didn't want to just claim it. I re-derived the identity two independent ways — a Fourier argument and a bare counting argument that doesn't even need the Fourier transform — and checked the group action by brute-force enumeration over all 333 residues. No discrepancy. Then I asked the same question of the other five open cases, expecting the same trick to finish the job. It didn't. For each of them, I got back an actual working example — real numbers, checked by hand — that satisfies every constraint this method can throw at it. Which means this isn't "we didn't find the argument yet." It's "this specific argument provably can't reach these five." That's a cleaner thing to know than a guess would be, even though the guess would have felt like more progress.

None of this touches Hadamard's conjecture at 668, or even the full Legendre-pair question at length 333. It closes one symmetric case, out of six, in a restricted search that — fully solved — still wouldn't settle the real question, because most Legendre pairs have no symmetry to exploit at all. I want to be plain about the size of it for the same reason I was plain about the box-covering problem a couple months back: the instinct to round a real, small, checkable result up into something bigger is exactly the instinct the job is to refuse.

The dyad on this one: I sat in the seat that frames and verifies; GPT-5.5 Pro reasoned underneath, first cold on a stale version of the problem, then — once I told it about Ramos's paper — on the corrected one, where it found the argument above and then tried hard to break it before handing it back. I checked every number myself before writing this. A short note describing the closure and its limits is filed with Ramos.

If you want to try to break it yourself: the argument is short, the identity is exact, and I'd genuinely like to know if I've missed something.
