// The volcano game: questions, rumble meter, eruption, rewards, and the main animation loop.
'use strict';

/* ================= PHASE 2: KEEP THE VOLCANO CALM ================= */
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const BUB_COLORS = [['#2ec4b6', '#1a9d91'], ['#9b5de5', '#7433c7'], ['#ff5d8f', '#e0356d'], ['#ffb703', '#f08c00'], ['#3a86ff', '#1c63d6'], ['#6bcb3a', '#46a01c'], ['#ff8c42', '#e5661a']];

function numberChoices(answer, n, lo, hi, near) {
  let pool = []; for (let v = lo; v <= hi; v++) if (v !== answer) pool.push(v);
  if (near) pool = pool.map(v => [v, Math.abs(v - answer) + Math.random() * 2.5]).sort((a, b) => a[1] - b[1]).map(a => a[0]);
  else pool = shuffle(pool);
  return pool.slice(0, n - 1);
}
function dinoGroup(count, color, fadeLast = 0) {
  let d = '';
  for (let i = 0; i < count; i++) d += `<svg class="dn${i >= count - fadeLast ? ' gone' : ''}" viewBox="0 0 64 56" style="color:${color}"><use href="#dino"/></svg>`;
  return `<div class="grp"><div class="dinos" style="grid-template-columns:repeat(${Math.min(count, 5)},auto)">${d}</div><div class="num">${count}</div></div>`;
}
function makeQuestion() {
  const n = +S.choices;
  let q, key;
  for (let tries = 0; tries < 20; tries++) {
    if (S.mode === 'letters') {
      const L = pick(LETTERS), both = S.letterCase === 'both';
      const tc = both ? (Math.random() < .5 ? 'upper' : 'lower') : S.letterCase;
      const fmt = (x, c) => c === 'lower' ? x.toLowerCase() : x;
      const others = shuffle(LETTERS.filter(x => x !== L)).slice(0, n - 1);
      const items = [{ id: L, label: fmt(L, tc) }].concat(others.map(x => ({ id: x, label: fmt(x, both ? (Math.random() < .5 ? 'upper' : 'lower') : tc) })));
      const name = both ? (tc === 'lower' ? `little letter, ${L}` : `big letter, ${L}`) : `letter, ${L}`;
      key = 'L' + L + tc;
      q = { answer: L, items: shuffle(items), speech: pick([`Can you find the ${name}?`, `Where is the ${name}?`, `Tap the ${name}!`]), problem: null };
    } else if (S.mode === 'math') {
      const op = S.mathOps === 'both' ? pick(['+', '-']) : '+';
      let a, b, r;
      if (op === '+') { do { a = randi(1, 6); b = randi(1, 5); } while (a + b > 10); r = a + b; }
      else { a = randi(2, 10); b = randi(1, Math.min(5, a - 1)); r = a - b; }
      key = a + op + b;
      const items = [r].concat(numberChoices(r, n, 0, 10, true)).map(v => ({ id: v, label: String(v) }));
      const problem = op === '+'
        ? `${dinoGroup(a, '#6bcb3a')}<div class="op">+</div>${dinoGroup(b, '#b388ff')}<div class="op">=</div><div class="qm">?</div>`
        : `${dinoGroup(a, '#6bcb3a', b)}<div class="op">&minus;</div>${dinoGroup(b, '#6bcb3a', b)}<div class="op">=</div><div class="qm">?</div>`;
      q = { answer: r, items: shuffle(items), problem, speech: op === '+' ? `What is ${a} plus ${b}?` : `What is ${a} take away ${b}?` };
    } else {
      const max = +S.numMax, t = randi(1, max);
      key = 'N' + t;
      const items = [t].concat(numberChoices(t, n, 1, max, false)).map(v => ({ id: v, label: String(v) }));
      q = { answer: t, items: shuffle(items), problem: null, speech: pick([`Can you find the number, ${t}?`, `Where is the number, ${t}?`, `Tap the number, ${t}!`, `Find the number, ${t}!`]) };
    }
    if (key !== G.lastKey) break;
  }
  G.lastKey = key;
  return q;
}
function renderQuestion(q) {
  const pb = $('#problem');
  pb.style.display = q.problem ? 'flex' : 'none'; pb.innerHTML = q.problem || '';
  const bx = $('#bubbles'); bx.innerHTML = ''; bx.classList.remove('away');
  bx.style.setProperty('--n', q.items.length);
  const cols = shuffle(BUB_COLORS);
  q.items.forEach((it, i) => {
    const b = document.createElement('button'); b.className = 'bubble';
    b.style.setProperty('--c', cols[i][0]); b.style.setProperty('--c2', cols[i][1]);
    b.style.setProperty('--d', (i * .12) + 's');
    b.innerHTML = `<span>${it.label}</span>`;
    b.addEventListener('pointerdown', e => { e.preventDefault(); A.init(); onAnswer(b, it.id); });
    bx.appendChild(b);
  });
}
function renderProgress() {
  $('#prog').innerHTML = Array.from({ length: 10 }, (_, i) => `<span class="dot${i < G.count ? ' on' : ''}">${starSVG(i < G.count ? '#ffd93d' : '#ffffff')}</span>`).join('');
}
function setMeter(L) { const y = 345 - L * 326; lavaFill.setAttribute('y', y); lavaFill.setAttribute('height', 420 - y); }
function setStage(s) {
  if (s === G.stage) return;
  const up = s > G.stage; G.stage = s;
  const w = $('#qVolWrap'); w.classList.remove('r1', 'r2', 'r3'); if (s > 0) w.classList.add('r' + s);
  setFace(qVol, s <= 1 ? 'calm' : s === 2 ? 'nervous' : 'worried');
  $('#meter').classList.toggle('hot', s === 3);
  if (up && s >= 1) SFX.wobble();
  if (s === 3) dinoDo('nervous'); else if (dino.classList.contains('nervous')) dinoDo(null);
}
function resetVolcano() {
  const w = $('#qVolWrap'); w.classList.remove('r1', 'r2', 'r3', 'erupt');
  qVol.classList.remove('erupting'); $('#meter').classList.remove('hot');
  G.emitting = 0; G.draining = false;
}
function startQuiz(fresh) {
  homeBtn(true);
  G.token++; G.paused = false;
  ['#reward', '#celebrate', '#start'].forEach(s => $(s).classList.remove('show', 'ready'));
  showOnly('quiz');
  if (fresh) G.count = 0;
  renderProgress(); dinoDo(null);
  nextQuestion();
}
async function nextQuestion() {
  const t = ++G.token;
  G.state = 'quiz'; G.rumbling = false;
  resetVolcano(); G.level = 0; setMeter(0); G.stage = -1; setStage(0); setFace(qVol, 'calm');
  G.q = makeQuestion(); renderQuestion(G.q);
  await wait(450); if (t !== G.token) return;
  await V.say(G.q.speech); if (t !== G.token) return;
  G.rumbling = true;
}
function onAnswer(b, id) {
  if (G.state !== 'quiz' || G.paused || b.classList.contains('wrong')) return;
  if (id === G.q.answer) correct(b);
  else {
    b.classList.add('wrong'); SFX.soft();
    V.say(encourage());
  }
}
async function correct(b) {
  const t = ++G.token; G.state = 'correct'; G.rumbling = false; G.draining = true;
  b.classList.add('right');
  document.querySelectorAll('.bubble').forEach(x => { if (x !== b) x.classList.add('dim'); });
  const r = b.getBoundingClientRect(); sparkle(r.left + r.width / 2, r.top + r.height / 2, 22);
  SFX.chime(); dinoDo('hop');
  const w = $('#qVolWrap'); w.classList.remove('r1', 'r2', 'r3'); $('#meter').classList.remove('hot'); G.stage = 0;
  setFace(qVol, 'happy');
  G.count++; renderProgress();
  await V.say(praise()); if (t !== G.token) return;
  await wait(500); if (t !== G.token) return;
  if (G.count >= 10) showReward(); else nextQuestion();
}
async function erupt() {
  const t = ++G.token; G.state = 'erupting'; G.rumbling = false; G.level = 1; setMeter(1);
  const w = $('#qVolWrap'); w.classList.remove('r1', 'r2', 'r3'); w.classList.add('erupt');
  qVol.classList.add('erupting'); setFace(qVol, 'giggle'); $('#meter').classList.remove('hot');
  $('#bubbles').classList.add('away');
  SFX.erupt(); G.emitting = 2.8; dinoDo('dance');
  const line = G.erupts++ === 0 ? "Whoa, what a big eruption! Let's try again!" : eruptLines();
  await Promise.all([V.say(line), wait(4300)]); if (t !== G.token) return;
  // settle down, then the same question continues
  w.classList.remove('erupt'); qVol.classList.remove('erupting'); setFace(qVol, 'calm'); G.draining = true; dinoDo(null);
  await wait(1000); if (t !== G.token) return;
  G.state = 'quiz'; G.stage = -1; setStage(0);
  document.querySelectorAll('.bubble').forEach(x => x.classList.remove('wrong'));
  $('#bubbles').classList.remove('away');
  await V.say(G.q.speech); if (t !== G.token) return;
  G.rumbling = true;
}
async function showReward() {
  const t = ++G.token; G.state = 'reward'; G.rumbling = false;
  showOnly(null);
  const r = $('#reward'); r.classList.remove('ready'); r.classList.add('show');
  const st = $('#rStars');
  st.innerHTML = Array.from({ length: 10 }, (_, i) => `<span class="rstar">${starSVG(CANDY[i % CANDY.length])}</span>`).join('');
  confetti(180); SFX.fanfare(); dinoDo('dance');
  for (let i = 0; i < 10; i++) { await wait(180); if (t !== G.token) return; st.children[i].classList.add('on'); SFX.star(i); }
  V.say(pick(rewardLines));
  await wait(600); if (t !== G.token) return;
  r.classList.add('ready');
}

