// hero_gl.js — the WebGL shader that used to live here is retired: the hero is drawn on the 2D canvas in the film's
// own inks (see s_hero.js). film.html still loads this file, so it carries the one thing the hero and the close
// share: how a bead of oil is printed. No WebGL, no HERO_READY (main.js awaits it only if defined).
'use strict';
const HOIL = (function () {
  const RIM = 'rgba(104,28,10,.92)', DULL = [176, 90, 24], AMB = [240, 164, 40], LIT = [255, 228, 138];
  const ink = (lum, lit) => 'rgb(' + DULL.map((v, i) => Math.round(lerp(lerp(v, AMB[i], lum), LIT[i], lit))).join(',') + ')';
  // A bead of oil as a small printed lens: a dark rim (heavier on the side the light comes from), an amber body,
  // the light it gathers on its far inner edge, and one small highlight. No shadow: it lies in the sauce, not on it.
  // r = radius in local units, px = the same radius in screen pixels (picks the level of detail),
  // lum 0..1 = dull to full amber, lit 0..1 = the light is on it now, glint 0..1 = a four-point flash
  function bead(x, y, r, px, lum, lit, glint) {
    if (r <= 0) return;
    circle(x, y, r, RIM);
    const bx = x + r * .05, by = y + r * .06;
    circle(bx, by, r * .8, ink(lum, lit));
    if (px > 4.2) {
      ctx.save(); ctx.globalAlpha *= clamp(.3 + .45 * lum + .3 * lit); ctx.strokeStyle = lit > .5 ? '#FFF3C6' : '#FFD67C'; ctx.lineCap = 'round'; ctx.lineWidth = r * .17;
      ctx.beginPath(); ctx.arc(bx, by, r * .5, .15, 1.45); ctx.stroke(); ctx.restore();
    }
    const hr = Math.max(r * (.17 + .1 * lit), .85 * r / px);
    ctx.save(); ctx.globalAlpha *= clamp(.45 + .5 * lum + lit); circle(x - r * .3, y - r * .32, hr, lit > .3 || lum > .7 ? '#FFFFFF' : C.cream); ctx.restore();
    if (glint > .03) at(x - r * .3, y - r * .32, 1, .2, () => sparkle((r + 4.4 * r / px) * (.45 + 1.1 * glint), '#FFFFFF'), clamp(glint * 1.7));
  }
  return { bead };
})();
