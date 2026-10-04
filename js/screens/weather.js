import { ICON, weatherIcon, windArrow } from '../icons.js';
import { screen, esc, DOW, DOW_SHORT, MONTHS } from '../ui.js';
import { todayAR, dayKey, parseDayKey, weekday, daysBetween } from '../logic/dates.js';
import { windDir, rangeText, SKY_TEXT } from '../logic/weather.js';
import {
  getForecast, getCachedForecast, cachedDays, agoText, getPlaceChoice, setPlaceChoice,
  getRecentPlaces, searchPlaces, NAVARRO,
} from '../weather-service.js';

export const keepScroll = true;

let status = { loading: false, error: null, lastPlace: null };

function placeName(p) {
  if (!p) return 'Buscando lugar…';
  return p.name;
}

function placeSub(choice, p) {
  if (choice.mode === 'gps') {
    if (p?.source === 'default') return 'Sin permiso de ubicación: se usa Navarro';
    return 'Según el GPS del teléfono';
  }
  return p?.region || '';
}

const fmt1 = (x) => String(Math.round(x * 10) / 10).replace('.', ',');

function nowHour() {
  return new Date(Date.now() - 3 * 3600000).getUTCHours();
}

function hourRow(h, isToday, sunrise, sunset) {
  const rows = [];
  const cls = ['hour'];
  if (h.code === 'tormenta') cls.push('storm');
  else if (isToday && h.h === nowHour()) cls.push('now');
  const rain = h.prob != null ? `${h.prob}%${h.mm ? `<small>${fmt1(h.mm)} mm</small>` : ''}` : '';
  rows.push(`<div class="${cls.join(' ')}"${cls.includes('now') ? ' data-now' : ''}>
    <span class="h">${isToday && h.h === nowHour() ? 'Ahora' : `${h.h} h`}</span>
    ${weatherIcon(h.code, 32)}
    <span class="tt">${h.temp != null ? Math.round(h.temp) + '°' : '–'}</span>
    <span class="rain">${rain}</span>
    <span class="wind">${windArrow(h.dir, 20)}${h.wind != null ? Math.round(h.wind) : '–'}<small>${h.gust != null ? `ráf. ${Math.round(h.gust)}` : ''}</small></span>
  </div>`);
  const sunRow = (time, label, icon) => `<div class="hour sun"><span class="h">${esc(time)}</span>${icon}<span>${label}</span></div>`;
  if (sunrise && Number(sunrise.slice(0, 2)) === h.h) rows.push(sunRow(sunrise, 'Sale el sol', ICON.sunrise));
  if (sunset && Number(sunset.slice(0, 2)) === h.h) rows.push(sunRow(sunset, 'Se pone el sol', ICON.sunset));
  return rows.join('');
}

function dayView(day, key, isToday) {
  const date = parseDayKey(key);
  const storm = day.storms.length
    ? `<div class="card alert">${ICON.warning}<span>Tormenta eléctrica ${day.storms.map((s) => `de ${rangeText(s)}`).join(' y ')}. Salir del agua y guardar la caña.</span></div>`
    : '';
  const nowH = isToday ? day.hours.find((h) => h.h === nowHour()) : null;
  const bigTemp = nowH?.temp != null ? `${Math.round(nowH.temp)}°` : `${day.max}°`;
  return `${storm}
  <section class="card">
    <div class="summary-top">
      ${weatherIcon(day.code, 64)}
      <div>
        <div class="big-t">${bigTemp}</div>
        <div class="sky">${esc(day.sky)}</div>
        <div class="small muted">${isToday ? 'Ahora · ' : ''}${DOW[weekday(date)]} ${date.d} de ${MONTHS[date.m - 1]}</div>
      </div>
    </div>
    <div class="wblocks">
      <div class="wblock"><span class="k">Temperatura</span><span class="v">${day.min}° / ${day.max}°</span><span class="s">mínima / máxima</span></div>
      <div class="wblock"><span class="k">Lluvia</span><span class="v">${day.prob ?? '–'}%</span><span class="s">${day.mm != null ? `${fmt1(day.mm)} mm en el día` : ''}</span></div>
      <div class="wblock"><span class="k">Viento</span><span class="v">${windArrow(day.dir, 24)}${day.wind ?? '–'} km/h</span><span class="s">del ${windDir(day.dir, true)}${day.gust != null ? ` · ráfagas ${day.gust}` : ''}</span></div>
      <div class="wblock"><span class="k">Sol</span><span class="v">${day.sunrise ?? '–'}</span><span class="s">sale · se pone ${day.sunset ?? '–'}</span></div>
    </div>
  </section>
  <h2 class="h2">Hora por hora</h2>
  <p class="small muted">La flecha apunta hacia el lado de donde viene el viento. Viento y ráfagas en km/h.</p>
  <div class="hours">${day.hours.map((h) => hourRow(h, isToday, day.sunrise, day.sunset)).join('')}</div>`;
}

