// Step-by-step knot drawings, drawn in code (no third-party images).
// Main line in black, tag end (or the second line) in orange, movement in red.
// Every drawing is a 320 x 170 schematic; crossings are shown with a white gap.

const K = '#0B0B0B'; // main line
const O = '#E07800'; // tag end / other line
const R = '#C8102E'; // movement
const G = '#6B6B66'; // metal
const B = '#1D5FA8'; // water

export const KNOT_KEY = [
  { color: K, label: 'Línea principal' },
  { color: O, label: 'Punta' },
  { color: R, label: 'Movimiento' },
];

const KEYS = {
  join: [{ color: K, label: 'Una línea' }, { color: O, label: 'La otra línea' }, { color: R, label: 'Movimiento' }],
  stop: [{ color: K, label: 'Línea' }, { color: O, label: 'Hilo del tope' }, { color: R, label: 'Movimiento' }],
  wire: [{ color: K, label: 'Alambre' }, { color: O, label: 'Punta del alambre' }, { color: R, label: 'Movimiento' }],
};

const swatch = (body) => `<svg viewBox="0 0 30 14" width="30" height="14" aria-hidden="true">${body}</svg>`;

/** Key for knots drawn with the step system: each entry carries a small drawing. */
const STEP_KEY = [
  { label: 'Línea principal', svg: swatch(`<path d="M2 7 H28" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`) },
  { label: 'Pasos anteriores', svg: swatch(`<path d="M2 7 H28" stroke="#A3A39C" stroke-width="5" stroke-linecap="round"/>`) },
  { label: 'Este paso', svg: swatch(`<path d="M2 7 H28" stroke="${O}" stroke-width="5" stroke-linecap="round"/>`) },
  { label: 'Punta', svg: swatch(`<path d="M2 7 H18" stroke="${O}" stroke-width="5" stroke-linecap="round"/><circle cx="22" cy="7" r="5" fill="#F5F5F2" stroke="${O}" stroke-width="3"/>`) },
  { label: 'Pasar la punta', svg: swatch(`<path d="M2 7 H20" stroke="${R}" stroke-width="2.5" stroke-dasharray="5 3"/><path d="M20 2 L28 7 L20 12z" fill="${R}"/>`) },
  { label: 'Tirar para apretar', svg: swatch(`<path d="M2 7 H17" stroke="${R}" stroke-width="5"/><path d="M16 1 L29 7 L16 13z" fill="${R}"/>`) },
];

export function knotKey(id) {
  if (id === 'clinch') return STEP_KEY;
  if (['sangre', 'doble-uni', 'cirujano', 'albright', 'fg'].includes(id)) return KEYS.join;
  if (id === 'tope') return KEYS.stop;
  if (id === 'haywire' || id === 'manguito') return KEYS.wire;
  return KNOT_KEY;
}

/* ---------- Drawing kit ---------- */

/** A line with a white edge, so it reads as passing over what was drawn before. */
const line = (d, color = K, w = 5) =>
  `<path d="${d}" fill="none" stroke="#F5F5F2" stroke-width="${w + 5}" stroke-linecap="round" stroke-linejoin="round"/>`
  + `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const tag = (d, w = 5) => line(d, O, w);
const arrow = (d) => `<path d="${d}" fill="none" stroke="${R}" stroke-width="3" stroke-linecap="round" stroke-dasharray="7 5" marker-end="url(#kah)"/>`;
const text = (x, y, s, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Barlow, sans-serif" font-weight="700" font-size="15" fill="#55554F">${s}</text>`;
const ring = (x, y, r = 10) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${G}" stroke-width="5"/>`;
/** Front half of a ring, drawn after a line to show it passing through. */
const ringFront = (x, y, r = 10) => `<path d="M${x} ${y - r} A${r} ${r} 0 0 1 ${x} ${y + r}" fill="none" stroke="${G}" stroke-width="5"/>`;

