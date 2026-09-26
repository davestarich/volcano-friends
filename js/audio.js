// Music and sound effects, generated live with the Web Audio API (no audio files).
'use strict';

/* ================= AUDIO (Web Audio, no files) ================= */
const A = { ctx: null, master: null, music: null, sfx: null, noise: null, muted: false, musicOn: false, duck: false, step: 0, nextT: 0 };
A.init = function () {
  if (A.ctx) { if (A.ctx.state !== 'running' && !document.hidden) A.ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  const c = A.ctx = new AC();
  const comp = c.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(c.destination);
  A.master = c.createGain(); A.master.connect(comp);
  A.music = c.createGain(); A.music.gain.value = 0; A.music.connect(A.master);
  A.sfx = c.createGain(); A.sfx.gain.value = .9; A.sfx.connect(A.master);
  const b = c.createBuffer(1, c.sampleRate, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  A.noise = b;
  setInterval(A.schedule, 40);
  A.applyMute();
};
const now = () => A.ctx.currentTime;
const mf = m => 440 * Math.pow(2, (m - 69) / 12);
function note(t, f, dur, o = {}) {
  const c = A.ctx; if (!c) return;
  const osc = c.createOscillator(), g = c.createGain();
  osc.type = o.type || 'sine';
  osc.frequency.setValueAtTime(f, t);
  if (o.slide) osc.frequency.exponentialRampToValueAtTime(o.slide, t + (o.slideT || dur));
  const v = o.vol || .2, at = o.attack || .008;
  g.gain.setValueAtTime(.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + at);
  g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  osc.connect(g); g.connect(o.dest || A.sfx);
  osc.start(t); osc.stop(t + dur + .05);
  return osc;
}
function noiseHit(t, dur, o = {}) {
  const c = A.ctx; if (!c) return;
  const s = c.createBufferSource(); s.buffer = A.noise;
  const f = c.createBiquadFilter(); f.type = o.ftype || 'highpass'; f.frequency.setValueAtTime(o.freq || 5000, t);
  if (o.sweep) f.frequency.exponentialRampToValueAtTime(o.sweep, t + dur);
  f.Q.value = o.q || 1;
  const g = c.createGain(); g.gain.setValueAtTime(.0001, t);
  g.gain.exponentialRampToValueAtTime(o.vol || .1, t + (o.attack || .005));
  g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(o.dest || A.sfx);
  s.start(t, Math.random() * .4); s.stop(t + dur + .05);
}
function bell(t, f, dur, vol) { note(t, f, dur, { vol }); note(t, f * 2.01, dur * .5, { vol: vol * .3 }); note(t, f * 3.02, dur * .25, { vol: vol * .12 }); }

const SFX = {
  tap() { if (!A.ctx) return; note(now(), 660, .12, { slide: 990, vol: .18 }); },
  pick() { if (!A.ctx) return; note(now(), 440, .12, { type: 'triangle', slide: 760, vol: .16 }); },
  snap() {
    if (!A.ctx) return; const t = now();
    note(t, 900, .14, { slide: 260, vol: .35 }); noiseHit(t, .04, { freq: 2500, vol: .12 });
    bell(t + .06, mf(84), .4, .12);
  },
  chime() { if (!A.ctx) return; const t = now(); [72, 76, 79, 84].forEach((m, i) => bell(t + i * .09, mf(m), .9, .17)); },
  soft() { if (!A.ctx) return; note(now(), 320, .16, { slide: 480, vol: .12 }); },
  wobble() {
    if (!A.ctx) return; const t = now(), c = A.ctx;
    const o = c.createOscillator(), g = c.createGain(); o.type = 'triangle';
    o.frequency.setValueAtTime(130, t);
    for (let i = 1; i <= 7; i++) o.frequency.linearRampToValueAtTime(i % 2 ? 165 : 110, t + i * .07);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.2, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .55);
    o.connect(g); g.connect(A.sfx); o.start(t); o.stop(t + .6);
  },
  roar() {
    if (!A.ctx) return; const t = now(), c = A.ctx;
    const o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(150, t); o.frequency.linearRampToValueAtTime(230, t + .15); o.frequency.exponentialRampToValueAtTime(110, t + .8);
    lfo.frequency.value = 28; lg.gain.value = 18; lfo.connect(lg); lg.connect(o.frequency);
    f.type = 'lowpass'; f.frequency.value = 900; f.Q.value = 4;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.25, t + .08); g.gain.exponentialRampToValueAtTime(.0001, t + .85);
    o.connect(f); f.connect(g); g.connect(A.sfx); o.start(t); lfo.start(t); o.stop(t + .9); lfo.stop(t + .9);
  },
  squawk() { if (!A.ctx) return; const t = now(); note(t, 700, .18, { type: 'square', slide: 1300, vol: .07 }); note(t + .2, 900, .25, { type: 'square', slide: 600, vol: .07 }); },
  boing() { if (!A.ctx) return; note(now(), 180, .45, { type: 'triangle', slide: 640, vol: .22 }); },
  fanfare() {
    if (!A.ctx) return; const t = now();
    [[60, 0], [64, .12], [67, .24], [72, .36], [67, .52], [72, .64]].forEach(([m, d]) => { note(t + d, mf(m), .2, { type: 'square', vol: .05 }); bell(t + d, mf(m + 12), .3, .1); });
    [72, 76, 79].forEach(m => { note(t + .82, mf(m), 1, { type: 'triangle', vol: .09 }); bell(t + .82, mf(m + 12), 1, .06); });
  },
  star(i) { if (!A.ctx) return; bell(now(), mf(72 + [0, 2, 4, 5, 7, 9, 11, 12, 14, 16][i % 10]), .5, .15); },
  giggle(t0) { for (let i = 0; i < 8; i++) note(t0 + i * .11, i % 2 ? 1040 : 860, .09, { type: 'triangle', vol: .09, slide: i % 2 ? 940 : 990 }); },
  erupt() {
    if (!A.ctx) return; const t = now();
    noiseHit(t, 1, { ftype: 'bandpass', freq: 300, sweep: 3000, vol: .22, attack: .15, q: 1.5 });
    note(t, 200, .8, { type: 'triangle', slide: 1100, vol: .12 });
    for (let i = 0; i < 16; i++) note(t + .5 + i * .14 + rand(0, .07), rand(220, 480), .14, { slide: 90, vol: .2 }); // lava bloops
    SFX.giggle(t + 1.3);
  }
};