function strip(days, todayKey, selKey) {
  const keys = Object.keys(days).filter((k) => k >= todayKey).sort();
  return `<div class="strip" role="list">${keys.map((k) => {
    const d = days[k];
    const date = parseDayKey(k);
    const cls = ['daychip'];
    if (k === selKey) cls.push('sel');
    if (d.storms.length) cls.push('storm');
    const label = k === todayKey ? 'Hoy' : `${DOW_SHORT[weekday(date)]} ${date.d}`;
    return `<button type="button" role="listitem" class="${cls.join(' ')}" data-wday="${k}" aria-label="${esc(`${label}: ${d.sky}, ${d.min} a ${d.max} grados`)}"${k === selKey ? ' aria-current="date"' : ''}>
      <span class="d">${label}</span>${weatherIcon(d.code, 34)}<span class="mm">${d.max}° ${d.min}°</span>
    </button>`;
  }).join('')}</div>`;
}

/* ---------- Place picker ---------- */

function placePicker(go, refresh) {
  const recent = getRecentPlaces();
  const html = screen('Lugar', `
    <button type="button" class="big yellow" data-gps>${ICON.gps}<span class="label">Usar mi ubicación<small>El GPS del teléfono. Sin permiso, Navarro.</small></span></button>
    <form class="search-row" data-search>
      <input class="input" name="q" type="search" placeholder="Buscar un lugar" aria-label="Buscar un lugar" autocomplete="off" required minlength="2">
      <button class="btn" type="submit" aria-label="Buscar">${ICON.search}</button>
    </form>
    <div data-results></div>
    <h2 class="h2">Guardados</h2>
    <button type="button" class="big" data-place='${esc(JSON.stringify(NAVARRO))}'>${ICON.pin}<span class="label">Navarro<small>Buenos Aires</small></span></button>
    ${recent.filter((p) => !(p.lat === NAVARRO.lat && p.lon === NAVARRO.lon)).map((p) => `<button type="button" class="big" data-place='${esc(JSON.stringify(p))}'>${ICON.pin}<span class="label">${esc(p.name)}<small>${esc(p.region || '')}</small></span></button>`).join('')}
    <p class="small muted">Buscar un lugar necesita conexión. Se guardan los últimos 5 lugares buscados. El mismo lugar se usa para la presión del Calendario.</p>
  `);
  const choose = (choice) => {
    setPlaceChoice(choice);
    status = { loading: false, error: null, placeChanged: true };
    go('clima', { replace: true });
  };
  return {
    title: 'Lugar',
    html,
    mount(root) {
      root.querySelector('[data-gps]').addEventListener('click', () => choose({ mode: 'gps' }));
      const bindPlaces = (scope) => scope.querySelectorAll('[data-place]').forEach((b) =>
        b.addEventListener('click', () => choose({ mode: 'fixed', place: JSON.parse(b.dataset.place) })));
      bindPlaces(root);
      const form = root.querySelector('[data-search]');
      const out = root.querySelector('[data-results]');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const q = form.q.value.trim();
        if (q.length < 2) return;
        out.innerHTML = '<p class="empty">Buscando…</p>';
        try {
          const list = await searchPlaces(q);
          out.innerHTML = list.length
            ? `<div class="checklist">${list.map((p) => `<button type="button" class="big" data-place='${esc(JSON.stringify(p))}'>${ICON.pin}<span class="label">${esc(p.name)}<small>${esc(p.region)}</small></span></button>`).join('')}</div>`
            : '<p class="empty">No encontré ese lugar.</p>';
          bindPlaces(out);
        } catch {
          out.innerHTML = '<p class="empty">No se pudo buscar: hace falta conexión.</p>';
        }
      });
    },
  };
}

