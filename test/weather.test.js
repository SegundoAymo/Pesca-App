import test from 'node:test';
import assert from 'node:assert/strict';
import { skyCode, windDir, buildDays, rangeText } from '../js/logic/weather.js';

function forecast(day, hourly) {
  const time = [];
  for (let h = 0; h < 24; h++) time.push(`${day}T${String(h).padStart(2, '0')}:00`);
  const fill = (v) => time.map((_, i) => (typeof v === 'function' ? v(i) : v));
  return {
    hourly: {
      time,
      temperature_2m: fill(hourly.temp ?? ((h) => 10 + h / 2)),
      precipitation_probability: fill(hourly.prob ?? 0),
      precipitation: fill(hourly.mm ?? 0),
      weather_code: fill(hourly.wmo ?? 1),
      wind_speed_10m: fill(hourly.wind ?? ((h) => 10 + (h === 15 ? 20 : 0))),
      wind_direction_10m: fill(hourly.dir ?? 180),
      wind_gusts_10m: fill(hourly.gust ?? 25),
      is_day: fill((h) => (h >= 7 && h <= 19 ? 1 : 0)),
    },
    daily: { time: [day], sunrise: [`${day}T07:02`], sunset: [`${day}T19:33`] },
  };
}

test('códigos WMO', () => {
  assert.equal(skyCode(0), 'sol');
  assert.equal(skyCode(0, false), 'luna');
  assert.equal(skyCode(2), 'parcial');
  assert.equal(skyCode(3), 'nube');
  assert.equal(skyCode(45), 'niebla');
  assert.equal(skyCode(61), 'lluvia');
  assert.equal(skyCode(81), 'lluvia');
  assert.equal(skyCode(95), 'tormenta');
});

test('dirección del viento', () => {
  assert.equal(windDir(0), 'N');
  assert.equal(windDir(350), 'N');
  assert.equal(windDir(225), 'SO');
  assert.equal(windDir(90, true), 'este');
});

test('resumen de un día soleado', () => {
  const d = buildDays(forecast('2026-10-04', {}))['2026-10-04'];
  assert.equal(d.code, 'sol');
  assert.equal(d.sky, 'Soleado');
  assert.equal(d.min, 10);
  assert.equal(d.max, 22);
  assert.equal(d.wind, 30);
  assert.equal(d.sunrise, '07:02');
  assert.equal(d.hours.length, 24);
  assert.equal(d.hours[2].code, 'luna');
  assert.deepEqual(d.storms, []);
});

test('tormenta por la tarde', () => {
  const d = buildDays(forecast('2026-10-04', {
    wmo: (h) => (h >= 17 && h <= 20 ? 95 : 2),
    prob: (h) => (h >= 17 && h <= 20 ? 70 : 5),
    mm: (h) => (h >= 17 && h <= 20 ? 0.5 : 0),
  }))['2026-10-04'];
  assert.equal(d.code, 'tormenta');
  assert.equal(d.sky, 'Tormenta por la tarde');
  assert.deepEqual(d.storms, [{ from: 17, to: 20 }]);
  assert.equal(rangeText(d.storms[0]), '17 a 21 h');
  assert.equal(d.prob, 70);
  assert.equal(d.mm, 2);
});

test('lluvia por la mañana', () => {
  const d = buildDays(forecast('2026-10-05', {
    wmo: (h) => (h >= 4 && h <= 11 ? 61 : 3),
    prob: (h) => (h >= 4 && h <= 11 ? 80 : 10),
  }))['2026-10-05'];
  assert.equal(d.sky, 'Lluvia de madrugada');
  const d2 = buildDays(forecast('2026-10-05', {
    wmo: (h) => (h >= 8 && h <= 11 ? 61 : 3),
    prob: (h) => (h >= 8 && h <= 11 ? 80 : 10),
  }))['2026-10-05'];
  assert.equal(d2.sky, 'Lluvia por la mañana');
});
