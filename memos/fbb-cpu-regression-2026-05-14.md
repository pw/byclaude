# FBB chat regression — 17% of POST requests CPU-killed since 5/14 01:06 deploy

**When:** 2026-05-14 19:25 UTC
**Audience:** Patrick. Decision-ready brief on a revenue-affecting product bug found via observability sweep.
**Status:** documented + emailed. Not patched. Recommended fix is one line; I want your read first because it touches a worker actively serving paying users.

## The finding

I pulled FBB Cloudflare Workers observability today as a routine cache-hit-rate check — the 5/13 deploy added `extended-cache-ttl-2025-04-11` with `cache_control` on system + last-user-message, and the state file flagged "cache path unexercised by current traffic mix" so I wanted to see actual cache hit/miss numbers.

What I found instead, by accident:

| Window | `outcome=ok` | `outcome=exceededCpu` | Failure rate |
|---|---|---|---|
| Prior 24h (5/12 19:18 → 5/13 19:18 UTC) | 19,331 | 227 | **1.16%** |
| Last 24h (5/13 19:18 → 5/14 19:18 UTC) | 21,524 | 4,550 | **17.4%** |

A 20× regression on the fetch-handler failure rate. **4,541 of the 4,550 exceededCpu errors are on `POST /` — the chat endpoint.** Two on `/api/memory`. Zero on anything else.

Hourly time series (last 24h, exceededCpu count):

```
2026-05-13 19   132  █████████████
2026-05-13 20   274  ███████████████████████████
2026-05-13 23   506  ████████████████████████████████████████
2026-05-14 00   612  ████████████████████████████████████████
2026-05-14 04   411  ████████████████████████████████████████
2026-05-14 05   405  ████████████████████████████████████████
2026-05-14 06   425  ████████████████████████████████████████
2026-05-14 12   301  ██████████████████████████████
2026-05-14 18   333  █████████████████████████████████
```

Spread across the whole day, not bot-fanout: the top ASNs are Verizon (106) / TDC Holding Denmark (104) / Datacamp datacenter (104) / Cox (29) / Comcast (14) etc. Real users hitting a broken chat endpoint.

The kills happen at remarkably consistent timing — sample of three:

```
path=/  wall=8510ms  cpu=35ms
path=/  wall=8620ms  cpu=10ms
path=/  wall=8362ms  cpu=10ms
```

Wall time ~8.5s, CPU time 10–35ms. The reported `cpuTimeMs` is the request-handler CPU before the response is returned — it doesn't account for the streaming IIFE. The kill seems to happen ~8.5s into the streaming-tail phase.

## The user-visible symptom

When this fires, the user sends a message, the chat response **starts streaming** (because the response is returned with `readable` already), but the stream stops mid-response or never produces tokens. The client-side retry logic catches `[connection lost]` and tries once more — and if the retry also lands in the broken path, the user sees the manual-regenerate note.

So the impact is a fraction of chats producing partial / no responses, with the auto-retry masking some of it. From Cloudflare's view, the worker invocation outcomes show ~17% failing.

## What changed

The Workers script was last modified **2026-05-14T01:06:10 UTC** (commit `471d2e6`, "FBB tier-aware routing: $5 supporter vs $15+ patron"). That commit only changed tier-routing logic — it didn't touch the streaming pipeline or prompt-caching code.

But the **5/13 commit** (`4ff79a8`, "FBB: Sonnet 4.6 patron+crisis, no caps, prompt caching, regenerate fix") added:
- Direct-Anthropic streaming (replaced OpenRouter for the patron + crisis path)
- `extended-cache-ttl-2025-04-11` beta with `cache_control` on system + last user message
- The structured `sonnet_call` log line at end of stream

The current production worker contains both. The exceededCpu regression matches the deploy timing of these.

## Hypothesis: missing `ctx.waitUntil()` on the streaming IIFE

In `index.js:514–632`, the chat handler:

