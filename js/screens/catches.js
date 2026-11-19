// Mis capturas (rediseño 2026-11): registro personal, todo opcional, solo en este teléfono.
// Los datos van en localStorage (store.js, versión 1); las fotos, achicadas, en IndexedDB.
// Si IndexedDB no anda, la captura se guarda igual, sin foto, y se avisa.
import { ICON } from '../icons.js';
import { screen, esc, chip, MONTHS } from '../ui.js';
import { SPECIES } from '../data/species.js';
import { fishArt } from '../drawings/fish.js';
import { glyph } from '../drawings/glyphs.js';
import { load, save } from '../store.js';
import { todayAR, dayKey } from '../logic/dates.js';
import { cachedDays, cachedPressureDeltas, getCachedForecast, NAVARRO } from '../weather-service.js';
import { catchConditions, summarize } from '../logic/conditions.js';
import { activeOuting, catchesOf, allOutings, outingStats, measuredWater } from '../logic/outings.js';
import { scoreWord } from '../logic/labels.js';
import { pickOnMap } from '../map-picker.js';
import { windDir, SKY_TEXT } from '../logic/weather.js';

const KEY = 'catches';
const VERSION = 1;

/* ---------- Data (pure, tested) ---------- */

export function getCatches() {
  return load(KEY, VERSION, []);
}
function setCatches(list) {
  return save(KEY, VERSION, list);
}
/* ---------- Outings (salidas, 19/11/2026) ---------- */

export function getOutings() {
  return load('outings', 1, []);
}
function setOutings(list) {
  return save('outings', 1, list);
}
function outingConditions(date, time, place) {
  return catchConditions({ date, time, place, day: cachedDays()?.[date] || null, delta: cachedPressureDeltas()[date] ?? null });
}
export function startOuting(place = null) {
  const n = nowAR();
  const list = getOutings().filter((o) => !o.active);
  const o = { id: `s${Date.now()}`, date: n.date, start: n.time, end: '', place, water: [], active: true, conditions: outingConditions(n.date, n.time, place) };
  list.push(o);
  setOutings(list);
  return o;
}
function updateOuting(id, fn) {
  const list = getOutings();
  const o = list.find((x) => x.id === id);
  if (!o) return null;
  fn(o);
  setOutings(list);
  return o;
}

export function countFor(species) {
  return getCatches().filter((c) => c.species === species).length;
}
export function countAll() {
  return getCatches().length;
}

/** Number from what the person typed ("1,5", "42"), or null. */
export function parseNumber(text) {
  const t = String(text ?? '').trim().replace(',', '.');
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Catches grouped by species, in the catalog order; those without species last. */
export function groupCatches(list, species = SPECIES) {
  const groups = species.map((s) => ({ id: s.id, name: s.name, items: list.filter((c) => c.species === s.id) })).filter((g) => g.items.length);
  const unknown = list.filter((c) => !c.species || !species.some((s) => s.id === c.species));
  if (unknown.length) groups.push({ id: '', name: 'Sin identificar', items: unknown });
  for (const g of groups) g.items.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  return groups;
}

/* ---------- Photos (IndexedDB) ---------- */

function db() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in self)) return reject(new Error('sin IndexedDB'));
    const req = indexedDB.open('kitpesca', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('photos');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function photoOp(mode, fn) {
  const d = await db();
  return new Promise((resolve, reject) => {
    const tx = d.transaction('photos', mode);
    const r = fn(tx.objectStore('photos'));
    tx.oncomplete = () => resolve(r?.result);
    tx.onerror = () => reject(tx.error);
  });
}
const putPhoto = (id, blob) => photoOp('readwrite', (s) => s.put(blob, id));
const getPhoto = (id) => photoOp('readonly', (s) => s.get(id));
const deletePhoto = (id) => photoOp('readwrite', (s) => s.delete(id));

/** Shrinks a photo to 1280 px on its long side, as JPEG. */
async function shrink(file) {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, 1280 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k);
  c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((resolve) => c.toBlob(resolve, 'image/jpeg', 0.8));
}

const urls = [];
async function showPhoto(img, id) {
  try {
    const blob = await getPhoto(id);
    if (!blob) return;
    const u = URL.createObjectURL(blob);
    urls.push(u);
    img.src = u;
    img.hidden = false;
  } catch { /* no photo */ }
}
function freeUrls() {
  while (urls.length) URL.revokeObjectURL(urls.pop());
}

/* ---------- Screens ---------- */

export function tabs(active) {
  const n = countAll();
  return `<div class="seg" role="tablist">
    <a role="tab" href="#/peces" data-replace aria-selected="${active === 'especies'}" class="${active === 'especies' ? 'on' : ''}">Especies</a>
    <a role="tab" href="#/peces/capturas" data-replace aria-selected="${active === 'capturas'}" class="${active === 'capturas' ? 'on' : ''}">Mis capturas${n ? ` · ${n}` : ''}</a>
  </div>`;
}

