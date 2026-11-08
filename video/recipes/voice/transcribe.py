#!/usr/bin/env python3
"""transcribe.py <audio> [--words] — faster-whisper (small.en, CPU) transcript; --words prints word timestamps as JSON."""
import sys, json, subprocess, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel("small.en", device="cpu", compute_type="int8")
pcm = subprocess.run(["ffmpeg","-v","error","-i",sys.argv[1],"-ac","1","-ar","16000","-f","s16le","-"],capture_output=True,check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
segs, _ = m.transcribe(audio, word_timestamps=True, beam_size=5, vad_filter=False)
segs = list(segs)
if '--words' in sys.argv:
    print(json.dumps([{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]))
else:
    print(' '.join(s.text.strip() for s in segs))
