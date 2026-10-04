import { localNoonUTC } from './dates.js';

export const SYNODIC_MONTH = 29.530588853;
// Reference new moon: 6 Jan 2000, 18:14 UTC.
const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

/** Moon age in days (0 = new moon) at the day's local noon. */
export function moonAge(day) {
  const days = (localNoonUTC(day) - REFERENCE_NEW_MOON) / 86400000;
  const age = days % SYNODIC_MONTH;
  return age < 0 ? age + SYNODIC_MONTH : age;
}

/** 1 at new moon, 0.5 at the quarters, 0 at full moon. Same for every species. */
export function moonFactor(day) {
  return (1 + Math.cos((2 * Math.PI * moonAge(day)) / SYNODIC_MONTH)) / 2;
}

/** Phase name for display. */
export function moonPhaseName(day) {
  const f = moonAge(day) / SYNODIC_MONTH;
  if (f < 0.0339 || f >= 0.9661) return 'Luna nueva';
  if (f < 0.2161) return 'Creciente';
  if (f < 0.2839) return 'Cuarto creciente';
  if (f < 0.4661) return 'Gibosa creciente';
  if (f < 0.5339) return 'Luna llena';
  if (f < 0.7161) return 'Gibosa menguante';
  if (f < 0.7839) return 'Cuarto menguante';
  return 'Menguante';
}

/** Illuminated fraction 0..1, for drawing the moon. */
export function moonIllumination(day) {
  return (1 - Math.cos((2 * Math.PI * moonAge(day)) / SYNODIC_MONTH)) / 2;
}
