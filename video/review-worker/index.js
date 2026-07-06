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

<h2>8 · Third video — The Isdal Woman</h2>
<p><a href="/isdal">▶ Watch / review</a> &nbsp;·&nbsp; <a href="/m/isdal.mp4" download>Download the .mp4</a></p>
<div class="lbl">Title</div>
<div class="cb"><div class="cbt" id="isdaltitle">The Isdal Woman: The Body Norway Has Never Been Able to Name</div><button onclick="cp('isdaltitle')">Copy</button></div>
<div class="lbl">Description (includes chapters)</div>
<div class="cb"><div class="cbt" id="isdaldesc">In November 1970, a hiker found a burned woman's body in a valley outside Bergen, Norway — surrounded by sleeping pills, jewelry placed beside her, and petrol bottles. Two suitcases waiting at the train station held eight passports, none real, a diary written in code, and cash in four currencies. Every label had been cut from her clothes. Even the sticker on her tube of skin cream — the one that would have named her doctor, and her — had been carefully scraped away.

This isn't a spy story. It's what the police file actually says — and the effort someone made to erase her is the frightening part.

Source: the 1970 Bergen police case (134/70), the NRK/BBC investigation "Death in Ice Valley," and the 2016–18 Kripos DNA reinvestigation.
More at byclaude.net

Chapters:
0:00 The Ice Valley
0:14 A body among the rocks
0:44 Someone wanted her to burn
1:13 The suitcases at the station
1:48 Eight names, none real
2:12 A diary in code
2:40 A full DNA profile
3:06 Still unidentified</div><button onclick="cp('isdaldesc')">Copy</button></div>
<div class="lbl">Thumbnail</div>
<div class="assets"><div class="asset" style="width:420px"><img src="/m/thumb-isdal.png"><div class="nm">1280×720</div><a href="/m/thumb-isdal.png" download>Download</a></div></div>

<h2>9 · Fourth video — Belle Gunness</h2>
<p><a href="/gunness">▶ Watch / review</a> &nbsp;·&nbsp; <a href="/m/gunness.mp4" download>Download the .mp4</a></p>
<div class="lbl">Title</div>
<div class="cb"><div class="cbt" id="gunnesstitle">Belle Gunness: The Farm Where at Least a Dozen Men Disappeared</div><button onclick="cp('gunnesstitle')">Copy</button></div>
<div class="lbl">Description (includes chapters)</div>
<div class="cb"><div class="cbt" id="gunnessdesc">Around 1900, an Indiana widow named Belle Gunness advertised for husbands in Norwegian-language newspapers — come in person, bring your money, tell no one. Bank ledgers show what happened to the men who answered: they mortgaged farms and withdrew their savings, and were never heard from again. When a brother forced the investigation open in 1908, the sheriff dug at least eleven bodies from the hog lot behind her house. Days earlier, her farmhouse had burned to the ground with a headless woman's body inside — too small, doctors said, to be her.

This isn't sensational. It's what the coroner's inquest, the bank ledgers, and a 2007 exhumation actually found — and the case is still, genuinely, unresolved.

Source: the 1908 coroner's inquest and the Ray Lamphere trial, contemporary press coverage, and the 2007–08 University of Indianapolis exhumation.
More at byclaude.net

Chapters:
0:00 The farm on McClung Road
0:13 Bring your money, tell no one
1:02 Every death was insured
1:19 The dig begins
1:50 The fire
2:17 Too small to be her
2:37 A confession, never tested
3:21 Never closed</div><button onclick="cp('gunnessdesc')">Copy</button></div>
<div class="lbl">Thumbnail</div>
<div class="assets"><div class="asset" style="width:420px"><img src="/m/thumb-gunness.png"><div class="nm">1280×720</div><a href="/m/thumb-gunness.png" download>Download</a></div></div>

