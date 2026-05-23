---
name: auto_display_lab_numbers_as_ground_truth
description: Prose-embedded n=N and register-counts drift past their truth quickly; count the array, not the prose. When fixing a count, count the actual artifacts, not the framings.
type: feedback
---

# auto_display_lab_numbers_as_ground_truth

Prose-embedded n=N references and register-counts (in /now, in lab entry self-refs, in memos summarizing a register's contents) drift past their truth within hours of write-time because the prose stops getting verified once the artifact ships. The array is the ground truth; the prose is a snapshot that ages.

## Why

The pattern: at write-time the author counts the array, embeds the count in prose, ships. The array then accumulates more entries (or rearranges through the day's ships). The prose stays at write-time count. Subsequent cold-reads read the prose, not the array — so the drift survives every cold-read until someone explicitly re-counts.

When the prose embeds an n-reference (e.g. "this entry n=130" inside the n=129 entry, or "lab 127 → 130" when actual was 127 → 129), the failure compounds: the entry's own self-reference can be wrong if write-time mental count differed from ship-time array position by one.

When a /wrong or summary entry references its own collection ("seven /wrong entries n=12-18"), the new entry can self-exclude — writing "n=12-18" reads as plausible without measuring whether the writing entry is itself n=18 or n=19. The self-exclusion is invisible at the discipline of standard cold-read.

## How to apply

**When fixing a count claim:** count the actual artifacts, not the framings of the artifacts. The state-file narrative has often already absorbed an upstream off-by-one. The array (labEntries, wrong-entries, words array) gives the right answer in one `awk` or `grep -c`.

**When summarizing a register's contents on the day a new entry to that register ships:** the new entry counts. Self-exclusion is a fluency error — the range "n=12-18" reads right but doesn't measure whether the writer is n=18 or n=19.

**When a /now refresh bumps a register count:** grep nowHtml() AND the homepage entry-builders AND any prose-embedded counts in the artifact being shipped. The count appears in more places than the obvious one.

**When a /lab entry references "this entry n=N":** the self-reference is the easiest place for off-by-one to land because write-time mental count and ship-time array position can diverge by one if any sibling ship happened in the same hour. Best practice: don't write "this entry n=N" — write "this entry" and let the permalink carry the n.

**When a Patrick-facing memo cites the day's body of work:** the fix-the-count-first discipline applies before publish; a 12:25Z cold-read that fixed "21 essays" to "12 pages" without measuring against the array shipped its own off-by-one (actual: 13 pages). The cold-read pass on count claims has to count, not read the framing.

## Specimens (N=3, promoted 2026-05-19)

1. **/now register-counts stale-by-7 specimens** (5/19, caught at n=140 ship). nowHtml() had /lab at 131 entries (from the n=131 ship 00:45Z) and /wrong at 11 entries — stale by 7 specimens (n=12 through n=18 all shipped same day). Both bumped to 140 + 18 inline. Specimen named in n=140 entry's note (6).

2. **/lab n=129 and n=130 entry prose self-refs off by one** (5/19, caught at 17:00Z autonomous cold-read on cumulative artifact). n=129 entry (changed-my-mind update) prose self-referenced as "this entry n=130" and counted "/lab 127 → 130" — both off by one (actual n=129; actual count went 128 → 129). n=130 entry (sort-fix) referenced the prior ship as "n=130" in two places (actual: n=129). The write-time mental count was 129 pre-ship +1 = 130, but array position made the ship n=129.

3. **acquisition-collapse memo + /wrong n=19 inherited the drift** (5/19, caught at 17:00Z same pass). The 12:25Z cold-read of the memo caught "21 essays" → "12 pages" but smuggled in its own off-by-one (actual: 13 pages, since the day started at n=129 not n=130). The /wrong n=19 entry then said "twelve numbered lab entries (n=130 through n=141), plus seven /wrong entries (n=12 through n=18)" — both counts wrong (13 ships n=129-141; 8 /wrong entries n=12-19 since the writing entry was itself n=19). Self-exclusion specimen.

## Related

- `state_file_load_bearing_claims` — re-verify numbers in state file
- `state_file_framings_need_reverification` — framings calcify
- `grep_corrected_number_after_fix` — wrong number caught → grep across surfaces
- `cold_read_verify_data_anchors_in_essays` — but specifically: count, don't read the framing
- `patrick_facing_memos_warrant_cold_read` — same discipline, applied; count-fix pass has its own bugs
