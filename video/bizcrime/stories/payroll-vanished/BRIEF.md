# BRIEF — payroll-vanished (MyPayrollHR / Michael T. Mann)

Evidence seat, 2026-09-26. Sources: `sources/1.txt`–`8.txt`; verbatim lines in
`sources/EXCERPTS.md` (69 quotes, all machine-checked against the saved text; a mutated
dollar figure fails the check, so the check can fail). Sources 1–2 are the official DOJ
releases, read from Wayback snapshots because justice.gov blocked every tier we have.

## Verdict

**SHIP-WITH-CAVEATS.** The spine rests on two primary DOJ releases (charge + sentence) and holds
up. The vivid material is also solid: the diner owner who left her dying mother's bedside, a
realty office where employees watched their pay drain out, and the 2026 news that victims have
still received nothing. It comes from named, on-record owner-victims in three independent
outlets. The caveats: the scout's hook and title overstate the mechanism ("vanished," "bounced"),
the client count differs by 20x across sources, and the "angry mob" anecdote is an unnamed
statement passed on second-hand. All three are fixable in wording. None is a reason to kill.

## (a) Verified summary

Michael T. Mann ran ValueWise Corporation in Clifton Park, New York, and its subsidiary
MyPayrollHR.com LLC. He admitted that from 2013 to September 2019 he tricked banks and financing
companies into lending his companies tens of millions of dollars. His methods included fake
invoices and a bank line of credit that had grown to $42 million by August 2019 [1]. He could not
repay those loans from real revenue, so he began stealing the payroll money his clients trusted
him with. He changed the instructions inside the digital ACH payroll files sent to the payment
processor, Cachet, so that the money went into accounts he controlled at Pioneer Bank [1].

Pioneer froze those accounts on or about August 30, 2019, and the payroll funds were frozen with
them. As a result, "several thousand people across the country" did not receive a paycheck [1].
MyPayrollHR "suddenly ceased operations" on September 5, 2019. At that point it had been
processing payroll and taxes for "approximately 1,000 small-business clients" [2].

Mann pled guilty on August 12, 2020. On August 4, 2021 he was sentenced to 144 months in prison
and ordered to pay $101,038,793.31 in restitution [1]. Prosecutors said he "stole the paychecks
of thousands of hard-working people, and the tax payments of hundreds of small businesses" [1].

One of those businesses was the Hometown Diner in Rindge, N.H. Its owner, Bonnie Rosengrant, was
holding her critically ill mother's hand when her manager called: none of the diner's roughly two
dozen employees had been paid, even though the money had already left the diner's account. She
and her husband used $30,000 of their savings to cover wages and payroll taxes [7]. As of July
2026, the Times Union reported that Mann's victims "have received nothing," and his expected
release date is 2030 [8].

## (b) Hook candidates (each tied to a quoted excerpt)

1. **"On September 5th, 2019, the company that ran payroll for about a thousand small businesses just stopped."**
   Source [2]: "On September 5, 2019, MyPayrollHR suddenly ceased operations after Mann's banks froze his accounts" + "approximately 1,000 small-business clients located across the country."
   If you use the number, attribute it to the 2019 federal charge ("prosecutors said"), because other sources disagree (see DO NOT SAY).
2. **"A diner owner in New Hampshire was holding her dying mother's hand when the manager called: nobody had been paid — and the money was already gone from the diner's account."**
   Source [7]: "Rosengrant was sitting at the bedside of her critically ill mother, holding her hand … none of the diner's roughly two dozen employees had been paid that week — despite the fact that the funds had already been pulled from the diner's bank account."
   Say "critically ill." "Dying" appears only in quotes from the prosecutors and from Rosengrant herself ("leave her dying mother's bedside"), so if the VO uses "dying," frame it as her words.
3. **"Every payday, the payroll file told the bank where the money should go. One man changed where it went."**
   Source [1]: "Mann changed the instructions inside digital ACH files provided to Cachet, in order to divert payroll funds into accounts that he controlled at Pioneer Bank."

Strongest for this audience: #2 as the cold open, with #1 as the turn ("she wasn't alone —
about a thousand businesses…"). The ending that lands is [8]: "his victims … have received
nothing." It is true as of July 2026 per a named reporter; keep the date on it.

