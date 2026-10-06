// The crossings of the knots drawn in 3D, against how each knot is really tied. The
// tables are written from the knot, not from the drawing: each line is "part over part",
// once per crossing. If a drawing changes a crossing, or the tightened knot is not the
// same knot as the loose one, this fails. Part names are those of js/drawings/knots.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import { knotCrossings, knotStepCount } from '../js/drawings/knots.js';

// Lazo perfecto, from the references (Orvis: "form a second, smaller loop in front of
// the first one by rolling the tag end around the front of the first loop, then behind
// it"; Netknots: "take a turn around the standing line, forming a second loop"; Orvis:
// "passing it between the two loops"; "reach behind the first loop and pull the second
// loop through it"). The second loop is a turn AROUND the line: over it on one side and
// under it on the other. Without that, the knot is a slip loop and comes undone.
// Of the ways the sources show it, the simplest: the line along the bottom, the tip ending
// up at a right angle, the final loop out to the right. Tied by hand from the drawings: it
// holds (the loop does not slide, pulling the tag does not undo it).
const lazoStart = ['primer lazo > punta por detrás']; // the tip passes behind the line
const lazoSecond = [...lazoStart,
  'segundo lazo > primer lazo', // the turn goes in front of the first loop...
  'primer lazo > segundo lazo', // ...and comes back behind the line
  'punta por detrás > segundo lazo'];
// The tip between the loops: in front of the first loop (at the base and at the top),
// behind the second.
const lazoTip = [...lazoSecond, 'punta entre lazos > primer lazo', 'punta entre lazos > primer lazo',
  'segundo lazo > punta entre lazos', 'punta entre lazos > punta por detrás'];
// The second loop pulled through the first: each leg once over the first loop and once
// under it; the back leg still goes around behind the line; the tip stays trapped.
const lazoThrough = [...lazoStart,
  'pata de abajo > primer lazo', 'primer lazo > pata de abajo',
  'primer lazo > pata de arriba', 'primer lazo > pata de arriba', 'punta por detrás > pata de arriba',
  'pata de arriba > punta entre lazos',
  'punta entre lazos > primer lazo', 'punta entre lazos > primer lazo', 'punta entre lazos > punta por detrás'];

// Nudo de carrete (arbor knot), from the references (Netknots: "tie a simple overhand
// knot around the standing part with the tag end", "tie a second overhand knot in the
// tag end"; Wired2Fish: "pass it under the standing end. Bring it back over and through
// the loop you've created"; Wikipedia and EsPesca agree). An overhand knot is three
// crossings of the line with itself, alternating; the first one goes around the line:
// under it first, then back over it, and the tip, going through the loop, passes under it
// again (the line and the tip both go through the loop, side by side).
const carreteFirst = ['línea > primer nudo', 'primer nudo > línea', 'línea > primer nudo', // under it, back over it, through the loop beside it
  'primer nudo > primer nudo', 'primer nudo > primer nudo', 'primer nudo > primer nudo'];
const carreteBoth = [...carreteFirst, 'tope > tope', 'tope > tope', 'tope > tope'];

// Palomar, from the references (guía A p. 2 and Wilson p. 6 in docs/referencias-nudos.md;
// Netknots: "double about 6 inches of line and pass through eye of hook. Tie a simple
// overhand knot in the doubled line, letting hook hang loose... pull loop of line far
// enough to pass it over the hook. Pull both tag end and standing line to tighten").
// The doubled line is two strands side by side ("ida", toward the fold, and "vuelta", back
// to the tip): each crossing of the doubled line with itself is four crossings of the
// strands, the upper pair over the lower pair. Both strands go through the eye.
const both = (over, under) => [`${over} (ida) > ${under} (ida)`, `${over} (ida) > ${under} (vuelta)`, `${over} (vuelta) > ${under} (ida)`, `${over} (vuelta) > ${under} (vuelta)`];
const throughEye = (part) => [`ojo adelante > ${part} (ida)`, `${part} (ida) > ojo atrás`, `ojo adelante > ${part} (vuelta)`, `${part} (vuelta) > ojo atrás`];
const palomarKnot = [...both('nudo', 'nudo'), ...both('nudo', 'nudo'), ...both('nudo', 'nudo'), ...throughEye('nudo')]; // an overhand: three crossings

const EXPECTED = {
  palomar: [
    throughEye('doble'), // the fold through the eye: both strands
    palomarKnot, // the overhand with the doubled line, its loop through the eye
    [...palomarKnot, 'lazo > anzuelo'], // the hook through the loop: the loop passes in front of the shank
    [...palomarKnot, 'lazo > anzuelo', 'anzuelo > lazo'], // tight: the loop around the shank, in front and behind
    [...palomarKnot, 'lazo > anzuelo', 'anzuelo > lazo'],
  ],
  carrete: [
    carreteFirst, // around the spool (behind its flange: no crossings) and the first knot
    carreteBoth,
    carreteBoth, // pulled: the first knot slides down to the spool, the same knots
    carreteBoth,
  ],
  'lazo-perfecto': [
    lazoStart,
    lazoSecond, // the turn around the line
    lazoTip,
    lazoThrough, // the second loop halfway through the first
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
