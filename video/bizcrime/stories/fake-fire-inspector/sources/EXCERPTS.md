# EXCERPTS — fake-fire-inspector (Pearl's Bagels, Washington D.C., April 2023)

Verbatim only. Every line prefixed `> [n]` is an exact substring of `sources/n.txt`
(machine-checked: `python3 ../check_excerpts.py .` from this dir -> checked=85 missing=0; negative control
`python3 ../check_excerpts.py . neg` mutates one digit and fails as it must).
Source list:

| n | outlet | date | how fetched |
|---|---|---|---|
| 1 | Fox News (national, relays Fox 5 DC) | 2023-04-25 | direct |
| 2 | CBS Pittsburgh / KDKA — a DIFFERENT, 2017 Pittsburgh incident | 2017-04-24 | direct |
| 3 | FOX 5 DC (original TV report, David Kaplan) | 2023-04-23 | direct |
| 4 | WJLA 7News "'Why us?'" (Megan Clarke) | 2023-04-24 | direct |
| 5 | WJLA 7News "DC Police need your help finding a suspect" (Sonia Dasgupta) | 2023-05-03 | direct |
| 6 | NBC4 Washington (Mauricio Casillas) | 2023-04-23 | direct |
| 7 | NBC4 Washington "Man Suspected ... Wanted in New Jersey" | 2023-04-29 | Wayback (live URL now redirects elsewhere) |
| 8 | PoPville — owner's own letter + verbatim MPD release | 2023-04-25 | direct |
| 9 | WUSA9 (Matt Pusatory) — cites MPD incident report + shop's tweets | 2023-04-24 | Wayback (live = 403 BLOCKED) |
| 10 | DC News Now (Dave Leval) | 2023-04-23/24 | Wayback (live = 403 BLOCKED) |
| 11 | FOX 5 DC "Wanted New Jersey man believed to be in DC" | 2023-04-29 | direct |
| 12 | LI Herald — Nassau County arrest of Michael Carrion | 2023-06-08 | direct |
| 13 | Santa Barbara Independent — 2013 arrest warrant, Michael Angelo Carrion | 2013-11-08 | direct |
| 14 | Patch (Wayne NJ) — 2018 arrest, Michael Carrion | 2018-02-02 | direct |
| 15 | WFSB (Milford CT) — names Michael Carrion, wanted in DC | 2023-05-04 | direct |
| 16 | PhillyVoice — Westfield NJ warning, "Metro Fire Prevention" | 2019-06-27 | direct |

Blocked, not absent: dailyvoice.com "Serial NJ Phony Fire Inspector Has Yet To Learn His Lesson,
Police In DC Say" (403, no Wayback copy); cbsnews.com/philadelphia Westfield piece (406). Not used.
Official MPD press release not fetched from mpdc.dc.gov itself; its text is reproduced verbatim in [8]
and paraphrased in [5], [7], [11].

---

## WHO

> [3] "Oliver Cox, the owner of Pearl’s Bagels, told FOX 5 the scammer knew what he was doing."

> [4] "Pearl's Bagels co-owner Oliver Cox told 7News he also believes this scammer has performed the same crime numerous times before — across multiple states."

> [10] "said co-owner Oliver Cox."

> [4] "Cox said the man approached store manager Sophie Temple and asked to check one of the shop's fire prevention systems, called the "ANSUL" system"

> [3] "It started when a man who introduced himself as Jim Stance walked into Pearl’s on Saturday."

> [4] ""He said his name was Jim Stance, which I'm sure is a made-up name," Cox said of the brief conversation."

> [4] "Cox told 7News that the man then said he was from the third-party company that tags the equipment, "Fireline." A tag with the name Fireline is clearly visible and attached to the ANSUL system. 7News reached out to Fireline, and a representative confirmed the man seen in the video is not a current or former employee."

> [10] "He claimed to work for Fireline, the company that supplies the equipment, according to one of the owners of the shop; however, the man does not work for Fireline. He presented four receipts from a company called Metro Fire Prevention, a company that people at Pearl’s Bagels said doesn’t exist."

### The named suspect (official warrant, via police releases as reported)

> [5] "Michael Carrion, 56, is currently wanted on a New Jersey arrested warrant. He's also wanted on a DC Superior Court warrant for a first-degree fraud case at a popular northwest D.C. bagel shop on April 21."

> [7] "The state has an arrest warrant for Michael Carrion, 56, who is believed to be in D.C, according to a Metropolitan Police Department release."

> [11] "Michael Carrion, 56, is currently wanted on a New Jersey state arrest warrant. He is believed to be in D.C."

> [15] "Authorities identified the suspect as Michael Carrion."

> [15] "Carrion is also wanted by police in Washington, D.C. and New Jersey."