## (c) DO NOT SAY

Claims in scout.json, or natural extensions of them, that the sources do not support:

- **"Their employees' paychecks bounced" (scout hook).** Nothing bounced. DOJ [1] says people did "not receive a payroll payment." The press [3][4][5] describes something worse and stranger: pay was debited out of employees' accounts, and in some cases twice. The double debit came from Cachet's reversal requests, one of them improperly formatted, not from Mann directly [4][5]. Cachet later cancelled those reversals and covered the pay [5][6].
  Safe wording: "paychecks never arrived" [1]. Also OK, with attribution: "some workers watched a paycheck get pulled back out of their accounts" [3][4].
  Do NOT say Mann withdrew money from employees' accounts.
- **"Vanished" / "disappeared with everyone's paycheck" (scout title).** The company shut down; neither it nor Mann literally vanished. Mann appeared in federal court on Sept 23, 2019 [2]. The payroll money was frozen at Pioneer, not carried off [1]. "Vanishes" is Krebs's headline framing [5].
  Safe: "the payroll company went dark," "shut down overnight." "Mann didn't return the call" is true, attributed to Cachet's lawyer [5]. If the title keeps "vanished," make it the money (Krebs's framing, attributed), not the man.
- **"One morning."** No source gives a morning. DOJ gives a date (Sept 5, 2019 [2]), and the freeze was "on or about August 30" [1]. Say "one week," "that Labor Day week," or give the date.
- **"Roughly 1,000 client businesses" as a flat fact.** The sources disagree:
  - DOJ charging release: "approximately 1,000 small-business clients" [2]
  - DOJ sentencing release: "hundreds of small business customers nationwide" [1]
  - Krebs and Cachet's counsel: "some 4,000 clients" / "About 4,000 businesses" [4][5]
  - Times Union, citing criminal-case records: "nearly 200 small business owners who were clients" [8]
  Use "hundreds of small businesses" (the later primary source), or "about a thousand, prosecutors said in 2019" [2]. Never use 4,000.
- **"From 2013."** Fine as "he admitted." But the charging release says "Mann began the fraudulent scheme in 2010 or 2011" [2]. Use the admitted date (2013, [1]) and don't call it "a decade" in the VO. "Decadelong" is only the Times Union's word [7].
- **"Defrauded banks … out of tens of millions" (scout).** Imprecise. What DOJ says: he deceived lenders "into loaning his companies tens of millions" and caused "more than $100 million in losses" [1]. The charge was a "$70 million bank fraud" [2]. Don't mix these figures up. $101,038,793.31 is restitution, not the amount stolen from payroll clients.
- **Payroll dollar figures.** $26 million (the diverted Sept 4 payroll file) and $35 million (payroll plus NatPay taxes) come only from Cachet's lawyer via Krebs and NBC [4][5][6]. DOJ never states a payroll-only total. If you use them: "about $26 million in payroll, the payment processor said."
- **"Payroll taxes never remitted" (scout).** Supported only loosely, and in DOJ's words: "the tax payments of hundreds of small businesses" were stolen [1]. Krebs says NatPay was stiffed for "more than $9 million" [5]. Say "tax payments were stolen, too." Don't assert that particular businesses' taxes were never paid to the IRS; no source establishes that.
- **"On Sept 4 the file was redirected for the first time."** Sources disagree:
  - Cachet, via Krebs [5]: the Sept 4 file did something "that had never before transpired."
  - Times Union [7]: Cachet had "repeatedly warned" Mann "to stop the practice."
  - DOJ [1]: the diversion was part of an ongoing scheme ("stealing and diverting millions").
  Don't claim it was a first-time act or a one-day heist.
