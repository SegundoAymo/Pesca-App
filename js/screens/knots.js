// Nudos (rediseño 2026-11): ¿qué querés atar? → nudos con miniatura → tutorial con todos
// los pasos a la vista; tocar un dibujo lo abre en grande con anterior y siguiente.
import { ICON } from '../icons.js';
import { screen, esc, rich, chip } from '../ui.js';
import { SITUATIONS, KNOTS, REDRAWN } from '../data/knots.js';
import { RIGS } from '../data/rigs.js';
import { knotStepSvg, knotKey, knotStepCount, KNOT_PALETTE } from '../drawings/knots.js';
import { glyph } from '../drawings/glyphs.js';
import { load, save } from '../store.js';
import { rigLinkCard, rigsUsingKnot, knotHref } from './rigs.js';

// The four labels the user chose, big; the other situations below.
const MAIN = [
  { id: 'reel', tag: 'Línea', hint: 'al reel', icon: 'knot-reel' },
  { id: 'anzuelo', tag: 'Anzuelo', hint: 'o emerillón', icon: 'knot-hook' },
  { id: 'senuelo', tag: 'Señuelo', hint: 'que se mueva libre', icon: 'knot-lure' },
  { id: 'unir', tag: 'Empalme', hint: 'unir dos líneas', icon: 'knot-join' },
];
const MORE_ICON = { paleta: 'knot-hook', lazos: 'knot-loop', armar: 'knot-dropper', plomada: 'knot-sinker', acero: 'knot-wire' };
// Questions that pick the knot in one tap.
const DECIDE = {
  unir: { q: '¿Las dos líneas tienen el mismo grosor?', a: [['Sí', 'sangre'], ['No', 'cirujano']] },
  acero: { q: '¿Qué alambre tenés?', a: [['Una hebra (mono-acero)', 'haywire'], ['Cable 7x7', 'manguito']] },
};
const LEVEL = { 'Fácil': 1, 'Media': 2, 'Difícil': 3 };
// Redrawn knots with a correction asked by the user, still pending (docs/equipo/tablero.md).
const IN_CORRECTION = ['cirujano', 'snell'];

export function lastKnot() {
  return load('lastKnot', 1, null);
}

function dots(difficulty) {
  const n = LEVEL[difficulty] || 0;
  if (!n) return esc(difficulty || '');
  return `<span class="dots" aria-label="Dificultad: ${esc(difficulty)}">${[1, 2, 3].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span> ${esc(difficulty)}`;
}

const strengthPct = (k) => (k.strength && /%/.test(k.strength) ? k.strength : '');

/** The finished knot, small: the last step without scissors and texts, its "already done"
    shade shown strong, and the frame cut down to the knot so it fills the thumbnail. */
const minis = new Map();
const DONE_TO_MOVE = Object.values(KNOT_PALETTE).filter((c) => c && c.done).map((c) => [c.done, c.move]);
export function knotMini(id) {
  if (minis.has(id)) return minis.get(id);
  const n = knotStepCount(id);
  if (!n) return '';
  let svg = knotStepSvg(id, n - 1)
    .replace(/<g transform="translate\([^)]*\)"><circle cx="-9" cy="12"[\s\S]*?<\/g>/g, '')
    .replace(/<text[\s\S]*?<\/text>/g, '')
    .replace(/<path d="M[^"]*"[^>]*fill="#5BB4E5"\/>/g, '');
  for (const [done, move] of DONE_TO_MOVE) svg = svg.split(done).join(move);
  // Frame: the extent of the line paths (M/L polylines), with a margin.
  const xs = [];
  const ys = [];
  for (const m of svg.matchAll(/<path d="(M[\d. L-]+)"/g)) {
    const nums = m[1].replace(/[ML]/g, ' ').trim().split(/\s+/).map(Number);
    for (let i = 0; i + 1 < nums.length; i += 2) { xs.push(nums[i]); ys.push(nums[i + 1]); }
  }
  if (xs.length) {
    const pad = 10;
    let x0 = Math.max(0, Math.min(...xs) - pad);
    let y0 = Math.max(0, Math.min(...ys) - pad);
    let w = Math.min(330, Math.max(...xs) + pad) - x0;
    let h = Math.min(170, Math.max(...ys) + pad) - y0;
    // Keep the thumbnail's shape (about 2:1).
    if (w / h > 2) { const nh = w / 2; y0 = Math.max(0, y0 - (nh - h) / 2); h = nh; } else { const nw = h * 2; x0 = Math.max(0, x0 - (nw - w) / 2); w = nw; }
    svg = svg.replace('viewBox="0 0 330 170"', `viewBox="${x0.toFixed(0)} ${y0.toFixed(0)} ${w.toFixed(0)} ${h.toFixed(0)}"`);
  }
  svg = svg.replace('width="330" height="170"', 'width="112" height="56"');
  minis.set(id, svg);
  return svg;
}

