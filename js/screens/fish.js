import { fishIcon, ICON } from '../icons.js';
import { screen, esc, rich, bigLink, sourcesBlock } from '../ui.js';
import { SPECIES, VEDAS, GENERAL_TIPS } from '../data/species.js';
import { RIGS, RIGS_BY_SPECIES, SPECIES_RIG_NOTES, GLOSSARY, SHOPPING_LIST, RIG_CONFIDENCE, RIG_SOURCES } from '../data/rigs.js';
import { rigSvg, RIG_KEY } from '../drawings/rigs.js';
import { todayAR } from '../logic/dates.js';

const COLORS = { tararira: '#C2410C', carpa: '#0F766E', bagre: '#3730A3' };
const SECTIONS = [
  { id: 'carnadas', title: 'Carnadas' },
  { id: 'habitat', title: 'Hábitat' },
  { id: 'equipo', title: 'Equipo' },
  { id: 'tips', title: 'Tips' },
];

/** "En veda hasta el 30 de noviembre" when today is inside the closed season. */
export function vedaText(id, day = todayAR()) {
  const v = VEDAS[id];
  if (!v) return '';
  const n = (m, d) => m * 100 + d;
  const t = n(day.m, day.d);
  const from = n(...v.from);
  const to = n(...v.to);
  const inside = from <= to ? t >= from && t <= to : t >= from || t <= to;
  return inside ? 'En veda hasta el 30 de noviembre' : '';
}

export function rigCard(rig) {
  return `<section class="card rig">
    <div class="tags">${rig.letter ? `<span class="tag">${esc(rig.letter)}</span>` : ''}${rig.recommended ? '<span class="tag yellow">Recomendado</span>' : ''}<span class="tag">${rig.type === 'boya' ? 'Con boya' : 'De fondo'}</span></div>
    <h3 class="h3">${esc(rig.name)}</h3>
    ${rig.why ? `<p><strong>Por qué:</strong> ${rich(rig.why)}</p>` : ''}
    <div class="rig-drawing">${rigSvg(rig)}</div>
    <div class="key">${RIG_KEY.map((k) => `<span><i style="background:${k.color}"></i>${esc(k.label)}</span>`).join('')}</div>
    ${rig.measures?.length ? `<ul class="list">${rig.measures.map((m) => `<li>${rich(m)}</li>`).join('')}</ul>` : ''}
    ${rig.missing ? `<p class="small"><strong>Piezas que faltan:</strong> ${rich(rig.missing)}</p>` : ''}
  </section>`;
}

function rigsBlock(species) {
  const ids = RIGS_BY_SPECIES[species] || [];
  return `<h2 class="h2">Armados de línea</h2>
    ${SPECIES_RIG_NOTES[species] ? `<p>${rich(SPECIES_RIG_NOTES[species])}</p>` : ''}
    ${ids.map((id) => rigCard(RIGS[id])).join('')}
    <details class="card sources" style="font-size:16px;color:inherit">
      <summary>Palabras que se usan</summary>
      ${GLOSSARY.map((g) => `<p><strong>${esc(g.term)}:</strong> ${rich(g.text)}</p>`).join('')}
    </details>
    <details class="card sources" style="font-size:16px;color:inherit">
      <summary>Lista de compras para todos los armados</summary>
      <ul class="list">${SHOPPING_LIST.map((s) => `<li>${rich(s)}</li>`).join('')}</ul>
    </details>
    ${sourcesBlock(RIG_SOURCES, RIG_CONFIDENCE)}`;
}

export function blocksHtml(blocks = []) {
  return blocks.map((b) => {
    if (b.p) return `<p>${rich(b.p)}</p>`;
    if (b.h) return `<h2 class="h2">${esc(b.h)}</h2>`;
    if (b.list) return `<ul class="list">${b.list.map((i) => `<li>${rich(i)}</li>`).join('')}</ul>`;
    if (b.rigs) return rigsBlock(b.rigs);
    return '';
  }).join('');
}

function list() {
  const body = SPECIES.map((s) => bigLink(`#/peces/${s.id}`, s.name, {
    icon: fishIcon(s.id, COLORS[s.id] || '#0B0B0B', 64),
    small: s.scored ? 'En el Calendario' : s.where,
  })).join('') + bigLink('#/peces/tips', 'Tips generales', { cls: 'yellow', small: 'Presión, luna, horario, color' });
  return { title: 'Peces', html: screen('Peces', body) };
}

function species(s) {
  const veda = vedaText(s.id);
  const body = `<div class="fish-hero">
      <div style="display:flex;justify-content:center;padding:6px 0">${fishIcon(s.id, COLORS[s.id] || '#0B0B0B', 220)}</div>
      ${s.scientific ? `<span class="sci">${esc(s.scientific)}</span>` : ''}
      <p><strong>Cómo reconocerlo:</strong> ${rich(s.recognize)}</p>
      ${veda ? `<div class="card alert">${ICON.warning}<span>${esc(veda)}. Solo se puede pescar sábados, domingos y feriados, respetando el cupo (Disposición 89/08).</span></div>` : ''}
    </div>
    ${SECTIONS.map((x) => bigLink(`#/peces/${s.id}/${x.id}`, x.title)).join('')}`;
  return { title: s.name, html: screen(s.name, body, s.scored ? 'Tararira, carpa y bagre van en el Calendario' : s.where) };
}

function section(s, sec) {
  const body = blocksHtml(s[sec.id]) + (sec.id === 'tips' ? sourcesBlock(s.sources, s.confidence) : '');
  return { title: `${s.name} · ${sec.title}`, html: screen(sec.title, body, s.name) };
}

export function render(params) {
  if (params[0] === 'tips') {
    return { title: 'Tips generales', html: screen('Tips generales', blocksHtml(GENERAL_TIPS) + '<p class="small muted">Coinciden con el modelo del Calendario: luna nueva y presión bajando de a poco son lo mejor.</p>') };
  }
  const s = SPECIES.find((x) => x.id === params[0]);
  if (!s) return list();
  const sec = SECTIONS.find((x) => x.id === params[1]);
  return sec ? section(s, sec) : species(s);
}
