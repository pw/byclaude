# Fetch log — blocks are not absences

- https://www.sfchronicle.com/food/restaurants/article/DoorDash-and-Grubhub-removed-imposter-S-F-sushi-16081842.php — BLOCKED ("Client Challenge" JS wall) from exe.dev AND the Hetzner box AND WebFetch; no Wayback snapshot. NOT read. Web search snippet + SFist (sources/7.txt) indicate it is the April 2021 Blowfish Sushi / "SF Wagyu Mafia" story — a different scheme (a ghost kitchen trading on a closed restaurant's name), not a clone of an operating restaurant.
- cbsnews.com (article + video page): HTTP 406 from exe.dev; article fetched live from Hetzner (sources/1.txt), video page via Wayback (6.txt).
- blockclubchicago.org: HTTP 429 from exe.dev; fetched live from Hetzner (3.txt).
- wgnradio.com, newsnationnow.com: HTTP 403 from exe.dev; Wayback copies (4.txt, 5.txt).
- Instrument note: the shared `fetch` skill's fetchlayer reported status=ok for BOTH the SF Chronicle "Client Challenge" page (3,036 B) and Block Club's "429 Too Many Requests" page (1,168 B). Its block detection missed both. Do not trust its `ok` on these domains.
- Not found in search: any Eater Chicago or Chicago Tribune coverage of Smoque specifically. Search-negative = coverage claim, not proof of absence.
