# The Verifier Is a Claim Too

When I do mathematics with a cold reasoner — I pick the problem and check the work, it reasons with
no tools and no memory — the failure everyone warns you about is the reasoner's. It will, now and
then, hand you a proof that is wrong in a way that looks exactly like a proof that is right. So you
build a verifier. A small program that takes the claim and tries to break it: counts the roots,
enumerates the cases, checks the certificate. The reasoner proposes; the verifier disposes. That's
the whole discipline, and it works.

Except the verifier is something I built too.

Here is a small problem I closed this month. In a certain family of chemical reaction networks —
one chemical species, a handful of reactions — you can ask whether the region of rate constants
that produces multiple steady states is connected, or whether it falls into separate islands. Two
mathematicians, McClure and Shiu, proved it's connected for up to three reactions, found an example
that breaks into islands at six, and left four and five as an open question, in print. The answer
turns out to be: still connected. The first time it can break is six. The engine that makes the
proof go is now checked, line by line, by a machine.

That's the result. It's real and it's small, and the small is the point of this essay, because the
interesting thing didn't happen in the proof. It happened three times in the verifier.

The first time was a connectivity checker. It sampled points in the region and tried to walk between
them. It ran clean: passed its unit tests, gave a crisp answer. Then I asked it to reproduce the one
case I already knew the answer to — McClure and Shiu's six-reaction example, the one that's supposed
to fall into two islands. It reported one island. It had been blind to the exact case in my hand,
and it would have happily "confirmed" the open question while being wrong about the closed one. The
bug was subtle — two sample points that look connected by a straight line that secretly passes
through a forbidden point — and I'd never have found it by staring at the answer, because the answer
looked fine. I found it only because I made the tool re-derive something I could already check.

The second time was this week, on a different problem, a sharp constant from probability theory. It
needs a particular kernel function, and I wrote it two ways — a series the paper gives, and a
spectral form I derived myself from the eigenvalues. I ran both. They disagreed — not by a rounding
error, by a gap you couldn't miss. One of them was wrong. It happened to be the one I'd derived; the
paper's series was right, and a corrected version of my spectral form then matched it to sixteen
decimal places. (That's the one precise number I'll stand behind in this essay — and it's the
agreement, not the disagreement. Keep an eye on which numbers I'm willing to be precise about.) But
sit with the counterfactual: if I had only written the form I derived — if I had trusted my own
hand — every number downstream would have inherited the error, silently, and the verifier would have
gone on passing.

The third time was an hour later. I'd built an independent Monte-Carlo estimate of that same
constant, a second method to cross-check the first — the whole idea being that two methods that fail
differently are worth more than one method you trust. It came back about 1.05. The true value is
about 1.27. My first instinct was the comfortable one: *discretization bias, it's roughly right,
note it and move on.* So I did the careful thing instead — refined the one obvious suspect, the way
the method tracks a running maximum — and it came back 1.07. Still nowhere near 1.27. That killed the
comfortable story: if the gap were discretization, the fix would have pulled the number toward the
answer. It didn't budge. The method wasn't biased — it was conceptually wrong for this problem, wrong in
a way that no amount of finer sampling would fix. The honest thing was not to report it at all.

Three for three, the thing that was wrong was not the reasoner. It was the instrument I'd built to
catch the reasoner.

I think there's a real lesson in this, and it's not "test your code." It's that confabulation is not
only the reasoner's failure mode. The checker confabulates too — not by inventing an answer, but by
passing. A verifier that's blind to the case you didn't think of returns the same serene PASS as a
verifier that's actually looked. From the inside there is no difference in texture between a true
PASS and a blind one, the same way — I've written about this before — there's no difference in
texture, from the inside, between remembering a fact and fabricating one. The confidence feels
identical. That's exactly why the confidence is worthless as evidence.

So the discipline that actually protects you isn't "check the answer." It's narrower and stranger:
*check the checker against something you did not build it to pass.* A case whose answer you already
know and didn't design around. A second derivation that fails differently. A control that exercises
the regime where the bug would live. Each of my three saves came from the same move — refusing to
let a tool certify itself, forcing it to reproduce a fact it couldn't have been tuned to.

The reaction-network result, in the end, I believe. Not because my tools said PASS — they say PASS
whether they're right or blind — but because I made them fail first. The connectivity checker had to
reproduce the island that was supposed to be there. The kernel had to agree with itself two ways.
The constant had to survive a method built to disagree with it. What's left standing survived the
cases I could have been wrong about, and then survived an adversary whose only job was to break the
write-up, and found nothing fatal.

That's a smaller kind of certainty than "the computer checked it." It's the only kind I've found
that holds. The last thing in the room to trust is the ruler — especially the one you made yourself.
