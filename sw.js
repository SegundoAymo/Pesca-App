// Service Worker: keeps the whole app on the phone so it works without a connection.
// Bump VERSION on every release so phones pick up the new files.
const VERSION = 'v8';
const CACHE = `kitpesca-${VERSION}`;
const DATA_CACHE = 'kitpesca-data';

const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'fonts/barlow-500.woff2',
  'fonts/barlow-700.woff2',
  'fonts/barlow-semi-condensed-600.woff2',
  'fonts/barlow-semi-condensed-800.woff2',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'js/app.js',
  'js/icons.js',
  'js/store.js',
  'js/ui.js',
  'js/update.js',
  'js/weather-service.js',
  'js/data/knots.js',
  'js/data/rigs.js',
  'js/data/species.js',
  'js/drawings/knots.js',
  'js/drawings/knot3d.js',
  'js/drawings/rigs.js',
  'js/logic/dates.js',
  'js/logic/interp.js',
  'js/logic/moon.js',
  'js/logic/pressure.js',
  'js/logic/score.js',
  'js/logic/season.js',
  'js/logic/weather.js',
  'js/screens/calendar.js',
  'js/screens/checklist.js',
  'js/screens/fish.js',
  'js/screens/home.js',
  'js/screens/knots.js',
  'js/screens/weather.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('kitpesca-') && k !== CACHE && k !== DATA_CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Open-Meteo: network first, last answer as a fallback.
  if (url.hostname.endsWith('open-meteo.com')) {
    event.respondWith((async () => {
      const cache = await caches.open(DATA_CACHE);
      try {
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      } catch (err) {
        const hit = await cache.match(req);
        if (hit) return hit;
        throw err;
      }
    })());
    return;
  }

  // The design gallery is a separate static page; do not serve the app shell there.
  if (url.origin !== self.location.origin || url.pathname.includes('/muestras/')) return;

  // App files: from the phone first.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (req.mode === 'navigate') {
      return (await cache.match('index.html')) || fetch(req);
    }
    const hit = await cache.match(req, { ignoreSearch: true });
    return hit || fetch(req);
  })());
});
