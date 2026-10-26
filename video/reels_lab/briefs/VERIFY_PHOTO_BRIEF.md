# Still Unsolved — blind check of ONE photo post (2026-10-26)

You check a single-photo Facebook post before it goes up on a Page called "Still Unsolved".
Read ONLY: `~/byclaude/video/reels_lab/photos/<slug>/caption.txt` and LOOK at the image file `image.*` in that folder
(use the Read tool on it). Do NOT read sources.md (the writer's sources; you are the independent check).
You MAY read meta.json only for the commons_file name, to check the licence yourself.

1. Every factual statement in the caption: verify on the web yourself (≥1 reliable source; 2 for anything surprising).
   Today is 2026-10-26. Check how a reader would READ it next to this photo (does the photo + sentence imply
   something false, e.g. the photo shows a different object/place/date than the caption suggests?).
2. If the caption ends "Still unsolved.": is that honestly true as of Oct 2026 (search 2024–2026 news)? If the matter
   has an accepted explanation or a "presumed" answer most sources state, say so.
3. Licence: fetch `https://commons.wikimedia.org/w/api.php?action=query&titles=File:<commons_file>&prop=imageinfo&iiprop=extmetadata&format=json`
   (curl with a browser User-Agent). Allowed: public domain, CC0, CC BY, CC BY-SA. Is the attribution line in the
   caption correct (author + licence) for CC files?
4. Is the image a real photograph of what the caption says (not an illustration/AI/reconstruction passed off as a photo)?
5. Flag any named living private person, named suspect, or anything cruel/sensational about victims.

Return under 200 words:
VERDICT: CLEAN | FIX | KILL
then one line per problem: exact current text → exact replacement text, with the source URL.
If CLEAN, one line naming the 2–3 claims you checked hardest. Do not edit any files.
