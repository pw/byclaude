# SOURCES — `tax-self-employment` ("why your tax feels bigger than your W-2 friend's")

US federal rules, tax year 2026. Every page/PDF below was fetched directly from IRS.gov on 2026-09-26 and the
quotes are copied verbatim from the fetched text.

## Pages and revision dates

| # | Source | Revision / date |
|---|--------|-----------------|
| A | Topic no. 554, Self-employment tax — https://www.irs.gov/taxtopics/tc554 | Page Last Reviewed or Updated: 24-Sep-2026 |
| B | Self-employment tax (Social Security and Medicare taxes) — https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes | Page Last Reviewed or Updated: 27-Jun-2026 |
| C | Topic no. 751, Social Security and Medicare withholding rates — https://www.irs.gov/taxtopics/tc751 | Page Last Reviewed or Updated: 24-Sep-2026 |
| D | Publication 15 (2026), (Circular E), Employer's Tax Guide — https://www.irs.gov/pub/irs-pdf/p15.pdf | Dec 15, 2025 (for 2026) |
| E | Form 1040-ES (2026), Estimated Tax for Individuals — https://www.irs.gov/pub/irs-pdf/f1040es.pdf | Feb 12, 2026 (for 2026) |
| F | 2025 Instructions for Schedule SE (Form 1040) — https://www.irs.gov/pub/irs-pdf/i1040sse.pdf | 2025 (latest issued; the 2026 instructions are not out yet — used only to corroborate the $400 rule, which A and B state for the current year) |

## Claims on screen → source

**1. Social Security + Medicare together are 15.3% for the self-employed (12.4% + 2.9%).**
- B: "The self-employment tax rate is 15.3%. The rate consists of two parts: 12.4% for social security (old-age, survivors, and disability insurance) and 2.9% for Medicare (hospital insurance)."
- A: "This rate consists of 12.4% for Social Security and 2.9% for Medicare taxes."
- It is Social Security and Medicare only, not income tax — B: "all references to self-employment tax refer to Social Security and Medicare taxes only and do not include any other taxes that self-employed individuals may be required to pay."

**2. An employee pays half (7.65%) and the employer pays the other half (7.65%).**
- D (2026): "For 2026, the social security tax rate is 6.2% (amount withheld) each for the employer and employee (12.4% total). … The tax rate for Medicare is 1.45% (amount withheld) each for the employee and employer (2.9% total)."
- C: "The current tax rate for Social Security is 6.2% for the employer and 6.2% for the employee, or 12.4% total. The current rate for Medicare is 1.45% for the employer and 1.45% for the employee, or 2.9% total."
- Arithmetic: 6.2% + 1.45% = 7.65% per side. 7.65% + 7.65% = 15.3% = 12.4% + 2.9%.
- The self-employed pay both halves: B calls half of the SE tax "the employer-equivalent portion of your SE tax."

**3. Self-employed: you pay both halves, on top of income tax.**
- B: "Self-employment tax is a tax consisting of Social Security and Medicare taxes primarily for individuals who work for themselves. It is similar to the Social Security and Medicare taxes withheld from the pay of most wage earners." And: "Employers calculate Social Security and Medicare taxes for most wage earners. However, you calculate self-employment tax (SE tax) using Schedule SE".
- Income tax is separate: the 1040-ES (E) worksheet adds self-employment tax (line 9) to income tax as separate lines.

**4. The tax is generally figured on 92.35% of profit.**
- A: "Generally, the amount subject to self-employment tax is 92.35% of your net earnings from self-employment. You calculate net earnings by subtracting ordinary and necessary trade or business expenses from the gross income you derived from your trade or business."
- E (2026): "When estimating your 2026 net earnings from self-employment, be sure to use only 92.35% (0.9235) of your total net profit from self-employment." Worksheet line 3: "Multiply line 2 by 92.35% (0.9235)".

