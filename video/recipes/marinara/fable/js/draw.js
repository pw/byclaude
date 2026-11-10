// draw.js — shared cut-paper illustrations. All drawn around (0,0); place with at(x,y,scale,rot,fn).
'use strict';
// a flat tomato, r≈100, with cream highlight + halftone shade + green calyx
function tomato(r = 100, col = C.tomato, calyx = true) {
  ctx.save();
  ctx.beginPath(); ctx.ellipse(0, 0, r * 1.06, r * .94, 0, 0, TAU); ctx.fillStyle = col; ctx.fill();
  ctx.save(); ctx.clip(); ctx.fillStyle = halftone(C.red2, 12, 3.2); ctx.globalAlpha = .9;
  ctx.beginPath(); ctx.ellipse(r * .32, r * .34, r * 1.0, r * .86, 0, 0, TAU); ctx.rect(-2 * r, -2 * r, 4 * r, 4 * r); ctx.fill('evenodd');
  ctx.restore();
  ctx.beginPath(); ctx.ellipse(-r * .46, -r * .42, r * .2, r * .11, -.6, 0, TAU); ctx.fillStyle = 'rgba(251,244,230,.85)'; ctx.fill();
  if (calyx) { ctx.fillStyle = C.green; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .62; ctx.beginPath(); ctx.moveTo(0, -r * .8); ctx.quadraticCurveTo(Math.cos(a) * r * .34, -r * .8 + Math.sin(a) * r * .1 - r * .1, Math.cos(a) * r * .62, -r * .78 + Math.sin(a) * r * .3 + r * .14); ctx.quadraticCurveTo(Math.cos(a) * r * .2, -r * .7, 0, -r * .8); ctx.fill(); }
    ctx.strokeStyle = C.green; ctx.lineWidth = r * .1; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, -r * .8); ctx.quadraticCurveTo(r * .04, -r * 1.02, r * .16, -r * 1.12); ctx.stroke(); }
  ctx.restore();
}
function leaf(len = 80, wid = 34, col = C.green, vein = true) {
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(len * .25, -wid, len * .75, -wid * .8, len, 0); ctx.bezierCurveTo(len * .75, wid * .8, len * .25, wid, 0, 0); ctx.fillStyle = col; ctx.fill();
  if (vein) { ctx.strokeStyle = 'rgba(251,244,230,.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(len * .08, 0); ctx.lineTo(len * .86, 0); ctx.stroke(); }
}
// wooden spoon: bowl at (0,0), handle goes toward +x. len = handle length
function spoon(len = 420, col = '#C8894B', dark = '#9A6230') {
  ctx.save(); ctx.fillStyle = col;
  ctx.beginPath(); ctx.roundRect(30, -13, len, 26, 13); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, 0, 62, 46, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-4, 2, 44, 31, 0, 0, TAU); ctx.fillStyle = dark; ctx.globalAlpha = .55; ctx.fill();
  ctx.restore();
}
// sparkle (four-point star)
function sparkle(r, col = C.cream) {
  ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * TAU / 8, rr2 = i % 2 ? r * .22 : r; ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill();
}
// steam: three rising S-curves; t animates; p fades in
function steam(t, p = 1, col = 'rgba(251,244,230,.75)', h = 170, lw = 9) {
  if (p <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
  for (let i = -1; i <= 1; i++) { const ph = (t * .45 + i * .37 + 10) % 1; ctx.globalAlpha = p * Math.sin(ph * Math.PI) * .9;
    const y0 = -ph * h * .6, x0 = i * 54; ctx.beginPath(); ctx.moveTo(x0, y0);
    ctx.bezierCurveTo(x0 + 26, y0 - h * .25, x0 - 26, y0 - h * .5, x0 + 8, y0 - h * .8); ctx.stroke(); }
  ctx.restore();
}
// pour stream from (x0,y0) down to (x1,y1), width w, progress p in / q out (both 0..1)
function stream(x0, y0, x1, y1, w, col, p, q = 0) {
  if (p <= 0 || q >= 1) return; const ya = lerp(y0, y1, q), yb = lerp(y0, y1, p);
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath();
  ctx.moveTo(lerp(x0, x1, q * q), ya); ctx.quadraticCurveTo(lerp(x0, x1, .15), lerp(ya, yb, .5), lerp(x0, x1, p * p), yb); ctx.stroke(); ctx.restore();
}
// a food can, 3/4 view. w≈200,h≈270. label text baked (checked copy)
function can(lid = 0) {
  const w = 210, h = 280, ry = 26; ctx.save();
  ctx.fillStyle = C.steel; ctx.beginPath(); ctx.ellipse(0, h / 2, w / 2, ry, 0, 0, TAU); ctx.fill();
  ctx.fillRect(-w / 2, -h / 2, w, h);
  rr(-w / 2, -h / 2 + 34, w, h - 68, 0, C.tomato);
  ctx.fillStyle = halftone(C.red2, 12, 3); ctx.fillRect(w * .12, -h / 2 + 34, w * .38, h - 68);
  rr(-w / 2, -h / 2 + 34, w, 14, 0, C.gold); rr(-w / 2, h / 2 - 48, w, 14, 0, C.gold);
  ctx.fillStyle = C.cream; ctx.beginPath(); ctx.ellipse(0, -8, 78, 60, 0, 0, TAU); ctx.fill();
  at(0, -34, .3, 0, () => tomato(100));
  txt('TOMATO SAUCE', 0, 16, { f: 'Bar', w: 700, size: 24, c: C.red2, ls: 1 });
  txt('15 OZ', 0, 84, { f: 'Bar', w: 700, size: 30, c: C.cream, ls: 3 });
  ctx.fillStyle = '#B4BABF'; ctx.beginPath(); ctx.ellipse(0, -h / 2, w / 2, ry, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = lid > 0 ? C.red2 : '#9FA6AB'; ctx.beginPath(); ctx.ellipse(0, -h / 2, w / 2 - 14, ry - 7, 0, 0, TAU); ctx.fill();
  ctx.restore();
}
// bottle: kind 'wine' | 'oil'. neck up at -y; ~ 110 wide, 380 tall
function bottle(kind) {
  ctx.save(); const wine = kind === 'wine', body = wine ? '#3B4A2E' : '#6E7F2E', liquid = wine ? '#7A1F2B' : C.gold;
  ctx.fillStyle = body; ctx.beginPath();
  if (wine) { ctx.moveTo(-22, -190); ctx.lineTo(22, -190); ctx.lineTo(22, -90); ctx.bezierCurveTo(22, -50, 58, -40, 58, 10); ctx.lineTo(58, 176); ctx.quadraticCurveTo(58, 190, 44, 190); ctx.lineTo(-44, 190); ctx.quadraticCurveTo(-58, 190, -58, 176); ctx.lineTo(-58, 10); ctx.bezierCurveTo(-58, -40, -22, -50, -22, -90); }
  else { ctx.moveTo(-18, -190); ctx.lineTo(18, -190); ctx.lineTo(18, -120); ctx.bezierCurveTo(18, -90, 52, -84, 52, -40); ctx.lineTo(52, 176); ctx.quadraticCurveTo(52, 190, 40, 190); ctx.lineTo(-40, 190); ctx.quadraticCurveTo(-52, 190, -52, 176); ctx.lineTo(-52, -40); ctx.bezierCurveTo(-52, -84, -18, -90, -18, -120); }
  ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); ctx.fillStyle = liquid; ctx.globalAlpha = wine ? .0 : .85; ctx.fillRect(-70, -30, 140, 240);
  ctx.globalAlpha = .22; ctx.fillStyle = C.cream; ctx.fillRect(-46, -200, 14, 400); ctx.restore();
  rr(wine ? -42 : -38, 30, wine ? 84 : 76, 96, 6, C.cream);
  if (wine) { ctx.fillStyle = '#7A1F2B'; circle(0, 78, 22, '#7A1F2B'); } else at(-22, 92, .55, -.5, () => leaf(80, 30, C.green, false));
  rr(wine ? -24 : -20, -204, wine ? 48 : 40, 30, 5, wine ? '#7A1F2B' : C.ink);
  ctx.restore();
}
// spice jar with cap; label = checked caps string
function jar(label, capCol = C.ink, glass = '#E9DFC9', fillCol = '#D9B77A') {
  ctx.save(); rr(-62, -80, 124, 190, 22, glass); ctx.save(); ctx.clip(); ctx.fillStyle = fillCol; ctx.fillRect(-70, -10, 140, 130); ctx.restore();
  rr(-66, -128, 132, 58, 12, capCol);
  ctx.fillStyle = 'rgba(251,244,230,.5)'; for (let i = -2; i <= 2; i++) ctx.fillRect(i * 22 - 3, -120, 6, 42);
  rr(-52, -24, 104, 70, 6, C.cream); txt(label, 0, 24, { f: 'Bar', w: 700, size: 36, c: C.ink, ls: 2 });
  ctx.restore();
}
// particles falling from (0,0): n flecks, spread, progress p; col
function flecks(n, p, seed, col, spread = 120, fall = 300, size = 7) {
  if (p <= 0) return; const r = rng(seed); ctx.fillStyle = col;
  for (let i = 0; i < n; i++) { const d = r() * .55, q = clamp((p - d) / .45); const x = (r() - .5) * spread * (1 + q * .4), y = E.in2(q) * fall * (.7 + r() * .5), rot = r() * 6 + q * 5, s = size * (.6 + r() * .8);
    if (q <= 0 || q >= 1) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillRect(-s, -s * .35, s * 2, s * .7); ctx.restore(); }
}
// sizzle / emphasis ticks radiating from origin
function ticks(n, r0, r1, col, lw, p, a0 = 0, span = TAU) {
  if (p <= 0 || p >= 1) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; const e = E.out3(p);
  for (let i = 0; i < n; i++) { const a = a0 + span * i / (span === TAU ? n : n - 1); ctx.beginPath(); ctx.moveTo(Math.cos(a) * lerp(r0, r1, e * .7), Math.sin(a) * lerp(r0, r1, e * .7)); ctx.lineTo(Math.cos(a) * lerp(r0, r1, e), Math.sin(a) * lerp(r0, r1, e)); ctx.globalAlpha = 1 - p * p; ctx.stroke(); }
  ctx.restore();
}
// a big X strike drawn on with p
function strike(r, col, lw, p) {
  stroke([[-r, -r], [r, r]], col, lw, clamp(p * 2)); stroke([[r, -r], [-r, r]], col, lw, clamp(p * 2 - 1));
}
// chapter flag: small caps between two rules, top of frame. p in 0..1
function chapter(s, y, col, p, bgc) {
  os(s); if (p <= 0) return; const o = { f: 'Bar', w: 700, size: 46, ls: 10, c: col, raw: 1 }, w = measure(s, o), e = E.out5(clamp(p));
  ctx.save(); ctx.globalAlpha = clamp(p * 2.5); ctx.fillStyle = col;
  ctx.fillRect(W / 2 - w / 2 - 30 - 150 * e, y - 18, 150 * e, 5); ctx.fillRect(W / 2 + w / 2 + 30, y - 18, 150 * e, 5);
  ctx.beginPath(); ctx.rect(W / 2 - w / 2 - 10, y - 60, (w + 20) * e, 80); ctx.clip(); txt(s, W / 2, y, o); ctx.restore();
}
