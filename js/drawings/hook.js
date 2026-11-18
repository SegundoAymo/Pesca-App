// Anzuelos dibujados con su forma (pedido del usuario del 18/11/2026: "parecen un alambre").
// Un anzuelo tiene ojal, pata, curva, punta y rebaba; según el tipo, además, doblez en Z
// (offset), dos curvas (doble de rana), cabeza de plomo con trabas (jig) o pata larga.
// Marco local: el ojal en (0, 0), la pata hacia +x, la curva sube y la punta vuelve hacia
// el ojal. Se ubica con x, y, rot (grados) y s (escala); flip la refleja (punta hacia abajo).

const METAL = '#4E4E49';
const INK = '#0B0B0B';
const LEAD = '#6B6B66';

function stroke(d, w, dashed) {
  const dash = dashed ? ' stroke-dasharray="3 3"' : '';
  return dashed
    ? `<path d="${d}" fill="none" stroke="${METAL}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash}/>`
    : `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 1.6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${METAL}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/** Point with barb at (px, py), pointing toward -x (back to the eye). */
function point(px, py, w, dashed) {
  const k = w / 3;
  if (dashed) return '';
  return `<path d="M${px + 1} ${py - 2.4 * k} L${px - 8 * k} ${py} L${px + 1} ${py + 2.4 * k} Z" fill="${METAL}" stroke="${INK}" stroke-width="0.9"/>`
    + `<path d="M${px - 1 * k} ${py + 1} L${px + 3 * k} ${py + 6 * k}" stroke="${INK}" stroke-width="${2.6 * k + 1}" stroke-linecap="round"/>`
    + `<path d="M${px - 1 * k} ${py + 1} L${px + 3 * k} ${py + 6 * k}" stroke="${METAL}" stroke-width="${2 * k}" stroke-linecap="round"/>`;
}

const eye = (x, y, r, w) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${INK}" stroke-width="${w + 1.6}"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${METAL}" stroke-width="${w}"/>`;

/**
 * SVG of a hook. opts: { x, y, rot = 0, s = 1, kind = 'plain' | 'offset' | 'wide' | 'long' |
 * 'double' | 'jig' | 'dropshot', len (shank), gap (bend radius), hidden (shank inside a
 * lure: dotted), hiddenPoint (the point inside the lure too), flip, eye = true, w (wire) }.
 */
export function hookSvg(opts = {}) {
  const { x = 0, y = 0, rot = 0, s = 1, kind = 'plain', hidden = false, hiddenPoint = false, flip = false, w = 3 } = opts;
  const r = opts.gap ?? { wide: 11, long: 9, double: 9, dropshot: 7, jig: 9 }[kind] ?? 8;
  const L = opts.len ?? { long: 64, dropshot: 18, jig: 46, offset: 40 }[kind] ?? 36;
  let body = '';
  let start = 0;
  if (opts.eye !== false && kind !== 'jig') body += eye(-4, 0, 4, w * 0.8);
  if (kind === 'jig') {
    // Lead ball molded on the hook, eye on top, collar with two barbs that hold the lure.
    body += `<circle cx="0" cy="0" r="${11}" fill="${LEAD}" stroke="${INK}" stroke-width="2"/>` + eye(-3, -15, 4, w * 0.8)
      + stroke('M-3 -11 V-8', w);
    start = 11;
    body += stroke(`M${start + 4} 0 l4 -5 M${start + 11} 0 l4 -5`, w * 0.7, hidden);
  }
  let d;
  if (kind === 'offset') d = `M0 0 H6 L12 8 H${L}`;
  else d = `M${start} 0 H${L}`;
  const by = kind === 'offset' ? 8 : 0;
  const ty = by - 2 * r;
  const px = L - 1.3 * r;
  body += stroke(d, w, hidden);
  body += stroke(`M${L} ${by} A${r} ${r} 0 0 0 ${L} ${ty} L${px + 2} ${ty}`, w, hiddenPoint);
  body += point(px, ty, w, hiddenPoint);
  if (kind === 'double') {
    // The second hook of the pair, beside the first and a little behind (lighter).
    body = `<g opacity="0.55" transform="translate(5 4)">${stroke(`M${L} 0 A${r} ${r} 0 0 0 ${L} ${-2 * r} L${px + 2} ${-2 * r}`, w, hiddenPoint)}${point(px, -2 * r, w, hiddenPoint)}</g>` + body;
  }
  const sy = flip ? -1 : 1;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s} ${s * sy})">${body}</g>`;
}
