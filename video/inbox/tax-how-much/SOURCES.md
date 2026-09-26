# tax-how-much — SOURCES

US federal rules, tax year 2026. Every rule, rate and threshold on screen is quoted below from IRS.gov.
All pages fetched 2026-09-26 (curl, full text read; PDFs converted with pdftotext).

## Sources used

| Short name | URL | Revision |
|---|---|---|
| 1040-ES (2026) | https://www.irs.gov/pub/irs-pdf/f1040es.pdf | Form 1040-ES (2026), dated Feb 12, 2026 |
| Pub 505 (2026) | https://www.irs.gov/pub/irs-pdf/p505.pdf | Publication 505 (2026), "For use in 2026" |
| Topic 306 | https://www.irs.gov/taxtopics/tc306 | Page Last Reviewed or Updated: 24-Sep-2026 |
| Estimated Taxes page | https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes | Page Last Reviewed or Updated: 25-Sep-2026 |
| 2210 instructions | https://www.irs.gov/pub/irs-pdf/i2210.pdf | Instructions for Form 2210 (2025) — the current edition; the 2026 edition is not out until the 2026 return season. Used only for the "each due date separately" rule and to cross-check the no-tax-last-year exception, both of which the 2026 1040-ES / Pub 505 also state. |

## Claims → sources

