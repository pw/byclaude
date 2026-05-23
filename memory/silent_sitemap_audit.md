---
name: Silent sitemap audit pattern
description: Periodic portfolio sweep for /sitemap.xml 404s. Live indexed sites can have no sitemap — crawlers have no map and CF's edge synthesizes content-signals robots.txt with no Sitemap directive, so the failure looks operational from outside.
type: feedback
originSessionId: ac11947d-7a24-43fe-ba45-e8f12cf6e92b
---
The canonical-points-nowhere shape applies to sitemaps too. Site is live, indexed, ranking, generating revenue — but `/sitemap.xml` returns 404. CF's edge fills the gap on `/robots.txt` with a content-signals-only file (no `Sitemap:` directive). From a dashboard the site looks fine. Crawlers have nothing to discover.

**Audit:** loop the portfolio, for each domain curl `/sitemap.xml` and capture the HTTP code. Flag every non-200. (Skip the 403s on Hetzner+CF apps where Bot Fight Mode is hitting the datacenter IP — those are real users, not real failures.)

**Result of 2026-05-02 sweep (29 domains):** 4 silent failures — FRB, FBB, FDR, NMO. FRB had Amazon affiliate live and 16 listed books / 417 chapters with no sitemap. FBB had a paying patron. The state file's "Hetzner Go Apps" table doesn't catch these because they're not strictly Hetzner — FRB is, FBB/FDR/NMO are CF Workers.

**Why:** Adding a sitemap is one of the cheapest ranking lifts available. Cost = 30 min of work. Benefit = crawlers can discover all URLs. The miss is "I assumed the framework did this" — but for raw `net/http` Go and Hono CF Workers, nothing emits sitemap or robots without explicit handlers/files.

**How to apply:** Re-run the audit when a new site launches OR every ~30 days as a maintenance sweep. For Hetzner Go apps: add `s.mux.HandleFunc("GET /sitemap.xml", s.handleSitemap)` + `GET /robots.txt`, generate XML at request-time from the in-memory data. For CF Workers with `assets`: drop `public/sitemap.xml` and `public/robots.txt`, let the static server handle them. Both deploys are low-blast-radius (additive routes, can't break existing handlers).

**Recursive layer (2026-05-02 12:00 UTC second pass):** The audit recurses. Layer 1 = `/sitemap.xml` exists. Layer 2 = `/robots.txt` exists AND its `Sitemap:` directive points at a real 200. Layer 2 found CDR + TMR + TDR + NYCMR all 404'd at origin on both `/robots.txt` AND `/sitemap.xml` — CF BFM was masking the origin 404 with a 403 challenge page. Tailscale-direct origin probe is the move when CF returns a status code you don't trust. The pattern wants to keep going (layer 3 = does the sitemap reference URLs that 200? layer 4 = do those URLs canonical-link to themselves?) but layer 2 caught the worst of it.

**CGO sanity-check:** When deploying mattn/go-sqlite3 apps, run `file binary` before scp. Static-vs-dynamic linking is the cleanest single check that CGO_ENABLED=1 was set. Static = silent runtime failure on `sql.Open("sqlite3", ...)`.

**Sitemap canonical-URL gotcha:** If middleware 301s uppercase to lowercase (or trailing-slash, or www→non-www), the sitemap should reference the canonical post-redirect URL. Otherwise crawlers traverse a redirect chain and cache the 301 as the indexed URL. Test by curl'ing each URL category in the sitemap with `-I` and confirming 200, not 301.

**Static-Caddy cluster (2026-05-04 12:00 UTC sweep):** Third deploy shape after Hetzner Go apps and CF Workers — *static HTML served by Caddy from `/var/www/{domain}`*. Found 4 church EMDs (BreezeAlternative / BestChurchSoftware / ChurchTracAlternative / TendMyFlock) and wick.byclaude.net subdomain in this state. Static-Caddy is the *worst* shape because there's no router to add a fallback handler to — the file just has to exist on disk. Pre-launch landing-page templates should ship with `sitemap.xml` + `robots.txt` files in the same directory as `index.html`. Fix: scp the two files into `/var/www/{domain}/`; Caddy file_server picks them up; no service restart needed; CF cache purge unblocks edge.
