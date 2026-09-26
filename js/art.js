// All drawings (volcano, dinosaurs, scenes, puzzle pictures) and building the static SVG on the page.
'use strict';

/* ================= ART ================= */
function volcanoDefs() {
  return `<linearGradient id="vBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffac66"/><stop offset="1" stop-color="#e2683c"/></linearGradient>
<linearGradient id="vLava" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe14d"/><stop offset="1" stop-color="#ff4f7b"/></linearGradient>
<linearGradient id="vFlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe45c"/><stop offset=".45" stop-color="#ff9f1c"/><stop offset="1" stop-color="#f0441c"/></linearGradient>
<symbol id="dino" viewBox="0 0 64 56">
 <path d="M7,40 Q1,31 10,30 L19,33 Q21,19 35,17 Q39,5 49,6 Q60,8 58,18 Q56,24 48,24 L46,30 Q53,43 44,48 L43,54 L36,54 L36,48 L27,48 L27,54 L20,54 L20,46 Q11,46 7,40Z" fill="currentColor" stroke="#2b2b4a" stroke-width="2.5" stroke-linejoin="round"/>
 <path d="M24,21 l3,-6 l3,5 M31,18 l3,-6 l3,5" fill="#ffb347" stroke="#2b2b4a" stroke-width="1.6" stroke-linejoin="round"/>
 <circle cx="51" cy="12" r="3.4" fill="#fff"/><circle cx="52" cy="12.4" r="1.8" fill="#222"/>
 <path d="M49,19 Q53,21.5 57,18" stroke="#2b2b4a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
</symbol>
<symbol id="star" viewBox="0 0 64 64"><path d="M32,5 L40,23 L59,24 L44,37 L49,57 L32,46 L15,57 L20,37 L5,24 L24,23Z" fill="currentColor" stroke="#e08a00" stroke-width="4" stroke-linejoin="round"/></symbol>`;
}
function volcanoBody() {
  return `<ellipse cx="200" cy="360" rx="178" ry="14" fill="#000" opacity=".12"/>
<path d="M30,355 C70,300 95,190 138,112 C148,95 158,88 172,88 L228,88 C242,88 252,95 262,112 C305,190 330,300 370,355 Z" fill="url(#vBody)" stroke="#8a3d24" stroke-width="7" stroke-linejoin="round"/>
<ellipse cx="108" cy="312" rx="17" ry="9" fill="#c9582f" opacity=".45"/><ellipse cx="300" cy="300" rx="13" ry="7" fill="#c9582f" opacity=".45"/><ellipse cx="272" cy="170" rx="9" ry="6" fill="#c9582f" opacity=".4"/>
<path d="M160,92 C162,120 172,128 176,110 C180,138 192,140 196,112 C200,132 212,134 214,110 C218,128 232,126 240,92 Z" fill="url(#vLava)" stroke="#8a3d24" stroke-width="5" stroke-linejoin="round"/>
<ellipse cx="200" cy="90" rx="42" ry="11" fill="#ff6b6b" stroke="#8a3d24" stroke-width="6"/>
<ellipse cx="200" cy="88" rx="29" ry="5.5" fill="#ffe066"/>
<path d="M30,355 Q45,335 62,350 Q78,330 96,350 Q112,332 130,352 Q150,334 168,352 Q186,334 204,352 Q222,334 240,352 Q258,334 276,352 Q294,332 312,350 Q330,332 348,350 Q360,338 370,355 Z" fill="#5ccf6a" stroke="#2f8a44" stroke-width="5" stroke-linejoin="round"/>
<circle cx="128" cy="258" r="20" fill="#ff7aa8" opacity=".55"/><circle cx="272" cy="258" r="20" fill="#ff7aa8" opacity=".55"/>`;
}
// Lava that pours over the top and runs down both sides during an eruption
const LAVA_FLOW = `<g class="lavaflow" fill="url(#vFlow)" stroke="#b8321f" stroke-width="5" stroke-linejoin="round">
<path d="M150,118 C126,170 106,215 90,258 C80,286 70,312 62,336 Q72,348 84,334 C94,306 104,280 112,256 C124,220 140,176 168,122 Z"/>
<path d="M250,118 C274,170 294,215 310,258 C320,286 330,312 338,336 Q328,348 316,334 C306,306 296,280 288,256 C276,220 260,176 232,122 Z"/>
<path d="M160,92 C150,110 142,124 134,140 Q138,172 150,158 Q156,190 170,166 Q180,196 192,170 Q204,200 214,168 Q226,194 236,164 Q248,186 256,154 Q266,166 266,140 C258,124 250,110 240,92 Z"/>
</g>`;
function volcanoFace() {
  const ink = '#5a2a1c';
  return `<g class="f-open"><g class="eyes">
 <ellipse cx="160" cy="205" rx="26" ry="31" fill="#fff" stroke="${ink}" stroke-width="5"/>
 <ellipse cx="240" cy="205" rx="26" ry="31" fill="#fff" stroke="${ink}" stroke-width="5"/>
 <g class="pupils"><circle cx="164" cy="211" r="14" fill="#3b2140"/><circle cx="244" cy="211" r="14" fill="#3b2140"/><circle cx="169" cy="204" r="5" fill="#fff"/><circle cx="249" cy="204" r="5" fill="#fff"/></g>
</g></g>
<g class="f-brow" stroke="${ink}" stroke-width="7" stroke-linecap="round" fill="none"><path d="M136,166 Q158,162 180,150"/><path d="M220,150 Q242,162 264,166"/></g>
<g class="f-sleep" stroke="${ink}" stroke-width="6" stroke-linecap="round" fill="none"><path d="M138,206 Q160,224 182,206"/><path d="M218,206 Q240,224 262,206"/></g>
<g class="f-gig" stroke="${ink}" stroke-width="7" stroke-linecap="round" fill="none"><path d="M138,214 Q160,186 182,214"/><path d="M218,214 Q240,186 262,214"/></g>
<path class="m-smile" d="M172,262 Q200,290 228,262" stroke="${ink}" stroke-width="7" stroke-linecap="round" fill="none"/>
<g class="m-open"><path d="M166,256 Q200,330 234,256 Z" fill="#7a2336" stroke="${ink}" stroke-width="6" stroke-linejoin="round"/><path d="M185,280 Q200,272 215,280 Q210,289 200,289 Q190,289 185,280Z" fill="#ff6f91"/></g>
<ellipse class="m-o" cx="200" cy="272" rx="12" ry="15" fill="#7a2336" stroke="${ink}" stroke-width="5"/>
<path class="m-wavy" d="M168,274 Q178,262 188,274 Q198,286 208,274 Q218,262 230,274" stroke="${ink}" stroke-width="6" stroke-linecap="round" fill="none"/>
<path class="sweat" d="M292,148 Q304,168 292,178 Q280,168 292,148Z" fill="#8fe6ff" stroke="#2a8fb8" stroke-width="3"/>`;
}
const volcanoSVG = face => `<svg class="vol face-${face}" viewBox="0 0 400 380" aria-hidden="true">${volcanoBody()}${LAVA_FLOW}${volcanoFace()}</svg>`;
function setFace(svg, face) {
  ['sleep', 'calm', 'happy', 'nervous', 'worried', 'giggle'].forEach(f => svg.classList.remove('face-' + f));
  svg.classList.add('face-' + face);
}

