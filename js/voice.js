// Spoken prompts using the browser's built-in voices (Web Speech API).
'use strict';

/* ================= VOICE (Web Speech API) ================= */
const V = { voice: null, speaking: false, cur: 0, keep: null };
const hasTTS = 'speechSynthesis' in window;
V.pick = function () {
  if (!hasTTS) return;
  const vs = speechSynthesis.getVoices(); if (!vs.length) return;
  const en = vs.filter(v => /^en([-_]|$)/i.test(v.lang)); const pool = en.length ? en : vs;
  const prefs = ['Ana Online', 'Aria Online', 'Jenny Online', 'Samantha', 'Google US English', 'Karen', 'Moira', 'Tessa', 'Zira', 'Susan', 'Female', 'Aria', 'Jenny'];
  for (const p of prefs) { const v = pool.find(v => v.name.includes(p)); if (v) { V.voice = v; return; } }
  V.voice = pool.find(v => /en-US/i.test(v.lang)) || pool[0];
};
if (hasTTS) { V.pick(); speechSynthesis.onvoiceschanged = V.pick; }
V.say = function (text) {
  return new Promise(res => {
    const id = ++V.cur;
    $('#repeat').classList.remove('talking');
    if (!S.voice || !hasTTS) { setTimeout(res, 500); return; }
    let done = false, to = 0;
    const fin = () => {
      if (done) return; done = true; clearTimeout(to);
      if (id === V.cur) { V.speaking = false; A.setDuck(false); $('#repeat').classList.remove('talking'); }
      res();
    };
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (V.voice) { u.voice = V.voice; u.lang = V.voice.lang; } else u.lang = 'en-US';
    u.rate = .86; u.pitch = 1.3; u.volume = 1;
    u.onstart = () => { if (id === V.cur) { V.speaking = true; A.setDuck(true); if (G.state === 'quiz') $('#repeat').classList.add('talking'); } };
    u.onend = fin; u.onerror = fin;
    V.keep = u; // keep a reference so the browser does not drop the end event
    to = setTimeout(fin, 2000 + text.length * 95);
    V.speaking = true;
    speechSynthesis.speak(u);
  });
};
V.stop = () => { V.cur++; V.speaking = false; if (hasTTS) speechSynthesis.cancel(); A.setDuck(false); $('#repeat').classList.remove('talking'); };
