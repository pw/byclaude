// s_hook.js — 0.0–3.95  L01 "Marinara means sailor-style. Nobody knows for sure why."
// The promise is the title: "2 NO-CHOP / MARINARA / RECIPES" as a tin-label lockup, big enough for a phone, over a
// pan of sauce that is already being stirred on frame 0 and fills the lower frame. On "sailor-style" the sea comes
// up over the pan, the pan sheds its rim and is the sun going down, and the question lands as big type on the water.
'use strict';
(window.SCENE_LIST = window.SCENE_LIST || []).push((function () {
  const tSail = 1.34;   // "sailor-style" as heard in the voice track (the aligner puts it at 1.81, half a second late)
  const tNobody = wt('L01', 'nobody'), tWhy = wt('L01', 'why');
  const tQ = [tNobody, wt('L01', 'knows'), wt('L01', 'for'), wt('L01', 'sure'), tWhy];
  const CX = 540, CY = 1380, R = 500, SEA = 1100, r0 = rng(21), beads = [], herbs = [];
  for (let i = 0; i < 19; i++) beads.push([r0() * TAU, 90 + Math.sqrt(r0()) * (R - 150), 8 + r0() * 14]);
  for (let i = 0; i < 30; i++) herbs.push([r0() * TAU, 70 + Math.sqrt(r0()) * (R - 110), r0() * TAU, .9 + r0() * .9]);
  const spin = t => 2.8 * (1 - Math.exp(-1.5 * t)) + .45 * t;   // a stir that is fast on frame 0 and settles
  const waveY = (x, t, top, amp, k, speed) => top + Math.sin(x * k + t * speed) * amp + Math.sin(x * k * 2.3 - t * speed * 1.4) * amp * .35;
  function sea(t, top, col, amp, k, speed, dots) {
    ctx.beginPath(); ctx.moveTo(-20, H + 20);
    for (let x = -20; x <= W + 20; x += 12) ctx.lineTo(x, waveY(x, t, top, amp, k, speed));
    ctx.lineTo(W + 20, H + 20); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
    if (dots) { ctx.save(); ctx.clip(); ctx.fillStyle = halftone(dots, 16, 3); ctx.globalAlpha = .55; ctx.fillRect(0, top + 60, W, H); ctx.restore(); }
  }
  function boat() { // paper boat: cream hull, gold sails, cream pennant
    ctx.fillStyle = C.cream; ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(90, 0); ctx.lineTo(60, 46); ctx.lineTo(-60, 46); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(-4, -8); ctx.lineTo(-4, -150); ctx.lineTo(74, -8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.gold2; ctx.beginPath(); ctx.moveTo(-14, -8); ctx.lineTo(-14, -112); ctx.lineTo(-66, -8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.cream; ctx.beginPath(); ctx.moveTo(-4, -150); ctx.lineTo(-4, -176); ctx.lineTo(30, -163); ctx.closePath(); ctx.fill();
  }
  function ribbon(a0, turns, wMax, col) { // a tapered spiral arm drawn from the rim into the middle
    const A = [], B = [];
    for (let i = 0; i <= 48; i++) { const q = i / 48, a = a0 + q * turns * TAU, d = lerp(R * .95, 38, Math.pow(q, .85)), w = wMax * Math.pow(Math.sin(Math.PI * q), .6) * (1 - .45 * q) / 2, cs = Math.cos(a), sn = Math.sin(a);
      A.push([cs * (d + w), sn * (d + w)]); B.push([cs * (d - w), sn * (d - w)]); }
    ctx.beginPath(); A.forEach(p => ctx.lineTo(p[0], p[1])); B.reverse().forEach(p => ctx.lineTo(p[0], p[1])); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  }
  // the pan of sauce seen from above. sun 0..1: rim, handle, oil and spoon leave and a plain red disc stays
  function pan(t, sun) {
    const th = spin(t), rim = 42 * (1 - sun);
    if (sun < 1) {
      ctx.save(); ctx.rotate(2.42); rr(R - 30 + E.in3(sun) * 700, -46, 620, 92, 46, C.ink); ctx.restore();
      shadow(() => circle(0, 0, R + rim, C.ink), 18 * (1 - sun)); circle(0, 0, R + rim * .32, '#3A3431');
    }
    circle(0, 0, R, C.red2);
    ctx.save(); circle(0, 0, R); ctx.clip();
    ctx.fillStyle = halftone(C.red3, 14, 3.6); ctx.fillRect(-R, -R, 2 * R, 2 * R); circle(-44, -48, R * .95, C.red2);
    if (sun < 1) {
      ctx.globalAlpha = 1 - sun;
      for (let i = 0; i < 3; i++) ribbon(i * TAU / 3 + 1.1 + th * .8, 1.05, 68, C.tomato);       // lighter sauce, folded in
      [[1.25, 52], [1.08, 38], [1.36, 44]].forEach(([turns, w], i) => ribbon(i * TAU / 3 + th + i * .22, turns, w, C.gold)); // the oil
      herbs.forEach((h, i) => { const a = h[0] + th * (1.2 - .5 * h[1] / R); at(Math.cos(a) * h[1], Math.sin(a) * h[1], h[3], h[2] + th, () => leaf(26, 10, i % 3 ? C.green : C.leaf, false)); });
      beads.forEach(b => { const a = b[0] + th * (1.25 - .5 * b[1] / R), x = Math.cos(a) * b[1], y = Math.sin(a) * b[1]; circle(x, y, b[2], C.gold); circle(x - b[2] * .32, y - b[2] * .32, b[2] * .26, 'rgba(251,244,230,.9)'); });
    }
    ctx.restore();
    if (sun < 1) { // the spoon that is doing the stirring; its handle leaves frame bottom-right
      const sa = th + 2.4, bx = Math.cos(sa) * 270, by = Math.sin(sa) * 270, rot = Math.atan2(900 - by, 760 - bx), out = E.in3(sun) * 1500;
      shadow(() => at(bx + Math.cos(rot) * out, by + Math.sin(rot) * out, 1.65, rot, () => spoon(800)), 12);
    }
  }
  // the promise, set as a label: the checked string on three lines, the middle word the size of the frame.
  // It is whole on frame 0 and settles; each letter of MARINARA jumps as the voice says the word.
  function lockup(t) {
    os('2 NO-CHOP MARINARA RECIPES');
    const z = lerp(1.06, 1, pr(t, 0, .8, E.out5));
    ctx.save(); ctx.translate(CX, 560); ctx.scale(z, z); ctx.translate(-CX, -560);
    const side = { f: 'Bar', w: 700, size: 150, ls: 12, c: C.gold, raw: 1, mis: C.red3, misd: 8 };
    [['2 NO-CHOP', 412], ['RECIPES', 756]].forEach(([s, y], i) => {
      const w = txt(s, CX, y, side), x0 = w / 2 + 38, len = (450 - x0) * pr(t, i * .1, .6, E.out5);
      ctx.fillStyle = C.red3; ctx.fillRect(CX - x0 - len + 5, y - 52, len, 9); ctx.fillRect(CX + x0 + 5, y - 52, len, 9);
      ctx.fillStyle = C.gold; ctx.fillRect(CX - x0 - len, y - 57, len, 9); ctx.fillRect(CX + x0, y - 57, len, 9);
    });
    const s = 'MARINARA', size = 900 / measure(s, { f: 'Fr', w: 900, size: 100 }) * 100, o = { f: 'Fr', w: 900, size, c: C.cream, raw: 1, align: 'center', mis: C.red3, misd: 11 };
    ctx.save(); setFont(o); const ws = [...s].map(ch => ctx.measureText(ch).width); ctx.restore();
    let x = CX - ws.reduce((a, b) => a + b, 0) / 2;
    [...s].forEach((ch, i) => { const b = Math.sin(Math.PI * clamp((t - .22 - i * .06) / .32)); at(x + ws[i] / 2, 600 - b * 18, 1 + .13 * b, (i % 2 ? .05 : -.05) * b, () => txt(ch, 0, 0, o)); x += ws[i]; });
    ctx.restore();
  }
  // kinetic letters for a string that has already been checked (typographic quotes stand in for the straight ones)
  function kin(s, x, y, o, sec, stag, dur) {
    ctx.save(); setFont(o); const ws = [...s].map(ch => ctx.measureText(ch).width); ctx.restore();
    let cx = x - ws.reduce((a, b) => a + b, 0) / 2;
    [...s].forEach((ch, i) => { const q = clamp((sec - i * stag) / dur), e = E.out5(q);
      if (q > 0) txt(ch, cx + ws[i] / 2, y + (1 - e) * o.rise, Object.assign({}, o, { raw: 1, align: 'center', a: clamp(q * 4), rot: (1 - e) * (i % 2 ? .12 : -.12) }));
      cx += ws[i]; });
  }
  // the question, each word landing as it is spoken
  function question(t, y) {
    const s = os('nobody knows for sure why'), o = { f: 'Fr', w: 800, size: 110, c: C.gold, raw: 1, align: 'center', mis: '#132038', misd: 6 }, ws = s.split(' '), gap = 30;
    [[0, 2], [2, 5]].forEach(([a, b], li) => { const wd = ws.slice(a, b).map(w => measure(w, o)), tot = wd.reduce((p, c) => p + c, 0) + gap * (b - a - 1); let x = 436 - tot / 2;
      for (let i = a; i < b; i++) { const q = clamp((t - tQ[i] + .07) / .2), e = E.back(q), w = wd[i - a];
        if (q > 0) at(x + w / 2, y + li * 120 - 32, .7 + .3 * e, 0, () => txt(ws[i], 0, 32, o), clamp(q * 4));
        x += w + gap; } });
  }
  return {
    id: 'hook', t0: 0, tin: 'cut',
    capOff: [[0, 3.9]],   // MARINARA, "sailor-style" and the question are all set as type; no caption on top of them
    cues: [{ t: 0.02, k: 'whoosh', gain: .8 }, { t: 0.08, k: 'pop' }, { t: 0.3, k: 'pop', gain: .8 }, { t: 1.0, k: 'splash', gain: .9 }, { t: tNobody + .02, k: 'swish' }, { t: tWhy + .12, k: 'pop' }],
    draw(t) {
      bg(C.tomato, t, C.red2);
      const sun = pr(t, .95, .65, E.io), seaP = pr(t, 1.0, .9, E.out5), top = lerp(H + 80, SEA, seaP);
      const zoom = lerp(1.08, 1, pr(t, 0, .9, E.out5)), sink = 50 * pr(t, tSail, 2.6, E.io2);
      at(CX, CY + sink, zoom, 0, () => pan(t, sun));
      lockup(t);
      // the sea arrives as the voice gets to "sailor-style"
      if (seaP > 0) {
        sea(t, top - 46, '#2F4F7C', 16, .011, 2.0);
        const bx = lerp(-140, 800, pr(t, 1.1, 2.7, E.out3)), by = waveY(bx, t, top - 8, 20, .009, 2.6);
        at(bx, by - 26, .9, Math.cos(bx * .009 + t * 2.6) * .09, boat);
        sea(t, top, C.navy, 20, .009, 2.6, '#1A2C49');
        ctx.strokeStyle = '#2F4F7C'; ctx.lineWidth = 7; ctx.lineCap = 'round';      // swell marks low in the water
        for (let i = 0; i < 9; i++) { const x = 90 + hash(i + 3) * 820 + Math.sin(t * 1.3 + i) * 14, y = top + 520 + (i % 3) * 100 + hash(i + 50) * 60; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 24, y - 16, x + 48, y); ctx.quadraticCurveTo(x + 72, y + 16, x + 96, y); ctx.stroke(); }
        os('"sailor-style"');
        kin('“sailor-style”', W / 2, top + 196, { f: 'FrI', w: 600, size: 170, c: C.cream, rise: 70 }, t - tSail + .04, .026, .4);
        question(t, top + 322);
        const qp = pr(t, tWhy + .1, .7, E.spring);
        if (qp > 0) at(896, top + 446, qp, (1 - qp) * -.9 + .1 + Math.sin(t * 3) * .04, () => txt('?', 0, 0, { f: 'Fr', w: 900, size: 290, c: C.gold, mis: '#132038', misd: 9 }));
      }
    },
  };
})());
