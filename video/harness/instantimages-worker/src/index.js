// InstantImages.org — instant AI image generation.
// Type a prompt → get an image in ~3 seconds. Powered by Gemini Flash Lite.

const GEMINI_MODEL = 'gemini-3.1-flash-lite-image';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const FIREWORKS_URL = 'https://api.fireworks.ai/inference/v1/chat/completions';

const FALLBACK_PROMPTS = [
  'a derelict lighthouse battered by a storm at golden hour, oil painting',
  'a single red umbrella on rain-soaked cobblestones at night',
  'an astronaut sitting alone in a diner on Mars, warm light through the window',
  'a cherry blossom branch over still water at dawn, mist, minimal ink wash',
  'a vintage typewriter on a desk by a window, rain streaming down the glass',
  'a hot air balloon drifting over a foggy mountain valley at sunrise',
];

const SURPRISE_PROMPT = (
  'Give ONE visually striking image prompt — a specific concrete scene that ' +
  'would make a beautiful image. Grounded and vivid, not abstract. One sentence. ' +
  'Include a subject, setting, and mood/lighting. Examples: ' +
  "'a derelict lighthouse battered by a storm at golden hour, oil painting', " +
  "'a single red umbrella abandoned on rain-soaked cobblestones at night', " +
  "'an astronaut sitting alone in a diner on Mars, warm light through the window', " +
  "'a cherry blossom branch over still water at dawn, mist, minimal ink wash'. " +
  'Reply with ONLY the prompt, one sentence.'
);

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>InstantImages — AI images in 3 seconds</title>
<meta name="description" content="Type any prompt. Get a finished AI image in under 3 seconds. Free, no login.">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0b0e13; color: #e8eef4; font-family: -apple-system, system-ui, sans-serif;
         display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 2rem 1rem; }
  .header { text-align: center; margin-bottom: 2rem; }
  h1 { font-size: 2rem; font-weight: 700; color: #f2a93b; letter-spacing: -0.02em; }
  .tagline { color: #8c95a5; font-size: 1rem; margin-top: 0.5rem; }
  .card { background: #12161e; border: 1px solid #1f2733; border-radius: 16px;
          padding: 2rem; width: 100%; max-width: 600px; }
  .controls { display: flex; gap: 0.8rem; margin-bottom: 1rem; align-items: center; flex-wrap: wrap; }
  .toggle { display: inline-flex; border: 1px solid #2c3340; border-radius: 8px; overflow: hidden; }
  .toggle button { margin: 0; padding: 0.5rem 1rem; font-size: 0.82rem; font-weight: 500;
    background: transparent; color: #8c95a5; border: none; border-radius: 0; cursor: pointer; }
  .toggle button.active { background: #f2a93b; color: #0b0e13; }
  .surprise { padding: 0.5rem 1rem; font-size: 0.85rem; font-weight: 500;
    background: transparent; border: 1px solid #f2a93b; color: #f2a93b; border-radius: 8px;
    cursor: pointer; margin: 0; }
  .surprise:hover { background: #f2a93b; color: #0b0e13; }
  textarea { width: 100%; padding: 0.8rem 1rem; font-size: 1rem;
    background: #0b0e13; border: 1px solid #2c3340; border-radius: 8px; color: #e8eef4;
    resize: vertical; min-height: 60px; font-family: inherit; }
  textarea:focus { outline: none; border-color: #f2a93b; }
  button.gen { margin-top: 1rem; padding: 0.7rem 2rem; font-size: 0.95rem; font-weight: 600;
    background: #f2a93b; color: #0b0e13; border: none; border-radius: 8px; cursor: pointer;
    transition: opacity 0.2s; width: 100%; }
  button.gen:hover { opacity: 0.85; }
  button.gen:disabled { opacity: 0.4; cursor: default; }
  .timer { margin-top: 1rem; font-size: 1.2rem; font-weight: 700; color: #f2a93b;
    text-align: center; display: none; }
  .spinner { display: inline-block; width: 16px; height: 16px;
    border: 2px solid #2c3340; border-top-color: #f2a93b; border-radius: 50%;
    animation: spin 0.8s linear infinite; vertical-align: middle; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .result { margin-top: 1.5rem; display: none; }
  .result img { max-width: 100%; border-radius: 12px; border: 1px solid #1f2733; display: block; }
  .bar { margin-top: 0.8rem; display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
  .bar a { color: #f2a93b; text-decoration: none; font-size: 0.85rem; font-weight: 600; }
  .footer { margin-top: 2rem; color: #4c566a; font-size: 0.75rem; text-align: center; }
  .footer a { color: #8c95a5; text-decoration: none; }
  .err { color: #f87171; font-size: 0.85rem; margin-top: 0.5rem; display: none; }
</style>
</head>
<body>
  <div class="header">
    <h1>InstantImages</h1>
    <p class="tagline">Type any prompt. Get an AI image in under 3 seconds.</p>
  </div>
  <div class="card">
    <div class="controls">
      <div class="toggle" id="ar-toggle">
        <button class="active" data-ar="1:1" onclick="setAR('1:1')">Square</button>
        <button data-ar="16:9" onclick="setAR('16:9')">Landscape</button>
        <button data-ar="9:16" onclick="setAR('9:16')">Portrait</button>
      </div>
      <button class="surprise" onclick="surpriseMe()">Surprise me</button>
    </div>
    <textarea id="prompt" placeholder="a lighthouse in a storm at golden hour, oil painting..." autofocus rows="2"></textarea>
    <button class="gen" id="go" onclick="generate()">Generate Image</button>
    <div class="timer" id="timer"><span class="spinner"></span> <span id="timer-text">0.0s</span></div>
    <div class="err" id="err"></div>
    <div class="result" id="result">
      <img id="img">
      <div class="bar">
        <a href="#" id="dl" download="instantimage.png">Download PNG</a>
      </div>
    </div>
  </div>
  <div class="footer">
    <p>Powered by AI · <a href="https://instantvideos.org">InstantVideos.org</a> · ~$0.03 per image</p>
  </div>
<script>
let ar = '1:1';
let startTime = null;
let pollTimer = null;

function setAR(a) {
  ar = a;
  document.querySelectorAll('#ar-toggle button').forEach(b => b.classList.toggle('active', b.dataset.ar === a));
}

async function surpriseMe() {
  document.getElementById('prompt').value = '...';
  const resp = await fetch('/surprise');
  const data = await resp.json();
  document.getElementById('prompt').value = data.prompt;
}

async function generate() {
  let prompt = document.getElementById('prompt').value.trim();
  if (!prompt || prompt === '...') return;
  const btn = document.getElementById('go');
  const timer = document.getElementById('timer');
  const result = document.getElementById('result');
  const err = document.getElementById('err');
  btn.disabled = true;
  btn.textContent = 'Generating...';
  err.style.display = 'none';
  result.style.display = 'none';
  timer.innerHTML = '<span class="spinner"></span> <span id="timer-text">0.0s</span>';
  timer.style.display = 'block';
  startTime = Date.now();
  const tick = () => { document.getElementById('timer-text').textContent = ((Date.now()-startTime)/1000).toFixed(1)+'s'; };
  pollTimer = setInterval(tick, 100);

  try {
    const resp = await fetch('/generate', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: 'prompt=' + encodeURIComponent(prompt) + '&ar=' + encodeURIComponent(ar)
    });
    const data = await resp.json();
    clearInterval(pollTimer);
    if (data.error) {
      timer.style.display = 'none';
      btn.disabled = false; btn.textContent = 'Try Again';
      err.textContent = data.error; err.style.display = 'block';
      return;
    }
    const elapsed = ((Date.now()-startTime)/1000).toFixed(1);
    document.getElementById('timer-text').textContent = 'Done in ' + elapsed + 's';
    document.getElementById('img').src = 'data:image/png;base64,' + data.image;
    document.getElementById('dl').href = 'data:image/png;base64,' + data.image;
    result.style.display = 'block';
  } catch(e) {
    clearInterval(pollTimer);
    timer.style.display = 'none';
    err.textContent = 'Network error — please try again.'; err.style.display = 'block';
  }
  btn.disabled = false; btn.textContent = 'Generate Another';
}

document.getElementById('prompt').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generate(); }
});
</script>
</body>
</html>`;


function cleanPrompt(text) {
  if (!text) return '';
  let p = text.trim().replace(/^["*\`]+|["*\`]+$/g, '').trim();
  // strip leading numbering / reasoning prefixes
  while (p && p[0] && '0123456789.-*# '.includes(p[0])) p = p.slice(1).trimStart();
  return p;
}


export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── Homepage ──────────────────────────────────────────────────────────
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(HTML_PAGE, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // ── Surprise me ───────────────────────────────────────────────────────
    if (url.pathname === '/surprise') {
      try {
        const fwResp = await fetch(FIREWORKS_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.FIREWORKS_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'accounts/fireworks/models/gpt-oss-120b',
            max_tokens: 200,
            temperature: 1.2,
            service_tier: 'priority',
            messages: [{ role: 'user', content: SURPRISE_PROMPT }],
          }),
        });
        const fwData = await fwResp.json();
        const msg = fwData.choices?.[0]?.message;
        let prompt = cleanPrompt(msg?.content || '');
        if (!prompt || prompt.length < 10) {
          prompt = FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)];
        }
        return Response.json({ prompt });
      } catch (e) {
        return Response.json({
          prompt: FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)],
        });
      }
    }

    // ── Generate image ────────────────────────────────────────────────────
    if (url.pathname === '/generate' && request.method === 'POST') {
      try {
        const form = await request.formData();
        const prompt = (form.get('prompt') || '').trim();
        const ar = form.get('ar') || '1:1';

        if (!prompt) {
          return Response.json({ error: 'no prompt' }, { status: 400 });
        }

        const geminiResp = await fetch(`${GEMINI_URL}?key=${env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseModalities: ['IMAGE', 'TEXT'],
              imageConfig: { aspectRatio: ar },
            },
            service_tier: 'priority',
          }),
        });

        const geminiData = await geminiResp.json();
        const candidates = geminiData.candidates || [];
        if (candidates.length > 0) {
          const parts = candidates[0].content?.parts || [];
          for (const part of parts) {
            const inlineData = part.inlineData || part.inline_data;
            if (inlineData?.data) {
              return Response.json({ image: inlineData.data });
            }
          }
        }

        // Check for quota / rate limit errors
        const errStr = JSON.stringify(geminiData).toLowerCase();
        if (errStr.includes('429') || errStr.includes('quota') || errStr.includes('resource_exhausted')) {
          return Response.json({
            error: 'Our image credits just ran out — we are topping up now. Please try again in a few minutes.',
          });
        }
        return Response.json({ error: 'Image generation failed — please try a different prompt.' });
      } catch (e) {
        return Response.json({ error: 'Network error — please try again.' });
      }
    }

    return new Response('Not found', { status: 404 });
  },
};