/* ---------- ¿Qué querés atar? ---------- */

function situations() {
  const last = lastKnot();
  const main = MAIN.map((m) => {
    const s = SITUATIONS.find((x) => x.id === m.id);
    const rec = s.recommended.map((id) => KNOTS[id]?.name).filter(Boolean).join(' · ');
    return `<a class="tile" href="#/nudos/${s.id}">
      ${glyph(m.icon, 56)}
      <span class="tile-tag">${esc(m.tag)}</span>
      <span class="tile-hint">${esc(m.hint)}</span>
      ${rec ? `<span class="tile-rec">${esc(rec)}</span>` : ''}
    </a>`;
  }).join('');
  const more = SITUATIONS.filter((s) => !MAIN.some((m) => m.id === s.id)).map((s) => `<a class="big slim" href="#/nudos/${s.id}">${glyph(MORE_ICON[s.id] || 'knot-loop', 40)}<span class="label">${esc(s.title)}</span><span class="go">${ICON.chevron}</span></a>`).join('');
  const lastRow = last && KNOTS[last] ? `<a class="big slim yellow" href="${knotHref(last)}">${knotMini(last) ? `<span class="mini">${knotMini(last)}</span>` : ''}<span class="label">Último: ${esc(KNOTS[last].name)}</span><span class="go">${ICON.chevron}</span></a>` : '';
  const body = `<h2 class="group-title first">¿Qué querés atar?</h2>
    <div class="tiles">${main}</div>
    ${lastRow}
    <h2 class="group-title">Más</h2>
    ${more}`;
  return { title: 'Nudos', html: screen('Nudos', body) };
}

/* ---------- Nudos de una situación ---------- */

function knotRow(s, id) {
  const k = KNOTS[id];
  const rec = s.recommended.includes(id);
  const pct = strengthPct(k);
  return `<a class="krow${rec ? ' rec' : ''}" href="#/nudos/${s.id}/${id}">
    <span class="mini">${knotMini(id)}</span>
    <span class="krow-txt">${rec ? chip('Recomendado', 'rec') : ''}${IN_CORRECTION.includes(id) ? chip('En corrección', 'mute') : ''}<strong>${esc(k.name)}</strong>
      <small>${dots(k.difficulty)}${pct ? ` · ${esc(pct)}` : ''}</small></span>
    <span class="go">${ICON.chevron}</span>
  </a>`;
}

function situation(s) {
  let body = '';
  const d = DECIDE[s.id];
  if (d) {
    body += `<div class="decide"><p><strong>${esc(d.q)}</strong></p><div class="decide-row">${d.a.map(([label, id]) => `<a class="btn yellow" href="#/nudos/${s.id}/${id}">${esc(label)} → ${esc(KNOTS[id].name)}</a>`).join('')}</div></div>`;
  } else if (s.note) body += `<div class="card note"><p>${rich(s.note)}</p></div>`;
  if (s.rigs?.length) {
    body += '<p>La plomada no lleva un nudo propio: depende de cómo se arma la línea.</p>';
    body += [...s.rigs].sort((a, b) => s.recommended.includes(b) - s.recommended.includes(a)).map((id) => rigLinkCard(RIGS[id], s.recommended.includes(id))).join('');
  }
  const order = (ids) => [...ids].sort((a, b) => s.recommended.includes(b) - s.recommended.includes(a));
  const ready = order(s.knots.filter((id) => REDRAWN.includes(id) && !IN_CORRECTION.includes(id)));
  const draft = order(s.knots.filter((id) => !REDRAWN.includes(id) || IN_CORRECTION.includes(id)));
  body += ready.map((id) => knotRow(s, id)).join('');
  if (draft.length) {
    body += `<h2 class="group-title">Dibujo provisorio</h2><p class="small muted">Dibujos que todavía no se rehicieron o que tienen una corrección pendiente: seguilos con cuidado.</p>`;
    body += draft.map((id) => knotRow(s, id)).join('');
  }
  const main = MAIN.find((m) => m.id === s.id);
  return { title: s.title, html: screen(main ? `${main.tag}` : s.title, body, main ? s.title : '') };
}

/* ---------- Tutorial ---------- */

