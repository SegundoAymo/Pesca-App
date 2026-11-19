// Checks of the 2026-11 redesign: the structured data of the species sheets, the words
// next to numbers, the links between sections and the saved-data migrations.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { SPECIES } from '../js/data/species.js';
import { RIGS } from '../js/data/rigs.js';
import { KNOTS, SITUATIONS } from '../js/data/knots.js';
import { GLYPHS } from '../js/drawings/glyphs.js';
import { FISH_ART, fishArt } from '../js/drawings/fish.js';
import { scoreWord, pressureWord, windWord, monthLevel } from '../js/logic/labels.js';
import { knotsOfRig, missingItems, knotHref, rigsUsingKnot } from '../js/screens/rigs.js';
import { migrate, INITIAL_ITEMS, GROUPS } from '../js/screens/checklist.js';
import { parseNumber, groupCatches } from '../js/screens/catches.js';

const icons = new Set(GLYPHS);

test('cada especie tiene su ilustración', () => {
  for (const s of SPECIES) {
    assert.ok(FISH_ART.includes(s.id), `falta la ilustración de ${s.id}`);
    assert.match(fishArt(s.id, 100), /^<svg [^>]*viewBox="0 0 160 80"/);
  }
});

test('fichas: los datos visuales son válidos', () => {
  for (const s of SPECIES) {
    const f = s.facts;
    assert.ok(f, `${s.id} sin facts`);
    if (f.months) {
      const all = [...f.months.good, ...f.months.some];
      assert.ok(all.every((m) => Number.isInteger(m) && m >= 1 && m <= 12), `${s.id}: mes inválido`);
      assert.equal(new Set(all).size, all.length, `${s.id}: un mes repetido`);
    }
    for (const m of f.moments) assert.ok(['dawn', 'day', 'dusk', 'night'].includes(m), `${s.id}: momento ${m}`);
    const used = [...f.where.map((w) => w.icon), ...f.baitMain.map((b) => b.icon), ...f.baitAlt.map((b) => b.icon),
      ...f.lures.map((l) => l.icon), ...f.lures.map((l) => l.depth), ...f.warnings.map((w) => w.icon)].filter(Boolean);
    for (const i of used) assert.ok(icons.has(i), `${s.id}: el ícono ${i} no existe`);
    assert.ok(f.baitMain.length, `${s.id}: sin carnada principal`);
    if (f.rig) assert.ok(RIGS[f.rig], `${s.id}: el armado ${f.rig} no existe`);
    else assert.ok(f.rigText, `${s.id}: sin armado ni texto de armado`);
  }
});

test('meses: temporada, menos activa, fuera de temporada y veda', () => {
  const tar = SPECIES.find((s) => s.id === 'tararira').facts;
  assert.equal(monthLevel(tar, 1), 'good');
  assert.equal(monthLevel(tar, 10), 'some');
  assert.equal(monthLevel(tar, 7), 'off');
  assert.equal(monthLevel(null, 10, { from: [9, 1], to: [11, 30] }), 'closed');
  assert.equal(monthLevel(SPECIES.find((s) => s.id === 'mojarra').facts, 5), null);
});

test('palabras del puntaje, la presión y el viento', () => {
  assert.equal(scoreWord(69), 'Flojo');
  assert.equal(scoreWord(70), 'Bueno');
  assert.equal(scoreWord(84), 'Bueno');
  assert.equal(scoreWord(85), 'Muy bueno');
  assert.equal(pressureWord(null), null);
  assert.equal(pressureWord(-8).word, 'Baja de golpe');
  assert.equal(pressureWord(-3).word, 'Baja de a poco');
  assert.equal(pressureWord(0.5).word, 'Estable');
  assert.equal(pressureWord(2).word, 'Sube de a poco');
  assert.equal(pressureWord(5).word, 'Sube fuerte');
  assert.equal(windWord(3), 'Calma');
  assert.equal(windWord(15), 'Leve');
  assert.equal(windWord(25), 'Moderado');
  assert.equal(windWord(33), 'Fuerte');
  assert.equal(windWord(70), 'Temporal');
});

test('armados: los nudos de sus piezas existen y tienen tutorial', () => {
  assert.deepEqual(knotsOfRig(RIGS['tararira-boya']), ['tope', 'palomar']);
  for (const r of Object.values(RIGS)) {
    for (const k of knotsOfRig(r)) {
      assert.ok(KNOTS[k], `${r.id}: nudo ${k}`);
      assert.match(knotHref(k), new RegExp(`^#/nudos/[a-z]+/${k}$`));
    }
  }
  assert.ok(rigsUsingKnot('palomar').length > 3);
  for (const s of SITUATIONS) for (const id of [...s.knots, ...(s.rigs || [])]) assert.ok(KNOTS[id] || RIGS[id], `${s.id}: ${id}`);
});

test('armados: lo que falta se separa en cosas para la checklist', () => {
  assert.deepEqual(missingItems(RIGS['tararira-boya']), ['Boya pera o plop', 'Hilo para el tope', 'Líder de acero de 20 cm (si todavía no lo compraste)', 'Anzuelos 2/0 a 5/0']);
  assert.deepEqual(missingItems(RIGS['bagre-fondo']), []);
});

