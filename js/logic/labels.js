// Words and levels shown next to numbers (2026-11 redesign). They are presentation of
// data the app already has, not new data: see docs/spec.md, "Rediseño de noviembre 2026".
import { FLOOR } from './score.js';

/** Word for a fish score: Flojo (< 70), Bueno (70–84), Muy bueno (85 or more). Only three
    words: the top of the scale leans on the moon, the factor with the least evidence. */
export function scoreWord(score) {
  if (score < FLOOR) return 'Flojo';
  if (score < 85) return 'Bueno';
  return 'Muy bueno';
}

/**
 * Pressure change in 24 h (hPa) in words, following the general tips: falling slowly is
 * best, steady is fine, rising hard after a front is worst, falling fast brings a storm.
 * Cuts from the score curve (js/logic/pressure.js): -7, -1, 1 and 4 hPa.
 */
export function pressureWord(delta) {
  if (delta == null || !Number.isFinite(delta)) return null;
  if (delta <= -7) return { word: 'Baja de golpe', help: 'Se puede venir tormenta', good: false };
  if (delta < -1) return { word: 'Baja de a poco', help: 'Lo mejor para el pique', good: true };
  if (delta <= 1) return { word: 'Estable', help: 'Está bien', good: true };
  if (delta < 4) return { word: 'Sube de a poco', help: 'El pique baja un poco', good: null };
  return { word: 'Sube fuerte', help: 'Después de un frente: el pique cae', good: false };
}

/** Wind in plain words, by Beaufort ranges (km/h): 0–1 calma, 2–3 leve, 4 moderado,
    5 fuerte, 6–7 muy fuerte, 8 or more temporal. Plain words because at 30 km/h the
    official "brisa fresca" sounds mild, and on the shore it already bothers. */
const WIND_WORDS = [[6, 'Calma'], [20, 'Leve'], [29, 'Moderado'], [39, 'Fuerte'], [62, 'Muy fuerte']];
export function windWord(kmh) {
  if (kmh == null || !Number.isFinite(kmh)) return '';
  for (const [max, word] of WIND_WORDS) if (kmh < max) return word;
  return 'Temporal';
}
/** 0 calm to 3 strong: for the color of the wind number. */
export function windLevel(kmh) {
  if (kmh == null) return 0;
  if (kmh < 20) return 0;
  if (kmh < 39) return 1;
  if (kmh < 62) return 2;
  return 3;
}

/** Level of a month (1..12) for a species: 'good', 'some', 'off', 'closed' (veda) or null (no data). */
export function monthLevel(facts, month, veda = null) {
  if (veda && inRange(month, veda.from[0], veda.to[0])) return 'closed';
  if (!facts?.months) return null;
  if (facts.months.good.includes(month)) return 'good';
  if (facts.months.some.includes(month)) return 'some';
  return 'off';
}

function inRange(m, from, to) {
  return from <= to ? m >= from && m <= to : m >= from || m <= to;
}

export const MOMENTS = [
  { id: 'dawn', label: 'Amanecer' },
  { id: 'day', label: 'Día' },
  { id: 'dusk', label: 'Atardecer' },
  { id: 'night', label: 'Noche' },
];

export const DEPTHS = { surface: 'Superficie', midwater: 'Media agua', bottom: 'Fondo' };
