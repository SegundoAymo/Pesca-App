// Knots in 3D, drawn flat. A knot is a line in space: each point has x and y (as in the
// drawing, 330 x 170) and z, its depth (positive toward the viewer). The drawing comes
// out of the line itself:
//  - What goes over at each crossing is what is nearer at that point. It is not chosen
//    by hand, so it cannot change from one step to the next or contradict itself.
//  - Each crossing is listed (where, which part over which, at what angle), so the tests
//    and the review can check it against how the knot is really tied.
//  - The pulled-tight knot is the loose one with its middle squeezed (see pinch): the
//    same crossings, smaller.
// Only the paper edge rule is shared with the rest of the drawings: the part on top gets
// an edge of the paper color only where it crosses a part of the same shade.

/** Points along a path made of M, L, H, V and C commands (absolute). */
export function sample(d, step = 1.5) {
  const t = d.match(/[MLHVC]|-?\d+(?:\.\d+)?/g);
  const pts = [];
  let i = 0;
  let cx = 0;
  let cy = 0;
  let cmd = 'M';
  const num = () => +t[i++];
  const lineTo = (x, y) => {
    const n = Math.max(1, Math.ceil(Math.hypot(x - cx, y - cy) / step));
    for (let k = 1; k <= n; k++) pts.push([cx + (x - cx) * k / n, cy + (y - cy) * k / n]);
    cx = x;
    cy = y;
  };
  while (i < t.length) {
    if (/[MLHVC]/.test(t[i])) cmd = t[i++];
    if (cmd === 'M') {
      cx = num();
      cy = num();
      pts.push([cx, cy]);
      cmd = 'L';
    } else if (cmd === 'L') lineTo(num(), num());
    else if (cmd === 'H') lineTo(num(), cy);
    else if (cmd === 'V') lineTo(cx, num());
    else if (cmd === 'C') {
      const [x1, y1, x2, y2, x, y] = [num(), num(), num(), num(), num(), num()];
      const n = Math.max(2, Math.ceil((Math.hypot(x1 - cx, y1 - cy) + Math.hypot(x2 - x1, y2 - y1) + Math.hypot(x - x2, y - y2)) / step));
      for (let k = 1; k <= n; k++) {
        const u = k / n;
        const v = 1 - u;
        pts.push([v * v * v * cx + 3 * v * v * u * x1 + 3 * v * u * u * x2 + u * u * u * x, v * v * v * cy + 3 * v * v * u * y1 + 3 * v * u * u * y2 + u * u * u * y]);
      }
      cx = x;
      cy = y;
    }
  }
  return pts;
}

const smooth = (u) => u * u * (3 - 2 * u);
/** Depth along a part: a number, [at start, at end], or stops [[t, z], ...] (t from 0 to
    1 along the part); smooth between stops. */
function depth(z, t) {
  if (typeof z === 'number') return z;
  const stops = typeof z[0] === 'number' ? [[0, z[0]], [1, z[1]]] : z;
  if (t <= stops[0][0]) return stops[0][1];
  for (let k = 1; k < stops.length; k++) {
    const [t1, z1] = stops[k];
    const [t0, z0] = stops[k - 1];
    if (t <= t1) return z0 + (z1 - z0) * smooth((t - t0) / (t1 - t0 || 1));
  }
  return stops[stops.length - 1][1];
}

/** A line in space from named parts, one after the other: { name, d (path in the
    drawing), z (depth, see depth) }. Each part starts where the previous one ended, at
    the same depth: a line does not jump. */
export function figure(...parts) {
  const pts = [];
  for (const p of parts) {
    const xy = sample(p.d);
    const len = [0];
    for (let i = 1; i < xy.length; i++) len.push(len[i - 1] + Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]));
    const total = len[len.length - 1] || 1;
    const prev = pts[pts.length - 1];
    if (prev) {
      if (Math.hypot(xy[0][0] - prev.x, xy[0][1] - prev.y) > 1) throw new Error(`Tramo suelto: ${p.name}`);
      if (Math.abs(depth(p.z, 0) - prev.z) > 0.01) throw new Error(`Salto de profundidad: ${p.name}`);
    }
    xy.forEach(([x, y], i) => {
      if (prev && i === 0) return;
      pts.push({ x, y, z: depth(p.z, len[i] / total), part: p.name });
    });
  }
  return { pts, parts: parts.map((p) => p.name) };
}

