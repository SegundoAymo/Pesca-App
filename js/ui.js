// Small HTML helpers shared by the screens.
import { ICON } from './icons.js';

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Escapes text and turns **x** into bold. */
export function rich(s) {
  return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

export function topbar(title, sub = '') {
  return `<header class="topbar">
    <button class="back" type="button" data-back aria-label="Volver">${ICON.back}</button>
    <h1>${esc(title)}${sub ? `<span class="sub">${esc(sub)}</span>` : ''}</h1>
    <a class="home-link" href="#/" aria-label="Inicio">${ICON.home}</a>
  </header>`;
}

export function screen(title, body, sub = '', cls = '') {
  const here = (typeof location !== 'undefined' ? location.hash || '#/' : '#/').replace(/^#\/?/, '');
  const report = here.startsWith('reportar') ? '' : `<a class="report-link" href="#/reportar${here ? `/${here}` : ''}">Reportar un problema o pedir un cambio</a>`;
  return `${topbar(title, sub)}<main class="content${cls ? ` ${cls}` : ''}">${body}${report}</main>`;
}

/** Small rounded label. kind: '' (white), 'rec' (recommended, yellow with star), 'cat'
    (black with yellow letters), 'alert' (red), 'mute' (gray), or a species color via style. */
export function chip(text, kind = '', { icon = '', style = '', href = '' } = {}) {
  const inner = `${icon}${kind === 'rec' ? STAR : ''}<span>${esc(text)}</span>`;
  const cls = `chip${kind ? ` ${kind}` : ''}`;
  return href
    ? `<a class="${cls}" href="${href}"${style ? ` style="${style}"` : ''}>${inner}</a>`
    : `<span class="${cls}"${style ? ` style="${style}"` : ''}>${inner}</span>`;
}
const STAR = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.2 6.8.8-5 4.6 1.3 6.7L12 17.5l-6 3.3 1.3-6.7-5-4.6 6.8-.8z" fill="#0B0B0B"/></svg>';

/** Section title of a long screen, with an anchor id for #/…/:bloque. */
export function section(id, title, body, extra = '') {
  return `<section class="sblock" id="b-${id}" data-block="${id}">
    <h2 class="block-title">${esc(title)}${extra}</h2>
    ${body}
  </section>`;
}

export function bigLink(href, label, { icon = '', small = '', num = '', cls = '' } = {}) {
  return `<a class="big ${cls}" href="${href}">
    ${num !== '' ? `<span class="num">${esc(num)}</span>` : ''}${icon}
    <span class="label">${esc(label)}${small ? `<small>${rich(small)}</small>` : ''}</span>
    <span class="go">${ICON.chevron}</span>
  </a>`;
}

export function sourcesBlock(sources = [], confidence = '') {
  if (!sources.length && !confidence) return '';
  return `<details class="sources">
    <summary>Confianza y fuentes</summary>
    ${confidence ? `<p>${rich(confidence)}</p>` : ''}
    ${sources.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>`).join('')}
  </details>`;
}

export const DOW = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const DOW_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** Mixes a #RRGGBB color with a base (white by default): a = 0 base, 1 full color. */
export function mix(hex, a, base = '#FFFFFF') {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const c = p(hex);
  const b = p(base);
  return `rgb(${c.map((v, i) => Math.round(b[i] + (v - b[i]) * a)).join(',')})`;
}

/** Says a short text to screen readers (the region lives outside #app, so it survives re-renders). */
export function announce(text) {
  const el = document.getElementById('live');
  if (!el) return;
  el.textContent = '';
  setTimeout(() => { el.textContent = text; }, 60);
}
