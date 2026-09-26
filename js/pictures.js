// Puzzle pictures: 5 puzzles, each with 3 different scenes (not recolors). All drawn as SVG at 800x600.
'use strict';

/* ================= PICTURE HELPERS ================= */
const DARK = '#2b2140';
const seeded = s => () => (s = s * 16807 % 2147483647) / 2147483647; // repeatable "random" for stars, snow, confetti
const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${DARK}" stroke-width="4"/><circle cx="${x + r * .2}" cy="${y + r * .1}" r="${r * .55}" fill="${DARK}"/><circle cx="${x + r * .38}" cy="${y - r * .2}" r="${r * .2}" fill="#fff"/>`;
const cheek = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ff7aa8" opacity=".55"/>`;
// Tube-shaped limb: a thick outline stroke with a thinner fill-colored stroke on top
const limb = (d, fill, ink, w) => `<path d="${d}" stroke="${ink}" stroke-width="${w + 8}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${fill}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
// Place a character drawn in its own coordinates: its anchor point (ax, ay) lands on (x, y), scaled by k, optionally mirrored
const at = (x, y, k, flip, ax, ay, body) => `<g transform="translate(${x},${y}) scale(${flip ? -k : k},${k}) translate(${-ax},${-ay})">${body}</g>`;
const starD = (r1, r2, n = 5) => { let d = ''; for (let i = 0; i < n * 2; i++) { const r = i % 2 ? r2 : r1, a = -Math.PI / 2 + i * Math.PI / n; d += (i ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); } return d + 'Z'; };
// Pie slices from angle a0 to a1 (degrees), one per color: umbrellas and beach balls
function wedges(cx, cy, r, a0, a1, colors, stroke) {
  const n = colors.length, step = (a1 - a0) / n, P = a => [(cx + Math.cos(a * Math.PI / 180) * r).toFixed(1), (cy + Math.sin(a * Math.PI / 180) * r).toFixed(1)];
  return colors.map((c, i) => { const [x0, y0] = P(a0 + i * step), [x1, y1] = P(a0 + (i + 1) * step); return `<path d="M${cx},${cy} L${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1} Z" fill="${c}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`; }).join('');
}
const miniDino = (x, y, k, color, flip = false, rot = 0) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${flip ? -k : k},${k})" color="${color}"><use href="#dino" x="-32" y="-54" width="64" height="56"/></g>`;

function pic(o, content) {
  const [s1, s2] = o.sky || ['#5fc8f5', '#d4f5ff'];
  const clouds = (o.clouds || [[40, 90, .8], [470, 60, .55]]).map(c => cloud(...c)).join('');
  const sea = o.sea === false ? '' : `<path d="M0,455 Q200,440 400,455 T800,450 V600 H0Z" fill="${o.sea || '#3fc1d6'}"/>`;
  const ground = o.ground === false ? '' : `<path d="M0,515 Q200,490 400,515 T800,510 V600 H0Z" fill="${o.ground || '#7ed957'}" stroke="${o.gs || '#4fae3a'}" stroke-width="5"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" preserveAspectRatio="none">
<defs>${volcanoDefs()}<linearGradient id="psky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s1}"/><stop offset="1" stop-color="${s2}"/></linearGradient>${o.defs || ''}</defs>
<rect width="800" height="600" fill="url(#psky)"/>${o.sky0 || ''}${o.sun === false ? '' : sun(...(o.sun || [690, 95, .7]))}${clouds}${o.back || ''}${sea}${o.mid || ''}${ground}
${content}</svg>`;
}

/* ================= PROPS ================= */
const fern = (x, y, s, flip) => `<g transform="translate(${x},${y}) scale(${flip ? -s : s},${s})" fill="#3aa845" stroke="#1f7a34" stroke-width="3" stroke-linejoin="round">${[-60, -35, -10, 15, 40]
  .map(a => `<path transform="rotate(${a})" d="M0,0 C-12,-40 -7,-80 0,-110 C7,-80 12,-40 0,0Z"/>`).join('')}</g>`;
const bush = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})" fill="#4cbf56" stroke="#2f8a44" stroke-width="4"><circle cx="-30" cy="-10" r="28"/><circle cx="30" cy="-10" r="28"/><circle cx="0" cy="-28" r="34"/><circle cx="-12" cy="-30" r="5" fill="#ff5d8f" stroke="none"/><circle cx="20" cy="-14" r="5" fill="#ffd93d" stroke="none"/></g>`;
const butterfly = (x, y, c) => `<g transform="translate(${x},${y})" stroke="#7a3b6e" stroke-width="2.5"><ellipse cx="-9" cy="-6" rx="10" ry="12" fill="${c}" transform="rotate(-20 -9 -6)"/><ellipse cx="9" cy="-6" rx="10" ry="12" fill="${c}" transform="rotate(20 9 -6)"/><ellipse cx="-7" cy="8" rx="7" ry="8" fill="${c}"/><ellipse cx="7" cy="8" rx="7" ry="8" fill="${c}"/><rect x="-2.5" y="-12" width="5" height="26" rx="2.5" fill="#5a2a1c" stroke="none"/></g>`;
const heart = (x, y, k, c) => `<path transform="translate(${x},${y}) scale(${k})" d="M0,12 C-14,2 -20,-6 -18,-13 C-15,-22 -4,-22 0,-14 C4,-22 15,-22 18,-13 C20,-6 14,2 0,12 Z" fill="${c}" stroke="#c43a6b" stroke-width="2.5" stroke-linejoin="round"/>`;
const twinkle = (x, y, k, c = '#fff7a1') => `<path transform="translate(${x},${y}) scale(${k})" d="M0,-14 L4,-4 L14,0 L4,4 L0,14 L-4,4 L-14,0 L-4,-4 Z" fill="${c}"/>`;
const egg = (x, y, rx, ry, c, sc) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" stroke="${sc}" stroke-width="4"/><circle cx="${x - rx * .3}" cy="${y - ry * .3}" r="${rx * .14}" fill="${sc}" opacity=".6"/><circle cx="${x + rx * .35}" cy="${y + ry * .1}" r="${rx * .11}" fill="${sc}" opacity=".6"/><circle cx="${x - rx * .1}" cy="${y + ry * .45}" r="${rx * .09}" fill="${sc}" opacity=".6"/>`;
const roundTree = (x, y, k, fruit) => `<g transform="translate(${x},${y}) scale(${k})"><path d="M-14,0 L-10,-110 L10,-110 L14,0 Z" fill="#a0643a" stroke="#6b3f1f" stroke-width="4" stroke-linejoin="round"/><g fill="#4cbf56" stroke="#2f8a44" stroke-width="4"><circle cx="-40" cy="-130" r="45"/><circle cx="40" cy="-130" r="45"/><circle cx="0" cy="-170" r="55"/></g>${fruit ? `<g fill="${fruit}" stroke="rgba(0,0,0,.25)" stroke-width="2"><circle cx="-40" cy="-120" r="8"/><circle cx="20" cy="-185" r="8"/><circle cx="45" cy="-122" r="8"/><circle cx="-12" cy="-150" r="8"/></g>` : ''}</g>`;
const pine = (x, y, k, snow, c = '#2f9e5a') => `<g transform="translate(${x},${y}) scale(${k})"><rect x="-8" y="-30" width="16" height="30" fill="#8a5a34"/><path d="M0,-170 L50,-95 L28,-95 L62,-30 L-62,-30 L-28,-95 L-50,-95 Z" fill="${c}" stroke="#1f6e3e" stroke-width="4" stroke-linejoin="round"/>${snow ? '<path d="M0,-170 L24,-134 Q12,-126 0,-134 Q-12,-126 -24,-134 Z M-40,-62 Q-20,-52 0,-60 Q20,-52 40,-62 L50,-48 L-50,-48 Z" fill="#fff"/>' : ''}</g>`;
const flowerRow = (y, x0, x1, step, colors) => { let o = ''; for (let x = x0, i = 0; x <= x1; x += step, i++) o += flower(x, y + (i % 2 ? 6 : 0), colors[i % colors.length]); return o; };
const fish = (x, y, k, rot, c = '#ff8c42') => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${k})"><path d="M-22,0 L-38,-12 L-38,12 Z" fill="#ffbe0b" stroke="#c9601a" stroke-width="3" stroke-linejoin="round"/><path d="M-26,0 Q0,-17 24,0 Q0,17 -26,0Z" fill="${c}" stroke="#c9601a" stroke-width="3"/><circle cx="11" cy="-3" r="3" fill="${DARK}"/></g>`;
const littleBird = (x, y, k, c) => `<g transform="translate(${x},${y}) scale(${k})" stroke="#8a3b5a" stroke-width="3" stroke-linejoin="round"><path d="M-16,0 L-30,-8 L-28,6 Z" fill="${c}"/><ellipse rx="19" ry="13" fill="${c}"/><circle cx="14" cy="-11" r="10" fill="${c}"/><path d="M22,-12 L33,-9 L22,-5 Z" fill="#ffbe0b" stroke="#c98a00" stroke-width="2"/><path d="M-8,-2 Q-2,-16 9,-3 Z" fill="#fff" opacity=".6" stroke="none"/><circle cx="16" cy="-13" r="2.6" fill="${DARK}" stroke="none"/></g>`;

