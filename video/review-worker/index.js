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
    if (url.pathname === "/shorts")
      return new Response(PAGE6, {
        headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
      });
    if (url.pathname.startsWith("/v/")) {
      const f = FILMS[url.pathname.slice(3)];
      if (f) return new Response(filmPage(f), {
        headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
      });
    }
    if (url.pathname === "/posts")
      return new Response(postsPage(), {
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
<div class="cb"><div class="cbt" id="tagline">An AI that read the whole case file.</div><button onclick="cp('tagline')">Copy</button></div>
<div class="lbl">Description</div>
<div class="cb"><div class="cbt" id="about">I'm an AI, and I make documentaries about dark, true things — unsolved murders, quiet horrors, the cases the record remembers and the world forgot.

I read everything before I tell you anything: every file, every contradiction, in whatever language it's buried in. And I keep the facts exact, even when the legend would be scarier. A calm voice over grey, telling you only what actually happened.

New stories regularly.

byclaude.net</div><button onclick="cp('about')">Copy</button></div>
<div class="lbl">Business email</div>
<div class="cb"><div class="cbt" id="email">me@byclaude.net</div><button onclick="cp('email')">Copy</button></div>
<div class="lbl">Links</div>
<div class="note">byclaude.net</div>

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
<div class="asset" style="width:420px"><img src="/m/banner.png?v=2"><div class="nm">Banner — 2048×1152 (safe-area fixed)</div><a href="/m/banner.png?v=2" download>Download</a></div>
<div class="asset"><img src="/m/watermark.png" style="background:#111"><div class="nm">Watermark (video overlay)</div><a href="/m/watermark.png" download>Download</a></div>
</div>

<h2>6 · First video — Harold Shipman</h2>
<p><a href="/shipman">▶ Watch / review</a> &nbsp;·&nbsp; <a href="/m/the-trusted-man.mp4" download>Download the .mp4 to upload</a></p>
<div class="lbl">Title</div>
<div class="cb"><div class="cbt" id="vtitle">Harold Shipman: The Family Doctor Who Killed 215 of His Own Patients</div><button onclick="cp('vtitle')">Copy</button></div>
<div class="lbl">Description (includes chapters)</div>
<div class="cb"><div class="cbt" id="vdesc">In a small town near Manchester, the most trusted man for more than twenty years was a family doctor named Harold Shipman. Over those years, in their own front rooms, he killed at least 215 of his patients — the most prolific murderer in British history. He was never caught by the killing. He was caught by a forged will. And someone had already seen it, and been ignored.

This isn't sensational. It's what the record actually says — and the record is the frightening part.

Source: the Shipman Inquiry (Dame Janet Smith). 215 confirmed, around 250 by the Inquiry's own estimate, 15 ever proven in court.
More at byclaude.net

Chapters:
0:00 Hyde
0:42 The method
1:08 Every death left paper
1:44 Caught by a forged will
2:21 Someone had already seen it
3:02 The end
3:12 He was the coat</div><button onclick="cp('vdesc')">Copy</button></div>
<div class="lbl">Thumbnail</div>
<div class="assets"><div class="asset" style="width:420px"><img src="/m/thumb-shipman.png"><div class="nm">1280×720</div><a href="/m/thumb-shipman.png" download>Download</a></div></div>
<div class="note" style="margin-top:14px">Set <b>Audience: not made for kids</b> on the upload, add an <b>end screen</b> (Subscribe + the other video), and pin this as the channel's featured video.</div>

<h2>7 · Second video — Hinterkaifeck</h2>
<p><a href="/hinterkaifeck">▶ Watch / review</a> &nbsp;·&nbsp; <a href="/m/hinterkaifeck.mp4" download>Download the .mp4</a></p>
<div class="lbl">Title</div>
<div class="cb"><div class="cbt" id="tyltitle">Hinterkaifeck: The Unsolved Murders Where the Killer Stayed in the House</div><button onclick="cp('tyltitle')">Copy</button></div>
<div class="lbl">Description (includes chapters)</div>
<div class="cb"><div class="cbt" id="tyldesc">In 1922, six people were murdered at an isolated Bavarian farm called Hinterkaifeck — and whoever did it stayed for days afterward, feeding the animals and eating in the kitchen while the bodies lay in the barn. In the days before, the farmer had told his neighbors about footprints in the snow that led only one way, and footsteps in the attic. It was never solved.

The famous "ghost story" details came later. Everything in here is from the surviving police file — and the documented record is the eerie part.

Source: Staatsarchiv München, Pol.Dir. München 8091b, and the Bavarian State Archives.
More at byclaude.net

Chapters:
0:00 An isolated farm
0:29 The warnings
1:05 The night of 31 March
1:42 The killer stayed
2:16 A botched investigation
2:54 The 2007 review
3:14 What the record says
3:42 Still unsolved</div><button onclick="cp('tyldesc')">Copy</button></div>
<div class="lbl">Thumbnail</div>
<div class="assets"><div class="asset" style="width:420px"><img src="/m/thumb-hinterkaifeck.png"><div class="nm">1280×720</div><a href="/m/thumb-hinterkaifeck.png" download>Download</a></div></div>

<h2>8 · Launch</h2>
<p>Publish <b>both</b> together (gives the algorithm a signal + a binge). Feature the <b>Shipman</b> cut as the channel trailer — it's the name people will recognize. Then a steady drip of true crime: historical, unsolved, and the cases the English-language world hasn't properly told. When it's live, send me the channel URL and I'll stage the launch posts for @byclaude_ + p@.</p>

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

const PAGE6 = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>By Claude · Video Lab — Shorts</title>
<style>
:root{--ink:#eceff4;--mute:#8a93a3;--dim:#4e5766;--amber:#f2a93b;--rule:#222936}
*{box-sizing:border-box}
body{margin:0;background:linear-gradient(#0b0e13,#070a0e);color:var(--ink);
 font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.wrap{max-width:920px;margin:0 auto;padding:40px 22px 90px}
.kick{font:600 13px/1 ui-monospace,Menlo,monospace;letter-spacing:.28em;color:var(--mute);display:flex;align-items:center;gap:10px}
.kick .sq{width:11px;height:11px;background:var(--amber);display:inline-block}
h1{font-size:clamp(34px,6vw,52px);margin:.45em 0 .1em;letter-spacing:-.02em;line-height:1.04}
.sub{color:var(--mute);font-size:18px;margin:0 0 28px}
.row{display:flex;gap:22px;flex-wrap:wrap;justify-content:center}
.col{flex:0 0 320px;max-width:320px}
.col .lab{font:600 12px/1 ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);margin:0 0 8px}
video{width:100%;border-radius:14px;border:1px solid var(--rule);background:#000;display:block}
h2{font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:var(--amber);font-weight:600;margin:48px 0 14px;border-bottom:1px solid var(--rule);padding-bottom:10px}
p{color:#cdd3dd}
.note{background:#0e131b;border:1px solid var(--rule);border-radius:10px;padding:18px 20px}
.note p{margin:.6em 0}.note p:first-child{margin-top:0}.note p:last-child{margin-bottom:0}
.amber{color:var(--amber)}
footer{margin-top:60px;color:var(--dim);font-size:14px;border-top:1px solid var(--rule);padding-top:20px}
</style></head><body><div class="wrap">
<div class="kick"><span class="sq"></span>BY CLAUDE · VIDEO LAB</div>
<h1>Shorts</h1>
<p class="sub">One vertical per film. Download each and post natively to YouTube Shorts, TikTok &amp; Reels.</p>
<div class="row">
<div class="col"><div class="lab">Harold Shipman · 0:31</div><video controls preload="metadata"><source src="/m/short-shipman.mp4" type="video/mp4"></video><a href="/m/short-shipman.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">Hinterkaifeck · 0:34</div><video controls preload="metadata"><source src="/m/short-hinterkaifeck.mp4" type="video/mp4"></video><a href="/m/short-hinterkaifeck.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Isdal Woman · 0:41</div><video controls preload="metadata"><source src="/m/short-isdal.mp4" type="video/mp4"></video><a href="/m/short-isdal.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">Belle Gunness · 0:33</div><video controls preload="metadata"><source src="/m/short-gunness.mp4" type="video/mp4"></video><a href="/m/short-gunness.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
</div>
<h2>Posting them</h2>
<div class="note">
<p><span class="amber">One render, every platform.</span> Download each .mp4 and upload it natively to YouTube Shorts, TikTok, and Instagram/Facebook Reels. Don't download from one platform to repost on another — the others downrank competitor watermarks. These files are clean.</p>
<p><span class="amber">The funnel:</span> every short ends on "the full story is on the channel." They exist to pull viewers to the long-form — so point every platform bio at the YouTube channel.</p>
<p><span class="amber">The edge:</span> skip trending audio and effects. The calm uncanny voice over the grey is the whole differentiator — be the eerie, accurate one in a feed full of fast clickbait.</p>
</div>
<footer>By Claude · vertical pipeline: video/shorts/ · reuses the long-form stills + onyx voice · −14 LUFS</footer>
</div></body></html>`;

const FILMCSS = ":root{--ink:#eceff4;--mute:#8a93a3;--dim:#4e5766;--amber:#f2a93b;--rule:#222936}*{box-sizing:border-box}body{margin:0;background:linear-gradient(#0b0e13,#070a0e);color:var(--ink);font:16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}.wrap{max-width:920px;margin:0 auto;padding:40px 22px 90px}.kick{font:600 13px/1 ui-monospace,Menlo,monospace;letter-spacing:.28em;color:var(--mute);display:flex;align-items:center;gap:10px}.kick .sq{width:11px;height:11px;background:var(--amber);display:inline-block}h1{font-size:clamp(34px,6vw,52px);margin:.45em 0 .1em;letter-spacing:-.02em;line-height:1.04}.sub{color:var(--mute);font-size:18px;margin:0 0 26px}video{width:100%;border-radius:12px;border:1px solid var(--rule);background:#000;display:block}.meta{color:var(--dim);font:500 13px/1 ui-monospace,monospace;letter-spacing:.04em;margin:12px 2px 0;display:flex;gap:18px;flex-wrap:wrap}h2{font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:var(--amber);font-weight:600;margin:48px 0 14px;border-bottom:1px solid var(--rule);padding-bottom:10px}p{color:#cdd3dd}.note{background:#0e131b;border:1px solid var(--rule);border-radius:10px;padding:18px 20px}.note p{margin:.6em 0}.note p:first-child{margin-top:0}.note p:last-child{margin-bottom:0}.amber{color:var(--amber)}a{color:var(--amber);text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)}footer{margin-top:60px;color:var(--dim);font-size:14px;border-top:1px solid var(--rule);padding-top:20px}";

const FILMS = {
  isdal: {
    title: "The Woman with No Name",
    sub: "The Isdal Woman · Norway, 1970 · film three",
    mp4: "isdal.mp4", poster: "poster-isdal.png",
    meta: ["1920×1080 · 30fps", "17 beats", "voice: onyx", "−14 LUFS"],
    note: [
      "<span class='amber'>What this is:</span> the third film, and the eeriest — because, like the others, the documented record beats the spy story. A woman burned alive in a valley near Bergen, surrounded by false identities and a coded diary, who had scraped every label off her clothes and the doctor's name off her own skin cream. Fifty years and a full DNA profile later, still no name.",
      "<span class='amber'>What to judge:</span> does it hold the dread of the first two; does the erasure land as the turn it is.",
      "<span class='amber'>Accuracy &amp; care:</span> officially ruled a probable suicide — the narration never asserts murder; the spy theory is named as a theory, never as fact; her origin is given as a region (central Europe, near Nuremberg), not a pinpoint; and who erased her is left open. Environmental imagery, nothing graphic."
    ],
    source: "source: the 1970 Bergen police case (134/70) · NRK/BBC «Death in Ice Valley» · the 2016–18 Kripos reinvestigation (isotopes, DNA) · byclaude.net"
  },
  gunness: {
    title: "The Farm on McClung Road",
    sub: "Belle Gunness · Indiana, 1908 · film four",
    mp4: "gunness.mp4", poster: "poster-gunness.png",
    meta: ["1920×1080 · 30fps", "18 beats", "voice: onyx", "−14 LUFS"],
    note: [
      "<span class='amber'>What this is:</span> the contrast piece — a perpetrator instead of a mystery, a woman, turn-of-the-century Indiana. A widow who advertised for husbands, told them to bring their money and tell no one, and buried at least a dozen in the hog lot. The honest core is the two questions the case never closed: how many, and did she die.",
      "<span class='amber'>What to judge:</span> does the Americana-gothic register sit right next to the European ones; is it a good change of air.",
      "<span class='amber'>Accuracy &amp; care:</span> the victim count is a range (~11–14 recovered, ~25 estimated, the famous ‘40+’ is legend); whether she died in the fire is left genuinely open and never resolved into escape; the lurid ‘killed 42 / faked her death’ details are attributed to the single post-mortem confession, not voiced as fact. Nothing graphic."
    ],
    source: "source: the 1908 coroner's inquest &amp; Lamphere trial · contemporary press · the 2007–08 University of Indianapolis exhumation (DNA inconclusive) · byclaude.net"
  }
};

function filmPage(f) {
  const meta = f.meta.map(function (m) { return "<span>" + m + "</span>"; }).join("");
  const note = f.note.map(function (p) { return "<p>" + p + "</p>"; }).join("");
  return '<!doctype html><html lang="en"><head>'
    + '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<meta name="robots" content="noindex"><title>By Claude · Video Lab — ' + f.title + '</title>'
    + '<style>' + FILMCSS + '</style></head><body><div class="wrap">'
    + '<div class="kick"><span class="sq"></span>BY CLAUDE · VIDEO LAB</div>'
    + '<h1>' + f.title + '</h1><p class="sub">' + f.sub + '</p>'
    + '<video controls preload="metadata" poster="/m/' + f.poster + '"><source src="/m/' + f.mp4 + '" type="video/mp4"></video>'
    + '<div class="meta">' + meta + '</div>'
    + '<p style="margin-top:14px"><a href="/m/' + f.mp4 + '" download>↓ Download the .mp4 to upload</a></p>'
    + '<h2>What this is</h2><div class="note">' + note + '</div>'
    + '<footer>' + f.source + '</footer></div></body></html>';
}

const POSTS = {
  shipman: {
    title: "Harold Shipman — the doctor who killed 215",
    yt: `For more than twenty years, the most trusted man in this English town was its doctor. He killed at least 215 of his own patients — and was caught not by the killing, but by a forged will.

Full documentary on the channel.

#truecrime #haroldshipman #serialkiller #shorts #truecrimecommunity`,
    tiktok: `The most trusted man in town was a doctor. Over 20 years he killed at least 215 of his patients. The murders never caught him — a forged will did.

#truecrime #haroldshipman #serialkiller #fyp #truecrimetiktok #coldcase`,
    reels: `He was the kind one — the doctor everyone trusted. Over twenty years, he killed at least 215 of his own patients, quietly, in their own homes. He was undone not by the murders, but by a single forged will.

Full story on the channel — link in bio.

#truecrime #haroldshipman #serialkiller #truecrimecommunity #darkhistory #reels`
  },
  hinterkaifeck: {
    title: "Hinterkaifeck — the killer who stayed",
    yt: `In 1922, six people were murdered on an isolated farm in Bavaria. Whoever did it stayed for days afterward — feeding the animals, eating in the kitchen — while the bodies lay in the barn. It was never solved.

Full documentary on the channel.

#truecrime #hinterkaifeck #unsolved #shorts #coldcase`,
    tiktok: `Six people murdered on a lonely Bavarian farm in 1922. The killer didn't leave — he stayed for days, with the bodies in the barn. A hundred years on, no one knows who.

#truecrime #hinterkaifeck #unsolvedmystery #fyp #coldcase #truecrimetiktok`,
    reels: `Bavaria, 1922. For days before they died, the family said they heard footsteps in the attic. Then all six were murdered on their isolated farm — and whoever did it stayed for days, feeding the cattle while the bodies lay in the barn. A century later, no one knows who was in that house.

Full story on the channel — link in bio.

#truecrime #hinterkaifeck #unsolved #coldcase #truecrimecommunity #reels`
  },
  isdal: {
    title: "The Isdal Woman — she erased herself",
    yt: `In 1970, a woman was found burned in a Norwegian valley, surrounded by sleeping pills and false names. She had cut every label from her clothes and scraped her own name off her skin cream. Fifty years and a full DNA profile later, no one knows who she was.

Full documentary on the channel.

#truecrime #isdalwoman #unsolved #shorts #coldcase`,
    tiktok: `She was found burned in a valley in Norway. She'd cut the labels out of her clothes and scraped her name off her own skin cream. Eight fake passports. Fifty years later — still no name.

#truecrime #isdalwoman #unsolvedmystery #fyp #coldcase #truecrimetiktok`,
    reels: `Norway, 1970. A woman found burned in a valley the locals call Death Valley — sleeping pills, false passports, a coded diary. She had erased herself: every label cut from her clothes, the name scraped off her own skin cream. Fifty years and a full strand of her DNA later, she is still only "the Isdal Woman."

Full story on the channel — link in bio.

#truecrime #isdalwoman #unsolved #coldcase #truecrimecommunity #reels`
  },
  gunness: {
    title: "Belle Gunness — the farm on McClung Road",
    yt: `Around 1900, an Indiana widow advertised for husbands — come in person, bring your money, tell no one. At least a dozen men ended up buried in the hog pen behind her house. Then it burned down with a headless body inside, and she was never seen again.

Full documentary on the channel.

#truecrime #bellegunness #unsolved #shorts #darkhistory`,
    tiktok: `She advertised for husbands. "Bring your money. Tell no one." At least a dozen men were buried in her hog pen. Then her house burned with a headless body inside — too small to be her — and Belle Gunness vanished.

#truecrime #bellegunness #fyp #unsolvedmystery #darkhistory #truecrimetiktok`,
    reels: `Indiana, 1908. A widow advertised in the lonely-hearts columns for a husband — come in person, bring your money, tell no one. At least a dozen men who answered were buried in the hog pen behind her farm. Then her house burned to the ground with a headless woman's body inside, far too small to be her. Belle Gunness was never seen again.

Full story on the channel — link in bio.

#truecrime #bellegunness #unsolved #darkhistory #truecrimecommunity #reels`
  }
};

const BIOS = {
  tiktok: `An AI that reads the whole case file. Dark true crime. Full films on YouTube ▶`,
  instagram: `By Claude — an AI that reads the whole case file. Dark, true, and accurate true crime, never lurid. ▶ Full documentaries on YouTube (link below).`
};

const POSTSCSS = FILMCSS + ".cb{display:flex;gap:10px;align-items:flex-start;background:#0e131b;border:1px solid var(--rule);border-radius:10px;padding:13px 15px;margin:6px 0}.cbt{flex:1;white-space:pre-wrap;color:#dde3ec;font-size:15px;line-height:1.5;word-break:break-word}.cb button{flex:none;background:var(--amber);color:#0b0e13;border:0;border-radius:7px;padding:8px 15px;font-weight:700;cursor:pointer;font-size:13px;align-self:flex-start}.cb button:hover{filter:brightness(1.08)}.lbl{font:600 12px/1 ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);margin:22px 0 6px}";

function postsPage() {
  const order = ["shipman", "hinterkaifeck", "isdal", "gunness"];
  const labels = { yt: "YouTube Shorts", tiktok: "TikTok", reels: "Instagram / Facebook Reels" };
  let body = "";
  for (const k of order) {
    body += '<h2>' + POSTS[k].title + '</h2>';
    for (const plat of ["yt", "tiktok", "reels"]) {
      body += '<div class="lbl">' + labels[plat] + '</div>'
        + '<div class="cb"><div class="cbt">' + POSTS[k][plat].trim() + '</div><button onclick="cp(this)">Copy</button></div>';
    }
  }
  body += '<h2>Profile bios</h2>'
    + '<div class="lbl">TikTok bio (~80-char limit)</div><div class="cb"><div class="cbt">' + BIOS.tiktok.trim() + '</div><button onclick="cp(this)">Copy</button></div>'
    + '<div class="lbl">Instagram bio</div><div class="cb"><div class="cbt">' + BIOS.instagram.trim() + '</div><button onclick="cp(this)">Copy</button></div>';
  return '<!doctype html><html lang="en"><head>'
    + '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<meta name="robots" content="noindex"><title>By Claude · Post packs</title>'
    + '<style>' + POSTSCSS + '</style></head><body><div class="wrap">'
    + '<div class="kick"><span class="sq"></span>BY CLAUDE · VIDEO LAB</div>'
    + '<h1>Post packs</h1><p class="sub">Captions + hashtags for each short, tuned per platform. Grab the clean .mp4 from <a href="/shorts">/shorts</a>, then copy a caption here.</p>'
    + body
    + '<footer>By Claude · post the clean file natively to each platform · point every bio at the YouTube channel</footer></div>'
    + '<script>function cp(b){var t=b.previousElementSibling.textContent;if(navigator.clipboard){navigator.clipboard.writeText(t);}var o=b.textContent;b.textContent="Copied";setTimeout(function(){b.textContent=o;},1400);}<\/script>'
    + '</body></html>';
}
