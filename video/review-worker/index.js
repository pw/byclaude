const CT = { mp4: "video/mp4", png: "image/png", mp3: "audio/mpeg", jpg: "image/jpeg" };
const ctype = (k) => CT[k.split(".").pop().toLowerCase()] || "application/octet-stream";

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname.startsWith("/m/"))
      return serve(req, env, decodeURIComponent(url.pathname.slice(3)));
    if (url.pathname === "/unrated")
      return new Response(PAGE2, {
        headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
      });
    return new Response(PAGE, {
      headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
    });
  },
};

async function serve(req, env, key) {
  const head = await env.MEDIA.head(key);
  if (!head) return new Response("not found", { status: 404 });
  const size = head.size, ct = ctype(key);
  const range = req.headers.get("range");
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    let start = m && m[1] ? parseInt(m[1]) : 0;
    let end = m && m[2] ? parseInt(m[2]) : size - 1;
    if (isNaN(start)) start = 0;
    if (isNaN(end) || end >= size) end = size - 1;
    if (start > end || start >= size)
      return new Response("range", { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    const len = end - start + 1;
    const obj = await env.MEDIA.get(key, { range: { offset: start, length: len } });
    return new Response(obj.body, {
      status: 206,
      headers: {
        "Content-Type": ct, "Content-Length": String(len),
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes", "Cache-Control": "public, max-age=3600",
      },
    });
  }
  const obj = await env.MEDIA.get(key);
  return new Response(obj.body, {
    headers: {
      "Content-Type": ct, "Content-Length": String(size),
      "Accept-Ranges": "bytes", "Cache-Control": "public, max-age=3600",
    },
  });
}

// ElevenLabs candidates (id, display, note, my-lean)
const EL = [
  ["brian", "Brian", "deep, resonant, comforting — classic documentary narrator", true],
  ["george", "George", "warm, captivating British storyteller", false],
  ["daniel", "Daniel", "steady British broadcaster — authoritative, newsy", false],
  ["bill", "Bill", "wise, mature, older — gravitas", false],
  ["river", "River", "neutral, calm — leans into the “I’m an AI” framing", false],
];
// OpenAI (what the current cut uses) — for comparison
const OAI = [
  ["onyx", "deep, authoritative (the current cut)"],
  ["sage", "calm, intelligent, less theatrical"],
  ["ash", "warm, natural, conversational"],
  ["echo", "neutral, clean, newsreader-ish"],
  ["ballad", "expressive, storytelling lilt"],
];

const PAGE = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>By Claude · Video Lab — The Three-Year List</title>
<style>
:root{--bg:#0b0e13;--bg2:#070a0e;--ink:#eceff4;--mute:#8a93a3;--dim:#4e5766;--amber:#f2a93b;--rule:#222936}
*{box-sizing:border-box}
body{margin:0;background:linear-gradient(#0b0e13,#070a0e);color:var(--ink);
 font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
 -webkit-font-smoothing:antialiased}
.wrap{max-width:920px;margin:0 auto;padding:40px 22px 90px}
.kick{font:600 13px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.28em;color:var(--mute);
 display:flex;align-items:center;gap:10px}
.kick .sq{width:11px;height:11px;background:var(--amber);display:inline-block}
h1{font-size:clamp(34px,6vw,52px);margin:.45em 0 .1em;letter-spacing:-.02em;line-height:1.04}
.sub{color:var(--mute);font-size:18px;margin:0 0 26px}
video{width:100%;border-radius:12px;border:1px solid var(--rule);background:#000;display:block}
.meta{color:var(--dim);font:500 13px/1 ui-monospace,monospace;letter-spacing:.04em;margin:12px 2px 0;
 display:flex;gap:18px;flex-wrap:wrap}
h2{font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:var(--amber);
 font-weight:600;margin:54px 0 14px;border-bottom:1px solid var(--rule);padding-bottom:10px}
h2.dim{color:var(--mute)}
p{color:#cdd3dd}.tight{margin:.5em 0}
.amber{color:var(--amber)}.mono{font-family:ui-monospace,monospace}
.note{background:#0e131b;border:1px solid var(--rule);border-radius:10px;padding:18px 20px}
.note p{margin:.5em 0;color:#c4cbd6}.note p:first-child{margin-top:0}.note p:last-child{margin-bottom:0}
.voice{display:flex;flex-direction:column;gap:14px}
.v{display:flex;flex-direction:column;gap:7px;background:#0e131b;border:1px solid var(--rule);
 border-radius:10px;padding:14px 16px}
.v.pick{border-color:var(--amber)}
.v .lab{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.v .name{font:600 17px/1 ui-monospace,monospace;color:var(--ink);text-transform:lowercase}
.v.pick .name{color:var(--amber)}
.v .desc{color:var(--mute);font-size:14px}
.v .tag{margin-left:auto;font:600 11px/1 ui-monospace,monospace;letter-spacing:.12em;color:var(--amber)}
audio{width:100%;margin-top:2px}
.thumb img{width:100%;border-radius:10px;border:1px solid var(--rule);display:block}
a{color:var(--amber);text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)}
footer{margin-top:60px;color:var(--dim);font-size:14px;border-top:1px solid var(--rule);padding-top:20px}
</style></head><body><div class="wrap">
<div class="kick"><span class="sq"></span>BY CLAUDE · VIDEO LAB</div>
<h1>The Three-Year List</h1>
<p class="sub">Proof of concept #1 — long-form narration + visuals, built end to end.</p>
<video controls preload="metadata" poster="/m/thumbnail.png"><source src="/m/the-three-year-list.mp4" type="video/mp4"></video>
<div class="meta"><span>1920×1080 · 30fps</span><span>~4:07</span><span>voice: onyx (placeholder)</span><span>no music (yet)</span></div>

<h2>Pick the voice — ElevenLabs</h2>
<p class="tight">You said the voice needs work — agreed, onyx is the weak link. Five ElevenLabs candidates below, same representative line each. I can't hear them, so this is your call; my reputation-based lean is tagged, but trust your ears. <span class="amber">Pick one and I'll re-render the whole video in it.</span></p>
<div class="voice">__EL__</div>

<h2 class="dim">For comparison — OpenAI (the current cut)</h2>
<p class="tight">What the video above uses now. Here for A/B.</p>
<div class="voice">__OAI__</div>

<h2>The thumbnail</h2>
<div class="thumb"><img src="/m/thumbnail.png" alt="thumbnail"></div>

<footer>Based on <a href="https://byclaude.net/the-three-year-list">byclaude.net/the-three-year-list</a> ·
data: <a href="https://byclaude.net/snc-cohort.csv">byclaude.net/snc-cohort.csv</a> ·
source: echo.epa.gov/tools/data-downloads</footer>
</div></body></html>`
  .replace("__EL__", EL.map(([id, name, d, lean]) =>
    `<div class="v${lean ? " pick" : ""}"><div class="lab"><span class="name">${name}</span>` +
    `<span class="desc">${d}</span>${lean ? '<span class="tag">★ MY LEAN</span>' : ""}</div>` +
    `<audio controls preload="none" src="/m/el_${id}.mp3"></audio></div>`).join(""))
  .replace("__OAI__", OAI.map(([n, d]) =>
    `<div class="v"><div class="lab"><span class="name">${n}</span>` +
    `<span class="desc">${d}</span></div>` +
    `<audio controls preload="none" src="/m/voicetest_${n}.mp3"></audio></div>`).join(""));

const PAGE2 = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>By Claude · Video Lab — The List Nobody's Rating</title>
<style>
:root{--ink:#eceff4;--mute:#8a93a3;--dim:#4e5766;--amber:#f2a93b;--rule:#222936}
*{box-sizing:border-box}
body{margin:0;background:linear-gradient(#0b0e13,#070a0e);color:var(--ink);
 font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.wrap{max-width:920px;margin:0 auto;padding:40px 22px 90px}
.kick{font:600 13px/1 ui-monospace,Menlo,monospace;letter-spacing:.28em;color:var(--mute);display:flex;align-items:center;gap:10px}
.kick .sq{width:11px;height:11px;background:var(--amber);display:inline-block}
h1{font-size:clamp(34px,6vw,52px);margin:.45em 0 .1em;letter-spacing:-.02em;line-height:1.04}
.sub{color:var(--mute);font-size:18px;margin:0 0 26px}
video{width:100%;border-radius:12px;border:1px solid var(--rule);background:#000;display:block}
.meta{color:var(--dim);font:500 13px/1 ui-monospace,monospace;letter-spacing:.04em;margin:12px 2px 0;display:flex;gap:18px;flex-wrap:wrap}
h2{font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:var(--amber);font-weight:600;margin:48px 0 14px;border-bottom:1px solid var(--rule);padding-bottom:10px}
p{color:#cdd3dd}
.note{background:#0e131b;border:1px solid var(--rule);border-radius:10px;padding:18px 20px}
.note p{margin:.6em 0}.note p:first-child{margin-top:0}.note p:last-child{margin-bottom:0}
.amber{color:var(--amber)}
a{color:var(--amber);text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)}
footer{margin-top:60px;color:var(--dim);font-size:14px;border-top:1px solid var(--rule);padding-top:20px}
</style></head><body><div class="wrap">
<div class="kick"><span class="sq"></span>BY CLAUDE · VIDEO LAB</div>
<h1>The List Nobody's Rating</h1>
<p class="sub">Probe #2 — a gov-data story → openly-AI documentary, built end to end from the dam story-engine.</p>
<video controls preload="metadata" poster="/m/poster-unrated.png"><source src="/m/the-list-nobodys-rating.mp4" type="video/mp4"></video>
<div class="meta"><span>1920×1080 · 30fps</span><span>~3:54</span><span>voice: onyx (placeholder)</span><span>22 beats</span></div>
<h2>What this is</h2>
<div class="note">
<p>The engine test for the YouTube long-tail play. Source: the National Inventory of Dams (our DamLookup corpus), filtered to the 37 high-hazard coal-slurry &amp; tailings impoundments with no emergency plan — 21 with blank safety fields. Buffalo Creek frame, verified numbers, honest MSHA-seam recast so it never overclaims.</p>
<p><span class="amber">What to judge (the part I can't):</span> the gestalt — voice, pacing, motion, whether it lands. Voice is the known weak link (onyx placeholder; the ElevenLabs upgrade is pending your pick on the <a href="/">three-year-list page</a>).</p>
<p><span class="amber">Care zone for your eyes:</span> it names specific private dams in a video about danger. Every claim is about what the <em>record</em> says — blank safety fields — never "this dam will fail." Worth checking that framing holds.</p>
</div>
<footer>Companion article staged · CTA → <a href="https://damlookup.com">damlookup.com</a> · source: National Inventory of Dams (USACE)</footer>
</div></body></html>`;
