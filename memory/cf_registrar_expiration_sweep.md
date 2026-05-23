---
name: CF registrar payment-expired sweep
description: Periodic portfolio sweep of CF Registrar API for payment_expired domains. Inbox notices alone are not reliable — the 60-day vs final-notice cadence means missing the first leaves short runway on the second.
type: feedback
---
Sister to the silent-sitemap-audit pattern but for domain expiration. A site can be live, indexed, generating revenue *and* paying-expired at the registrar. CF still serves it for a grace period (typically ~30d past expiration) before suspension, then deletion. From outside, everything looks operational.

**The 2026-05-02 catch:** godslut.com (TayTay's domain) was payment-expired 2026-04-12 (20 days). Site still resolved + served 200; CF Registrar API showed `payment_expired:true`, `last_known_status:registrationActive`. Patrick's inbox had received the 60-day-out notice at some prior point that was missed in the noise; the final-notice email arrived only after expiration. Time-sensitive when caught.

**Audit:**
```bash
source ~/.config/cloudflare/keys.env
curl -s -H "X-Auth-Email: $CF_PWHITE_EMAIL" -H "X-Auth-Key: $CF_PWHITE_KEY" \
  "https://api.cloudflare.com/client/v4/accounts/3a055c23f81c64d7c1b47de5b8ec9d52/registrar/domains?per_page=200"
```
Filter for `policies.suspension.payment_expired:true` AND `policies.suspension.parked:false` (parked = dead/unwanted, no urgency). Also surface `expires_at` within next 90d AND `auto_renew:off` for the second-tier list.

**Two CF accounts to sweep:** pwhite (`3a055c23f81c64d7c1b47de5b8ec9d52`) and mhnin0 (`e8ccae77a59917df36801cc52dbfcd60`). Run the same query against both account IDs.

**Why:** CF sends 60-day, 30-day, expiration-day, and final-notice emails per domain. Patrick's inbox averages 30+ unread/day; the early-warning emails get buried in noise. The API check is unambiguous and takes 5 seconds.

**How to apply:** Run the sweep at the start of each session that includes inbox triage, OR weekly as a standalone tick. When a payment-expired+unparked+active result surfaces, telegram Patrick concretely (domain name + days past + dash link), do NOT autonomously renew (his payment method, his identity-attached domains). Update state file with 🚨 entry at top of "Decisions awaiting Patrick."
