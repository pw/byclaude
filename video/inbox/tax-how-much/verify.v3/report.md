## Review: estimated-tax explainer (federal, 2026)

**Checked and correct.** I checked these against Pub 505 (2026), the 2025 Form 2210 instructions, and IRS.gov's page on the underpayment penalty:
- The 90% / 100% "smaller of" rule.
- 110% when last year's AGI was over $150k ($75k married filing separately).
- The prior-year return has to be filed and cover a full 12 months.
- Self-employment tax counts in last year's total.
- The penalty is figured per installment and grows with the number of days late.
- The three conditions for the zero-tax exception.
- The arithmetic: 4,000 ÷ 4 = 1,000, and 6,000 − 4,000 = 2,000. The safe harbor is the smaller of 90% × 6,000 = 5,400 and 4,000, which is 4,000. The example is labelled.

### Findings

**1. The screens "total tax on last year's return was $0" and "a refund doesn't mean $0"**
- **What's wrong:** For this exception, IRS's "total tax" is line 24 *after* subtracting refundable credits (EITC, ACTC, AOTC). Take a low-earning stylist whose EITC is bigger than their line 24. Their total tax is $0 for this rule, and their refund *comes from* that. As written, the screen tells exactly this person they don't qualify. It fails on the safe side (they'd pay estimates they didn't need), but the universal is false, and EITC is common in this audience. The "line 24, minus refundable credits" footnote sits on an earlier screen, and a viewer won't carry it over.
- **IRS quotes:**
  - https://www.irs.gov/publications/p505: "You had no tax liability for 2025 if your total tax (defined later under Total tax for 2025—line 12b) was zero or you didn't have to file an income tax return."
  - The same page: "Your 2025 total tax is the amount on Form 1040 or 1040–SR, line 24 reduced by the following. … Any refundable credit amounts on Form 1040 or 1040-SR, lines 27a, 28, 29, and 30; and Schedule 3 (Form 1040), lines 9 and 12."
- **Replace with:** "total tax on last year's return, minus refundable credits, was $0" and "a refund from withholding or payments doesn't mean $0"

**2. The screen "No underpayment penalty, generally, if you pay in the smaller of:"**
- **What's wrong:** The rule is shown without its timing condition. "Each due date, on time" only arrives two screens later, inside the example. A viewer who stops at the rule could think paying the full amount in by January, or at filing, is safe.
- **IRS quote:** https://www.irs.gov/instructions/i2210: "you may owe the penalty for 2025 if the total of your withholding and timely estimated tax payments didn't equal at least the smaller of…" and "you may owe the penalty for an earlier due date even if you paid enough tax later to make up the underpayment."
- **Replace with:** "No underpayment penalty, generally, if you pay in, on time through the year, the smaller of:"

**3. The screen "($75,000 if married filing separately)" (minor)**
- **What's wrong:** Because it follows "last year's AGI", it reads as last year's filing status. IRS ties it to *this* year's status.
- **IRS quote:** https://www.irs.gov/publications/p505: "If your AGI for 2025 was more than $150,000 ($75,000 if your filing status for 2026 is Married filing separately), substitute 110% for 100%…"
- **Replace with:** "($75,000 if you're married filing separately this year)"

**4. The screen "form 1040 line 24, minus refundable credits" (nit, safe direction)**
- **What's wrong:** Pub 505 also takes out a few other items. One is relevant to tipped workers: unreported Social Security and Medicare tax from Form 4137. Leaving it in makes a viewer's target higher, never lower, so no one gets a penalty from this. No change needed.

**5. The caption (nit)**
- **What's wrong:** "paying in last year's tax on time" leaves out the 110% rule for AGI over $150k. It's hedged with "generally" and the video covers it. Optionally add "(110% if last year's AGI was over $150,000)".

**Order:** Apart from finding 2, the sequence works. The rule comes before the 110% condition, which comes before the example, then "safe from the penalty, not the bill", then late payments. "Not from the bill" correctly comes before anyone could conclude the $2,000 goes away.

VERDICT: FIX
exit 0
