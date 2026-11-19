import { homeIcon } from '../icons.js';
import { esc, DOW_SHORT, MONTHS_SHORT } from '../ui.js';
import { todayAR, weekday, dayKey } from '../logic/dates.js';
import { cachedDays, getCachedForecast, getForecast } from '../weather-service.js';
import { rangeText, windDir } from '../logic/weather.js';
import { calFish } from '../icons.js';
import { scoreDay, FLOOR } from '../logic/score.js';
import { cachedPressureDeltas } from '../weather-service.js';
import { SPECIES } from '../data/species.js';
import { KNOTS } from '../data/knots.js';
import { seasonNow, vedaText } from './fish.js';
import { lastKnot } from './knots.js';
import { progress } from './checklist.js';
import { getOutings, getCatches } from './catches.js';
import { activeOuting, catchesOf, fishCount } from '../logic/outings.js';
import { getUpdate } from '../update.js';

function climaInfo() {
  const days = cachedDays();
  const today = todayAR();
  const day = days?.[dayKey(today)];
  if (!day) return { temp: null, line: 'Ver pronóstico' };
  const hour = new Date(Date.now() - 3 * 3600000).getUTCHours();
  const now = day.hours.find((h) => h.h === hour);
  const upcoming = day.storms.filter((s) => s.to >= hour);
  const wind = now?.wind != null ? `Viento ${windDir(now.dir)} ${Math.round(now.wind)}` : '';
  const rain = day.prob != null ? `lluvia ${day.prob}%` : '';
  return {
    temp: now?.temp != null ? Math.round(now.temp) : null,
    storm: upcoming.length ? `Tormenta ${rangeText(upcoming[0])}` : '',
    line: [wind, rain].filter(Boolean).join(' · ') || (day.min != null ? `${day.min}° / ${day.max}°` : 'Ver pronóstico'),
  };
}

function climaButton() {
  const c = climaInfo();
  return `<a href="#/clima" class="home-btn clima" data-clima>
    ${homeIcon('clima', 92)}
    <span class="stack">
      <span class="label">Clima</span>
      ${c.temp != null ? `<span class="temp">${c.temp}°</span>` : ''}
      ${c.storm ? `<span class="alert">${esc(c.storm)}</span>` : `<span class="sub">${esc(c.line)}</span>`}
    </span>
  </a>`;
}

const COLORS = { tararira: '#C2410C', carpa: '#0F766E', bagre: '#3730A3' };
const NAMES = { tararira: 'Tararira', carpa: 'Carpa', bagre: 'Bagre' };

function calendarLine(t) {
  const r = scoreDay(t, t, cachedPressureDeltas());
  const shown = [...r.shown].sort((a, b) => b.score - a.score);
  if (!shown.length) return `<span class="sub">Hoy ningún pez llega a ${FLOOR}</span>`;
  return `<span class="sub fishes">Hoy ${shown.map((x) => calFish(x.species, COLORS[x.species], 22)).join('')} ${NAMES[shown[0].species]} ${shown[0].score}</span>`;
}

function fishLine(t) {
  const o = activeOuting(getOutings());
  if (o) {
    const n = fishCount(catchesOf(o, getCatches()));
    return `<span class="sub warn-txt">Salida en curso · ${n === 0 ? 'sin pesca todavía' : n === 1 ? '1 pez' : `${n} peces`}</span>`;
  }
  const veda = vedaText('pejerrey', t);
  if (veda) return `<span class="sub warn-txt">Pejerrey ${veda.charAt(0).toLowerCase() + veda.slice(1)}</span>`;
  const now = SPECIES.filter((s) => /Navarro/.test(s.where) && seasonNow(s, t)?.level === 'good').map((s) => s.name.toLowerCase());
  return `<span class="sub">${now.length ? `En temporada: ${now.slice(0, 3).join(', ')}${now.length > 3 ? '…' : ''}` : '11 especies'}</span>`;
}

function knotLine() {
  const k = lastKnot();
  return `<span class="sub">${k && KNOTS[k] ? `Último: ${KNOTS[k].name}` : 'Línea · anzuelo · señuelo · empalme'}</span>`;
}

function checklistLine() {
  const p = progress();
  if (!p.done) return '<span class="sub">Sin empezar</span>';
  return `<span class="sub">${p.done === p.total ? 'Todo listo' : `${p.done} de ${p.total} listos`}</span>`;
}

export function render() {
  const t = todayAR();
  const btn = (href, icon, label, line) => `<a href="${href}" class="home-btn">${icon}<span class="stack"><span class="label">${label}</span>${line}</span></a>`;
  const html = `<div class="home">
    <header class="home-head">
      <h1 class="home-title">Kit de Pesca</h1>
      <span class="home-date">${DOW_SHORT[weekday(t)]} ${t.d} ${MONTHS_SHORT[t.m - 1]}</span>
    </header>
    <div data-update></div>
    ${climaButton()}
    ${btn('#/calendario', homeIcon('calendario', 84, t.d), 'Calendario', calendarLine(t))}
    ${btn(activeOuting(getOutings()) ? '#/peces/capturas' : '#/peces', homeIcon('peces', 84), 'Peces', fishLine(t))}
    ${btn('#/nudos', homeIcon('nudos', 84), 'Nudos', knotLine())}
    ${btn('#/checklist', homeIcon('checklist', 84), 'Checklist', checklistLine())}
    <a class="report-link home-report" href="#/reportar">Reportar un problema o pedir un cambio</a>
  </div>`;

  let alive = true;
  const showUpdate = (root) => {
    const slot = root.querySelector('[data-update]');
    const apply = getUpdate();
    if (!slot || !apply) return;
    slot.innerHTML = '<button type="button" class="update-bar">Hay una versión nueva: tocar para actualizar</button>';
    slot.firstChild.addEventListener('click', () => apply());
  };

  return {
    html,
    mount(root) {
      showUpdate(root);
      this.onUpdate = () => showUpdate(root);
      document.addEventListener('kit:update', this.onUpdate);
      // Refresh the forecast in the background when it is old (more than 3 h).
      const cached = getCachedForecast();
      if (!cached || Date.now() - cached.fetchedAt > 3 * 3600000) {
        getForecast().then((f) => {
          if (!alive || !f?.days) return;
          const btn = root.querySelector('[data-clima]');
          if (btn) btn.outerHTML = climaButton();
          const cal = root.querySelector('a[href="#/calendario"] .sub');
          if (cal) cal.outerHTML = calendarLine(todayAR());
        }).catch(() => {});
      }
    },
    unmount() {
      alive = false;
      document.removeEventListener('kit:update', this.onUpdate);
    },
  };
}
