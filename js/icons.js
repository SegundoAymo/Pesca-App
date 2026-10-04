// SVG icons as strings. Señal style: black lines, yellow accents.

const svg = (w, h, vb, body, extra = '') =>
  `<svg width="${w}" height="${h}" viewBox="${vb}" aria-hidden="true" focusable="false" ${extra}>${body}</svg>`;

/* ---------- Home buttons (design/icons) ---------- */

export function homeIcon(name, size = 84, dayNumber = 1) {
  const s = (body) => svg(size, size, '0 0 24 24', body);
  switch (name) {
    case 'clima':
      return s('<path d="M9.5 4a2.5 2.5 0 0 1 5 0v9.2a5 5 0 1 1-5 0z" fill="#FFFFFF" stroke="#0B0B0B" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="17.2" r="2.8" fill="#FFC400" stroke="#0B0B0B" stroke-width="1.4"/><path d="M12 7.5v7" stroke="#0B0B0B" stroke-width="2" stroke-linecap="round"/><path d="M16.5 6h3M16.5 9h2M16.5 12h3" stroke="#0B0B0B" stroke-width="1.6" stroke-linecap="round"/>');
    case 'calendario':
      return s(`<rect x="3" y="4" width="18" height="17" rx="2" fill="#FFFFFF" stroke="#0B0B0B" stroke-width="1.8"/><path d="M3 5.8a1.8 1.8 0 0 1 1.8-1.8h14.4A1.8 1.8 0 0 1 21 5.8V9H3z" fill="#0B0B0B"/><text x="12" y="19" text-anchor="middle" font-family="Barlow Semi Condensed, sans-serif" font-weight="800" font-size="${dayNumber > 9 ? 9 : 10}" fill="#0B0B0B">${dayNumber}</text><rect x="7" y="2" width="2.2" height="4" rx="1" fill="#FFC400" stroke="#0B0B0B" stroke-width="0.8"/><rect x="14.8" y="2" width="2.2" height="4" rx="1" fill="#FFC400" stroke="#0B0B0B" stroke-width="0.8"/>`);
    case 'peces':
      return s('<path d="M1.8 12 C5 7.6 13 7 18 9.6 L22.2 7 L21.2 12 L22.2 17 L18 14.4 C13 17 5 16.4 1.8 12 Z" fill="#FFC400" stroke="#0B0B0B" stroke-width="1.6" stroke-linejoin="round"/><path d="M1.8 12 L6.5 12.6" stroke="#0B0B0B" stroke-width="1.4" stroke-linecap="round"/><path d="M2.6 12.1 l0.7 0.9 l0.7 -0.8 l0.7 0.9 l0.7 -0.8" fill="none" stroke="#0B0B0B" stroke-width="0.9"/><circle cx="5.6" cy="10.6" r="1" fill="#0B0B0B"/><circle cx="11" cy="11" r="0.9" fill="#0B0B0B"/><circle cx="13.5" cy="13.2" r="0.9" fill="#0B0B0B"/><circle cx="15.8" cy="11.4" r="0.8" fill="#0B0B0B"/>');
    case 'nudos':
      return s('<path d="M15 1.5v12a5 5 0 1 1-10 0v-2.5" fill="none" stroke="#0B0B0B" stroke-width="2.4" stroke-linecap="round"/><path d="M5 11l-2.4 2.6" stroke="#0B0B0B" stroke-width="2.4" stroke-linecap="round"/><rect x="12.6" y="3.5" width="4.8" height="1.8" rx="0.9" fill="#FFC400" stroke="#0B0B0B" stroke-width="0.9"/><rect x="12.6" y="5.6" width="4.8" height="1.8" rx="0.9" fill="#FFC400" stroke="#0B0B0B" stroke-width="0.9"/><rect x="12.6" y="7.7" width="4.8" height="1.8" rx="0.9" fill="#FFC400" stroke="#0B0B0B" stroke-width="0.9"/>');
    case 'checklist':
      return s('<path d="M8.5 8.5V5.5h7v3" fill="none" stroke="#0B0B0B" stroke-width="2" stroke-linejoin="round"/><rect x="2.5" y="8.5" width="19" height="12" rx="1.5" fill="#FFC400" stroke="#0B0B0B" stroke-width="1.8"/><path d="M2.5 13h19" stroke="#0B0B0B" stroke-width="1.8"/><rect x="10.3" y="11.6" width="3.4" height="3" rx="0.6" fill="#0B0B0B"/>');
    default:
      return '';
  }
}

