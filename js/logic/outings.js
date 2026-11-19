// Salidas de pesca (pedido del usuario del 19/11/2026): anotar también las salidas en las
// que no se sacó nada, para comparar de verdad qué condiciones rinden. Lógica pura: los
// datos se guardan en js/screens/catches.js.
import { moonGroup } from './conditions.js';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MOMENT = { dawn: 'Amanecer', day: 'Día', dusk: 'Atardecer', night: 'Noche' };

/** The outing in progress, if any. */
export function activeOuting(outings) {
  return outings.find((o) => o.active) || null;
}

/** Catches of an outing. */
export function catchesOf(outing, catches) {
  return catches.filter((c) => c.outingId === outing.id);
}

/**
 * Every outing with its catches. Catches saved without an outing (before outings existed,
 * or loose) count as one outing with fish per day, with the conditions of its first catch.
 */
export function allOutings(outings, catches) {
  const list = outings.filter((o) => !o.active).map((o) => ({ ...o, n: catchesOf(o, catches).length }));
  const loose = new Map();
  for (const c of catches) {
    if (c.outingId || !c.date || !c.conditions) continue;
    const k = c.date;
    if (!loose.has(k)) loose.set(k, { id: `dia-${k}`, date: k, start: c.time || '', conditions: c.conditions, n: 0, implicit: true });
    loose.get(k).n += 1;
  }
  return [...list, ...loose.values()].sort((a, b) => (b.date + (b.start || '')).localeCompare(a.date + (a.start || '')));
}

const waterRange = (t) => (t == null ? null : t < 14 ? 'Menos de 14 °C' : t < 18 ? '14 a 18 °C' : t < 22 ? '18 a 22 °C' : '22 °C o más');

/** Last water temperature measured in an outing, or null. */
export function measuredWater(o) {
  const w = o.water || [];
  return w.length ? w[w.length - 1].c : null;
}

/**
 * For each condition, how many outings, how many with fish and how many fish:
 * [{ title, rows: [{ label, outings, withFish, fish }] }]. Only conditions that some outing has.
 */
export function outingStats(outings) {
  const group = (fn, order) => {
    const m = new Map();
    for (const o of outings) {
      const k = fn(o);
      if (k == null) continue;
      const r = m.get(k) || { label: k, outings: 0, withFish: 0, fish: 0 };
      r.outings += 1;
      if (o.n > 0) r.withFish += 1;
      r.fish += o.n;
      m.set(k, r);
    }
    return [...m.values()].sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
  };
  const c = (o) => o.conditions || {};
  return [
    { title: 'Luna', rows: group((o) => moonGroup(c(o).moon), ['Luna nueva', 'Creciente', 'Luna llena', 'Menguante']) },
    { title: 'Momento en que salís', rows: group((o) => MOMENT[c(o).moment], Object.values(MOMENT)) },
    { title: 'Presión', rows: group((o) => c(o).pressureWord, ['Baja de golpe', 'Baja de a poco', 'Estable', 'Sube de a poco', 'Sube fuerte']) },
    { title: 'Viento', rows: group((o) => c(o).windWord, ['Calma', 'Leve', 'Moderado', 'Fuerte', 'Muy fuerte', 'Temporal']) },
    { title: 'Agua medida (superficie)', rows: group((o) => waterRange(measuredWater(o)), ['Menos de 14 °C', '14 a 18 °C', '18 a 22 °C', '22 °C o más']) },
    { title: 'Agua estimada', rows: group((o) => waterRange(c(o).water), ['Menos de 14 °C', '14 a 18 °C', '18 a 22 °C', '22 °C o más']) },
    { title: 'Mes', rows: group((o) => (c(o).month ? MONTHS[c(o).month - 1] : null), MONTHS) },
  ].filter((s) => s.rows.length);
}
