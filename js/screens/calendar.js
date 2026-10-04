import { ICON, calFish, weatherIcon, moonIcon } from '../icons.js';
import { screen, esc, mix, DOW, MONTHS } from '../ui.js';
import { todayAR, dayKey, parseDayKey, daysInMonth, weekday, sameDay, daysBetween } from '../logic/dates.js';
import { scoreDay, intensity, SCORED_SPECIES, FLOOR } from '../logic/score.js';
import { moonPhaseName, moonIllumination, moonAge, SYNODIC_MONTH } from '../logic/moon.js';
import { PRESSURE_DAYS } from '../logic/pressure.js';
import { cachedPressureDeltas, cachedDays } from '../weather-service.js';
import { windDir } from '../logic/weather.js';

export const keepScroll = true;

export const SPECIES_INFO = {
  tararira: { name: 'Tararira', color: '#C2410C' },
  carpa: { name: 'Carpa', color: '#0F766E' },
  bagre: { name: 'Bagre', color: '#3730A3' },
};

const FORECAST_DAYS = 16;

function monthIndex(y, m) {
  return y * 12 + (m - 1);
}

function validDay(key) {
  if (!key || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return null;
  const d = parseDayKey(key);
  if (d.m < 1 || d.m > 12 || d.d < 1 || d.d > daysInMonth(d.y, d.m)) return null;
  return d;
}

function cellHtml(day, today, selected, deltas) {
  const r = scoreDay(day, today, deltas);
  const classes = ['cell'];
  let style = '';
  if (r.best) {
    classes.push('fish');
    style = `background:${mix(SPECIES_INFO[r.best.species].color, 0.1 + 0.14 * intensity(r.best.score))}`;
  }
  if (sameDay(day, today)) classes.push('today');
  if (sameDay(day, selected)) classes.push('sel');
  const slots = SCORED_SPECIES.map((sp) => {
    const x = r.results.find((q) => q.species === sp);
    return `<span class="slot">${x.score >= FLOOR ? calFish(sp, mix(SPECIES_INFO[sp].color, 0.3 + 0.7 * intensity(x.score)), 26) : ''}</span>`;
  }).join('');
  const names = r.shown.map((x) => `${SPECIES_INFO[x.species].name} ${x.score}`).join(', ');
  const label = `${day.d} de ${MONTHS[day.m - 1]}${names ? `: ${names}` : ': ningún pez llega a 70'}`;
  return `<button type="button" class="${classes.join(' ')}" style="${style}" data-day="${dayKey(day)}" aria-label="${esc(label)}"${sameDay(day, selected) ? ' aria-current="date"' : ''}>
    <span class="n">${day.d}</span>${slots}
  </button>`;
}

function weatherLine(day, today) {
  const ahead = daysBetween(today, day);
  if (ahead < 0) return `<div class="wx-line small muted">Día pasado: no hay pronóstico.</div>`;
  if (ahead >= FORECAST_DAYS) return `<div class="wx-line small muted">Sin pronóstico todavía: llega hasta ${FORECAST_DAYS} días.</div>`;
  const wx = cachedDays()?.[dayKey(day)];
  if (!wx) return `<div class="wx-line small muted">Sin pronóstico guardado. Abrí Clima con conexión para verlo.</div>`;
  const rain = wx.prob != null ? `lluvia ${wx.prob}%` : '';
  const wind = wx.wind != null ? `viento ${windDir(wx.dir)} ${wx.wind} km/h` : '';
  return `<div class="wx-line">
    ${weatherIcon(wx.code, 38)}
    <span class="t"><strong>${esc(wx.sky)}</strong><span class="small">${wx.min}° / ${wx.max}°${rain ? ` · ${rain}` : ''}${wind ? ` · ${wind}` : ''}</span></span>
  </div>
  <a class="btn block" href="#/clima/${dayKey(day)}">Ver por hora ${ICON.chevron}</a>`;
}

function pressureNote(r, day, today, deltas) {
  const ahead = daysBetween(today, day);
  if (r.usedPressure) {
    const d = deltas[dayKey(day)];
    const txt = `${d > 0 ? '+' : ''}${d.toFixed(1).replace('.', ',')} hPa`;
    return `Con presión: cambio de ${txt} en 24 h (de mediodía a mediodía).`;
  }
  if (ahead >= 0 && ahead < PRESSURE_DAYS) return 'Sin dato de presión reciente: puntaje con temporada y luna.';
  return 'Sin presión (solo se usa en los próximos 7 días): puntaje con temporada y luna.';
}

function detailHtml(day, today, deltas) {
  const r = scoreDay(day, today, deltas);
  const temp = r.results[0].temp;
  const waxing = moonAge(day) < SYNODIC_MONTH / 2;
  const rows = SCORED_SPECIES.map((sp) => {
    const x = r.results.find((q) => q.species === sp);
    const c = SPECIES_INFO[sp].color;
    const ok = x.score >= FLOOR;
    return `<div class="score-row">
      ${calFish(sp, ok ? c : '#B9B9B2', 34)}
      <span class="name">${SPECIES_INFO[sp].name}</span>
      <span class="bar"><span class="fill" style="display:block;width:${Math.max(2, x.score)}%;background:${ok ? c : '#B9B9B2'}"></span><span class="floor"></span></span>
      <span class="val">${x.score}</span>
    </div>`;
  }).join('');
  const verdict = r.best
    ? `Mejor: <strong>${SPECIES_INFO[r.best.species].name}</strong> (${r.best.score}).`
    : `Ningún pez llega a ${FLOOR}.`;
  return `<section class="card" aria-live="polite">
    <div class="detail-head">
      <h2 class="h3">${DOW[weekday(day)]} ${day.d} de ${MONTHS[day.m - 1]}</h2>
      <span class="moon">${moonIcon(moonIllumination(day), waxing, 22)} ${moonPhaseName(day)}</span>
    </div>
    ${weatherLine(day, today)}
    <p>${verdict}</p>
    ${rows}
    <p class="small muted">La raya negra marca el piso de ${FLOOR}. ${pressureNote(r, day, today, deltas)} Agua estimada: ${temp.toFixed(1).replace('.', ',')} °C.</p>
  </section>`;
}

export function render(params, { go }) {
  const today = todayAR();
  const minM = monthIndex(today.y, today.m) - 1;
  const maxM = monthIndex(today.y, today.m) + 12;
  let selected = validDay(params[0]) || today;
  const selM = monthIndex(selected.y, selected.m);
  if (selM < minM || selM > maxM) selected = today;

  const deltas = cachedPressureDeltas();
  const { y, m } = selected;
  const first = { y, m, d: 1 };
  const lead = (weekday(first) + 6) % 7; // weeks start on Monday
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push('<span class="cell blank"></span>');
  for (let d = 1; d <= daysInMonth(y, m); d++) cells.push(cellHtml({ y, m, d }, today, selected, deltas));

  const mi = monthIndex(y, m);
  const html = screen('Calendario', `
    <div class="month-nav">
      <button type="button" class="navbtn" data-month="-1" aria-label="Mes anterior"${mi <= minM ? ' disabled' : ''}>${ICON.prev}</button>
      <h2>${MONTHS[m - 1]} ${y}</h2>
      <button type="button" class="navbtn" data-month="1" aria-label="Mes siguiente"${mi >= maxM ? ' disabled' : ''}>${ICON.next}</button>
    </div>
    <div class="weekdays" aria-hidden="true"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span></div>
    <div class="cal">${cells.join('')}</div>
    <div class="legend">
      ${SCORED_SPECIES.map((sp) => `<span>${calFish(sp, SPECIES_INFO[sp].color, 28)}${SPECIES_INFO[sp].name}</span>`).join('')}
      <span class="small muted" style="font-weight:500;width:100%">Un pez aparece si llega a ${FLOOR}. El fondo es el color del mejor pez; los días sin peces quedan apagados.</span>
    </div>
    ${sameDay(selected, today) ? '' : `<button type="button" class="btn white" data-today>Volver a hoy</button>`}
    ${detailHtml(selected, today, deltas)}
  `);

  return {
    title: 'Calendario',
    html,
    mount(root) {
      root.querySelectorAll('[data-day]').forEach((b) => b.addEventListener('click', () => go(`calendario/${b.dataset.day}`, { replace: true })));
      root.querySelectorAll('[data-month]').forEach((b) => b.addEventListener('click', () => {
        const target = monthIndex(y, m) + Number(b.dataset.month);
        const ty = Math.floor(target / 12);
        const tm = (target % 12) + 1;
        const day = ty === today.y && tm === today.m ? today : { y: ty, m: tm, d: 1 };
        go(`calendario/${dayKey(day)}`, { replace: true });
      }));
      root.querySelector('[data-today]')?.addEventListener('click', () => go('calendario', { replace: true }));
    },
  };
}