const fmtDate = (c) => {
  const [y, m, d] = (c.date || '').split('-').map(Number);
  return d ? `${d} de ${MONTHS[m - 1]}${y !== todayAR().y ? ` de ${y}` : ''}` : '';
};
const measures = (c) => [c.lengthCm ? `${String(c.lengthCm).replace('.', ',')} cm` : '', c.weightKg ? `${String(c.weightKg).replace('.', ',')} kg` : ''].filter(Boolean).join(' · ');

function outingCard() {
  const o = activeOuting(getOutings());
  if (!o) {
    return `<div class="outing-card idle">
      <button type="button" class="btn yellow block big-cta" data-start>${glyph('rod', 26)}<span>Empezar salida</span></button>
      <p class="small muted">Anotá la salida aunque no saques nada: así los datos de los mejores días comparan de verdad.</p>
      <div class="two"><a class="btn white block" href="#/peces/capturas/salida-pasada">Anotar una salida pasada</a><a class="btn white block" href="#/peces/capturas/nueva">Captura suelta</a></div>
    </div>`;
  }
  const n = catchesOf(o, getCatches()).length;
  const w = measuredWater(o);
  return `<section class="outing-card live" aria-label="Salida en curso">
    <p class="outing-head"><span class="dot" aria-hidden="true"></span><strong>Salida en curso</strong> desde las ${esc(o.start)} · ${n === 0 ? 'todavía sin pesca' : n === 1 ? '1 captura' : `${n} capturas`}${w != null ? ` · agua ${String(w).replace('.', ',')} °C` : ''}</p>
    <a class="btn yellow block big-cta" href="#/peces/capturas/nueva">${glyph('fish', 28)}<span>Saqué un pez</span></a>
    <form class="water-row" data-water><label class="field"><span>Agua en la superficie (°C)</span><input class="input" name="c" inputmode="decimal" placeholder="Ej. 19,5" autocomplete="off"></label><button class="btn white" type="submit">Anotar</button></form>
    <button type="button" class="btn block" data-end>Terminar salida</button>
  </section>`;
}

function outingRow(o) {
  const w = measuredWater(o);
  const hours = o.start ? `${o.start}${o.end ? `–${o.end}` : ''}` : '';
  return `<a class="catch-row" href="#/peces/capturas/salida/${o.id}">
    <span class="thumb">${glyph(o.n ? 'fish' : 'rod', 30)}</span>
    <span class="catch-txt"><strong>${esc(fmtDate(o))}${hours ? ` · ${esc(hours)}` : ''}</strong><small>${o.n ? `${o.n} ${o.n === 1 ? 'captura' : 'capturas'}` : 'Sin pesca'}${w != null ? ` · agua ${String(w).replace('.', ',')} °C` : ''}${o.conditions?.moon ? ` · ${esc(o.conditions.moon.toLowerCase())}` : ''}</small></span>
    <span class="go">${ICON.chevron}</span></a>`;
}

