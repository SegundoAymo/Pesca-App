// The crossings of the knots drawn in 3D, against how each knot is really tied. The
// tables are written from the knot, not from the drawing: each line is "part over part",
// once per crossing. If a drawing changes a crossing, or the tightened knot is not the
// same knot as the loose one, this fails. Part names are those of js/drawings/knots.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import { knotCrossings, knotStepCount } from '../js/drawings/knots.js';

const lazoStart = ['primer lazo > punta por detrás'];
const lazoTip = [...lazoStart, 'segundo lazo > primer lazo', 'segundo lazo > primer lazo',
  'punta entre lazos > primer lazo', 'punta entre lazos > primer lazo', 'segundo lazo > punta entre lazos'];
// The second loop went through the first: each leg once over it and once under it; the
// tip stays in front of the first loop and behind the second.
const lazoThrough = [...lazoStart, 'pata de abajo > primer lazo', 'primer lazo > pata de abajo',
  'pata de arriba > primer lazo', 'primer lazo > pata de arriba',
  'punta entre lazos > primer lazo', 'punta entre lazos > primer lazo', 'pata de arriba > punta entre lazos'];

const EXPECTED = {
  'lazo-perfecto': [
    lazoStart, // the tip passes behind the line
    [...lazoStart, 'segundo lazo > primer lazo', 'segundo lazo > primer lazo'], // the second loop, in front
    lazoTip, // the tip between the loops
    lazoTip, // the same, before the second loop goes through
    lazoThrough,
    lazoThrough, // tightened: the same crossings
    lazoThrough,
  ],
};

for (const [id, steps] of Object.entries(EXPECTED)) {
  test(`cruces de ${id}, como se ata de verdad`, () => {
    assert.equal(steps.length, knotStepCount(id));
    steps.forEach((want, i) => {
      const got = knotCrossings(id, i).map((c) => `${c.over} > ${c.under}`).sort();
      assert.deepEqual(got, [...want].sort(), `paso ${i + 1}`);
    });
  });
}
