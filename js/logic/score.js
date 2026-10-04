import { dayKey, daysBetween } from './dates.js';
import { moonFactor } from './moon.js';
import { waterTemp, seasonFactor } from './season.js';
import { pressureFactor, PRESSURE_DAYS } from './pressure.js';

export const SCORED_SPECIES = ['tararira', 'carpa', 'bagre'];

// Weights: season, moon, pressure.
export const WEIGHTS = {
  tararira: { season: 0.35, moon: 0.45, pressure: 0.2 },
  carpa: { season: 0.3, moon: 0.2, pressure: 0.5 },
  bagre: { season: 0.15, moon: 0.65, pressure: 0.2 },
};

/** Minimum score for a fish to be drawn on the Calendar. */
export const FLOOR = 70;

/**
 * Score 0..100 for one species on one day.
 * pressureDelta: hPa change noon-to-noon, or null when there is no data
 * (its weight is then shared between season and moon, never invented).
 */
export function scoreSpecies(species, day, pressureDelta = null) {
  const w = WEIGHTS[species];
  const temp = waterTemp(day);
  const season = seasonFactor(species, temp);
  const moon = moonFactor(day);
  const hasPressure = pressureDelta != null && Number.isFinite(pressureDelta);
  const pressure = hasPressure ? pressureFactor(pressureDelta) : null;

  let value = hasPressure
    ? w.season * season + w.moon * moon + w.pressure * pressure
    : (w.season * season + w.moon * moon) / (w.season + w.moon);

  // Cold gate: with cold water, moon or pressure can't make a good day.
  const gate = season < 0.5 ? season / 0.5 : 1;
  value *= gate;

  return { species, score: Math.round(100 * value), raw: 100 * value, temp, season, moon, pressure, gate, usedPressure: hasPressure };
}

/**
 * Scores for the three species on a day.
 * deltas: { "YYYY-MM-DD": hPa } from the forecast; used only from today up to PRESSURE_DAYS ahead.
 */
export function scoreDay(day, today, deltas = {}) {
  const ahead = daysBetween(today, day);
  const delta = ahead >= 0 && ahead < PRESSURE_DAYS ? deltas[dayKey(day)] ?? null : null;
  const results = SCORED_SPECIES.map((s) => scoreSpecies(s, day, delta));
  const shown = results.filter((r) => r.score >= FLOOR);
  const best = shown.reduce((a, b) => (b.score > (a?.score ?? -1) ? b : a), null);
  return { day, results, shown, best, usedPressure: delta != null };
}

/** Icon/background strength 0..1 for a score at or above the floor. */
export function intensity(score) {
  return Math.max(0, Math.min(1, (score - FLOOR) / (100 - FLOOR)));
}
