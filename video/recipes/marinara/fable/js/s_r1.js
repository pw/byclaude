// s_r1.js — recipe 1: the green title card, then four pours into a glass bowl.
'use strict';
// flat microwave, 760x460 at origin. on = 0..1 window glow; spin = turntable angle
function microwave(t, on = 0) {
  shadow(() => rr(-380, -230, 760, 460, 44, C.cream), 16); ctx.strokeStyle = C.ink; ctx.lineWidth = 9; rr(-380, -230, 760, 460, 44); ctx.stroke();
  rr(-300, 230, 90, 26, 8, C.ink); rr(210, 230, 90, 26, 8, C.ink);
  circle(-110, 0, 178, C.ink); circle(-110, 0, 160, on > 0 ? '#5A3A1C' : C.ink2);
  if (on > 0) { ctx.save(); circle(-110, 0, 160); ctx.clip(); ctx.globalAlpha = on * (.75 + .25 * Math.sin(t * 9)); ctx.fillStyle = halftone(C.gold, 16, 4.4); ctx.fillRect(-280, -170, 340, 340); ctx.restore(); }
  ctx.save(); circle(-110, 0, 160); ctx.clip();
  ctx.fillStyle = '#8E9499'; ctx.beginPath(); ctx.ellipse(-110, 96, 120, 20, 0, 0, TAU); ctx.fill();
  at(-110, 30, .3, 0, () => { bowlPath(); ctx.fillStyle = C.tomato; ctx.fill(); ctx.strokeStyle = C.cream; ctx.lineWidth = 16; ctx.stroke(); at(0, -180, 1, -.07, () => rr(-330, -20, 660, 36, 14, C.cream)); });
  ctx.restore();
  rr(104, -190, 22, 380, 11, C.ink);
  rr(176, -180, 160, 70, 12, C.ink2); for (let i = 0; i < 3; i++) circle(206 + i * 50, -145, 9, on > 0 && i === Math.floor(t * 3) % 3 ? C.gold : C.steel);
  circle(256, 30, 62, C.paper2); ctx.strokeStyle = C.ink; ctx.lineWidth = 7; ctx.stroke(); at(256, 30, 1, t * (on > 0 ? .5 : 0) - 1, () => rr(-6, -52, 12, 52, 6, C.tomato));
  for (let i = 0; i < 3; i++) rr(196 + i * 44, 130, 32, 32, 8, i === 2 ? C.green : C.steel);
}
function bowlPath() { ctx.beginPath(); ctx.moveTo(-300, -150); ctx.bezierCurveTo(-300, 60, -200, 140, -120, 140); ctx.lineTo(120, 140); ctx.bezierCurveTo(200, 140, 300, 60, 300, -150); ctx.closePath(); }
// glass bowl side view at origin; lv 0..1 sauce level; extras drawn on the surface
function glassBowl(t, lv, herbs = 0, oil = 0, wine = 0) {
  ctx.fillStyle = 'rgba(29,26,25,.14)'; ctx.beginPath(); ctx.ellipse(0, 150, 250, 22, 0, 0, TAU); ctx.fill();
  bowlPath(); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill();
  const ys = lerp(140, -84, lv);
  if (lv > 0) {
    ctx.save(); bowlPath(); ctx.clip(); ctx.beginPath(); ctx.moveTo(-320, 160);
    for (let x = -320; x <= 320; x += 20) ctx.lineTo(x, ys + Math.sin(x * .03 + t * 5) * 5 * clamp(lv * 3) * (1 + wine * 2));
    ctx.lineTo(320, 160); ctx.closePath(); ctx.fillStyle = C.tomato; ctx.fill(); ctx.fillStyle = halftone(C.red2, 13, 3.4); ctx.fillRect(40, ys - 10, 300, 300);
    if (wine > 0) { ctx.globalAlpha = wine * .8; ctx.fillStyle = '#7A1F2B'; ctx.beginPath(); ctx.ellipse(40, ys + 6, 150 * wine, 16, 0, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
    const r = rng(31); for (let i = 0; i < 34; i++) { const x = (r() - .5) * 460, d = r(), q = clamp(herbs * 1.6 - d * .6); if (q > 0) at(x, ys + 4 + r() * 12, q, r() * 6, () => rr(-8, -3, 16, 6, 3, i % 3 ? C.green2 : C.leaf)); }
    for (let i = 0; i < 7; i++) { const x = -210 + i * 70 + r() * 30, w = 30 + r() * 26, q = clamp(oil * 1.5 - i * .07); if (q > 0) oilPool(x, ys + 5, w * q, 9 * q, 0); }
    ctx.restore();
  }
  bowlPath(); ctx.strokeStyle = C.ink; ctx.lineWidth = 9; ctx.lineJoin = 'round'; ctx.stroke();
  rr(-322, -168, 644, 30, 15, C.cream); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-262, -100); ctx.quadraticCurveTo(-250, 20, -196, 78); ctx.stroke();
}
// translucent amber oil with a rim and a highlight (never an opaque yellow blob)
function oilPool(x, y, rx, ry, rot = 0, a = 1) {
  if (rx <= 0.5 || ry <= 0.5 || a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= a;
  ctx.fillStyle = 'rgba(246,190,60,.5)'; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(201,131,24,.6)'; ctx.lineWidth = Math.min(4, ry * .3); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,246,214,.85)'; ctx.lineWidth = Math.max(2, Math.min(5, ry * .22)); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.ellipse(0, 0, rx * .62, ry * .55, 0, Math.PI * 1.08, Math.PI * 1.5); ctx.stroke(); ctx.restore();
}
// the can / a spice jar with ONE cast shadow (shadow() over the stock drawings also shadows the label type, which reads doubled)
function canS(lid = 0) { shadow(() => { ctx.fillStyle = C.steel; ctx.fillRect(-105, -140, 210, 280); ctx.beginPath(); ctx.ellipse(0, 140, 105, 26, 0, 0, TAU); ctx.fill(); }, 10); can(lid); }
// o.flip turns the label 180° so it still reads when the jar is tipped over; o.mid draws between glass and label
function jarS(label, capCol = C.ink, o = {}) {
  shadow(() => { rr(-62, -80, 124, 190, 22, '#E9DFC9'); rr(-66, -128, 132, 58, 12, capCol); }, 8);
  ctx.save(); rr(-62, -80, 124, 190, 22, '#E9DFC9'); ctx.clip(); ctx.fillStyle = o.fill || '#D9B77A'; ctx.fillRect(-70, -10, 140, 130); ctx.restore();
  rr(-66, -128, 132, 58, 12, capCol);
  ctx.fillStyle = 'rgba(251,244,230,.5)'; for (let i = -2; i <= 2; i++) ctx.fillRect(i * 22 - 3, -120, 6, 42);
  if (o.mid) o.mid();
  at(0, 11, 1, o.flip ? Math.PI : 0, () => { rr(-52, -35, 104, 70, 6, C.cream); txt(label, 0, 13, { f: 'Bar', w: 700, size: 36, c: C.ink, ls: 2 }); });
}
// a hand seen from above: fingers toward -x, sleeve toward +x. back = 1 shows nails, 0 shows the open palm.
// flip = -1 mirrors it (fingers toward +x); th = which side the thumb sits (-1 up, 1 down)
function hand(flip = 1, back = 1, th = -1) {
  const skin = '#E9B58B', line = '#C98F63', F = [[-47, 150], [-15.7, 178], [15.7, 170], [47, 134]];
  ctx.save(); ctx.scale(flip, 1); ctx.lineCap = 'round';
  rr(176, -56, 300, 112, 26, C.navy); rr(154, -64, 42, 128, 12, C.cream);
  at(52, th * 56, 1, -th * .55, () => rr(-104, -21, 130, 42, 21, skin));
  rr(-12, -62, 194, 124, 46, skin);
  F.forEach(f => rr(-f[1], f[0] - 14.2, f[1] + 40, 28.4, 14.2, skin));
  ctx.strokeStyle = line; ctx.lineWidth = 4;
  [-31.3, 0, 31.3].forEach(y => { ctx.beginPath(); ctx.moveTo(-124, y); ctx.lineTo(6, y); ctx.stroke(); });
  if (back) { F.forEach(f => { rr(-f[1] + 5, f[0] - 9, 25, 18, 8, '#F8DFC8'); ctx.beginPath(); ctx.moveTo(-f[1] * .46, f[0] - 7); ctx.lineTo(-f[1] * .46, f[0] + 7); ctx.stroke(); }); }
  else { ctx.beginPath(); ctx.moveTo(18, -44 * -th); ctx.quadraticCurveTo(70, -10 * -th, 150, -30 * -th); ctx.stroke(); ctx.beginPath(); ctx.moveTo(30, 40 * -th); ctx.quadraticCurveTo(84, 20 * -th, 132, 44 * -th); ctx.stroke(); }
  ctx.restore();
}

(window.SCENE_LIST = window.SCENE_LIST || []).push((function () {
  const tMw = wt('L06', 'microwave'), tMa = wt('L06', 'marinara'), tBet = wt('L06', 'better'), tJar = wt('L06', 'jar');
  return {
    id: 'r1title', t0: 34.0, iris: [540, 900], ring: C.green2, tdur: .55,
    capOff: [[34.2, 38.2]],   // RECIPE 1 / Microwave Marinara / better than any jar are all drawn on the card
    cues: [{ t: 34.0, k: 'whoosh' }, { t: 34.26, k: 'pop' }, { t: 34.75, k: 'swish', gain: .7 }, { t: tMw - .1, k: 'pop' }, { t: tMa - .1, k: 'pop' }, { t: 36.7, k: 'beep', gain: .6 }, { t: tBet, k: 'swish', gain: .6 }, { t: tJar + .1, k: 'scrape', gain: .7 }],
    draw(t) {
      bg(C.green, t, C.green2);
      ctx.strokeStyle = C.gold; ctx.lineWidth = 6; rr(44, 150, 992, 1620, 40); ctx.stroke(); ctx.lineWidth = 2; rr(62, 168, 956, 1584, 30); ctx.stroke();   // the label runs the full frame
      tag('RECIPE 1', 540, 372, { size: 66, bg: C.gold, c: C.ink, ls: 8 }, pr(t, 34.2, .4, E.lin));
      // act 1: the microwave arrives full-size and beeps; act 2: it tucks down as its name lands; act 3: it out-cooks the jar
      const m = pr(t, 34.1, .8, E.softspring), k = pr(t, tMw - .5, .62, E.io2), beep = env(t, 34.74, 35.12, .08, .22), on = Math.max(beep * .85, pr(t, 36.6, .3, E.lin));
      const bump = Math.sin(pr(t, tJar - .1, .34, E.lin) * Math.PI), mx = lerp(540, 440, k) + bump * 46, my = lerp(930, 1190, k), ms = lerp(1.18, .82, k);
      letters('Microwave', 540, 650, { f: 'Fr', w: 900, size: 180, c: C.cream, mis: C.green2, misd: 8 }, t - (tMw - .18), .03, .5);
      letters('Marinara', 540, 835, { f: 'FrI', w: 800, size: 180, c: C.gold, mis: C.green2, misd: 8 }, t - (tMa - .14), .03, .5);
      if (m > 0) {
        at(mx, my + (1 - m) * 900, ms, -.03 + Math.sin(t * 30) * .004 * on + bump * .05, () => microwave(t, on));
        at(mx - 110 * ms, my, 1, 0, () => { ticks(14, 200 * ms, 280 * ms, C.gold, 9, pr(t, 34.74, .5, E.lin)); ticks(12, 190 * ms, 250 * ms, C.gold, 7, pr(t, 36.6, .5, E.lin)); });
        // heat rising once it is running
        at(mx - 60 * ms, my - 240 * ms, .8, 0, () => steam(t, pr(t, 36.75, .5, E.lin) * .8, 'rgba(251,244,230,.6)', 110, 8));
      }
      const j = pr(t, 36.9, .4, E.back), f = pr(t, tJar + .06, .7, E.in2);
      if (j > 0) at(880 + f * 190, 1290 - Math.sin(clamp(f * 1.6) * Math.PI) * 60 + f * f * 620, j, f * 2.4, () => { shadow(() => rr(-62, -80, 124, 190, 22, '#E9DFC9'), 8); ctx.save(); rr(-62, -80, 124, 190, 22); ctx.clip(); ctx.fillStyle = C.red2; ctx.fillRect(-70, -40, 140, 160); ctx.restore(); rr(-66, -116, 132, 46, 10, C.ink); rr(-44, -4, 88, 60, 6, C.cream); });
      at(783, 1200, 1, 0, () => ticks(7, 30, 110, C.cream, 8, pr(t, tJar - .02, .4, E.lin), -1.1, 2.2));
      at(500, 1512, 1, -.03, () => { const w = note('better than any jar', 0, 0, { size: 100, c: C.cream }, pr(t, tBet - .05, .6, E.lin)); stroke([[-w / 2, 26], [0, 40], [w / 2, 22]], C.gold, 7, pr(t, tBet + .45, .4, E.io)); });
      for (let i = 0; i < 4; i++) { const q = pr(t, tJar + .2 + i * .07, .4, E.back); if (q > 0) at([100, 952, 150, 930][i], [720, 500, 1070, 1020][i], q * (1 + .15 * Math.sin(t * 6 + i)), t * 1.2 + i, () => sparkle(i % 2 ? 24 : 36, i % 2 ? C.cream : C.gold)); }
    }
  };
})());

const R1_STAGE = 1.15;
(window.SCENE_LIST = window.SCENE_LIST || []).push((function () {
  const tCan = wt('L07', 'a'), tWine = wt('L07', 'two'), tSea = wt('L07', 'two', 1), tRub = wt('L07', 'rubbed'), tOil = wt('L07', 'a', 1), tGlug = wt('L07', 'glug');
  const rows = [['15-oz can tomato sauce', tCan + .3, C.tomato], ['2 tbsp cheap dry red wine', tWine, '#7A1F2B'], ['2-3 tsp dried Italian seasoning', tSea, C.green], ['1-2 tbsp olive oil', tOil, C.gold]];
  return {
    id: 'r1ing', t0: 38.7, tin: 'push', tdur: .5, capOff: [[38.9, 40.0]],
    cues: [{ t: 38.7, k: 'whoosh' }, { t: tCan + .25, k: 'pop' }, { t: 40.0, k: 'splash' }, { t: tWine, k: 'pop', gain: .7 }, { t: tWine + .45, k: 'glug', gain: .8 }, { t: tSea, k: 'pop', gain: .7 }, { t: tSea + .5, k: 'shake', gain: .7 },
      { t: tRub, k: 'rub' }, { t: tRub + .55, k: 'rub', gain: .8 }, { t: tOil, k: 'pop', gain: .7 }, { t: tGlug, k: 'glug' }, { t: tGlug + .5, k: 'glug', gain: .7 }],
    draw(t) {
      bg(C.paper, t);
      tag('RECIPE 1', 176, 240, { size: 44, bg: C.green, c: C.cream, ls: 5 });
      const w0 = txt('Microwave', 300, 257, { f: 'FrI', w: 700, size: 52, c: C.green, align: 'left' }); txt('Marinara', 314 + w0, 257, { f: 'FrI', w: 700, size: 52, c: C.green, align: 'left' });
      const lv = .78 * pr(t, 40.0, 1.15, E.io2) + .05 * pr(t, tWine + .5, .9, E.io) + .03 * pr(t, tGlug, .8, E.io);
      const wineP = env(t, tWine + .55, tWine + 2.3, .5, 1.2), rub = env(t, tRub - .15, 47.75, .25, .3);
      ctx.save(); ctx.translate(540, 300); ctx.scale(R1_STAGE, R1_STAGE); ctx.translate(-540, -300);   // stage: laid out 1:1, shown larger
      at(540, 800, 1, 0, () => glassBowl(t, lv, pr(t, tRub + .35, 1.2, E.lin), pr(t, tGlug + .1, .9, E.lin), wineP));
      // 1 the can: slides in from the left, clear of the header, and tips
      const cIn = pr(t, tCan - .1, .5, E.out5), cTilt = pr(t, 39.55, .45, E.io), cOut = pr(t, 41.35, .4, E.in3);
      stream(458, 570, 500, 800 - lerp(-140, 84, lv) + 6, 44, C.tomato, pr(t, 39.9, .22, E.lin), pr(t, 41.0, .3, E.lin));
      if (cIn > 0 && cOut < 1) at(330 - (1 - cIn) * 560 - cOut * 560, 464, .92, cTilt * 1.95 - cOut * .6, () => canS(1));
      // 2 wine
      // the bottle rests well inside the frame and is gone, fast, as soon as the pour ends (never parked half off the edge)
      const wIn = pr(t, tWine - .05, .45, E.out5), wOut = pr(t, 43.7, .26, E.in3);
      stream(528, 524, 556, 800 - lerp(-140, 84, lv) + 6, 16, '#7A1F2B', pr(t, tWine + .42, .2, E.lin), pr(t, 43.42, .25, E.lin));
      if (wIn > 0 && wOut < 1) at(690 + (1 - wIn) * 520 + wOut * 560, 444, .9, lerp(-.9, -2.0, pr(t, tWine + .1, .4, E.io)) + wOut * .8, () => shadow(() => bottle('wine'), 10));
      // 3 seasoning: a pile in an open palm, then the other hand comes down and rubs it into the bowl
      const hIn = pr(t, tSea - .05, .45, E.out5), hOut = pr(t, 47.7, .3, E.in3), top = pr(t, tRub - .32, .34, E.out3), dx = Math.sin(t * 15) * 30 * rub;
      if (hIn > 0 && hOut < 1) {
        at(540, 520, 1, 0, () => flecks(54, pr(t, tRub + .05, 1.45, E.lin), 5, C.green, 170, 250, 8));
        at(458 - dx - (1 - hIn) * 760 - hOut * 760, 478, .82, .04, () => {
          hand(-1, 0, -1);
          const pile = pr(t, tSea + .3, .35, E.back) * (1 - pr(t, tRub + .2, 1.2, E.lin) * .8);
          if (pile > 0) at(96, 0, pile, 0, () => { ctx.fillStyle = C.green; ctx.beginPath(); ctx.ellipse(0, 0, 74, 46, 0, 0, TAU); ctx.fill(); const r = rng(12); for (let i = 0; i < 26; i++) { const a2 = r() * TAU, d = Math.sqrt(r()) * 84; at(Math.cos(a2) * d, Math.sin(a2) * d * .66, 1, r() * 6, () => rr(-9, -3.5, 18, 7, 3, i % 3 ? C.green2 : C.leaf)); } });
        });
        if (top > 0) at(626 + dx + (1 - top) * 760 + hOut * 760, 452 - (1 - top) * 40, .82, .04, () => hand(1, 1, 1));
      }
      // 4 oil: lower and smaller than before so the bottle never reaches the header
      const oIn = pr(t, tOil - .05, .45, E.out5);
      stream(495, 548, 510, 800 - lerp(-140, 84, lv) + 6, 13 + 5 * Math.sin(t * 20), 'rgba(238,176,48,.92)', pr(t, tGlug - .03, .2, E.lin), pr(t, 49.2, .25, E.lin));
      if (oIn > 0) at(330 - (1 - oIn) * 520, 470, .88, lerp(1.2, 2.0, pr(t, tOil + .08, .35, E.io)), () => shadow(() => bottle('oil'), 10));
      ctx.restore();
      // the list
      rows.forEach((r, i) => { const p = pr(t, r[1], .4, E.out5); if (p <= 0) return; const y = 1150 + i * 60, hot = env(t, r[1], (rows[i + 1] || [0, 49.5])[1], .2, .3);
        circle(150, y - 16, 14 * E.back(clamp(p)), r[2]);
        txt(r[0], 188 + (1 - p) * 50, y, { f: 'Fr', w: lerp(600, 800, hot), size: 49, c: C.ink, align: 'left', a: p * lerp(.62, 1, hot) }); });
    }
  };
})());
