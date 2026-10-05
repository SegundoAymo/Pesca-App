// Lists the crossings of the knots drawn in 3D, step by step: where each one is, which
// part goes over which, the angle and the depth difference. For the review: over and
// under come from here, not from looking at the image.
// Use: node tools/nudos/cruces.mjs [ids...]   (without ids: every knot drawn in 3D)
import { KNOTS } from '../../js/data/knots.js';
import { knotCrossings, knotStepCount } from '../../js/drawings/knots.js';

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(KNOTS);
for (const id of ids) {
  if (!knotCrossings(id, 0)) {
    if (process.argv.length > 2) console.log(`${id}: todavía no está dibujado en 3D (no hay lista de cruces).\n`);
    continue;
  }
  console.log(`${KNOTS[id].name} (${id})`);
  for (let i = 0; i < knotStepCount(id); i++) {
    console.log(`  Paso ${i + 1}. ${KNOTS[id].steps[i]}`);
    const list = knotCrossings(id, i);
    if (!list.length) console.log('    sin cruces');
    for (const c of list) console.log(`    (${c.x}, ${c.y})  ${c.over} POR ENCIMA de ${c.under}   ángulo ${c.angle}°, profundidad ${c.dz}`);
  }
  console.log('');
}
