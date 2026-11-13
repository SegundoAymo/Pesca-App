import { ICON, calFish, weatherIcon, moonIcon } from '../icons.js';
import { glyph } from '../drawings/glyphs.js';
import { screen, esc, mix, DOW, MONTHS } from '../ui.js';
import { todayAR, dayKey, parseDayKey, daysInMonth, weekday, sameDay, daysBetween } from '../logic/dates.js';
import { scoreDay, intensity, SCORED_SPECIES, FLOOR } from '../logic/score.js';
import { moonPhaseName, moonIllumination, moonAge, SYNODIC_MONTH } from '../logic/moon.js';
import { PRESSURE_DAYS } from '../logic/pressure.js';
import { cachedPressureDeltas, cachedDays } from '../weather-service.js';
import { windDir } from '../logic/weather.js';
import { scoreWord, pressureWord } from '../logic/labels.js';
import { moonFactor } from '../logic/moon.js';
import { vedaText } from './fish.js';
import { announce } from '../ui.js';

export const keepScroll = true;

export const SPECIES_INFO = {
  tararira: { name: 'Tararira', color: '#C2410C' },
  carpa: { name: 'Carpa', color: '#0F766E' },
  bagre: { name: 'Bagre', color: '#3730A3' },
};

const FORECAST_DAYS = 16;
let announceNext = '';

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

function weatherRow(day, today) {
  const ahead = daysBetween(today, day);
  const note = (t) => `<p class="dp-note">${t}</p>`;
  if (ahead < 0) return note('Día pasado: no hay pronóstico.');
  if (ahead >= FORECAST_DAYS) return note(`Sin pronóstico todavía: llega hasta ${FORECAST_DAYS} días.`);
  const wx = cachedDays()?.[dayKey(day)];
  if (!wx) return `<a class="dp-wx" href="#/clima">${ICON.search}<span>Sin pronóstico guardado. Abrir Clima para traerlo.</span>${ICON.chevron}</a>`;
  const bits = [`${wx.min ?? '–'}° / ${wx.max ?? '–'}°`];
  if (wx.wind != null) bits.push(`viento ${windDir(wx.dir)} ${wx.wind}`);
  if (wx.prob != null) bits.push(`lluvia ${wx.prob}%`);
  return `<a class="dp-wx${wx.storms.length ? ' storm' : ''}" href="#/clima/${dayKey(day)}" aria-label="${esc(`${wx.sky}, ${bits.join(', ')}. Ver por hora`)}">
    ${weatherIcon(wx.code, 32)}<span><strong>${esc(wx.storms.length ? 'Tormenta' : wx.sky)}</strong> ${bits.join(' · ')}</span>${ICON.chevron}
  </a>`;
}

function moonWord(f) {
  if (f >= 0.75) return 'ayuda';
  if (f >= 0.25) return 'ayuda poco';
  return 'no ayuda';
}

function whyHtml(r, day, today, deltas) {
  const temp = r.results[0].temp;
  const comfy = r.results.filter((x) => x.season >= 0.8).map((x) => SPECIES_INFO[x.species].name.toLowerCase());
  const cold = r.results.filter((x) => x.season < 0.5).map((x) => SPECIES_INFO[x.species].name.toLowerCase());
  const waxing = moonAge(day) < SYNODIC_MONTH / 2;
  const mf = moonFactor(day);
  const ahead = daysBetween(today, day);
  const pw = r.usedPressure ? pressureWord(deltas[dayKey(day)]) : null;
  const pressureTxt = pw
    ? `<strong>Presión: ${pw.word.toLowerCase()}</strong> (${fmtDelta(deltas[dayKey(day)])} en 24 h). ${pw.help}.`
    : ahead >= 0 && ahead < PRESSURE_DAYS ? '<strong>Sin dato de presión:</strong> el puntaje va con agua y luna.' : '<strong>Sin presión:</strong> solo se usa en los próximos 7 días. El puntaje va con agua y luna.';
  const list = (a) => a.join(', ').replace(/, ([^,]*)$/, ' y $1');
  return `<details class="why"><summary>¿Por qué?</summary>
    <ul class="why-list">
      <li>${glyph('water-temp', 30)}<span><strong>Agua ≈ ${temp.toFixed(0)} °C</strong> (estimada para la época, no medida). ${comfy.length ? `Buena para ${list(comfy)}.` : ''}${cold.length ? ` Fría para ${list(cold)}: casi no come.` : ''}</span></li>
      <li>${moonIcon(moonIllumination(day), waxing, 30)}<span><strong>Luna ${moonPhaseName(day).toLowerCase()}: ${moonWord(mf)}.</strong> La mejor es la nueva, después los cuartos; la llena es la peor.</span></li>
      <li>${glyph('pressure', 30)}<span>${pressureTxt}</span></li>
    </ul>
    <p class="small muted">Cada pez pesa distinto estas tres cosas. Un pez se dibuja en la grilla si llega a ${FLOOR}. <a href="#/peces/tips">Más consejos</a></p>
  </details>`;
}

