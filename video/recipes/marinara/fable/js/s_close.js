// s_close.js — L13: the bookend. Back to flat print: the hero's sauce pulls back and is the sauce on a plate of
// pasta, its beads of oil still on the arms of the swirl and still catching the light. Then the ask: save it.
'use strict';
(window.SCENE_LIST = window.SCENE_LIST || []).push((function () {
  const T0 = 86.45, tSave = 86.67, tFor = 87.15, tMore = 88.01;
  const PX = 540, PY = 985, PS = 1.39, R = 292, r1 = rng(41), loops = [];
  for (let i = 0; i < 26; i++) loops.push({ x: (r1() - .5) * 104, y: (r1() - .5) * 92, a: 128 + r1() * 62, b: 94 + r1() * 70, rot: r1() * TAU, s0: r1() * TAU, col: i % 3 ? '#F3D78C' : '#E7C267' });
  const SAUCE = '#BC2D20', SR = 162, SEED = 2.4, LA = .9, LC = Math.cos(LA), LS = Math.sin(LA);
  // a generous ladle of sauce: an uneven edge, not a disc
  const edge = (a, R0) => R0 * (1 + .055 * Math.sin(a * 3 + SEED) + .035 * Math.sin(a * 5 - SEED * 2) + .02 * Math.sin(a * 9 + SEED * 3));
  function blob(R0) { ctx.beginPath(); for (let i = 0; i <= 72; i++) { const a = i / 72 * TAU, q = edge(a, R0); ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q); } ctx.closePath(); }
  // the swirl, as the hero left it: three arms winding into the middle
  const arm = (j, s) => { const th = 2.2 + j * TAU / 3 + s * TAU * 1.2, r = (SR - 17) * (1 - .84 * s); return [r * Math.cos(th), r * Math.sin(th)]; };
  // the oil: the hero's beads, strung along those arms, never overlapping
  const DROPS = (function () {
    const out = [];
    for (let j = 0; j < 3; j++) for (let i = 0; i < 60 && out.filter(d => d.j === j).length < 18; i++) {
      const s = r1() * .97, q = arm(j, s), rad = (3 + Math.pow(r1(), 2) * 6.4) * (.62 + .38 * Math.hypot(q[0], q[1]) / SR);
      const x = q[0] + (r1() + r1() - 1) * 9, y = q[1] + (r1() + r1() - 1) * 9;
      if (Math.hypot(x, y) > edge(Math.atan2(y, x), SR) - rad - 7 || out.some(d => Math.hypot(d.x - x, d.y - y) < (d.r + rad) * 1.2 + 1)) continue;
      out.push({ j, x, y, r: rad, h: r1(), h2: r1() });
    }
    return out;
  })();
  function bookmark(fill) {
    ctx.beginPath(); ctx.moveTo(-58, -92); ctx.lineTo(58, -92); ctx.lineTo(58, 96); ctx.lineTo(0, 46); ctx.lineTo(-58, 96); ctx.closePath();
    ctx.fillStyle = C.ink; ctx.fill();
    if (fill > 0) { ctx.save(); ctx.clip(); ctx.fillStyle = C.gold; ctx.fillRect(-60, 100 - 196 * fill, 120, 200); ctx.restore(); }
    ctx.strokeStyle = C.cream; ctx.lineWidth = 9; ctx.lineJoin = 'round'; ctx.stroke();
  }
  function plate(t, k) {
    shadow(() => circle(0, 0, R, C.cream), 16);
    // printed shade in the well, away from the light
    ctx.save(); circle(0, 0, R - 29); ctx.clip(); ctx.fillStyle = halftone(C.paper2, 12, 3.1);
    ctx.beginPath(); ctx.arc(-26, -30, R - 22, 0, TAU); ctx.rect(-R, -R, 2 * R, 2 * R); ctx.fill('evenodd'); ctx.restore();
    circle(0, 0, R - 26); ctx.strokeStyle = C.paper2; ctx.lineWidth = 6; ctx.stroke();
    // the nest of spaghetti, still settling as the plate lands
    const tw = pr(t, T0 + .1, 1.0, E.out3);
    loops.forEach((l, i) => {
      ctx.save(); ctx.translate(l.x, l.y - 4); ctx.rotate(l.rot + (1 - tw) * (i % 2 ? .9 : -.9));
      ctx.beginPath(); ctx.ellipse(0, 0, l.a, l.b, 0, l.s0, l.s0 + TAU * (.5 + .5 * tw));
      ctx.lineCap = 'round'; ctx.strokeStyle = '#B98A3A'; ctx.lineWidth = 17; ctx.stroke();
      ctx.strokeStyle = l.col; ctx.lineWidth = 11.5; ctx.stroke(); ctx.restore();
    });
    // the sauce: the hero's deep red, glossy, with the grooves of the swirl still in it
    ctx.save(); ctx.translate(0, -8);
    ctx.save(); ctx.translate(6, 10); blob(SR + 2); ctx.fillStyle = 'rgba(96,40,16,.42)'; ctx.fill(); ctx.restore();
    [[SR + 30, 44, 10], [-SR - 24, 34, 8.5], [74, -SR - 22, 7.5], [-84, SR + 16, 7], [SR + 12, -74, 5.5], [-SR + 4, -96, 5]].forEach(d => circle(d[0], d[1], d[2], SAUCE));
    ctx.save(); blob(SR); ctx.fillStyle = SAUCE; ctx.fill(); ctx.clip();
    ctx.fillStyle = halftone(C.red3, 13, 3.5); ctx.fillRect(-200, -200, 400, 400); circle(-26, -26, SR - 16, SAUCE);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    [['rgba(110,20,16,.5)', 2.4, 2.2, .34], ['#D94E3D', 3, 0, .55]].forEach(g => {
      ctx.strokeStyle = g[0]; ctx.lineWidth = g[1]; ctx.globalAlpha = g[3];
      for (let j = 0; j < 3; j++) { ctx.beginPath(); for (let i = 0; i <= 60; i++) { const q = arm(j, i / 60); ctx.lineTo(q[0] + g[2], q[1] + g[2]); } ctx.stroke(); }
    });
    ctx.globalAlpha = 1; ctx.restore();
    blob(SR); ctx.strokeStyle = 'rgba(124,26,20,.45)'; ctx.lineWidth = 3; ctx.stroke();
    // gloss: a lit shoulder toward the light, and one bright glint on it
    ctx.lineCap = 'round'; ctx.strokeStyle = '#DD5544'; ctx.lineWidth = 11; ctx.beginPath(); ctx.arc(0, 0, SR - 27, 3.42, 4.42); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,238,222,.7)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, SR - 27, 3.72, 4.02); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, SR - 27, 4.12, 4.16); ctx.stroke();
    // the oil, still catching the light: a few beads keep twinkling, and on the sign-off a last glint runs across them
    const run = clamp((t - tMore - .02) / .75), uc = lerp(-SR - 70, SR + 70, run), on = run > 0 && run < 1;
    DROPS.forEach(d => {
      const u = d.x * LC + d.y * LS, lit = on ? .8 * Math.exp(-Math.pow((u - uc) / 62, 2)) : 0;
      let gl = d.h > .72 - .2 * clamp((d.r - 3) / 4) ? .85 * Math.pow(Math.max(0, Math.sin(t * 3.3 + d.h2 * 40)), 14) : 0;
      if (on && d.h2 < .6) gl = Math.max(gl, Math.exp(-Math.pow((u + (d.h - .5) * 40 - uc) / 34, 2)));
      HOIL.bead(d.x, d.y, d.r, d.r * k, .8, lit, gl);
    });
    // basil lands last
    const lp = pr(t, T0 + .5, .45, E.back);
    if (lp > 0) { at(-10, -22, lp, -.5, () => leaf(104, 46, C.leaf, true)); at(12, -6, lp * .8, .75, () => leaf(82, 37, C.green, true)); }
    ctx.restore();
  }
  return {
    id: 'close', t0: T0, iris: [540, 820], ring: C.gold, tdur: .5,
    // the big type says the narration word for word here, so the burned-in caption stays off for both sentences
    capOff: [[86.6, 88.7]],
    cues: [{ t: T0, k: 'whoosh' }, { t: tSave, k: 'pop' }, { t: 87.02, k: 'ding', gain: .6 }, { t: tFor + .05, k: 'swish', gain: .5 }, { t: 87.72, k: 'pop', gain: .6 }, { t: tMore + .04, k: 'shimmer', gain: .6 }, { t: 88.92, k: 'pop', gain: .3 }],
    draw(t) {
      bg(C.tomato, t, C.red2);
      // the frame was all sauce; it pulls back, and the sauce is on a plate. The plate is the card.
      const zp = pr(t, T0, .85, E.out3), sc = lerp(3, 1, zp) * PS;
      at(PX, lerp(790, PY, zp), sc, (1 - zp) * -.5 + Math.sin(t * .8) * .012, () => plate(t, sc));
      const st = pr(t, 87.6, .8, E.lin);
      if (st > 0) at(PX, PY - 250, 1.3, 0, () => steam(t, st, 'rgba(251,244,230,.6)', 150, 10));
      // the ask
      letters('SAVE THIS', 436, 356, { f: 'Fr', w: 900, size: 146, c: C.cream, mis: C.red3 }, t - tSave, .03, .45);
      letters('FOR PASTA NIGHT', 540, 506, { f: 'FrI', w: 800, size: 106, c: C.gold, mis: C.red3 }, t - tFor, .022, .42);
      // the save mark: drops in on "Save", fills on "this" with a burst, and gets one more nudge after the last word
      const bp = pr(t, tSave + .02, .42, E.back), bf = pr(t, 87.0, .32, E.io), nud = Math.sin(Math.PI * clamp((t - 88.9) / .42));
      if (bp > 0) {
        const pulse = 1 + .1 * Math.sin(Math.PI * clamp((t - 87.0) / .35)) + .1 * nud;
        at(928, 296 - (1 - bp) * 90 - 10 * nud, (.86 + .14 * bp) * pulse, .08 - .07 * nud, () => shadow(() => bookmark(bf), 10), clamp(bp * 2));
        at(928, 296, 1, 0, () => ticks(7, 112, 152, C.cream, 6, clamp((t - 87.03) / .45), Math.PI * .62, Math.PI * 1.12));
      }
      const sk = pr(t, 87.12, .4, E.back) * (.8 + .2 * Math.sin(t * 7));
      if (sk > 0) { at(996, 198, sk, t * .5, () => sparkle(26, C.cream)); at(1006, 398, sk * .7, -t * .4, () => sparkle(18, C.gold)); }
      // sign-off, under the plate
      tag('EPISODE 1 · MARINARA', 540, 1460, { size: 50, bg: C.ink, c: C.cream, ls: 5 }, pr(t, 87.7, .32, E.lin));
      const mp = pr(t, tMore, .5, E.lin);
      if (mp > 0) at(540, 1562, 1, -.025, () => note('more recipes coming', 0, 0, { size: 84, c: C.cream }, mp));
    }
  };
})());
