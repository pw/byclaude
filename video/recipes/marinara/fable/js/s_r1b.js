// s_r1b.js — recipe 1, second half: into the microwave, then the powders, no salt, stir, done.
'use strict';
function r1Header() {
  tag('RECIPE 1', 176, 240, { size: 44, bg: C.green, c: C.cream, ls: 5 });
  const w0 = txt('Microwave', 300, 257, { f: 'FrI', w: 700, size: 52, c: C.green, align: 'left' }); txt('Marinara', 314 + w0, 257, { f: 'FrI', w: 700, size: 52, c: C.green, align: 'left' });
}
(window.SCENE_LIST = window.SCENE_LIST || []).push((function () {
  const tCov = wt('L08', 'cover'), tThree = wt('L08', 'three'), tHigh = wt('L08', 'high'), tStir = wt('L08', 'stirring');
  const MX = 540, MY = 800, S = 1.25, WX = MX - 110 * S;
  // the pointer from the lid label to the lid in the window: a cut-paper line (cream under green) so it reads on the
  // cream door and on the dark glass alike
  const ARROW = [[232, 458], [168, 610], [292, 742]];
  function pointer(p) {
    if (p <= 0) return;
    [[C.cream, 15], [C.green, 7]].forEach(s => {
      stroke(ARROW, s[0], s[1], p);
      if (p > .2) { const a = Math.atan2(ARROW[2][1] - ARROW[1][1], ARROW[2][0] - ARROW[1][0]);
        ctx.save(); ctx.strokeStyle = s[0]; ctx.lineWidth = s[1]; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
        ctx.moveTo(ARROW[2][0] - Math.cos(a - .55) * 34, ARROW[2][1] - Math.sin(a - .55) * 34); ctx.lineTo(ARROW[2][0], ARROW[2][1]); ctx.lineTo(ARROW[2][0] - Math.cos(a + .55) * 34, ARROW[2][1] - Math.sin(a + .55) * 34); ctx.stroke(); ctx.restore(); }
    });
  }
  return {
    id: 'r1mw', t0: 49.6, tin: 'cut', capOff: [[50.85, 51.6]],
    cues: [{ t: 49.6, k: 'whoosh' }, { t: tCov, k: 'pop' }, { t: tThree - .12, k: 'beep', gain: .7 }, { t: tThree, k: 'hum', dur: 2.1 }, { t: tHigh, k: 'pop', gain: .6 }, { t: tStir, k: 'stir' }, { t: 53.02, k: 'ding', gain: .8 }],
    draw(t) {
      bg(C.paper, t); r1Header();
      const m = pr(t, 49.6, .55, E.out5), on = pr(t, tThree, .25, E.lin) * (1 - pr(t, 53.0, .15, E.lin));
      if (m > 0) at(MX, MY, S * (1 + (1 - m) * .45), 0, () => microwave(t, on), clamp(m * 1.4));
      // the bowl from the scene before (same place, same size) flies into the window
      const f = pr(t, 49.6, .5, E.io); if (f < 1) at(lerp(540, WX, f), lerp(300 + 500 * R1_STAGE, MY + 30 * S, f), lerp(R1_STAGE, .3 * S, f), 0, () => glassBowl(t, .86, 1, 1, 0), 1 - pr(t, 49.98, .12, E.lin));
      // the timer is a ring round the window, never digits
      const p1 = pr(t, tThree, tStir - tThree, E.lin) * .5 + pr(t, tStir + .42, .5, E.io) * .5, ra = pr(t, tThree - .1, .3, E.lin);
      if (ra > 0) {
        ctx.save(); ctx.globalAlpha = ra; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(29,26,25,.14)'; ctx.lineWidth = 18; ctx.beginPath(); ctx.arc(WX, MY, 252, 0, TAU); ctx.stroke();
        ctx.strokeStyle = C.tomato; ctx.beginPath(); ctx.arc(WX, MY, 252, -Math.PI / 2, -Math.PI / 2 + Math.max(.001, p1) * TAU); ctx.stroke();
        const a = -Math.PI / 2 + p1 * TAU; circle(WX + Math.cos(a) * 252, MY + Math.sin(a) * 252, 17, C.tomato); ctx.restore();
      }
      const hp = pr(t, tHigh - .05, .3, E.back); if (hp > 0) { rr(MX + 176 * S, MY - 180 * S, 200, 88, 15, C.ink2); txt('HIGH', MX + 256 * S, MY - 180 * S + 64, { f: 'Bar', w: 700, size: 58 * hp, c: C.gold, ls: 6 }); }
      // the lid note is a label, like "stir halfway" (script on cream was too thin for a phone). It stays, so the last
      // frames carry the whole instruction: bowl + lid, HIGH, 3-4 min, stir halfway.
      pointer(pr(t, tCov + .28, .35, E.io));
      tag('microwave-safe bowl, lid ajar', 540, 410, { size: 54, bg: C.green, c: C.cream, ls: 2 }, pr(t, tCov - .04, .3, E.lin));
      const sp = pr(t, tStir - .05, .3, E.lin); if (sp > 0) at(WX, MY + 252, 1, Math.sin(t * 16) * .05 * env(t, tStir, tStir + .6, .1, .2), () => tag('stir halfway', 0, 0, { size: 52, bg: C.green, c: C.cream, ls: 3 }, sp));
      letters('3-4 min total', 540, 1292, { f: 'Fr', w: 900, size: 130, c: C.ink }, t - (tThree - .12), .03, .45);
    }
  };
})());

