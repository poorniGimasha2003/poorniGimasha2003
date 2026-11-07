#!/usr/bin/env node
// Commit Garden: turns your GitHub commits into an animated tree SVG for your profile README.
// No dependencies. Needs Node 18+.
//   GH_USER=poorniGimasha2003 GH_TOKEN=xxx node garden/build.mjs
//   node garden/build.mjs --demo        (sample data, no network)
import fs from 'node:fs';

const env = process.env;
const USER = env.GH_USER || 'poorniGimasha2003';
const TOKEN = env.GH_TOKEN || '';
const OUT = env.OUT || 'commit-garden.svg';
const TZ_MIN = Number(env.TZ_OFFSET_MIN ?? 330); // Asia/Colombo = UTC+5:30
const INCLUDE_PRIVATE = env.INCLUDE_PRIVATE === 'true';
const MASK_PRIVATE = env.MASK_PRIVATE !== 'false';
const list = s => (s || '').split(',').map(x => x.trim()).filter(Boolean);
const EXTRA = list(env.EXTRA_REPOS);   // e.g. "Synexis/bedsense-firmware,someone/repo"
const SKIP = new Set(list(env.SKIP_REPOS));
const DAY = 864e5;

/* ---------------- helpers ---------------- */
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let a = seed >>> 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const local = ts => new Date(ts + TZ_MIN * 6e4);           // read with getUTC*()
const dayIdx = ts => Math.floor((ts + TZ_MIN * 6e4) / DAY);
const f = n => +n.toFixed(2);
const fmt = n => n >= 1e4 ? (n / 1e3).toFixed(1) + 'k' : n.toLocaleString('en-US');