function list(view = 'salidas') {
  const catches = getCatches();
  const outs = allOutings(getOutings(), catches).filter((o) => !o.implicit);
  const groups = groupCatches(catches);
  const seg = `<div class="seg"><a href="#/peces/capturas" data-replace class="${view === 'salidas' ? 'on' : ''}">Por salida</a><a href="#/peces/capturas/especies" data-replace class="${view === 'especies' ? 'on' : ''}">Por especie</a></div>`;
  const loose = catches.filter((c) => !c.outingId);
  const bySalida = outs.length || loose.length
    ? `${outs.map(outingRow).join('')}${loose.length ? `<h2 class="group-title">Capturas sueltas</h2>${loose.map(catchRow).join('')}` : ''}`
    : activeOuting(getOutings()) ? '' : `<div class="empty-state">${glyph('camera', 56)}<p><strong>Todavía no anotaste salidas ni capturas.</strong></p><p class="small muted">Todo es opcional y queda solo en este teléfono.</p></div>`;
  const bySpecies = groups.length ? groups.map((g) => `<h2 class="group-title with-art">${g.id ? fishArt(g.id, 72) : glyph('fish', 36)}<span>${esc(g.name)} · ${g.items.length}</span></h2>${g.items.map(catchRow).join('')}`).join('')
    : '<p class="empty">Todavía no hay capturas.</p>';
  const hasData = catches.some((c) => c.conditions) || getOutings().some((o) => !o.active);
  const body = `${tabs('capturas')}
    ${outingCard()}
    ${hasData ? `<a class="big slim" href="#/peces/capturas/datos">${glyph('calendar-season', 36)}<span class="label">Tus mejores días<small>En qué condiciones salís y pescás más</small></span><span class="go">${ICON.chevron}</span></a>` : ''}
    ${outs.length || catches.length ? seg : ''}
    ${view === 'especies' ? bySpecies : bySalida}
    ${catches.length || outs.length ? '<button type="button" class="btn white block" data-export>Guardar una copia (sin fotos)</button><p class="small muted">Las salidas y capturas quedan solo en este teléfono: si se borran los datos de Chrome, se pierden. La copia es un archivo que podés guardar donde quieras.</p>' : ''}`;
  return {
    title: 'Mis capturas',
    html: screen('Peces', body),
    mount(root, ctx) {
      root.querySelectorAll('[data-photo]').forEach((img) => showPhoto(img, img.dataset.photo));
      root.querySelector('[data-start]')?.addEventListener('click', () => { startOuting(); navigator.storage?.persist?.().catch(() => {}); refreshList(); });
      root.querySelector('[data-water]')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const c = parseTemp(e.target.c.value);
        if (c == null) { e.target.c.focus(); return; }
        const o = activeOuting(getOutings());
        updateOuting(o.id, (x) => { x.water = [...(x.water || []), { time: nowAR().time, c }]; });
        refreshList();
      });
      root.querySelector('[data-end]')?.addEventListener('click', () => {
        const o = activeOuting(getOutings());
        const n = catchesOf(o, getCatches()).length;
        if (!confirm(n ? '¿Terminar la salida?' : '¿Terminar la salida sin pesca? Queda anotada igual: sirve para comparar.')) return;
        updateOuting(o.id, (x) => { x.active = false; x.end = nowAR().time; });
        refreshList();
      });
      root.querySelector('[data-export]')?.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify({ app: 'Kit de Pesca', version: VERSION, outings: getOutings(), catches: getCatches() }, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `capturas-${dayKey(todayAR())}.json`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      });
    },
    unmount: freeUrls,
  };
}

let refreshList = () => {};

function catchRow(c) {
  return `<a class="catch-row" href="#/peces/capturas/${c.id}">
    <span class="thumb">${c.hasPhoto ? `<img alt="" hidden data-photo="${c.id}">` : ''}${c.species ? fishArt(c.species, 64) : glyph('fish', 30)}</span>
    <span class="catch-txt"><strong>${esc(SPECIES.find((x) => x.id === c.species)?.name || 'Sin identificar')}</strong><small>${esc(fmtDate(c) || 'Sin fecha')}${c.time ? ` · ${esc(c.time)}` : ''}${measures(c) ? ` · ${esc(measures(c))}` : ''}</small></span>
    <span class="go">${ICON.chevron}</span></a>`;
}

/** Water temperature typed by the person ("19,5"), between 0 and 40 °C, or null. */
export function parseTemp(text) {
  const t = String(text ?? '').trim().replace(',', '.');
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 && n <= 40 ? Math.round(n * 10) / 10 : null;
}

// The form keeps what was typed if the person goes back and comes again.
let draft = null;

const nowAR = () => {
  const n = new Date(Date.now() - 3 * 3600000);
  return { date: dayKey(todayAR()), time: n.toISOString().slice(11, 16) };
};

/** Conditions of the moment of a catch (js/logic/conditions.js), with the saved forecast if it covers that day. */
function conditions(d) {
  if (!d.date) return null;
  const sp = SPECIES.find((x) => x.id === d.species);
  const fresh = catchConditions({
    date: d.date, time: d.time || '', species: d.species, facts: sp?.facts, place: d.place,
    day: cachedDays()?.[d.date] || null, delta: cachedPressureDeltas()[d.date] ?? null,
  });
  // When editing, keep the weather saved at the time if the forecast no longer covers that day.
  const old = d.conditions;
  if (old && d.date === d.origDate && d.time === d.origTime) {
    for (const k of ['temp', 'sky', 'wind', 'windWord', 'gust', 'windDir', 'rain', 'pressure', 'pressureDelta', 'pressureWord']) if (fresh[k] == null && old[k] != null) fresh[k] = old[k];
  }
  const w = parseTemp(d.waterC);
  if (w != null) fresh.waterMeasured = w;
  return fresh;
}

const MOMENT_TXT = { dawn: 'Amanecer', day: 'Día', dusk: 'Atardecer', night: 'Noche' };
const SEASON_TXT = { good: 'En temporada', some: 'Poca actividad', off: 'Fuera de temporada' };