**5. It usually applies only once net earnings are $400 or more.**
- A: "You usually must pay self-employment tax if you had net earnings from self-employment of $400 or more."
- B: "You must pay self-employment tax and file Schedule SE (Form 1040) if either of the following applies. Your net earnings from self-employment (excluding church employee income) were $400 or more."
- F: "You must pay SE tax if you had net earnings of $400 or more as a self-employed person."
- (Film says "usually", matching A. The church-employee rule is not relevant to this audience.)

**6. Half of it is deducted when figuring income tax — it lowers income tax, not the SE tax itself.**
- A: "When figuring your adjusted gross income on Form 1040, Form 1040-SR, or Form 1040-NR, you can deduct one-half of the self-employment tax."
- B: "You can deduct the employer-equivalent portion of your self-employment tax in figuring your adjusted gross income. This deduction only affects your income tax. It does not affect either your net earnings from self-employment or your self-employment tax."
- E (2026) worksheet line 11: "Multiply line 10 by 50% (0.50). This is your expected deduction for self-employment tax on Schedule 1 (Form 1040), line 15."

**7. "Tax year 2026" / "federal".** Self-employment tax is a federal tax figured on Schedule SE (A, B). The 2026 rates above are from D and E.

## Conditions deliberately NOT on screen (and why)
- **Social Security wage base.** E (2026): "For 2026, the maximum amount of earned income (wages and net earnings from self-employment) subject to the social security tax is $184,500." Above that combined amount only the 2.9% Medicare part applies. Not on screen: the audience (booth renters, groomers, one-person trades) is far below it, and in the example (32,400) every dollar is under the cap, so 15.3% is the true rate for the whole example. The "you pay the whole 15.3%" line is true below the cap, which is where this audience lives.
- **Additional Medicare Tax 0.9%.** A: "The threshold amounts are $250,000 for a married individual filing a joint return, $125,000 for a married individual filing a separate return, and $200,000 for all others." Not relevant at this audience's incomes; not on screen.
- **Optional methods** (A: for "a loss or small amount of income") — not on screen.

## Worked example (ILLUSTRATIVE — labelled "example" on screen)

Follows the 2026 Form 1040-ES "Self-Employment Tax and Deduction Worksheet" (E), for someone with no wages.

```
Line 1a/2  profit (Schedule C net profit), example ........ 32,400.00
Line 3     32,400 × 92.35% (0.9235) ....................... 29,921.40
Line 4     29,921.40 × 2.9% (0.029) = 867.7206 ............ 867.72
Line 9     29,921.40 × 12.4% (0.124) = 3,710.2536 ......... 3,710.25   (29,921.40 is under the 184,500 cap)
Line 10    867.72 + 3,710.25 = 4,577.97 ................... about 4,578
           check: 29,921.40 × 15.3% (0.153) = 4,577.9742 .. about 4,578
Line 11    4,577.97 × 50% = 2,288.99 ...................... about 2,289  (deduction; lowers income tax only)
```

On-screen figures from the example: 32,400 · 92.35% · 29,921.40 · 15.3% · about 4,578 · about 2,289.
Rates on screen: 15.3% · 12.4% · 2.9% · 7.65% · $400.

## On-screen labels that contain digits but are not claims
Clock / timestamps in the phone opener (story labels only): 9:41 PM, 9:42 PM, 9:43 PM, "Tue 9:41 PM", "Jan 14". Tax year label: 2026.
Numbers as plain strings for the gate: 9 41 42 43 14 2026.


## Post-build fixes (2026-09-26, blind verifier)
- "That lowers your income tax." + "example: half of 4,578 = about 2,289" read as $2,289 saved. Now "It lowers the income your income tax is figured on." + "example: about 2,289 less taxable income" (IRS SE tax page: the deduction "only affects your income tax. It does not affect either your net earnings from self-employment or your self-employment tax.").
- "two things that help" -> "two things to know".
