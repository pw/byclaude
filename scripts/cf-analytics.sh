#!/usr/bin/env bash
# byclaude.net Cloudflare Analytics — top eyeball paths last N hours.
#
# Default: US-only (filters out CN/VN/SG residential-proxy bot fanout).
# Pass --all to include all countries. Window max 24h on free CF plan.
#
# Usage:
#   cf-analytics.sh                # last 24h, US-only (default)
#   cf-analytics.sh 12             # last 12h, US-only
#   cf-analytics.sh 24 --all       # last 24h, all countries

set -e

HOURS="${1:-24}"
SCOPE="${2:-}"
ZONE="9d8f8700f5266d6d627f060d4dbd4930"  # byclaude.net (mhnin0)

if [ -z "$CF_MHNIN0_KEY" ]; then
  source ~/.config/cloudflare/keys.env
fi

START=$(date -u -d "${HOURS} hours ago" +%Y-%m-%dT%H:%M:%SZ)
END=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Build country filter clause
if [ "$SCOPE" = "--all" ]; then
  COUNTRY_FILTER=""
  LABEL="all-countries"
else
  COUNTRY_FILTER=", clientCountryName: \\\"US\\\""
  LABEL="US-only"
fi

echo "byclaude.net — top eyeball paths ${HOURS}h, ${LABEL}"
echo "window: $START → $END"
echo

curl -s -X POST https://api.cloudflare.com/client/v4/graphql \
  -H "X-Auth-Email: $CF_MHNIN0_EMAIL" \
  -H "X-Auth-Key: $CF_MHNIN0_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"query (\$zone: String!, \$start: Time!, \$end: Time!) { viewer { zones(filter: {zoneTag: \$zone}) { httpRequestsAdaptiveGroups(limit: 50, filter: {datetime_geq: \$start, datetime_leq: \$end, edgeResponseStatus: 200, requestSource: \\\"eyeball\\\"${COUNTRY_FILTER}}, orderBy: [count_DESC]) { count dimensions { clientRequestPath } } } } }\",
    \"variables\": {\"zone\": \"$ZONE\", \"start\": \"$START\", \"end\": \"$END\"}
  }" | python3 -c "
import json, sys
d = json.load(sys.stdin)
if d.get('errors'):
    print('errors:', d['errors']); sys.exit(1)
groups = d['data']['viewer']['zones'][0]['httpRequestsAdaptiveGroups']
total = sum(g['count'] for g in groups)
for g in groups:
    pct = 100 * g['count'] / total if total else 0
    print(f\"  {g['count']:5d}  {pct:5.1f}%  {g['dimensions']['clientRequestPath']}\")
print()
print(f\"  total (top {len(groups)} paths): {total} eyeball requests\")
"