/** Chips with the conditions of a catch. */
export function conditionChips(c) {
  if (!c) return '';
  const items = [
    c.moment ? [MOMENT_TXT[c.moment], c.moment] : null,
    c.moon ? [`${c.moon}${c.moonLight != null ? ` (${c.moonLight}% iluminada)` : ''}`, 'moon'] : null,
    c.season ? [SEASON_TXT[c.season], 'calendar-season'] : null,
    c.score != null ? [`Calendario ${c.score} · ${scoreWord(c.score)}`, 'star'] : null,
    c.waterMeasured != null ? [`Agua ${String(c.waterMeasured).replace('.', ',')} °C (medida en la superficie)`, 'water-temp'] : null,
    c.water != null ? [`Agua ≈ ${String(c.water).replace('.', ',')} °C (estimada)`, 'water-temp'] : null,
    c.temp != null ? [`${c.temp}° ${SKY_TEXT[c.sky] ? `· ${SKY_TEXT[c.sky].toLowerCase()}` : ''}`, 'day'] : null,
    typeof c.wind === 'string' ? [`Viento ${c.wind}`, 'wind'] : c.wind != null ? [`Viento ${c.windDir != null ? windDir(c.windDir) + ' ' : ''}${c.wind} km/h${c.windWord ? ` (${c.windWord.toLowerCase()})` : ''}`, 'wind'] : null,
    c.rain != null ? [`Lluvia ${c.rain}%`, 'drop'] : null,
    c.pressure != null || c.pressureWord ? [`${c.pressure != null ? `${c.pressure} hPa` : 'Presión'}${c.pressureWord ? ` · ${c.pressureWord.toLowerCase()}` : ''}`, 'pressure'] : null,
  ].filter(Boolean);
  return `<div class="cond-chips">${items.map(([t, i]) => chip(t, '', { icon: glyph(i, 20) })).join('')}</div>`;
}

