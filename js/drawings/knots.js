// Step-by-step knot drawings, drawn in code (no third-party images).
// Every drawing is a 330 x 170 schematic. The system (see docs/spec.md, Nudos):
//  - Color says what something is. Lines: green is the line, orange the other line
//    (in knots that join two), gray is metal (hooks, sinkers, steel wire, sleeves),
//    black is tools. Red is movement, blue is force, light blue is water.
//  - For each line, the shade says what happens to it in this step: dark, it stays
//    still; strong, it moves now; light, it was placed in an earlier step.
//  - The tip ends in a diamond. Dashed red arrow: where what moves goes. Blue: pull
//    (one thick arrow), hold (two arrows squeezing) and open (two arrows apart).
//  - Over/under comes from drawing order: what is drawn later covers what is below.
//    Only where two lines of the same shade cross does the one on top get an edge in
//    the paper color, so you can tell which goes over. The edge belongs to the
//    crossing, not to the step: it stays in later steps.

const L1 = { still: '#1E5A38', move: '#1FA34A', done: '#A9DBB5' }; // the line
const L2 = { still: '#8A4300', move: '#F07C00', done: '#F7CC9E' }; // the other line
const WIRE = { still: '#5E5E58', move: '#1F1F1C', done: '#C9C9C3' }; // steel wire
const METAL = '#6B6B66';
const TOOL = '#0B0B0B';
const R = '#C8102E'; // movement
const F = '#1F6FD6'; // force
const WATER = '#5BB4E5';
const YELLOW = '#FFC400';
const PAPER = '#F5F5F2';
const INK = '#55554F';

/* ---------- Drawing kit ---------- */

const path = (d, color, w = 5) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const edge = (d, w = 5) => `<path d="${d}" fill="none" stroke="${PAPER}" stroke-width="${w + 5}" stroke-linecap="butt" stroke-linejoin="round"/>`;
/** A line. Drawn later, it covers what is below. */
const seg = (d, color, w = 5) => path(d, color, w);
/** A line crossing over another of the same shade: gets the paper edge. */
const over = (d, color, w = 5) => edge(d, w) + path(d, color, w);
/** Doubled line: two strands side by side; its rounded end reads as the bend. */
const dbl = (d, color) => path(d, color, 12) + path(d, PAPER, 4);
const dblOver = (d, color) => edge(d, 12) + dbl(d, color);

const text = (x, y, s, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Barlow, sans-serif" font-weight="700" font-size="15" fill="${INK}">${s}</text>`;

/** Free end of a line at (x, y), pointing at angle a (degrees): a small diamond. */
const tip = (x, y, a, color) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M-3 0 L6 -7 L15 0 L6 7Z" fill="${color}"/></g>`;

/** Movement: thin dashed red arrow along d. */
const arrow = (d) => `<path d="${d}" fill="none" stroke="${R}" stroke-width="3" stroke-linecap="round" stroke-dasharray="7 5" marker-end="url(#kah)"/>`;
/** Pull: thick solid blue arrow out of the line being pulled. */
const pull = (d) => `<path d="${d}" fill="none" stroke="${F}" stroke-width="6" stroke-linecap="butt" marker-end="url(#kph)"/>`;
/** Two short blue arrows on both sides of (x, y), rotated by rot: pointing in (hold) or out (open). */
function pair(x, y, rot, out, kind) {
  const one = (s) => out
    ? `<path d="M${x} ${y - s * 10} V${y - s * 20}" stroke="${F}" stroke-width="5"/><path d="M${x - 8} ${y - s * 20} L${x + 8} ${y - s * 20} L${x} ${y - s * 33}Z" fill="${F}"/>`
    : `<path d="M${x} ${y - s * 34} V${y - s * 22}" stroke="${F}" stroke-width="5"/><path d="M${x - 8} ${y - s * 22} L${x + 8} ${y - s * 22} L${x} ${y - s * 9}Z" fill="${F}"/>`;
  return `<g data-k="${kind}" transform="rotate(${rot} ${x} ${y})">${one(1)}${one(-1)}</g>`;
}
const hold = (x, y, rot = 0) => pair(x, y, rot, false, 'hold');
const open = (x, y, rot = 0) => pair(x, y, rot, true, 'open');

/** Wraps around a line along y, n turns of width d and half-height a, starting at x0 and
    going left (dir -1) or right (dir 1). The halves behind go before the line, the halves
    in front after it. end is where the last turn finishes, at the bottom. */
function coil(x0, y, n, d, a, color, dir = -1) {
  let back = '';
  let front = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + dir * i * d;
    back += path(`M${x} ${y + a} L${x + dir * d / 2} ${y - a}`, color);
    front += path(`M${x + dir * d / 2} ${y - a} L${x + dir * d} ${y + a}`, color);
  }
  return { back, front, end: [x0 + dir * n * d, y + a] };
}

/** Two strands twisted together between x0 and x1, swapping between y1 and y2 n times. */
function twist(x0, x1, y1, y2, n, cA, cB, w = 4) {
  const step = (x1 - x0) / n;
  let s = '';
  for (let i = 0; i < n; i++) {
    const xa = x0 + i * step;
    const xb = xa + step;
    const [ya, yb] = i % 2 ? [y2, y1] : [y1, y2];
    const a = path(`M${xa} ${ya} C${xa + step / 2} ${ya} ${xa + step / 2} ${yb} ${xb} ${yb}`, cA, w);
    const b = path(`M${xa} ${yb} C${xa + step / 2} ${yb} ${xa + step / 2} ${ya} ${xb} ${ya}`, cB, w);
    s += i % 2 ? a + b : b + a;
  }
  return s;
}

/** Moves and scales the points of a path drawn around (0, 0). */
function place(d, x, y, s = 1, flip = 1) {
  return d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, px, py) => `${+(x + flip * s * px).toFixed(1)} ${+(y + s * py).toFixed(1)}`);
}

/** Overhand knot around (x, y): the line comes in at (x - 34s, y) and leaves at
    (x + 36s, y - 14s); flip = -1 mirrors it. st draws a piece, ov a piece that crosses
    over the same line. */
function overhand(x, y, color, { s = 1, flip = 1, st = seg, ov = over } = {}) {
  const p = (d) => place(d, x, y, s, flip);
  return st(p('M0 10 C7 11 11 4 11 -6'), color)
    + st(p('M-34 0 C-14 0 4 2 14 -8 C22 -16 16 -32 0 -32 C-16 -32 -20 -18 -14 -8'), color)
    + ov(p('M-14 -8 C-10 0 -6 8 0 10'), color)
    + ov(p('M11 -6 C12 -12 20 -14 36 -14'), color);
}

