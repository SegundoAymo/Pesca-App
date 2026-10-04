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
  </header>`;
}

export function screen(title, body, sub = '') {
  return `${topbar(title, sub)}<main class="content">${body}</main>`;
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
