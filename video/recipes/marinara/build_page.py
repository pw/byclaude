#!/usr/bin/env python3
"""build_page.py — writes ~/Handoff/reports/marinara-video-v1.html from the cut's files + urls.json (R2 links)."""
import json, html, pathlib, re
D = pathlib.Path(__file__).parent
U = json.load(open(D / 'urls.json'))
script = json.load(open(D / 'script.json'))['lines']
meta = json.load(open(D / 'page_meta.json'))
src = (D / 'SOURCES.md').read_text()

def md(s):  # tiny markdown: bold, links, list items, headings
    out = []
    for ln in s.splitlines():
        e = html.escape(ln)
        e = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', e)
        e = re.sub(r'\*(.+?)\*', r'<i>\1</i>', e)
        e = re.sub(r'`(.+?)`', r'<code>\1</code>', e)
        e = re.sub(r'(https?://[^\s,)]+)', r'<a href="\1">\1</a>', e)
        if e.startswith('# '): out.append(f'<h3>{e[2:]}</h3>')
        elif e.startswith('## '): out.append(f'<h4>{e[3:]}</h4>')
        elif e.strip().startswith('- '): out.append(f'<div class=li>{e.strip()[2:]}</div>')
        elif re.match(r'^\d+a?\. ', e.strip()): out.append(f'<p class=cl>{e.strip()}</p>')
        elif e.strip(): out.append(f'<p>{e}</p>')
    return '\n'.join(out)

lines = '\n'.join(f'<tr><td class=id>{l["id"]}</td><td>{html.escape(l["text"])}</td></tr>' for l in script)
names = '\n'.join(f'<div class=b><div class=l>Option {i+1}</div><div class=nm>{html.escape(n["name"])}</div><div>{html.escape(n["why"])}</div></div>' for i, n in enumerate(meta['names']))
decide = '\n'.join(f'<li>{d}</li>' for d in meta['decide'])
fixes = '\n'.join(f'<li>{html.escape(x)}</li>' for x in meta['critique_fixes'])
page = f"""<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Marinara — recipe reel v1 (draft)</title>
<style>body{{font:16px/1.55 system-ui;max-width:44em;margin:0 auto;padding:16px;background:#17110d;color:#f5ece0}}a{{color:#ffc46b}}
.b{{background:#241a14;border:1px solid #3d2c22;border-radius:12px;padding:14px;margin:12px 0}}.l{{font-size:12px;color:#c9a98a;text-transform:uppercase;letter-spacing:.08em}}
video{{width:100%;max-width:420px;display:block;margin:8px auto;border-radius:12px;background:#000}}img{{width:100%;border-radius:10px}}audio{{width:100%}}
h2{{margin-bottom:4px}}h3{{margin-top:34px;color:#ffc46b}}table{{border-collapse:collapse;width:100%}}td{{border-top:1px solid #3d2c22;padding:6px 4px;vertical-align:top}}td.id{{color:#c9a98a;font-size:13px;width:3em}}
.nm{{font:600 24px Georgia,serif;margin:4px 0}}.li{{margin:2px 0 2px 1.2em}}p.cl{{margin-top:14px}}code{{background:#2f231b;padding:1px 4px;border-radius:4px}}.dim{{color:#c9a98a;font-size:14px}}</style>
<h2>Marinara — recipe reel, episode 1 (draft v1)</h2>
<div class=dim>For your review, not posted anywhere. Built {meta['date']} from your WhatsApp ask. Runtime {meta['runtime']}, 1080×1920, captions burned in.</div>

<h3>The cut</h3>
<div class=b><div class=l>Main cut · voice A "{meta['voiceA']}"</div><video controls playsinline preload=metadata src="{U['rosa_mp4']}"></video>
<div class=dim><a href="{U['rosa_mp4']}">Open / download MP4</a></div></div>

<h3>Voice audition</h3>
<p>Two designed Gemini voices read the identical script. The main cut uses A. B is the same film retimed to B's read, so you can judge the voice in context.</p>
<div class=b><div class=l>A · {meta['voiceA']}</div><div>{html.escape(meta['voiceA_desc'])}</div><audio controls preload=none src="{U['rosa_audio']}"></audio></div>
<div class=b><div class=l>B · {meta['voiceB']}</div><div>{html.escape(meta['voiceB_desc'])}</div><audio controls preload=none src="{U['gus_audio']}"></audio>
<video controls playsinline preload=none src="{U['gus_mp4']}"></video><div class=dim><a href="{U['gus_mp4']}">Full cut with voice B ({meta['runtimeB']})</a></div></div>

<h3>What I need from you</h3>
<ol>{decide}</ol>

<h3>Series and page name: 3 options</h3>
{names}

<h3>Contact sheet</h3>
<div class=dim>One frame every 3 seconds.</div>
<a href="{U['sheet']}"><img src="{U['sheet']}" alt="contact sheet"></a>

<h3>Script (narration)</h3>
<table>{lines}</table>

<h3>Blind critique: what it caught and what I changed</h3>
<p class=dim>A fresh seat got the frames and the timed transcript, not my notes.</p>
<ul>{fixes}</ul>

<h3>Sources and fact-check</h3>
<div class=b>{md(src)}</div>
<p class=dim>Narration check: the final mix was transcribed (whisper small.en) and every script line was found complete. Transcript: {html.escape(meta['transcript_note'])}</p>
"""
out = pathlib.Path('/home/exedev/Handoff/reports/marinara-video-v1.html'); out.write_text(page); print(out)
