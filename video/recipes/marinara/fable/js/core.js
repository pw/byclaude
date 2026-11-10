// core.js — canvas, palette, easing, type, texture. Art direction: "tin-label print":
// flat cut-paper shapes, five inks, halftone shading, soft-serif display type. Light only exists in the hero.
'use strict';
const W = 1080, H = 1920, FPS = 30;
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const PARAMS = window.PARAMS || { lines: [], words: [], total: 90 };
const C = {
  paper: '#F4E9D4', paper2: '#EADBBE', tomato: '#D93A2B', red2: '#A9261B', red3: '#7C1A14',
  green: '#2C5A3C', green2: '#1F4530', leaf: '#4E8B4A', gold: '#EBAA2E', gold2: '#C98318',
  ink: '#1D1A19', ink2: '#2B2725', navy: '#22395C', cream: '#FBF4E6', crust: '#D9A766', steel: '#8E9499',
};

// ---- fact-checked on-screen copy (from film/film.html ON_SCREEN + onscreen.json). os() throws on anything else.
const ON_SCREEN = new Set(["2 NO-CHOP MARINARA RECIPES","MARINARA","\"sailor-style\"","nobody knows for sure why","A LITTLE HISTORY","THE AMERICAS","EUROPE","1500s","some Italians fried them","many grew them for looks","TOMATO","DEADLY NIGHTSHADE","cousins: both in the nightshade family","1692 · NAPLES","Antonio Latini, steward","Lo scalco alla moderna","\"...alla spagnuola\"","= Spanish-style","one of the earliest known printed tomato sauce recipes","served with boiled meat, not pasta","DOCUMENTED","1692: a Spanish-style tomato sauce in print (not called marinara)","LEGEND","sailors invented marinara","tradition, not records","PIZZA MARINARA · NAPLES","tomato","garlic","oregano","olive oil","no cheese","In America, “marinara” usually means the sauce","RECIPE 1","Microwave","Marinara","better than any jar","15-oz can tomato sauce","TOMATO SAUCE","15 OZ","2 tbsp cheap dry red wine","2-3 tsp dried Italian seasoning","rub it between your palms","1-2 tbsp olive oil","microwave-safe bowl, lid ajar","HIGH","3-4 min total","stir halfway","about 2 of those minutes at a boil (cooks off the raw wine taste)","1½ tsp onion powder","¾ tsp garlic powder (half the onion)","ONION","GARLIC","SALT","no salt: seasoned canned sauce has plenty (taste first)","stir until the oil blends in","RECIPE 2","No-Chop Skillet","even better","THE KNIFE HAS THE DAY OFF","1-2 tbsp olive oil · medium heat","1-2 tbsp tube tomato paste","break it up · let it brown","Italian seasoning · bloom 20-30 s","deglaze: wine + optional balsamic","reduce 2-3 min","the can + 1½ tsp onion, ¾ tsp garlic powder","2-3 min","THE SIGNATURE MOVE","sweep the edge","swirl to the middle","SAVE THIS FOR PASTA NIGHT","EPISODE 1 · MARINARA","EP. 1","?","until tiny droplets catch the light","more recipes coming","No-Chop Skillet Marinara"]);
// Re-lay-outs: a displayed fragment -> the checked string it is cut from (same words, same meaning).
const DERIVED = { '1692': '1692 · NAPLES', 'NAPLES': '1692 · NAPLES', 'RECIPE': 'RECIPE 1', '1': 'RECIPE 1', '2': 'RECIPE 2',
  'MARI': 'MARINARA', 'NARA': 'MARINARA', 'steward': 'Antonio Latini, steward', 'Antonio Latini': 'Antonio Latini, steward',
  'not pasta': 'served with boiled meat, not pasta', 'served with boiled meat': 'served with boiled meat, not pasta',
  'PIZZA MARINARA': 'PIZZA MARINARA · NAPLES', 'No-Chop': 'No-Chop Skillet', 'Skillet': 'No-Chop Skillet',
  'SAVE THIS': 'SAVE THIS FOR PASTA NIGHT', 'FOR PASTA NIGHT': 'SAVE THIS FOR PASTA NIGHT',
  'no salt': 'no salt: seasoned canned sauce has plenty (taste first)', 'taste first': 'no salt: seasoned canned sauce has plenty (taste first)',
  'half the onion': '¾ tsp garlic powder (half the onion)', '¾ tsp garlic powder': '¾ tsp garlic powder (half the onion)',
  'cooks off the raw wine taste': 'about 2 of those minutes at a boil (cooks off the raw wine taste)',
  'about 2 of those minutes at a boil': 'about 2 of those minutes at a boil (cooks off the raw wine taste)',
  'not called marinara': '1692: a Spanish-style tomato sauce in print (not called marinara)',
  'a Spanish-style tomato sauce in print': '1692: a Spanish-style tomato sauce in print (not called marinara)',
  'catch the light': 'until tiny droplets catch the light', 'until tiny droplets': 'until tiny droplets catch the light',
  'both in the nightshade family': 'cousins: both in the nightshade family', 'cousins': 'cousins: both in the nightshade family',
  'medium heat': '1-2 tbsp olive oil · medium heat', 'let it brown': 'break it up · let it brown', 'break it up': 'break it up · let it brown',
  'bloom 20-30 s': 'Italian seasoning · bloom 20-30 s', 'Italian seasoning': 'Italian seasoning · bloom 20-30 s',
  '1½ tsp onion, ¾ tsp garlic powder': 'the can + 1½ tsp onion, ¾ tsp garlic powder', 'the can': 'the can + 1½ tsp onion, ¾ tsp garlic powder',
  'lid ajar': 'microwave-safe bowl, lid ajar', 'EPISODE 1': 'EPISODE 1 · MARINARA',
};
function os(s) {
  const k = String(s).replace(/\n/g, ' ');
  if (ON_SCREEN.has(k)) return s;
  const src = DERIVED[k];
  if (src && ON_SCREEN.has(src) && src.includes(k)) return s;
  throw new Error('on-screen string not in the checked copy: ' + k);
}

