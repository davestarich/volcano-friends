// Shared game state, then the puzzles: square and fun-shape pieces, dragging, snapping, the picker.
'use strict';

/* ================= GAME STATE ================= */
const G = { done: new Set(), state: 'home', woke: false, token: 0, level: 0, stage: 0, rumbling: false, draining: false, paused: false, count: 0, q: null, lastKey: null, puffT: 0, emitting: 0, erupts: 0, snap: '' };
function dinoDo(cls) { dino.classList.remove('hop', 'dance', 'nervous'); void dino.getBoundingClientRect(); if (cls) dino.classList.add(cls); }
dino.addEventListener('animationend', e => { if (e.animationName === 'hop') dino.classList.remove('hop'); });
function showOnly(which) {
  $('#puzzle').classList.toggle('hidden', which !== 'puzzle');
  $('#quiz').classList.toggle('hidden', which !== 'quiz');
  $('#prog').classList.toggle('hidden', which !== 'quiz');
}

/* ================= PHASE 1: PUZZLE ================= */
const PW = 800, PH = 600; // puzzle pictures are drawn at 800x600; pieces are cut in these units
const P = { puz: null, pieces: [], shaped: false, cols: 4, rows: 3, placed: 0, z: 10, snaps: 0, bw: 0, bh: 0, bx: 0, by: 0, pw: 0, ph: 0, sc: 1 };
const gridFor = n => n === 6 ? [3, 2] : n === 20 ? [5, 4] : n === 40 ? [8, 5] : [4, 3];
// Fun-shape mode: [cols, rows, whimsies]. Jigsaw cells plus whimsy shapes add up to the chosen count.
const shapeGridFor = n => n === 6 ? [2, 2, 2] : n === 20 ? [4, 4, 4] : n === 40 ? [7, 5, 5] : [3, 3, 3];

function computeLayout(n, cols, rows) {
  const W = innerWidth, H = innerHeight, M = 12, TOP = 92;
  const land = W >= H * 1.05;
  const ov = n > 20 ? .5 : .72; // how much loose pieces may stack; big puzzles overlap more so the board stays large
  let out = null;
  for (let f = land ? .62 : .94; ; f -= .02) {
    const last = f <= (land ? .36 : .5);
    const bw = land ? Math.min(W * f, (H - TOP - M) * 4 / 3 * .98) : Math.min(W * f, H * .5 * 4 / 3);
    const bh = bw * .75, pw = bw / cols, ph = bh / rows, bx = (W - bw) / 2;
    const slots = [];
    if (land) {
      const by = TOP + (H - TOP - M - bh) / 2;
      const sw = bx - M * 2, availH = H - TOP - M;
      const colsS = Math.max(1, Math.floor((sw + pw * .35) / pw));
      const rowsS = Math.max(1, Math.floor((availH - ph) / (ph * ov)) + 1);
      if (2 * colsS * rowsS >= n || last) {
        const per = Math.ceil(n / 2), rowsN = Math.ceil(per / colsS);
        for (const side of [0, 1]) for (let i = 0; i < per; i++) {
          const c = i % colsS, r = Math.floor(i / colsS);
          const off = colsS > 1 ? c * (sw - pw) / (colsS - 1) : Math.max(0, (sw - pw) / 2);
          const x = side ? W - M - pw - off : M + off;
          const y = TOP + (rowsN > 1 ? r * (availH - ph) / (rowsN - 1) : (availH - ph) / 2);
          slots.push({ x, y });
        }
        out = { bw, bh, pw, ph, bx, by, slots }; break;
      }
    } else {
      const by = TOP, ay = by + bh + M * 2, ah = H - ay - M;
      const colsA = Math.max(1, Math.floor((W - 2 * M + pw * .35) / pw));
      const rowsA = Math.max(1, Math.floor((ah - ph) / (ph * ov)) + 1);
      if (colsA * rowsA >= n || last) {
        const rowsN = Math.ceil(n / colsA);
        for (let i = 0; i < n; i++) {
          const c = i % colsA, r = Math.floor(i / colsA);
          const x = M + (colsA > 1 ? c * (W - 2 * M - pw) / (colsA - 1) : (W - 2 * M - pw) / 2);
          const y = Math.min(H - ph - 4, ay + (rowsN > 1 ? r * Math.max(0, ah - ph) / (rowsN - 1) : 0));
          slots.push({ x, y });
        }
        out = { bw, bh, pw, ph, bx, by, slots }; break;
      }
    }
  }
  out.slots = shuffle(out.slots).map(s => ({ x: s.x + rand(-8, 8), y: s.y + rand(-8, 8) }));
  return out;
}

