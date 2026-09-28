# Exam series — slate (FB Reels on three exam-prep Pages)

## The accounts
Three Facebook Pages, one per exam, each with a free private group that posts one practice question every
morning and the worked answer every evening. Each Page is the companion to an unofficial study guide by R. J. Maren
(a pen name; the Page never claims the author holds any license). The reels exist to bring people who are
studying for the exam into the group.

| Page | handle | series colours (match the Page cover) | exam |
|---|---|---|---|
| Claims Adjuster Licensing Exam Prep | `@adjusterexamprep` | ground #5E1A26 burgundy · text #EAD8C0 cream | state P&C / all-lines adjuster licensing exams (Texas All-Lines, Florida 6-20, …) |
| Food Protection Manager Exam Prep | `@fpmexamprep` | ground #183828 deep green · accent #F09810 amber · text #F4EEE2 | ANSI-accredited Certified Food Protection Manager exams, built on the FDA Food Code |
| Wastewater Operator Exam Prep | `@wastewaterexamprep` | ground #102850 navy · accent #A8D0E8 pale blue · text #F4EEE2 | state wastewater treatment operator certification (many states use ABC exams + the ABC formula sheet) |

Display face = Anton (`../fonts/Anton-Regular.ttf`, condensed caps — the same voice as the Page covers). Inter for
body/options. Instrument Serif not used in this series.

## The form (every film)
A practice question you can play along with. Roughly:
1. **Hook (≈2 s):** big Anton line, e.g. `ADJUSTER EXAM MATH` / `CAN YOU GET THIS ONE?` — make the viewer's first
   second say *this is for me*.
2. **The question (≈10–16 s):** question text on a clean card, then options A–D appear one by one. Obey the reading
   rule (≥ 0.35 s per word on screen before anything else moves).
3. **Pause (≈5 s):** `PAUSE AND SOLVE IT` + a drawn ring timer counting down, `tick` events each second.
4. **Reveal:** the right option lights in the accent; the others dim. `bell` on the reveal.
5. **Worked answer (≈10–15 s):** formula line, then the numbers substituted, then the result — each line arriving
   on its own beat. For concept questions: the rule in one plain sentence + its source cite (e.g. `Food Code 3-501.14`).
6. **The trap (≈3 s):** one line naming the most tempting wrong option and why it's wrong
   (`B forgets the deductible.`). This is the line people comment on.
7. **End card (≈4 s):** the handle; `A free practice question every morning in our group.`; `Join from this Page.`;
   small: `Unofficial. Not affiliated with any exam provider or regulator.` (Adjuster adds `Rules vary by state.`,
   FPM adds `Based on the FDA Food Code; your local code may differ.`, Wastewater adds `Check your state's exam and formula sheet.`)

Total 35–60 s. Example figures are labelled `example` (a small tag on the question card is enough).

## HARD honesty rules
- Questions are ORIGINAL. Never reproduce a real exam item, a vendor's item bank, or a prep company's question.
- Exactly ONE defensible answer. Distractors must be wrong for a reason you can state — never "also true but less
  complete". If the right answer depends on state/edition, either pin the assumption in the question
  (`Assume a standard pro-rata clause`) or pick a different question.
- Every number on screen is traceable in SOURCES.md with its arithmetic; every rule has an authoritative source
  with a verbatim quote (the regulator, the code itself, NAIC, the certifier's formula sheet, a state DOI study
  outline, a state operator-training manual). No blogs or prep-company pages as authority.
- The correct option and the distractors must look alike (similar length, no citation or tell on one option only).
- Nothing tells a viewer they will pass, nothing names a real exam vendor/prep company, no real brand names.

## Films (12) — the builder verifies and may correct the slate; list every change

### Claims Adjuster (`adj-*`)
1. **adj-split-limits** *(FILM 1 — also builds `kit.js`)* — Auto liability split limits, example 25/50/25. One
   at-fault accident: three injured people with $30,000, $15,000 and $10,000 of bodily-injury damages, plus
   $28,000 of property damage. How much does the policy pay in total? Work: per-person cap 25 → 25 + 15 + 10 = 50 =
   exactly the per-accident cap; property capped at 25 → total $75,000. Trap: paying $30,000 to the first person
   (ignores the per-person limit). State minimums vary — label the limits as an example.
