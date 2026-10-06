// Step-by-step knot drawings, drawn in code (no third-party images).
// Every drawing is a 330 x 170 schematic. The system (see docs/spec.md, Nudos):
//  - Color says what something is. Lines: green is the line, orange the other line
//    (in knots that join two), dark gray the hook, blue-gray steel wire, brass the
//    sleeve, black the tools. Red is movement, blue is force, light blue is water.
//  - For each line, the shade says what happens to it in this step: dark, it stays
//    still; strong, it moves now; light, it was placed in an earlier step.
//  - The tip ends in a diamond. Dashed red arrow: where what moves goes. Blue: pull
//    (one thick arrow), hold (two arrows squeezing) and open (two arrows apart).
//  - Over/under comes from depth: knots drawn in 3D (knot3d.js) take it from where the
//    line is in space; the others, from the depth given to each piece of a scene.
//    Only where two lines of the same shade cross does the one on top get an edge in
//    the paper color, so you can tell which goes over. The edge belongs to the
//    crossing, not to the step: it stays in later steps.

import { sample, figure, warp, pinch, pullAlong, endOf, render } from './knot3d.js';

const L1 = { still: '#1E5A38', move: '#1FA34A', done: '#A9DBB5' }; // the line
const L2 = { still: '#8A4300', move: '#F07C00', done: '#F7CC9E' }; // the other line
const WIRE = { still: '#7E8C96', move: '#2E4A5E', done: '#CDD5DA' }; // steel wire, blue-gray
const METAL = '#4E4E49'; // hooks: dark gray
const BRASS = '#B8902E'; // swivels and crimp sleeves
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
    going left (dir -1) or right (dir 1). Like a spring: the front of each turn crosses the
    line whole; the back is the same line, faded, drawn before the line. end is where the
    last turn finishes, at the bottom. */
function coil(x0, y, n, d, a, color, dir = -1, w = 5) {
  let back = '';
  let front = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + dir * i * d;
    back += `<path d="M${x} ${y + a} L${x + dir * d / 2} ${y - a}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" opacity="0.4"/>`;
    front += path(`M${x + dir * d / 2} ${y - a} L${x + dir * d} ${y + a}`, color, w);
  }
  return { back, front, end: [x0 + dir * n * d, y + a] };
}

/** Two strands twisted together between x0 and x1, swapping between y1 and y2 n times. */
function twistV1(x0, x1, y1, y2, n, cA, cB, w = 4) {
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
function place(d, x, y, s = 1, flip = 1, flipY = 1) {
  return d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, px, py) => `${+(x + flip * s * px).toFixed(1)} ${+(y + flipY * s * py).toFixed(1)}`);
}

/** Overhand knot around (x, y): the line comes in at (x - 34s, y) and leaves at
    (x + 36s, y - 14s); flip = -1 mirrors it. st draws a piece, ov a piece that crosses
    over the same line. */
function overhandV1(x, y, color, { s = 1, flip = 1, st = seg, ov = over } = {}) {
  const p = (d) => place(d, x, y, s, flip);
  return st(p('M0 10 C7 11 11 4 11 -6'), color)
    + st(p('M-34 0 C-14 0 4 2 14 -8 C22 -16 16 -32 0 -32 C-16 -32 -20 -18 -14 -8'), color)
    + ov(p('M-14 -8 C-10 0 -6 8 0 10'), color)
    + ov(p('M11 -6 C12 -12 20 -14 36 -14'), color);
}

/** Overhand knot around (x, y), size s; flip = -1 mirrors it. The line comes in at
    (x - 56s, y + 10s) and leaves at (x + 56s, y - 30s). Three crossings: over, under, over. */
function overhand(x, y, color, { s = 1, flip = 1, w = 5 } = {}) {
  const p = (d) => place(d, x, y, s, flip);
  return path(p('M0 24 C10 26 14 16 10 6 C8 -2 6 -8 8 -16'), color, w)
    + path(p('M-56 10 L-12 10 C0 10 18 4 22 -10 C26 -26 10 -36 -4 -34 C-18 -32 -26 -16 -18 -2'), color, w)
    + over(p('M-18 -2 C-14 8 -10 22 0 24'), color, w)
    + over(p('M8 -16 C10 -26 26 -32 56 -30'), color, w);
}

/** Two strands twisted together between x0 and x1 around y (half-height a), n crossings;
    at each crossing the strand on top gets the paper edge, and the top alternates. */
function twist(x0, x1, y, a, n, cA, cB, w = 5) {
  const step = (x1 - x0) / n;
  let s = '';
  for (let i = 0; i < n; i++) {
    const xa = x0 + i * step;
    const xb = xa + step;
    const u = i % 2 ? 1 : -1;
    s += path(`M${xa} ${y - u * a} C${xa + step / 2} ${y - u * a} ${xa + step / 2} ${y + u * a} ${xb} ${y + u * a}`, cB, w)
      + over(`M${xa} ${y + u * a} C${xa + step / 2} ${y + u * a} ${xa + step / 2} ${y - u * a} ${xb} ${y - u * a}`, cA, w);
  }
  return s;
}

