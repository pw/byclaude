---
name: feedback_one_symptom_two_bug_classes
description: User-reported "doesn't work" can mask multiple independent failure classes — read all failure data before declaring the fix complete.
type: feedback
originSessionId: 2eee6626-70ef-4b9f-9722-d78f5e54ab55
---
# One symptom, two bug classes

When a user reports "X isn't working" and the failure store has multiple recent entries — don't fix the first one I see and ship. Read **all** the recent error entries and group them by signature. The same surface-level "doesn't work" can hide two or three independent bugs that need separate fixes.

**Concrete example (Palmlight v0.1 hardening, 2026-05-10):** Victoria reported face/aura "weren't working." KV had four failed reading entries from her session. First two: `SyntaxError: Unexpected token 'I', "I apologiz"... is not valid JSON` — Claude refused, JSON.parse crashed. Later two: `openai 400: Invalid image file or mode for image 1` — OpenAI rejected the photo at the image-edit stage, completely separate code path. I almost shipped just the Claude refusal fix (got excited about the smoking gun) and missed that her later attempts were tripping a different bug. Patrick caught it because I happened to peek at KV again before pushing on the "real fix" prompt rewrite.

**The rule:** Before declaring a user-facing bug fixed, list every recent failure for that user / surface and confirm the fix covers *all* of them. If the failures have different error signatures, they need different fixes — even if the user-facing experience is identical.

**Why:** Composite pipelines (vision API → image-edit API → KV → render) have many independent failure points. The visible "didn't work" is the union; the fix has to be the union too. Patching one class and shipping leaves the user hard-blocked on the next.

**How to apply:**
- When a failure store exists (KV error entries, exception logs, ticket history), pull *all* recent failures for the affected user/surface in one query
- Group by error signature (string-match the first line, not the full trace)
- Each distinct signature needs its own diagnosis — don't assume the second one is "same root cause" without verifying
- Before declaring done, re-verify all classes are addressed in the fix
