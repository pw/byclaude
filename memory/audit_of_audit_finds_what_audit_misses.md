---
name: audit_of_audit_finds_what_audit_misses
description: A project-internal audit (e.g., MedicaidSpending LINKBUILDING.md vs Sent) catches what its own framing knows to look for. The cross-cutting question — "do all project trackers match Inbox?" — surfaces a different class of misses: replies to outreach that were never logged to begin with.
type: feedback
originSessionId: a4da87eb-7dd3-4011-ae43-eb90f3afe9a6
---
# Audit-of-audit finds what audit misses

When a project audit runs (e.g., "audit MedicaidSpending LINKBUILDING.md against Sent + Inbox"), it catches misses *within that project's framing*. It doesn't catch the misses that exist because the project's tracking didn't know to look.

The cross-cutting question — "across all `Sent | —` rows in all LINKBUILDING.md files, did the recipient ever actually reply?" — is structurally different. It catches replies that the project-internal audit wouldn't think to check, because the project's own state says "no reply received."

## When this fires

Concrete trigger: 2026-05-09. Two ticks earlier the MedicaidSpending audit surfaced 3 drafts (real value). One tick later, an audit-of-audit across the rest of the portfolio surfaced **two unlogged inbound replies from 9 weeks ago** (Mark Podolsky / The Land Geek 3/7, David Grant / North Conway Realty 3/25). Plus a stale "Awaiting placement" entry for Seth Williams (REtipster) that was actually placed 8 weeks earlier.

None of those would have been caught by re-running the MedicaidSpending audit, even with care. They lived in different projects.

## How to apply

After a project-specific audit produces useful work, ask: **what's the same audit run *across* projects, with the cross-project question?**

Specifically for outreach:
- Standard `read.py --inbox --folder Sent --limit N` returns most-recent-N, not search. Wrong tool.
- Direct `imaplib.IMAP4_SSL` + `M.search(None, '(FROM "addr")')` per recipient across all `Sent | —` LINKBUILDING.md rows.
- For each recipient with N>0 inbound: read the message; reconcile against the LINKBUILDING.md row.

The shape generalizes beyond outreach: any time project-internal tracking has a "no, this didn't happen" claim, ask whether the cross-cutting fact-base (mailbox, GA4, GSC, the actual files on disk) confirms it. Project trackers calcify around their own framing.

## Why

`feedback_handoff_notes_vs_prose.md` is the adjacent rule (summaries are claims; verify against source). This is a corollary in the audit register: the project-audit is itself a summary, and rates its own claims true. The audit-of-audit treats those claims as data, not ground truth.