// beach
const umbrella = (x, y, k) => `<g transform="translate(${x},${y}) scale(${k})"><path d="M0,0 V-190" stroke="#8a5a34" stroke-width="7" stroke-linecap="round"/>${wedges(0, -190, 115, 180, 360, ['#ff5d8f', '#fff', '#ff5d8f', '#fff', '#ff5d8f', '#fff'], '#c43a6b')}<circle cx="0" cy="-192" r="7" fill="#ffd93d" stroke="#c98a00" stroke-width="2"/></g>`;
const beachBall = (x, y, r) => `${wedges(x, y, r, 0, 360, ['#ff5d8f', '#fff', '#3a86ff', '#fff', '#ffd93d', '#fff'], '#666')}<circle cx="${x}" cy="${y}" r="${r * .18}" fill="#fff" stroke="#666" stroke-width="2"/><ellipse cx="${x - r * .4}" cy="${y - r * .45}" rx="${r * .15}" ry="${r * .09}" fill="#fff" opacity=".8" transform="rotate(-35 ${x - r * .4} ${y - r * .45})"/>`;
const bucket = (x, y) => `<g transform="translate(${x},${y})"><path d="M-24,-40 L24,-40 L18,0 L-18,0 Z" fill="#3a86ff" stroke="#1c4f99" stroke-width="3" stroke-linejoin="round"/><path d="M-24,-40 Q0,-70 24,-40" stroke="#1c4f99" stroke-width="3" fill="none"/><path d="M32,0 L44,-46" stroke="#8a5a34" stroke-width="5" stroke-linecap="round"/><path d="M38,-44 L34,-66 Q48,-72 56,-60 L50,-40 Z" fill="#ffd93d" stroke="#c98a00" stroke-width="3" stroke-linejoin="round"/></g>`;
const starfish = (x, y, k, c = '#ff8c42') => `<path transform="translate(${x},${y}) scale(${k})" d="${starD(20, 9)}" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="3" stroke-linejoin="round"/>`;
const sailboat = (x, y, k) => `<g transform="translate(${x},${y}) scale(${k})" stroke="#2b4a7a" stroke-width="3" stroke-linejoin="round"><path d="M-40,0 L40,0 L28,16 L-28,16 Z" fill="#ff5d8f"/><path d="M0,0 V-72" stroke-width="4"/><path d="M4,-68 L4,-6 L40,-6 Z" fill="#fff"/><path d="M-4,-58 L-4,-6 L-32,-6 Z" fill="#ffd93d"/></g>`;
function sandcastle(x, y, k) {
  const crenels = (x0, y0, w) => [0, 1, 2].map(i => `<rect x="${x0 + i * w / 3 + w / 12}" y="${y0 - 12}" width="${w / 6}" height="14" rx="2"/>`).join('');
  return `<g transform="translate(${x},${y}) scale(${k})" fill="#f5c26b" stroke="#c98f3a" stroke-width="4" stroke-linejoin="round">
${crenels(-84, -118, 44)}${crenels(40, -118, 44)}${crenels(-26, -150, 52)}
<rect x="-84" y="-118" width="44" height="70"/><rect x="40" y="-118" width="44" height="70"/><rect x="-26" y="-150" width="52" height="100"/>
<rect x="-92" y="-56" width="184" height="56" rx="8"/><path d="M-12,0 v-26 a12,12 0 0 1 24,0 v26 Z" fill="#c98f3a"/>
<rect x="-67" y="-100" width="10" height="14" rx="4" fill="#c98f3a" stroke="none"/><rect x="57" y="-100" width="10" height="14" rx="4" fill="#c98f3a" stroke="none"/><rect x="-5" y="-128" width="10" height="16" rx="4" fill="#c98f3a" stroke="none"/>
<path d="M0,-150 V-194" stroke="#8a5a34" fill="none"/><path d="M2,-194 L30,-185 L2,-176 Z" fill="#ff5d8f" stroke="#c43a6b" stroke-width="3"/>
<circle cx="-50" cy="-26" r="6" fill="#fff" stroke="none"/><circle cx="56" cy="-30" r="5" fill="#ffb3cb" stroke="none"/></g>`;
}
// party
function bunting() {
  const cols = ['#ff5d8f', '#ffd93d', '#3a86ff', '#6bcb3a', '#9b5de5', '#ff8c42'];
  let flags = '';
  for (let i = 1; i < 12; i++) {
    const t = i / 12, m = 1 - t, x = m * m * -10 + 2 * m * t * 400 + t * t * 810, y = m * m * 20 + 2 * m * t * 110 + t * t * 20;
    flags += `<path d="M${x - 19},${y - 2} L${x + 19},${y - 2} L${x},${y + 36} Z" fill="${cols[i % 6]}" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>`;
  }
  return `<path d="M-10,20 Q400,110 810,20" stroke="#8a5a34" stroke-width="3" fill="none"/>${flags}`;
}
const balloon = (x, y, r, c, sx, sy) => `<path d="M${x},${y + r * 1.15} Q${x + 14},${(y + sy) / 2} ${sx},${sy}" stroke="#777" stroke-width="2" fill="none"/>
<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.15}" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="3"/><path d="M${x - 6},${y + r * 1.15 + 6} L${x + 6},${y + r * 1.15 + 6} L${x},${y + r * 1.15 - 2} Z" fill="${c}"/>
<ellipse cx="${x - r * .35}" cy="${y - r * .45}" rx="${r * .17}" ry="${r * .3}" fill="#fff" opacity=".6" transform="rotate(20 ${x - r * .35} ${y - r * .45})"/>`;
const drips = (x0, x1, y, c, n = 6) => { const w = (x1 - x0) / n; let d = `M${x0},${y - 4} L${x1},${y - 4} L${x1},${y + 6}`; for (let i = n - 1; i >= 0; i--) d += ` Q${x0 + i * w + w / 2},${y + (i % 2 ? 26 : 16)} ${x0 + i * w},${y + 6}`; return `<path d="${d} Z" fill="${c}"/>`; };
function cake(x, y) {
  const candle = cx => `<rect x="${cx - 5}" y="-170" width="10" height="36" rx="3" fill="#8fd3ff" stroke="#3a86ff" stroke-width="2.5"/><path d="M${cx - 5},-160 L${cx + 5},-165 M${cx - 5},-148 L${cx + 5},-153" stroke="#fff" stroke-width="3"/><path d="M${cx},-194 Q${cx + 10},-180 ${cx},-170 Q${cx - 10},-180 ${cx},-194 Z" fill="#ffbe0b" stroke="#ff8c42" stroke-width="2"/>`;
  const R = seeded(21); let spr = ''; for (let i = 0; i < 16; i++) spr += `<rect x="${-72 + R() * 144}" y="${-50 + R() * 40}" width="9" height="4" rx="2" fill="${['#3a86ff', '#ffd93d', '#6bcb3a', '#9b5de5'][i % 4]}" transform="rotate(${R() * 180} ${-72 + R() * 144} ${-40})"/>`;
  return `<g transform="translate(${x},${y})"><ellipse cx="0" cy="0" rx="100" ry="13" fill="#fff" stroke="#bbb" stroke-width="3"/>
<rect x="-80" y="-80" width="160" height="80" rx="10" fill="#ff9ec4" stroke="#c43a6b" stroke-width="4"/>${drips(-78, 78, -76, '#fff', 8)}${spr}
<rect x="-56" y="-136" width="112" height="60" rx="10" fill="#fff3d6" stroke="#c9a57a" stroke-width="4"/>${drips(-54, 54, -132, '#ff9ec4', 6)}
${candle(-30)}${candle(0)}${candle(30)}<circle cx="0" cy="-106" r="9" fill="#ff5d5d" stroke="#b83232" stroke-width="2"/></g>`;
}
const gift = (x, y, w, h, c, rc) => `<g transform="translate(${x},${y})"><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="5" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="3"/><rect x="-7" y="${-h}" width="14" height="${h}" fill="${rc}"/><path d="M0,${-h} C-10,${-h - 26} -34,${-h - 16} -22,${-h - 4} Z M0,${-h} C10,${-h - 26} 34,${-h - 16} 22,${-h - 4} Z" fill="${rc}" stroke="rgba(0,0,0,.2)" stroke-width="2"/></g>`;
const fence = (y, c = '#fff') => { let p = ''; for (let x = -10; x < 810; x += 38) p += `<path d="M${x},${y} V${y - 62} L${x + 12},${y - 76} L${x + 24},${y - 62} V${y} Z"/>`; return `<g fill="${c}" stroke="#c9b9a6" stroke-width="3" stroke-linejoin="round"><rect x="-10" y="${y - 52}" width="820" height="10"/><rect x="-10" y="${y - 22}" width="820" height="10"/>${p}</g>`; };
// lake and park
const lilyPad = (x, y, k, bloom) => `<g transform="translate(${x},${y}) scale(${k},${k * .55})"><path d="M0,0 L34,-7 A36,36 0 1 0 34,7 Z" fill="#4cbf56" stroke="#2f8a44" stroke-width="4" stroke-linejoin="round"/></g>${bloom ? `<g transform="translate(${x - 6 * k},${y - 8 * k}) scale(${k})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-10" rx="6" ry="12" fill="#ff9ec4" stroke="#e0628f" stroke-width="2" transform="rotate(${a})"/>`).join('')}<circle r="5" fill="#ffd93d"/></g>` : ''}`;
const cattails = (x, y, flip) => `<g transform="translate(${x},${y}) scale(${flip ? -1 : 1},1)" stroke-linecap="round"><path d="M0,0 Q-6,-80 -10,-150 M20,0 Q24,-70 30,-120 M40,0 Q36,-60 44,-95" stroke="#3a8a2e" stroke-width="5" fill="none"/><rect x="-16" y="-178" width="13" height="42" rx="6" fill="#8a5a34"/><rect x="24" y="-146" width="13" height="36" rx="6" fill="#8a5a34"/><path d="M-4,0 Q-30,-50 -48,-70 M10,0 Q40,-40 66,-60" stroke="#4cbf56" stroke-width="7" fill="none"/></g>`;
function ballPit(x, y) {
  const R = seeded(9), cols = ['#ff5d8f', '#ffd93d', '#3a86ff', '#6bcb3a', '#9b5de5', '#ff8c42']; let balls = '';
  for (let i = 0; i < 22; i++) balls += `<circle cx="${x - 68 + R() * 136}" cy="${y - 62 + R() * 30}" r="12" fill="${cols[i % 6]}" stroke="rgba(0,0,0,.2)" stroke-width="2"/>`;
  return { back: `<rect x="${x - 80}" y="${y - 78}" width="160" height="78" rx="14" fill="#8fd3ff" stroke="#3a86ff" stroke-width="5"/>${balls}`,
           front: `<rect x="${x - 80}" y="${y - 42}" width="160" height="42" rx="12" fill="#3a86ff" stroke="#1c4f99" stroke-width="5"/><circle cx="${x - 40}" cy="${y - 21}" r="7" fill="#ffd93d"/><circle cx="${x}" cy="${y - 21}" r="7" fill="#ff5d8f"/><circle cx="${x + 40}" cy="${y - 21}" r="7" fill="#6bcb3a"/>` };
}
const seesaw = (x, y) => `<g transform="translate(${x},${y})"><path d="M-18,0 L0,-40 L18,0 Z" fill="#ff8c42" stroke="#c9601a" stroke-width="4" stroke-linejoin="round"/>
<g transform="rotate(-12 0 -42)"><rect x="-95" y="-50" width="190" height="14" rx="7" fill="#ffd93d" stroke="#c98a00" stroke-width="4"/>${miniDino(-70, -50, .9, '#ff8c42')}${miniDino(72, -50, .9, '#2ec4b6', true)}</g></g>`;
// garden and camping
function sunflower(x, y, h, k) {
  let petals = ''; for (let a = 0; a < 360; a += 30) petals += `<ellipse cx="0" cy="-36" rx="11" ry="22" fill="#ffd93d" stroke="#e0a800" stroke-width="2.5" transform="rotate(${a})"/>`;
  return `<path d="M${x},${y} Q${x - 10},${y - h / 2} ${x},${y - h}" stroke="#3a8a2e" stroke-width="${9 * k}" fill="none" stroke-linecap="round"/>