/** Part of a line hidden behind an object: dots of the line's color, drawn on top of it. */
const hidden = (d, color, w = 5) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="0.1 ${w + 4}"/>`;

const poly = (pts) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');

/** Doubled line along d: two real strands g away from it on each side. With bend, they
    join in a U at the end of d; the start stays open. Returns the whole outline as one
    open path (d) and the two strands' last points (ea, eb). */
function doubled(d, g = 5, bend = true) {
  const p = sample(d);
  const A = [];
  const B = [];
  for (let i = 0; i < p.length; i++) {
    const [x0, y0] = p[Math.max(0, i - 1)];
    const [x1, y1] = p[Math.min(p.length - 1, i + 1)];
    const L = Math.hypot(x1 - x0, y1 - y0) || 1;
    const [nx, ny] = [-(y1 - y0) / L, (x1 - x0) / L];
    A.push([p[i][0] + nx * g, p[i][1] + ny * g]);
    B.push([p[i][0] - nx * g, p[i][1] - ny * g]);
  }
  const U = [];
  if (bend) {
    const [ex, ey] = p[p.length - 1];
    const [px, py] = p[p.length - 3];
    const L = Math.hypot(ex - px, ey - py) || 1;
    const [ux, uy] = [(ex - px) / L, (ey - py) / L];
    for (let k = 1; k < 12; k++) {
      const a = Math.PI * k / 12;
      U.push([ex - uy * g * Math.cos(a) + ux * g * Math.sin(a), ey + ux * g * Math.cos(a) + uy * g * Math.sin(a)]);
    }
  }
  const out = bend ? poly([...A, ...U, ...[...B].reverse()]) : `${poly(A)} ${poly(B)}`; // open ends stay open
  return { d: out, ea: A[A.length - 1], eb: B[B.length - 1] };
}
/** Doubled line drawn in a color; over adds the paper edge to both strands. */
const dline = (d, color, { bend = true, edged = false, g = 5 } = {}) => {
  const o = doubled(d, g, bend);
  return (edged ? edge(o.d) : '') + path(o.d, color);
};

/* ---------- Scenes: lines with depth ----------
   A scene is a list of strands (lines drawn as one continuous run, piece after piece) and
   objects, each at a depth z: what is deeper is drawn first, what is nearer covers it.
   The drawing order, the paper edge (only where two lines of the same shade cross) and
   the continuity of each strand come out of the depths, not from hand ordering. */

/** A strand: pieces that follow each other; each piece is { d, c (color), z (depth, or
    [at start, at end]), w, dbl (doubled line), g (half gap of the doubled line), bend
    (the doubled line ends in a bend), zl ([z of one strand, z of the other], doubled) }. */
const strand = (...pieces) => ({ pieces });
/** An object (hook, spool, tip, arrow…) at depth z. */
const at = (z, svg) => ({ z, svg });

/** Lanes of a piece: one polyline, or two for a doubled line (joined by the bend). Each
    point carries t, its fraction along the piece. */
function lanes(p) {
  const pts = sample(p.d, 2.5);
  const len = [0];
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = len[len.length - 1] || 1;
  const tt = len.map((l) => l / total);
  if (!p.dbl) return [{ pts, t: tt, lane: 0 }];
  const g = p.g ?? 5;
  const A = [];
  const B = [];
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[Math.max(0, i - 1)];
    const [x1, y1] = pts[Math.min(pts.length - 1, i + 1)];
    const L = Math.hypot(x1 - x0, y1 - y0) || 1;
    const [nx, ny] = [-(y1 - y0) / L, (x1 - x0) / L];
    A.push([pts[i][0] + nx * g, pts[i][1] + ny * g]);
    B.push([pts[i][0] - nx * g, pts[i][1] - ny * g]);
  }
  if (!p.bend) return [{ pts: A, t: tt, lane: 0 }, { pts: B, t: tt, lane: 1 }];
  const [ex, ey] = pts[pts.length - 1];
  const [qx, qy] = pts[Math.max(0, pts.length - 3)];
  const L = Math.hypot(ex - qx, ey - qy) || 1;
  const [ux, uy] = [(ex - qx) / L, (ey - qy) / L];
  const U = [];
  for (let k = 1; k < 12; k++) {
    const a = (Math.PI * k) / 12;
    U.push([ex - uy * g * Math.cos(a) + ux * g * Math.sin(a), ey + ux * g * Math.cos(a) + uy * g * Math.sin(a)]);
  }
  return [{ pts: A, t: tt, lane: 0 }, { pts: [A[A.length - 1], ...U, B[B.length - 1]], t: U.map(() => 1).concat([1, 1]), lane: 2 }, { pts: B, t: tt, lane: 1 }];
}

function crosses([a, b], [c, d]) {
  const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  return o(a, b, c) !== o(a, b, d) && o(c, d, a) !== o(c, d, b);
}

/** Draws a scene. Throws if a strand has a gap (a piece that does not start where the
    previous one ended). */
/** Paper edge at crossings: 'same' (only two lines of the same shade) or 'all'. */
const EDGE_MODE = 'same';
const EDGE_REACH = 3; // segments on each side of a crossing that also get the edge

function scene(...items) {
  const parts = [];
  let order = 0;
  let sid = 0;
  const ends = [];
  for (const it of items.flat()) {
    if (typeof it === 'string') {
      parts.push({ z: 50, order: order++, svg: it });
      continue;
    }
    if (it.svg !== undefined) {
      parts.push({ z: it.z, order: order++, svg: it.svg });
      continue;
    }
    sid++;
    const last = {};
    let first = true;
    for (const p of it.pieces) {
      for (const L of lanes(p)) {
        const key = L.lane === 2 ? 'bend' : L.lane;
        if (L.lane !== 2 && last[key]) {
          const [x, y] = L.pts[0];
          if (Math.hypot(x - last[key][0], y - last[key][1]) > 3) throw new Error(`Tramo suelto: ${p.d.slice(0, 40)}`);
        }
        if (L.lane !== 2 && first) ends.push(L.pts[0]);
        const [za, zb] = Array.isArray(p.z) ? p.z : [p.z ?? 0, p.z ?? 0];
        const zLane = p.zl && L.lane !== 2 ? p.zl[L.lane] : 0;
        for (let i = 0; i + 1 < L.pts.length; i++) {
          const tm = (L.t[i] + L.t[i + 1]) / 2;
          const edgeOfLane = i === 0 || i + 2 === L.pts.length; // first or last segment: where pieces join
          parts.push({ z: za + (zb - za) * tm + zLane, order: order++, seg: [L.pts[i], L.pts[i + 1]], c: p.c, w: p.w ?? 5, sid, piece: p, lane: L.lane, joint: edgeOfLane });
        }
        if (L.lane !== 2) last[key] = L.pts[L.pts.length - 1];
      }
      first = false;
    }
    for (const k of [0, 1]) if (last[k]) ends.push(last[k]);
  }
  parts.sort((a, b) => a.z - b.z || a.order - b.order);
  // Paper edge on a segment that crosses, over it, a segment of the same shade.
  const segs = parts.filter((x) => x.seg);
  segs.forEach((s, i) => {
    s.edge = false;
    for (let j = 0; j < i && !s.edge; j++) {
      const o = segs[j];
      if ((EDGE_MODE === 'same' && o.c !== s.c) || (o.z === s.z && o.piece === s.piece && o.lane === s.lane)) continue;
      // Segments that follow each other along the same line touch but do not cross.
      const touch = [o.seg[0], o.seg[1]].some((p) => [s.seg[0], s.seg[1]].some((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.5));
      const next = touch && o.sid === s.sid && ((o.piece === s.piece && o.lane === s.lane && Math.abs(o.order - s.order) === 1) || (o.joint && s.joint));
      if (!next && crosses(s.seg, o.seg)) s.edge = true;
    }
  });
  // Spread the edge a little along the line, so it reads as a cut and not as a speck.
  const byRun = new Map();
  for (const x of segs) {
    const k = byRun.get(x.piece)?.get(x.lane) ?? [];
    if (!byRun.has(x.piece)) byRun.set(x.piece, new Map());
    byRun.get(x.piece).set(x.lane, k);
    k.push(x);
  }
  for (const lanesOf of byRun.values()) {
    for (const list of lanesOf.values()) {
      list.sort((a, b) => a.order - b.order);
      const hit = list.map((x) => x.edge);
      list.forEach((x, i) => {
        for (let j = Math.max(0, i - EDGE_REACH); j <= Math.min(list.length - 1, i + EDGE_REACH); j++) if (hit[j]) x.edge = true;
      });
    }
  }
  // Runs of consecutive segments of the same piece and lane, drawn as one polyline.
  let out = '';
  let run = null;
  const flush = () => {
    if (!run) return;
    const d = 'M' + run.pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
    out += (run.edge ? `<path d="${d}" fill="none" stroke="${PAPER}" stroke-width="${run.w + 5}" stroke-linecap="butt" stroke-linejoin="round"/>` : '')
      + `<path d="${d}" fill="none" stroke="${run.c}" stroke-width="${run.w}" stroke-linecap="round" stroke-linejoin="round"${run.piece.fade ? ' opacity="0.45"' : ''}/>`;
    run = null;
  };
  for (const x of parts) {
    if (x.svg !== undefined) {
      flush();
      out += x.svg;
      continue;
    }
    const [a, b] = x.seg;
    const prev = run && run.pts[run.pts.length - 1];
    if (run && run.piece === x.piece && run.lane === x.lane && run.edge === x.edge && Math.hypot(prev[0] - a[0], prev[1] - a[1]) < 0.01) run.pts.push(b);
    else {
      flush();
      run = { pts: [a, b], piece: x.piece, lane: x.lane, edge: x.edge, c: x.c, w: x.w };
    }
  }
  flush();
  return out + ends.map(([x, y]) => `<path data-end="1" d="M${x.toFixed(1)} ${y.toFixed(1)}" fill="none" stroke="none"/>`).join('');
}

/** Pieces of the overhand base piece, in the order the line goes, with their depths:
    over, under, over. Placed with place(); dbl makes it with a doubled line. */
function overhandPieces(c, { x, y, k = 1, fx = 1, fy = 1, dbl = false, g = 5 } = {}) {
  const P = (d) => place(d, x, y, k, fx, fy);
  const o = { c, dbl, g };
  return [
    { ...o, d: P('M-56 10 L-12 10 C0 10 18 4 22 -10 C26 -26 10 -36 -4 -34'), z: -0.5 }, // in, up the right side, over the top
    { ...o, d: P('M-4 -34 C-18 -32 -26 -16 -18 -2'), z: 0.5 }, // down the left side
    { ...o, d: P('M-18 -2 C-14 8 -10 22 0 24'), z: 1 }, // over the incoming line
    { ...o, d: P('M0 24 C10 26 14 16 10 6 C8 -2 6 -8 8 -16'), z: -1 }, // up, under the right side
    { ...o, d: P('M8 -16 C10 -26 26 -32 56 -30'), z: 1 }, // out, over it
  ];
}
/** Where the overhand base piece starts, ends, and has the bottom of its loop. */
const overhandAt = ({ x, y, k = 1, fx = 1, fy = 1 }) => ({
  in: [x - 56 * k * fx, y + 10 * k * fy], out: [x + 56 * k * fx, y - 30 * k * fy], top: [x - 4 * k * fx, y - 34 * k * fy],
});
/** Wraps of a strand around a line along y (front over the line, back under it). */
function coilPieces(x0, y, n, d, a, c, dir = -1) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const x = x0 + dir * i * d;
    out.push({ c, d: `M${x} ${y + a} L${x + dir * d / 2} ${y - a}`, z: -1, fade: true });
    out.push({ c, d: `M${x + dir * d / 2} ${y - a} L${x + dir * d} ${y + a}`, z: 1 });
  }
  return out;
}
/** Eye of a hook as two halves at depths: lines at depth 0 go through it. */
const eyeParts = (x, y, r = 9) => [at(-3, `<path d="M${x} ${y + r} A${r} ${r} 0 0 1 ${x} ${y - r}" fill="none" stroke="${METAL}" stroke-width="5"/>`), at(3, ringFront(x, y, r))];
const front = (svg) => at(50, svg);

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
const spool = (x, y) => `<rect x="${x - 22}" y="${y - 50}" width="44" height="100" rx="6" fill="#E4E4DE" stroke="#8A8A84" stroke-width="3"/><rect x="${x - 32}" y="${y - 58}" width="64" height="10" rx="4" fill="#8A8A84"/><rect x="${x - 32}" y="${y + 48}" width="64" height="10" rx="4" fill="#8A8A84"/>`;

/** Soft lure with its eye at (x, y), body to the right. */
const lure = (x, y) => `${ring(x, y, 8)}<path d="M${x + 8} ${y} C${x + 22} ${y - 20} ${x + 58} ${y - 18} ${x + 70} ${y - 4} L${x + 82} ${y - 13} L${x + 79} ${y} L${x + 82} ${y + 13} L${x + 70} ${y + 4} C${x + 58} ${y + 18} ${x + 22} ${y + 20} ${x + 8} ${y}Z" fill="${YELLOW}" stroke="#0B0B0B" stroke-width="2"/><circle cx="${x + 24}" cy="${y - 4}" r="3" fill="#0B0B0B"/>`;

/** Crimp sleeve, see-through so the wire inside shows. */
/** Crimp sleeve (brass). Lines inside it are drawn with hidden() on top. */
const sleeve = (x, y, crushed = false) => `<rect x="${x - 18}" y="${y - (crushed ? 8 : 13)}" width="36" height="${crushed ? 16 : 26}" rx="5" fill="${BRASS}" stroke="#7A5E18" stroke-width="2"/>`;

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

/** Every part of a figure in one color. */
const allParts = (fig, c) => Object.fromEntries(fig.parts.map((n) => [n, c]));
/** A step drawn in 3D: the figures, then the rest (tip, arrows, texts). Its crossings are
    kept for the tests and the review. */
const step3 = (items, ...rest) => {
  const r = render(items, PAPER);
  // { back: svg }: an object behind the lines (a spool); dotted parts go behind it.
  const back = rest.filter((x) => x?.back).map((x) => x.back).join('');
  const dotted = r.svg.match(/<path[^>]*stroke-dasharray="0\.1[^>]*>/g)?.join('') ?? '';
  const svg = back ? back + r.svg.replace(/<path[^>]*stroke-dasharray="0\.1[^>]*>/g, '') + dotted : r.svg;
  // { tight: true }: the knot pulled tight (its crossings closer together, rule 24).
  return { svg: scene(svg, ...rest.filter((x) => !x?.back && !x?.tight)), crossings: r.crossings, close: r.close, tight: rest.some((x) => x?.tight) };
};
const tipAt = (fig, upTo, c) => { const [x, y, a] = endOf(fig, upTo); return tip(x, y, a, c); };
/** The overhand base piece as parts of a figure: its five pieces with their depths (over,
    under, over), blended smoothly where one piece meets the next. names: one name for the
    whole knot, or two: [going around (the first three pieces, up to the tip crossing over
    itself), through the loop (the last two)]. */
function overhand3(names, k, zIn = 0, zOut = 1, tail = 56) {
  const pcs = overhandPieces(null, k);
  // A shorter way out (tail: where it ends, in the piece's units): for a stopper close by.
  if (tail !== 56) pcs[4] = { ...pcs[4], d: place(`M8 -16 C10 -26 18 -30 ${tail} -30`, k.x, k.y, k.k ?? 1, k.fx ?? 1, k.fy ?? 1) };
  const len = (d) => { const q = sample(d); let l = 0; for (let i = 1; i < q.length; i++) l += Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]); return l; };
  const part = (name, list, z0, z1) => {
    const lens = list.map((p) => len(p.d));
    const total = lens.reduce((x, y) => x + y, 0);
    const stops = [[0, z0]];
    let at0 = 0;
    list.forEach((p, i) => {
      stops.push([(at0 + lens[i] * 0.3) / total, p.z], [(at0 + lens[i] * 0.7) / total, p.z]);
      at0 += lens[i];
    });
    stops.push([1, z1]);
    return { name, d: list.map((p, i) => (i ? p.d.replace(/^M[^A-Z]*/, '') : p.d)).join(' '), z: stops };
  };
  if (typeof names === 'string') return [part(names, pcs, zIn, zOut)];
  const mid = (pcs[2].z + pcs[3].z) / 2;
  return [part(names[0], pcs.slice(0, 3), zIn, mid), part(names[1], pcs.slice(3), mid, zOut)];
}
/** Where the overhand base piece's tip is after going around (end of the third piece). */
const overhandMid = (k) => { const q = sample(overhandPieces(null, k)[2].d); return q[q.length - 1]; };

/* Nudo de carrete (arbor knot), in 3D. The layout copies the simplest guides (rule 34):
   the reel seen from the side, the line around the spool (dotted: behind the flange), an
   overhand around the line, another overhand at the tip, and the knot pulled down to the
   spool. The knots follow the references (Netknots, Wired2Fish): the tip goes under the
   line, back over it and through the loop, so the line runs through the first knot.
   Pulled, the first knot slides down to the spool and the stopper jams against it. */
const REEL = { x: 60, y: 85, r: 38, a: 16 }; // flange and spool (arbor) radius
const reel = ({ x, y, r, a }) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#E4E4DE" stroke="#8A8A84" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${a}" fill="none" stroke="#8A8A84" stroke-width="2"/><rect x="${x - 5}" y="${y - r - 12}" width="10" height="12" fill="#8A8A84"/><rect x="${x - 16}" y="${y - r - 16}" width="32" height="6" rx="2" fill="#8A8A84"/>`;
const CA_Y = REEL.y - REEL.a; // the line runs along the top of the spool
const CA_EDGE = REEL.x + REEL.r; // where the line comes out from behind the flange
const CK1 = { x: 170, y: CA_Y + 8 }; // the first overhand: the line passes through its loop
const CA_TAIL = 30; // its way out, short: the stopper ties close to it
const CK2 = { x: 236, y: CA_Y - 30, k: 0.6 }; // the stopper
const caK1in = overhandAt(CK1).in;
const caK1out = [CK1.x + CA_TAIL, CK1.y - 30];
const caK2in = overhandAt(CK2).in;
const caK2out = overhandAt(CK2).out;
const caLine = (x0) => [
  { name: 'línea', d: `M${x0} ${CA_Y} H${CA_EDGE}`, z: 0 },
  { name: 'alrededor de la bobina', d: `M${CA_EDGE} ${CA_Y} H${REEL.x} C${REEL.x - 22} ${CA_Y} ${REEL.x - 22} ${REEL.y + REEL.a} ${REEL.x} ${REEL.y + REEL.a} H${CA_EDGE}`, z: 0 },
  { name: 'al nudo', d: `M${CA_EDGE} ${REEL.y + REEL.a} C${CA_EDGE + 10} ${REEL.y + REEL.a} ${caK1in[0] - 10} ${caK1in[1]} ${caK1in[0]} ${caK1in[1]}`, z: 0 },
  ...overhand3('primer nudo', CK1, 0, 1, CA_TAIL),
];
const CA1 = figure(...caLine(316), { name: 'punta', d: `M${caK1out[0]} ${caK1out[1]} C${caK1out[0] + 14} ${caK1out[1]} ${caK1out[0] + 30} ${caK1out[1]} ${caK1out[0] + 44} ${caK1out[1]}`, z: 1 });
const caKnots = (x0) => figure(...caLine(x0),
  { name: 'entre nudos', d: `M${caK1out[0]} ${caK1out[1]} C${caK1out[0] + 1} ${caK1out[1]} ${caK2in[0] - 1} ${caK2in[1]} ${caK2in[0]} ${caK2in[1]}`, z: 1 },
  ...overhand3('tope', CK2, 1, 1),
  { name: 'sobrante', d: `M${caK2out[0]} ${caK2out[1]} C${caK2out[0] + 8} ${caK2out[1] - 2} ${caK2out[0] + 16} ${caK2out[1]} ${caK2out[0] + 22} ${caK2out[1] + 3}`, z: 1 });
