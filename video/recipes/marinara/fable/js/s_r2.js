// s_r2.js — L10: Recipe 2 title. Dark ground: the light is coming. The knife gets hung up for the day.
'use strict';
function mixc(a, b, k) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b);
  return 'rgb(' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(k)))).join(',') + ')';
}
// chef's knife hanging by the hole in its handle (origin = the hole), blade pointing down
function r2Knife() {
  ctx.beginPath(); ctx.moveTo(-26, 150); ctx.lineTo(-26, 420); ctx.quadraticCurveTo(-22, 440, -10, 432); ctx.quadraticCurveTo(52, 330, 58, 150); ctx.closePath();
  ctx.fillStyle = '#D5D9DC'; ctx.fill();
  ctx.save(); ctx.clip(); ctx.fillStyle = halftone('#9AA1A6', 11, 2.6); ctx.fillRect(10, 140, 60, 300); ctx.restore();
  ctx.strokeStyle = '#F4F6F7'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-18, 160); ctx.lineTo(-18, 404); ctx.stroke();
  rr(-30, 132, 92, 24, 6, '#8E9499');
  rr(-28, -34, 60, 172, 26, '#2B2725'); ctx.strokeStyle = '#6B645F'; ctx.lineWidth = 4; ctx.stroke();
  circle(2, 52, 7, C.gold); circle(2, 100, 7, C.gold);
  circle(0, 0, 13, C.ink); ctx.strokeStyle = C.gold; ctx.lineWidth = 5; ctx.stroke();
}
function r2Board() {
  rr(-120, 40, 240, 330, 34, '#C8894B'); ctx.save(); ctx.clip();
  ctx.strokeStyle = '#9A6230'; ctx.lineWidth = 5; ctx.globalAlpha = .55;
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-130, 96 + i * 62); ctx.bezierCurveTo(-40, 76 + i * 62, 40, 120 + i * 62, 130, 92 + i * 62); ctx.stroke(); }
  ctx.restore();
  rr(-34, -30, 68, 96, 26, '#C8894B'); circle(0, 0, 13, C.ink);
}
(window.SCENE_LIST = window.SCENE_LIST || []).push((function () {
  const tHang = 60.1, tEven = 59.67;
  return {
    id: 'r2title', t0: 58.6, iris: [540, 600], ring: C.gold, tdur: .55,   // the iris opens on the title itself
    capOff: [[58.8, 60.2]],   // "Recipe two is even better," is on the card: RECIPE 2 + even better
    cues: [{ t: 58.6, k: 'whoosh' }, { t: 58.66, k: 'pop' }, { t: 58.8, k: 'swish', gain: .7 }, { t: 58.94, k: 'pop', gain: .7 }, { t: tEven, k: 'swish', gain: .6 },
      { t: tHang - .28, k: 'whoosh', gain: .5 }, { t: tHang, k: 'ding', gain: .8 }, { t: tHang + .14, k: 'pop', gain: .8 }],
    draw(t) {
      bg(C.ink, t, C.ink2);
      // the card never sits still: a slow push-in for the whole beat
      const push = 1 + .03 * pr(t, 58.6, 3.5, E.lin); ctx.translate(540, 900); ctx.scale(push, push); ctx.translate(-540, -900);
      // gold label border, like the front of a tin: full frame, there from the first frame
      ctx.strokeStyle = C.gold; ctx.lineWidth = 6; rr(56, 150, 968, 1620, 44); ctx.stroke(); ctx.lineWidth = 2; rr(74, 168, 932, 1584, 32); ctx.stroke();
      // the title is in as the iris opens (it settles under the opening circle), not a second later
      tag('RECIPE 2', 540, 322, { size: 66, bg: C.gold, c: C.ink, ls: 8 });
      letters('No-Chop', 540, 548, { f: 'Fr', w: 900, size: 190, c: C.cream, mis: C.red2 }, t - 58.5, .02, .34);
      letters('Skillet', 540, 720, { f: 'FrI', w: 800, size: 190, c: C.gold }, t - 58.58, .02, .34);
      const np = pr(t, tEven - .05, .45, E.lin);
      if (np > 0) at(540, 836, 1, -.03, () => { const w = note('even better', 0, 0, { size: 96, c: C.cream }, np); stroke([[-w / 2, 26], [0, 40], [w / 2, 20]], C.tomato, 8, pr(t, tEven + .3, .35, E.io)); });
      // the rack
      const rp = pr(t, 58.6, .5, E.out5);
      if (rp > 0) {
        ctx.save(); ctx.globalAlpha = clamp(rp * 2); ctx.translate(0, 52 + (1 - rp) * 80);
        shadow(() => rr(230, 846, 620, 30, 15, '#7A4A2A'), 8);
        const sw = t > tHang ? .5 * Math.exp(-1.6 * (t - tHang)) * Math.sin(7 * (t - tHang)) : 0;
        const bs = (t > 58.72 ? .16 * Math.exp(-1.5 * (t - 58.72)) * Math.sin(6.5 * (t - 58.72)) : 0) + (t > tHang ? .1 * Math.exp(-1.2 * (t - tHang)) * Math.sin(6 * (t - tHang) + 1) : 0);
        const peg = env(t, 59.4, tHang, .25, .1); if (peg > 0) at(690, 868, 1, 0, () => ticks(8, 22, 22 + 34 * peg, C.gold, 5, ((t - 59.4) * 1.6) % 1));
        at(390, 878, .77, bs, () => shadow(r2Board, 10));
        const kp = pr(t, tHang - .3, .3, E.in2);
        if (kp > 0) at(690 + (1 - kp) * 560, 878, .75, sw - (1 - kp) * .6, () => { shadow(r2Knife, 10); const g = pr(t, 60.9, .55, E.io); if (g > 0 && g < 1) at(-18, lerp(170, 400, g), Math.sin(g * Math.PI), g * 2, () => sparkle(44, C.cream)); }, clamp(kp * 3));
        circle(390, 868, 13, C.gold); circle(690, 868, 13, C.gold); circle(386, 864, 5, C.cream); circle(686, 864, 5, C.cream);
        ctx.restore();
      }
      // lands with the knife and holds for the whole of "and there's still nothing to chop"
      tag('THE KNIFE HAS THE DAY OFF', 540, 1322, { size: 50, bg: C.cream, c: C.ink, ls: 4, rot: -.02 }, pr(t, tHang + .1, .32, E.lin));
    }
  };
})());