<path d="M${x - 3},${y - h * .45} q-40,-18 -52,8 q30,10 52,-8 Z M${x + 1},${y - h * .3} q40,-18 52,8 q-30,10 -52,-8 Z" fill="#4cbf56" stroke="#2f8a44" stroke-width="3"/>
<g transform="translate(${x},${y - h}) scale(${k})">${petals}<circle r="26" fill="#8a5a34" stroke="#5e3b1c" stroke-width="3"/><circle cx="-8" cy="-5" r="3.5" fill="${DARK}"/><circle cx="8" cy="-5" r="3.5" fill="${DARK}"/><path d="M-9,6 Q0,14 9,6" stroke="${DARK}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
}
const tulip = (x, y, c) => `<path d="M${x},${y} V${y - 34}" stroke="#3a8a2e" stroke-width="5"/><path d="M${x - 13},${y - 52} L${x - 7},${y - 40} L${x},${y - 54} L${x + 7},${y - 40} L${x + 13},${y - 52} Q${x + 15},${y - 30} ${x},${y - 28} Q${x - 15},${y - 30} ${x - 13},${y - 52} Z" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="2.5" stroke-linejoin="round"/>`;
const bee = (x, y, flip) => `<g transform="translate(${x},${y}) scale(${flip ? -1 : 1},1)"><path d="M-60,14 q10,-16 20,0 t20,0" stroke="#fff" stroke-width="3" stroke-dasharray="4 5" fill="none"/><ellipse cx="-4" cy="-14" rx="9" ry="12" fill="#e6f7ff" stroke="#8fb9cc" stroke-width="2" transform="rotate(-20 -4 -14)"/><ellipse cx="6" cy="-14" rx="8" ry="11" fill="#e6f7ff" stroke="#8fb9cc" stroke-width="2" transform="rotate(20 6 -14)"/>
<ellipse rx="18" ry="13" fill="#ffd93d" stroke="#5a2a1c" stroke-width="3"/><path d="M-5,-12 V12 M5,-12 V12" stroke="#5a2a1c" stroke-width="5"/><circle cx="12" cy="-3" r="2.5" fill="${DARK}"/><path d="M-18,0 L-25,0" stroke="#5a2a1c" stroke-width="3"/></g>`;
const tent = (x, y, k) => `<g transform="translate(${x},${y}) scale(${k})" stroke-linejoin="round"><path d="M-110,0 L0,-160 L110,0 Z" fill="#ff8c42" stroke="#b0501a" stroke-width="5"/><path d="M0,-160 L-10,0 L-52,0 Z" fill="#ffb347" stroke="#b0501a" stroke-width="4"/><path d="M0,-160 L0,0 L38,0 Z" fill="#7a3a1a"/><path d="M0,-160 V-182" stroke="#8a5a34" stroke-width="6" stroke-linecap="round"/><path d="M0,-180 L26,-172 L0,-164 Z" fill="#ffd93d"/><path d="M-110,0 L-132,10 M110,0 L132,10" stroke="#c9b9a6" stroke-width="3"/></g>`;
const campfire = (x, y) => `<g transform="translate(${x},${y})"><circle cy="-40" r="120" fill="#ffd27a" opacity=".13"/><circle cy="-40" r="80" fill="#ffd27a" opacity=".16"/>
<path d="M-50,0 L40,-22 M-40,-22 L50,0" stroke="#7a4a24" stroke-width="16" stroke-linecap="round"/>
<path d="M-34,-12 Q-40,-60 -12,-82 Q-14,-60 0,-54 Q2,-96 26,-110 Q18,-74 38,-54 Q44,-30 30,-12 Z" fill="#ff8c42" stroke="#e0561a" stroke-width="3" stroke-linejoin="round"/>
<path d="M-18,-14 Q-22,-44 -4,-58 Q0,-40 10,-40 Q12,-66 24,-74 Q22,-46 28,-32 Q28,-18 18,-14 Z" fill="#ffd93d"/>
<circle cx="-52" cy="-94" r="3" fill="#ffd93d"/><circle cx="46" cy="-120" r="2.5" fill="#ffbe0b"/><circle cx="-20" cy="-130" r="2" fill="#ffd93d"/></g>`;
const moon = (x, y, r) => `<g transform="translate(${x},${y})"><circle r="${r * 1.5}" fill="#fff7c2" opacity=".15"/><circle r="${r}" fill="#fff4b0" stroke="#e8d27a" stroke-width="4"/><circle cx="${-r * .35}" cy="${r * .35}" r="${r * .15}" fill="#f0e08a"/><circle cx="${r * .45}" cy="${-r * .45}" r="${r * .1}" fill="#f0e08a"/>
<path d="M${-r * .45},${-r * .1} q${r * .12},${-r * .12} ${r * .24},0 M${r * .2},${-r * .1} q${r * .12},${-r * .12} ${r * .24},0" stroke="${DARK}" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M${-r * .25},${r * .2} Q0,${r * .42} ${r * .25},${r * .2}" stroke="${DARK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>${cheek(-r * .5, r * .18, r * .12)}${cheek(r * .5, r * .18, r * .12)}</g>`;
const firefly = (x, y) => `<circle cx="${x}" cy="${y}" r="11" fill="#fff59d" opacity=".3"/><circle cx="${x}" cy="${y}" r="4" fill="#fff59d"/>`;
// sky
function hotAirBalloon(x, y, k, c1, c2, pc) {
  return `<g transform="translate(${x},${y}) scale(${k})"><path d="M-20,80 L-18,112 M20,80 L18,112" stroke="#6b3f1f" stroke-width="3"/>
<path d="M0,-82 C52,-82 78,-40 72,0 C66,40 32,62 20,82 L-20,82 C-32,62 -66,40 -72,0 C-78,-40 -52,-82 0,-82 Z" fill="${c1}" stroke="rgba(0,0,0,.25)" stroke-width="4"/>
<path d="M0,-82 C24,-60 28,40 12,82 L-12,82 C-28,40 -24,-60 0,-82 Z" fill="${c2}" stroke="rgba(0,0,0,.15)" stroke-width="3"/>
<ellipse cx="-34" cy="-36" rx="9" ry="18" fill="#fff" opacity=".45"/>
${miniDino(0, 122, .75, pc)}<rect x="-24" y="108" width="48" height="30" rx="5" fill="#c98a4a" stroke="#8a5a34" stroke-width="4"/><path d="M-24,118 H24" stroke="#8a5a34" stroke-width="3"/></g>`;
}
const cloudBank = y => { let o = ''; for (let x = -20; x < 840; x += 70) o += `<circle cx="${x}" cy="${y + (x % 140 ? 10 : -8)}" r="${x % 140 ? 52 : 64}"/>`; return `<g fill="#fff">${o}<rect x="0" y="${y}" width="800" height="${600 - y}"/></g>`; };
function cliffNest(c) {
  const baby = (x, y) => `<g transform="translate(${x},${y})"><path d="M-8,-16 L-34,-30 L-3,-24 Z" fill="${c.f}" stroke="${c.s}" stroke-width="3" stroke-linejoin="round"/><circle r="20" fill="${c.f}" stroke="${c.s}" stroke-width="4"/>
<path d="M14,-8 L44,-26 L20,2 Z" fill="#ffbe0b" stroke="#c98a00" stroke-width="3" stroke-linejoin="round"/><path d="M16,4 L42,8 L14,12 Z" fill="#ffbe0b" stroke="#c98a00" stroke-width="3" stroke-linejoin="round"/>${eye(4, -6, 6)}</g>`;
  return `<path d="M0,600 L0,248 Q30,226 90,222 Q170,218 235,240 Q290,262 300,320 Q316,380 296,430 Q318,500 300,600 Z" fill="#c49a6c" stroke="#8a6440" stroke-width="5" stroke-linejoin="round"/>
<path d="M18,300 Q120,288 250,312 M10,382 Q140,370 292,392 M20,470 Q150,458 300,480 M30,545 Q160,530 300,552" stroke="#a57c52" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M30,236 Q48,214 62,232 Q80,212 96,230 Q120,214 136,232 Q162,214 178,234 Q200,220 216,240 Q232,230 250,248" stroke="#4cbf56" stroke-width="7" fill="none" stroke-linecap="round"/>
<ellipse cx="150" cy="226" rx="72" ry="18" fill="#6b3f1f"/>${baby(112, 200)}${baby(172, 194)}${egg(214, 212, 17, 21, '#e3f7ff', '#8fb9cc')}
<path d="M76,224 Q150,262 224,224 Q220,244 150,250 Q80,244 76,224 Z" fill="#a0643a" stroke="#6b3f1f" stroke-width="4"/><path d="M92,236 L130,232 M150,240 L196,232" stroke="#6b3f1f" stroke-width="3"/>`;
}
const waves = (y0, n) => { let o = ''; const R = seeded(13); for (let i = 0; i < n; i++) { const x = 320 + R() * 470, y = y0 + R() * (590 - y0); o += `<path d="M${x},${y} q10,-8 20,0 t20,0" stroke="#fff" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/>`; } return o; };
// snow and picnic
const snowman = (x, y, k) => `<g transform="translate(${x},${y}) scale(${k})"><g fill="#fff" stroke="#b8d8ee" stroke-width="4"><circle cy="-48" r="50"/><circle cy="-126" r="37"/><circle cy="-186" r="28"/></g>
<path d="M-34,-128 L-80,-160 M-68,-152 L-76,-172 M34,-128 L80,-158 M68,-150 L80,-168" stroke="#8a5a34" stroke-width="5" stroke-linecap="round"/>
<circle cx="-10" cy="-192" r="4" fill="${DARK}"/><circle cx="10" cy="-192" r="4" fill="${DARK}"/><path d="M0,-184 L30,-178 L0,-174 Z" fill="#ff8c42"/><path d="M-11,-172 Q0,-164 11,-172" stroke="${DARK}" stroke-width="3" fill="none" stroke-linecap="round"/>
<circle cy="-140" r="4.5" fill="${DARK}"/><circle cy="-118" r="4.5" fill="${DARK}"/><circle cy="-60" r="5" fill="${DARK}"/><circle cy="-36" r="5" fill="${DARK}"/>
<path d="M-30,-160 Q0,-148 30,-160 L32,-148 Q0,-136 -32,-148 Z M16,-150 L22,-112 L34,-114 L28,-152 Z" fill="#3a86ff" stroke="#1c4f99" stroke-width="3" stroke-linejoin="round"/>
<path d="M-26,-208 Q0,-236 26,-208 Z" fill="#ff5d8f" stroke="#c43a6b" stroke-width="3"/><rect x="-30" y="-212" width="60" height="10" rx="5" fill="#fff" stroke="#c43a6b" stroke-width="3"/><circle cy="-236" r="8" fill="#fff" stroke="#c43a6b" stroke-width="3"/></g>`;
const sled = (x, y) => `<g transform="translate(${x},${y})"><path d="M-70,0 H60 Q84,0 84,-18" stroke="#8a5a34" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-50,0 V-14 M40,0 V-14" stroke="#8a5a34" stroke-width="6"/>
${miniDino(-2, -24, 1.3, '#8ac926')}<rect x="-66" y="-26" width="126" height="14" rx="6" fill="#ff5d5d" stroke="#b83232" stroke-width="4"/><path d="M-66,-20 Q-110,-10 -130,10" stroke="#8a5a34" stroke-width="3" fill="none"/></g>`;
const snowflake = (x, y, k) => `<g transform="translate(${x},${y}) scale(${k})" stroke="#fff" stroke-width="3" stroke-linecap="round">${[0, 60, 120].map(a => `<path d="M0,-10 V10 M-4,-7 L0,-3 L4,-7 M-4,7 L0,3 L4,7" transform="rotate(${a})"/>`).join('')}</g>`;
const basket = (x, y) => `<g transform="translate(${x},${y})"><path d="M-30,-30 Q0,-82 30,-30" stroke="#8a5a34" stroke-width="7" fill="none"/><path d="M-44,-30 L44,-30 L34,12 L-34,12 Z" fill="#d39a58" stroke="#8a5a34" stroke-width="4" stroke-linejoin="round"/><path d="M-40,-14 H40 M-37,0 H37" stroke="#8a5a34" stroke-width="3"/><path d="M-44,-30 Q-22,-46 0,-30 Q22,-46 44,-30" fill="#ff6b6b" stroke="#c43a3a" stroke-width="3"/></g>`;
const watermelon = (x, y, k) => `<g transform="translate(${x},${y}) scale(${k})"><path d="M-34,0 A34,34 0 0 0 34,0 Z" fill="#ff5d73" stroke="#3a8a2e" stroke-width="7" stroke-linejoin="round"/><g fill="${DARK}"><ellipse cx="-14" cy="10" rx="2.5" ry="4"/><ellipse cx="0" cy="16" rx="2.5" ry="4"/><ellipse cx="14" cy="10" rx="2.5" ry="4"/></g></g>`;

