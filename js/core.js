// Helpers, grown-up settings, and the spoken phrases.
'use strict';

const $ = s => document.querySelector(s);
const wait = ms => new Promise(r => setTimeout(r, ms));
const rand = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => Math.floor(rand(a, b + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
// Draw from a shuffled deck so phrases rotate without quick repeats
function deck(arr) { let d = [], last = null; return () => { if (!d.length) { d = shuffle(arr); if (d[0] === last && d.length > 1) d.push(d.shift()); } last = d.shift(); return last; }; }

/* ================= SETTINGS ================= */
const DEFAULTS = { mode: 'numbers', numMax: 10, letterCase: 'upper', mathOps: 'plus', choices: 3, pieces: 12, shapes: 'square', speed: 'slow', music: true, voice: true };
const S = Object.assign({}, DEFAULTS);
try { const saved = JSON.parse(sessionStorage.getItem('vf-settings')); if (saved) Object.assign(S, saved); } catch (e) {}
const saveS = () => { try { sessionStorage.setItem('vf-settings', JSON.stringify(S)); } catch (e) {} };
const SPEED = { slow: 18, medium: 12, fast: 8 }; // seconds until eruption

/* ================= PHRASES ================= */
const praise = deck(["Good job!", "You did great!", "Wow, you're so smart!", "High five!", "Awesome!", "You got it!", "Super duper!", "Fantastic!", "Way to go!", "Yay, you did it!", "Amazing!", "Hooray!", "That's right!", "You're a star!", "Brilliant!"]);
const encourage = deck(["Oops, try again!", "Almost! Try another one!", "Good try! Pick another one!", "Hmm, try again!", "Ooh, so close! Try again!"]);
const cheer = deck(["Nice!", "You got it!", "Great!", "Yay!", "Perfect!", "Good one!", "Wow!"]);
const eruptLines = deck(["Wheee! Look at all that lava! Let's try again!", "Kaboom! That was so silly! Let's try again!", "Whoa, lava everywhere! Let's try again!"]);
const rewardLines = ["Hooray! You answered ten questions! You're a volcano superstar!", "Wow! Ten stars! The volcano is so happy! Let's dance!"];
