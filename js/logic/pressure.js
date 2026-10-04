import { piecewise } from './interp.js';

// Change in sea-level pressure over 24 h (hPa, noon to noon) → factor 0..1.
// Falling slowly is best; a sharp rise after a front is worst.
export const PRESSURE_CURVE = [[-10, 0.2], [-7, 0.5], [-4, 1], [-1, 1], [1, 0.8], [4, 0.4], [7, 0.1]];

// Pressure is only used for the next 7 days; beyond that the forecast is unreliable.
export const PRESSURE_DAYS = 7;

export function pressureFactor(delta) {
  return piecewise(delta, PRESSURE_CURVE);
}

/**
 * Noon-to-noon pressure change per day from Open-Meteo hourly data
 * (times in local time, "YYYY-MM-DDTHH:MM"). Returns { "YYYY-MM-DD": delta }.
 */
export function noonPressureDeltas(times, pressures) {
  const noon = new Map();
  times.forEach((t, i) => {
    if (t.endsWith('T12:00') && pressures[i] != null) noon.set(t.slice(0, 10), pressures[i]);
  });
  const keys = [...noon.keys()].sort();
  const out = {};
  for (let i = 1; i < keys.length; i++) {
    const prev = new Date(keys[i - 1] + 'T00:00Z');
    const cur = new Date(keys[i] + 'T00:00Z');
    if (cur - prev === 86400000) out[keys[i]] = noon.get(keys[i]) - noon.get(keys[i - 1]);
  }
  return out;
}
