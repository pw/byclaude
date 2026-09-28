# Page profile (1024 sq, circle-safe) + Page cover (1640x624, centre-safe for mobile crop) for the three exam Pages.
import pathlib, sys
from playwright.sync_api import sync_playwright
from PIL import Image
HERE = pathlib.Path(__file__).parent
P = {
 'adj': dict(bg='#5E1A26', tx='#EAD8C0', ac='#ECB454', dim='rgba(234,216,192,', kick='CLAIMS ADJUSTER LICENSING EXAM', big='A PRACTICE QUESTION<br>EVERY MORNING', sub='Worked answer every evening · free group, link below'),
 'fpm': dict(bg='#183828', tx='#F4EEE2', ac='#F09810', dim='rgba(244,238,226,', kick='FOOD PROTECTION MANAGER EXAM', big='A PRACTICE QUESTION<br>EVERY MORNING', sub='Answer + Food Code section every evening · free group, link below'),
 'fifa': dict(bg='#0A1430', tx='#FCF0E4', ac='#D89C24', dim='rgba(252,240,228,', kick='FIFA FOOTBALL AGENT EXAM', big='A PRACTICE QUESTION<br>EVERY MORNING', sub='Answer + regulation article every evening · free group, link below'),
 'ww':  dict(bg='#102850', tx='#F4EEE2', ac='#A8D0E8', dim='rgba(244,238,226,', kick='WASTEWATER OPERATOR EXAM', big='A PRACTICE PROBLEM<br>EVERY MORNING', sub='Worked answer every evening · free group, link below'),
}
FONTS = """@font-face{font-family:Anton;src:url(../fonts/Anton-Regular.ttf)}@font-face{font-family:Inter;src:url(../../motion/fonts/Inter.ttf)}html,body{margin:0}"""
def profile(v):
    cells = ''.join(f'<div class="c{" on" if L=="C" else ""}">{L}</div>' for L in 'ABCD')
    return f"""<!doctype html><meta charset=utf-8><style>{FONTS}
body{{width:1024px;height:1024px;background:{v['bg']};display:flex;align-items:center;justify-content:center}}
.g{{display:grid;grid-template-columns:320px 320px;gap:36px}}
.c{{width:320px;height:320px;border-radius:50%;border:20px solid {v['dim']}.45);box-sizing:border-box;display:flex;align-items:center;justify-content:center;font-family:Anton;font-size:190px;color:{v['dim']}.6);line-height:1;padding-bottom:6px}}
.c.on{{background:{v['ac']};border-color:{v['ac']};color:{v['bg']}}}
</style><div class="g">{cells}</div>"""
def cover(v):
    return f"""<!doctype html><meta charset=utf-8><style>{FONTS}
body{{width:1640px;height:624px;background:{v['bg']};color:{v['tx']};font-family:Inter;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}}
.k{{font-family:Anton;font-size:40px;letter-spacing:6px;color:{v['ac']}}}
.b{{font-family:Anton;font-size:112px;line-height:1.0;margin-top:14px;max-width:1150px}}
.s{{font-size:34px;margin-top:26px;opacity:.85}}
</style><div class=k>{v['kick']}</div><div class=b>{v['big']}</div><div class=s>{v['sub']}</div>"""
with sync_playwright() as s:
    b = s.chromium.launch()
    only = sys.argv[1:]
    for k, v in P.items():
        if only and k not in only: continue
        for kind, fn, W, H in (('profile', profile, 1024, 1024), ('cover', cover, 1640, 624)):
            f = HERE / f'{k}-{kind}.html'; f.write_text(fn(v))
            pg = b.new_page(viewport={'width': W, 'height': H}); pg.goto(f.resolve().as_uri()); pg.wait_for_timeout(500)
            png = HERE / f'{k}-{kind}.png'; pg.screenshot(path=str(png)); pg.close()
            Image.open(png).convert('RGB').save(f'/home/exedev/Handoff/reports/maren-{k}-page-{kind}-v2.jpg', quality=94)
    b.close()
print('ok')