test('checklist: la versión 1 pasa a la 2 sin perder ítems, orden ni tildes', () => {
  const v1 = { items: [
    { id: 'i1', text: 'Línea principal cargada', done: true },
    { id: 'x', text: 'Mate', done: false },
    { id: 'i0', text: 'Caña y reel', done: false },
  ] };
  const v2 = migrate(1, v1);
  assert.deepEqual(v2.items.map((i) => [i.text, i.done, i.group]), [
    ['Línea principal cargada', true, 'cana'], ['Mate', false, 'otros'], ['Caña y reel', false, 'cana'],
  ]);
  assert.equal(migrate(3, v1), null);
  for (const [g] of INITIAL_ITEMS) assert.ok(GROUPS.some((x) => x.id === g));
});

test('capturas: números opcionales y grupos por especie', () => {
  assert.equal(parseNumber(''), null);
  assert.equal(parseNumber('1,5'), 1.5);
  assert.equal(parseNumber('abc'), null);
  assert.equal(parseNumber('-3'), null);
  const g = groupCatches([
    { id: 'a', species: 'carpa', date: '2026-11-01', time: '08:00' },
    { id: 'b', species: null, date: '2026-11-02', time: '' },
    { id: 'c', species: 'tararira', date: '2026-11-03', time: '19:00' },
    { id: 'd', species: 'tararira', date: '2026-11-05', time: '07:00' },
  ]);
  assert.deepEqual(g.map((x) => [x.name, x.items.map((i) => i.id)]), [['Tararira', ['d', 'c']], ['Carpa', ['a']], ['Sin identificar', ['b']]]);
});

test('el Service Worker no lista archivos que no existen ni repetidos', () => {
  const sw = readFileSync('sw.js', 'utf8');
  const list = [...sw.slice(sw.indexOf('const SHELL'), sw.indexOf('];')).matchAll(/'([^']+)'/g)].map((m) => m[1]).filter((f) => f !== './');
  for (const f of list) assert.ok(existsSync(f), `sw.js lista ${f}, que no existe`);
  assert.equal(new Set(list).size, list.length, 'sw.js tiene archivos repetidos');
});

test('montajes de goma: cada uno con dibujo, pasos, variantes y regla de la tararira', async () => {
  const { LURE_RIGS } = await import('../js/data/rigs.js');
  const { lureRigSvg } = await import('../js/drawings/lure-rigs.js');
  assert.equal(LURE_RIGS.length, 9);
  for (const id of LURE_RIGS) {
    const r = RIGS[id];
    assert.match(lureRigSvg(r.art), /^<svg/, id);
    assert.ok(r.steps.length >= 2 && r.works && r.notWhen.length && r.fish && r.tararira && r.use, id);
    for (const v of r.variants) if (v.art) assert.match(lureRigSvg(v.art), /^<svg/, `${id}: ${v.name}`);
  }
});

test('reportar: arma título y texto, y la versión coincide con el Service Worker', async () => {
  const { buildReport, reportUrl } = await import('../js/screens/report.js');
  const { APP_VERSION } = await import('../js/version.js');
  const r = buildReport({ kind: 'cambio', text: 'Agregar la boga al calendario\nporque…', where: '#/calendario', version: 'v99' });
  assert.equal(r.title, 'Pedido de cambio: Agregar la boga al calendario');
  assert.match(r.body, /Pantalla: #\/calendario\nVersión: v99/);
  assert.match(reportUrl(r), /^https:\/\/github\.com\/SegundoAymo\/Pesca-App\/issues\/new\?title=/);
  assert.ok(readFileSync('sw.js', 'utf8').includes(`const VERSION = '${APP_VERSION}';`), 'APP_VERSION distinta de sw.js');
});

test('condiciones de una captura y resumen de los mejores días', async () => {
  const { catchConditions, summarize, moonGroup } = await import('../js/logic/conditions.js');
  const { sunTimes, momentOfDay } = await import('../js/logic/sun.js');
  // Navarro, 21 de diciembre: sale cerca de las 5:40 y se pone cerca de las 20:10.
  const sun = sunTimes({ y: 2026, m: 12, d: 21 }, -35.0056, -59.277);
  assert.ok(sun.sunrise >= '05:20' && sun.sunrise <= '06:00', sun.sunrise);
  assert.ok(sun.sunset >= '19:50' && sun.sunset <= '20:30', sun.sunset);
  assert.equal(momentOfDay('06:10', sun), 'dawn');
  assert.equal(momentOfDay('13:00', sun), 'day');
  assert.equal(momentOfDay('23:00', sun), 'night');
  assert.equal(momentOfDay('', sun), null);
  const tar = SPECIES.find((s) => s.id === 'tararira');
  const c = catchConditions({ date: '2026-12-21', time: '20:30', species: 'tararira', facts: tar.facts });
  assert.equal(c.moment, 'dusk');
  assert.equal(c.season, 'good');
  assert.ok(typeof c.score === 'number' && c.moon && c.water > 20);
  assert.equal(c.temp, undefined, 'sin pronóstico no se inventa la temperatura');
  assert.equal(catchConditions({ date: '' }), null);
  assert.equal(moonGroup('Gibosa creciente'), 'Creciente');
  const sum = summarize([{ conditions: c }, { conditions: { ...c, moment: 'night' } }, { conditions: null }]);
  assert.deepEqual(sum.find((x) => x.title === 'Momento del día').rows, [{ label: 'Atardecer', n: 1 }, { label: 'Noche', n: 1 }]);
});