/* ================= CHARACTERS (each drawn in its own coordinates) ================= */
// Volcano: 400x380 box, feet at (200, 355)
function volcFace(open) {
  const ink = '#5a2a1c';
  return `<ellipse cx="160" cy="205" rx="26" ry="31" fill="#fff" stroke="${ink}" stroke-width="5"/><ellipse cx="240" cy="205" rx="26" ry="31" fill="#fff" stroke="${ink}" stroke-width="5"/><circle cx="164" cy="211" r="14" fill="#3b2140"/><circle cx="244" cy="211" r="14" fill="#3b2140"/><circle cx="169" cy="204" r="5" fill="#fff"/><circle cx="249" cy="204" r="5" fill="#fff"/>`
    + (open ? `<path d="M166,256 Q200,330 234,256 Z" fill="#7a2336" stroke="${ink}" stroke-width="6" stroke-linejoin="round"/><path d="M185,280 Q200,272 215,280 Q210,289 200,289 Q190,289 185,280Z" fill="#ff6f91"/>`
      : `<path d="M172,262 Q200,290 228,262" stroke="${ink}" stroke-width="7" stroke-linecap="round" fill="none"/>`);
}
function volcanoChar(o = {}) {
  const snow = o.snow ? `<path d="M140,128 C148,110 158,94 172,90 L228,90 C242,94 252,110 260,128 C266,140 270,148 272,154 Q262,164 252,152 Q242,166 230,154 Q218,166 206,154 Q194,166 182,154 Q170,166 158,152 Q146,162 128,154 C132,146 136,138 140,128 Z" fill="#fff" stroke="#b8d8ee" stroke-width="4" stroke-linejoin="round"/>
<ellipse cx="200" cy="90" rx="42" ry="11" fill="#ff6b6b" stroke="#8a3d24" stroke-width="6"/><ellipse cx="200" cy="88" rx="29" ry="5.5" fill="#ffe066"/>
<g fill="#fff" opacity=".9"><circle cx="196" cy="58" r="14"/><circle cx="214" cy="40" r="11"/><circle cx="204" cy="22" r="8"/></g>` : '';
  const scarf = o.scarf ? `<path d="M56,294 Q200,326 344,294 L352,322 Q200,356 48,322 Z" fill="#ff5d8f" stroke="#c43a6b" stroke-width="4" stroke-linejoin="round"/>
<path d="M100,306 L96,334 M150,313 L148,342 M200,316 V346 M250,313 L252,342 M300,306 L304,334" stroke="#fff" stroke-width="7"/>
<path d="M296,318 L316,384 L342,376 L326,312 Z" fill="#ff5d8f" stroke="#c43a6b" stroke-width="4" stroke-linejoin="round"/><path d="M312,370 L308,392 M322,368 L322,390 M332,364 L336,386" stroke="#c43a6b" stroke-width="3"/>` : '';
  return volcanoBody() + snow + volcFace(o.mouth === 'open') + scarf;
}
// T-Rex: feet at (420, 528)
function trex(c, o = {}) {
  const { f, s, d } = c;
  const hat = o.hat ? `<g transform="rotate(14 527 105)"><path d="M490,152 L564,148 L527,56 Z" fill="${o.hat}" stroke="${s}" stroke-width="4" stroke-linejoin="round"/><path d="M503,124 L551,122 M514,96 L540,95" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cx="527" cy="54" r="11" fill="#ffd93d" stroke="${s}" stroke-width="3"/></g>` : '';
  return `<g stroke="${s}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
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
${eye(515, 182, 17)}${cheek(562, 226, 12)}
<path d="M515,238 Q565,292 612,228 Z" fill="#7a2336" stroke="${s}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="566" cy="262" rx="18" ry="8" fill="#ff6f91"/><path d="M530,242 l7,10 l6,-8 M552,248 l6,10 l6,-9 M575,246 l6,9 l6,-10" fill="#fff" stroke="${s}" stroke-width="2"/>${hat}`;
}
// Brontosaurus: feet at (390, 517)
function bronto(c, o = {}) {
  const { f, s, d } = c;
  return `<g stroke="${s}" stroke-width="5" stroke-linejoin="round">
 <rect x="290" y="400" width="44" height="115" rx="20" fill="${d}"/><rect x="445" y="400" width="44" height="115" rx="20" fill="${d}"/>
 <rect x="250" y="395" width="46" height="122" rx="20" fill="${f}"/><rect x="480" y="395" width="46" height="122" rx="20" fill="${f}"/>
 <path d="M40,470 C120,430 200,330 330,305 C420,290 480,300 520,280 C560,250 570,190 582,142 L630,152 C615,210 600,280 560,340 C540,400 480,432 380,432 C300,432 240,420 200,425 C140,435 90,455 40,470 Z" fill="${f}"/>
 <ellipse cx="615" cy="140" rx="48" ry="30" fill="${f}"/>
</g>
<ellipse cx="400" cy="408" rx="90" ry="20" fill="${c.belly}"/>
<g fill="${c.spots}"><circle cx="300" cy="340" r="12"/><circle cx="350" cy="324" r="9"/><circle cx="402" cy="318" r="11"/><circle cx="250" cy="366" r="8"/><circle cx="455" cy="318" r="8"/></g>
<g fill="#fff"><ellipse cx="262" cy="512" rx="7" ry="4"/><ellipse cx="284" cy="512" rx="7" ry="4"/><ellipse cx="492" cy="512" rx="7" ry="4"/><ellipse cx="514" cy="512" rx="7" ry="4"/></g>
${eye(622, 130, 11)}${cheek(642, 150, 7)}<path d="M628,150 Q646,168 661,146 Z" fill="#7a2336" stroke="${s}" stroke-width="4" stroke-linejoin="round"/>
${o.leaf ? '<path d="M648,152 Q672,128 700,142 Q676,168 648,152 Z" fill="#6bcb3a" stroke="#2f8a44" stroke-width="3"/><path d="M652,152 Q676,146 696,143" stroke="#2f8a44" stroke-width="2" fill="none"/>' : ''}
${o.bird ? littleBird(610, 99, .8, o.bird) : ''}`;
}
// Triceratops: feet at (370, 516)
function trike(c, o = {}) {
  const { f, s, d, fr } = c, horn = '#fff3d6';
  let bumps = ''; for (let a = -170; a <= -10; a += 26) { const r = a * Math.PI / 180; bumps += `<circle cx="${520 + Math.cos(r) * 88}" cy="${320 + Math.sin(r) * 88}" r="15" fill="${fr}" stroke="${s}" stroke-width="5"/>`; }
  let dots = ''; for (let a = -160; a <= -20; a += 35) { const r = a * Math.PI / 180; dots += `<circle cx="${520 + Math.cos(r) * 62}" cy="${320 + Math.sin(r) * 62}" r="9" fill="${c.dots}"/>`; }
  let crown = ''; if (o.crown) { const cols = ['#ff5d8f', '#fff', '#ffd93d', '#ff8fb1', '#fff', '#ff5d8f', '#ffd93d']; let i = 0; for (let a = -165; a <= -15; a += 25) { const r = a * Math.PI / 180; crown += flower(520 + Math.cos(r) * 98, 320 + Math.sin(r) * 98, cols[i++ % cols.length]); } }
  return `<g stroke="${s}" stroke-width="5" stroke-linejoin="round">
 <rect x="258" y="410" width="44" height="100" rx="20" fill="${d}"/><rect x="438" y="410" width="44" height="100" rx="20" fill="${d}"/>
 <rect x="222" y="410" width="46" height="106" rx="20" fill="${f}"/><rect x="470" y="410" width="46" height="106" rx="20" fill="${f}"/>
 <path d="M80,430 C150,400 200,330 300,315 C380,300 440,310 480,330 C500,380 480,430 420,445 C340,460 260,450 220,430 C170,425 120,432 80,430 Z" fill="${f}"/>
 ${bumps}<circle cx="520" cy="320" r="88" fill="${fr}"/>
</g>
${dots}${crown}
<g fill="${d}"><circle cx="300" cy="360" r="11"/><circle cx="350" cy="345" r="8"/><circle cx="400" cy="352" r="10"/><circle cx="250" cy="385" r="7"/></g>
<g stroke="${s}" stroke-width="4" stroke-linejoin="round" fill="${horn}">
 <path d="M545,335 Q560,260 610,235 Q590,285 575,340 Z"/><path d="M585,338 Q610,270 660,252 Q635,300 612,346 Z"/>
</g>
<ellipse cx="575" cy="370" rx="68" ry="52" fill="${f}" stroke="${s}" stroke-width="5"/>
<path d="M628,365 Q668,372 662,402 Q640,410 622,395 Z" fill="#d98a3c" stroke="${s}" stroke-width="4" stroke-linejoin="round"/>
<path d="M628,362 Q636,330 655,318 Q650,345 643,366 Z" fill="${horn}" stroke="${s}" stroke-width="4" stroke-linejoin="round"/>
${eye(588, 366, 13)}${cheek(606, 392, 9)}<path d="M592,402 Q612,426 633,398 Z" fill="#7a2336" stroke="${s}" stroke-width="4" stroke-linejoin="round"/>`;
}
// Pterodactyl (flying): body center at (400, 290)
function ptero(c, o = {}) {
  const { f, s, w } = c;
  const scarf = o.scarf ? `<path d="M420,270 Q380,260 352,236 Q342,250 330,244 Q356,284 418,284 Z" fill="#ff5d5d" stroke="#b83232" stroke-width="3" stroke-linejoin="round"/>` : '';
  const scarfFront = o.scarf ? `<path d="M416,262 Q442,282 472,266 L476,280 Q444,298 412,276 Z" fill="#ff5d5d" stroke="#b83232" stroke-width="3" stroke-linejoin="round"/>` : '';
  const goggles = o.goggles ? `<path d="M444,230 Q430,222 420,240" stroke="#8a5a34" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="461" cy="236" r="16" fill="rgba(170,225,255,.55)" stroke="#8a5a34" stroke-width="5"/><path d="M452,228 Q456,224 462,224" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>` : '';
  return `<g stroke="${s}" stroke-width="5" stroke-linejoin="round" fill="${w}">
 <path d="M380,275 Q260,160 70,170 Q150,210 170,260 Q200,250 230,275 Q260,262 290,290 Q330,280 380,300 Z"/>
 <path d="M420,275 Q540,160 730,170 Q650,210 630,260 Q600,250 570,275 Q540,262 510,290 Q470,280 420,300 Z"/>
</g>
<g stroke="${c.line}" stroke-width="3" fill="none" stroke-linecap="round"><path d="M370,280 Q250,220 120,185"/><path d="M430,280 Q550,220 680,185"/></g>
${limb('M388,322 L380,352', f, s, 8)}${limb('M414,322 L422,352', f, s, 8)}${scarf}
<path d="M350,292 L296,314 L352,306 Z" fill="${f}" stroke="${s}" stroke-width="4" stroke-linejoin="round"/>
<path d="M440,222 L368,186 L456,210 Z" fill="${f}" stroke="${s}" stroke-width="4" stroke-linejoin="round"/>
<ellipse cx="400" cy="290" rx="55" ry="38" fill="${f}" stroke="${s}" stroke-width="5"/>
<ellipse cx="405" cy="300" rx="32" ry="20" fill="${c.belly}"/>
<circle cx="455" cy="245" r="34" fill="${f}" stroke="${s}" stroke-width="5"/>${scarfFront}
${o.fish ? fish(586, 292, 1.5, 70) : ''}
<path d="M482,242 L576,258 L482,262 Z" fill="#7a2336"/><path d="M482,234 L588,248 L484,248 Z" fill="#ffbe0b" stroke="#c98a00" stroke-width="3.5" stroke-linejoin="round"/><path d="M484,258 L570,266 L482,270 Z" fill="#ffbe0b" stroke="#c98a00" stroke-width="3.5" stroke-linejoin="round"/>
${eye(460, 236, 11)}${goggles}${cheek(468, 262, 7)}`;
}
const miniVolcano = (x, y, k) => `<g transform="translate(${x},${y}) scale(${k})">${volcanoChar()}</g>`;
const V_ANCHOR = [200, 355], T_ANCHOR = [420, 528], B_ANCHOR = [390, 517], K_ANCHOR = [370, 516], P_ANCHOR = [400, 290];

