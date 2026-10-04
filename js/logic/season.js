import { piecewise } from './interp.js';
import { daysBetween } from './dates.js';

// Estimated water temperature (°C) of a shallow pampas lake, mid-month anchors
// (Chascomús measurements, CONICET). Fixed estimate, not a reading at Navarro.
export const WATER_TEMP_BY_MONTH = [23, 23, 21, 17.5, 13.5, 10, 9.4, 10.5, 13, 16.5, 19.5, 22];

// Feeding response to water temperature: [°C, factor 0..1].
export const SEASON_RESPONSE = {
  tararira: [[11, 0], [21, 1], [28, 1], [32, 0.7]],
  carpa: [[8, 0], [12.5, 0.25], [17.5, 0.6], [22, 1], [28, 1], [32, 0.8]],
  bagre: [[6, 0], [12, 0.4], [18, 1], [28, 1], [31, 0.7]],
};

function anchor(y, monthIndex) {
  const y2 = y + Math.floor(monthIndex / 12);
  const m = ((monthIndex % 12) + 12) % 12;
  return { day: { y: y2, m: m + 1, d: 15 }, temp: WATER_TEMP_BY_MONTH[m] };
}

/** Water temperature for a day, interpolated between the 15th of each month. */
export function waterTemp(day) {
  const i = day.m - 1;
  const [a, b] = day.d >= 15 ? [anchor(day.y, i), anchor(day.y, i + 1)] : [anchor(day.y, i - 1), anchor(day.y, i)];
  const t = daysBetween(a.day, day) / daysBetween(a.day, b.day);
  return a.temp + (b.temp - a.temp) * t;
}

export function seasonFactor(species, temp) {
  return piecewise(temp, SEASON_RESPONSE[species]);
}
