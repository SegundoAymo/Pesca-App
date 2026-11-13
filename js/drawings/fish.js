// Ilustraciones de los 11 peces (estilo Señal S7), dibujadas a mano en SVG.
// viewBox 160 x 80, el pez mira a la izquierda. Sin dependencias.
// fishArt(id, size) devuelve el <svg> como texto; bajo 100 px de ancho se
// omite la capa de detalle fino (rayos de aletas, escamas chicas, brillos).

const K = '#0B0B0B';
let uid = 0;

const r1 = (n) => Math.round(n * 10) / 10;
const det = (s) => `<g class="fish-detail">${s}</g>`;

// Rayos de una aleta: n líneas desde el segmento base hasta el borde libre.
function rays(b, o, n, color, reach = 0.86) {
  let d = '';
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1);
    const x0 = b[0] + (b[2] - b[0]) * t;
    const y0 = b[1] + (b[3] - b[1]) * t;
    const x1 = o[0] + (o[2] - o[0]) * t;
    const y1 = o[1] + (o[3] - o[1]) * t;
    d += `M${r1(x0)} ${r1(y0)}L${r1(x0 + (x1 - x0) * reach)} ${r1(y0 + (y1 - y0) * reach)}`;
  }
  return det(`<path d="${d}" fill="none" stroke="${color}" stroke-width="1" stroke-linecap="round"/>`);
}

// Aleta: forma con contorno + rayos.
function fin(d, fill, rayColor, b, o, n = 4) {
  return `<path d="${d}" fill="${fill}" stroke="${K}" stroke-width="1.6" stroke-linejoin="round"/>${b ? rays(b, o, n, rayColor) : ''}`;
}

// Cola ahorquillada. px: arranque en el pedúnculo; tx: punta; nx: fondo de la horquilla.
function forkTail(px, yT, yB, tx, tT, tB, nx, fill, rayColor) {
  const cy = (yT + yB) / 2;
  const d = `M${px} ${yT - 1}C${px + 8} ${yT - 3} ${tx - 9} ${tT + 2} ${tx} ${tT}C${tx - 2} ${tT + 7} ${nx + 2} ${cy - 6} ${nx} ${cy}C${nx + 2} ${cy + 6} ${tx - 2} ${tB - 7} ${tx} ${tB}C${tx - 9} ${tB - 2} ${px + 8} ${yB + 3} ${px} ${yB + 1}Z`;
  return `<path d="${d}" fill="${fill}" stroke="${K}" stroke-width="1.6" stroke-linejoin="round"/>`
    + rays([px + 3, yT + 1, px + 3, cy], [tx - 3, tT + 3, nx, cy - 2], 4, rayColor, 0.84)
    + rays([px + 3, cy, px + 3, yB - 1], [nx, cy + 2, tx - 3, tB - 3], 4, rayColor, 0.84);
}

function eye(x, y, r = 4, iris = '#FFFFFF') {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${iris}" stroke="${K}" stroke-width="1.4"/>`
    + `<circle cx="${r1(x - r * 0.1)}" cy="${y}" r="${r1(r * 0.58)}" fill="${K}"/>`
    + `<circle cx="${r1(x - r * 0.35)}" cy="${r1(y - r * 0.28)}" r="${r1(Math.max(0.7, r * 0.2))}" fill="#FFFFFF"/>`;
}

const line = (d, color = K, w = 1.6, extra = '') =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;

// Bigote: trazo negro con alma del color del pez, para que se lea sobre el cuerpo y sobre el fondo.
const barbel = (d, w = 1.8) => line(d, K, w);

