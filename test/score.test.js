import test from 'node:test';
import assert from 'node:assert/strict';
import { moonFactor, moonAge, moonPhaseName } from '../js/logic/moon.js';
import { waterTemp, seasonFactor } from '../js/logic/season.js';
import { pressureFactor, noonPressureDeltas } from '../js/logic/pressure.js';
import { scoreSpecies, scoreDay, intensity } from '../js/logic/score.js';
import { addDays, daysBetween, todayAR, dayKey } from '../js/logic/dates.js';

const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} ≉ ${b}`);

test('luna nueva del 10 de octubre de 2026', () => {
  // New moon on 10 Oct 2026 ~15:50 UTC, near local noon.
  assert.ok(moonFactor({ y: 2026, m: 10, d: 10 }) > 0.99);
  assert.equal(moonPhaseName({ y: 2026, m: 10, d: 10 }), 'Luna nueva');
});

test('luna llena del 26 de octubre de 2026 da factor cerca de 0', () => {
  assert.ok(moonFactor({ y: 2026, m: 10, d: 26 }) < 0.02);
  assert.equal(moonPhaseName({ y: 2026, m: 10, d: 26 }), 'Luna llena');
});

test('edad lunar siempre entre 0 y el mes sinódico', () => {
  for (let i = 0; i < 400; i++) {
    const a = moonAge(addDays({ y: 1999, m: 1, d: 1 }, i * 37));
    assert.ok(a >= 0 && a < 29.54);
  }
});

test('temperatura del agua: anclas a mitad de mes e interpolación', () => {
  close(waterTemp({ y: 2026, m: 7, d: 15 }), 9.4);
  close(waterTemp({ y: 2026, m: 10, d: 15 }), 16.5);
  close(waterTemp({ y: 2026, m: 1, d: 15 }), 23);
  // Between 15 Dec (22) and 15 Jan (23), crossing the year.
  const t = waterTemp({ y: 2026, m: 12, d: 31 });
  assert.ok(t > 22 && t < 23);
  const t2 = waterTemp({ y: 2027, m: 1, d: 1 });
  assert.ok(t2 > t && t2 < 23);
});

test('respuesta a temperatura por especie', () => {
  assert.equal(seasonFactor('tararira', 11), 0);
  assert.equal(seasonFactor('tararira', 24), 1);
  close(seasonFactor('tararira', 32), 0.7);
  close(seasonFactor('carpa', 12.5), 0.25);
  close(seasonFactor('carpa', 17.5), 0.6);
  close(seasonFactor('bagre', 12), 0.4);
  close(seasonFactor('bagre', 15), 0.7);
});

test('curva de presión', () => {
  close(pressureFactor(-12), 0.2);
  close(pressureFactor(-7), 0.5);
  close(pressureFactor(-2.5), 1);
  close(pressureFactor(0), 0.9);
  close(pressureFactor(4), 0.4);
  close(pressureFactor(10), 0.1);
});

test('cambio de presión de mediodía a mediodía', () => {
  const times = ['2026-10-03T11:00', '2026-10-03T12:00', '2026-10-04T12:00', '2026-10-05T12:00', '2026-10-07T12:00'];
  const p = [1010, 1012, 1015.5, 1011, 1000];
  const d = noonPressureDeltas(times, p);
  close(d['2026-10-04'], 3.5);
  close(d['2026-10-05'], -4.5);
  assert.equal(d['2026-10-07'], undefined); // gap of two days
  assert.equal(d['2026-10-03'], undefined); // no previous day
});

test('octubre 2026 sin presión coincide con la simulación de calibración', () => {
  // [day, tararira, carpa, bagre] from tools/simulacion/gen.py. The simulation took the moon
  // at 12:00 UTC; the app uses local noon (15:00 UTC), which moves a score by up to 2 points.
  const expected = [[1,24,29,33],[2,29,33,41],[3,35,38,50],[4,42,43,58],[5,48,48,67],[6,55,53,75],[7,61,57,82],[8,67,61,88],[9,72,65,93],[10,76,68,95],[11,78,69,96],[12,78,70,95],[13,76,69,93],[14,74,67,88],[15,70,65,83],[16,66,61,76],[17,61,58,68],[18,55,54,59],[19,50,50,51],[20,44,47,43],[21,39,43,35],[22,35,40,29],[23,32,38,24],[24,30,37,20],[25,29,36,18],[26,29,36,18],[27,30,38,20],[28,33,40,23],[29,37,43,28],[30,42,46,35],[31,47,51,42]];
  for (const [d, t, c, b] of expected) {
    const day = { y: 2026, m: 10, d };
    for (const [sp, want] of [['tararira', t], ['carpa', c], ['bagre', b]]) {
      const got = scoreSpecies(sp, day).score;
      assert.ok(Math.abs(got - want) <= 2, `${sp} ${d}/10: ${got} vs ${want}`);
    }
  }
});

test('compuerta de frío: de junio a agosto ningún pez llega a 70', () => {
  let day = { y: 2026, m: 6, d: 1 };
  while (day.m <= 8) {
    for (const delta of [null, -2.5]) {
      for (const sp of ['tararira', 'carpa', 'bagre']) {
        assert.ok(scoreSpecies(sp, day, delta).score < 70, `${sp} ${dayKey(day)}`);
      }
    }
    day = addDays(day, 1);
  }
});

test('sin presión se reparte el peso, con presión ideal sube', () => {
  const day = { y: 2026, m: 1, d: 18 }; // summer, new moon
  const none = scoreSpecies('carpa', day, null);
  const ideal = scoreSpecies('carpa', day, -2);
  const bad = scoreSpecies('carpa', day, 7);
  assert.equal(none.usedPressure, false);
  assert.equal(ideal.usedPressure, true);
  assert.ok(ideal.score >= none.score);
  assert.ok(bad.score < none.score);
});

test('la presión solo se usa en los próximos 7 días', () => {
  const today = { y: 2026, m: 10, d: 4 };
  const deltas = {};
  for (let i = -1; i < 16; i++) deltas[dayKey(addDays(today, i))] = -2;
  assert.equal(scoreDay(addDays(today, 0), today, deltas).usedPressure, true);
  assert.equal(scoreDay(addDays(today, 6), today, deltas).usedPressure, true);
  assert.equal(scoreDay(addDays(today, 7), today, deltas).usedPressure, false);
  assert.equal(scoreDay(addDays(today, -1), today, deltas).usedPressure, false);
});

test('scoreDay muestra solo peces sobre el piso y elige el mejor', () => {
  const r = scoreDay({ y: 2026, m: 10, d: 11 }, { y: 2026, m: 10, d: 1 });
  assert.deepEqual(r.shown.map((x) => x.species).sort(), ['bagre', 'tararira']);
  assert.equal(r.best.species, 'bagre');
  const empty = scoreDay({ y: 2026, m: 10, d: 25 }, { y: 2026, m: 10, d: 1 });
  assert.equal(empty.shown.length, 0);
  assert.equal(empty.best, null);
});

test('intensidad del color', () => {
  assert.equal(intensity(70), 0);
  assert.equal(intensity(100), 1);
  close(intensity(85), 0.5);
});

test('fechas en hora de Argentina', () => {
  assert.deepEqual(todayAR(new Date('2026-10-05T02:30:00Z')), { y: 2026, m: 10, d: 4 });
  assert.deepEqual(todayAR(new Date('2026-10-05T03:30:00Z')), { y: 2026, m: 10, d: 5 });
  assert.equal(daysBetween({ y: 2026, m: 12, d: 30 }, { y: 2027, m: 1, d: 2 }), 3);
});
