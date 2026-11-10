// s_history.js — 3.95–12.6  L02: tomatoes cross the ocean; fried vs. grown for looks; nightshade cousins.
'use strict';
(window.SCENE_LIST = window.SCENE_LIST || []).push((function () {
  const tEur = wt('L02', 'europe'), tAm = wt('L02', 'americas'), tFried = wt('L02', 'some');
  // heard in the voice track (the aligner is up to .15 s late on these): "in the fifteen-hundreds", "plenty", "cousins", "deadly"
  const t15 = 6.0, tLooks = 8.42, tCous = 10.6, tDeadly = 11.2;
  // --- the Atlantic, as a cut-paper chart. Coastlines are simplified [lon, lat] rings, 6 px per degree.
  const mx = lon => 50 + (lon + 122) * 6, my = lat => 348 + (72 - lat) * 6;
  const AMERICAS = [[[-170,66],[-156,71],[-128,70],[-110,68],[-95,69],[-86,67],[-94,60],[-88,56],[-80,52],[-78,58],[-76,62],[-65,60],[-56,52],[-60,47],[-70,42],[-75,36],[-81,31],[-80,25.5],[-83,29],[-90,29.5],[-97,27],[-97,21],[-94,18.5],[-90,21],[-87,21],[-88,16],[-83,15],[-83,10],[-79,9.5],[-77,8],[-72,12],[-62,10.5],[-52,5],[-50,0],[-35,-6],[-39,-15],[-41,-22],[-48,-26],[-54,-34],[-58,-38],[-65,-41],[-68,-50],[-68,-55],[-74,-51],[-73,-40],[-71,-30],[-70,-18],[-76,-13],[-81,-5],[-80,0],[-77,4],[-78,8],[-84,10],[-88,13],[-93,16],[-100,17],[-105,20],[-106,23],[-113,30],[-117,33],[-122,37],[-124,42],[-124,48],[-131,54],[-140,60],[-152,58],[-165,56]],
    [[-84,22.5],[-80,23],[-74.5,20.2],[-77.5,19.9]], [[-74,19.8],[-68.5,19.6],[-69,18.2],[-74,18.3]]];
  const EUROPE = [[[-9,43],[-9,37],[-5.5,36],[-2,36.8],[0,39],[3,42],[5,43.3],[9,44.3],[10.5,43.8],[12.5,41.6],[15.6,40],[16.2,38],[17.2,39.5],[18.4,40.2],[15.5,41.8],[13,43.6],[12.2,44.8],[13.5,45.7],[14.5,45.3],[17.5,43],[19.5,41.5],[22.5,37],[24,38.5],[23,40.5],[26,41],[29,41],[28,44],[31,46.5],[37,46],[46,46],[46,68],[40,66],[33,69],[26,71],[15,68],[5,62],[5.5,58.5],[8,58],[11,59],[12.5,56],[14,55.5],[18,59.5],[22,65.5],[25,65],[21.5,61],[23,59.8],[30,60],[24,59],[22,57.5],[21,55],[14,54],[10,54],[8.5,57.5],[8,55.5],[8.5,53.5],[4,52],[1.7,50.9],[-1.5,49.5],[-4.7,48.4],[-1.2,46],[-1.5,43.4]],
    [[-5.5,50.1],[1.3,51.2],[1.7,52.7],[-0.2,54],[-2,56],[-2,57.7],[-3.5,58.6],[-6,57.5],[-5,55],[-3,54],[-4.5,53.2],[-5,51.8],[-3,51.4]], [[-10,52],[-6.2,52.2],[-6,54.5],[-8,55.2],[-10,54]],
    [[-24,65.5],[-22,64],[-14,64.5],[-15,66.3]], [[12.5,38],[15.5,38.2],[15,36.7]], [[8.3,41],[9.7,41],[9.5,39],[8.5,39]]];
  const ELSEWHERE = [[[-6,35.8],[10,37],[11,33.5],[20,32.5],[25,31.5],[32,31],[34,28],[37,21],[43,12],[51,12],[48,5],[40,-3],[39,-10],[40.5,-15],[35,-20],[35.5,-24],[32.5,-27],[27,-34],[20,-34.8],[18,-33],[15,-27],[12,-17],[13.5,-10],[9,-1],[9.5,4],[5,6],[-4,5],[-8,4.5],[-13,8.5],[-17,14.7],[-16,20],[-17,21],[-13,27.5],[-9.5,31]],
    [[27,37],[26.5,40.3],[29,41.2],[36,42],[46,42],[46,30],[35,29],[34.5,31.5],[36,36],[32,36.5],[30,36.3]], [[-52,66],[-44,60],[-40,65],[-22,70],[-20,77],[-58,77]]];
  function land(rings, col, shade) {
    const path = () => { ctx.beginPath(); rings.forEach(r => { r.forEach(([lo, la], i) => i ? ctx.lineTo(mx(lo), my(la)) : ctx.moveTo(mx(lo), my(la))); ctx.closePath(); }); };
    ctx.lineJoin = 'round'; ctx.lineWidth = 4; ctx.strokeStyle = col; ctx.fillStyle = col; path(); ctx.fill(); ctx.stroke();
    if (shade) { ctx.save(); path(); ctx.clip(); ctx.fillStyle = halftone(shade, 11, 3); ctx.fillRect(0, 300, W, 900); ctx.translate(-13, -9); ctx.fillStyle = col; path(); ctx.fill(); ctx.restore(); } // a printed shadow along the east and south coasts
  }
  const popAt = (x, y, s, fn) => { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y); fn(); ctx.restore(); };
  const ROUTE = [[188, 664], [430, 468], [674, 556]], routeAt = u => [0, 1].map(k => (1 - u) * (1 - u) * ROUTE[0][k] + 2 * u * (1 - u) * ROUTE[1][k] + u * u * ROUTE[2][k]);
  const page = (t, tIn, tOut) => (tIn === null ? 0 : (1 - E.io(clamp((t - tIn) / .55))) * W) - (tOut === null ? 0 : E.io(clamp((t - tOut) / .55)) * W);
  // the ship that carries it over: an unmistakable boat (hull, mast, sails, pennant) with one tomato as cargo
  function ship() {
    at(-40, -30, 1, 0, () => tomato(40));
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(-100, -8); ctx.lineTo(104, -8); ctx.lineTo(70, 44); ctx.lineTo(-72, 44); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.cream; ctx.fillRect(-84, 6, 160, 7);
    ctx.fillStyle = C.ink; ctx.fillRect(22, -176, 8, 170);
    ctx.fillStyle = C.red2; ctx.beginPath(); ctx.moveTo(34, -166); ctx.lineTo(34, -22); ctx.lineTo(112, -22); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.tomato; ctx.beginPath(); ctx.moveTo(34, -166); ctx.lineTo(34, -118); ctx.lineTo(60, -118); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(22, -176); ctx.lineTo(22, -204); ctx.lineTo(-16, -190); ctx.closePath(); ctx.fill();
  }
  function bell() { // one nodding bell flower, hanging from (0,0)
    ctx.beginPath(); ctx.moveTo(-13, 8); ctx.bezierCurveTo(-34, 26, -28, 54, -40, 74);
    ctx.quadraticCurveTo(-27, 92, -14, 76); ctx.quadraticCurveTo(0, 94, 14, 76); ctx.quadraticCurveTo(27, 92, 40, 74);
    ctx.bezierCurveTo(28, 54, 34, 26, 13, 8); ctx.closePath(); ctx.fillStyle = '#A88BD0'; ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = '#6F5599'; ctx.beginPath(); ctx.ellipse(0, 82, 32, 13, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = halftone('#6F5599', 9, 2.5); ctx.fillRect(4, 0, 40, 100); ctx.restore();
    ctx.strokeStyle = '#DACDF0'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-12, 24); ctx.quadraticCurveTo(-21, 44, -25, 62); ctx.stroke();
    for (let i = -2; i <= 2; i++) at(0, 2, 1, Math.PI / 2 + i * .5, () => leaf(27, 9, '#7FA06B', false));
    circle(0, 88, 5, C.gold);
  }
  function berry(r) { // a glossy black berry sitting on its green star
    for (let i = 0; i < 5; i++) at(0, 0, 1, i * TAU / 5 - Math.PI / 2, () => leaf(r * 1.8, r * .5, '#7FA06B', false));
    circle(0, 0, r, '#15101C'); ctx.strokeStyle = '#8E78B8'; ctx.lineWidth = 3; ctx.stroke(); circle(-r * .35, -r * .35, r * .24, 'rgba(251,244,230,.88)');
  }
  function sprig(kind, t) { // botanical sprig, about 380 tall, centred
    const sway = Math.sin(t * 1.3 + (kind === 'tomato' ? 0 : 2)) * .03, sc = kind === 'tomato' ? C.green : '#7FA06B';
    ctx.save(); ctx.rotate(sway);
    ctx.strokeStyle = sc; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-20, 170); ctx.bezierCurveTo(-40, 60, 40, -40, 10, -170); ctx.stroke();
    const lc = kind === 'tomato' ? C.leaf : '#8DB07A';
    [[-28, 90, 2.6, 1.0], [4, 20, -.5, 1.1], [18, -70, 2.9, .9], [14, -150, -.9, .8]].forEach(([x, y, r, s]) => at(x, y, s, r, () => leaf(120, 44, lc)));
    if (kind === 'tomato') { [[-70, 30, 44], [-108, 96, 36], [66, -30, 40]].forEach(([x, y, r]) => { ctx.strokeStyle = C.green; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, y - 40); ctx.lineTo(x, y - r); ctx.stroke(); at(x, y, 1, 0, () => tomato(r)); }); }
    else {
      [[-78, 24, 27], [-106, 92, 23], [-44, 96, 25], [92, 62, 24]].forEach(([x, y, r]) => { ctx.strokeStyle = sc; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, y - 34); ctx.lineTo(x, y - r); ctx.stroke(); at(x, y, 1, x * .004, () => berry(r)); });
      [[10, -92, 78, -118, .22, 1], [14, -150, -52, -168, -.26, .86]].forEach(([x0, y0, x1, y1, rot, s], i) => {     // two bells on arching stalks
        ctx.strokeStyle = sc; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, y1 - 26, x1, y1); ctx.stroke();
        at(x1, y1, s, rot + Math.sin(t * 2.1 + i * 2) * .07, bell); });
    }
    ctx.restore();
  }
  // a pressed-specimen card, 480 x 900, for the two cousins
  function specimen(kind, t) {
    const night = kind === 'night', w = 480, h = 900;
    shadow(() => rr(-w / 2, -h / 2, w, h, 30, night ? C.navy : C.cream));
    ctx.save(); rr(-w / 2, -h / 2, w, h, 30); ctx.clip();
    ctx.fillStyle = halftone(night ? '#1A2C49' : C.paper2, 14, 3.4); ctx.fillRect(-w / 2, h / 2 - 330, w, 330);
    at(12, -104, 1.56, 0, () => sprig(kind, t)); ctx.restore();
    ctx.strokeStyle = night ? '#B9A3D6' : C.tomato; ctx.lineWidth = 8; rr(-w / 2 + 16, -h / 2 + 16, w - 32, h - 32, 18); ctx.stroke();
  }
  function deadly() { // the checked label set on two lines, as a warning plate
    os('DEADLY NIGHTSHADE'); const o = { f: 'Bar', w: 700, size: 68, ls: 4, raw: 1 }, w = Math.max(measure('DEADLY', o), measure('NIGHTSHADE', o)) + 70;
    shadow(() => rr(-w / 2, -96, w, 192, 12, C.cream), 8); ctx.strokeStyle = C.tomato; ctx.lineWidth = 5; rr(-w / 2 + 10, -86, w - 20, 172, 6); ctx.stroke();
    txt('DEADLY', 0, -14, Object.assign({ c: C.tomato }, o)); txt('NIGHTSHADE', 0, 62, Object.assign({ c: C.ink }, o));
  }
  function pan(t) {
    ctx.save(); ctx.rotate(-.5); rr(120, -24, 250, 48, 24, C.ink); ctx.restore();
    circle(0, 0, 172, C.ink); circle(0, 0, 146, '#3A3431');
    [[-52, -44, 56, 0], [58, -10, 50, 1], [-18, 66, 52, 2]].forEach(([x, y, r, i]) => { const j = Math.sin(t * 14 + i * 2) * 2.5; at(x + j, y, 1, i, () => { circle(0, 0, r, C.tomato); circle(0, 0, r * .72, '#E86A4E'); ctx.fillStyle = C.red2; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(Math.cos(k * TAU / 3) * r * .36, Math.sin(k * TAU / 3) * r * .36, r * .2, r * .13, k * TAU / 3, 0, TAU); ctx.fill(); } }); });
  }
  function pot(t) {
    ctx.fillStyle = '#C8683C'; ctx.beginPath(); ctx.moveTo(-96, 60); ctx.lineTo(96, 60); ctx.lineTo(72, 190); ctx.lineTo(-72, 190); ctx.closePath(); ctx.fill(); rr(-110, 30, 220, 44, 8, '#D9794A');
    ctx.strokeStyle = C.green2; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 34); ctx.bezierCurveTo(-16, -40, 20, -90, 0, -180); ctx.stroke();
    [[-6, -10, 2.7, 1], [6, -60, -.4, 1.05], [2, -110, 2.9, .9], [4, -160, -.7, .8], [0, -180, -1.6, .7]].forEach(([x, y, r, s]) => at(x, y, s, r + Math.sin(t * 1.5 + y) * .04, () => leaf(110, 42, '#7BB872')));
    [[-66, -52, 30], [70, -100, 26], [-48, -140, 22]].forEach(([x, y, r]) => at(x, y, 1, 0, () => tomato(r)));
    [[-120, -150, 0], [112, -30, .5], [40, -214, .25]].forEach(([x, y, ph]) => { const s = .5 + .5 * Math.sin((t * .9 + ph) * TAU); at(x, y, s, t * .6, () => sparkle(30, C.cream)); });
  }
  return {
    id: 'history', t0: 3.95, iris: [540, 640], ring: C.red3,
    // muted only where the same words are set as type: "in the fifteen-hundreds." under 1500s, "Some Italians fried
    // them;" on its card, "of deadly nightshade." on the plate. ("plenty of others grew them for looks" stays
    // captioned: the card's checked wording is "many", not the spoken words.)
    capOff: [[5.75, 7.2], [7.25, 8.32], [10.88, 12.2]],
    cues: [{ t: 3.97, k: 'whoosh' }, { t: tEur - .1, k: 'swish', gain: .7 }, { t: 6.1, k: 'splash', gain: .5 }, { t: t15 + .1, k: 'pop' }, { t: 7.1, k: 'swish' }, { t: tFried + .46, k: 'sizzle', dur: 1.5, gain: .8 }, { t: tLooks + .5, k: 'shimmer', gain: .6 }, { t: 10.15, k: 'swish' }, { t: tCous + .05, k: 'pop' }, { t: tDeadly + .06, k: 'pop', gain: 1.2 }],
    draw(t) {
      bg(C.paper, t, C.paper2);
      chapter('A LITTLE HISTORY', 250, C.red2, pr(t, 4.05, .6, E.lin));
      // --- page A: the crossing, Mexico to the coast of Europe
      const xa = page(t, null, 7.1);
      if (xa > -W) { ctx.save(); ctx.translate(xa, 0);
        ctx.save(); rr(50, 340, 980, 830, 36, '#D2E0EA'); ctx.clip();
        ctx.strokeStyle = '#A9C0D6'; ctx.lineWidth = 6; ctx.lineCap = 'round';
        for (let i = 0; i < 18; i++) { const x = 70 + hash(i) * 860, y = 390 + hash(i + 40) * 730, dx = Math.sin(t * 1.4 + i) * 10; ctx.beginPath(); ctx.moveTo(x + dx, y); ctx.quadraticCurveTo(x + dx + 20, y - 14, x + dx + 40, y); ctx.quadraticCurveTo(x + dx + 60, y + 14, x + dx + 80, y); ctx.stroke(); }
        const sail = E.io2(clamp((t - 4.4) / 1.75)), hit = clamp((t - 6.1) / .45);
        popAt(300, 640, pr(t, 4.0, .6, E.back), () => land(AMERICAS, C.leaf, C.green));
        popAt(900, 820, pr(t, 4.1, .6, E.back), () => land(ELSEWHERE, '#E2D0AA'));
        popAt(850, 500, pr(t, 4.2, .6, E.back) * (1 + .06 * Math.sin(Math.PI * hit)), () => land(EUROPE, C.gold, C.gold2));
        ctx.strokeStyle = C.ink; ctx.lineWidth = 6; ctx.setLineDash([3, 18]); ctx.lineCap = 'round'; ctx.beginPath(); for (let u = 0; u <= sail; u += .02) { const p = routeAt(u); ctx.lineTo(p[0], p[1]); } ctx.stroke(); ctx.setLineDash([]);
        const op = pr(t, 4.25, .4, E.back); circle(ROUTE[0][0], ROUTE[0][1], 15 * op, C.ink); circle(ROUTE[0][0], ROUTE[0][1], 8 * op, C.tomato);
        ctx.restore();
        tag('THE AMERICAS', 232, 500, { size: 40, bg: C.ink }, clamp((t - tAm + .1) / .3)); tag('EUROPE', 922, 478, { size: 40, bg: C.ink }, clamp((t - tEur + .1) / .3));
        const bp = routeAt(sail); at(bp[0], bp[1], 1, 0, () => ticks(9, 70, 120, C.tomato, 8, hit));
        const bs = .62 * pr(t, 4.3, .4, E.back), by = bp[1] + Math.sin(t * 5) * 4;
        ctx.strokeStyle = C.cream; ctx.lineWidth = 6; ctx.lineCap = 'round';                // bow wave under the hull
        if (bs > .3) [-1, 1].forEach(s => { ctx.beginPath(); ctx.moveTo(bp[0] + s * 30, by + 34); ctx.quadraticCurveTo(bp[0] + s * 62, by + 22 + Math.sin(t * 6 + s) * 4, bp[0] + s * 92, by + 36); ctx.stroke(); });
        at(bp[0], by, bs, Math.sin(t * 3.4) * .08, ship);
        // the date gets the lower frame to itself, clear of the chart
        letters('1500s', 540, 1452, { f: 'Fr', w: 900, size: 270, c: C.tomato, mis: C.ink, misd: 10, ls: -4 }, t - t15, .04, .4);
        ctx.restore(); }
      // --- page B: two habits. The first card is a tall poster while it has the frame to itself, then makes room
      const xb = page(t, 7.1, 10.15);
      if (Math.abs(xb) < W) { ctx.save(); ctx.translate(xb, 0);
        const p1 = pr(t, tFried - .1, .6, E.back), p2 = pr(t, tLooks - .1, .6, E.back), up = pr(t, tLooks - .32, .55, E.io);
        if (p1 > 0) { const hh = lerp(385, 245, up);
          at(540, lerp(915, 575, up), (.8 + .2 * p1) * lerp(1.1, 1, up), (1 - p1) * -.05, () => {
            shadow(() => rr(-470, -hh, 940, hh * 2, 36, C.gold)); ctx.save(); rr(-470, -hh, 940, hh * 2, 36); ctx.clip(); ctx.fillStyle = halftone(C.gold2, 14, 3.4); ctx.fillRect(-470, hh - 190, 940, 190);
            at(lerp(-36, -255, up), lerp(-128, 0, up), lerp(1.36, 1.12, up), 0, () => { pan(t); ticks(8, 178, 226, C.ink, 9, (t * 1.7) % 1, lerp(2.5, 1.75, up), lerp(2.2, 2.9, up)); }); ctx.restore();
            const s = os('some Italians fried them'), rp = pr(t, tFried, .7, E.lin), aT = clamp(1 - up * 2.4), aC = clamp(up * 2.4 - 1.4);
            if (aT > 0) ['some Italians', 'fried them'].forEach((l, i) => { const q = E.out3(clamp(rp * 1.7 - i * .35)); txt(l, 0, 216 + i * 112 + (1 - q) * 18, { f: 'Fr', w: 800, size: 106, c: C.ink, raw: 1, a: q * aT }); });
            if (aC > 0) para(s, -30, -40, { f: 'Fr', w: 800, size: 84, c: C.ink, align: 'left', a: aC }, 440, 1, 1.08);
          }, clamp(p1 * 3)); }
        if (p2 > 0) at(540, 1110, .8 + .2 * p2, (1 - p2) * .05, () => { shadow(() => rr(-470, -245, 940, 490, 36, C.green)); ctx.save(); rr(-470, -245, 940, 490, 36); ctx.clip(); ctx.fillStyle = halftone(C.green2, 14, 3.4); ctx.fillRect(-470, 55, 940, 190); ctx.restore();
          at(250, 18, 1.08, 0, () => pot(t));
          para('many grew them for looks', -420, -56, { f: 'Fr', w: 800, size: 84, c: C.cream, align: 'left' }, 430, pr(t, tLooks + .05, .8, E.lin), 1.08); }, clamp(p2 * 3));
        ctx.restore(); }
      // --- page C: the cousins, side by side as two specimen cards under one family bracket; "deadly" is a plate that slams on
      const xc = page(t, 10.15, null);
      if (Math.abs(xc) < W) { ctx.save(); ctx.translate(xc, 0);
        const pl = pr(t, 10.3, .55, E.back), pn = pr(t, 10.48, .55, E.back), dq = clamp((t - tDeadly + .04) / .2), hit = clamp((t - tDeadly - .1) / .5);
        const br = pr(t, tCous - .12, .45, E.io);
        if (br > 0) { ctx.strokeStyle = C.ink; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.beginPath(); ctx.moveTo(540 - 250 * br, 414); ctx.lineTo(540 + 250 * br, 414); ctx.stroke();
          if (br >= 1) [290, 790].forEach(x => { const d = pr(t, tCous + .33, .2, E.out3) * 56; ctx.beginPath(); ctx.moveTo(x, 414); ctx.lineTo(x, 414 + d); ctx.stroke(); });
          note('cousins', 540, 394, { size: 104, c: C.red2 }, clamp((t - tCous + .06) / .3)); }
        if (pl > 0) at(290, 925, pl, -.022, () => { specimen('tomato', t); tag('TOMATO', 0, 342, { size: 68, bg: C.tomato, c: C.cream, sq: 1 }, clamp((t - 10.5) / .3)); });
        if (pn > 0) at(790 + Math.sin(hit * 30) * 9 * (1 - hit) * (hit > 0), 925, pn * (1 + .05 * Math.sin(Math.PI * clamp(hit * 1.4))), .022, () => specimen('night', t));
        at(790, 1265, 1, 0, () => ticks(14, 250, 330, C.tomato, 10, hit));
        if (dq > 0) at(790, 1265, 2.3 - 1.3 * E.out5(dq), -.045, deadly, clamp(dq * 3));
        ctx.restore(); }
    },
  };
})());
