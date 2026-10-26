"""fbcdp.py — raw CDP to ONE fresh tab in Mac claude-chrome (tunnel :9333). Usage: python3 fbcdp.py <url> [js-expr]
Prints the JSON value of js-expr (default: login state + first 1500 chars of body text). Closes the tab."""
import sys, json, time, urllib.request, websocket
url = sys.argv[1]; expr = sys.argv[2] if len(sys.argv) > 2 else None
tab = json.load(urllib.request.urlopen(urllib.request.Request("http://127.0.0.1:9333/json/new?about:blank", method="PUT")))
ws = websocket.create_connection(tab["webSocketDebuggerUrl"], timeout=90, suppress_origin=True)
n = 0
def cdp(m, **p):
    global n; n += 1; ws.send(json.dumps({"id": n, "method": m, "params": p}))
    while True:
        r = json.loads(ws.recv())
        if r.get("id") == n: return r.get("result", {})
def js(e):
    r = cdp("Runtime.evaluate", expression=e, returnByValue=True, awaitPromise=True); return r.get("result", {}).get("value")
try:
    cdp("Page.enable"); cdp("Page.navigate", url=url); time.sleep(9)
    v = js(expr) if expr else js("({url:location.href, loginForm:!!document.querySelector('input[name=pass]'), text:document.body.innerText.slice(0,1500)})")
    print(json.dumps(v, indent=1)[:6000])
finally:
    ws.close(); urllib.request.urlopen(f"http://127.0.0.1:9333/json/close/{tab['id']}")