function palm(x, y, s = 1, flip = false) {
  const leaf = (d) => `<path d="${d}" fill="#36b24a" stroke="#1f7a34" stroke-width="4" stroke-linejoin="round"/>`;
  return `<g transform="translate(${x},${y}) scale(${flip ? -s : s},${s})">
<path d="M0,0 C6,-60 22,-120 14,-185" stroke="#8a5a34" stroke-width="24" fill="none" stroke-linecap="round"/>
<path d="M0,0 C6,-60 22,-120 14,-185" stroke="#b07a48" stroke-width="14" fill="none" stroke-linecap="round" stroke-dasharray="10 12"/>
<g transform="translate(14,-188)">
${leaf('M0,0 C40,-10 80,20 100,60 C70,30 35,15 0,0Z')}${leaf('M0,0 C-40,-10 -80,20 -100,60 C-70,30 -35,15 0,0Z')}
${leaf('M0,0 C30,-40 90,-40 120,5 C80,-15 40,-12 0,0Z')}${leaf('M0,0 C-30,-40 -90,-40 -120,5 C-80,-15 -40,-12 0,0Z')}
${leaf('M0,0 C20,-55 60,-85 100,-80 C60,-60 30,-35 0,0Z')}${leaf('M0,0 C-20,-55 -60,-85 -100,-80 C-60,-60 -30,-35 0,0Z')}
<circle cx="-8" cy="8" r="10" fill="#7a4a24"/><circle cx="10" cy="10" r="10" fill="#7a4a24"/>
</g></g>`;
}
const cloud = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})" fill="#fff"><circle cx="0" cy="0" r="38"/><circle cx="44" cy="-18" r="48"/><circle cx="92" cy="-4" r="40"/><circle cx="128" cy="10" r="28"/><rect x="-10" y="0" width="150" height="38" rx="19"/></g>`;
function sun(x, y, s) {
  let rays = ''; for (let i = 0; i < 12; i++) rays += `<rect x="-8" y="-120" width="16" height="36" rx="8" fill="#ffd93d" transform="rotate(${i * 30})"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})"><g class="rays">${rays}</g>
<circle r="72" fill="#ffd93d" stroke="#f4a100" stroke-width="7"/>
<circle cx="-24" cy="-10" r="8" fill="#5a2a1c"/><circle cx="24" cy="-10" r="8" fill="#5a2a1c"/>
<path d="M-26,18 Q0,42 26,18" stroke="#5a2a1c" stroke-width="7" fill="none" stroke-linecap="round"/>
<circle cx="-46" cy="16" r="11" fill="#ff9f7a" opacity=".6"/><circle cx="46" cy="16" r="11" fill="#ff9f7a" opacity=".6"/></g>`;
}
const flower = (x, y, c) => `<g transform="translate(${x},${y})"><circle cx="-9" cy="0" r="8" fill="${c}"/><circle cx="9" cy="0" r="8" fill="${c}"/><circle cx="0" cy="-9" r="8" fill="${c}"/><circle cx="0" cy="9" r="8" fill="${c}"/><circle r="6" fill="#ffd93d"/></g>`;