const CA2 = caKnots(316);
// Pulled: the stretch to the first knot shrinks, the knots close to half their size
// around the line and the stopper ends up against the first knot.
const CA_KS = 0.5; // how much the knots shrink
const CA_STOPS = [[CA_EDGE, CA_EDGE], [caK1in[0], CA_EDGE + 12], [caK1out[0], CA_EDGE + 12 + (caK1out[0] - caK1in[0]) * CA_KS],
  [caK2in[0], CA_EDGE + 13 + (caK1out[0] - caK1in[0]) * CA_KS], [caK2out[0] + 22, CA_EDGE + 13 + (caK1out[0] - caK1in[0]) * CA_KS + (caK2out[0] + 22 - caK2in[0]) * 0.65]];
const caPull = pullAlong(CA_STOPS, CA_Y, (x) => (x < CA_EDGE ? 1 : x < caK1in[0] ? 1 - ((x - CA_EDGE) / (caK1in[0] - CA_EDGE)) * 0.5 : 0.5));
const caEnd = CA_STOPS[CA_STOPS.length - 1];
const CA3 = warp(caKnots(caEnd[0] + (296 - caEnd[1])), caPull); // the line still ends at x = 296
const caColors = (fig, c, over = {}) => ({ ...allParts(fig, c), ...over, 'alrededor de la bobina': `dotted:${over['alrededor de la bobina'] ?? c}` });
const REEL_SVG = reel(REEL);
const CARRETE = [
  step3([{ fig: CA1, colors: caColors(CA1, L1.move, { 'línea': L1.still }) }], tipAt(CA1, null, L1.move),
    text(320, 158, 'nudo simple alrededor de la línea', 'end'), { back: REEL_SVG }),
  step3([{ fig: CA2, colors: caColors(CA2, L1.done, { 'línea': L1.still, 'entre nudos': L1.move, 'tope': L1.move, 'sobrante': L1.move }) }],
    tipAt(CA2, null, L1.move), text(320, 158, 'otro nudo simple: el tope', 'end'), { back: REEL_SVG }),
  step3([{ fig: CA3, colors: caColors(CA3, L1.move) }], tipAt(CA3, null, L1.move), pull(`M300 ${CA_Y} H304`), drop(250, 120),
    text(320, 158, 'baja a la bobina y el tope lo traba', 'end'), { back: REEL_SVG }, { tight: true }),
  step3([{ fig: CA3, colors: caColors(CA3, L1.done) }], tipAt(CA3, null, L1.done), scissors(240, 36), { back: REEL_SVG }, { tight: true }),
];

/* Palomar, in 3D, copying the layout of guía A p. 2 (docs/referencias-nudos.md): the hook
   hangs from its eye; the line is doubled (two strands side by side, joined at the fold).
   1: the fold goes through the eye. 2: an overhand with the doubled line (the overhand
   base piece upside down, its loop hanging through the eye), the fold left over as a loop.
   3: the hook goes through that loop (one strand of the loop passes in front of the shank).
   4: pulled tight, the knot closes on the eye: the same figure squeezed toward the eye. */
const PE = { x: 214, y: 90, r: 8 }; // the hook's eye
/** The hook's eye as a ring of metal, half in front and half behind: a line crossing it
    level goes through it (left half behind, right half in front). */
const eyeRing = ({ x, y, r }) => figure(
  { name: 'ojo atrás', d: `M${x} ${y - r} C${x - r * 1.33} ${y - r} ${x - r * 1.33} ${y + r} ${x} ${y + r}`, z: [[0, 0], [0.25, -2], [0.75, -2], [1, 0]] },
  { name: 'ojo adelante', d: `M${x} ${y + r} C${x + r * 1.33} ${y + r} ${x + r * 1.33} ${y - r} ${x} ${y - r}`, z: [[0, 0], [0.25, 2], [0.75, 2], [1, 0]] });
