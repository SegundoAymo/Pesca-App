import { ICON, weatherIcon, windArrow } from '../icons.js';
import { screen, esc, DOW, DOW_SHORT, MONTHS } from '../ui.js';
import { todayAR, dayKey, parseDayKey, weekday, daysBetween } from '../logic/dates.js';
import { windDir, rangeText, SKY_TEXT } from '../logic/weather.js';
import { windWord, windLevel, pressureWord, scoreWord } from '../logic/labels.js';
import { scoreDay, FLOOR } from '../logic/score.js';
import { calFish } from '../icons.js';
import { glyph } from '../drawings/glyphs.js';
import {
  getForecast, getCachedForecast, cachedDays, agoText, getPlaceChoice, setPlaceChoice,
  getRecentPlaces, searchPlaces, NAVARRO, cachedPressureDeltas,
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
    <span class="wind w${windLevel(h.wind)}">${windArrow(h.dir, 20)}${h.wind != null ? Math.round(h.wind) : '–'}<small>${h.dir != null ? windDir(h.dir) : ''}${h.gust != null ? ` · ráf. ${Math.round(h.gust)}` : ''}</small></span>
  </div>`);
  const sunRow = (time, label, icon) => `<div class="hour sun"><span class="h">${esc(time)}</span>${icon}<span>${label}</span></div>`;
  if (sunrise && Number(sunrise.slice(0, 2)) === h.h) rows.push(sunRow(sunrise, 'Sale el sol', ICON.sunrise));
  if (sunset && Number(sunset.slice(0, 2)) === h.h) rows.push(sunRow(sunset, 'Se pone el sol', ICON.sunset));
  return rows.join('');
}

const SPECIES_NAME = { tararira: 'Tararira', carpa: 'Carpa', bagre: 'Bagre' };
const SPECIES_COLOR = { tararira: '#C2410C', carpa: '#0F766E', bagre: '#3730A3' };

function fishingRow(date, key) {
  const today = todayAR();
  const r = scoreDay(date, today, cachedPressureDeltas());
  const shown = [...r.shown].sort((a, b) => b.score - a.score);
  const txt = shown.length
    ? shown.map((x) => `<span class="fi">${calFish(x.species, SPECIES_COLOR[x.species], 24)}${SPECIES_NAME[x.species]} ${x.score}</span>`).join('')
    : `<span>Ningún pez llega a ${FLOOR}</span>`;
  return `<a class="fishing-row" href="#/calendario/${key}"><span class="k">Pesca</span><span class="fish-list">${txt}</span>${ICON.chevron}</a>`;
}

function dayView(day, key, isToday) {
  const date = parseDayKey(key);
  const storm = day.storms.length
    ? `<div class="card alert">${ICON.warning}<span>Tormenta eléctrica ${day.storms.map((s) => `de ${rangeText(s)}`).join(' y ')}. Salir del agua y guardar la caña.</span></div>`
    : '';
  const hNow = nowHour();
  const nowH = isToday ? day.hours.find((h) => h.h === hNow) : null;
  const t = (v) => (v != null ? `${v}°` : '–');
  const bigTemp = nowH?.temp != null ? `${Math.round(nowH.temp)}°` : t(day.max);
  // Pressure: now (today) or at noon, and the noon-to-noon change the score uses.
  const pH = nowH || day.hours.find((h) => h.h === 12) || day.hours[0];
  const pVal = pH?.pressure != null ? Math.round(pH.pressure) : null;
  const delta = cachedPressureDeltas()[key];
  const pw = pressureWord(delta);
  const wind = nowH && nowH.wind != null ? { v: Math.round(nowH.wind), dir: nowH.dir, gust: nowH.gust != null ? Math.round(nowH.gust) : null } : { v: day.wind, dir: day.dir, gust: day.gust };
  const past = isToday ? day.hours.filter((h) => h.h < hNow) : [];
  const next = isToday ? day.hours.filter((h) => h.h >= hNow) : day.hours;
  return `${storm}
  <section class="card wx-card">
    <div class="summary-top">
      ${weatherIcon(nowH?.code || day.code, 64)}
      <div>
        <div class="big-t">${bigTemp}</div>
        <div class="sky">${esc(nowH ? SKY_TEXT[nowH.code] || day.sky : day.sky)}</div>
        <div class="small muted">${isToday ? 'Ahora · ' : ''}${DOW[weekday(date)]} ${date.d} · mín ${t(day.min)} · máx ${t(day.max)}</div>
      </div>
    </div>
    <div class="wblocks">
      <div class="wblock"><span class="k">${glyph('wind', 20)} Viento${nowH ? '' : ' máx.'}</span><span class="v w${windLevel(wind.v)}">${windArrow(wind.dir, 24)}${wind.v ?? '–'} <small>km/h</small></span><span class="s">${wind.dir != null ? `del ${windDir(wind.dir, true)}` : ''}${wind.gust != null ? ` · ráfagas ${wind.gust}` : ''}<br>${esc(windWord(wind.v))}</span></div>
      <div class="wblock"><span class="k">${glyph('drop', 20)} Lluvia</span><span class="v">${day.prob ?? '–'}%</span><span class="s">${day.mm != null ? `${fmt1(day.mm)} mm en el día` : ''}</span></div>
      <div class="wblock"><span class="k">${glyph('pressure', 20)} Presión</span><span class="v">${pVal ?? '–'} <small>hPa</small></span><span class="s">${pw ? `${esc(pw.word)} <small>(${delta > 0 ? '+' : ''}${fmt1(delta)} en 24 h)</small>` : 'Sin dato del cambio'}</span></div>
      <div class="wblock"><span class="k">${glyph('dawn', 20)} Sol</span><span class="v">${day.sunrise ?? '–'}</span><span class="s">sale · se pone ${day.sunset ?? '–'}</span></div>
    </div>
  </section>
  ${fishingRow(date, key)}
  <h2 class="h2">Hora por hora</h2>
  ${past.length ? `<details class="fold past"><summary>Horas anteriores (0 a ${past[past.length - 1].h} h)</summary><div class="hours">${past.map((h) => hourRow(h, false, day.sunrise, day.sunset)).join('')}</div></details>` : ''}
  <div class="hours">${next.map((h) => hourRow(h, isToday, day.sunrise, day.sunset)).join('')}</div>
  <p class="small muted">La flecha apunta hacia donde sopla el viento; las letras dicen de dónde viene. Viento y ráfagas en km/h.</p>`;
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
      <span class="d">${label}</span>${weatherIcon(d.code, 34)}<span class="mm">${d.max ?? '–'}° ${d.min ?? '–'}°</span>
    </button>`;
  }).join('')}</div>`;
}

/* ---------- Place picker ---------- */

function placePicker(go, back, previous) {
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
    // Return to the Clima screen the picker was opened from; otherwise open Clima in its place.
    if (/^#\/clima(\/\d|$)/.test(previous() || '')) back();
    else go('clima', { replace: true });
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

export function render(params, { go, refresh, back, previous }) {
  if (params[0] === 'lugar') return placePicker(go, back, previous);

  const today = todayAR();
  const todayKey = dayKey(today);
  const cached = getCachedForecast();
  const days = cachedDays();
  const choice = getPlaceChoice();
  let selKey = params[0] && /^\d{4}-\d{2}-\d{2}$/.test(params[0]) ? params[0] : todayKey;
  const place = cached?.place || status.lastPlace || null;

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
        refresh();
        getForecast({ force })
          .then((f) => { status = { loading: false, error: f?.error || null, lastPlace: f?.place || null, tried: true }; })
          .catch((error) => { status = { loading: false, error, lastPlace: null, tried: true }; })
          .finally(() => {
            // Only redraw if the person is still on Clima (not on the place picker or another screen).
            const h = location.hash.replace(/^#\/?/, '');
            if (h === 'clima' || /^clima\/\d/.test(h)) refresh();
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
  };
}
