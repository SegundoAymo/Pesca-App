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

// Clinch mejorado, from the references (Wilson p. 5 "medio nudo barril asegurado", in
// docs/referencias-nudos.md; Netknots: "thread the line through the eye, make five or more
// twists around the standing line, pass the end through the small loop next to the eye,
// then through the big loop"). The line goes through the eye; each turn of the wraps goes
// once in front of the line and once behind it; through a loop is in behind one side of
// it and out in front of the other (or the other way).
const wraps = (n) => Array.from({ length: n }, () => ['vueltas > línea', 'línea > vueltas']).flat();
const clinchStart = ['línea > ojo atrás', 'ojo adelante > por el ojo', ...wraps(5)]; // through the eye: behind its back half, under its front half
const clinchSmall = [...clinchStart, 'por el ojo > al lazo chico', 'al lazo chico > línea']; // in behind the strand back from the eye, out in front of the line
const clinchBig = [...clinchSmall, 'por el lazo grande > línea', 'por el lazo grande > por el ojo', 'al lazo chico > por el lazo grande']; // in front, out behind its far side

// Uni, from the references (guía A p. 1, Wilson p. 9; Netknots: "double back parallel to
// standing line. Make a circle with the tag end over the doubled lines. Make 6 turns with
// the tag end around the double line and through the circle"). The loop goes in front of
// the line; each wrap goes in front of both lines and then behind them.
// Five turns and a half: six passes in front, five behind.
const uniWraps = (n) => [...Array.from({ length: n + 1 }, () => ['vueltas > línea', 'vueltas > por el ojo']).flat(), ...Array.from({ length: n }, () => ['línea > vueltas', 'por el ojo > vueltas']).flat()];
const uniStart = ['línea > ojo atrás', 'ojo adelante > por el ojo', 'lazo > línea'];
const uniAll = [...uniStart, ...uniWraps(5)];

const snellStart = ['lazo > anzuelo', 'lazo > punta']; // the loop goes down in front of the shank and the tip
const snellAll = [...snellStart, ...['anzuelo', 'punta', 'línea'].flatMap((x) => Array.from({ length: 5 }, () => [`vueltas > ${x}`, `${x} > vueltas`]).flat())];

// Cirujano: the two lines tied as one; each crossing of the pair is four (green and orange
// over green and orange). Guía A p. 4: "haz una lazada con los dos hilos / pasa las dos
// hebras por dentro de la lazada. Repite la operación 2 veces"; Wilson p. 45: "medio nudo"
// and then "una segunda vuelta". Each pass goes once around the pair inside the loop (over
// it, then under it), and the end goes out over the loop.
const pairX = (over, under, n = 1) => Array.from({ length: n }, () => ['verde', 'naranja'].flatMap((a) => ['verde', 'naranja'].map((b) => `${over} (${a}) > ${under} (${b})`))).flat();
const cirujanoOnce = [...pairX('pasada', 'juntas'), ...pairX('juntas', 'pasada'), ...pairX('salida', 'lazo')];
const cirujanoTwice = [...cirujanoOnce, ...pairX('segunda pasada', 'juntas'), ...pairX('juntas', 'segunda pasada')];


// Doble uni, from the references (Wilson p. 22: "rodee ambas líneas por el interior del
// bucle", "normalmente se hacen cuatro vueltas", "haga lo mismo con la otra línea";
// Wired2Fish: "create a loop ... wrap the tag end around the two lines inside of the loop
// ... 4 times", "repeat with the second line"). Each end ties a Uni around both lines: its
// loop crosses in front of the other line (it rises from its own), and each wrap goes in
// front of both lines and back behind them. Three turns and a half: four passes in front
// (the 4 turns the guides count), three behind. The second knot is the first one turned half around.
const duKnot = (me, other) => [`lazo ${me} > ${other}`,
  ...Array.from({ length: 4 }, () => [`vueltas ${me} > ${me}`, `vueltas ${me} > ${other}`]).flat(),
  ...Array.from({ length: 3 }, () => [`${me} > vueltas ${me}`, `${other} > vueltas ${me}`]).flat()];
const duBoth = [...duKnot('verde', 'naranja'), ...duKnot('naranja', 'verde')];


// Lazo de cirujano: the Cirujano's double overhand, tied with the line doubled on itself
// (Wilson p. 16: "forme un bucle en el extremo", "haga un medio nudo en el bucle", "añada otra
// vuelta"; Saltwater Sportsman / Cast & Spear: "with the doubled line, tie a loose overhand
// knot", "pass the loop end through that same overhand knot one more time"). The two strands
// ("ida", the main line, and "vuelta", to the tip) go together: each crossing is four.
const pairD = (over, under) => ['ida', 'vuelta'].flatMap((a) => ['ida', 'vuelta'].map((b) => `${over} (${a}) > ${under} (${b})`));
const lcOnce = [...pairD('pasada', 'juntas'), ...pairD('juntas', 'pasada'), ...pairD('salida', 'lazo')];
const lcTwice = [...lcOnce, ...pairD('segunda pasada', 'juntas'), ...pairD('juntas', 'segunda pasada')];


// Nudo de brazolada (dropper loop), from the references (Wilson p. 14: "haga un bucle amplio
// ... que se cruce sobre la línea principal", "dé cuatro vueltas completas", "pase después el
// bucle mayor a través del bucle pequeño"; Wikipedia: "twist up the overlap ... dropping the
// loop through the central twist"). The loop crosses over the line where it goes on; the
// overlap is twisted 4 turns on each side of the opening: a twist of two strands, so at each
// crossing the other one is in front (8 crossings a side, 16 in all, half each way). The loop
// goes through the opening from the front: each leg in front of the upper stretch and behind
// the lower one.
const brTwist = Array.from({ length: 8 }, () => ['de abajo > de arriba', 'de arriba > de abajo']).flat();
const brThrough = ['lazo derecho > sigue la línea', ...brTwist, 'lazo baja > de arriba', 'de abajo > lazo baja', 'lazo sube > de arriba', 'de abajo > lazo sube'];

const EXPECTED = {
  brazolada: [['lazo > sigue la línea'], ['lazo > sigue la línea', ...brTwist], brThrough, brThrough], // tight: the same crossings
  'lazo-cirujano': [[], lcOnce, lcTwice, lcTwice, lcTwice],
  'doble-uni': [[], duKnot('verde', 'naranja'), duKnot('verde', 'naranja'), duBoth, duBoth, duBoth, duBoth], // sliding them together adds no crossing
  cirujano: [[], cirujanoOnce, cirujanoTwice, cirujanoTwice, cirujanoTwice],
  snell: [snellStart, snellAll, snellAll, snellAll], // each wrap goes around the shank and both lines
  uni: [uniStart, uniAll, uniAll, uniAll, uniAll],
  clinch: [clinchStart, clinchSmall, clinchBig, clinchBig, clinchBig],
  palomar: [
    throughEye('doble'), // the fold through the eye: both strands
    palomarKnot, // the overhand with the doubled line, its loop through the eye
    [...palomarKnot, 'lazo > anzuelo', 'anzuelo > lazo', 'anzuelo > lazo'], // the hook through the loop: in front of the shank, behind the bend
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
