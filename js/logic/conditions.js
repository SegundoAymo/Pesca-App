// Condiciones de una captura (pedido del usuario del 19/11/2026: "así tengo datos de los
// mejores días de pesca"). Lo que se calcula siempre en el teléfono: luna, agua estimada,
// temporada de la especie, momento del día y puntaje del Calendario. Lo que sale del
// pronóstico guardado (temperatura, cielo, viento, lluvia, presión) solo si hay datos de
// ese día y esa hora: si no, no se guarda nada en su lugar.
import { moonPhaseName, moonIllumination, moonAge } from './moon.js';
import { waterTemp } from './season.js';
import { scoreSpecies, SCORED_SPECIES } from './score.js';
import { monthLevel, pressureWord, windWord } from './labels.js';
import { sunTimes, momentOfDay } from './sun.js';

const NAVARRO = { lat: -35.0056, lon: -59.277 };

/**
 * conditions({ date: 'YYYY-MM-DD', time: 'HH:MM' | '', species, facts, place, day (forecast
 * day of that date, or null), delta (noon-to-noon pressure change of that date, or null) })
 */
export function catchConditions({ date, time = '', species = null, facts = null, place = null, day = null, delta = null }) {
  if (!date) return null;
  const [y, m, d] = date.split('-').map(Number);
  const dd = { y, m, d };
  const where = place || NAVARRO;
  const sun = day?.sunrise && day?.sunset ? { sunrise: day.sunrise, sunset: day.sunset } : sunTimes(dd, where.lat, where.lon);
  const out = {
    moon: moonPhaseName(dd),
    moonLight: Math.round(100 * moonIllumination(dd)),
    moonAge: Math.round(moonAge(dd) * 10) / 10,
    water: Math.round(waterTemp(dd) * 10) / 10,
    month: m,
    sunrise: sun?.sunrise ?? null,
    sunset: sun?.sunset ?? null,
    moment: momentOfDay(time, sun),
  };
  if (species && facts) {
    const lv = monthLevel(facts, m);
    if (lv) out.season = lv;
  }
  if (species && SCORED_SPECIES.includes(species)) {
    out.score = scoreSpecies(species, dd, Number.isFinite(delta) ? delta : null).score;
  }
  const h = time && day ? day.hours.find((x) => x.h === Number(time.slice(0, 2))) : null;
  if (h) {
    if (h.temp != null) out.temp = Math.round(h.temp);
    if (h.code) out.sky = h.code;
    if (h.wind != null) { out.wind = Math.round(h.wind); out.windWord = windWord(h.wind); }
    if (h.gust != null) out.gust = Math.round(h.gust);
    if (h.dir != null) out.windDir = h.dir;
    if (h.prob != null) out.rain = h.prob;
    if (h.pressure != null) out.pressure = Math.round(h.pressure);
  }
  if (Number.isFinite(delta)) {
    out.pressureDelta = Math.round(delta * 10) / 10;
    out.pressureWord = pressureWord(delta).word;
  }
  return out;
}

/** The four big moon groups, for the summary. */
export function moonGroup(name) {
  if (!name) return null;
  if (name === 'Luna nueva') return 'Luna nueva';
  if (name === 'Luna llena') return 'Luna llena';
  if (/creciente/i.test(name)) return 'Creciente';
  return 'Menguante';
}

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MOMENT = { dawn: 'Amanecer', day: 'Día', dusk: 'Atardecer', night: 'Noche' };

/** Counts of catches by each condition (only catches that have it). Returns [{ title, rows: [{ label, n }] }]. */
export function summarize(catches) {
  const count = (fn, order = null) => {
    const m = new Map();
    for (const c of catches) {
      const k = fn(c);
      if (k == null) continue;
      m.set(k, (m.get(k) || 0) + 1);
    }
    let rows = [...m.entries()].map(([label, n]) => ({ label, n }));
    if (order) rows.sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
    else rows.sort((a, b) => b.n - a.n);
    return rows;
  };
  const water = (t) => (t == null ? null : t < 14 ? 'Menos de 14 °C' : t < 18 ? '14 a 18 °C' : t < 22 ? '18 a 22 °C' : '22 °C o más');
  const sections = [
    { title: 'Momento del día', rows: count((c) => MOMENT[c.conditions?.moment], Object.values(MOMENT)) },
    { title: 'Luna', rows: count((c) => moonGroup(c.conditions?.moon), ['Luna nueva', 'Creciente', 'Luna llena', 'Menguante']) },
    { title: 'Presión', rows: count((c) => c.conditions?.pressureWord, ['Baja de golpe', 'Baja de a poco', 'Estable', 'Sube de a poco', 'Sube fuerte']) },
    { title: 'Viento', rows: count((c) => c.conditions?.windWord, ['Calma', 'Leve', 'Moderado', 'Fuerte', 'Muy fuerte', 'Temporal']) },
    { title: 'Agua estimada', rows: count((c) => water(c.conditions?.water), ['Menos de 14 °C', '14 a 18 °C', '18 a 22 °C', '22 °C o más']) },
    { title: 'Mes', rows: count((c) => (c.conditions?.month ? MONTHS[c.conditions.month - 1] : null), MONTHS) },
  ];
  return sections.filter((s) => s.rows.length);
}