// ---- math / easing
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const TAU = Math.PI * 2;
const E = {
  lin: t => t, out2: t => 1 - (1 - t) * (1 - t), out3: t => 1 - Math.pow(1 - t, 3), out5: t => 1 - Math.pow(1 - t, 5),
  expo: t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t), in3: t => t * t * t, in2: t => t * t,
  io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  io2: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  back: t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  spring: t => t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.exp(-6.5 * t) * Math.cos(11 * t),
  softspring: t => t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.exp(-5 * t) * Math.cos(6.5 * t),
};
// progress of t through [t0, t0+d] with easing
const pr = (t, t0, d, e = E.out3) => e(clamp((t - t0) / d));
// in-and-out envelope: rises over din at t0, falls over dout ending at t1
const env = (t, t0, t1, din = .35, dout = .3, e = E.out3) => Math.min(pr(t, t0, din, e), 1 - pr(t, t1 - dout, dout, E.in3));
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const boil = t => Math.floor(t * 8); // hand-drawn elements re-jitter 8x/s

// ---- narration timing helpers
const WORDS = PARAMS.words || [], LINES = PARAMS.lines || [];
const L = id => LINES.find(l => l.id === id) || { at: 0, dur: 1 };
// start time of the n-th occurrence (0-based) of a word (prefix match, case-insensitive) inside a line
function wt(line, word, n = 0, end = false) {
  const w = WORDS.filter(x => x.line === line && x.w.toLowerCase().replace(/[^a-z0-9'-]/g, '').startsWith(word.toLowerCase()));
  if (!w[n]) throw new Error('word not found: ' + line + ' ' + word);
  return end ? w[n].e : w[n].s;
}

// ---- fonts
const FONTS = [
  ['Fr', '../../../fonts/Fraunces.ttf', { weight: '100 900', variationSettings: '"SOFT" 100, "WONK" 0, "opsz" 144' }],
  ['FrI', '../../../fonts/Fraunces-Italic.ttf', { weight: '100 900', variationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144' }],
  ['Cav', '../../../fonts/Caveat.ttf', { weight: '400 700' }],
  ['In', '../../../fonts/Inter.ttf', { weight: '100 900' }],
  ['Bar', '../fonts/BarlowCondensed-Bold.ttf', { weight: '700' }],
  ['Bar', '../fonts/BarlowCondensed-SemiBold.ttf', { weight: '600' }],
];
const fontsReady = Promise.all(FONTS.map(([f, u, d]) => new FontFace(f, `url(${u})`, d).load().then(ff => document.fonts.add(ff))));

// ---- type. txt(): one string, many options. Returns measured width.
function setFont(o) { ctx.font = `${o.style || ''} ${o.w || 700} ${o.size || 60}px ${o.f || 'Fr'}`; ctx.letterSpacing = (o.ls || 0) + 'px'; }
function txt(s, x, y, o = {}) {
  if (!o.raw) os(s);
  const a = o.a === undefined ? 1 : o.a; if (a <= 0.003) return 0;
  ctx.save(); setFont(o); ctx.textBaseline = o.base || 'alphabetic';
  const w = ctx.measureText(s).width - (o.ls || 0);
  ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); if (o.sc !== undefined && o.sc !== 1) ctx.scale(o.sc, o.sc);
  let dx = o.align === 'left' ? 0 : o.align === 'right' ? -w : -w / 2;
  ctx.globalAlpha *= a; ctx.textAlign = 'left';
  if (o.mis) { ctx.fillStyle = o.mis; ctx.fillText(s, dx + (o.misd || 6), (o.misd || 6)); }
  if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = o.sw || 8; ctx.lineJoin = 'round'; ctx.strokeText(s, dx, 0); }
  ctx.fillStyle = o.c || C.ink; ctx.fillText(s, dx, 0);
  ctx.restore(); return w;
}
function measure(s, o) { ctx.save(); setFont(o); const w = ctx.measureText(s).width - (o.ls || 0); ctx.restore(); return w; }
// wrap a checked string to lines of maxW; returns array of lines
function wrap(s, o, maxW) {
  const words = s.split(' '), out = []; let cur = '';
  for (const w of words) { const tr = cur ? cur + ' ' + w : w; if (measure(tr, o) > maxW && cur) { out.push(cur); cur = w; } else cur = tr; }
  if (cur) out.push(cur); return out;
}
// paragraph: checked as a whole, drawn wrapped; lines reveal with a stagger driven by p (0..1)
function para(s, x, y, o, maxW, p = 1, lh = 1.18) {
  os(s); const ls = wrap(s, o, maxW);
  ls.forEach((l, i) => { const q = E.out3(clamp(p * (1 + ls.length * .35) - i * .35)); txt(l, x, y + i * o.size * lh + (1 - q) * 18, Object.assign({}, o, { raw: 1, a: (o.a === undefined ? 1 : o.a) * q })); });
  return ls.length;
}
// kinetic letters: each glyph rises/settles with a stagger. p is seconds since start.
function letters(s, x, y, o, sec, stag = .035, dur = .5, ease = E.back) {
  os(s); ctx.save(); setFont(o);
  const ws = [...s].map(ch => ctx.measureText(ch).width); const tot = ws.reduce((a, b) => a + b, 0) - (o.ls || 0);
  ctx.restore();
  let cx = o.align === 'left' ? x : o.align === 'right' ? x - tot : x - tot / 2;
  [...s].forEach((ch, i) => {
    const q = clamp((sec - i * stag) / dur), e = ease(q);
    if (q > 0 && ch !== ' ') txt(ch, cx + (ws[i] - (o.ls || 0)) / 2, y + (1 - e) * (o.rise === undefined ? o.size * .55 : o.rise), Object.assign({}, o, { raw: 1, align: 'center', a: (o.a === undefined ? 1 : o.a) * clamp(q * 4), rot: (1 - e) * (i % 2 ? .12 : -.12), ls: 0 }));
    cx += ws[i];
  });
  return tot;
}
// text along a circle arc, centred on angle a0 (radians, -PI/2 = top)
function arcText(s, cx, cy, r, a0, o, p = 1) {
  os(s); ctx.save(); setFont(o); ctx.fillStyle = o.c || C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const chars = [...s], ws = chars.map(ch => ctx.measureText(ch).width); const tot = ws.reduce((a, b) => a + b, 0);
  let ang = a0 - tot / r / 2;
  chars.forEach((ch, i) => { const q = E.out3(clamp(p * 1.6 - i / chars.length * .6)); ang += ws[i] / r / 2; ctx.save(); ctx.globalAlpha *= q * (o.a === undefined ? 1 : o.a); ctx.translate(cx + Math.cos(ang) * (r + (1 - q) * 30), cy + Math.sin(ang) * (r + (1 - q) * 30)); ctx.rotate(ang + Math.PI / 2); ctx.fillText(ch, 0, 0); ctx.restore(); ang += ws[i] / r / 2; });
  ctx.restore();
}

// ---- texture: paper grain + halftone patterns (deterministic)
const grainCv = document.createElement('canvas'); grainCv.width = 540; grainCv.height = 960;
(function () { const g = grainCv.getContext('2d'), im = g.createImageData(540, 960), r = rng(7);
  for (let i = 0; i < im.data.length; i += 4) { const v = 128 + (r() - .5) * 90 + (r() < .012 ? -70 : 0); im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  g.putImageData(im, 0, 0); })();
function grain(t, amt = .16) {
  const k = Math.floor(t * 10); ctx.save(); ctx.globalAlpha = amt; ctx.globalCompositeOperation = 'soft-light';
  ctx.translate(-hash(k) * 200, -hash(k + 9) * 200); ctx.scale(2.4, 2.4); ctx.drawImage(grainCv, 0, 0); ctx.restore();
}
const _pat = {};
function halftone(color, cell = 14, r = 3.4) {
  const key = color + cell + r; if (_pat[key]) return _pat[key];
  const c = document.createElement('canvas'); c.width = c.height = cell * 2; const g = c.getContext('2d'); g.fillStyle = color;
  [[cell / 2, cell / 2], [cell * 1.5, cell * 1.5]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); });
  return _pat[key] = ctx.createPattern(c, 'repeat');
}
function bg(color, t, dots) {
  ctx.fillStyle = color; ctx.fillRect(0, 0, W, H);
  if (dots) { ctx.save(); ctx.globalAlpha = .5; ctx.fillStyle = halftone(dots, 22, 2.2); ctx.fillRect(0, 0, W, H); ctx.restore(); }
}

// ---- tiny shape helpers
function circle(x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); if (fill) { ctx.fillStyle = fill; ctx.fill(); } }
function rr(x, y, w, h, r, fill) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } }
function at(x, y, sc, rot, fn, a) { ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); if (sc !== 1) ctx.scale(sc, sc); if (a !== undefined) ctx.globalAlpha *= a; fn(); ctx.restore(); }
// paper-cut drop shadow wrapper
function shadow(fn, dy = 10, blur = 0, col = 'rgba(29,26,25,.22)') { ctx.save(); ctx.shadowColor = col; ctx.shadowOffsetY = dy; ctx.shadowOffsetX = dy * .4; ctx.shadowBlur = blur; fn(); ctx.restore(); }
// label tag: condensed caps in a pill. p = reveal 0..1
function tag(s, x, y, o = {}, p = 1) {
  os(s); if (p <= 0) return; const size = o.size || 40, oo = { f: 'Bar', w: 700, size, ls: o.ls === undefined ? 3 : o.ls };
  const w = measure(s, oo), padX = size * .55, h = size * 1.5, e = E.back(clamp(p));
  at(x, y, .6 + .4 * e, o.rot || 0, () => { rr(-w / 2 - padX, -h / 2, w + padX * 2, h, o.sq ? 8 : h / 2, o.bg || C.ink); txt(s, 0, size * .35, Object.assign(oo, { raw: 1, c: o.c || C.paper })); }, clamp(p * 3));
}
// hand-written note in Caveat with optional underline squiggle
function note(s, x, y, o = {}, p = 1) {
  os(s); if (p <= 0) return 0; const oo = Object.assign({ f: 'Cav', w: 700, size: 64, c: C.ink }, o, { raw: 1 });
  const w = measure(s, oo), align = o.align || 'center', x0 = align === 'left' ? x : align === 'right' ? x - w : x - w / 2;
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 20, y - oo.size * 1.2, (w + 40) * E.out3(clamp(p)), oo.size * 1.9); ctx.clip(); txt(s, x, y, oo); ctx.restore(); return w;
}
// hand-drawn arrow / stroke along a quadratic, drawn on with p
function stroke(pts, col, lw, p = 1, dash) {
  if (p <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  if (pts.length === 3) ctx.quadraticCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1]); else for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  if (dash) ctx.setLineDash(dash); else { ctx.setLineDash([2000 * p, 4000]); }
  ctx.stroke(); ctx.restore();
}
