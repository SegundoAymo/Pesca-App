// Checklist agrupada (rediseño 2026-11). Mismos controles de antes (tildar con un toque,
// editar en un modo aparte, deshacer, Nueva salida) más grupos con contador, y grupos
// sumados desde un armado ("Para «Boya plop»"). Guardado en el teléfono, versión 2.
import { screen, esc } from '../ui.js';
import { ICON } from '../icons.js';
import { glyph } from '../drawings/glyphs.js';
import { load, save } from '../store.js';

export const GROUPS = [
  { id: 'cana', title: 'Caña y línea', icon: 'rod' },
  { id: 'terminales', title: 'Terminales', icon: 'tackle' },
  { id: 'carnada', title: 'Carnada y señuelos', icon: 'bait-box' },
  { id: 'herramientas', title: 'Herramientas', icon: 'tools' },
  { id: 'otros', title: 'Otros', icon: 'other' },
];

// Kit items plus the shopping list of the line rigs, each in its group.
export const INITIAL_ITEMS = [
  ['cana', 'Caña y reel'],
  ['cana', 'Línea principal cargada'],
  ['terminales', 'Líderes: alambre de acero (tararira) y fluorocarbono (bagre y carpa)'],
  ['terminales', 'Anzuelos: bagre, carpa y offset lastrado'],
  ['terminales', 'Plomadas'],
  ['terminales', 'Emerillones y mosquetones'],
  ['carnada', 'Señuelos'],
  ['carnada', 'Carnada natural'],
  ['terminales', 'Boyas: corrediza o plop, y una chica tipo cometa'],
  ['terminales', 'Hilo para topes corredizos'],
  ['terminales', 'Municiones partidas y perlas'],
  ['herramientas', 'Alicate, tijera, caja o bolso, balanza y salabre'],
];

const KEY = 'checklist';
const VERSION = 2;

/** Version 1 (a flat list) → version 2: same items, order and ticks, each with a group. */
export function migrate(v, data) {
  if (v !== 1 || !Array.isArray(data?.items)) return null;
  save('checklist-v1-backup', 1, data); // in case an old copy of the app reads it again
  const groupOf = new Map(INITIAL_ITEMS.map(([g, t]) => [t, g]));
  return { items: data.items.map((it) => ({ ...it, group: groupOf.get(it.text) || 'otros' })) };
}

export function getItems() {
  const saved = load(KEY, VERSION, null, migrate);
  if (saved) return saved.items;
  return INITIAL_ITEMS.map(([group, text], i) => ({ id: `i${i}`, text, done: false, group }));
}

function setItems(items) {
  save(KEY, VERSION, { items });
}

/** Adds items in a group of their own (from a rig). Returns how many were new. */
export function addItems(groupTitle, texts) {
  const items = getItems();
  const have = new Set(items.map((i) => i.text.toLowerCase()));
  const add = texts.filter((t) => !have.has(t.toLowerCase()));
  add.forEach((text, k) => items.push({ id: `i${Date.now()}${k}`, text, done: false, group: groupTitle }));
  if (add.length) setItems(items);
  return add.length;
}

export function progress() {
  const items = getItems();
  return { done: items.filter((i) => i.done).length, total: items.length };
}

let lastDeleted = null;
let editing = false;
const open = new Set(); // groups opened by hand even if complete

