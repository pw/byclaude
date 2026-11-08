#!/usr/bin/env python3
"""build_timeline.py <voice_dir> <out_dir> — join per-line VO wavs with designed gaps into <out_dir>/vo.wav and write
<out_dir>/lines.json = {lines:[{id,text,at,dur}], words:[{w,s,e,line}], total} for film.html (window.PARAMS).
Word times: faster-whisper word timestamps per line, aligned onto the SCRIPT's own words (captions show script text)."""
import json, sys, wave, re, difflib, subprocess, pathlib
import numpy as np
HERE = pathlib.Path(__file__).parent
vd, od = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]); od.mkdir(parents=True, exist_ok=True)
S = json.load(open(HERE / 'script.json'))['lines']
LEAD = 0.25
GAP_AFTER = {'L01': 0.45, 'L02': 0.4, 'L03': 0.45, 'L04': 0.35, 'L05': 0.5, 'L06': 0.45, 'L07': 0.4, 'L08': 0.35,
             'L09': 0.55, 'L10': 0.45, 'L11': 0.5, 'L12': 2.0, 'L13': 1.1}
SR = 24000
from faster_whisper import WhisperModel
M = WhisperModel("small.en", device="cpu", compute_type="int8")
def norm(w): return re.sub(r"[^a-z0-9']", '', w.lower())
NUM = {'15': 'fifteen', '2': 'two', '3': 'three', '4': 'four', '1692': 'sixteen', '1500s': 'fifteenhundreds'}
pcm_all = [np.zeros(int(LEAD * SR), np.int16)]; t = LEAD; lines = []; words = []
for l in S:
    w = wave.open(str(vd / f"{l['id']}.wav")); assert w.getframerate() == SR
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16)
    # trim leading/trailing near-silence (keep 40 ms)
    env = np.abs(x.astype(np.float32)); thr = 300
    nz = np.where(env > thr)[0]; a = max(0, nz[0] - int(0.04 * SR)); b = min(len(x), nz[-1] + int(0.08 * SR)); x = x[a:b]
    dur = len(x) / SR
    xf = x.astype(np.float32) / 32768; x16 = np.interp(np.arange(0, len(xf), SR / 16000), np.arange(len(xf)), xf).astype(np.float32)
    segs, _ = M.transcribe(x16, word_timestamps=True, beam_size=5)
    hw = [(ww.word.strip(), ww.start, ww.end) for s in segs for ww in s.words]
    sw = l['text'].split()
    hn = [NUM.get(norm(h[0]), norm(h[0])) for h in hw]; sn = [norm(s) for s in sw]
    sm = difflib.SequenceMatcher(a=sn, b=hn, autojunk=False); times = [None] * len(sw)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size): times[blk.a + k] = (hw[blk.b + k][1], hw[blk.b + k][2])
    # interpolate unmatched words between known anchors
    known = [(i, tt) for i, tt in enumerate(times) if tt]
    if not known: known = [(0, (0, dur))]
    for i in range(len(sw)):
        if times[i]: continue
        prev = max([k for k in known if k[0] < i], default=(-1, (0, 0)), key=lambda k: k[0])
        nxt = min([k for k in known if k[0] > i], default=(len(sw), (dur, dur)), key=lambda k: k[0])
        s0, s1 = prev[1][1], nxt[1][0]; n = nxt[0] - prev[0]; f = (i - prev[0]) / n
        times[i] = (s0 + (s1 - s0) * f, s0 + (s1 - s0) * (f + 1 / n))
    matched = sum(1 for blk in sm.get_matching_blocks() for _ in range(blk.size))
    print(l['id'], f"{dur:.2f}s", f"aligned {matched}/{len(sw)}", '|', ' '.join(h[0] for h in hw))
    for s_, (a_, b_) in zip(sw, times): words.append({'w': s_, 's': round(t + a_, 3), 'e': round(t + b_, 3), 'line': l['id']})
    lines.append({'id': l['id'], 'text': l['text'], 'at': round(t, 3), 'dur': round(dur, 3)})
    gap = GAP_AFTER.get(l['id'], 0.45)
    pcm_all += [x, np.zeros(int(gap * SR), np.int16)]; t += dur + gap
vo = np.concatenate(pcm_all)
with wave.open(str(od / 'vo.wav'), 'wb') as o: o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR); o.writeframes(vo.tobytes())
total = round(len(vo) / SR, 3)
json.dump({'lines': lines, 'words': words, 'total': total}, open(od / 'lines.json', 'w'), indent=1)
print('total', total)