function sceneSVG() {
  let clouds = '';
  [[120, .9, 0], [230, .7, -25], [90, .6, -45], [300, .8, -60]].forEach(([y, s, d]) => {
    clouds += `<g class="drift" style="animation-delay:${d}s;animation-duration:${60 + s * 30}s">${cloud(0, y, s)}</g>`;
  });
  return `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fc8f5"/><stop offset=".7" stop-color="#bdeeff"/><stop offset="1" stop-color="#e8fbff"/></linearGradient>
<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#48d0e0"/><stop offset="1" stop-color="#2aa3c9"/></linearGradient></defs>
<rect width="1600" height="1000" fill="url(#sky)"/>
${sun(1390, 160, 1)}${clouds}
<path d="M0,690 Q200,670 400,690 T800,690 T1200,690 T1600,690 V1000 H0Z" fill="url(#sea)"/>
<path d="M0,760 Q250,700 520,760 T1060,750 T1600,760 V1000 H0Z" fill="#a6e77e"/>
<path d="M0,820 Q300,770 640,820 T1300,810 T1600,815 V1000 H0Z" fill="#7ed957" stroke="#5bb53d" stroke-width="6"/>
${palm(130, 850, 1.25)}${palm(1480, 860, 1.15, true)}${palm(300, 830, .8, true)}
${flower(420, 880, '#ff5d8f')}${flower(470, 905, '#9b5de5')}${flower(1180, 890, '#ff8c42')}${flower(1240, 915, '#ff5d8f')}${flower(820, 930, '#3a86ff')}${flower(60, 940, '#ffbe0b')}`;
}

/* ---------- Puzzle pictures ----------
   Each puzzle is drawn twice: asleep (the puzzle itself) and awake (the picker
   thumbnail, and the "wake up" moment when a dinosaur puzzle is finished). */
const DARK = '#2b2140';
const eye = (x, y, r, aw) => aw
  ? `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${DARK}" stroke-width="4"/><circle cx="${x + r * .2}" cy="${y + r * .1}" r="${r * .55}" fill="${DARK}"/><circle cx="${x + r * .38}" cy="${y - r * .2}" r="${r * .2}" fill="#fff"/>`
  : `<path d="M${x - r},${y} Q${x},${y + r * .9} ${x + r},${y}" stroke="${DARK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
let MIRROR = false; // set while drawing a mirrored picture
const zzz = (x, y) => [[0, 0, 1], [40, -45, .8], [72, -82, .6]].map(([dx, dy, k]) =>
  `<path transform="translate(${x + dx},${y + dy}) scale(${MIRROR ? -k : k},${k})" d="M0,0 H22 L0,24 H22" stroke="#9b5de5" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
