// Peces: catálogo tipo Pokédex y ficha única de cada especie (rediseño 2026-11).
import { ICON } from '../icons.js';
import { screen, esc, rich, chip, section, mix } from '../ui.js';
import { SPECIES, VEDAS, GENERAL_TIPS } from '../data/species.js';
import { RIGS, RIGS_BY_SPECIES } from '../data/rigs.js';
import { fishArt } from '../drawings/fish.js';
import { glyph } from '../drawings/glyphs.js';
import { todayAR } from '../logic/dates.js';
import { scoreDay } from '../logic/score.js';
import { monthLevel, scoreWord, MOMENTS, DEPTHS } from '../logic/labels.js';
import { cachedPressureDeltas, cachedDays } from '../weather-service.js';
import { dayKey } from '../logic/dates.js';
import { blocksHtml } from './blocks.js';
import * as catches from './catches.js';

export const SPECIES_COLOR = { tararira: '#C2410C', carpa: '#0F766E', bagre: '#3730A3' };
const MONTH_LETTERS = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const MONTH_NAMES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
// Old routes (#/peces/tararira/carnadas …) open the single sheet at that block.
const OLD_BLOCKS = { carnadas: 'carnada', habitat: 'donde', equipo: 'armado', tips: 'consejos' };

/** "En veda hasta el 30 de noviembre" when today is inside the closed season. */
export function vedaText(id, day = todayAR()) {
  const v = VEDAS[id];
  if (!v) return '';
  return monthLevel(null, day.m, v) === 'closed' && inDays(day, v) ? `En veda hasta el ${v.to[1]} de ${MONTH_NAMES[v.to[0] - 1]}` : '';
}
function inDays(day, v) {
  const n = (m, d) => m * 100 + d;
  const t = n(day.m, day.d);
  const from = n(...v.from);
  const to = n(...v.to);
  return from <= to ? t >= from && t <= to : t >= from || t <= to;
}

/** Season status of a species today: { level, label, kind } or null. */
export function seasonNow(s, day = todayAR()) {
  if (vedaText(s.id, day)) return { level: 'closed', label: 'Veda', kind: 'alert' };
  const level = monthLevel(s.facts, day.m);
  if (level === 'good') return { level, label: 'Temporada', kind: 'cat' };
  if (level === 'some') return { level, label: 'Poca actividad', kind: '' };
  if (level === 'off') return { level, label: 'Fuera de temporada', kind: 'mute' };
  return null;
}

function todayScore(id) {
  if (!SPECIES_COLOR[id]) return null;
  const today = todayAR();
  const r = scoreDay(today, today, cachedPressureDeltas());
  return r.results.find((x) => x.species === id) || null;
}

/* ---------- Catalog ---------- */

function card(s) {
  const st = seasonNow(s);
  const sc = todayScore(s.id);
  const marks = [
    st ? chip(st.label, st.kind) : '',
    sc && sc.score >= 70 ? chip(`Hoy ${sc.score}`, 'sp', { style: `background:${SPECIES_COLOR[s.id]}` }) : '',
  ].join('');
  const alert = s.facts?.warnings?.[0] ? `<span class="fcard-alert" title="${esc(s.facts.warnings[0].text)}">${glyph(s.facts.warnings[0].icon, 26)}</span>` : '';
  const n = catches.countFor(s.id);
  return `<a class="fcard" href="#/peces/${s.id}"${SPECIES_COLOR[s.id] ? ` style="--sp:${SPECIES_COLOR[s.id]}"` : ''}>
    <span class="fcard-art">${fishArt(s.id, 150)}${alert}${n ? `<span class="fcard-count" aria-label="${n} capturas">${n}</span>` : ''}</span>
    <span class="fcard-name">${esc(s.name)}</span>
    <span class="fcard-marks">${marks}</span>
  </a>`;
}

function catalog() {
  const lake = SPECIES.filter((s) => /Navarro/.test(s.where));
  const river = SPECIES.filter((s) => !/Navarro/.test(s.where));
  const body = `${catches.tabs('especies')}
    <h2 class="group-title">En la laguna</h2>
    <div class="fgrid">${lake.map(card).join('')}</div>
    <h2 class="group-title">En el río Salado</h2>
    <div class="fgrid">${river.map(card).join('')}</div>`;
  return { title: 'Peces', html: screen('Peces', body) };
}

/* ---------- Species sheet ---------- */

