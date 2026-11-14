// Text blocks of the data files: { p } paragraph, { h } subtitle, { list } bullets.
import { esc, rich } from '../ui.js';

export function blocksHtml(blocks = []) {
  return blocks.map((b) => {
    if (b.p) return `<p>${rich(b.p)}</p>`;
    if (b.h) return `<h3 class="h3">${esc(b.h)}</h3>`;
    if (b.list) return `<ul class="list">${b.list.map((i) => `<li>${rich(i)}</li>`).join('')}</ul>`;
    return '';
  }).join('');
}
