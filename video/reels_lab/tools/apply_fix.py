#!/usr/bin/env python3
"""apply_fix.py <name> 'old' 'new' ['old' 'new' ...] — exact replace across su json, script.json, caption.txt.
Each old must occur at least once overall; asserts old gone + new present afterwards."""
import sys, json, os
n=sys.argv[1]; pairs=list(zip(sys.argv[2::2], sys.argv[3::2]))
V=os.path.expanduser("~/byclaude/video")
files=[f"{V}/shorts/su-{n}.json", f"{V}/{n}/script.json", f"{V}/{n}/caption.txt"]
txt={f:open(f).read() for f in files}
def enc(s,f): return json.dumps(s)[1:-1] if f.endswith(".json") else s
for old,new in pairs:
    hits=0
    for f in files:
        o=enc(old,f); c=txt[f].count(o); hits+=c; txt[f]=txt[f].replace(o,enc(new,f))
    assert hits, f"NOT FOUND: {old!r}"
    print(f"{hits}x  {old[:50]!r} -> {new[:50]!r}")
for f in files:
    if f.endswith(".json"): json.loads(txt[f])
    open(f,"w").write(txt[f])
for old,new in pairs:
    assert not any(enc(old,f) in txt[f] for f in files if old not in new), old
