"""The touch as ringers draw it: rows of numbers, the treble's path in red,
the 2nd's in blue. Three parts of forty, side by side. A bob marked with a dash."""
from method import touch

CALLS = "pppbpppbpppb"
rows = [r + [6] for r in touch(CALLS)]
W, H = 760, 1055
cw, rh = 17, 23
cols = [(70 + c * 230, 3 + 40 * c) for c in range(3)]   # x0, first row index
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
       '<rect width="100%" height="100%" fill="#f6f1e6"/>',
       '<text x="380" y="40" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#2a2420">'
       'Plain Bob Doubles · 120 · tenor behind</text>',
       '<text x="380" y="64" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#6d6257" '
       'font-style="italic">every row of five bells, each exactly once, then rounds</text>']
y0 = 100
for ci, (x0, _) in enumerate(cols):
    part = rows[40 * ci: 40 * ci + 41]
    for bell, colour, width in [(1, "#b8322a", 2.2), (2, "#2f5d9e", 2.2)]:
        pts = []
        for i, r in enumerate(part):
            p = r.index(bell)
            pts.append(f"{x0 + p * cw + 5:.1f},{y0 + i * rh - 5:.1f}")
        svg.append(f'<polyline points="{" ".join(pts)}" fill="none" stroke="{colour}" '
                   f'stroke-width="{width}" stroke-linejoin="round" opacity="0.85"/>')
    for i, r in enumerate(part):
        y = y0 + i * rh
        for p, b in enumerate(r):
            if b in (1, 2):
                continue
            svg.append(f'<text x="{x0 + p * cw}" y="{y}" font-family="Menlo,monospace" font-size="15" '
                       f'fill="{"#9a8f84" if b == 6 else "#2a2420"}">{b}</text>')
        lead = 40 * ci + i
        if i and lead % 10 == 0:
            call = CALLS[lead // 10 - 1]
            svg.append(f'<line x1="{x0 - 8}" x2="{x0 + 6 * cw}" y1="{y + 6}" y2="{y + 6}" '
                       f'stroke="#c9bfb2" stroke-width="0.8"/>')
            if call == "b":
                svg.append(f'<text x="{x0 + 6 * cw + 6}" y="{y + 3}" font-family="Georgia,serif" '
                           f'font-size="13" fill="#6d6257" font-style="italic">– bob</text>')
svg.append("</svg>")
open("blueline.svg", "w").write("\n".join(svg))
print("ok")
