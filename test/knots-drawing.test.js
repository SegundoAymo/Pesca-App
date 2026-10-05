// Automatic checks of the knot drawings against the drawing rules in docs/spec.md
// ("Control de cada dibujo de nudo"). They measure what can be measured without judgment;
// the rest is for the independent review (tools/nudos/).
import test from 'node:test';
import assert from 'node:assert/strict';
import { KNOTS } from '../js/data/knots.js';
import { knotStepSvg, knotStepCount, KNOT_PALETTE as P } from '../js/drawings/knots.js';
import { readSvg, dist } from './svg-geom.js';

// Knots already redrawn with the current system: their checks must pass. The others are
// reported as pending until they are redrawn.
const REDRAWN = ['carrete', 'palomar', 'clinch', 'lazo-perfecto'];

const W = 330;
const H = 170;
const MARGIN = 6; // line centers stay this far from the edge (rule 10)
const LINE = new Set([P.L1, P.L2, P.WIRE].flatMap((c) => Object.values(c)));
const OBJECTS = ['#FFFFFF', '#0B0B0B', '#E4E4DE', '#8A8A84', '#7A5E18', 'none'];
const ALLOWED = new Set([...LINE, P.METAL, P.BRASS, P.TOOL, P.R, P.F, P.WATER, P.YELLOW, P.PAPER, P.INK, ...OBJECTS]);

const isEdge = (s) => s.attrs.stroke === P.PAPER;
const isLine = (s) => s.kind === 'path' && LINE.has(s.attrs.stroke) && !s.group;
const ends = (shapes) => shapes.filter(isLine).flatMap((s) => s.points.flatMap((p) => [p[0], p[p.length - 1]]));
const near = (pt, pts) => Math.min(Infinity, ...pts.map((q) => dist(pt, q)));
const origin = (s) => [s.m[4], s.m[5]];

/** Problems of one drawing, as short sentences. */
export function check(svg) {
  const shapes = readSvg(svg);
  const out = [];
  // Ends of the lines: marked by the drawings made as scenes, measured on the others.
  const lineEnds = [...ends(shapes), ...shapes.filter((x) => x.attrs['data-end']).map((x) => x.points[0][0])];
  for (const s of shapes) {
    // Colors of the palette only (rule 9).
    for (const k of ['stroke', 'fill']) {
      if (s.attrs[k] && !ALLOWED.has(s.attrs[k])) out.push(`color fuera de la paleta: ${s.attrs[k]}`);
    }
    // Nothing outside the drawing (rule 10).
    if (s.kind !== 'text' && !isEdge(s) && !s.attrs['data-end']) {
      const bad = s.points.flat().find(([x, y]) => x < MARGIN || x > W - MARGIN || y < MARGIN || y > H - MARGIN);
      if (bad) out.push(`se sale del borde cerca de (${bad.map(Math.round)})`);
    }
  }
  for (const t of shapes.filter((s) => s.kind === 'text')) {
    const [x0, y0, x1, y1] = t.box;
    if (x0 < 4 || x1 > W - 4 || y0 < 4 || y1 > H - 2) out.push(`texto cortado: "${t.text}"`);
    // Texts do not cover lines or objects (rule 10).
    const hit = shapes.find((s) => s.kind !== 'text' && !isEdge(s) && !s.attrs['data-end'] && s.points.flat().some(([x, y]) => x > x0 - 2 && x < x1 + 2 && y > y0 - 2 && y < y1 + 2));
    if (hit) out.push(`texto encima del dibujo: "${t.text}"`);
  }
  // The pull arrow comes out of the end of a line (rule 7).
  for (const s of shapes.filter((x) => (x.attrs['marker-end'] || '').includes('kph'))) {
    const start = s.points[0][0];
    const linePts = shapes.filter(isLine).flatMap((x) => x.points.flat());
    // From the end of a line, or from any point of a loop that is pulled.
    if (near(start, lineEnds) > 16 && near(start, linePts) > 10) out.push(`flecha de tirar suelta, en (${start.map(Math.round)})`);
  }
  // The tip diamond sits on the end of a line.
  for (const s of shapes.filter((x) => (x.attrs.d || '').startsWith('M-3 0 L6 -7'))) {
    if (near(origin(s), lineEnds) > 4) out.push(`punta separada de su línea, en (${origin(s).map(Math.round)})`);
  }
  // Scissors next to the end of a line: the bit that is cut (rule 8).
  for (const s of shapes.filter((x) => (x.attrs.d || '').startsWith('M-5 7 L10 -16'))) {
    if (near(origin(s), lineEnds) > 45) out.push(`tijera lejos de un sobrante, en (${origin(s).map(Math.round)})`);
  }
  // A line goes through every hook eye (rule 13).
  for (const r of shapes.filter((x) => x.kind === 'circle' && x.attrs.stroke === P.METAL && +x.attrs.r <= 9)) {
    const c = [+r.attrs.cx, +r.attrs.cy];
    const through = shapes.filter((x) => x.kind === 'path' && LINE.has(x.attrs.stroke)).some((x) => x.points.flat().some((p) => dist(p, c) < 7));
    if (!through) out.push(`ninguna línea pasa por el ojo en (${c})`);
  }
  return [...new Set(out)];
}

for (const id of Object.keys(KNOTS)) {
  const redrawn = REDRAWN.includes(id);
  test(`dibujos de ${KNOTS[id].name}`, { todo: redrawn ? false : 'todavía sin rehacer' }, () => {
    const problems = [];
    for (let i = 0; i < knotStepCount(id); i++) {
      for (const p of check(knotStepSvg(id, i))) problems.push(`paso ${i + 1}: ${p}`);
    }
    assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
  });
}
