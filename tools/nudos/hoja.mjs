// Makes one image per knot (every step, with its text and the key) for the drawing review.
// Usage: node tools/nudos/hoja.mjs [knot ids...]   (no ids: all knots)
// Writes tools/nudos/salida/<id>.png. Needs Playwright with Chromium (development only,
// not part of the app): it is looked up in the global npm folder.
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { KNOTS } from '../../js/data/knots.js';
import { knotStepSvg, knotStepCount, knotKey } from '../../js/drawings/knots.js';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'salida');
mkdirSync(out, { recursive: true });
const root = execSync('npm root -g').toString().trim();
const { chromium } = await import(pathToFileURL(join(root, 'playwright', 'index.mjs')).href);

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(KNOTS);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 800 }, deviceScaleFactor: 2 });
for (const id of ids) {
  const k = KNOTS[id];
  if (!k) throw new Error(`No existe el nudo ${id}`);
  const key = knotKey(id).map((x) => `<span>${x.svg ?? ''}${x.label}</span>`).join('');
  let steps = '';
  for (let i = 0; i < knotStepCount(id); i++) {
    steps += `<div class="s"><p><b>Paso ${i + 1}.</b> ${k.steps[i].replace(/\*\*/g, '')}</p>${knotStepSvg(id, i).replace('width="330" height="170"', 'width="495" height="255"')}</div>`;
  }
  writeFileSync(join(out, `${id}.html`), `<!doctype html><meta charset="utf-8"><style>
body{font-family:Barlow,Arial,sans-serif;margin:14px;width:1040px}h1{margin:0 0 6px;font-size:24px}
.key{display:flex;flex-wrap:wrap;gap:4px 16px;font-weight:700;font-size:14px;margin-bottom:10px}.key span{display:inline-flex;gap:6px;align-items:center}
.g{display:grid;grid-template-columns:repeat(2,505px);gap:14px}.s p{margin:0 0 4px;font-size:15px}.s svg{background:#F5F5F2;border-radius:8px;display:block}
</style><h1>${k.name}</h1><div class="key">${key}</div><div class="g">${steps}</div>`);
  await page.goto(pathToFileURL(join(out, `${id}.html`)).href);
  await page.screenshot({ path: join(out, `${id}.png`), fullPage: true });
  console.log(join('tools/nudos/salida', `${id}.png`));
}
await browser.close();
