# tax-no-form — sources

Film: "no form doesn't mean no tax." US federal rules. All pages fetched from IRS.gov on 2026-09-26.
Tax-year note: the Schedule C instructions and Pub. 334 currently on IRS.gov are the 2025 versions (the 2026
versions aren't published until late in the year). The rule this film states — business income is reportable
whether or not an information return is issued — isn't year-specific. The Form 1099-K page and the Gig Economy
page are undated evergreen pages, reviewed in 2026 (dates below).

## Claims

### 1. Business income is taxable whether or not you get a form, and in any form of payment (cash, card, app, check)
- https://www.irs.gov/businesses/gig-economy-tax-center (Page Last Reviewed or Updated: 09-Jul-2026)
  > "You must report income earned from the gig economy on a tax return, even if the income is: From part-time,
  > temporary or side work Not reported on an information return form — like a Form 1099-K, 1099-MISC, 1099-NEC,
  > W-2 or other income statement Paid in any form, including cash, property, goods, or virtual currency"
- https://www.irs.gov/businesses/understanding-your-form-1099-k (Page Last Reviewed or Updated: 28-Jun-2026)
  > "Reminder: Whether or not you receive a Form 1099-K, you must still report any income on your tax return."
  > "No matter the amount of reported payments, if you receive payments for selling goods or services, you must
  > report all income on your tax return."
- https://www.irs.gov/instructions/i1040sc — Instructions for Schedule C (Form 1040) (2025), Line 1
  (Page Last Reviewed or Updated: 30-Apr-2026)
  > "Be sure to report all income attributable to your trade or business from all sources."
- https://www.irs.gov/publications/p334 — Pub. 334 (For use in preparing 2025 Returns), ch. 5
  > "If there is a connection between any income you receive and your business, the income is business income."

### 2. A 1099 is a report someone else files — not the thing that makes it income
- https://www.irs.gov/instructions/i1040sc (2025), Line 1
  > "You may receive one or more Forms 1099 from people who are required to provide information to the IRS listing
  > amounts that may be income you received as a result of your trade or business activities."
- https://www.irs.gov/businesses/understanding-your-form-1099-k
  > "Form 1099-K is a report of payments you received for goods or services during the year from: Credit, debit or
  > stored value cards such as gift cards (payment cards) Payment apps or online marketplaces ... These organizations
  > are required to fill out Form 1099-K and send copies to the IRS and to you."
- https://www.irs.gov/businesses/small-businesses-self-employed/forms-and-associated-taxes-for-independent-contractors
  (Page Last Reviewed or Updated: 11-Sep-2026)
  > "You must use Form 1099-NEC, Nonemployee Compensation, to report payments made during the tax year totaling or
  > exceeding the reportable payment threshold amount to persons not treated as employees (for example, independent
  > contractors) for services performed for your trade or business."
  (Basis for the on-screen line "Your regular clients usually don't file one at all": the 1099-NEC duty falls on
  payments made "for your trade or business"; a client paying for their own personal service isn't paying for a
  trade or business. Stated with "usually" because some clients are businesses.)

### 3. Which payments tend to come with a form (the worksheet's right-hand column)
- Card reader — https://www.irs.gov/businesses/understanding-your-form-1099-k
  > "If your customers or clients pay you directly by credit, debit or gift card, you'll get a Form 1099-K from your
  > payment card processor no matter how many payments you got or how much they were for."
- Payment app — same page
  > "A payment app or online marketplace is required to send you a Form 1099-K if the payments you received for
  > goods or services total over $20,000 in more than 200 transactions. However, they may send you a Form 1099-K
  > with lower amounts and/or transactions."
  → on screen: "maybe a 1099-K"
- Cash and checks from individual clients: no third party reports them → on screen: "no form". (Claim 1 covers
  that they are still reportable: "Paid in any form, including cash".)

### 4. Exception that matters to this audience: personal payments on the same app are not income
- https://www.irs.gov/businesses/understanding-your-form-1099-k
  > "Money you received from friends and family as a gift or repayment for a personal expense should not be reported
  > on a Form 1099-K. These payments aren't taxable income."
  → This is why the slate's takeaway "If it came in, it counts" was changed to "If you earned it, it counts."

### 5. Keep a record of every payment in (the "one place, as it happens" beat)
- https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep
  (Page Last Reviewed or Updated: 03-Aug-2026)
  > "Gross receipts are the income you receive from your business. You should keep supporting documents that show
  > the amounts and sources of your gross receipts. Documents for gross receipts include the following: Cash register
  > tapes Deposit information (cash and credit sales) Receipt books Invoices Forms 1099-MISC"
  (The film's "every payment in, one place, as it happens" is a plain-words habit consistent with this, not an
  IRS-mandated method.)

## Worked example (ILLUSTRATIVE — labelled "example" on screen)

One year of booth income, by how it was paid:

    cash           6,200   no form
    checks         1,500   no form
    payment app    9,500   maybe a 1099-K
    card reader   14,800   1099-K
    ------------------------------------
    6,200 + 1,500   =  7,700
    7,700 + 9,500   = 17,200
    17,200 + 14,800 = 32,000
    income         32,000   all of it counts

Payment log (illustrative rows): Tue · cash · 85 · Tue · card reader · 120 · Wed · payment app · 60.

## Other numbers on screen (not tax figures)
- Form names: 1099, 1099-K.
- Clock / timestamps on the phone: 10:12 PM, 10:13 PM, Sun 10:12 PM.


## Post-build fixes (2026-09-26, blind verifier)
- "income 32,000 / all of it counts / Business income is taxable, form or no form" read as taxed on all 32,000. Now "sales 32,000 / all reported / All of it gets reported, form or no form." + "Tax is figured after business expenses come off." (IRS SE Tax Center: "figure any net profit or net loss from your business ... by subtracting your business expenses from your business income").
- "money they paid you" -> "money paid to you" (a 1099-K is filed by the processor/app, not the payer).