function form(params, ctx) {
  const editId = params[0] === 'editar' ? params[1] : null;
  const existing = editId ? getCatches().find((c) => c.id === editId) : null;
  const key = editId || 'new';
  if (!draft || draft.key !== key) {
    const n = nowAR();
    draft = existing
      ? { key, ...existing, when: existing.date ? 'otro' : 'sin', origDate: existing.date, origTime: existing.time, lengthCm: existing.lengthCm ?? '', weightKg: existing.weightKg ?? '' }
      : { key, species: params[0] && params[0] !== 'editar' ? params[0] : null, when: 'ahora', date: n.date, time: n.time, lengthCm: '', weightKg: '', note: '', place: null, photo: null, hasPhoto: false, waterC: '' };
    if (!existing) {
      const o = activeOuting(getOutings());
      if (o) { draft.outingId = o.id; draft.place = o.place || null; const w = measuredWater(o); if (w != null) draft.waterC = String(w).replace('.', ','); }
    }
  }
  const outing = draft.outingId ? getOutings().find((o) => o.id === draft.outingId) : null;
  if (draft.when === 'ahora') Object.assign(draft, nowAR());
  if (draft.when === 'sin') { draft.date = ''; draft.time = ''; }
  const preview = draft.date ? conditionChips(conditions(draft)) : '';
  const opts = [...SPECIES.map((s) => `<button type="button" class="sp-opt${draft.species === s.id ? ' on' : ''}" data-sp="${s.id}" aria-pressed="${draft.species === s.id}">${fishArt(s.id, 84)}<span>${esc(s.name)}</span></button>`),
    `<button type="button" class="sp-opt${!draft.species ? ' on' : ''}" data-sp="" aria-pressed="${!draft.species}">${glyph('fish', 36)}<span>No sé</span></button>`].join('');
  const body = `
    <form class="catch-form" data-form novalidate>
      ${outing ? `<p class="outing-note"><span class="dot" aria-hidden="true"></span>Se suma a la salida en curso (desde las ${esc(outing.start)}).</p>` : ''}
      <h2 class="block-title">Especie</h2>
      <div class="sp-grid">${opts}</div>
      ${existing ? '' : '<button type="submit" class="btn yellow block big-cta">Guardar</button>'}
      <details class="fold more"${existing ? ' open' : ''}><summary>${existing ? 'Datos' : 'Agregar más datos (foto, medidas, cuándo, agua, lugar)'}</summary>
      <div class="photo-pick">
        <img alt="Foto de la captura" data-preview hidden>
        <span class="photo-empty">${glyph('camera', 44)}<span>Foto (opcional)</span></span>
      </div>
      <div class="two">
        <label class="btn white block">${glyph('camera', 22)}<span>Sacar foto</span><input type="file" accept="image/*" capture="environment" data-file hidden></label>
        <label class="btn white block"><span>Elegir de la galería</span><input type="file" accept="image/*" data-file hidden></label>
      </div>
      ${draft.hasPhoto || draft.photo ? '<button type="button" class="btn white" data-nophoto>Quitar la foto</button>' : ''}
      <div class="two">
        <label class="field">${glyph('ruler', 24)}<span>Largo (cm)</span><input class="input" name="lengthCm" inputmode="decimal" value="${esc(draft.lengthCm)}" autocomplete="off"></label>
        <label class="field">${glyph('scale', 24)}<span>Peso (kg)</span><input class="input" name="weightKg" inputmode="decimal" value="${esc(draft.weightKg)}" autocomplete="off"></label>
      </div>
      <h2 class="block-title">Cuándo</h2>
      <div class="seg three" role="radiogroup" aria-label="Cuándo">
        ${[['ahora', 'Ahora'], ['otro', 'Otro día'], ['sin', 'Sin fecha']].map(([v, t]) => `<button type="button" role="radio" aria-checked="${draft.when === v}" class="seg-opt${draft.when === v ? ' on' : ''}" data-when="${v}">${t}</button>`).join('')}
      </div>
      ${draft.when === 'ahora' ? `<p class="small">Hoy, ${esc(draft.time)} h.</p>` : ''}
      ${draft.when === 'otro' ? `<div class="two">
        <label class="field"><span>Fecha</span><input class="input" type="date" name="date" value="${esc(draft.date)}" max="${esc(nowAR().date)}"></label>
        <label class="field"><span>Hora (opcional)</span><input class="input" type="time" name="time" value="${esc(draft.time)}"></label>
      </div>` : ''}
      ${draft.when !== 'sin' ? `<div class="cond-preview"><p class="mini-title">Se guardan las condiciones de ese momento</p><div data-preview-cond>${preview || '<p class="small muted">Elegí la fecha.</p>'}</div>
        <p class="small muted">Luna, agua y temporada se calculan siempre. Temperatura, viento y presión, solo si hay pronóstico guardado de ese día (los últimos 2 días y los próximos).</p></div>` : '<p class="small muted">Sin fecha no se guardan condiciones ni entra en tus datos de los mejores días.</p>'}
      <label class="field"><span>Agua en la superficie (°C, opcional)</span><input class="input" name="waterC" inputmode="decimal" value="${esc(draft.waterC ?? '')}" placeholder="Si llevás termómetro" autocomplete="off"></label>
      <div class="place-pick" data-place>${placeHtml()}</div>
      <label class="field"><span>Nota</span><textarea class="input" name="note" rows="2" maxlength="300">${esc(draft.note)}</textarea></label>
        ${existing ? '' : '<button type="submit" class="btn yellow block">Guardar</button>'}
      </details>
      ${existing ? '<button type="submit" class="btn yellow block">Guardar</button>' : ''}
      <p class="small muted">Todo es opcional. Se guarda solo en este teléfono; no se comparte. <span data-msg aria-live="polite"></span></p>
    </form>`;
  return {
    title: existing ? 'Editar captura' : 'Nueva captura',
    html: screen(existing ? 'Editar captura' : 'Nueva captura', body),
    mount(root) {
      const f = root.querySelector('[data-form]');
      const img = root.querySelector('[data-preview]');
      const sync = () => {
        for (const k of ['lengthCm', 'weightKg', 'date', 'time', 'note', 'waterC']) if (f[k]) draft[k] = f[k].value;
      };
      f.addEventListener('input', sync);
      f.addEventListener('change', (e) => {
        if (e.target.name !== 'date' && e.target.name !== 'time') return;
        sync();
        const box = root.querySelector('[data-preview-cond]');
        if (box) box.innerHTML = draft.date ? conditionChips(conditions(draft)) : '<p class="small muted">Elegí la fecha.</p>';
      });
      root.querySelectorAll('[data-when]').forEach((b) => b.addEventListener('click', () => {
        sync();
        draft.when = b.dataset.when;
        if (draft.when === 'otro' && !draft.date) Object.assign(draft, { date: nowAR().date, time: '' });
        ctx.refresh();
      }));
      if (draft.photo) { const u = URL.createObjectURL(draft.photo); urls.push(u); img.src = u; img.hidden = false; }
      else if (draft.hasPhoto && editId) showPhoto(img, editId);
      root.querySelectorAll('[data-file]').forEach((inp) => inp.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try { draft.photo = await shrink(file); } catch { draft.photo = file; }
        const u = URL.createObjectURL(draft.photo);
        urls.push(u);
        img.src = u;
        img.hidden = false;
      }));
      root.querySelector('[data-nophoto]')?.addEventListener('click', () => { draft.photo = null; draft.hasPhoto = false; draft.removePhoto = true; ctx.refresh(); });
      root.querySelectorAll('[data-sp]').forEach((b) => b.addEventListener('click', () => { sync(); draft.species = b.dataset.sp || null; ctx.refresh(); }));
      bindPlace(root, ctx);
      f.addEventListener('submit', async (e) => {
        e.preventDefault();
        sync();
        const id = editId || `c${Date.now()}`;
        const item = {
          id,
          species: draft.species || null,
          date: draft.when === 'sin' ? '' : (draft.date || ''),
          time: draft.when === 'sin' ? '' : (draft.time || ''),
          lengthCm: parseNumber(draft.lengthCm),
          weightKg: parseNumber(draft.weightKg),
          note: (draft.note || '').trim(),
          place: draft.place || null,
          outingId: draft.outingId && (draft.when === 'ahora' || existing) ? draft.outingId : null,
          waterC: parseTemp(draft.waterC),
          hasPhoto: !!(draft.photo || (draft.hasPhoto && !draft.removePhoto)),
          conditions: draft.when === 'sin' ? null : conditions(draft),
        };
        let msg = '';
        if (draft.photo) {
          try { await putPhoto(id, draft.photo); } catch { item.hasPhoto = false; msg = 'No se pudo guardar la foto en el teléfono; la captura se guardó sin foto.'; }
        } else if (draft.removePhoto) deletePhoto(id).catch(() => {});
        const all = getCatches().filter((c) => c.id !== id);
        all.push(item);
        if (!setCatches(all)) { root.querySelector('[data-msg]').textContent = 'No se pudo guardar: el teléfono no deja guardar datos.'; return; }
        navigator.storage?.persist?.().catch(() => {}); // ask Chrome not to clear them on its own
        draft = null;
        if (msg) alert(msg);
        ctx.go(`peces/capturas/${id}`, { replace: true });
      });
    },
    unmount: freeUrls,
  };
}

