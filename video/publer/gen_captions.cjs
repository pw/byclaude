// gen_captions.js — extract the per-film caption packs from the live review worker
// so captions.json stays a derivative of ONE source of truth (review-worker/index.js
// POSTS object), never a hand-retyped copy that drifts.
//
//   node gen_captions.js ../review-worker/index.js captions.json
//
// POSTS shape per film is already { title, yt, tiktok, reels } — exactly what the
// poster wants, so this is a verbatim lift (template literals eval fine in node).
const fs = require("fs");
const [, , srcPath, outPath] = process.argv;
const src = fs.readFileSync(srcPath, "utf8");
const start = src.indexOf("const POSTS = ");
const end = src.indexOf("const BIOS");
if (start < 0 || end < 0) { console.error("could not locate POSTS / BIOS in", srcPath); process.exit(1); }
const lit = src.slice(start + "const POSTS = ".length, end).trim().replace(/;\s*$/, "");
// eslint-disable-next-line no-eval
const POSTS = eval("(" + lit + ")");
fs.writeFileSync(outPath, JSON.stringify(POSTS, null, 2) + "\n");
console.log("wrote", outPath, "·", Object.keys(POSTS).length, "films:", Object.keys(POSTS).join(", "));