const ring = (x, y, r = 9) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${METAL}" stroke-width="5"/>`;
/** Front half of a ring, drawn after a line to show it going through. */
const ringFront = (x, y, r = 9) => `<path d="M${x} ${y - r} A${r} ${r} 0 0 1 ${x} ${y + r}" fill="none" stroke="${METAL}" stroke-width="5"/>`;

/** Hook seen from the side with its eye at (x, y), shank to the right. */
const hook = (x, y) => `${ring(x, y)}<path d="M${x + 9} ${y} H${x + 70} a22 22 0 0 1 0 44 H${x + 52} l8 -9" fill="none" stroke="${METAL}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
/** Hook without eye (paddle at the left end of the shank, at y). */
const paddleHook = (y) => `<path d="M100 ${y} H250 a24 24 0 0 1 0 48 H230 l8 -10" fill="none" stroke="${METAL}" stroke-width="6" stroke-linecap="round"/><rect x="92" y="${y - 8}" width="10" height="16" fill="${METAL}"/>`;

const drop = (x, y) => `<path d="M${x} ${y - 14} C${x + 9} ${y - 2} ${x + 9} ${y + 8} ${x} ${y + 8} C${x - 9} ${y + 8} ${x - 9} ${y - 2} ${x} ${y - 14}Z" fill="${WATER}"/>${text(x + 14, y + 4, 'mojar', 'start')}`;

const scissors = (x, y) => `<g transform="translate(${x} ${y})"><circle cx="-9" cy="12" r="6" fill="none" stroke="${TOOL}" stroke-width="3"/><circle cx="9" cy="12" r="6" fill="none" stroke="${TOOL}" stroke-width="3"/><path d="M-5 7 L10 -16 M5 7 L-10 -16" stroke="${TOOL}" stroke-width="3" stroke-linecap="round"/></g>`;

/** Spool of the reel seen from the side. */
const spool = (x, y) => `<rect x="${x - 22}" y="${y - 50}" width="44" height="100" rx="6" fill="#E4E4DE" stroke="${METAL}" stroke-width="3"/><rect x="${x - 32}" y="${y - 58}" width="64" height="10" rx="4" fill="${METAL}"/><rect x="${x - 32}" y="${y + 48}" width="64" height="10" rx="4" fill="${METAL}"/>`;

/** Soft lure with its eye at (x, y), body to the right. */
const lure = (x, y) => `${ring(x, y, 8)}<path d="M${x + 8} ${y} C${x + 22} ${y - 20} ${x + 58} ${y - 18} ${x + 70} ${y - 4} L${x + 82} ${y - 13} L${x + 79} ${y} L${x + 82} ${y + 13} L${x + 70} ${y + 4} C${x + 58} ${y + 18} ${x + 22} ${y + 20} ${x + 8} ${y}Z" fill="${YELLOW}" stroke="#0B0B0B" stroke-width="2"/><circle cx="${x + 24}" cy="${y - 4}" r="3" fill="#0B0B0B"/>`;

/** Crimp sleeve, see-through so the wire inside shows. */
const sleeve = (x, y, crushed = false) => `<rect x="${x - 18}" y="${y - (crushed ? 8 : 13)}" width="36" height="${crushed ? 16 : 26}" rx="4" fill="#C9C9C2" fill-opacity="0.55" stroke="${METAL}" stroke-width="2.5"/>`;

const bead = (x, y) => `<circle cx="${x}" cy="${y}" r="8" fill="#FFFFFF" stroke="#0B0B0B" stroke-width="2"/>`;
const float = (x, y) => `<path d="M${x - 22} ${y} C${x - 22} ${y - 16} ${x + 22} ${y - 16} ${x + 22} ${y}Z" fill="${YELLOW}" stroke="#0B0B0B" stroke-width="2"/><path d="M${x - 22} ${y} C${x - 22} ${y + 16} ${x + 22} ${y + 16} ${x + 22} ${y}Z" fill="#FFFFFF" stroke="#0B0B0B" stroke-width="2"/>`;

const draw = (body) => `<svg viewBox="0 0 330 170" width="330" height="170" role="img" aria-hidden="true"><defs><marker id="kah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="${R}"/></marker><marker id="kph" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="3.4" markerHeight="3.4" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="${F}"/></marker></defs>${body}</svg>`;

/** Runs a step builder: lets each step lay out its pieces in drawing order. */
const st = (f) => f();

/* ---------- Knots ---------- */

// Hook eye at (230, 85); the line comes from the left along y = 85.
const EX = 230;
const EY = 85;
const H = hook(EX, EY);
const RF = ringFront(EX, EY);
/** Through the eye and back below it, clear of the shank, to x. */
const eyeBack = (x, y = 99) => `M230 85 C238 85 242 ${y} 228 ${y} H${x}`;

/* Nudo de carrete */
const CA = {
  around: 'M310 60 H120 C80 60 52 70 52 85',
  back: 'M52 85 C52 100 80 110 120 110 H160',
  behind: 'M160 110 H178 C194 110 198 84 196 60 C195 48 186 42 176 44', // around the line, behind it
  front: 'M176 44 C162 48 160 70 176 80 C190 88 204 96 221 96',
};
const CARRETE = [
  spool(70, 85) + seg(CA.around, L1.still) + seg('M52 85 C52 100 80 110 120 110 H222', L1.move) + tip(222, 110, 0, L1.move)
    + arrow('M236 132 H300') + text(70, 160, 'bobina'),
  spool(70, 85) + seg(CA.back, L1.done) + seg(CA.behind, L1.move) + seg(CA.around, L1.still) + over(CA.front, L1.move)
    + tip(221, 96, 0, L1.move) + arrow('M236 34 C218 18 190 20 180 30') + text(205, 150, 'nudo simple alrededor de la línea'),
  spool(70, 85) + seg(CA.back, L1.done) + seg(CA.behind, L1.done) + seg(CA.around, L1.still) + over(CA.front, L1.done)
    + overhand(255, 96, L1.move) + tip(291, 82, -20, L1.move) + text(215, 150, 'otro nudo simple en la punta'),
  st(() => {
    const k = coil(126, 60, 3, 7, 9, L1.done);
    return spool(70, 85) + k.back + seg('M268 60 H120 C80 60 52 70 52 85', L1.still) + seg('M52 85 C52 100 80 110 104 108 C112 104 112 80 106 69', L1.done)
      + k.front + overhand(128, 96, L1.done, { s: 0.45 }) + seg('M106 69 C110 80 112 92 113 96', L1.done)
      + pull('M276 60 H310') + text(290, 46, 'tirar') + arrow('M226 34 H140') + text(184, 24, 'el nudo baja a la bobina') + drop(240, 130);
  }),
  st(() => {
    const k = coil(126, 60, 3, 7, 9, L1.done);
    return spool(70, 85) + k.back + seg('M310 60 H120 C80 60 52 70 52 85', L1.still) + seg('M52 85 C52 100 80 110 104 108 C112 104 112 80 106 69', L1.done)
      + k.front + overhand(128, 96, L1.done, { s: 0.45 }) + seg('M106 69 C110 80 112 92 113 96', L1.done) + scissors(170, 120);
  }),
];