/* ================= SCENES ================= */
// ---- Volcano ----
function volcanoIsland() {
  return pic({}, `${palm(80, 560, .95)}${palm(730, 560, .8, true)}
${at(400, 527, 1, false, ...V_ANCHOR, volcanoChar())}
${flower(640, 565, '#ff5d8f')}${flower(680, 580, '#9b5de5')}${flower(560, 585, '#3a86ff')}${miniDino(175, 572, 1.3, '#6bcb3a')}`);
}
function volcanoPicnic() {
  const defs = '<pattern id="check" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="44" height="44" fill="#fff"/><rect width="22" height="22" fill="#ff6b6b"/><rect x="22" y="22" width="22" height="22" fill="#ff6b6b"/></pattern>';
  return pic({ defs, sea: false, sun: [110, 90, .65], clouds: [[560, 250, .5], [620, 70, .4]], mid: '<path d="M0,470 Q150,400 320,450 Q500,390 660,440 Q740,420 800,440 V600 H0Z" fill="#a6e77e"/>' },
`${roundTree(60, 520, 1.1, '#ff5d5d')}${roundTree(748, 516, .95)}
${at(400, 482, .78, false, ...V_ANCHOR, volcanoChar({ mouth: 'open' }))}
<g fill="#fff" opacity=".95"><circle cx="400" cy="238" r="14"/><circle cx="378" cy="210" r="10"/><circle cx="430" cy="200" r="11"/></g>
<path transform="translate(335,150) scale(3.4)" d="M0,12 C-14,2 -20,-6 -18,-13 C-15,-22 -4,-22 0,-14 C4,-22 15,-22 18,-13 C20,-6 14,2 0,12 Z" fill="#ffd6e6" stroke="#ff9ec4" stroke-width="1.4" stroke-linejoin="round"/>
<path transform="translate(485,128)" d="${starD(46, 22)}" fill="#fff6c2" stroke="#ffd93d" stroke-width="5" stroke-linejoin="round"/>
<path d="M110,600 L228,478 L592,478 L700,600 Z" fill="url(#check)" stroke="#c43a3a" stroke-width="4" stroke-linejoin="round"/>
${basket(330, 548)}${watermelon(470, 515, 1)}${watermelon(520, 560, .8)}
${miniDino(175, 594, 1.6, '#ff8fb1')}${miniDino(640, 596, 1.6, '#3a86ff', true)}${miniDino(560, 505, 1.05, '#ffd93d', true)}
${butterfly(220, 330, '#ffd93d')}${butterfly(600, 330, '#8fe6ff')}`);
}
function volcanoSnow() {
  const R = seeded(3); let flakes = ''; for (let i = 0; i < 30; i++) flakes += snowflake(R() * 800, R() * 560, .7 + R() * .8);
  return pic({ sky: ['#9fd4ff', '#eef8ff'], sun: [690, 85, .55], clouds: [[40, 70, .7], [420, 40, .5]], sea: false, ground: '#f7fcff', gs: '#c9e4f5',
    mid: '<path d="M0,450 Q200,380 400,430 T800,420 V600 H0Z" fill="#e3f1fb" stroke="#c9e4f5" stroke-width="4"/>' },
`${pine(55, 505, 1.1, true)}${pine(165, 470, .75, true)}${pine(745, 508, 1.05, true)}${pine(640, 468, .7, true)}
${at(400, 532, 1, false, ...V_ANCHOR, volcanoChar({ snow: true, scarf: true }))}
${snowman(130, 568, 1)}${sled(660, 568)}${flakes}`);
}