const cheek = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ff7aa8" opacity=".55"/>`;
// Tube-shaped limb: a thick outline stroke with a thinner fill-colored stroke on top
const limb = (d, fill, ink, w) => `<path d="${d}" stroke="${ink}" stroke-width="${w + 8}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${fill}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
function volcFace(aw) {
  const ink = '#5a2a1c';
  const eyes = aw
    ? `<ellipse cx="160" cy="205" rx="26" ry="31" fill="#fff" stroke="${ink}" stroke-width="5"/><ellipse cx="240" cy="205" rx="26" ry="31" fill="#fff" stroke="${ink}" stroke-width="5"/><circle cx="164" cy="211" r="14" fill="#3b2140"/><circle cx="244" cy="211" r="14" fill="#3b2140"/><circle cx="169" cy="204" r="5" fill="#fff"/><circle cx="249" cy="204" r="5" fill="#fff"/>`
    : `<g stroke="${ink}" stroke-width="6" stroke-linecap="round" fill="none"><path d="M138,206 Q160,224 182,206"/><path d="M218,206 Q240,224 262,206"/></g>`;
  return eyes + `<path d="M172,262 Q200,290 228,262" stroke="${ink}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
}
const miniVolcano = (x, y, k, aw) => `<g transform="translate(${x},${y}) scale(${k})">${volcanoBody()}${volcFace(aw)}</g>`;
function pic(o, content) {
  const [sx, sy, sk] = o.sun || [690, 95, .7];
  const [s1, s2] = o.sky || ['#5fc8f5', '#d4f5ff'];
  const clouds = (o.clouds || [[40, 90, .8], [470, 60, .55]]).map(c => cloud(...c)).join('');
  const inner = `<rect width="800" height="600" fill="url(#psky)"/>
${o.rainbow ? rainbowArc() : ''}${sun(sx, sy, sk)}${clouds}${o.back || ''}
<path d="M0,455 Q200,440 400,455 T800,450 V600 H0Z" fill="${o.sea || '#3fc1d6'}"/>${o.mid || ''}
${o.noGround ? '' : `<path d="M0,515 Q200,490 400,515 T800,510 V600 H0Z" fill="${o.ground || '#7ed957'}" stroke="${o.gs || '#4fae3a'}" stroke-width="5"/>`}
${content}${o.front || ''}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" preserveAspectRatio="none">
<defs>${volcanoDefs()}<linearGradient id="psky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s1}"/><stop offset="1" stop-color="${s2}"/></linearGradient></defs>
${o.mirror ? `<g transform="matrix(-1 0 0 1 800 0)">${inner}</g>` : inner}</svg>`;
}

/* ---------- Scene props and themes (so each dinosaur can come in 3 versions) ---------- */
const rainbowArc = () => `<g fill="none" stroke-width="16" opacity=".5">${['#ff5d8f', '#ff8c42', '#ffd93d', '#6bcb3a', '#3a86ff', '#9b5de5']
  .map((c, i) => `<path d="M${70 + i * 16},470 A${330 - i * 16},${330 - i * 16} 0 0 1 ${730 - i * 16},470" stroke="${c}"/>`).join('')}</g>`;
const fern = (x, y, s, flip) => `<g transform="translate(${x},${y}) scale(${flip ? -s : s},${s})" fill="#3aa845" stroke="#1f7a34" stroke-width="3" stroke-linejoin="round">${[-60, -35, -10, 15, 40]
  .map(a => `<path transform="rotate(${a})" d="M0,0 C-12,-40 -7,-80 0,-110 C7,-80 12,-40 0,0Z"/>`).join('')}</g>`;
const bush = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})" fill="#4cbf56" stroke="#2f8a44" stroke-width="4"><circle cx="-30" cy="-10" r="28"/><circle cx="30" cy="-10" r="28"/><circle cx="0" cy="-28" r="34"/><circle cx="-12" cy="-30" r="5" fill="#ff5d8f" stroke="none"/><circle cx="20" cy="-14" r="5" fill="#ffd93d" stroke="none"/></g>`;
const nest = (x, y) => `<g transform="translate(${x},${y})"><ellipse rx="60" ry="16" fill="#7a4a24"/>
<ellipse cx="-24" cy="-14" rx="16" ry="21" fill="#fff5e0" stroke="#c9a57a" stroke-width="3"/><ellipse cx="4" cy="-19" rx="16" ry="21" fill="#e3f7ff" stroke="#8fb9cc" stroke-width="3"/><ellipse cx="30" cy="-12" rx="15" ry="19" fill="#ffe3ef" stroke="#d99ab3" stroke-width="3"/>
<circle cx="-28" cy="-20" r="3" fill="#c9a57a"/><circle cx="8" cy="-26" r="3" fill="#8fb9cc"/><circle cx="26" cy="-17" r="3" fill="#d99ab3"/>
<path d="M-64,-2 Q0,40 64,-2 Q0,12 -64,-2Z" fill="#a0643a" stroke="#6b3f1f" stroke-width="4" stroke-linejoin="round"/></g>`;
const pond = (x, y) => `<g transform="translate(${x},${y})"><ellipse rx="85" ry="22" fill="#5fd0e8" stroke="#2a9fbd" stroke-width="4"/><path d="M-40,-4 Q-20,-10 0,-4 M20,4 Q38,-2 55,4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/></g>`;
const butterfly = (x, y, c) => `<g transform="translate(${x},${y})" stroke="#7a3b6e" stroke-width="2.5"><ellipse cx="-9" cy="-6" rx="10" ry="12" fill="${c}" transform="rotate(-20 -9 -6)"/><ellipse cx="9" cy="-6" rx="10" ry="12" fill="${c}" transform="rotate(20 9 -6)"/><ellipse cx="-7" cy="8" rx="7" ry="8" fill="${c}"/><ellipse cx="7" cy="8" rx="7" ry="8" fill="${c}"/><rect x="-2.5" y="-12" width="5" height="26" rx="2.5" fill="#5a2a1c" stroke="none"/></g>`;
const THEMES = {
  beach: {},
  jungle: { ground: '#4fb548', gs: '#2f8a2e', mid: '<path d="M0,480 Q120,440 260,470 Q400,430 540,465 Q680,440 800,470 V600 H0Z" fill="#79cf62"/>', front: fern(30, 600, .9) + fern(780, 600, .9, true) },
  sunset: { sky: ['#ff9e7d', '#ffe3a3'], sea: '#6ab7d8', ground: '#f2c572', gs: '#d19a3c' },
  rainbow: { rainbow: true, ground: '#8fe06b', gs: '#5bb53d' },
};
// Builds the options for pic(): theme first, then the dinosaur's own layout, then this version's tweaks
const sceneOpts = (c, base) => Object.assign({}, THEMES[c.theme], base, c.o || {}, { mirror: !!c.mirror, back: (base.back || '') + (THEMES[c.theme].back || '') });

