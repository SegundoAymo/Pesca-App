// Salida y puesta del sol calculadas en el teléfono (ecuación del amanecer de NOAA,
// simplificada; error de unos pocos minutos). Sirve para saber si una captura fue al
// amanecer, de día, al atardecer o de noche aunque no haya pronóstico guardado de ese día.

const rad = Math.PI / 180;

/** Sunrise and sunset in local Argentine time (UTC−3) as "HH:MM", or null (polar day/night). */
export function sunTimes({ y, m, d }, lat, lon) {
  const n = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2000, 0, 1, 12)) / 86400000);
  const J = n - lon / 360;
  const M = (357.5291 + 0.98560028 * J) % 360;
  const C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 0.0003 * Math.sin(3 * M * rad);
  const L = (M + C + 180 + 102.9372) % 360;
  const transit = 2451545 + J + 0.0053 * Math.sin(M * rad) - 0.0069 * Math.sin(2 * L * rad);
  const dec = Math.asin(Math.sin(L * rad) * Math.sin(23.4397 * rad));
  const cosH = (Math.sin(-0.833 * rad) - Math.sin(lat * rad) * Math.sin(dec)) / (Math.cos(lat * rad) * Math.cos(dec));
  if (cosH < -1 || cosH > 1) return null;
  const H = Math.acos(cosH) / rad / 360;
  const toLocal = (jd) => {
    const ms = (jd - 2440587.5) * 86400000 - 3 * 3600000;
    const t = new Date(ms);
    return `${String(t.getUTCHours()).padStart(2, '0')}:${String(t.getUTCMinutes()).padStart(2, '0')}`;
  };
  return { sunrise: toLocal(transit - H), sunset: toLocal(transit + H) };
}

const mins = (hhmm) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

/**
 * Moment of the day of a time "HH:MM": 'dawn' (from 1 h before to 1 h after sunrise),
 * 'dusk' (the same around sunset), 'day' or 'night'. The one-hour window is a choice of
 * the app (docs/spec.md), the same for every species.
 */
export function momentOfDay(time, sun) {
  if (!time || !sun) return null;
  const t = mins(time);
  const up = mins(sun.sunrise);
  const down = mins(sun.sunset);
  if (Math.abs(t - up) <= 60) return 'dawn';
  if (Math.abs(t - down) <= 60) return 'dusk';
  return t > up && t < down ? 'day' : 'night';
}
