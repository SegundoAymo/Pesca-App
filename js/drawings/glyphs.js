// Íconos de datos de Kit de Pesca (Señal S7): trazo negro 1,8, acento amarillo, rejilla 24.
// glyph(nombre, tamaño) devuelve un <svg> como string ('' si no existe).

const K = '#0B0B0B';
const Y = '#FFC400';
const RED = '#C8102E';
const WATER = '#9CCFEA';
const MUD = '#7A5A3A';
const GREEN = '#2F7D3A';
const PINK = '#E58FA0';
const GREY = '#E4E4DE';

const P = (d, fill = 'none', w = 1.8) =>
  `<path d="${d}" fill="${fill}" stroke="${K}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const N = (d, w = 1.8) => P(d, 'none', w);
const C = (x, y, r, fill = 'none', w = 1.8) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${K}" stroke-width="${w}"/>`;
const D = (x, y, r = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${K}"/>`;
const R = (x, y, w, h, rx, fill = '#FFFFFF', sw = 1.8) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${K}" stroke-width="${sw}" stroke-linejoin="round"/>`;
const G = (t, body) => `<g transform="${t}">${body}</g>`;
// Palo con contorno negro y relleno de color.
const stick = (d, w, color, cap = 'round') =>
  `<path d="${d}" fill="none" stroke="${K}" stroke-width="${w + 2.2}" stroke-linecap="${cap}" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="${cap}" stroke-linejoin="round"/>`;
// Pececito mirando a la derecha, centrado en (x,y).
const fish = (x, y, s = 1, fill = '#FFFFFF', w = 1.8) =>
  G(`translate(${x} ${y}) scale(${s})`,
    `<path d="M-3.4 0 L-6 -2.6 L-6 2.6 Z" fill="${fill}" stroke="${K}" stroke-width="${w / s}" stroke-linejoin="round"/>` +
    `<path d="M-3.6 0 C-2 -3 3 -3.2 5 0 C3 3.2 -2 3 -3.6 0Z" fill="${fill}" stroke="${K}" stroke-width="${w / s}" stroke-linejoin="round"/>` +
    `<circle cx="2.4" cy="-0.5" r="0.7" fill="${K}"/>`);
const WAVE = (y, x0 = 3, x1 = 21, a = 1.4) => {
  let d = `M${x0} ${y}`;
  const seg = 4;
  let up = true;
  for (let x = x0; x < x1; x += seg) { d += ` q${seg / 2} ${up ? -a : a} ${seg} 0`; up = !up; }
  return d;
};
// Anzuelo con ojal en (0,0).
const hook = (x, y, s = 1, w = 1.8) =>
  G(`translate(${x} ${y}) scale(${s})`,
    `<circle cx="0" cy="0" r="1.7" fill="none" stroke="${K}" stroke-width="${w / s}"/>` +
    `<path d="M0 1.7 V9 C0 15 8 15 8 8.4 L6 10" fill="none" stroke="${K}" stroke-width="${w / s}" stroke-linecap="round" stroke-linejoin="round"/>`);
const cloud = (y = 0, fill = '#FFFFFF') =>
  P(`M7 ${15 + y}h10a3.8 3.8 0 0 0 .5-7.6A5.6 5.6 0 0 0 6.6 ${8.4 + y} 3.6 3.6 0 0 0 7 ${15 + y}z`, fill);
const sunRays = (cx, cy, r1, r2) => {
  let d = '';
  for (let a = 180; a <= 360; a += 45) {
    const t = (a * Math.PI) / 180;
    d += `M${(cx + r1 * Math.cos(t)).toFixed(1)} ${(cy + r1 * Math.sin(t)).toFixed(1)}L${(cx + r2 * Math.cos(t)).toFixed(1)} ${(cy + r2 * Math.sin(t)).toFixed(1)}`;
  }
  return N(d, 1.8);
};
// Columna de agua para profundidad.
const column = (fy) =>
  `<path d="M4 6${'q2 -1.4 4 0 t4 0 t4 0 t4 0'} V19 H4Z" fill="${WATER}"/>` +
  `<path d="M4 18 H20 V19 a2 2 0 0 1 -2 2 H6 a2 2 0 0 1 -2 -2Z" fill="${MUD}"/>` +
  N('M4 3 V19 a2 2 0 0 0 2 2 H18 a2 2 0 0 0 2 -2 V3') +
  N('M4 6 q2 -1.4 4 0 t4 0 t4 0 t4 0') +
  N('M4 18 H20', 1.4) +
  fish(12, fy, 1.15, Y, 1.5);
const kernel = (x, y, r = 0) =>
  G(`translate(${x} ${y}) rotate(${r})`,
    `<path d="M0 -4.4 C3.4 -4.4 3.8 0 2.4 3.6 C1.8 5 -1.8 5 -2.4 3.6 C-3.8 0 -3.4 -4.4 0 -4.4Z" fill="${Y}" stroke="${K}" stroke-width="1.6" stroke-linejoin="round"/><path d="M-1 -2 Q-1.4 0 -1 1.6" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round"/>`);
const cube = (x, y, s, a, b, c) => {
  const w = 5 * s, h = 2.8 * s, t = 5 * s;
  return P(`M${x} ${y} l${w} ${h} l-${w} ${h} l-${w} -${h}Z`, a, 1.5) +
    P(`M${x - w} ${y + h} l${w} ${h} v${t} l-${w} -${h}Z`, b, 1.5) +
    P(`M${x + w} ${y + h} l-${w} ${h} v${t} l${w} -${h}Z`, c, 1.5);
};

const ICONS = {
  /* Momentos del día */
  dawn: () =>
    `<path d="M6.5 17a5.5 5.5 0 0 1 11 0z" fill="${Y}" stroke="${K}" stroke-width="1.8" stroke-linejoin="round"/>` +
    N('M2 20h20') + N('M12 3v5M9.5 5.5 12 3l2.5 2.5') + N('M4.5 12.2l1.6 1.2M19.5 12.2l-1.6 1.2', 1.6),
  day: () =>
    C(12, 12, 4.6, Y, 1.8) +
    N('M12 2.4v2.6M12 19v2.6M2.4 12H5M19 12h2.6M5.2 5.2l1.8 1.8M17 17l1.8 1.8M5.2 18.8 7 17M17 7l1.8-1.8'),
  dusk: () =>
    `<path d="M6.5 17a5.5 5.5 0 0 1 11 0z" fill="${Y}" stroke="${K}" stroke-width="1.8" stroke-linejoin="round"/>` +
    N('M2 20h20') + N('M12 3v5M9.5 5.5 12 8l2.5-2.5') + N('M4.5 12.2l1.6 1.2M19.5 12.2l-1.6 1.2', 1.6),
  night: () =>
    P('M15 3.5a8.5 8.5 0 1 0 6 13.2A7.2 7.2 0 0 1 15 3.5z', Y) +
    `<path d="M19.5 4.5v3M18 6h3" stroke="${K}" stroke-width="1.6" stroke-linecap="round"/>`,

  /* Profundidad */
  surface: () => column(8.7),
  midwater: () => column(12.4),
  bottom: () => column(15.9),

  /* Ambiente */
  weeds: () =>
    P('M12 21 C8.5 14 9.5 8 12 2.5 C14.5 8 15.5 14 12 21Z', GREEN) +
    P('M6.5 21 C3.5 16 4.5 11.5 5.8 8.5 C8.5 12 9 16.5 6.5 21Z', GREEN) +
    P('M17.5 21 C15 16.5 15.5 12 18.2 8.5 C19.5 11.5 20.5 16 17.5 21Z', GREEN) +
    N('M2.5 21.5h19'),
  mud: () =>
    P('M3 10 q2.2 -1.8 4.5 0 t4.5 0 t4.5 0 t4.5 0 V19 a2 2 0 0 1 -2 2 H5 a2 2 0 0 1 -2 -2Z', MUD) +
    `<g fill="#D9B58A"><circle cx="7.5" cy="14" r="1.2"/><circle cx="13" cy="17" r="1.4"/><circle cx="17" cy="13.5" r="1.1"/><circle cx="10.5" cy="12.5" r="0.8"/></g>` +
    C(16, 5.5, 1.6, '#FFFFFF', 1.4) + C(11, 4, 1, '#FFFFFF', 1.3),
  'open-water': () =>
    R(3, 3, 18, 18, 3, WATER) +
    N(WAVE(8.5, 5.5, 18.5, 1.3)) + N(WAVE(13, 5.5, 18.5, 1.3)) + N(WAVE(17.5, 5.5, 18.5, 1.3)),
  school: () =>
    fish(8, 8, 1.3, '#FFFFFF', 1.6) + fish(15.5, 13, 1.7, Y, 1.5) + fish(7.5, 17.5, 1.3, '#FFFFFF', 1.6),
  river: () =>
    R(3, 3, 18, 18, 3, WATER) +
    P('M3 3 H8 C6 9 10 14 7 21 H6 a3 3 0 0 1 -3 -3Z', '#CFE3B8', 1.6) +
    P('M21 3 H16.5 C14.5 9 18 14 15 21 H18 a3 3 0 0 0 3 -3Z', '#CFE3B8', 1.6) +
    stick('M12 6.5 V15.5', 1.6, Y) + stick('M9.2 13.2 L12 16 L14.8 13.2', 1.6, Y),
  structure: () =>
    `<path d="M3 6h18v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" fill="${WATER}"/>` +
    stick('M7.5 21 V10.5 M7.5 15 L4.5 11.5 M7.5 13 L11 9', 2.4, MUD) +
    stick('M16.5 21 L14.5 11 M15.2 15.5 L19.2 12', 2.4, MUD) +
    N('M3 6q2.2 -1.4 4.5 0t4.5 0t4.5 0t4.5 0') + N('M3 6v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6') +
    `<circle cx="12" cy="18" r="1" fill="#FFFFFF" stroke="${K}" stroke-width="1"/>`,
  bubbles: () =>
    `<path d="M3 11h18v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" fill="${WATER}"/>` +
    N('M3 11q2.2 -1.6 4.5 0t4.5 0t4.5 0t4.5 0') + N('M3 11v7a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-7') +
    C(8, 16.5, 1.7, '#FFFFFF', 1.5) + C(14, 18, 1.2, '#FFFFFF', 1.4) + C(13.5, 14, 1.4, '#FFFFFF', 1.4) +
    C(11, 6.5, 2.4, Y, 1.7) + C(17, 4.5, 1.6, '#FFFFFF', 1.6) + C(6, 5, 1.4, '#FFFFFF', 1.5),

  /* Carnadas */
  worm: () =>
    `<path d="M4.5 17.5 C3.5 10 10 15 12 12 C14 9 14 5.5 19.5 6" fill="none" stroke="${K}" stroke-width="6.2" stroke-linecap="round"/>` +
    `<path d="M4.5 17.5 C3.5 10 10 15 12 12 C14 9 14 5.5 19.5 6" fill="none" stroke="${PINK}" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M4.5 17.5 C3.5 10 10 15 12 12 C14 9 14 5.5 19.5 6" fill="none" stroke="#B85A70" stroke-width="3.8" stroke-dasharray="0.8 2.4" stroke-dashoffset="1"/>` +
    `<circle cx="19.5" cy="6" r="0.8" fill="${K}"/>`,
  'live-fish': () =>
    P('M3.5 12 C6 6.5 15 6 19 12 C15 18 6 17.5 3.5 12Z', '#E8ECEF') +
    P('M19 12 L22.5 8.2 V15.8Z', '#E8ECEF') +
    P('M9 7.6 L11 4.8 L14.5 7.6', Y, 1.5) +
    N('M3.5 12 L7.5 12.6', 1.4) + D(7.2, 10.6, 1.1) +
    N('M11 10 q1.6 2 0 4M14.5 10.3 q1.4 1.7 0 3.4', 1.3) +
    N('M3.4 12.2 v4.5 a1.8 1.8 0 0 0 3.2 1', 1.4),
  fillet: () =>
    P('M2.5 14.5 C5 7 14 5.5 21.5 9 L19.5 12.5 L21.5 16 C14 18.5 7 18.5 2.5 14.5Z', '#F6B8A4') +
    N('M5 14 C9 10 15 9.5 19 11.5', 1.3) + N('M7 16 C11 13.5 15 13.5 19 14.5', 1.3) +
    `<path d="M3.4 15.3 C7 18.5 14 18 20.5 16" fill="none" stroke="#C9CED3" stroke-width="1.8" stroke-linecap="round"/>`,
  corn: () => kernel(7.5, 8, -15) + kernel(16.5, 8.5, 15) + kernel(12, 16.5, 0),
  potato: () =>
    cube(9, 3.5, 1.15, '#F7EBC0', '#E3CD8C', '#CDB46E') + cube(16, 12.5, 0.9, '#F7EBC0', '#E3CD8C', '#CDB46E'),
  dough: () =>
    P('M4 15 C3 8 8 4.5 12 4.5 C17 4.5 21 8.5 20 14.5 C19.5 19.5 15 20.5 12 20.5 C8 20.5 4.7 19.5 4 15Z', '#F5E9CB') +
    `<g fill="${K}"><circle cx="9" cy="10" r="0.9"/><circle cx="14.5" cy="9" r="0.9"/><circle cx="12" cy="14" r="0.9"/><circle cx="16.5" cy="14.5" r="0.9"/><circle cx="8" cy="15" r="0.9"/></g>` +
    N('M7.5 7 C9 6 10 5.8 11 5.9', 1.3).replace(K, '#FFFFFF'),
  bread: () =>
    P('M4 11 C2 9.5 2.5 5 7 4.5 C9 4 10 5 12 5 C14 5 15 4 17 4.5 C21.5 5 22 9.5 20 11 V19.5 a1.5 1.5 0 0 1 -1.5 1.5 H5.5 A1.5 1.5 0 0 1 4 19.5Z', '#C98A44') +
    P('M7 12 V18 H17 V12 C17 9 15 7.5 12 7.5 C9 7.5 7 9 7 12Z', '#F8E7BE', 1.5) +
    `<g fill="#C98A44"><circle cx="10" cy="12.5" r="0.7"/><circle cx="14" cy="14" r="0.7"/><circle cx="11" cy="16" r="0.7"/></g>`,
  liver: () =>
    P('M3.5 12 C3 6.5 8.5 4 13 5.5 C18 4.5 21.5 8.5 20.5 13 C20 18 15 20.5 11 19.5 C6 20 3.8 16.5 3.5 12Z', RED) +
    N('M8 9 C9.5 8 11 8 12 8.8', 1.4).replace(K, '#FFFFFF') +
    N('M10 14 C12 13 14 14.5 16.5 13M14 16.5 L15.5 17.5', 1.3).replace(K, '#F4A9B3'),
  sausage: () =>
    C(9.5, 9.5, 5.6, '#D96B55') + C(15.5, 15, 5.6, '#D96B55') +
    `<g fill="#FFFFFF"><circle cx="7.5" cy="8" r="1"/><circle cx="11" cy="11" r="0.9"/><circle cx="8" cy="12" r="0.8"/><circle cx="14" cy="14" r="1"/><circle cx="17.5" cy="16.5" r="0.9"/><circle cx="14" cy="17.5" r="0.8"/><circle cx="17.5" cy="12.8" r="0.7"/></g>` +
    N('M5.5 12 C6 4.5 13 4 14 5', 0.001).replace(/<path[^>]*\/>/, ''),
  cheese: () =>
    P('M2.5 17.5 V11.5 L21.5 5.5 V17.5 a1 1 0 0 1 -1 1 H3.5 a1 1 0 0 1 -1 -1Z', Y) +
    C(8, 15, 1.5, '#FFF3C4', 1.4) + C(14, 11.5, 1.3, '#FFF3C4', 1.4) + C(17.5, 15.5, 1.8, '#FFF3C4', 1.4) +
    N('M2.5 11.5 L21.5 5.5', 1.8),
  frog: () =>
    `<ellipse cx="9" cy="8.6" rx="5.8" ry="3.4" transform="rotate(38 9 8.6)" fill="#F4D7B8" stroke="${K}" stroke-width="1.8"/>` +
    stick('M11.5 12 L14.5 17', 2.2, '#F4D7B8') +
    N('M14.5 17 L21 15M14.5 17 L21 19M14.5 17 L18 21.5', 1.7) +
    N('M6 6.5 q1.8 -1.2 3 0', 1.2).replace(K, '#FFFFFF'),

  /* Señuelos */
  'lure-crank': () =>
    P('M8 9 C11 5 18 6 21.5 11 C18 15.5 11 15 8 11Z', Y) +
    P('M8 10 L2.5 12.8 L4.8 14.8 L9.5 12.6Z', '#FFFFFF', 1.5) +
    D(11.8, 9.8, 1.1) + N('M14 8 q1.6 2.5 0 5.5', 1.3) +
    N('M15 14.5 V18 a2 2 0 0 1 -3.6 1.2 M15 18 l2 2', 1.5) +
    N('M20 11 l2 1.2', 1.4),
  'lure-popper': () =>
    P('M7 9.5 Q9.4 12 7 14.5 C12 16 17.5 15.5 21.5 13.5 C19 10 13 8.6 7 9.5Z', Y) +
    D(12.5, 11.5, 1.1) +
    `<path d="M3.5 5.5 q1.2 1.8 0 3 q-1.2 -1.2 0 -3zM8 3.5 q1.2 1.8 0 3 q-1.2 -1.2 0 -3zM3.3 11.5 q-1 1 -0.5 2" fill="${WATER}" stroke="${K}" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"/>` +
    N('M14 15.8 V19.5 a1.8 1.8 0 0 1 -3.2 1', 1.5) +
    P('M21.5 13.5 L23 10.5 M21.5 13.5 L23 15.5', 'none', 1.4),
  'lure-soft': () =>
    stick('M8.5 14.5 C12 14.5 13.5 16.5 16.5 14.5 C19 12.5 16.5 8.5 20 8', 2.8, GREEN) +
    N('M12 12.6 V16.4M14.8 13.2 V16.8', 1.3).replace(K, '#9BD8A3') +
    C(6, 15, 3.4, Y, 1.8) + D(5, 14.2, 0.9) +
    N('M6 11.6 V7 a1.8 1.8 0 0 0 -3.2 -1', 1.6),
  'lure-frog': () =>
    P('M9.5 8.5 L5.5 5 L3.5 7.5 M14.5 8.5 L18.5 5 L20.5 7.5', 'none', 1.7) +
    P('M9.5 15.5 C6 15 3.5 17 3.5 20 L7 21 C8 19.5 10.5 19.5 10.5 19.5 M14.5 15.5 C18 15 20.5 17 20.5 20 L17 21 C16 19.5 13.5 19.5 13.5 19.5', 'none', 1.7) +
    P('M12 4 C16 4 16.5 9 15.5 13 C14.8 16.5 13.5 18.5 12 18.5 C10.5 18.5 9.2 16.5 8.5 13 C7.5 9 8 4 12 4Z', GREEN) +
    C(9.8, 5.6, 1.6, Y, 1.4) + C(14.2, 5.6, 1.6, Y, 1.4) + D(9.8, 5.6, 0.6) + D(14.2, 5.6, 0.6) +
    N('M10.5 10 q1.5 1 3 0', 1.3).replace(K, '#9BD8A3'),
  'lure-walker': () =>
    G('rotate(-18 12 11)',
      P('M3 9.2 C5 8.5 17 8.5 21 10.4 C21.5 11.2 21.5 11.8 21 12.6 C17 14.5 5 14.5 3 13.8 C2 12.5 2 10.5 3 9.2Z', Y) +
      D(6.5, 11, 1.1) + N('M11 9 L12.5 13M15.5 9.4 L16.8 13', 1.3) +
      N('M9 14.2 V17.2 a1.8 1.8 0 0 1 -3.2 .8M17 13.8 V16.8 a1.8 1.8 0 0 0 3.2 .8', 1.5)),
  'lure-spoon': () =>
    C(16.5, 3, 1.5, 'none', 1.5) +
    `<ellipse cx="12" cy="11.5" rx="5.6" ry="7.4" transform="rotate(32 12 11.5)" fill="${Y}" stroke="${K}" stroke-width="1.8"/>` +
    `<ellipse cx="12" cy="11.5" rx="3" ry="4.8" transform="rotate(32 12 11.5)" fill="none" stroke="${K}" stroke-width="1.2"/>` +
    C(14.6, 7, 0.9, '#FFFFFF', 1.2) +
    N('M8.2 17.6 V20.4 a1.7 1.7 0 0 1 -3.2 .7', 1.6),
  /* Alertas y reglas */
  teeth: () =>
    P('M2.5 11.2 C5.5 4 18.5 4 21.5 11.2Z', RED) + P('M2.5 12.8 C5.5 20 18.5 20 21.5 12.8Z', RED) +
    P('M6 11.2 L8 16 L10 11.2M13 11.2 L15 16 L17 11.2', '#FFFFFF', 1.5) +
    P('M10 12.8 L12 8.4 L14 12.8M3.8 12.8 L5 10M19 12.8 L20.2 10', '#FFFFFF', 1.5),
  spines: () =>
    // A dorsal fin with a hard spine that sticks out, over a fish's back, and a red drop.
    P('M2.5 17 C6 11.5 16 11 21.5 16 C16 21 6 21 2.5 17Z', '#FFFFFF') + D(6.4, 16.2, 1) +
    P('M8 12.6 L12.5 3 L13.6 12Z', Y, 1.6) + N('M10 12.2 L12.3 6.5M11.8 12 L12.9 7', 1.1) +
    `<circle cx="12.5" cy="3" r="1.5" fill="${RED}"/>`,
  'closed-season': () =>
    fish(13, 12, 2, '#FFFFFF', 1.8) +
    `<path d="M3.5 3.5 L20.5 20.5" stroke="#FFFFFF" stroke-width="5.6" stroke-linecap="round"/>` +
    `<path d="M3.5 3.5 L20.5 20.5" stroke="${K}" stroke-width="4.8" stroke-linecap="round"/>` +
    `<path d="M3.5 3.5 L20.5 20.5" stroke="${RED}" stroke-width="2.8" stroke-linecap="round"/>`,
  warning: () =>
    P('M12 3 L22 20.5 H2Z', Y, 1.9) + N('M12 9.5v5', 2.2) + D(12, 17.3, 1.3),
  storm: () =>
    cloud(-1, '#E8ECEF') +
    P('M13 12 L9 18.5 H12.2 L10.8 23 L16 16 H12.6 L14.2 12Z', Y, 1.6) +
    N('M6.5 17.5 L5.5 20M18 17.5 L17 20', 1.6),

  /* Situaciones de nudos */
  'knot-reel': () =>
    C(10, 10, 7, '#FFFFFF') + C(10, 10, 4.2, Y, 1.5) + C(10, 10, 1.2, K, 1) +
    N('M17 10 H21.5 M21.5 7.5 V12.5', 2) +
    N('M4.4 15.2 C2.5 18 4 20 3 22.5', 1.6) +
    P('M3 22.5', 'none', 1.5),
  'knot-hook': () =>
    hook(14, 6, 1.1, 1.6) +
    N('M2.5 12 C6 11.5 7.5 7 12.4 5', 1.6) +
    R(11.7, 8.4, 4.6, 3.4, 1.2, Y, 1.5) + N('M13 8.6 l-.8 3M14.8 8.6l-.8 3', 1.1),
  'knot-lure': () =>
    P('M19 4 C13.5 6.5 14 12.5 19 15.2 C24 12.5 24.5 6.5 19 4Z', 'none', 1.6) +
    R(17.2, 2.4, 3.6, 3, 1.2, Y, 1.4) +
    P('M4.5 18.5 L2 15.7 V21.3Z', '#FFFFFF', 1.5) +
    P('M4.5 18.5 C7.5 14 14 14 19 16 C14.5 21.5 8 21.5 4.5 18.5Z', '#FFFFFF') +
    D(15.5, 17, 1) + N('M19 15.2 v1.8', 1.6),
  'knot-join': () =>
    N('M1.8 9.5 H9M15 14.5 H22.2', 1.6) +
    N('M9 9.5 C11.5 9.5 12 14.5 15 14.5M9 14.5 C11.5 14.5 12 9.5 15 9.5', 1.6).replace('M9 9.5 C11.5 9.5 12 14.5 15 14.5M', 'M') +
    R(7.6, 7.6, 8.8, 8.8, 2.4, Y, 1.7) +
    N('M10.2 8.3 L12.2 15.7M13 8.3 L15 15.7', 1.2) +
    N('M10 7.6 L8.2 4M14.5 16.4 L16 20', 1.6),
  'knot-loop': () =>
    N('M8 22 L12 15 C17.5 10 17 2.8 12 2.8 C7 2.8 6.5 10 12 15 L16 22', 1.8) +
    C(12, 15, 2.3, Y, 1.6),
  'knot-dropper': () =>
    N('M14 9 V21', 1.6) +
    `<path d="M10.5 6 a3.5 3.5 0 0 1 7 0 z" fill="${Y}" stroke="${K}" stroke-width="1.6" stroke-linejoin="round"/>` +
    `<path d="M10.5 6 a3.5 3.5 0 0 0 7 0 z" fill="#FFFFFF" stroke="${K}" stroke-width="1.6" stroke-linejoin="round"/>` +
    N('M14 2.5 V2.6M14 9.5 V9', 1.6) +
    N('M14 13.5 C12 14 8 14.5 5.5 16.5 V19.5 a2 2 0 0 1 -3.6 1.2', 1.6) +
    C(14, 13.5, 1.9, Y, 1.5) +
    P('M12.4 21.4 H15.6 L14 23Z', '#9AA0A6', 1.3),
  'knot-sinker': () =>
    P('M12 7 C8.5 10.5 6 13.5 6 16.5 a6 4.8 0 0 0 12 0 C18 13.5 15.5 10.5 12 7Z', '#9AA0A6') +
    N('M9.2 13.5 C8.2 14.5 8 16 8.4 17', 1.4).replace(K, '#FFFFFF') +
    C(12, 5.2, 1.9, 'none', 1.6) +
    N('M12 1.8 V3.3', 1.6) +
    R(10, 2.7, 4, 2.8, 1.2, Y, 1.3),
  'knot-wire': () =>
    stick('M2.5 4 C8 4 9 7 12.5 8.5', 1.5, '#C9CED3') +
    N('M4.5 3.9l.5 1.6M7 4.6l.4 1.6M9.4 6.2l.8 1.4', 1.1) +
    hook(12.5, 8.8, 0.85, 1.7).replace(/<circle[^>]*\/>/, '') +
    R(10.6, 6.6, 4.2, 3.2, 1.2, Y, 1.5),
  /* Checklist */
  rod: () =>
    stick('M3 21.5 L19.5 3.5', 1.8, '#FFFFFF') +
    N('M6 16.5 l-1 -1M13.5 8.5 l-1.2 -1.1', 1.5) +
    C(9.5, 15.5, 3.4, Y, 1.7) + D(9.5, 15.5, 0.9) +
    N('M19.5 3.5 C22 9 21 13 20.5 16', 1.3) + N('M20.5 16 v1.5 a1 1 0 0 1 -1.8 .6', 1.3),
  tackle: () =>
    hook(6.5, 3.8, 1, 1.7) +
    C(17.5, 3.4, 1.4, 'none', 1.5) + R(15.7, 5.4, 3.6, 4.4, 1.4, Y, 1.5) + C(17.5, 11.8, 1.4, 'none', 1.5) +
    P('M17.5 14.6 C15.6 16.8 14.8 18.2 14.8 19.4 a2.7 2.2 0 0 0 5.4 0 C20.2 18.2 19.4 16.8 17.5 14.6Z', '#9AA0A6', 1.5),
  'bait-box': () =>
    N('M8.5 8 V5.5 h7 V8', 1.8) +
    R(2.5, 8, 19, 13, 2, '#FFFFFF') + N('M12 8 V21', 1.6) +
    N('M4.5 17 C5 12 8 16.5 9 12.5 C9.5 11 10 11.5 10 11.5', 1.6).replace(K, PINK) +
    fish(17, 15, 1.3, Y, 1.5),
  tools: () =>
    stick('M5.5 3 L8 10 L11 21', 2.2, '#C9CED3').replace('M5.5 3 L8 10 L11 21', 'M5.5 3 L8 10') +
    stick('M10.5 3 L8 10', 2.2, '#C9CED3') +
    stick('M8 10 L5 21', 2.6, Y) + stick('M8 10 L11 21', 2.6, Y) + C(8, 10, 1, K, 1) +
    N('M16.5 3 L19 12M20.5 3 L17.5 12', 1.7) +
    C(16.6, 17, 2.4, 'none', 1.6) + C(20.4, 17, 2.4, 'none', 1.6) +
    N('M17.8 14.7 L18.3 12M19.2 14.7 L18.7 12', 1.6),
  other: () =>
    N('M8 8.5 C8 4 16 4 16 8.5', 2) +
    P('M3 12 C3 9 5 8 8 8 H16 C19 8 21 9 21 12 V18.5 a2 2 0 0 1 -2 2 H5 a2 2 0 0 1 -2 -2Z', Y) +
    N('M3 13.2 H21', 1.6) + R(10, 11.8 , 4, 3, 0.8, K, 1) + N('M6.5 17 H9M15 17 H17.5', 1.5),

  /* Varios */
  'calendar-season': () =>
    R(3, 4.5, 18, 16.5, 2.2, '#FFFFFF') + P('M3 8.5V6.7a2.2 2.2 0 0 1 2.2-2.2h13.6A2.2 2.2 0 0 1 21 6.7V9H3z', K, 1.8) +
    N('M8 2.5v4M16 2.5v4', 2) +
    R(5.6, 12, 12.8, 3.4, 1, Y, 1.4) +
    `<g fill="${K}"><circle cx="7" cy="18.3" r="0.9"/><circle cx="11" cy="18.3" r="0.9"/><circle cx="15" cy="18.3" r="0.9"/><circle cx="19" cy="18.3" r="0.0"/></g>`,
  clock: () =>
    C(12, 12, 9, '#FFFFFF') + `<path d="M12 12 V3.6 A8.4 8.4 0 0 1 18 6Z" fill="${Y}"/>` +
    N('M12 6.5V12l4 2.4') + N('M12 3.3v1.2M20.7 12h-1.2M12 20.7v-1.2M3.3 12h1.2', 1.4) + D(12, 12, 1.2),
  ruler: () =>
    G('rotate(-40 12 12)',
      R(1.5, 8, 21, 8, 1.5, Y) + N('M5 8v3.5M8.5 8v2.5M12 8v3.5M15.5 8v2.5M19 8v3.5', 1.5)),
  scale: () =>
    P('M3.5 21 V12 a2 2 0 0 1 2 -2 H18.5 a2 2 0 0 1 2 2 V21Z', '#FFFFFF') +
    N('M4 10 L6 7.5 H18 L20 10', 1.8) +
    `<path d="M7.5 17.5 a4.5 4.5 0 0 1 9 0z" fill="${Y}" stroke="${K}" stroke-width="1.6" stroke-linejoin="round"/>` +
    N('M12 17.5 L14 14.2', 1.6) + N('M12 3.5 V7.5 M8 5 H16', 1.8),
  camera: () =>
    N('M8.5 6.5 L10 4.2 H14 L15.5 6.5', 1.8) +
    R(2.5, 6.5, 19, 14, 2.4, '#FFFFFF') + C(12, 13.5, 4.3, Y, 1.8) + C(12, 13.5, 1.5, '#FFFFFF', 1.3) +
    N('M5 9.5 h2', 1.6),
  pin: () =>
    P('M12 22 C12 22 19 15.4 19 9.6 A7 7 0 0 0 5 9.6 C5 15.4 12 22 12 22Z', Y, 1.9) + C(12, 9.6, 2.6, '#FFFFFF', 1.7),
  star: () =>
    P('M12 2.8 L14.8 8.7 L21.2 9.5 L16.5 13.9 L17.8 20.3 L12 17.1 L6.2 20.3 L7.5 13.9 L2.8 9.5 L9.2 8.7Z', Y, 1.9),
  wind: () =>
    N('M3 9 H14 a3 3 0 1 0 -3 -3', 1.9).replace(K, K) +
    N('M3 14 H18 a3 3 0 1 1 -3 3', 1.9) +
    N('M3 18.5 H8', 1.9) +
    `<circle cx="11" cy="6" r="0.01" fill="${Y}"/>` +
    C(18.5, 8.5, 1.5, Y, 1.4),
  pressure: () =>
    C(12, 12, 9, '#FFFFFF') +
    `<path d="M5.2 15.6 A7 7 0 0 1 18.8 15.6" fill="none" stroke="${Y}" stroke-width="2.6" stroke-linecap="round"/>` +
    N('M12 12 L15.8 7.6', 2) + C(12, 12, 1.5, K, 1) + N('M7 7.5l1 1M12 4.8v1.4M17 7.5l-1 1', 1.4),
  drop: () =>
    cloud(-1, '#FFFFFF') +
    `<g fill="${WATER}" stroke="${K}" stroke-width="1.4" stroke-linejoin="round"><path d="M8 17.5 q1.6 2.2 0 3.6 q-1.6 -1.4 0 -3.6z"/><path d="M12.5 17.5 q1.6 2.2 0 3.6 q-1.6 -1.4 0 -3.6z"/><path d="M17 17.5 q1.6 2.2 0 3.6 q-1.6 -1.4 0 -3.6z"/></g>`,
  moon: () =>
    P('M15.5 3 a9 9 0 1 0 5.5 14.2 A7.6 7.6 0 0 1 15.5 3z', Y) +
    `<path d="M19.5 4v3M18 5.5h3" stroke="${K}" stroke-width="1.6" stroke-linecap="round"/>`,
  'water-temp': () =>
    `<path d="M2 16q2.5 -1.6 5 0t5 0t5 0 t5 0 V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" fill="${WATER}"/>` +
    N('M2 16q2.5 -1.6 5 0t5 0t5 0t5 0 M2 16v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3', 1.7) +
    `<path d="M8.5 3.5a2 2 0 0 1 4 0v8.2a3.4 3.4 0 1 1-4 0z" fill="#FFFFFF" stroke="${K}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<circle cx="10.5" cy="14.4" r="1.6" fill="${Y}"/>` + N('M10.5 7.5v7', 1.8) + N('M15 5h3M15 8h2', 1.5),
  fish: () =>
    P('M1.8 12 C5 7.6 13 7 18 9.6 L22.2 7 L21.2 12 L22.2 17 L18 14.4 C13 17 5 16.4 1.8 12Z', Y, 1.7) +
    D(6, 11, 1) + N('M2 12.2 L6.5 12.8', 1.3) + N('M11 10.4q1.6 1.8 0 3.6M14.5 10.6q1.4 1.5 0 3', 1.3),
  plus: () =>
    C(12, 12, 9.2, Y, 1.9) + N('M12 7v10M7 12h10', 2.6),
};

export const GLYPHS = Object.keys(ICONS);

export function glyph(name, size = 28) {
  const f = ICONS[name];
  if (!f) return '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${f()}</svg>`;
}
