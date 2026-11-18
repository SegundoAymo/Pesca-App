// Montajes de señuelo de goma (Texas, Free rig, Drop shot, Wacky, Damiki, Carolina) y sus
// variantes, dibujados como quedan armados en el agua. Colores del sistema de la app:
// línea verde, plomo y anzuelo gris, la goma con su color. Aprobados por el usuario el
// 16/11/2026 (boceto en docs/plan-montajes-goma.md).

import { hookSvg } from './hook.js';

const LINE = '#1E5A38';
const LEAD = '#6B6B66';
const HOOK = '#4E4E49';
const INK = '#0B0B0B';
const MUTED = '#55554F';
const RED = '#C8102E';
const W = 360;
const H = 240;

const water = (top = 34, bottom = false) => {
  let wave = `M0 ${top}`;
  for (let x = 0; x < W; x += 20) wave += ' q5 -4 10 0 t10 0';
  return `<rect x="0" y="${top}" width="${W}" height="${H - top}" fill="#E8F2F6"/><path d="${wave}" fill="none" stroke="#5BB4E5" stroke-width="2"/>`
    + (bottom ? `<path d="M0 ${H - 20} q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V${H} H0Z" fill="#8A6A48"/>` : '');
};
const t = (x, y, s, sub = false) => `<text x="${x}" y="${y}" font-family="Barlow, sans-serif" font-weight="${sub ? 500 : 700}" font-size="13" fill="${sub ? MUTED : INK}">${s}</text>`;
const label = (x, y, a, b = '', c = '') => t(x, y, a) + (b ? t(x, y + 16, b, true) : '') + (c ? t(x, y + 32, c, true) : '');
const eye = (x, y) => `<circle cx="${x}" cy="${y}" r="4" fill="none" stroke="${HOOK}" stroke-width="2.4"/>`;
const slide = (x, y1, y2) => `<path d="M${x} ${y1} V${y2}" stroke="${RED}" stroke-width="2.5" stroke-dasharray="5 3" marker-start="url(#lr-ar)" marker-end="url(#lr-ar)"/>`;
const worm = (d, color, w = 11) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
// A curly-tail soft lure lying to the right of (x, y).
const curly = (x, y, color = '#8A4B2A') => `<path d="M${x} ${y - 6} C${x + 44} ${y - 10} ${x + 94} ${y - 10} ${x + 124} ${y + 2} C${x + 136} ${y + 8} ${x + 124} ${y + 18} ${x + 104} ${y + 16} C${x + 64} ${y + 14} ${x + 24} ${y + 12} ${x + 2} ${y + 6} Z" fill="${color}" stroke="${INK}" stroke-width="2"/>`
  + `<path d="M${x + 124} ${y + 6} C${x + 144} ${y + 12} ${x + 154} ${y + 32} ${x + 136} ${y + 42} C${x + 124} ${y + 48} ${x + 120} ${y + 34} ${x + 132} ${y + 32}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`;
// The hook inside the lure, in dots (rule: what goes behind or inside an object is dotted).
const hidden = (d) => `<path d="${d}" fill="none" stroke="${HOOK}" stroke-width="2.4" stroke-dasharray="3 3"/>`;
const bullet = (x, y, a = 0) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 -14 C4 -8 9 6 9 12 Q0 15 -9 12 C-9 6 -4 -8 0 -14Z" fill="${LEAD}" stroke="${INK}" stroke-width="2"/></g>`;
// Main line, a swivel and a short steel leader from (x0, y0) to (x1, y1).
const steelTo = (x0, y0, x1, y1) => {
  const mx = x0 + (x1 - x0) * 0.62;
  const my = y0 + (y1 - y0) * 0.62;
  return `<path d="M${x0} ${y0} L${mx} ${my}" stroke="${LINE}" stroke-width="3"/><path d="M${mx} ${my} L${x1} ${y1}" stroke="#7E8C96" stroke-width="3"/>`
    + `<rect x="${mx - 6}" y="${my - 3.5}" width="12" height="7" rx="3" fill="#B8902E" stroke="${INK}" stroke-width="1.5" transform="rotate(${(Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI} ${mx} ${my})"/>`;
};
const cyl = (x, y, h = 30) => `<rect x="${x - 8}" y="${y}" width="16" height="${h}" rx="6" fill="${LEAD}" stroke="${INK}" stroke-width="2"/>`;

