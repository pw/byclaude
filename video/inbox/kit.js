/* kit.js — the shared phone for every @smallbusinessinbox film. Plain JS; load it AFTER common.js.
   Every film in the account must look like the same phone: use these pieces, don't restyle them.
   If you need something the kit lacks, define it in your own film.html (don't edit this file).

  SETUP (in <name>/film.html)
    <style>
      @font-face { font-family: IS;  src: url('../../motion/fonts/InstrumentSerif-Regular.ttf'); }
      @font-face { font-family: ISI; src: url('../../motion/fonts/InstrumentSerif-Italic.ttf'); }
      @font-face { font-family: Inter; src: url('../../motion/fonts/Inter.ttf'); font-weight: 100 900; }
      html, body { margin: 0; background: #000; } canvas { display: block; }
    </style>
    <canvas id="c" width="1080" height="1920"></canvas>
    <script src="../../motion/common.js"></script>
    <script src="../kit.js"></script>

  STRINGS. Declare every on-screen string in `const ON_SCREEN = ["..."];` then `const S = K.say(ON_SCREEN);`
    and pass text as S("hi!! quick question") — S throws if a string is not declared, so the reviewed list
    and the picture can't drift. (The kit itself draws no words; it only draws what you hand it.)

  CONVERSATION — thread + compose box, driven by a script of steps (times in seconds):
    const convo = K.conversation([
      { t: 0.6, stamp: S("11:48 PM") },           // centred timestamp between bubbles
      { t: 0.8, in: S("hi!! quick question") },    // incoming bubble; emits 'notif' (silent: true mutes)
      { gap: 1.2, in: S("how much are...") },      // gap = seconds after the PREVIOUS step ends (default 0.6)
      { gap: 1.0, type: S("Hi Kayla! So"), cps: 24 }, // typed char by char into the compose box ('tap' events)
      { gap: 0.9, del: "all", cps: 30 },           // backspace from the END (n chars or "all"; 'del' events)
      { gap: 0.4, send: true },                    // compose text rises into the thread as an outgoing bubble
      { gap: 1.0, seen: S("Seen 11:52 PM") },      // small line under the last outgoing bubble (latest only)
      { gap: 0.5, out: S("text") },                // outgoing bubble with no typing (emits 'send')
      { gap: 0.5, dots: 1.5 },                     // incoming typing dots for 1.5 s, then they go
      { t: -1, in: S("happy birthday!!"), dim: 0.35 }, // history: present from the start, faded
    ]);
    convo.at[i]   resolved start time of step i        convo.end   when the last step finishes
    convo.events  [{t,k}] sound events — concat them into window.ready's events
    convo.draw(t, { placeholder: S("Message"), alpha, scroll, cursorFrom }) -> { composerTop, text }
      Typing speed has human jitter and pauses after punctuation; hesitate with a `gap` (the cursor blinks).

  OTHER PIECES
    K.ground(a, col)                      fill the warm off-black ground (call first every frame)
    K.statusBar(t, { clock, battery, alpha })  clock = "7:02 AM" or a track [[t0,"11:48 PM"],[t,"11:49 PM",dur,spin],...]
                                          (each change ROLLS like an odometer; spin = extra reel turns, e.g. 6 for
                                          a night passing). battery = 0..1 or a function of t (below 0.2 = accent).
    K.header({ name, alpha })             back chevron, initial avatar, name, divider (thread view)
    K.threadList(t, { title, badge, rows: [{ t, name, preview, time, unread }], scroll, alpha, highlight: {i, amt} })
    K.banner(t, { t0, t1, name, text, label, y })   notification card (slides in at t0, out at t1)
    K.bigClock(t, track, { y, size, alpha })        lock-screen clock in Instrument Serif, same track format
    K.caption(t, text, t0, t1, y, { size, color, rise, font })   small centred type that rises and fades
    K.endCard(t, t0, { handle, note })              last ~3 s; returns its alpha (dim your scene with it)
    K.bubble(side, K.layout(text), x, y, alpha)     one bubble anywhere ('in' x = left edge, 'out' x = right edge)
    K.rollText(from, to, p, x, y, size, color, align, spin, family, weight)
    K.accent([r,g,b])  this film's ONE accent (cursor, send button, unread dots, low battery)
    K.C palette · K.L layout (text x 60-1020, status ~y152, header to y318, compose bottom y1560)
    await K.ready()  inside window.ready before returning cues.
*/
const K = (() => {
  const C = {
    bg: [21, 18, 16], raise: [36, 32, 28], ink: [238, 229, 213], dim: [158, 147, 132], faint: [100, 91, 82],
    inBub: [48, 43, 39], inInk: [238, 229, 213], outBub: [229, 216, 194], outInk: [36, 30, 26],
    line: [56, 50, 45], accent: [214, 134, 100],
  };
  const L = { x0: 60, x1: 1020, statusY: 152, headerY: 252, headerBot: 318, composerBot: 1560,
              font: 46, lineH: 60, padX: 30, padY: 20, maxBubble: 800, cFont: 44, cLineH: 58 };
  const F = (w, s, fam = 'Inter') => `${w} ${s}px ${fam}`;
  const eo = x => 1 - Math.pow(1 - clamp(x), 3);
  const circle = (x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill(); };

  function say(list) { return s => { if (!list.includes(s)) throw new Error('not in ON_SCREEN: ' + s); return s; }; }
  function accent(c) { C.accent = c; }
  function ground(a = 1, col = C.bg) { g.fillStyle = rgba(col, a); g.fillRect(0, 0, W, H); }

  // ---------- rolling text (odometer) ----------
  const isD = c => c >= '0' && c <= '9';
  function rollText(from, to, p, x, y, size, color, align = 'left', spin = 0, fam = 'Inter', weight = 600) {
    const n = Math.max(from.length, to.length); from = from.padStart(n); to = to.padStart(n);
    g.font = F(weight, size, fam); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = color;
    const e = p >= 1 ? 1 : ss(0, 1, p), dw = g.measureText('0').width;
    const nd = [...to].filter((c, i) => isD(c) || isD(from[i])).length;
    const slots = []; let di = 0, total = 0;
    for (let i = 0; i < n; i++) {
      const a = from[i], b = to[i]; let strip = [a];
      if (a !== b) {
        if (isD(a) && isD(b)) {
          const extra = Math.round(spin * (nd > 1 ? di / (nd - 1) : 1)), steps = ((+b - +a + 10) % 10) + 10 * extra;
          strip = []; for (let s = 0; s <= steps; s++) strip.push(String((+a + s) % 10));
        } else strip = [a, b];
      }
      if (isD(a) || isD(b)) di++;
      const wa = isD(a) ? dw : g.measureText(a).width, wb = isD(b) ? dw : g.measureText(b).width, w = lerp(wa, wb, e);
      slots.push({ strip, w }); total += w;
    }
    let cx = align === 'left' ? x : align === 'right' ? x - total : x - total / 2;
    const step = size * 1.05;
    for (const s of slots) {
      const o = e * (s.strip.length - 1), k = Math.floor(o), f = o - k;
      g.save(); g.beginPath(); g.rect(cx - 2, y - size * 0.62, s.w + 4, size * 1.24); g.clip();
      const base = g.globalAlpha;
      g.globalAlpha = base * (1 - f); g.fillText(s.strip[k], cx + s.w / 2, y - f * step);
      if (f > 0 && s.strip[k + 1] != null) { g.globalAlpha = base * f; g.fillText(s.strip[k + 1], cx + s.w / 2, y + (1 - f) * step); }
      g.globalAlpha = base; g.restore(); cx += s.w;
    }
    return total;
  }
  function clockState(track, t) {
    if (typeof track === 'string') return { from: track, to: track, p: 1, spin: 0 };
    let st = { from: track[0][1], to: track[0][1], p: 1, spin: 0 };
    for (let i = 1; i < track.length; i++) {
      const [t0, s, dur = 0.5, spin = 0] = track[i];
      if (t < t0) break;
      st = { from: track[i - 1][1], to: s, p: clamp((t - t0) / dur), spin };
    }
    return st;
  }

  // ---------- status bar / header ----------
  function statusBar(t, o = {}) {
    const a = o.alpha ?? 1; if (a <= 0) return;
    const cs = clockState(o.clock ?? '', t);
    g.globalAlpha = a; rollText(cs.from, cs.to, cs.p, L.x0 + 10, L.statusY, 34, rgba(C.ink, 1), 'left', cs.spin); g.globalAlpha = 1;
    const lvl = clamp(typeof o.battery === 'function' ? o.battery(t) : (o.battery ?? 0.8));
    const bx = L.x1 - 72, by = L.statusY - 15;
    g.strokeStyle = rgba(C.ink, 0.75 * a); g.lineWidth = 2.5; g.beginPath(); g.roundRect(bx, by, 62, 30, 9); g.stroke();
    g.fillStyle = rgba(C.ink, 0.75 * a); g.beginPath(); g.roundRect(bx + 64, by + 9, 5, 12, 2); g.fill();
    g.fillStyle = rgba(lvl < 0.2 ? C.accent : C.ink, a); g.beginPath(); g.roundRect(bx + 5, by + 5, Math.max(4, 52 * lvl), 20, 5); g.fill();
    for (let k = 0; k < 4; k++) { g.fillStyle = rgba(C.ink, (k < 3 ? 0.9 : 0.35) * a); g.beginPath(); g.roundRect(bx - 78 + k * 14, L.statusY + 13 - (10 + k * 6), 9, 10 + k * 6, 2); g.fill(); }
  }
  function header(o) {
    const a = o.alpha ?? 1, y = L.headerY; if (a <= 0) return;
    g.strokeStyle = rgba(C.ink, 0.85 * a); g.lineWidth = 5; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(94, y - 20); g.lineTo(74, y); g.lineTo(94, y + 20); g.stroke();
    g.fillStyle = rgba(mix(C.raise, C.accent, 0.3), a); circle(170, y, 38);
    g.fillStyle = rgba(C.ink, a); g.font = F(600, 36); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(o.name[0], 170, y + 2);
    g.font = F(600, 40); g.textAlign = 'left'; g.fillText(o.name, 228, y + 1);
    g.fillStyle = rgba(C.line, a); g.fillRect(0, L.headerBot, W, 2);
  }

  // ---------- bubbles ----------
  function layout(text, maxw = L.maxBubble) {
    g.font = F(400, L.font); const lines = wrapText(text, maxw - 2 * L.padX);
    return { lines, w: Math.max(...lines.map(s => g.measureText(s).width)) + 2 * L.padX, h: lines.length * L.lineH + 2 * L.padY };
  }
  function bubble(side, lay, x, y, a = 1, tail = true) {
    const bx = side === 'in' ? x : x - lay.w, R = 34, r = tail ? 10 : R;
    g.fillStyle = rgba(side === 'in' ? C.inBub : C.outBub, a);
    g.beginPath(); g.roundRect(bx, y, lay.w, lay.h, side === 'in' ? [R, R, R, r] : [R, R, r, R]); g.fill();
    g.fillStyle = rgba(side === 'in' ? C.inInk : C.outInk, a); g.font = F(400, L.font); g.textAlign = 'left'; g.textBaseline = 'middle';
    lay.lines.forEach((s, i) => g.fillText(s, bx + L.padX, y + L.padY + L.lineH * (i + 0.52)));
  }
  function dotsBubble(x, y, t, a) {
    g.fillStyle = rgba(C.inBub, a); g.beginPath(); g.roundRect(x, y, 140, 100, [34, 34, 34, 10]); g.fill();
    for (let k = 0; k < 3; k++) { const b = Math.max(0, Math.sin(t * 7 - k * 0.9)); g.fillStyle = rgba(C.dim, a * (0.5 + 0.5 * b)); circle(x + 40 + k * 30, y + 50 - 7 * b, 9); }
  }

  // ---------- conversation ----------
  function conversation(steps) {
    const items = [], snaps = [{ t: -1e9, text: '' }], events = [], at = [];
    const r = rng(7); let T = 0, text = '', cursorFrom = 1e9;
    for (const s of steps) {
      const t0 = s.t ?? (T + (s.gap ?? 0.6)); at.push(t0); let end = t0;
      if (s.stamp != null) items.push({ kind: 'stamp', text: s.stamp, t: t0 });
      else if (s.in != null) { items.push({ kind: 'in', text: s.in, t: t0, dim: s.dim ?? 1 }); if (!s.silent && t0 >= 0) events.push({ t: t0, k: 'notif' }); }
      else if (s.out != null) { items.push({ kind: 'out', text: s.out, t: t0, dim: s.dim ?? 1 }); if (!s.silent && t0 >= 0) events.push({ t: t0, k: 'send' }); }
      else if (s.seen != null) items.push({ kind: 'seen', text: s.seen, t: t0 });
      else if (s.dots) { items.push({ kind: 'dots', t: t0, t1: t0 + s.dots }); end = t0 + s.dots; }
      else if (s.type != null) {
        const cps = s.cps ?? 16; let tt = t0; cursorFrom = Math.min(cursorFrom, t0 - 0.5);
        for (let i = 0; i < s.type.length; i++) {
          const ch = s.type[i]; text += ch;
          tt += (1 / cps) * (0.55 + 0.9 * r()) + (ch === ' ' ? 0.03 : 0) + (/[,.!?]/.test(ch) ? 0.16 : 0);
          snaps.push({ t: tt, text }); if (i % 2 === 0) events.push({ t: tt, k: 'tap', gain: 0.8 + 0.4 * r() });
        }
        end = tt;
      } else if (s.del != null) {
        const n = s.del === 'all' ? text.length : Math.min(s.del, text.length), cps = s.cps ?? 18; let tt = t0;
        for (let i = 0; i < n; i++) {
          tt += (1 / cps) * lerp(1.7, 0.55, Math.min(1, i / 14)); text = text.slice(0, -1);
          snaps.push({ t: tt, text }); if (i % 2 === 0) events.push({ t: tt, k: 'del' });
        }
        end = tt;
      } else if (s.send) { items.push({ kind: 'out', text, t: t0, sent: true, dim: 1 }); text = ''; snaps.push({ t: t0, text: '' }); events.push({ t: t0, k: 'send' }); }
      T = end;
    }
    items.sort((a, b) => a.t - b.t);
    items.forEach((it, i) => {   // gaps and tails from the neighbours
      const prev = items[i - 1], next = items[i + 1];
      it.gap = !prev ? 0 : it.kind === 'seen' ? 10 : it.kind === 'stamp' ? 44 : prev.kind === 'stamp' ? 22
        : (prev.kind === it.kind || (prev.kind === 'dots' && it.kind === 'in') || (prev.kind === 'in' && it.kind === 'dots')) ? 12 : 32;
      it.tail = !next || next.kind !== it.kind;
    });
    const seens = items.filter(i => i.kind === 'seen');
    seens.forEach((s, i) => s.gone = seens[i + 1] ? seens[i + 1].t : 1e9);
    let measured = false;
    function measure() {
      for (const it of items) {
        if (it.kind === 'in' || it.kind === 'out') { it.lay = layout(it.text); it.h = it.lay.h; }
        else if (it.kind === 'dots') it.h = 100; else it.h = 40;
      }
      measured = true;
    }
    function snapAt(t) { let lo = 0, hi = snaps.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (snaps[m].t <= t) lo = m; else hi = m - 1; } return snaps[lo]; }
    function drawThread(t, bottom, top, a) {
      g.save(); g.beginPath(); g.rect(0, top, W, bottom + 60 - top); g.clip();
      let y = bottom;
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i]; if (it.t > t) continue;
        const p = it.t < 0 ? 1 : eo((t - it.t) / 0.34);
        let grow = p;
        if (it.kind === 'seen' && t > it.gone) grow = 1 - eo((t - it.gone) / 0.3);
        if (it.kind === 'dots' && t > it.t1) grow = 1 - eo((t - it.t1) / 0.25);
        if (grow <= 0.002) continue;
        const bot = y, top_ = bot - it.h, al = a * Math.min(p, grow) * (it.dim ?? 1);
        if (top_ < top - 200) break;
        if (it.kind === 'in') bubble('in', it.lay, L.x0 - (1 - p) * 30, top_ + (1 - p) * 24, al, it.tail);
        else if (it.kind === 'out') bubble('out', it.lay, L.x1, top_ + (1 - p) * (it.sent ? 90 : 30), al, it.tail);
        else if (it.kind === 'dots') dotsBubble(L.x0, top_, t, al);
        else {
          g.font = F(500, 30); g.textBaseline = 'middle'; g.fillStyle = rgba(C.dim, al);
          g.textAlign = it.kind === 'seen' ? 'right' : 'center'; g.fillText(it.text, it.kind === 'seen' ? L.x1 - 10 : CX, top_ + 20);
        }
        y = top_ - it.gap * grow;
      }
      g.restore();
      const fg = g.createLinearGradient(0, top, 0, top + 80); fg.addColorStop(0, rgba(C.bg, a)); fg.addColorStop(1, rgba(C.bg, 0));
      g.fillStyle = fg; g.fillRect(0, top, W, 80);
    }
    function draw(t, o = {}) {
      if (!measured) measure();
      const a = o.alpha ?? 1, cur = snapAt(t);
      g.font = F(400, L.cFont); const maxw = L.x1 - L.x0 - 40 - 110;
      const lines = (cur.text ? wrapText(cur.text, maxw) : ['']).slice(-7);
      const ch = Math.max(100, lines.length * L.cLineH + 42), cTop = L.composerBot - ch;
      drawThread(t, cTop - 28 + (o.scroll ?? 0), o.top ?? (L.headerBot + 2), a);
      g.fillStyle = rgba(C.raise, a); g.strokeStyle = rgba(C.line, a); g.lineWidth = 2;
      g.beginPath(); g.roundRect(L.x0, cTop, L.x1 - L.x0, ch, 50); g.fill(); g.stroke();
      g.font = F(400, L.cFont); g.textAlign = 'left'; g.textBaseline = 'middle';
      const tx = L.x0 + 38, ly = i => cTop + 21 + L.cLineH * (i + 0.52);
      if (!cur.text && o.placeholder) { g.fillStyle = rgba(C.faint, a); g.fillText(o.placeholder, tx + 8, ly(0)); }
      g.fillStyle = rgba(C.ink, a); lines.forEach((s, i) => g.fillText(s, tx, ly(i)));
      const since = t - cur.t;
      if (t >= (o.cursorFrom ?? cursorFrom) && (since < 0.5 || Math.floor((since - 0.5) * 2.2) % 2 === 1)) {
        const cx = tx + (cur.text ? g.measureText(lines[lines.length - 1]).width + 3 : 0);
        g.fillStyle = rgba(C.accent, a); g.fillRect(cx, ly(lines.length - 1) - 25, 4, 50);
      }
      const sx = L.x1 - 56, sy = L.composerBot - 50;
      g.fillStyle = rgba(cur.text ? C.accent : C.line, a); circle(sx, sy, 36);
      g.strokeStyle = rgba(cur.text ? C.bg : C.faint, a); g.lineWidth = 5; g.lineCap = 'round'; g.lineJoin = 'round';
      g.beginPath(); g.moveTo(sx, sy + 15); g.lineTo(sx, sy - 15); g.moveTo(sx - 13, sy - 3); g.lineTo(sx, sy - 16); g.lineTo(sx + 13, sy - 3); g.stroke();
      return { composerTop: cTop, text: cur.text };
    }
    return { draw, events, at, end: T, items };
  }

  // ---------- list, banner, clock, captions, card ----------
  function truncate(s, maxw) { if (g.measureText(s).width <= maxw) return s; while (s && g.measureText(s + '…').width > maxw) s = s.slice(0, -1); return s.trimEnd() + '…'; }
  function threadList(t, o) {
    const a = o.alpha ?? 1; if (a <= 0) return;
    g.textBaseline = 'middle';
    if (o.title) { g.fillStyle = rgba(C.ink, a); g.font = F(600, 56); g.textAlign = 'left'; g.fillText(o.title, L.x0, L.headerY); }
    if (o.badge) {
      g.font = F(600, 30); const w = g.measureText(o.badge).width + 40;
      g.fillStyle = rgba(C.accent, a); g.beginPath(); g.roundRect(L.x1 - w, L.headerY - 26, w, 52, 26); g.fill();
      g.fillStyle = rgba(C.bg, a); g.textAlign = 'center'; g.fillText(o.badge, L.x1 - w / 2, L.headerY + 1);
    }
    g.fillStyle = rgba(C.line, a); g.fillRect(0, L.headerBot, W, 2);
    g.save(); g.beginPath(); g.rect(0, L.headerBot + 2, W, (o.bottom ?? 1580) - L.headerBot); g.clip();
    const RH = 158; let y = L.headerBot + 8 - (o.scroll ?? 0);
    o.rows.forEach((row, i) => {
      const p = row.t == null ? 1 : eo((t - row.t) / 0.3); if (p <= 0) { y += RH; return; }
      const al = a * p, dx = (1 - p) * 40;
      if (o.highlight && o.highlight.i === i) { g.fillStyle = rgba(C.raise, al * o.highlight.amt); g.fillRect(0, y, W, RH); }
      g.fillStyle = rgba(mix(C.raise, C.accent, 0.22), al); circle(L.x0 + 46 + dx, y + RH / 2, 44);
      g.fillStyle = rgba(C.ink, al); g.font = F(600, 38); g.textAlign = 'center'; g.fillText(row.name[0], L.x0 + 46 + dx, y + RH / 2 + 2);
      const nx = L.x0 + 122 + dx;
      g.textAlign = 'left'; g.font = F(600, 40); g.fillText(row.name, nx, y + 54);
      if (row.time) { g.textAlign = 'right'; g.font = F(400, 30); g.fillStyle = rgba(C.dim, al); g.fillText(row.time, L.x1 + dx, y + 54); }
      g.textAlign = 'left'; g.font = F(400, 38); g.fillStyle = rgba(row.unread ? C.ink : C.dim, al);
      g.fillText(truncate(row.preview, L.x1 - nx - 50), nx, y + 108);
      if (row.unread) { g.fillStyle = rgba(C.accent, al); circle(L.x1 - 12 + dx, y + 108, 11); }
      g.fillStyle = rgba(C.line, al * 0.8); g.fillRect(nx, y + RH - 1, L.x1 - nx + 60, 2);
      y += RH;
    });
    g.restore();
  }
  function banner(t, o) {
    const a = ss(o.t0, o.t0 + 0.3, t) * (1 - ss(o.t1, o.t1 + 0.35, t)) * (o.alpha ?? 1); if (a <= 0) return;
    const y = (o.y ?? 150) - (1 - eo((t - o.t0) / 0.45)) * 70;
    g.font = F(400, 40); const lines = wrapText(o.text, 760).slice(0, 2), h = 104 + lines.length * 52;
    g.fillStyle = rgba(C.raise, 0.97 * a); g.beginPath(); g.roundRect(L.x0, y, L.x1 - L.x0, h, 40); g.fill();
    g.strokeStyle = rgba(C.line, a); g.lineWidth = 2; g.stroke();
    const ix = L.x0 + 30, iy = y + 30;   // app glyph: a speech shape on the accent square
    g.fillStyle = rgba(C.accent, a); g.beginPath(); g.roundRect(ix, iy, 68, 68, 18); g.fill();
    g.fillStyle = rgba(C.bg, a); g.beginPath(); g.roundRect(ix + 14, iy + 16, 40, 28, 10); g.fill();
    g.beginPath(); g.moveTo(ix + 22, iy + 42); g.lineTo(ix + 18, iy + 54); g.lineTo(ix + 32, iy + 43); g.fill();
    g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillStyle = rgba(C.ink, a); g.font = F(600, 38); g.fillText(o.name, ix + 94, y + 56);
    if (o.label) { g.textAlign = 'right'; g.font = F(400, 28); g.fillStyle = rgba(C.dim, a); g.fillText(o.label, L.x1 - 34, y + 56); }
    g.textAlign = 'left'; g.font = F(400, 40); g.fillStyle = rgba(C.ink, 0.9 * a);
    lines.forEach((s, i) => g.fillText(s, ix + 94, y + 110 + i * 52));
  }
  function bigClock(t, track, o = {}) {
    const a = o.alpha ?? 1; if (a <= 0) return; const cs = clockState(track, t);
    g.globalAlpha = a; rollText(cs.from, cs.to, cs.p, CX, o.y ?? 560, o.size ?? 200, rgba(o.color ?? C.ink, 1), 'center', cs.spin, 'IS', 400);
    g.globalAlpha = 1;
  }
  function caption(t, text, t0, t1, y, o = {}) {
    const p = ss(t0, t0 + 0.7, t), a = p * (1 - ss(t1 - 0.4, t1, t)) * (o.alpha ?? 1); if (a <= 0) return;
    g.font = o.font ?? F(500, o.size ?? 38); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = rgba(o.color ?? C.ink, a);
    wrapText(text, 900).forEach((s, i) => g.fillText(s, CX, y + (1 - p) * (o.rise ?? 40) + i * (o.size ?? 38) * 1.3));
  }
  function endCard(t, t0, o) {
    const a = ss(t0, t0 + 0.8, t); if (a <= 0) return 0;
    ground(a); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = rgba(C.ink, ss(t0 + 0.3, t0 + 1.1, t)); g.font = F(400, 92, 'IS'); g.fillText(o.handle, CX, 880);
    g.fillStyle = rgba(C.dim, ss(t0 + 0.7, t0 + 1.5, t)); g.font = F(400, 30); g.fillText(o.note, CX, 980);
    return a;
  }
  async function ready() {
    await FONTS_READY;
    await Promise.all(['400 46px Inter', '500 28px Inter', '600 40px Inter', '400 200px IS', '400 92px IS'].map(f => document.fonts.load(f)));
  }
  return { C, L, say, accent, ground, rollText, statusBar, header, layout, bubble, conversation, threadList, banner, bigClock, caption, endCard, ready };
})();