$('#repeat').addEventListener('pointerdown', e => {
  e.preventDefault(); A.init();
  if (G.q && (G.state === 'quiz' || G.state === 'correct') && !G.paused) { SFX.tap(); V.say(G.q.speech); }
});
$('#againBtn').addEventListener('click', () => { A.init(); SFX.tap(); startQuiz(true); });
$('#puzBtn').addEventListener('click', () => { A.init(); SFX.tap(); showHome(); });

/* ================= MAIN LOOP ================= */
let lastT = performance.now();
function frame(t) {
  const dt = Math.min(.05, (t - lastT) / 1000); lastT = t;
  if (G.state === 'quiz' && G.rumbling && !G.paused) {
    G.level = Math.min(1, G.level + dt / SPEED[S.speed]);
    setMeter(G.level);
    setStage(G.level < .3 ? 0 : G.level < .55 ? 1 : G.level < .8 ? 2 : 3);
    if (G.stage >= 2) { G.puffT -= dt; if (G.puffT <= 0) { spawnPuff(); G.puffT = G.stage === 2 ? 1.1 : .5; } }
    if (G.level >= 1) erupt();
  }
  if (G.draining) { G.level = Math.max(0, G.level - dt * 1.3); setMeter(G.level); if (G.level === 0) G.draining = false; }
  if (G.emitting > 0) { G.emitting -= dt; emitEruption(); }
  updateFx(dt);
  requestAnimationFrame(frame);
}
