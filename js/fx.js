// Canvas particles: confetti, sparkles, and the lava eruption.
'use strict';

/* ================= FX (canvas particles) ================= */
const fx = $('#fx'), fc = fx.getContext('2d');
let FW = 0, FH = 0;
const parts = [];
function sizeFx() { const dpr = Math.min(2, window.devicePixelRatio || 1); FW = innerWidth; FH = innerHeight; fx.width = FW * dpr; fx.height = FH * dpr; fc.setTransform(dpr, 0, 0, dpr, 0, 0); }
const CANDY = ['#ff5d8f', '#ffbe0b', '#ff8c42', '#9b5de5', '#3a86ff', '#2ec4b6', '#8ac926', '#ff99c8', '#ffe66d', '#a0c4ff'];
function addP(p) { if (parts.length > 650) parts.shift(); parts.push(Object.assign({ x: 0, y: 0, vx: 0, vy: 0, g: 0, life: 1, age: 0, size: 8, color: '#fff', shape: 'circle', rot: 0, vr: 0, bounce: 0, drag: 0, wob: 0 }, p)); }
function sparkle(x, y, n = 14) {
  for (let i = 0; i < n; i++) { const a = rand(0, Math.PI * 2), sp = rand(140, 400); addP({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 150, life: rand(.5, .9), size: rand(8, 15), color: pick(['#fff7a1', '#ffd93d', '#ffffff', '#ff99c8', '#a0f0ff']), shape: 'star', vr: rand(-6, 6), drag: 2.5 }); }
}
function confetti(n = 140) {
  for (let i = 0; i < n; i++) addP({ x: rand(0, FW), y: rand(-FH * .4, -10), vx: rand(-40, 40), vy: rand(90, 260), g: 110, life: rand(3.2, 5), size: rand(9, 15), color: pick(CANDY), shape: 'rect', rot: rand(0, 6), vr: rand(-8, 8), wob: rand(1, 3) });
}
function starPath(r) { fc.beginPath(); for (let i = 0; i < 10; i++) { const rr = i % 2 ? r * .45 : r, a = -Math.PI / 2 + i * Math.PI / 5; fc.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } fc.closePath(); }
let fxDirty = false;
const LAVA = ['#ffb000', '#ff8a1c', '#ff6b1a', '#f2421b'];
// Glowing lava fountain above the crater while the volcano erupts
function drawFountain() {
  const c = craterPos(), tm = performance.now() / 1000;
  const h = FH * .2 * (.85 + .15 * Math.sin(tm * 18)) * Math.min(1, G.emitting / .6);
  const wob = Math.sin(tm * 11) * 8;
  const gr = fc.createLinearGradient(0, c.y, 0, c.y - h);
  gr.addColorStop(0, '#ffe45c'); gr.addColorStop(.4, '#ff9f1c'); gr.addColorStop(1, 'rgba(242,66,27,0)');
  fc.fillStyle = 'rgba(255,150,30,.25)';
  fc.beginPath(); fc.ellipse(c.x, c.y - h * .35, 55, h * .55, 0, 0, 7); fc.fill();
  fc.fillStyle = gr; fc.beginPath();
  fc.moveTo(c.x - 26, c.y);
  fc.quadraticCurveTo(c.x - 16 + wob, c.y - h * .6, c.x - 8 + wob, c.y - h);
  fc.lineTo(c.x + 8 + wob, c.y - h);
  fc.quadraticCurveTo(c.x + 16 + wob, c.y - h * .6, c.x + 26, c.y);
  fc.closePath(); fc.fill();
}
function updateFx(dt) {
  const fountain = G.emitting > 0 && G.state === 'erupting';
  if (!parts.length && !fxDirty && !fountain) return;
  fc.clearRect(0, 0, FW, FH); fxDirty = parts.length > 0 || fountain;
  if (fountain) drawFountain();
  const embers = [];
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.age += dt;
    if (p.age >= p.life) { parts.splice(i, 1); continue; }
    p.vy += p.g * dt;
    if (p.drag) { p.vx *= 1 - p.drag * dt; p.vy *= 1 - p.drag * dt; }
    p.x += p.vx * dt + (p.wob ? Math.sin(p.age * p.wob * 3) * 40 * dt : 0);
    p.y += p.vy * dt; p.rot += p.vr * dt;
    if (p.bounce && p.vy > 0 && p.y > FH - p.size - 4) { p.y = FH - p.size - 4; p.vy *= -p.bounce; p.vx *= .8; }
    if (p.shape === 'lava') {
      if (Math.random() < .3) embers.push({ x: p.x, y: p.y, vx: rand(-30, 30), vy: rand(-30, 20), g: 60, life: rand(.3, .6), size: rand(1.8, 3.5), color: pick(['#ffe45c', '#ffb000']), shape: 'ember' });
      if (p.vy > 0 && p.y > p.floor) { p.shape = 'splat'; p.y = p.floor; p.vx = p.vy = p.g = 0; p.age = 0; p.life = rand(1.4, 2.2); }
    }
    fc.globalAlpha = Math.min(1, (p.life - p.age) / .5);
    fc.save(); fc.translate(p.x, p.y);
    if (p.shape === 'lava') {
      // stretched, glowing blob pointing the way it flies
      const len = p.size * (1 + Math.min(1.6, Math.hypot(p.vx, p.vy) / 700));
      fc.rotate(Math.atan2(p.vy, p.vx));
      fc.fillStyle = 'rgba(255,140,20,.28)'; fc.beginPath(); fc.ellipse(0, 0, len * 1.5, p.size * 1.6, 0, 0, 7); fc.fill();
      const gr = fc.createRadialGradient(len * .25, 0, 0, 0, 0, len);
      gr.addColorStop(0, '#fff6b0'); gr.addColorStop(.35, '#ffc53d'); gr.addColorStop(.75, p.color); gr.addColorStop(1, '#c62a1a');
      fc.fillStyle = gr; fc.beginPath(); fc.ellipse(0, 0, len, p.size, 0, 0, 7); fc.fill();
    } else if (p.shape === 'splat') {
      // lands, spreads out a little and cools from orange to dark red
      const t = p.age / p.life, rx = p.size * (1.5 + t * 1.2), ry = p.size * .5;
      fc.fillStyle = '#b8321f'; fc.beginPath(); fc.ellipse(0, 0, rx, ry, 0, 0, 7); fc.fill();
      fc.globalAlpha *= Math.max(0, 1 - t * 1.4);
      fc.fillStyle = '#ff8a1c'; fc.beginPath(); fc.ellipse(0, -ry * .15, rx * .8, ry * .7, 0, 0, 7); fc.fill();
      fc.fillStyle = '#ffe45c'; fc.beginPath(); fc.ellipse(0, -ry * .25, rx * .4, ry * .35, 0, 0, 7); fc.fill();
    } else if (p.shape === 'ember') {
      fc.fillStyle = 'rgba(255,160,30,.35)'; fc.beginPath(); fc.arc(0, 0, p.size * 2.2, 0, 7); fc.fill();
      fc.fillStyle = p.color; fc.beginPath(); fc.arc(0, 0, p.size, 0, 7); fc.fill();
    } else if (p.shape === 'circle') {
      fc.fillStyle = p.color; fc.beginPath(); fc.arc(0, 0, p.size, 0, 7); fc.fill();
      fc.fillStyle = 'rgba(255,255,255,.65)'; fc.beginPath(); fc.arc(-p.size * .35, -p.size * .35, p.size * .3, 0, 7); fc.fill();
    } else if (p.shape === 'rect') {
      fc.rotate(p.rot); fc.scale(1, Math.cos(p.age * 6)); fc.fillStyle = p.color; fc.fillRect(-p.size / 2, -p.size * .3, p.size, p.size * .6);
    } else if (p.shape === 'star') {
      fc.rotate(p.rot); fc.fillStyle = p.color; starPath(p.size); fc.fill();
    }
    fc.restore();
  }
  fc.globalAlpha = 1;
  embers.forEach(addP);
}
function craterPos() {
  const m = qVol.getScreenCTM();
  if (!m) { const r = qVol.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * .23 }; }
  const pt = qVol.createSVGPoint(); pt.x = 200; pt.y = 88; const q = pt.matrixTransform(m);
  return { x: q.x, y: q.y };
}
function emitEruption() {
  const c = craterPos(), k = Math.sqrt(FH / 800);
  for (let i = 0; i < 3; i++) addP({ x: c.x + rand(-20, 20), y: c.y - rand(0, 30), vx: rand(-360, 360) * k, vy: rand(-1100, -600) * k, g: 1300 * k, life: 6, size: rand(8, 17), color: pick(LAVA), shape: 'lava', floor: rand(FH * .92, FH - 8) });
  if (Math.random() < .07) spawnPuff();
}
function spawnPuff() {
  const p = document.createElement('div'); p.className = 'puff';
  p.style.setProperty('--s', randi(28, 56) + 'px');
  p.style.setProperty('--pc', pick(['#e9e4ff', '#ffe3ef', '#e3f6ff', '#f4f4f4']));
  p.style.left = `calc(50% + ${randi(-24, 24)}px)`;
  p.addEventListener('animationend', () => p.remove());
  $('#qVolWrap').appendChild(p);
}
