// s_hero.js — L12: the signature move, drawn in the film's own inks (no shader).
// Plain simmering sauce → the oil pools at the rim, a thin translucent film → the spoon laps the rim once and the
// oil trails behind it in marbled streaks → the streaks wind into the middle, thin, neck and break into beads →
// the sauce dims, and one slow pass of light crosses the beads in the silent hold before the close.
'use strict';
window.MUSIC = { heroAt: 72.0, heroEnd: 86.4, end: 89.991 };
(window.SCENE_LIST = window.SCENE_LIST || []).push((function () {
  const T0 = 72.2, tPool = 73.55, tSweep = 78.14, tSwirl = 80.3, tBreak = 81.25, tDim = 83.3, tLight = 84.45, dLight = 1.85;
  const A0 = .85, TW = .9 * TAU, RJ = [262, 228, 198], WJ = [22, 15, 11], S0 = [0, .06, .14], PL = [.24, .42, .6], NK = [34, 29, 25];
  const SAUCE = '#BC2D20', LA = .9, LC = Math.cos(LA), LS = Math.sin(LA);   // LA: the way the light travels, corner to corner
  const PIV = [1500, 1420];   // the handle leaves the frame above the caption line
  // one gesture: the spoon is set down, the lap gathers speed from rest and never brakes, and the turn inward
  // starts at the speed the lap ended on (4.8 rad/s either side of the join), then eases into the middle
  const lapE = x => Math.pow(x, 1.6), swE = x => lerp(x, E.out2(x), .6);
  // the pan settles a little lower (room for the header and the note above it), then pushes in for the beads with
  // its lower rim held above the caption line, so the caption always sits on dark ground
  function cam(t) {
    const d = pr(t, T0 + .1, 2.3, E.io2), z = pr(t, 81.4, 2.3, E.io), hold = Math.max(0, t - 83.7);
    return { R: 450 - 18 * d + 168 * z + hold * 9, cx: 540, cy: 830 + 60 * d - 176 * z };
  }
  // a point on streak j at s (0 tail .. 1 head, the head is at the spoon); sp winds it into the middle.
  // The tail peels off the rim, where the oil was; raw = the spoon's own track, without the peel
  function rib(j, s, sp, raw) {
    const peel = raw ? 0 : 1 - E.io2(clamp((s - S0[j]) / PL[j]));
    const rc = lerp(RJ[j], 290, peel) + 4 * Math.sin(s * TAU * 3 + j * 2.1) * (1 - sp);
    const th = A0 + s * TAU + sp * (j * TAU / 3 + TW * s), r = rc * (1 - sp * .9 * Math.pow(s, 1.3));
    return [r * Math.cos(th), r * Math.sin(th)];
  }
  // width of a streak: it swells and thins along its length, tapers to a point at both ends, narrows as it winds
  // inward, and from tBreak it necks at regular intervals and pinches off (middle first, where it is thinnest)
  function ribW(j, s, sp, s1, t) {
    const swell = Math.pow(.5 + .5 * Math.sin(s * TAU * (3.2 + j * 1.6) + j * 1.9), 1.4);
    let w = WJ[j] * (.24 + .96 * swell) * (1 - .66 * sp * Math.pow(s, 1.4));
    w *= E.out2(clamp((s - S0[j]) / .16)) * E.out2(clamp((s1 - s) / lerp(.03, .13, sp)));
    const b = clamp((t - tBreak - (1 - s) * 1.15) / .55);
    if (b > 0) w *= clamp(1 - b * 2.6 * (.5 + .5 * Math.sin(s * TAU * NK[j] + j * 2))) * (1 - b * b);
    return w;
  }
  // the inks of a streak, laid over each other so the red shows through and the ambers marble:
  // [offset across the streak, share of its width, weave, weave frequency, phase, ink, breaks per turn (0 = unbroken)]
  const STR = [
    [0, 1, 0, 0, 0, 'rgba(244,170,38,.54)', 0],            // the body
    [.2, .5, .22, 2.3, 0, 'rgba(198,96,14,.36)', 0],       // a deeper vein
    [-.2, .26, .2, 3.1, 2, 'rgba(255,220,132,.62)', 0],    // a pale vein
    [.95, .13, .22, 1.7, 4, 'rgba(246,180,60,.5)', 9],     // hairlines either side, broken
    [-1, .1, .2, 2.1, 1, 'rgba(246,180,60,.46)', 7],
  ];
  function strand(j, s0, s1, sp, f, t) {
    s0 = Math.max(s0, S0[j]); if (s1 - s0 < .004) return;
    const n = Math.max(8, Math.ceil((s1 - s0) * 320)), P = [];
    for (let i = 0; i <= n; i++) {
      const s = lerp(s0, s1, i / n), p = rib(j, s, sp), q = rib(j, s + .003, sp);
      let nx = p[1] - q[1], ny = q[0] - p[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      const w = ribW(j, s, sp, s1, t), o = w * (f[0] + f[2] * Math.sin(s * TAU * f[3] + f[4] + j * 1.3));
      const h = w * f[1] * .5 * (f[6] ? clamp((Math.sin(s * TAU * f[6] + f[4] + j) + .35) * 2.5) : 1);
      P.push([p[0] + nx * (o + h), p[1] + ny * (o + h), p[0] + nx * (o - h), p[1] + ny * (o - h)]);
    }
    ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
    for (let i = n; i >= 0; i--) ctx.lineTo(P[i][2], P[i][3]);
    ctx.closePath(); ctx.fillStyle = f[5]; ctx.fill();
  }
  // the beads the streaks break into: strung along the three arms, more where an arm is long, never overlapping
  const BEADS = (function () {
    const r = rng(77), out = [];
    [150, 112, 84].forEach((n, j) => {
      for (let i = 0; i < n * 5 && out.filter(b => b.j === j).length < n; i++) {
        const s = lerp(S0[j] + .02, .985, r()); if (r() > .22 + .78 * (1 - .9 * Math.pow(s, 1.3))) continue;
        const big = Math.pow(r(), 2.2), rad = (2.1 + big * 5.9) * (1 - .1 * j), sprd = (WJ[j] * .7 + 9) * (1 - .4 * big);
        const jx = (r() + r() - 1) * sprd, jy = (r() + r() - 1) * sprd, q = rib(j, s, 1), x = q[0] + jx, y = q[1] + jy;
        const fr = rad * (.6 + .4 * Math.hypot(q[0], q[1]) / 260);
        if (Math.hypot(x, y) > 287 - fr || out.some(b => Math.hypot(b.fx - x, b.fy - y) < (b.fr + fr) * 1.18 + .8)) continue;
        out.push({ j, s, r: rad, jx, jy, fx: x, fy: y, fr, d: r(), h: r(), h2: r() });
      }
    });
    return out;
  })();
  // width of the pooled oil at angle th: uneven, broken in places; it gathers at its fattest stretches first (g),
  // and the spoon takes it as it laps (sw), pushing a small swell ahead of the bowl
  function bandW(th, t, g, sw) {
    let w = Math.max(0, 12 + 7.5 * Math.sin(2 * th + .6) + 5 * Math.sin(5 * th + 2.3) + 2.2 * Math.sin(9 * th - t * .7) + 1.4 * Math.sin(14 * th + 1 + t * .45) - (1 - g) * 30);
    if (sw > 0) {
      const rel = (((th - A0) % TAU) + TAU) % TAU / TAU, d = rel - sw;
      w = w * clamp(d / .03) + (d > -.015 ? 18 * Math.sqrt(sw) * (1 - pr(sw, .86, .14, E.lin)) * Math.exp(-Math.pow((d - .03) / .035, 2)) : 0);
      if (sw >= 1) w = 0;
    }
    return w;
  }
  function surface(t, c, sw, sp, L) {
    const k = c.R / 300, a = pr(t, T0 + .15, 1.3, E.io);
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 296, 0, TAU); ctx.clip(); ctx.globalAlpha = a;
    // deep red sauce, same print treatment as the pan before it
    ctx.fillStyle = SAUCE; ctx.fillRect(-300, -300, 600, 600); ctx.fillStyle = halftone(C.red3, 13, 3.5); ctx.fillRect(-300, -300, 600, 600);
    circle(-40, -40, 280, SAUCE);
    // the stir marks from the recipe settle out; what is left is a plain simmer: small bubbles rise and open
    const arcA = .75 * (1 - pr(t, T0 + .2, 1.5, E.io));
    if (arcA > 0) { ctx.save(); ctx.globalAlpha = a * arcA; ctx.strokeStyle = '#E25A48'; ctx.lineWidth = 15; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(0, 0, 80 + i * 66, t * .6 + i * 2.1, t * .6 + i * 2.1 + 1.5); ctx.stroke(); } ctx.restore(); }
    const sim = 1 - pr(t, tSweep - .2, .9, E.lin);
    if (sim > 0) {
      ctx.save(); ctx.strokeStyle = '#DE604B'; ctx.lineWidth = 2.6;
      for (let i = 0; i < 16; i++) {
        const v = t * .85 + hash(i * 3.7), cyc = Math.floor(v), ph = v - cyc, an = hash(i * 13.1 + cyc * 7.7) * TAU, rd = Math.sqrt(hash(i * 5.3 + cyc * 3.1)) * 232;
        ctx.globalAlpha = a * sim * .8 * Math.pow(1 - ph, .7) * clamp(ph * 8); circle(rd * Math.cos(an), rd * Math.sin(an), 2.5 + 9 * E.out2(ph)); ctx.stroke();
      }
      ctx.restore();
    }
    // the grooves the swirl leaves in the sauce: a fine lit line with a shade line beside it
    const gv = pr(t, tBreak + .3, 1.5, E.lin);
    if (gv > 0) {
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      [['rgba(110,20,16,.5)', 2.4, 2.4, .32], ['#D94E3D', 3, 0, .5]].forEach(g => {
        ctx.strokeStyle = g[0]; ctx.lineWidth = g[1]; ctx.globalAlpha = a * gv * g[3];
        for (let j = 0; j < 3; j++) { ctx.beginPath(); for (let i = 0; i <= 150; i++) { const q = rib(j, lerp(S0[j] + .04, 1, i / 150), sp); ctx.lineTo(q[0] + g[2], q[1] + g[2]); } ctx.stroke(); }
      });
      ctx.restore();
    }
    // herbs ride the swirl
    PAN.herbs.forEach((g, i) => {
      const r = Math.hypot(g[0], g[1]), tw = sp * 1.5 * Math.pow(1 - r / 300, .7), th = Math.atan2(g[1], g[0]) + tw;
      at(r * Math.cos(th), r * Math.sin(th), g[3], g[2] + tw, () => leaf(20, 8, i % 3 ? C.leaf : C.green, false));
    });
    // the oil pools at the rim: a thin clear film, amber over the red, deeper where it lies against the pan
    const g = pr(t, tPool, 2.5, E.io2);
    if (g > 0 && sw < 1) {
      const N = 240, Wd = [];
      for (let i = 0; i <= N; i++) Wd.push(bandW(i / N * TAU, t, g, sw));
      const film = (f, ink) => {
        ctx.beginPath(); ctx.arc(0, 0, 300, 0, TAU);
        for (let i = 0; i <= N; i++) { const th = i / N * TAU, r = 296 - Wd[i] * f; ctx[i ? 'lineTo' : 'moveTo'](r * Math.cos(th), r * Math.sin(th)); }
        ctx.closePath(); ctx.fillStyle = ink; ctx.fill('evenodd');
      };
      film(1, 'rgba(250,184,48,.58)'); film(.5, 'rgba(208,106,16,.3)');
      ctx.save(); ctx.globalAlpha = a * .3; film(1, halftone('#FFDC8C', 8, 1.5)); ctx.restore();
      // its inner edge catches a little light
      ctx.strokeStyle = 'rgba(255,224,150,.8)'; ctx.lineWidth = 1.8; ctx.lineJoin = 'round'; ctx.beginPath();
      for (let i = 0, pen = 0; i <= N; i++) { if (Wd[i] > 1.2) { const th = i / N * TAU, r = 296 - Wd[i]; ctx[pen ? 'lineTo' : 'moveTo'](r * Math.cos(th), r * Math.sin(th)); pen = 1; } else pen = 0; }
      ctx.stroke();
      // "see the oil": one highlight runs once round the film, from the arrow's tip, and dims where the film is thin
      const gl = env(t, 75.35, 77.75, .25, .35, E.lin);
      if (gl > 0) {
        const ga = -2.3 + E.io2(clamp((t - 75.35) / 2.4)) * 4.9, wAt = th => Wd[Math.round(((th % TAU) + TAU) % TAU / TAU * N)];
        ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = C.cream;
        for (let i = 0; i < 14; i++) {
          const th = ga - .5 + i * .5 / 14, w0 = wAt(th), w1 = wAt(th + .5 / 14); if (w0 < 3 || w1 < 3) continue;
          ctx.globalAlpha = a * gl * (.25 + .7 * i / 13); ctx.lineWidth = Math.min(5, w0 * .36) * (.35 + .65 * i / 13);
          ctx.beginPath(); ctx.moveTo((296 - w0 * .55) * Math.cos(th), (296 - w0 * .55) * Math.sin(th)); ctx.lineTo((296 - w1 * .55) * Math.cos(th + .5 / 14), (296 - w1 * .55) * Math.sin(th + .5 / 14)); ctx.stroke();
        }
        const wh = wAt(ga); if (wh >= 3) at((296 - wh * .55) * Math.cos(ga), (296 - wh * .55) * Math.sin(ga), 1, t * 1.5, () => sparkle(7 + Math.min(8, wh * .45), '#FFFFFF'), a * gl);
        ctx.restore();
      }
    }
    // the wake: the oil the spoon takes trails behind it as marbled streaks, then winds inward
    if (sw > 0 && t < tBreak + 1.8) for (let j = 0; j < 3; j++) STR.forEach(f => strand(j, 0, sw, sp, f, t));
    // the sauce dims a little before the light comes
    const dk = pr(t, tDim, 1.1, E.io);
    if (dk > 0) { ctx.fillStyle = `rgba(44,4,8,${.23 * dk})`; ctx.fillRect(-300, -300, 600, 600); }
    // the pass of light: one warm bar, corner to corner. Printed, not glowing: a flat core, halftone feathering
    const bx = (L.u - (c.cx * LC + c.cy * LS)) / k;
    if (L.e > 0) {
      ctx.save(); ctx.rotate(LA);
      ctx.globalAlpha = a * L.e * .6; ctx.fillStyle = halftone('#EE6A50', 10, 3); ctx.fillRect(bx - 112, -400, 224, 800);
      ctx.globalAlpha = a * L.e * .36; ctx.fillStyle = '#E4573F'; ctx.fillRect(bx - 60, -400, 120, 800);
      ctx.globalAlpha = a * L.e * .26; ctx.fillStyle = '#FFB898'; ctx.fillRect(bx - 13, -400, 26, 800); ctx.restore();
    }
    // the beads: amber as they form, duller as the sauce dims, lit as the light crosses and brighter ever after.
    // Four in ten flash a four-point glint as the bar reaches them, each a touch early or late; one in ten keeps
    // twinkling until the cut
    BEADS.forEach(b => {
      const tb = tBreak + (1 - b.s) * 1.15 + .14 + b.d * .3, p = pr(t, tb, .32, E.back);
      if (p <= 0) return;
      const q = rib(b.j, b.s, sp), m = .35 + .65 * pr(t, tb, 1.3, E.out3), sc = .6 + .4 * Math.hypot(q[0], q[1]) / 260;
      const x = q[0] + b.jx * m, y = q[1] + b.jy * m, r = b.r * sc * p;
      const u = (c.cx + x * k) * LC + (c.cy + y * k) * LS, passed = t < tLight ? 0 : clamp((L.u - u) / 170 + .35);
      const lit = L.e > 0 ? L.e * Math.exp(-Math.pow((u - L.u) / 190, 2)) : 0;
      let gl = 0;
      if (b.h < .42 && L.e > 0) gl = L.e * Math.exp(-Math.pow((u + (b.h2 - .5) * 150 - L.u) / 85, 2)) * (.55 + .45 * Math.min(1, b.r / 5));
      if (b.h > .9 - .26 * clamp((b.r - 3) / 4)) gl = Math.max(gl, passed * .85 * Math.pow(Math.max(0, Math.sin(t * 3.3 + b.h2 * 40)), 14));
      HOIL.bead(x, y, r, r * k, lerp(1 - .62 * dk, .8, passed), lit, gl);
    });
    ctx.restore();
    // the steel of the rim answers as the bar goes over it
    if (L.e > 0) {
      ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 334, 0, TAU); ctx.arc(0, 0, 300, 0, TAU); ctx.clip('evenodd');
      ctx.rotate(LA); ctx.globalAlpha = L.e * .2; ctx.fillStyle = C.cream; ctx.fillRect(bx - 34, -400, 68, 800); ctx.restore();
    }
  }
  return {
    id: 'hero', t0: T0, tin: 'cut',
    cues: [{ t: 72.35, k: 'shimmer', gain: .55 }, { t: 72.5, k: 'pop', gain: .8 }, { t: 75.35, k: 'shimmer', gain: .8 }, { t: 77.95, k: 'swish', gain: .5 },
      { t: 78.25, k: 'stir' }, { t: 79.3, k: 'stir', gain: .8 }, { t: 80.4, k: 'stir' }, { t: 81.45, k: 'whoosh', gain: .4 },
      { t: 81.7, k: 'pop', gain: .3 }, { t: 82.15, k: 'pop', gain: .35 }, { t: 82.6, k: 'pop', gain: .3 }, { t: 84.5, k: 'shimmer' }, { t: 85.4, k: 'ding', gain: .9 }],
    draw(t) {
      bg(C.ink, t, C.ink2);
      const c = cam(t), k = c.R / 300;
      const sw = lapE(clamp((t - tSweep - .06) / 2.1)), sp = swE(clamp((t - tSwirl) / 1.85));
      const lx = clamp((t - tLight) / dLight), L = { e: env(t, tLight, tLight + dLight, .25, .3, E.lin), u: lerp(40, 1790, lerp(lx, E.io2(lx), .25)) };
      at(c.cx, c.cy, k, 0, () => { panFlat(t); surface(t, c, sw, sp, L); });
      // the spoon: its bowl leads the streaks, the handle runs off toward the cook; it lifts away still moving
      const sIn = pr(t, tSweep - .32, .42, E.out3), sOut = pr(t, 81.8, .5, E.in2);
      if (sIn > 0 && sOut < 1) {
        const q = rib(0, sw, sp, 1), far = lerp(1.9, 1, sIn);
        const bx = c.cx + q[0] * k * far + sOut * 150, by = c.cy + q[1] * k * far + sOut * 110;
        const d = Math.hypot(PIV[0] - bx, PIV[1] - by), sc = 1.32 + sOut * .5;
        at(bx, by, sc, Math.atan2(PIV[1] - by, PIV[0] - bx), () => shadow(() => spoon(d / sc + 80, '#C8894B', '#8A5326'), 14 + sOut * 40, 0, 'rgba(20,6,4,.35)'), 1 - sOut);
      }
      // labels (off in nine frames as the beads start and the camera pushes in, so the payoff and its hold stay clean)
      const ui = 1 - pr(t, 81.6, .3, E.lin);
      if (ui > 0) {
        ctx.save(); ctx.globalAlpha = ui;
        tag('THE SIGNATURE MOVE', 540, 246, { size: 58, bg: C.gold, c: C.ink, ls: 6 }, pr(t, 72.46, .35, E.lin));
        const ol = env(t, 75.3, 77.8, .45, .3, E.lin);
        if (ol > 0) {
          at(150, 420, 1, -.09, () => note('olive oil', 0, 0, { size: 82, c: C.gold }, ol));
          const tip = [c.cx + Math.cos(-2.5) * c.R * .93, c.cy + Math.sin(-2.5) * c.R * .93];
          stroke([[104, 450], [84, 548], tip], C.gold, 7, pr(t, 75.6, .45, E.out3));
          if (t > 76.0) { const ah = Math.atan2(tip[1] - 548, tip[0] - 84); [-.55, .55].forEach(o => stroke([[tip[0] - 30 * Math.cos(ah + o), tip[1] - 30 * Math.sin(ah + o)], tip], C.gold, 7, 1)); }
        }
        const n1 = env(t, tSweep - .05, tSwirl - .1, .4, .2, E.lin), n2 = pr(t, tSwirl - .02, .4, E.lin);
        if (n1 > 0 && n2 <= 0) note('sweep the edge', 540, 368, { size: 84, c: C.cream }, n1);
        if (n2 > 0) note('swirl to the middle', 540, 368, { size: 84, c: C.cream }, n2);
        ctx.restore();
      }
    }
  };
})());
