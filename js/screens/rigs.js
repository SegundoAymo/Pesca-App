// Armados: pantalla propia de cada armado (rediseño 2026-11), con el dibujo en el agua,
// los nudos de sus piezas enlazados y "Sumar a la checklist".
import { ICON } from '../icons.js';
import { screen, esc, rich, chip } from '../ui.js';
import { RIGS, RIGS_BY_SPECIES, GLOSSARY } from '../data/rigs.js';
import { KNOTS, SITUATIONS } from '../data/knots.js';
import { SPECIES } from '../data/species.js';
import { rigSvg, RIG_KEY } from '../drawings/rigs.js';
import { lureRigSvg } from '../drawings/lure-rigs.js';
import { hookSvg } from '../drawings/hook.js';
import { glyph } from '../drawings/glyphs.js';
import { addItems } from './checklist.js';

// Knots named in the labels of the rig pieces.
const KNOT_NAMES = [
  [/palomar/i, 'palomar'], [/tope corredizo/i, 'tope'], [/nudo de brazolada|dropper/i, 'brazolada'],
  [/clinch/i, 'clinch'], [/\buni\b/i, 'uni'], [/lazo perfecto/i, 'lazo-perfecto'],
];

function partLabels(rig) {
  return rig.parts.flatMap((p) => [p.label, p.measure, ...(p.branch || []).map((b) => b.label)]).filter(Boolean);
}

/** Knot ids used by a rig, in the order they appear. */
export function knotsOfRig(rig) {
  const out = [];
  for (const label of partLabels(rig)) for (const [re, id] of KNOT_NAMES) if (re.test(label) && !out.includes(id)) out.push(id);
  return out;
}

/** Rigs that use a knot (for "Se usa en" in the tutorial). */
export function rigsUsingKnot(knotId) {
  return Object.values(RIGS).filter((r) => knotsOfRig(r).includes(knotId));
}

/** Situation that holds a knot (for its tutorial route). */
export function situationOf(knotId) {
  return SITUATIONS.find((s) => s.recommended.includes(knotId) && s.knots.includes(knotId))
    || SITUATIONS.find((s) => s.knots.includes(knotId));
}

export function knotHref(knotId) {
  const s = situationOf(knotId);
  return s ? `#/nudos/${s.id}/${knotId}` : '#/nudos';
}

/** Pieces that are missing, from the "missing" sentence of a rig. */
export function missingItems(rig) {
  const t = (rig.missing || '').trim().replace(/\.$/, '');
  if (!t || /^todo est[áa] en el kit/i.test(t)) return [];
  return t.split(/,\s*|\s+y\s+(?=[a-záéíóúñ0-9])/i).map((x) => x.trim()).filter(Boolean).map((x) => x[0].toUpperCase() + x.slice(1));
}

/** Soft-lure rigs: how it works, how to tie it, variants, when not, which fish. */
/** The hook of a rig, big, with its shape (pedido del usuario del 18/11/2026). */
function hookDetail(h) {
  const big = hookSvg({ x: 30, y: 74, s: 2.1, kind: h.kind, len: h.kind === 'long' ? 40 : h.kind === 'dropshot' ? 18 : 30, gap: h.kind === 'dropshot' ? 7 : 9 });
  return `<div class="hook-detail"><svg viewBox="0 0 150 100" width="150" height="100" role="img" aria-label="${esc(`Anzuelo ${h.title}`)}">${big}</svg><p><strong>${esc(h.title)}</strong><br>${esc(h.text)}</p></div>`;
}

function lureSections(rig) {
  const variants = rig.variants?.length ? `<h2 class="block-title">Variantes</h2><div class="variants">${rig.variants.map((v) => `<div class="variant">
      ${v.art ? `<div class="variant-art">${lureRigSvg(v.art, `Variante ${v.name}`)}</div>` : ''}
      <p class="variant-name">${esc(v.name)}</p><p><strong>Qué cambia:</strong> ${esc(v.what)}</p><p><strong>Cuándo:</strong> ${esc(v.when)}</p>
    </div>`).join('')}</div>` : '';
  return `${rig.hooks?.length ? `<h2 class="block-title">El anzuelo</h2>${rig.hooks.map(hookDetail).join('')}` : ''}
    <h2 class="block-title">Cómo funciona</h2><p>${esc(rig.works)}</p>
    <h2 class="block-title">Cómo armarlo</h2><ol class="tips">${rig.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
    ${rig.measures?.length ? `<div class="kit">${glyph('ruler', 30)}<p>${rig.measures.map(esc).join('<br>')}</p></div>` : ''}
    ${variants}
    <h2 class="block-title">Cuándo no conviene</h2><ul class="list">${rig.notWhen.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    <h2 class="block-title">Para qué peces</h2><p>${esc(rig.fish)}</p>
    <div class="${rig.forTararira ? 'kit' : 'warn'}">${glyph('teeth', 34)}<span>${esc(rig.tararira)}</span></div>`;
}