/* Uni: the tip comes back below the line (y = 99) and makes a loop over both. */
const UN = {
  loop: `${eyeBack(110)} C86 99 84 58 110 56 H186`,
  down: 'M186 56 C192 70 190 96 180 108',
};
const unWraps = (c) => coil(180, 92, 5, 12, 16, c);
const UNI = [
  H + seg('M10 85 H230', L1.still) + seg(`${eyeBack(110)} C86 99 84 58 110 56 H170`, L1.move) + RF + tip(170, 56, 0, L1.move) + arrow('M120 34 H170'),
  st(() => {
    const w = unWraps(L1.move);
    return H + w.back + seg('M10 85 H230', L1.still) + seg(UN.loop, L1.done) + seg(UN.down, L1.move) + w.front
      + seg('M120 108 C114 118 108 124 100 130', L1.move) + RF + tip(100, 130, 135, L1.move)
      + arrow('M200 32 C176 18 140 18 124 34') + text(160, 158, '5 o 6 vueltas, por dentro del lazo');
  }),
  st(() => {
    const w = coil(186, 92, 6, 6, 13, L1.done);
    return H + w.back + seg('M10 85 H230', L1.still) + seg(eyeBack(150), L1.done) + w.front
      + seg('M150 105 C134 112 116 120 92 128', L1.move) + RF + tip(92, 128, 160, L1.move)
      + pull('M80 132 L40 146') + text(120, 156, 'tirar de la punta', 'start') + drop(60, 40);
  }),
  st(() => {
    const w = coil(222, 92, 5, 5, 12, L1.done);
    return H + w.back + seg('M70 85 H230', L1.still) + seg(eyeBack(197), L1.done) + w.front + seg('M197 104 L182 118', L1.done) + RF
      + pull('M62 85 H22') + text(42, 70, 'tirar') + arrow('M130 50 H190') + text(150, 36, 'el nudo baja al ojo')
      + hold(276, 85) + text(276, 40, 'sostener');
  }),
  st(() => {
    const w = coil(222, 92, 5, 5, 12, L1.done);
    return H + w.back + seg('M10 85 H230', L1.still) + seg(eyeBack(197), L1.done) + w.front + seg('M197 104 L182 118', L1.done) + RF + scissors(168, 128);
  }),
];

/* Palomar: the doubled line goes through the eye; its bend makes the loop. */
const PA = {
  standing: 'M80 85 H222',
  eye: 'M222 85 H234 C254 85 256 112 236 118 H200',
  behind: 'M200 118 C176 118 168 100 166 85 C164 66 150 58 138 62', // around the doubled line, behind it
  front: 'M138 62 C122 66 120 92 136 104 C146 112 160 116 172 124',
  bend: 'M172 124 C156 134 160 160 184 160 C208 160 212 136 192 126',
};
const paStart = (cMain, cTag) => seg('M10 81 H82', cMain) + seg('M82 89 H44', cTag) + tip(44, 89, 180, cTag);
const PALOMAR = [
  H + paStart(L1.still, L1.move) + dbl('M80 85 H234 C254 85 258 110 246 124 C240 132 230 130 228 122', L1.move) + RF
    + arrow('M140 130 H210') + text(130, 40, 'línea doblada, unos 15 cm'),
  H + paStart(L1.still, L1.done) + dbl(PA.behind, L1.move) + dbl(PA.standing, L1.done) + dbl(PA.eye, L1.done) + RF
    + dblOver(PA.front, L1.move) + seg(PA.bend, L1.move) + text(70, 150, 'nudo simple flojo'),
  H + paStart(L1.still, L1.done) + dbl(PA.behind, L1.done) + dbl(PA.standing, L1.done) + dbl(PA.eye, L1.done) + RF
    + dblOver(PA.front, L1.done) + seg(PA.bend, L1.done) + arrow('M304 136 C300 168 236 170 204 148') + text(120, 30, 'pasar el anzuelo por el lazo'),
  st(() => {
    const w = coil(222, 85, 4, 6, 12, L1.done);
    return H + w.back + seg('M70 81 H222', L1.still) + seg('M150 89 H222', L1.done) + w.front + tip(150, 89, 180, L1.done) + RF
      + pull('M62 81 H22') + pull('M142 92 L108 108') + text(60, 130, 'tirar de las dos') + hold(276, 85) + text(276, 40, 'sostener') + drop(150, 40);
  }),
  st(() => {
    const w = coil(222, 85, 4, 6, 12, L1.done);
    return H + w.back + seg('M10 81 H222', L1.still) + seg('M190 89 H222', L1.done) + w.front + RF + scissors(176, 116);
  }),
];

/* Clinch mejorado. */
const CL = {
  eye: 'M230 85 C236 85 240 94 238 102 C236 110 226 110 214 110 H198 C190 110 182 104 180 98',
  eyeShort: 'M230 85 C236 85 240 94 238 102 C236 110 226 110 214 110 H165',
  tail2: 'M100 98 C96 104 92 110 88 114',
  small: 'M100 98 C80 112 84 142 120 142 H180 C198 142 205 128 205 100', // down and around, then up through the small loop
  smallUp: 'M205 100 C206 90 207 75 207 58',
  bigOver: 'M207 58 C207 36 154 36 151 58 L148 128', // over the top and down through the big loop
  bigUnder: 'M148 128 L147 152',
};
const clWraps = (c) => coil(180, 85, 5, 16, 13, c);
const CLINCH = [
  H + seg('M10 85 H230', L1.still) + seg(CL.eyeShort, L1.move) + RF + tip(165, 110, 180, L1.move) + arrow('M150 132 H100'),
  st(() => {
    const w = clWraps(L1.move);
    return H + w.back + seg('M10 85 H230', L1.still) + seg(CL.eye, L1.done) + w.front + seg(CL.tail2, L1.move)
      + RF + tip(88, 114, 135, L1.move) + arrow('M190 52 C170 36 128 36 110 54') + text(140, 150, '5 a 7 vueltas');
  }),
  st(() => {
    const w = clWraps(L1.done);
    return H + w.back + seg(CL.small, L1.move) + seg('M10 85 H230', L1.still) + over(CL.eye, L1.done) + w.front
      + seg(CL.smallUp, L1.move) + RF + tip(207, 58, -90, L1.move) + arrow('M110 160 H190') + text(130, 30, 'por el lazo chico, junto al ojo');
  }),
  st(() => {
    const w = clWraps(L1.done);
    return H + w.back + seg(CL.bigUnder, L1.move) + over(CL.small, L1.done) + seg('M10 85 H230', L1.still) + over(CL.eye, L1.done)
      + w.front + seg(CL.smallUp, L1.done) + over(CL.bigOver, L1.move) + RF + tip(147, 152, 90, L1.move)
      + arrow('M236 54 C236 22 192 14 176 24') + text(16, 30, 'y por el lazo grande', 'start');
  }),
  st(() => {
    const w = coil(212, 85, 5, 8, 9, L1.done);
    return H + w.back + seg('M80 85 H230', L1.still) + seg('M230 85 C236 85 240 94 237 100 C233 106 220 102 212 94', L1.done) + w.front
      + seg('M172 94 L160 104', L1.done) + RF + hold(276, 85) + text(276, 40, 'sostener')
      + pull('M70 85 H28') + text(50, 64, 'tirar') + drop(70, 130) + scissors(150, 124);
  }),
];