// Background music: a bouncy 8-bar loop in C major
const BPM = 116, ST = 60 / BPM / 2;
const MEL = [76, 0, 79, 76, 72, 0, 74, 76, 77, 0, 81, 77, 72, 0, 74, 77, 79, 0, 77, 76, 74, 0, 71, 74, 72, 76, 79, 84, 79, 0, 76, 0,
  79, 0, 76, 79, 84, 0, 79, 76, 81, 0, 77, 81, 84, 0, 81, 77, 79, 77, 76, 74, 71, 74, 79, 0, 72, 0, 76, 0, 72, 0, 0, 0];
const ROOTS = [48, 53, 43, 48, 48, 53, 43, 48];
const CHORD = { 48: [64, 67, 72], 53: [65, 69, 72], 43: [62, 67, 71] };
A.schedule = function () {
  if (!A.ctx || !A.musicOn || A.ctx.state !== 'running') return;
  const c = A.ctx;
  if (A.nextT < c.currentTime) A.nextT = c.currentTime + .05;
  while (A.nextT < c.currentTime + .25) { A.playStep(A.step, A.nextT); A.nextT += ST; A.step = (A.step + 1) % 64; }
};
A.playStep = function (s, t) {
  const bar = Math.floor(s / 8), b = s % 8, root = ROOTS[bar], d = A.music;
  const m = MEL[s];
  if (m) { note(t, mf(m), .32, { vol: .16, dest: d }); note(t, mf(m) * 4, .07, { vol: .025, dest: d }); }
  if (b % 2 === 0) note(t, mf([root, root + 7, root + 12, root + 7][b / 2]), .24, { type: 'triangle', vol: .28, dest: d });
  if (b === 2 || b === 6) CHORD[root].forEach(x => note(t, mf(x), .14, { type: 'triangle', vol: .045, dest: d }));
  if (b % 2 === 1) noiseHit(t, .035, { freq: 7000, vol: .03, dest: d });
};
A.setMusic = function (on) {
  if (!A.ctx) return;
  A.musicOn = on;
  if (on) A.nextT = A.ctx.currentTime + .08;
  A.music.gain.cancelScheduledValues(A.ctx.currentTime);
  A.music.gain.setTargetAtTime(on ? (A.duck ? .15 : .5) : 0, A.ctx.currentTime, .15);
};
A.setDuck = function (d) { A.duck = d; if (A.ctx && A.musicOn) A.music.gain.setTargetAtTime(d ? .15 : .5, A.ctx.currentTime, .12); };
A.applyMute = function () { if (A.ctx) A.master.gain.setTargetAtTime(A.muted ? 0 : 1, A.ctx.currentTime, .05); };