function placeHtml() {
  if (draft.place) {
    return `${glyph('pin', 28)}<span class="place-txt"><strong>Ubicación guardada</strong><small>${draft.place.lat.toFixed(4)}, ${draft.place.lon.toFixed(4)}</small></span><button type="button" class="btn white" data-noplace>Quitar</button>`;
  }
  return `<p class="mini-title">${glyph('pin', 22)} Ubicación (opcional)</p>
    <div class="two"><button type="button" class="btn white block" data-here>Donde estoy ahora</button>
    <button type="button" class="btn white block" data-onmap>Marcar en el mapa</button></div>
    <p class="small muted" data-place-msg aria-live="polite"></p>`;
}

/** Where the map opens: the phone's place if it is known, else the place of the forecast, else Navarro. */
function mapStart() {
  const gps = load('gps', 1, null);
  if (gps?.place) return gps.place;
  const f = getCachedForecast();
  return f?.place || NAVARRO;
}

function bindPlace(root, ctx) {
  const msg = root.querySelector('[data-place-msg]');
  root.querySelector('[data-here]')?.addEventListener('click', () => {
    if (!('geolocation' in navigator)) { msg.textContent = 'El teléfono no da la ubicación: marcala en el mapa.'; return; }
    msg.textContent = 'Buscando la ubicación…';
    navigator.geolocation.getCurrentPosition(
      (pos) => { draft.place = { lat: pos.coords.latitude, lon: pos.coords.longitude }; ctx.refresh(); },
      () => { msg.textContent = 'Sin permiso de ubicación: podés marcarla en el mapa.'; },
      { timeout: 15000, maximumAge: 300000, enableHighAccuracy: true },
    );
  });
  root.querySelector('[data-onmap]')?.addEventListener('click', async () => {
    const p = await pickOnMap(draft.place || mapStart());
    if (p) { draft.place = { lat: p.lat, lon: p.lon }; ctx.refresh(); }
  });
  root.querySelector('[data-noplace]')?.addEventListener('click', () => { draft.place = null; ctx.refresh(); });
}

function detail(c, ctx) {
  const s = SPECIES.find((x) => x.id === c.species);
  const cond = c.conditions || {};
  void cond;
  const body = `
    ${c.hasPhoto ? `<img class="catch-photo" alt="Foto de la captura" hidden data-photo="${c.id}">` : ''}
    <div class="catch-head">${s ? fishArt(s.id, 150) : glyph('fish', 48)}<div><h2 class="h2">${esc(s ? s.name : 'Sin identificar')}</h2><p>${esc(fmtDate(c))}${c.time ? ` · ${esc(c.time)}` : ''}</p></div></div>
    <div class="chips">${c.lengthCm ? chip(`${String(c.lengthCm).replace('.', ',')} cm`, '', { icon: glyph('ruler', 20) }) : ''}${c.weightKg ? chip(`${String(c.weightKg).replace('.', ',')} kg`, '', { icon: glyph('scale', 20) }) : ''}</div>
    ${c.conditions ? `<h2 class="block-title">Condiciones</h2>${conditionChips(c.conditions)}` : '<p class="small muted">Sin fecha: no hay condiciones guardadas.</p>'}
    ${c.note ? `<p>${esc(c.note)}</p>` : ''}
    ${c.place ? `<a class="btn white block" href="geo:${c.place.lat},${c.place.lon}?q=${c.place.lat},${c.place.lon}">${glyph('pin', 24)} Abrir en el mapa</a>` : ''}
    ${s ? `<a class="btn white block" href="#/peces/${s.id}">Ficha de la ${esc(s.name.toLowerCase())}</a>` : ''}
    <div class="two"><a class="btn block" href="#/peces/capturas/editar/${c.id}">Editar</a><button type="button" class="btn white block" data-del>Borrar</button></div>
    <p class="small muted">Se guarda solo en este teléfono.</p>`;
  return {
    title: 'Captura',
    html: screen('Captura', body, s ? s.name : 'Sin identificar'),
    mount(root) {
      root.querySelectorAll('[data-photo]').forEach((img) => showPhoto(img, c.id));
      root.querySelector('[data-del]').addEventListener('click', () => {
        if (!confirm('¿Borrar esta captura?')) return;
        setCatches(getCatches().filter((x) => x.id !== c.id));
        if (c.hasPhoto) deletePhoto(c.id).catch(() => {});
        ctx.go('peces/capturas', { replace: true });
      });
    },
    unmount: freeUrls,
  };
}