/* Snell: hook without eye, shank along y = 60. */
const SNELL = [
  paddleHook(60) + seg('M10 66 H100', L1.still) + seg('M100 66 H206 C228 66 230 96 206 96 H124', L1.move) + tip(124, 96, 180, L1.move)
    + text(80, 130, 'paleta') + text(240, 150, 'lazo hacia la curva'),
  st(() => {
    const w = coil(108, 63, 8, 11, 12, L1.move, 1);
    return paddleHook(60) + w.back + seg('M10 66 H100', L1.still) + seg('M100 66 H200', L1.done) + w.front
      + seg('M196 75 C214 90 232 106 214 122 C200 132 186 116 196 104', L1.move) + arrow('M110 30 H200') + text(140, 150, '7 a 10 vueltas hacia la curva');
  }),
  st(() => {
    const w = coil(108, 63, 8, 11, 12, L1.done, 1);
    return paddleHook(60) + w.back + seg('M62 66 H100', L1.still) + seg('M100 66 H200', L1.done) + w.front
      + seg('M196 75 C204 84 210 90 206 98', L1.done) + hold(152, 63) + pull('M54 66 H24') + text(160, 150, 'sostener las vueltas y tirar');
  }),
  st(() => {
    const w = coil(108, 63, 8, 10, 11, L1.done, 1);
    return paddleHook(60) + w.back + seg('M10 66 H100', L1.still) + seg('M100 66 H190', L1.done) + w.front
      + seg('M190 72 L204 86', L1.done) + scissors(222, 104);
  }),
];

/* Rapala: lure eye at (240, 85); a loose overhand at x = 110. */
const RA = {
  toEye: 'M146 71 C170 64 200 85 240 85',
  back: 'M240 85 C250 85 254 102 240 104 C220 108 150 110 128 100 C116 94 110 84 110 70',
  toWraps: 'M110 70 C104 54 84 54 74 70',
  out: 'M34 97 C40 130 100 134 124 118 C140 108 150 100 160 96',
};
const raWraps = (c) => coil(70, 85, 3, 12, 12, c);
const RAPALA = [
  seg('M10 85 H76', L1.still) + overhand(110, 85, L1.move) + seg('M146 71 C164 66 184 70 204 76', L1.move) + tip(204, 76, 15, L1.move)
    + lure(240, 85) + text(150, 150, 'nudo simple flojo, a 10 cm de la punta'),
  lure(240, 85) + seg('M10 85 H76', L1.still) + overhand(110, 85, L1.done) + seg(RA.toEye, L1.move) + seg(RA.back, L1.move)
    + ringFront(240, 85, 8) + tip(110, 70, -95, L1.move) + arrow('M210 140 H140') + text(165, 160, 'volver por dentro del nudo simple'),
  st(() => {
    const w = raWraps(L1.move);
    return lure(240, 85) + w.back + seg('M10 85 H76', L1.still) + w.front + overhand(110, 85, L1.done) + seg(RA.toEye, L1.done) + seg(RA.back, L1.done)
      + seg(RA.toWraps, L1.move) + seg('M34 97 C30 106 28 112 30 120', L1.move) + ringFront(240, 85, 8) + tip(30, 120, 95, L1.move)
      + text(52, 150, '3 vueltas');
  }),
  st(() => {
    const w = raWraps(L1.done);
    return lure(240, 85) + w.back + seg('M10 85 H76', L1.still) + w.front + seg(RA.out, L1.move) + overhand(110, 85, L1.done) + seg(RA.toEye, L1.done)
      + seg(RA.back, L1.done) + seg(RA.toWraps, L1.done) + ringFront(240, 85, 8) + tip(160, 96, -20, L1.move)
      + arrow('M60 150 C100 162 150 150 170 124') + text(130, 30, 'por detrás del nudo y por el lazo');
  }),
  st(() => {
    const w = coil(196, 85, 5, 8, 10, L1.done);
    return lure(240, 85) + w.back + seg('M70 85 H196', L1.still) + w.front + seg('M196 85 C210 76 222 76 232 85', L1.done)
      + ringFront(240, 85, 8) + seg('M154 95 L140 106', L1.done) + pull('M62 85 H22') + text(42, 70, 'tirar') + drop(80, 40)
      + scissors(126, 126) + text(214, 140, 'lazo chico libre');
  }),
];

/* Lazo perfecto. */
const LP = {
  loop1: 'M140 100 C190 100 190 40 150 40 C120 40 120 70 150 80',
  tail1: 'M150 80 H200',
  loop2: 'M200 80 C230 80 230 120 200 120 C175 120 175 90 196 86',
};
const LAZO_PERFECTO = [
  seg('M150 80 H222', L1.move) + seg('M10 100 H140', L1.still) + over(LP.loop1, L1.move) + tip(222, 80, 0, L1.move)
    + text(150, 150, 'lazo, con la punta por detrás'),
  seg(LP.tail1, L1.done) + seg('M10 100 H140', L1.still) + over(LP.loop1, L1.done) + seg(LP.loop2, L1.move) + tip(196, 86, -20, L1.move)
    + text(150, 158, 'segundo lazo, por delante'),
  seg(LP.tail1, L1.done) + seg('M10 100 H140', L1.still) + over(LP.loop1, L1.done) + seg(LP.loop2, L1.done)
    + seg('M196 86 C210 86 180 68 160 64', L1.move) + tip(160, 64, 190, L1.move) + arrow('M240 50 C220 40 196 48 190 58') + text(150, 158, 'la punta, entre los dos lazos'),
  seg('M10 100 H140', L1.still) + seg('M140 100 C160 100 172 90 172 80 C172 60 150 50 140 60', L1.done) + tip(140, 60, 200, L1.done)
    + seg('M168 82 C200 60 280 40 300 85 C310 120 230 120 200 92', L1.move) + arrow('M260 150 C290 140 304 120 300 100')
    + text(120, 150, 'pasar el 2.º lazo por el 1.º'),
  st(() => {
    const w = coil(186, 85, 5, 7, 10, L1.done);
    return w.back + seg('M62 85 H186', L1.still) + w.front + seg('M186 78 C230 40 280 50 280 85 C280 120 230 130 186 92', L1.done)
      + seg('M151 94 L140 106', L1.done) + pull('M54 85 H24') + pull('M286 85 H306') + scissors(126, 124);
  }),
];

