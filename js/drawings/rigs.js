// Vertical drawings of line rigs, generated from the parts list in js/data/rigs.js:
// from the main line (top) to the hook (bottom), each piece named on the right.

const X = 66; // the line runs down this x
const LABEL_X = 112;
const W = 330;
const C = {
  line: '#1E5A38', // the line: green, still shade
  leader: '#8A4300', // the other line: orange, still shade
  wire: '#6B6B66', // metal
  yellow: '#FFC400',
  red: '#C8102E',
  lead: '#6B6B66',
  muted: '#55554F',
};

function wrap(text, max) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Glyphs drawn centered at (x, y0..y0+h). Each returns { h, svg }.
const GLYPH = {
  line: () => ({ h: 34, svg: '' }),
  stop: (x, y) => ({ h: 24, svg: `<path d="M${x - 9} ${y + 12} h18" stroke="${C.leader}" stroke-width="5" stroke-linecap="round"/><path d="M${x + 8} ${y + 12} l9 -6 M${x + 8} ${y + 12} l9 5" stroke="${C.leader}" stroke-width="2" stroke-linecap="round"/>` }),
  bead: (x, y) => ({ h: 22, svg: `<circle cx="${x}" cy="${y + 11}" r="6.5" fill="#FFFFFF" stroke="#0B0B0B" stroke-width="1.5"/>` }),
  float: (x, y) => ({ h: 70, svg: `<path d="M${x} ${y + 4} C${x + 16} ${y + 14} ${x + 17} ${y + 42} ${x} ${y + 66} C${x - 17} ${y + 42} ${x - 16} ${y + 14} ${x} ${y + 4}Z" fill="#FFFFFF" stroke="#0B0B0B" stroke-width="2"/><path d="M${x - 13.5} ${y + 28} C${x - 13} ${y + 18} ${x - 8} ${y + 10} ${x} ${y + 4} C${x + 8} ${y + 10} ${x + 13} ${y + 18} ${x + 13.5} ${y + 28}Z" fill="${C.yellow}" stroke="#0B0B0B" stroke-width="2"/><path d="M${x} ${y} v70" stroke="#0B0B0B" stroke-width="1" stroke-dasharray="2 3"/>` }),
  plop: (x, y) => ({ h: 64, svg: `<path d="M${x - 15} ${y + 8} Q${x} ${y + 18} ${x + 15} ${y + 8} L${x + 7} ${y + 58} Q${x} ${y + 62} ${x - 7} ${y + 58} Z" fill="${C.yellow}" stroke="#0B0B0B" stroke-width="2" stroke-linejoin="round"/><path d="M${x - 15} ${y + 8} Q${x} ${y - 2} ${x + 15} ${y + 8}" fill="#FFFFFF" stroke="#0B0B0B" stroke-width="2"/>` }),
  'float-small': (x, y) => ({ h: 64, svg: `<path d="M${x} ${y + 4} C${x + 7} ${y + 18} ${x + 7} ${y + 44} ${x} ${y + 60} C${x - 7} ${y + 44} ${x - 7} ${y + 18} ${x} ${y + 4}Z" fill="#FFFFFF" stroke="#0B0B0B" stroke-width="2"/><path d="M${x - 5.6} ${y + 22} C${x - 5} ${y + 14} ${x - 2} ${y + 8} ${x} ${y + 4} C${x + 2} ${y + 8} ${x + 5} ${y + 14} ${x + 5.6} ${y + 22}Z" fill="${C.yellow}" stroke="#0B0B0B" stroke-width="1.5"/>` }),
  'sinker-sliding': (x, y) => ({ h: 44, svg: `<ellipse cx="${x}" cy="${y + 22}" rx="11" ry="18" fill="${C.lead}" stroke="#0B0B0B" stroke-width="2"/><path d="M${x} ${y + 2} v40" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="3 3"/>` }),
  'sinker-fixed': (x, y) => ({ h: 52, svg: `<circle cx="${x}" cy="${y + 6}" r="4" fill="none" stroke="#0B0B0B" stroke-width="2"/><path d="M${x} ${y + 10} C${x + 15} ${y + 22} ${x + 16} ${y + 44} ${x} ${y + 50} C${x - 16} ${y + 44} ${x - 15} ${y + 22} ${x} ${y + 10}Z" fill="${C.lead}" stroke="#0B0B0B" stroke-width="2"/>` }),
  swivel: (x, y) => ({ h: 40, svg: `<circle cx="${x}" cy="${y + 7}" r="5" fill="none" stroke="${C.lead}" stroke-width="2.4"/><rect x="${x - 5}" y="${y + 12}" width="10" height="16" rx="3" fill="${C.lead}" stroke="${C.lead}" stroke-width="2"/><circle cx="${x}" cy="${y + 33}" r="5" fill="none" stroke="${C.lead}" stroke-width="2.4"/>` }),
  'split-shot': (x, y) => ({ h: 24, svg: `<circle cx="${x}" cy="${y + 12}" r="6" fill="${C.lead}" stroke="#0B0B0B" stroke-width="1.5"/>` }),
  hook: (x, y) => ({ h: 56, svg: `<circle cx="${x}" cy="${y + 5}" r="4" fill="none" stroke="${C.lead}" stroke-width="2.4"/><path d="M${x} ${y + 9} V${y + 38} a11 11 0 0 1 -22 0 v-6" fill="none" stroke="${C.lead}" stroke-width="3" stroke-linecap="round"/><path d="M${x - 22} ${y + 32} l5 6" stroke="${C.lead}" stroke-width="2.6" stroke-linecap="round"/>` }),
  dough: (x, y) => ({ h: 52, svg: `<circle cx="${x}" cy="${y + 26}" r="22" fill="#E8C98A" stroke="#0B0B0B" stroke-width="2"/><circle cx="${x - 8}" cy="${y + 19}" r="2" fill="#B08A48"/><circle cx="${x + 7}" cy="${y + 31}" r="2" fill="#B08A48"/><circle cx="${x + 9}" cy="${y + 16}" r="1.6" fill="#B08A48"/>` }),
  popup: (x, y) => ({ h: 26, svg: `<circle cx="${x - 11}" cy="${y + 12}" r="8" fill="${C.yellow}" stroke="#0B0B0B" stroke-width="2"/>` }),
};

