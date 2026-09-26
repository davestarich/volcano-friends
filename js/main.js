// Buttons on screen, grown-up settings panel, the home screen, and starting the app.
'use strict';

/* ================= HUD: mute, gear, settings ================= */
$('#mute').addEventListener('pointerdown', e => {
  e.preventDefault(); A.init(); A.muted = !A.muted; A.applyMute();
  $('#mute').classList.toggle('off', A.muted);
});
(function gearHold() {
  const g = $('#gear'), ring = g.querySelector('.ring'), C = 2 * Math.PI * 28;
  let t0 = 0, raf = 0, timer = 0;
  ring.style.strokeDasharray = C; ring.style.strokeDashoffset = C;
  const cancel = () => { cancelAnimationFrame(raf); clearTimeout(timer); raf = 0; ring.style.strokeDashoffset = C; g.classList.remove('holding'); };
  // The ring is just the visual; the timer decides when 3 seconds have passed
  const tick = () => {
    ring.style.strokeDashoffset = C * (1 - Math.min(1, (performance.now() - t0) / 3000));
    raf = requestAnimationFrame(tick);
  };
  g.addEventListener('pointerdown', e => {
    e.preventDefault(); e.stopPropagation();
    try { g.setPointerCapture(e.pointerId); } catch (_) {}
    cancel(); t0 = performance.now(); g.classList.add('holding'); raf = requestAnimationFrame(tick);
    timer = setTimeout(() => { cancel(); openSettings(); }, 3000);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => g.addEventListener(ev, cancel));
})();

const OPTS = [
  { key: 'mode', label: 'Learning mode', opts: [['numbers', 'Numbers'], ['letters', 'Letters'], ['math', 'Math']] },
  { key: 'numMax', label: 'Numbers range', opts: [[10, '1 to 10'], [20, '1 to 20']], show: () => S.mode === 'numbers' },
  { key: 'letterCase', label: 'Letters', opts: [['upper', 'Uppercase ABC'], ['lower', 'Lowercase abc'], ['both', 'Both']], show: () => S.mode === 'letters' },
  { key: 'mathOps', label: 'Math (within 10)', opts: [['plus', 'Adding'], ['both', 'Adding + taking away']], show: () => S.mode === 'math' },
  { key: 'choices', label: 'Answer bubbles', opts: [[3, '3'], [4, '4 (Advanced)']] },
  { key: 'speed', label: 'Volcano speed', opts: [['slow', 'Slow'], ['medium', 'Medium'], ['fast', 'Fast']] },
  { key: 'music', label: 'Music', opts: [[true, 'On'], [false, 'Off']] },
  { key: 'voice', label: 'Voice', opts: [[true, 'On'], [false, 'Off']] },
];
function renderSettings() {
  const box = $('#setRows'); box.innerHTML = '';
  OPTS.forEach(o => {
    if (o.show && !o.show()) return;
    const row = document.createElement('div'); row.className = 'srow';
    row.innerHTML = `<label>${o.label}</label>`;
    const seg = document.createElement('div'); seg.className = 'seg';
    o.opts.forEach(([v, txt]) => {
      const b = document.createElement('button'); b.textContent = txt;
      b.setAttribute('aria-pressed', String(S[o.key] === v));
      b.addEventListener('click', () => {
        S[o.key] = v; saveS(); renderSettings();
        if (o.key === 'music') A.setMusic(S.music);
      });
      seg.appendChild(b);
    });
    row.appendChild(seg); box.appendChild(row);
  });
  if (S.voice && hasTTS) voiceRows(box);
}
// Voice picker: every voice this device has (English first), a Test button, and a pitch choice
const shortVoiceName = n => n.replace(/^Microsoft /, '').replace(/ Online \(Natural\)/, ' (natural)').replace(/ - .*$/, '');
function voiceRows(box) {
  const row = document.createElement('div'); row.className = 'srow';
  row.innerHTML = '<label for="voicePick">Which voice</label>';
  const seg = document.createElement('div'); seg.className = 'seg';
  const sel = document.createElement('select'); sel.id = 'voicePick';
  const vs = V.all();
  if (!vs.length) { sel.add(new Option('Loading voices...', '')); sel.disabled = true; }
  else {
    const auto = V.auto();
    sel.add(new Option(`Automatic (${shortVoiceName(auto.name)})`, ''));
    const group = (label, list) => {
      if (!list.length) return;
      const g = document.createElement('optgroup'); g.label = label;
      list.sort((a, b) => a.name.localeCompare(b.name)).forEach(v => g.appendChild(new Option(`${shortVoiceName(v.name)} (${v.lang})`, v.name)));
      sel.appendChild(g);
    };
    group('English', vs.filter(isEnglish)); group('Other languages', vs.filter(v => !isEnglish(v)));
    sel.value = VP.name && vs.some(v => v.name === VP.name) ? VP.name : '';
  }
  sel.addEventListener('change', () => { VP.name = sel.value; saveVP(); V.pick(); V.say(VOICE_SAMPLE); });
  const test = document.createElement('button'); test.textContent = 'Test'; test.className = 'test';
  test.addEventListener('click', () => { A.init(); V.say(VOICE_SAMPLE); });
  seg.append(sel, test); row.appendChild(seg); box.appendChild(row);

  const prow = document.createElement('div'); prow.className = 'srow';
  prow.innerHTML = '<label>Voice pitch</label>';
  const pseg = document.createElement('div'); pseg.className = 'seg';
  [['normal', 'Normal'], ['higher', 'Higher'], ['highest', 'Highest']].forEach(([v, txt]) => {
    const b = document.createElement('button'); b.textContent = txt;
    b.setAttribute('aria-pressed', String(VP.pitch === v));
    b.addEventListener('click', () => { VP.pitch = v; saveVP(); renderSettings(); V.say(VOICE_SAMPLE); });
    pseg.appendChild(b);
  });
  prow.appendChild(pseg); box.appendChild(prow);
}
// Voices can finish loading after the settings panel is already open
V.onVoices = () => { if ($('#settings').classList.contains('show')) renderSettings(); };
const qSnap = () => JSON.stringify([S.mode, S.numMax, S.letterCase, S.mathOps, S.choices]);
function openSettings() {
  G.paused = true; V.stop();
  G.snap = qSnap();
  renderSettings(); $('#settings').classList.add('show');
}
function closeSettings() {
  $('#settings').classList.remove('show'); G.paused = false;
}
$('#sDone').addEventListener('click', () => {
  closeSettings();
  if (['quiz', 'correct', 'erupting'].includes(G.state)) {
    if (qSnap() !== G.snap) nextQuestion();
    else if (G.state === 'quiz' && G.q) V.say(G.q.speech);
  }
});
// From the start screen these buttons also count as "press play" (unlocks sound on tablets)
// The first tap anywhere meaningful unlocks sound on tablets (and goes full screen on touch devices)
function wakeAudio() {
  A.init();
  if (!G.woke) { G.woke = true; if (matchMedia('(pointer:coarse)').matches) goFull(); A.setMusic(S.music); }
}
$('#sPuzzle').addEventListener('click', () => { closeSettings(); wakeAudio(); showPicker(); });
$('#sSkip').addEventListener('click', () => { closeSettings(); wakeAudio(); startQuiz(true); });
$('#sFull').addEventListener('click', () => { if (document.fullscreenElement || document.webkitFullscreenElement) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } else goFull(); });
$('#settings').addEventListener('pointerdown', e => { if (e.target.id === 'settings') $('#sDone').click(); });