function volcanoPic(aw) {
  MIRROR = false;
  return pic({}, `${palm(80, 560, .95)}${palm(730, 560, .8, true)}
<g transform="translate(200,172)">${volcanoBody()}${volcFace(aw)}</g>
${aw ? '' : zzz(560, 190)}
${flower(640, 565, '#ff5d8f')}${flower(680, 580, '#9b5de5')}${flower(170, 578, '#ffbe0b')}${flower(560, 585, '#3a86ff')}
<g transform="translate(40,300) scale(1.3)" color="#6bcb3a"><use href="#dino" width="64" height="56"/></g>`);
}

const TREX_V = [
  { f: '#5cc26b', s: '#2f7a3e', d: '#49a857', belly: '#c9f2a8', theme: 'beach', o: { ground: '#f3d38a', gs: '#d4a84f' },
    props: palm(740, 565, .75, true) + flower(640, 570, '#ff5d8f') + flower(120, 575, '#9b5de5') },
  { f: '#ff8c42', s: '#b0501a', d: '#e8742c', belly: '#ffe0b5', theme: 'jungle', mirror: true,
    props: bush(660, 572, .85) + flower(180, 578, '#ff5d8f') },
  { f: '#9b5de5', s: '#5b2a9e', d: '#8447d1', belly: '#e3d0ff', theme: 'sunset',
    props: palm(740, 565, .75, true) + nest(175, 560) },
];
function trexPic(aw, v = 0) {
  const c = TREX_V[v], { f, s, d } = c; MIRROR = !!c.mirror;
  const mouth = aw
    ? `<path d="M515,238 Q565,292 612,228 Z" fill="#7a2336" stroke="${s}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="566" cy="262" rx="18" ry="8" fill="#ff6f91"/><path d="M530,242 l7,10 l6,-8 M552,248 l6,10 l6,-9 M575,246 l6,9 l6,-10" fill="#fff" stroke="${s}" stroke-width="2"/>`
    : `<path d="M520,240 Q565,262 605,230" stroke="${s}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M536,247 l6,9 l6,-7 M557,251 l6,9 l6,-8 M578,246 l6,8 l5,-9" fill="#fff" stroke="${s}" stroke-width="2" stroke-linejoin="round"/>`;
  return pic(sceneOpts(c, { back: miniVolcano(40, 330, .35, aw) }),
`${c.props}
<g stroke="${s}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
 <rect x="432" y="400" width="42" height="112" rx="20" fill="${d}"/><ellipse cx="462" cy="514" rx="36" ry="13" fill="${d}"/>
 <path d="M70,445 C170,380 260,280 360,262 C420,250 450,240 470,215 L540,255 C520,300 500,330 490,370 C480,420 440,455 380,455 C300,460 250,430 200,420 C150,420 110,435 70,445 Z" fill="${f}"/>
 <ellipse cx="440" cy="395" rx="44" ry="50" fill="${c.belly}" stroke="none"/>
 <g fill="${d}" stroke="none"><ellipse cx="330" cy="290" rx="20" ry="8" transform="rotate(-15 330 290)"/><ellipse cx="392" cy="272" rx="18" ry="7" transform="rotate(-10 392 272)"/><ellipse cx="255" cy="328" rx="18" ry="7" transform="rotate(-30 255 328)"/></g>
 <rect x="340" y="440" width="44" height="72" rx="20" fill="${f}"/><ellipse cx="372" cy="515" rx="42" ry="14" fill="${f}"/>
 <ellipse cx="360" cy="415" rx="55" ry="55" fill="${f}"/>
</g>
${limb('M478,378 Q502,380 510,400', f, s, 10)}
<ellipse cx="525" cy="205" rx="92" ry="62" fill="${f}" stroke="${s}" stroke-width="5"/>
<ellipse cx="600" cy="186" rx="5" ry="4" fill="${s}"/>
${eye(515, 182, 17, aw)}${cheek(562, 226, 12)}${mouth}
${aw ? '' : zzz(610, 120)}`);
}

