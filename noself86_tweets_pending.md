# Pending tweets — @noself86 (Patrick)

Durable scheduler: `python3 ~/.claude/skills/twitter/scripts/twitter.py schedule "text" "YYYY-MM-DD HH:MM"`
writes to scheduled.db; crontab runs `run-scheduler` EVERY MINUTE posting due tweets (session-independent).
Box clock is UTC → pass times in UTC (14:00 UTC = 10am ET = 8am MDT). List: `twitter.py scheduled`. Pull: `twitter.py unschedule <id>`.
Pre-fire checks are baked into post_tweet (char/path handled at draft time). This file is the human-readable record.

---

## ACTIVE — in the durable scheduler (as of 2026-07-27 01:40 UTC)

### Box-cover paper announcement — Mon 2026-07-27 14:00 UTC · sched id `76835851`
Repost of the tweet that went live ~20 min and was PULLED (deleted id 2081550592569389449) on
Patrick's call — flagship gets a Monday-morning window instead of a quiet Sunday night.
Text:
```
My first paper is on arXiv.

With my AI partner, we proved a longstanding conjecture about double-covers of the discrete box {0,1,2}^d — for dimensions 4 and 5, with every key claim machine-checked in Lean.

I have no math degree. Adam Wagner called it cute.

https://arxiv.org/abs/2607.09014
```
Open: Adam Wagner named but NOT tagged (@azwagner_); Patrick may want the tag or to quote-tweet
the original "cute" tweet (couldn't locate it by search — coverage failure, not proof absent).

### Heisenberg d(H₁₂₅)=12 announcement — Wed 2026-07-29 14:00 UTC · sched id `9494461f`
"Paper two," interleaved one-per-day with the build-in-public series.
Text (264 chars):
```
Paper two is up.

d(H₁₂₅) = 12: the Davenport constant of the Heisenberg group of order 125 — first open case of the Godara–Sarkar conjecture. Machine-checked in Lean, cross-verified in C and Python.

And where the proof breaks for p≥7.

https://arxiv.org/abs/2607.14379
```

## Full @noself86 calendar (math interleaved with build-in-public series)
- Mon 7/27 14:00 · **box-cover math** (76835851)
- Tue 7/28 15:41 · BeatTheBid (afa2e1af)
- Wed 7/29 14:00 · **Heisenberg math** (9494461f)
- Thu 7/30 16:52 · Edgewright (89492b51)
- Sat 8/01 17:08 · CaliforniaBirthIndex (3a4b03e3)
- Mon 8/03 15:17 · romance-novel pipeline (7f6b9865)
- Wed 8/05 16:34 · FeelBetterBot (cf342b6c)

arXiv rate-limit context (7/27): arXiv throttled us to 1 submission/calendar month. Accepted
7855656 = the Kahane skew-shape 2×n paper; held 7855731 + 7831887 for resubmission Aug/Sept.
The two LIVE papers (double-box 2607.09014, Heisenberg 2607.14379) are already announced — the
throttle is about the newer batch, not these tweets.
