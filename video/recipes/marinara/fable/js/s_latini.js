// s_latini.js — 12.6–22.05 L03 (Latini's 1692 book) and 22.05–25.8 L04 (legend vs. record).
'use strict';
(window.SCENE_LIST = window.SCENE_LIST || []).push((function () {
  // cue times as heard in the voice track (the aligner runs up to .3 s late on several of these words)
  const tNap = 14.15, tStew = 14.6, tAnt = 15.24, tPrint = 16.36, tEarl = 17.08, tSpan = 19.3, tBoil = 20.26, tNot = 20.98;
  const tFold = 15.98, tPlates = 19.45;   // the title card folds into a byline as the book comes up; the byline leaves when the plates enter
  const oval = (rx, ry) => { ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TAU); };
  // Latini as an engraved frontispiece: full-bottomed periwig, lace jabot, the steward's red coat. plate = 0..1 for his title
  function portrait(plate) {
    const RX = 205, RY = 250, wig = '#2B2422', curl = '#7A6657', skin = '#E9B990';
    shadow(() => { oval(RX + 17, RY + 17); ctx.fillStyle = C.gold; ctx.fill(); }, 12);
    oval(RX, RY); ctx.fillStyle = C.navy; ctx.fill();
    ctx.save(); oval(RX, RY); ctx.clip();
    ctx.strokeStyle = '#2F4B78'; ctx.lineWidth = 3;                                   // the engraver's ground
    for (let i = -16; i <= 16; i++) { ctx.beginPath(); ctx.moveTo(i * 30 - 270, 270); ctx.lineTo(i * 30 + 270, -270); ctx.stroke(); }
    ctx.fillStyle = halftone('#2F4B78', 12, 3.4); ctx.fillRect(-RX, 40, RX * 2, RY);
    // coat, shaded on one side, with its buttons
    ctx.fillStyle = C.red2; ctx.beginPath(); ctx.moveTo(-236, 280); ctx.quadraticCurveTo(-206, 112, -64, 84); ctx.lineTo(64, 84); ctx.quadraticCurveTo(206, 112, 236, 280); ctx.closePath(); ctx.fill();
    ctx.fillStyle = halftone(C.red3, 11, 3.2); ctx.beginPath(); ctx.moveTo(34, 84); ctx.lineTo(64, 84); ctx.quadraticCurveTo(206, 112, 236, 280); ctx.lineTo(60, 280); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.red3; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-6, 150); ctx.lineTo(-12, 270); ctx.stroke();
    [196, 232].forEach(y => { circle(20, y, 10, C.gold); circle(17, y - 3, 3.5, C.cream); });
    // the wig: a mass of curls down to the shoulders
    const curls = [[-50, -136, 60], [52, -136, 60], [-100, -84, 54], [102, -84, 54], [-118, -18, 52], [120, -18, 52], [-122, 48, 48], [124, 48, 48], [-110, 108, 44], [112, 108, 44], [-88, 152, 36], [90, 152, 36]];
    ctx.fillStyle = wig; curls.forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); });
    ctx.fillStyle = '#D9A27A'; ctx.fillRect(-30, 30, 66, 70);                           // neck
    for (let k = 2; k >= 0; k--) { const y = 100 + k * 31, hw = 36 + k * 10;            // lace jabot, three tiers
      ctx.fillStyle = k % 2 ? '#EADFC6' : C.cream; ctx.beginPath(); ctx.moveTo(-hw + 2, y - 16); ctx.lineTo(hw + 2, y - 16); ctx.lineTo(hw + 2, y + 16);
      for (let i = 3; i >= 0; i--) ctx.arc(-hw + 2 + (i + .5) * hw / 2, y + 16, hw / 4, 0, Math.PI); ctx.closePath(); ctx.fill(); }
    // the face, turned a little to the right, in shadow on that side
    ctx.beginPath(); ctx.ellipse(4, -36, 76, 94, 0, 0, TAU); ctx.fillStyle = skin; ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = halftone('#C4855C', 9, 2.6); ctx.fillRect(40, -140, 60, 220); ctx.fillRect(-80, 34, 180, 40); ctx.restore();
    circle(-36, -8, 15, 'rgba(215,58,42,.22)'); circle(46, -8, 13, 'rgba(215,58,42,.22)');
    ctx.fillStyle = wig; [[-44, -118, 40], [48, -118, 40], [-92, -56, 34], [98, -56, 34], [-96, 4, 30], [102, 4, 30]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); });
    ctx.strokeStyle = curl; ctx.lineWidth = 5;                                          // curl lines, cut like an engraving
    curls.forEach(([x, y, r], i) => { const a0 = (i % 2 ? .4 : 2.2) + i * .5; ctx.beginPath(); ctx.arc(x + (i % 2 ? 6 : -6), y, r * .58, a0, a0 + 3.7); ctx.stroke(); ctx.beginPath(); ctx.arc(x + (i % 2 ? 6 : -6), y, r * .26, a0 + 1.6, a0 + 5); ctx.stroke(); });
    ctx.strokeStyle = C.ink; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-46, -66); ctx.quadraticCurveTo(-30, -78, -10, -68); ctx.stroke();                 // brows: one of them raised
    ctx.beginPath(); ctx.moveTo(16, -74); ctx.quadraticCurveTo(34, -90, 52, -74); ctx.stroke();
    [[-27, -48], [32, -52]].forEach(([x, y]) => { ctx.beginPath(); ctx.ellipse(x, y, 10, 7, 0, 0, TAU); ctx.fillStyle = C.ink; ctx.fill(); circle(x - 3, y - 3, 2.6, C.cream);
      ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(x - 15, y - 5); ctx.quadraticCurveTo(x, y - 15, x + 15, y - 5); ctx.stroke(); });
    ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(8, -56); ctx.quadraticCurveTo(24, -28, 22, -10); ctx.quadraticCurveTo(13, -1, 1, -8); ctx.stroke();   // nose
    ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(6, 10); ctx.bezierCurveTo(-8, 24, -34, 22, -46, -4); ctx.stroke();                                       // curled moustache
    ctx.beginPath(); ctx.moveTo(6, 10); ctx.bezierCurveTo(20, 24, 44, 22, 56, -4); ctx.stroke();
    ctx.strokeStyle = C.red3; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-8, 28); ctx.quadraticCurveTo(5, 34, 18, 28); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(5, 45, 6, 9, 0, 0, TAU); ctx.fillStyle = C.ink; ctx.fill();
    ctx.restore();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 3; oval(RX + 2, RY + 2); ctx.stroke(); ctx.strokeStyle = C.gold2; oval(RX + 17, RY + 17); ctx.stroke();
    if (plate > 0) { const e = E.back(clamp(plate)); at(0, RY + 4, .6 + .4 * e, -.03, () => { const o = { f: 'FrI', w: 600, size: 62, c: C.ink }, w = measure('steward', o) + 76;
      shadow(() => rr(-w / 2, -48, w, 92, 12, C.gold), 7); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; rr(-w / 2 + 8, -40, w - 16, 76, 6); ctx.stroke(); txt('steward', 0, 16, o); }, clamp(plate * 3)); }
  }
  const PW = 400, PH = 440;
  function pageLines(x0, y0, n, seed, skip) { ctx.fillStyle = 'rgba(29,26,25,.28)'; for (let i = 0; i < n; i++) { if (skip && skip.includes(i)) continue; ctx.fillRect(x0, y0 + i * 34, (PW - 90) * (.72 + .28 * hash(seed + i)), 9); } }
  function book(t) {
    const open = E.io(clamp((t - tPrint + .1) / .7)), sx = Math.cos(open * Math.PI), left = Math.max(0, -sx);
    ctx.translate(-PW / 2 * (1 - open), 0);   // closed, the book sits centred; it slides over as the cover swings open
    shadow(() => rr(-PW * left - 14, -PH / 2 - 10, PW * (1 + left) + 28, PH + 26, 14, C.red3), 14);
    // right page (under the cover until it opens): the phrase, and its translation written in the margin beneath it
    rr(0, -PH / 2, PW, PH, 6, C.cream); ctx.fillStyle = 'rgba(29,26,25,.08)'; ctx.fillRect(0, -PH / 2, 26, PH);
    pageLines(50, -170, 3, 5); pageLines(50, 134, 2, 9);
    const hp = pr(t, tSpan - .15, .5, E.io);
    ctx.fillStyle = C.gold; ctx.globalAlpha = .6; ctx.fillRect(40, -66, 330 * hp, 74); ctx.globalAlpha = 1;
    os('"...alla spagnuola"');   // set with typographic quotes, like the America card
    txt('“...alla spagnuola”', 50, -10, { f: 'FrI', w: 600, size: 42, c: C.ink, align: 'left', raw: 1, a: pr(t, tPrint + .45, .4, E.lin) });
    note('= Spanish-style', 46, 82, { size: 54, c: C.red2, align: 'left' }, pr(t, tSpan + .04, .45, E.lin));
    stroke([[50, 100], [180, 109], [318, 98]], C.red2, 5, pr(t, tSpan + .4, .35, E.io));
    // the flipping leaf: front = cover (right side), back = title page (left side)
    ctx.save(); ctx.scale(sx, 1);
    if (sx > 0) { rr(0, -PH / 2 - 8, PW + 8, PH + 16, 10, C.red2); ctx.strokeStyle = C.gold; ctx.lineWidth = 5; rr(30, -PH / 2 + 24, PW - 52, PH - 48, 6); ctx.stroke();
      at(PW / 2 + 4, -72, 1, 0, () => { circle(0, 0, 68, C.cream); ctx.strokeStyle = C.gold; ctx.lineWidth = 4; ctx.stroke(); at(0, 6, 1, 0, () => tomato(42)); });   // the same red tomato as inside
      para('Lo scalco alla moderna', PW / 2 + 4, 52, { f: 'FrI', w: 600, size: 46, c: C.gold }, 300, 1, 1.1); }
    else { ctx.scale(-1, 1); rr(-PW, -PH / 2, PW, PH, 6, C.cream); ctx.fillStyle = 'rgba(29,26,25,.08)'; ctx.fillRect(-26, -PH / 2, 26, PH);
      para('Lo scalco alla moderna', -PW / 2, -90, { f: 'FrI', w: 600, size: 60, c: C.red2 }, 320, 1, 1.08);
      ctx.fillStyle = C.ink; ctx.fillRect(-PW / 2 - 60, 66, 120, 5); at(-PW / 2, 120, 1, 0, () => tomato(28)); }
    ctx.restore();
  }
  function plate(kind, t) {
    shadow(() => circle(0, 0, 92, C.cream)); ctx.strokeStyle = C.paper2; ctx.lineWidth = 8; circle(0, 0, 66); ctx.stroke();
    if (kind === 'meat') { ctx.fillStyle = '#9C5A44'; ctx.beginPath(); ctx.ellipse(-4, 0, 50, 36, .3, 0, TAU); ctx.fill(); ctx.fillStyle = '#B87862'; ctx.beginPath(); ctx.ellipse(-10, -8, 30, 16, .3, 0, TAU); ctx.fill(); circle(20, 14, 24, C.tomato); }
    else { ctx.strokeStyle = C.gold; ctx.lineWidth = 9; ctx.lineCap = 'round'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(0, 0, 50 - i * 8, 30 - i * 3, i * .7, 0, TAU); ctx.stroke(); } }
  }
  return {
    id: 'latini', t0: 12.6, tin: 'cut',
    // The whole line is set as type as it is spoken (1692 · NAPLES · steward · Antonio Latini, then the earliest-recipes
    // line, the translation and the plates), so the caption stays off: no spelled-out "sixteen ninety-two" under the numeral.
    capOff: [[12.7, 21.5]],
    cues: [{ t: 12.7, k: 'pop' }, { t: 12.9, k: 'swish', gain: .6 }, { t: tNap, k: 'pop', gain: .8 }, { t: tStew, k: 'pop', gain: .6 }, { t: tAnt, k: 'pop', gain: .7 }, { t: tPrint - .05, k: 'whoosh', gain: .8 }, { t: tEarl, k: 'shimmer', gain: .5 }, { t: tSpan, k: 'scrape', gain: .6 }, { t: tBoil, k: 'ding', gain: .6 }, { t: tNot, k: 'pop' }, { t: 21.7, k: 'swish' }],
    draw(t) {
      bg(C.paper, t, C.paper2); chapter('A LITTLE HISTORY', 250, C.red2, 1);
      // three states of one page. A title card: the date, the city and the man arrive together. Then that folds into a
      // byline while his book comes up and opens on the phrase. Then the byline leaves and the plates say what it was for.
      const push = 1 + .035 * pr(t, tPrint, 5.3, E.io2);
      ctx.save(); ctx.translate(-W * E.in3(clamp((t - 21.7) / .35)), 0); ctx.translate(540, 900); ctx.scale(push, push); ctx.translate(-540, -900);
      const m = pr(t, tFold, .55, E.io), gone = pr(t, tPlates, .4, E.in3), aA = clamp(1 - m * 2.6), aB = clamp(m * 2.6 - 1.6) * (1 - gone);
      if (aA > 0) at(0, -70 * m, 1, 0, () => {
        letters('1692', 540, 612, { f: 'Fr', w: 900, size: 300, c: C.tomato, mis: C.ink, misd: 11, ls: -4 }, t - 12.66, .06, .42);
        at(540, 692, 1 + .16 * Math.sin(Math.PI * clamp((t - tNap) / .35)), -.03, () => tag('NAPLES', 0, 0, { size: 60, bg: C.ink, ls: 10 }, clamp((t - 12.98) / .3)));
        note('Antonio Latini', 540, 1484, { size: 118, c: C.ink }, pr(t, tAnt - .05, .55, E.lin));
      }, aA);
      const pp = pr(t, 12.84, .6, E.back);
      if (pp > 0 && gone < 1) at(lerp(540, 165, m), lerp(1052, 470, m) - gone * 150, pp * lerp(1.1, .42, m), (1 - pp) * -.22, () => portrait(clamp((t - tStew + .05) / .3) * aA), 1 - gone);
      if (aB > 0) at(0, -gone * 150, 1, 0, () => {
        note('Antonio Latini, steward', 300, 476, { size: 80, c: C.ink, align: 'left' }, 1);
        const w = measure('1692 · NAPLES', { f: 'Bar', w: 700, size: 42, ls: 3 }) + 46;
        tag('1692 · NAPLES', 300 + w / 2, 540, { size: 42, bg: C.tomato, c: C.cream }, 1);
      }, aB);
      const bp = pr(t, tFold + .02, .55, E.back), by = lerp(950, 840, pr(t, tPlates, .5, E.io));
      if (bp > 0) at(540, by + (1 - bp) * 120, 1.2 * (.9 + .1 * bp), 0, () => book(t), clamp(bp * 2.5));
      const rb = env(t, tPrint + .3, tPlates + .1, .5, .3); if (rb > 0) at(540, 1352, 1, 0, () => para('one of the earliest known printed tomato sauce recipes', 0, -40, { f: 'Fr', w: 800, size: 62, c: C.ink }, 920, pr(t, tPrint + .35, 1.2, E.lin), 1.14), rb);
      // what it was for: both plates and the line are up before "for boiled meat" is spoken; the tick and the strike land on the words
      const p1 = pr(t, tPlates + .22, .5, E.back), p2 = pr(t, tPlates + .4, .5, E.back);
      if (p1 > 0) { at(170, 1340, p1 * 1.4, 0, () => plate('meat', t)); at(266, 1232, 1.25 * pr(t, tBoil - .04, .4, E.back), 0, () => { circle(0, 0, 30, C.green); stroke([[-13, 0], [-3, 11], [14, -11]], C.cream, 8, 1); }); }
      if (p2 > 0) { at(440, 1340, p2 * 1.4, 0, () => plate('pasta', t)); at(440, 1340, 1.4, 0, () => strike(100, C.tomato, 10, pr(t, tNot - .03, .3, E.out3))); }
      if (p1 > 0) para('served with boiled meat, not pasta', 626, 1302, { f: 'Fr', w: 800, size: 64, c: C.ink, align: 'left' }, 424, pr(t, tPlates + .3, .6, E.lin), 1.12);
      ctx.restore();
    },
  };
})());