/* ---------- Screen ---------- */

export function render(params, { go, refresh }) {
  if (params[0] === 'lugar') return placePicker(go, refresh);

  const today = todayAR();
  const todayKey = dayKey(today);
  const cached = getCachedForecast();
  const days = cachedDays();
  const choice = getPlaceChoice();
  let selKey = params[0] && /^\d{4}-\d{2}-\d{2}$/.test(params[0]) ? params[0] : todayKey;
  const place = status.lastPlace || cached?.place || null;

  let body;
  const ahead = daysBetween(today, parseDayKey(selKey));
  if (ahead < 0) selKey = todayKey;
  const day = days?.[selKey];

  const placeRow = `<div class="place">
    ${ICON.pin}
    <span class="name">${esc(placeName(place))}<small>${esc(placeSub(choice, place))}</small></span>
    <a class="btn white" href="#/clima/lugar">Cambiar</a>
  </div>`;

  if (!days) {
    body = status.loading
      ? '<p class="empty">Cargando el pronóstico…</p>'
      : `<div class="card note"><p><strong>No hay pronóstico guardado.</strong> Hace falta conexión para traerlo la primera vez.</p></div>
         <button type="button" class="btn yellow block" data-reload>Reintentar</button>`;
  } else if (!day) {
    body = `${strip(days, todayKey, selKey)}<div class="card note"><p>Sin pronóstico todavía para ese día: llega hasta 16 días.</p></div>`;
  } else {
    body = `${strip(days, todayKey, selKey)}${dayView(day, selKey, selKey === todayKey)}`;
  }

  const footer = cached
    ? `<p class="small muted">${status.loading ? 'Actualizando…' : `Actualizado ${agoText(cached.fetchedAt)}.`}${status.error && !status.loading ? ' Sin conexión: se muestra el último pronóstico guardado.' : ''} Datos: Open-Meteo.</p>
       <button type="button" class="btn white block" data-reload>Actualizar</button>`
    : '';

  const html = screen('Clima', `${placeRow}${body}${footer}`);

  return {
    title: 'Clima',
    html,
    mount(root) {
      root.querySelectorAll('[data-wday]').forEach((b) => b.addEventListener('click', () => go(`clima/${b.dataset.wday}`, { replace: true })));
      const load = (force) => {
        status = { ...status, loading: true };
        if (!days) refresh();
        getForecast({ force }).then((f) => {
          status = { loading: false, error: f?.error || null, lastPlace: f?.place || null, tried: true };
          refresh();
        });
      };
      root.querySelectorAll('[data-reload]').forEach((b) => b.addEventListener('click', () => load(true)));
      const sel = root.querySelector('.daychip.sel');
      if (sel) sel.scrollIntoView({ block: 'nearest', inline: 'center' });
      const stale = !cached || Date.now() - cached.fetchedAt > 3 * 3600000;
      if (status.placeChanged && !status.loading) {
        status.placeChanged = false;
        status.lastPlace = null;
        load(true);
      } else if (stale && !status.loading && !status.tried) {
        status.tried = true;
        load(false);
      }
    },
    unmount() {},
  };
}