/** Hook seen from the side with its eye at (x, y), shank to the right. */
function hook(x, y) {
  return `${ring(x, y, 9)}<path d="M${x + 9} ${y} H${x + 70} a22 22 0 0 1 0 44 H${x + 52} l8 -9" fill="none" stroke="${G}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/** Diagonal wraps over a band from x0 to x1 between yTop and yBot. */
function wraps(x0, x1, yTop, yBot, n, color = O) {
  const step = (x1 - x0) / n;
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + i * step;
    s += line(`M${x} ${yBot + 7} L${x + step * 0.7} ${yTop - 7}`, color, 4.5);
  }
  return s;
}

/** Overhand knot blob at (x, y). */
const blob = (x, y, color = O) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="8" fill="${color}" stroke="#0B0B0B" stroke-width="1.5"/>`;

/** Compact finished knot (tight wraps) between x0 and x1 on a line at y. */
function tight(x0, x1, y, color = O) {
  let s = `<rect x="${x0}" y="${y - 9}" width="${x1 - x0}" height="18" rx="6" fill="${color}" stroke="#0B0B0B" stroke-width="1.5"/>`;
  for (let x = x0 + 6; x < x1 - 3; x += 6) s += `<path d="M${x} ${y - 8} l-3 16" stroke="#0B0B0B" stroke-width="1" opacity="0.6"/>`;
  return s;
}

const drop = (x, y) => `<path d="M${x} ${y - 14} C${x + 9} ${y - 2} ${x + 9} ${y + 8} ${x} ${y + 8} C${x - 9} ${y + 8} ${x - 9} ${y - 2} ${x} ${y - 14}Z" fill="${B}"/>${text(x + 14, y + 4, 'mojar', 'start')}`;

function scissors(x, y) {
  return `<g transform="translate(${x} ${y})"><circle cx="-9" cy="12" r="6" fill="none" stroke="${R}" stroke-width="3"/><circle cx="9" cy="12" r="6" fill="none" stroke="${R}" stroke-width="3"/><path d="M-5 7 L10 -16 M5 7 L-10 -16" stroke="${R}" stroke-width="3" stroke-linecap="round"/></g>`;
}

/** Spool of the reel seen from the side. */
function spool(x, y) {
  return `<rect x="${x - 22}" y="${y - 50}" width="44" height="100" rx="6" fill="#E4E4DE" stroke="${G}" stroke-width="3"/><rect x="${x - 32}" y="${y - 58}" width="64" height="10" rx="4" fill="${G}"/><rect x="${x - 32}" y="${y + 48}" width="64" height="10" rx="4" fill="${G}"/>`;
}

/** Soft lure with its eye at (x, y), body to the right. */
function lure(x, y) {
  return `${ring(x, y, 8)}<path d="M${x + 8} ${y} C${x + 22} ${y - 20} ${x + 58} ${y - 18} ${x + 70} ${y - 4} L${x + 82} ${y - 13} L${x + 79} ${y} L${x + 82} ${y + 13} L${x + 70} ${y + 4} C${x + 58} ${y + 18} ${x + 22} ${y + 20} ${x + 8} ${y}Z" fill="#FFC400" stroke="#0B0B0B" stroke-width="2"/><circle cx="${x + 24}" cy="${y - 4}" r="3" fill="#0B0B0B"/>`;
}

function sleeve(x, y, crushed = false) {
  return `<rect x="${x - 18}" y="${y - (crushed ? 7 : 11)}" width="36" height="${crushed ? 14 : 22}" rx="4" fill="#C9C9C2" stroke="${G}" stroke-width="2.5"/>`;
}

const draw = (body) => `<svg viewBox="0 0 330 170" width="330" height="170" role="img" aria-hidden="true"><defs><marker id="kah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="${R}"/></marker><marker id="kph" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="3.4" markerHeight="3.4" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="${R}"/></marker></defs>${body}</svg>`;

/* ---------- Knots ---------- */

// Line arriving from the left to an eye at (230, 85).
const EYE_X = 230;
const EYE_Y = 85;

/* ---------- Step system (first used on Clinch mejorado) ----------
   Black: the main line. Gray: what earlier steps already placed. Orange: what moves
   in this step. The tip ends in a hollow ring. Dashed red arrow: where the tip goes.
   Solid thick red arrow: pull to tighten. Over/under is shown by drawing order: a line
   drawn later with a paper-colored edge passes over what was drawn before. */

const D = '#A3A39C'; // already placed in earlier steps
const PAPER = '#F5F5F2';

/** A line with no paper edge: used for the half of a wrap that goes behind. */
const bare = (d, color, w = 5) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

/** Hollow ring at the free end of the line. */
const tip = (x, y, color = O) => `<circle cx="${x}" cy="${y}" r="6" fill="${PAPER}" stroke="${color}" stroke-width="3.5"/>`;

/** Pull to tighten: a solid, thick arrow (different from the dashed movement arrow). */
const pull = (d) => `<path d="${d}" fill="none" stroke="${R}" stroke-width="6" stroke-linecap="butt" marker-end="url(#kph)"/>`;

/** Wraps around a horizontal line at y, from xRight leftwards, n turns of width d and
    half-height a. Returns the halves behind and in front of the line, to draw before
    and after it. The front halves only get a paper edge in their middle, where they
    cross the line, so the turns stay joined at the ends. */
function coil(xRight, y, n, d, a, color) {
  let back = '';
  let front = '';
  for (let i = 0; i < n; i++) {
    const x = xRight - i * d;
    back += bare(`M${x} ${y + a} L${x - d / 2} ${y - a}`, color);
    const fx0 = x - d / 2;
    const fx1 = x - d;
    front += bare(`M${fx0 - d * 0.15} ${y - a * 0.4} L${fx1 + d * 0.15} ${y + a * 0.4}`, PAPER, 8);
    front += bare(`M${fx0} ${y - a} L${fx1} ${y + a}`, color);
  }
  return { back, front };
}

// Clinch mejorado. Main line along y = 85 to the hook eye at (230, 85).
// Path of the tip, piece by piece (each piece is drawn orange in its step, gray after):
const CL = {
  eye: 'M221 85 H232 C250 85 250 110 228 110 H198 C190 110 186 104 184 98', // through the eye and back
  eyeShort: 'M221 85 H232 C250 85 250 110 228 110 H165', // step 1 ends here
  tail2: 'M100 98 C96 104 92 110 88 114', // loose end after the wraps
  // Step 3: down and around, then up through the small loop next to the eye.
  small: 'M100 98 C80 112 84 142 120 142 H180 C198 142 205 128 205 100',
  smallUp: 'M205 100 C206 90 207 75 207 58',
  // Step 4: over the top and down through the big loop.
  bigOver: 'M207 58 C207 36 154 36 151 58 L148 128',
  bigUnder: 'M148 128 L147 158',
};
const clWraps = (color) => coil(180, 85, 5, 16, 13, color);

const CLINCH = [
  // 1. Through the eye.
  hook(EYE_X, EYE_Y) + line('M10 85 H221') + line(CL.eyeShort, O) + ringFront(EYE_X, EYE_Y, 9)
    + tip(165, 110) + arrow('M150 132 H100'),
  // 2. Wraps around the main line.
  (() => {
    const w = clWraps(O);
    return hook(EYE_X, EYE_Y) + w.back + line('M10 85 H221') + line(CL.eye, D) + w.front + line(CL.tail2, O)
      + ringFront(EYE_X, EYE_Y, 9) + tip(88, 114) + arrow('M190 52 C170 36 128 36 110 54') + text(140, 150, '5 a 7 vueltas');
  })(),
  // 3. Through the small loop next to the eye.
  (() => {
    const w = clWraps(D);
    return hook(EYE_X, EYE_Y) + w.back + line(CL.small, O) + line('M10 85 H221') + line(CL.eye, D) + w.front
      + line(CL.smallUp, O) + ringFront(EYE_X, EYE_Y, 9) + tip(207, 58) + arrow('M110 160 H190')
      + text(130, 30, 'por el lazo chico, junto al ojo');
  })(),
  // 4. Back down through the big loop that formed.
  (() => {
    const w = clWraps(D);
    return hook(EYE_X, EYE_Y) + w.back + line(CL.bigUnder, O) + line(CL.small, D) + line('M10 85 H221') + line(CL.eye, D)
      + w.front + line(CL.smallUp, D) + line(CL.bigOver, O) + ringFront(EYE_X, EYE_Y, 9) + tip(147, 158)
      + arrow('M236 54 C236 22 192 14 176 24') + text(16, 30, 'y por el lazo grande', 'start');
  })(),
  // 5. Wet, pull and trim.
  (() => {
    const w = coil(212, 85, 5, 8, 9, D);
    return hook(EYE_X, EYE_Y) + w.back + line('M10 85 H221') + line('M212 94 C218 100 224 98 221 85', D) + w.front
      + line('M172 94 L160 104', D) + ringFront(EYE_X, EYE_Y, 9)
      + pull('M120 58 H40') + text(80, 46, 'tirar') + drop(70, 130) + scissors(150, 124);
  })(),
];

const STEPS = {
  carrete: [
    spool(70, 85) + line('M310 60 H120 C80 60 52 70 52 85') + tag('M52 85 C52 100 80 110 120 110 H230') + arrow('M240 132 H300') + text(70, 160, 'bobina'),
    spool(70, 85) + line('M310 60 H120 C80 60 52 70 52 85') + tag('M52 85 C52 100 80 110 120 110 H175 C200 110 205 75 185 70 C165 65 160 100 185 100 H215') + arrow('M168 40 C190 30 210 40 205 55'),
    spool(70, 85) + line('M310 60 H120 C80 60 52 70 52 85') + tag('M52 85 C52 100 80 110 120 110 H170 C190 110 190 66 175 66 C160 66 165 100 185 100 H222') + blob(232, 100),
    spool(70, 85) + line('M310 60 H130 C90 60 52 70 52 85') + tag('M52 85 C52 100 90 108 108 100 C120 95 120 70 106 70') + blob(118, 98) + arrow('M240 40 H305') + drop(270, 120),
    spool(70, 85) + line('M310 60 H120 C80 60 52 70 52 85') + tag('M52 85 C52 100 90 108 100 98 L112 104') + blob(98, 96) + scissors(132, 120),
  ],
  uni: [
    hook(EYE_X, EYE_Y) + line('M10 85 H221') + tag('M221 85 H230 C240 85 240 60 220 60 H120 C90 60 90 85 110 85') + ringFront(EYE_X, EYE_Y, 9) + arrow('M120 30 C100 32 92 42 96 52'),
    hook(EYE_X, EYE_Y) + line('M10 85 H221') + tag('M221 85 H230 C240 85 240 60 220 60 H120 C95 60 92 82 110 86') + wraps(120, 200, 60, 85, 5) + ringFront(EYE_X, EYE_Y, 9) + text(160, 130, '5 o 6 vueltas'),
    hook(EYE_X, EYE_Y) + line('M10 85 H221') + tag('M221 85 C236 85 236 72 210 72 H150') + tight(150, 196, 80) + tag('M150 80 C120 80 100 100 70 110') + arrow('M90 130 L40 140') + drop(260, 140),
    hook(EYE_X, EYE_Y) + line('M10 85 H221') + tight(190, 218, 85) + tag('M190 85 C170 86 160 100 140 110') + arrow('M60 50 H15') + text(110, 40, 'el nudo baja al ojo'),
    hook(EYE_X, EYE_Y) + line('M10 85 H219') + tight(196, 219, 85) + tag('M196 86 L182 94') + scissors(170, 116),
  ],
  palomar: [
    hook(EYE_X, EYE_Y) + line('M10 76 H226 C246 76 246 94 226 94') + tag('M226 94 H10') + ringFront(EYE_X, EYE_Y, 9) + text(110, 50, 'línea doblada, 15 cm') + arrow('M180 130 H230'),
    hook(EYE_X, EYE_Y) + line('M10 76 H120 C150 76 150 120 175 120') + tag('M10 94 H118 C140 94 160 60 190 60 H226') + line('M175 120 C200 120 248 100 248 85 C248 70 236 60 226 60', K) + ringFront(EYE_X, EYE_Y, 9) + text(110, 150, 'nudo simple flojo'),
    hook(EYE_X, EYE_Y) + line('M10 76 H120 C140 76 150 112 170 112 C190 112 270 140 300 110 C318 92 300 70 280 66') + tag('M10 94 H118 C140 94 160 66 190 66 H226') + ringFront(EYE_X, EYE_Y, 9) + arrow('M300 150 C320 120 318 90 300 74') + text(130, 162, 'pasar el anzuelo por el lazo'),
    hook(EYE_X, EYE_Y) + line('M10 78 H200') + tag('M10 94 H160 C180 94 195 90 200 88') + tight(198, 222, 85, K) + arrow('M100 40 H20') + arrow('M100 130 H20') + drop(150, 128),
    hook(EYE_X, EYE_Y) + line('M10 85 H222') + tight(198, 222, 85, K) + tag('M198 92 L180 104') + scissors(168, 124),
  ],
  clinch: CLINCH,
  snell: [
    `<path d="M100 60 H250 a24 24 0 0 1 0 48 H230 l8 -10" fill="none" stroke="${G}" stroke-width="6" stroke-linecap="round"/><rect x="92" y="52" width="10" height="16" fill="${G}"/>` + line('M10 60 H96') + line('M96 60 H200 C230 60 230 82 200 82 H110', K) + tag('M110 82 H40') + text(80, 130, 'paleta'),
    `<path d="M100 60 H250 a24 24 0 0 1 0 48 H230 l8 -10" fill="none" stroke="${G}" stroke-width="6" stroke-linecap="round"/><rect x="92" y="52" width="10" height="16" fill="${G}"/>` + line('M10 60 H96') + line('M96 62 H200 C230 62 230 84 200 84', K) + wraps(108, 196, 60, 72, 8) + tag('M196 74 L210 120') + text(150, 140, '7 a 10 vueltas hacia la curva'),
    `<path d="M100 60 H250 a24 24 0 0 1 0 48 H230 l8 -10" fill="none" stroke="${G}" stroke-width="6" stroke-linecap="round"/><rect x="92" y="52" width="10" height="16" fill="${G}"/>` + line('M10 60 H96') + tight(110, 196, 62) + line('M196 62 C210 62 214 70 206 72', K) + arrow('M70 100 H20') + text(140, 120, 'sostener las vueltas y tirar'),
    `<path d="M100 60 H250 a24 24 0 0 1 0 48 H230 l8 -10" fill="none" stroke="${G}" stroke-width="6" stroke-linecap="round"/><rect x="92" y="52" width="10" height="16" fill="${G}"/>` + line('M10 60 H110') + tight(110, 190, 62) + tag('M190 66 L206 80') + scissors(222, 104),
  ],
  rapala: [
    line('M10 85 H90 C110 85 110 60 125 60 C145 60 140 100 120 100 C105 100 112 85 140 85') + tag('M140 85 H230') + text(165, 140, 'nudo simple flojo a 10 cm de la punta'),
    lure(240, 85) + line('M10 85 H90 C110 85 110 60 125 60 C145 60 140 100 120 100 C105 100 112 85 132 85') + tag('M132 85 H232 M232 85 C250 85 250 108 230 108 H150 C130 108 124 88 122 70') + ringFront(240, 85, 8) + arrow('M200 140 H140'),
    lure(240, 85) + line('M10 85 H90 C110 85 110 60 125 60 C145 60 140 100 120 100 C105 100 112 85 132 85') + tag('M132 85 H232 M232 85 C250 85 250 108 230 108 H150') + wraps(40, 88, 85, 85, 3) + tag('M150 108 C110 108 100 96 92 88') + ringFront(240, 85, 8) + text(64, 130, '3 vueltas'),
    lure(240, 85) + line('M10 85 H90 C110 85 110 60 125 60 C145 60 140 100 120 100 C105 100 112 85 132 85') + tag('M132 85 H232 M232 85 C250 85 250 108 230 108 H150') + wraps(40, 88, 85, 85, 3) + tag('M88 92 C100 120 130 120 140 110 C150 98 150 80 160 92') + ringFront(240, 85, 8) + arrow('M170 50 C150 40 130 50 130 62'),
    lure(240, 85) + line('M10 85 H150') + tight(150, 196, 85) + line('M196 85 C210 78 222 78 232 85', O) + ringFront(240, 85, 8) + tag('M150 92 L136 104') + scissors(124, 126) + text(214, 140, 'lazo chico libre'),
  ],
  'lazo-perfecto': [
    line('M10 100 H140 C190 100 190 40 150 40 C120 40 120 70 150 80') + tag('M150 80 H230') + text(150, 150, 'lazo por detrás de la línea'),
    line('M10 100 H140 C190 100 190 40 150 40 C120 40 120 70 150 80') + tag('M150 80 H200 C230 80 230 120 200 120 C175 120 175 90 196 86') + text(150, 160, 'segundo lazo por delante'),
    line('M10 100 H140 C190 100 190 40 150 40 C120 40 120 70 150 80') + tag('M150 80 H200 C230 80 230 120 200 120 C175 120 175 90 196 86 C210 86 180 68 160 64') + arrow('M240 50 C220 40 196 48 190 58'),
    line('M10 100 H140 C160 100 172 90 172 80') + tag('M172 80 C172 60 150 50 140 60') + line('M168 82 C200 60 280 40 300 85 C310 120 230 120 200 92', O) + arrow('M260 150 C290 140 304 120 300 100') + text(130, 150, 'pasar el 2.º lazo por el 1.º'),
    line('M10 85 H150') + tight(150, 186, 85, O) + line('M186 78 C230 40 300 50 300 85 C300 120 230 130 186 92', O) + arrow('M300 30 H315') + arrow('M60 40 H15'),
  ],
  sangre: [
    line('M10 70 H200') + line('M120 100 H310', O) + text(160, 140, 'cruzar las puntas 10 cm'),
    line('M10 70 H200') + line('M120 100 H310', O) + wraps(150, 196, 70, 100, 5, K) + line('M196 70 C206 70 210 60 200 50', K) + text(170, 140, '5 o 6 vueltas'),
    line('M10 70 H150') + line('M120 100 H310', O) + wraps(150, 196, 70, 100, 5, K) + line('M150 70 C140 70 140 85 160 85 C150 92 146 100 150 120', K) + arrow('M120 40 C130 50 140 65 150 80'),
    line('M10 70 H150') + line('M150 100 H310', O) + wraps(150, 196, 70, 100, 5, K) + wraps(104, 150, 70, 100, 5, O) + text(150, 150, 'repetir con la otra punta, al revés'),
    line('M10 85 H135') + tight(135, 205, 85, K) + line('M205 85 H310', O) + arrow('M80 40 H20') + arrow('M240 40 H300') + scissors(170, 130),
  ],
  'doble-uni': [
    line('M10 70 H230') + line('M90 100 H310', O) + text(160, 140, 'superponer las puntas'),
    line('M10 70 H230') + line('M90 100 H310', O) + wraps(170, 225, 70, 100, 5, K) + text(200, 140, 'un Uni con una punta'),
    line('M10 70 H230') + line('M90 100 H310', O) + wraps(170, 225, 70, 100, 5, K) + wraps(95, 150, 70, 100, 5, O) + text(122, 140, 'otro Uni con la otra'),
    line('M10 85 H140') + tight(140, 168, 85, O) + tight(170, 198, 85, K) + line('M198 85 H310', O) + arrow('M80 40 H20') + arrow('M240 40 H300'),
    line('M10 85 H140') + tight(140, 168, 85, O) + tight(170, 198, 85, K) + line('M198 85 H310', O) + scissors(150, 128) + scissors(190, 128),
  ],
  cirujano: [
    line('M10 70 H230') + line('M80 82 H310', O) + text(160, 140, 'superponer 15 cm'),
    line('M10 70 H110 C150 70 150 140 180 130 C210 120 190 70 160 76 H230') + line('M80 82 H112 C150 82 160 150 190 138 C218 126 196 82 168 88 H310', O) + arrow('M240 130 C220 150 200 150 190 140') + text(100, 150, 'nudo simple con las dos'),
    line('M10 70 H110 C150 70 150 140 180 130 C210 120 190 70 160 76 H230') + line('M80 82 H112 C150 82 160 150 190 138 C218 126 196 82 168 88 H310', O) + arrow('M100 30 C150 20 190 40 180 60') + text(240, 30, 'pasar otra vez'),
    line('M10 70 H140') + line('M180 76 H260') + tight(140, 180, 76, O) + line('M60 82 H140', O) + line('M180 82 H310', O) + arrow('M60 40 H15') + arrow('M260 40 H305') + drop(160, 130),
  ],
  albright: [
    line('M10 70 H200 C230 70 230 100 200 100 H120') + text(140, 140, 'lazo en la línea gruesa'),
    line('M10 70 H200 C230 70 230 100 200 100 H120') + line('M310 85 H150', O) + arrow('M300 120 H200'),
    line('M10 70 H200 C230 70 230 100 200 100 H120') + line('M310 85 H200', O) + wraps(130, 200, 70, 100, 10, O) + text(165, 140, '10 vueltas hacia la curva'),
    line('M10 70 H200 C230 70 230 100 200 100 H120') + line('M310 85 H200', O) + wraps(130, 200, 70, 100, 10, O) + line('M130 90 C110 92 100 110 120 120', O) + arrow('M100 140 C110 150 130 150 140 140') + text(230, 140, 'sale por el mismo lado'),
    line('M10 85 H130') + tight(130, 205, 85, O) + line('M205 85 H310', O) + drop(60, 130) + scissors(118, 128),
  ],
  fg: [
    line('M10 85 H310') + arrow('M60 50 H15') + arrow('M260 50 H305') + text(160, 130, 'trenzado bien tenso'),
    line('M10 85 H310') + line('M100 110 C120 50 130 120 150 60 C170 120 180 50 200 110 C220 60 230 120 250 70', O) + text(160, 150, '20 cruces, por arriba y por abajo'),
    line('M10 85 H310') + tight(110, 220, 85, O) + wraps(220, 260, 85, 85, 4, K) + text(240, 130, 'nudos simples'),
    line('M10 85 H310') + tight(110, 220, 85, O) + tight(220, 260, 85, K) + scissors(105, 125) + text(230, 130, 'medios nudos y cortar'),
  ],
  'lazo-cirujano': [
    line('M10 85 H200 C240 85 240 110 200 110 H140', O) + text(150, 150, 'doblar la punta'),
    line('M10 85 H110 C140 85 150 140 180 130 C210 120 200 80 170 85 H210 C240 85 240 110 210 110') + line('M20 98 H112 C150 98 160 150 190 140', O) + text(160, 155, 'nudo simple con la línea doble'),
    line('M10 85 H110 C140 85 150 140 180 130 C210 120 200 80 170 85 H210 C240 85 240 110 210 110') + line('M20 98 H112 C150 98 160 150 190 140', O) + arrow('M250 40 C220 30 190 40 180 60') + text(80, 40, 'pasar el lazo otra vez'),
    line('M10 85 H140') + tight(140, 175, 88, K) + line('M175 85 C220 50 300 60 300 90 C300 120 220 130 175 92') + line('M140 96 L120 110', O) + arrow('M60 40 H15') + arrow('M290 30 H315') + drop(220, 150),
  ],
  bimini: [
    line('M10 75 H260 C300 75 300 105 260 105 H60', O) + text(160, 140, 'lazo largo de unos 50 cm'),
    line('M10 75 H80') + line('M40 105 H80', O) + wraps(80, 200, 75, 105, 12, K) + line('M200 75 H260 C300 75 300 105 260 105 H200') + arrow('M240 30 C270 20 300 40 296 60') + text(140, 140, 'girar unas 20 vueltas'),
    line('M10 70 H80') + line('M40 100 H80', O) + tight(80, 190, 85, K) + line('M190 80 C230 40 300 40 300 85 C300 130 230 130 190 90') + arrow('M240 160 L250 140') + arrow('M240 10 L250 30') + text(110, 140, 'abrir el lazo'),
    line('M10 70 H80') + line('M40 110 C60 110 70 100 80 96', O) + tight(80, 190, 85, K) + wraps(80, 130, 85, 85, 5, O) + line('M190 80 C230 40 300 40 300 85 C300 130 230 130 190 90') + text(110, 140, 'la punta se enrolla sola'),
    line('M10 85 H80') + tight(80, 130, 85, O) + tight(130, 190, 85, K) + line('M190 80 C230 40 300 40 300 85 C300 130 230 130 190 90') + text(105, 130, 'remate'),
  ],
  brazolada: [
    line('M10 110 H120 C130 40 190 40 200 110 H310') + text(160, 150, 'formar un lazo amplio'),
    line('M10 110 H120 C130 40 190 40 200 110 H310') + wraps(122, 198, 104, 116, 5, K) + `<circle cx="160" cy="60" r="7" fill="#F2C9A4" stroke="#0B0B0B" stroke-width="1.5"/>` + text(160, 150, '5 vueltas, lazo abierto con un dedo'),
    line('M10 110 H120 C130 40 190 40 200 110 H310') + wraps(122, 198, 104, 116, 5, K) + arrow('M160 50 C160 80 160 90 160 106') + text(250, 50, 'pasar por el centro'),
    line('M10 110 H140') + tight(140, 180, 110, K) + line('M180 110 H310') + line('M160 104 C150 70 170 60 160 40', K) + arrow('M70 70 H15') + arrow('M250 70 H305') + drop(240, 150),
    line('M10 110 H140') + tight(140, 180, 110, K) + line('M180 110 H310') + line('M160 104 C150 50 170 40 160 20', K) + text(160, 150, 'el lazo sale en ángulo recto'),
  ],
  tope: [
    line('M10 85 H310') + line('M100 70 H200 C220 70 220 100 200 100 H100', O) + text(160, 140, 'hilo de 15 cm formando un lazo'),
    line('M10 85 H310') + line('M100 70 H200 C220 70 220 100 200 100 H160', O) + wraps(110, 190, 70, 100, 5, O) + text(150, 140, '4 o 5 vueltas'),
    line('M10 85 H310') + line('M100 70 H200 C220 70 220 100 200 100 H160', O) + wraps(110, 190, 70, 100, 5, O) + arrow('M100 130 C120 120 140 110 150 100'),
    line('M10 85 H310') + tight(140, 170, 85, O) + line('M140 80 L110 60', O) + line('M170 90 L200 110', O) + arrow('M100 40 L80 30') + arrow('M210 130 L230 140'),
    line('M10 85 H310') + tight(140, 170, 85, O) + line('M140 80 L128 72 M170 90 L182 98', O) + `<circle cx="196" cy="85" r="7" fill="${R}" stroke="#0B0B0B" stroke-width="1.5"/><path d="M230 85 C230 66 270 66 270 85 C270 104 230 104 230 85Z" fill="#FFC400" stroke="#0B0B0B" stroke-width="2"/>` + text(155, 130, 'tope · perla · boya'),
  ],
  haywire: [
    hook(EYE_X, EYE_Y) + line('M10 85 H221', K, 4) + tag('M221 85 H230 C244 85 244 105 220 105 H140', 4) + ringFront(EYE_X, EYE_Y, 9) + text(140, 140, 'pasar y doblar'),
    hook(EYE_X, EYE_Y) + line('M10 85 H130', K, 4) + tag('M221 85 H230 C244 85 244 105 220 105', 4) + line('M130 85 C150 105 160 65 180 85 C200 105 210 70 221 85', K, 4) + line('M130 100 C150 70 160 110 180 90 C200 70 210 105 220 105', O, 4) + ringFront(EYE_X, EYE_Y, 9) + text(170, 140, '4 o 5 vueltas en X'),
    hook(EYE_X, EYE_Y) + line('M10 85 H221', K, 4) + tight(140, 221, 85, K) + wraps(80, 140, 85, 85, 5, O) + ringFront(EYE_X, EYE_Y, 9) + text(110, 130, '5 vueltas apretadas'),
    hook(EYE_X, EYE_Y) + line('M10 85 H221', K, 4) + tight(80, 221, 85, K) + tag('M80 85 V50 H50', 4) + arrow('M30 70 C20 40 50 20 70 34') + ringFront(EYE_X, EYE_Y, 9) + text(150, 140, 'girar la manija hasta que se corte'),
  ],
  manguito: [
    hook(EYE_X, EYE_Y) + sleeve(170, 85) + line('M10 80 H221', K, 4) + tag('M221 80 C246 80 246 100 220 100 H140', 4) + ringFront(EYE_X, EYE_Y, 9) + text(125, 145, 'manguito, ojo y de nuevo el manguito'),
    hook(EYE_X, EYE_Y) + line('M10 80 H200 C214 80 214 74 221 80', K, 4) + tag('M221 80 C246 80 246 100 220 100 C214 100 210 92 200 92 H140', 4) + sleeve(170, 86) + ringFront(EYE_X, EYE_Y, 9) + text(150, 140, 'dejar un lazo chico'),
    hook(EYE_X, EYE_Y) + line('M10 80 H200 C214 80 214 74 221 80', K, 4) + tag('M221 80 C246 80 246 100 220 100 C214 100 210 92 200 92 H140', 4) + sleeve(170, 86, true) + `<path d="M150 50 L165 74 M190 50 L175 74 M150 122 L165 98 M190 122 L175 98" stroke="${R}" stroke-width="4" stroke-linecap="round"/>` + ringFront(EYE_X, EYE_Y, 9) + text(80, 140, 'aplastar con la pinza'),
    hook(EYE_X, EYE_Y) + line('M10 80 H200 C214 80 214 74 221 80', K, 4) + tag('M221 80 C246 80 246 100 220 100 C214 100 210 92 200 92 H150', 4) + sleeve(170, 86, true) + ringFront(EYE_X, EYE_Y, 9) + scissors(140, 120),
  ],
};

export function knotStepSvg(id, i) {
  const body = STEPS[id]?.[i];
  return body ? draw(body) : '';
}

export function knotStepCount(id) {
  return STEPS[id]?.length ?? 0;
}
