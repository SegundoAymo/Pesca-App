// Router and app start. Screens are addressed by hash: #/calendario/2026-10-04, #/peces/tararira/equipo …
import * as home from './screens/home.js';
import * as calendar from './screens/calendar.js';
import * as weather from './screens/weather.js';
import * as fish from './screens/fish.js';
import * as knots from './screens/knots.js';
import * as checklist from './screens/checklist.js';
import { setUpdate } from './update.js';

const SCREENS = { '': home, calendario: calendar, clima: weather, peces: fish, nudos: knots, checklist };

const root = document.getElementById('app');
const stack = [];
let current = null;
let currentName = null;
let replacing = false;

function parse(hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map((p) => {
    try { return decodeURIComponent(p); } catch { return p; }
  });
  return { name: parts[0] || '', params: parts.slice(1) };
}

export function go(path, { replace = false } = {}) {
  const hash = '#/' + path.replace(/^\/+/, '');
  if (hash === location.hash) return;
  if (replace) {
    replacing = true;
    location.replace(hash);
  }
  else location.hash = hash;
}

function goBack() {
  if (stack.length > 1) history.back();
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

function render(scrollTop = true) {
  const { name, params } = parse(location.hash);
  const mod = Object.hasOwn(SCREENS, name) ? SCREENS[name] : home;
  if (mod.keepScroll && name === currentName) scrollTop = false;
  currentName = name;
  if (current?.unmount) current.unmount();
  const view = mod.render(params, { go, refresh, back: goBack, previous: () => stack[stack.length - 2] || null }) || {};
  root.innerHTML = view.html || '';
  document.title = view.title ? `${view.title} · Kit de Pesca` : 'Kit de Pesca';
  root.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', goBack));
  current = view;
  if (view.mount) view.mount(root);
  if (scrollTop) window.scrollTo(0, 0);
  const h1 = root.querySelector('h1');
  if (h1 && scrollTop) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
}

window.addEventListener('hashchange', () => {
  const h = location.hash || '#/';
  if (replacing) {
    replacing = false;
    stack[stack.length - 1] = h;
  } else if (stack.length > 1 && stack[stack.length - 2] === h) stack.pop();
  else stack.push(h);
  render();
});

stack.push(location.hash || '#/');
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