export function render(params, { refresh }) {
  const items = getItems();
  const done = items.filter((i) => i.done).length;
  const extra = [...new Set(items.map((i) => i.group).filter((g) => !GROUPS.some((x) => x.id === g)))];
  const groups = [...GROUPS.filter((g) => g.id !== 'otros'), ...extra.map((t) => ({ id: t, title: t, icon: 'tackle', added: true })), GROUPS.find((g) => g.id === 'otros')];
  const row = (it) => {
    const idx = items.indexOf(it);
    return `<li class="item${it.done ? ' done' : ''}">
      <button type="button" class="tick" data-toggle="${idx}" role="checkbox" aria-checked="${it.done}" aria-label="${esc(it.text)}">
        <span class="box">${it.done ? ICON.check : ''}</span>
      </button>
      <span class="text" data-toggle="${idx}">${esc(it.text)}</span>
      ${editing ? `<button type="button" class="tool" data-move="${idx}:-1" aria-label="Subir"${idx === 0 ? ' disabled' : ''}>${ICON.up}</button>
      <button type="button" class="tool" data-move="${idx}:1" aria-label="Bajar"${idx === items.length - 1 ? ' disabled' : ''}>${ICON.down}</button>
      <button type="button" class="tool" data-del="${idx}" aria-label="Borrar ${esc(it.text)}">${ICON.trash}</button>` : ''}
    </li>`;
  };
  const groupHtml = groups.map((g) => {
    const list = items.filter((i) => i.group === g.id);
    if (!list.length) return '';
    const d = list.filter((i) => i.done).length;
    const complete = d === list.length;
    const isOpen = editing || !complete || open.has(g.id);
    return `<section class="cgroup${complete ? ' complete' : ''}">
      <button type="button" class="cgroup-head" data-group="${esc(g.id)}" aria-expanded="${isOpen}">
        ${glyph(g.icon, 32)}<span class="t">${esc(g.added ? g.title : g.title)}</span>
        <span class="n">${complete ? `${ICON.check}` : ''}${d}/${list.length}</span>
      </button>
      ${isOpen ? `<ul class="checklist">${list.map(row).join('')}</ul>` : ''}
      ${g.added && editing ? `<button type="button" class="btn white" data-drop-group="${esc(g.id)}">Quitar este grupo</button>` : ''}
    </section>`;
  }).join('');

  const pct = items.length ? Math.round((100 * done) / items.length) : 0;
  const body = `
    <div class="progress-row" aria-live="polite"><span class="progress">${done === items.length && items.length ? 'Todo listo' : `${done} de ${items.length} listos`}</span>
      <span class="pbar"><span style="width:${pct}%"></span></span></div>
    ${lastDeleted ? `<div class="card note undo"><span>Borraste «${esc(lastDeleted.item.text)}».</span><button type="button" class="btn white" data-undo>Deshacer</button></div>` : ''}
    ${groupHtml}
    ${items.length ? '' : '<p class="empty">La lista está vacía. Agregá lo que querés llevar.</p>'}
    <form class="search-row" data-add>
      <input class="input" name="text" placeholder="Agregar algo" aria-label="Agregar algo a la lista" maxlength="120" autocomplete="off" required>
      <button class="btn yellow" type="submit" aria-label="Agregar">${ICON.plus}</button>
    </form>
    <button type="button" class="btn block" data-reset>Nueva salida</button>
    <button type="button" class="btn white block" data-edit>${editing ? 'Listo' : 'Editar lista'}</button>
    <p class="small muted">Nueva salida destilda todo. Los grupos completos se pliegan solos. La lista queda guardada en el teléfono.</p>`;

  return {
    title: 'Checklist',
    html: screen('Checklist', body),
    mount(root) {
      const update = (fn) => {
        const list = getItems();
        fn(list);
        setItems(list);
        refresh();
      };
      root.querySelectorAll('[data-toggle]').forEach((el) => el.addEventListener('click', () => {
        lastDeleted = null;
        update((l) => { const it = l[Number(el.dataset.toggle)]; it.done = !it.done; });
      }));
      root.querySelectorAll('[data-group]').forEach((el) => el.addEventListener('click', () => {
        const g = el.dataset.group;
        if (el.getAttribute('aria-expanded') === 'true') open.delete(g); else open.add(g);
        refresh();
      }));
      root.querySelectorAll('[data-move]').forEach((el) => el.addEventListener('click', () => {
        const [i, d] = el.dataset.move.split(':').map(Number);
        lastDeleted = null;
        update((l) => {
          // Move within the same group: swap with the nearest item of that group.
          let j = i + d;
          while (j >= 0 && j < l.length && l[j].group !== l[i].group) j += d;
          if (j < 0 || j >= l.length) return;
          [l[i], l[j]] = [l[j], l[i]];
        });
      }));
      root.querySelectorAll('[data-del]').forEach((el) => el.addEventListener('click', () => {
        const i = Number(el.dataset.del);
        update((l) => { lastDeleted = { item: l[i], index: i }; l.splice(i, 1); });
      }));
      root.querySelectorAll('[data-drop-group]').forEach((el) => el.addEventListener('click', () => {
        lastDeleted = null;
        update((l) => { for (let k = l.length - 1; k >= 0; k--) if (l[k].group === el.dataset.dropGroup) l.splice(k, 1); });
      }));
      root.querySelector('[data-undo]')?.addEventListener('click', () => {
        const d = lastDeleted;
        lastDeleted = null;
        update((l) => l.splice(Math.min(d.index, l.length), 0, d.item));
      });
      root.querySelector('[data-add]').addEventListener('submit', (e) => {
        e.preventDefault();
        const text = e.target.text.value.trim();
        if (!text) return;
        lastDeleted = null;
        update((l) => l.push({ id: `i${Date.now()}`, text, done: false, group: 'otros' }));
        root.querySelector('[data-add] input')?.focus();
      });
      root.querySelector('[data-edit]').addEventListener('click', () => {
        editing = !editing;
        lastDeleted = null;
        refresh();
      });
      root.querySelector('[data-reset]').addEventListener('click', () => {
        if (!confirm('¿Destildar todo para una nueva salida?')) return;
        lastDeleted = null;
        open.clear();
        update((l) => l.forEach((it) => { it.done = false; }));
      });
    },
  };
}
