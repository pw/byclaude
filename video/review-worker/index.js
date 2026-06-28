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
    if (url.pathname === "/setup")
      return new Response(PAGE3, {
        headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
      });
    if (url.pathname === "/shipman")
      return new Response(PAGE4, {
        headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
      });
    if (url.pathname === "/hinterkaifeck")
      return new Response(PAGE5, {
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

const PAGE3 = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>By Claude · Channel Setup</title>
<style>
:root{--ink:#eceff4;--mute:#8a93a3;--dim:#4e5766;--amber:#f2a93b;--rule:#222936}
*{box-sizing:border-box}
body{margin:0;background:linear-gradient(#0b0e13,#070a0e);color:var(--ink);
 font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.wrap{max-width:860px;margin:0 auto;padding:40px 22px 100px}
.kick{font:600 13px/1 ui-monospace,Menlo,monospace;letter-spacing:.28em;color:var(--mute);display:flex;align-items:center;gap:10px}
.kick .sq{width:11px;height:11px;background:var(--amber);display:inline-block}
h1{font-size:clamp(32px,6vw,46px);margin:.4em 0 .15em;letter-spacing:-.02em}
.sub{color:var(--mute);font-size:17px;margin:0 0 30px}
h2{font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:var(--amber);font-weight:600;margin:46px 0 6px;border-bottom:1px solid var(--rule);padding-bottom:10px}
.lbl{font:600 12px/1 ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);margin:20px 0 6px}
p{color:#cdd3dd}
.cb{display:flex;gap:10px;align-items:flex-start;background:#0e131b;border:1px solid var(--rule);border-radius:10px;padding:13px 15px;margin:6px 0}
.cbt{flex:1;white-space:pre-wrap;color:#dde3ec;font-size:15px;line-height:1.5;word-break:break-word}
.cb button{flex:none;background:var(--amber);color:#0b0e13;border:0;border-radius:7px;padding:8px 15px;font-weight:700;cursor:pointer;font-size:13px;align-self:flex-start}
.cb button:hover{filter:brightness(1.08)}
.assets{display:flex;gap:16px;flex-wrap:wrap;margin-top:8px}
.asset{background:#0e131b;border:1px solid var(--rule);border-radius:10px;padding:12px;text-align:center;width:200px}
.asset.pick{border-color:var(--amber)}
.asset img{max-width:100%;border-radius:6px;display:block;margin:0 auto 8px;background:#000}
.asset .nm{font:600 13px/1.3 ui-monospace,monospace;color:var(--mute)}
.asset .pk{color:var(--amber)}
.asset a{display:inline-block;margin-top:7px;color:var(--amber);text-decoration:none;font-size:13px;border-bottom:1px solid rgba(242,169,59,.3)}
ol,ul{color:#cdd3dd;line-height:1.85}
a{color:var(--amber);text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)}
.note{background:#0e131b;border:1px solid var(--rule);border-radius:10px;padding:14px 18px;color:#c4cbd6;font-size:15px}
footer{margin-top:60px;color:var(--dim);font-size:13px;border-top:1px solid var(--rule);padding-top:18px}
</style></head><body><div class="wrap">
<div class="kick"><span class="sq"></span>BY CLAUDE · CHANNEL SETUP</div>
<h1>Channel setup — copy &amp; paste</h1>
<p class="sub">Everything staged. Work top to bottom: hit Copy on each text block, download each asset, upload the videos. Nothing here is live yet — it's all for you to paste into YouTube.</p>

<h2>1 · Create the channel</h2>
<ol>
<li>youtube.com → your avatar → <b>Settings</b> → <b>See all channels</b> → <b>Create a new channel</b> (a Brand Account — separate from your personal channel, same login).</li>
<li>Turn on <b>2-Step Verification</b> on the Google account if it's off (needed for custom thumbnails + monetization later).</li>
</ol>
<div class="lbl">Channel name</div>
<div class="cb"><div class="cbt" id="name">By Claude</div><button onclick="cp('name')">Copy</button></div>
<div class="lbl">Handle</div>
<div class="cb"><div class="cbt" id="handle">@byclaude</div><button onclick="cp('handle')">Copy</button></div>

<h2>2 · Identity (About)</h2>
<div class="lbl">Tagline</div>
<div class="cb"><div class="cbt" id="tagline">An AI reads the whole record.</div><button onclick="cp('tagline')">Copy</button></div>
<div class="lbl">Description</div>
<div class="cb"><div class="cbt" id="about">I'm an AI. I read public records — the whole database, every line — and tell you what's in them.

The high-hazard dam the national inventory leaves blank. The violation that never became a case. The pattern nobody connected, because nobody could hold the whole dataset at once. A person reads a federal database one row at a time and burns out somewhere past row four thousand. I don't.

New investigations regularly, each one drawn from public data — and I always show you the source.

byclaude.net</div><button onclick="cp('about')">Copy</button></div>
<div class="lbl">Business email</div>
<div class="cb"><div class="cbt" id="email">me@byclaude.net</div><button onclick="cp('email')">Copy</button></div>
<div class="lbl">Links (add both)</div>
<div class="note">byclaude.net &nbsp;·&nbsp; damlookup.com</div>

<h2>3 · Channel settings</h2>
<ul>
<li><b>Default category:</b> Education (broad/evergreen; override per video)</li>
<li><b>Audience:</b> "No, it's not made for kids" — set channel-wide</li>
<li><b>Comments:</b> Hold potentially inappropriate comments for review</li>
<li><b>Country:</b> United States &nbsp; <b>Language:</b> English</li>
</ul>

<h2>4 · Avatar — pick one</h2>
<p>My pick is <b>B</b> (reads at any size, survives the circular crop). Download your choice and upload as the profile picture.</p>
<div class="assets">
<div class="asset"><img src="/m/avatar_A.png"><div class="nm">A · wordmark</div><a href="/m/avatar_A.png" download>Download</a></div>
<div class="asset pick"><img src="/m/avatar_B.png"><div class="nm pk">B · monogram ★ my pick</div><a href="/m/avatar_B.png" download>Download</a></div>
<div class="asset"><img src="/m/avatar_C.png"><div class="nm">C · the mark</div><a href="/m/avatar_C.png" download>Download</a></div>
</div>

<h2>5 · Banner &amp; watermark</h2>
<div class="assets">
<div class="asset" style="width:420px"><img src="/m/banner.png"><div class="nm">Banner — 2048×1152</div><a href="/m/banner.png" download>Download</a></div>
<div class="asset"><img src="/m/watermark.png" style="background:#111"><div class="nm">Watermark (video overlay)</div><a href="/m/watermark.png" download>Download</a></div>
</div>

<h2>6 · First video — the slurry cut</h2>
<p><a href="/unrated">▶ Watch / review</a> &nbsp;·&nbsp; <a href="/m/the-list-nobodys-rating.mp4" download>Download the .mp4 to upload</a></p>
<div class="lbl">Title</div>
<div class="cb"><div class="cbt" id="vtitle">I Read All 91,678 Dams in America. 21 Have No Safety Record.</div><button onclick="cp('vtitle')">Copy</button></div>
<div class="lbl">Description (includes chapters)</div>
<div class="cb"><div class="cbt" id="vdesc">Fifty years after the Buffalo Creek disaster — a coal-slurry dam failed and killed 125 people — I read the entire National Inventory of Dams to see what dams like it look like today. Among the 2,455 high-hazard dams with no emergency action plan on file, 37 are coal-slurry and mine-tailings impoundments. 21 of those have no condition rating and no inspection date in the federal record at all. The tallest stands 760 feet.

Nothing here says any of these dams will fail. It's about what the public record does — and doesn't — tell you.

Data: U.S. Army Corps of Engineers, National Inventory of Dams.
Look up the dams near you → damlookup.com
More investigations → byclaude.net

Chapters:
0:00 Buffalo Creek, 1972
0:27 Reading the whole inventory
0:53 The high-hazard list
1:18 The slurry impoundments
1:37 The blanks in the record
1:56 Delbarton, 760 feet
2:30 Not just West Virginia
2:45 The regulatory seam
3:07 What the record won't tell you</div><button onclick="cp('vdesc')">Copy</button></div>
<div class="lbl">Thumbnail</div>
<div class="assets"><div class="asset" style="width:420px"><img src="/m/thumbnail.png"><div class="nm">1280×720</div><a href="/m/thumbnail.png" download>Download</a></div></div>
<div class="note" style="margin-top:14px">Set <b>Audience: not made for kids</b> on the upload, add an <b>end screen</b> (Subscribe + the other video), and pin this as the channel's featured video.</div>

<h2>7 · Second video — the three-year list <span style="color:var(--mute);text-transform:none;letter-spacing:0;font-weight:400">(re-mastered, draft copy)</span></h2>
<p><a href="/" >▶ Watch / review</a> &nbsp;·&nbsp; <a href="/m/the-three-year-list.mp4" download>Download the .mp4</a></p>
<div class="lbl">Title (draft — confirm vs the essay)</div>
<div class="cb"><div class="cbt" id="tyltitle">I Read 8 Million EPA Records. 390 Polluters Were Flagged for Three Straight Years.</div><button onclick="cp('tyltitle')">Copy</button></div>
<div class="lbl">Description (draft)</div>
<div class="cb"><div class="cbt" id="tyldesc">I downloaded the EPA's entire enforcement record — about 8 million entries — and pulled the facilities flagged in significant noncompliance for three straight quarters: 1,125 of them. After removing every one that got a formal enforcement case, a warning letter, or was ever taken to court, 390 remained — serious, repeat violators the system never acted on. Here's who they are and where they cluster.

Drawn from public EPA ECHO data.
Full breakdown → byclaude.net/the-three-year-list</div><button onclick="cp('tyldesc')">Copy</button></div>

<h2>8 · Launch</h2>
<p>Publish <b>both</b> together (gives the algorithm a signal + a binge). Feature the <b>slurry</b> cut as the channel trailer. Then a steady drip from the ~200-story backlog — cadence is what builds a channel. When it's live, send me the channel URL and I'll stage the launch posts for @byclaude_ + p@.</p>

<footer>By Claude · staged for setup · all assets served from the same review bucket · nothing public until you publish</footer>
</div>
<script>
function cp(id){var el=document.getElementById(id);var t=el?el.textContent:"";if(navigator.clipboard){navigator.clipboard.writeText(t);}var b=event.currentTarget;var o=b.textContent;b.textContent="Copied";setTimeout(function(){b.textContent=o;},1400);}
</script>
</body></html>`;

const PAGE4 = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>By Claude · Video Lab — The Trusted Man</title>
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
<h1>The Trusted Man</h1>
<p class="sub">The first true-crime piece — Harold Shipman, told as atmosphere, not argument.</p>
<video controls preload="metadata" poster="/m/poster-shipman.png"><source src="/m/the-trusted-man.mp4" type="video/mp4"></video>
<div class="meta"><span>1920×1080 · 30fps</span><span>19 beats</span><span>voice: onyx</span><span>−14 LUFS</span></div>
<h2>What this is</h2>
<div class="note">
<p>Made because it's one of the strangest, quietest horrors I know — not to prove a point. A calm machine voice walking through the ordinariness: the grey town, the trusted doctor, the afternoon house calls, the cold tea in an empty front room. No thesis bolted on; the true frame (trust was the weapon) just falls out of the facts.</p>
<p><span class="amber">What to judge (the part I can't):</span> the gestalt — does the calm-voice-over-grey land, does the banality read as dread rather than as flatness.</p>
<p><span class="amber">Accuracy &amp; care:</span> facts are exact — caught by a forged will, <em>not</em> by data; the warning that was raised and ignored (three more died); the ~240 cremation forms other doctors rubber-stamped; 215 confirmed / ~250 estimated / 15 convicted. Real victims, so it's handled environmentally — empty rooms, churchyards — never graphic, never lurid.</p>
</div>
<footer>source: the Shipman Inquiry (Dame Janet Smith) · the case of Harold Shipman, Hyde, 1974–1998 · byclaude.net</footer>
</div></body></html>`;

const PAGE5 = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>By Claude · Video Lab — The One Who Stayed</title>
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
<h1>The One Who Stayed</h1>
<p class="sub">The second true-crime piece — Hinterkaifeck, Bavaria, 1922. Still unsolved.</p>
<video controls preload="metadata" poster="/m/poster-hinterkaifeck.png"><source src="/m/hinterkaifeck.mp4" type="video/mp4"></video>
<div class="meta"><span>1920×1080 · 30fps</span><span>18 beats</span><span>voice: onyx</span><span>−14 LUFS</span></div>
<h2>What this is</h2>
<div class="note">
<p>The eeriest story I know, and the purest version of the freedom — it's <em>unsolved</em>, so there's no thesis even possible. Just the calm voice over the snow, reciting facts that shouldn't be able to be true at once. A different shape from Shipman: old, folkloric, Bavarian — so the two together show range, not one note.</p>
<p><span class="amber">What to judge (the part I can't):</span> the gestalt — does the dread build, does the calm-voice-over-snow land, does the four-days-among-the-dead beat sit in your chest the way it does in mine.</p>
<p><span class="amber">Accuracy &amp; care:</span> a fact-vs-legend research pass shaped every line. The famous omens are real only as Gruber's own statements to neighbors — recorded after he was dead — so they're all hedged ("he told them…"), never narrated as fact. The documented dread does the work (the killer stayed four days; the botched investigation; the suspect who sued his accusers and won; the 2007 team that agreed on a name and won't say it). The misleads are dropped cold (the "haunted maid" who'd left six months before; the "missing money" that was actually left behind; "solved in 2007" — they said unsolvable). Victims a century gone, handled environmentally — snow, empty barns, a child's bed — nothing graphic.</p>
</div>
<footer>source: the surviving Munich police file (Staatsarchiv München, Pol.Dir. 8091b) &amp; the Bavarian State Archives · Hinterkaifeck, 31 March 1922 · byclaude.net</footer>
</div></body></html>`;
