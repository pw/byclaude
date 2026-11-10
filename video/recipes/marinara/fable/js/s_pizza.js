// s_pizza.js — L05: in Naples the word is a pizza; in America it's the sauce. The red circle is the hinge.
'use strict';
(window.SCENE_LIST = window.SCENE_LIST || []).push((function () {
  const tMar = wt('L05', 'marinara');
  // the toppings, "No cheese", "In America" and "sauce" as heard in the voice track (the aligner is .1–.3 s late on the list)
  const tSpread = 27.2, tTom = 28.7, tGar = 29.18, tOre = 29.64, tOil = 30.18, tNo = 30.7, tAm = 31.8, tSauce = 33.16;
  const R = 380, CX = 540, CY = 800, RS = 322, r1 = rng(7), garlic = [], oreg = [], spots = [], beads = [];
  for (let i = 0; i < 17; i++) { const a = i * TAU / 17 + r1() * .5, d = 60 + r1() * 225; garlic.push([Math.cos(a) * d, Math.sin(a) * d, r1() * TAU]); }
  for (let i = 0; i < 52; i++) { const a = r1() * TAU, d = Math.sqrt(r1()) * 288; oreg.push([Math.cos(a) * d, Math.sin(a) * d, r1() * TAU, .7 + r1() * .7]); }
  for (let i = 0; i < 18; i++) { const a = i * TAU / 18 + r1() * .25; spots.push([Math.cos(a) * (R - 24), Math.sin(a) * (R - 24), 9 + r1() * 13]); }
  // the sauce goes on the way it does at the bench: a ladle spirals it out from the middle, the last turn closing the circle
  const spiralAt = q => { const turns = 3.4, a = q * turns * TAU - 1.2, d = Math.min(1, q * turns / (turns - 1)) * (RS - 58); return [Math.cos(a) * d, Math.sin(a) * d]; };
  // the oil is a thin thread drizzled round and round, with a few beads where it pools
  const oilAt = q => { const a = q * TAU * 3.4 + 1, d = 46 + q * 232 + Math.sin(q * 40) * 7; return [Math.cos(a) * d, Math.sin(a) * d]; };
  for (let i = 0; i < 13; i++) { const q = (i + .3 + r1() * .5) / 13, p = oilAt(q); beads.push([p[0] + (r1() - .5) * 26, p[1] + (r1() - .5) * 26, 4 + r1() * 6, q]); }

  function gingham() {
    ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H); ctx.fillStyle = 'rgba(217,58,43,.12)';
    for (let x = -30; x < W; x += 180) ctx.fillRect(x, 0, 90, H);
    for (let y = 20; y < H; y += 180) ctx.fillRect(0, y, W, 90);
  }
  function pie(t, k) {
    shadow(() => circle(0, 0, R, C.crust), 18);
    if (k < 1) { ctx.save(); ctx.globalAlpha = 1 - k; spots.forEach(s => circle(s[0], s[1], s[2], '#C08A4A')); circle(0, 0, R - 46, '#E6C08A'); ctx.restore(); }
    if (k > 0) { ctx.save(); ctx.globalAlpha = k; circle(0, 0, R, C.cream); ctx.strokeStyle = C.paper2; ctx.lineWidth = 6; circle(0, 0, R - 30); ctx.stroke(); ctx.restore(); }
    const sp = pr(t, tSpread, 1.4, E.io), rs = lerp(RS, 300, k);
    if (sp > 0 && sp < 1) {
      ctx.strokeStyle = C.tomato; ctx.lineWidth = lerp(84, 118, pr(sp, .78, .22, E.io)); ctx.lineCap = 'round';   // dough shows between the turns until the last pass closes them
      ctx.lineJoin = 'round'; ctx.beginPath();
      const n = Math.ceil(170 * sp); for (let i = 0; i <= n; i++) { const p = spiralAt(Math.min(sp, i / 170)); ctx.lineTo(p[0], p[1]); } ctx.stroke();
      const h = spiralAt(sp); at(h[0], h[1], 1.25, .95, () => { spoon(330); ctx.beginPath(); ctx.ellipse(-4, 2, 42, 29, 0, 0, TAU); ctx.fillStyle = C.tomato; ctx.fill(); }, Math.min(clamp(sp * 8), clamp((1 - sp) * 7)));
    }
    if (sp >= 1) {
      ctx.save(); circle(0, 0, rs); ctx.clip(); ctx.fillStyle = C.tomato; ctx.fillRect(-R, -R, R * 2, R * 2);
      ctx.globalAlpha = pr(t, tSpread + 1.4, .3, E.lin); ctx.fillStyle = halftone(C.red2, 13, 3.6); ctx.fillRect(-R, -R, R * 2, R * 2); ctx.globalAlpha = 1; circle(-46, -46, rs * .93, C.tomato);
      if (k > 0) { ctx.globalAlpha = k * .8; ctx.strokeStyle = '#EC6A58'; ctx.lineWidth = 14; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(0, 0, 80 + i * 70, t * .5 + i * 2.1, t * .5 + i * 2.1 + 1.5); ctx.stroke(); } }
      ctx.restore();
    }
    if (k < 1) {
      ctx.save(); ctx.globalAlpha = 1 - k;
      // garlic: thin ivory-tan slivers, far too small to be taken for cheese
      garlic.forEach((g, i) => { const p = pr(t, tGar - .02 + i * .02, .3, E.back); if (p > 0) at(g[0], g[1], p, g[2], () => { ctx.beginPath(); ctx.ellipse(0, 0, 15, 4.8, 0, 0, TAU); ctx.fillStyle = '#EFE0B6'; ctx.fill(); ctx.strokeStyle = '#BF9F66'; ctx.lineWidth = 2.2; ctx.stroke(); }); });
      oreg.forEach((g, i) => { const p = pr(t, tOre - .02 + i * .009, .3, E.back); if (p > 0) at(g[0], g[1], p * g[3], g[2], () => leaf(22, 9, i % 3 ? C.green : C.leaf, false)); });
      const op = pr(t, tOil - .03, .55, E.io);
      if (op > 0) { ctx.strokeStyle = C.gold; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha *= .9; ctx.beginPath();
        const n = Math.ceil(200 * op); for (let i = 0; i <= n; i++) { const p = oilAt(Math.min(op, i / 200)); ctx.lineTo(p[0], p[1]); } ctx.stroke();
        beads.forEach(b => { const q = clamp((op - b[3]) * 8); if (q > 0) { circle(b[0], b[1], b[2] * q, C.gold); circle(b[0] - b[2] * .3, b[1] - b[2] * .3, b[2] * .28 * q, 'rgba(251,244,230,.9)'); } }); }
      ctx.restore();
    }
  }
  return {
    id: 'pizza', t0: 25.8, iris: [CX, CY], ring: C.red3, tdur: .55,
    // muted only under the topping labels and the big "no cheese", which are the spoken words. The America line keeps
    // its caption: the card's checked wording ("usually") is not the spoken one ("mostly").
    capOff: [[28.6, 31.5]],
    cues: [{ t: 25.8, k: 'whoosh' }, { t: 26.15, k: 'pop' }, { t: tMar, k: 'swish', gain: .7 }, { t: tSpread + .1, k: 'splash' }, { t: tTom - .05, k: 'pop', gain: .8 }, { t: tGar - .05, k: 'pop', gain: .8 }, { t: tOre - .05, k: 'shake', gain: .8 }, { t: tOil - .05, k: 'glug', gain: .8 },
      { t: tNo - .1, k: 'pop', gain: 1.2 }, { t: tNo + .14, k: 'scrape', gain: .8 }, { t: tAm, k: 'whoosh' }, { t: tSauce, k: 'ding', gain: .7 }],
    draw(t) {
      gingham();
      const d = pr(t, 26.0, .7, E.out5), k = pr(t, tAm, .7, E.io), ex = pr(t, tAm - .05, .35, E.in3);
      const py = lerp(CY, 728, k), ps = lerp(1, .86, k);   // the plate steps up and back to make room for the America card
      // arc title
      const ap = pr(t, 26.2, .8, E.lin); if (ap > 0 && ex < 1) { ctx.save(); ctx.globalAlpha = 1 - ex; arcText('PIZZA MARINARA · NAPLES', CX, CY, R + 62, -Math.PI / 2, { f: 'Bar', w: 700, size: 66, ls: 6, c: C.red2 }, ap); ctx.restore(); }
      if (d > 0) at(CX, py + (1 - d) * 60, (.3 + .7 * d) * (1 - .06 * Math.sin(k * Math.PI)) * ps, (1 - d) * -2.6 + k * Math.PI, () => pie(t, k));
      if (k > 0) at(CX + 138 * ps, py - 126 * ps, 1.15 * ps, -.72, () => spoon(430), clamp(k * 1.6 - .4));
      // topping labels: each one is up a beat before its word, and its topping lands on the pie with the word
      if (ex < 1) {
        ctx.save(); ctx.globalAlpha = 1 - ex; ctx.translate(0, ex * 60);
        tag('tomato', 335, 1282, { size: 60, bg: C.tomato, c: C.cream, ls: 2 }, pr(t, tTom - .1, .28, E.lin));
        tag('garlic', 745, 1282, { size: 60, bg: C.ink, c: C.cream, ls: 2 }, pr(t, tGar - .1, .28, E.lin));
        tag('oregano', 335, 1394, { size: 60, bg: C.green, c: C.cream, ls: 2 }, pr(t, tOre - .1, .28, E.lin));
        tag('olive oil', 745, 1394, { size: 60, bg: C.gold, c: C.ink, ls: 2 }, pr(t, tOil - .1, .28, E.lin));
        // no cheese: the punchline gets the middle of the frame. A wedge drops onto the pie, is struck out, and the
        // words land big across the lower crust; all of it holds until the pie turns into the American plate.
        const cp = pr(t, tNo - .14, .42, E.back);
        if (cp > 0) {
          at(CX + 10, CY - 46 - (1 - cp) * 700, 2.9, -.16, () => { shadow(() => { ctx.beginPath(); ctx.moveTo(-95, 40); ctx.lineTo(85, -62); ctx.lineTo(95, 62); ctx.closePath(); ctx.fillStyle = '#F2CF5B'; ctx.fill(); }, 6); [[20, 10, 15], [60, 30, 10], [-30, 32, 9], [56, -22, 8]].forEach(h => circle(h[0], h[1], h[2], C.gold2)); });
          const xp = pr(t, tNo + .12, .32, E.out3);
          at(CX, CY - 34, 1, 0, () => { strike(236, C.cream, 50, xp); strike(236, C.tomato, 28, xp); });
          const np = clamp((t - tNo + .02) / .2);
          if (np > 0) at(CX, CY + 288, 1.9 - .9 * E.out5(np), -.045, () => tag('no cheese', 0, 0, { size: 112, bg: C.ink, c: C.cream, ls: 5 }, 1), clamp(np * 3));
        }
        ctx.restore();
      }
      // America card
      const b = pr(t, tAm + .1, .55, E.out5);
      if (b > 0) at(540, 1222 + (1 - b) * 560, 1, -.01, () => {
        shadow(() => rr(-470, -125, 940, 250, 36, C.cream), 14); ctx.strokeStyle = C.ink; ctx.lineWidth = 6; rr(-470, -125, 940, 250, 36); ctx.stroke();
        para('In America, “marinara” usually means the sauce', 0, -18, { f: 'Fr', w: 800, size: 64, c: C.ink }, 840, pr(t, tAm + .22, .8, E.lin), 1.16);
      });
    }
  };
})());