2. **adj-depreciation-holdback** — Replacement-cost policy, roof replacement cost $12,000, 20-year useful life,
   8 years old, $1,000 deductible, insured has not yet replaced it. First payment = ACV − deductible
   (12,000 − 4,800 = 7,200; − 1,000 = 6,200); the $4,800 recoverable depreciation is paid after replacement.
   Verify how the deductible is commonly applied and hedge with "typically / under this policy's terms".
3. **adj-coinsurance-met** — Commercial property, 90% coinsurance, value at time of loss $500,000, limit
   carried $450,000, loss $80,000, deductible $2,500. Requirement met → pays 80,000 − 2,500 = $77,500. Trap: applying
   the penalty ratio anyway (450/450 = 1, so no penalty) or using the 80% default.
4. **adj-equal-shares** — Two liability policies both written with contribution-by-equal-shares; A limit
   $50,000, B limit $200,000; covered loss $120,000. Equal shares until A is exhausted: A 50,000, B 70,000. Trap:
   pro-rata by limits (A 24,000 / B 96,000).

### Food Protection Manager (`fpm-*`)
5. **fpm-cooling** — Two-stage cooling of cooked TCS food: 135°F → 70°F within 2 hours, and → 41°F within a total
   of 6 hours (Food Code 3-501.14). Frame as a timeline question (chili at 135°F at 2:00 PM — latest time it must
   reach 70°F? / 41°F?). Verify the current edition's wording + what corrective action it names if stage 1 is missed.
6. **fpm-reheat** — Reheating cooked, cooled TCS food for hot holding: 165°F for 15 seconds, within 2 hours
   (3-403.11). Distractors: 135°F, 145°F, 155°F.
7. **fpm-handwash** — Hand washing: at least 20 seconds total, vigorous friction for at least 10–15 seconds
   (2-301.12). Verify exact numbers + wording in the current edition.
8. **fpm-time-control** — Time as a public health control (no temperature control, max 4 hours; then cook+serve
   or discard; marked with the discard time) — 3-501.19. Timeline question. Verify the 6-hour/cold-food variant
   and keep the question unambiguous.

### Wastewater (`ww-*`)
9. **ww-pounds** — The pounds formula: lb/day = mg/L × MGD × 8.34. Example: BOD 200 mg/L, flow 3.2 MGD →
   5,337.6 lb/day. Trap: forgetting 8.34 (640).
10. **ww-svi** — Sludge volume index: 30-min settleability 280 mL/L, MLSS 2,800 mg/L → SVI = 280 × 1,000 / 2,800
    = 100 mL/g. Trap: inverting the ratio.
11. **ww-fm** — F/M ratio: flow 1.5 MGD, aeration influent BOD 160 mg/L, aeration volume 0.5 MG, MLVSS
    2,400 mg/L → food 2,001.6 lb/day, microorganisms 10,008 lb → F/M ≈ 0.20. Use the ABC formula sheet form.
12. **ww-weir** — Weir overflow rate: circular clarifier 50 ft diameter, weir on the outer edge, flow 1.8 MGD →
    weir length = 3.14 × 50 = 157 ft → 1,800,000 / 157 = 11,465 gpd/ft (state which π the sheet uses and round
    consistently). Trap: using area instead of circumference.

## Captions (caption.txt)
1–2 plain sentences in the Page's voice (third person/neutral, never "I"), e.g. `Adjuster exam math: split limits.
Answer and the worked math at the end.` then `Unofficial practice question. A new one every morning in our free
group, linked from this Page.` then a blank line and 4–6 hashtags for the audience (#insuranceadjuster
#adjusterlicense #claimsadjuster … / #servsafe is a BRAND — don't; use #foodsafety #kitchenmanager #restaurantlife …
/ #wastewater #wastewateroperator #watertreatment #operatorlife …). Never #ai.
