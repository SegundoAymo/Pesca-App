// Runs the drawing checks of the tests for some knots, step by step, and prints only the
// problems (faster to read than the whole `node --test`).
// Usage: node tools/nudos/chequeo.mjs <knot ids...> > /dev/null   (the result goes to stderr)
import { knotStepSvg, knotStepCount, knotCrossings, knotCloseRuns, knotStepTight } from '../../js/drawings/knots.js';
const { check, checkCrossings } = await import('../../test/knots-drawing.test.js');

const lines = [];
for (const id of process.argv.slice(2)) {
  for (let i = 0; i < knotStepCount(id); i++) {
    const tight = knotStepTight(id, i);
    const found = [...check(knotStepSvg(id, i)), ...checkCrossings(knotCrossings(id, i) ?? [], tight ? [] : knotCloseRuns(id, i) ?? [], tight)];
    for (const p of found) lines.push(`${id} paso ${i + 1}: ${p}`);
  }
}
// The imported test file also runs its own tests; wait for them, then print.
setTimeout(() => console.error(lines.length ? lines.join('\n') : 'Sin problemas.'), 50);