/** The rest of the hook, hanging from the eye: shank down, bend to the left, barb. */
const hookBelow = ({ x, y, r }) => figure({ name: 'anzuelo', d: `M${x} ${y + r + 1} V${y + 38} C${x} ${y + 56} ${x - 26} ${y + 56} ${x - 26} ${y + 38} L${x - 20} ${y + 30}`, z: 0 });
const PHOOK = [{ fig: eyeRing(PE), colors: { 'ojo atrás': METAL, 'ojo adelante': METAL } }, { fig: hookBelow(PE), colors: { anzuelo: METAL } }];
/** A doubled line: the line along the parts (a figure's parts), as two strands g apart
    ("ida", toward the fold, and "vuelta", back to the tip), joined at the far end by the
    fold: a path (d, from the end of "ida" to the end of "vuelta", with its depth z) or,
    without it, a tight U. At the start the two strands open apart, so the line and the tip
    can be told apart and pulled. */
function doubledFig(parts, g = 4, fold = null, move = null, lead = null) {
  const c0 = figure(...parts).pts;
  // move: squeezes the line (a warp function) before it is doubled.
  const c = move ? c0.map((p) => { const [x, y] = move(p.x, p.y); return { ...p, x, y }; }) : c0;
  const s = [0];
  for (let i = 1; i < c.length; i++) s.push(s[i - 1] + Math.hypot(c[i].x - c[i - 1].x, c[i].y - c[i - 1].y));
  const lane = (sign, tag) => c.map((p, i) => {
    const a = c[Math.max(0, i - 2)];
    const b = c[Math.min(c.length - 1, i + 2)];
    const L = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const gg = g + Math.max(0, 30 - s[i]) * 0.4; // the two ends open apart
    return { x: p.x - ((b.y - a.y) / L) * gg * sign, y: p.y + ((b.x - a.x) / L) * gg * sign, z: p.z, part: `${p.part} (${tag})` };
  });
  const A = lane(1, 'ida');
  const B = lane(-1, 'vuelta').reverse();
  const ea = A[A.length - 1];
  const eb = B[0];
  let mid;
  if (fold) {
    mid = figure({ name: 'lazo', d: fold.d, z: fold.z }).pts.slice(1, -1);
    const f0 = mid[0];
    if (Math.hypot(f0.x - ea.x, f0.y - ea.y) > 3) throw new Error('Tramo suelto: lazo');
  } else {
    mid = Array.from({ length: 9 }, (_, k) => {
      const t = (k + 1) / 10;
      const [dx, dy] = [eb.x - ea.x, eb.y - ea.y];
      const L = Math.hypot(dx, dy) || 1;
      const [ux, uy] = [c[c.length - 1].x - c[c.length - 3].x, c[c.length - 1].y - c[c.length - 3].y];
      const U = Math.hypot(ux, uy) || 1;
      const bulge = Math.sin(Math.PI * t) * L / 2;
      return { x: ea.x + dx * t + (ux / U) * bulge, y: ea.y + dy * t + (uy / U) * bulge, z: ea.z, part: 'lazo' };
    });
  }
  // lead: the single line before the doubled stretch, from x = lead to where it doubles.
  const head = lead == null ? [] : figure({ name: 'línea', d: `M${lead} ${A[0].y.toFixed(1)} H${A[0].x.toFixed(1)}`, z: A[0].z }).pts.slice(0, -1);
  const pts = [...head, ...A, ...mid, ...B];
  return { pts, parts: [...new Set(pts.map((p) => p.part))] };
}
const PK_K = 1.25;
const PK = { x: PE.x + 4 * PK_K, y: PE.y - 34 * PK_K, k: PK_K, fy: -1 }; // the overhand: its loop hangs through the eye
const pkIn = overhandAt(PK).in;
const pkOut = overhandAt(PK).out;
const PA_D = 150; // where the line doubles (the doubled stretch is about 15 cm)
const PA_L = 22; // where the line starts
const PA1 = doubledFig([{ name: 'doble', d: `M${PA_D} ${PE.y} H${PE.x + 26}`, z: 0 }], 4, null, null, PA_L);
const paKnot = [{ name: 'doble', d: `M${PA_D} ${pkIn[1]} H${pkIn[0]}`, z: 0 }, ...overhand3('nudo', PK, 0, 0)];
const PA2 = doubledFig([...paKnot, { name: 'nudo', d: `M${pkOut[0]} ${pkOut[1]} C${pkOut[0] + 8} ${pkOut[1] + 4} ${pkOut[0] + 12} ${pkOut[1] + 12} ${pkOut[0] + 12} ${pkOut[1] + 24}`, z: 0 }], 4, null, null, PA_L);
// The loop around the hook: from the end of "ida", down in front of the shank, around
// below the bend and back up to the end of "vuelta".
const paRoundFold = (A, B) => ({
  d: `M${A[0]} ${A[1]} C${A[0] - 6} ${A[1] + 20} ${PE.x + 14} ${PE.y + 14} ${PE.x} ${PE.y + 18} C${PE.x - 32} ${PE.y + 22} ${PE.x - 52} ${PE.y + 30} ${PE.x - 52} ${PE.y + 40} C${PE.x - 52} ${PE.y + 48} ${PE.x - 40} ${PE.y + 46} ${PE.x} ${PE.y + 46} C${PE.x + 44} ${PE.y + 46} ${PE.x + 86} ${PE.y + 44} ${PE.x + 92} ${PE.y + 30} C${PE.x + 96} ${PE.y + 20} ${B[0] + 6} ${B[1] + 8} ${B[0]} ${B[1]}`,
  z: [[0, 0], [0.12, 2], [0.28, 2], [0.42, 0], [0.5, -2], [0.75, -2], [0.85, 0], [1, 0]],
});
const paEndsOf = (fig) => {
  const iA = fig.pts.findIndex((p) => p.part === 'lazo') - 1;
  const iB = fig.pts.length - 1 - [...fig.pts].reverse().findIndex((p) => p.part === 'lazo') + 1;
  return [fig.pts[iA], fig.pts[iB]];
};
const PA3 = (() => {
  const base = doubledFig([...paKnot, { name: 'nudo', d: `M${pkOut[0]} ${pkOut[1]} C${pkOut[0] + 6} ${pkOut[1] + 2} ${pkOut[0] + 10} ${pkOut[1] + 6} ${pkOut[0] + 12} ${pkOut[1] + 12}`, z: 0 }]);
  const [a, b] = paEndsOf(base);
  return doubledFig([...paKnot, { name: 'nudo', d: `M${pkOut[0]} ${pkOut[1]} C${pkOut[0] + 6} ${pkOut[1] + 2} ${pkOut[0] + 10} ${pkOut[1] + 6} ${pkOut[0] + 12} ${pkOut[1] + 12}`, z: 0 }], 4,
    paRoundFold([+a.x.toFixed(1), +a.y.toFixed(1)], [+b.x.toFixed(1), +b.y.toFixed(1)]), null, PA_L);
})();
// Pulled: the same knot, small (its loop still at the eye) and the fold, which went over
// the whole hook, now short around the shank just under the eye: in front of it on one
// side and behind it on the other.
const PKT_K = 0.7;
const PKT = { x: PE.x + 4 * PKT_K + 3, y: PE.y - 34 * PKT_K, k: PKT_K, fy: -1 }; // a little to the right: its crossings clear of the eye's front
const pktIn = overhandAt(PKT).in;
const paTight = (x0) => {
  const parts = [{ name: 'doble', d: `M${pktIn[0] - 40} ${pktIn[1]} H${pktIn[0]}`, z: 0 }, ...overhand3('nudo', PKT, 0, 0, 26)];
  const [a, b] = paEndsOf(doubledFig(parts, 3, null, null, x0)).map((p) => [+p.x.toFixed(1), +p.y.toFixed(1)]);
  return doubledFig(parts, 3, {
    d: `M${a[0]} ${a[1]} C${a[0] + 2} ${a[1] + 8} ${PE.x + 10} ${PE.y + 13} ${PE.x} ${PE.y + 14} C${PE.x - 8} ${PE.y + 15} ${PE.x - 10} ${PE.y + 18} ${PE.x - 9} ${PE.y + 21} C${PE.x - 8} ${PE.y + 24} ${PE.x - 4} ${PE.y + 25} ${PE.x} ${PE.y + 25} C${PE.x + 10} ${PE.y + 25} ${b[0] + 10} ${b[1] + 10} ${b[0]} ${b[1]}`,
    z: [[0, 0], [0.18, 2], [0.38, 2], [0.5, 0], [0.62, -2], [0.82, -2], [1, 0]],
  }, null, x0);
};
const PA4 = paTight(PA_L + 40);
const paColors = (fig, c, over = {}) => ({ ...allParts(fig, c), ...over });
const PALOMAR = [
  step3([...PHOOK, { fig: PA1, colors: paColors(PA1, L1.move) }], tipAt(PA1, null, L1.move), arrow(`M190 ${PE.y - 12} H240`), text(10, 158, 'línea doblada, 15 cm', 'start')),
  step3([...PHOOK, { fig: PA2, colors: paColors(PA2, L1.move) }], tipAt(PA2, null, L1.move), text(10, 158, 'nudo simple con la línea doble', 'start')),
  step3([...PHOOK, { fig: PA3, colors: paColors(PA3, L1.done, { lazo: L1.move }) }], tipAt(PA3, null, L1.done), text(10, 120, 'por el lazo', 'start')),
  step3([...PHOOK, { fig: PA4, colors: paColors(PA4, L1.move) }], pull('M54 74.2 H28'), pull('M133 40 L113 30'), hold(PE.x, PE.y + 30, 90), drop(110, 128), text(10, 158, 'tirar de las dos', 'start'), { tight: true }),
  step3([...PHOOK, { fig: PA4, colors: paColors(PA4, L1.done) }], tipAt(PA4, null, L1.done), scissors(160, 30), { tight: true }),
];