// ---- T-Rex ----
function trexBeach() {
  const c = { f: '#5cc26b', s: '#2f7a3e', d: '#49a857', belly: '#c9f2a8' };
  return pic({ ground: '#f3d38a', gs: '#d4a84f', sun: [690, 85, .65], clouds: [[40, 70, .7], [330, 40, .5]], back: sailboat(390, 452, .7) },
`${umbrella(135, 548, 1)}${sandcastle(215, 552, .95)}${bucket(335, 556)}
${at(578, 552, .8, true, ...T_ANCHOR, trex(c))}
${beachBall(62, 548, 34)}${starfish(470, 578, 1)}${starfish(730, 582, .8, '#ff5d8f')}`);
}
function trexHatch() {
  const f = '#7bd88f', s = '#2f7a3e', shell = '#fff5e0', sh = '#c9a57a';
  return pic({ ground: '#4fb548', gs: '#2f8a2e', sun: [690, 85, .6], clouds: [[250, 60, .5]], back: miniVolcano(60, 330, .32),
    mid: '<path d="M0,480 Q120,440 260,470 Q400,430 540,465 Q680,440 800,470 V600 H0Z" fill="#79cf62"/>' },
`${fern(40, 600, 1)}${fern(770, 600, 1, true)}${bush(135, 505, .9)}${bush(680, 500, .8)}
<ellipse cx="400" cy="500" rx="255" ry="62" fill="#6b3f1f"/>
${egg(212, 468, 44, 56, '#e3f7ff', '#8fb9cc')}${egg(592, 472, 40, 52, '#ffe3ef', '#d99ab3')}
<ellipse cx="400" cy="415" rx="88" ry="70" fill="${f}" stroke="${s}" stroke-width="5"/>
<ellipse cx="400" cy="300" rx="118" ry="90" fill="${f}" stroke="${s}" stroke-width="5"/>
<g fill="#5cc26b"><ellipse cx="330" cy="258" rx="12" ry="7"/><ellipse cx="470" cy="258" rx="12" ry="7"/></g>
${eye(355, 288, 23)}${eye(445, 288, 23)}${cheek(318, 332, 15)}${cheek(482, 332, 15)}
<ellipse cx="388" cy="322" rx="4" ry="3" fill="${s}"/><ellipse cx="412" cy="322" rx="4" ry="3" fill="${s}"/>
<path d="M345,338 Q400,394 455,338 Z" fill="#7a2336" stroke="${s}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="400" cy="364" rx="20" ry="9" fill="#ff6f91"/><path d="M360,341 l7,10 l6,-8 Z M440,341 l-7,10 l-6,-8 Z" fill="#fff"/>
<g transform="rotate(-10 400 205)"><path d="M322,226 L338,208 L354,226 L372,204 L390,226 L408,204 L426,226 L444,206 L462,226 L478,214 Q470,168 400,162 Q330,168 322,226 Z" fill="${shell}" stroke="${sh}" stroke-width="4" stroke-linejoin="round"/><circle cx="380" cy="190" r="6" fill="#ffd1a8"/><circle cx="422" cy="182" r="5" fill="#ffd1a8"/></g>
<path d="M268,430 L296,404 L322,432 L350,400 L378,432 L406,400 L434,432 L462,400 L490,430 L532,406 Q545,480 510,520 Q462,556 400,558 Q338,556 290,520 Q255,480 268,430 Z" fill="${shell}" stroke="${sh}" stroke-width="4" stroke-linejoin="round"/>
<g fill="#ffd1a8"><circle cx="330" cy="470" r="9"/><circle cx="470" cy="480" r="11"/><circle cx="400" cy="505" r="7"/></g>
${limb('M346,440 Q330,414 312,414', f, s, 13)}${limb('M454,440 Q470,414 488,414', f, s, 13)}
<path d="M140,500 Q400,560 660,500 Q655,545 400,578 Q145,545 140,500 Z" fill="#a0643a" stroke="#6b3f1f" stroke-width="5" stroke-linejoin="round"/>
<path d="M190,530 L260,524 M300,548 L370,540 M430,548 L500,540 M540,526 L610,522" stroke="#6b3f1f" stroke-width="4" stroke-linecap="round"/>
${twinkle(262, 250, 1.3)}${twinkle(540, 232, 1.5)}${twinkle(566, 340, 1)}${twinkle(236, 370, 1.1)}
${butterfly(150, 230, '#ffd93d')}${butterfly(650, 260, '#ff8fb1')}`);
}
function trexParty() {
  const c = { f: '#ff8c42', s: '#b0501a', d: '#e8742c', belly: '#ffe0b5' };
  const R = seeded(11); let conf = '';
  for (let i = 0; i < 40; i++) conf += `<rect x="${(R() * 800).toFixed(0)}" y="${(60 + R() * 280).toFixed(0)}" width="10" height="5" rx="2" fill="${['#ff5d8f', '#ffd93d', '#3a86ff', '#6bcb3a', '#9b5de5'][i % 5]}" transform="rotate(${(R() * 180).toFixed(0)} ${(R() * 800).toFixed(0)} 200)" opacity=".85"/>`;
  return pic({ sky: ['#7fd0ff', '#e3f7ff'], sun: false, clouds: [[560, 160, .45], [200, 170, .4]], sea: false,
    mid: '<path d="M0,480 Q200,440 400,470 T800,460 V600 H0Z" fill="#a6e77e"/>' + fence(505) },
`${bunting()}${conf}
${balloon(84, 130, 34, '#ff5d8f', 108, 468)}${balloon(156, 98, 30, '#ffd93d', 112, 468)}
${at(335, 552, .85, false, ...T_ANCHOR, trex(c, { hat: '#ff5d8f' }))}
${gift(110, 552, 110, 70, '#9b5de5', '#ffd93d')}${gift(112, 482, 70, 50, '#2ec4b6', '#ff5d8f')}
<rect x="540" y="440" width="232" height="112" rx="8" fill="#8fd3ff" stroke="#3a86ff" stroke-width="4"/>
${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${540 + i * 29},446 q14.5,20 29,0" fill="#fff" stroke="#3a86ff" stroke-width="3"/>`).join('')}
<g fill="#fff"><circle cx="575" cy="500" r="7"/><circle cx="630" cy="520" r="7"/><circle cx="690" cy="498" r="7"/><circle cx="745" cy="522" r="7"/></g>
${cake(656, 442)}
${balloon(702, 108, 36, '#3a86ff', 756, 444)}${balloon(768, 186, 30, '#6bcb3a', 760, 444)}${balloon(624, 150, 28, '#ff8c42', 752, 444)}`);
}

// ---- Brontosaurus ----
function brontoSnack() {
  const c = { f: '#5aa9ff', s: '#2d5fa8', d: '#4a90e2', belly: '#cfe6ff', spots: '#8cc4ff' };
  const tree = `<path d="M672,545 L680,250 L712,250 L726,545 Z" fill="#a0643a" stroke="#6b3f1f" stroke-width="5" stroke-linejoin="round"/>
