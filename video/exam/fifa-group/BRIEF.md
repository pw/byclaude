# FIFA Football Agent exam — Facebook Page + group kit (R. J. Maren)

You build the staging kit Patrick uses to create a Facebook Page + a daily-practice group for the book
*The Football Agent Exam — An Unofficial Guide to the Regulations, the License, and What the Exam Actually Tests*
(R. J. Maren, Kindle ASIN B0HHYDYVT8, https://www.amazon.com/dp/B0HHYDYVT8). The exam is FIFA's Football Agent
exam under the FIFA Football Agent Regulations (FFAR). NOT the NFLPA exam.

Model to copy exactly (structure, tone, copy buttons, one JSON block for the scheduling assistant, field names):
`~/Handoff/reports/maren-adj-fb-group.html`. Read it fully first. Also skim the book's outline
`~/batch-novel/projects/guide-football-agent-exam/outline.md` for scope.

## Deliverables
1. `~/Handoff/reports/maren-fifa-fb-group.html` — same sections as the adjuster kit: Page spec (name
   `FIFA Football Agent Exam Prep`, username `@fifaagentexamprep` (check nothing obviously conflicts; propose one
   fallback), category Education, bio ≤ 255 chars, about text, links = Amazon + the group placeholder), Group spec
   (name `FIFA Football Agent Exam Prep — Daily Practice Question`, Private + Visible, membership questions, rules,
   description), and WEEK ONE: 7 morning questions (multiple choice A–D) + 7 evening answers, as the same one-JSON-for-
   the-assistant block with a schedule (question 7am, answer 7pm; timezone Europe/London — the audience is global and
   FIFA-centred — say so in a note).
2. `~/byclaude/video/exam/fifa-group/SOURCES.md` — for EVERY question: the FIFA document, edition/date, article
   number, URL (legal.fifa.com / inside.fifa.com / fifa.com only — the FFAR, the RSTP, FIFA's exam study materials /
   FAQ / circulars) and a short VERBATIM quote that makes the keyed answer true and each distractor false.

## HARD rules
- Verify against the CURRENT published FFAR and FIFA's current exam page. FIFA amends these; note the edition you read.
- The service-fee cap and several related provisions were SUSPENDED by FIFA (circular, 2023–24, pending EU court
  proceedings). Do NOT write a question whose answer depends on a suspended provision unless the question is ABOUT the
  suspension and you can quote the circular. Find and cite the current status.
- Questions are ORIGINAL — never copy FIFA's own sample/mock questions or any prep provider's.
- Exactly one defensible answer; distractors similar in length; no citation or tell on one option only.
- Mix: licensing & exam logistics (eligibility, exam, licence fee, CPD), representation agreements (form, duration,
  minors), conflicts of interest / dual representation, service-fee payment mechanics, disciplinary/enforcement.
  Avoid anything that differs by national association unless the question pins it.
- Evening answers: the keyed letter, one-paragraph why, the article cite, one line on the tempting wrong option.
- Page/group copy: unofficial, not affiliated with FIFA or any national association; the pen name never claims to
  hold a licence. No "facebook"-brand wording needed beyond what the adjuster kit uses.

## Self-check before you finish
Solve each question cold from the question + options only; if two options are defensible, rewrite it.
Write `~/byclaude/video/exam/fifa-group/questions.json` = [{"question": "...", "options": ["A) ..",..], "answer": "B"}, ...]
(the exact strings from the kit) so a blind verifier can re-solve them.

Report (under 200 words): the FFAR edition you verified against, suspended-provision handling, anything uncertain.
Don't post, send, deploy or commit anything.
