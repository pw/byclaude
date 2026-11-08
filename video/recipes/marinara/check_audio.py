#!/usr/bin/env python3
"""check_audio.py <final.mp4> — whisper (small.en) the FINAL mix and check every script word is narrated.
Prints per-line coverage + missing words. Exit 0 if every line >= 90% and no line's last word missing, else 1."""
import sys, re, json, difflib, subprocess, pathlib
import numpy as np
from faster_whisper import WhisperModel
HERE = pathlib.Path(__file__).parent
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
m = WhisperModel('small.en', device='cpu', compute_type='int8')
segs, _ = m.transcribe(audio, beam_size=5, word_timestamps=True)
hw = [(w.word.strip(), w.start) for s in segs for w in s.words]
open(pathlib.Path(sys.argv[1]).with_suffix('.transcript.txt'), 'w').write(' '.join(h[0] for h in hw) + '\n')
NUM = {'15': 'fifteen', '2': 'two', '3': 'three', '4': 'four', '1': 'one', '30': 'thirty', '1692': 'sixteen ninety two', '1500s': 'fifteen hundreds'}
def norm(w): w = re.sub(r"[^a-z0-9']", '', w.lower()); return NUM.get(w, w)
def toks(s): return [y for x in re.split(r"[\s\-]+", s) for y in norm(x).split() if y]
hn = []; [hn.extend(toks(h[0])) for h in hw]
script = json.load(open(HERE / 'script.json'))['lines']
ok = True
for l in script:
    sw = toks(l['text'])
    # align this line against the whole transcript, keep best local block coverage
    sm = difflib.SequenceMatcher(a=sw, b=hn, autojunk=False)
    got = set()
    for b in sm.get_matching_blocks():
        for k in range(b.size): got.add(b.a + k)
    cov = len(got) / len(sw); miss = [sw[i] for i in range(len(sw)) if i not in got]
    last_ok = (len(sw) - 1) in got
    flag = 'OK ' if cov >= 0.9 and last_ok else 'BAD'
    if flag == 'BAD': ok = False
    print(f"{flag} {l['id']} {cov:.0%} missing={miss}")
print('TRANSCRIPT:', ' '.join(h[0] for h in hw))
sys.exit(0 if ok else 1)