(window.SCENE_LIST = window.SCENE_LIST || []).push((function () {
  const tSail = wt('L04', 'sailor'), tTrad = 24.05, tRec = 25.2;   // "tradition" and "records" as heard
  function skiff() { // the paper boat from the opening
    ctx.fillStyle = C.cream; ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(90, 0); ctx.lineTo(60, 46); ctx.lineTo(-60, 46); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(-4, -8); ctx.lineTo(-4, -150); ctx.lineTo(74, -8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.gold2; ctx.beginPath(); ctx.moveTo(-14, -8); ctx.lineTo(-14, -112); ctx.lineTo(-66, -8); ctx.closePath(); ctx.fill();
  }
  return {
    id: 'legend', t0: 22.05, tin: 'cut',
    capOff: [[24.6, 25.4]],   // only "not records.": those words are the stamp. The rest of the line keeps its caption
    cues: [{ t: 22.1, k: 'swish' }, { t: tSail, k: 'pop', gain: .7 }, { t: 22.75, k: 'swish' }, { t: 23.32, k: 'ding', gain: .4 }, { t: tTrad + .08, k: 'pop', gain: 1.3 }, { t: tRec, k: 'ding', gain: .5 }],
    draw(t) {
      bg(C.paper, t, C.paper2); chapter('A LITTLE HISTORY', 250, C.red2, 1);
      // the legend card takes the frame, then moves up as the record arrives under it (22.75), so both are up and
      // readable for the rest of the line: the stamp lands on "tradition", the tick is on the record and rings on "records".
      const a = pr(t, 22.08, .55, E.out5), up = pr(t, 22.68, .55, E.io), b = pr(t, 22.75, .55, E.out5), sp = clamp((t - tTrad) / .22), shake = sp < 1 ? 0 : Math.exp(-(t - tTrad - .22) * 9) * Math.sin((t - tTrad) * 60) * 7;
      const ck = pr(t, 23.25, .4, E.back), ring = clamp((t - tRec) / .45), nod = 1 + .03 * Math.sin(Math.PI * clamp(ring * 1.1));
      at(540 + (1 - a) * W, lerp(860, 598, up) + shake, lerp(1.08, 1, up), -.015, () => {
        shadow(() => rr(-470, -270, 940, 540, 36, C.navy), 14); ctx.save(); rr(-470, -270, 940, 540, 36); ctx.clip(); ctx.fillStyle = halftone('#2F4B78', 14, 3.6); ctx.fillRect(-470, 70, 940, 200);
        const wave = (i, x) => 168 + i * 46 + Math.sin(x * .016 + t * (1.6 + i) + i * 2) * 14;
        ['#2F4B78', '#3B5C90'].forEach((col, i) => {
          if (i) { const bx = -330 + (t - 22) * 34; at(bx, wave(1, bx) - 24, .62, Math.cos(bx * .016 + t * 2.6 + 2) * .08, skiff); }
          ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-470, 270); for (let x = -470; x <= 470; x += 20) ctx.lineTo(x, wave(i, x)); ctx.lineTo(470, 270); ctx.fill(); });
        ctx.restore();
        tag('LEGEND', -300, -186, { size: 56, bg: C.gold, c: C.ink, ls: 8 }, 1);
        para('sailors invented marinara', -410, -58, { f: 'FrI', w: 600, size: 98, c: C.cream, align: 'left' }, 830, pr(t, tSail - .05, .7, E.lin), 1.06);
        if (sp > 0) at(138, 150, 2.4 - 1.4 * E.out5(sp), -.1, () => { rr(-300, -62, 600, 124, 14, C.cream); ctx.strokeStyle = C.tomato; ctx.lineWidth = 9; ctx.stroke(); rr(-284, -46, 568, 92, 8); ctx.lineWidth = 3; ctx.stroke(); txt('tradition, not records', 0, 22, { f: 'Bar', w: 700, size: 62, c: C.tomato, ls: 2 }); }, clamp(sp * 2));
      });
      if (b > 0) at(540 + (1 - b) * W, 1134, nod, .012, () => {
        shadow(() => rr(-470, -225, 940, 450, 36, C.cream), 14); ctx.strokeStyle = C.ink; ctx.lineWidth = 6; rr(-470, -225, 940, 450, 36); ctx.stroke();
        tag('DOCUMENTED', -226, -144, { size: 54, bg: C.green, c: C.cream, ls: 8 }, 1);
        // the record, cut down to a date and one short statement (both verbatim from the checked line)
        letters('1692', -436, 112, { f: 'Fr', w: 900, size: 168, c: C.tomato, mis: C.ink, misd: 7, ls: -3, align: 'left' }, t - 22.95, .05, .4);
        os('a Spanish-style tomato sauce in print');
        ['a Spanish-style', 'tomato sauce', 'in print'].forEach((l, i) => { const q = E.out3(clamp((t - 23.05 - i * .13) / .35)); txt(l, -12, -34 + i * 64 + (1 - q) * 16, { f: 'Fr', w: 800, size: 57, c: C.ink, align: 'left', raw: 1, a: q }); });
        note('not called marinara', -10, 172, { size: 56, c: C.red2, align: 'left' }, pr(t, 23.5, .5, E.lin));
        at(388, -144, 1, 0, () => ticks(7, 62, 96, C.green, 8, ring, -Math.PI * 1.08, Math.PI * 1.16));
        if (ck > 0) at(388, -144, ck * (1 + .22 * Math.sin(Math.PI * clamp(ring * 1.3))), 0, () => { shadow(() => circle(0, 0, 50, C.green), 6); stroke([[-22, 0], [-6, 18], [24, -18]], C.cream, 12, 1); });
      });
    },
  };
})());