<g fill="#4cbf56" stroke="#2f8a44" stroke-width="5"><circle cx="745" cy="115" r="85"/><circle cx="662" cy="148" r="80"/><circle cx="765" cy="232" r="62"/><circle cx="612" cy="212" r="56"/><circle cx="700" cy="226" r="60"/></g>
<g fill="#ff5d5d" stroke="#b83232" stroke-width="3"><circle cx="700" cy="96" r="11"/><circle cx="770" cy="150" r="11"/><circle cx="640" cy="120" r="11"/><circle cx="722" cy="200" r="11"/><circle cx="760" cy="252" r="11"/><circle cx="600" cy="186" r="10"/><circle cx="680" cy="170" r="10"/></g>`;
  return pic({ sun: [110, 90, .65], clouds: [[250, 70, .55], [430, 40, .4]], back: miniVolcano(10, 350, .3) },
`${tree}${bush(95, 540, .8)}
${at(318, 537, .9, false, ...B_ANCHOR, bronto(c, { leaf: true }))}
${flower(125, 572, '#ff5d8f')}${flower(560, 578, '#ffbe0b')}${flower(605, 562, '#9b5de5')}${flower(760, 585, '#ff5d8f')}
${butterfly(240, 250, '#ff8fb1')}${littleBird(420, 150, .9, '#ffd93d')}`);
}
function brontoSwim() {
  const c = { f: '#6bcb3a', s: '#3a7d1c', d: '#58b52b', belly: '#dcf5c8', spots: '#9be27a' }, lake = '#45bfe6';
  let top = 'M0,405'; for (let x = 40; x <= 800; x += 40) top += ` Q${x - 20},${x % 80 ? 397 : 413} ${x},405`;
  return pic({ sun: [690, 85, .65], clouds: [[40, 80, .7], [360, 55, .5]], sea: false, ground: false, back: miniVolcano(70, 200, .35),
    mid: '<path d="M0,350 Q110,280 240,320 Q360,260 480,310 Q620,250 800,320 V360 H0Z" fill="#8ad66b" stroke="#5bb53d" stroke-width="4"/>' },
`<rect x="0" y="345" width="800" height="255" fill="${lake}"/><path d="M0,346 Q200,338 400,346 T800,344" stroke="#e8fbff" stroke-width="4" fill="none"/>
${lilyPad(110, 380, .7)}${lilyPad(700, 372, .6)}
${at(360, 582, .95, false, ...B_ANCHOR, bronto(c, { bird: '#ff8fb1' }))}
<path d="${top} V600 H0 Z" fill="${lake}" opacity=".9"/>
<g fill="none" stroke="#fff" stroke-width="3" opacity=".75"><ellipse cx="518" cy="408" rx="72" ry="10"/><ellipse cx="350" cy="410" rx="140" ry="12"/><path d="M60,470 q20,-8 40,0 M620,560 q20,-8 40,0 M280,540 q20,-8 40,0"/></g>
${lilyPad(165, 480, 1.1, true)}${lilyPad(640, 520, 1, true)}${lilyPad(430, 560, .8)}${lilyPad(90, 560, 1)}
${fish(700, 372, 1.1, -35)}<g fill="#fff"><ellipse cx="672" cy="404" rx="6" ry="9"/><ellipse cx="730" cy="400" rx="5" ry="8"/><circle cx="660" cy="388" r="4"/><circle cx="744" cy="384" r="3.5"/></g>
${cattails(28, 600)}${cattails(780, 600, true)}`);
}
function brontoSlide() {
  const c = { f: '#ff8fb1', s: '#b83d6b', d: '#f07aa0', belly: '#ffe0ea', spots: '#ffc2d4' }, pit = ballPit(88, 596);
  const whee = (x, y) => `<path d="M${x + 36},${y - 30} q14,-4 24,4 M${x + 38},${y - 16} q16,-2 26,6" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  return pic({ sun: [700, 80, .6], clouds: [[30, 70, .7], [330, 45, .5]], sea: false,
    mid: '<path d="M0,470 Q160,410 330,450 Q520,400 700,445 Q760,430 800,440 V600 H0Z" fill="#a6e77e"/>' },
`${roundTree(770, 470, .75, '#ffd93d')}${pit.back}
${at(430, 546, .95, false, ...B_ANCHOR, bronto(c))}
${miniDino(332, 346, 1.1, '#ffd93d', true, -20)}${whee(332, 346)}${miniDino(260, 384, 1.1, '#3a86ff', true, -37)}${whee(260, 384)}${miniDino(174, 450, 1.1, '#6bcb3a', true, -35)}${whee(174, 450)}
${miniDino(80, 560, 1.1, '#9b5de5', false, 12)}${pit.front}
${seesaw(685, 568)}${twinkle(60, 470, 1.2)}${twinkle(130, 500, .9)}${butterfly(520, 150, '#ffd93d')}${flower(560, 585, '#9b5de5')}`);
}