/* ---------- Fun-shape pieces: real jigsaw knobs plus dino-themed "whimsy" pieces ---------- */
// Whimsy silhouettes, each a single outline. Any size; they are normalized when sampled.
const WHIMSY_PATHS = {
  trex: 'M8,70 C20,62 30,52 42,48 C44,36 50,24 62,20 C74,14 92,18 92,30 C92,38 84,40 76,40 L72,42 C72,48 70,54 66,58 L70,58 C73,60 72,65 68,64 L64,62 C62,70 60,76 58,80 L62,92 L52,92 L50,82 L42,82 L42,92 L32,92 L34,78 C24,76 16,74 8,70 Z',
  bronto: 'M4,78 C20,70 26,52 44,50 C56,48 62,52 66,46 C70,36 70,20 76,12 C80,6 92,8 92,16 C92,22 86,22 82,22 C80,34 80,48 78,58 C78,66 74,72 70,74 L70,92 L62,92 L60,76 L42,76 L40,92 L32,92 L32,74 C22,76 12,80 4,78 Z',
  foot: 'M50,95 C30,95 22,80 28,64 L14,30 C10,20 20,14 26,22 L40,50 L44,12 C45,3 55,3 56,12 L60,50 L74,22 C80,14 90,20 86,30 L72,64 C78,80 70,95 50,95 Z',
  egg: 'M50,6 C72,6 86,42 86,62 C86,82 70,94 50,94 C30,94 14,82 14,62 C14,42 28,6 50,6 Z',
  bone: 'M24,50 C12,50 6,38 14,30 C18,22 30,24 32,34 L68,34 C70,24 82,22 86,30 C94,38 88,50 76,50 C88,50 94,62 86,70 C82,78 70,76 68,66 L32,66 C30,76 18,78 14,70 C6,62 12,50 24,50 Z',
  heart: 'M50,88 C20,65 5,48 8,30 C11,12 35,8 50,26 C65,8 89,12 92,30 C95,48 80,65 50,88 Z',
  volcano: 'M8,90 L36,30 C38,24 44,22 46,28 L50,36 L54,28 C56,22 62,24 64,30 L92,90 Z',
  star: (() => { let d = ''; for (let i = 0; i < 10; i++) { const r = i % 2 ? 21 : 50, a = -Math.PI / 2 + i * Math.PI / 5; d += (i ? 'L' : 'M') + (50 + Math.cos(a) * r).toFixed(1) + ',' + (50 + Math.sin(a) * r).toFixed(1); } return d + 'Z'; })(),
};
let WHIMSY = null; // name -> outline points in a 1x1 box centered on 0,0
function whimsyShapes() {
  if (WHIMSY) return WHIMSY;
  WHIMSY = {};
  const host = $('#gdefs').parentNode;
  for (const [k, d] of Object.entries(WHIMSY_PATHS)) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', d); host.appendChild(el);
    const L = el.getTotalLength(), pts = [];
    for (let i = 0; i < 90; i++) { const q = el.getPointAtLength(L * i / 90); pts.push([q.x, q.y]); }
    el.remove();
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), span = Math.max(x1 - x0, y1 - y0);
    WHIMSY[k] = pts.map(([x, y]) => [(x - (x0 + x1) / 2) / span, (y - (y0 + y1) / 2) / span]);
  }
  return WHIMSY;
}
function cubicPts(p0, p1, p2, p3, n, out) {
  for (let i = 1; i <= n; i++) {
    const t = i / n, m = 1 - t, a = m * m * m, b = 3 * m * m * t, c = 3 * m * t * t, d = t * t * t;
    out.push([a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]]);
  }
}
// One jigsaw edge from A to B with a knob on side `flip` (+1 or -1). Returns its points, A excluded.
// Knob shape follows the classic jigsaw-generator curve, with a little random jitter per edge.
function tabEdge(A, B, flip, S) {
  const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const j = .04, a = rand(-j, j), b = rand(-j, j), c = rand(-j, j), d = rand(-j, j), e = rand(-j, j), t = .1, k = S / L, m = .5;
  const q = [[0, 0], [.2, a], [m + (b + d) * k, a - c], [m + (b - t) * k, t + c], [m + (b - 2 * t - d) * k, 3 * t - c],
    [m + (b + 2 * t - d) * k, 3 * t - c], [m + (b + t) * k, t + c], [m + (b + d) * k, e - c], [.8, e], [1, 0]]
    .map(([u, v]) => [A[0] + ux * u * L + nx * v * S * flip, A[1] + uy * u * L + ny * v * S * flip]);
  const out = [];
  cubicPts(q[0], q[1], q[2], q[3], 10, out); cubicPts(q[3], q[4], q[5], q[6], 16, out); cubicPts(q[6], q[7], q[8], q[9], 10, out);
  return out;
}
function buildShapedPieces(cols, rows, nWhim) {
  const cw = PW / cols, ch = PH / rows, S = Math.min(cw, ch), key = (i, j) => i + ',' + j;
  // wobbly grid corners (the outside border stays straight)
  const C = [];
  for (let j = 0; j <= rows; j++) {
    C[j] = [];
    for (let i = 0; i <= cols; i++) C[j][i] = [i * cw + (i > 0 && i < cols ? rand(-.07, .07) * cw : 0), j * ch + (j > 0 && j < rows ? rand(-.07, .07) * ch : 0)];
  }
  // cells that hold a whimsy: never side by side, and all their knobs point outward so the shape fits inside
  const hosts = new Set();
  for (const [i, j] of shuffle([...Array(cols * rows)].map((_, n) => [n % cols, Math.floor(n / cols)]))) {
    if (hosts.size >= nWhim) break;
    if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([di, dj]) => hosts.has(key(i + di, j + dj)))) hosts.add(key(i, j));
  }
  const side = f => f || (Math.random() < .5 ? 1 : -1);
  const Hs = [], Vs = [];
  for (let j = 0; j <= rows; j++) { // horizontal edges, left to right; +1 puts the knob below
    Hs[j] = [];
    for (let i = 0; i < cols; i++) Hs[j][i] = (j === 0 || j === rows) ? [C[j][i + 1]]
      : tabEdge(C[j][i], C[j][i + 1], side(hosts.has(key(i, j - 1)) ? 1 : hosts.has(key(i, j)) ? -1 : 0), S);
  }
  for (let j = 0; j < rows; j++) { // vertical edges, top to bottom; +1 puts the knob on the left
    Vs[j] = [];
    for (let i = 0; i <= cols; i++) Vs[j][i] = (i === 0 || i === cols) ? [C[j + 1][i]]
      : tabEdge(C[j][i], C[j + 1][i], side(hosts.has(key(i, j)) ? 1 : hosts.has(key(i - 1, j)) ? -1 : 0), S);
  }
  const back = (pts, start) => pts.slice(0, -1).reverse().concat([start]); // walk an edge the other way
  const shapes = shuffle(Object.keys(whimsyShapes()));
  const cells = [], whims = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const poly = [C[j][i], ...Hs[j][i], ...Vs[j][i + 1], ...back(Hs[j + 1][i], C[j + 1][i]), ...back(Vs[j][i], C[j][i]).slice(0, -1)];
    const piece = { poly, holes: [] };
    if (hosts.has(key(i, j))) {
      const cx = (C[j][i][0] + C[j][i + 1][0] + C[j + 1][i][0] + C[j + 1][i + 1][0]) / 4;
      const cy = (C[j][i][1] + C[j][i + 1][1] + C[j + 1][i][1] + C[j + 1][i + 1][1]) / 4;
      const size = S * .55, ang = rand(-.35, .35), co = Math.cos(ang), si = Math.sin(ang);
      const shape = WHIMSY[shapes[whims.length % shapes.length]].map(([x, y]) => [cx + (x * co - y * si) * size, cy + (x * si + y * co) * size]);
      piece.holes.push(shape);
      whims.push({ poly: shape, holes: [], whimsy: true });
    }
    cells.push(piece);
  }
  // whimsies last, so they start on top of the pile and are easy to spot
  return cells.concat(whims).map(p => {
    const xs = p.poly.map(q => q[0]), ys = p.poly.map(q => q[1]);
    const x = Math.min(...xs), y = Math.min(...ys);
    return Object.assign(p, { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y });
  });
}
const ring = (pts, ox = 0, oy = 0, k = 1) => 'M' + pts.map(([x, y]) => ((x - ox) * k).toFixed(1) + ' ' + ((y - oy) * k).toFixed(1)).join(' L') + ' Z';
function makePieceEl(p) {
  if (!P.shaped) { p.el = p.hit = document.createElement('div'); p.el.className = 'piece'; return; }
  const d = [p.poly, ...p.holes].map(r => ring(r)).join(' '), vb = `${p.x} ${p.y} ${p.w} ${p.h}`;
  const el = document.createElement('div'); el.className = 'jp';
  el.innerHTML = `<svg class="jpShadow" viewBox="${vb}" preserveAspectRatio="none"><path d="${d}" fill-rule="evenodd"/></svg>`
    + `<div class="jpImg"></div>`
    + `<svg class="jpLine" viewBox="${vb}" preserveAspectRatio="none"><path d="${d}" vector-effect="non-scaling-stroke"/></svg>`;
  p.el = el; p.hit = el.querySelector('.jpImg');
}
function renderGuide() {
  const cells = $('#cells');
  if (P.shaped) {
    cells.style.gridTemplateColumns = cells.style.gridTemplateRows = '1fr';
    cells.innerHTML = `<svg viewBox="0 0 ${PW} ${PH}" preserveAspectRatio="none" style="width:100%;height:100%;display:block"><path d="${P.pieces.map(p => ring(p.poly)).join(' ')}" fill="none" stroke="rgba(90,42,28,.3)" stroke-width="2" stroke-dasharray="6 5" vector-effect="non-scaling-stroke"/></svg>`;
  } else {
    cells.style.gridTemplateColumns = `repeat(${P.cols},1fr)`; cells.style.gridTemplateRows = `repeat(${P.rows},1fr)`;
    cells.innerHTML = '<div></div>'.repeat(P.cols * P.rows);
  }
}
function layoutPuzzle(rescatter) {
  const L = computeLayout(P.pieces.length, P.cols, P.rows);
  Object.assign(P, L); P.sc = P.bw / PW;
  const b = $('#board');
  Object.assign(b.style, { left: P.bx + 'px', top: P.by + 'px', width: P.bw + 'px', height: P.bh + 'px' });
  renderGuide();
  let si = 0;
  P.pieces.forEach(p => {
    const w = p.w * P.sc, h = p.h * P.sc, img = p.hit.style;
    p.el.style.width = w + 'px'; p.el.style.height = h + 'px';
    img.backgroundImage = P.puz.pic; img.backgroundSize = `${P.bw}px ${P.bh}px`;
    img.backgroundPosition = `${-p.x * P.sc}px ${-p.y * P.sc}px`;
    if (P.shaped) img.clipPath = img.webkitClipPath = `path(evenodd, '${[p.poly, ...p.holes].map(r => ring(r, p.x, p.y, P.sc)).join(' ')}')`;
    if (p.placed) { p.sx = P.bx + p.x * P.sc; p.sy = P.by + p.y * P.sc; }
    else if (rescatter) {
      const sl = L.slots[si++ % L.slots.length];
      p.sx = clamp(sl.x, 4, Math.max(4, innerWidth - w - 4)); p.sy = clamp(sl.y, 4, Math.max(4, innerHeight - h - 4));
    }
    placeEl(p);
  });
}
function placeEl(p) {
  p.el.style.transform = `translate3d(${p.sx}px,${p.sy}px,0) rotate(${p.drag || p.placed ? 0 : p.rot}deg) scale(${p.drag ? 1.08 : 1})`;
}
function bindPiece(p) {
  const el = p.hit;
  el.addEventListener('pointerdown', e => {
    if (p.placed || G.state !== 'puzzle' || p.drag) return;
    e.preventDefault(); A.init();
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
    p.drag = { id: e.pointerId, dx: e.clientX - p.sx, dy: e.clientY - p.sy };
    p.el.style.zIndex = ++P.z; p.el.classList.add('drag'); SFX.pick(); placeEl(p);
  });
  el.addEventListener('pointermove', e => {
    if (!p.drag || e.pointerId !== p.drag.id) return;
    e.preventDefault();
    const w = p.w * P.sc, h = p.h * P.sc;
    p.sx = clamp(e.clientX - p.drag.dx, -w * .4, innerWidth - w * .6);
    p.sy = clamp(e.clientY - p.drag.dy, -h * .4, innerHeight - h * .6);
    placeEl(p);
  });
  const end = e => { if (!p.drag || e.pointerId !== p.drag.id) return; p.drag = null; p.el.classList.remove('drag'); dropPiece(p); };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
  el.addEventListener('lostpointercapture', end);
}
function dropPiece(p) {
  const tx = P.bx + p.x * P.sc, ty = P.by + p.y * P.sc, w = p.w * P.sc, h = p.h * P.sc;
  const snapDist = Math.max(60, Math.min(w, h) * .55); // generous for small hands
  if (Math.hypot(p.sx - tx, p.sy - ty) < snapDist && G.state === 'puzzle') {
    p.placed = true; p.sx = tx; p.sy = ty;
    p.el.classList.add('placed'); p.el.style.zIndex = 2; placeEl(p);
    SFX.snap(); sparkle(tx + w / 2, ty + h / 2, 16);
    P.placed++; P.snaps++;
    if (P.placed === P.pieces.length) puzzleDone();
    else if (!V.speaking && (P.snaps === 1 || Math.random() < .35)) V.say(cheer());
  } else placeEl(p);
}
function showPicker(again) {
  G.token++; G.state = 'picker'; homeBtn(true); G.rumbling = false; G.paused = false;
  V.stop(); resetVolcano(); dinoDo(null); showOnly(null);
  ['#reward', '#start'].forEach(s => $(s).classList.remove('show', 'ready'));
  const grid = $('#pickGrid'); grid.innerHTML = '';
  PUZZLES.forEach((pz, i) => {
    pickVersion(pz);
    const b = document.createElement('button'); b.className = 'ptile';
    b.setAttribute('aria-label', 'Build ' + pz.name);
    b.style.backgroundImage = pz.pic; b.style.setProperty('--d', (i * .1) + 's');
    if (G.done.has(pz.id)) b.innerHTML = `<span class="badge">${starSVG('#ffd93d')}</span>`;
    b.addEventListener('click', () => { A.init(); SFX.tap(); startPuzzle(pz); });
    grid.appendChild(b);
  });
  renderSizes();
  $('#picker').classList.add('show');
  V.say(again ? 'Want to do another puzzle?' : 'Which puzzle do you want to build?');
}
// Piece-count buttons: the number plus a little grid picture, so no reading is needed
const SIZES = [[6, '#2ec4b6'], [12, '#9b5de5'], [20, '#ff8c42'], [40, '#ff5d8f']];
function sizeIcon(n) {
  const [cols, rows] = gridFor(n), g = 3, w = (100 - g * (cols + 1)) / cols, h = (75 - g * (rows + 1)) / rows;
  let r = '';
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) r += `<rect x="${g + x * (w + g)}" y="${g + y * (h + g)}" width="${w}" height="${h}" rx="${Math.min(4, w / 4)}"/>`;
  return `<svg viewBox="0 0 100 75" fill="#fff" fill-opacity=".92">${r}</svg>`;
}
const MODES = [
  ['square', '#3a86ff', 'Square pieces!', '<svg viewBox="0 0 100 75" fill="#fff" fill-opacity=".92"><rect x="16" y="4" width="32" height="32" rx="4"/><rect x="52" y="4" width="32" height="32" rx="4"/><rect x="16" y="40" width="32" height="32" rx="4"/><rect x="52" y="40" width="32" height="32" rx="4"/></svg>'],
  ['fun', '#6bcb3a', 'Fun shape pieces!', '<svg viewBox="0 0 100 75" fill="#fff" fill-opacity=".95"><path d="M26,14 H40 C36,2 58,2 54,14 H68 V28 C80,24 80,46 68,42 V56 H54 C58,68 36,68 40,56 H26 V42 C14,46 14,24 26,28 Z"/><path d="M84,8 l3,7 l7,1 l-5,5 l1,7 l-6,-3 l-6,3 l1,-7 l-5,-5 l7,-1 Z"/></svg>'],
];
function renderSizes() {
  const row = $('#sizeRow'); row.innerHTML = '';
  const modes = document.createElement('div'), sizes = document.createElement('div');
  modes.className = sizes.className = 'btnGroup';
  MODES.forEach(([m, c, say, icon]) => {
    const b = document.createElement('button');
    b.className = 'sizeBtn modeBtn' + (S.shapes === m ? ' on' : '');
    b.style.setProperty('--c', c); b.setAttribute('aria-label', say);
    b.innerHTML = icon;
    b.addEventListener('click', () => { A.init(); SFX.tap(); S.shapes = m; saveS(); renderSizes(); V.say(say); });
    modes.appendChild(b);
  });
  row.append(modes, sizes);
  SIZES.forEach(([n, c]) => {
    const b = document.createElement('button');
    b.className = 'sizeBtn' + (+S.pieces === n ? ' on' : '');
    b.style.setProperty('--c', c); b.setAttribute('aria-label', n + ' pieces');
    b.innerHTML = `${sizeIcon(n)}<span>${n}</span>`;
    b.addEventListener('click', () => { A.init(); SFX.tap(); S.pieces = n; saveS(); renderSizes(); V.say(`${n} pieces!`); });
    sizes.appendChild(b);
  });
}
function startPuzzle(pz = P.puz) {
  homeBtn(true);
  G.token++; G.state = 'puzzle'; G.rumbling = false; G.paused = false;
  V.stop(); resetVolcano();
  ['#reward', '#start', '#picker'].forEach(s => $(s).classList.remove('show', 'ready'));
  P.puz = pz;
  $('#guideImg').style.backgroundImage = pz.pic; $('#full').style.backgroundImage = pz.pic;
  $('#board').classList.remove('cheer');
  dinoDo(null); showOnly('puzzle');
  P.pieces.forEach(p => p.el.remove()); P.pieces = [];
  P.placed = 0; P.snaps = 0; P.z = 10;
  $('#full').classList.remove('show'); $('#board').classList.remove('done');
  P.shaped = S.shapes === 'fun';
  let defs = [];
  if (P.shaped) {
    const [c, r, w] = shapeGridFor(+S.pieces); P.cols = c; P.rows = r;
    defs = buildShapedPieces(c, r, w);
  } else {
    [P.cols, P.rows] = gridFor(+S.pieces);
    const cw = PW / P.cols, ch = PH / P.rows;
    for (let r = 0; r < P.rows; r++) for (let c = 0; c < P.cols; c++) defs.push({ x: c * cw, y: r * ch, w: cw, h: ch });
  }
  defs.forEach(d => {
    const p = Object.assign(d, { placed: false, sx: 0, sy: 0, rot: rand(-9, 9), drag: null });
    makePieceEl(p); p.el.style.zIndex = ++P.z;
    bindPiece(p); $('#puzzle').appendChild(p.el); P.pieces.push(p);
  });
  layoutPuzzle(true);
  V.say(P.shaped ? `Let's build ${pz.name}! Look for the fun shapes!` : `Let's build ${pz.name}! Drag the pieces onto the picture.`);
}
async function puzzleDone() {
  const t = ++G.token; G.state = 'celebrate'; const pz = P.puz;
  G.done.add(pz.id);
  $('#board').classList.add('done');
  await wait(250);
  $('#full').classList.add('show'); SFX.fanfare(); confetti(160); dinoDo('dance');
  await wait(900); if (t !== G.token) return;
  $('#board').classList.add('cheer'); SFX[pz.sound]();
  const b = $('#board').getBoundingClientRect(); sparkle(b.left + b.width / 2, b.top + b.height / 2, 30);
  await wait(600); if (t !== G.token) return;
  await V.say(`You built ${pz.name}!${pz.extra || ''}`); if (t !== G.token) return;
  await wait(900); if (t !== G.token) return;
  $('#board').classList.remove('cheer'); dinoDo(null);
  showPicker(true);
}