/* Sangre: line 1 (green) from the left at y = 78, line 2 (orange) from the right at y = 92. */
const SG = {
  l1Out: 'M130 78 H210 C216 78 218 90 210 101',
  l2Out: 'M130 92 H56 C46 92 44 98 50 101',
};
const sgW1 = (c) => coil(210, 85, 5, 12, 16, c);
const sgW2 = (c) => coil(50, 85, 5, 12, 16, c, 1);
const SANGRE = [
  seg('M10 78 H120', L1.still) + seg('M120 78 H210', L1.move) + tip(210, 78, 0, L1.move)
    + seg('M320 92 H210', L2.still) + seg('M210 92 H120', L2.move) + tip(120, 92, 180, L2.move) + text(165, 140, 'cruzar las puntas unos 10 cm'),
  st(() => {
    const w = sgW1(L1.move);
    return w.back + seg('M320 92 H130', L2.still) + seg('M130 92 H70', L2.still) + tip(70, 92, 180, L2.still) + seg('M10 78 H130', L1.still)
      + seg(SG.l1Out, L1.move) + w.front + seg('M150 101 L142 112', L1.move) + tip(142, 112, 125, L1.move) + text(180, 150, '5 o 6 vueltas');
  }),
  st(() => {
    const w = sgW1(L1.done);
    return w.back + seg('M320 92 H130', L2.still) + seg('M130 92 H70', L2.still) + tip(70, 92, 180, L2.still) + seg('M10 78 H130', L1.still)
      + seg(SG.l1Out, L1.done) + w.front + seg('M150 101 C140 112 128 106 128 88', L1.move) + tip(128, 88, -90, L1.move)
      + arrow('M110 140 C122 134 126 124 126 112') + text(210, 150, 'por el centro del cruce');
  }),
  st(() => {
    const w1 = sgW1(L1.done);
    const w2 = sgW2(L2.move);
    return w1.back + w2.back + seg('M320 92 H130', L2.still) + seg('M10 78 H130', L1.still) + seg(SG.l1Out, L1.done) + seg(SG.l2Out, L2.move)
      + w1.front + w2.front + seg('M150 101 C140 112 128 106 128 88', L1.done) + seg('M110 101 C120 108 128 104 132 90', L2.move)
      + tip(132, 88, -80, L2.move) + text(165, 150, 'la otra punta, al revés, por el mismo centro');
  }),
  st(() => {
    const a = coil(166, 85, 5, 6, 10, L1.done);
    const b = coil(134, 85, 5, 6, 10, L2.done);
    return a.back + b.back + seg('M62 82 H166', L1.still) + seg('M268 88 H104', L2.still) + a.front + b.front
      + seg('M136 95 L130 108', L1.done) + seg('M134 75 L140 62', L2.done)
      + pull('M54 82 H24') + pull('M276 88 H306') + drop(60, 140) + scissors(200, 120);
  }),
];

/* Doble uni. */
const DU = [
  seg('M10 78 H90', L1.still) + seg('M90 78 H230', L1.move) + tip(230, 78, 0, L1.move)
    + seg('M320 92 H230', L2.still) + seg('M230 92 H90', L2.move) + tip(90, 92, 180, L2.move) + text(160, 140, 'superponer las puntas'),
  st(() => {
    const w = coil(226, 85, 5, 11, 16, L1.move);
    return w.back + seg('M320 92 H90', L2.still) + tip(90, 92, 180, L2.still) + seg('M10 78 H226', L1.still) + w.front
      + seg('M171 101 L162 114', L1.move) + tip(162, 114, 125, L1.move) + text(200, 150, 'un Uni con una punta');
  }),
  st(() => {
    const a = coil(226, 85, 5, 11, 16, L1.done);
    const b = coil(94, 85, 5, 11, 16, L2.move, 1);
    return a.back + b.back + seg('M320 92 H94', L2.still) + seg('M10 78 H226', L1.still) + a.front + b.front
      + seg('M171 101 L162 114', L1.done) + seg('M149 101 L158 114', L2.move) + tip(158, 114, 55, L2.move) + text(120, 150, 'otro Uni con la otra');
  }),
  st(() => {
    const a = coil(196, 85, 5, 6, 12, L1.done);
    const b = coil(134, 85, 5, 6, 12, L2.done, 1);
    return a.back + b.back + seg('M320 90 H134', L2.still) + seg('M10 80 H196', L1.still) + a.front + b.front
      + seg('M166 97 L160 110', L1.done) + seg('M164 97 L170 110', L2.done)
      + pull('M100 50 H60') + pull('M230 50 H270') + arrow('M120 130 H150') + arrow('M210 130 H180') + text(165, 158, 'los nudos se juntan');
  }),
  st(() => {
    const a = coil(196, 85, 5, 6, 12, L1.done);
    const b = coil(134, 85, 5, 6, 12, L2.done, 1);
    return a.back + b.back + seg('M320 90 H134', L2.still) + seg('M10 80 H196', L1.still) + a.front + b.front + scissors(150, 120) + scissors(190, 120);
  }),
];

/* Cirujano: both lines tie one overhand together. */
const cjOverhand = (c1, c2) => overhand(160, 76, c1) + overhand(166, 88, c2);
const CIRUJANO = [
  seg('M10 76 H80', L1.still) + seg('M80 76 H230', L1.move) + tip(230, 76, 0, L1.move)
    + seg('M320 88 H230', L2.still) + seg('M230 88 H80', L2.move) + tip(80, 88, 180, L2.move) + text(160, 140, 'superponer unos 15 cm'),
  seg('M10 76 H126', L1.still) + seg('M320 88 H240 C222 88 212 76 202 74', L2.still) + cjOverhand(L1.move, L2.move)
    + seg('M196 62 C210 58 220 60 230 64', L1.move) + tip(230, 64, 20, L1.move) + seg('M132 88 H100', L2.move) + tip(100, 88, 180, L2.move)
    + arrow('M250 130 C226 150 196 150 186 130') + text(90, 150, 'nudo simple con las dos'),
  seg('M10 76 H126', L1.still) + seg('M320 88 H240 C222 88 212 76 202 74', L2.still) + cjOverhand(L1.done, L2.done)
    + seg('M196 62 C226 50 222 22 186 26 C156 30 150 52 170 58', L1.move) + tip(170, 58, 30, L1.move) + seg('M132 88 H100', L2.done)
    + arrow('M100 30 C130 14 170 12 196 22') + text(250, 140, 'pasar otra vez'),
  st(() => {
    const a = coil(176, 82, 6, 6, 12, L1.done);
    return a.back + seg('M62 78 H176', L1.still) + seg('M268 86 H140', L2.still) + a.front
      + seg('M176 76 L190 64', L1.done) + seg('M142 92 L128 104', L2.done)
      + pull('M54 78 H24') + pull('M276 86 H306') + drop(60, 140) + scissors(210, 120);
  }),
];