const ART = {
  texas: () => water() + `<path d="M50 6 L152 110" stroke="${LINE}" stroke-width="3"/>`
    + bullet(142, 100, -44) + `<path d="M150 108 L163 124" stroke="${LINE}" stroke-width="2"/>` 
    + curly(174, 132) + hookSvg({ x: 170, y: 127, rot: 3, kind: 'offset', len: 92, gap: 8, hidden: true, hiddenPoint: true })
    + label(160, 54, 'Plomo bala corredizo', 'enhebrado, punta hacia la caña') + label(150, 196, 'Goma en anzuelo offset', 'la punta escondida en la goma'),
  'texas-pegado': () => water() + `<path d="M50 6 L150 108" stroke="${LINE}" stroke-width="3"/>`
    + bullet(154, 112, -44) + `<path d="M142 98 l-10 -10" stroke="#C9A66B" stroke-width="3" stroke-linecap="round"/>` 
    + curly(174, 132) + hookSvg({ x: 170, y: 127, rot: 3, kind: 'offset', len: 92, gap: 8, hidden: true, hiddenPoint: true })
    + label(160, 54, 'Plomo trabado', 'contra la goma (tope o palillo)') + label(150, 196, 'Todo se mueve junto', 'entra mejor entre plantas'),
  free: () => water() + `<path d="M110 6 V146" stroke="${LINE}" stroke-width="3"/>`
    + `<circle cx="110" cy="62" r="4" fill="none" stroke="${INK}" stroke-width="2"/>` + cyl(110, 66) + slide(132, 64, 104) + `<path d="M110 146 V168 L114 172" stroke="${LINE}" stroke-width="3" fill="none"/>`
    + curly(116, 170, '#2F7D3A') + hookSvg({ x: 118, y: 172, kind: 'offset', len: 64, gap: 8, hidden: true, hiddenPoint: true })
    + label(144, 78, 'Plomo con ojal', 'corre libre por la línea') + label(30, 214, 'Goma sola en el anzuelo', 'el nudo frena al plomo; nada pegado'),
  'free-topes': () => water() + `<path d="M110 6 V146" stroke="${LINE}" stroke-width="3"/>`
    + `<rect x="103" y="50" width="14" height="6" rx="3" fill="#F07C00" stroke="${INK}" stroke-width="1.5"/>` + cyl(110, 62) + `<rect x="103" y="98" width="14" height="6" rx="3" fill="#F07C00" stroke="${INK}" stroke-width="1.5"/>` + `<path d="M110 146 V168 L114 172" stroke="${LINE}" stroke-width="3" fill="none"/>`
    + curly(116, 170, '#2F7D3A') + hookSvg({ x: 118, y: 172, kind: 'offset', len: 64, gap: 8, hidden: true, hiddenPoint: true })
    + label(144, 64, 'Topes de goma', 'a los dos lados del plomo:', 'fijan dónde queda') + label(30, 214, 'Plomo a la distancia que se elija', 'de la goma'),
  dropshot: (tag = 'corta') => {
    const hy = tag === 'larga' ? 70 : 128;
    return water(26, true) + `<path d="M120 4 V196" stroke="${LINE}" stroke-width="3"/>`
      + `<path d="M150 ${hy} C158 ${hy - 4} 166 ${hy} 166 ${hy + 8} C168 ${hy + 34} 168 ${hy + 54} 160 ${hy + 68} C156 ${hy + 74} 150 ${hy + 70} 152 ${hy + 62} C158 ${hy + 40} 156 ${hy + 22} 150 ${hy + 8} Z" fill="#B5651D" stroke="${INK}" stroke-width="2"/>`
      + hookSvg({ x: 128, y: hy + 10, kind: 'dropshot', len: 24, gap: 7 })
      + cyl(120, 194, 26) + `<path d="M108 ${hy + 6} V192" stroke="${MUTED}" stroke-width="1.2"/><path d="M104 ${hy + 6} h8 M104 192 h8" stroke="${MUTED}" stroke-width="1.2"/>`
      + label(176, hy - 8, 'Anzuelo con Palomar', 'punta hacia arriba, sale', 'horizontal; goma por la nariz')
      + label(6, (hy + 192) / 2, 'Punta', tag === 'larga' ? 'larga: goma' : 'corta: goma', tag === 'larga' ? 'alta' : 'cerca del fondo') + t(140, 214, 'Plomo al final, en el fondo');
  },
  'dropshot-larga': () => ART.dropshot('larga'),
  wacky: () => water() + `<path d="M120 6 V112" stroke="${LINE}" stroke-width="3"/>` + `<circle cx="120" cy="116" r="4" fill="none" stroke="${INK}" stroke-width="4.4"/><circle cx="120" cy="116" r="4" fill="none" stroke="${HOOK}" stroke-width="2.6"/>`
    + worm('M90 200 C88 162 100 134 120 126 C140 134 152 162 150 200', '#5A3A6E')
    + `<ellipse cx="120" cy="128" rx="9" ry="4" fill="none" stroke="#FFC400" stroke-width="2.5"/>` + hookSvg({ x: 120, y: 120, rot: 90, len: 12, gap: 7, eye: false, flip: true })
    + label(170, 112, 'Anzuelo por un aro', 'en el medio del gusano', '(tipo Senko)') + label(170, 180, 'Las dos puntas cuelgan', 'sin plomo: cae despacio'),
  neko: () => water() + `<path d="M120 6 V96" stroke="${LINE}" stroke-width="3"/>` + `<circle cx="120" cy="100" r="4" fill="none" stroke="${INK}" stroke-width="4.4"/><circle cx="120" cy="100" r="4" fill="none" stroke="${HOOK}" stroke-width="2.6"/>`
    + worm('M122 108 C126 140 128 170 130 206', '#5A3A6E')
    + `<ellipse cx="122" cy="114" rx="9" ry="4" fill="none" stroke="#FFC400" stroke-width="2.5"/>` + hookSvg({ x: 120, y: 104, rot: 90, len: 12, gap: 7, eye: false, flip: true })
    + `<rect x="125" y="200" width="10" height="16" rx="2" fill="${LEAD}" stroke="${INK}" stroke-width="1.5"/>`
    + label(150, 100, 'Anzuelo cerca de la cabeza', 'con aro') + label(150, 196, 'Plomo tipo clavo', 'en la punta: queda parado', 'y se mueve en el fondo'),
  damiki: () => water() + `<path d="M110 6 V117" stroke="${LINE}" stroke-width="3"/>`
    + `<path d="M90 130 C120 122 200 122 250 128 L290 116 L286 134 L292 150 L250 138 C200 144 120 144 90 136 Z" fill="#C9D6DE" stroke="${INK}" stroke-width="2"/><circle cx="100" cy="132" r="2.5" fill="${INK}"/>`
    + `<path d="M104 140 h22 l-6 10 h-12 z" fill="${LEAD}" stroke="${INK}" stroke-width="2"/>`
    + hookSvg({ x: 113, y: 135, kind: 'jig', len: 74, gap: 9, hidden: true })
    + label(126, 70, 'Ojal a 90°', 'la línea sale para arriba') + label(30, 180, 'Cabeza jig con quilla de plomo', 'debajo del anzuelo') + label(30, 214, 'Goma tipo pececito, recta:', 'queda horizontal'),
  // Para tararira (16/11/2026): rana antienganche, spinnerbait y goma en cabeza jig, con
  // líder de acero armado (emerillón y mosquetón).
  frog: (solid = false) => water(120) + steelTo(20, 30, 128, 116)
    + `<g fill="#2F7D3A" stroke="${INK}" stroke-width="1.5"><ellipse cx="262" cy="118" rx="40" ry="9"/><ellipse cx="324" cy="120" rx="34" ry="8"/><ellipse cx="300" cy="111" rx="22" ry="7"/></g>`
    + `<path d="M262 126 q-6 30 4 60 M312 128 q8 30 -2 56" stroke="#2F7D3A" stroke-width="2" fill="none"/>`
    + `<path d="M132 114 C140 98 182 96 198 106 C206 112 204 122 192 124 C172 128 148 128 136 122 Z" fill="${solid ? '#6E8B3D' : '#4F7A2E'}" stroke="${INK}" stroke-width="2"/>`
    + `<circle cx="146" cy="104" r="4" fill="#FFC400" stroke="${INK}" stroke-width="1.5"/>`
    + `<path d="M200 114 q20 4 34 -2 M200 118 q22 8 36 4 M200 120 q18 12 30 12" stroke="${solid ? '#6E8B3D' : '#4F7A2E'}" stroke-width="3" fill="none" stroke-linecap="round"/>`
    + (solid ? hookSvg({ x: 136, y: 116, kind: 'offset', len: 48, gap: 6, hidden: true, hiddenPoint: true })
      : hookSvg({ x: 136, y: 118, kind: 'double', len: 56, gap: 8, hidden: true, eye: false }))
    + label(18, 158, 'Líder de acero', 'con emerillón y mosquetón')
    + (solid ? label(140, 60, 'Rana maciza: anzuelo offset', 'escondido adentro de la goma') : label(140, 60, 'Rana hueca: anzuelo doble', 'pegado al lomo, puntas arriba'))
    + label(150, 214, 'Pasa por arriba de camalotes', 'y juncos sin engancharse'),
  'frog-solid': () => ART.frog(true),
  spinnerbait: () => water() + `<path d="M330 240 V120 M344 240 V100 M316 240 V150" stroke="#2F7D3A" stroke-width="4"/>`
    + steelTo(10, 60, 104, 142)
    + `<path d="M106 144 L170 92 M106 144 L150 170" stroke="#7E8C96" stroke-width="2.6" fill="none"/><circle cx="106" cy="144" r="3.5" fill="none" stroke="${INK}" stroke-width="1.5"/>`
    + `<rect x="164" y="80" width="6" height="6" fill="#B8902E" stroke="${INK}" stroke-width="1"/><ellipse cx="190" cy="80" rx="22" ry="9" fill="#E9E9E2" stroke="${INK}" stroke-width="2" transform="rotate(-15 190 80)"/><ellipse cx="148" cy="104" rx="11" ry="6" fill="#FFC400" stroke="${INK}" stroke-width="1.5" transform="rotate(-25 148 104)"/>`
    + `<path d="M168 172 q30 -6 54 0 M168 176 q30 2 56 8 M168 178 q26 10 50 16 M168 170 q28 -12 50 -10" stroke="#C2410C" stroke-width="3" fill="none" stroke-linecap="round"/>`
    + `<ellipse cx="158" cy="174" rx="12" ry="9" fill="${LEAD}" stroke="${INK}" stroke-width="2"/><circle cx="154" cy="172" r="2" fill="#FFC400"/>`
    + hookSvg({ x: 168, y: 175, kind: 'long', len: 52, gap: 9, eye: false })
    + label(206, 104, 'Arriba: cucharitas', 'que giran') + label(14, 176, 'Acero al codo', 'del alambre') + label(40, 214, 'Abajo: cabeza de plomo, faldita', 'y anzuelo con la punta arriba'),
  jighead: (tail = 'shad') => water(26, true) + `<path d="M20 240 V150 M34 240 V130 M330 240 V140 M344 240 V160" stroke="#2F7D3A" stroke-width="4"/>`
    + steelTo(118, 4, 129, 177)
    + (tail === 'curly' ? curly(140, 196, '#8A4B2A')
      : `<path d="M144 188 C180 180 220 182 246 190 L270 178 L264 196 L272 214 L246 202 C220 210 180 210 144 200 Z" fill="#C9D6DE" stroke="${INK}" stroke-width="2"/>`)
    + hookSvg({ x: 132, y: 196, kind: 'jig', len: 54, gap: 8, hidden: true })
    + label(150, 70, 'Cabeza de plomo redonda', 'el anzuelo va adentro de la goma', 'y la punta sale por el lomo') + label(150, 136, 'Acero al ojal de la cabeza')
    + t(160, 236, 'Claros de fondo limpio'),
  'jighead-curly': () => ART.jighead('curly'),
  carolina: () => water(26, true) + `<path d="M40 4 C70 60 90 90 120 112" stroke="${LINE}" stroke-width="3" fill="none"/>`
    + bullet(98, 88, -54) + `<circle cx="112" cy="104" r="4.5" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`
    + `<rect x="116" y="104" width="14" height="8" rx="3" fill="${LEAD}" stroke="${INK}" stroke-width="1.5" transform="rotate(34 123 108)"/>`
    + `<path d="M130 116 C160 146 178 170 190 190" stroke="#8A4300" stroke-width="2.6" fill="none"/>` 
    + curly(192, 194) + hookSvg({ x: 194, y: 190, rot: 2, kind: 'offset', len: 70, gap: 8, hidden: true, hiddenPoint: true })
    + label(150, 70, 'Plomo, perla y emerillón', 'el emerillón hace de tope') + label(20, 150, 'Tramo de línea', 'la goma trabaja suelta'),
};

/** SVG of a soft-lure rig or variant ('' if unknown). */
export function lureRigSvg(id, label = '') {
  const art = ART[id];
  if (!art) return '';
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${label.replace(/"/g, '')}"><defs><marker id="lr-ar" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${RED}"/></marker></defs>${art()}</svg>`;
}

export const LURE_ART = Object.keys(ART);