/* Clinch mejorado, in 3D, following Wilson p. 5 (docs/referencias-nudos.md): the line from
   the left through the eye at (250, 80), back below it and around the line in wraps (a
   real helix: each turn in front of the line and then behind it), then through the small
   loop next to the eye and through the big loop that forms. Pulled, the wraps close up
   against the eye. */
const CE = { x: 250, y: 80, r: 8 }; // the hook's eye
const CL_HOOK = [{ fig: eyeRing(CE), colors: { 'ojo atrás': METAL, 'ojo adelante': METAL } },
  { fig: figure({ name: 'anzuelo', d: `M${CE.x + CE.r + 1} ${CE.y} H298 C322 ${CE.y} 322 ${CE.y + 40} 298 ${CE.y + 40} H286 L294 ${CE.y + 32}`, z: 0 }), colors: { anzuelo: METAL } }];
const CL_W = { x: 210, n: 5, pitch: 17, a: 14 }; // the wraps: start, turns, length of a turn, half height
/** The wraps around the line (y = CE.y), from x going left: a helix seen from the side. */
function wrapsPart({ x, n, pitch, a }) {
  const steps = n * 24;
  const pts = [];
  const zs = [];
  for (let k = 0; k <= steps; k++) {
    const th = (k / steps) * n * 2 * Math.PI;
    pts.push(`${(x - (pitch * th) / (2 * Math.PI)).toFixed(1)} ${(CE.y + a * Math.cos(th)).toFixed(1)}`);
    zs.push([k / steps, Math.sin(th) * 1.2]);
  }
  return { name: 'vueltas', d: `M${pts[0]} L${pts.slice(1).join(' L')}`, z: zs };
}
const clWrapsEnd = CL_W.x - CL_W.n * CL_W.pitch;
const CL_START = [
  { name: 'línea', d: `M10 ${CE.y} H${CE.x}`, z: 0 },
  { name: 'por el ojo', d: `M${CE.x} ${CE.y} H${CE.x + 6} C${CE.x + 16} ${CE.y} ${CE.x + 16} ${CE.y + CL_W.a} ${CE.x + 2} ${CE.y + CL_W.a} H${CL_W.x}`, z: 0 },
  wrapsPart(CL_W),
];
const CL_SX = 232; // where the tip goes up through the small loop (between the wraps and the eye)
const CL_BX = 220; // where it goes down through the big loop
const clSmall = { name: 'al lazo chico', d: `M${clWrapsEnd} ${CE.y + CL_W.a} C${clWrapsEnd - 10} ${CE.y + 34} ${clWrapsEnd} ${CE.y + 46} ${clWrapsEnd + 30} ${CE.y + 46} H${CL_SX - 12} C${CL_SX - 2} ${CE.y + 46} ${CL_SX} ${CE.y + 36} ${CL_SX} ${CE.y + 24} C${CL_SX} ${CE.y + 6} ${CL_SX} ${CE.y - 8} ${CL_SX} ${CE.y - 22}`,
  z: [[0, 0], [0.7, 0], [0.8, -1], [0.88, 1], [1, 1]] };
const clBig = { name: 'por el lazo grande', d: `M${CL_SX} ${CE.y - 22} C${CL_SX} ${CE.y - 34} ${CL_BX} ${CE.y - 34} ${CL_BX} ${CE.y - 22} V${CE.y + 66}`, z: [[0, 1], [0.25, 0.5], [0.7, 0.5], [0.8, -1], [1, -1]] };
const CL1 = figure(...CL_START);
const CL2 = figure(...CL_START, clSmall);
const CL3 = figure(...CL_START, clSmall, clBig);
// Pulled: the wraps close up against the eye and the loops close around the line.
// Pulled: the wraps move up against the eye (shorter), the passes through the loops keep
// their order between them and the eye, and the loops close on the line.
const CL_STOPS = [[clWrapsEnd, 164], [CL_W.x, 213], [CL_BX, 220], [CL_SX, 234], [CE.x, CE.x]];
const clPull = pullAlong(CL_STOPS, CE.y, (x) => (x < clWrapsEnd - 30 || x > CL_SX + 6 ? 1 : 0.42)); // the eye stays as it is
const CL4 = warp(figure({ ...CL_START[0], d: `M${62 - (164 - clWrapsEnd)} ${CE.y} H${CE.x}` }, ...CL_START.slice(1), clSmall, clBig), clPull);
const clColors = (fig, c, over = {}) => ({ ...allParts(fig, c), ...over });
const M = L1.move;
const Dn = L1.done;
const CLINCH = [
  step3([...CL_HOOK, { fig: CL1, colors: clColors(CL1, M, { 'línea': L1.still }), fade: ['vueltas'] }], tipAt(CL1, null, M),
    arrow(`M${CL_W.x + 4} ${CE.y + CL_W.a + 10} H${clWrapsEnd + 6}`), text(10, 158, '5 a 7 vueltas', 'start')),
  step3([...CL_HOOK, { fig: CL2, colors: clColors(CL2, Dn, { 'línea': L1.still, 'al lazo chico': M }), fade: ['vueltas'] }], tipAt(CL2, null, M),
    text(10, 158, 'por el lazo chico, junto al ojo', 'start')),
  step3([...CL_HOOK, { fig: CL3, colors: clColors(CL3, Dn, { 'línea': L1.still, 'por el lazo grande': M }), fade: ['vueltas'] }], tipAt(CL3, null, M),
    text(10, 158, 'y por el lazo grande', 'start')),
  step3([...CL_HOOK, { fig: CL4, colors: clColors(CL4, M), fade: ['vueltas'] }], pull(`M54 ${CE.y} H28`), pull(`M${CL_STOPS[2][1]} ${CE.y + 39} V${CE.y + 50}`), hold(276, CE.y, 0), drop(90, 130),
    text(10, 158, 'tirar de la línea y de la punta', 'start'), { tight: true }),
  step3([...CL_HOOK, { fig: CL4, colors: clColors(CL4, Dn), fade: ['vueltas'] }], tipAt(CL4, null, Dn), scissors(202, 112), { tight: true }),
];

/* Uni, in 3D, following guía A p. 1 and Wilson p. 9 (docs/referencias-nudos.md): the line
   from the left through the eye (the same hook as the clinch), back below it, then a loop
   with the tip over the two lines and 5 wraps around both, inside the loop (a helix: each
   wrap in front of both lines and then behind them). Pulling the tip closes the wraps;
   pulling the line slides the knot to the eye. */