function monthStrip(s) {
  if (!s.facts?.months && !VEDAS[s.id]) return '';
  const now = todayAR().m;
  const cells = MONTH_LETTERS.map((l, i) => {
    const m = i + 1;
    const lv = monthLevel(s.facts, m, VEDAS[s.id]) || 'none';
    return `<span class="mcell ${lv}${m === now ? ' now' : ''}" title="${MONTH_NAMES[i]}">${l}</span>`;
  }).join('');
  const has = (lv) => MONTH_LETTERS.some((_, i) => monthLevel(s.facts, i + 1, VEDAS[s.id]) === lv);
  const key = [
    has('good') ? '<span><i class="mcell good"></i>Temporada</span>' : '',
    has('some') ? '<span><i class="mcell some"></i>Menos activa</span>' : '',
    has('off') ? '<span><i class="mcell off"></i>Fuera de temporada</span>' : '',
    has('closed') ? '<span><i class="mcell closed"></i>Veda</span>' : '',
  ].join('');
  const note = [s.facts?.monthsNote, has('closed') ? 'En veda se puede pescar sábados, domingos y feriados, con cupo.' : ''].filter(Boolean).join(' ');
  return `<div class="months" role="img" aria-label="${esc(monthsLabel(s))}">${cells}</div><div class="mkey">${key}</div>${note ? `<p class="small muted">${esc(note)}</p>` : ''}`;
}

function monthsLabel(s) {
  const pick = (lv) => MONTH_NAMES.filter((_, i) => monthLevel(s.facts, i + 1, VEDAS[s.id]) === lv);
  const parts = [];
  if (pick('good').length) parts.push(`Temporada: ${pick('good').join(', ')}`);
  if (pick('some').length) parts.push(`menos activa: ${pick('some').join(', ')}`);
  if (pick('closed').length) parts.push(`veda: ${pick('closed').join(', ')}`);
  return parts.join('; ');
}

function moments(f) {
  if (!f?.moments?.length) return '';
  // Today's sunrise and sunset, when the forecast is saved.
  const sun = cachedDays()?.[dayKey(todayAR())];
  const time = { dawn: sun?.sunrise, dusk: sun?.sunset };
  return `<div class="moments">${MOMENTS.map((m) => {
    const on = f.moments.includes(m.id);
    return `<span class="moment${on ? ' on' : ''}">${glyph(m.id, 30)}<span>${m.label}</span>${time[m.id] ? `<small>${esc(time[m.id])}</small>` : ''}${on ? '' : '<span class="sr">: no es el mejor momento</span>'}</span>`;
  }).join('')}</div>${f.momentsNote ? `<p class="small muted">${rich(f.momentsNote)}</p>` : ''}`;
}

function baitBlock(f) {
  const main = f.baitMain.map((b) => `<div class="bait-main">${glyph(b.icon || 'fish', 52)}<span>${esc(b.name)}</span></div>`).join('');
  const alt = f.baitAlt.length ? `<p class="mini-title">También</p><div class="chips">${f.baitAlt.map((b) => chip(b.name, '', { icon: b.icon ? glyph(b.icon, 22) : '' })).join('')}</div>` : '';
  return `${main}${alt}${f.baitNote ? `<p class="small">${rich(f.baitNote)}</p>` : ''}`;
}

function whereBlock(f) {
  return `<ul class="where">${f.where.map((w) => `<li>${glyph(w.icon, 34)}<span>${esc(w.text)}</span></li>`).join('')}</ul>`;
}

// A soft lure "de fondo con plomo" links to the bottom rigs with a sliding sinker (Wilson p. 79).
const BOTTOM_LURE_RIGS = () => `<div class="chips">${['senuelo-texas', 'senuelo-carolina'].map((id) => chip(RIGS[id].name.replace('Señuelo de goma al fondo: m', 'M'), '', { href: `#/armados/${id}`, icon: glyph('bottom', 20) })).join('')}</div>`;

function luresBlock(f) {
  if (!f.lures.length) return f.luresNote ? `<p>${rich(f.luresNote)}</p>${/plomo/.test(f.luresNote) ? BOTTOM_LURE_RIGS() : ''}` : '';
  const groups = [['surface', 'Superficie'], ['midwater', 'Media agua'], ['bottom', 'Fondo'], ['', '']];
  const html = groups.map(([d, title]) => {
    const list = f.lures.filter((l) => (l.depth || '') === d);
    if (!list.length) return '';
    return `${title ? `<p class="mini-title">${glyph(d, 22)} ${title}</p>` : ''}
      <ul class="lures">${list.map((l) => `<li>${l.icon ? glyph(l.icon, 36) : glyph(d || 'fish', 36)}<span><strong>${esc(l.name)}</strong><small>${esc(l.how)}</small></span></li>`).join('')}</ul>`;
  }).join('');
  const soft = f.lures.some((l) => l.icon === 'lure-soft');
  return `${html}${f.luresNote ? `<p class="small muted">${rich(f.luresNote)}</p>` : ''}${soft ? `<p class="mini-title">Goma al fondo con plomada corrediza</p>${BOTTOM_LURE_RIGS()}` : ''}`;
}