> [4] "The department confirmed to 7News that there is an active arrest warrant for Nicholas Angelo Carrion, born in 1966 and suspected of that crime."
(context: "that crime" = a Pittsburgh incident on Aug. 4, 2022, not Pearl's)

### Same name, earlier / later records (identity link to Pearl's suspect is NOT stated by any source)

> [13] "The man, 47-year-old Michael Angelo Carrion, is currently in custody in New York State on separate charges."

> [13] "Carrion was also served a warrant by authorities in Austin, Texas, in April for impersonating a fire inspector."

> [14] "Michael Carrion, 52, of Bronx, New York, was charged with theft and wrongful impersonation, said Detective Capt. Laurence Martin."

> [12] "A Manhattan man was arrested for scamming multiple Nassau County business owners to net thousands of dollars in a spate of fraudulent fire inspections, police said."

> [12] "Carrion, who was arrested without incident, is being charged with grand larceny, scheme to defraud, criminal impersonation, and petit larceny."

## WHAT (the mechanism)

> [3] "Surveillance video shows the scammer telling the manager at the store that he needed to inspect the ANSUL system, a fire prevention tool required in restaurants."

> [1] ""I’m here for the ANSUL," Stance could be seen and heard on surveillance video telling employees, referring to the fire prevention tool inside restaurants."

> [3] "The scammer told the manager that the owner must have forgotten to tell her that he was coming, specifically using the owner’s name."

> [4] ""He had absolutely all the right jargon," Temple said."

> [4] "Temple said the man asked to speak with her boss by name, and she complied, giving Cox a call."

> [4] "Cox said the ANSUL system was due for service, but in a busy shop checks are common. "It was so specific that I didn’t think anything of it," Cox said."

> [6] "He didn’t think it was anything out of the ordinary, because he had actually put in a call recently to make sure his fire suppression system was up to date."

> [4] "Cox said the man told him he would update the tags on the equipment and return Monday afternoon with new parts, and then got off the phone."

> [4] "Temple did not hear the phone conversation. She said the man handed her multiple invoices and told her she could pay in cash, with her boss's blessing."

> [4] ""'You can pay me in cash out of the register,' I was like, weird, OK," Temple said."

> [8] "He had our manager call us, and when he got off the phone he lied to them and said that we had forgotten to let them know that he was coming, handed them 4 bills, and told them that Oliver said to just pay the bills via cash in the safe."

> [9] "He showed up at a hectic time, claimed he was with the (real) company that we use to service our equipment, had our manager call us to talk, then hung up and told our her we had said to just pay the invoices in cash (a lie)."

> [3] ""She thought I told her it was ok," Cox recalled. "But really, he told her, that’s what I said, so it was a little bit of Jedi Mind Trick on that one, I think. Because she texted me ‘I paid him cash like you said,’ and I said I didn’t say to pay him cash and she said ‘oh no, he said, you said that.'""

> [6] "The impersonator, who was caught on video, walked in wearing a hat and carrying a notepad. He said he was going to check on the fire suppression system in the back, and after he did, he came back with four different invoices totaling $970."

> [10] "“I’ll be back and I’ll be in out in three minutes,” the man can be heard saying on the video as he left. He never returned as his scam also earned him $970."

> [10] "“She (the manager) just looked at the totals. She didn’t look at the specifics,” said co-owner Oliver Cox. “We were too busy, which I honestly think was part of his plan.”"

> [8] "The suspect claimed to be a fire inspector and convinced the employee to give him money from the register. The suspect then fled the scene."

### The invoices / the tell

> [3] "The scammer had fake invoices with a company, Metro Fire Prevention, that purported to have a D.C. address which is non-existent."

> [3] "The big tell there was the address doesn’t have a quadrant listed."

> [4] "After a closer look, Cox realized the address on the invoices for "1231 State St." in D.C. did not exist."

> [10] "The receipts claim Metro Fire Prevention is located on State Street in D.C. There’s no such street with that name."

> [4] "Temple quickly paid up, and after telling her boss the store needed more $20 bills, Cox said he realized something was wrong."

> [8] "We realized it was a scam when they told us they’d paid him cash, and when we looked at the bill we realized it’s a phony company with a fake address."

## WHEN

> [8] "seek the public’s assistance in identifying a suspect in a First-Degree Fraud offense that occurred on Saturday, April 22, 2023, in the 1000 block of 7th Street, Northwest."

> [8] "At approximately 10:37 am, a suspect approached an employee of an establishment at the listed location."

> [4] ""Around 10:35 he walked in, and he was gone with $970 at 10:43 a.m.," Cox said."

> [9] "help us identify this man who scammed us out of $970 at 10:40am today (the busiest possible time at Pearl’s)."

> [5] "He's also wanted on a DC Superior Court warrant for a first-degree fraud case at a popular northwest D.C. bagel shop on April 21."
(CONFLICT with [8]'s MPD text "Saturday, April 22, 2023" — see BRIEF.md)

> [5] "Pearl's Bagels in the 100 block of 7th Street NW"
(CONFLICT with [8] MPD "1000 block of 7th Street, Northwest" and PoPville's "1017 7th Street, NW")

## HOW MUCH

> [9] "The man was able to get away with $970, according to the police report."

> [3] "The manager gave the man $970 in cash."

> [8] "The bills totaled $947 dollars."
(CONFLICT: owner's own letter to PoPville says $947; every other source, incl. the shop's own tweet in [9] and the MPD incident report per [9], says $970)

> [4] "Cox said $970 is more than a weekend's day in total take-home profits after paying employees and high food costs."

> [4] "the owner of a popular Northwest D.C. bagel shop said he was scammed out of a day’s worth of profits"

## OUTCOME

> [9] "Police are looking to charge the man with first-degree fraud, but so far, no arrests have been made in this incident."

> [4] "Metropolitan Police Department is offering a $1,000 reward for any information leading to an arrest or indictment in this crime, which is being investigated as first-degree fraud."

> [5] "Crime Solvers of Washington, DC currently offers a reward of up to $1,000 to anyone who provides information that leads to the arrest and indictment of the person or persons responsible for a crime committed in the District of Columbia."

> [12] "He is set to be arraigned on Jun 14 at First District Court in Hempstead."
(Nassau County case, not Pearl's. No source found reports an arrest, charge disposition, or conviction FOR the Pearl's incident.)

> [9] ""We remind the community our inspectors will always be in full uniform, carry city ID, and will never ask for payment or cash," DC Fire and EMS said in a tweet."

> [9] "While this did not involve our department"

> [6] "“It hurts to give that much money away and hand it to a con artist,” he said. “We’re not going to have to close up shop because of it but it definitely–it seems like this guy has done it a lot. And I just really hope people are more cautious than we were.”"

> [9] ""Obviously it's a little embarrassing for us that this happened to us and we got fooled, but basically we just wanted to get out there and say, 'Don't be like us. Don't be fooled, and be aware that this could happen to you too,'" Cox said."

## THE PATTERN

> [3] "There are at least six other incidents up and down the East Coast where this exact same situation played out. Based on news reports, it's happened in Pittsburgh, across New Jersey, New York City, and in the suburbs of Connecticut."

> [3] "It has not been determined whether the same guy is behind each of the thefts."

> [1] "It is unclear if the same man is behind all of the scams."

> [4] "Cox also Googled the company listed on the invoice, “Metro Fire Prevention," and to his dismay, found multiple similar incidents online."

> [10] "A Google search of “Metro Fire Prevention” found similar cases reported in Connecticut, Michigan, New Jersey, New York, Ohio, and Pennsylvania that date back to 2017."

> [3] "After FOX 5's story aired Sunday, Oliver Hazen, the owner of Bagel Boss in New York City reached out and said this exact same thing happened to his store early last month. He's convinced it’s the same guy based on the fake invoices, the hat, and the scheme."

> [4] "Cox also received an almost identical invoice from a Manhattan bagel shop, "Bagel Boss Nolita." The invoice has the exact same fake address but is instead listed out of New York."

> [4] ""He sticks to a script, he knows it works, he’s effective," Cox said."

> [2] "Authorities say last Wednesday, a man hit up the Bruegger's Bagels in Market Square, then the Subway on Liberty Avenue. He claimed to be testing fire extinguishers for "Metro Fire Prevention.""

> [2] ""Walked around a little bit, came back with an invoice and requested $400 in cash,"  Chief Darryl Jones said."

> [2] ""I'm thinking that if they're under contract with you, they will probably bill you. I doubt very seriously they would ask for cash.""

> [16] "claims to be a fire protection inspector representing a fictitious company called "Metro Fire Prevention," police in Westfield, Union County, said."

> [15] "Pretending to be an inspector with the Milford Fire Department, the scammer talked with owner Hallaj Hasan on the phone and gave the employees two invoices, totaling nearly $400."

> [15] "“He does everything in a minute or two and before you know it, before you have time to think, he’s already gone with a couple hundred dollars.”"

> [13] "A clerk at the restaurant phoned the manager, who spoke with Carrion and then authorized the payment out of the restaurant’s register."

> [14] "Carrion would, allegedly, in each case state that he was there from "City Fire Inspection" to conduct a fire inspection and provided people with a hand-written receipt, Martin said."

## VIVID CONCRETE DETAILS

> [1] ""I’m here for the ANSUL," Stance could be seen and heard on surveillance video telling employees"

> [4] "Cox shared surveillance video with 7News showing the suspect wearing a black baseball hat and plain shirt entering the store last Saturday morning around, at around 10:30, surrounded by a crowd of customers."

> [6] "walked in wearing a hat and carrying a notepad"

> [4] "A tag with the name Fireline is clearly visible and attached to the ANSUL system."

> [4] "after telling her boss the store needed more $20 bills"

> [3] "Because she texted me ‘I paid him cash like you said,’ and I said I didn’t say to pay him cash and she said ‘oh no, he said, you said that.'"

> [10] "“I’ll be back and I’ll be in out in three minutes,” the man can be heard saying on the video as he left."

> [4] ""To have some guy come in and take that [cash] right from our hands as we handed it to him, felt particularly violating," Cox said."