/** Compact card that links to a rig (used in Nudos → Plomada). */
export function rigLinkCard(rig, recommended = rig.recommended) {
  return `<a class="rig-link" href="#/armados/${rig.id}">
    ${rig.art ? `<span class="mini lure">${lureRigSvg(rig.art).replace(/<text[\s\S]*?<\/text>/g, '').replace(/width="360" height="240"/, 'width="112" height="75"')}</span>` : ''}
    <span class="rig-link-txt">${recommended ? chip('Recomendado', 'rec') : ''}<strong>${esc(rig.name)}</strong>${rig.use ? `<small>${esc(rig.use)}</small>` : rig.why ? `<small>${rich(rig.why.split('. ')[0].replace(/\.?$/, '.'))}</small>` : ''}</span>
    <span class="go">${ICON.chevron}</span>
  </a>`;
}

function rigScreen(rig) {
  const sp = SPECIES.find((s) => s.id === rig.species);
  const knots = knotsOfRig(rig);
  const missing = missingItems(rig);
  const others = sp ? (RIGS_BY_SPECIES[sp.id] || []).filter((id) => id !== rig.id) : [];
  const tags = [
    rig.recommended ? chip('Recomendado', 'rec') : '',
    chip({ boya: 'Con boya', fondo: 'De fondo', media: 'Media agua', superficie: 'Superficie' }[rig.type] || 'De fondo', '', { icon: glyph({ boya: 'surface', superficie: 'surface', media: 'midwater' }[rig.type] || 'bottom', 20) }),
    rig.forTararira ? chip('Para tararira', 'cat') : '',
  ].join('');
  const body = `
    <div class="chips">${tags}</div>
    ${rig.why ? `<p class="lead">${rich(rig.why)}</p>` : ''}
    ${rig.art ? `<div class="card rig"><div class="rig-drawing">${lureRigSvg(rig.art, `Dibujo del montaje ${rig.name}`)}</div><p class="small muted">Puntos: el anzuelo por dentro de la goma. No a escala.</p></div>` : `<div class="card rig"><div class="rig-drawing">${rigSvg(rig)}</div>
      <div class="key">${RIG_KEY.map((k) => `<span><i style="background:${k.color}"></i>${esc(k.label)}</span>`).join('')}</div>
    </div>`}
    ${rig.lure ? lureSections(rig) : ''}
    ${knots.length ? `<h2 class="block-title">Nudos de este armado</h2>
      <div class="knot-links">${knots.map((id) => `<a class="big" href="${knotHref(id)}">${glyph(id === 'tope' ? 'knot-dropper' : id === 'brazolada' ? 'knot-dropper' : 'knot-hook', 40)}<span class="label">${esc(KNOTS[id].name)}<small>${esc(KNOTS[id].difficulty)}${KNOTS[id].strength && /%/.test(KNOTS[id].strength) ? ` · ${esc(KNOTS[id].strength)}` : ''}</small></span><span class="go">${ICON.chevron}</span></a>`).join('')}</div>` : ''}
    <h2 class="block-title">Con tu kit</h2>
    ${missing.length
      ? `<div class="card"><p><strong>Te falta:</strong></p><ul class="list">${missing.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
         <button type="button" class="btn yellow block" data-add-missing>${ICON.plus}<span>Sumar a la checklist</span></button><p class="small" data-added aria-live="polite"></p></div>`
      : `<div class="kit">${glyph('tackle', 30)}<p><strong>Todo está en el kit.</strong></p></div>`}
    ${rig.measures?.length && !rig.lure ? `<details class="fold"><summary>Medidas y profundidad</summary><ul class="list">${rig.measures.map((m) => `<li>${rich(m)}</li>`).join('')}</ul></details>` : ''}
    <details class="fold"><summary>Palabras que se usan</summary>${GLOSSARY.map((g) => `<p><strong>${esc(g.term)}:</strong> ${rich(g.text)}</p>`).join('')}</details>
    ${others.length ? `<h2 class="block-title">Otros armados para ${esc(sp.name.toLowerCase())}</h2>${others.map((id) => rigLinkCard(RIGS[id])).join('')}` : ''}
    ${sp ? `<a class="btn white block" href="#/peces/${sp.id}">Ficha de la ${esc(sp.name.toLowerCase())}</a>` : ''}`;
  return {
    title: rig.name,
    html: screen(rig.name, body, sp ? `Armado para ${sp.name.toLowerCase()}` : rig.lure ? 'Montaje de señuelo de goma' : 'Armado de plomada'),
    mount(root) {
      root.querySelector('[data-add-missing]')?.addEventListener('click', (e) => {
        const n = addItems(`Para «${rig.name}»`, missing);
        e.currentTarget.disabled = true;
        root.querySelector('[data-added]').innerHTML = n
          ? `${n === 1 ? 'Se sumó 1 cosa' : `Se sumaron ${n} cosas`} a la checklist. <a href="#/checklist">Ver</a>`
          : 'Ya estaba todo en la checklist. <a href="#/checklist">Ver</a>';
      });
    },
  };
}

export function render(params) {
  const rig = RIGS[params[0]];
  if (!rig) return { title: 'Armados', html: screen('Armados', Object.values(RIGS).map((r) => rigLinkCard(r)).join('')) };
  return rigScreen(rig);
}
