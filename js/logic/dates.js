// Calendar days are plain {y, m, d} objects (m = 1..12) in Argentina time.
// Argentina is UTC-3 all year (no daylight saving), so local noon is 15:00 UTC.

const AR_OFFSET_HOURS = -3;
const DAY_MS = 86400000;

export function dayKey({ y, m, d }) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function parseDayKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return { y, m, d };
}

/** The day's local noon as a UTC timestamp (ms). */
export function localNoonUTC({ y, m, d }) {
  return Date.UTC(y, m - 1, d, 12 - AR_OFFSET_HOURS);
}

/** Today's calendar day in Argentina for a given instant. */
export function todayAR(now = new Date()) {
  const t = new Date(now.getTime() + AR_OFFSET_HOURS * 3600000);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}

export function addDays(day, n) {
  const t = new Date(Date.UTC(day.y, day.m - 1, day.d) + n * DAY_MS);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}

/** Whole days from a to b (b - a). */
export function daysBetween(a, b) {
  return Math.round((Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d)) / DAY_MS);
}

export function daysInMonth(y, m) {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** 0 = Sunday … 6 = Saturday. */
export function weekday({ y, m, d }) {
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function sameDay(a, b) {
  return a.y === b.y && a.m === b.m && a.d === b.d;
}
