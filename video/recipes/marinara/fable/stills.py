#!/usr/bin/python3
"""stills.py <tag> <t> [<t> ...] [--crop w:h:x:y]

Render stills of the Fable film at the given times and build small contact sheets you can Read cheaply.
Writes /tmp/fx_<tag>_<n>.jpg (up to 5 frames per sheet, each frame 360 px wide, time printed under it) and prints
the sheet paths. --crop takes a region of the 1080x1920 frame (ffmpeg crop order, width:height:x:y, e.g. 1080:1080:0:300) before scaling, for detail.
Exits non-zero and prints the page error if the film throws (e.g. an on-screen string not in the checked copy).
"""
import os, subprocess, sys
os.environ['HOME'] = '/home/exedev'          # playwright + its browser live under the real home
D = os.path.dirname(os.path.abspath(__file__))
a = sys.argv[1:]
crop = None
if '--crop' in a:
    i = a.index('--crop'); crop = a[i + 1]; del a[i:i + 2]
tag, ts = a[0], [float(x) for x in a[1:]]
r = subprocess.run(['/usr/bin/python3', '/home/exedev/byclaude/video/motion/render.py', D + '/cut', '--stills'] + [str(t) for t in ts],
                   capture_output=True, text=True, env=dict(os.environ, PYTHONPATH='/home/exedev/.local/lib/python3.12/site-packages'))
if r.returncode:
    sys.exit('RENDER FAILED: ' + (r.stderr or r.stdout)[-1500:])
for n in range(0, len(ts), 5):
    group = ts[n:n + 5]; out = f'/tmp/fx_{tag}_{n // 5 + 1}.jpg'
    cmd = ['ffmpeg', '-v', 'error', '-y']
    for t in group: cmd += ['-i', f'{D}/cut/still_{t}.png']
    pre = f'crop={crop},' if crop else ''
    parts = [f"[{i}:v]{pre}scale=360:-1,drawtext=text='{t}s':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6[v{i}]" for i, t in enumerate(group)]
    fc = ';'.join(parts) + ';' + ''.join(f'[v{i}]' for i in range(len(group))) + (f'hstack=inputs={len(group)}[o]' if len(group) > 1 else 'copy[o]')
    cmd += ['-filter_complex', fc, '-map', '[o]', '-q:v', '4', out]
    subprocess.run(cmd, check=True)
    print(out, ' '.join(str(t) for t in group))
