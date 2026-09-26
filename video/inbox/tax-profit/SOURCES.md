# tax-profit — sources

Film: "you're taxed on profit, not on what came in". US federal rules. All sources fetched 2026-09-26 from IRS.gov.
Tax-year note: as of September 2026 the IRS has not yet published the 2026-return editions of these publications;
the current editions are the ones for 2025 returns (below). The rules used here (net profit = income minus business
expenses; expenses must be ordinary and necessary; keep records) are long-standing and not year-specific. No rate,
threshold or date appears in this film.

## Claims

**1. Your business profit is income minus business expenses, and that net profit is what goes onto the return.**
- Pub 334, *Tax Guide for Small Business* (2025), "For use in preparing 2025 Returns", dated Feb 10, 2026 —
  https://www.irs.gov/pub/irs-pdf/p334.pdf, Chapter 9, Figuring Net Profit or Loss:
  > "You do this by subtracting business expenses from business income. If your expenses are less than your income,
  > the difference is net profit and becomes part of your income on line 3 of Schedule 1 (Form 1040)."
- Schedule C (Form 1040) 2025 — https://www.irs.gov/pub/irs-pdf/f1040sc.pdf:
  > "1 Gross receipts or sales" … "28 Total expenses" … "31 Net profit or (loss). Subtract line 30 from line 29."
  (On screen: "gross receipts" under *money in*; "net profit · Schedule C, line 31" under *profit*.)

**2. Both federal income tax and self-employment tax start from that net profit number** (hence "your federal tax
starts from profit").
- 2025 Instructions for Schedule C — https://www.irs.gov/pub/irs-pdf/i1040sc.pdf, Line 31:
  > "Individuals. Enter your net profit or loss on line 31 and include it on Schedule 1 (Form 1040), line 3. Also,
  > include your net profit or loss on Schedule SE (Form 1040), line 2."
- Honesty note: income tax is then figured on taxable income (after other adjustments and deductions), and SE tax
  on a percentage of net earnings — which is why the film says the tax *starts from* profit, not that it *is* a
  percentage of profit.

**3. What counts as a business expense: ordinary and necessary; personal part not deductible.**
- Pub 334 (2025), Chapter 8, Business Expenses:
  > "To be deductible, a business expense must be both ordinary and necessary. An ordinary expense is one that is
  > common and accepted in your field of business. A necessary expense is one that is helpful and appropriate for
  > your business."
  > "If you have an expense that is partly for business and partly personal, separate the personal part from the
  > business part. The personal part is generally not deductible."
  (Why the takeaway says "business expense", not "every expense".)

**4. Booth rent is deductible rent.**
- Pub 334 (2025), Chapter 8, Rent Expense:
  > "Rent is any amount you pay for the use of property you do not own. In general, you can deduct rent as a
  > business expense only if the rent is for property you use in your business."
- 2025 Instructions for Schedule C, Lines 20a and 20b:
  > "Enter on line 20b amounts paid to rent or lease other property, such as office space in a building."

**5. Color + supplies are deductible supplies (used in the business that year).**
- 2025 Instructions for Schedule C, Line 22:
  > "In most cases, you can deduct the cost of materials and supplies only to the extent you actually consumed and
  > used them in your business during the tax year (unless you deducted them in a prior tax year)."

**6. A skills class is deductible for the self-employed — with conditions.** (Slate said "education"; the film says
"skills class" because initial licensing school would NOT qualify.)
- Topic no. 513, Work-related education expenses — https://www.irs.gov/taxtopics/tc513 (Page Last Reviewed or
  Updated: 24-Sep-2026):
  > "You may be able to deduct the cost of work-related education expenses paid during the year if you're: A
  > self-employed individual"
  > "To be deductible, your expenses must be for education that (1) maintains or improves skills needed in your
  > present work … However, even if the education meets either of these tests, the education can't be part of a
  > program that will qualify you for a new trade or business or that you need to meet the minimal educational
  > requirements of your present trade or business."
  > "Self-employed individuals include education expenses on Schedule C (Form 1040)"

**7. Record expenses as they happen; records must support the return.** (Slate said "A receipt you lost is tax on
money you already spent" — overstated: a lost receipt is not automatically a lost deduction; other records such as a
canceled check can support it. The film instead says an expense you forget to record stays in profit — which is
arithmetic, not a rule.)
- Pub 583, *Starting a Business and Keeping Records* (Rev. December 2024) — https://www.irs.gov/pub/irs-pdf/p583.pdf,
  Why Keep Records?:
  > "Keep track of deductible expenses. You may forget expenses when you prepare your tax return unless you record
  > them when they occur."
  > "Prepare your tax returns. You need good records to prepare your tax returns. These records must support the
  > income, expenses, and credits you report."
  > "Except in a few cases, the law does not require any specific kind of records."
  - Supporting Documents: "Supporting documents include sales slips, paid bills, invoices, receipts, deposit
    slips, and canceled checks."

## Worked example (ILLUSTRATIVE — labelled "example" on screen; not from any source)

Her note: "made 48k this year" = 48,000 (48k).

    money in (gross receipts)          48,000
    booth rent                       − 12,000   → 48,000 − 12,000 = 36,000
    color + supplies                 −  3,000   → 36,000 −  3,000 = 33,000
    skills class                     −    600   → 33,000 −    600 = 32,400
    ------------------------------------------
    total expenses  12,000 + 3,000 + 600 = 15,600
    profit (net profit)   48,000 − 15,600 = 32,400

The 15,600 of expenses is money that never reaches the profit line; the tax starts from 32,400, not 48,000.
A forgotten expense (the dashed line) would leave its amount inside the 32,400 — taxed as if it were profit.

## Display-only numbers (not tax figures)
Status-bar clock and the note's timestamp are scenery: "11:12 PM", "11:13 PM" (and "Sat 11:12 PM").
Schedule C line number shown small: "line 31" (Schedule C, line 31, quoted above).


## Post-build fixes (2026-09-26, from the blind verifier)
- "Every business expense you can back up comes off the top." -> "Business costs you can prove come off the top. Business part only." (Pub 334: ordinary + necessary; "If you have an expense that is partly for business and partly personal, separate the personal part").
- Takeaway "It comes off before the tax is figured." -> "The deductible ones come off before the tax is figured." (same reason; not every business cost is deductible in the year paid).
- Round 2 verifier: "Business costs you can prove come off the top" still made proof the test -> "Deductible business costs come off the top. Keep the proof. Business part only."