function legendLine(id) {
  const key = knotKey(id);
  const short = key.filter((x) => x.svg && /quieta|Este paso|Ya hecho|Mover|Tirar|quieto/i.test(x.label));
  return `<div class="legend-line">${short.map((x) => `<span>${x.svg}${esc(x.label)}</span>`).join('')}
    <details class="fold inline"><summary>Ver todos los símbolos</summary><div class="key">${key.map((x) => `<span>${x.svg ?? ''}${esc(x.label)}</span>`).join('')}</div></details></div>`;
}

function knot(s, k) {
  const n = k.steps.length;
  const steps = k.steps.map((t, i) => {
    const drawing = knotStepSvg(k.id, i);
    const lastStep = i === n - 1;
    return `<li class="step${lastStep ? ' result' : ''}">
      ${drawing ? `<button type="button" class="draw" data-zoom="${i}" aria-label="Ver el paso ${i + 1} en grande">${drawing}<span class="zoom-hint">${ICON.search}</span></button>` : ''}
      <div class="txt"><span class="num">${i + 1}</span><span>${rich(t)}</span></div>
    </li>`;
  }).join('');
  const used = rigsUsingKnot(k.id);
  const others = s.knots.filter((id) => id !== k.id);
  const pct = strengthPct(k);
  const body = `
    <div class="chips">${s.recommended.includes(k.id) ? chip('Recomendado', 'rec') : ''}<span class="chip">${dots(k.difficulty)}</span>${pct ? chip(`Resiste ${pct}`) : ''}${IN_CORRECTION.includes(k.id) ? chip('Dibujo en corrección', 'mute') : REDRAWN.includes(k.id) ? '' : chip('Dibujo provisorio', 'mute')}</div>
    <p class="small"><strong>Líneas:</strong> ${esc(k.lines)}${pct || !k.strength ? '' : ` · ${esc(k.strength)}`}</p>
    ${k.note ? `<p>${rich(k.note)}</p>` : ''}
    ${legendLine(k.id)}
    <ol class="steps">${steps}</ol>
    ${used.length ? `<h2 class="block-title">Se usa en estos armados</h2><div class="chips">${used.map((r) => chip(r.name, '', { href: `#/armados/${r.id}`, icon: glyph(r.type === 'boya' ? 'surface' : 'bottom', 20) })).join('')}</div>` : ''}
    ${others.length ? `<h2 class="block-title">Otros para esto</h2><div class="chips">${others.map((id) => chip(KNOTS[id].name, '', { href: `#/nudos/${s.id}/${id}` })).join('')}</div>` : ''}`;
  return {
    title: k.name,
    html: screen(k.name, body, s.title),
    mount(root) {
      save('lastKnot', 1, k.id);
      root.querySelectorAll('[data-zoom]').forEach((b) => b.addEventListener('click', () => zoom(root, k, Number(b.dataset.zoom))));
    },
    unmount() {
      document.querySelector('.zoom')?.remove();
    },
  };
}

/** One step, big, with previous and next: for tying on the shore. */
function zoom(root, k, i) {
  document.querySelector('.zoom')?.remove();
  const n = k.steps.length;
  const el = document.createElement('div');
  el.className = 'zoom';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', `${k.name}, paso ${i + 1} de ${n}`);
  el.innerHTML = `<div class="zoom-top"><span class="zoom-count">Paso ${i + 1} de ${n}</span><button type="button" class="back" data-close aria-label="Cerrar">${ICON.close}</button></div>
    <div class="zoom-draw">${knotStepSvg(k.id, i)}</div>
    <p class="zoom-txt"><span class="num">${i + 1}</span><span>${rich(k.steps[i])}</span></p>
    <div class="zoom-nav">
      <button type="button" class="btn white" data-step="${i - 1}"${i === 0 ? ' disabled' : ''}>${ICON.prev} Anterior</button>
      <button type="button" class="btn yellow" data-step="${i + 1}"${i === n - 1 ? ' disabled' : ''}>Siguiente ${ICON.next}</button>
    </div>`;
  document.body.appendChild(el);
  document.body.classList.add('zoomed');
  const close = () => { el.remove(); document.body.classList.remove('zoomed'); root.querySelector(`[data-zoom="${i}"]`)?.focus(); };
  el.querySelector('[data-close]').addEventListener('click', close);
  el.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => zoom(root, k, Number(b.dataset.step))));
  el.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  el.querySelector('.btn.yellow:not([disabled])')?.focus() || el.querySelector('[data-close]').focus();
}

export function render(params) {
  document.body.classList.remove('zoomed');
  const s = SITUATIONS.find((x) => x.id === params[0]);
  if (!s) return situations();
  const k = params[1] && Object.hasOwn(KNOTS, params[1]) ? KNOTS[params[1]] : null;
  return k ? knot(s, k) : situation(s);
}
