import { screen, esc } from '../ui.js';
import { ICON } from '../icons.js';
import { load, save } from '../store.js';

// Kit items plus the shopping list of the line rigs.
export const INITIAL_ITEMS = [
  'Caña y reel',
  'Línea principal cargada',
  'Líderes: alambre de acero (tararira) y fluorocarbono (bagre y carpa)',
  'Anzuelos: bagre, carpa y offset lastrado',
  'Plomadas',
  'Emerillones y mosquetones',
  'Señuelos',
  'Carnada natural',
  'Boyas: corrediza o plop, y una chica tipo cometa',
  'Hilo para topes corredizos',
  'Municiones partidas y perlas',
  'Alicate, tijera, caja o bolso, balanza y salabre',
];

const KEY = 'checklist';
const VERSION = 1;

let lastDeleted = null;
let editing = false;

function getItems() {
  const saved = load(KEY, VERSION, null);
  if (saved) return saved.items;
  return INITIAL_ITEMS.map((text, i) => ({ id: `i${i}`, text, done: false }));
}

function setItems(items) {
  save(KEY, VERSION, { items });
}

export function render(params, { refresh }) {
  const items = getItems();
  const done = items.filter((i) => i.done).length;
  const rows = items.map((it, idx) => `<li class="item${it.done ? ' done' : ''}">
      <button type="button" class="tick" data-toggle="${idx}" role="checkbox" aria-checked="${it.done}" aria-label="${esc(it.text)}">
        <span class="box">${it.done ? ICON.check : ''}</span>
      </button>
      <span class="text" data-toggle="${idx}">${esc(it.text)}</span>
      ${editing ? `<button type="button" class="tool" data-move="${idx}:-1" aria-label="Subir"${idx === 0 ? ' disabled' : ''}>${ICON.up}</button>
      <button type="button" class="tool" data-move="${idx}:1" aria-label="Bajar"${idx === items.length - 1 ? ' disabled' : ''}>${ICON.down}</button>
      <button type="button" class="tool" data-del="${idx}" aria-label="Borrar ${esc(it.text)}">${ICON.trash}</button>` : ''}
    </li>`).join('');

  const body = `
    <p class="progress" aria-live="polite">${done} de ${items.length} listos</p>
    ${lastDeleted ? `<div class="card note" style="flex-direction:row;align-items:center;justify-content:space-between"><span>Borraste «${esc(lastDeleted.item.text)}».</span><button type="button" class="btn white" data-undo>Deshacer</button></div>` : ''}
    <ul class="checklist" style="list-style:none;margin:0;padding:0">${rows}</ul>
    ${items.length ? '' : '<p class="empty">La lista está vacía. Agregá lo que querés llevar.</p>'}
    <button type="button" class="btn white block" data-edit>${editing ? 'Listo' : 'Ordenar o borrar'}</button>
    <form class="search-row" data-add>
      <input class="input" name="text" placeholder="Agregar algo" aria-label="Agregar algo a la lista" maxlength="120" autocomplete="off" required>
      <button class="btn yellow" type="submit" aria-label="Agregar">${ICON.plus}</button>
    </form>
    <button type="button" class="btn block" data-reset>Nueva salida</button>
    <p class="small muted">Nueva salida destilda todo. La lista queda guardada en el teléfono.</p>`;

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
      root.querySelectorAll('[data-move]').forEach((el) => el.addEventListener('click', () => {
        const [i, d] = el.dataset.move.split(':').map(Number);
        lastDeleted = null;
        update((l) => { const j = i + d; if (j < 0 || j >= l.length) return; [l[i], l[j]] = [l[j], l[i]]; });
        root.querySelector(`[data-move="${i + d}:${d}"]`)?.focus();
      }));
      root.querySelectorAll('[data-del]').forEach((el) => el.addEventListener('click', () => {
        const i = Number(el.dataset.del);
        update((l) => { lastDeleted = { item: l[i], index: i }; l.splice(i, 1); });
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
        update((l) => l.push({ id: `i${Date.now()}`, text, done: false }));
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
        update((l) => l.forEach((it) => { it.done = false; }));
      });
    },
  };
}
