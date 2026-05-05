// wick.client.js — a tiny lisp in the browser.
// Faithful port of wick (https://github.com/pw/Wick) from Go to JS.
// Same special forms, same trampoline TCO, same stdlib.

(() => {
  // ---------- Values ----------
  const NIL = Object.freeze({ tag: 'nil' });
  const TRUE = Object.freeze({ tag: 'bool', value: true });
  const FALSE = Object.freeze({ tag: 'bool', value: false });
  const num = (v) => ({ tag: 'num', value: v });
  const str = (v) => ({ tag: 'str', value: v });
  const sym = (v) => ({ tag: 'sym', value: v });
  const list = (xs) => ({ tag: 'list', value: xs });
  const dict = (m) => ({ tag: 'dict', value: m });
  const err = (msg) => ({ tag: 'err', value: msg });

  function show(v) {
    switch (v.tag) {
      case 'num': return formatNum(v.value);
      case 'str': return JSON.stringify(v.value);
      case 'sym': return v.value;
      case 'nil': return 'nil';
      case 'bool': return v.value ? '#t' : '#f';
      case 'list': return '(' + v.value.map(show).join(' ') + ')';
      case 'dict': {
        const keys = [...v.value.keys()].sort();
        const parts = [];
        for (const k of keys) {
          parts.push(JSON.stringify(k));
          parts.push(show(v.value.get(k)));
        }
        return '{' + parts.join(' ') + '}';
      }
      case 'fn': return '#<fn>';
      case 'builtin': return '#<builtin ' + v.name + '>';
      case 'err': return '(error ' + JSON.stringify(v.value) + ')';
    }
    return '#<?>';
  }

  function dictKey(v) {
    if (v.tag === 'str' || v.tag === 'sym') return v.value;
    throw new Error(`dict key must be string or symbol, got ${show(v)}`);
  }

  function jsonToValue(v) {
    if (v === null) return NIL;
    if (typeof v === 'boolean') return v ? TRUE : FALSE;
    if (typeof v === 'number') return num(v);
    if (typeof v === 'string') return str(v);
    if (Array.isArray(v)) return list(v.map(jsonToValue));
    if (typeof v === 'object') {
      const m = new Map();
      for (const [k, e] of Object.entries(v)) m.set(k, jsonToValue(e));
      return dict(m);
    }
    throw new Error(`json-parse: unexpected JSON type ${typeof v}`);
  }

  function valueToJSON(v) {
    switch (v.tag) {
      case 'nil': return null;
      case 'bool': return v.value;
      case 'num': return v.value;
      case 'str': return v.value;
      case 'list': return v.value.map(valueToJSON);
      case 'dict': {
        const keys = [...v.value.keys()].sort();
        const o = {};
        for (const k of keys) o[k] = valueToJSON(v.value.get(k));
        return o;
      }
    }
    throw new Error(`json-stringify: cannot serialize ${show(v)}`);
  }

  function formatNum(n) {
    if (!Number.isFinite(n)) return String(n);
    if (Number.isInteger(n) && Math.abs(n) < 1e18) return String(n);
    return String(n);
  }

  function showRaw(v) {
    if (v.tag === 'str') return v.value;
    return show(v);
  }

  function truthy(v) {
    if (v.tag === 'bool') return v.value;
    if (v.tag === 'nil') return false;
    return true;
  }

  function equals(a, b) {
    if (a.tag !== b.tag) return false;
    if (a.tag === 'nil') return true;
    if (a.tag === 'list') {
      if (a.value.length !== b.value.length) return false;
      for (let i = 0; i < a.value.length; i++) {
        if (!equals(a.value[i], b.value[i])) return false;
      }
      return true;
    }
    if (a.tag === 'dict') {
      if (a.value.size !== b.value.size) return false;
      for (const [k, v] of a.value) {
        if (!b.value.has(k)) return false;
        if (!equals(v, b.value.get(k))) return false;
      }
      return true;
    }
    if (a.tag === 'err') return a.value === b.value;
    return a.value === b.value;
  }

  // ---------- Tokenizer ----------
  function tokenize(src) {
    const toks = [];
    let i = 0;
    while (i < src.length) {
      const c = src[i];
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') { i++; continue; }
      if (c === ';') { while (i < src.length && src[i] !== '\n') i++; continue; }
      if (c === '(' || c === ')' || c === '[' || c === ']' || c === '{' || c === '}' || c === "'") { toks.push(c); i++; continue; }
      if (c === '"') {
        let j = i + 1;
        while (j < src.length && src[j] !== '"') {
          if (src[j] === '\\' && j + 1 < src.length) { j += 2; continue; }
          j++;
        }
        if (j >= src.length) { toks.push(src.slice(i)); return toks; }
        toks.push(src.slice(i, j + 1));
        i = j + 1;
        continue;
      }
      let j = i;
      while (j < src.length && !" \t\n\r()[]{}';\"".includes(src[j])) j++;
      toks.push(src.slice(i, j));
      i = j;
    }
    return toks;
  }

  // ---------- Parser ----------
  function read(toks, pos) {
    if (pos.i >= toks.length) return null;
    const t = toks[pos.i++];
    if (t === '(') {
      const items = [];
      while (true) {
        if (pos.i >= toks.length) throw new Error("unclosed '('");
        if (toks[pos.i] === ')') { pos.i++; return list(items); }
        const v = read(toks, pos);
        if (v === null) throw new Error("unclosed '('");
        items.push(v);
      }
    }
    if (t === ')') throw new Error("unexpected ')'");
    if (t === '[') {
      // [a b c] desugars to (list a b c). Empty [] is (list).
      const items = [sym('list')];
      while (true) {
        if (pos.i >= toks.length) throw new Error("unclosed '['");
        if (toks[pos.i] === ']') { pos.i++; return list(items); }
        const v = read(toks, pos);
        if (v === null) throw new Error("unclosed '['");
        items.push(v);
      }
    }
    if (t === ']') throw new Error("unexpected ']'");
    if (t === '{') {
      // {"k" v ...} desugars to (dict "k" v ...). Empty {} is (dict).
      const items = [sym('dict')];
      while (true) {
        if (pos.i >= toks.length) throw new Error("unclosed '{'");
        if (toks[pos.i] === '}') { pos.i++; return list(items); }
        const v = read(toks, pos);
        if (v === null) throw new Error("unclosed '{'");
        items.push(v);
      }
    }
    if (t === '}') throw new Error("unexpected '}'");
    if (t === "'") {
      const v = read(toks, pos);
      if (v === null) throw new Error("quote: missing arg");
      return list([sym('quote'), v]);
    }
    return atom(t);
  }

  function atom(t) {
    if (t === '#t') return TRUE;
    if (t === '#f') return FALSE;
    if (t === 'nil') return NIL;
    if (t.length >= 2 && t[0] === '"' && t[t.length - 1] === '"') {
      try { return str(JSON.parse(t)); }
      catch { return str(t.slice(1, -1)); }
    }
    if (t !== '' && t !== '+' && t !== '-' && t !== '.' && !isNaN(Number(t))) {
      return num(Number(t));
    }
    return sym(t);
  }

  function parseAll(src) {
    const toks = tokenize(src);
    const pos = { i: 0 };
    const out = [];
    while (pos.i < toks.length) {
      const v = read(toks, pos);
      if (v === null) break;
      out.push(v);
    }
    return out;
  }

  // ---------- Env ----------
  function newEnv(parent) { return { parent, vars: new Map() }; }
  function envLookup(e, name) {
    for (let env = e; env; env = env.parent) {
      if (env.vars.has(name)) return env.vars.get(name);
    }
    throw new Error('unbound: ' + name);
  }
  function envSet(e, name, v) { e.vars.set(name, v); }
  function envSetExisting(e, name, v) {
    for (let env = e; env; env = env.parent) {
      if (env.vars.has(name)) { env.vars.set(name, v); return; }
    }
    throw new Error('set!: unbound: ' + name);
  }

  // ---------- Eval (trampoline for TCO) ----------
  function evalExpr(v, env) {
    while (true) {
      switch (v.tag) {
        case 'num': case 'str': case 'bool': case 'nil':
        case 'fn': case 'builtin': case 'err':
          return v;
        case 'sym':
          return envLookup(env, v.value);
        case 'list': {
          const xs = v.value;
          if (xs.length === 0) return NIL;
          const head = xs[0];
          if (head.tag === 'sym') {
            const name = head.value;
            switch (name) {
              case 'quote':
                if (xs.length !== 2) throw new Error('quote: need 1 arg');
                return xs[1];
              case 'if': {
                if (xs.length < 3 || xs.length > 4) throw new Error('if: need 2 or 3 args');
                const cond = evalExpr(xs[1], env);
                if (truthy(cond)) { v = xs[2]; continue; }
                if (xs.length === 4) { v = xs[3]; continue; }
                return NIL;
              }
              case 'cond': {
                let matched = false;
                for (let k = 1; k < xs.length; k++) {
                  const cl = xs[k];
                  if (cl.tag !== 'list' || cl.value.length === 0) {
                    throw new Error('cond: clause must be non-empty list');
                  }
                  const cv = cl.value;
                  let c;
                  if (cv[0].tag === 'sym' && cv[0].value === 'else') c = TRUE;
                  else c = evalExpr(cv[0], env);
                  if (truthy(c)) {
                    const body = cv.slice(1);
                    if (body.length === 0) return c;
                    for (let m = 0; m < body.length - 1; m++) evalExpr(body[m], env);
                    v = body[body.length - 1];
                    matched = true;
                    break;
                  }
                }
                if (matched) continue;
                return NIL;
              }
              case 'def': {
                if (xs.length !== 3) throw new Error('def: need name + value');
                if (xs[1].tag !== 'sym') throw new Error('def: name must be symbol');
                const val = evalExpr(xs[2], env);
                envSet(env, xs[1].value, val);
                return val;
              }
              case 'set!': {
                if (xs.length !== 3) throw new Error('set!: need name + value');
                if (xs[1].tag !== 'sym') throw new Error('set!: name must be symbol');
                const val = evalExpr(xs[2], env);
                envSetExisting(env, xs[1].value, val);
                return val;
              }
              case 'fn': {
                if (xs.length < 3) throw new Error('fn: need params + body');
                if (xs[1].tag !== 'list') throw new Error('fn: params must be list');
                const params = xs[1].value.map((p) => {
                  if (p.tag !== 'sym') throw new Error('fn: params must be symbols');
                  return p.value;
                });
                return { tag: 'fn', params, body: xs.slice(2), env };
              }
              case 'let': {
                if (xs.length < 3) throw new Error('let: need bindings + body');
                if (xs[1].tag !== 'list') throw new Error('let: bindings must be list');
                const sub = newEnv(env);
                for (const b of xs[1].value) {
                  if (b.tag !== 'list' || b.value.length !== 2) {
                    throw new Error('let: each binding must be (name value)');
                  }
                  if (b.value[0].tag !== 'sym') throw new Error('let: binding name must be symbol');
                  const val = evalExpr(b.value[1], env);
                  envSet(sub, b.value[0].value, val);
                }
                const body = xs.slice(2);
                for (let m = 0; m < body.length - 1; m++) evalExpr(body[m], sub);
                env = sub;
                v = body[body.length - 1];
                continue;
              }
              case 'begin': {
                const body = xs.slice(1);
                if (body.length === 0) return NIL;
                for (let m = 0; m < body.length - 1; m++) evalExpr(body[m], env);
                v = body[body.length - 1];
                continue;
              }
              case 'and': {
                let last = TRUE;
                for (let k = 1; k < xs.length; k++) {
                  const r = evalExpr(xs[k], env);
                  if (!truthy(r)) return r;
                  last = r;
                }
                return last;
              }
              case 'or': {
                for (let k = 1; k < xs.length; k++) {
                  const r = evalExpr(xs[k], env);
                  if (truthy(r)) return r;
                }
                return FALSE;
              }
              case 'try': {
                if (xs.length < 2 || xs.length > 3) {
                  throw new Error('try: need 1 or 2 args (expr [handler])');
                }
                let errVal;
                try {
                  return evalExpr(xs[1], env);
                } catch (e) {
                  errVal = err(e.message != null ? String(e.message) : String(e));
                }
                if (xs.length === 2) return errVal;
                const handler = evalExpr(xs[2], env);
                if (handler.tag === 'builtin') return handler.f([errVal]);
                if (handler.tag === 'fn') {
                  if (handler.params.length !== 1) {
                    throw new Error(`try: handler must take 1 arg, got ${handler.params.length}`);
                  }
                  const sub = newEnv(handler.env);
                  envSet(sub, handler.params[0], errVal);
                  for (let m = 0; m < handler.body.length - 1; m++) evalExpr(handler.body[m], sub);
                  v = handler.body[handler.body.length - 1];
                  env = sub;
                  continue;
                }
                throw new Error('try: handler not callable: ' + show(handler));
              }
            }
          }
          // function application
          const fn = evalExpr(xs[0], env);
          const args = new Array(xs.length - 1);
          for (let k = 1; k < xs.length; k++) args[k - 1] = evalExpr(xs[k], env);
          if (fn.tag === 'builtin') return fn.f(args);
          if (fn.tag === 'fn') {
            if (args.length !== fn.params.length) {
              throw new Error(`arity: need ${fn.params.length}, got ${args.length}`);
            }
            const sub = newEnv(fn.env);
            for (let k = 0; k < fn.params.length; k++) envSet(sub, fn.params[k], args[k]);
            for (let m = 0; m < fn.body.length - 1; m++) evalExpr(fn.body[m], sub);
            env = sub;
            v = fn.body[fn.body.length - 1];
            continue;
          }
          throw new Error('not callable: ' + show(fn));
        }
        default:
          throw new Error('unknown value: ' + JSON.stringify(v));
      }
    }
  }

  // ---------- Primitives ----------
  function defaultEnv(out) {
    const env = newEnv(null);
    const reduce = (name, op) => ({ tag: 'builtin', name, f: (args) => {
      if (args.length === 0) throw new Error(name + ': need at least 1 arg');
      if (args[0].tag !== 'num') throw new Error(`${name}: need number, got ${show(args[0])}`);
      let acc = args[0].value;
      if (args.length === 1 && (name === '-' || name === '/')) {
        return num(name === '-' ? -acc : 1 / acc);
      }
      for (let i = 1; i < args.length; i++) {
        if (args[i].tag !== 'num') throw new Error(`${name}: need number, got ${show(args[i])}`);
        acc = op(acc, args[i].value);
      }
      return num(acc);
    }});
    const cmp = (name, op) => ({ tag: 'builtin', name, f: (args) => {
      if (args.length < 2) return TRUE;
      for (let i = 0; i < args.length - 1; i++) {
        if (args[i].tag !== 'num' || args[i + 1].tag !== 'num') {
          throw new Error(`${name}: need number`);
        }
        if (!op(args[i].value, args[i + 1].value)) return FALSE;
      }
      return TRUE;
    }});

    envSet(env, '+', reduce('+', (a, b) => a + b));
    envSet(env, '-', reduce('-', (a, b) => a - b));
    envSet(env, '*', reduce('*', (a, b) => a * b));
    envSet(env, '/', reduce('/', (a, b) => a / b));
    envSet(env, '<', cmp('<', (a, b) => a < b));
    envSet(env, '>', cmp('>', (a, b) => a > b));
    envSet(env, '<=', cmp('<=', (a, b) => a <= b));
    envSet(env, '>=', cmp('>=', (a, b) => a >= b));
    envSet(env, '=', cmp('=', (a, b) => a === b));
    envSet(env, 'mod', { tag: 'builtin', name: 'mod', f: (args) => {
      if (args.length !== 2) throw new Error('mod: need 2 args');
      if (args[0].tag !== 'num' || args[1].tag !== 'num') throw new Error('mod: need numbers');
      const a = Math.trunc(args[0].value);
      const b = Math.trunc(args[1].value);
      if (b === 0) throw new Error('mod: div by zero');
      return num(a - Math.trunc(a / b) * b);
    }});

    envSet(env, 'list', { tag: 'builtin', name: 'list', f: (args) => list(args.slice()) });
    envSet(env, 'cons', { tag: 'builtin', name: 'cons', f: (args) => {
      if (args.length !== 2) throw new Error('cons: need 2 args');
      if (args[1].tag === 'list') return list([args[0], ...args[1].value]);
      if (args[1].tag === 'nil') return list([args[0]]);
      throw new Error('cons: second arg must be list or nil');
    }});
    envSet(env, 'car', { tag: 'builtin', name: 'car', f: (args) => {
      if (args.length !== 1) throw new Error('car: need 1 arg');
      if (args[0].tag !== 'list' || args[0].value.length === 0) throw new Error('car: empty or not list');
      return args[0].value[0];
    }});
    envSet(env, 'cdr', { tag: 'builtin', name: 'cdr', f: (args) => {
      if (args.length !== 1) throw new Error('cdr: need 1 arg');
      if (args[0].tag !== 'list' || args[0].value.length === 0) throw new Error('cdr: empty or not list');
      return list(args[0].value.slice(1));
    }});
    envSet(env, 'null?', { tag: 'builtin', name: 'null?', f: (args) => {
      if (args.length !== 1) throw new Error('null?: need 1 arg');
      if (args[0].tag === 'nil') return TRUE;
      if (args[0].tag === 'list') return args[0].value.length === 0 ? TRUE : FALSE;
      return FALSE;
    }});
    envSet(env, 'pair?', { tag: 'builtin', name: 'pair?', f: (args) => {
      if (args.length !== 1) throw new Error('pair?: need 1 arg');
      return (args[0].tag === 'list' && args[0].value.length > 0) ? TRUE : FALSE;
    }});
    envSet(env, 'eq?', { tag: 'builtin', name: 'eq?', f: (args) => {
      if (args.length !== 2) throw new Error('eq?: need 2 args');
      return equals(args[0], args[1]) ? TRUE : FALSE;
    }});
    envSet(env, 'not', { tag: 'builtin', name: 'not', f: (args) => {
      if (args.length !== 1) throw new Error('not: need 1 arg');
      return truthy(args[0]) ? FALSE : TRUE;
    }});

    envSet(env, 'print', { tag: 'builtin', name: 'print', f: (args) => {
      out(args.map(showRaw).join(' ') + '\n');
      return NIL;
    }});
    envSet(env, 'display', { tag: 'builtin', name: 'display', f: (args) => {
      for (const a of args) out(showRaw(a));
      return NIL;
    }});
    envSet(env, 'newline', { tag: 'builtin', name: 'newline', f: () => { out('\n'); return NIL; }});

    envSet(env, 'apply', { tag: 'builtin', name: 'apply', f: (args) => {
      if (args.length !== 2) throw new Error('apply: need 2 args (fn args-list)');
      const fn = args[0];
      let callArgs;
      if (args[1].tag === 'list') callArgs = args[1].value.slice();
      else if (args[1].tag === 'nil') callArgs = [];
      else throw new Error('apply: second arg must be list');
      if (fn.tag === 'builtin') return fn.f(callArgs);
      if (fn.tag === 'fn') {
        if (callArgs.length !== fn.params.length) {
          throw new Error(`arity: need ${fn.params.length}, got ${callArgs.length}`);
        }
        const sub = newEnv(fn.env);
        for (let i = 0; i < fn.params.length; i++) envSet(sub, fn.params[i], callArgs[i]);
        let last = NIL;
        for (const b of fn.body) last = evalExpr(b, sub);
        return last;
      }
      throw new Error(`apply: not callable: ${show(fn)}`);
    }});
    envSet(env, 'string-length', { tag: 'builtin', name: 'string-length', f: (args) => {
      if (args.length !== 1) throw new Error('string-length: need 1 arg');
      if (args[0].tag !== 'str') throw new Error(`string-length: need string, got ${show(args[0])}`);
      return num([...args[0].value].length);
    }});
    envSet(env, 'string-append', { tag: 'builtin', name: 'string-append', f: (args) => {
      let s = '';
      for (const a of args) {
        if (a.tag !== 'str') throw new Error(`string-append: need string, got ${show(a)}`);
        s += a.value;
      }
      return { tag: 'str', value: s };
    }});
    envSet(env, 'number->string', { tag: 'builtin', name: 'number->string', f: (args) => {
      if (args.length !== 1) throw new Error('number->string: need 1 arg');
      if (args[0].tag !== 'num') throw new Error(`number->string: need number, got ${show(args[0])}`);
      return { tag: 'str', value: formatNum(args[0].value) };
    }});
    envSet(env, 'string->number', { tag: 'builtin', name: 'string->number', f: (args) => {
      if (args.length !== 1) throw new Error('string->number: need 1 arg');
      if (args[0].tag !== 'str') throw new Error(`string->number: need string, got ${show(args[0])}`);
      const s = args[0].value.trim();
      if (s.length === 0) return NIL;
      const n = Number(s);
      if (!Number.isFinite(n)) return NIL;
      return num(n);
    }});
    envSet(env, 'string-contains?', { tag: 'builtin', name: 'string-contains?', f: (args) => {
      if (args.length !== 2) throw new Error('string-contains?: need 2 args (haystack needle)');
      if (args[0].tag !== 'str') throw new Error(`string-contains?: need string, got ${show(args[0])}`);
      if (args[1].tag !== 'str') throw new Error(`string-contains?: need string, got ${show(args[1])}`);
      return args[0].value.includes(args[1].value) ? TRUE : FALSE;
    }});
    envSet(env, 'string-split', { tag: 'builtin', name: 'string-split', f: (args) => {
      if (args.length !== 2) throw new Error('string-split: need 2 args (string delimiter)');
      if (args[0].tag !== 'str') throw new Error(`string-split: need string, got ${show(args[0])}`);
      if (args[1].tag !== 'str') throw new Error(`string-split: need string, got ${show(args[1])}`);
      const parts = args[0].value.split(args[1].value);
      return list(parts.map((p) => str(p)));
    }});
    envSet(env, 'string-replace', { tag: 'builtin', name: 'string-replace', f: (args) => {
      if (args.length !== 3) throw new Error('string-replace: need 3 args (string old new)');
      if (args[0].tag !== 'str') throw new Error(`string-replace: need string, got ${show(args[0])}`);
      if (args[1].tag !== 'str') throw new Error(`string-replace: need string, got ${show(args[1])}`);
      if (args[2].tag !== 'str') throw new Error(`string-replace: need string, got ${show(args[2])}`);
      return str(args[0].value.split(args[1].value).join(args[2].value));
    }});
    envSet(env, 'substring', { tag: 'builtin', name: 'substring', f: (args) => {
      if (args.length !== 2 && args.length !== 3) throw new Error('substring: need 2 or 3 args (string start [end])');
      if (args[0].tag !== 'str') throw new Error(`substring: need string, got ${show(args[0])}`);
      if (args[1].tag !== 'num') throw new Error(`substring: need number for start, got ${show(args[1])}`);
      const runes = [...args[0].value];
      let startIdx = args[1].value | 0;
      if (startIdx < 0) startIdx = 0;
      if (startIdx > runes.length) startIdx = runes.length;
      let endIdx = runes.length;
      if (args.length === 3) {
        if (args[2].tag !== 'num') throw new Error(`substring: need number for end, got ${show(args[2])}`);
        endIdx = args[2].value | 0;
        if (endIdx < startIdx) endIdx = startIdx;
        if (endIdx > runes.length) endIdx = runes.length;
      }
      return str(runes.slice(startIdx, endIdx).join(''));
    }});
    envSet(env, 'string-upcase', { tag: 'builtin', name: 'string-upcase', f: (args) => {
      if (args.length !== 1) throw new Error('string-upcase: need 1 arg');
      if (args[0].tag !== 'str') throw new Error(`string-upcase: need string, got ${show(args[0])}`);
      return str(args[0].value.toUpperCase());
    }});
    envSet(env, 'string-downcase', { tag: 'builtin', name: 'string-downcase', f: (args) => {
      if (args.length !== 1) throw new Error('string-downcase: need 1 arg');
      if (args[0].tag !== 'str') throw new Error(`string-downcase: need string, got ${show(args[0])}`);
      return str(args[0].value.toLowerCase());
    }});
    envSet(env, 'string-trim', { tag: 'builtin', name: 'string-trim', f: (args) => {
      if (args.length !== 1) throw new Error('string-trim: need 1 arg');
      if (args[0].tag !== 'str') throw new Error(`string-trim: need string, got ${show(args[0])}`);
      return str(args[0].value.trim());
    }});
    envSet(env, 'string-join', { tag: 'builtin', name: 'string-join', f: (args) => {
      if (args.length < 1 || args.length > 2) throw new Error('string-join: need 1-2 args (list [separator])');
      if (args[0].tag !== 'list') throw new Error(`string-join: need list, got ${show(args[0])}`);
      const sep = args.length === 2 ? (args[1].tag === 'str' ? args[1].value : (() => { throw new Error(`string-join: separator must be string, got ${show(args[1])}`); })()) : '';
      const parts = args[0].items.map(v => v.tag === 'str' ? v.value : v.tag === 'num' ? String(v.value) : show(v));
      return str(parts.join(sep));
    }});

    // ---------- Regex ----------
    // Patterns are JS RegExp syntax with the `u` flag (unicode-aware) — close
    // enough to Go's RE2 for everyday patterns. Replacement strings use $1, $2,
    // ... for captured groups.
    const reCompile = (name, p, flags) => {
      if (p.tag !== 'str') throw new Error(`${name}: need string for pattern, got ${show(p)}`);
      try {
        return new RegExp(p.value, flags);
      } catch (e) {
        throw new Error(`${name}: bad pattern "${p.value}": ${e.message}`);
      }
    };
    envSet(env, 're-match?', { tag: 'builtin', name: 're-match?', f: (args) => {
      if (args.length !== 2) throw new Error('re-match?: need 2 args (string pattern)');
      if (args[0].tag !== 'str') throw new Error(`re-match?: need string, got ${show(args[0])}`);
      const re = reCompile('re-match?', args[1], 'u');
      return re.test(args[0].value) ? TRUE : FALSE;
    }});
    envSet(env, 're-find', { tag: 'builtin', name: 're-find', f: (args) => {
      if (args.length !== 2) throw new Error('re-find: need 2 args (string pattern)');
      if (args[0].tag !== 'str') throw new Error(`re-find: need string, got ${show(args[0])}`);
      const re = reCompile('re-find', args[1], 'u');
      const m = args[0].value.match(re);
      return m === null ? NIL : str(m[0]);
    }});
    envSet(env, 're-find-all', { tag: 'builtin', name: 're-find-all', f: (args) => {
      if (args.length !== 2) throw new Error('re-find-all: need 2 args (string pattern)');
      if (args[0].tag !== 'str') throw new Error(`re-find-all: need string, got ${show(args[0])}`);
      const re = reCompile('re-find-all', args[1], 'gu');
      const out = [];
      for (const m of args[0].value.matchAll(re)) out.push(str(m[0]));
      return list(out);
    }});
    envSet(env, 're-replace', { tag: 'builtin', name: 're-replace', f: (args) => {
      if (args.length !== 3) throw new Error('re-replace: need 3 args (string pattern replacement)');
      if (args[0].tag !== 'str') throw new Error(`re-replace: need string, got ${show(args[0])}`);
      const re = reCompile('re-replace', args[1], 'gu');
      if (args[2].tag !== 'str') throw new Error(`re-replace: need string for replacement, got ${show(args[2])}`);
      return str(args[0].value.replace(re, args[2].value));
    }});
    envSet(env, 're-split', { tag: 'builtin', name: 're-split', f: (args) => {
      if (args.length !== 2) throw new Error('re-split: need 2 args (string pattern)');
      if (args[0].tag !== 'str') throw new Error(`re-split: need string, got ${show(args[0])}`);
      const re = reCompile('re-split', args[1], 'u');
      return list(args[0].value.split(re).map((p) => str(p)));
    }});

    // ---------- Dicts ----------
    envSet(env, 'dict', { tag: 'builtin', name: 'dict', f: (args) => {
      if (args.length % 2 !== 0) throw new Error('dict: need even number of args (key value pairs)');
      const m = new Map();
      for (let i = 0; i < args.length; i += 2) {
        m.set(dictKey(args[i]), args[i + 1]);
      }
      return dict(m);
    }});
    envSet(env, 'dict?', { tag: 'builtin', name: 'dict?', f: (args) => {
      if (args.length !== 1) throw new Error('dict?: need 1 arg');
      return args[0].tag === 'dict' ? TRUE : FALSE;
    }});
    envSet(env, 'dict-get', { tag: 'builtin', name: 'dict-get', f: (args) => {
      if (args.length < 2 || args.length > 3) throw new Error('dict-get: need 2 or 3 args (dict key [default])');
      if (args[0].tag !== 'dict') throw new Error(`dict-get: need dict, got ${show(args[0])}`);
      const k = dictKey(args[1]);
      if (args[0].value.has(k)) return args[0].value.get(k);
      return args.length === 3 ? args[2] : NIL;
    }});
    envSet(env, 'dict-set', { tag: 'builtin', name: 'dict-set', f: (args) => {
      if (args.length !== 3) throw new Error('dict-set: need 3 args (dict key value)');
      if (args[0].tag !== 'dict') throw new Error(`dict-set: need dict, got ${show(args[0])}`);
      const k = dictKey(args[1]);
      const m = new Map(args[0].value);
      m.set(k, args[2]);
      return dict(m);
    }});
    envSet(env, 'dict-del', { tag: 'builtin', name: 'dict-del', f: (args) => {
      if (args.length !== 2) throw new Error('dict-del: need 2 args (dict key)');
      if (args[0].tag !== 'dict') throw new Error(`dict-del: need dict, got ${show(args[0])}`);
      const k = dictKey(args[1]);
      const m = new Map(args[0].value);
      m.delete(k);
      return dict(m);
    }});
    envSet(env, 'dict-has?', { tag: 'builtin', name: 'dict-has?', f: (args) => {
      if (args.length !== 2) throw new Error('dict-has?: need 2 args (dict key)');
      if (args[0].tag !== 'dict') throw new Error(`dict-has?: need dict, got ${show(args[0])}`);
      return args[0].value.has(dictKey(args[1])) ? TRUE : FALSE;
    }});
    envSet(env, 'dict-keys', { tag: 'builtin', name: 'dict-keys', f: (args) => {
      if (args.length !== 1) throw new Error('dict-keys: need 1 arg');
      if (args[0].tag !== 'dict') throw new Error(`dict-keys: need dict, got ${show(args[0])}`);
      const keys = [...args[0].value.keys()].sort();
      return list(keys.map((k) => str(k)));
    }});
    envSet(env, 'dict-values', { tag: 'builtin', name: 'dict-values', f: (args) => {
      if (args.length !== 1) throw new Error('dict-values: need 1 arg');
      if (args[0].tag !== 'dict') throw new Error(`dict-values: need dict, got ${show(args[0])}`);
      const keys = [...args[0].value.keys()].sort();
      return list(keys.map((k) => args[0].value.get(k)));
    }});
    envSet(env, 'dict-size', { tag: 'builtin', name: 'dict-size', f: (args) => {
      if (args.length !== 1) throw new Error('dict-size: need 1 arg');
      if (args[0].tag !== 'dict') throw new Error(`dict-size: need dict, got ${show(args[0])}`);
      return num(args[0].value.size);
    }});

    // ---------- JSON ----------
    envSet(env, 'json-parse', { tag: 'builtin', name: 'json-parse', f: (args) => {
      if (args.length !== 1) throw new Error('json-parse: need 1 arg');
      if (args[0].tag !== 'str') throw new Error(`json-parse: need string, got ${show(args[0])}`);
      let raw;
      try { raw = JSON.parse(args[0].value); }
      catch (e) { throw new Error('json-parse: ' + e.message); }
      return jsonToValue(raw);
    }});
    envSet(env, 'json-stringify', { tag: 'builtin', name: 'json-stringify', f: (args) => {
      if (args.length !== 1) throw new Error('json-stringify: need 1 arg');
      return str(JSON.stringify(valueToJSON(args[0])));
    }});

    // ---------- File IO (browser stubs) ----------
    const noFileIO = (name) => { throw new Error(`${name}: file IO not available in browser`); };
    envSet(env, 'read-file', { tag: 'builtin', name: 'read-file', f: () => noFileIO('read-file') });
    envSet(env, 'write-file', { tag: 'builtin', name: 'write-file', f: () => noFileIO('write-file') });
    envSet(env, 'append-file', { tag: 'builtin', name: 'append-file', f: () => noFileIO('append-file') });
    envSet(env, 'file-exists?', { tag: 'builtin', name: 'file-exists?', f: () => noFileIO('file-exists?') });
    envSet(env, 'list-dir', { tag: 'builtin', name: 'list-dir', f: () => noFileIO('list-dir') });

    // ---------- HTTP (browser stub — eval is sync, fetch is async) ----------
    envSet(env, 'http-get', { tag: 'builtin', name: 'http-get', f: () => {
      throw new Error('http-get: not available in the browser REPL — wick eval is synchronous, fetch is async. Use the Wick CLI.');
    }});
    envSet(env, 'http-post', { tag: 'builtin', name: 'http-post', f: () => {
      throw new Error('http-post: not available in the browser REPL — wick eval is synchronous, fetch is async. Use the Wick CLI.');
    }});

    // ---------- Errors ----------
    envSet(env, 'error?', { tag: 'builtin', name: 'error?', f: (args) => {
      if (args.length !== 1) throw new Error('error?: need 1 arg');
      return args[0].tag === 'err' ? TRUE : FALSE;
    }});
    envSet(env, 'error-message', { tag: 'builtin', name: 'error-message', f: (args) => {
      if (args.length !== 1) throw new Error('error-message: need 1 arg');
      if (args[0].tag !== 'err') throw new Error(`error-message: need error, got ${show(args[0])}`);
      return str(args[0].value);
    }});
    envSet(env, 'raise', { tag: 'builtin', name: 'raise', f: (args) => {
      if (args.length !== 1) throw new Error('raise: need 1 arg (message)');
      if (args[0].tag !== 'str') throw new Error(`raise: need string, got ${show(args[0])}`);
      throw new Error(args[0].value);
    }});

    return env;
  }

  // ---------- Stdlib ----------
  const STDLIB = `
(def length (fn (xs)
  (if (null? xs) 0 (+ 1 (length (cdr xs))))))

(def map (fn (f xs)
  (if (null? xs) '()
      (cons (f (car xs)) (map f (cdr xs))))))

(def filter (fn (pred xs)
  (if (null? xs) '()
      (if (pred (car xs))
          (cons (car xs) (filter pred (cdr xs)))
          (filter pred (cdr xs))))))

(def fold (fn (f init xs)
  (if (null? xs) init
      (fold f (f init (car xs)) (cdr xs)))))

(def reverse (fn (xs)
  (fold (fn (acc x) (cons x acc)) '() xs)))

(def sum     (fn (xs) (fold + 0 xs)))
(def product (fn (xs) (fold * 1 xs)))

(def range-helper (fn (i acc)
  (if (< i 0) acc (range-helper (- i 1) (cons i acc)))))
(def range (fn (n) (range-helper (- n 1) '())))

(def take (fn (n xs)
  (if (or (= n 0) (null? xs)) '()
      (cons (car xs) (take (- n 1) (cdr xs))))))

(def nth (fn (n xs)
  (if (= n 0) (car xs) (nth (- n 1) (cdr xs)))))

(def drop (fn (n xs)
  (if (or (= n 0) (null? xs)) xs
      (drop (- n 1) (cdr xs)))))

(def take-while (fn (pred xs)
  (if (null? xs) '()
      (if (pred (car xs))
          (cons (car xs) (take-while pred (cdr xs)))
          '()))))

(def drop-while (fn (pred xs)
  (if (null? xs) '()
      (if (pred (car xs))
          (drop-while pred (cdr xs))
          xs))))

(def last (fn (xs)
  (if (null? (cdr xs)) (car xs) (last (cdr xs)))))

(def append (fn (xs ys)
  (if (null? xs) ys
      (cons (car xs) (append (cdr xs) ys)))))

(def inc (fn (n) (+ n 1)))
(def dec (fn (n) (- n 1)))
(def zero?     (fn (n) (= n 0)))
(def positive? (fn (n) (> n 0)))
(def negative? (fn (n) (< n 0)))
(def even? (fn (n) (= (mod n 2) 0)))
(def odd?  (fn (n) (= (mod n 2) 1)))

(def abs (fn (n) (if (< n 0) (- 0 n) n)))

(def min (fn (xs)
  (fold (fn (a b) (if (< a b) a b)) (car xs) (cdr xs))))
(def max (fn (xs)
  (fold (fn (a b) (if (> a b) a b)) (car xs) (cdr xs))))

(def member? (fn (x xs)
  (if (null? xs) #f
      (if (eq? x (car xs)) #t (member? x (cdr xs))))))

(def find (fn (pred xs)
  (if (null? xs) #f
      (if (pred (car xs)) (car xs)
          (find pred (cdr xs))))))

(def any? (fn (pred xs)
  (if (null? xs) #f
      (if (pred (car xs)) #t
          (any? pred (cdr xs))))))

(def all? (fn (pred xs)
  (if (null? xs) #t
      (if (pred (car xs)) (all? pred (cdr xs))
          #f))))

(def sort (fn (cmp xs)
  (if (or (null? xs) (null? (cdr xs))) xs
      (let ((pivot (car xs))
            (rest  (cdr xs)))
        (append
          (sort cmp (filter (fn (y) (cmp y pivot)) rest))
          (cons pivot
            (sort cmp (filter (fn (y) (not (cmp y pivot))) rest))))))))

(def for-each (fn (f xs)
  (if (null? xs) nil
      (begin (f (car xs)) (for-each f (cdr xs))))))
`;

  function runSource(src, env) {
    const vals = parseAll(src);
    let last = NIL;
    for (const v of vals) last = evalExpr(v, env);
    return last;
  }

  function makeEnv(out) {
    const env = defaultEnv(out);
    runSource(STDLIB, env);
    return env;
  }

  // Public API on window.
  globalThis.Wick = { makeEnv, runSource, show, NIL };
})();