// Line segments that take the color of the piece.
const SEGMENT = { line: C.line, leader: C.leader, wire: C.wire };
const SEGMENT_H = { line: 34, leader: 70, wire: 56 };

function labelBlock(part, y, h) {
  const lines = wrap(part.label, 21);
  const meas = part.measure ? wrap(part.measure, 25) : [];
  const total = lines.length * 21 + meas.length * 19;
  let ty = y + Math.max(16, (h - total) / 2 + 15);
  let out = '';
  for (const l of lines) {
    out += `<text x="${LABEL_X}" y="${ty}" font-family="Barlow, sans-serif" font-weight="700" font-size="18" fill="#0B0B0B">${esc(l)}</text>`;
    ty += 21;
  }
  for (const l of meas) {
    out += `<text x="${LABEL_X}" y="${ty - 1}" font-family="Barlow, sans-serif" font-weight="500" font-size="16" fill="${C.muted}">${esc(l)}</text>`;
    ty += 19;
  }
  return { svg: out, h: total + 8 };
}


/** SVG drawing of a rig. */
export function rigSvg(rig) {
  let y = 10;
  let body = '';
  let lineStart = y;
  let lineColor = C.line;
  const segments = []; // [y0, y1, color]
  for (const part of rig.parts) {
    if (part.kind === 'dropper') {
      // A side branch: loop on the main line, leader to the left, hook at its end.
      const leader = part.branch.find((b) => b.kind === 'leader' || b.kind === 'wire');
      const hook = part.branch.find((b) => b.kind === 'hook');
      const label = [part.label, leader && `${leader.label}${leader.measure ? ` ${leader.measure}` : ''}`, hook?.label].filter(Boolean).join(' · ');
      const lb = labelBlock({ label }, y, 92);
      const h = Math.max(92, lb.h);
      const by = y + 14;
      const color = leader?.kind === 'wire' ? C.wire : C.leader;
      body += `<circle cx="${X}" cy="${by}" r="5" fill="none" stroke="${C.line}" stroke-width="2.2"/>`
        + `<path d="M${X - 5} ${by} C${X - 30} ${by} ${X - 40} ${by + 6} ${X - 52} ${by + 22} L${X - 52} ${by + 40}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`
        + GLYPH.hook(X - 52, by + 36).svg;
      body += lb.svg;
      y += h;
      continue;
    }
    if (SEGMENT[part.kind]) {
      const lb = labelBlock(part, y, SEGMENT_H[part.kind]);
      const h = Math.max(SEGMENT_H[part.kind], lb.h);
      segments.push([y, y + h, SEGMENT[part.kind]]);
      if (part.kind !== 'line') body += `<path d="M${X + 14} ${y + 4} v${h - 8}" stroke="${C.muted}" stroke-width="1.2"/><path d="M${X + 10} ${y + 4} h8 M${X + 10} ${y + h - 4} h8" stroke="${C.muted}" stroke-width="1.2"/>`;
      body += lb.svg;
      lineColor = SEGMENT[part.kind];
      y += h;
      continue;
    }
    const g = (GLYPH[part.kind] || GLYPH.bead)(X, y);
    const lb = labelBlock(part, y, g.h);
    const h = Math.max(g.h, lb.h);
    const gy = (h - g.h) / 2;
    const gg = (GLYPH[part.kind] || GLYPH.bead)(X, y + gy);
    // The line keeps running through floats, beads and sliding sinkers; it ends at the hook or the fixed sinker.
    if (part.kind !== 'hook' && part.kind !== 'sinker-fixed') segments.push([y, y + h, lineColor]);
    else segments.push([y, y + gy + 6, lineColor]);
    body += gg.svg + lb.svg;
    body += `<path d="M${X + 22} ${y + h / 2} H${LABEL_X - 8}" stroke="#C9C9C2" stroke-width="1" stroke-dasharray="2 3"/>`;
    y += h;
  }
  const lines = segments.map(([a, b, c]) => `<path d="M${X} ${a} V${b}" stroke="${c}" stroke-width="${c === C.wire ? 3.4 : 2.6}"/>`).join('');
  const height = Math.ceil(y + 10);
  return `<svg viewBox="0 0 ${W} ${height}" width="${W}" height="${height}" role="img" aria-label="${esc(`Dibujo del armado ${rig.name}`)}">${lines}${body}</svg>`;
}

export const RIG_KEY = [
  { color: C.line, label: 'Madre (nylon 0,30)' },
  { color: C.leader, label: 'Brazolada' },
  { color: C.wire, label: 'Acero' },
];