// ---- Triceratops ----
function trikeFamily() {
  const mom = { f: '#ffb347', s: '#c96f1c', d: '#f29a2e', fr: '#ff7f50', dots: '#ffd93d' };
  const kid = { f: '#ffd08a', s: '#c96f1c', d: '#f7bb6a', fr: '#ff9eb0', dots: '#fff3a0' };
  return pic({ sun: [690, 85, .65], clouds: [[40, 80, .7], [360, 50, .5]], back: miniVolcano(585, 330, .3),
    mid: '<path d="M0,470 Q140,420 300,455 Q470,410 640,450 Q740,430 800,445 V600 H0Z" fill="#a6e77e"/>' },
`${roundTree(70, 505, .9, '#ff5d5d')}${roundTree(770, 480, .55)}
<path d="M-10,562 Q300,520 520,544 T810,530 L810,566 Q560,582 300,578 T-10,600 Z" fill="#f0d49a"/>
${at(290, 542, .82, false, ...K_ANCHOR, trike(mom))}
${at(662, 552, .42, false, ...K_ANCHOR, trike(kid))}
${heart(560, 330, 1.4, '#ff5d8f')}${heart(606, 288, 1, '#ff8fb1')}${heart(648, 320, .8, '#ff5d8f')}
${flower(140, 585, '#9b5de5')}${flower(420, 590, '#ff5d8f')}${flower(760, 590, '#3a86ff')}${butterfly(330, 180, '#ffd93d')}`);
}
function trikeGarden() {
  const c = { f: '#2ec4b6', s: '#16786f', d: '#25ab9e', fr: '#9b5de5', dots: '#ffd93d' };
  let tulips = ''; const tc = ['#ff5d8f', '#ffd93d', '#ff8c42', '#9b5de5', '#ff8fb1'];
  for (let x = 20, i = 0; x < 800; x += 42, i++) tulips += tulip(x, 604, tc[i % tc.length]);
  return pic({ sun: [560, 85, .6], clouds: [[40, 70, .6], [260, 40, .45]], sea: false,
    mid: '<path d="M0,450 Q200,400 400,440 T800,430 V600 H0Z" fill="#a6e77e"/>' + fence(492) },
`${sunflower(66, 560, 340, 1)}${sunflower(160, 560, 230, .8)}${sunflower(752, 560, 300, .95)}
${at(468, 540, .85, true, ...K_ANCHOR, trike(c, { crown: true }))}
${tulips}${bee(250, 190)}${bee(640, 160, true)}${butterfly(420, 160, '#ff8fb1')}${butterfly(700, 390, '#ffd93d')}`);
}
function trikeCamp() {
  const c = { f: '#ffd93d', s: '#c99a00', d: '#f2c500', fr: '#ff5d8f', dots: '#fff3a0' };
  const R = seeded(5); let stars = '';
  for (let i = 0; i < 50; i++) stars += `<circle cx="${(R() * 800).toFixed(0)}" cy="${(R() * 330).toFixed(0)}" r="${(1 + R() * 2).toFixed(1)}" fill="#fff" opacity="${(.5 + R() * .5).toFixed(2)}"/>`;
  for (let i = 0; i < 8; i++) stars += twinkle(R() * 800, 20 + R() * 280, .6 + R() * .5, '#fff4b0');
  let flies = ''; [[470, 330], [520, 390], [700, 300], [250, 420], [120, 330], [760, 380], [420, 250], [610, 250]].forEach(([x, y]) => flies += firefly(x, y));
  return pic({ sky: ['#27317a', '#6a5fc1'], sun: false, clouds: [], sea: false, ground: '#3f9e5f', gs: '#2c7a47', sky0: stars + moon(120, 95, 48),
    mid: `<path d="M0,440 Q160,380 330,420 Q520,360 700,410 Q760,400 800,405 V600 H0Z" fill="#2f7d52"/>${pine(470, 420, .6, false, '#1f5e3d')}${pine(540, 405, .5, false, '#1f5e3d')}${pine(720, 410, .7, false, '#1f5e3d')}${pine(270, 420, .55, false, '#1f5e3d')}` },
`${tent(165, 548, 1)}${campfire(330, 552)}
${at(602, 546, .72, true, ...K_ANCHOR, trike(c))}
${flies}`);
}

// ---- Pterodactyl ----
function pteroIsland() {
  const c = { f: '#ff8fb1', s: '#b83d6b', w: '#ffc2d4', belly: '#ffe0ea', line: '#e889a8' };
  return pic({ sun: [705, 80, .6], clouds: [[30, 80, .7], [560, 360, .5], [120, 380, .45]], ground: false },
`<ellipse cx="400" cy="585" rx="300" ry="70" fill="#f3d38a" stroke="#d4a84f" stroke-width="5"/>
${miniVolcano(310, 420, .45)}${palm(175, 590, .6)}${palm(625, 590, .6, true)}
${at(400, 290, 1, false, ...P_ANCHOR, ptero(c))}`);
}
function pteroCliff() {
  const c = { f: '#6fb7ff', s: '#2d5fa8', w: '#bfe0ff', belly: '#e3f2ff', line: '#8cbef0' };
  return pic({ sun: [80, 72, .55], clouds: [[430, 330, .5], [600, 60, .4]], ground: false },
`${waves(470, 16)}
<g fill="#9aa7b8" stroke="#6b7a8c" stroke-width="4"><ellipse cx="690" cy="585" rx="80" ry="36"/><ellipse cx="760" cy="570" rx="50" ry="40"/></g>${starfish(690, 560, .9, '#ff5d8f')}
${cliffNest(c)}
${at(565, 205, .72, true, ...P_ANCHOR, ptero(c, { fish: true }))}
${littleBird(470, 390, .7, '#fff')}`);
}
function pteroBalloons() {
  const c = { f: '#8ac926', s: '#4a7a10', w: '#d6f5a8', belly: '#effbe0', line: '#a8d870' };
  return pic({ sky: ['#7fcfff', '#ffe3f1'], sun: [712, 64, .5], clouds: [[20, 290, .6], [600, 250, .5], [290, 40, .45]], sea: false, ground: false, back: miniVolcano(70, 395, .4) },
`${hotAirBalloon(95, 100, .62, '#ff5d8f', '#ffd93d', '#3a86ff')}${hotAirBalloon(575, 95, .45, '#9b5de5', '#6bcb3a', '#ff8c42')}
${at(400, 290, .8, false, ...P_ANCHOR, ptero(c, { goggles: true, scarf: true }))}
${hotAirBalloon(690, 410, .8, '#3a86ff', '#fff', '#ffd93d')}${hotAirBalloon(300, 425, .6, '#ff8c42', '#fff3a0', '#ff5d8f')}
${cloudBank(548)}${littleBird(210, 240, .6, '#fff')}${littleBird(560, 330, .5, '#fff')}`);
}

/* ================= PUZZLE LIST ================= */
const svgURI = svg => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
const PUZZLES = [
  { id: 'volcano', sound: 'boing', versions: [
    { name: 'the volcano island', draw: volcanoIsland }, { name: 'the volcano picnic', draw: volcanoPicnic }, { name: 'the snowy volcano', draw: volcanoSnow }] },
  { id: 'trex', sound: 'roar', extra: ' Roar!', versions: [
    { name: 'the beach T-Rex', draw: trexBeach }, { name: 'the baby T-Rex', draw: trexHatch }, { name: 'the birthday T-Rex', draw: trexParty }] },
  { id: 'bronto', sound: 'roar', versions: [
    { name: 'the hungry Brontosaurus', draw: brontoSnack }, { name: 'the swimming Brontosaurus', draw: brontoSwim }, { name: 'the Brontosaurus slide', draw: brontoSlide }] },
  { id: 'trike', sound: 'roar', versions: [
    { name: 'the Triceratops family', draw: trikeFamily }, { name: 'the Triceratops garden', draw: trikeGarden }, { name: 'the camping Triceratops', draw: trikeCamp }] },
  { id: 'ptero', sound: 'squawk', versions: [
    { name: 'the flying Pterodactyl', draw: pteroIsland }, { name: 'the Pterodactyl nest', draw: pteroCliff }, { name: 'the balloon ride', draw: pteroBalloons }] },
];
PUZZLES.forEach(pz => { pz.versions.forEach(v => { v.uri = svgURI(v.draw()); v.url = `url("${v.uri}")`; }); pz.v = -1; });
// Choose which scene the picker shows next (never the same one twice in a row)
function pickVersion(pz) {
  const n = pz.versions.length;
  let v = randi(0, n - 1);
  if (n > 1 && v === pz.v) v = (v + randi(1, n - 1)) % n;
  pz.v = v; pz.pic = pz.versions[v].url; pz.uri = pz.versions[v].uri; pz.name = pz.versions[v].name;
}