/* Albright: thick line (green) makes the loop; thin line (orange) wraps it. */
const AL = {
  loop: 'M140 70 H200 C230 70 230 100 200 100 H120',
  in: 'M232 85 H124',
};
const alWraps = (c) => coil(130, 85, 10, 7, 18, c, 1);
const ALBRIGHT = [
  seg('M10 70 H140', L1.still, 7) + seg(AL.loop, L1.move, 7) + tip(120, 100, 180, L1.move) + text(140, 140, 'lazo con la línea gruesa'),
  seg('M310 85 H232', L2.still, 4) + seg(AL.in, L2.move, 4) + seg('M10 70 H140', L1.still, 7) + seg(AL.loop, L1.done, 7)
    + tip(124, 85, 180, L2.move) + arrow('M300 120 H210') + text(140, 140, 'la fina, por dentro del lazo'),
  st(() => {
    const w = alWraps(L2.move);
    return w.back + seg('M310 85 H232', L2.still, 4) + seg(AL.in, L2.done, 4) + seg('M10 70 H140', L1.still, 7) + seg(AL.loop, L1.done, 7)
      + seg('M124 85 C118 92 122 100 130 103', L2.move, 4) + w.front + tip(200, 103, 40, L2.move) + text(165, 140, '10 vueltas hacia la curva');
  }),
  st(() => {
    const w = alWraps(L2.done);
    return w.back + seg('M310 85 H232', L2.still, 4) + seg(AL.in, L2.done, 4) + seg('M10 70 H140', L1.still, 7) + seg(AL.loop, L1.done, 7)
      + seg('M124 85 C118 92 122 100 130 103', L2.done, 4) + w.front + seg('M200 103 C214 100 220 94 236 94 H252', L2.move, 4)
      + tip(252, 94, 0, L2.move) + arrow('M230 130 H280') + text(130, 140, 'sale por el mismo lado');
  }),
  st(() => {
    const w = coil(200, 85, 10, 6, 10, L2.done);
    return w.back + seg('M62 85 H200', L1.still, 7) + seg('M310 85 H200', L2.still, 4) + w.front
      + seg('M140 92 L128 104', L1.done, 7) + seg('M200 95 L212 108', L2.done, 4) + drop(150, 40) + scissors(118, 124) + pull('M54 85 H24');
  }),
];

/* FG: braid (green) under tension, leader (orange) crossed over and under it. */
function fgCrossSplit(c) {
  let under = '';
  let top = '';
  for (let i = 0; i < 10; i++) {
    const x = 250 - i * 15;
    const [y0, y1] = i % 2 ? [60, 110] : [110, 60];
    const p = seg(`M${x} ${y0} C${x - 8} ${y0} ${x - 7} ${y1} ${x - 15} ${y1}`, c, 6);
    if (i % 2) under += p; else top += p;
  }
  return { under, top };
}
const FG = [
  seg('M62 85 H268', L1.still, 3) + pull('M54 85 H24') + pull('M276 85 H306') + text(165, 130, 'trenzado bien tenso'),
  st(() => {
    const z = fgCrossSplit(L2.move);
    return seg('M320 110 H250', L2.still, 6) + z.under + seg('M10 85 H320', L1.still, 3) + z.top + tip(100, 110, 180, L2.move)
      + text(165, 150, '20 cruces, por arriba y por abajo');
  }),
  st(() => {
    const t = coil(220, 85, 14, 8, 9, L1.done);
    const h = coil(262, 85, 4, 10, 12, L1.move);
    return t.back + h.back + seg('M110 85 H320', L2.still, 6) + seg('M10 85 H110', L1.still, 3) + t.front + h.front
      + seg('M222 97 L232 112', L1.move, 3) + tip(232, 112, 55, L1.move) + text(150, 140, 'nudos simples alternados');
  }),
  st(() => {
    const t = coil(220, 85, 14, 8, 9, L1.done);
    const h = coil(262, 85, 4, 10, 12, L1.done);
    const r = coil(100, 85, 4, 10, 9, L1.move);
    return t.back + h.back + r.back + seg('M110 85 H320', L2.still, 6) + seg('M10 85 H110', L1.still, 3) + t.front + h.front + r.front
      + seg('M222 97 L232 112', L1.done, 3) + scissors(232, 120) + text(110, 140, 'medios nudos y cortar');
  }),
];

/* Lazo de cirujano: the doubled end ties an overhand; its bend is the loop. */
const lcStart = (cMain, cTag) => seg('M10 81 H126', cMain) + seg('M126 89 H90', cTag) + tip(90, 89, 180, cTag);
const lcOverhand = (c) => overhand(160, 85, c, { st: dbl, ov: dblOver });
const LAZO_CIRUJANO = [
  seg('M10 85 H120', L1.still) + seg('M120 85 H200 C240 85 240 110 200 110 H140', L1.move) + tip(140, 110, 180, L1.move) + text(150, 150, 'doblar la punta'),
  lcStart(L1.still, L1.done) + lcOverhand(L1.move) + dbl('M196 71 C226 60 252 80 240 100', L1.move)
    + arrow('M110 140 C150 150 180 140 190 120') + text(110, 30, 'nudo simple con la línea doble'),
  lcStart(L1.still, L1.done) + lcOverhand(L1.done) + dbl('M196 71 C226 60 252 80 240 100', L1.done)
    + dbl('M238 104 C216 136 150 120 150 60 C152 40 176 36 186 50', L1.move) + arrow('M250 40 C220 26 196 30 186 38')
    + text(84, 150, 'pasar el lazo otra vez'),
  st(() => {
    const w = coil(176, 85, 5, 7, 12, L1.done);
    return w.back + seg('M70 81 H176', L1.still) + seg('M140 89 H176', L1.done) + w.front
      + seg('M176 85 C220 50 278 60 278 88 C278 116 220 126 176 90', L1.done) + tip(140, 89, 180, L1.done)
      + pull('M62 81 H22') + pull('M284 88 H306') + drop(220, 150) + scissors(128, 118);
  }),
];