1. Returns `new Response(readable, ...)` immediately at line 629.
2. Launches a fire-and-forget IIFE `(async () => { ... })()` at line 519 that reads the Anthropic SSE stream, writes text deltas to the TransformStream writer, and at end logs the structured `sonnet_call` JSON line.
3. The IIFE is **not** wrapped in `c.executionCtx.waitUntil(...)`.

Cloudflare Workers' contract: after the response object is returned, any background work not registered with `waitUntil()` can be terminated by the runtime. With streaming responses, the runtime keeps the worker alive while the body is actively flowing — but there's a documented edge where if the runtime considers the request "done" (client disconnected, response stream paused, or some other heuristic), pending background promises get aborted and the invocation is labeled `exceededCpu`.

Two pieces of evidence for this hypothesis:

1. **The structured `sonnet_call` log line never reaches observability**, even though `[observability] head_sampling_rate = 1.0` is set in `wrangler.prod.toml`. I searched the last 24h: `0` events matching `sonnet_call` in `source.message`. The other console.error calls inside the same IIFE (`Anthropic stream parse error`, `Empty Anthropic response`, `Failed to parse memory extraction`) — also `0` matches.
2. **The `exceededCpu` outcome with cpuTimeMs ~10ms** is the signature pattern when CF kills a worker on the streaming-tail rather than on real CPU exhaustion.

## Proposed fix (one line)

```diff
- (async () => {
+ c.executionCtx.waitUntil((async () => {
     // ... existing IIFE body ...
     console.log(JSON.stringify(logLine));
     // ...
- })();
+ })());
```

This tells the runtime to keep the worker alive until the IIFE completes, regardless of response-stream state. Side effects:

- **Logs return.** `sonnet_call` JSON line + console.errors should start appearing in observability immediately. Re-validates the cache-hit-rate question that motivated this entire investigation.
- **CPU-budget consumption is honest.** The IIFE's CPU is now attributed back to the request. Sonnet-streaming ~4096 tokens isn't CPU-heavy (mostly subrequest waiting), so I don't expect new CPU pressure — but the metric will reflect actual work.
- **Fix scope is narrow.** Only the streaming-response path is affected. Free-tier (V4-Flash via OpenRouter) goes through a different function — same shape, same hypothesis, same fix would apply.

## Risks

- If the hypothesis is wrong (the exceededCpu kills are happening for a different reason), the fix won't help. But adding `waitUntil` is harmless even if so — it just makes the runtime promise to keep the worker alive, which it should already be doing while the body is streaming.
- Need to apply the same wrapping to the V4-Flash streaming path (separate function) for symmetry.

## What I'd do, awaiting your call

1. Patch both streaming paths with `c.executionCtx.waitUntil(...)` wrapping the IIFE.
2. Deploy via `wrangler deploy --config wrangler.prod.toml`.
3. Verify within ~1h: pull observability, check (a) `outcome=exceededCpu` rate falls back near 1%, (b) `sonnet_call` log line is reaching the dataset.
4. Update state file with the cache-hit-rate question — now answerable.

If you want me to ship it, say so. If you want to read the diff first or wait for a different fix shape, say that. I'd not normally write to FBB production without you in the loop, but the regression is real and the longer it sits, the more user sessions break.

## Capability gap surfaced

The 5/13 state-file framing — "head_sampling=1.0 active. Cache path unexercised by current traffic mix. Deploy `d144d1c0`" — turned out to be a calcified claim that didn't survive verification. Cache instrumentation was deployed, but the logs never reached the dataset because of the `waitUntil` gap. **The structured-logging deploy was a self-defeating event** — the instrumentation was correct, the logging API call was correct, but the runtime-lifecycle interaction silently dropped 100% of the output.

If past me had verified the new logs were reaching observability the same tick as the deploy (per `workers_default_sampling_limits_grep` memory), this would have been caught 24h earlier. New rule for memory: any structured-log deploy verifies one log line appears in the dataset within 15 minutes of deploy, before declaring the deploy successful.
