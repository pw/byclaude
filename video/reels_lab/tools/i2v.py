#!/usr/bin/env python3
"""i2v.py <still.png> <out.mp4> <prompt> [negative] : one ~5 s image-to-video clip via fal.ai
(default fal-ai/kling-video/v2.5-turbo/pro/image-to-video, $0.07/s => $0.35 per 5 s clip; price from
api.fal.ai/v1/models/pricing on 2026-11-24). Opening arm of Still Unsolved (analysis/opening-test-1130.json).
Key: env FAL_KEY or 1P item 'Falai API' (field key). Never OpenRouter for video. Exit 0 ok / 1 failed."""
import base64, io, json, os, subprocess, sys, time, urllib.request
from PIL import Image
MODEL = os.environ.get("I2V_MODEL", "fal-ai/kling-video/v2.5-turbo/pro/image-to-video")
still, out, prompt = sys.argv[1], sys.argv[2], sys.argv[3]
neg = sys.argv[4] if len(sys.argv) > 4 else "people, faces, hands, birds, new objects, text, letters, morphing, warping, distortion, fire, smoke, explosion, fast motion, camera shake"
key = os.environ.get("FAL_KEY") or subprocess.run(["op", "item", "get", "rpwqq2idsr62lit4qlt3iitwsq", "--vault", "Claude Code",
                                                  "--fields", "key", "--reveal"], capture_output=True, text=True).stdout.strip()
def call(url, body=None):
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None, method="POST" if body is not None else "GET",
                                 headers={"Authorization": f"Key {key}", "Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req, timeout=120).read())
buf = io.BytesIO(); Image.open(still).convert("RGB").save(buf, "JPEG", quality=93)
body = {"prompt": prompt, "negative_prompt": neg, "duration": "5", "cfg_scale": 0.5,
        "image_url": "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()}
sub = call(f"https://queue.fal.run/{MODEL}", body)
print("submitted", sub.get("request_id"), flush=True)
t0 = time.time()
while time.time() - t0 < 900:
    st = call(sub["status_url"])
    if st.get("status") == "COMPLETED": break
    time.sleep(8)
else:
    sys.exit("timeout waiting for " + sub["status_url"])
res = call(sub["response_url"])
url = res["video"]["url"]
urllib.request.urlretrieve(url, out)
print("ok", out, os.path.getsize(out), url, flush=True)