/** The same figure with its points moved in the drawing by f(x, y) → [x, y]; depths stay. */
export const warp = (fig, f) => ({ ...fig, pts: fig.pts.map((p) => { const [x, y] = f(p.x, p.y); return { ...p, x, y }; }) });

/** Squeeze toward (cx, cy): scaled by s near it, untouched beyond r1, smooth between r0
    and r1. Distances keep their order, so nothing passes through anything: the crossings
    stay the same. */
export const pinch = (cx, cy, s, r0, r1) => (x, y) => {
  const r = Math.hypot(x - cx, y - cy);
  const k = s + (1 - s) * smooth(Math.min(1, Math.max(0, (r - r0) / (r1 - r0))));
  return [cx + (x - cx) * k, cy + (y - cy) * k];
};

/** Visible part of a figure: up to and including part upTo. */
function visible(fig, upTo) {
  if (!upTo) return fig.pts;
  const last = fig.parts.indexOf(upTo);
  if (last < 0) throw new Error(`Parte desconocida: ${upTo}`);
  return fig.pts.filter((p) => fig.parts.indexOf(p.part) <= last);
}

/** Where a figure ends (up to part upTo) and its direction there in degrees: for the tip. */
export function endOf(fig, upTo) {
  const v = visible(fig, upTo);
  const a = v[v.length - 1];
  const b = v[Math.max(0, v.length - 4)];
  return [+a.x.toFixed(1), +a.y.toFixed(1), Math.round((Math.atan2(a.y - b.y, a.x - b.x) * 180) / Math.PI)];
}

/** Arc length along a list of points. */
function arc(pts) {
  const s = [0];
  for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  return s;
}

/** Crossings of the lines in the drawing: { x, y, over, under (part names), angle
    (degrees, 0 to 90), dz (depth difference), and where along each line (a, b) }. */
function findCrossings(lines) {
  const out = [];
  const segs = [];
  lines.forEach((L, li) => L.pts.forEach((p, i) => { if (i) segs.push({ li, i, a: L.pts[i - 1], b: p, s: L.s[i - 1] }); }));
  for (let m = 0; m < segs.length; m++) {
    for (let n = m + 1; n < segs.length; n++) {
      const P = segs[m];
      const Q = segs[n];
      if (P.li === Q.li && Math.abs(P.s - Q.s) < 10) continue; // neighbors along the same line
      const rx = P.b.x - P.a.x;
      const ry = P.b.y - P.a.y;
      const qx = Q.b.x - Q.a.x;
      const qy = Q.b.y - Q.a.y;
      const den = rx * qy - ry * qx;
      if (Math.abs(den) < 1e-9) continue;
      const t = ((Q.a.x - P.a.x) * qy - (Q.a.y - P.a.y) * qx) / den;
      const u = ((Q.a.x - P.a.x) * ry - (Q.a.y - P.a.y) * rx) / den;
      if (t < 0 || t >= 1 || u < 0 || u >= 1) continue;
      const zP = P.a.z + (P.b.z - P.a.z) * t;
      const zQ = Q.a.z + (Q.b.z - Q.a.z) * u;
      const cos = Math.abs(rx * qx + ry * qy) / (Math.hypot(rx, ry) * Math.hypot(qx, qy));
      const [hi, lo, thi, tlo] = zP >= zQ ? [P, Q, t, u] : [Q, P, u, t];
      const at = (S, tt) => ({ line: S.li, s: S.s + Math.hypot(S.b.x - S.a.x, S.b.y - S.a.y) * tt, i: S.i });
      out.push({
        x: P.a.x + rx * t, y: P.a.y + ry * t,
        over: hi.b.part, under: lo.b.part, angle: Math.round((Math.acos(Math.min(1, cos)) * 180) / Math.PI),
        dz: Math.abs(zP - zQ), zHi: Math.max(zP, zQ), hi: at(hi, thi), lo: at(lo, tlo), colors: [lines[hi.li].colorAt(hi.i), lines[lo.li].colorAt(lo.i)],
      });
    }
  }
  return out;
}

const fmt = (pts) => 'M' + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L');

/** Points of a line between arc lengths s0 and s1. */
function slice(L, s0, s1) {
  const out = [];
  const lerp = (i, s) => {
    const a = L.pts[i - 1];
    const b = L.pts[i];
    const k = (s - L.s[i - 1]) / (L.s[i] - L.s[i - 1] || 1);
    return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, i };
  };
  for (let i = 1; i < L.pts.length; i++) {
    if (L.s[i] < s0 || L.s[i - 1] > s1) continue;
    if (!out.length) out.push(L.s[i - 1] >= s0 ? { ...L.pts[i - 1], i } : lerp(i, s0));
    out.push(L.s[i] <= s1 ? { ...L.pts[i], i } : lerp(i, s1));
  }
  return out;
}