/* ---------- UI ---------- */

export const ICON = {
  back: svg(26, 26, '0 0 24 24', '<path d="M15 4 L7 12 L15 20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'),
  prev: svg(24, 24, '0 0 24 24', '<path d="M15 4 L7 12 L15 20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'),
  next: svg(24, 24, '0 0 24 24', '<path d="M9 4 L17 12 L9 20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'),
  chevron: svg(22, 22, '0 0 24 24', '<path d="M9 4 L17 12 L9 20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'),
  up: svg(22, 22, '0 0 24 24', '<path d="M4 15 L12 7 L20 15" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'),
  down: svg(22, 22, '0 0 24 24', '<path d="M4 9 L12 17 L20 9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'),
  close: svg(22, 22, '0 0 24 24', '<path d="M5 5 L19 19 M19 5 L5 19" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
  plus: svg(22, 22, '0 0 24 24', '<path d="M12 4 V20 M4 12 H20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
  pin: svg(22, 22, '0 0 24 24', '<path d="M12 22s7-7.2 7-12.5A7 7 0 0 0 5 9.5C5 14.8 12 22 12 22z" fill="#FFC400" stroke="#0B0B0B" stroke-width="2"/><circle cx="12" cy="9.5" r="2.6" fill="#0B0B0B"/>'),
  gps: svg(22, 22, '0 0 24 24', '<circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="2.4" fill="currentColor"/><path d="M12 1.5v3.5M12 19v3.5M1.5 12H5M19 12h3.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'),
  search: svg(22, 22, '0 0 24 24', '<circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M15.5 15.5 L21 21" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/>'),
  warning: svg(26, 26, '0 0 24 24', '<path d="M12 2.5 L22.5 21 H1.5 Z" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 9v5.5" stroke="#C8102E" stroke-width="2.6" stroke-linecap="round"/><circle cx="12" cy="18" r="1.5" fill="#C8102E"/>'),
  check: svg(26, 26, '0 0 24 24', '<path d="M4.5 12.5 L10 18 L19.5 6.5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>'),
  trash: svg(22, 22, '0 0 24 24', '<path d="M4 6.5h16M9.5 6.5V4h5v2.5M6 6.5l1 14h10l1-14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>'),
  sunrise: svg(30, 30, '0 0 24 24', '<path d="M6.5 16a5.5 5.5 0 0 1 11 0z" fill="#FFC400" stroke="#0B0B0B" stroke-width="1.8" stroke-linejoin="round"/><path d="M2 19.5h20" stroke="#0B0B0B" stroke-width="2" stroke-linecap="round"/><path d="M12 3v5M9.5 5.5 12 3l2.5 2.5" fill="none" stroke="#0B0B0B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'),
  sunset: svg(30, 30, '0 0 24 24', '<path d="M6.5 16a5.5 5.5 0 0 1 11 0z" fill="#FFC400" stroke="#0B0B0B" stroke-width="1.8" stroke-linejoin="round"/><path d="M2 19.5h20" stroke="#0B0B0B" stroke-width="2" stroke-linecap="round"/><path d="M12 3v5M9.5 5.5 12 8l2.5-2.5" fill="none" stroke="#0B0B0B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'),
};

/** Arrow pointing where the wind comes FROM (meteorological convention). */
export function windArrow(deg, size = 22, color = '#0B0B0B') {
  if (deg == null) return '';
  return svg(size, size, '0 0 24 24',
    `<g transform="rotate(${Math.round(deg)} 12 12)"><path d="M12 3 L12 20" stroke="${color}" stroke-width="2.6" stroke-linecap="round"/><path d="M6.5 8.5 L12 3 L17.5 8.5" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g>`,
    'class="wind-arrow"');
}

/* ---------- Weather ---------- */

const W = {
  sun: '<circle cx="12" cy="12" r="4.6" fill="#FFC400" stroke="#0B0B0B" stroke-width="1.7"/><path d="M12 2.2v2.6M12 19.2v2.6M2.2 12h2.6M19.2 12h2.6M5.1 5.1l1.8 1.8M17.1 17.1l1.8 1.8M5.1 18.9l1.8-1.8M17.1 6.9l1.8-1.8" stroke="#0B0B0B" stroke-width="1.7" stroke-linecap="round"/>',
  moon: '<path d="M15.5 3.5a8.5 8.5 0 1 0 5 13.4A7 7 0 0 1 15.5 3.5z" fill="#FFFFFF" stroke="#0B0B0B" stroke-width="1.8" stroke-linejoin="round"/>',
  cloud: (y = 0, fill = '#FFFFFF') => `<path d="M7 ${18 + y}h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 ${11.1 + y} 3.5 3.5 0 0 0 7 ${18 + y}z" fill="${fill}" stroke="#0B0B0B" stroke-width="1.7" stroke-linejoin="round"/>`,
  smallSun: '<circle cx="8" cy="8" r="3.6" fill="#FFC400" stroke="#0B0B0B" stroke-width="1.6"/><path d="M8 1.6v1.5M1.6 8h1.5M3.5 3.5l1 1M12.5 3.5l-1 1" stroke="#0B0B0B" stroke-width="1.6" stroke-linecap="round"/>',
  smallMoon: '<path d="M10 2.5a5.5 5.5 0 1 0 3.5 8.6A4.5 4.5 0 0 1 10 2.5z" fill="#FFFFFF" stroke="#0B0B0B" stroke-width="1.6" stroke-linejoin="round"/>',
};

export function weatherIcon(code, size = 34) {
  const s = (body) => svg(size, size, '0 0 24 24', body);
  switch (code) {
    case 'sol': return s(W.sun);
    case 'luna': return s(W.moon);
    case 'parcial': return s(W.smallSun + '<path d="M9 21h9a3.5 3.5 0 0 0 .4-6.97A5 5 0 0 0 8.7 14.4 3.3 3.3 0 0 0 9 21z" fill="#FFFFFF" stroke="#0B0B0B" stroke-width="1.7" stroke-linejoin="round"/>');
    case 'parcial-noche': return s(W.smallMoon + '<path d="M9 21h9a3.5 3.5 0 0 0 .4-6.97A5 5 0 0 0 8.7 14.4 3.3 3.3 0 0 0 9 21z" fill="#FFFFFF" stroke="#0B0B0B" stroke-width="1.7" stroke-linejoin="round"/>');
    case 'nube': return s(W.cloud(0, '#E4E4DE'));
    case 'niebla': return s(W.cloud(-4) + '<path d="M4 18h16M6 21.5h12" stroke="#0B0B0B" stroke-width="1.8" stroke-linecap="round"/>');
    case 'lluvia': return s(W.cloud(-4) + '<path d="M8 17.5l-1.2 3.5M12 17.5l-1.2 3.5M16 17.5l-1.2 3.5" stroke="#1D5FA8" stroke-width="2" stroke-linecap="round"/>');
    case 'nieve': return s(W.cloud(-4) + '<circle cx="8" cy="19" r="1.2" fill="#0B0B0B"/><circle cx="12" cy="21" r="1.2" fill="#0B0B0B"/><circle cx="16" cy="19" r="1.2" fill="#0B0B0B"/>');
    case 'tormenta': return s(W.cloud(-4) + '<path d="M12.8 14l-2.8 4.3h3.2l-2.2 4.2" fill="none" stroke="#C8102E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>');
    default: return s(W.cloud(0, '#E4E4DE'));
  }
}

/** Moon drawn with its lit part. illum 0..1, waxing: lit on the left in the southern hemisphere. */
export function moonIcon(illum, waxing, size = 22) {
  const r = 9;
  const k = 1 - 2 * illum; // terminator ellipse x-radius factor
  const rx = Math.abs(k) * r;
  // Southern hemisphere: waxing moon is lit on the left.
  const litLeft = waxing;
  const outer = litLeft ? `M12 3 A${r} ${r} 0 0 0 12 21` : `M12 3 A${r} ${r} 0 0 1 12 21`;
  const sweepInner = (litLeft ? k > 0 : k < 0) ? 1 : 0;
  const inner = ` A${rx} ${r} 0 0 ${sweepInner} 12 3 Z`;
  return svg(size, size, '0 0 24 24',
    `<circle cx="12" cy="12" r="${r}" fill="#3A3A36" stroke="#0B0B0B" stroke-width="1.5"/>`
    + (illum > 0.01 ? `<path d="${outer}${inner}" fill="#FFF4C2"/>` : '')
    + `<circle cx="12" cy="12" r="${r}" fill="none" stroke="#0B0B0B" stroke-width="1.5"/>`);
}

/* ---------- Fish ---------- */

// Calendar silhouettes, viewBox 32 x 20 (from the F6 design).
const CAL_FISH = {
  tararira: (c) => `<path d="M1 10 C6 4.5 17 4 24 8.5 L31 4 L29 10 L31 16 L24 11.5 C17 16 6 15.5 1 10 Z" fill="${c}"/>`,
  carpa: (c) => `<path d="M2 10 C5 1.5 17 1 23 8 L31 3 L29 10 L31 17 L23 12 C17 19 5 18.5 2 10 Z" fill="${c}"/>`,
  bagre: (c) => `<path d="M4 10 C8 6 18 5.5 24 8.5 L31 5 L29.5 10 L31 15 L24 11.5 C18 14.5 8 14 4 10 Z" fill="${c}"/><path d="M5 10.5 L0.8 14 M5 9.5 L0.8 6" stroke="${c}" stroke-width="1.5" stroke-linecap="round" fill="none"/>`,
};

export function calFish(species, color, w = 26) {
  return svg(w, Math.round(w * 0.625), '0 0 32 20', CAL_FISH[species](color));
}

// Species silhouettes for the Peces list, viewBox 48 x 24.
const EYE = (x, y) => `<circle cx="${x}" cy="${y}" r="1.3" fill="#FFFFFF"/>`;
const FISH = {
  tararira: (c) => `<path d="M2 12.5 C6 6.5 20 5.5 33 9 L40 4.5 Q43.5 12 40 19.5 L33 15 C20 18.5 6 18.5 2 12.5Z" fill="${c}"/><path d="M15 7.4 Q19 3.6 25 6.6" fill="${c}" stroke="${c}" stroke-width="2"/><path d="M2.5 12.6 L8 13.4" stroke="#FFFFFF" stroke-width="1.1" stroke-linecap="round"/>${EYE(6.8, 10.8)}`,
  carpa: (c) => `<path d="M3 12.5 C6 3 22 2 33 8.5 L41 3.5 L39 12.5 L41 21.5 L33 16.5 C22 22.5 6 21.5 3 12.5Z" fill="${c}"/><path d="M14 4.6 L18 1.5 L27 5.5" fill="${c}" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"/><path d="M3.6 14 Q2 16.5 3.5 18.5" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>${EYE(7.6, 10.2)}`,
  bagre: (c) => `<path d="M6 12.5 C10 7 24 6.5 34 9.5 L41 6 L39.5 12.5 L41 19 L34 15.5 C24 18.5 10 18 6 12.5Z" fill="${c}"/><path d="M7 13 L1 17.5 M7 12 L1 7.5 M8 14 L3.5 20" stroke="${c}" stroke-width="1.4" stroke-linecap="round" fill="none"/><path d="M18 8 L21 4.5 L24 8" fill="${c}"/>${EYE(10, 11)}`,
  pejerrey: (c) => `<path d="M2 12 C8 8.5 24 8 34 10.5 L42 6 L39 12 L42 18 L34 13.5 C24 16 8 15.5 2 12Z" fill="${c}"/><path d="M8 12 H33" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/><path d="M17 9 L19 6.5 L21 8.8 M24 9.2 L26.5 6.8 L28 9.6" fill="${c}" stroke="${c}" stroke-width="1"/>${EYE(5.4, 11)}`,
  dientudo: (c) => `<path d="M3 12 C8 7.5 24 7 34 10 L42 5.5 L39.5 12 L42 18.5 L34 14 C24 17 8 16.5 3 12Z" fill="${c}"/><path d="M2 12 L7 11.6 M3.4 11.8 l0.6 1.6 M5.2 11.7 l0.6 -1.5" stroke="${c}" stroke-width="1" stroke-linecap="round"/><path d="M3.3 12 L8 12.4" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round"/>${EYE(7.2, 10.6)}`,
  mojarra: (c) => `<path d="M8 12 C11 6 22 5.5 30 10 L37 5.5 L35 12 L37 18.5 L30 14 C22 18.5 11 18 8 12Z" fill="${c}"/><path d="M18 7.2 L21 4.8 L24 7.6" fill="${c}"/>${EYE(11.6, 10.8)}`,
  vieja: (c) => `<path d="M3 14.5 C5 9.5 18 7.5 32 10.5 L41 7.5 L39 13.5 L41 19 L32 15.5 C20 17.5 8 17.5 3 14.5Z" fill="${c}"/><path d="M11 9.5 L15 3 L24 8.6" fill="${c}"/><path d="M14 11 v5 M19 10.4 v5.6 M24 10.4 v5.2 M29 10.6 v4.6" stroke="#FFFFFF" stroke-width="0.9"/><path d="M3.5 15 L1 17.5 M4.5 15.6 L2.5 18.8" stroke="${c}" stroke-width="1.1" stroke-linecap="round"/>${EYE(7, 12.6)}`,
  lisa: (c) => `<path d="M2 12.5 C7 7.5 24 7 35 10 L42 6 L40 12.5 L42 19 L35 15 C24 18 7 17.5 2 12.5Z" fill="${c}"/><path d="M16 8 L18 5.2 L20 8 M25 8.6 L27 6 L29 9.2" fill="${c}" stroke="${c}" stroke-width="1"/><path d="M10 11 H34 M10 14 H33" stroke="#FFFFFF" stroke-width="0.7"/>${EYE(5.6, 11.4)}`,
  'bagre-amarillo': (c) => `<path d="M6 12.5 C10 6.5 24 6 34 9.5 L41 5.5 L39.5 12.5 L41 19.5 L34 15.5 C24 19 10 18.5 6 12.5Z" fill="${c}"/><path d="M7 13 L1 18 M7 12 L1 7 M8 14 L3 20.5" stroke="${c}" stroke-width="1.3" stroke-linecap="round" fill="none"/><circle cx="18" cy="12" r="1.3" fill="#FFFFFF"/><circle cx="24" cy="13.5" r="1.1" fill="#FFFFFF"/><circle cx="29" cy="11.6" r="1" fill="#FFFFFF"/><path d="M18 7.6 L20.5 3.6 L23 7.6" fill="${c}"/>${EYE(10, 11)}`,
  pati: (c) => `<path d="M5 12.5 C9 6 26 5 36 9.5 L43 5 L41.5 12.5 L43 20 L36 15.5 C26 20 9 19 5 12.5Z" fill="${c}"/><path d="M6 13 Q2 17 0.5 22 M6 12 Q2 8 0.5 3 M7 14.5 L4 21" stroke="${c}" stroke-width="1.3" stroke-linecap="round" fill="none"/><path d="M19 7.4 L22 3.5 L25 7.4" fill="${c}"/>${EYE(9.6, 10.8)}`,
  boga: (c) => `<path d="M3 12.5 C7 6.5 23 5.5 34 9.5 L41 5 L39 12.5 L41 20 L34 15.5 C23 19.5 7 18.5 3 12.5Z" fill="${c}"/><path d="M16 7 L19 3.6 L22 7" fill="${c}"/><path d="M13 9 v7 M19 8 v9 M25 8.4 v8 M30 9.2 v6" stroke="#FFFFFF" stroke-width="1.1"/>${EYE(7, 11)}`,
};

export function fishIcon(species, color = '#0B0B0B', w = 72) {
  const draw = FISH[species] || FISH.mojarra;
  return svg(w, Math.round(w / 2), '0 0 48 24', draw(color));
}