function pastOuting(ctx) {
  const n = nowAR();
  const body = `<form class="catch-form" data-past>
      <label class="field"><span>Fecha</span><input class="input" type="date" name="date" value="${esc(n.date)}" max="${esc(n.date)}" required></label>
      <div class="two"><label class="field"><span>Desde (opcional)</span><input class="input" type="time" name="start"></label><label class="field"><span>Hasta (opcional)</span><input class="input" type="time" name="end"></label></div>
      <label class="field"><span>Agua en la superficie (°C, opcional)</span><input class="input" name="c" inputmode="decimal" autocomplete="off"></label>
      <p class="mini-title">¿Sacaste algo?</p>
      <div class="two"><button type="submit" class="btn white block" value="no">No, sin pesca</button><button type="submit" class="btn yellow block" value="si">Sí, anotar capturas</button></div>
      <p class="small muted">Se guardan la luna, el agua estimada y, si hay pronóstico guardado de ese día, el tiempo.</p>
    </form>`;
  return {
    title: 'Salida pasada',
    html: screen('Salida pasada', body, 'Mis capturas'),
    mount(root) {
      const f = root.querySelector('[data-past]');
      f.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!f.date.value) return;
        const c = parseTemp(f.c.value);
        const o = { id: `s${Date.now()}`, date: f.date.value, start: f.start.value || '', end: f.end.value || '', place: null, water: c != null ? [{ time: f.start.value || '', c }] : [], active: false, conditions: outingConditions(f.date.value, f.start.value || '', null) };
        setOutings([...getOutings(), o]);
        if (e.submitter?.value === 'si') { draft = { key: 'new', species: null, when: 'otro', date: o.date, time: o.start, lengthCm: '', weightKg: '', note: '', place: null, photo: null, hasPhoto: false, waterC: c != null ? String(c) : '', outingId: o.id }; ctx.go('peces/capturas/nueva', { replace: true }); }
        else ctx.go(`peces/capturas/salida/${o.id}`, { replace: true });
      });
    },
  };
}

function outingDetail(o, ctx) {
  const cs = catchesOf(o, getCatches());
  const w = (o.water || []).map((x) => `${x.time ? `${x.time}: ` : ''}${String(x.c).replace('.', ',')} °C`).join(' · ');
  const body = `<h2 class="h2">${esc(fmtDate(o))}${o.start ? ` · ${esc(o.start)}${o.end ? `–${esc(o.end)}` : ''}` : ''}</h2>
    <p>${cs.length ? `${cs.length} ${cs.length === 1 ? 'captura' : 'capturas'}` : '<strong>Sin pesca.</strong> Queda anotada para comparar.'}</p>
    ${w ? `<p class="small">Agua medida en la superficie: ${esc(w)}</p>` : ''}
    ${o.conditions ? `<h2 class="block-title">Condiciones al salir</h2>${conditionChips(o.conditions)}` : ''}
    ${cs.length ? `<h2 class="block-title">Capturas</h2>${cs.map(catchRow).join('')}` : ''}
    <button type="button" class="btn white block" data-add>Agregar una captura a esta salida</button>
    <button type="button" class="btn white block" data-del>Borrar la salida</button>`;
  return {
    title: 'Salida',
    html: screen('Salida', body, 'Mis capturas'),
    mount(root) {
      root.querySelectorAll('[data-photo]').forEach((img) => showPhoto(img, img.dataset.photo));
      root.querySelector('[data-add]').addEventListener('click', () => {
        const wm = measuredWater(o);
        draft = { key: 'new', species: null, when: o.active ? 'ahora' : 'otro', date: o.date, time: o.start, lengthCm: '', weightKg: '', note: '', place: o.place || null, photo: null, hasPhoto: false, waterC: wm != null ? String(wm) : '', outingId: o.id };
        ctx.go('peces/capturas/nueva');
      });
      root.querySelector('[data-del]').addEventListener('click', () => {
        if (!confirm(cs.length ? '¿Borrar la salida? Las capturas quedan como sueltas.' : '¿Borrar la salida?')) return;
        setOutings(getOutings().filter((x) => x.id !== o.id));
        setCatches(getCatches().map((c) => (c.outingId === o.id ? { ...c, outingId: null } : c)));
        ctx.go('peces/capturas', { replace: true });
      });
    },
    unmount: freeUrls,
  };
}

