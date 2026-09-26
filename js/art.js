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
$('#rVol').innerHTML = volcanoSVG('happy');
$('#homeVol').innerHTML = volcanoSVG('happy');
$('#meter').innerHTML = meterSVG;
const TITLE_COLORS = ['#ff5d8f', '#ff8c42', '#ffbe0b', '#6bcb3a', '#2ec4b6', '#3a86ff', '#9b5de5'];
$('#title').innerHTML = 'Volcano Friends'.split('').map((ch, i) => ch === ' ' ? '&nbsp;' : `<span style="--c:${TITLE_COLORS[i % 7]};animation-delay:${i * -.15}s">${ch}</span>`).join('');
const qVol = $('#qVolWrap svg');
const lavaFill = $('#lavaFill');
const dino = $('#dino');