/* ---------------- data ---------------- */
async function api(path) {
  const r = await fetch('https://api.github.com' + path, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'commit-garden', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
  });
  if (r.status === 409 || r.status === 404) return []; // empty or missing repo
  if (!r.ok) throw new Error(`GitHub API ${r.status} on ${path}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}
async function fetchCommits() {
  const repos = [];
  for (let p = 1; p <= 5; p++) {
    const page = await api(INCLUDE_PRIVATE
      ? `/user/repos?affiliation=owner&per_page=100&page=${p}`
      : `/users/${USER}/repos?type=owner&per_page=100&page=${p}`);
    repos.push(...page);
    if (page.length < 100) break;
  }
  const targets = repos.filter(r => !r.fork).map(r => ({ full: r.full_name, name: r.name, priv: r.private }));
  for (const full of EXTRA) if (!targets.some(t => t.full.toLowerCase() === full.toLowerCase())) targets.push({ full, name: full.split('/')[1], priv: false });
  const out = []; let secret = 0;
  for (const t of targets) {
    if (SKIP.has(t.full) || SKIP.has(t.name)) continue;
    const label = t.priv && MASK_PRIVATE ? `secret-branch-${++secret}` : t.name;
    for (let p = 1; p <= 10; p++) {
      const cs = await api(`/repos/${t.full}/commits?author=${USER}&per_page=100&page=${p}`);
      for (const c of cs) {
        if (c.parents && c.parents.length > 1) continue; // skip merges
        out.push({ repo: label, hash: c.sha, ts: Date.parse(c.commit.author.date), msg: (c.commit.message || '').split('\n')[0] });
      }
      if (cs.length < 100) break;
    }
    console.log(`  ${label}: ${out.filter(c => c.repo === label).length} commits`);
  }
  return out;
}
function demoCommits() {
  const r = rng(7), now = Date.now(), out = [];
  const repos = [['dnn-compression', 300, 0, .9], ['grc-copilot', 200, 20, 1.1], ['retail-customer-intelligence', 260, 90, .7], ['bedsense-firmware', 160, 0, .8], ['portfolio', 380, 0, .25], ['nlp-coursework', 330, 180, .6]];
  const msgs = { feat: ['feat: add pipeline', 'add dashboard', 'implement pruning step'], fix: ['fix: bug in loader', 'hotfix build'], docs: ['docs: update README'], leaf: ['refactor', 'chore: deps', 'wip', 'tests'] };
  for (const [name, start, end, rate] of repos) {
    const ph = r() * 6;
    for (let d = start; d >= end; d--) {
      let p = rate * (.45 + .55 * Math.sin(d / 19 + ph)), n = 0;
      while (r() < p * .6 && n < 6) { n++; p *= .8; }
      for (let k = 0; k < n; k++) {
        const hr = r() < .25 ? Math.floor(r() * 3) : 9 + Math.floor(r() * 14);
        const ts = Math.floor((now - d * DAY) / DAY) * DAY + (hr - 5.5) * 36e5 + r() * 36e5;
        const tr = r(), ty = tr < .25 ? 'feat' : tr < .45 ? 'fix' : tr < .55 ? 'docs' : 'leaf';
        if (ts < now) out.push({ repo: name, hash: Math.floor(r() * 1e9).toString(16), ts, msg: msgs[ty][Math.floor(r() * msgs[ty].length)] });
      }
    }
  }
  return out;
}
function ctype(msg) {
  const m = msg.toLowerCase();
  if (/\bfix|bug|patch|hotfix|resolve/.test(m)) return 'fix';
  if (/^feat|\bfeat\b|^add\b|implement|^new\b|introduce/.test(m)) return 'feat';
  if (/\bdocs?\b|readme/.test(m)) return 'docs';
  return 'leaf';
}

/* ---------------- stats ---------------- */
const TIERS = [[1, 'Seed'], [2, 'Sprout'], [4, 'Sapling'], [7, 'Young Tree'], [11, 'Oak'], [16, 'Ancient Oak'], [23, 'World Tree']];
function stats(commits, repoCount) {
  const hours = new Array(24).fill(0), days = new Set();
  for (const c of commits) { hours[local(c.ts).getUTCHours()]++; days.add(dayIdx(c.ts)); }
  const dl = [...days].sort((a, b) => a - b);
  let best = 0, run = 0, prev = null;
  for (const d of dl) { run = prev !== null && d === prev + 1 ? run + 1 : 1; best = Math.max(best, run); prev = d; }
  let cur = 0;
  if (dl.length && dayIdx(Date.now()) - dl[dl.length - 1] <= 1) { cur = 1; for (let i = dl.length - 2; i >= 0 && dl[i] === dl[i + 1] - 1; i--) cur++; }
  const xp = commits.length * 10 + days.size * 5;
  const lv = Math.floor(Math.sqrt(xp / 40)) + 1, lo = 40 * (lv - 1) ** 2, hi = 40 * lv ** 2;
  let tier = TIERS[0][1]; for (const [l, n] of TIERS) if (lv >= l) tier = n;
  const peak = commits.length ? hours.indexOf(Math.max(...hours)) : -1;
  const persona = peak < 0 ? 'Waiting for sunrise' : peak < 5 ? 'Night Owl' : peak < 10 ? 'Early Bird' : peak < 18 ? 'Daylight Builder' : 'Twilight Hacker';
  const recent = commits.filter(c => Date.now() - c.ts < 30 * DAY).length;
  return { n: commits.length, repos: repoCount, days: days.size, best, cur, xp, lv, prog: (xp - lo) / (hi - lo), toNext: hi - xp, tier, peak, persona, hours, recent };
}

/* ---------------- tree ---------------- */
function buildTree(commits) {
  commits.sort((a, b) => a.ts - b.ts);
  const map = new Map();
  for (const c of commits) { c.type = ctype(c.msg); if (!map.has(c.repo)) map.set(c.repo, []); map.get(c.repo).push(c); }
  const repos = [...map.entries()].map(([name, cs]) => ({ name, cs, birth: cs[0].ts })).sort((a, b) => a.birth - b.birth);
  const N = commits.length, times = commits.map(c => c.ts);
  const countLE = (arr, t) => { let lo = 0, hi = arr.length; while (lo < hi) { const m = (lo + hi) >> 1; if (arr[m] <= t) lo = m + 1; else hi = m; } return lo; };
  const H = 110 + 38 * Math.sqrt(repos.length) + 5.5 * Math.sqrt(N);
  const tw = 5 + 1.05 * Math.sqrt(N);
  const trunkX = h => Math.sin(h * .011 + .6) * 10 * (h / H);
  const nodes = [], leaves = [];
  repos.forEach((rp, i) => {
    const R = rng(hashStr(rp.name) + i), side = i % 2 ? -1 : 1;
    rp.hue = (i * 137.508 + 150) % 360;
    rp.attach = H * (.22 + .78 * Math.pow(countLE(times, rp.birth) / Math.max(1, N), .7)) * .93;
    const months = []; let key = null;
    for (const c of rp.cs) { const d = local(c.ts), k = d.getUTCFullYear() * 12 + d.getUTCMonth(); if (k !== key) { months.push([]); key = k; } months.at(-1).push(c); }
    let ang = -Math.PI / 2 + side * (i === 0 ? .12 : .55 + R() * .45), px = trunkX(rp.attach), py = -rp.attach;
    const target = -Math.PI / 2 + side * .28;
    let remaining = rp.cs.length;
    months.forEach((mc, k) => {
      ang += (R() - .5) * .5; ang += (target - ang) * .13;
      const len = (16 + 5.5 * Math.sqrt(mc.length)) * Math.pow(.975, k);
      const ex = px + Math.cos(ang) * len, ey = py + Math.sin(ang) * len;
      nodes.push({ x1: px, y1: py, x2: ex, y2: ey, w: Math.min(tw * .72, 1.4 + .95 * Math.sqrt(remaining)), birth: mc[0].ts, hue: rp.hue });
      remaining -= mc.length;
      const alt = k % 2 ? 1 : -1, ta = ang + alt * (.6 + R() * .55), tl = 7 + 3.3 * Math.sqrt(mc.length);
      const tx = ex + Math.cos(ta) * tl, ty = ey + Math.sin(ta) * tl;
      nodes.push({ x1: ex, y1: ey, x2: tx, y2: ty, w: .9 + .95 * Math.sqrt(mc.length), birth: mc[0].ts, hue: rp.hue });
      mc.forEach((c, j) => {
        const onLimb = R() < .3, spread = 3 + Math.sqrt(j) * 2.5;
        const [bx, by, a, L] = onLimb ? [px, py, ang, len] : [ex, ey, ta, tl];
        const u = onLimb ? .2 + .8 * R() : (mc.length <= 4 ? .45 + .55 * R() : .25 + .75 * R()), o = (R() - .5) * 2 * spread;
        leaves.push({ x: bx + Math.cos(a) * u * L - Math.sin(a) * o, y: by + Math.sin(a) * u * L + Math.cos(a) * o, rot: R() * 360, size: 2.4 + R() * 2.2, c, hue: rp.hue });
      });
      px = ex; py = ey;
    });
  });
  const TH = Math.max(40, ...repos.map(r => r.attach)) + 12;
  return { repos, nodes, leaves, H, TH, tw, trunkX };
}

/* ---------------- svg ---------------- */
function render(commits) {
  const T = buildTree(commits), S = stats(commits, T.repos.length);
  const W = 840, Hh = 440, SCN = 540; // scene width
  let minX = -60, maxX = 60, minY = -T.TH - 20;
  for (const n of T.nodes) { minX = Math.min(minX, n.x2); maxX = Math.max(maxX, n.x2); minY = Math.min(minY, n.y2); }
  for (const l of T.leaves) { minX = Math.min(minX, l.x - 6); maxX = Math.max(maxX, l.x + 6); minY = Math.min(minY, l.y - 6); }
  const s = Math.min((SCN - 50) / (maxX - minX), 330 / -minY, 3.2);
  const gx = SCN / 2 - (minX + maxX) / 2 * s, gy = 392;
  const N = Math.max(1, commits.length), now = Date.now();
  const t0 = commits.length ? commits[0].ts : now, span = Math.max(DAY, now - t0);
  const GROW = 4.2, delayOf = ts => f(.4 + GROW * (ts - t0) / span);
  const r = rng(5);

  // sky
  let stars = '';
  for (let i = 0; i < 70; i++) stars += `<circle cx="${f(r() * W)}" cy="${f(Math.pow(r(), 1.5) * 300)}" r="${f(.4 + r() * .9)}" class="st" style="animation-delay:-${f(r() * 4)}s;animation-duration:${f(2 + r() * 3)}s"/>`;
  let hills = `M0 ${gy}`; for (let x = 0; x <= SCN; x += 20) hills += ` L${x} ${f(gy - 36 - Math.sin(x * .008 + 1) * 22 - Math.sin(x * .02) * 8)}`; hills += ` L${SCN} ${Hh} L0 ${Hh}Z`;
  let aur = `M0 120`; for (let x = 0; x <= W; x += 30) aur += ` L${x} ${f(110 + Math.sin(x * .006) * 30 + Math.sin(x * .017) * 10)}`; aur += ` L${W} 220 L0 220Z`;

  // tree (world coords inside scaled group)
  const steps = 22, Lp = [], Rp = [];
  for (let i = 0; i <= steps; i++) { const y = T.TH * i / steps, x = T.trunkX(y), w = T.tw * (1 - .66 * Math.pow(i / steps, .8)) / 2; Lp.push(`${f(x - w)} ${f(-y)}`); Rp.unshift(`${f(x + w)} ${f(-y)}`); }
  const trunk = `<path class="trunk" d="M${Lp.join(' L')} L${Rp.join(' L')}Z" fill="url(#bark)"/>`;
  let roots = '';
  for (let i = 0; i < 5; i++) { const sd = i - 2, len = T.tw * (2.2 + Math.abs(sd) * .5) + 8; roots += `<path d="M${f(sd * T.tw * .12)} -1 Q${f(sd * len * .35)} 0 ${f(sd * len * .6)} ${3 + Math.abs(sd)}" stroke-width="${f(Math.max(.6, T.tw * .2 - Math.abs(sd) * .3))}"/>`; }
  let branches = '', rims = '';
  for (const n of T.nodes) {
    const st = `style="animation-delay:${delayOf(n.birth)}s"`;
    branches += `<line x1="${f(n.x1)}" y1="${f(n.y1)}" x2="${f(n.x2)}" y2="${f(n.y2)}" stroke-width="${f(n.w)}" pathLength="1" class="br" ${st}/>`;
    if (n.w > 1.6) { const o = n.w * .22; rims += `<line x1="${f(n.x1 - o)}" y1="${f(n.y1 - o)}" x2="${f(n.x2 - o)}" y2="${f(n.y2 - o)}" stroke-width="${f(n.w * .25)}" pathLength="1" class="br" ${st}/>`; }
  }
  let leaves = '', halos = '';
  const MAXL = 1600, step = Math.max(1, Math.ceil(T.leaves.length / MAXL));
  T.leaves.forEach((l, i) => {
    if (i % step) return;
    const c = l.c, d = delayOf(c.ts), z = f(l.size / 4);
    const tf = `transform="translate(${f(l.x)} ${f(l.y)}) rotate(${f(l.rot)}) scale(${z})"`;
    const col = c.type === 'fix' ? 'hsl(32,100%,58%)' : c.type === 'docs' ? `hsl(${f(l.hue)},30%,86%)` : c.type === 'feat' ? `hsl(${f(l.hue)},95%,82%)` : `hsl(${f(l.hue)},72%,58%)`;
    const sym = c.type === 'feat' ? 'bloom' : c.type === 'fix' ? 'berry' : 'leaf';
    leaves += `<g ${tf}><use href="#${sym}" class="lf" style="color:${col};animation-delay:${d}s"/></g>`;
    if (now - c.ts < 7 * DAY) halos += `<circle cx="${f(l.x)}" cy="${f(l.y)}" r="9" fill="url(#halo)" class="new" style="animation-delay:${d}s,${f(d + .45)}s"/>`;
  });
  let grass = '';
  const rx = Math.max(200, (maxX - minX) * .7) , ng = Math.min(160, 8 + Math.floor(N / 3));
  for (let i = 0; i < ng; i++) { const u = r() * 2 - 1, x = u * rx * .95, y = 4 - 24 * Math.sqrt(Math.max(0, 1 - u * u)), h = 4 + r() * 8; grass += `<path d="M${f(x)} ${f(y + 1)} Q${f(x)} ${f(y - h * .6)} ${f(x + (r() - .5) * 4)} ${f(y - h)}" stroke="hsl(${f(130 + r() * 50)},65%,45%)"/>`; }
  let flies = '';
  const nf = Math.min(22, 4 + S.recent);
  for (let i = 0; i < nf; i++) { const x = gx + (minX + r() * (maxX - minX)) * s, y = gy + minY * s * (.15 + r() * .8); flies += `<circle cx="${f(x)}" cy="${f(y)}" r="2" class="fly" style="animation-delay:-${f(r() * 6)}s;animation-duration:${f(5 + r() * 4)}s"/>`; }

  // side panel
  const P = 572, ring = 2 * Math.PI * 26;
  const hourBars = S.hours.map((v, h) => {
    const mx = Math.max(1, ...S.hours), a = h / 24 * Math.PI * 2 - Math.PI / 2, l = 2 + 20 * Math.sqrt(v / mx), dd = (Math.cos((h - 13) / 24 * Math.PI * 2) + 1) / 2;
    return `<line x1="${f(Math.cos(a) * 20)}" y1="${f(Math.sin(a) * 20)}" x2="${f(Math.cos(a) * (20 + l))}" y2="${f(Math.sin(a) * (20 + l))}" stroke="hsl(${f(230 - 185 * dd)},${f(70 + 25 * dd)}%,${f(58 + 8 * dd)}%)"/>`;
  }).join('');
  const cell = (x, y, val, lab) => `<g transform="translate(${x} ${y})"><rect width="118" height="50" rx="10" class="cell"/><text x="12" y="23" class="num">${esc(val)}</text><text x="12" y="40" class="lab">${esc(lab)}</text></g>`;
  const updated = local(now).toISOString().slice(0, 10);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" role="img" aria-label="Commit Garden: ${S.n} commits across ${S.repos} repos, level ${S.lv} ${S.tier}">
<title>Commit Garden · ${esc(USER)}</title>
<style>
text{font-family:'Segoe UI',Ubuntu,'Helvetica Neue',Arial,sans-serif;fill:#eaf0ff}
.num{font:600 17px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:#eaf0ff}
.lab{font-size:10px;fill:#8d99c6}
.cell{fill:rgba(255,255,255,.04);stroke:rgba(170,195,255,.12)}
.st{fill:#dfe6ff;animation:tw 3s ease-in-out infinite alternate}
@keyframes tw{from{opacity:.15}to{opacity:.9}}
.aur{animation:aur 9s ease-in-out infinite alternate}
@keyframes aur{from{opacity:.35;transform:translateX(-20px)}to{opacity:1;transform:translateX(20px)}}
.sway{transform-origin:${f(gx)}px ${gy}px;animation:sway 7s ease-in-out infinite alternate}
@keyframes sway{from{transform:rotate(-.7deg)}to{transform:rotate(.7deg)}}
.trunk{transform-box:fill-box;transform-origin:50% 100%;animation:rise 1.2s cubic-bezier(.2,.8,.2,1) .1s backwards}
@keyframes rise{from{transform:scaleY(0)}}
.br{stroke-dasharray:1;stroke-dashoffset:1;animation:draw .7s ease-out forwards}
@keyframes draw{to{stroke-dashoffset:0}}
.lf{transform-box:fill-box;transform-origin:center;animation:pop .45s cubic-bezier(.3,1.8,.5,1) backwards}
@keyframes pop{from{transform:scale(0);opacity:0}}
.new{animation:fade .45s ease-out backwards,pulse 1.6s ease-in-out infinite alternate}
@keyframes fade{from{opacity:0}}
@keyframes pulse{from{opacity:.25}to{opacity:1}}
.fly{fill:#e9ff8a;filter:url(#soft);animation:fly 6s ease-in-out infinite alternate}
@keyframes fly{0%{transform:translate(0,0);opacity:.2}50%{opacity:1}100%{transform:translate(14px,-18px);opacity:.3}}
.bar{animation:grow 1.4s cubic-bezier(.2,.8,.2,1) .6s backwards}
@keyframes grow{from{stroke-dashoffset:${f(ring)}}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.br{stroke-dashoffset:0}}
</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03040b"/><stop offset=".55" stop-color="#0a0f2e"/><stop offset="1" stop-color="#1c1442"/></linearGradient>
<linearGradient id="aurg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fffd0" stop-opacity="0"/><stop offset=".45" stop-color="#5fffd0" stop-opacity=".09"/><stop offset="1" stop-color="#9a7bff" stop-opacity="0"/></linearGradient>
<linearGradient id="bark" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a3a5e"/><stop offset=".45" stop-color="#261c33"/><stop offset="1" stop-color="#140f1c"/></linearGradient>
<linearGradient id="mound" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#123629"/><stop offset="1" stop-color="#071510"/></linearGradient>
<linearGradient id="xp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9dffe0"/><stop offset="1" stop-color="#b59cff"/></linearGradient>
<radialGradient id="moon"><stop offset="0" stop-color="#cfd8ff" stop-opacity=".35"/><stop offset="1" stop-color="#cfd8ff" stop-opacity="0"/></radialGradient>
<radialGradient id="halo"><stop offset="0" stop-color="#fff6c8" stop-opacity=".9"/><stop offset=".4" stop-color="#7cf5c8" stop-opacity=".35"/><stop offset="1" stop-color="#7cf5c8" stop-opacity="0"/></radialGradient>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="soft" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<symbol id="leaf" overflow="visible"><ellipse rx="4" ry="1.9" fill="currentColor"/></symbol>
<symbol id="berry" overflow="visible"><circle r="2.6" fill="currentColor"/><circle cx="-.8" cy="-.8" r=".7" fill="#fff" opacity=".8"/></symbol>
<symbol id="bloom" overflow="visible"><g fill="currentColor"><ellipse cx="2.2" rx="2" ry="1.3"/><ellipse cx="2.2" rx="2" ry="1.3" transform="rotate(72)"/><ellipse cx="2.2" rx="2" ry="1.3" transform="rotate(144)"/><ellipse cx="2.2" rx="2" ry="1.3" transform="rotate(216)"/><ellipse cx="2.2" rx="2" ry="1.3" transform="rotate(288)"/></g><circle r="1.1" fill="#ffe07a"/></symbol>
<clipPath id="card"><rect width="${W}" height="${Hh}" rx="18"/></clipPath>
</defs>
<g clip-path="url(#card)">
<rect width="${W}" height="${Hh}" fill="url(#sky)"/>
<path d="${aur}" fill="url(#aurg)" class="aur"/>
${stars}
<circle cx="470" cy="62" r="60" fill="url(#moon)"/><circle cx="470" cy="62" r="15" fill="#f3f1e6"/><circle cx="465" cy="59" r="3.4" fill="#b4af9f" opacity=".3"/><circle cx="476" cy="67" r="2.3" fill="#b4af9f" opacity=".3"/>
<path d="${hills}" fill="#0d0f2a"/>
<rect y="${gy}" width="${SCN}" height="${Hh - gy}" fill="#08141a"/>
<g transform="translate(${f(gx)} ${gy}) scale(${f(s)})">
  <path d="M${f(-rx)} 4 A${f(rx)} 24 0 0 1 ${f(rx)} 4 L${f(rx)} 40 L${f(-rx)} 40Z" fill="url(#mound)"/>
  <path d="M${f(-rx)} 4 A${f(rx)} 24 0 0 1 ${f(rx)} 4" fill="none" stroke="#7cf5c8" stroke-opacity=".22" stroke-width="${f(1.2 / s)}"/>
  <g fill="none" stroke-width=".8" stroke-linecap="round" opacity=".75">${grass}</g>
</g>
<g class="sway"><g transform="translate(${f(gx)} ${gy}) scale(${f(s)})">
  <g fill="none" stroke="#2a1f38" stroke-linecap="round">${roots}</g>
  ${trunk}
  <g stroke="#2a1f38" stroke-linecap="round">${branches}</g>
  <g stroke="#c9b6ff" stroke-opacity=".32" stroke-linecap="round">${rims}</g>
  <g>${halos}</g>
  <g filter="url(#glow)">${leaves}</g>
</g></g>
${flies}
<rect x="${SCN}" width="${W - SCN}" height="${Hh}" fill="#070a1a" opacity=".72"/>
<line x1="${SCN}" y1="0" x2="${SCN}" y2="${Hh}" stroke="rgba(170,195,255,.14)"/>
<g transform="translate(${P} 0)">
  <text x="0" y="38" style="font-size:11px;letter-spacing:3px;fill:#7cf5c8;font-weight:600">COMMIT GARDEN</text>
  <text x="0" y="60" style="font:700 19px Georgia,'Times New Roman',serif">@${esc(USER)}</text>
  <g transform="translate(30 112)">
    <circle r="26" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="5"/>
    <circle r="26" fill="none" stroke="url(#xp)" stroke-width="5" stroke-linecap="round" transform="rotate(-90)" stroke-dasharray="${f(ring)}" stroke-dashoffset="${f(ring * (1 - S.prog))}" class="bar"/>
    <text y="-5" text-anchor="middle" style="font-size:7px;letter-spacing:1.5px;fill:#8d99c6">LEVEL</text>
    <text y="13" text-anchor="middle" style="font:800 20px Georgia,serif">${S.lv}</text>
  </g>
  <text x="72" y="106" style="font:700 18px Georgia,serif">${esc(S.tier)}</text>
  <text x="72" y="125" style="font:12px ui-monospace,Menlo,Consolas,monospace;fill:#7cf5c8">${S.xp.toLocaleString('en-US')} XP</text>
  <text x="72" y="141" class="lab">${S.toNext.toLocaleString('en-US')} XP to level ${S.lv + 1}</text>
  ${cell(0, 162, fmt(S.n), 'leaves · commits')}${cell(126, 162, S.repos, 'branches · repos')}
  ${cell(0, 218, fmt(S.days), 'days tended')}${cell(126, 218, S.cur + (S.cur ? ' 🔥' : ''), 'current streak')}
  ${cell(0, 274, S.best, 'longest streak')}${cell(126, 274, S.peak < 0 ? '--' : String(S.peak).padStart(2, '0') + ':00', 'peak hour')}
  <g transform="translate(32 368)" stroke-width="4" stroke-linecap="round">${hourBars}<circle r="16" fill="none" stroke="rgba(170,195,255,.12)"/></g>
  <text x="76" y="362" style="font:700 15px Georgia,serif">${esc(S.persona)}</text>
  <text x="76" y="380" class="lab">sun clock · when the leaves grow</text>
  <text x="0" y="424" class="lab" style="font-size:9px">🌸 feat · 🍊 fix · 🍃 other   ·   updated ${updated}</text>
</g>
<rect width="${W}" height="${Hh}" rx="18" fill="none" stroke="rgba(170,195,255,.18)"/>
</g>
</svg>
`;
}

/* ---------------- main ---------------- */
const demo = process.argv.includes('--demo');
console.log(demo ? 'Using demo data' : `Fetching commits for ${USER}${INCLUDE_PRIVATE ? ' (incl. private)' : ''}...`);
const commits = demo ? demoCommits() : await fetchCommits();
fs.writeFileSync(OUT, render(commits));
console.log(`Wrote ${OUT} with ${commits.length} commits`);