function outingStatsHtml(species) {
  const catches = getCatches().filter((c) => !species || c.species === species);
  const outs = allOutings(getOutings(), getCatches()).map((o) => ({ ...o, n: species ? catchesOf(o, catches).length + (o.implicit ? catches.filter((c) => !c.outingId && c.date === o.date).length : 0) : o.n }));
  const real = outs.filter((o) => !o.implicit);
  if (!real.length) return '';
  const sections = outingStats(outs).map((sec) => `<h2 class="block-title">${esc(sec.title)}</h2><div class="bars">${sec.rows.map((r) => {
    const pct = Math.round((100 * r.withFish) / r.outings);
    return `<div class="bar-row three"><span class="bl">${esc(r.label)}</span><span class="bar"><span class="fill" style="width:${pct}%"></span></span><span class="bn small">${r.withFish}/${r.outings}</span></div>`;
  }).join('')}</div>`).join('');
  const withFish = outs.filter((o) => o.n > 0).length;
  return `<div class="card note"><p><strong>${outs.length} salidas, ${withFish} con pesca.</strong> Cada barra: de las salidas con esa condición, cuántas tuvieron pesca${species ? ' de esta especie' : ''}.</p></div>${sections}`;
}

function stats(species) {
  const all = getCatches().filter((c) => c.conditions);
  const list = species ? all.filter((c) => c.species === species) : all;
  const present = [...new Set(all.map((c) => c.species).filter(Boolean))];
  const filters = `<div class="chips">${chip('Todas', species ? '' : 'cat', { href: '#/peces/capturas/datos' })}${present.map((id) => chip(SPECIES.find((x) => x.id === id)?.name || id, species === id ? 'cat' : '', { href: `#/peces/capturas/datos/${id}` })).join('')}</div>`;
  const sections = summarize(list).map((sec) => {
    const max = Math.max(...sec.rows.map((r) => r.n));
    return `<h2 class="block-title">${esc(sec.title)}</h2><div class="bars">${sec.rows.map((r) => `<div class="bar-row"><span class="bl">${esc(r.label)}</span><span class="bar"><span class="fill" style="width:${Math.round((100 * r.n) / max)}%"></span></span><span class="bn">${r.n}</span></div>`).join('')}</div>`;
  }).join('');
  const body = `${filters}
    <p class="small">${list.length} ${list.length === 1 ? 'captura' : 'capturas'} con fecha. Cada barra cuenta en qué condiciones las sacaste.</p>
    ${list.length < 10 ? '<div class="card note"><p>Con pocas capturas los números dicen poco: sirven más a medida que registres más salidas.</p></div>' : ''}
    ${outingStatsHtml(species) ? `<h2 class="group-title">Salidas: cuándo hubo pesca</h2>${outingStatsHtml(species)}<h2 class="group-title">Capturas: en qué momento picó</h2>` : ''}
    ${sections || '<p class="empty">Todavía no hay capturas con fecha.</p>'}
    <p class="small muted">${getOutings().some((o) => !o.active) ? 'Las barras de salidas sí comparan: cuentan también las salidas sin pesca. Las de capturas solo dicen cuándo picó.' : 'Cuenta solo tus capturas: anotá también las salidas sin pesca (Empezar salida) para comparar de verdad.'}</p>`;
  return { title: 'Tus mejores días', html: screen('Tus mejores días', body, species ? SPECIES.find((x) => x.id === species)?.name : 'Mis capturas') };
}

export function render(params, ctx) {
  refreshList = ctx.refresh;
  if (params[0] === 'datos') return stats(params[1] || '');
  if (params[0] === 'especies') return list('especies');
  if (params[0] === 'salida-pasada') return pastOuting(ctx);
  if (params[0] === 'salida') {
    const o = getOutings().find((x) => x.id === params[1]);
    return o ? outingDetail(o, ctx) : list();
  }
  if (params[0] === 'nueva') return form(params.slice(1), ctx);
  if (params[0] === 'editar') return form(params, ctx);
  const c = params[0] && getCatches().find((x) => x.id === params[0]);
  if (c) return detail(c, ctx);
  return list();
}