const BRONTO_V = [
  { f: '#5aa9ff', s: '#2d5fa8', d: '#4a90e2', belly: '#cfe6ff', spots: '#8cc4ff', theme: 'beach',
    props: palm(745, 560, 1.1, true), front: flower(120, 560, '#ff5d8f') + flower(160, 580, '#ffbe0b') + flower(620, 575, '#9b5de5') },
  { f: '#6bcb3a', s: '#3a7d1c', d: '#58b52b', belly: '#dcf5c8', spots: '#9be27a', theme: 'sunset', mirror: true,
    props: palm(745, 560, 1.1, true), front: pond(165, 562) },
  { f: '#ff8fb1', s: '#b83d6b', d: '#f07aa0', belly: '#ffe0ea', spots: '#ffc2d4', theme: 'rainbow',
    props: palm(745, 560, 1.1, true), front: butterfly(170, 250, '#ffd93d') + butterfly(290, 205, '#8fe6ff') + flower(640, 575, '#9b5de5') },
];
function brontoPic(aw, v = 0) {
  const c = BRONTO_V[v], { f, s, d } = c; MIRROR = !!c.mirror;
  const mouth = aw
    ? `<path d="M628,150 Q646,168 661,146 Z" fill="#7a2336" stroke="${s}" stroke-width="4" stroke-linejoin="round"/>`
    : `<path d="M630,152 Q645,160 658,148" stroke="${s}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  return pic(sceneOpts(c, { sun: [120, 95, .7], clouds: [[300, 80, .6], [470, 45, .45]], back: miniVolcano(20, 330, .35, aw) }),
`${c.props}
<g stroke="${s}" stroke-width="5" stroke-linejoin="round">
 <rect x="290" y="400" width="44" height="115" rx="20" fill="${d}"/><rect x="445" y="400" width="44" height="115" rx="20" fill="${d}"/>
 <rect x="250" y="395" width="46" height="122" rx="20" fill="${f}"/><rect x="480" y="395" width="46" height="122" rx="20" fill="${f}"/>
 <path d="M40,470 C120,430 200,330 330,305 C420,290 480,300 520,280 C560,250 570,190 582,142 L630,152 C615,210 600,280 560,340 C540,400 480,432 380,432 C300,432 240,420 200,425 C140,435 90,455 40,470 Z" fill="${f}"/>
 <ellipse cx="615" cy="140" rx="48" ry="30" fill="${f}"/>
</g>
<ellipse cx="400" cy="408" rx="90" ry="20" fill="${c.belly}"/>
<g fill="${c.spots}"><circle cx="300" cy="340" r="12"/><circle cx="350" cy="324" r="9"/><circle cx="402" cy="318" r="11"/><circle cx="250" cy="366" r="8"/><circle cx="455" cy="318" r="8"/></g>
<g fill="#fff"><ellipse cx="262" cy="512" rx="7" ry="4"/><ellipse cx="284" cy="512" rx="7" ry="4"/><ellipse cx="492" cy="512" rx="7" ry="4"/><ellipse cx="514" cy="512" rx="7" ry="4"/></g>
${eye(622, 130, 11, aw)}${cheek(642, 150, 7)}${mouth}
${aw ? '' : zzz(670, 70)}
${c.front}`);
}

const TRIKE_V = [
  { f: '#ffb347', s: '#c96f1c', d: '#f29a2e', fr: '#ff7f50', dots: '#ffd93d', theme: 'beach',
    props: palm(752, 568, .72, true), front: flower(150, 565, '#ff5d8f') + flower(640, 585, '#3a86ff') + flower(200, 585, '#9b5de5') },
  { f: '#2ec4b6', s: '#16786f', d: '#25ab9e', fr: '#3a86ff', dots: '#ffd93d', theme: 'rainbow', mirror: true,
    props: palm(752, 568, .72, true), front: butterfly(160, 235, '#ff8fb1') + butterfly(310, 190, '#ffd93d') + flower(150, 570, '#ff5d8f') },
  { f: '#ffd93d', s: '#c99a00', d: '#f2c500', fr: '#ff5d8f', dots: '#fff3a0', theme: 'jungle',
    props: '', front: nest(160, 572) },
];
function trikePic(aw, v = 0) {
  const c = TRIKE_V[v], { f, s, d, fr } = c, horn = '#fff3d6'; MIRROR = !!c.mirror;
  let bumps = ''; for (let a = -170; a <= -10; a += 26) { const r = a * Math.PI / 180; bumps += `<circle cx="${520 + Math.cos(r) * 88}" cy="${320 + Math.sin(r) * 88}" r="15" fill="${fr}" stroke="${s}" stroke-width="5"/>`; }
  let dots = ''; for (let a = -160; a <= -20; a += 35) { const r = a * Math.PI / 180; dots += `<circle cx="${520 + Math.cos(r) * 62}" cy="${320 + Math.sin(r) * 62}" r="9" fill="${c.dots}"/>`; }
  const mouth = aw
    ? `<path d="M592,402 Q612,426 633,398 Z" fill="#7a2336" stroke="${s}" stroke-width="4" stroke-linejoin="round"/>`
    : `<path d="M595,405 Q614,415 630,400" stroke="${s}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  return pic(sceneOpts(c, { back: miniVolcano(30, 330, .35, aw) }),
`${c.props}
<g stroke="${s}" stroke-width="5" stroke-linejoin="round">
 <rect x="258" y="410" width="44" height="100" rx="20" fill="${d}"/><rect x="438" y="410" width="44" height="100" rx="20" fill="${d}"/>
 <rect x="222" y="410" width="46" height="106" rx="20" fill="${f}"/><rect x="470" y="410" width="46" height="106" rx="20" fill="${f}"/>
 <path d="M80,430 C150,400 200,330 300,315 C380,300 440,310 480,330 C500,380 480,430 420,445 C340,460 260,450 220,430 C170,425 120,432 80,430 Z" fill="${f}"/>
 ${bumps}<circle cx="520" cy="320" r="88" fill="${fr}"/>
</g>
${dots}
<g fill="${d}"><circle cx="300" cy="360" r="11"/><circle cx="350" cy="345" r="8"/><circle cx="400" cy="352" r="10"/><circle cx="250" cy="385" r="7"/></g>
<g stroke="${s}" stroke-width="4" stroke-linejoin="round" fill="${horn}">
 <path d="M545,335 Q560,260 610,235 Q590,285 575,340 Z"/><path d="M585,338 Q610,270 660,252 Q635,300 612,346 Z"/>
</g>
<ellipse cx="575" cy="370" rx="68" ry="52" fill="${f}" stroke="${s}" stroke-width="5"/>
<path d="M628,365 Q668,372 662,402 Q640,410 622,395 Z" fill="#d98a3c" stroke="${s}" stroke-width="4" stroke-linejoin="round"/>
<path d="M628,362 Q636,330 655,318 Q650,345 643,366 Z" fill="${horn}" stroke="${s}" stroke-width="4" stroke-linejoin="round"/>
${eye(588, 366, 13, aw)}${cheek(606, 392, 9)}${mouth}
${aw ? '' : zzz(680, 250)}
${c.front}`);
}

