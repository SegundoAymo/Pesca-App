import { homeIcon } from '../icons.js';
import { esc, DOW_SHORT, MONTHS_SHORT } from '../ui.js';
import { todayAR, weekday, dayKey } from '../logic/dates.js';
import { cachedDays, getCachedForecast, getForecast } from '../weather-service.js';
import { rangeText } from '../logic/weather.js';
import { updateReady } from '../app.js';

function climaInfo() {
  const days = cachedDays();
  const today = todayAR();
  const day = days?.[dayKey(today)];
  if (!day) return { temp: null, line: 'Ver pronóstico' };
  const hour = new Date(Date.now() - 3 * 3600000).getUTCHours();
  const now = day.hours.find((h) => h.h === hour);
  const upcoming = day.storms.filter((s) => s.to >= hour);
  return {
    temp: now?.temp != null ? Math.round(now.temp) : null,
    storm: upcoming.length ? `Tormenta ${rangeText(upcoming[0])}` : '',
    line: `${day.min}° / ${day.max}°`,
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

export function render() {
  const t = todayAR();
  const html = `<div class="home">
    <header class="home-head">
      <h1 class="home-title">Kit de Pesca</h1>
      <span class="home-date">${DOW_SHORT[weekday(t)]} ${t.d} ${MONTHS_SHORT[t.m - 1]}</span>
    </header>
    <div data-update></div>
    ${climaButton()}
    <a href="#/calendario" class="home-btn">${homeIcon('calendario', 84, t.d)}<span class="label">Calendario</span></a>
    <a href="#/peces" class="home-btn">${homeIcon('peces', 84)}<span class="label">Peces</span></a>
    <a href="#/nudos" class="home-btn">${homeIcon('nudos', 84)}<span class="label">Nudos</span></a>
    <a href="#/checklist" class="home-btn">${homeIcon('checklist', 84)}<span class="label">Checklist</span></a>
  </div>`;

  let alive = true;
  const showUpdate = (root) => {
    const slot = root.querySelector('[data-update]');
    if (!slot || !updateReady) return;
    slot.innerHTML = '<button type="button" class="update-bar">Hay una versión nueva: tocar para actualizar</button>';
    slot.firstChild.addEventListener('click', () => updateReady());
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
        }).catch(() => {});
      }
    },
    unmount() {
      alive = false;
      document.removeEventListener('kit:update', this.onUpdate);
    },
  };
}
