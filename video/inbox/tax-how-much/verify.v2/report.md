# Review: estimated-tax safe-harbor explainer

Sources: IRS Pub 505 (2026) at https://www.irs.gov/publications/p505 and the Form 2210 instructions at https://www.irs.gov/instructions/i2210. I pulled both pages with curl and quoted them directly, not through a summarizer.

## Findings

**1. "form 1040 line 24 · includes self-employment tax". The number is misidentified, and it matters for this audience.**

- **What's wrong:** For the prior-year safe harbor and the "$0 last year" exception, the IRS doesn't use line 24 as it stands. It uses line 24 minus refundable credits, plus a few small adjustments.
  - Pub 505: *"Your 2025 total tax is the amount on Form 1040 or 1040–SR, line 24 reduced by the following. … Any refundable credit amounts on Form 1040 or 1040-SR, lines 27a, 28, 29, and 30; and Schedule 3 (Form 1040), lines 9 and 12."* Those lines cover the earned income credit, the additional child tax credit, the refundable American opportunity credit and the net premium tax credit.
  - Pub 505 ties the zero exception to the same definition: *"You had no tax liability for 2025 if your total tax (defined later under Total tax for 2025—line 12b) was zero or you didn't have to file."*
- **Why it matters:** Stylists and groomers often get the EIC or a marketplace premium tax credit. Taking line 24 at face value leads to two errors:
  - They overstate the "pay 100%" target, and the ÷4 amount along with it.
  - Someone whose refundable credits wipe out line 24 would conclude the "Zero tax last year?" exception doesn't apply to them, when it does.
- **Direction of the error:** Both errors push people to pay more than they need to. They don't trigger a penalty, but the stated number is still wrong for exactly the people this video is aimed at.
- **Suggested replacement:** "form 1040 line 24, minus refundable credits (like the earned income credit) · includes self-employment tax". Or, shorter: "roughly line 24 on form 1040, minus refundable credits".

**2. "100% of the TOTAL tax on last year's return". A condition is missing (minor).**

- **What's wrong:** The 100% option only works if last year's return covered a full 12 months and you actually filed it. The video lists the 12-month condition only under the $0 exception.
  - Pub 505: *"100% of the tax shown on your 2025 tax return. Your 2025 tax return must cover all 12 months."*
  - Form 2210 instructions: *"If you didn't file a return for 2024 or your 2024 tax year was less than 12 months, don't complete line 8."* (Line 8 is the prior-year tax.)
- **Suggested addition** under "you already know it": "(if you filed, and it covered all 12 months)".

## Checked and correct

- **"smaller of: 90% of this year's tax / 100% of last year's".** Pub 505: *"The total amount you must pay is the smaller of: 90% of your total expected tax for 2026, or 100% of the total tax shown on your 2025 return."*
- **The 110% rule, AGI over $150,000 ($75,000 married filing separately).** Pub 505: *"If your AGI for 2025 was more than $150,000 ($75,000 if your filing status for 2026 is Married filing separately), substitute 110% for 100%."* The video defines AGI correctly.
- **Four equal due dates, ÷ 4.** Pub 505: *"You must usually pay this difference in four equal installments."* The 2026 dates are Apr 15, Jun 15, Sep 15, 2026 and Jan 15, 2027.
- **The penalty is figured per payment and grows with each day.**
  - Form 2210 instructions: *"The penalty is figured separately for each installment due date."*
  - Form 2210 instructions: *"The penalty is figured for the number of days that each underpayment remains unpaid."*
- **The three conditions for the $0 exception, plus "didn't have to file".** Pub 505: *"You had no tax liability for 2025. You were a U.S. citizen or resident alien for the whole year. Your 2025 tax year covered a 12-month period."* The line "a refund doesn't mean $0" is accurate.
- **Self-employment tax is included.** It's part of line 24 through Schedule 2, and it isn't among the items Pub 505 subtracts.
- **Arithmetic.**
  - 4,000 ÷ 4 = 1,000.
  - 90% of 6,000 is 5,400, so the smaller amount is 4,000, which makes the penalty-safe claim correct.
  - 6,000 − 4,000 = 2,000 due at filing.
  - The numbers are labelled "example", and $4k in tax is consistent with AGI under $150k, so the 110% rule doesn't apply.
- **Order, hedging and caption.** The order doesn't mislead: the bill caveat ("Not from the bill") comes right after the safe claim, and "generally" hedges it throughout. Nothing tells a specific person what to do. The caption is accurate.

**Not a finding, just a timing note:** this posts Sept 26, 2026, after three of the four 2026 due dates have passed. The "Missed a due date?" line already covers anyone who's behind.

VERDICT: FIX
exit 0