const blob = (cx, cy, rx, ry, rot, fill) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : ''}/>`;

// Escamas: arcos con el borde libre hacia la cola, en hileras alternadas.
function scales(x0, x1, y0, y1, sx, sy, color, w) {
  let d = '';
  let row = 0;
  for (let y = y0; y <= y1; y += sy, row++) {
    for (let x = x0 + (row % 2 ? sx / 2 : 0); x <= x1; x += sx) {
      d += `M${r1(x)} ${r1(y - sy / 2)}q${r1(sx * 0.55)} ${r1(sy / 2)} 0 ${sy}`;
    }
  }
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
}

// Arma el pez. `open` es el contorno del cuerpo desde el pedúnculo (abajo),
// por el vientre hasta el hocico y de vuelta por el lomo hasta el pedúnculo (arriba).
function build(f) {
  const n = ++uid;
  const c1 = `${f.id}-c${n}`;
  const c2 = `${f.id}-u${n}`;
  const [px, yT, yB] = f.end;
  const close = `Q${px + 5} ${(yT + yB) / 2} ${px} ${yB}`;
  const body = `${f.open}${close}Z`;
  const kL = f.kL || 6;
  const kB = f.kB || 7;
  return `<defs><clipPath id="${c1}"><path d="${body}"/></clipPath>`
    + `<clipPath id="${c2}"><path d="${body}" transform="translate(0 ${-kB})"/></clipPath></defs>`
    + `<g>${f.back || ''}</g>`
    + `<g clip-path="url(#${c1})">`
    + `<rect width="160" height="80" fill="${f.belly}"/>`
    + `<g clip-path="url(#${c2})"><rect width="160" height="80" fill="${f.lomo}"/>`
    + `<path d="${body}" transform="translate(0 ${kL})" fill="${f.base}"/></g>`
    + (f.pattern || '')
    + (f.shine === false ? '' : det(`<path d="${f.open}" transform="translate(0 ${kL + 2.2})" fill="none" stroke="#FFFFFF" stroke-opacity="0.38" stroke-width="1.6" stroke-linecap="round"/>`))
    + `</g>`
    + `<g>${f.head || ''}</g>`
    + `<g>${eye(...f.eye)}</g>`
    + line(`M${px} ${yT}${close}`, K, 1.2)
    + line(f.open, K, 2.4)
    + `<g>${f.front || ''}</g>`;
}

const FISH = {
  // Tararira: cilíndrica, cola redonda, manchas oscuras, boca grande con dientes.
  tararira() {
    const fc = '#9A7A46';
    const rc = '#4E3A1E';
    const sp = '#3A2A14';
    return {
      id: 'tararira', base: '#8A6A3A', lomo: '#4E3A1E', belly: '#E9DDBF', kL: 6, kB: 7,
      end: [126, 32, 49],
      open: 'M126 49C104 55 80 57 56 56C38 55.5 20 53.5 10 48C5 45 4.5 39 8 35.5C16 28.5 36 25 56 25C82 24 106 27 126 32',
      back: fin('M122 32C134 23 152 27 154 40.5C152 54 134 58 122 49Z', fc, rc, [128, 34, 128, 47], [150, 27, 150, 54], 7)
        + det(blob(138, 34, 1.4, 1.4, 0, sp) + blob(144, 40, 1.4, 1.4, 0, sp) + blob(138, 46, 1.4, 1.4, 0, sp) + blob(147, 33, 1.2, 1.2, 0, sp) + blob(147, 47, 1.2, 1.2, 0, sp))
        + fin('M60 27C62 12 76 7 91 11C96 15 97 22 95 28Z', fc, rc, [64, 26, 92, 26], [66, 9, 97, 14], 7)
        + det(blob(70, 17, 1.3, 1.3, 0, sp) + blob(78, 14, 1.3, 1.3, 0, sp) + blob(86, 17, 1.3, 1.3, 0, sp) + blob(76, 21, 1.2, 1.2, 0, sp) + blob(89, 22, 1.2, 1.2, 0, sp))
        + fin('M70 55C71 65 79 69 88 66C87 60 83 56 79 54Z', fc, rc, [72, 56, 79, 55], [76, 67, 88, 65], 3)
        + fin('M100 54C101 64 109 69 118 65C118 59 116 54 113 52Z', fc, rc, [102, 55, 113, 53], [106, 67, 118, 64], 4),
      pattern: blob(50, 39, 6, 4.2, -18, sp) + blob(66, 43, 6.5, 3.8, 14, sp) + blob(82, 38, 6, 4.4, -12, sp)
        + blob(98, 43, 6, 3.6, 16, sp) + blob(112, 38.5, 5, 3.6, -14, sp) + blob(122, 42, 3.6, 3, 0, sp)
        + det(blob(58, 33, 2.4, 1.6, 20, sp) + blob(74, 33, 2.2, 1.5, -10, sp) + blob(90, 33, 2.4, 1.5, 15, sp) + blob(105, 34, 2, 1.4, 0, sp)
          + blob(58, 47, 2, 1.4, 0, sp) + blob(74, 48, 2, 1.3, 0, sp) + blob(90, 47, 2, 1.3, 0, sp) + blob(106, 47, 1.8, 1.2, 0, sp)
          + line('M44 45C64 43 96 42 126 41', '#4E3A1E', 0.8, ' stroke-dasharray="2.5 2"')),
      head: line('M37 28.5C43 35 43 46 36 53', K, 1.6)
        + det(line('M21 37L33 40M21 39L31 45', '#3A2A14', 1.1) + line('M30 30C34 36 34 45 29 51', '#4E3A1E', 1))
        + `<path d="M5.6 40.6L27 42.6L26 45.2L7 46.4Z" fill="#3A1410" stroke="${K}" stroke-width="1.2" stroke-linejoin="round"/>`
        + `<path d="M8 41L9.4 44.4L10.8 41.3ZM13.2 41.4L14.4 44.4L15.8 41.6ZM18.2 41.9L19.3 44.3L20.6 42.1ZM10.4 46.1L11.7 43.2L13 46ZM15.6 45.8L16.8 43.4L18 45.7Z" fill="#FFFFFF" stroke="${K}" stroke-width="0.5" stroke-linejoin="round"/>`
        + det(`<circle cx="8.6" cy="37.6" r="0.8" fill="${K}"/>`),
      eye: [17.5, 35, 3.8, '#F3D98A'],
      front: fin('M38 50C40 59 48 64 57 62C56 56 50 51 44 49Z', fc, rc, [40, 51, 45, 50], [46, 62, 57, 61], 4),
    };
  },

  // Carpa: cuerpo alto, escamas grandes, dorsal larga, barbillas cortas.
  carpa() {
    const fc = '#9C7424';
    const red = '#C9652B';
    const rc = '#6E4E12';
    const rr = '#7A3210';
    return {
      id: 'carpa', base: '#B8862B', lomo: '#6E4E12', belly: '#F1DFA6', kL: 7, kB: 8,
      end: [128, 33, 47],
      open: 'M128 47C112 54 96 62.5 72 64.5C50 66 28 60 14 50C8 46 7 41 10 37C18 26 34 15 56 13C80 11 108 22 128 33',
      back: forkTail(126, 33, 47, 154, 20, 62, 142, fc, rc)
        + fin('M50 16L55 3C62 2.5 68 6 74 7C90 9 106 15 117 24L115 29Z', fc, rc, [56, 14, 114, 26], [60, 4, 117, 23], 11)
        + fin('M68 63C69 72 77 77 85 74C83 68 79 64 76 62Z', red, rr, [70, 64, 76, 63], [74, 75, 85, 73], 3)
        + fin('M100 58C100 68 108 73 116 68C115 62 113 57 110 54Z', red, rr, [102, 59, 110, 56], [105, 71, 116, 67], 4),
      pattern: scales(42, 126, 22, 62, 11, 10, '#5E400C', 1.3),
      head: line('M36 21C43 32 43 46 35 57', K, 1.6)
        + det(line('M29 26C34 34 34 44 28 52', '#6E4E12', 1))
        + line('M8 43.4C10.6 45.6 13.4 46 16.4 44.8', K, 1.5)
        + barbel('M10.4 46C9.4 49.4 10 52.4 12 54.6', 1.7) + barbel('M15.6 46.4C15.4 50.4 17 53.6 19.8 55.4', 1.7)
        + det(`<circle cx="11.6" cy="38.6" r="0.8" fill="${K}"/>`),
      eye: [21, 35, 3.8, '#F6DE9A'],
      front: fin('M37 54C38 64 46 70 55 68C53 61 47 56 42 53Z', red, rr, [39, 55, 43, 54], [45, 68, 55, 67], 4),
    };
  },

  // Bagre sapo: piel lisa sin patrón, cabeza chata, tres pares de bigotes, adiposa larga.
  bagre() {
    const fc = '#7C806A';
    const rc = '#3E4234';
    return {
      id: 'bagre', base: '#6B6F5A', lomo: '#3E4234', belly: '#E6E4D2', kL: 6, kB: 7,
      end: [128, 34, 46],
      open: 'M128 46C108 52 84 56.5 60 56.5C40 56.5 24 54.5 15 50C10.5 47.5 10.5 42 14 39C23 33 37 28.5 54 27C80 25.5 106 29 128 34',
      back: barbel('M14 42.5C9 38 5 31 3 22', 1.8)
        + fin('M125 33C136 26 148 22 153 27C151 33 147 37 144 40C147 43 151 47 153 53C148 58 136 54 125 47Z', fc) + rays([129, 35, 129, 40], [150, 25, 145, 39], 3, rc) + rays([129, 40, 129, 45], [145, 41, 150, 55], 3, rc)
        + fin('M53 28C54 15 61 9 68 11C74 15 77 22 77 28Z', fc, rc, [56, 27, 76, 27], [60, 11, 77, 20], 5)
        + fin('M84 28C92 20 112 21 123 32L121 35Z', fc)
        + fin('M72 56C73 65 80 69 87 66C85 60 81 56 78 54Z', fc, rc, [74, 57, 78, 56], [78, 67, 87, 65], 3)
        + fin('M98 54C99 64 108 68 117 62C115 57 113 53 110 51Z', fc, rc, [100, 55, 110, 53], [104, 66, 117, 61], 5),
      pattern: det(line('M46 41C70 39.5 100 39.5 128 40.5', '#3E4234', 0.9)),
      head: line('M41 31C46 37 46 46 40 53', K, 1.6)
        + line('M12.4 45.2C15 47.2 19 47.6 22.6 46.6', K, 1.5)
        + det(`<circle cx="15.4" cy="40.6" r="0.8" fill="${K}"/>`),
      eye: [25, 38.5, 2.9, '#EFE6B8'],
      front: fin('M38 52L55 64C50 67.5 42 63 37.5 55Z', fc, rc, [40, 54, 42, 58], [54, 64, 50, 66], 3)
        + line('M38 52L55 64', K, 2.2)
        + barbel('M15 45.5C22 58 40 68 64 70.5', 1.9)
        + barbel('M17 50.5C18 56 21 61 26 65', 1.5) + barbel('M21 52.5C23 57 27 61 33 63.5', 1.5),
    };
  },

  // Pejerrey: fino, dos dorsales, franja plateada a lo largo del costado.
  pejerrey() {
    const fc = '#DCE4E7';
    const rc = '#5F7F8C';
    return {
      id: 'pejerrey', base: '#C3CFD5', lomo: '#5F7F8C', belly: '#FFFFFF', kL: 5, kB: 6,
      end: [130, 36, 45],
      open: 'M130 45C110 50 84 53.5 58 52.5C36 51.5 18 48.5 8 43.5C4.5 41.5 4.5 38.5 7.5 36.5C19 30.5 38 28 58 28C86 28 110 31 130 36',
      back: forkTail(128, 36, 45, 155, 23, 58, 141, fc, rc)
        + fin('M65 30L70 18C74 20 77 25 77 30Z', fc, rc, [67, 29, 76, 29], [70, 19, 77, 26], 3)
        + fin('M96 31L99 16C106 20 112 27 115 33Z', fc, rc, [98, 30, 113, 32], [100, 17, 115, 31], 5)
        + fin('M62 52L66 62C70 60 72 56 72 52Z', fc, rc, [64, 53, 71, 53], [66, 61, 72, 56], 2)
        + fin('M90 51L93 63C104 61 114 55 121 47Z', fc, rc, [92, 52, 118, 48], [94, 62, 120, 48], 7),
      pattern: line('M30 40.6C60 39.6 100 39.8 131 40.6', '#FFFFFF', 3.6)
        + line('M30 38.6C60 37.6 100 37.8 131 38.6', '#3F5F6C', 1.3)
        + det(line('M30 42.7C60 41.7 100 41.9 131 42.7', '#8FA3AD', 0.7)),
      head: line('M30 31C34.5 36 34.5 44 29.5 49', K, 1.6)
        + line('M5.4 38.4L11.4 40.6', K, 1.5)
        + det(`<circle cx="9" cy="36.6" r="0.7" fill="${K}"/>`),
      eye: [16.5, 38, 3.8],
      front: fin('M36 41C43 37.5 53 39.5 57 46C49 47.5 40 45.5 36 43Z', fc, rc, [37, 42, 37, 43], [55, 41, 56, 46], 3),
    };
  },

  // Dientudo: alargado, boca grande con colmillos, cola amarilla con mancha negra en la base.
  dientudo() {
    const fc = '#D6DBD2';
    const rc = '#6C7A66';
    const ye = '#E0B93A';
    const ry = '#8A6A10';
    return {
      id: 'dientudo', base: '#BFC6BE', lomo: '#6C7A66', belly: '#F7F7F0', kL: 6, kB: 7,
      end: [128, 34, 46],
      open: 'M128 46C112 52 90 58 64 58C40 58 20 53.5 9.5 47C4.5 44 4.5 40 8 37C18 29 38 25 60 25C86 25 108 29 128 34',
      back: forkTail(126, 34, 46, 155, 20, 61, 141, ye, ry)
        + `<path d="M126 37.4L138.5 39.4L138.5 40.6L126 42.6Z" fill="${K}"/>`
        + fin('M65 27L70 9C78 13 84 20 87 27Z', fc, rc, [68, 26, 85, 26], [71, 10, 87, 25], 6)
        + fin('M107 30.5C110 25.5 115 25 118.5 28L116.5 32.5Z', '#E6DFB8')
        + fin('M61 58L64 68C69 66 72 62 72 58Z', '#EAD98E', ry, [63, 59, 71, 59], [64, 67, 72, 62], 2)
        + fin('M83 56L86 70C98 65 112 57 123 47Z', '#EAD98E', ry, [85, 57, 120, 48], [87, 69, 122, 48], 9),
      pattern: line('M48 40C70 39 100 39.4 120 40', '#FFFFFF', 2.4, ' stroke-opacity="0.75"')
        + blob(122, 40, 5.5, 3.6, 0, K)
        + blob(46, 36.5, 2.2, 3.4, 0, '#2A3326'),
      head: line('M35 28C40.5 35 40.5 46 34.5 53', K, 1.6)
        + `<path d="M5.4 39.2L27 45.4L24.6 48.6L8 46.6Z" fill="#3A1410" stroke="${K}" stroke-width="1.2" stroke-linejoin="round"/>`
        + `<path d="M6.8 39.4L8.6 46.6L10.6 40.5ZM14.6 41.7L15.8 45.8L17.4 42.5ZM19.6 43.1L20.5 46.2L21.8 43.7ZM10.4 47.2L12.4 41L13.8 47.5ZM17 47.6L18.4 44L19.6 47.8Z" fill="#FFFFFF" stroke="${K}" stroke-width="0.6" stroke-linejoin="round"/>`
        + det(`<circle cx="9" cy="37.4" r="0.7" fill="${K}"/>`),
      eye: [18, 35.5, 4],
      front: fin('M34 50C37 57.5 45 61 52 59C49 54.5 43 50.5 38 49Z', fc, rc, [36, 51, 39, 50], [42, 60, 52, 58], 3),
    };
  },

  // Mojarra: corta y alta, ojo grande, aletas rojizas, mancha humeral.
  mojarra() {
    const red = '#D9482B';
    const rr = '#7A1E0C';
    return {
      id: 'mojarra', base: '#D5DBDD', lomo: '#7F9098', belly: '#FFFFFF', kL: 7, kB: 9,
      end: [124, 35, 46],
      open: 'M124 46C113 54 98 64 76 65.5C54 66.5 34 59 22 49C17.5 45.5 17 41 20 37C30 24 48 16 70 16C92 16 111 26 124 35',
      back: forkTail(122, 35, 46, 150, 21, 60, 137, red, rr)
        + `<path d="M118 38.2L134.5 39.6L134.5 40.6L118 42.4Z" fill="${K}"/>`
        + fin('M66 18L72 3C80 8 86 15 89 22Z', red, rr, [69, 17, 87, 21], [73, 4, 89, 21], 6)
        + fin('M104 26C107 21 112 21 115.5 24.5L113.5 30Z', '#E9B9A8')
        + fin('M62 64L64 75C70 73 73 69 74 65Z', red, rr, [64, 65, 73, 65], [65, 74, 74, 68], 2)
        + fin('M84 63L86 77C98 72 110 62 119 50Z', red, rr, [86, 64, 116, 52], [87, 76, 118, 51], 9),
      pattern: line('M56 40C80 39 104 39.6 124 40.4', '#FFFFFF', 3, ' stroke-opacity="0.8"')
        + blob(118, 40.4, 6, 3, 0, K)
        + blob(51, 35, 2.6, 4.6, 0, '#2B3338')
        + det(scales(58, 118, 24, 60, 8, 7, '#7F9098', 0.7)),
      head: line('M42 24C48 33 48 46 41 56', K, 1.6)
        + line('M19 41.4L24.6 43.4', K, 1.5)
        + det(`<circle cx="22.6" cy="38.4" r="0.7" fill="${K}"/>`),
      eye: [31, 36, 5.6],
      front: fin('M42 53C45 61 52 64.5 59 62.5C56 57.5 50 53.5 46 52Z', '#E9B9A8', rr, [44, 54, 47, 53], [50, 63, 59, 61], 3),
    };
  },

  // Vieja del agua: achatada, placas óseas en rejilla, boca ventosa abajo, dorsal alta con radio duro.
  vieja() {
    const fc = '#8E6E48';
    const rc = '#42301C';
    const sp = '#2E2012';
    const dots = (pts) => pts.map(([x, y]) => blob(x, y, 1.4, 1.4, 0, sp)).join('');
    return {
      id: 'vieja', shine: false, base: '#7A5C3C', lomo: '#42301C', belly: '#C9B58F', kL: 5, kB: 5,
      end: [128, 38, 48],
      open: 'M128 48C110 51.5 90 55 60 56C40 56.8 20 57 9 56C4.5 55.5 3.5 52 6.5 49C15 40 29 28 47 23.5C60 22.5 72 25.5 84 29.5C100 34 114 36.5 128 38',
      back: `<path d="M8 55C8 62.5 21 62.5 21 55Z" fill="#C9B58F" stroke="${K}" stroke-width="1.6" stroke-linejoin="round"/>`
        + barbel('M8.5 57.5C6.5 59.5 5.5 61.5 5.6 63.6', 1.5)
        + fin('M126 38C136 33 146 26 152 19C150 28 147 35 145 42C148 49 152 57 156 66C147 62 136 55 126 48Z', fc) + rays([130, 39, 130, 43], [149, 24, 146, 41], 4, rc) + rays([130, 43, 130, 47], [146, 44, 152, 61], 4, rc)
        + det(dots([[138, 36], [144, 32], [138, 44], [144, 49], [149, 56], [149, 27]]))
        + fin('M46 25L51 3C66 8 79 18 88 31Z', fc, rc, [52, 23, 85, 29], [56, 6, 88, 30], 6)
        + det(dots([[56, 14], [63, 12], [61, 20], [69, 17], [70, 24], [77, 22]]))
        + fin('M107 35L114 28L117 37Z', fc)
        + fin('M68 56L88 66C83 71 74 67 68 59Z', fc, rc, [70, 58, 72, 62], [86, 66, 82, 68], 3)
        + fin('M100 53L104 62C108 61 110 57 111 52Z', fc, rc, [102, 54, 109, 53], [104, 61, 110, 56], 2),
      pattern: line('M40 33L37 56M50 28L46 56M60 27L56 56M70 28L66 56M80 30L77 55M90 32L87.5 54M100 34L98 53M110 36L108.5 52M120 37L119 50', '#2E2012', 1.3)
        + line('M34 41C60 36.5 96 39 128 41.5M32 49C60 46.5 96 46 128 45.5', '#2E2012', 1.3)
        + det(dots([[12, 50], [17, 45], [22, 49], [24, 42], [30, 44], [33, 36], [38, 31], [28, 51], [18, 53]])
          + line('M44 34.5C62 30.5 96 34 128 39.6', '#2E2012', 0.8)),
      head: det(line('M36 30C40 38 40 48 36 56', '#2E2012', 1))
        + det(`<circle cx="12" cy="46.6" r="0.9" fill="${K}"/>`),
      eye: [26, 36.5, 3.2, '#E9D9A6'],
      front: line('M48.5 22.5L51.6 4', K, 3)
        + fin('M33 54L60 65C54 71 41 67 33 57Z', fc, rc, [35, 56, 38, 61], [58, 65, 52, 68], 4)
        + line('M33 54L60 65', K, 2.6),
    };
  },

  // Lisa: cabeza chata y roma, dos dorsales separadas, líneas a lo largo del cuerpo.
  lisa() {
    const fc = '#C3CCD1';
    const rc = '#4E6470';
    return {
      id: 'lisa', base: '#AEB8BE', lomo: '#4E6470', belly: '#F4F6F6', kL: 6, kB: 6,
      end: [130, 35, 46],
      open: 'M130 46C110 52 86 56.5 60 56.5C38 56.5 20 54 10.5 49C5.5 46.5 5 40.5 8.5 37.5C14 32.5 34 27.5 58 27C86 27 110 30 130 35',
      back: forkTail(128, 35, 46, 155, 21, 60, 142, fc, rc)
        + fin('M62 29L65 13C72 16 77 22 79 29Z', fc, rc, [64, 28, 78, 28], [66, 14, 79, 27], 3)
        + fin('M99 30L103 15C110 19 115 26 116 33Z', fc, rc, [101, 29, 115, 32], [104, 16, 116, 31], 5)
        + fin('M62 56L65 67C70 64.5 73 60 73 56Z', fc, rc, [64, 57, 72, 57], [65, 66, 73, 60], 2)
        + fin('M97 53L100 66C108 63 114 57 117 50Z', fc, rc, [99, 54, 115, 51], [101, 65, 117, 51], 5),
      pattern: line('M40 36.4C66 34.6 104 36 130 38.2M40 40.4C66 38.8 104 39.6 130 40.6M40 44.4C66 43.2 104 43 130 42.8M42 48.4C66 47.6 104 46.2 130 44.8', '#5A707C', 1.1)
        + det(line('M44 52C66 51.6 100 49.8 124 46.6', '#6E828C', 0.8)),
      head: line('M33 30C38 36 38 46 32.5 52.5', K, 1.6)
        + line('M6.6 42L11 43.2', K, 1.5)
        + det(line('M10 35.4C16 32.6 24 31 32 30.4', '#4E6470', 0.9) + `<circle cx="9.6" cy="39" r="0.7" fill="${K}"/>`),
      eye: [17, 39.5, 3.8],
      front: fin('M38 38.5C46 34.5 56 37 60 44C52 46 42 44.5 38 41.5Z', fc, rc, [39, 39.5, 39, 41], [58, 39, 59, 44], 3),
    };
  },

  // Bagre amarillo: amarillo con manchas redondas, espinas marcadas en dorsal y pectoral.
  'bagre-amarillo'() {
    const fc = '#E3B93E';
    const rc = '#8A6408';
    const sp = '#3A2C0A';
    const row = (xs, y, r) => xs.map((x, i) => blob(x, y + (i % 2 ? 1.2 : -0.6), r, r, 0, sp)).join('');
    return {
      id: 'bagre-amarillo', base: '#D9A520', lomo: '#8A6408', belly: '#F8E9A8', kL: 6, kB: 7,
      end: [128, 35, 45],
      open: 'M128 45C110 51 88 57 62 57C42 57 26 54.5 16.5 49.5C12 47 12 42.5 15 39.5C24 31.5 38 24.5 56 21.5C76 22 104 29 128 35',
      back: barbel('M15.5 42C10 37 6 30 4.5 21', 1.8)
        + forkTail(126, 35, 45, 155, 17, 64, 138, fc, rc)
        + fin('M55 23L60 4C69 9 76 18 79 26Z', fc, rc, [60, 22, 77, 25], [62, 8, 79, 25], 4)
        + fin('M88 27C96 19 110 22 119 33L117 35Z', fc)
        + fin('M72 57C73 66 80 70 87 67C85 61 81 57 78 55Z', fc, rc, [74, 58, 78, 57], [78, 68, 87, 66], 3)
        + fin('M98 54C99 64 107 68 115 63C114 58 112 53 110 51Z', fc, rc, [100, 55, 110, 53], [104, 66, 115, 62], 4),
      pattern: row([50, 62, 74, 86, 98, 110, 121], 33.5, 2.5) + row([56, 68, 80, 92, 104, 116], 41, 2.5)
        + row([50, 62, 74, 86, 98, 110], 48, 2.1)
        + det(line('M46 44.5C70 44 100 43 128 40.6', '#8A6408', 0.8)),
      head: line('M41 28C46.5 35 46.5 46 40 53.5', K, 1.6)
        + line('M13.6 45.4C16 47.4 20 47.8 23.6 46.8', K, 1.5)
        + det(`<circle cx="16.6" cy="41" r="0.8" fill="${K}"/>`),
      eye: [26.5, 37.5, 3.2, '#FFF3C4'],
      front: line('M56.2 21.5L60.4 4.6', K, 2.8)
        + fin('M38 53L56 66C50 69 42 64 37.5 56Z', fc, rc, [40, 55, 42, 59], [55, 66, 50, 67], 3)
        + line('M38 53L56 66', K, 2.6)
        + barbel('M16.5 45.5C26 56 46 64 72 67', 1.9)
        + barbel('M18.5 50.5C19.5 56 22 61 27 65', 1.5) + barbel('M22.5 52.5C24.5 57 28.5 61 34.5 63.5', 1.5),
    };
  },

  // Patí: hocico largo y chato, bigotes larguísimos, cola muy ahorquillada, puntitos en el lomo.
  pati() {
    const fc = '#B0BBC2';
    const rc = '#56646E';
    const sp = '#2C363D';
    const dots = (pts) => pts.map(([x, y]) => blob(x, y, 1.15, 1.15, 0, sp)).join('');
    return {
      id: 'pati', base: '#9AA7B0', lomo: '#56646E', belly: '#F2F4F4', kL: 5, kB: 6,
      end: [130, 36, 44],
      open: 'M130 44C112 50 90 55 66 55C44 55 26 52.5 12 48C6.5 46 6.5 42.5 10.5 40.5C24 34.5 40 28.5 60 26.5C84 25.5 110 30 130 36',
      back: barbel('M10 43.5C6 38 4 30 4.5 20', 1.8)
        + forkTail(128, 36, 44, 157, 13, 67, 137, fc, rc)
        + fin('M58 28L64 8C72 13 78 21 81 28Z', fc, rc, [61, 27, 79, 27], [65, 10, 81, 27], 5)
        + fin('M90 28C98 20 114 24 123 34L121 36Z', fc)
        + fin('M74 55C75 64 82 68 88 65C87 59 83 55 80 53Z', fc, rc, [76, 56, 80, 55], [80, 66, 88, 64], 3)
        + fin('M100 52C100 62 109 66 117 60C116 55 114 51 112 49Z', fc, rc, [102, 53, 112, 51], [105, 64, 117, 59], 5),
      pattern: dots([[40, 35.5], [48, 32.5], [56, 34.5], [64, 31], [72, 34], [80, 31.5], [88, 34.5], [96, 32.5], [104, 35.5], [112, 34.5], [120, 37.5], [46, 38.5], [60, 39], [76, 38.5], [92, 39], [108, 39.5]])
        + det(line('M46 43.5C70 42.5 100 41.5 130 40.4', '#56646E', 0.8)),
      head: line('M43 30.5C48 36 48 45 42 52', K, 1.6)
        + line('M8.6 45.6C12 47.2 17 47.4 22 46.2', K, 1.5)
        + det(`<circle cx="12.6" cy="42" r="0.8" fill="${K}"/>` + line('M16 39.6C24 36.4 32 33.8 40 32', '#56646E', 0.9)),
      eye: [26.5, 39.5, 2.9],
      front: fin('M40 51L57 62C52 65 44 61 39.5 54Z', fc, rc, [42, 53, 44, 57], [56, 62, 51, 63], 3)
        + line('M40 51L57 62', K, 2.2)
        + barbel('M11 46C30 60 66 70 110 66', 2)
        + barbel('M15 49.5C16 55 19 60 24 63.5', 1.5) + barbel('M19 51C21 56 25 59.5 31 62', 1.5),
    };
  },

  // Boga: tres manchas oscuras en el costado, boca chica, aletas anaranjadas.
  boga() {
    const fc = '#D67A1F';
    const rc = '#7A3E08';
    const sp = '#3E3E26';
    return {
      id: 'boga', base: '#B9B48E', lomo: '#6A6A44', belly: '#F3F0DA', kL: 7, kB: 8,
      end: [128, 34, 46],
      open: 'M128 46C112 53 92 61 68 61C44 61 22 55 10.5 46.5C6 43.5 6 40 9 37C20 27 40 20 62 20C88 20 110 27 128 34',
      back: forkTail(126, 34, 46, 155, 20, 61, 141, fc, rc)
        + fin('M62 22L68 5C76 9 83 17 86 25Z', fc, rc, [65, 21, 84, 24], [69, 6, 86, 24], 6)
        + fin('M107 28.5C110 23.5 115 23.5 118.5 27L116.5 31.5Z', fc)
        + fin('M64 60L67 72C72 70 75 66 75 61Z', fc, rc, [66, 61, 74, 61], [67, 71, 75, 65], 2)
        + fin('M98 57L101 70C108 67 114 60 117 52Z', fc, rc, [100, 58, 115, 53], [102, 69, 117, 53], 5),
      pattern: det(scales(42, 126, 26, 58, 8, 7, '#6A6A44', 0.7))
        + blob(58, 39.5, 5.4, 6, 0, sp) + blob(88, 40, 5.4, 6, 0, sp) + blob(119, 40, 5.4, 4.6, 0, sp),
      head: line('M35 25C41 33 41 46 34.5 54.5', K, 1.6)
        + line('M6.6 41.4L11.6 42.4', K, 1.5)
        + det(`<circle cx="10" cy="38" r="0.7" fill="${K}"/>`),
      eye: [19, 36.5, 3.8, '#F6E7A8'],
      front: fin('M36 52C39 60 46 64 53 62C50 57 44 53 40 51.5Z', fc, rc, [38, 53, 41, 52], [44, 63, 53, 61], 3),
    };
  },
};

export const FISH_ART = ['tararira', 'carpa', 'bagre', 'pejerrey', 'dientudo', 'mojarra', 'vieja', 'lisa', 'bagre-amarillo', 'pati', 'boga'];

export function fishArt(id, size = 160) {
  if (!Object.hasOwn(FISH, id)) return '';
  let inner = build(FISH[id]());
  if (size < 100) inner = inner.replace(/<g class="fish-detail">.*?<\/g>/g, '');
  return `<svg width="${size}" height="${Math.round(size / 2)}" viewBox="0 0 160 80" aria-hidden="true" focusable="false">${inner}</svg>`;
}