const fmtDelta = (d) => `${d > 0 ? '+' : ''}${d.toFixed(1).replace('.', ',')} hPa`;

function detailHtml(day, today, deltas) {
  const r = scoreDay(day, today, deltas);
  const waxing = moonAge(day) < SYNODIC_MONTH / 2;
  const sorted = [...SCORED_SPECIES].sort((a, b) => r.results.find((q) => q.species === b).score - r.results.find((q) => q.species === a).score);
  const rows = sorted.map((sp) => {
    const x = r.results.find((q) => q.species === sp);
    const c = SPECIES_INFO[sp].color;
    const ok = x.score >= FLOOR;
    return `<a class="dp-row${ok ? '' : ' low'}" href="#/peces/${sp}" aria-label="${esc(`${SPECIES_INFO[sp].name}: ${x.score}, ${scoreWord(x.score)}. Ver la ficha`)}">
      ${calFish(sp, ok ? c : '#8A8A84', 34)}
      <span class="name">${SPECIES_INFO[sp].name}</span>
      <span class="bar"><span class="fill" style="width:${Math.max(2, x.score)}%;background:${ok ? c : '#8A8A84'}"></span><span class="floor"></span></span>
      <span class="val">${x.score}<small>${scoreWord(x.score)}</small></span>
      ${ICON.chevron}
    </a>`;
  }).join('');
  const isToday = sameDay(day, today);
  const veda = vedaText('pejerrey', day);
  return `<section class="daypanel" aria-label="Día elegido">
    <div class="dp-head">
      <h2>${DOW[weekday(day)]} ${day.d}${isToday ? ' · Hoy' : ` de ${MONTHS[day.m - 1]}`}</h2>
      <span class="moon">${r.usedPressure ? '' : '<span class="chip mute">Sin presión</span>'}${moonIcon(moonIllumination(day), waxing, 22)} ${moonPhaseName(day)}</span>
    </div>
    ${weatherRow(day, today)}
    ${rows}
    ${veda ? `<p class="dp-veda">${glyph('closed-season', 22)} Pejerrey: ${esc(veda.toLowerCase())}</p>` : ''}
    ${whyHtml(r, day, today, deltas)}
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
      ${SCORED_SPECIES.map((sp) => `<span>${calFish(sp, SPECIES_INFO[sp].color, 24)}${SPECIES_INFO[sp].name}</span>`).join('')}
      ${sameDay(selected, today) ? '' : '<button type="button" class="chip" data-today>Ir a hoy</button>'}
    </div>
    ${detailHtml(selected, today, deltas)}
  `);

  return {
    title: 'Calendario',
    html,
    mount(root) {
      root.querySelectorAll('[data-day]').forEach((b) => b.addEventListener('click', () => {
        announceNext = b.getAttribute('aria-label');
        go(`calendario/${b.dataset.day}`, { replace: true });
      }));
      if (announceNext) { announce(announceNext); announceNext = ''; }
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

