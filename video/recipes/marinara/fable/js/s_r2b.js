// s_r2b.js — L11: the skillet, top-down. One pan, five cards (one per spoken sentence); the whole build happens
// inside the circle. Each card is a headline under the pan (what goes in) and a label pinned on the pan's rim (what
// you do with it), held for its own sentence. The cards give amounts and method, the burned-in caption gives the
// spoken words (the two are not the same words, so the caption stays on, as in recipe 1).
'use strict';
const PAN = (function () {
  const r = rng(31), herbs = [], patches = [], bub = [], drops = [], dust = [];
  for (let i = 0; i < 44; i++) { const a = r() * TAU, d = Math.sqrt(r()) * 255; herbs.push([Math.cos(a) * d, Math.sin(a) * d, r() * TAU, .7 + r() * .7]); }
  for (let i = 0; i < 10; i++) { const a = i * TAU / 10 + r() * .5, d = 60 + r() * 130; patches.push([Math.cos(a) * d, Math.sin(a) * d, 34 + r() * 30, r() * TAU]); }
  for (let i = 0; i < 16; i++) { const a = r() * TAU, d = Math.sqrt(r()) * 190; bub.push([Math.cos(a) * d, Math.sin(a) * d, r() * 6]); }
  for (let i = 0; i < 9; i++) { const a = r() * TAU, d = 236 + r() * 40; drops.push([Math.cos(a) * d, Math.sin(a) * d, 7 + r() * 13, r() * .5]); }
  [[150, -92, -54, 104, 76, 0], [80, 98, -24, 70, 52, 1]].forEach(m => { for (let i = 0; i < m[0]; i++) { const a = r() * TAU, d = Math.pow(r(), .8); dust.push([m[1] + Math.cos(a) * d * m[3], m[2] + Math.sin(a) * d * m[4], 2.2 + r() * 3, d, m[5]]); } });
  return { herbs, patches, bub, drops, dust };
})();
function wobBlob(R, t, seed, amp = .06) {
  ctx.beginPath();
  for (let i = 0; i <= 48; i++) { const a = i / 48 * TAU, q = R * (1 + amp * Math.sin(a * 3 + seed + t * .8) + amp * .6 * Math.sin(a * 5 - seed * 2 - t * .5)); ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q); }
  ctx.closePath();
}
// the skillet from above, interior radius 300 at the origin; state is a pure function of film time
function panFlat(t) {
  const fl = pr(t, 62.2, .5, E.out3) * (1 - pr(t, 72.3, .7, E.io));   // heat off when the light comes on
  if (fl > 0) for (let i = 0; i < 20; i++) {
    const a = i * TAU / 20, f = .75 + .25 * Math.sin(t * 9 + i * 2.4);
    at(Math.cos(a) * 322, Math.sin(a) * 322, fl * f, a + Math.PI / 2, () => { ctx.beginPath(); ctx.moveTo(-26, 0); ctx.quadraticCurveTo(-24, -44, 0, -74); ctx.quadraticCurveTo(24, -44, 26, 0); ctx.closePath(); ctx.fillStyle = i % 2 ? C.gold : C.tomato; ctx.fill(); });
  }
  at(0, 0, 1, -.6, () => { rr(300, -36, 310, 72, 32, '#2B2725'); ctx.strokeStyle = '#6B645F'; ctx.lineWidth = 5; ctx.stroke(); circle(566, 0, 13, C.ink); });
  circle(0, 0, 334, '#2B2725'); ctx.strokeStyle = '#6B645F'; ctx.lineWidth = 6; ctx.stroke();
  circle(0, 0, 300, '#3A3432');
  ctx.save(); ctx.strokeStyle = 'rgba(251,244,230,.16)'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, 317, Math.PI * 1.05, Math.PI * 1.55); ctx.stroke(); ctx.restore();
  // time is a ring on the rim (as on the microwave): once for the bloom, once for the reduction
  [[66.2, .95], [69.12, 1.2]].forEach(k => {
    const a = env(t, k[0] - .05, k[0] + k[1] + .3, .15, .22), p = pr(t, k[0], k[1], E.lin); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round'; ctx.strokeStyle = C.gold; ctx.lineWidth = 13; ctx.beginPath(); ctx.arc(0, 0, 317, -Math.PI / 2, -Math.PI / 2 + Math.max(.001, p) * TAU); ctx.stroke();
    circle(Math.cos(-Math.PI / 2 + p * TAU) * 317, Math.sin(-Math.PI / 2 + p * TAU) * 317, 12, C.cream); ctx.restore();
  });
  ctx.save(); circle(0, 0, 296); ctx.clip();
  // oil: a thin film running out across the pan. The dark pan shows through it (a filled yellow shape reads as a yolk):
  // a faint amber tint, a fine bright edge, glints that drift, a few clear beads.
  const op = pr(t, 62.5, 1.1, E.out3);
  if (op > 0) {
    ctx.save(); ctx.translate(lerp(-64, 0, op), lerp(-70, 0, op)); ctx.lineCap = 'round';
    wobBlob(246 * op, t * 1.6, 1, .1); ctx.fillStyle = 'rgba(244,170,40,.3)'; ctx.fill(); ctx.strokeStyle = 'rgba(248,200,96,.62)'; ctx.lineWidth = 3; ctx.stroke();
    wobBlob(160 * op, t * 1.6, 4, .14); ctx.fillStyle = 'rgba(246,190,70,.1)'; ctx.fill();
    const g = Math.sin(t * 1.7) * .12;
    ctx.strokeStyle = 'rgba(255,242,206,.8)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 200 * op, Math.PI * (1.1 + g), Math.PI * (1.36 + g)); ctx.stroke();
    ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(0, 0, 158 * op, Math.PI * (1.19 + g * 1.6), Math.PI * (1.3 + g * 1.6)); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,242,206,.3)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, 204 * op, Math.PI * (.14 - g), Math.PI * (.29 - g)); ctx.stroke();
    ctx.restore();
    PAN.drops.forEach(d => { const q = pr(t, 62.9 + d[3], .35, E.back), rd = d[2] * .7; if (q > 0) at(d[0], d[1], q, 0, () => { circle(0, 0, rd, 'rgba(238,172,48,.28)'); ctx.strokeStyle = 'rgba(246,196,92,.75)'; ctx.lineWidth = 2.5; ctx.stroke(); ctx.strokeStyle = 'rgba(255,242,206,.85)'; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, rd * .55, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke(); }); });
  }
  const pp = pr(t, 63.75, .75, E.io), bk = pr(t, 64.85, 1.0, E.out3), brown = pr(t, 65.0, 2.2, E.lin), dis = pr(t, 67.5, 1.6, E.io);
  if (pp > 0 && bk < 1) {
    ctx.save(); ctx.globalAlpha = 1 - clamp(bk * 2.5); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    [['#C22F22', 44, 0], ['#E05A47', 9, -11]].forEach(s => { ctx.strokeStyle = s[0]; ctx.lineWidth = s[1]; ctx.beginPath();
      const n = Math.floor(60 * pp); for (let i = 0; i <= n; i++) { const q = i / 60; ctx.lineTo(-100 + q * 200, -10 + Math.sin(q * 9.5) * 52 + q * 20 + s[2]); } ctx.stroke(); });
    ctx.restore();
  }
  if (bk > 0 && dis < 1) {
    ctx.save(); ctx.globalAlpha = clamp(bk * 2.5) * (1 - dis); const col = mixc('#D93A2B', '#8A2C18', brown), col2 = mixc('#EC6A58', '#A8452A', brown);
    PAN.patches.forEach((p, i) => at(lerp(p[0] * .35, p[0], bk), lerp(p[1] * .2, p[1], bk), 1, p[3], () => { ctx.scale(1, .68); wobBlob(p[2], 0, p[3] * 3, .16); ctx.fillStyle = col; ctx.fill(); if (i % 2) { ctx.translate(-p[2] * .22, -p[2] * .2); wobBlob(p[2] * .3, 0, i, .2); ctx.fillStyle = col2; ctx.fill(); } }));
    ctx.restore();
  }
  const wp = pr(t, 67.35, .9, E.out3), red = pr(t, 69.2, 1.2, E.io);
  if (wp > 0) {
    ctx.globalAlpha = .93; wobBlob(lerp(262, 212, red) * wp, t, 2.2, .05); ctx.fillStyle = mixc('#6A1B2A', '#8A231C', red); ctx.fill(); ctx.globalAlpha = 1;
    const ba = env(t, 67.6, 70.7, .4, .3);
    if (ba > 0) { ctx.save(); ctx.globalAlpha = ba; ctx.strokeStyle = '#C0505A'; ctx.lineWidth = 4; PAN.bub.forEach(b => { const q = (t * 1.7 + b[2]) % 1; circle(b[0], b[1], 5 + q * 15); ctx.globalAlpha = ba * (1 - q); ctx.stroke(); }); ctx.restore(); }
  }
  const sp = pr(t, 70.55, .95, E.out3);
  if (sp > 0) {
    ctx.save(); circle(lerp(-70, 0, sp), lerp(-90, 0, sp), 330 * sp); ctx.clip();
    ctx.fillStyle = C.tomato; ctx.fillRect(-300, -300, 600, 600); ctx.fillStyle = halftone(C.red2, 13, 3.6); ctx.fillRect(-300, -300, 600, 600); circle(-40, -40, 280, C.tomato);
    const sw = pr(t, 71.2, .6, E.lin);
    if (sw > 0) { ctx.globalAlpha = sw * .75; ctx.strokeStyle = '#EC6A58'; ctx.lineWidth = 15; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(0, 0, 80 + i * 66, t * .6 + i * 2.1, t * .6 + i * 2.1 + 1.5); ctx.stroke(); } }
    ctx.restore();
  }
  // the powders land as specks and are gone (stirred in) before the light comes on
  [[71.1, 0], [71.36, 1]].forEach(k => { const a = env(t, k[0], 72.16, .3, .3); if (a <= 0) return; const p = pr(t, k[0], .4, E.out3);
    PAN.dust.forEach(d => { if (d[4] !== k[1] || p * 1.2 < d[3]) return; ctx.globalAlpha = a; circle(d[0], d[1], d[2], k[1] ? '#FAF3E2' : '#EBD3A0'); }); ctx.globalAlpha = 1; });
  PAN.herbs.forEach((g, i) => { const p = pr(t, 65.9 + i * .012, .3, E.back); if (p > 0) at(g[0], g[1], p * g[3], g[2], () => leaf(20, 8, i % 3 ? C.leaf : C.green, false)); });
  ctx.restore();
}
function r2Tube() {
  ctx.beginPath(); ctx.moveTo(-46, -108); ctx.lineTo(-17, -150); ctx.lineTo(17, -150); ctx.lineTo(46, -108); ctx.closePath(); ctx.fillStyle = '#E3D8C2'; ctx.fill();
  rr(-12, -178, 24, 32, 4, '#B9B2A6'); rr(-46, -110, 92, 226, 14, C.cream); rr(-46, -56, 92, 96, 0, C.tomato);
  circle(0, -8, 30, C.cream); at(0, -4, 1, 0, () => tomato(19)); rr(-54, 108, 108, 24, 6, '#B9B2A6');
}
// dried-herb jar (no words: green cap, herbs behind the glass, a leaf on the label). cap at -y
function r2HerbJar() {
  shadow(() => { rr(-52, -66, 104, 160, 18, '#E9DFC9'); rr(-56, -108, 112, 50, 10, C.green); }, 8);
  ctx.save(); rr(-52, -66, 104, 160, 18); ctx.clip(); ctx.fillStyle = C.green2; ctx.fillRect(-60, -46, 120, 150);
  const r = rng(5); for (let i = 0; i < 26; i++) at((r() - .5) * 96, -40 + r() * 130, 1, r() * 6, () => rr(-8, -3, 16, 6, 3, C.leaf)); ctx.restore();
  rr(-56, -108, 112, 50, 10, C.green); ctx.fillStyle = 'rgba(251,244,230,.45)'; for (let i = -2; i <= 2; i++) ctx.fillRect(i * 19 - 3, -100, 6, 34);
  rr(-36, -2, 72, 56, 6, C.cream); at(-24, 26, .6, 0, () => leaf(80, 34, C.green, true));
}
// balsamic: a small squat dark bottle, neck at -y
function r2Balsamic() {
  shadow(() => { rr(-42, -36, 84, 150, 18, '#6B3A2A'); rr(-15, -96, 30, 70, 6, '#6B3A2A'); }, 8);
  rr(-19, -114, 38, 26, 5, C.gold); ctx.fillStyle = 'rgba(251,244,230,.28)'; ctx.fillRect(-32, -28, 9, 132);
  rr(-31, 10, 62, 64, 5, C.cream); circle(0, 42, 17, '#5A1E22'); circle(-5, 37, 5, '#8A3A3E');
}
(window.SCENE_LIST = window.SCENE_LIST || []).push((function () {
  const PX = 540, PY = 760, GY = 800, GS = 1.12;   // everything over the pan is laid out round (PX, PY) at 1:1, then shown at GS round (PX, GY)
  // one card per spoken sentence: [in, out, headline, [[label time, label], ...]]. A card swaps to the next in two
  // frames (never a slow fade to grey), and every label is up within ~0.3 s of its headline unless it names a later
  // action, so each piece of type holds for well over a second.
  const CARDS = [
    [62.1, 63.6, '1-2 tbsp olive oil', [[62.26, 'medium heat']]],
    [63.6, 65.6, '1-2 tbsp tube tomato paste', [[64.3, 'let it brown']]],
    [65.6, 67.14, 'Italian seasoning', [[65.9, 'bloom 20-30 s']]],
    [67.14, 70.34, 'deglaze: wine + optional balsamic', [[68.75, 'reduce 2-3 min']]],
    [70.34, 72.2, '15-oz can tomato sauce', [[70.42, '1½ tsp onion powder'], [70.54, '¾ tsp garlic powder']]],
  ];
  const RIM_Y = GY + 338 * GS, BAR_Y = 1266, HEAD_Y = 1346;   // label on the rim, progress, headline; the caption sits below at 1452
  // a spice jar tipped over the pan, shaking; the flipped label reads the right way up
  function shake(t, x, y, dir, tin, tout, draw, col, n) {
    const e = env(t, tin, tout, .28, .25, E.out3); if (e <= 0) return;
    const th = dir * 2.7, ax = Math.sin(th), ay = -Math.cos(th), sh = env(t, tin + .18, tout - .2, .08, .1), off = Math.sin(t * 40) * 12 * sh, side = -dir * (1 - e) * 660;
    if (sh > 0) { ctx.save(); ctx.fillStyle = col; for (let i = 0; i < n; i++) { const q = (t * 2.1 + hash(i * 7.3 + x)) % 1; ctx.globalAlpha = sh * (1 - q * .35); circle(x + ax * 122 + (hash(i * 3.1 + x) - .5) * 84 * (.25 + q), y + ay * 122 + 6 + q * q * 170, 2.2 + hash(i + 2.5) * 2.8); ctx.fill(); } ctx.restore(); }
    at(x + ax * off + side, y + ay * off, .92, th, draw);
  }
  return {
    id: 'r2pan', t0: 62.1, tin: 'push', tdur: .5,
    cues: [{ t: 62.1, k: 'whoosh' }, { t: 62.45, k: 'glug', gain: .8 }, { t: 62.9, k: 'sizzle', dur: 4.2, gain: .45 }, { t: 63.6, k: 'pop', gain: .7 }, { t: 64.3, k: 'pop', gain: .6 }, { t: 64.9, k: 'scrape', gain: .7 },
      { t: 65.6, k: 'pop', gain: .6 }, { t: 65.8, k: 'shake', gain: .7 }, { t: 67.14, k: 'pop', gain: .6 }, { t: 67.32, k: 'splash', gain: .8 }, { t: 67.42, k: 'hiss' }, { t: 68.75, k: 'pop', gain: .6 }, { t: 69.3, k: 'stir', gain: .8 },
      { t: 70.34, k: 'pop', gain: .6 }, { t: 70.58, k: 'splash' }, { t: 71.14, k: 'shake', gain: .6 }, { t: 71.7, k: 'whoosh', gain: .6 }],
    draw(t) {
      bg(C.ink, t, C.ink2);
      const z = pr(t, 71.7, .5, E.io2), ui = 1 - pr(t, 71.76, .12, E.lin);   // the type clears in a few frames, then the push lands on the hero's framing at 72.2
      if (ui > 0) { ctx.save(); ctx.globalAlpha = ui; tag('RECIPE 2', 176, 274, { size: 44, bg: C.gold, c: C.ink, ls: 5 }); txt('No-Chop Skillet', 300, 291, { f: 'FrI', w: 700, size: 52, c: C.cream, align: 'left' }); ctx.restore(); }
      at(PX, lerp(GY, 830, z), lerp(GS, 1.5, z), 0, () => panFlat(t));
      ctx.save(); ctx.translate(PX, GY); ctx.scale(GS, GS); ctx.translate(-PX, -PY);
      // sizzle when the paste hits the oil and when the herbs bloom
      [63.8, 65.95].forEach(k => at(PX, PY, 1, 0, () => ticks(12, 110, 190, 'rgba(251,244,230,.8)', 6, pr(t, k, .55, E.lin), .3)));
      // steam off the deglaze
      const st = env(t, 67.45, 70.3, .4, .6);
      if (st > 0) [[-120, -150], [70, -200], [150, -90]].forEach((s, i) => at(PX + s[0], PY + s[1], 1.1, 0, () => steam(t + i * .7, 1), st * .8));
      // spoon: chops the paste apart, later stirs the reduction. It slides in and out along its handle, never fades.
      const s1 = env(t, 64.72, 65.62, .28, .26, E.out3), s2 = env(t, 69.15, 70.32, .3, .26, E.out3), so = Math.max(s1, s2);
      if (so > 0) { const far = 1 - so, jab = s1 > 0, ph = t * 5.2, bx = jab ? PX + Math.sin(t * 10) * 84 : PX + Math.cos(ph) * 120, by = jab ? PY + 6 + Math.cos(t * 7.3) * 52 : PY + Math.sin(ph) * 80;
        at(bx + far * 790, by + far * 430, 1, .5 + Math.sin(jab ? t * 10 : ph) * .08, () => shadow(() => spoon(520), 10)); }
      // 1 oil
      const ob = env(t, 62.15, 63.55, .3, .3, E.out3);
      if (ob > 0) { stream(438, 506, 470, 684, 15 + 4 * Math.sin(t * 20), 'rgba(238,176,48,.92)', pr(t, 62.34, .22, E.lin), pr(t, 63.2, .25, E.lin)); at(300 - (1 - ob) * 460, 440, .8, lerp(1.3, 2.0, pr(t, 62.2, .3, E.io)), () => shadow(() => bottle('oil'), 10)); }
      // 2 paste tube follows the squiggle
      const tb = env(t, 63.5, 64.75, .3, .3, E.out3);
      if (tb > 0) { const q = pr(t, 63.75, .75, E.io), tx = PX - 100 + q * 200, ty = PY - 10 + Math.sin(q * 9.5) * 52 + q * 20; at(tx + 84 + (1 - tb) * 560, ty - 142 - (1 - tb) * 260, .9, -2.6, () => shadow(r2Tube, 10)); }
      // 3 dried herbs shaken in
      const hp = pr(t, 65.78, .95, E.lin); if (hp > 0 && hp < 1) at(650, 566, 1, 0, () => flecks(40, hp, 5, C.leaf, 150, 170, 7));
      shake(t, 700, 470, -1, 65.55, 66.95, r2HerbJar, C.leaf, 0);
      // 4 wine, then (maybe) a few drops of balsamic
      const wb = env(t, 67.05, 68.42, .3, .3, E.out3);
      if (wb > 0) { stream(652, 526, 610, 694, 16, '#7A1F2B', pr(t, 67.24, .2, E.lin), pr(t, 68.05, .25, E.lin)); at(790 + (1 - wb) * 460, 460, .8, -lerp(1.3, 2.0, pr(t, 67.1, .3, E.io)), () => shadow(() => bottle('wine'), 10)); }
      const bb = env(t, 68.22, 69.08, .28, .26, E.out3);
      if (bb > 0) {
        for (let i = 0; i < 3; i++) { const q = pr(t, 68.46 + i * .15, .26, E.in2); if (q > 0 && q < 1) { ctx.beginPath(); ctx.ellipse(424, lerp(536, 700, q), 8, 12, 0, 0, TAU); ctx.fillStyle = '#4A1A1C'; ctx.fill(); circle(421, lerp(536, 700, q) - 4, 2.5, '#B8737A'); } }
        at(330 - (1 - bb) * 480, 474, .9, lerp(1.4, 2.15, pr(t, 68.26, .25, E.io)), r2Balsamic);
      }
      // 5 the can, then the two powders (same jars, same amounts as recipe 1)
      const cb = env(t, 70.25, 71.0, .3, .26, E.out3);
      if (cb > 0) { stream(416, 530, 470, 694, 44, C.tomato, pr(t, 70.45, .2, E.lin), pr(t, 70.82, .2, E.lin)); at(300 - (1 - cb) * 480, 460, .85, lerp(1.2, 1.95, pr(t, 70.3, .3, E.io)), () => canS(1)); }
      shake(t, 366, 470, 1, 70.94, 71.66, () => jarS('ONION', C.ink, { flip: 1, fill: '#D9B77A' }), '#EBD3A0', 26);
      shake(t, 714, 470, -1, 71.2, 71.9, () => jarS('GARLIC', C.ink, { flip: 1, fill: '#EFE6CF' }), '#FAF3E2', 16);
      ctx.restore();
      // the cards
      if (ui > 0) {
        const cur = CARDS.reduce((a, c, i) => t >= c[0] ? i : a, -1), bw = 112, gap = 16, x0 = 540 - (5 * bw + 4 * gap) / 2;
        ctx.save(); ctx.globalAlpha = ui * pr(t, 62.1, .3, E.lin);
        CARDS.forEach((c, i) => { const x = x0 + i * (bw + gap); rr(x, BAR_Y, bw, 9, 4.5, '#4A4441'); const f = i < cur ? 1 : i === cur ? pr(t, c[0], c[1] - c[0], E.lin) : 0; if (f > 0) rr(x, BAR_Y, Math.max(9, bw * f), 9, 4.5, i < cur ? C.gold2 : C.gold); });
        ctx.restore();
        CARDS.forEach((c, i) => {
          const a = pr(t, c[0], .3, E.out5), al = clamp(a * 3) * (1 - pr(t, c[1] - .07, .07, E.lin)) * ui; if (al <= 0) return;
          const o = { f: 'Fr', w: 800, size: 62, c: C.cream }; o.size = Math.min(62, Math.floor(62 * 930 / measure(c[2], o)));
          ctx.save(); ctx.globalAlpha = al;
          txt(c[2], 540, HEAD_Y + (1 - a) * 36, o);
          const size = c[3].length > 1 ? 42 : 52, to = { f: 'Bar', w: 700, size, ls: 2 }, ws = c[3].map(s => measure(s[1], to) + size * 1.1), tot = ws.reduce((p, w) => p + w, 0) + 18 * (ws.length - 1);
          let x = 540 - tot / 2; c[3].forEach((s, j) => { tag(s[1], x + ws[j] / 2, RIM_Y, { size, bg: C.gold, c: C.ink, ls: 2 }, pr(t, s[0], .26, E.lin)); x += ws[j] + 18; });
          ctx.restore();
        });
      }
    }
  };
})());