(window.SCENE_LIST = window.SCENE_LIST || []).push((function () {
  const tOn = wt('L09', 'onion'), tHalf = wt('L09', 'half'), tNo = wt('L09', 'no'), tDone = wt('L09', 'done');
  const tS0 = 56.78;   // the spoon goes in under "the can's seasoned" so the sauce is blended on "Stir." and finished on "Done."
  const CX = 540, CY = 797, S0 = 1.2, R = 250, r0 = rng(77), herbs = [], oils = [];
  for (let i = 0; i < 44; i++) { const a = r0() * TAU, d = Math.sqrt(r0()) * 220; herbs.push([Math.cos(a) * d, Math.sin(a) * d, r0() * 6]); }
  for (let i = 0; i < 24; i++) { const a = r0() * TAU, d = 40 + r0() * 185; oils.push([Math.cos(a) * d, Math.sin(a) * d, 8 + Math.pow(r0(), 1.8) * 24, r0() * TAU]); }
  // oil floating on sauce: small clear "eyes" — a thin amber ring, a faint tint inside, one highlight (never a filled yellow disc)
  function oilEye(x, y, r, rot, a) {
    if (a <= 0 || r < 1) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= a;
    ctx.beginPath(); ctx.ellipse(0, 0, r, r * .82, 0, 0, TAU); ctx.fillStyle = 'rgba(250,196,70,.24)'; ctx.fill(); ctx.strokeStyle = 'rgba(248,200,92,.9)'; ctx.lineWidth = Math.max(2, r * .13); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,246,214,.9)'; ctx.lineWidth = Math.max(2, r * .12); ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(0, 0, r * .56, r * .44, 0, Math.PI * 1.1, Math.PI * 1.5); ctx.stroke(); ctx.restore();
  }
  // a powder is a dusting of specks, dense in the middle and thin at the edge (never a solid oval)
  function mound(n, sx, sy, rot) {
    const p = [], c = Math.cos(rot), s = Math.sin(rot);
    for (let i = 0; i < n; i++) { const a = r0() * TAU, d = Math.pow(r0(), .8), x = Math.cos(a) * d * sx, y = Math.sin(a) * d * sy; p.push([x * c - y * s, x * s + y * c, 1.8 + r0() * 2.8, d, r0() < .3 ? 1 : 0]); }
    p.sx = sx; p.sy = sy; p.rot = rot; return p;
  }
  const onion = mound(210, 112, 84, .3), garlic = mound(110, 78, 58, -.3);
  // soak 0..1: a powder on wet sauce drinks it up within a second: it goes from a pale pile to sauce-coloured specks.
  // (Both are soaked before the salt shows up, so nothing white is lying under the SALT jar.)
  function dusting(pts, cx, cy, p, blend, cols, soak) {
    if (p <= 0 || blend >= 1) return; const k = 1 + blend * .9, a = (1 - blend) * (1 - .78 * soak), cc = cols.map(c => mixc(c, '#DE5540', soak * .7));
    ctx.save(); ctx.translate(cx, cy);
    ctx.globalAlpha = (1 - blend) * (1 - soak) * .24 * p; ctx.fillStyle = cols[0]; ctx.beginPath(); ctx.ellipse(0, 0, pts.sx * .66 * p * k, pts.sy * .66 * p * k, pts.rot, 0, TAU); ctx.fill();
    pts.forEach(q => { const s = clamp((p * 1.25 - q[3]) * 4); if (s <= 0) return; ctx.globalAlpha = a * s; circle(q[0] * k, q[1] * k, q[2] * (1 - .25 * soak), cc[q[4]]); });
    ctx.restore();
  }
  function bowlTop(t, blend, stir, dn) {
    shadow(() => circle(0, 0, R + 36, C.cream), 16); ctx.strokeStyle = C.ink; ctx.lineWidth = 8; circle(0, 0, R + 36); ctx.stroke(); ctx.strokeStyle = C.paper2; ctx.lineWidth = 5; circle(0, 0, R + 16); ctx.stroke();
    ctx.save(); circle(0, 0, R); ctx.clip(); ctx.fillStyle = C.tomato; ctx.fillRect(-R, -R, R * 2, R * 2); ctx.fillStyle = halftone(C.red2, 13, 3.6); ctx.fillRect(-R, -R, R * 2, R * 2); circle(-40, -40, R * .93, C.tomato);
    // blended: the oil is in the sauce now, so the whole surface turns a shade warmer
    if (blend > 0) { ctx.globalAlpha = blend * .2; circle(-40, -40, R * .93, '#F58A2E'); ctx.globalAlpha = 1; }
    ctx.save(); ctx.rotate(stir * 2.6);
    // oil: translucent amber pools that thin out to nothing as they are stirred in
    oils.forEach(o => oilEye(o[0], o[1], o[2] * (1 - blend * .6), o[3], 1 - blend));
    dusting(onion, -100, -44, pr(t, tOn + .3, .95, E.out3), blend, ['#EBD3A0', '#CFA95F'], pr(t, 54.7, .65, E.io2));
    dusting(garlic, 104, -40, pr(t, tHalf + .4, .75, E.out3), blend, ['#FAF3E2', '#DCCFB2'], pr(t, 55.42, .5, E.io2));
    herbs.forEach((h, i) => at(h[0], h[1], 1, h[2], () => rr(-8, -3, 16, 6, 3, i % 3 ? C.green2 : C.leaf)));
    // the spoon's wake, there while it stirs and smoothed over once the sauce is done
    const wake = Math.min(1, stir * 3) * (1 - dn * .85);
    if (wake > 0) { ctx.globalAlpha = wake * .9; ctx.strokeStyle = '#EC6A58'; ctx.lineWidth = 15; ctx.lineCap = 'round'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(0, 0, 50 + i * 52, i * 1.7, i * 1.7 + 1.9); ctx.stroke(); } }
    ctx.restore();
    // finished = glossy: a wide crescent of light on the near edge, a glint, and one band of light that crosses the surface
    if (dn > 0) {
      ctx.lineCap = 'round'; ctx.strokeStyle = C.cream;
      ctx.globalAlpha = .72 * dn; ctx.lineWidth = 17; ctx.beginPath(); ctx.arc(0, 0, R - 38, Math.PI * 1.08, Math.PI * (1.08 + .36 * dn)); ctx.stroke();
      ctx.globalAlpha = .5 * dn; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 0, R - 70, Math.PI * 1.17, Math.PI * (1.17 + .17 * dn)); ctx.stroke();
      ctx.globalAlpha = .3 * dn; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(0, 0, R - 34, Math.PI * .14, Math.PI * .3); ctx.stroke();
      ctx.globalAlpha = .8 * dn; circle(-R * .5, -R * .62, 9, C.cream);
      const sw = pr(t, tDone + .04, .62, E.io2);
      if (sw > 0 && sw < 1) { ctx.globalAlpha = .3 * Math.sin(sw * Math.PI); ctx.rotate(-.6); ctx.fillStyle = C.cream; const x = lerp(-R * 1.5, R * 1.5, sw); ctx.fillRect(x - 46, -R * 1.5, 92, R * 3); ctx.fillRect(x + 70, -R * 1.5, 22, R * 3); }
    }
    ctx.restore();
  }
  // "done" without a word: a gold seal with a tick, stamped on the rim
  function seal(q) {
    if (q <= 0) return;
    at(0, 0, .5 + .5 * E.back(q), -.2 + (1 - q) * .5, () => {
      shadow(() => circle(0, 0, 72, C.gold), 8); ctx.strokeStyle = C.ink; ctx.lineWidth = 4; circle(0, 0, 58); ctx.stroke();
      stroke([[-30, 2], [-9, 25], [-9, 25], [33, -23]], C.ink, 15, clamp(q * 1.6 - .3) * .06);   // (stroke() reveals 2000 px per unit p)
    }, clamp(q * 4));
  }
  // a spice jar held nearly upside down over the bowl; the label is flipped so the word reads the right way up.
  // It comes and goes sideways, level with the bowl, so it never crosses the header.
  function shaker(t, label, x, y, t0, t1, dir, fill, n, col) {
    const p = pr(t, t0 - .12, .4, E.out5), o = pr(t, t1, .3, E.in3); if (p <= 0 || o >= 1) return;
    const th = dir * 2.7, ax = Math.sin(th), ay = -Math.cos(th), sh = env(t, t0 + .22, t1 - .04, .1, .1), off = Math.sin(t * 40) * 13 * sh, side = -dir * ((1 - p) + o) * 660;
    // powder falling from the cap to the sauce
    if (sh > 0) { ctx.save(); ctx.fillStyle = col; for (let i = 0; i < n; i++) { const q = (t * 2.1 + hash(i * 7.3 + x)) % 1; ctx.globalAlpha = sh * (1 - q * .35); circle(x + ax * 132 + (hash(i * 3.1 + x) - .5) * 86 * (.25 + q), y + ay * 132 + 6 + q * q * 176, 2 + hash(i + 2.5) * 2.6); ctx.fill(); } ctx.restore(); }
    at(x + ax * off + side, y + ay * off, 1, th, () => jarS(label, C.ink, { flip: 1, fill }));
  }
  const rows = [['1½ tsp onion powder', tOn, C.gold2], ['¾ tsp garlic powder (half the onion)', tHalf, C.steel]];
  const tSaltOut = 56.48;
  return {
    id: 'r1fin', t0: 53.2, iris: [402, 800], ring: C.ink, tdur: .5,
    cues: [{ t: 53.2, k: 'whoosh' }, { t: tOn - .12, k: 'pop' }, { t: tOn + .25, k: 'shake' }, { t: tHalf, k: 'pop', gain: .7 }, { t: tHalf + .3, k: 'shake', gain: .6 }, { t: tNo - .1, k: 'pop' }, { t: tNo + .22, k: 'scrape', gain: .8 },
      { t: tSaltOut, k: 'swish', gain: .6 }, { t: tS0 + .1, k: 'stir' }, { t: tDone, k: 'ding' }, { t: tDone + .05, k: 'shimmer', gain: .5 }, { t: tDone + .14, k: 'pop', gain: .7 }],
    draw(t) {
      bg(C.paper, t); r1Header();
      const stir = pr(t, tS0, .95, E.io), blend = pr(t, tS0 + .1, .62, E.io), dn = pr(t, tDone, .5, E.out3);
      // on "Done." the list clears and the bowl comes forward: the finished shot, held to the end of the scene
      const big = pr(t, tDone - .16, .42, E.io), sc = S0 * (lerp(1, 1.15, big) + .045 * Math.sin(pr(t, tDone - .02, .4, E.lin) * Math.PI)), cy = lerp(CY, 905, big);
      at(CX, cy, sc, 0, () => {
        if (dn > 0) ticks(18, R + 52, R + 94, C.gold, 9, dn);
        bowlTop(t, blend, stir, dn);
      });
      const stm = pr(t, tDone + .02, .45, E.lin);
      if (stm > 0) at(CX - 20, cy - 110, 1.5, 0, () => { steam(t * 1.5, stm, 'rgba(29,26,25,.13)', 200, 15); steam(t * 1.5, stm, 'rgba(251,244,230,.92)', 200, 9); });
      shaker(t, 'ONION', 372, 446, tOn - .05, 54.62, 1, '#D9B77A', 30, '#C9A85E');
      shaker(t, 'GARLIC', 708, 446, tHalf, 55.52, -1, '#EFE6CF', 18, '#CFC3A6');
      // salt: shown upright, refused, tossed aside. It pops in place (never across the header); the cross goes behind
      // the label so the word stays whole.
      const sIn = pr(t, tNo - .1, .32, E.back), sOut = pr(t, tSaltOut, .3, E.in3);
      if (sIn > 0 && sOut < 1) at(540 + Math.sin(t * 30) * 16 * env(t, tNo + .2, tNo + .7, .05, .4) + sOut * 760, 408 - Math.sin(sOut * 2.4) * 50, .9 * sIn, sOut * 1.5, () => jarS('SALT', C.navy, { fill: '#F3EEE2', mid: () => at(0, 8, 1, 0, () => strike(104, C.tomato, 20, pr(t, tNo + .2, .3, E.out3))) }), clamp(sIn * 3));
      const sa = pr(t, tS0 - .12, .32, E.out5), so = pr(t, tDone - .2, .3, E.in3), a = (t - tS0) * 9 + 2, far = (1 - sa) + so;
      if (far < 1) at(CX + Math.cos(a) * 118 + far * 520, cy + Math.sin(a) * 118 - far * 470, 1.15, -.75, () => spoon(440));
      at(540, 392, 1, -.03, () => note('stir until the oil blends in', 0, 0, { size: 84, c: C.green2 }, pr(t, tS0 + .1, .45, E.lin)));
      // the seal lands on the rim once the spoon is out
      if (dn > 0) { at(CX + 176 * sc, cy + 196 * sc, sc / S0, 0, () => seal(pr(t, tDone + .12, .34, E.lin)));
        for (let i = 0; i < 5; i++) { const q = pr(t, tDone + .06 + i * .05, .45, E.back), an = [-2.72, -2.2, -.92, -.42, 2.72][i], rad = (R + 96) * sc; if (q > 0) at(CX + Math.cos(an) * rad, cy + Math.sin(an) * rad, q * (1 + .14 * Math.sin(t * 6 + i)), t * 1.5 + i, () => sparkle(i % 2 ? 24 : 38, i % 2 ? C.tomato : C.gold)); } }
      const lo = 1 - pr(t, tDone - .26, .22, E.lin);
      if (lo > 0) { ctx.save(); ctx.globalAlpha = lo; ctx.translate(0, (1 - lo) * 50);
        const o = { f: 'Fr', size: 46, c: C.ink, align: 'left' };
        rows.forEach((r, i) => { const p = pr(t, r[1], .4, E.out5); if (p <= 0) return; const y = 1224 + i * 58, hot = env(t, r[1], i ? tNo : tHalf, .2, .3);
          circle(120, y - 15, 14 * E.back(clamp(p)), r[2]); txt(r[0], 156 + (1 - p) * 50, y, Object.assign({}, o, { w: lerp(600, 800, hot), a: p * lerp(.62, 1, hot) })); });
        // one line, like the rows above it (the spoken reason is in the caption): "no salt" + a "taste first" tag
        const np = pr(t, tNo, .4, E.out5);
        if (np > 0) { const y = 1224 + 2 * 58, w = measure('no salt', Object.assign({}, o, { w: 800 })), to = { f: 'Bar', w: 700, size: 36, ls: 3 };
          circle(120, y - 15, 14 * E.back(clamp(np)), C.tomato); txt('no salt', 156 + (1 - np) * 50, y, Object.assign({}, o, { w: 800, a: np }));
          tag('taste first', 156 + w + 26 + (measure('taste first', to) + 36 * 1.1) / 2, y - 15, { size: 36, bg: C.tomato, c: C.cream, ls: 3 }, pr(t, tNo + .3, .3, E.lin)); }
        ctx.restore(); }
    }
  };
})());
