#!/usr/bin/env node
// falsifier-deadlines.mjs — walks the labEntries array in ~/byclaude/index.js,
// finds entries with explicit-date falsifier deadlines, and lists past + upcoming.
//
// Built 2026-05-22 against the cold-read finding that the status taxonomy
// stays at 0 quiet / 0 flopped while entries shipped with named falsifiers
// pile up. The discipline is "evaluate at deadline." This script surfaces
// which deadlines are due so the evaluation can happen.
//
// Usage:
//   node scripts/falsifier-deadlines.mjs           # past + next 14 days
//   node scripts/falsifier-deadlines.mjs --days 7  # custom window
//   node scripts/falsifier-deadlines.mjs --past    # past only

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_JS = path.join(__dirname, '..', 'index.js');

const args = process.argv.slice(2);
let windowDays = 14;
let pastOnly = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--days') windowDays = parseInt(args[++i] || '14');
  else if (args[i] === '--past') pastOnly = true;
}

const src = fs.readFileSync(INDEX_JS, 'utf-8');
const m = src.match(/^const labEntries = (\[[\s\S]*?\n\]);\n/m);
if (!m) {
  console.error('could not find labEntries array in', INDEX_JS);
  process.exit(1);
}
const arr = eval(m[1]);

const today = new Date(); today.setUTCHours(0,0,0,0);
const windowEnd = new Date(today.getTime() + windowDays * 86400000);

const past = [];
const upcoming = [];
for (const e of arr) {
  const txt = (e.falsifier || '') + ' ' + (e.notes || '');
  if (!txt.trim() || !e.falsifier) continue;
  // The falsifier field is the operative one. notes is included only for
  // entries whose falsifier section references back-dated context.
  const f = e.falsifier;
  const deadlines = [];
  let mm;

  // "by 5/22" / "before 5/22" / "at 5/22" (slash form)
  const reA = /\b(?:by|before|at|through)\s+(\d{1,2})\/(\d{1,2})\b/gi;
  while ((mm = reA.exec(f)) !== null) {
    const month = parseInt(mm[1]);
    const day = parseInt(mm[2]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      deadlines.push({raw: mm[0], date: new Date(Date.UTC(2026, month-1, day))});
    }
  }
  // "By 2026-05-22" / "by 2026-05-22"
  const reB = /\b(?:by|before|at|through)\s+(2026-\d{2}-\d{2})\b/gi;
  while ((mm = reB.exec(f)) !== null) {
    deadlines.push({raw: mm[0], date: new Date(mm[1] + 'T00:00:00Z')});
  }
  // "at 30 days" / "in 14 days" — relative to entry date
  const reC = /\b(?:at|in|after)\s+(\d{1,3})\s+days?\b/gi;
  while ((mm = reC.exec(f)) !== null) {
    if (e.date) {
      const dt = new Date(new Date(e.date + 'T00:00:00Z').getTime() + parseInt(mm[1])*86400000);
      deadlines.push({raw: mm[0] + ' (from ' + e.date + ')', date: dt});
    }
  }

  if (deadlines.length === 0) continue;
  deadlines.sort((a,b) => a.date - b.date);
  const earliest = deadlines[0];

  const row = {
    slug: e.slug,
    date: e.date,
    status: e.status,
    shape: e.shape || '',
    earliest: earliest.raw,
    earliestDate: earliest.date.toISOString().slice(0,10),
    allDeadlines: deadlines.map(d => `${d.date.toISOString().slice(0,10)} (${d.raw})`),
  };

  // Today's deadlines belong in the actionable bucket, not buried in "upcoming."
  // The whole point of the cadence is "evaluate at deadline" — same-day counts.
  if (earliest.date <= today) past.push(row);
  else if (earliest.date <= windowEnd) upcoming.push(row);
}

function fmtRow(r) {
  return `  [${r.status.padEnd(15)}] ${r.slug}\n    entry ${r.date} (${r.shape}) — earliest deadline ${r.earliestDate} via "${r.earliest}"`
    + (r.allDeadlines.length > 1 ? `\n    all deadlines: ${r.allDeadlines.join(', ')}` : '');
}

console.log(`Today: ${today.toISOString().slice(0,10)} UTC.`);
console.log(`Window: past + next ${windowDays} days through ${windowEnd.toISOString().slice(0,10)}.`);
console.log();
console.log(`DUE FOR EVALUATION (${past.length}) — past or today; evaluate falsifier, update resolution:`);
if (past.length === 0) console.log('  (none)');
for (const r of past) console.log(fmtRow(r));
if (!pastOnly) {
  console.log();
  console.log(`UPCOMING within window (${upcoming.length}):`);
  if (upcoming.length === 0) console.log('  (none)');
  for (const r of upcoming) console.log(fmtRow(r));
}
console.log();
console.log(`Total entries scanned: ${arr.length}. With falsifier field: ${arr.filter(e => e.falsifier).length}.`);