function goFull() {
  const el = document.documentElement, rf = el.requestFullscreen || el.webkitRequestFullscreen;
  if (!rf || document.fullscreenElement) return;
  try {
    const p = rf.call(el, { navigationUI: 'hide' });
    const lock = () => { try { screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape').catch(() => {}); } catch (e) {} };
    if (p && p.then) p.then(lock).catch(() => {}); else lock();
  } catch (e) {}
}

/* ================= HOME: pick puzzles or the volcano game ================= */
function homeBtn(on) { $('#homeBtn').classList.toggle('hidden', !on); }
function showHome() {
  G.token++; G.state = 'home'; G.rumbling = false; G.paused = false;
  V.stop(); resetVolcano(); dinoDo(null); showOnly(null); homeBtn(false);
  ['#reward', '#picker'].forEach(s => $(s).classList.remove('show', 'ready'));
  const dino = PUZZLES[randi(1, PUZZLES.length - 1)]; pickVersion(dino);
  $('#goPuzzle').style.backgroundImage = dino.pic;
  $('#start').classList.add('show');
  if (G.woke) V.say('What do you want to play? Puzzles, or the volcano game?');
}
$('#goPuzzle').addEventListener('click', () => { wakeAudio(); SFX.tap(); showPicker(); });
$('#goQuiz').addEventListener('click', () => { wakeAudio(); SFX.tap(); startQuiz(true); });
$('#homeBtn').addEventListener('click', () => { A.init(); SFX.tap(); showHome(); });
showHome();

/* ================= GLOBAL ================= */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('pointerdown', () => { if (A.ctx && A.ctx.state !== 'running' && !document.hidden) A.ctx.resume(); }, true);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { if (A.ctx) A.ctx.suspend(); V.stop(); G.paused = true; }
  else { if (A.ctx) A.ctx.resume(); if (!$('#settings').classList.contains('show')) G.paused = false; }
});
let rsz = 0;
window.addEventListener('resize', () => {
  sizeFx();
  clearTimeout(rsz); rsz = setTimeout(() => { if (G.state === 'puzzle') layoutPuzzle(true); }, 120);
});
sizeFx();
requestAnimationFrame(frame);
