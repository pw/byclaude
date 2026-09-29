/* kit.js — shared pieces for the exam practice-question films (three FB Pages: adj / fpm / ww).
   Plain JS; load it AFTER common.js. Every film in the series should look like the same show: use these
   pieces, don't restyle them. Need something the kit lacks? Define it in your own film.html (don't edit this).

  SETUP (in <name>/film.html)
    <style>
      @font-face { font-family: Anton; src: url('../fonts/Anton-Regular.ttf'); }
      @font-face { font-family: Inter; src: url('../../motion/fonts/Inter.ttf'); font-weight: 100 900; }
      html, body { margin: 0; background: #000; } canvas { display: block; }
    </style>
    <canvas id="c" width="1080" height="1920"></canvas>
    <script src="../../motion/common.js"></script>
    <script src="../kit.js"></script>

  STRINGS. Declare every on-screen string in `const ON_SCREEN = ["..."];` (JSON, double quotes — check.py parses
    it), then `const S = EX.init(ON_SCREEN, 'adj');` ('adj' | 'fpm' | 'ww'). init() THROWS if the theme's
    end-card strings (EX.THEMES[theme].cta + .small + .handle) are not all in ON_SCREEN — copy them in verbatim.
    Every kit function draws only strings that pass S(); S throws on anything undeclared. Options are declared
    whole ("B) $75,000"); the kit splits off the letter itself. Ring digits: declare "5","4","3","2","1".

  THEME.  EX.T = the active theme: ground, card, line, text, dim, accent, onAccent ([r,g,b]); handle; cta; small.
    Ground = Page colour. Cream text. Accent is for the REVEAL only (right answer, the total) — not decoration.

  SCHEDULER — the reading rule (0.35 s per word on screen before anything else moves) + sound cues:
    const PLAN = EX.schedule([   // not `P`: common.js already declares P (and W, H, CX, g, cv)
      { id: 'hook', kind: 'hook', read: [S("ADJUSTER EXAM MATH"), S("CAN YOU GET THIS ONE?")], min: 2 },
      { id: 'q', kind: 'question', read: [Q], in: 0.8 },
      { id: 'oA', kind: 'option', read: [S("A) $50,000")], min: 0.9 },     // ...one beat per option
      { id: 'pause', kind: 'pause', min: 5 },                               // ticks each second, tension rises
      { id: 'reveal', kind: 'reveal', min: 1.6 },                           // bell
      { id: 'w1', kind: 'work', read: [...], min: 1.8 },                    // warm rises line by line
      { id: 'trap', kind: 'trap', read: [TRAP] },
      { id: 'end', kind: 'end', min: 4.5 },
    ], { start: 0.3, perWord: 0.35 });
    PLAN.at.q = { at, shown, end, words }   at = starts entering, shown = fully in (at + in), end = next may move.
    A beat holds max(min, words(read) * perWord) after it is shown; `gap` adds seconds before it; `in` = entry
    time (default 0.5). Count EVERY string that newly appears in that beat (numbers count as words).
    PLAN.total · PLAN.events (click per option, ticks per pause second, bell on reveal) · PLAN.tension · PLAN.warm
    -> window.ready returns { total: PLAN.total, events: PLAN.events, tension: PLAN.tension, warm: PLAN.warm }.

  PIECES (t = time now; every piece takes o.alpha (default 1) and o.dy (vertical offset) for choreography)
    EX.ground(a)                                    full-bleed Page colour (call first each frame)
    EX.kicker(t, S("PRACTICE QUESTION"), o)         top-left label, letterspaced Anton, y 205
    EX.hook(t, t0, t1, [S(..), S(..)], o)           big centred Anton lines; stagger in at t0, lift out at t1
    EX.card(t, t0, Q, { y, tag: S("example"), size }) question card, x 60-1020; money/number words set bold.
                                                    Returns the card's bottom y. Wraps; never shrinks (min 50 px).
    EX.options(t, [S("A) .."),..], { y, rowH, gap, at: [t per row], reveal, answer: 'B', hide }) -> [row centre ys]
                                                    arrive one by one; at `reveal` the right row fills with the
                                                    accent and gets a drawn tick, the others fade to 35%.
    EX.optionRow(t, s, x, y, w, h, state)           one row anywhere; state { arrive:0..1, lit:0..1, dim:0..1 }
                                                    (use it to carry the lit answer somewhere after the reveal).
    EX.ring(t, t0, dur, { x, y, r, label: S("PAUSE AND SOLVE IT") })   drawn countdown ring, digits from ON_SCREEN
    EX.line(t, t0, text, x, y, { size, weight, font, color, align, dur })   one line that writes on (wipe L->R)
    EX.ledger(t, rows, geom)                        worked arithmetic with aligned columns (below)
    EX.rule(t, t0, text, cite, { y, size })         concept answer: the rule in one sentence + its source cite
    EX.trap(t, t0, t1, S("THE TRAP"), text, { y })  the tempting wrong answer, with a drawn cross
    EX.endCard(t, t0)                               handle + cta + small disclaimers from the theme
    EX.num(str, x, y, size, align, color, weight)   tabular digits (every digit the width of '0') — use for ANY
                                                    number that sits in a column, so the columns line up.
    EX.tick(x, y, s, color, lw) · EX.cross(x, y, s, color, lw) · EX.arrow(x0, x1, y, color, lw, p)  drawn icons
    await EX.ready()                                inside window.ready, before returning cues.

  LEDGER — worked lines in columns: label | from (struck when capped) -> | op | to (right-aligned, tabular).
    geom = { y, x0: 80, xFrom: 560, xOp: 640, xTo: 1000, rowH: 92, size: 64 }
    rows = [ { head: S("INJURIES"), at },                        small caps heading at x0
             { at, label: S("person 1"), note: S("each-person cap"), from: S("30,000"), strike: true, to: S("25,000") },
             { at, op: S("+"), to: S("10,000") },
             { rule: true, at },                                  hairline across op..to
             { at, label: S("total"), op: S("="), to: S("75,000"), strong: true } ]   strong = accent, bigger
    Each row writes on from `at`: label/from fade in, the strike draws, the arrow draws, `to` wipes on.
    For formula films: { at, label: S("lb/day"), from: S("200 × 3.2 × 8.34"), op: S("="), to: S("5,337.6") } —
    set geom.xFrom so the expression fits (it is right-aligned there). Pass o.alpha to dim the whole ledger.
    Returns the y below the last row.
*/
const EX = (() => {
  const THEMES = {
    adj: { ground: [94, 26, 38], card: [116, 38, 52], line: [150, 72, 84], text: [234, 216, 192], dim: [200, 164, 152],
           accent: [236, 180, 84], onAccent: [70, 16, 26],
           handle: '@adjusterexamprep',
           cta: ['A free practice question every morning in our group.', 'Join from this Page.'],
           small: ['Unofficial. Not affiliated with any exam provider or regulator.', 'Rules vary by state.'] },
    fpm: { ground: [24, 56, 40], card: [36, 76, 56], line: [66, 106, 84], text: [244, 238, 226], dim: [176, 194, 180],
           accent: [240, 152, 16], onAccent: [20, 42, 30],
           handle: '@fpmexamprep',
           cta: ['A free practice question every morning in our group.', 'Join from this Page.'],
           small: ['Unofficial. Not affiliated with any exam provider or regulator.', 'Based on the FDA Food Code; your local code may differ.'] },
    ww:  { ground: [16, 40, 80], card: [28, 56, 104], line: [58, 88, 136], text: [244, 238, 226], dim: [170, 186, 210],
           accent: [168, 208, 232], onAccent: [12, 30, 62],
           handle: '@wastewaterexamprep',
           cta: ['A free practice question every morning in our group.', 'Join from this Page.'],
           small: ['Unofficial. Not affiliated with any exam provider or regulator.', "Check your state's exam and formula sheet."] },
  };
  let T = THEMES.adj, ON = null;
  const F = (w, s, fam = 'Inter') => `${w} ${s}px ${fam}`;
  const eo = x => 1 - Math.pow(1 - clamp(x), 3);          // ease-out cubic: gentle landings, no bounce
  const X0 = 60, X1 = 1020;
  const S = s => { if (!ON || !ON.includes(s)) throw new Error('not in ON_SCREEN: ' + s); return s; };
  const spacing = px => { if ('letterSpacing' in g) g.letterSpacing = px + 'px'; };
  const circle = (x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill(); };

  function init(onScreen, theme) {
    ON = onScreen; T = THEMES[theme]; if (!T) throw new Error('unknown theme ' + theme);
    const need = [T.handle, ...T.cta, ...T.small].filter(s => !ON.includes(s));
    if (need.length) throw new Error('ON_SCREEN is missing the theme strings: ' + JSON.stringify(need));
    return S;
  }
  const words = list => (list || []).join(' ').split(/\s+/).filter(Boolean).length;

  // ---------- scheduler ----------
  function schedule(beats, o = {}) {
    const wps = o.perWord ?? 0.35; let t = o.start ?? 0.3;
    const at = {}, list = [], events = [];
    for (const b of beats) {
      t += b.gap ?? 0;
      const inDur = b.in ?? 0.5, n = words(b.read);
      const hold = Math.max(b.min ?? 0, n * wps);
      const r = { id: b.id, kind: b.kind, at: t, shown: t + inDur, end: t + inDur + hold, words: n };
      if (b.kind === 'option') events.push({ t: t + inDur * 0.6, k: 'click' });
      if (b.kind === 'pause') for (let k = 0; k < Math.round(b.min ?? 5); k++) events.push({ t: r.shown + k, k: 'tick', gain: 0.8 });
      if (b.kind === 'reveal') events.push({ t: r.at, k: 'bell', gain: 0.8 });
      at[b.id] = r; list.push(r); t = r.end;
    }
    const total = t, first = k => list.find(r => r.kind === k), last = k => [...list].reverse().find(r => r.kind === k);
    const tension = [[0, 0.12]], warm = [[0, 0]];
    const q = first('question'), p = first('pause'), rv = first('reveal'), w0 = first('work'), w1 = last('work'), tr = first('trap'), en = first('end');
    if (q) tension.push([q.at, 0.3]);
    if (p) tension.push([p.at, 0.4], [p.end, 0.62]);
    if (rv) { tension.push([rv.at + 0.9, 0.04]); warm.push([rv.at, 0], [rv.at + 0.6, 0.18]); }
    if (w0 && w1) warm.push([w0.at, 0.2], [w1.end, 0.5]);
    if (tr) { tension.push([tr.at, 0.1], [tr.end, 0.04]); warm.push([tr.at, 0.34]); }
    if (en) warm.push([en.at, 0.36]);
    tension.push([total, 0]); warm.push([total, 0.12]);
    return { at, beats: list, total, events: events.sort((a, b) => a.t - b.t), tension, warm };
  }

  // ---------- basics ----------
  function ground(a = 1) { g.fillStyle = rgba(T.ground, a); g.fillRect(0, 0, W, H); }
  function kicker(t, text, o = {}) {
    const a = o.alpha ?? 1; if (a <= 0) return;
    g.font = F(400, 40, 'Anton'); g.textAlign = 'left'; g.textBaseline = 'middle'; spacing(7);
    g.fillStyle = rgba(T.text, 0.8 * a); g.fillText(S(text), X0 + 6, 205 + (o.dy ?? 0)); spacing(0);
    g.fillStyle = rgba(T.text, 0.5 * a); g.fillRect(X0 + 6, 240 + (o.dy ?? 0), 64, 4);
  }
  function hook(t, t0, t1, lines, o = {}) {
    const out = ss(t1, t1 + 0.6, t), base = (o.alpha ?? 1) * (1 - out); if (base <= 0 || t < t0) return;
    const size = o.size ?? 150; g.textAlign = 'center'; g.textBaseline = 'middle';
    // lay out every wrapped row first, then centre the whole block on o.y (first line big, the rest 62%)
    const rows = []; lines.forEach((s, i) => { const sz = i === 0 ? size : size * 0.62; g.font = F(400, sz, 'Anton');
      wrapText(S(s), 940).forEach((r, j) => rows.push({ r, i, sz, gapBefore: j === 0 && i > 0 ? size * 0.28 : 0 })); });
    const hTot = rows.reduce((a, r) => a + r.sz * 1.02 + r.gapBefore, 0);
    let y = (o.y ?? 860) - hTot / 2 - out * 120 + (o.dy ?? 0);
    for (const { r, i, sz, gapBefore } of rows) {
      y += gapBefore; const p = eo((t - t0 - i * 0.35) / 0.6);
      if (p > 0) { g.font = F(400, sz, 'Anton'); g.fillStyle = rgba(i === 0 ? T.text : T.dim, base * p); g.fillText(r, CX, y + sz * 0.51 + (1 - p) * 30); }
      y += sz * 1.02;
    }
  }

  // tabular numbers: digits in '0'-wide cells so right-aligned columns line up
  function num(str, x, y, size, align = 'right', color = rgba(T.text, 1), weight = 600, fam = 'Inter') {
    g.font = F(weight, size, fam); g.textBaseline = 'middle'; g.textAlign = 'center'; g.fillStyle = color;
    const dw = g.measureText('0').width, isD = c => c >= '0' && c <= '9';
    const ws = [...str].map(c => isD(c) ? dw : g.measureText(c).width), tot = ws.reduce((a, b) => a + b, 0);
    let cx = align === 'left' ? x : align === 'right' ? x - tot : x - tot / 2;
    [...str].forEach((c, i) => { g.fillText(c, cx + ws[i] / 2, y); cx += ws[i]; });
    return tot;
  }
  function numWidth(str, size, weight = 600, fam = 'Inter') {
    g.font = F(weight, size, fam); const dw = g.measureText('0').width;
    return [...str].reduce((a, c) => a + (c >= '0' && c <= '9' ? dw : g.measureText(c).width), 0);
  }
  // a wipe that writes text on left->right between x and x+w
  function wipe(p, x, y, w, h, fn) {
    if (p <= 0) return; g.save(); g.beginPath(); g.rect(x - 6, y - h / 2, (w + 12) * clamp(p), h); g.clip(); fn(); g.restore();
  }
  function line(t, t0, text, x, y, o = {}) {
    const p = eo((t - t0) / (o.dur ?? 0.5)), a = (o.alpha ?? 1) * clamp((t - t0) / 0.2); if (a <= 0) return;
    const size = o.size ?? 56; g.font = F(o.weight ?? 500, size, o.font ?? 'Inter'); g.textBaseline = 'middle';
    const w = g.measureText(o._sub ? text : S(text)).width, align = o.align ?? 'left';
    const lx = align === 'left' ? x : align === 'right' ? x - w : x - w / 2;
    wipe(p, lx, y + (o.dy ?? 0), w, size * 1.5, () => {
      g.textAlign = 'left'; g.fillStyle = rgba(o.color ?? T.text, a); g.fillText(text, lx, y + (o.dy ?? 0) + (1 - p) * 8);
    });
  }

  // ---------- icons (paths, never glyphs) ----------
  function tick(x, y, s, col, lw = 8) {
    g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(x - s * 0.5, y + s * 0.02); g.lineTo(x - s * 0.14, y + s * 0.36); g.lineTo(x + s * 0.52, y - s * 0.34); g.stroke();
  }
  function cross(x, y, s, col, lw = 8) {
    g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x - s / 2, y - s / 2); g.lineTo(x + s / 2, y + s / 2); g.moveTo(x + s / 2, y - s / 2); g.lineTo(x - s / 2, y + s / 2); g.stroke();
  }
  function arrow(x0, x1, y, col, lw = 5, p = 1) {
    if (p <= 0) return; const xe = lerp(x0, x1, clamp(p));
    g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(x0, y); g.lineTo(xe, y); g.stroke();
    if (p > 0.6) { const h = 14 * ss(0.6, 1, p); g.beginPath(); g.moveTo(xe - h, y - h); g.lineTo(xe, y); g.lineTo(xe - h, y + h); g.stroke(); }
  }

  // ---------- question card ----------
  const isFig = w => /[0-9$%]/.test(w);
  function cardLayout(text, size, maxw) {
    const out = []; let cur = [], cw = 0; const sp = (g.font = F(400, size), g.measureText(' ').width);
    for (const w of text.split(' ')) {
      g.font = F(isFig(w) ? 700 : 400, size); const ww = g.measureText(w).width;
      if (cur.length && cw + sp + ww > maxw) { out.push(cur); cur = []; cw = 0; }
      cur.push({ w, ww }); cw += (cur.length > 1 ? sp : 0) + ww;
    }
    if (cur.length) out.push(cur); return { lines: out, sp };
  }
  function card(t, t0, text, o = {}) {
    const size = Math.max(50, o.size ?? 52), lh = size * 1.36, pad = 50, y = (o.y ?? 290) + (o.dy ?? 0);
    const L = cardLayout(S(text), size, X1 - X0 - 2 * pad);
    const top = o.tag ? 92 : pad, h = top + L.lines.length * lh + pad - (lh - size) / 2;
    const p = eo((t - t0) / 0.6), a = (o.alpha ?? 1) * p; if (a <= 0) return y + h;
    g.fillStyle = rgba(T.card, a); g.beginPath(); g.roundRect(X0, y + (1 - p) * 24, X1 - X0, h, 30); g.fill();
    if (o.tag) {
      g.font = F(500, 32); const tw = g.measureText(S(o.tag)).width + 44;
      g.strokeStyle = rgba(T.dim, 0.9 * a); g.lineWidth = 2.5; g.beginPath(); g.roundRect(X1 - pad + 16 - tw, y + 30, tw, 52, 26); g.stroke();
      g.fillStyle = rgba(T.dim, a); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(o.tag, X1 - pad + 16 - tw / 2, y + 57);
    }
    g.textAlign = 'left'; g.textBaseline = 'middle';
    L.lines.forEach((ln, i) => {
      const lp = eo((t - t0 - 0.15 - i * 0.09) / 0.5); if (lp <= 0) return;
      let x = X0 + pad; const yy = y + top + i * lh + size * 0.55 + (1 - lp) * 14;
      for (const { w, ww } of ln) {
        g.font = F(isFig(w) ? 700 : 400, size); g.fillStyle = rgba(T.text, (isFig(w) ? 1 : 0.92) * a * lp);
        g.fillText(w, x, yy); x += ww + L.sp;
      }
    });
    return y + h;
  }

  // ---------- options ----------
  function optionRow(t, s, x, y, w, h, st = {}) {
    const ar = st.arrive ?? 1, lit = st.lit ?? 0, dim = st.dim ?? 0, a = (st.alpha ?? 1) * ar * (1 - 0.65 * dim);
    if (a <= 0) return; const dx = (1 - eo(ar)) * 46, letter = S(s)[0], body = s.replace(/^[A-D]\)\s*/, '');
    g.fillStyle = rgba(T.card, a * 0.9); g.beginPath(); g.roundRect(x + dx, y - h / 2, w, h, h / 2); g.fill();
    if (lit > 0) { g.save(); g.beginPath(); g.roundRect(x + dx, y - h / 2, w, h, h / 2); g.clip();
      g.fillStyle = rgba(T.accent, a); g.fillRect(x + dx, y - h / 2, w * eo(lit), h); g.restore(); }
    const ink = mix(T.text, T.onAccent, ss(0.3, 0.8, lit)), cx = x + dx + h / 2 + 4, r = h * 0.34;
    g.fillStyle = rgba(mix(T.ground, T.onAccent, lit), a); circle(cx, y, r);
    g.strokeStyle = rgba(mix(T.dim, T.onAccent, lit), a); g.lineWidth = 3; g.beginPath(); g.arc(cx, y, r, 0, 6.2832); g.stroke();
    g.fillStyle = rgba(mix(T.text, T.accent, lit), a); g.font = F(400, h * 0.44, 'Anton'); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(letter, cx, y + 2);
    g.fillStyle = rgba(ink, a); g.font = F(600, Math.max(46, h * 0.5)); g.textAlign = 'left'; g.fillText(body, cx + r + 30, y + 2);
    if (lit > 0.5) tick(x + dx + w - h * 0.62, y, h * 0.42, rgba(T.onAccent, a * ss(0.5, 1, lit)), 8);
  }
  function options(t, list, o = {}) {
    const rowH = o.rowH ?? 108, gap = o.gap ?? 22, y0 = (o.y ?? 900) + (o.dy ?? 0), ys = [];
    list.forEach((s, i) => {
      const y = y0 + i * (rowH + gap) + rowH / 2; ys.push(y);
      const right = o.answer && S(s)[0] === o.answer, rv = o.reveal ?? 1e9;
      if (o.hide && s[0] === o.hide) return;                 // e.g. while you carry the lit row elsewhere
      optionRow(t, s, X0, y, X1 - X0, rowH, {
        arrive: clamp((t - (o.at?.[i] ?? 0)) / 0.5), alpha: o.alpha ?? 1,
        lit: right ? clamp((t - rv) / 0.55) : 0, dim: right ? 0 : ss(rv, rv + 0.6, t),
      });
    });
    return ys;
  }

  // ---------- countdown ring ----------
  function ring(t, t0, dur, o = {}) {
    const a = (o.alpha ?? 1) * ss(t0 - 0.3, t0 + 0.2, t) * (1 - ss(t0 + dur, t0 + dur + 0.4, t)); if (a <= 0) return;
    const x = o.x ?? CX, y = (o.y ?? 1470) + (o.dy ?? 0), r = o.r ?? 74, left = clamp(1 - (t - t0) / dur);
    g.strokeStyle = rgba(T.line, a); g.lineWidth = 12; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.stroke();
    g.strokeStyle = rgba(T.text, a); g.lineCap = 'round'; g.beginPath(); g.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + 6.2832 * left); g.stroke();
    const n = Math.min(Math.ceil(dur), Math.max(1, Math.ceil(dur - (t - t0) - 1e-6))), fr = (t - t0) % 1;
    g.font = F(400, r * 1.15, 'Anton'); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = rgba(T.text, a * (t < t0 + dur ? 1 - 0.35 * ss(0.75, 1, fr) : 0)); g.fillText(S(String(n)), x, y + 4);
    if (o.label) { g.font = F(400, o.labelSize ?? 64, 'Anton'); spacing(3); g.textAlign = o.labelAlign ?? 'left';
      g.fillStyle = rgba(T.text, a); g.fillText(S(o.label), o.labelX ?? x + r + 44, o.labelY ?? y + 4); spacing(0); }
  }

  // ---------- worked answer ----------
  function ledger(t, rows, G) {
    const x0 = G.x0 ?? 80, xFrom = G.xFrom ?? 560, xOp = G.xOp ?? 640, xTo = G.xTo ?? 1000, rh = G.rowH ?? 92, size = Math.max(60, G.size ?? 64);
    const A = G.alpha ?? 1; let y = (G.y ?? 700) + (G.dy ?? 0);
    for (const r of rows) {
      const k = t - r.at;
      if (r.head) { if (k > 0) { g.font = F(400, 38, 'Anton'); spacing(5); g.textAlign = 'left'; g.textBaseline = 'middle';
          g.fillStyle = rgba(T.dim, A * eo(k / 0.4)); g.fillText(S(r.head), x0, y + 52); spacing(0); } y += 88; continue; }
      if (r.rule) { const p = eo(k / 0.4); if (p > 0) { g.fillStyle = rgba(T.text, 0.55 * A); g.fillRect(xTo - (xTo - xOp + 30) * p, y + 6, (xTo - xOp + 30) * p, 3); } y += 22; continue; }
      const sz = r.strong ? Math.max(size, G.strongSize ?? 92) : size, yy = y + rh / 2, fa = A * eo(k / 0.35);
      if (k > 0) {
        if (r.label) { g.font = F(500, 40); g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillStyle = rgba(r.strong ? T.text : T.dim, fa);
          g.fillText(S(r.label), x0, r.note ? yy - 18 : yy); }
        if (r.note) { g.font = F(400, 32); g.fillStyle = rgba(T.dim, 0.85 * fa); g.textAlign = 'left'; g.fillText(S(r.note), x0, yy + 24); }
        if (r.from) {
          const fw = num(S(r.from), xFrom, yy, size * 0.85, 'right', rgba(T.text, (r.strike ? 0.6 : 1) * fa), 500);
          if (r.strike) { const sp = eo((k - 0.35) / 0.35); if (sp > 0) { g.fillStyle = rgba(T.text, 0.8 * A); g.fillRect(xFrom - fw - 6, yy - 3, (fw + 12) * sp, 5); } }
          if (!r.op) arrow(xFrom + 22, xOp + 36, yy, rgba(T.dim, A), 5, eo((k - 0.45) / 0.35));
        }
        const tw = numWidth(S(r.to), sz, 700);
        if (r.op) { g.font = F(500, Math.min(sz, 72) * 0.8); g.textAlign = 'center'; g.fillStyle = rgba(T.dim, fa);   // never inside a wide number
          g.fillText(S(r.op), Math.min(xOp, xTo - tw - 40), yy + 2); }
        const _tw = tw, tp = eo((k - (r.from ? 0.55 : 0.15)) / 0.4);
        wipe(tp, xTo - tw, yy, tw, sz * 1.4, () => num(r.to, xTo, yy + (1 - tp) * 8, sz, 'right', rgba(r.strong ? T.accent : T.text, A), 700));
      }
      y += r.strong ? Math.max(rh, sz * 1.25) : rh;
    }
    return y;
  }
  function rule(t, t0, text, cite, o = {}) {
    const size = Math.max(50, o.size ?? 56), y = (o.y ?? 700) + (o.dy ?? 0), a = o.alpha ?? 1;
    g.font = F(500, size); const rows = wrapText(S(text), X1 - X0 - 40);
    rows.forEach((s, i) => line(t, t0 + i * 0.35, s, X0 + 20, y + i * size * 1.3, { size, weight: 500, alpha: a, _sub: true }));   // wrapped pieces of a checked string
    const cy = y + rows.length * size * 1.3 + 30, cp = eo((t - t0 - rows.length * 0.35 - 0.2) / 0.5);
    if (cite && cp > 0) { g.fillStyle = rgba(T.dim, a * cp); g.fillRect(X0 + 20, cy - 22, 5, 44);
      g.font = F(400, 40, 'Anton'); spacing(4); g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(S(cite), X0 + 44, cy + 2); spacing(0); }
    return cy + 40;
  }
  function trap(t, t0, t1, label, text, o = {}) {
    const a = (o.alpha ?? 1) * ss(t0, t0 + 0.5, t) * (1 - ss(t1, t1 + 0.5, t)); if (a <= 0) return;
    const y = (o.y ?? 1380) + (o.dy ?? 0), size = Math.max(46, o.size ?? 48);
    g.font = F(500, size); const rows = wrapText(S(text), X1 - X0 - 150), h = 80 + rows.length * size * 1.3 + 30;
    g.fillStyle = rgba(T.card, a); g.beginPath(); g.roundRect(X0, y + (1 - a) * 20, X1 - X0, h, 28); g.fill();
    const cy = y + (1 - a) * 20;
    g.fillStyle = rgba(T.ground, a); circle(X0 + 62, cy + 50, 28); cross(X0 + 62, cy + 50, 22, rgba(T.text, a), 6);
    g.font = F(400, 40, 'Anton'); spacing(5); g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillStyle = rgba(T.dim, a);
    g.fillText(S(label), X0 + 110, cy + 52); spacing(0);
    g.font = F(500, size); g.fillStyle = rgba(T.text, a);
    rows.forEach((s, i) => g.fillText(s, X0 + 40, cy + 112 + i * size * 1.3));
  }
  function endCard(t, t0) {
    const a = ss(t0, t0 + 0.8, t); if (a <= 0) return a;
    ground(a); g.textAlign = 'center'; g.textBaseline = 'middle';
    const b = ss(t0 + 0.3, t0 + 1.1, t), c = ss(t0 + 0.8, t0 + 1.6, t), d = ss(t0 + 1.2, t0 + 2.0, t);
    g.font = F(400, 96, 'Anton'); g.fillStyle = rgba(T.text, b); g.fillText(S(T.handle), CX, 720 + (1 - b) * 20);
    g.fillStyle = rgba(T.accent, b); g.fillRect(CX - 60, 800, 120, 5);
    g.font = F(500, 42); g.fillStyle = rgba(T.text, c);
    let y = 900; for (const s of T.cta) { for (const r of wrapText(S(s), 980)) { g.fillText(r, CX, y); y += 64; } y += 10; }
    g.font = F(400, 32); g.fillStyle = rgba(T.dim, d); y += 50;
    for (const s of T.small) { for (const r of wrapText(S(s), 900)) { g.fillText(r, CX, y); y += 44; } }
    return a;
  }

  async function ready() {
    await document.fonts.ready;
    for (const f of ['400 150px Anton', '400 40px Anton', '400 52px Inter', '500 52px Inter', '600 52px Inter', '700 52px Inter'])
      await document.fonts.load(f);
  }
  return { THEMES, get T() { return T; }, init, schedule, words, ground, kicker, hook, card, options, optionRow, ring, line, ledger,
           rule, trap, endCard, num, numWidth, tick, cross, arrow, eo, F, ready };
})();