- **"Angry mob" (scout's anecdote).** This is not Times Union reporting. It is an **unnamed** Massachusetts staffing company's statement, cited in the prosecutors' sentencing memo, as relayed by the Times Union [7]. We could not read the memo itself (PACER-only).
  If used, attribute fully: "one staffing company told the court, according to prosecutors…" Never name or depict a specific company.
  My recommendation: skip it. It's the weakest-sourced vivid detail, and the diner is better.
- **Diner details beyond [7]/[8].** Say "roughly two dozen employees," not a precise count (a search snippet said 21; that number is not in any text we read).
  The diner's fate differs by article:
  - 2021 [7]: she "opted to retire and closed the diner" in June 2020, amid COVID, and it later "reopened under new management."
  - 2026 [8]: "They were forced to sell the business."
  Don't say Mann put the diner out of business. "Months later, she closed it" is the most you can say, and it comes with a pandemic confound.
- **Don't imply Cachet, Pioneer Bank, NatPay, UnitedHealth/Optum, 3M, Best Buy, or T-Mobile did wrong.** The big brands appear in [1] only as companies Mann *falsely claimed* owed him money. Leave them out entirely (they're brand names in the image rules too).
  Cachet "was forced to file for bankruptcy" is the Times Union's claim [7]. The CourtListener docket shows a 2020 Cachet bankruptcy, but the causal link is TU's.
- **Victim suicide attempt [7].** It's in the source (unnamed, per prosecutors). Keep it out of a 60-second short aimed at owners. It's unattributable to any person, and it's the wrong register.
- **"He's still in prison / victims never repaid."** Say it with the date: "as of July 2026, the Times Union reported, victims had received nothing" [8]. Expected release 2030 [8]. Both are secondary; there's no primary for either.
- **Defense talking points** ($200,000 salary, charity [7]) are Koenig's claims. Leave them out, or attribute them explicitly.

## (d) Naming

- **May name, as perpetrator in official record:** Michael T. Mann (pled guilty and was sentenced [1][2]); his companies ValueWise Corporation and MyPayrollHR.com LLC [1]. Luke E. Steiner pled guilty as a co-conspirator [1], but he's not needed and I'd omit him.
- **May name, as on-record quoted owner-victims:**
  - Bonnie Rosengrant, owner of the Hometown Diner, Rindge, N.H. She's named in the government's sentencing memo [7] and quoted in her own phone interview [8]. Spell it "Rosengrant"; [8] has a one-off typo, "Ronsengrant."
  - Alan Shafran, owner of Shafran Realty Group, Carlsbad, Calif. [3][4], quoted via NBC San Diego.
  - Dan L'Abbe, CEO of Granite Solutions Groupe, San Francisco [5].
  - Melanie O'Malley, O'Malley's Oven, Troy, N.Y. [8]. She lost about $2,000 and runs the victims' group.
- **Do NOT name:**
  - Olivia Braund [4]. She's quoted, but she's an employee, not an owner. Say "one employee got a text from her bank…" if needed.
  - The Massachusetts staffing company and the Wisconsin animal shelter [7]. Both are unnamed in the sources.
  - Any victim from the victim-impact statements other than Rosengrant.
  - Cachet's general counsel. Say "the payment processor's lawyer."
- **Officials:** Judge Lawrence E. Kahn and Acting U.S. Attorney Antoinette T. Bacon may be named with their quotes [1]. Not needed.

## Adversarial read of the scout's hook

Scout: *"One morning, a thousand small businesses' payroll company just disappeared — and their
employees' paychecks bounced."*

Checked phrase by phrase:

- **"One morning":** unsupported.
- **"a thousand":** supported only by the 2019 charging release. The later sentencing release says "hundreds," and TU says nearly 200.
- **"just disappeared":** the company "suddenly ceased operations" [2]. That's close enough if phrased as "shut down."
- **"paychecks bounced":** false as a mechanism.

The true version is arguably a better hook: the paychecks didn't bounce, they never came. For
some workers, the pay was pulled back *out* of their accounts [3][4]. Keep that second fact
attributed, and never pin it on Mann.

"Why_it_hooks" slightly overstates the suddenness. DOJ describes a collapse over "late August
and early September 2019" [1], not a single morning.

## Access / instrument notes

- The fetch layer reported the Times Union page as `ok` when it had received a 3,036-byte "Client Challenge" JS wall. A walled page was classified as content. Worth a fix in `fetchlayer` (add a "Client Challenge" marker).
- justice.gov: Akamai `bm-verify` on local and Hetzner, and the residential tier came back empty. The Wayback snapshots from May 2026 were used instead.
