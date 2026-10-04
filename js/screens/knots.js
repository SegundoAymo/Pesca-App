import { screen, esc, rich, bigLink, sourcesBlock } from '../ui.js';
import { SITUATIONS, KNOTS, KNOT_SOURCES } from '../data/knots.js';
import { RIGS } from '../data/rigs.js';
import { rigCard } from './fish.js';
import { knotStepSvg, knotKey } from '../drawings/knots.js';

function situations() {
  const body = `<p>Elegí qué querés unir. El recomendado para tu kit (nylon 0,30 mm) va primero.</p>`
    + SITUATIONS.map((s) => bigLink(`#/nudos/${s.id}`, s.title, { num: s.n })).join('')
    + sourcesBlock(KNOT_SOURCES);
  return { title: 'Nudos', html: screen('Nudos', body) };
}

function situation(s) {
  const order = (ids) => [...ids].sort((a, b) => s.recommended.includes(b) - s.recommended.includes(a));
  let body = s.note ? `<div class="card note"><p>${rich(s.note)}</p></div>` : '';
  if (s.rigs?.length) {
    body += `<p>La plomada no lleva un nudo propio: depende de cómo se arma la línea.</p>`;
    body += order(s.rigs).map((id) => rigCard({ ...RIGS[id], recommended: s.recommended.includes(id) })).join('');
  }
  body += order(s.knots).map((id) => {
    const k = KNOTS[id];
    const rec = s.recommended.includes(id);
    return bigLink(`#/nudos/${s.id}/${id}`, k.name, {
      cls: rec ? 'yellow' : '',
      small: `${rec ? '**Recomendado** · ' : ''}${k.difficulty}${k.strength ? ` · ${k.strength}` : ''}`,
    });
  }).join('');
  return { title: s.title, html: screen(s.title, body, `Situación ${s.n}`) };
}

function knot(s, k) {
  const steps = k.steps.map((t, i) => {
    const drawing = knotStepSvg(k.id, i);
    return `<li class="step">
      ${drawing ? `<div class="draw">${drawing}</div>` : ''}
      <div class="txt"><span class="num">${i + 1}</span><span>${rich(t)}</span></div>
    </li>`;
  }).join('');
  const body = `
    <div class="tags"><span class="tag">${esc(k.difficulty)}</span>${s.recommended.includes(k.id) ? '<span class="tag yellow">Recomendado</span>' : ''}</div>
    <dl class="facts">
      <dt>Líneas</dt><dd>${esc(k.lines)}</dd>
      <dt>Resistencia</dt><dd>${k.strength ? esc(k.strength) : 'Sin dato'}</dd>
    </dl>
    ${k.note ? `<p>${rich(k.note)}</p>` : ''}
    <div class="key">${knotKey(k.id).map((x) => `<span><i style="background:${x.color}"></i>${esc(x.label)}</span>`).join('')}</div>
    <ol class="steps">${steps}</ol>`;
  return { title: k.name, html: screen(k.name, body, s.title) };
}

export function render(params) {
  const s = SITUATIONS.find((x) => x.id === params[0]);
  if (!s) return situations();
  const k = params[1] && KNOTS[params[1]];
  return k ? knot(s, k) : situation(s);
}
