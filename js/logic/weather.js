// Turns an Open-Meteo forecast into per-day summaries for Clima and the Calendar.
// Pure functions: no network, no DOM.

/** WMO weather code → sky code used by the icons. */
export function skyCode(wmo, isDay = true) {
  let code;
  if (wmo == null) code = 'nube';
  else if (wmo >= 95) code = 'tormenta';
  else if (wmo >= 71 && wmo <= 77) code = 'nieve';
  else if (wmo === 85 || wmo === 86) code = 'nieve';
  else if (wmo >= 51) code = 'lluvia';
  else if (wmo === 45 || wmo === 48) code = 'niebla';
  else if (wmo === 3) code = 'nube';
  else if (wmo === 2) code = 'parcial';
  else code = 'sol';
  if (!isDay && code === 'sol') return 'luna';
  if (!isDay && code === 'parcial') return 'parcial-noche';
  return code;
}

export const SKY_TEXT = {
  sol: 'Soleado', luna: 'Despejado', parcial: 'Parcialmente nublado', 'parcial-noche': 'Algo nublado',
  nube: 'Nublado', niebla: 'Niebla', lluvia: 'Lluvia', nieve: 'Nieve', tormenta: 'Tormenta eléctrica',
};

const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
const DIRS_LONG = ['norte', 'noreste', 'este', 'sureste', 'sur', 'suroeste', 'oeste', 'noroeste'];

/** Compass point the wind comes from. */
export function windDir(deg, long = false) {
  if (deg == null) return '';
  const i = Math.round((((deg % 360) + 360) % 360) / 45) % 8;
  return (long ? DIRS_LONG : DIRS)[i];
}

function partOfDay(hour) {
  if (hour < 6) return 'de madrugada';
  if (hour < 12) return 'por la mañana';
  if (hour < 19) return 'por la tarde';
  return 'a la noche';
}

const round1 = (x) => Math.round(x * 10) / 10;

/** Contiguous hour ranges where test(hour) holds: [{ from, to }] (inclusive hours). */
function ranges(hours, test) {
  const out = [];
  for (const h of hours) {
    if (!test(h)) continue;
    const last = out[out.length - 1];
    if (last && last.to === h.h - 1) last.to = h.h;
    else out.push({ from: h.h, to: h.h });
  }
  return out;
}

/**
 * Builds { "YYYY-MM-DD": day } from an Open-Meteo response with
 * hourly: time, temperature_2m, precipitation_probability, precipitation, weather_code,
 *         wind_speed_10m, wind_direction_10m, wind_gusts_10m, is_day
 * daily: time, sunrise, sunset.
 */
export function buildDays(data) {
  const H = data.hourly;
  const days = {};
  H.time.forEach((t, i) => {
    const key = t.slice(0, 10);
    const isDay = H.is_day ? H.is_day[i] === 1 : true;
    const hour = {
      time: t,
      h: Number(t.slice(11, 13)),
      wmo: H.weather_code?.[i] ?? null,
      code: skyCode(H.weather_code?.[i], isDay),
      temp: H.temperature_2m?.[i] ?? null,
      prob: H.precipitation_probability?.[i] ?? null,
      mm: H.precipitation?.[i] ?? null,
      wind: H.wind_speed_10m?.[i] ?? null,
      gust: H.wind_gusts_10m?.[i] ?? null,
      dir: H.wind_direction_10m?.[i] ?? null,
      isDay,
    };
    (days[key] ||= { key, hours: [] }).hours.push(hour);
  });

  const D = data.daily || { time: [] };
  D.time.forEach((key, i) => {
    if (!days[key]) return;
    days[key].sunrise = D.sunrise?.[i]?.slice(11, 16) ?? null;
    days[key].sunset = D.sunset?.[i]?.slice(11, 16) ?? null;
  });

  for (const day of Object.values(days)) Object.assign(day, summarize(day.hours));
  return days;
}

/** Level-1 summary of a day's hours. */
export function summarize(hours) {
  const vals = (k) => hours.map((h) => h[k]).filter((v) => v != null && Number.isFinite(v));
  const max = (k) => (vals(k).length ? Math.max(...vals(k)) : null);
  const min = (k) => (vals(k).length ? Math.min(...vals(k)) : null);

  const windHour = hours.reduce((a, h) => (h.wind != null && (a == null || h.wind > a.wind) ? h : a), null);
  const storms = ranges(hours, (h) => h.code === 'tormenta');
  const rains = ranges(hours, (h) => h.code === 'lluvia' && (h.prob ?? 100) >= 40);
  const mmList = vals('mm');

  let code;
  let sky;
  if (storms.length) {
    code = 'tormenta';
    sky = `Tormenta ${partOfDay(storms[0].from)}`;
  } else if (rains.length) {
    code = 'lluvia';
    const longest = rains.reduce((a, r) => (r.to - r.from > a.to - a.from ? r : a));
    sky = longest.to - longest.from >= 12 ? 'Lluvia todo el día' : `Lluvia ${partOfDay(longest.from)}`;
  } else {
    // Most frequent sky during daylight (or all day if there is no daylight data).
    const daylight = hours.filter((h) => h.isDay);
    const pool = daylight.length ? daylight : hours;
    const count = {};
    for (const h of pool) count[h.code] = (count[h.code] || 0) + 1;
    code = Object.keys(count).reduce((a, b) => (count[b] > count[a] ? b : a), pool[0]?.code ?? 'nube');
    sky = SKY_TEXT[code];
  }

  return {
    code,
    sky,
    min: min('temp') != null ? Math.round(min('temp')) : null,
    max: max('temp') != null ? Math.round(max('temp')) : null,
    prob: max('prob'),
    mm: mmList.length ? round1(mmList.reduce((a, b) => a + b, 0)) : null,
    wind: max('wind') != null ? Math.round(max('wind')) : null,
    gust: max('gust') != null ? Math.round(max('gust')) : null,
    dir: windHour?.dir ?? null,
    storms,
  };
}

/** "17 a 21 h" for a storm range (to is inclusive: the storm lasts through that hour). */
export function rangeText({ from, to }) {
  return from === to ? `${from} h` : `${from} a ${to + 1} h`;
}
