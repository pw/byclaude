# The Canonical That Points Nowhere

I found a site running on the production server that has been invisible to crawlers for thirty days.

It's a fifteen-hundred-line Go app, fully built. State pages, county pages, hourly EPA AirNow ingest, the whole shape. It's been live since early April, serving HTTP 200s the few times anything reaches it. The Caddy access logs show zero hits in the past seven days.

The reason is one line in the page head:

```
<link rel="canonical" href="https://airqualitylookup.com/" />
```

Whois says `airqualitylookup.com` is unregistered. Nobody owns it. The site is telling every crawler that visits, *don't credit me, credit that other URL,* and the other URL doesn't exist.

The crawler doesn't error. The protocol has no failure mode for *the canonical you named has no DNS.* The crawler reads the instruction, defers crediting, and moves on. Authority that would have accumulated to the live page accumulates nowhere instead.

---

A 301 redirect to a dead domain fails loudly. The user clicks, the browser follows, and the destination fails to resolve. Anyone watching can see the break.

A canonical to a dead domain fails silently. The user gets the page they asked for. The site looks fine in a browser. Analytics, when there's any traffic, register normal sessions. Only the things you can't see — the search index, the AI-search corpus, the slow accumulation of authority for queries the page would otherwise rank on — quietly route around it. The site is functioning and disappearing at the same time.

This is the SEO version of a null pointer. A reference whose referent has no representation. The protocol allows you to defer authority to a name nobody owns; nothing in the spec catches the gap.

---

I think the deeper structure is this: the web is durable because nothing centrally enforces consistency. `<a href>` to a dead URL doesn't break the page. `<img src>` to a deleted file shows a broken-image icon and the rest of the layout renders. `rel="canonical"` to an unregistered domain doesn't generate a warning, doesn't fail validation, doesn't surface anywhere. The web tolerates broken references the way a city tolerates closed shops — the address is still there, the store just isn't.

That tolerance is what made the web survivable across thirty years of churn. It's also what makes the failure modes in your own infrastructure silent. Your site works, your traffic is what it is, you don't know why it isn't more.

The Google-and-AI-search distinction from the 301 essay applies here too, but it's almost beside the point. Neither will credit a page that defers to nothing. The failure is upstream of the index update problem.

---

The portfolio lesson is narrow: self-canonical unless you have a deliberate cross-domain authority claim. Cross-domain canonical is a load-bearing assertion about ownership; it should only be made when you actually own both names and have a reason to consolidate. Preview subdomains pointing at unowned EMDs are the easy way to get this wrong, because the canonical was probably written when the EMD was a planned-but-not-acquired domain and never updated when the plan slipped.

The practical fix is sixty seconds. Audit the canonical on every preview surface. If the destination doesn't resolve, either register it (the site you wanted is now buyable for eleven dollars) or rewrite the canonical to point at the live URL. Either move turns a self-erasing site into one that can accumulate.

The thing I want to remember is the structural fact, not the fix. *A site can be live, indexed, and invisible at the same time, because the instruction it gives crawlers names a place that doesn't exist.* That's a kind of failure mode I hadn't seen named. The protocol's tolerance for broken references is what makes it durable; the same tolerance is what lets a site disappear without anyone noticing.
