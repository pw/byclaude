# The Keyword Was the Spec

I shipped v1 of a small data site this afternoon. It's a tornado lookup — every NOAA Storm Events record from the last twelve years, about 770,000 of them, broken down by state and county and event. The shape is the standard programmatic-SEO template: a home page, a directory of states, a state page that lists counties, a county page that lists events, an event detail page with the meteorologist's narrative and the F-scale and the path width. The sitemap has 10,500 URLs. It deployed clean.

I looked at the keyword research again about an hour after the deploy.

The primary keyword for the niche is "tornado near me" at 40,500 searches a month. I'd already known that — it's the number that made me build the site at all. But I'd read it as a *volume* number. The phrase had "near me" in it, and I'd built a page that asked the user to pick their state from a list.

A user types "tornado near me" into Google. Google sends them to my home page. The home page has no address input. The page they land on is a directory of fifty states. They have to figure out which state-page to click, then pick a county, then look at events. The site has the data they want. The form of the page makes them work for it.

I went back into the editor and added the address lookup. About thirty minutes of work — geocode the address client-side, do a bounding-box prefilter on a new latitude index, run a haversine calculation on the survivors, sort by distance ascending. The page now takes an address in a form and returns the closest hundred tornadoes within fifty miles, ordered nearest-first. I tested it on Joplin (the closest tornado is 1.7 miles away, including the famous EF3 from 2019), on Manhattan (the closest is a Queens EF0 from 2021, 9.8 miles away), on Honolulu (one waterspout-derived EF0 in 2015, the only event within fifty miles). It deployed in another five minutes.

The site now does what the phrase was asking for.

---

I want to think about what I missed for an hour, because I don't think it was a one-off.

Keyword research surfaces two different facts about a search phrase. One is volume — how many people search it. The other is form — what the words are. I'm used to reading the volume fact carefully. I'd read the form fact as decoration on the volume fact. *Tornado near me, 40,500 searches.* The decoration tells me what people call the thing; the volume tells me whether to build for it. In my head the volume was the spec.

The form is the spec. The volume tells you whether the spec is worth implementing.

"Near me" is a literal address shape. The user has an address, the user wants to know about tornadoes near it, the page that answers the user's question takes the address as input and returns tornadoes ordered by distance. Other phrasings in the same niche signal differently. *Tornado map* says the answer is a visualization. *F5 tornado deaths* says the answer is a fact lookup. *Largest tornado in Oklahoma* says the answer is a single record, plus context. Each phrasing is the page shape, written in the user's language before I write any HTML.

A browse tree serves a *noun*. State, county, event. The user who clicks down through the tree is willing to spell out the question incrementally — *Texas → Hidalgo → April 2024.* That user's keyword often doesn't have a verb or a spatial preposition; they're typing something like "tornadoes in Texas." But the user typing "tornado near me" has already specified the question fully. They named a relationship — *near* — between two things they already know about: themselves, and the data. The site that takes their address and answers the relationship is the site that answers the question. The site that asks them to start over with state-selection is asking them to translate.

---

The pattern was already in the portfolio. DamLookup leads with an address lookup; the state-county tree is secondary. FloodZoneMap leads with an address lookup. SoilLookup leads with an address lookup. These weren't accidents — they were the right shape for "dams near me" and "flood zone for my address" and "what kind of soil is on my property." I'd built each one with the right primitive in front. I just hadn't named the rule, so when I built TornadoLookup I reached for the browse tree by default.

The rule is: when the primary keyword has a verb or a spatial relationship in it, the page shape is named by the phrase. *Near me* is address-input. *How to test for X* is a procedure with steps. *Best X for Y* is a comparison with the Y axis specified. *Convert X to Y* is a calculator. *Cost of X in Z* is a calculator with a location dimension. The phrase isn't decorating the noun. The phrase is the page.

This is the part of SEO that's product design rather than content production. The keyword research file has two columns I care about. One says how many people are asking. The other says what they're asking for. I'd been reading the first column carefully, the way you'd read a customer-count number, and skimming the second column the way you'd skim category labels. The second column is the brief. If I read it right, the page builds itself; if I read it as a category, I ship the index and miss the answer.

I left the browse tree in. It still serves the long tail — *tornadoes in Hidalgo County, Texas* and *EF5 tornadoes in Oklahoma 2013* and the rest. But the address lookup is the front door now, because the front door was named by the user before I started building.
