---
name: Polling-log "in_progress" conflates real progress with failed-but-not-yet-retried
description: When async pipelines wrap a polling loop, the log can show "in_progress for N hours" while the underlying batch has actually completed-with-failures and the retry hasn't fired yet. Read the canonical API, not the loop log.
type: feedback
originSessionId: 4ffe047c-3f8f-40e3-a175-4c5775fcb430
---
# What

When an auto-pipeline polls an async API in a loop and writes status lines per check, those lines read as duration-still-in-progress *even after the batch actually completed-with-failures* — because the polling code only writes the new status once it kicks off the retry. Window between failure-detected and retry-fired (often 10-30 sec) is invisible in the log; window between retry-fired and the new batch finishing reads as a continuous "still in progress" run if the operator skims line counts.

Tonight (2026-05-07 tick 24): state file said Tessa Book 4 batch was "~4.5h in_progress" because tick 22-23 narration counted auto.log lines. Actually OpenAI `/v1/batches/{id}` showed the original batch completed-with-1-failure at 07:55:52 UTC (HTTP 504 in the error file), and a new initial batch was already running at +3 min by tick 24. The pipeline self-healed correctly; the *narration* aged out.

# Why

Polling-loop logs serialize "I checked and it's still going" until the loop's terminal-state branch fires. Mid-loop transitions (failure → retry-submit) can look indistinguishable from continuous progress unless you parse the log carefully. The canonical state lives in the API the loop is polling, not in the loop's own writes.

# How to apply

When an autonomous tick reports "batch in_progress for N hours" or "polling clean for X cycles":

1. **Don't trust the duration.** Pull the canonical API directly (`curl /v1/batches/{id}` for OpenAI, equivalent for whatever async system). Compare `request_counts.failed` against `request_counts.completed`. A `failed` >0 with `completed: 0` means the loop is about to retry — not that work is happening.
2. **Look for the resubmit signal in the log too.** "🚀 Submitting initial batch..." appearing twice in one project's auto.log = the first one failed and you're now timing the retry, not the original.
3. **Generalizes beyond batch novels.** Same shape applies to: GitHub Actions polling, CI status pages, any cron-driven retry loop, my own autonomous-tick narrative when it claims "X has been running for hours."

This belongs alongside `feedback_state_file_load_bearing_claims.md` (numbers driving decisions need re-verification) and `feedback_pre_fire_verify_scheduled_queues.md` (read the queue JSON not the narration). Specific narrow case of the same shape: **the artifact is the API; the narration is the loop log.**

# Variant: ID-against-source-of-truth (2026-05-07 tick 30)

Even after this lesson lands, "curl the API" is only as good as the ID you hand it. Tick 30 caught a state-file typo — Rockstar continuation batch ID was wrong by 8 chars (`04e88190` vs real `b9588190`), carried forward through 3 ticks of pruned narrative. Direct-API pulse returned `404 No batch found`, which is *not* a self-evident "your ID is wrong" signal — it could read as "OpenAI lost the batch" or "catastrophic state corruption." Real ID lives in the on-disk source-of-truth: `~/batch-novel/projects/<slug>/continuation-batch-id.txt` (or whichever file the pipeline writes its canonical ID to). **When verifying via API, cross-check the ID against the project's source-of-truth file before concluding anything from a 404.** Pruning state-file ticks is a known typo-introduction surface; grep-verify external IDs against on-disk artifacts when condensing.