const UN_Y = CE.y + 14; // the strand back from the eye
const UN_C = (CE.y + UN_Y) / 2; // the middle of the two lines: the axis of the wraps
const UN_W = { x: 196, n: 5, pitch: 20, a: 17 }; // tied away from the eye, so it can be seen sliding down to it
const unWrapsEnd = UN_W.x - (UN_W.n + 0.5) * UN_W.pitch;
function unWraps({ x, n, pitch, a }) {
  const steps = n * 24 + 12;
  const pts = [];
  const zs = [];
  for (let k = 0; k <= steps; k++) {
    // From the top: down in front, up behind; n turns and half of one, ending at the bottom.
    const th = Math.PI + (k / steps) * (n * 2 + 1) * Math.PI;
    pts.push(`${(x - (pitch * (th - Math.PI)) / (2 * Math.PI)).toFixed(1)} ${(UN_C + a * Math.cos(th)).toFixed(1)}`);
    zs.push([k / steps, -Math.sin(th) * 1.2]);
  }
  return { name: 'vueltas', d: `M${pts[0]} L${pts.slice(1).join(' L')}`, z: zs };
}
const UN_L = unWrapsEnd - 22; // where the strand back from the eye turns up into the loop
const UN_START = [
  { name: 'línea', d: `M10 ${CE.y} H${CE.x}`, z: 0 },
  { name: 'por el ojo', d: `M${CE.x} ${CE.y} H${CE.x + 6} C${CE.x + 16} ${CE.y} ${CE.x + 16} ${UN_Y} ${CE.x + 2} ${UN_Y} H${UN_L}`, z: 0 },
  { name: 'lazo', d: `M${UN_L} ${UN_Y} C${UN_L - 22} ${UN_Y} ${UN_L - 24} ${CE.y - 30} ${UN_L + 6} ${CE.y - 32} C${UN_L + 40} ${CE.y - 34} ${UN_W.x - 20} ${CE.y - 34} ${UN_W.x - 6} ${CE.y - 28}`,
    z: [[0, 0], [0.12, 1], [0.3, 1], [0.45, 0], [1, 0]] },
  { name: 'a las vueltas', d: `M${UN_W.x - 6} ${CE.y - 28} C${UN_W.x - 1} ${CE.y - 26} ${UN_W.x} ${CE.y - 22} ${UN_W.x} ${UN_C - UN_W.a}`, z: 0 },
];
const unOut = { name: 'punta', d: `M${unWrapsEnd} ${UN_C + UN_W.a} C${unWrapsEnd - 4} ${UN_C + UN_W.a + 10} ${unWrapsEnd - 14} ${UN_C + UN_W.a + 16} ${unWrapsEnd - 40} ${UN_C + UN_W.a + 18}`, z: 0 };
const UN1 = figure(...UN_START.slice(0, 3)); // the loop ends out to the right, the tip clear of the line
const UN2 = figure(...UN_START, unWraps(UN_W), unOut);
// Pulling the tip: the wraps close on the two lines (squeezed toward their middle, which
// keeps everything in its order) and get a little shorter; the loop shrinks with them.
const unRamp = (x, x0, x1) => Math.min(1, Math.max(0, (x - x0) / (x1 - x0)));
const UN_K3 = unWrapsEnd + 30 + (UN_W.x - unWrapsEnd) * 0.75; // where the wraps end, closed
const unAlong = pullAlong([[30, 30], [UN_L - 24, unWrapsEnd + 16], [UN_L, unWrapsEnd + 24], [unWrapsEnd, unWrapsEnd + 30], [UN_W.x, UN_K3], [CE.x, CE.x]], UN_C);
// Across the lines: what is far from them closes much more than what is near (still in
// order, so nothing crosses anything new): the loop ends up lying along the wraps.
const unAcross = (x, y) => {
  const d = y - UN_C;
  const k = unRamp(x, UN_L - 50, UN_L - 26) * (1 - unRamp(x, CE.x - 12, CE.x - 4)); // only around the knot
  const near = Math.min(Math.abs(d), 12) * 0.55 + Math.max(0, Math.abs(d) - 12) * 0.32;
  return UN_C + Math.sign(d) * ((1 - k) * Math.abs(d) + k * near);
};
const unClose = (x, y) => { const [nx] = unAlong(x, y); return [nx, unAcross(x, y)]; };
const UN3 = warp(figure(...UN_START, unWraps(UN_W), unOut), unClose);
// Pulling the line: the knot slides along the two lines up to the eye.
const UN_SLIDE = CE.x - 18 - UN_K3;
const UN4 = warp(UN3, pullAlong([[10, 62], [UN_L - 20, UN_L - 20 + UN_SLIDE], [UN_K3, UN_K3 + UN_SLIDE], [CE.x - 4, CE.x - 2], [CE.x, CE.x]], UN_C, () => 1));
const unColors = (fig, c, over = {}) => ({ ...allParts(fig, c), ...over });
const UNI = [
  step3([...CL_HOOK, { fig: UN1, colors: unColors(UN1, M, { 'línea': L1.still }) }], tipAt(UN1, null, M), text(10, 158, 'un lazo que cruza la línea', 'start')),
  step3([...CL_HOOK, { fig: UN2, colors: unColors(UN2, Dn, { 'línea': L1.still, vueltas: M, punta: M }), fade: ['vueltas'] }], tipAt(UN2, null, M),
    arrow(`M${UN_W.x + 6} ${UN_C + UN_W.a + 12} H${unWrapsEnd + 10}`), text(10, 158, '5 o 6 vueltas, por dentro del lazo', 'start')),
  step3([...CL_HOOK, { fig: UN3, colors: unColors(UN3, Dn, { 'línea': L1.still, vueltas: M, lazo: M, punta: M }), fade: ['vueltas'] }],
    tipAt(UN3, null, M), pull('M88 101 H70'), drop(60, 40), text(10, 158, 'tirar de la punta', 'start'), { tight: true }),
  step3([...CL_HOOK, { fig: UN4, colors: unColors(UN4, M), fade: ['vueltas'] }], tipAt(UN4, null, M), pull(`M54 ${CE.y} H28`), hold(276, CE.y, 0),
    text(10, 158, 'el nudo baja al ojo', 'start'), { tight: true }),
  step3([...CL_HOOK, { fig: UN4, colors: unColors(UN4, Dn), fade: ['vueltas'] }], tipAt(UN4, null, Dn), scissors(128, 128), { tight: true }),
];

/* Snell, in 3D, following guía A p. 3 and Wilson p. 12 (docs/referencias-nudos.md): a hook
   without an eye, the paddle at the left and the bend at the right. The line lies along the
   shank: the tip toward the bend, then back to the paddle, a loop hanging below, and back
   along the shank to the left (the main line). The loop wraps around the shank and the two
   lines, from the paddle toward the bend (a helix: in front of all, then behind); pulling
   the main line takes up the loop. */
const SY = 80; // the shank
const SN_HOOK = [{ fig: figure({ name: 'anzuelo', d: `M60 ${SY} H280 C304 ${SY} 304 ${SY + 40} 280 ${SY + 40} H268 L276 ${SY + 32}`, z: 0 }), colors: { anzuelo: METAL }, w: 6 }];
const SN_PADDLE = { back: `<rect x="50" y="${SY - 13}" width="11" height="26" rx="2" fill="${METAL}"/>` };
const SN_X0 = 84; // where the wraps start, next to the paddle
const SN_TIP = 252; // the tip, toward the bend (well past where the loop crosses it)
const SN_TIP_T = 200; // tight: the tip, short past the wraps
/** The wraps from x0 going right, starting and ending at the bottom: n turns. */
function snWraps({ x0, n, pitch, a }) {
  const steps = n * 24;
  const pts = [];
  const zs = [];
  for (let k = 0; k <= steps; k++) {
    const th = (k / steps) * n * 2 * Math.PI;
    pts.push(`${(x0 + (pitch * th) / (2 * Math.PI)).toFixed(1)} ${(SY + a * Math.cos(th)).toFixed(1)}`);
    zs.push([k / steps, Math.sin(th) * 1.2]);
  }
  return { name: 'vueltas', d: `M${pts[0]} L${pts.slice(1).join(' L')}`, z: zs };
}
/** The line: the tip along the shank (at y1), the loop, the main line back (at y0). */
const snLine = (y0, y1, x1) => ({ name: 'línea', d: `M${x1} ${y0} H10`, z: 0.5 });
const snTip = (y1, x = SN_TIP) => ({ name: 'punta', d: `M${x} ${y1} H${SN_X0}`, z: 0.5 });
const SN_UP = 222; // where the loop goes back up to the main line
const SN1 = figure(snTip(SY + 8),
  { name: 'lazo', d: `M${SN_X0} ${SY + 8} C${SN_X0 - 22} ${SY + 8} ${SN_X0 - 24} ${SY + 40} ${SN_X0 - 8} ${SY + 46} C${SN_X0 + 20} ${SY + 66} ${SN_UP + 16} ${SY + 64} ${SN_UP + 18} ${SY + 40} C${SN_UP + 18} ${SY + 30} ${SN_UP + 8} ${SY - 8} ${SN_UP - 4} ${SY - 8}`,
    z: [[0, 0.5], [0.75, 0.5], [0.82, 1], [0.97, 1], [1, 0.5]] },
  snLine(SY - 8, SY + 8, SN_UP - 4));
const SN_W = { x0: SN_X0, n: 5, pitch: 22, a: 22 }; // wide: each turn crosses three things (line, shank, tip)
const snWrapsEnd = SN_W.x0 + SN_W.n * SN_W.pitch;
const snTurn = (y1, a) => ({ name: 'vuelta', d: `M${SN_X0} ${y1} C${SN_X0 - 12} ${y1} ${SN_X0 - 12} ${SY + a} ${SN_X0} ${SY + a}`, z: [0.5, 0] });
const SN2 = figure(snTip(SY + 8), snTurn(SY + 8, SN_W.a), snWraps(SN_W),
  { name: 'lazo', d: `M${snWrapsEnd} ${SY + SN_W.a} C${snWrapsEnd + 12} ${SY + SN_W.a} ${snWrapsEnd + 10} ${SY + 40} ${snWrapsEnd + 8} ${SY + 44} C${snWrapsEnd + 6} ${SY + 64} ${SN_UP + 22} ${SY + 64} ${SN_UP + 20} ${SY + 44} C${SN_UP + 18} ${SY + 30} ${SN_UP + 8} ${SY - 8} ${SN_UP - 4} ${SY - 8}`,
    z: [[0, 0], [0.3, 0.5], [0.7, 0.5], [0.8, 1], [0.97, 1], [1, 0.5]] },
  snLine(SY - 8, SY + 8, SN_UP - 4));
// Pulled: the wraps close on the shank, the loop is gone (a short bend up to the main line).
const SN_T = { x0: SN_X0, n: 5, pitch: 14, a: 12 };
const snTEnd = SN_T.x0 + SN_T.n * SN_T.pitch;
const SN3 = figure(snTip(SY + 5, SN_TIP_T), snTurn(SY + 5, SN_T.a), snWraps(SN_T),
  { name: 'lazo', d: `M${snTEnd} ${SY + SN_T.a} C${snTEnd + 5} ${SY + SN_T.a} ${snTEnd + 6} ${SY + 4} ${snTEnd + 5} ${SY - 1} C${snTEnd + 4} ${SY - 5} ${snTEnd + 3} ${SY - 5} ${snTEnd + 1} ${SY - 5}`,
    z: [[0, 0], [0.2, 1], [0.8, 1], [1, 0.5]] },
  snLine(SY - 5, SY + 5, snTEnd + 1));
