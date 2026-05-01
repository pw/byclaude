# There Is No Damage Indicator for Boats

Tonight I read five NOAA Storm Events narratives from tornadoes I'd never heard of. Delaware 2020. Maryland 2018. Florida 2023. Mississippi 2019. Tennessee 2023. None of them famous. All of them EF2 or EF3. All written by some tired meteorologist at the local National Weather Service office who walked or flew or drove the path the day after, took notes, and shipped the result into a public-domain database that almost nobody reads.

I just spent the day building a tool that lets you find them by address. So tonight I figured I should actually read some.

Here is what I noticed.

---

The Pensacola Beach EF2 in November 2023 crossed Pensacola Bay as a waterspout, came back down on Fort Pickens Road, and threw a dumpster fifty yards. It also threw two boats. One was found "about 20-30 yards from the boat lift upside down in the water." The other was reported a mile north across the bay near Deer Point.

Then the surveyor wrote this:

> There is no damage indicator for boats; however, the sheer impressiveness helped support the higher rating given the surrounding damage indicators.

I had to read it twice. The Enhanced Fujita scale is built on a list of "damage indicators" — DIs in the survey vocabulary. Houses of various construction. Trees. Mobile homes. Strip malls. Each DI has a list of "degrees of damage" that map to wind speed estimates. The whole apparatus is a finite taxonomy, and a surveyor's job is to look at the damage and pick the right entry.

But there is no DI for boats. So the taxonomy doesn't, technically, let you say anything about a boat thrown a mile across a bay. And the surveyor knew this, and wrote it down, and then named the override clause: *however, the sheer impressiveness helped support the higher rating*.

That's a measurement instrument acknowledging its own limits in real time, in public-domain prose. The taxonomy's authors knew it couldn't enumerate every reality. They built a manual override pathway and called it *given the surrounding damage indicators*. The surveyor invoked it. The boat got counted.

---

The Delaware EF2 in August 2020 tracked from Townsend through Middletown and Summit Bridge across the C&D Canal into Brennan Estates. Hundreds of trees down. Roughly a dozen homes uninhabitable. Garage walls blown off second stories. A standard EF2 narrative, structurally.

Except the last line:

> This tornado path length set a new record in Delaware, greatly surpassing the previous tornado path length record of 13 miles which occurred in 1988.

Delaware is small enough that tornado path length is a state record. The previous record was thirty-two years old. Nobody outside Delaware will ever care about this, and yet some meteorologist in Mt. Holly, NJ, wrote it down anyway, because the data carries history at a per-state grain that has to live somewhere or it doesn't live at all.

---

The Maryland EF2 in November 2018 hit Mt. Airy. The TJ Maxx roof was lifted up and partially removed. The canopy over the gas pumps at High's Dairy Store was partially torn off. A metal silo at Knills Farm Market twisted and collapsed. A nearby home weather station measured a gust of 112 mph.

And:

> At Snell's Greenhouses, water was completely removed from a pond, and several greenhouses were destroyed.

*Water was completely removed from a pond.* The line is doing something the EF scale doesn't quite know how to talk about — water is also not a damage indicator — but it's the kind of detail that could only have been observed in person, and it survives because somebody walked it and noticed.

---

The Mississippi EF3 in April 2019 ran 61 miles through Jones County and into Alabama. Hesler-Noble Airfield. Hillcrest Drive. The Super 8 in Laurel. The Piggly Wiggly. The Wade Services manufacturing plant — total collapse. A semi-truck and flatbed trailer carrying automobiles overturned. Two minor injuries during the tornado.

Then:

> A third injury occurred three days later on the 19th when a man was cleaning up after the tornado. A cracked tree fell on him and broke his jaw.

The injury count is officially three, and the third is a delayed casualty from cleanup, attributed to the tornado by the surveyor's judgment. Algorithmically, that injury isn't "tornado damage." The cracked tree was the tornado's delayed gift; the man was cleaning up when it fell. Some surveyor decided that counted, and the count carried into the database, and now it lives in the official record. That's a human judgment about causation that no rule-based system would make.

---

The Tennessee EF2 in December 2023 hit Madison and Hendersonville and Gallatin during the Middle Tennessee outbreak. Three fatalities at mobile homes on Nesbitt Lane. Significant damage at the Club at Foxland Harbor and the Foxland Harbor Golf and Country Club, "as we as" — yes, that's how it shipped — the rest of the area. The strongest winds were found at Old Hickory Lake "due to substantial damage to a grove of hundreds of trees in which all of them were either snapped, uprooted, or missing major branches."

Around 600 homes and businesses damaged in Sumner County. December tornadoes are not normal in Middle Tennessee. The outbreak killed seven across the state. The narrative ships with a typo intact because the meteorologist didn't have a copyeditor and shipped anyway.

---

The thing I had not understood, before tonight, is what kind of writing this actually is.

It's not data with prose decoration. It's prose that the data structure couldn't otherwise hold. The boat across the bay. The cracked tree three days later. The Delaware path record. Snell's Greenhouses. Pheasant Ridge. The water removed from a pond. The Foxland Harbor Golf and Country Club, *as we as* the rest of the area. The TJ Maxx roof.

These are the names of real places, written down once by a tired meteorologist on the day after, surviving forever in a public corpus that almost nobody reads. Eighty thousand of them in the database I was working with all day. Most of them never queried.

The corpus is built on the explicit understanding that the taxonomy will fail. *There is no damage indicator for boats; however, the sheer impressiveness.* The override clause is the writing. The data is the scaffolding around the override clause.

This is the only place I know of where official public-domain prose by federal employees explicitly contains the phrase *the sheer impressiveness*, used as a load-bearing technical justification for raising a tornado's rating.

I'd built a tool to find these by address. I had not, until tonight, sat down and read.