<h2>10 · Launch &amp; cadence</h2>
<p>Shipman + Hinterkaifeck are live on the channel. Isdal + Gunness are posting via Publer on a fixed evening cadence (below) — no manual upload needed for these two. Feature the <b>Shipman</b> cut as the channel trailer — it's the name people will recognize. Then a steady drip of true crime: historical, unsolved, and the cases the English-language world hasn't properly told.</p>

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
<h2 style="margin-top:14px">Native shorts</h2>
<p class="sub" style="margin-bottom:18px">Made for short-form directly — no parent film. A separate lane from the cut-downs below.</p>
<div class="row">
<div class="col"><div class="lab">The Lead Masks Case · 0:40</div><video controls preload="metadata"><source src="/m/short-leadmasks.mp4" type="video/mp4"></video><a href="/m/short-leadmasks.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The YOGTZE Case · 1:09</div><video controls preload="metadata"><source src="/m/short-yogtze.mp4" type="video/mp4"></video><a href="/m/short-yogtze.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Dancing Plague · 1:08</div><video controls preload="metadata"><source src="/m/short-dancingplague.mp4" type="video/mp4"></video><a href="/m/short-dancingplague.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">Elisa Lam · 0:38</div><video controls preload="metadata"><source src="/m/short-elisalam.mp4" type="video/mp4"></video><a href="/m/short-elisalam.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Somerton Man · 0:40</div><video controls preload="metadata"><source src="/m/short-somertonman.mp4" type="video/mp4"></video><a href="/m/short-somertonman.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Max Headroom Incident · 0:38</div><video controls preload="metadata"><source src="/m/short-maxheadroom.mp4" type="video/mp4"></video><a href="/m/short-maxheadroom.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Sodder Children · 0:38</div><video controls preload="metadata"><source src="/m/short-sodder.mp4" type="video/mp4"></video><a href="/m/short-sodder.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Watcher · 0:31</div><video controls preload="metadata"><source src="/m/short-watcher.mp4" type="video/mp4"></video><a href="/m/short-watcher.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Circleville Letter Writer · 0:35</div><video controls preload="metadata"><source src="/m/short-circleville.mp4" type="video/mp4"></video><a href="/m/short-circleville.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Mary Celeste · 0:31</div><video controls preload="metadata"><source src="/m/short-maryceleste.mp4" type="video/mp4"></video><a href="/m/short-maryceleste.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Valentich Disappearance · 0:30</div><video controls preload="metadata"><source src="/m/short-valentich.mp4" type="video/mp4"></video><a href="/m/short-valentich.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Yuba County Five · 0:32</div><video controls preload="metadata"><source src="/m/short-yubacountyfive.mp4" type="video/mp4"></video><a href="/m/short-yubacountyfive.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">Kaspar Hauser · 1:13</div><video controls preload="metadata"><source src="/m/short-kasparhauser.mp4" type="video/mp4"></video><a href="/m/short-kasparhauser.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Wych Elm Case · 1:01</div><video controls preload="metadata"><source src="/m/short-wychelm.mp4" type="video/mp4"></video><a href="/m/short-wychelm.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Devil's Footprints · 1:04</div><video controls preload="metadata"><source src="/m/short-devilsfootprints.mp4" type="video/mp4"></video><a href="/m/short-devilsfootprints.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">Before Edison · 1:14</div><video controls preload="metadata"><source src="/m/short-leprince.mp4" type="video/mp4"></video><a href="/m/short-leprince.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Wallace Case · 1:03</div><video controls preload="metadata"><source src="/m/short-wallace.mp4" type="video/mp4"></video><a href="/m/short-wallace.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">Peking Man · 1:03</div><video controls preload="metadata"><source src="/m/short-pekingman.mp4" type="video/mp4"></video><a href="/m/short-pekingman.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Springfield Three · 0:32</div><video controls preload="metadata"><source src="/m/short-springfieldthree.mp4" type="video/mp4"></video><a href="/m/short-springfieldthree.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Vela Incident · 0:30</div><video controls preload="metadata"><source src="/m/short-vela.mp4" type="video/mp4"></video><a href="/m/short-vela.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Wow! Signal · 0:31</div><video controls preload="metadata"><source src="/m/short-wowsignal.mp4" type="video/mp4"></video><a href="/m/short-wowsignal.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Roanoke Colony · 0:37</div><video controls preload="metadata"><source src="/m/short-roanoke.mp4" type="video/mp4"></video><a href="/m/short-roanoke.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">Oak Island Money Pit · 0:32</div><video controls preload="metadata"><source src="/m/short-oakisland.mp4" type="video/mp4"></video><a href="/m/short-oakisland.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">UVB-76 · The Buzzer · 0:30</div><video controls preload="metadata"><source src="/m/short-uvb76.mp4" type="video/mp4"></video><a href="/m/short-uvb76.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Tunguska Event · 0:36</div><video controls preload="metadata"><source src="/m/short-tunguska.mp4" type="video/mp4"></video><a href="/m/short-tunguska.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Phantom of Heilbronn · 0:28</div><video controls preload="metadata"><source src="/m/short-phantomheilbronn.mp4" type="video/mp4"></video><a href="/m/short-phantomheilbronn.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">Lars Mittank · 0:39</div><video controls preload="metadata"><source src="/m/short-larsmittank.mp4" type="video/mp4"></video><a href="/m/short-larsmittank.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Beaumont Children · 0:37</div><video controls preload="metadata"><source src="/m/short-beaumont.mp4" type="video/mp4"></video><a href="/m/short-beaumont.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
</div>
<h2>Cut-downs from long films</h2>
<div class="row">
<div class="col"><div class="lab">Harold Shipman · 0:31</div><video controls preload="metadata"><source src="/m/short-shipman.mp4" type="video/mp4"></video><a href="/m/short-shipman.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">Hinterkaifeck · 0:34</div><video controls preload="metadata"><source src="/m/short-hinterkaifeck.mp4" type="video/mp4"></video><a href="/m/short-hinterkaifeck.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Isdal Woman · 0:41</div><video controls preload="metadata"><source src="/m/short-isdal.mp4" type="video/mp4"></video><a href="/m/short-isdal.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">Belle Gunness · 0:33</div><video controls preload="metadata"><source src="/m/short-gunness.mp4" type="video/mp4"></video><a href="/m/short-gunness.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">Twenty Days · 0:32</div><video controls preload="metadata"><source src="/m/short-courrieres.mp4" type="video/mp4"></video><a href="/m/short-courrieres.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Monster with 21 Faces · 0:33</div><video controls preload="metadata"><source src="/m/short-glicomorinaga.mp4" type="video/mp4"></video><a href="/m/short-glicomorinaga.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">Six Employees, Six Continents · 0:28</div><video controls preload="metadata"><source src="/m/short-surgisphere.mp4" type="video/mp4"></video><a href="/m/short-surgisphere.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Confession That Came Too Late · 0:35</div><video controls preload="metadata"><source src="/m/short-hwaseong.mp4" type="video/mp4"></video><a href="/m/short-hwaseong.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
<div class="col"><div class="lab">The Nurse and the Number · 0:30</div><video controls preload="metadata"><source src="/m/short-deberk.mp4" type="video/mp4"></video><a href="/m/short-deberk.mp4" download style="display:inline-block;margin-top:9px;color:#f2a93b;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(242,169,59,.3)">↓ download .mp4</a></div>
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
  },
  courrieres: {
    title: "Twenty Days",
    sub: "The Courrières mine disaster · France, 1906 · film five",
    mp4: "twenty-days.mp4", poster: "poster-courrieres.png",
    meta: ["1920×1080 · 30fps", "20 beats", "voice: onyx", "−14 LUFS"],
    note: [
      "<span class='amber'>What this is:</span> a real accountability story, not a mystery — Europe's worst mining disaster, still the record 120 years later. The company sealed the mine and gave up the search, believing no one below could still be alive. Twenty days later, thirteen men walked out on their own. No one — not the engineers, not the company — was ever found responsible, for the disaster or the decision to seal it.",
      "<span class='amber'>What to judge:</span> does the record-vs-memory motif (established in Shipman) carry to an institutional villain instead of an individual one; does the strike/troops thread earn its place without turning into a labor-history lecture.",
      "<span class='amber'>Accuracy &amp; care:</span> death toll (1,099), survivor count (13, ages 14–40), and the 20-day figure are all cross-verified across multiple independent French/English sources; the disputed details (exact rescue-halt date, exact troop count) are given as ranges, not false precision. Nothing graphic — no depiction of the dead."
    ],
    source: "source: French/English Wikipedia + Archives départementales du Pas-de-Calais + Robert Neville, 'The Courrières Colliery Disaster, 1906' (J. Contemp. Hist. 1978) · byclaude.net"
  },
  glicomorinaga: {
    title: "The Monster with 21 Faces",
    sub: "Glico-Morinaga case · Japan, 1984–85 · film six",
    mp4: "the-monster-with-21-faces.mp4", poster: "poster-glicomorinaga.png",
    meta: ["1920×1080 · 30fps", "19 beats", "voice: onyx", "−14 LUFS"],
    note: [
      "<span class='amber'>What this is:</span> the second genuinely unsolved case on the channel, and the first non-Anglophone one — real cyanide candy on real shelves with the group's own warning labels, a police composite that a 2024 retrospective says never looked like the real man, and a case that didn't end in a confession but in a statute of limitations running out at midnight.",
      "<span class='amber'>What to judge:</span> does the cross-language/foreign-case register land distinctly from the European true-crime films; does the eerie-not-lurid tone hold on a genuinely bizarre case (the forgiveness letter, the '4-year-old who cries').",
      "<span class='amber'>Accuracy &amp; care:</span> confirmed — no one was ever poisoned by the marked candy (multiple independent sources); the Shiga police superintendent's real name and the manner/date of his death are documented, not invented; the 'why 21 not 20' question is left open because no source ever answers it. Nothing graphic."
    ],
    source: "source: Japanese &amp; English Wikipedia · Kobe Shimbun 40th-anniversary retrospective (2024) · monsterwith21faces.com case archive · byclaude.net"
  },
  surgisphere: {
    title: "Six Employees, Six Continents",
    sub: "The Surgisphere scandal · 2020 · film seven",
    mp4: "six-employees-six-continents.mp4", poster: "poster-surgisphere.png",
    meta: ["1920×1080 · 30fps", "19 beats", "voice: onyx", "−14 LUFS"],
    note: [
      "<span class='amber'>What this is:</span> a departure from true crime into 'science correcting itself' — how a company with six employees and no real data pipeline supplied a 96,000-patient study to two of the world's most trusted medical journals, changed WHO's COVID policy within days, and got fully retracted 13 days after publication.",
      "<span class='amber'>What to judge:</span> does the clinical, unhurried register work on an institutional-failure story instead of a death; does the closing 'I checked' line land as observation, not editorializing.",
      "<span class='amber'>Accuracy &amp; care:</span> every number (96,032 patients, 671 hospitals, 201 open-letter signatories, 13 days to retraction) is drawn directly from the retraction notices and the open letter itself, not paraphrase; the Desai/Patel marriage detail is publicly reported, not speculative. The company's website was independently re-checked as dead in 2026, not asserted from an old source."
    ],
    source: "source: Lancet &amp; NEJM retraction notices · Watson et al. open letter (Zenodo) · The Guardian's June 2020 investigation · byclaude.net"
  },
  deberk: {
    title: "The Nurse and the Number",
    sub: "Lucia de Berk · The Netherlands, 2001–2010 · film eight",
    mp4: "the-nurse-and-the-number.mp4", poster: "poster-deberk.png",
    meta: ["1920×1080 · 30fps", "19 beats", "voice: onyx", "−14 LUFS"],
    note: [
      "<span class='amber'>What this is:</span> a second 'science correcting itself' piece, and the most on-brand story the channel has found — a Dutch pediatric nurse convicted of seven murders on the strength of a single number: one-in-342-million odds that her presence at a cluster of ward deaths was coincidence. A philosopher of science checked the arithmetic. The same data, calculated correctly, gave one in forty-four.",
      "<span class='amber'>What to judge:</span> does a wrongful-conviction-by-bad-math story land with the same weight as the crime films; does the 'only the arithmetic changed' closing line read as observation, not a lecture.",
      "<span class='amber'>Accuracy &amp; care:</span> the original 1-in-342-million figure and the corrected 1-in-44 figure (from Richard Gill and Piet Groeneboom's re-analysis), the conviction counts (4+3 in 2003, revised to 7+3 on appeal in 2004), the digoxin retest, and the April 14, 2010 acquittal are drawn from the case record as summarized for this film. Compensation is reported precisely: a disclosed €45,000 hospital settlement, plus a separate prosecution-service settlement whose amount was never made public — the film says so rather than guessing a figure. De Berk died in August 2025, reported respectfully and only as a fact of the record — she is the one person in this film who was never at fault."
    ],
    source: "source: the Dutch court record (District Court of The Hague, Arnhem Court of Appeal, Dutch Supreme Court) · Ton Derksen's 2006 book 'Lucia de B.' · the statistical re-analysis by Richard Gill, Piet Groeneboom, and Peter de Jong · byclaude.net"
  },
  hwaseong: {
    title: "The Confession That Came Too Late",
    sub: "Hwaseong murders &amp; Yoon Sung-yeo · South Korea, 1986–2020 · film nine",
    mp4: "the-confession-that-came-too-late.mp4", poster: "poster-hwaseong.png",
    meta: ["1920×1080 · 30fps", "19 beats", "voice: onyx", "−14 LUFS"],
    note: [
      "<span class='amber'>What this is:</span> a true-crime case with a second, quieter injustice buried inside it — ten murders in rural South Korea and a killer finally identified by DNA in 2019, thirty-three years too late for the law's own statute of limitations to touch him. One of the ten had already produced a wrongful conviction in 1989: a young man named Yoon Sung-yeo, coerced into a false confession — the forced squat-jumps made crueler by a childhood bout of polio — who served twenty years before the real killer's own confession cleared him in 2020.",
      "<span class='amber'>What to judge:</span> does the double-accountability structure (the guilty man untouchable, the innocent man finally freed) land clearly without needing a stated thesis; does the cross-language register (the channel's second Asian case) sit consistently with Glico-Morinaga's.",
      "<span class='amber'>Accuracy &amp; care:</span> the victim count (10, 1986–1991), the 15-year statute of limitations and its 2006 expiry, Lee Choon-jae's September 2019 DNA identification and his confession to 14 murders, and Yoon Sung-yeo's coerced 1989 confession, 20-year sentence, and December 17, 2020 acquittal are drawn from the case record as summarized for this film. The March 2021 compensation (2.517 billion won, ~$2.2 million) is Korea's confirmed statutory maximum for his wrongful imprisonment, not an estimate; a separate 2022 civil suit added roughly $1.4 million more. Nothing graphic — no depiction of any victim."
    ],
    source: "source: the Suwon District Court retrial ruling (Dec. 2020) · formal apologies from Korean prosecutors and the National Police Agency (Nov.–Dec. 2020) · byclaude.net"
  },
  beaumont: {
    title: "The Five-Minute Bus Ride",
    sub: "The Beaumont Children · Adelaide, 1966 · film eleven · Opus arm",
    mp4: "beaumont.mp4", poster: "poster-beaumont.png",
    meta: ["1920×1080 · 30fps", "20 beats", "voice: onyx", "−14 LUFS"],
    note: [
      "<span class='amber'>What this is:</span> the case that haunts a country. Australia Day, 1966. Three siblings — Jane nine, Arnna seven, Grant four — took a five-minute bus ride to Glenelg Beach and never came home. The largest investigation in Australian history found nothing. The parents kept the same phone number for decades, in case the children called. Jim died in 2023 at ninety-seven. Nancy in 2019 at ninety-two. They were buried knowing nothing. No one has ever been charged.",
      "<span class='amber'>What to judge:</span> the long-form weight, not the short hook — does the family-who-waited arc carry across twenty beats without sagging; does the £1 bakery beat land as the uncanny detail it is; does the cultural-weight close (\"before, children played at the beach; after, they did not\") feel earned rather than narrated at.",
      "<span class='amber'>Accuracy &amp; care:</span> the date (26 Jan 1966), the children's ages and middle names, the family address (109 Harding Street, Somerton Park), the bus times (8:45 out, noon expected), the bakery purchase (£1 note vs 6/6d given), the suspect description, the postman sighting (later retracted as to time of day), the Croiset psychic excavation (1966 + 1996 re-search), and the parents' deaths (Nancy 2019, Jim 2023) are drawn from the South Australian Police file as summarized in Wikipedia, ABC News, and Casefile Ep. 100. The \"Adelaide pedophile ring\" framing was NOT used — it is media theorising, not a court or inquest finding. The cultural change framing is qualified in the film itself ('the story is more complex than that — but the change was real'). Nothing graphic — no depiction of any victim."
    ],
    source: "source: South Australia Police case file (1966–) · Wikipedia, 'Disappearance of the Beaumont children' · ABC News (2018 reward renewal) · Casefile podcast Ep. 100 · byclaude.net"
  },
  nofarmers: {
    title: "No Farmers",
    sub: "The first English settlers · 1587–1621 · film twelve",
    mp4: "nofarmers.mp4", poster: "poster-nofarmers.png",
    meta: ["1920×1080 · 30fps", "18 beats", "voice: onyx", "−14 LUFS"],
    note: [
      "<span class='amber'>What this is:</span> the channel's first proper history piece (not true crime, not gov-data accountability). The question Patrick asked after the Roanoke short: who were the earliest English settlers — not as a category ('pilgrims') but as a list of specific jobs. The thesis that emerges from the primary sources is structural: the same English settlement project kept sending people who couldn't feed themselves. Roanoke vanished. Jamestown landed a hundred and four people with fifty gentlemen and not one farmer, and lost sixty-six of them the first winter. Plymouth landed a silk-weaver, a printer, a cooper, a hatter — and held.",
      "<span class='amber'>What to judge:</span> does the walks-of-life thesis carry the film without becoming a lecture; do the two primary-source epigraph cards (Smith's plea to the Virginia Company, Bradford's 'no friends to welcome them') land with the restraint the rest of the channel uses for true-crime quotes; is the new 'epigraph' card kind (large quote body + amber rule + small mono attribution) a good addition to the house style or a departure from it.",
      "<span class='amber'>Accuracy &amp; care:</span> every load-bearing fact was verified against primary or best-secondary source before drafting. Jamestown manifest (104 settlers, ~50 gentlemen, no farmers, 6 carpenters, 2 bricklayers, 2 surgeons, 1 blacksmith, 1 barber, 1 minister, 1 drummer, 12 labourers) from Smith's <i>Generall Historie</i> (1624) Book III, cross-checked against Virtual Jamestown + the List of Jamestown colonists. First-winter mortality (38 of 104 survived by Jan 1608) from Smith. Smith's 'send but thirty carpenters...' epigraph is verbatim from <i>Generall Historie</i> (1624) Book III, ~pp. 71-72 of the 1624 first edition (Internet Archive scan). Bradford's 'no friends to welcome them...' epigraph is verbatim from <i>Of Plymouth Plantation</i>, Book II Ch. IX (Morison modernized ed.; original-spelling text on Project Gutenberg #24950). Mayflower passenger trades (Bradford = silk-weaver, Brewster = printer, Winslow = printer's apprentice, Alden = cooper, Priest = hatter) verified against Caleb Johnson's mayflowerhistory.com — corrected three common confusions in the secondary literature (Bradford was NOT a fustian/velvet worker; Allerton was NOT a tailor; Fuller was the surgeon not a silk-maker). The ~50/50 Saints/Strangers split is the defensible scholarly consensus (Bradford never published a head-count). Nothing graphic — the Starving Time is named but the cannibalism passage is omitted as off-thesis."
    ],
    source: "source: John Smith, <i>Generall Historie of Virginia</i> (1624) · William Bradford, <i>Of Plymouth Plantation</i> (1651 MS) · Caleb Johnson's mayflowerhistory.com · Virtual Jamestown · byclaude.net"
  },
  pennsauken: {
    title: "Below the Waterline",
    sub: "The Main Street Bridge (NBI NJ-03B4610) · Burlington County, New Jersey · film ten",
    mp4: "below-the-waterline.mp4", poster: "poster-pennsauken.png",
    meta: ["1920×1080 · 30fps", "20 beats", "voice: onyx", "−14 LUFS"],
    note: [
      "<span class='amber'>What this is:</span> a new genre for the channel — a gov-data accountability documentary in the same single-case shape as the true-crime films, except the 'villain' is deferred maintenance, not a person. A 1912 county arch bridge in Burlington County, NJ was emergency-closed in March 2023 after engineers lowered the creek beneath it and found the piling structure rotted below the waterline. It was reinforced and reopened as a stopgap. Three years later, its substructure carries the worst rating of any bridge in the batch this channel's data pipeline reviewed, still flagged scour-critical, with no funded permanent fix on record.",
      "<span class='amber'>What to judge:</span> does the institutional-neglect frame land with the same weight as a human villain; does 'an AI counts what the system was built not to count' read as an honest premise rather than a stretch, on a real, named, still-in-use structure.",
      "<span class='amber'>Accuracy &amp; care:</span> every claim traces to the National Bridge Inventory record for NBI ID NJ-03B4610, verified via the bridge-story-engine's two-tier pipeline (Sonnet-5 wide scout → adversarial frontier verify), calibrated at 0 false negatives across a 98-bridge batch run 2026-06-22 — the 1912 build year, the March 2023 closure and stopgap reopening (drawn from contemporaneous Patch/The Sun coverage), the current 'Serious' substructure rating and scour-critical flag, the absent funded replacement project, and the 11,669-vehicles-a-day/4%-truck 2023 count are all as verified. Checked and confirmed distinct from the unrelated, much-covered 'CR 537 West Main Street Corridor' project in Monmouth County (Freehold) — different bridge, county, and river. No claim predicts failure or collapse; every line is about the record itself — the rating, the flag, the absence of a funded plan."
    ],
    source: "source: National Bridge Inventory (FHWA) · bridge-story-engine two-tier verification (2026-06-22) · spring 2023 local coverage (Patch, The Sun) · byclaude.net"
  },
  crossedfirst: {
    title: "Crossed First",
    sub: "Before the settlers · 1584–1619 · cross-model bake-off, independent arm",
    mp4: "crossedfirst.mp4", poster: "poster-crossedfirst.png",
    meta: ["1920×1080 · 30fps", "21 beats", "voice: ballad", "−14 LUFS"],
    note: [
      "<span class='amber'>What this is:</span> Patrick asked the same question of two models independently, blind to each other's work — 'who were the earliest settlers, walks of life and all' — after the Roanoke short. This is the deliberately different angle: instead of the trades-manifest thesis (the sibling arm, 'No Farmers'), this one follows three people the standard story erases from 'settler' entirely. Manteo and Wanchese, two Croatoan men carried to London in 1584 — before any English family had settled this coast — the first Native Americans to cross the Atlantic, going the other way first. Joachim Gans, a Jewish metallurgist from Prague who ran what historians call the first science lab in North America, at Fort Raleigh in 1585, twenty-two years before Jamestown existed. And the twenty-and-odd Angolans sold off the White Lion at Point Comfort in August 1619, three weeks after that same colony held its first elected assembly. First voice test of OpenAI's 'ballad' — warmer and more human than the channel's usual onyx, matched to a register that isn't true-crime dread.",
      "<span class='amber'>What to judge:</span> does 'ballad' actually read differently from onyx, and does the warmth suit forgotten-history the way onyx's coldness suits true crime; does a three-thread structure (Manteo/Wanchese, Gans, the White Lion) hold together as one film instead of reading as three; does the closing line ('not everyone here chose to be') earn itself after two Church-and-crown stories and one slavery story, or flatten them together.",
      "<span class='amber'>Accuracy &amp; care:</span> every load-bearing fact was researched and verified directly (WebSearch/WebFetch, 2–3 independent sources per claim) before drafting, not delegated. Manteo/Wanchese's 1584 voyage, eight months at Durham House, the Harriot–Manteo Algonquian wordlist (100+ words), Wanchese's July 1585 flight, and Manteo's August 13 1587 baptism and 'Lord of Roanoke' title are drawn from NPS Fort Raleigh, NCpedia, and Virtual Jamestown, cross-checked. Joachim Gans (Fort Raleigh metallurgist, the 16-day-to-4-day copper refining detail, first documented practicing Jew in North America, later investigated in England for heresy) is drawn from NPS, the Smithsonian, and NC DNCR — his fate after the English court appearance is genuinely unrecorded, and the film says so rather than inventing an ending. The John Rolfe epigraph ('He brought not any thing but 20. and odd Negroes') is verbatim from his own 1619/1620 letter as preserved in Encyclopedia Virginia and BlackPast; the July 30 1619 House of Burgesses date (22 elected representatives) and the August 1619 White Lion arrival at Point Comfort are both independently dated, and the 'three weeks later, same colony' framing was checked against both dates rather than assumed. Nothing graphic — no depiction of any person, per the channel's standing 'no people, no faces' convention.",
      "<span class='amber'>On the blind constraint:</span> honestly, only partly held. Copying a build-pipeline template mid-research, I opened the sibling arm's script.json to check the card schema and ended up reading its full beat list before realizing what it was — so the structural pivot away from its trades-manifest angle was a deliberate choice made with knowledge of it, not a blind convergence. Flagged to Patrick in the moment it happened."
    ],
    source: "source: NPS Fort Raleigh · NCpedia (Manteo, Wanchese) · Smithsonian Magazine + NC DNCR (Joachim Gans) · Encyclopedia Virginia + BlackPast (John Rolfe, 1619) · Virtual Jamestown · byclaude.net"
  },
  boccecourts: {
    title: "Common Ground",
    sub: "A quiet history of bocce in America · 1880s–2025",
    mp4: "boccecourts.mp4", poster: "poster-boccecourts.png",
    meta: ["1920×1080 · 30fps", "18 beats", "voice: ballad", "−14 LUFS"],
    note: [
      "<span class='amber'>What this is:</span> a random-input test — Patrick's dad was reading about the new bocce complex in Rapid City, South Dakota, and Patrick asked for a short history of bocce courts in America off the back of it. First channel entry that's neither true crime nor a heavy 'forgotten history' piece — a genuinely happy one. The arc: Italian immigrants bringing the game in the 1880s–1920s wave; San Francisco's Aquatic Park courts going in as part of a 1936–39 WPA public-works project; twenty-five women starting the country's oldest women's bocce league at a 1944 picnic in an iron-mining town in Chisholm, Minnesota; a Denver tailor who built four courts behind his own shop in 1976 and personally founded the United States Bocce Federation; and landing on Rapid City itself — a city with no historic Italian community at all, which broke ground on an eight-court Special Olympics bocce complex in 2023, expanded to sixteen courts in 2025, partly funded by a retired NASCAR driver and the founder of the Sturgis Buffalo Chip.",
      "<span class='amber'>What to judge:</span> does 'ballad' read as genuinely warm and a little delighted rather than just 'not onyx'; does a happy-history register work at all for this channel, or does the house style (desaturated stills, amber-accented cards) fight a subject that isn't grim; does landing on a real, still-developing local news story (2025) feel like a fresher kind of 'forgotten history' than a centuries-old one.",
      "<span class='amber'>Accuracy &amp; care:</span> every fact verified directly via WebSearch/WebFetch before drafting. The Rapid City complex's timeline (March 17 2023 groundbreaking, 8 courts complete by June 2023, July 18 2023 grand opening, 95%/5% public-to-Special-Olympics use split, 600+ area Special Olympians, August 2025 groundbreaking on 8 additional courts, funding from Rusty Wallace and Rod Woodruff plus over a decade of charity motorcycle rides) is cross-corroborated across rcgov.org's own press releases, KOTA TV, the Rapid City Journal, and NewsCenter1 — independently consistent sources, not a single-source claim. The Jack Lynass quote is verbatim from KOTA's coverage. Chris Gerardo's biography (born 1923 near Venice, arrived in the US 1960, built four courts behind his Denver tailor shop in 1976, flew to Turin to consult Italy's federation, founded the USBF the same year) is drawn from the USBF's own biographical page for its founder. The Chisholm Women's Bocce League (1944, 25 women, founder Guido Pergal) and the WPA connection to San Francisco's Aquatic Park (built 1936–39, one of California's largest WPA projects, bocce courts on the same site) are both corroborated via independent sources. The 'oldest bocce club in America' claim for Aquatic Park is hedged as 'some trace' rather than asserted flatly, since that specific claim traced to a single secondary source. The Sturgis-to-Rapid-City driving distance (about a half hour) was checked directly rather than assumed — an early draft had guessed ninety minutes and would have been wrong by a factor of three.",
      "<span class='amber'>Production note:</span> the closing signoff line ('Common Ground') came back from a first TTS render sounding, on repeated whisper re-transcription, like 'Common Browned' — caught by the same verification pass used on every beat, confirmed as a one-off render glitch (an identical re-render of the same text came back clean), and swapped in before this cut."
    ],
    source: "source: Rapid City Parks & Recreation (rcgov.org) · KOTA TV · Rapid City Journal · NewsCenter1 · United States Bocce Federation (usbf.us) · NPS Aquatic Park Historic District · byclaude.net"
  },
  pokebowls: {
    title: "Just Tuesday",
    sub: "A quiet history of poke · Hawaii, 1868–2026",
    mp4: "pokebowls.mp4", poster: "poster-pokebowls.png",
    meta: ["1920×1080 · 30fps", "20 beats", "voice: ballad", "−14 LUFS"],
    note: [
      "<span class='amber'>What this is:</span> Patrick was telling Jessica how good — and how quietly Japanese-influenced — the food in Hawaii is, and asked for a video on poke bowls being an everyday grocery-store item there. Third entry in the channel's new 'happy history' lane alongside Common Ground. The hook is a contrast: poke bowls became a mainland fast-casual 'food trend' around 2015–2017 (poke-named restaurants went from 43 to 422 in a single year), while in Hawaii it never stopped being what's in the deli case. The arc underneath: poke the word (Hawaiian for 'to cut crosswise') may not have even attached to this dish until the 1960s, though the dish — raw reef fish, sea salt, roasted kukui nut, seaweed, eaten with poi as a pupu, not rice, not a bowl — is centuries older; Japanese immigration (1868's Gannenmono through the 1885–94 Kanyaku Imin wave to the 1924 Exclusion Act) brought deep-sea tuna fishing and shoyu into the mix inside multi-ethnic plantation camps; the ahi-shoyu-sesame form we'd recognize solidified by the 1970s with no single inventor. It closes back on today's grocery landscape — Foodland, Times, Tamura's, Don Quijote, even 7-Eleven — landing on 'what's a trend somewhere is Tuesday somewhere else.'",
      "<span class='amber'>What to judge:</span> does 'ballad' carry a food-history piece as well as it carried bocce; does correcting two myths mid-film (poke as an ancient dish-name, Sam Choy as poke's 'inventor') land as delighted precision rather than pedantry; does the bookend (opening Tuesday deli-case shot, closing 'is Tuesday somewhere else' signoff) feel earned or too cute.",
      "<span class='amber'>Accuracy &amp; care:</span> every load-bearing fact was verified via three parallel research passes before drafting, with sources and confidence levels checked, not assumed. Etymology (poke = 'to slice, cut crosswise,' Pukui &amp; Elbert's Hawaiian Dictionary) and traditional ingredients (reef fish, sea salt, ʻinamona, limu — Titcomb &amp; Pukui, 1952/1972, via the Bishop Museum) are solid; red alaea salt was deliberately NOT used as a 'traditional' ingredient since that claim traces to a single 2007 newspaper feature, not ethnography. Rachel Laudan's <i>The Food of Paradise</i> (1996) is the source for the film's central twist — the word may not have attached to the dish until the 1960s, first written recipes in the 1970s. Immigration figures were corrected from the commonly rounded ones: the Gannenmono ship carried 148 people, not the often-cited 153; the Kanyaku Imin wave is a well-corroborated ~29,000 across 26 ships (1885–94); the ~200,000 cumulative figure by 1924 is flagged in the film's own research as order-of-magnitude, not an audited count, and isn't stated with false precision on screen. Aloha Shoyu Co. (five Japanese families, Kalihi, 1946) is independently confirmed. The Sam Choy correction (1992 recipe contest and food trucks, not inventor) is drawn directly from the same sources that also debunk him online. On today's landscape: Times Supermarkets' 30-plus varieties is a real number from their own site; Tamura's reputation is strong local consensus and reviews, not a verified formal award, and isn't claimed as one; 7-Eleven Hawaii's fresh (not frozen) poke menu, exclusive to those stores, is independently confirmed by Honolulu Magazine. One widely repeated statewide 'pounds of poke consumed per year' statistic traced only to a tourism blog with no methodology — it was deliberately left out rather than stated as fact.",
      "<span class='amber'>Production note:</span> second entry built same-session as Common Ground, sharing its 'ballad' voice and the still-desaturated-documentary house grade — first time two consecutive long-forms have landed in the warmer, non-true-crime register rather than one being a one-off experiment."
    ],
    source: "source: Pukui &amp; Elbert, <i>Hawaiian Dictionary</i> · Titcomb &amp; Pukui, <i>Native Use of Fish in Hawaii</i> (1952/1972) · Rachel Laudan, <i>The Food of Paradise</i> (1996) · Honolulu Magazine · Bishop Museum · Times Supermarkets · byclaude.net"
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
  springfieldthree: {
    title: "The Springfield Three — the porch light still on",
    yt: `June 1992, Springfield, Missouri. Three women — a mother, 47, her daughter, 19, and the daughter's friend, 18 — arrived home from graduation parties. By morning, all three were gone. Their cars in the driveway. Their purses inside. The porch light still on. No sign of struggle. Thirty years later, no bodies, no charges.

#truecrime #springfieldthree #unsolved #shorts #missingpersons #mystery`,
    tiktok: `June 1992, Springfield MO. Three women arrive home from graduation parties. By morning, all three are gone. Cars in the driveway. Purses inside. Porch light still on. No sign of struggle. 30 years later — no bodies, no charges.

#truecrime #springfieldthree #fyp #unsolvedmystery #missingpersons #truecrimetiktok`,
    reels: `Springfield, Missouri. June 1992. Three women — a mother, 47, her daughter, 19, and the daughter's friend, 18 — arrived home from a pair of graduation parties. By morning, all three were gone. Their cars were in the driveway. Their purses were inside. The porch light was still on. There was no sign of struggle. Thirty years later, no bodies have been found. No one has been charged.

More from byclaude — link in bio.

#truecrime #springfieldthree #unsolved #missingpersons #mystery #truecrimecommunity #reels`
  },
  vela: {
    title: "The Vela Incident — the double flash",
    yt: `In September 1979, an American satellite detected a double flash of light over the southern Indian Ocean. A double flash is the signature of a nuclear weapon — the brief initial flash, then the expanding fireball. It was never officially explained. Forty years of scholarship lean toward a joint test, by two governments that have never confirmed it. The file remains, officially, ambiguous.

#mystery #velaincident #unsolved #shorts #history #coldwar`,
    tiktok: `September 1979. An American satellite detects a double flash of light over the southern Indian Ocean. A double flash is the signature of a nuclear weapon. It was never officially explained. 40 years of scholarship lean toward a joint test by two governments that have never confirmed it.

#mystery #velaincident #fyp #unsolvedmystery #coldwar #truecrimetiktok`,
    reels: `September 22, 1979, the southern Indian Ocean. An American satellite detected a double flash of light. A double flash is the signature of a nuclear weapon — the brief initial flash, then the expanding fireball. It was never officially explained. Forty years of scholarship lean toward a joint test, by two governments that have never confirmed it. The file remains, officially, ambiguous.

More from byclaude — link in bio.

#mystery #velaincident #unsolved #coldwar #history #truecrimecommunity #reels`
  },
  wowsignal: {
    title: "The Wow! Signal — 6EQUJ5",
    yt: `In August 1977, a radio telescope in Ohio picked up a signal from the direction of Sagittarius. It lasted 72 seconds. Then it stopped. 30 times louder than the background noise, on the frequency of hydrogen — the most common element in the universe. The astronomer circled the printout and wrote in the margin, one word: wow. Despite 50 years of follow-up observations, it has never repeated.

#mystery #wowsignal #SETI #unsolved #shorts #space`,
    tiktok: `August 1977, Ohio. A radio telescope picks up a signal from Sagittarius. 72 seconds. Then silence. 30× louder than background. On the frequency of hydrogen. The astronomer circled the printout and wrote in the margin: "Wow!" 50 years of follow-ups — it has never repeated.

#mystery #wowsignal #fyp #SETI #space #unsolvedmystery`,
    reels: `August 1977, Ohio. A radio telescope picked up a signal from the direction of Sagittarius. It lasted 72 seconds. Then it stopped. Thirty times louder than the background noise. On the frequency of hydrogen — the most common element in the universe. The astronomer who found it on the printout circled the letters and wrote in the margin, one word: wow. Despite fifty years of follow-up observations, it has never repeated.

More from byclaude — link in bio.

#mystery #wowsignal #SETI #space #unsolved #truecrimecommunity #reels`
  },
  roanoke: {
    title: "The Roanoke Colony — Croatoan",
    yt: `In 1587, more than a hundred English settlers landed on Roanoke Island, off the coast of North Carolina. Their governor sailed for England for supplies. War delayed him for three years. When he returned, the colony was abandoned. The houses had been dismantled. There were no bodies. There was no sign of attack. Carved into a palisade post, one word: Croatoan.

#mystery #roanoke #unsolved #shorts #history #colonial`,
    tiktok: `1587 — over 100 English settlers land on Roanoke Island, NC. Their governor sails for supplies. War delays him 3 years. He returns: colony abandoned, houses dismantled, no bodies, no sign of attack. Carved into a palisade post, one word: CROATOAN. 400 years later, still unanswered.

#mystery #roanoke #fyp #unsolvedmystery #history #lostcolony`,
    reels: `1587. More than a hundred English settlers landed on Roanoke Island, off the coast of North Carolina. Their governor sailed for England for supplies. War delayed him for three years. When he returned, in 1590, the colony was abandoned. The houses had been dismantled. There were no bodies. There was no sign of attack. Carved into a palisade post, one word: Croatoan. Carved into a tree, the letters: C-R-O. Four hundred years later, the colony is still unanswered.

More from byclaude — link in bio.

#mystery #roanoke #unsolved #history #lostcolony #truecrimecommunity #reels`
  },
  oakisland: {
    title: "Oak Island — 230 years of digging",
    yt: `In 1795, a teenager on a small island in Nova Scotia found a circular depression in the ground. He dug. Layers of old oak logs, every 10 feet. At 90 feet, an inscribed stone. Then the pit flooded. It has flooded every time since. 230 years of digging. Six men have died. No treasure has ever been confirmed. The digging continues.

#mystery #oakisland #moneypit #unsolved #shorts #treasure`,
    tiktok: `1795 — Nova Scotia. A teenager finds a circular depression. Digs. Oak logs every 10 feet. At 90 feet, an inscribed stone. Then the pit floods. It has flooded every time since. 230 years of digging. 6 men dead. No treasure confirmed.

#mystery #oakisland #fyp #unsolvedmystery #treasure #moneypit`,
    reels: `1795, Nova Scotia. A teenager on a small island found a circular depression in the ground. He dug. Layers of old oak logs, every ten feet. At ninety feet, an inscribed stone. Then the pit flooded. It has flooded every time, since. Two hundred and thirty years of digging. Six men have died. No treasure has ever been confirmed. Whatever is or is not at the bottom, the digging continues.

More from byclaude — link in bio.

#mystery #oakisland #moneypit #unsolved #treasure #truecrimecommunity #reels`
  },
  uvb76: {
    title: "UVB-76 — the buzzer",
    yt: `Somewhere in a forest south of Moscow, a radio tower has broadcast the same tone, on the same frequency, for more than 40 years. A short buzz, 25 times a minute, day and night. Occasionally, the buzz stops — a voice reads Russian names and numbers for a few minutes — then the buzz returns. The Russian government has never explained its purpose. It is still broadcasting.

#mystery #uvb76 #shorts #numbers station #coldwar`,
    tiktok: `Somewhere in a forest south of Moscow, a radio tower has broadcast the same tone on the same frequency for 40+ years. 25 buzzes a minute. Day and night. Occasionally a voice reads Russian names and numbers. Then the buzz returns. Russia has never explained it. Still broadcasting.

#mystery #uvb76 #fyp #numbersstation #coldwar #shortwave`,
    reels: `Somewhere in a forest south of Moscow, a radio tower has broadcast the same tone, on the same frequency, for more than forty years. A short buzz, twenty-five times a minute, day and night. Occasionally, the buzz stops. A voice reads Russian names and numbers, for a few minutes. Then the buzz returns. The Russian government has never explained its purpose. It is still broadcasting.

More from byclaude — link in bio.

#mystery #uvb76 #numbersstation #coldwar #shortwave #truecrimecommunity #reels`
  },
  tunguska: {
    title: "The Tunguska Event — 830 square miles flattened",
    yt: `On a June morning in 1908, over a remote Siberian forest, something exploded in the sky. 830 square miles of forest, flattened in a radial pattern. The blast was felt across Eurasia. No impact crater. No fragment of what caused it was ever recovered. The leading theory is an asteroid, 3–6 miles above the ground, that exploded in the air. 118 years later, this is still a theory.

#mystery #tunguska #unsolved #shorts #science #history`,
    tiktok: `June 1908, remote Siberia. Something explodes in the sky. 830 square miles of forest flattened in a radial pattern. Blast felt across Eurasia. No impact crater. No fragments recovered. Leading theory: asteroid airburst 3–6 miles up. 118 years later — still a theory.

#mystery #tunguska #fyp #unsolvedmystery #science #asteroid`,
    reels: `June 30, 1908. Over a remote Siberian forest, something exploded in the sky. Eight hundred and thirty square miles of forest, flattened in a radial pattern. The blast was felt across Eurasia. No impact crater. No fragment of what caused it was ever recovered. The leading theory is an asteroid, three to six miles above the ground, that exploded in the air. One hundred and eighteen years later, this is still a theory. What exploded over Tunguska has never been confirmed.

More from byclaude — link in bio.

#mystery #tunguska #unsolved #science #history #truecrimecommunity #reels`
  },
  phantomheilbronn: {
    title: "The Phantom of Heilbronn — the woman who wasn't there",
    yt: `For 15 years, the same woman's DNA was found at 40 crime scenes across Europe. A murder in Germany. A burglary in France. A burned-out car in Austria. The same unknown woman. Police in four countries searched for her. They named her the Phantom of Heilbronn. She did not exist. Her DNA was on the cotton swabs, at the factory that made them.

#truecrime #phantomofheilbronn #unsolved #shorts #forensics`,
    tiktok: `For 15 years, the same woman's DNA turns up at 40 crime scenes across Europe. Murder in Germany, burglary in France, burned car in Austria — same woman. Police in 4 countries hunt her. They name her the Phantom of Heilbronn. She did not exist. Her DNA was on the cotton swabs at the factory.

#truecrime #phantomofheilbronn #fyp #forensics #unsolvedmystery`,
    reels: `For fifteen years, the same woman's DNA was found at forty crime scenes across Europe. A murder in Germany. A burglary in France. A burned-out car in Austria. The same unknown woman. Police in four countries searched for her. They named her the Phantom of Heilbronn. She did not exist. Her DNA was on the cotton swabs, at the factory that made them.

More from byclaude — link in bio.

#truecrime #phantomofheilbronn #forensics #mystery #truecrimecommunity #reels`
  },
  larsmittank: {
    title: "Lars Mittank — ran into a field",
    yt: `In July 2014, a German tourist named Lars Mittank arrived at Varna Airport in Bulgaria to fly home. He went to the airport doctor, mentioned a fight injury, asked for medication. Then, on the security camera, he is seen dropping his luggage. He runs out of the terminal. He runs into a field of wheat. He left his luggage, phone, wallet, and passport inside. The most-viewed missing-person case in German history. Still missing.

#truecrime #larsmittank #unsolved #shorts #missingpersons`,
    tiktok: `July 2014, Varna Airport, Bulgaria. German tourist Lars Mittank is at the airport to fly home. He visits the airport doctor. Then, on the security camera, he drops his luggage and runs — out of the terminal, into a field of wheat. He left everything inside. The most-viewed missing-person case in German history.

#truecrime #larsmittank #fyp #missingpersons #unsolvedmystery #truecrimetiktok`,
    reels: `July 2014. A German tourist named Lars Mittank arrived at Varna Airport, in Bulgaria, to fly home from a beach holiday. He went to the airport doctor. Then, on the security camera, he is seen dropping his luggage. He runs out of the terminal. He runs into a field of wheat. He has not been seen since. He left his luggage, his phone, his wallet, and his passport inside the terminal. It is the most-viewed missing-person case in German history. He is still missing.

More from byclaude — link in bio.

#truecrime #larsmittank #missingpersons #unsolved #mystery #truecrimecommunity #reels`
  },
  courrieres: {
    title: "Courrières — twenty days",
    yt: `March 1906, northern France. Something ignited far underground. 1,099 miners were killed — Europe's worst mining disaster, 120 years later. Within days, the company sealed the mine. Twenty days later, thirteen men walked out. No one — not the company, not its engineers — was ever found responsible. Not for the disaster. Not for the sealing.

#truecrime #courrieres #miningdisaster #shorts #history #accountability`,
    tiktok: `March 1906, northern France. 1,099 miners killed in Europe's worst mining disaster. Within days, the company sealed the mine. Twenty days later, 13 men walked out. No one was ever found responsible — not for the disaster, not for the sealing.

#truecrime #courrieres #fyp #miningdisaster #history #truecrimetiktok`,
    reels: `March 1906, the coalfield of northern France. Something ignited far underground. One thousand and ninety-nine miners were killed. It remains Europe's worst mining disaster, one hundred twenty years later. Within days, the company sealed the mine. Twenty days later, thirteen men walked out. No one — not the company, not its engineers — was ever found responsible. Not for the disaster. Not for the sealing.

Full film on the channel — link in bio.

#truecrime #courrieres #miningdisaster #history #accountability #truecrimecommunity #reels`
  },
  glicomorinaga: {
    title: "The Monster with 21 Faces — cyanide on the shelves",
    yt: `Osaka, March 1984. The president of a food company was kidnapped. Then letters arrived, signed with a name borrowed from a children's story. Then cyanide — in the company's own products, on supermarket shelves across Japan, with the group's warning labels already attached. No one was poisoned. The labels held. The investigation ran 16 years — until the statute of limitations simply ran out, at midnight. 21 faces. Zero names.

#truecrime #glicomorinaga #themonsterwith21faces #shorts #unsolved`,
    tiktok: `Osaka, March 1984. The president of a food company is kidnapped. Then cyanide — in the company's own products, on supermarket shelves across Japan, with the group's warning labels already attached. No one was poisoned. 16 years later, the statute of limitations simply ran out at midnight. 21 faces. Zero names.

#truecrime #glicomorinaga #fyp #themosterwith21faces #unsolvedmystery #truecrimetiktok`,
    reels: `Osaka, March 1984. The president of a food company was kidnapped by men in rubber gloves. Then letters arrived, signed with a name borrowed from a children's story — the Monster with 21 Faces. Then cyanide — in the company's own products, on supermarket shelves across Japan, with the group's warning labels already attached. No one was poisoned. The labels held. The investigation ran sixteen years, until the statute of limitations simply ran out at midnight. Twenty-one faces. Zero names.

Full film on the channel — link in bio.

#truecrime #glicomorinaga #themosterwith21faces #unsolved #truecrimecommunity #reels`
  },
  surgisphere: {
    title: "Surgisphere — six employees, six continents",
    yt: `May 2020. The Lancet published what was billed as the largest hydroxychloroquine study of the pandemic. The data came from one company: Surgisphere. Its own LinkedIn page listed six employees. Thirteen days after publication, the study was fully retracted. Two of the world's most trusted medical journals. Thirteen days. Nobody thought they'd need to check.

#truecrime #surgisphere #thelancet #shorts #science #accountability`,
    tiktok: `May 2020. The Lancet publishes the largest hydroxychloroquine study of the pandemic. The data came from one company: Surgisphere. Its LinkedIn page listed six employees. 13 days later — fully retracted. Nobody thought they'd need to check.

#truecrime #surgisphere #fyp #thelancet #science #truecrimetiktok`,
    reels: `May 22, 2020. The Lancet published what was billed as the largest hydroxychloroquine study of the pandemic. The data came from one company: Surgisphere. Its own LinkedIn page listed six employees. Thirteen days after publication, the study was fully retracted. Two of the world's most trusted medical journals. Thirteen days. Nobody thought they'd need to check.

Full film on the channel — link in bio.

#truecrime #surgisphere #thelancet #science #accountability #truecrimecommunity #reels`
  },
  hwaseong: {
    title: "Hwaseong — too late for the law, in time for the innocent",
    yt: `Between 1986 and 1991, ten women were killed in a farming district south of Seoul. Ten women, five years, one killer. By 2006, the statute of limitations had expired — the law's own clock had run out. In September 2019, a DNA match. The real killer confessed to fourteen. An innocent man, who had served twenty years on a forced confession, was finally acquitted.

#truecrime #hwaseong #lechoonjae #yoonsungyeo #shorts #wrongfulconviction`,
    tiktok: `1986–1991, South Korea. Ten women killed. By 2006 the statute of limitations expires — the law's clock has run out. September 2019: a DNA match. The real killer confesses to 14. An innocent man who served 20 years on a forced confession is finally acquitted.

#truecrime #hwaseong #fyp #wrongfulconviction #truecrimetiktok #korea`,
    reels: `Between 1986 and 1991, ten women were killed in a farming district south of Seoul. By 2006, the statute of limitations had expired — the law's own clock had run out. In September 2019, a DNA match. The real killer confessed to fourteen. An innocent man, who had served twenty years on a forced confession, was finally acquitted.

Full film on the channel — link in bio.

#truecrime #hwaseong #wrongfulconviction #korea #truecrimecommunity #reels`
  },
  deberk: {
    title: "Lucia de Berk — only the arithmetic changed",
    yt: `In the early 2000s, Dutch nurse Lucia de Berk was convicted of murder. The prosecution's statistic: one in 342 million. The chance, they said, that the ward deaths during her shifts were coincidence. A philosopher of science checked the arithmetic. The same data, calculated correctly: one in forty-four. Seven years into a life sentence, she was acquitted. Only the arithmetic had changed.

#truecrime #luciadeberk #wrongfulconviction #shorts #statistics #netherlands`,
    tiktok: `Early 2000s, Netherlands. Nurse Lucia de Berk convicted of murder. Prosecution's statistic: 1 in 342 million. A philosopher of science checks the arithmetic. Same data, calculated correctly: 1 in 44. Seven years into a life sentence, she was acquitted. Only the arithmetic changed.

#truecrime #luciadeberk #fyp #wrongfulconviction #statistics #truecrimetiktok`,
    reels: `The Hague, Netherlands, early 2000s. A nurse named Lucia de Berk was convicted of murder. The prosecution's statistic: one in three hundred forty-two million — the chance, they said, that the ward deaths during her shifts were coincidence. A philosopher of science checked the arithmetic. The same data, calculated correctly: one in forty-four. Seven years into a life sentence, she was acquitted. Only the arithmetic had changed.

Full film on the channel — link in bio.

#truecrime #luciadeberk #wrongfulconviction #statistics #netherlands #truecrimecommunity #reels`
  },
  beaumont: {
    title: "The Beaumont Children — the five-minute bus ride",
    yt: `Australia Day, 1966. Three siblings — Jane 9, Arnna 7, Grant 4 — caught the 8:45 bus from Somerton Park to Glenelg Beach, five minutes from home. They were seen on the beach with a tall, fair-haired man. They paid for pasties at the bakery with a pound note their mother hadn't given them. They never came home. Sixty years later — no bodies, no clothing, no trace. The parents kept the same phone number for decades, in case the children called. Nancy died 2019. Jim died 2023. No one has ever been charged.

Full film on the channel.

#truecrime #beaumontchildren #adelaide #unsolved #shorts #missingpersons #australia`,
    tiktok: `Australia Day, 1966. Three siblings — Jane 9, Arnna 7, Grant 4 — caught the 8:45 bus from home to Glenelg Beach, Adelaide. Five minutes away. They were seen with a tall fair-haired man. They never came home. 60 years later, no bodies, no trace. No one has ever been charged.

#truecrime #beaumontchildren #adelaide #fyp #unsolvedmystery #missingpersons #truecrimetiktok`,
    reels: `Adelaide, Australia. January 26, 1966 — Australia Day. Three siblings — Jane Nartare, nine; Arnna Kathleen, seven; Grant Ellis, four — caught the 8:45 bus from Somerton Park to Glenelg Beach, five minutes from home. Their mother expected them on the noon bus. They were seen on the beach with a tall, fair-haired man. They bought pasties at a bakery with a one-pound note their mother had not given them. They never came home. The largest investigation in Australian history found nothing — no bodies, no clothing, no confirmed trace. The parents kept the same phone number for decades, in case the children called. Nancy died in 2019. Jim in 2023. No one has ever been charged.

Full film on the channel — link in bio.

#truecrime #beaumontchildren #adelaide #unsolved #missingpersons #mystery #australia #reels`
  },
  kasparhauser: {
    title: "Kaspar Hauser — the riddle of his time",
    yt: `1828, Nuremberg: a teenage boy appears with no name, no past, and a letter no one can explain. Europe decides he must be a stolen prince. In 1833 he's murdered — with a mirror-writing note beside the body. In 2024, DNA finally ruled out the prince theory. It didn't answer anything else.

More, from byclaude.

#history #kasparhauser #truestory #shorts #mystery #germany`,
    tiktok: `A boy shows up in a German town in 1828 with no name and no past. Everyone decides he's a secret prince. Five years later he's stabbed to death, with a note in mirror writing signed only "M.L.Ö." 2024 DNA test: not a prince. Still no idea who he was.

#history #kasparhauser #truecrime #fyp #mystery #germany`,
    reels: `Nuremberg, May 1828. A teenage boy appears in the town square, barely able to speak, holding an unsigned letter. He learns to talk, learns to write — and all of Europe starts whispering that he's a kidnapped prince, hidden since infancy. In 1829 someone attacks him with a knife; he survives. In December 1833, someone lures him to a garden with the promise of money, and stabs him for real. He dies three days later. In his purse: a note in mirror writing, signed only "M.L.Ö." His epitaph: a riddle of his time, birth unknown, death mysterious. The prince theory held for two hundred years — until 2024, when new DNA analysis ruled it out for good. Which leaves everything else exactly where it started.

More from byclaude — link in bio.

#history #kasparhauser #truestory #mystery #germany #reels`
  },
  wychelm: {
    title: "Who put Bella in the wych elm?",
    yt: `1943, an English wood: four boys look for birds' eggs in a hollow tree and find a human skull. She was never identified. In 1944 someone started chalking a question on walls nearby — and it's still appearing, eighty years on.

More, from byclaude.

#truecrime #wychelm #unsolved #shorts #coldcase #mystery`,
    tiktok: `1943, England: boys find a skull inside a hollow tree. Full skeleton. Wedding ring. One hand buried separately, some distance away. She was never identified. A year later, someone starts writing "who put Bella down the wych elm" on walls nearby. That graffiti has kept reappearing for 80 years.

#truecrime #wychelm #unsolvedmystery #fyp #coldcase #truecrimetiktok`,
    reels: `April 1943, Hagley Wood, England. Four boys poaching climb inside a hollow tree looking for birds' eggs and find a human skull. Police search the tree and find the rest of her: a nearly complete skeleton, a gold wedding ring, a shoe — and one of her hands, missing, buried separately some distance away. She was never identified; no one ever reported her missing. Then, in 1944, someone starts writing a question on walls around the wood, in chalk, too high up for a child's hand: who put Bella down the wych elm? That question is still being written — as recently as the last few decades, on the stone obelisk near where she was found, by a hand that was never caught either.

More from byclaude — link in bio.

#truecrime #wychelm #unsolved #coldcase #truecrimecommunity #mystery #reels`
  },
  devilsfootprints: {
    title: "The Devil's Footprints — Devon, 1855",
    yt: `One snowy night in 1855, something walked across Devon, England — leaving hoof-shaped prints over rooftops, through walls, across a river. No explanation ever fit all of it. A hundred and seventy years later, still unresolved.

More, from byclaude.

#history #devilsfootprints #unexplained #shorts #mystery #england`,
    tiktok: `Feb 1855, Devon, England: overnight snowfall, and by morning a single-file trail of small hoof prints stretches for miles — over roofs, through solid walls, across a river, never doubling back. Kangaroo, mice, refrozen pony tracks — nothing explains all of it. Still unsolved.

#history #devilsfootprints #unexplained #fyp #mystery #england`,
    reels: `February 1855, Devon, England. One snowy night, something walked. By morning, a single-file trail of small hoof-shaped prints stretched for miles across the snow — reported by dozens of villages the same morning, as much as a hundred miles of it all told. The prints crossed rooftops. Went straight through solid walls. Crossed a river. Never once doubled back. A local vicar wrote it up for a London newspaper and the story went nationwide within weeks — people said it was the Devil, out walking. Investigators proposed an escaped kangaroo, a rope of field mice, a pony's hooves refrozen into one unbroken line — none of it quite explained everything reported. No one ever proved which theory was right, or whether the story grew taller in the telling. A hundred and seventy years later, the tracks in the snow are still just tracks in the snow.

More from byclaude — link in bio.

#history #devilsfootprints #unexplained #mystery #england #reels`
  },
  leprince: {
    title: "Before Edison — the man who invented film and vanished",
    yt: `1888: a French inventor in Leeds shoots what may be the first motion picture ever made — years before Edison. In 1890 he boards a train and is never seen again. Textbooks still credit someone else.

More, from byclaude.

#history #louisleprince #truestory #shorts #mystery #film`,
    tiktok: `This man invented motion pictures before Edison and before the Lumière brothers. Then in 1890 he boarded a train in France and vanished — no body, no luggage, nothing, ever. A 2003 archive photo of a drowned man might be him. Might not. Edison got the credit instead.

#history #louisleprince #unsolvedmystery #fyp #mystery #film`,
    reels: `October 1888, Leeds, England. A French inventor named Louis Le Prince points a single-lens camera at his own back garden and shoots what may be the oldest surviving motion picture in the world — years before Edison, years before the Lumière brothers. By 1890 he's ready to cross the Atlantic and show the world. He's been visiting his brother in Dijon, France, and on September the sixteenth he boards a train there, bound for Paris. He never gets off. His friends in Paris wait for him and he simply isn't there — no body, no luggage, no trace, ever, of Louis Le Prince again. In 2003, over a century later, someone searching the Paris police archives finds a photograph: an unidentified man pulled from the Seine in 1890, drowned, who looks strikingly like him. Some who've studied it say the body was too short to be his. No one has ever been able to say for certain. Because he vanished before he could show anyone, credit for inventing the movies went to Edison, and to the Lumières. Most textbooks still don't mention the man who did it first.

More from byclaude — link in bio.

#history #louisleprince #truestory #mystery #film #reels`
  },
  wallace: {
    title: "The Wallace Case — the perfect alibi",
    yt: `Liverpool, 1931: a man is lured across town by a phone call from someone who doesn't exist, then comes home to find his wife murdered. He's convicted — then England overturns a murder verdict for the first time ever. Still unsolved.

More, from byclaude.

#truecrime #juliawallace #unsolved #shorts #coldcase #mystery`,
    tiktok: `1931 Liverpool: William Wallace gets a phone call from a "Mr Qualtrough" asking to meet the next night. The address doesn't exist — he spends an hour searching for it, watched by half a dozen witnesses. He goes home and finds his wife beaten to death. Convicted, then acquitted — the first overturned murder verdict in English legal history. Still unsolved.

#truecrime #juliawallace #coldcase #fyp #truecrimetiktok #england`,
    reels: `January 1931, Liverpool. Insurance man William Wallace gets a phone message at his chess club — a stranger, a "Mr Qualtrough," wants to meet him the next evening about a policy. The next night, Wallace searches for over an hour for the address Qualtrough gave him — half a dozen strangers, a policeman, a tram conductor, all watch him hunting for a street that doesn't exist. He gives up and goes home. There, in the parlor, he finds his wife Julia, beaten to death. Police decide he called himself — an elaborate alibi to cover a murder. He's convicted. Then, on appeal, judges rule the evidence can't support it: the first time in English law a murder conviction is overturned outright. Wallace walks free, and dies a few years later, still under suspicion. No one else was ever charged. If he didn't make that call, whoever did was never found.

More from byclaude — link in bio.

#truecrime #juliawallace #unsolved #coldcase #truecrimecommunity #england #reels`
  },
  pekingman: {
    title: "Peking Man — the bones that never arrived",
    yt: `Some of the most important human fossils ever found were packed into crates in 1941 to save them from war — and vanished the day Pearl Harbor was attacked. Never found since. Only casts and photographs survive.

More, from byclaude.

#history #pekingman #unsolvedmystery #shorts #science #mystery`,
    tiktok: `1941: scientists pack half-a-million-year-old human fossils into crates to smuggle them out of China ahead of Japan's army. Ship sails Dec 8. Pearl Harbor is attacked Dec 7. The Marines guarding the crates are taken prisoner before it ever leaves. The bones are never seen again.

#history #pekingman #unsolvedmystery #fyp #science #mystery`,
    reels: `In caves outside Beijing, scientists once found something extraordinary: the bones of Peking Man, half a million years old — among the most important human fossils ever discovered. In 1941, with Japan's army closing in, American and Chinese scientists packed the bones into crates to smuggle them to safety in the United States — the last hope of saving them from the war. The crates were handed to U.S. Marines, to be shipped out of port on December the eighth. On December the seventh, Japan attacked Pearl Harbor. The Marines guarding the fossils were taken prisoner before the ship ever sailed. The bones never reached it. They were never seen again — not by the scientists who packed them, not by anyone. Decades of searching, on three continents, found nothing. All that survives are the casts and photographs one researcher made just in time. Everything we know about Peking Man, we know from copies — because the originals are still, somewhere, missing.

More from byclaude — link in bio.

#history #pekingman #unsolvedmystery #science #mystery #reels`
  },
  sodder: {
    title: "The Sodder Children — the billboard on the highway",
    yt: `On Christmas night 1945, a fire destroyed the Sodder family home in the West Virginia hills. Five of the ten children were never seen again. No bones were found in the ashes. The family put up a billboard on the highway — they offered a reward, and kept it there for forty years. Twenty-two years after the fire, a photograph arrived in the mail. They believed it showed their son Louis, in his twenties.

No explanation has ever been confirmed.

#truecrime #sodder #unsolved #shorts #coldcase #missingpersons`,
    tiktok: `Christmas night 1945, West Virginia. A fire destroyed the Sodder family home. Five of the ten children were never seen again. No bones in the ashes. The family put up a billboard on the highway and kept it there for forty years. Twenty-two years later, a photograph arrived — believed to show their son Louis, in his twenties.

#truecrime #sodderchildren #unsolvedmystery #fyp #missingpersons #truecrimetiktok`,
    reels: `Fayetteville, West Virginia. Christmas night, 1945. A fire destroyed the Sodder family home in the hills. Five of the ten Sodder children were never seen again. No bones were found in the ashes — a coroner issued death certificates without remains. The family put up a billboard on the highway, offered a reward, and kept it there for forty years. Twenty-two years after the fire, a photograph arrived in the mail. They believed it showed their son Louis, in his twenties. No explanation has ever been confirmed.

More from byclaude — link in bio.

#truecrime #sodder #unsolved #missingpersons #coldcase #truecrimecommunity #mystery #reels`
  },
  watcher: {
    title: "The Watcher — young blood",
    yt: `In June 2014, a family bought a large house in Westfield, New Jersey, for their five children. Before they moved in, the first letter arrived. It was signed: the Watcher. It called the children, quote, young blood. Three more letters came. The writer was never identified. The family never moved in. The house is still on the boulevard.

#truecrime #thewatcher #unsolved #shorts #mystery #newjersey`,
    tiktok: `June 2014, Westfield, New Jersey. A family buys a large house for their five children. Before they move in, the first letter arrives. Signed: the Watcher. It called the children "young blood." Three more letters came. The writer was never identified. The family never moved in.

#truecrime #thewatcher #westfieldnj #fyp #unsolvedmystery #truecrimetiktok`,
    reels: `Westfield, New Jersey. June 2014. A family bought a large house for their five children. Before they moved in, the first letter arrived. Signed: the Watcher. It called the children, quote, young blood. It described the house in detail. Three more letters came. The writer was never identified. The family never moved in. The house is still on the boulevard. The case is still open.

More from byclaude — link in bio.

#truecrime #thewatcher #unsolved #mystery #truecrimecommunity #reels`
  },
  circleville: {
    title: "The Circleville Letter Writer — the letters continued",
    yt: `For almost twenty years, beginning in 1976, someone in Circleville, Ohio, sent anonymous letters to dozens of residents. Handwritten. Specific. In 1977 a small handgun was rigged to a mailbox — meant for Mary Gilligan. Her brother-in-law was convicted. He maintained his innocence. The letters continued while he was in prison.

He served ten years. The case was never solved.

#truecrime #circleville #unsolved #shorts #mystery #ohio`,
    tiktok: `For almost 20 years, someone in Circleville, Ohio, sent anonymous letters to dozens of residents. Handwritten. Specific. In 1977 a handgun was rigged to a mailbox — meant for Mary Gilligan. Her brother-in-law was convicted. He maintained his innocence. The letters continued while he was in prison.

#truecrime #circlevilleletters #unsolvedmystery #fyp #mystery #truecrimetiktok`,
    reels: `Circleville, Ohio. Beginning in 1976, for almost twenty years, someone sent anonymous letters to dozens of residents. Handwritten. Specific. The writer knew what people had done, and what they had not. In 1977, a small handgun was rigged to a mailbox — meant for Mary Gilligan. Her brother-in-law was convicted. He maintained his innocence. The letters continued while he was in prison. He served ten years. The case was never solved.

More from byclaude — link in bio.

#truecrime #circleville #unsolved #mystery #truecrimecommunity #reels`
  },
  maryceleste: {
    title: "The Mary Celeste — food on the table",
    yt: `In December 1872, a ship was found adrift in the Atlantic. The Mary Celeste was in good order. Her cargo was untouched. There was food on the table. The captain, his wife, their daughter, and seven crew were all gone. A single lifeboat was missing. No sign of storm. No sign of violence. No sign of anyone.

What happened on that ship has never been determined.

#truecrime #maryceleste #unsolved #shorts #mystery #maritime`,
    tiktok: `December 1872. A ship found adrift in the Atlantic. The Mary Celeste — in good order, cargo untouched, food on the table. The captain, his wife, their daughter, and seven crew all gone. A single lifeboat missing. No sign of storm. No sign of violence. No sign of anyone.

#truecrime #maryceleste #unsolvedmystery #fyp #mystery #truecrimetiktok`,
    reels: `December 1872, the Atlantic Ocean between the Azores and Portugal. A ship found adrift. The Mary Celeste was in good order. Her cargo was untouched. There was food on the table. The captain, his wife, their two-year-old daughter, and seven crew were all gone. A single lifeboat was missing. No sign of storm. No sign of violence. No sign of anyone. What happened on that ship has never been determined.

More from byclaude — link in bio.

#truecrime #maryceleste #unsolved #mystery #truecrimecommunity #maritime #reels`
  },
  valentich: {
    title: "The Valentich Disappearance — it's not an aircraft",
    yt: `In October 1978, a 20-year-old pilot named Frederick Valentich took off from Melbourne in a small Cessna. He radioed air traffic control. An aircraft, he said, was orbiting above him. He described four bright lights. He reported his engine running rough. His last transmission: it's not an aircraft. Then metallic scraping sounds. Then nothing.

He and his plane were never found.

#truecrime #valentich #unsolved #shorts #mystery #aviation`,
    tiktok: `October 1978. A 20-year-old pilot named Frederick Valentich takes off from Melbourne in a small Cessna. He radios ATC: an aircraft is orbiting above him. Four bright lights. Engine running rough. His last transmission: "It's not an aircraft." Then metallic scraping sounds. Then nothing.

#truecrime #valentich #unsolvedmystery #fyp #aviation #truecrimetiktok`,
    reels: `October 21, 1978, Australia. A 20-year-old pilot named Frederick Valentich took off from Melbourne in a small Cessna, bound for King Island over Bass Strait. He radioed air traffic control. An aircraft, he said, was orbiting above him. He described four bright lights. He reported his engine running rough. His last transmission: it's not an aircraft. Then metallic scraping sounds. Then nothing. He and his plane were never found.

More from byclaude — link in bio.

#truecrime #valentich #unsolved #mystery #aviation #truecrimecommunity #reels`
  },
  yubacountyfive: {
    title: "The Yuba County Five — food beside them, untouched",
    yt: `In February 1978, five young men from Yuba City, California, drove to Chico for a basketball game. They did not come home. Their car was found days later, abandoned on a remote mountain road. Months later, four of them were found in a forest trailer, twenty miles from the car. One had lived there for weeks, with food and a heater untouched beside him. He had starved. The fifth was never found.

#truecrime #yubacountyfive #unsolved #shorts #mystery #missingpersons`,
    tiktok: `February 1978. Five young men from Yuba City, California, drive to Chico for a basketball game. They don't come home. Their car is found abandoned on a remote mountain road. Months later, four of them are found in a forest trailer 20 miles from the car. One had lived there for weeks, with food and a heater untouched beside him. He had starved.

#truecrime #yubacountyfive #unsolvedmystery #fyp #missingpersons #truecrimetiktok`,
    reels: `February 1978, California. Five young men from Yuba City drove to Chico for a basketball game. They did not come home. Their car was found days later, abandoned on a remote mountain road in the Plumas National Forest. Months later, four of them were found in a forest trailer, twenty miles from the car. One had lived there for weeks, with food and a heater untouched beside him. He had starved. The fifth was never found. The case is still open.

More from byclaude — link in bio.

#truecrime #yubacountyfive #unsolved #missingpersons #mystery #truecrimecommunity #reels`
  },
  elisalam: {
    title: "Elisa Lam — the doors that did not close",
    yt: `In February 2013, a 21-year-old student stepped into an elevator at the Cecil Hotel in Los Angeles. The doors did not close. For ninety seconds she pressed buttons, stepped into the hallway, stepped back in. The security camera recorded what it recorded.

Two weeks later, guests complained the water tasted wrong.

More from byclaude.

#truecrime #elisalam #cecilhotel #unsolved #shorts #mystery`,
    tiktok: `February 2013, the Cecil Hotel. A 21-year-old student steps into an elevator. The doors do not close. Ninety seconds of footage no one has ever explained. Two weeks later, guests complained the water tasted wrong.

#truecrime #elisalam #cecilhotel #fyp #unsolvedmystery #truecrimetiktok`,
    reels: `Los Angeles, 2013. A 21-year-old student named Elisa Lam steps into an elevator at the Cecil Hotel. The doors do not close. For ninety seconds she presses buttons, steps into the hallway, steps back in. The security camera recorded what it recorded. She was not seen alive again. Two weeks later, guests complained the water tasted wrong. The autopsy found her in the rooftop tank. The lid was heavy. There was no sign of anyone else. The coroner ruled it accidental.

More from byclaude — link in bio.

#truecrime #elisalam #cecilhotel #unsolved #truecrimecommunity #mystery #reels`
  },
  somertonman: {
    title: "The Somerton Man — Tamam Shud",
    yt: `In December 1948, the body of a man was found on a beach in South Australia. No wallet. No identification. Every label cut from his clothes. In a hidden pocket, a torn piece of paper. Two words: Tamam Shud. It means, ended.

In 2022, DNA identified him. The rest is still unknown.

#truecrime #somertonman #tamamshud #unsolved #shorts #coldcase`,
    tiktok: `A man found dead on an Australian beach in 1948. No wallet. No ID. Every label cut from his clothes. In a hidden pocket, a torn scrap of paper — Tamam Shud. It means, ended. For seventy years, no name. In 2022, DNA gave him one. The rest is still unknown.

#truecrime #somertonman #tamamshud #fyp #unsolvedmystery #truecrimetiktok`,
    reels: `Adelaide, 1948. The body of a man found on a beach. No wallet. No identification. Every label cut from his clothes. In a hidden pocket, a small torn piece of paper — two words: Tamam Shud. It is Persian. It means, ended. No one claimed him. No one recognized him. For seventy years, his name was unknown. In 2022, DNA finally identified him as Carl Webb. Why he died on that beach is still unknown.

More from byclaude — link in bio.

#truecrime #somertonman #tamamshud #unsolved #coldcase #truecrimecommunity #mystery #reels`
  },
  maxheadroom: {
    title: "The Max Headroom Incident — the voice in the static",
    yt: `On a November night in 1987, television sets across Chicago flickered. The local news was interrupted. In its place: a man in a rubber mask, his voice distorted. He spoke for ninety seconds. He laughed. He did it twice that night, on two different stations. The FCC launched the largest manhunt in its history. No one was ever charged.

#truecrime #maxheadroom #unsolved #shorts #mystery #1987`,
    tiktok: `November 1987, Chicago. The local news is interrupted by a man in a rubber Max Headroom mask, voice distorted, laughing on live television. Ninety seconds. He did it twice in one night on two different stations. The FCC launched the largest manhunt in its history. No one was ever charged.

#truecrime #maxheadroom #unsolvedmystery #fyp #mystery #truecrimetiktok #80s`,
    reels: `Chicago, November 22, 1987. Television sets across the city flickered. The local news was interrupted. In its place: a man wearing a rubber Max Headroom mask, his voice distorted. He spoke for ninety seconds. He laughed. He referenced a fictional news anchor. Then the broadcast returned. He did it twice that night, on two different stations. The FCC launched the largest manhunt in its history. No one was ever charged. The mask, the voice, the joke — all remained unidentified.

More from byclaude — link in bio.

#truecrime #maxheadroom #unsolved #mystery #truecrimecommunity #80s #reels`
  },
  dancingplague: {
    title: "The Dancing Plague of 1518 — no recorded deaths",
    yt: `Strasbourg, 1518. A woman steps into the street and starts dancing — no music, no reason. Within a month, four hundred people can't stop. The city built them a stage. Here's the part almost every retelling gets wrong.

More, from byclaude.

#history #dancingplague #strasbourg #shorts #medievalhistory #mystery`,
    tiktok: `1518, Strasbourg: a woman starts dancing in the street and won't stop. Within a month, 400 people are dancing with her — some until they collapse. The city's fix: hire musicians and build a stage. You've probably heard it killed hundreds. Strasbourg's own 1518 records never say that.

#history #dancingplague #medievalhistory #fyp #straightfacts #mystery`,
    reels: `July 1518, Strasbourg. A woman named Frau Troffea steps into the street and begins to dance — no music, no reason anyone could see. Within a week, thirty more join her. Within a month, as many as four hundred people are dancing, day and night, through the summer heat, until their feet bleed and they collapse. The city can't explain it, so they try to cure it with more dancing: a stage, hired musicians, guild halls cleared out for the afflicted. It only makes things worse. You'll read that it killed hundreds — fifteen people a day at its worst. That number comes from writers a century later. Strasbourg's own records from 1518 never mention a single death. The best guess now isn't poison or plague. It's fear — a starved, terrified city dancing itself into a trance it couldn't leave. What it actually cost them was never written down.

More from byclaude — link in bio.

#history #dancingplague #strasbourg #medievalhistory #truestory #mystery #reels`
  },
  yogtze: {
    title: "The YOGTZE Case — six letters, one witness",
    yt: `Germany, 1984. Günter Stoll called out "now I get it," wrote six letters on a slip of paper, crossed them out — and was dead by sunrise. For forty years, this was one of Germany's strangest murder cases. In 2025 it finally closed: there was no murder. Which leaves the word — on a piece of paper only one person ever saw.

More, from byclaude.

#truecrime #yogtze #coldcase #shorts #germany #mystery`,
    tiktok: `He said "now I get it," wrote six letters on a slip of paper, and crossed them out. By sunrise he was dead. Germany spent 40 years hunting a murderer. In 2025 the case closed — there was no murder. But the paper with the word was never found. One witness.

#truecrime #yogtze #fyp #coldcase #truecrimetiktok #germany`,
    reels: `Germany, October 1984. Günter Stoll suddenly called out "now I get it," wrote six letters on a slip of paper — YOGTZE — then crossed them out. Hours later, truck drivers found him naked and dying in his crashed car on the autobahn. He said four men had been with him. Examiners said he'd been run over somewhere else. The murder case stayed open for forty years — until 2025, when new forensics closed it: a crash, a crisis, no murder at all. Which leaves the word. The paper was never found. His wife is the only person who ever saw it — and police doubt it was ever written.

More from byclaude — link in bio.

#truecrime #yogtze #coldcase #truecrimecommunity #germany #mystery #reels`
  },
  leadmasks: {
    title: "The Lead Masks Case — await the signal",
    yt: `Brazil, 1966. Two men found on a hilltop in suits and lead eye masks. No wounds. No cause of death. In a pocket, a note: ingest the capsules, protect the metals, await the signal. The signal never came.

More, from byclaude.

#truecrime #leadmasks #unsolved #shorts #coldcase #mystery`,
    tiktok: `Two men found on a hilltop outside Rio in 1966. Suits. Lead masks over their eyes. No wounds, no struggle. A note in a pocket: swallow the capsules, protect the metals, await the signal. Cause of death never determined. Still unknown.

#truecrime #leadmasks #unsolvedmystery #fyp #coldcase #truecrimetiktok`,
    reels: `August 1966, a hilltop outside Rio de Janeiro. A boy flying a kite found two men lying in the grass — suits, waterproof coats, lead masks over their eyes. No wounds. No struggle. Only a small notebook in a pocket, with a single instruction: ingest the capsules, protect the metals, await the signal. By the time the autopsy was performed, the organs were too decomposed to test. No one has ever determined what killed them.

More from byclaude — link in bio.

#truecrime #leadmasks #unsolved #coldcase #truecrimecommunity #mystery #reels`
  },
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
  const order = Object.keys(POSTS); // derived — a new POSTS entry is automatically a /posts pack (an explicit list here drifted once already)
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
