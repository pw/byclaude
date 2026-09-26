# tax-quarterly — sources

Every rule, date and threshold in the film, traced to IRS.gov. Fetched 2026-09-26 (curl + pdftotext, quotes copied verbatim).
Tax year: **2026 income** (federal).

## Documents

| Short name | URL | Version / revision |
|---|---|---|
| 1040-ES | https://www.irs.gov/pub/irs-pdf/f1040es.pdf | "Form 1040-ES (2026)", Catalog Number 11340T |
| Est. taxes page | https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes | "Page Last Reviewed or Updated: 25-Sep-2026" |
| Penalty page | https://www.irs.gov/payments/underpayment-of-estimated-tax-by-individuals-penalty | "Page Last Reviewed or Updated: 20-Aug-2026" |
| Pub 505 | https://www.irs.gov/pub/irs-pdf/p505.pdf | Publication 505, "For use in 2026" |
| Payments | https://www.irs.gov/payments | IRS Direct Pay — "Pay your balance due, estimated tax, amended return, extension and more." |

## Claims

**1. At a job, tax comes out of your pay; self-employment income has no withholding, so you pay as you go.**
- Est. taxes page: "Taxes must be paid as you earn or receive income during the year, either through withholding or estimated tax payments. ... If you are in business for yourself, you generally need to make estimated tax payments. Estimated tax is used to pay not only income tax, but other taxes such as self-employment tax"
- 1040-ES (2026): "Estimated tax is the method used to pay tax on income that isn't subject to withholding (for example, earnings from self-employment, including gig economy work, ...)"
- Penalty page: "Taxes are pay-as-you-go. This means that you need to pay most of your tax during the year, as you receive income, rather than paying at the end of the year."

**2. Generally required if you expect to owe $1,000 or more when you file.** (on screen: `$1,000 or more`)
- Est. taxes page: "Individuals, including sole proprietors, partners, and S corporation shareholders, generally have to make estimated tax payments if they expect to owe tax of $1,000 or more when their return is filed."
- 1040-ES (2026), General Rule: "In most cases, you must pay estimated tax for 2026 if both of the following apply. 1. You expect to owe at least $1,000 in tax for 2026, after subtracting your withholding and refundable credits. 2. You expect your withholding and refundable credits to be less than the smaller of: a. 90% of the tax to be shown on your 2026 tax return, or b. 100% of the tax shown on your 2025 tax return."
- Condition kept in the film as "generally" (the second test and the first-year exception belong to the `tax-how-much` film).

**3. Four due dates for 2026 income: April 15, 2026 · June 15, 2026 · Sept. 15, 2026 · Jan. 15, 2027.**
- 1040-ES (2026), Payment Due Dates: "1st payment . . . April 15, 2026 / 2nd payment . . . June 15, 2026 / 3rd payment . . . Sept. 15, 2026 / 4th payment . . . Jan. 15, 2027*"
- Footnote (not shown on screen, kept here): "* You don't have to make the payment due January 15, 2027, if you file your 2026 tax return by February 1, 2027, and pay the entire balance due with your return."
- Est. taxes page: "For estimated tax purposes, the year is divided into four payment periods. Each period has a specific payment due date."
- Weekend/holiday rule, checked: Est. taxes page: "If the due date for an estimated tax payment falls on a Saturday, Sunday, or legal holiday, the payment will be on time if you make it on the next day that isn't a Saturday, Sunday or holiday." Computed weekdays: April 15, 2026 = Wednesday · June 15, 2026 = Monday · September 15, 2026 = Tuesday · January 15, 2027 = Friday. None shift.
- "Next" = January 15, 2027: the film's scene is Saturday, September 26, 2026 (today), after the Sept. 15 date.

**4. The periods are not even quarters** (on screen under each date: `Jan – Mar`, `Apr – May`, `Jun – Aug`, `Sep – Dec`).
- Penalty page: "Estimated tax payments are generally due as follows: April 15 for income earned January 1 to March 31 / June 15 for income earned April 1 to May 31 / September 15 for income earned June 1 to August 31 / January 15 of the following year for income earned September 1 to December 31"
- Pub 505 (2026) table: "June 1–Aug. 31 | Sept. 15 | ... After Aug. 31 | Jan. 15 next year"

**5. Miss one, or pay too little → you may owe a penalty, figured like interest (how much was short, for how many days).**
- 1040-ES (2026): "If your payments are late or you didn't pay enough, you may be charged a penalty for underpaying your tax." and "The penalty is imposed on each underpayment for the number of days it remains unpaid. A penalty may be applied if you didn't pay enough estimated tax for the year or you didn't make the payments on time or in the required amount. The penalty may be waived under certain conditions."
- Penalty page: "We calculate the penalty based on: The amount of the underpayment / The period when the underpayment was due and underpaid / The published quarterly interest rates for underpayments"
- Est. taxes page: "you may be charged a penalty even if you are due a refund when you file your income tax return."

**6. How: Form 1040-ES; pay at IRS.gov/payments.**
- Est. taxes page: "You may send estimated tax payments with Form 1040-ES by mail, or you can pay online ... Visit IRS.gov/payments to view all the options."
- 1040-ES (2026): "IRS Direct Pay. For online transfers directly from your checking or savings account at no cost to you, go to IRS.gov/Payments."

**7. Takeaway support — paying more often than four times is allowed.**
- Est. taxes page: "If it's easier to pay your estimated taxes weekly, bi-weekly, monthly, etc. you can, as long as you've paid enough in by the end of the quarter."
- The takeaway ("Set some aside every week. Send it four times a year.") is a habit, not a rule; no amount is stated.

**8. State taxes.** On screen: "These are federal. Your state may have its own." Not an IRS claim (no number); it is the slate's honesty rule. No state figure is stated.

## Worked example
None. This film has no example figures — every number on screen is a rule number or date quoted above. (A weekly set-aside example was considered and dropped: the payment periods are uneven — 3, 2, 3 and 4 months — so an even weekly amount would come up short of equal instalments at June 15 and Sept. 15, and the film would imply otherwise.)

## Scene props (not tax facts)
Phone clock / timestamps shown in the opener: `10:12 PM`, `10:13 PM`, `Sat 10:12 PM` (Saturday, September 26, 2026).
Form name digits: `1040` (Form 1040-ES). Year digits `2026`, `2027` as above.


## Post-build fixes (2026-09-26, blind verifier — CLEAN, wording taken anyway)
- "× the IRS quarterly rate" -> "× the IRS interest rate" (annual rate, set each quarter, charged by the day).
- Takeaway now framed "One common habit:" + "Pay by each due date." (not everyone must pay estimates: under $1,000, and the Jan payment is optional if you file by Feb 1 2027 and pay in full — Form 1040-ES 2026).
- Added "That covers income tax and self-employment tax." (Estimated Taxes page: estimated payments cover "income tax, self-employment tax, and alternative minimum tax").

## Round 2 (verifier FIX)
- ON_SCREEN reordered into screen order (the "habit" finding was an array-order artifact of my own append; on screen the label precedes the habit).
- Added "Missed one? / The days stop counting once you pay." (IRS underpayment page: penalty based on the amount, "the period when the underpayment was due and underpaid", and the rate). Pen scene +2.0 s.
