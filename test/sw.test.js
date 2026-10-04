import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

test('el Service Worker guarda todos los archivos de la app', () => {
  const sw = readFileSync('sw.js', 'utf8');
  const files = [...walk('js'), ...walk('css'), ...walk('fonts'), ...walk('icons')].filter((f) => !f.endsWith('.md'));
  for (const f of files) assert.ok(sw.includes(`'${f.replaceAll('\\', '/')}'`), `falta ${f} en sw.js`);
});
