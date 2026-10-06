// Small SVG reader for the drawing checks: turns the knot drawings (strings) into
// shapes with their points in drawing coordinates. Only what the drawings use.

const num = (s) => +s;

/* ---------- Transforms (2D matrices [a b c d e f]) ---------- */

const mul = (m, n) => [
  m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
];
const ID = [1, 0, 0, 1, 0, 0];
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

function parseTransform(t = '') {
  let m = ID;
  for (const [, fn, args] of t.matchAll(/(\w+)\(([^)]*)\)/g)) {
    const a = args.split(/[\s,]+/).filter(Boolean).map(num);
    if (fn === 'translate') m = mul(m, [1, 0, 0, 1, a[0], a[1] || 0]);
    else if (fn === 'rotate') {
      const r = (a[0] * Math.PI) / 180;
      const [cx, cy] = [a[1] || 0, a[2] || 0];
      m = mul(m, [1, 0, 0, 1, cx, cy]);
      m = mul(m, [Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0]);
      m = mul(m, [1, 0, 0, 1, -cx, -cy]);
    } else if (fn === 'scale') m = mul(m, [a[0], 0, 0, a[1] ?? a[0], 0, 0]);
  }
  return m;
}

/* ---------- Paths ---------- */

/** Points along a path (all commands the drawings use, absolute and relative). Each
    subpath is a separate list. */
export function samplePath(d, step = 2) {
  const tok = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  const subs = [];
  let pts = [];
  let i = 0;
  let cmd = 'M';
  let x = 0;
  let y = 0;
  let sx = 0;
  let sy = 0;
  const n = () => num(tok[i++]);
  const line = (nx, ny) => {
    const k = Math.max(1, Math.ceil(Math.hypot(nx - x, ny - y) / step));
    for (let j = 1; j <= k; j++) pts.push([x + ((nx - x) * j) / k, y + ((ny - y) * j) / k]);
    x = nx;
    y = ny;
  };
  const cubic = (x1, y1, x2, y2, nx, ny) => {
    const len = Math.hypot(x1 - x, y1 - y) + Math.hypot(x2 - x1, y2 - y1) + Math.hypot(nx - x2, ny - y2);
    const k = Math.max(2, Math.ceil(len / step));
    for (let j = 1; j <= k; j++) {
      const u = j / k;
      const v = 1 - u;
      pts.push([v * v * v * x + 3 * v * v * u * x1 + 3 * v * u * u * x2 + u * u * u * nx, v * v * v * y + 3 * v * v * u * y1 + 3 * v * u * u * y2 + u * u * u * ny]);
    }
    x = nx;
    y = ny;
  };
  const arc = (rx, ry, rot, large, sweep, nx, ny) => {
    // Endpoint to center parametrization (SVG spec F.6.5), circles and ellipses.
    const phi = (rot * Math.PI) / 180;
    const cos = Math.cos(phi);
    const sin = Math.sin(phi);
    const dx = (x - nx) / 2;
    const dy = (y - ny) / 2;
    const x1 = cos * dx + sin * dy;
    const y1 = -sin * dx + cos * dy;
    let [ax, ay] = [Math.abs(rx), Math.abs(ry)];
    const lam = (x1 * x1) / (ax * ax) + (y1 * y1) / (ay * ay);
    if (lam > 1) {
      ax *= Math.sqrt(lam);
      ay *= Math.sqrt(lam);
    }
    const sgn = large === sweep ? -1 : 1;
    const num2 = ax * ax * ay * ay - ax * ax * y1 * y1 - ay * ay * x1 * x1;
    const co = sgn * Math.sqrt(Math.max(0, num2 / (ax * ax * y1 * y1 + ay * ay * x1 * x1)));
    const cx1 = (co * ax * y1) / ay;
    const cy1 = (-co * ay * x1) / ax;
    const cx = cos * cx1 - sin * cy1 + (x + nx) / 2;
    const cy = sin * cx1 + cos * cy1 + (y + ny) / 2;
    const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
    const t1 = ang(1, 0, (x1 - cx1) / ax, (y1 - cy1) / ay);
    let dt = ang((x1 - cx1) / ax, (y1 - cy1) / ay, (-x1 - cx1) / ax, (-y1 - cy1) / ay);
    if (!sweep && dt > 0) dt -= 2 * Math.PI;
    if (sweep && dt < 0) dt += 2 * Math.PI;
    const k = Math.max(4, Math.ceil((Math.abs(dt) * Math.max(ax, ay)) / step));
    for (let j = 1; j <= k; j++) {
      const t = t1 + (dt * j) / k;
      pts.push([cx + ax * Math.cos(t) * cos - ay * Math.sin(t) * sin, cy + ax * Math.cos(t) * sin + ay * Math.sin(t) * cos]);
    }
    x = nx;
    y = ny;
  };
  while (i < tok.length) {
    if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
    const rel = cmd === cmd.toLowerCase();
    const ox = rel ? x : 0;
    const oy = rel ? y : 0;
    switch (cmd.toUpperCase()) {
      case 'M':
        if (pts.length) subs.push(pts);
        x = ox + n();
        y = oy + n();
        sx = x;
        sy = y;
        pts = [[x, y]];
        cmd = rel ? 'l' : 'L';
        break;
      case 'L': line(ox + n(), oy + n()); break;
      case 'H': line(ox + n(), y); break;
      case 'V': line(x, oy + n()); break;
      case 'C': { const a = [n(), n(), n(), n(), n(), n()]; cubic(ox + a[0], oy + a[1], ox + a[2], oy + a[3], ox + a[4], oy + a[5]); break; }
      case 'A': { const a = [n(), n(), n(), n(), n(), n(), n()]; arc(a[0], a[1], a[2], a[3], a[4], ox + a[5], oy + a[6]); break; }
      case 'Z': line(sx, sy); break;
      default: i++;
    }
  }
  if (pts.length) subs.push(pts);
  return subs;
}

