// Shared pieces for byclaude motion-design films (forked 2026-09-26 from FeelBetterBot's Loop common.js;
// the FBB-specific typingPill/replyBlock/endCard were REMOVED — they say FeelBetterBot things). Original header:
// Shared pieces for the FeelBetterBot "Loop" films. Each film is a canvas drawn by window.render(t),
// deterministic in t, rendered frame by frame by render_film.py. The reply is always a verbatim excerpt of
// a real FeelBetterBot reply, revealed word by word in sync with the Ara voice lines.
const W = 1080, H = 1920, CX = 540;
const cv = document.getElementById('c'), g = cv.getContext('2d');
const P = window.PARAMS || { lines: [{ text: 'placeholder line', dur: 3 }] };

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const mix = (c1, c2, t) => c1.map((v, i) => Math.round(lerp(v, c2[i], t)));
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

const NAVY = [9, 13, 28], NAVY2 = [18, 26, 50], PEACH = [244, 178, 132], GOLD = [255, 214, 160];
const COOL = [168, 182, 214], CREAM = [250, 240, 224], AMBER = [255, 190, 110];

// schedule the voice lines after REPLY_AT; returns the VO start times
function scheduleVO(replyAt, gaps) {
  const at = []; let t = replyAt + 0.2;
  P.lines.forEach((L, i) => { at.push(t); t += L.dur + (gaps?.[i] ?? 0.6); });
  return { at, end: t };
}

// the opening: the person's own message, typed (verbatim from the scripted user turn)
function typedLine(text, t, t0, t1, y, size = 58, fadeAt = 1e9, maxw = 900) {
  const a = 1 - ss(fadeAt, fadeAt + 0.8, t);
  if (a <= 0 || t < t0 - 0.2) return;
  g.font = `${size}px ISI`; g.textAlign = 'center'; g.textBaseline = 'middle';
  const n = Math.floor(text.length * ss(t0, t1, t) + 0.0001);
  const rows = wrapText(text.slice(0, n), maxw); const full = wrapText(text, maxw);
  let yy = y - (full.length - 1) * size * 0.6;
  rows.forEach((r, i) => {
    g.fillStyle = rgba(CREAM, 0.95 * a); g.fillText(r, CX, yy);
    if (i === rows.length - 1 && t < t1 + 0.6 && Math.floor(t * 2.4) % 2 === 0) {
      const w = g.measureText(r).width; g.fillRect(CX + w / 2 + 6, yy - size / 2, 3, size);
    }
    yy += size * 1.2;
  });
}
function wrapText(text, maxw) {
  const words = text.split(' '), out = []; let cur = '';
  for (const w of words) { const tr = cur ? cur + ' ' + w : w; if (cur && g.measureText(tr).width > maxw) { out.push(cur); cur = w; } else cur = tr; }
  if (cur || !out.length) out.push(cur); return out;
}

// reply block: lines revealed word by word with the voice. last line may be `big` (gold italic question)
// end card. `dark` = cream text on a dark ground; otherwise ink on a light ground
function grain(t) {
  const r = rng(Math.floor(t * 30) + 11); g.fillStyle = 'rgba(255,255,255,0.025)';
  for (let k = 0; k < 900; k++) g.fillRect(r() * W, r() * H, 2, 2);
}

function clockText(str, a, y = 250, col = COOL) {
  if (a <= 0) return;
  g.font = '300 38px Inter'; g.textAlign = 'center'; g.fillStyle = rgba(col, a); g.fillText(str, CX, y);
}

// dawn-ish vertical gradient; d in 0..1
function nightSky(d, horizonY = 1180) {
  const top = mix(NAVY, [38, 52, 96], d), mid = mix(NAVY2, [120, 118, 160], d), low = mix(NAVY2, PEACH, d);
  const grd = g.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, rgba(top, 1)); grd.addColorStop(0.55, rgba(mid, 1)); grd.addColorStop(0.72, rgba(low, 1));
  grd.addColorStop(1, rgba(mix(NAVY, [70, 52, 70], d), 1));
  g.fillStyle = grd; g.fillRect(0, 0, W, H);
  if (d > 0) {
    const rg = g.createRadialGradient(CX, horizonY + 40, 10, CX, horizonY + 40, 900);
    rg.addColorStop(0, rgba(GOLD, 0.75 * d)); rg.addColorStop(0.35, rgba(PEACH, 0.35 * d)); rg.addColorStop(1, rgba(PEACH, 0));
    g.fillStyle = rg; g.fillRect(0, 0, W, H);
  }
}
function vignette(strength) {
  const vg = g.createRadialGradient(CX, 900, 200, CX, 900, 1150);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,0,${strength})`);
  g.fillStyle = vg; g.fillRect(0, 0, W, H);
}
const FONTS_READY = Promise.all(['58px ISI', '56px IS', '70px ISI', '300 38px Inter', '600 26px Inter', '500 40px Inter'].map(f => document.fonts.load(f)));

// lead-in: the opening line gets its own clock; the rest of the film runs O seconds later
function shiftInfo(info, O) {
  const sh = v => typeof v === 'number' ? v + O : Array.isArray(v) ? v.map(sh) : v;
  const cues = {}; for (const k in info.cues) cues[k] = sh(info.cues[k]);
  return { ...info, total: info.total + O, VO: info.VO.map(x => x + O), cues, leadIn: O };
}