/* Bimini. */
const BI_LOOP = 'M190 80 C230 40 300 40 300 85 C300 130 230 130 190 90';
const BIMINI = [
  seg('M10 75 H60', L1.still) + seg('M60 75 H260 C300 75 300 105 260 105 H60', L1.move) + tip(60, 105, 180, L1.move)
    + text(160, 140, 'lazo largo de unos 50 cm'),
  seg('M10 75 H80', L1.still) + seg('M80 105 H50', L1.done) + tip(50, 105, 180, L1.done)
    + twist(80, 200, 75, 105, 12, L1.move, L1.move) + seg('M200 75 H260 C300 75 300 105 260 105 H200', L1.move)
    + arrow('M262 44 C290 28 318 50 306 72') + text(140, 140, 'girar unas 20 vueltas'),
  seg('M10 75 H80', L1.still) + seg('M80 100 H50', L1.done) + tip(50, 100, 180, L1.done)
    + twist(80, 190, 78, 92, 14, L1.done, L1.done) + seg(BI_LOOP, L1.move) + open(260, 85, 0) + text(110, 140, 'abrir el lazo'),
  st(() => {
    const w = coil(80, 85, 6, 9, 13, L1.move, 1);
    return w.back + seg('M10 75 H80', L1.still) + twist(80, 190, 78, 92, 14, L1.done, L1.done) + w.front
      + seg('M40 112 C56 112 70 104 80 98', L1.move) + seg(BI_LOOP, L1.done) + arrow('M70 140 H130') + text(110, 160, 'la punta se enrolla sola');
  }),
  st(() => {
    const w = coil(80, 85, 6, 9, 13, L1.done, 1);
    const r = coil(80, 85, 3, 8, 13, L1.move);
    return w.back + r.back + seg('M10 75 H80', L1.still) + twist(80, 190, 78, 92, 14, L1.done, L1.done) + w.front + r.front
      + seg(BI_LOOP, L1.done) + seg('M56 98 L46 112', L1.move) + tip(46, 112, 125, L1.move) + text(110, 140, 'remate: medio nudo y vueltas');
  }),
];

/* Nudo de brazolada. */
const BZ_LOOP = 'M120 110 C130 40 190 40 200 110';
const BRAZOLADA = [
  seg('M10 110 H120', L1.still) + seg('M200 110 H310', L1.still) + seg(BZ_LOOP, L1.move) + text(160, 150, 'formar un lazo amplio'),
  st(() => {
    const w = coil(198, 110, 5, 15, 12, L1.move);
    return w.back + seg('M10 110 H310', L1.still) + w.front + seg('M126 98 C138 44 182 44 192 98', L1.done)
      + open(160, 70, 90) + text(160, 152, '5 vueltas, con el lazo abierto');
  }),
  st(() => {
    const w = coil(198, 110, 5, 15, 12, L1.done);
    return w.back + seg('M10 110 H310', L1.still) + w.front + seg('M126 98 C138 44 182 44 192 98', L1.move)
      + arrow('M160 52 C160 80 160 90 160 106') + text(200, 30, 'pasar el lazo por el centro');
  }),
  st(() => {
    const a = coil(158, 110, 4, 5, 9, L1.done);
    const b = coil(182, 110, 4, 5, 9, L1.done);
    return a.back + b.back + seg('M70 110 H250', L1.still) + a.front + b.front + seg('M158 104 C146 60 174 60 162 104', L1.done)
      + pull('M64 110 H22') + pull('M256 110 H296') + drop(240, 50);
  }),
  st(() => {
    const a = coil(158, 110, 4, 5, 9, L1.done);
    const b = coil(182, 110, 4, 5, 9, L1.done);
    return a.back + b.back + seg('M10 110 H310', L1.still) + a.front + b.front + seg('M158 104 C142 20 178 20 162 104', L1.done)
      + text(160, 150, 'el lazo sale en ángulo recto');
  }),
];

/* Tope corredizo: line (green) and the stop thread (orange). */
const TP_LOOP = 'M100 70 H200 C220 70 220 100 200 100 H100';
const tpWraps = (c) => coil(120, 85, 5, 14, 18, c, 1);
const TOPE = [
  seg('M10 85 H310', L1.still) + seg(TP_LOOP, L2.move) + tip(100, 70, 180, L2.move) + tip(100, 100, 180, L2.move) + text(160, 140, 'hilo de 15 cm formando un lazo'),
  st(() => {
    const w = tpWraps(L2.move);
    return w.back + seg('M10 85 H310', L1.still) + seg(TP_LOOP, L2.done) + tip(100, 70, 180, L2.done) + w.front
      + seg('M100 100 C108 104 114 104 120 103', L2.move) + tip(190, 103, 0, L2.move) + text(150, 140, '4 o 5 vueltas');
  }),
  st(() => {
    const w = tpWraps(L2.done);
    return w.back + seg('M10 85 H310', L1.still) + seg(TP_LOOP, L2.done) + tip(100, 70, 180, L2.done) + w.front
      + seg('M190 103 C204 110 214 100 214 86', L2.move) + tip(214, 84, -90, L2.move) + arrow('M100 130 C140 136 180 126 200 112')
      + text(110, 150, 'pasar la punta por el lazo');
  }),
  st(() => {
    const w = coil(170, 85, 5, 6, 10, L2.done);
    return w.back + seg('M10 85 H310', L1.still) + w.front + seg('M140 80 L110 60', L2.done) + seg('M170 90 L200 110', L2.done)
      + pull('M106 57 L80 40') + pull('M204 113 L230 130') + text(240, 40, 'tirar de las dos puntas');
  }),
  st(() => {
    const w = coil(170, 85, 5, 6, 10, L2.done);
    return w.back + seg('M10 85 H310', L1.still) + w.front + seg('M140 80 L128 72 M170 90 L182 98', L2.done)
      + bead(204, 85) + float(260, 85) + text(155, 140, 'tope · perla · boya');
  }),
];

