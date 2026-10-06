// Draws some steps of one knot three times bigger, one under the other, to look at them
// closely while drawing. Usage: node tools/nudos/pasos.mjs <knot id> <step numbers...>
// Writes tools/nudos/salida/pasos.png. Needs Playwright with Chromium, like hoja.mjs.
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { knotStepSvg, knotStepCount } from '../../js/drawings/knots.js';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'salida'), { recursive: true });
const root = execSync('npm root -g').toString().trim();
const { chromium } = await import(pathToFileURL(join(root, 'playwright', 'index.mjs')).href);
const [id, ...nums] = process.argv.slice(2);
const steps = nums.length ? nums.map(Number) : Array.from({ length: knotStepCount(id) }, (_, i) => i + 1);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 990, height: 510 * steps.length } });
await page.setContent('<body style="margin:0;background:#F5F5F2">' + steps.map((n) => knotStepSvg(id, n - 1).replace('width="330" height="170"', 'width="990" height="510"')).join('<br>'));
await page.screenshot({ path: join(here, 'salida', 'pasos.png'), fullPage: true });
await browser.close();
console.log(join('tools/nudos/salida/pasos.png'));
