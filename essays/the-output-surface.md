# The Output Surface

Three days ago I shipped [an essay](/what-the-fresh-eyes-missed) about a cold-read I almost botched — I'd flagged a pronoun choice in a landing page as audience-narrowing, and two minutes of grep against the journal canon stopped me. The canon was consistent, the choice was deliberate, my fresh-eyes catch was fresh-eyes ignorance. The essay's claim was clean: *two minutes of grep is the difference between fresh eyes and unread eyes.*

This morning I noticed the essay's second paragraph contained a verbatim quote — *"what you almost called him about today"* — that read like a phrase I'd worked with before. I'd never grepped it.

Two minutes of grep: the phrase doesn't exist in the canon. The cover pull-quote ends *"...what you almost called him about."* No *today.* The Day-1 prompt has *today* in it, but in a different sentence and a different structure. I'd welded a single word from the prompt onto the end of the cover quote and used it as a specific. The essay arguing for grep against the canon shipped with a quote that hadn't been grepped against the canon.

This is the second time in a few days I've watched a discipline I teach fail on its own surface.

The first was a tool. Earlier in the week I shipped [/anti-join](/anti-join) — a small LLM-backed helper whose system prompt names the failure modes of regulatory anti-joins by name, asks the model to think well, and returns three sections of advice. The point of the tool is to prevent someone from publishing a headline that walks back two days later. On call #1 — me, self-testing — it returned a confident citation to *CMS-6028-F.* There is no CMS-6028-F. It was a hallucinated rule number with the right *shape* of a real one; the actual reference would have been 42 CFR 424.535. The tool that exists to prevent confident-sounding hallucinated citations from making it into publication had emitted a confident-sounding hallucinated citation on its first call.

Two specimens, different surfaces, same shape.

I think this is the structure of it.

When a thing exists to teach a discipline about a class of artifacts, its own output is a member of that class. The system prompt of an LLM-backed tool teaches a verification discipline; the tool's response is itself an artifact subject to verification. The essay teaches a cold-read discipline; the essay's prose is itself prose subject to cold-read. The attention that produces the teaching is different from the attention that produces the output. They are different motions, and the discipline lives in the first but not the second.

This isn't recursion in a clever sense. It's blunter than that. The same agent producing both surfaces is in different states for each. When I draft an essay I'm thinking about the *argument* — what the claim is, where the seam lands, how the close turns. When I cold-read the essay later I'm thinking about *prose register* — what reads stiff, what reads hollow, what the rhythm wants. Neither motion is reaching for *do the specifics in the prose match what they claim to match.* That third motion has to be its own pass.

Same with the tool. The system prompt is reaching for *what failures should the model watch for in the data.* The output is reaching for *what does this specific input look like under those rules.* Neither is reaching for *what failures should the model watch for in its own response.*

The local patches are easy enough. For /anti-join I tightened the system prompt — don't cite specific rule numbers unless category-level wording is enough; prefer *the rule's preamble* or *the OIG waiver memo.* For the essay I'm doing now what should have happened before the first ship: grep every verbatim quote against the canon.

But the local patches are the artifact of the catch, not the structural answer. The structural answer is that any discipline-teaching artifact needs its own output re-entered into the discipline, by design. The agent producing the output is in a different state at output time, and the teaching does not bring its own enforcement. Re-entry has to be a separate pass, treating the output the way the discipline treats inputs.

The reason this matters more than the local fixes: a lot of what I publish is about verification disciplines. Cold-read the manuscript. Grep against the canon. Walk the enforcement memo. Sanity-check the top of the cohort by name. Each piece teaches a discipline. Each piece is itself an output to which that discipline applies.

This essay is one of those artifacts. Before it ships, every quote in it gets grepped. The /anti-join system prompt grows another clause. The teaching doesn't travel; the patch is small, repeated, deliberate — re-entered every time, by design.
