// Router and app start. Screens are addressed by hash: #/calendario/2026-10-04, #/peces/tararira/equipo …
import * as home from './screens/home.js';
import * as calendar from './screens/calendar.js';
import * as weather from './screens/weather.js';
import * as fish from './screens/fish.js';
import * as knots from './screens/knots.js';
import * as checklist from './screens/checklist.js';
import * as rigs from './screens/rigs.js';
import { setUpdate } from './update.js';

const SCREENS = { '': home, calendario: calendar, clima: weather, peces: fish, nudos: knots, checklist, armados: rigs };

const root = document.getElementById('app');
// History of this visit: entries[i] is the hash of history entry i (each entry carries
// { i } in history.state), so Volver always goes where the person came from, also after
// loops like Calendario → Bagre → Calendario, and the scroll comes back with it.
const entries = [];
const scrolls = [];
let index = 0;
let current = null;
let currentName = null;
let replacing = false;

function parse(hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map((p) => {
    try { return decodeURIComponent(p); } catch { return p; }
  });
  return { name: parts[0] || '', params: parts.slice(1) };
}

const same = (a, b) => {
  try { return decodeURI(a) === decodeURI(b); } catch { return a === b; }
};

export function go(path, { replace = false } = {}) {
  const hash = '#/' + path.replace(/^\/+/, '');
  if (same(hash, location.hash || '#/')) return;
  if (replace) {
    replacing = true;
    location.replace(hash);
  } else location.hash = hash;
}

function goBack() {
  if (index > 0) history.back();
  else {
    const { name, params } = parse(location.hash);
    const parent = name && params.length ? [name, ...params.slice(0, -1)].join('/') : '';
    go(parent, { replace: true });
  }
}

/** Re-renders the current screen (keeps the scroll). */
export function refresh() {
  render(false);
}

function render(scrollTop = true, restore = null) {
  const { name, params } = parse(location.hash);
  const mod = Object.hasOwn(SCREENS, name) ? SCREENS[name] : home;
  if (mod.keepScroll && name === currentName && restore == null) scrollTop = false;
  currentName = name;
  if (current?.unmount) current.unmount();
  const view = mod.render(params, { go, refresh, back: goBack, previous: () => entries[index - 1] || null }) || {};
  root.innerHTML = view.html || '';
  document.title = view.title ? `${view.title} · Kit de Pesca` : 'Kit de Pesca';
  root.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', goBack));
  // Links that change something inside the same screen (a tab) do not add history.
  root.querySelectorAll('a[data-replace]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    go(a.getAttribute('href').slice(2), { replace: true });
  }));
  current = view;
  if (view.mount) view.mount(root);
  if (restore != null) window.scrollTo(0, restore);
  else if (scrollTop && !view.keepTop) window.scrollTo(0, 0);
  const h1 = root.querySelector('h1');
  if (h1 && scrollTop && restore == null) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
}

window.addEventListener('hashchange', () => {
  const h = location.hash || '#/';
  const st = history.state;
  scrolls[index] = window.scrollY;
  let restore = null;
  if (st && typeof st.i === 'number' && !replacing) {
    // Back or forward to an entry of this visit.
    index = st.i;
    entries[index] = h;
    restore = scrolls[index] ?? null;
  } else if (replacing) {
    replacing = false;
    entries[index] = h;
    history.replaceState({ i: index }, '');
  } else {
    index += 1;
    entries.length = index;
    scrolls.length = index;
    entries.push(h);
    history.replaceState({ i: index }, '');
  }
  render(true, restore);
});

history.replaceState({ i: 0 }, '');
entries.push(location.hash || '#/');
render();

/* ---------- Service Worker and updates ---------- */

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').then((reg) => {
    const offer = (worker) => setUpdate(() => worker.postMessage('skipWaiting'));
    if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      w?.addEventListener('statechange', () => {
        if (w.state === 'installed' && navigator.serviceWorker.controller) offer(w);
      });
    });
    setInterval(() => reg.update().catch(() => {}), 3600000);
  }).catch(() => {});
  // Reload only when an update replaces a worker that was already in control
  // (not on the very first visit, when the first worker takes over).
  const hadController = !!navigator.serviceWorker.controller;
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading || !hadController) return;
    reloading = true;
    location.reload();
  });
}
