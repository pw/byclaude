// main.js — timeline, transitions, cues, harness contract.
'use strict';
const SCENES = (window.SCENE_LIST || []).sort((a, b) => a.t0 - b.t0);
const TOTAL = PARAMS.total || 89.991;
SCENES.forEach((s, i) => { s.t1 = SCENES[i + 1] ? SCENES[i + 1].t0 : TOTAL + 1; });
function drawScene(s, t) { ctx.save(); s.draw(t); ctx.restore(); }
window.render = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, W, H);
  let i = SCENES.findIndex(s => t >= s.t0 && t < s.t1); if (i < 0) i = SCENES.length - 1;
  const s = SCENES[i], prev = SCENES[i - 1], d = s.tdur || .5, k = (t - s.t0) / d;
  if (prev && k < 1 && s.tin !== 'cut') {
    drawScene(prev, t);
    if (s.tin === 'push') { // new scene rises from below, old one already drawn underneath
      const e = E.io(k); ctx.save(); ctx.beginPath(); ctx.rect(0, H * (1 - e), W, H * e); ctx.clip(); ctx.translate(0, H * (1 - e) * .25); drawScene(s, t); ctx.restore();
      ctx.fillStyle = s.ring || C.ink; ctx.fillRect(0, H * (1 - e) - 10, W, 10);
    } else { // iris: a circle opens from the scene's focal point
      const [cx, cy] = s.iris || [W / 2, 800], R = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) + 40, r = E.io(k) * R;
      ctx.save(); circle(cx, cy, r + 26 * (1 - k)); ctx.fillStyle = s.ring || C.ink; ctx.fill();
      circle(cx, cy, r); ctx.clip(); drawScene(s, t); ctx.restore();
    }
  } else drawScene(s, t);
  if (!s.noGrain) grain(t, s.grain === undefined ? .2 : s.grain);
  drawCaptions(t);
};
window.ready = fontsReady.then(async () => {
  if (window.HERO_READY) await window.HERO_READY;
  const cues = []; SCENES.forEach(s => (s.cues || []).forEach(c => cues.push(c)));
  cues.sort((a, b) => a.t - b.t);
  return { total: TOTAL, cues, music: window.MUSIC || { heroAt: 72, heroEnd: 86.4, end: TOTAL } };
});