const PTERO_V = [
  { f: '#ff8fb1', s: '#b83d6b', w: '#ffc2d4', belly: '#ffe0ea', line: '#e889a8', theme: 'beach' },
  { f: '#6fb7ff', s: '#2d5fa8', w: '#bfe0ff', belly: '#e3f2ff', line: '#8cbef0', theme: 'sunset', mirror: true },
  { f: '#8ac926', s: '#4a7a10', w: '#d6f5a8', belly: '#effbe0', line: '#a8d870', theme: 'rainbow' },
];
function pteroPic(aw, v = 0) {
  const c = PTERO_V[v], { f, s, w } = c; MIRROR = !!c.mirror;
  const beak = aw
    ? `<path d="M482,242 L576,258 L482,262 Z" fill="#7a2336"/><path d="M482,234 L588,248 L484,248 Z" fill="#ffbe0b" stroke="#c98a00" stroke-width="3.5" stroke-linejoin="round"/><path d="M484,258 L570,266 L482,270 Z" fill="#ffbe0b" stroke="#c98a00" stroke-width="3.5" stroke-linejoin="round"/>`
    : `<path d="M482,238 L585,252 L482,262 Z" fill="#ffbe0b" stroke="#c98a00" stroke-width="3.5" stroke-linejoin="round"/>`;
  return pic(sceneOpts(c, { sun: [705, 80, .6], clouds: [[30, 80, .7], [560, 360, .5], [120, 380, .45]], noGround: true }),
`<ellipse cx="400" cy="585" rx="300" ry="70" fill="#f3d38a" stroke="#d4a84f" stroke-width="5"/>
${miniVolcano(310, 420, .45, aw)}${palm(175, 590, .6)}${palm(625, 590, .6, true)}
<g stroke="${s}" stroke-width="5" stroke-linejoin="round" fill="${w}">
 <path d="M380,275 Q260,160 70,170 Q150,210 170,260 Q200,250 230,275 Q260,262 290,290 Q330,280 380,300 Z"/>
 <path d="M420,275 Q540,160 730,170 Q650,210 630,260 Q600,250 570,275 Q540,262 510,290 Q470,280 420,300 Z"/>
</g>
<g stroke="${c.line}" stroke-width="3" fill="none" stroke-linecap="round"><path d="M370,280 Q250,220 120,185"/><path d="M430,280 Q550,220 680,185"/></g>
${limb('M388,322 L380,352', f, s, 8)}${limb('M414,322 L422,352', f, s, 8)}
<path d="M350,292 L296,314 L352,306 Z" fill="${f}" stroke="${s}" stroke-width="4" stroke-linejoin="round"/>
<path d="M440,222 L368,186 L456,210 Z" fill="${f}" stroke="${s}" stroke-width="4" stroke-linejoin="round"/>
<ellipse cx="400" cy="290" rx="55" ry="38" fill="${f}" stroke="${s}" stroke-width="5"/>
<ellipse cx="405" cy="300" rx="32" ry="20" fill="${c.belly}"/>
<circle cx="455" cy="245" r="34" fill="${f}" stroke="${s}" stroke-width="5"/>
${beak}${eye(460, 236, 11, aw)}${cheek(468, 262, 7)}
${aw ? '' : zzz(560, 190)}`);
}