/** Runs of one color along a list of points of line L: [{ color, pts }]. */
function runs(L, pts) {
  const out = [];
  for (let k = 1; k < pts.length; k++) {
    const c = L.colorAt(pts[k].i);
    const last = out[out.length - 1];
    if (last && last.color === c) last.pts.push(pts[k]);
    else out.push({ color: c, pts: [pts[k - 1], pts[k]] });
  }
  return out;
}

/** Draws figures. Each item: { fig, upTo (last part shown), colors ({ part: color }),
    w (width) }. paper: the paper color, for the edges. Returns { svg, crossings }. */
export function render(items, paper) {
  const lines = items.map((it) => {
    const pts = visible(it.fig, it.upTo);
    return { pts, s: arc(pts), w: it.w ?? 5, colorAt: (i) => it.colors[pts[Math.max(1, i)].part] };
  });
  items.forEach((it, k) => lines[k].pts.forEach((p) => { if (!it.colors[p.part]) throw new Error(`Parte sin color: ${p.part}`); }));
  const crossings = findCrossings(lines);
  const path = (pts, color, w) => `<path d="${fmt(pts)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  let svg = '';
  // Under everything, each line in its colors.
  for (const L of lines) for (const r of runs(L, L.pts.map((p, i) => ({ ...p, i })))) svg += path(r.pts, r.color, L.w);
  // Then, nearest last, the piece of the upper line at each crossing: long enough to
  // cover the lower one, and stopping before any crossing where this line goes under.
  for (const c of [...crossings].sort((a, b) => a.zHi - b.zHi)) {
    const L = lines[c.hi.line];
    const sin = Math.max(0.3, Math.sin((c.angle * Math.PI) / 180));
    let reach = Math.min(14, (L.w / 2 + 3) / sin + 3);
    for (const o of crossings) if (o.lo.line === c.hi.line && o !== c) reach = Math.min(reach, Math.max(2, Math.abs(o.lo.s - c.hi.s) / 2));
    const piece = slice(L, c.hi.s - reach, c.hi.s + reach);
    if (piece.length < 2) continue;
    const [top, below] = c.colors;
    if (top === below) svg += `<path d="${fmt(piece)}" fill="none" stroke="${paper}" stroke-width="${L.w + 5}" stroke-linecap="butt" stroke-linejoin="round"/>`;
    for (const r of runs(L, piece)) svg += path(r.pts, r.color, L.w);
  }
  for (const L of lines) for (const p of [L.pts[0], L.pts[L.pts.length - 1]]) svg += `<path data-end="1" d="M${p.x.toFixed(1)} ${p.y.toFixed(1)}" fill="none" stroke="none"/>`;
  return {
    svg,
    crossings: crossings.map((c) => ({ x: Math.round(c.x), y: Math.round(c.y), over: c.over, under: c.under, angle: c.angle, dz: +c.dz.toFixed(2) })),
    close: closeRuns(lines, crossings),
  };
}

/** Places where two stretches of line run against each other without crossing (closer
    than a line width plus a little paper): they read as one thick line, a fork or a
    blob. Tight bends of one line count too. Away from crossings, where lines meet on
    purpose. Returns [{ x, y, a, b }] (part names), one per 10 x 10 cell. */
function closeRuns(lines, crossings) {
  const out = new Map();
  const pts = lines.flatMap((L, li) => L.pts.map((p, i) => ({ ...p, li, s: L.s[i], w: L.w })));
  for (let m = 0; m < pts.length; m += 2) {
    for (let n = m + 1; n < pts.length; n += 2) {
      const P = pts[m];
      const Q = pts[n];
      if (P.li === Q.li && Math.abs(P.s - Q.s) < 4 * P.w) continue; // the same stretch
      if (Math.hypot(P.x - Q.x, P.y - Q.y) >= (P.w + Q.w) / 2 + 2) continue;
      const mx = (P.x + Q.x) / 2;
      const my = (P.y + Q.y) / 2;
      if (crossings.some((c) => Math.hypot(c.x - mx, c.y - my) < 3 * P.w)) continue;
      const key = `${Math.round(mx / 10)},${Math.round(my / 10)}`;
      if (!out.has(key)) out.set(key, { x: Math.round(mx), y: Math.round(my), a: P.part, b: Q.part });
    }
  }
  return [...out.values()];
}
