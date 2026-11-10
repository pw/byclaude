// captions.js — burned-in narration, word-timed. One phrase at a time in an ink label; the spoken word lights gold.
//
// CHUNKING: every narration line is cut into phrases, not into fixed lengths. A small dynamic programme picks the
// cut that costs least, where a chunk costs more when it has to be set smaller to fit the width cap, when it breaks
// in the middle of a phrase (worst of all after a word that leans forward: "of", "the", "a" ...), when it runs past
// a full stop, and when it leaves a one- or two-word tail on its own. So a short tail joins its neighbour whenever
// the width cap allows, and a long sentence is split into balanced phrases ("They're cousins" / "of deadly
// nightshade."). The wording is never touched: it is the narration verbatim. Widths are measured in the caption
// face, so the chunks are built on first use, after the fonts have loaded.
//
// MUTING (one rule for the whole film: the caption is hidden only while the same words are on screen as designed
// type): a scene declares
//     capOff: [[t0, t1], ...]          (absolute film seconds, on the object it pushes to SCENE_LIST)
// and any caption chunk whose spoken span lies at least half inside one of those ranges is not drawn at all
// (whole chunks only, so a caption never appears or vanishes mid-phrase). window.CAP_OFF = [[t0, t1], ...]
// is read the same way for ranges that belong to no scene file. CAP_CHUNKS() in the console lists every chunk
// with its spoken span, its set size and whether it is muted.
'use strict';
const CAP_SIZE = 66, CAP_MIN = 58, CAP_PADX = 34;       // type size, the smallest it may be set, pill padding
const CAP_MAXW = Math.round(W * .84);                   // the pill never spans more than 84% of the frame
const CAP_LEAN = new Set(['a', 'an', 'the', 'of', 'to', 'in', 'on', 'at', 'for', 'from', 'and', 'or', 'your', 'is', 'as', 'than', 'any', 'with', 'into', 'i', "it's", "there's", "they're"]);
const CAP_HEAD = new Set(['of', 'in', 'on', 'at', 'for', 'from', 'and', 'or', 'to', 'with', 'into', 'until', 'than', 'around', 'between']);
const capFont = size => ({ f: 'In', w: 800, size, ls: -1 });
let CAP_LIST = null, CAP_FONTS = false, CAP_RANGES = null;
fontsReady.then(() => { CAP_FONTS = true; CAP_LIST = null; });
function capBuild() {
  const o = capFont(CAP_SIZE), sp = CAP_SIZE * .27, maxText = CAP_MAXW - CAP_PADX * 2, hardW = maxText * CAP_SIZE / CAP_MIN;
  const bare = w => w.w.toLowerCase().replace(/[^a-z0-9'-]/g, ''), chunks = [];
  [...new Set(WORDS.map(w => w.line))].forEach(id => {
    const ws = WORDS.filter(w => w.line === id), n = ws.length, wd = ws.map(w => measure(w.w, o));
    const stop = i => /[.?!]$/.test(ws[i].w), semi = i => /[;:]$/.test(ws[i].w), comma = i => /,$/.test(ws[i].w);
    const cost = (j, i) => {                             // what it costs to set words j..i-1 as one chunk
      let width = -sp, chars = -1, inner = 0;
      for (let k = j; k < i; k++) { width += wd[k] + sp; chars += ws[k].w.length + 1; if (k < i - 1) inner += stop(k) ? 2.5 : semi(k) ? .5 : comma(k) ? .3 : 0; }
      if (width > hardW && i - j > 1) return Infinity;
      let c = 1 + inner + .6 * clamp((width - maxText) / (hardW - maxText)) + .004 * (chars - 18) * (chars - 18);
      const sentence = (j === 0 || stop(j - 1)) && stop(i - 1) && i - j > 1;
      if (i - j <= 2 && chars < 13 && !sentence && i - j < n) c += i - j === 1 ? 1 : .8;      // an orphan
      if (i < n) {                                       // the break that follows it
        const last = i - 1, open = !stop(last) && !semi(last) && !comma(last);
        c += stop(last) ? 0 : semi(last) ? .1 : comma(last) ? .25 : .9;
        if (open && CAP_LEAN.has(bare(ws[last]))) c += 1.5;
        if (open && CAP_HEAD.has(bare(ws[i]))) c -= .4;
        if (ws[i].s - ws[last].e >= .18) c -= .3;        // the voice pauses here anyway
      }
      return c;
    };
    const best = [0], from = [0];
    for (let i = 1; i <= n; i++) { best[i] = Infinity; for (let j = Math.max(0, i - 9); j < i; j++) { const c = best[j] + cost(j, i); if (c < best[i]) { best[i] = c; from[i] = j; } } }
    const cuts = []; for (let i = n; i > 0; i = from[i]) cuts.unshift([from[i], i]);
    cuts.forEach(([j, i]) => chunks.push({ words: ws.slice(j, i), line: id }));
  });
  chunks.forEach((c, i) => {
    const nx = chunks[i + 1], last = c.words[c.words.length - 1];
    c.ws = c.words[0].s; c.we = last.e;                 // spoken span
    c.s = c.ws - .06;
    const hold = last.e + .55, nextS = nx ? nx.words[0].s - .06 : 1e9;
    c.hard = nextS <= hold;                             // the next chunk follows straight on: swap, no fade
    c.e = Math.min(hold, nextS);
  });
  return chunks;
}
function capList() { if (CAP_LIST) return CAP_LIST; const l = capBuild(); if (CAP_FONTS) CAP_LIST = l; return l; }
function capRanges() {
  if (CAP_RANGES) return CAP_RANGES;
  const r = [];
  (window.SCENE_LIST || []).forEach(s => (s.capOff || []).forEach(x => r.push(x)));
  (window.CAP_OFF || []).forEach(x => r.push(x));
  return (CAP_RANGES = r);
}
function capMuted(c) {
  if (c.muted === undefined) {
    const span = Math.max(.01, c.we - c.ws);
    c.muted = capRanges().some(r => Math.min(c.we, r[1]) - Math.max(c.ws, r[0]) >= span * .5);
  }
  return c.muted;
}
// explicit layout: every word keeps its own box and a fixed word space, whatever is highlighted
function capLay(c) {
  const o = capFont(CAP_SIZE), maxText = CAP_MAXW - CAP_PADX * 2;
  const lay = () => { const sp = o.size * .27; let x = 0; const xs = c.words.map(w => { const ww = measure(w.w, o), x0 = x; x += ww + sp; return x0; }); return { xs, total: x - sp }; };
  let l = lay(); if (l.total > maxText) { o.size = Math.floor(CAP_SIZE * maxText / l.total); l = lay(); }
  return { o, xs: l.xs, total: l.total };
}
function CAP_CHUNKS() { return capList().map(c => c.ws.toFixed(2) + '-' + c.we.toFixed(2) + ' ' + capLay(c).o.size + 'px' + (capMuted(c) ? '  [muted] ' : '  ') + c.words.map(w => w.w).join(' ')); }
function drawCaptions(t, y = 1452) {
  const c = capList().find(c => t >= c.s && t < c.e); if (!c || capMuted(c)) return;
  const { o, xs, total: wFull } = capLay(c), padX = CAP_PADX, h = o.size * 1.62;
  // in: full strength on its first frame, with a three-frame settle; out: hard swap, or a short fade before a pause
  const inP = E.out3(clamp((t - c.s) / .1)), a = c.hard ? 1 : clamp((c.e - t) / .1);
  ctx.save(); ctx.globalAlpha = a;
  ctx.translate(W / 2, y + (1 - inP) * 10); ctx.scale(.94 + .06 * inP, .94 + .06 * inP);
  ctx.shadowColor = 'rgba(0,0,0,.28)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  rr(-wFull / 2 - padX, -h / 2, wFull + padX * 2, h, 22, 'rgba(24,21,20,.94)'); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(251,244,230,.16)'; ctx.lineWidth = 2; ctx.stroke();
  c.words.forEach((w, i) => {
    const spoken = t >= w.s - .03, nx = c.words[i + 1], active = spoken && (nx ? t < nx.s - .03 : true);
    txt(w.w, -wFull / 2 + xs[i], o.size * .355, Object.assign({}, o, { raw: 1, align: 'left', c: active ? C.gold : spoken ? C.cream : 'rgba(251,244,230,.62)' }));
  });
  ctx.restore();
}
