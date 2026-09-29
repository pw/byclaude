# fpm-time-control — sources

Film: time as a public health control (TPHC) for hot-held food. Original question — not taken from any exam,
vendor item bank or prep company. The end card says `Based on the FDA Food Code; your local code may differ.`

Authority: the FDA Food Code, section 3-501.19 "Time as a Public Health Control", in BOTH the 2022 edition (the one
most state/local codes adopt today) and the 2026 edition (released by FDA 2026-09-17). The rule is the same in both;
the only wording change is that 2026 spells the numbers out ("four hours", "six hours" where 2022 has "4 hours",
"6 hours"). Texts read from the FDA PDFs with pdftotext -layout.

- 2022: https://www.fda.gov/media/164194/download (FDA Food Code 2022) — Chapter 3 - 30/31
- 2026: https://www.fda.gov/media/194741/download (FDA Food Code 2026) — pages 74-75
- Edition pages: https://www.fda.gov/food/fda-food-code/food-code-2022 · https://www.fda.gov/food/fda-food-code/food-code-2026

## Rules and their authority (verbatim, 2022 text; 2026 identical except numbers spelled out)

1. **Scope — ready-to-eat TCS food displayed or held for service (a pizza on a buffet), with written procedures.**
   3-501.19(A): > "if time without temperature control is used as the public health control for a working supply of
   > TIME/TEMPERATURE CONTROL FOR SAFETY FOOD before cooking, or for READY-TO-EAT TIME/TEMPERATURE CONTROL FOR SAFETY
   > FOOD that is displayed or held for sale or service: (1) Written procedures shall be prepared in advance,
   > maintained in the FOOD ESTABLISHMENT and made available to the REGULATORY AUTHORITY upon request"
   The question says the kitchen is "using time as a public health control", i.e. operating under this section.

2. **Hot food qualifies only for the 4-hour option: it must start at 135°F or hotter.** 3-501.19(B)(1):
   > "(B) If time without temperature control is used as the public health control up to a maximum of 4 hours:
   > (1) Except as specified in (B)(2), the FOOD shall have an initial temperature of 5°C (41ºF) or less when removed
   > from cold holding temperature control, or 57°C (135°F) or greater when removed from hot holding temperature
   > control; P"
   (B)(2) (initial temperature 70°F or less) covers only cut ready-to-eat fruit/vegetables and opened hermetically
   sealed food — not pizza, so it does not apply.

3. **Mark it with the time 4 hours out.** 3-501.19(B)(3):
   > "The FOOD shall be marked or otherwise identified to indicate the time that is 4 hours past the point in time
   > when the FOOD is removed from temperature control; Pf"

4. **The answer: serve or discard within 4 hours of leaving temperature control.** 3-501.19(B)(4)-(5):
   > "(4) The FOOD shall be cooked and served, served at any temperature if READY-TO-EAT, or discarded, within 4 hours
   > from the point in time when the FOOD is removed from temperature control; P and (5) The FOOD in unmarked
   > containers or PACKAGES, or marked to exceed a 4-hour limit shall be discarded. P"

5. **The trap: the 6-hour option is for COLD food only (starts at 41°F or less, never above 70°F).** 3-501.19(C)(1):
   > "(C) If time without temperature control is used as the public health control up to a maximum of 6 hours:
   > (1) The FOOD shall have an initial temperature of 5ºC (41ºF) or less when removed from temperature control and
   > the FOOD temperature may not exceed 21ºC (70ºF) within a maximum time period of 6 hours; P"
   Pizza leaving hot holding at 135°F cannot meet "41ºF or less", so only (B) — 4 hours — applies.

6. **Highly susceptible populations** — 3-501.19(D) bars TPHC only for raw EGGS in such establishments; pizza is
   unaffected, so the question needs no pin for it.

## Why exactly one option is defensible
Start 11:00 AM (off hot holding at 135°F) + 4 hours = 3:00 PM. The 6-hour option (C) is unavailable because the
food did not start at 41°F or less. There is no 2-hour or 3-hour limit in 3-501.19.
- A) 1:00 PM — 2 hours: no 2-hour limit in 3-501.19 (2 hours is the first stage of COOLING, 3-501.14 — a different rule).
- B) 2:00 PM — 3 hours: no 3-hour limit in 3-501.19; the limit for hot food is 4 hours.
- C) 3:00 PM — CORRECT: 4 hours, 3-501.19(B)(4).
- D) 5:00 PM — 6 hours: the 6-hour option, 3-501.19(C)(1), requires an initial temperature of 41°F or less.

## Worked example (illustrative — the figures are an example, not from any exam)
- Pizza held hot at 135°F, taken off hot holding at 11:00 AM (the clock starts: 3-501.19(B)(4) "from the point in time
  when the FOOD is removed from temperature control").
- Hot-food limit: + 4 hours.
- 11:00 AM + 4 hours = 3:00 PM (clock hours on the timeline: 11, 12, 1, 2, 3 — i.e. 11:00 AM, 12:00 PM, 1:00 PM,
  2:00 PM, 3:00 PM).
- Mark the pan "3:00 PM" (3-501.19(B)(3)); serve or throw out by 3:00 PM (3-501.19(B)(4)).
- Trap (on screen: "D) 5:00 PM is the 6-hour option. It is only for cold food, 41°F or below."): 11:00 AM + 6 hours = 5:00 PM — only allowed for food that starts at 41°F or colder (3-501.19(C)(1)).
- Distractor arithmetic: 11:00 AM + 2 hours = 1:00 PM; 11:00 AM + 3 hours = 2:00 PM.
- Countdown ring digits on screen: 5, 4, 3, 2, 1 (seconds of the pause, not data).