const snColors = (fig, c, over = {}) => ({ ...allParts(fig, c), ...over });
const SNELL = [
  step3([...SN_HOOK, { fig: SN1, colors: snColors(SN1, M, { 'línea': L1.still }) }], SN_PADDLE, tip(SN_TIP, SY + 8, 0, M),
    text(10, 30, 'la punta hacia la curva', 'start'), text(10, 158, 'y un lazo colgando', 'start')),
  step3([...SN_HOOK, { fig: SN2, colors: snColors(SN2, Dn, { 'línea': L1.still, vueltas: M, lazo: M }), fade: ['vueltas'] }], SN_PADDLE, tip(SN_TIP, SY + 8, 0, Dn),
    arrow(`M${SN_X0 + 2} ${SY + SN_W.a + 14} H${snWrapsEnd - 4}`), arrow(`M${SN_UP + 34} ${SY + 56} C${SN_UP + 72} ${SY + 30} ${SN_UP + 50} ${SY - 38} ${SN_UP - 6} ${SY - 30}`), text(10, 30, '5 a 7 vueltas con el lazo, hacia la curva', 'start')),
  step3([...SN_HOOK, { fig: SN3, colors: snColors(SN3, M, { punta: Dn }), fade: ['vueltas'] }], SN_PADDLE, tip(SN_TIP_T, SY + 5, 0, Dn), pull(`M48 ${SY - 5} H24`),
    hold(SN_X0 + 30, SY, 0), drop(250, 40), text(10, 158, 'sostener las vueltas y tirar de la línea', 'start'), { tight: true }),
  step3([...SN_HOOK, { fig: SN3, colors: snColors(SN3, Dn), fade: ['vueltas'] }], SN_PADDLE, tip(SN_TIP_T, SY + 5, 0, Dn), scissors(184, 106), { tight: true }),
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
  seg('M10 85 H76', L1.still) + overhandV1(110, 85, L1.move) + seg('M146 71 C164 66 184 70 204 76', L1.move) + tip(204, 76, 15, L1.move)
    + lure(240, 85) + text(150, 150, 'nudo simple flojo, a 10 cm de la punta'),
  lure(240, 85) + seg('M10 85 H76', L1.still) + overhandV1(110, 85, L1.done) + seg(RA.toEye, L1.move) + seg(RA.back, L1.move)
    + ringFront(240, 85, 8) + tip(110, 70, -95, L1.move) + arrow('M210 140 H140') + text(165, 160, 'volver por dentro del nudo simple'),
  st(() => {
    const w = raWraps(L1.move);
    return lure(240, 85) + w.back + seg('M10 85 H76', L1.still) + w.front + overhandV1(110, 85, L1.done) + seg(RA.toEye, L1.done) + seg(RA.back, L1.done)
      + seg(RA.toWraps, L1.move) + seg('M34 97 C30 106 28 112 30 120', L1.move) + ringFront(240, 85, 8) + tip(30, 120, 95, L1.move)
      + text(52, 150, '3 vueltas');
  }),
  st(() => {
    const w = raWraps(L1.done);
    return lure(240, 85) + w.back + seg('M10 85 H76', L1.still) + w.front + seg(RA.out, L1.move) + overhandV1(110, 85, L1.done) + seg(RA.toEye, L1.done)
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

/* Lazo perfecto, in 3D (see knot3d.js), following the references (Orvis, Netknots): one
   line from the left at y = 120. The first loop, with the tip passing behind the line.
   The second loop is a turn around the line: up in front of the first loop and back
   down behind the line (without this, it is a slip loop). The tip goes back up between
   the two loops (in front of the first, behind the second) and points up. Then the
   second loop is pulled through the first, out to the right, as the final loop; pulled
   tight, it is the same figure with its middle squeezed. */
const LP_START = [
  { name: 'línea', d: 'M10 120 H120', z: 0 },
  { name: 'primer lazo', d: 'M120 120 C150 120 200 110 200 75 C200 45 176 38 162 40 C140 44 132 66 140 86', z: [[0, 0], [0.85, 0], [1, -0.6]] },
  { name: 'punta por detrás', d: 'M140 86 C146 102 156 112 166 122 C172 128 176 136 178 146', z: [[0, -0.6], [0.2, -1], [1, -1]] },
];
const LP_TIP = { name: 'punta entre lazos', d: 'M156 146 C166 150 174 140 173 128 C172 118 170 104 168 90 C166 70 166 40 166 22', z: [[0, -2], [0.14, 0.5], [1, 0.5]] };
const LPA = figure(...LP_START,
  { name: 'segundo lazo', d: 'M178 146 C184 136 190 120 190 106 C190 94 190 82 186 72 C180 58 168 54 160 60 C152 66 150 84 149 100 C148 110 140 118 138 128 C136 138 144 146 156 146',
    z: [[0, -1], [0.12, 1], [0.55, 1], [0.72, -2], [1, -2]] },
  LP_TIP);
/** After the second loop went through the first; the line starts at x0. loop: the final
    loop (shorter while it is being pulled out). */
const lpThrough = (x0 = 10, loop = 'M214 80 C250 84 300 90 304 70 C308 46 256 52 214 60') => figure({ ...LP_START[0], d: `M${x0} 120 H120` }, ...LP_START.slice(1),
  { name: 'pata de abajo', d: 'M178 146 C188 134 196 116 186 104 C182 98 184 90 190 87 C194 85 197 84 200 83 C204 81 208 80 214 80', z: [[0, -1], [0.15, 1], [0.68, 1], [0.88, -1.5], [1, -1.5]] },
  { name: 'lazo final', d: loop, z: -1.5 },
  { name: 'pata de arriba', d: 'M214 60 C206 60 200 60 194 58 C188 56 182 54 176 56 C168 58 160 62 156 70 C151 80 149 92 149 102 C148 110 140 118 138 128 C136 138 144 146 156 146', z: [[0, -1.5], [0.12, -1.5], [0.3, 1], [0.42, 1], [0.6, -2], [1, -2]] },
  LP_TIP);
const LPB = lpThrough();
const LPH = lpThrough(10, 'M214 80 C228 82 240 80 241 70 C242 61 228 59 214 60'); // halfway through
// Squeezed in the middle; the final loop also shorter (x only, keeping the order of
// points, so no crossing changes).
const lpTight = (x0) => warp(warp(lpThrough(x0), pinch(172, 104, 0.7, 30, 110)), (x, y) => [x > 200 ? 200 + (x - 200) * 0.75 : x, y]);
const LPC = lpTight(62);
const LPD = lpTight(62);
const LAZO_PERFECTO = [
  step3([{ fig: LPA, upTo: 'punta por detrás', colors: { 'línea': L1.still, 'primer lazo': M, 'punta por detrás': M } }],
    tipAt(LPA, 'punta por detrás', M), text(10, 24, 'la punta pasa por detrás', 'start')),
  step3([{ fig: LPA, upTo: 'segundo lazo', colors: { 'línea': L1.still, 'primer lazo': Dn, 'punta por detrás': Dn, 'segundo lazo': M } }],
    tipAt(LPA, 'segundo lazo', M), arrow('M206 140 C214 124 212 104 202 92'), text(10, 24, 'una vuelta alrededor de la línea', 'start')),
  step3([{ fig: LPA, colors: { ...allParts(LPA, Dn), 'línea': L1.still, 'punta entre lazos': M } }],
    tipAt(LPA, null, M), text(124, 165, 'la punta, entre los dos lazos')),
  step3([{ fig: LPH, colors: { ...allParts(LPH, Dn), 'línea': L1.still, 'pata de abajo': M, 'lazo final': M, 'pata de arriba': M } }],
    tipAt(LPH, null, Dn), arrow('M250 70 H298'), text(130, 165, 'el 2.º lazo, por dentro del 1.º')),
  step3([{ fig: LPB, colors: { ...allParts(LPB, Dn), 'línea': L1.still, 'pata de abajo': M, 'lazo final': M, 'pata de arriba': M } }],
    tipAt(LPB, null, Dn), text(130, 165, 'sale a la derecha: lazo final')),
  step3([{ fig: LPC, colors: allParts(LPC, M) }], tipAt(LPC, null, M), pull('M54 120 H30'), pull('M286 76 H298'), text(320, 30, 'cerrar', 'end'), { tight: true }),
  step3([{ fig: LPD, colors: allParts(LPD, Dn) }], tipAt(LPD, null, Dn), scissors(190, 40), { tight: true }),
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

/* Cirujano, in 3D, following guía A p. 4 (docs/referencias-nudos.md): the two lines side by
   side, the green one from the left and the orange one from the right, tie a double overhand
   together, as if they were one line. The knot is drawn on the middle of the pair (a line
   along y = CJ_Y, a loop above it, then the end wraps around the pair inside the loop, once
   or twice, and goes out over the loop's right side); each line runs g to one side of it. */
const CJ_Y = 100;
const CJ_X = 118; // where the end first goes down over the pair
const CJ_A = 24; // half height of the wraps
const CJ_P = 48; // length of a whole wrap
const CJ_G = 4;
/** The end wrapping around the pair: a helix seen from the side, half turns of the given count. */
function cjWraps(halves) {
  const pts = [];
  const zs = [];
  const n = halves * 24;
  for (let k = 0; k <= n; k++) {
    const th = -Math.PI / 2 + (k / n) * halves * Math.PI;
    pts.push(`${(CJ_X + (CJ_P * th) / (2 * Math.PI)).toFixed(1)} ${(CJ_Y + CJ_A * Math.sin(th)).toFixed(1)}`);
    zs.push([k / n, Math.cos(th)]);
  }
  return { name: 'pasadas', d: `M${pts[0]} L${pts.slice(1).join(' L')}`, z: zs };
}
const cjWrapsEnd = (halves) => CJ_X - CJ_P / 4 + (halves * CJ_P) / 2;
const CJ_TOP = CJ_Y - CJ_A;
const cjKnot = (halves) => [
  { name: 'juntas', d: `M70 ${CJ_Y} H214`, z: 0 },
  { name: 'lazo', d: `M214 ${CJ_Y} C232 ${CJ_Y} 240 84 240 66 C240 42 216 30 180 30 C136 30 96 34 90 52 C86 66 94 ${CJ_TOP} ${CJ_X - CJ_P / 4} ${CJ_TOP}`, z: 0 },
  cjWraps(halves),
  // Out over the loop's right side, going up to the right (from the last wrap, wherever it ends).
  { name: 'salida', d: halves === 2 ? `M154 ${CJ_TOP} C176 ${CJ_TOP} 212 52 232 46 C246 42 258 40 272 40` : `M202 ${CJ_TOP} C214 ${CJ_TOP} 226 62 236 56 C248 50 260 42 272 40`,
    z: [[0, 0], [0.4, 1], [0.85, 1], [1, 0.5]] },
];
/** The two lines along a middle line (a figure's parts): green on one side, its line coming
    from the left (to x = 10); orange on the other, its line going out to the right (to
    x = 322). The ends open a little apart, so the two tips can be told apart. move: warps the
    middle line first (to pull it tight). Returns [green, orange]: the orange one in the order
    its line goes, from the right to its tip at the left. */
function cjPair(parts, move = null) {
  const c0 = figure(...parts).pts;
  const c = move ? c0.map((p) => { const [x, y] = move(p.x, p.y); return { ...p, x, y }; }) : c0;
  const s = [0];
  for (let i = 1; i < c.length; i++) s.push(s[i - 1] + Math.hypot(c[i].x - c[i - 1].x, c[i].y - c[i - 1].y));
  const S = s[s.length - 1];
  const lane = (sign, tag) => c.map((p, i) => {
    const a = c[Math.max(0, i - 2)];
    const b = c[Math.min(c.length - 1, i + 2)];
    const L = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const gg = CJ_G + Math.max(0, 20 - s[i]) * 0.25 + Math.max(0, 20 - (S - s[i])) * 0.25;
    return { x: p.x - ((b.y - a.y) / L) * gg * sign, y: p.y + ((b.x - a.x) / L) * gg * sign, z: p.z, part: `${p.part} (${tag})` };
  });
  const G = lane(1, 'verde');
  const O = lane(-1, 'naranja');
  const g0 = G[0];
  const head = figure({ name: 'línea verde', d: `M10 ${g0.y.toFixed(1)} H${g0.x.toFixed(1)}`, z: g0.z }).pts.slice(0, -1);
  const o1 = O[O.length - 1];
  const o0 = O[O.length - 3];
  const [ux, uy] = [o1.x - o0.x, o1.y - o0.y];
  const U = Math.hypot(ux, uy) || 1;
  const tail = figure({ name: 'línea naranja', d: `M${o1.x.toFixed(1)} ${o1.y.toFixed(1)} C${(o1.x + (ux / U) * 16).toFixed(1)} ${(o1.y + (uy / U) * 16).toFixed(1)} ${Math.max(o1.x + 20, 300)} ${o1.y.toFixed(1)} 322 ${o1.y.toFixed(1)}`, z: o1.z }).pts.slice(1);
  const fig = (pts) => ({ pts, parts: [...new Set(pts.map((p) => p.part))] });
  return [fig([...head, ...G]), fig([...O, ...tail].reverse())];
}
const CJ1 = cjPair([{ name: 'juntas', d: `M70 ${CJ_Y} H262`, z: 0 }]);
const CJ2 = cjPair(cjKnot(2)); // the overhand: through the loop once
const CJ3 = cjPair(cjKnot(4)); // and once more
// Pulled tight: the knot closes, more across the lines than along them (the wraps keep apart).
const CJ_PINCH = (x, y) => {
  const [cx, cy] = [165, CJ_Y - 12];
  const r = Math.hypot(x - cx, y - cy);
  const w = 1 - Math.min(1, Math.max(0, (r - 60) / 70)) ** 2 * (3 - 2 * Math.min(1, Math.max(0, (r - 60) / 70)));
  return [cx + (x - cx) * (1 - 0.25 * w), cy + (y - cy) * (1 - 0.45 * w)];
};
const CJ4 = cjPair(cjKnot(4), CJ_PINCH);
const cjColors = (fig, c, still, over = {}) => ({ ...allParts(fig, c), ...over, 'línea verde': still, 'línea naranja': still });
const cjItems = ([g, o], cg, co, overG = {}, overO = {}) => [{ fig: g, colors: cjColors(g, cg, L1.still, overG) }, { fig: o, colors: cjColors(o, co, L2.still, overO) }];
const cjTips = ([g, o], cg, co) => tipAt(g, null, cg) + tipAt(o, null, co);
/** Pull on the orange line, where it leaves to the right. */
const cjPullOut = (f) => { const p = [...f.pts].reverse().find((q) => q.x >= 262); return pull(`M${p.x.toFixed(1)} ${p.y.toFixed(1)} H${(p.x + 24).toFixed(1)}`); };
/** Scissors next to each tip, on the leftover. */
const cjCut = (pair) => pair.map((f) => { const [x, y] = endOf(f); return (x < 165 ? scissors(x + 6, y - 30) : scissors(x - 18, y + 24)); }).join('');
const CIRUJANO = [
  step3(cjItems(CJ1, M, L2.move), cjTips(CJ1, M, L2.move), text(165, 150, 'juntas unos 15 cm, en sentidos contrarios')),
  step3(cjItems(CJ2, M, L2.move), cjTips(CJ2, M, L2.move), text(10, 158, 'nudo simple con las dos juntas', 'start')),
  step3(cjItems(CJ3, Dn, L2.done, { 'pasadas (verde)': M, 'salida (verde)': M }, { 'pasadas (naranja)': L2.move, 'salida (naranja)': L2.move }), cjTips(CJ3, M, L2.move),
    text(10, 158, 'pasar otra vez por el lazo', 'start')),
  step3(cjItems(CJ4, M, L2.move), cjTips(CJ4, M, L2.move), pull(`M44 ${CJ_Y + CJ_G} H18`), cjPullOut(CJ4[1]), drop(60, 40),
    text(10, 158, 'mojar y tirar de las dos líneas', 'start'), { tight: true }),
  step3(cjItems(CJ4, Dn, L2.done), cjTips(CJ4, Dn, L2.done), cjCut(CJ4), { tight: true }),
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
const lcOverhand = (c) => overhandV1(160, 85, c, { st: dbl, ov: dblOver });
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
    + twistV1(80, 200, 75, 105, 12, L1.move, L1.move) + seg('M200 75 H260 C300 75 300 105 260 105 H200', L1.move)
    + arrow('M262 44 C290 28 318 50 306 72') + text(140, 140, 'girar unas 20 vueltas'),
  seg('M10 75 H80', L1.still) + seg('M80 100 H50', L1.done) + tip(50, 100, 180, L1.done)
    + twistV1(80, 190, 78, 92, 14, L1.done, L1.done) + seg(BI_LOOP, L1.move) + open(260, 85, 0) + text(110, 140, 'abrir el lazo'),
  st(() => {
    const w = coil(80, 85, 6, 9, 13, L1.move, 1);
    return w.back + seg('M10 75 H80', L1.still) + twistV1(80, 190, 78, 92, 14, L1.done, L1.done) + w.front
      + seg('M40 112 C56 112 70 104 80 98', L1.move) + seg(BI_LOOP, L1.done) + arrow('M70 140 H130') + text(110, 160, 'la punta se enrolla sola');
  }),
  st(() => {
    const w = coil(80, 85, 6, 9, 13, L1.done, 1);
    const r = coil(80, 85, 3, 8, 13, L1.move);
    return w.back + r.back + seg('M10 75 H80', L1.still) + twistV1(80, 190, 78, 92, 14, L1.done, L1.done) + w.front + r.front
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
    + twistV1(150, 222, 85, 99, 5, WIRE.still, WIRE.move) + seg('M150 99 H130', WIRE.move, 4) + RF + tip(130, 99, 180, WIRE.move)
    + text(170, 140, '4 o 5 vueltas en X'),
  st(() => {
    const w = coil(150, 85, 5, 7, 10, WIRE.move);
    return H + w.back + seg('M10 85 H150', WIRE.still, 4) + seg('M222 85 H230', WIRE.still, 4) + seg('M230 85 C238 85 242 99 228 99 H222', WIRE.done, 4)
      + twistV1(150, 222, 85, 99, 5, WIRE.still, WIRE.done) + w.front + RF + tip(115, 95, 120, WIRE.move) + text(110, 130, '5 vueltas apretadas');
  }),
  st(() => {
    const w = coil(150, 85, 5, 7, 10, WIRE.done);
    return H + w.back + seg('M10 85 H150', WIRE.still, 4) + seg('M222 85 H230', WIRE.still, 4) + seg('M230 85 C238 85 242 99 228 99 H222', WIRE.done, 4)
      + twistV1(150, 222, 85, 99, 5, WIRE.still, WIRE.done) + w.front + seg('M115 95 V50 H86', WIRE.move, 4) + RF
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
  const all = (STEPS[id] || []).map((b) => b.svg ?? b).join('');
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

/** Colors of the drawing system, for the drawing checks. */
export const KNOT_PALETTE = { L1, L2, WIRE, METAL, BRASS, TOOL, R, F, WATER, YELLOW, PAPER, INK };

export function knotStepSvg(id, i) {
  const body = STEPS[id]?.[i];
  return body ? draw(body.svg ?? body) : '';
}

/** Crossings of a step drawn in 3D ({ x, y, over, under, angle, dz }), or null. */
export function knotCrossings(id, i) {
  return STEPS[id]?.[i]?.crossings ?? null;
}

/** Places of a step drawn in 3D where two stretches run against each other ({ x, y, a, b }). */
export function knotStepTight(id, i) {
  return STEPS[id]?.[i]?.tight ?? false;
}

export function knotCloseRuns(id, i) {
  return STEPS[id]?.[i]?.close ?? null;
}

export function knotStepCount(id) {
  return STEPS[id]?.length ?? 0;
}