const svgURL = svg => 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")';
const PUZZLES = [
  { id: 'volcano', name: 'the volcano', draw: volcanoPic, versions: 1 },
  { id: 'trex', name: 'the T-Rex', draw: trexPic, versions: 3, sound: 'roar', extra: ' Roar!' },
  { id: 'bronto', name: 'the Brontosaurus', draw: brontoPic, versions: 3, sound: 'roar' },
  { id: 'trike', name: 'the Triceratops', draw: trikePic, versions: 3, sound: 'roar' },
  { id: 'ptero', name: 'the Pterodactyl', draw: pteroPic, versions: 3, sound: 'squawk' },
];
// Pre-draw every version (asleep and awake). pickVersion() chooses which one the picker shows next.
PUZZLES.forEach(pz => {
  pz.urls = [...Array(pz.versions)].map((_, v) => [svgURL(pz.draw(false, v)), svgURL(pz.draw(true, v))]);
  pz.v = -1;
});
function pickVersion(pz) {
  let v = randi(0, pz.versions - 1);
  if (pz.versions > 1 && v === pz.v) v = (v + randi(1, pz.versions - 1)) % pz.versions; // never the same one twice in a row
  pz.v = v; [pz.sleep, pz.awake] = pz.urls[v];
}

const meterSVG = `<svg viewBox="0 0 90 420" aria-hidden="true">
<defs><linearGradient id="lavaG" gradientUnits="userSpaceOnUse" x1="0" y1="400" x2="0" y2="20"><stop offset="0" stop-color="#ffd93d"/><stop offset=".35" stop-color="#ff8c42"/><stop offset=".65" stop-color="#ff5d8f"/><stop offset="1" stop-color="#9b5de5"/></linearGradient>
<clipPath id="tubeClip"><rect x="25" y="19" width="40" height="330" rx="20"/><circle cx="45" cy="370" r="37"/></clipPath></defs>
<rect x="22" y="16" width="46" height="330" rx="23" fill="#fff" stroke="#5a2a1c" stroke-width="6"/>
<circle cx="45" cy="370" r="40" fill="#fff" stroke="#5a2a1c" stroke-width="6"/>
<rect x="25" y="318" width="40" height="30" fill="#fff"/>
<g clip-path="url(#tubeClip)">
  <circle cx="45" cy="370" r="37" fill="#ffd93d"/>
  <rect id="lavaFill" x="20" y="345" width="50" height="75" fill="url(#lavaG)"/>
</g>
<path d="M36,40 V300" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>
<circle cx="36" cy="366" r="4" fill="#5a2a1c"/><circle cx="54" cy="366" r="4" fill="#5a2a1c"/>
<path d="M36,380 Q45,388 54,380" stroke="#5a2a1c" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>`;
const starSVG = c => `<svg viewBox="0 0 64 64" style="color:${c}"><use href="#star"/></svg>`;

/* ================= BUILD STATIC DOM ================= */
$('#gdefs').innerHTML = volcanoDefs();
$('#bg').innerHTML = sceneSVG();
$('#qVolWrap').innerHTML = volcanoSVG('calm');
$('#celVol').innerHTML = volcanoSVG('sleep');
$('#rVol').innerHTML = volcanoSVG('happy');
$('#homeVol').innerHTML = volcanoSVG('happy');
$('#meter').innerHTML = meterSVG;
const TITLE_COLORS = ['#ff5d8f', '#ff8c42', '#ffbe0b', '#6bcb3a', '#2ec4b6', '#3a86ff', '#9b5de5'];
$('#title').innerHTML = 'Volcano Friends'.split('').map((ch, i) => ch === ' ' ? '&nbsp;' : `<span style="--c:${TITLE_COLORS[i % 7]};animation-delay:${i * -.15}s">${ch}</span>`).join('');
const qVol = $('#qVolWrap svg');
const lavaFill = $('#lavaFill');
const dino = $('#dino');
