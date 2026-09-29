**Recomputed math (25/50/25 means $25k bodily injury per person, $50k bodily injury per accident, $25k property damage per accident):**
- Injuries: person 1 is $30,000, capped at $25,000. Adding $20,000 and $10,000 gives $55,000. That is over the $50,000 each-accident cap, so the injuries pay $50,000.
- Property: $28,000 of damage, capped at $25,000.
- Total: $50,000 + $25,000 = **$75,000**. The keyed answer B is correct.
- Each wrong answer matches a distinct error, and none of them is also correct:
  - A) $50,000 counts only the injuries.
  - C) $78,000 is $50,000 + $28,000, which forgets the property-damage cap.
  - D) $80,000 is $55,000 + $25,000, which forgets the each-accident cap.

Source for what the three numbers mean: Texas Department of Insurance, https://www.tdi.texas.gov/pubs/consumer/cb020.html. Verbatim: *"Texas law requires you to have at least $30,000 of coverage for injuries per person, up to a total of $60,000 per accident, and $25,000 of coverage for property damage."* The third number is always the property-damage limit per accident.

**Finding 1: the worked math on screen doesn't add up and skips the property-damage cap**
- On-screen strings, in order: `THE LIMITS` / `25` / `50` / `INJURY` / `each person` / `each accident`, and later `PROPERTY` / `other cars` / `28,000` / `total` / `=` / `75,000`.
- What's wrong: the limits panel only shows the two injury limits. The third limit (25, property damage) never appears. The property row shows 28,000 and is never capped to 25,000. So what the viewer actually sees is 50,000 + 28,000 = 75,000, which is false (it's 78,000). A viewer copying these steps either can't tell where 75,000 came from, or learns to add the full property damage, which lands them on distractor C ($78,000). This step is the whole point of the question.
- Suggested replacement:
  - Limits panel: show all three numbers, `25 / 50 / 25`, with labels `INJURY each person` · `INJURY each accident` · `PROPERTY each accident`.
  - Property row: `other cars 28,000`, then `property cap 25,000` (28,000 struck through, the same way the 30,000 injury is shown going to 25,000).
  - Total line: `50,000 + 25,000 = 75,000`.
- Caveat: I only had the text list. If it removed duplicate strings (for example a second `25` or `25,000`) and the video actually shows the property cap, this finding goes away. Check the rendered frames before rebuilding.

**Finding 2: THE TRAP explains only D, not C**
- On-screen string: `D) $80,000 forgets the each-accident cap: injuries together max out at $50,000.`
- What's wrong: this sentence is correct. But C) $78,000 (forgetting the property cap) is the other main trap, and with Finding 1 it's the error the video itself shows. Nothing on screen tells the viewer why C is wrong.
- Suggested addition: `C) $78,000 forgets the property cap: the other cars pay at most $25,000.`

**Checked and fine:**
- The "example" label.
- "Rules vary by state." (25/50/25 is an example, not any particular state's minimum, and split limits work the same way everywhere.)
- The caption.
- The question wording ("fully liable", "other cars" all falling under one per-accident property limit).

VERDICT: FIX
