import test from 'node:test';
import assert from 'node:assert/strict';
import { KNOTS, SITUATIONS } from '../js/data/knots.js';
import { RIGS } from '../js/data/rigs.js';
import { knotStepCount, knotStepSvg } from '../js/drawings/knots.js';
import { rigSvg } from '../js/drawings/rigs.js';

test('cada paso de cada nudo tiene su dibujo', () => {
  let total = 0;
  for (const k of Object.values(KNOTS)) {
    assert.equal(knotStepCount(k.id), k.steps.length, `${k.id}: ${knotStepCount(k.id)} dibujos para ${k.steps.length} pasos`);
    k.steps.forEach((_, i) => assert.match(knotStepSvg(k.id, i), /^<svg/));
    total += k.steps.length;
  }
  assert.equal(total, 87);
});

test('cada armado tiene su dibujo', () => {
  for (const r of Object.values(RIGS)) assert.match(rigSvg(r), /^<svg/);
  assert.equal(Object.keys(RIGS).length, 11);
});

test('las situaciones apuntan a nudos y armados que existen', () => {
  for (const s of SITUATIONS) {
    for (const id of s.knots) assert.ok(KNOTS[id], id);
    for (const id of s.rigs || []) assert.ok(RIGS[id], id);
  }
});