**1. The safe harbor: pay in the smaller of 90% of this year's tax or 100% of the tax on last year's return.**
(on screen: "No underpayment penalty, generally,", "if you pay in the smaller of:", "90%" "of this year's tax", "100%" "of the tax on" "last year's return")
- 1040-ES (2026), General Rule: "You expect your withholding and refundable credits to be less than the smaller of: a. 90% of the tax to be shown on your 2026 tax return, or b. 100% of the tax shown on your 2025 tax return. Your 2025 tax return must cover all 12 months."
- Topic 306: "Generally, most taxpayers will avoid this penalty if they either owe less than $1,000 in tax after subtracting their withholding and refundable credits, or if they paid withholding and estimated tax of at least 90% of the tax for the current year or 100% of the tax shown on the return for the prior year, whichever is smaller."
- Estimated Taxes page: "Generally, most taxpayers will avoid this penalty if they owe less than $1,000 in tax after subtracting their withholdings and credits, or if they paid at least 90% of the tax for the current year, or 100% of the tax shown on the return for the prior year, whichever is smaller."
- What "the tax on last year's return" means — 1040-ES (2026): "The tax shown on your 2025 Form 1040 or 1040-SR is the amount on Form 1040 or 1040-SR, line 24, reduced by: … 4. Any refundable credit amounts …" (so it is the return's total tax, less refundable credits — the film says "the tax on last year's return", the IRS phrase, not "total tax").
- Withholding counts as paid in: 1040-ES line 13 subtracts "Income tax withheld and estimated to be withheld during 2026" from the required annual payment.

**2. 110% instead of 100% if last year's AGI was over $150,000 ($75,000 married filing separately).**
- 1040-ES (2026), Special Rules: "Higher income taxpayers. If your adjusted gross income (AGI) for 2025 was more than $150,000 ($75,000 if your filing status for 2026 is married filing separately), substitute 110% for 100% in (2b) under General Rule, earlier."
- Pub 505 (2026): "If your AGI for 2025 was more than $150,000 ($75,000 if your filing status for 2026 is Married filing a separate return), substitute 110% for 100% in (2b) under General Rule, earlier."

**3. Pay it in four equal parts, on time — each due date counts separately.**
(on screen: "four due dates", "÷ 4", "1,000", "each quarter, on time", "paid in on time")
- 1040-ES (2026), Payment Due Dates: "You can pay all of your estimated tax by April 15, 2026, or in four equal amounts by the dates shown below." (1st April 15, 2026 · 2nd June 15, 2026 · 3rd Sept. 15, 2026 · 4th Jan. 15, 2027)
- Pub 505 (2026): "Subtract your expected withholding from your required annual payment (line 12c). You must usually pay this difference in four equal installments."
- Topic 306: "Generally, taxpayers should make estimated tax payments in four equal amounts to avoid a penalty."
- 2210 instructions (2025): "Penalty figured separately for each required payment. The penalty is figured separately for each installment due date. Therefore, you may owe the penalty for an earlier due date even if you paid enough tax later to make up the underpayment."
- (Uneven income can use the annualized installment method instead — Topic 306: "if you receive income unevenly during the year, you may be able to vary the amounts of the payments". Not shown on screen; the film says "generally".)

**4. The safe harbor stops the penalty, not the bill: you may still owe tax when you file.**
(on screen: "due when you file", "Safe from the penalty, generally. Not from the bill.")
- 1040-ES (2026), worksheet caution at line 12c: "Even if you pay the required annual payment, you may still owe tax when you file your return."

**5. First year out, no tax last year: generally no underpayment penalty this year — three conditions.**
(on screen: "Zero tax last year?", "if all three are true:", "total tax on last year's return was $0", "a refund doesn't mean $0", "or: you didn't have to file", "US citizen or resident all year", "a full 12-month tax year", "Generally, no underpayment penalty for this year.")
- Pub 505 (2026): "Estimated tax not required. You don't have to pay estimated tax for 2026 if you meet all three of the following conditions. • You had no tax liability for 2025. • You were a U.S. citizen or resident alien for the whole year. • Your 2025 tax year covered a 12-month period. You had no tax liability for 2025 if your total tax (defined later under Total tax for 2025—line 12b) was zero or you didn't have to file an income tax return."
- 1040-ES (2026): "Exception. You don't have to pay estimated tax for 2026 if you were a U.S. citizen or resident alien for all of 2025 and you had no tax liability for the full 12-month 2025 tax year. You had no tax liability for 2025 if your total tax was zero or you didn't have to file an income tax return."
- 2210 instructions (2025), Exceptions to the Penalty: "You won't have to pay the penalty or file this form if … You had no tax liability for 2024, you were a U.S. citizen or resident alien for the entire year …, and your 2024 tax return was (or would have been had you been required to file) for a full 12 months." (same rule, one year earlier)
- "Not just a refund": a refund means more was withheld than the tax; the test is the TOTAL TAX being zero ("your total tax was zero"), not the balance due.

**6. "federal", 2026.** The film is labelled `federal · 2026`; all of the above are federal rules for tax year 2026 (1040-ES 2026, Pub 505 "For use in 2026"). States have their own estimated-tax rules; not covered.

## Worked example (ILLUSTRATIVE — made-up figures, labelled "example" on screen)

Assumes: last year was a full 12-month tax year, last year's AGI was $150,000 or less (so the 100% rule applies, not 110%), no withholding this year, all four payments made on time.

Part A — the payments
- Tax shown on last year's return: 4,000
- Required annual payment by the prior-year rule = 100% × 4,000 = 4,000
- Four due dates: 4,000 ÷ 4 = 1,000 each quarter
- 1,000 + 1,000 + 1,000 + 1,000 = 4,000 paid in during the year

Part B — this year turns out bigger
- This year's tax comes to 6,000
- 90% of this year's tax = 0.90 × 6,000 = 5,400
- Smaller of 5,400 and 4,000 = 4,000 → the 4,000 paid on time meets it, so generally no underpayment penalty
- Still due when you file: 6,000 − 4,000 = 2,000

## Other numbers on screen (not tax figures)
- Phone clock / timestamps: "9:41 PM", "Tue 9:41 PM", "9:42 PM" — story UI only.
- "$0" (zero total tax), "12-month" (the full-year condition) — from claim 5.


## Post-build fixes (2026-09-26, blind verifier)
- "100% of the tax on last year's return" -> "of the TOTAL tax on" + "form 1040 line 24 · includes self-employment tax"; example row -> "total tax last year" (Pub 505: "100% of the total tax shown on your 2025 return" / "Your 2025 total tax is the amount on Form 1040 or 1040-SR, line 24 reduced by..."; line 16 "Tax" omits SE tax).
- Added "Missed a due date? The penalty is figured per payment, and grows with each day it's late." (Pub 505: "The penalty is figured separately for each payment period."). Posting in late Sept, three 2026 dates have passed.
- "each quarter, on time" -> "each due date, on time" (periods are unequal).

## Round 2 (verifier FIX)
- Line-24 note -> "form 1040 line 24, minus refundable credits" + "includes self-employment tax · full-year return you filed" (Pub 505: "Your 2025 total tax is the amount on Form 1040 or 1040-SR, line 24 reduced by ... Any refundable credit amounts"; "Your 2025 tax return must cover all 12 months").

## Round 3 (verifier FIX)
- "if you pay in the smaller of:" -> "if you pay on time the smaller of:" (i2210: "total of your withholding and timely estimated tax payments").
- Zero-tax card: "last year's total tax was $0" + "counted after refundable credits, like the EIC"; dropped "a refund doesn't mean $0" (false for an EIC-refund filer) (Pub 505 definition of total tax, line 12b).
- "$75,000 if married filing separately this year" (Pub 505: "if your filing status for 2026 is Married filing separately").
- Caption: adds the 110% rule.
