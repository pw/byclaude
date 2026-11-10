# Round 2 (shared notes for all three fix agents)

Read `FIX_BRIEF.md` first: its rules, file layout and the `./stills.py` workflow all still apply. Where it says
"read critique/round1.md", read **`critique/round2.md`** instead: round 1 has been fixed already, the full film was
re-rendered, and a second blind critic reviewed that render. Your job is round 2's items inside your scope. The
state of every js file before this round is in `/tmp/fable_js_r1_backup/`.

Rulings on critique items (already decided, do not reopen):
- NOT TAKEN: any re-timing (timing is fixed by the voice-over); opening the film on the oil swirl (the brief asks for
  a true marinara fact as the hook); rewriting on-screen text to match the voice word for word (the copy is
  fact-checked: keep a checked string or drop it, never reword it; "cheap dry red wine", "usually", "many",
  "bloom 20-30 s" are correct as checked); en dashes / "sec" (checked strings stay as written); quantities for recipe
  2 (the recipe as given has none); a series name on the end card (not decided yet); forcing both recipes into one
  layout.
- Where the critic complains a text is on screen for under about a second, the fix is to bring it in EARLIER within
  the same narration span (or drop it), since the scene cannot be lengthened.
- Caption rule (one rule for the whole film): the burned-in caption is hidden ONLY while the same words are on
  screen as designed type; everywhere else it shows. Check your scene's `capOff` ranges against that rule and remove
  any range where the on-screen type is not carrying the same words.
- Several scenes leave the lower third of the frame empty apart from the caption (the critic names 8.0, 23.0, 35.0,
  59.0; there are others). Scale the art up or sit it lower so the composition uses the frame; keep clear of the
  caption pill and of the platform zones (top ~250 px, bottom ~340 px, right ~120 px of 1080x1920).
- Do NOT run a full render. Report at the end as FIX_BRIEF.md describes, and list every time range (film seconds)
  where the picture changed, so only those frames are re-rendered.
