// Location and Open-Meteo forecast, with the last forecast kept on the phone.
import { load, save } from './store.js';
import { buildDays } from './logic/weather.js';
import { noonPressureDeltas } from './logic/pressure.js';

export const NAVARRO = { name: 'Navarro', region: 'Buenos Aires', lat: -35.0056, lon: -59.277 };

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REFRESH_MS = 3 * 3600000; // refresh when older than 3 h
const PRESSURE_FRESH_MS = 24 * 3600000; // pressure older than this is not used for scoring
const GPS_MAX_AGE_MS = 30 * 60000;

/* ---------- Place ---------- */

// Saved choice: { mode: 'gps' } or { mode: 'fixed', place }
export function getPlaceChoice() {
  return load('place', 1, { mode: 'gps' });
}

export function setPlaceChoice(choice) {
  save('place', 1, choice);
  if (choice.mode === 'fixed') addRecent(choice.place);
}

export function getRecentPlaces() {
  return load('recentPlaces', 1, []);
}

function addRecent(place) {
  const list = getRecentPlaces().filter((p) => !(p.lat === place.lat && p.lon === place.lon));
  list.unshift(place);
  save('recentPlaces', 1, list.slice(0, 5));
}

function gpsPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) return reject(new Error('sin GPS'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      reject,
      { timeout: 10000, maximumAge: GPS_MAX_AGE_MS, enableHighAccuracy: false },
    );
  });
}

/** Resolves the place to use: GPS, or Navarro when there is no permission. */
export async function resolvePlace() {
  const choice = getPlaceChoice();
  if (choice.mode === 'fixed') return { ...choice.place, source: 'fixed' };
  const cached = load('gps', 1, null);
  if (cached && Date.now() - cached.at < GPS_MAX_AGE_MS) return { ...cached.place, source: 'gps' };
  try {
    const { lat, lon } = await gpsPosition();
    const place = { name: 'Mi ubicación', region: '', lat, lon };
    save('gps', 1, { at: Date.now(), place });
    return { ...place, source: 'gps' };
  } catch {
    if (cached) return { ...cached.place, source: 'gps' };
    return { ...NAVARRO, source: 'default' };
  }
}

export async function searchPlaces(query) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=8&language=es&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('búsqueda');
  const data = await res.json();
  return (data.results || []).map((r) => ({
    name: r.name,
    region: [r.admin1, r.country].filter(Boolean).join(', '),
    lat: r.latitude,
    lon: r.longitude,
  }));
}

/* ---------- Forecast ---------- */

const HOURLY = [
  'temperature_2m', 'precipitation_probability', 'precipitation', 'weather_code',
  'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m', 'pressure_msl', 'is_day',
].join(',');

function forecastUrl(place) {
  return `${FORECAST_URL}?latitude=${place.lat.toFixed(4)}&longitude=${place.lon.toFixed(4)}`
    + `&hourly=${HOURLY}&daily=sunrise,sunset&timezone=America%2FArgentina%2FBuenos_Aires`
    + `&past_days=1&forecast_days=16&wind_speed_unit=kmh`;
}

function samePlace(a, b) {
  return a && b && Math.abs(a.lat - b.lat) < 0.05 && Math.abs(a.lon - b.lon) < 0.05;
}

export function getCachedForecast() {
  return load('forecast', 1, null);
}

/**
 * Returns { place, fetchedAt, days, deltas, stale, error } or null when there is
 * no forecast at all. Uses the saved one if it is recent, for the same place.
 */
export async function getForecast({ force = false, place } = {}) {
  place = place || (await resolvePlace());
  const cached = getCachedForecast();
  const fresh = cached && samePlace(cached.place, place) && Date.now() - cached.fetchedAt < REFRESH_MS;
  if (fresh && !force) return expand(cached, false);
  try {
    const res = await fetch(forecastUrl(place));
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
    const data = await res.json();
    const entry = { place, fetchedAt: Date.now(), data };
    save('forecast', 1, entry);
    return expand(entry, false);
  } catch (error) {
    if (cached) return { ...expand(cached, true), error, otherPlace: !samePlace(cached.place, place) };
    return { place, error, days: null };
  }
}

function expand(entry, stale) {
  const { data } = entry;
  return {
    place: entry.place,
    fetchedAt: entry.fetchedAt,
    stale,
    days: buildDays(data),
    deltas: noonPressureDeltas(data.hourly.time, data.hourly.pressure_msl || []),
  };
}

/** Pressure deltas for the Calendar, only when the saved forecast is recent. */
export function cachedPressureDeltas() {
  const cached = getCachedForecast();
  if (!cached || Date.now() - cached.fetchedAt > PRESSURE_FRESH_MS) return {};
  return noonPressureDeltas(cached.data.hourly.time, cached.data.hourly.pressure_msl || []);
}

/** Day summaries from the saved forecast, without network. */
export function cachedDays() {
  const cached = getCachedForecast();
  return cached ? buildDays(cached.data) : null;
}

export function agoText(ms) {
  const min = Math.round((Date.now() - ms) / 60000);
  if (min < 2) return 'recién';
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? 'hace 1 día' : `hace ${d} días`;
}