function rigBlock(s) {
  const f = s.facts;
  let html = '';
  if (f.rig && RIGS[f.rig]) {
    const r = RIGS[f.rig];
    const others = (RIGS_BY_SPECIES[s.id] || []).filter((id) => id !== f.rig);
    html += `<a class="rig-link" href="#/armados/${r.id}">
      <span class="rig-link-txt">${chip('Recomendado', 'rec')}<strong>${esc(r.name)}</strong><small>${rich(firstSentence(r.why))}</small></span>
      <span class="go">${ICON.chevron}</span>
    </a>`;
    if (others.length) html += `<p class="mini-title">Otros armados</p><div class="chips">${others.map((id) => chip(RIGS[id].name, '', { href: `#/armados/${id}` })).join('')}</div>`;
  } else if (f.rigText) {
    html += `<p>${rich(f.rigText)}</p>`;
  }
  if (f.kit) html += `<div class="kit">${glyph('tackle', 30)}<p><strong>Con tu kit:</strong> ${rich(f.kit)}</p></div>`;
  const gear = (s.equipo || []).filter((b) => !b.rigs);
  if (gear.length) html += `<details class="fold"><summary>Línea, líder y anzuelo</summary>${blocksHtml(gear)}</details>`;
  return html;
}

function firstSentence(t = '') {
  const m = t.match(/^[^.]+\./);
  return m ? m[0] : t;
}

function sheet(s, block) {
  const f = s.facts || { baitMain: [], baitAlt: [], where: [], lures: [], tips: [], warnings: [] };
  const st = seasonNow(s);
  const sc = todayScore(s.id);
  const veda = vedaText(s.id);
  const chips = [
    st ? chip(st.label, st.kind) : '',
    sc ? chip(`Hoy ${sc.score} · ${scoreWord(sc.score)}`, 'sp', { style: `background:${sc.score >= 70 ? SPECIES_COLOR[s.id] : '#8A8A84'}`, href: '#/calendario' }) : '',
    f.size ? chip(f.size.text, '', { icon: glyph('ruler', 20) }) : '',
  ].join('');
  const alerts = [
    veda ? `<div class="card alert">${ICON.warning}<span>${esc(veda)}. Solo sábados, domingos y feriados, respetando el cupo (Disposición 89/08).</span></div>` : '',
    ...f.warnings.map((w) => `<div class="warn">${glyph(w.icon, 34)}<span>${rich(w.text)}</span></div>`),
  ].join('');
  const where = s.where ? `<p class="small muted place-line">${glyph(/Navarro/.test(s.where) ? 'weeds' : 'river', 20)} ${esc(s.where)}</p>` : '';
  const body = `
    <div class="hero"${SPECIES_COLOR[s.id] ? ` style="--sp:${SPECIES_COLOR[s.id]}"` : ''}>${fishArt(s.id, 340)}</div>
    <div class="chips">${chips}<a class="chip add" href="#/peces/capturas/nueva/${s.id}">${glyph('plus', 18)}<span>Captura</span></a></div>
    <p class="recognize"><strong>Cómo reconocerlo:</strong> ${rich(s.recognize)}</p>
    ${where}
    ${alerts}
    ${section('carnada', 'Carnada', baitBlock(f))}
    ${f.months || f.moments?.length || VEDAS[s.id] ? section('cuando', 'Cuándo', monthStrip(s) + moments(f)) : ''}
    ${f.where.length ? section('donde', 'Dónde', whereBlock(f)) : ''}
    ${f.lures.length || f.luresNote ? section('senuelos', 'Señuelos', luresBlock(f)) : ''}
    ${section('armado', 'Armado', rigBlock(s))}
    ${f.tips.length ? section('consejos', 'Consejos', `<ol class="tips">${f.tips.map((t) => `<li>${rich(t)}</li>`).join('')}</ol>`) : ''}
    ${f.size?.scope || s.scientific ? `<p class="small muted">${f.size?.scope ? `${esc(f.size.text)}: ${esc(f.size.scope.charAt(0).toLowerCase() + f.size.scope.slice(1))}.` : ''} ${s.scientific ? `<em>${esc(s.scientific)}</em>` : ''}</p>` : ''}`;
  return {
    title: s.name,
    html: screen(s.name, body, s.scored ? 'Entra en el Calendario' : ''),
    mount(root) {
      if (!block) return;
      const el = root.querySelector(`#b-${block}`);
      if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
    },
    keepTop: !!block,
  };
}

function generalTips() {
  return { title: 'Consejos generales', html: screen('Consejos generales', blocksHtml(GENERAL_TIPS)) };
}

export function render(params, ctx) {
  if (params[0] === 'capturas') return catches.render(params.slice(1), ctx);
  if (params[0] === 'tips') return generalTips();
  const s = SPECIES.find((x) => x.id === params[0]);
  if (!s) return catalog();
  const block = OLD_BLOCKS[params[1]] || params[1] || '';
  return sheet(s, block);
}

/** Mix helper kept for the catalog background (light species tint). */
export const tint = (id) => (SPECIES_COLOR[id] ? mix(SPECIES_COLOR[id], 0.12) : '#E8F2F6');
