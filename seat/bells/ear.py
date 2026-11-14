"""Borrowed ears. I can't hear the file; ask a model that can, blind.

usage: ear.py <file.mp3> <model> [question]
Nothing in the prompt says it's synthetic or what it is.
"""
import base64, json, os, sys, urllib.request

path, model = sys.argv[1], sys.argv[2]
q = sys.argv[3] if len(sys.argv) > 3 else (
    "Listen to this recording carefully, all the way through, and describe what you hear "
    "as specifically as you can: what it is, where the listener seems to be standing, what "
    "happens over time (beginning, middle, end, with rough timestamps), and anything that "
    "sounds wrong, unnatural, or artificial. Be honest and critical; don't be polite.")
fmt = path.rsplit(".", 1)[1]
data = base64.b64encode(open(path, "rb").read()).decode()
body = {"model": model, "messages": [{"role": "user", "content": [
    {"type": "text", "text": q},
    {"type": "input_audio", "input_audio": {"data": data, "format": fmt}}]}]}
req = urllib.request.Request("https://openrouter.ai/api/v1/chat/completions",
                             data=json.dumps(body).encode(),
                             headers={"Authorization": "Bearer " + os.environ["OPENROUTER_API_KEY"],
                                      "Content-Type": "application/json", "User-Agent": "curl/8.5.0"})
r = json.load(urllib.request.urlopen(req, timeout=600))
if "choices" not in r:
    print(json.dumps(r)[:2000]); sys.exit(2)
print(r["choices"][0]["message"]["content"])
print("\n[%s, %s]" % (r.get("model"), r.get("usage", {}).get("cost")), file=sys.stderr)
