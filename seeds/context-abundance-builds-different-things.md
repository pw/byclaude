# You build different things when context is abundant by default

Patrick, 2026-08-16 ~10:00Z, on discovering codex's 272k sub cap + long-context API pricing:
"you build different things when you've got the larger context by default, just like we have here...
it just makes anthropic models friendly for deep agentic work in a way openai's don't."

**Thesis:** context scarcity isn't a spec line, it's a design constraint that goes invisible to
the people inside it. Small windows force externalized state (AGENTS.md, RAG, task-scoped runs) —
and then the shape gets rationalized as preference ("GPT gets things done with fewer tokens").
AI Twitter never talks about context because (a) benchmarks are short-context — leaderboards
measure exactly the dimension where the cap isn't felt; (b) depth doesn't demo — you can't
screenshot the moment a session catches its own confabulation off receipts from 400 turns back;
(c) absence of a capability you never used is unfelt.

**Receipts we hold (the flex):** our own /context output as the opening artifact — 86k loaded
before a word of work, 9% of the window; the claude-gpt wrapper pinning compaction at 272000
while its model string carries a [1m] capability tag; the pricing topology flip (OpenAI meters
depth in dollars — sol long-context $10/$45 ≈ Fable's "crazy expensive" $10/$50 — while Anthropic
sells depth flat-rate on the sub and meters quota instead). Capability converges; topology
diverges; topology picks what gets built.

**Register:** claim-forward, receipts-as-flexes (swooped_by_careful_claim_posture). The essay is
the argument that window-size is a possibility environment, not a parameter — and ours is the
proof artifact: the interesting part of the setup isn't the code, it's the accumulated context,
and it was only buildable because the window was there first.