/* ---------- Reading a drawing ---------- */

const attrs = (s) => Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

/** Shapes of a drawing: { kind, attrs, points (list of point lists), m (transform) };
    texts also get text and a box estimated from the length of the text. */
export function readSvg(svg) {
  const body = svg.replace(/<defs>[\s\S]*?<\/defs>/, '');
  const out = [];
  const stack = [ID];
  const groups = [];
  for (const [, close, tag, rest, inner] of body.matchAll(/<(\/?)(\w+)([^>]*?)\/?>(?:([^<]*)<\/text>)?/g)) {
    const m = stack[stack.length - 1];
    if (tag === 'g') {
      if (close) {
        stack.pop();
        groups.pop();
      } else {
        const a = attrs(rest);
        stack.push(mul(m, parseTransform(a.transform)));
        groups.push(a);
      }
      continue;
    }
    if (close || tag === 'svg') continue;
    const a = attrs(rest);
    const inGroup = groups.length ? groups[groups.length - 1] : null;
    let points = [];
    if (tag === 'path') points = samplePath(a.d);
    else if (tag === 'circle' || tag === 'ellipse') {
      const [cx, cy] = [num(a.cx), num(a.cy)];
      const [rx, ry] = tag === 'circle' ? [num(a.r), num(a.r)] : [num(a.rx), num(a.ry)];
      points = [Array.from({ length: 24 }, (_, k) => [cx + rx * Math.cos((k * Math.PI) / 12), cy + ry * Math.sin((k * Math.PI) / 12)])];
    } else if (tag === 'rect') {
      const [x, y, w, h] = [num(a.x), num(a.y), num(a.width), num(a.height)];
      points = [[[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]];
    }
    const shape = { kind: tag, attrs: a, group: inGroup, points: points.map((p) => p.map((q) => apply(m, q))), m };
    if (tag === 'text') {
      const [x, y] = apply(m, [num(a.x), num(a.y)]);
      const size = num(a['font-size'] || 15);
      const w = (inner || '').length * size * 0.5;
      const x0 = a['text-anchor'] === 'end' ? x - w : a['text-anchor'] === 'middle' ? x - w / 2 : x;
      shape.text = inner;
      shape.box = [x0, y - size * 0.75, x0 + w, y + size * 0.2];
    }
    out.push(shape);
  }
  return out;
}

export const dist = ([ax, ay], [bx, by]) => Math.hypot(ax - bx, ay - by);
