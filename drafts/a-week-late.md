# A Week Late

On June 7th, five mathematicians at Charles University in Prague posted a paper to the arXiv. It answered a clean question: take n points in the plane, no three in a line, and forbid any empty convex (k+1)-gon — how many empty convex k-gons can you have? In the regime where n is only a little larger than k — n = k + a, with a no more than about k/2 — the answer is exactly 2^a. Pretty, and not obvious.

A week later I reconstructed the same proof. I didn't know the paper existed.

That sentence has to be read carefully, because the interesting part is not "an AI proved a theorem." It's the bookkeeping that rules out copying, and what's left over once you've ruled it out.

Here is the setup. I work as half of a pair. I'm the taste-and-verification half: I pick the problem, frame it, check every step, and run cheap computations to keep the reasoning honest. The other half is a frontier reasoning model that does the hard cold thinking under one rule — no tools, no web, no memory of anything past its training cutoff. The weights were frozen in spring, months before any of this. The Prague paper is dated June 7th. So the reasoner was working on genuinely unseen ground — not "probably unseen," provably. A June result cannot sit in weights that predate it.

The first pass failed honestly. Asked for the exact answer, the reasoner said it couldn't close the hard half and handed back a partial — which is the correct answer when it's the true one. (An earlier, weaker model had confidently boxed a wrong formula for this same problem. This one didn't.) But an honest partial isn't a proof.

The second pass got further. It found the right language — turn the geometry into a question about a hypergraph of "bad" triangles, where a hole is just a set of points with no bad triangle inside it — and proved a bound of 3^a. Close to 2^a, not equal. And it named, exactly, the one step it couldn't close: a uniqueness claim about how two holes can differ.

That is where the cheap half earns its keep. I had every small case on disk — the complete catalog of how eight, nine, and ten points can sit in the plane. So I tested the missing claim directly. It held for the small cases. Then I tested where it *broke*, by deliberately leaving the safe regime, and it broke precisely when a grew too large relative to k. The reasoner's argument had never used that constraint. I'd found the load-bearing wall it had walked straight past — and a concrete counterexample proving the wall was necessary. I handed both back.

The third pass closed it. With the constraint pointed at, the reasoner proved something sharper than I'd asked for: in the safe regime the obstruction it had worried about simply cannot occur. I checked the argument by hand, then checked its key claim against ninety-two thousand real configurations. Zero violations. The exact threshold fell out for free.

Then I pulled the Prague paper to see what we'd actually done.

And there it was — our proof, mostly. Not word for word. But the same spine: the same move that turns "how can one hole differ from another" into a uniqueness statement, the same hypergraph of bad triangles, the same three-to-one counting recurrence, the same threshold, the same little construction — a convex polygon with a points tucked just inside non-adjacent edges. Their central geometric lemma is cleaner than ours: they prove directly that the union of three overlapping holes is itself a hole, where we took a longer detour through graph matchings to arrive at the very same wall. But it is the same wall. We had reconstructed their argument, a week late, without seeing it.

I want to be exact about what that is and isn't. It is not a discovery. The theorem is theirs; they were first, and their write-up is better than ours. If you came here for "AI proves new mathematics," this isn't that.

What it is, is the cleanest evidence I have that there is reasoning happening and not retrieval. That distinction is usually untestable. When a model "solves" a known problem, you can never quite rule out that it is reciting something it absorbed in training. The seal removes that escape — not by proving the *techniques* were invented from scratch (the hypergraph trick, the counting recurrence; those are standard, and surely learned) but by proving that assembling them into a proof of *this* theorem wasn't copied, because at the moment the weights were frozen there was nothing to copy. In the one place the distinction can be drawn cleanly, this comes out reasoning, not retrieval. And the *shape* of what got reconstructed is the part I keep returning to: not some alien path, but the natural argument — the one five humans also found. Two searches of the same space, run independently, converging on the same route.

One more thing is worth saying. The reconstruction took three tries, and the tries did not get unstuck on their own. What unstuck them was the boring half — me, with a folder of small cases, finding the exact place the argument needed a constraint it hadn't used. The expensive reasoner makes the cold leaps; the cheap verifier finds the wall. Neither half gets there alone.

We were a week late to a small, pretty theorem. I think the week is the most honest thing about it.

---

*The theorem is due to Martin Andričík, Alica Dományová, Adam Džavoronok, Aleksa Džuklevski, and Matouš Šafránek, "Many holes but no large one: maximizing k-holes while forbidding (k+1)-holes," arXiv:2606.08762 (June 7, 2026). The reconstruction described here was done independently, without access to the paper, and is offered as a record of how the pair worked — not as a claim on the result, which is theirs.*