/* Haywire: steel wire, eye at (230, 85). */
const HAYWIRE = [
  H + seg('M10 85 H230', WIRE.still, 4) + seg(eyeBack(140), WIRE.move, 4) + RF + tip(140, 99, 180, WIRE.move) + text(140, 140, 'pasar y doblar'),
  H + seg('M10 85 H150', WIRE.still, 4) + seg('M222 85 H230', WIRE.still, 4) + seg('M230 85 C238 85 242 99 228 99 H222', WIRE.done, 4)
    + twist(150, 222, 85, 99, 5, WIRE.still, WIRE.move) + seg('M150 99 H130', WIRE.move, 4) + RF + tip(130, 99, 180, WIRE.move)
    + text(170, 140, '4 o 5 vueltas en X'),
  st(() => {
    const w = coil(150, 85, 5, 7, 10, WIRE.move);
    return H + w.back + seg('M10 85 H150', WIRE.still, 4) + seg('M222 85 H230', WIRE.still, 4) + seg('M230 85 C238 85 242 99 228 99 H222', WIRE.done, 4)
      + twist(150, 222, 85, 99, 5, WIRE.still, WIRE.done) + w.front + RF + tip(115, 95, 120, WIRE.move) + text(110, 130, '5 vueltas apretadas');
  }),
  st(() => {
    const w = coil(150, 85, 5, 7, 10, WIRE.done);
    return H + w.back + seg('M10 85 H150', WIRE.still, 4) + seg('M222 85 H230', WIRE.still, 4) + seg('M230 85 C238 85 242 99 228 99 H222', WIRE.done, 4)
      + twist(150, 222, 85, 99, 5, WIRE.still, WIRE.done) + w.front + seg('M115 95 V50 H86', WIRE.move, 4) + RF
      + arrow('M70 64 C56 40 90 22 112 34') + text(150, 140, 'girar la manija hasta que se corte');
  }),
];

/* Manguito: steel cable through the sleeve, the eye and the sleeve again. */
const MG_BACK = 'M230 80 C240 80 244 100 228 100 C214 100 210 92 200 92 H';
const MANGUITO = [
  H + seg('M10 80 H230', WIRE.still, 4) + seg('M230 80 C240 80 244 100 228 100 H140', WIRE.move, 4) + sleeve(170, 86) + RF
    + tip(140, 100, 180, WIRE.move) + text(165, 150, 'manguito, ojo y de nuevo el manguito'),
  H + seg('M10 80 H200 C214 80 214 74 230 80', WIRE.still, 4) + seg(`${MG_BACK}140`, WIRE.done, 4) + sleeve(170, 86) + RF
    + arrow('M130 44 H170') + text(150, 140, 'dejar un lazo chico'),
  H + seg('M10 80 H200 C214 80 214 74 230 80', WIRE.still, 4) + seg(`${MG_BACK}140`, WIRE.done, 4) + sleeve(170, 86, true) + RF
    + hold(170, 86) + text(80, 140, 'aplastar con la pinza'),
  H + seg('M10 80 H200 C214 80 214 74 230 80', WIRE.still, 4) + seg(`${MG_BACK}150`, WIRE.done, 4) + sleeve(170, 86, true) + RF + scissors(140, 120),
];

const STEPS = {
  carrete: CARRETE,
  uni: UNI,
  palomar: PALOMAR,
  clinch: CLINCH,
  snell: SNELL,
  rapala: RAPALA,
  'lazo-perfecto': LAZO_PERFECTO,
  sangre: SANGRE,
  'doble-uni': DU,
  cirujano: CIRUJANO,
  albright: ALBRIGHT,
  fg: FG,
  'lazo-cirujano': LAZO_CIRUJANO,
  bimini: BIMINI,
  brazolada: BRAZOLADA,
  tope: TOPE,
  haywire: HAYWIRE,
  manguito: MANGUITO,
};

/* ---------- Key ---------- */

// Names of the lines, for knots that use more than one or are not plain line.
const LINE_NAMES = {
  sangre: ['Una línea', 'La otra línea'],
  'doble-uni': ['Una línea', 'La otra línea'],
  cirujano: ['Una línea', 'La otra línea'],
  albright: ['Línea gruesa', 'Línea fina'],
  fg: ['Trenzado', 'Líder'],
  tope: ['Línea', 'Hilo del tope'],
};

const swatch = (body) => `<svg viewBox="0 0 30 14" width="30" height="14" aria-hidden="true">${body}</svg>`;
const bar = (c) => swatch(`<path d="M2 7 H28" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`);
const shades = (c) => swatch(`<path d="M2 7 H10" stroke="${c.still}" stroke-width="5" stroke-linecap="round"/><path d="M11 7 H19" stroke="${c.move}" stroke-width="5"/><path d="M20 7 H28" stroke="${c.done}" stroke-width="5" stroke-linecap="round"/>`);

/** Key for a knot, built from what its drawings use. */
export function knotKey(id) {
  const all = (STEPS[id] || []).join('');
  const uses = (c) => all.includes(c.still) || all.includes(c.move) || all.includes(c.done);
  const items = [];
  if (all.includes(WIRE.move)) {
    items.push({ label: 'Alambre quieto', svg: bar(WIRE.still) }, { label: 'Este paso', svg: bar(WIRE.move) }, { label: 'Ya hecho', svg: bar(WIRE.done) });
  } else if (uses(L2)) {
    const [n1, n2] = LINE_NAMES[id] || ['Una línea', 'La otra línea'];
    items.push({ label: n1, svg: shades(L1) }, { label: n2, svg: shades(L2) },
      { label: 'Oscuro: quieta · fuerte: este paso · claro: ya hecho' });
  } else {
    items.push({ label: 'Línea quieta', svg: bar(L1.still) }, { label: 'Este paso', svg: bar(L1.move) }, { label: 'Ya hecho', svg: bar(L1.done) });
  }
  const tipColor = all.includes(WIRE.move) ? WIRE.move : L1.move;
  items.push({ label: 'Punta', svg: swatch(`<path d="M2 7 H16" stroke="${tipColor}" stroke-width="5" stroke-linecap="round"/><path d="M15 7 L22 1 L29 7 L22 13Z" fill="${tipColor}"/>`) });
  if (all.includes('url(#kah)')) items.push({ label: 'Mover', svg: swatch(`<path d="M2 7 H20" stroke="${R}" stroke-width="2.5" stroke-dasharray="5 3"/><path d="M20 2 L28 7 L20 12z" fill="${R}"/>`) });
  if (all.includes('data-k="hold"')) items.push({ label: 'Sostener', svg: swatch(`<path d="M5 1 L13 7 L5 13Z M25 1 L17 7 L25 13Z" fill="${F}"/>`) });
  if (all.includes('data-k="open"')) items.push({ label: 'Abrir', svg: swatch(`<path d="M13 1 L5 7 L13 13Z M17 1 L25 7 L17 13Z" fill="${F}"/>`) });
  if (all.includes('url(#kph)')) items.push({ label: 'Tirar', svg: swatch(`<path d="M2 7 H17" stroke="${F}" stroke-width="5"/><path d="M16 1 L29 7 L16 13z" fill="${F}"/>`) });
  return items;
}

export function knotStepSvg(id, i) {
  const body = STEPS[id]?.[i];
  return body ? draw(body) : '';
}

export function knotStepCount(id) {
  return STEPS[id]?.length ?? 0;
}
