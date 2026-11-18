// Elegir un punto en un mapa, sin librerías: mosaicos de OpenStreetMap en una grilla que se
// arrastra con el dedo, botones + y −, y una mira fija en el centro. Necesita conexión.
// Pedido del usuario del 18/11/2026 (Mis capturas: "que me deje marcar en el mapa").

const TILE = 256;
const TILES = 'https://tile.openstreetmap.org';

/** Lat/lon → world pixel at zoom z (Web Mercator). */
export function project(lat, lon, z) {
  const n = TILE * 2 ** z;
  const s = Math.sin((Math.max(-85, Math.min(85, lat)) * Math.PI) / 180);
  return { x: ((lon + 180) / 360) * n, y: (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n };
}

/** World pixel at zoom z → lat/lon. */
export function unproject(x, y, z) {
  const n = TILE * 2 ** z;
  const lon = (x / n) * 360 - 180;
  const m = Math.PI - (2 * Math.PI * y) / n;
  return { lat: (180 / Math.PI) * Math.atan(Math.sinh(m)), lon };
}

/**
 * Opens a full-screen map over the page. center: { lat, lon }. Resolves with { lat, lon }
 * when the person taps "Usar este punto", or null if they close it.
 */
export function pickOnMap(center, zoom = 14) {
  return new Promise((resolve) => {
    let z = zoom;
    let c = project(center.lat, center.lon, z);
    const el = document.createElement('div');
    el.className = 'mapper';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Marcar el lugar en el mapa');
    el.innerHTML = `<div class="mapper-top"><strong>Mové el mapa hasta que la mira quede en el lugar</strong><button type="button" class="back" data-close aria-label="Cerrar">✕</button></div>
      <div class="mapper-map" data-map><div class="mapper-tiles" data-tiles></div><div class="mapper-cross" aria-hidden="true"></div>
        <div class="mapper-zoom"><button type="button" data-z="1" aria-label="Acercar">+</button><button type="button" data-z="-1" aria-label="Alejar">−</button></div>
        <p class="mapper-credit">© colaboradores de OpenStreetMap</p></div>
      <p class="small muted mapper-note">Hace falta conexión para ver el mapa.</p>
      <button type="button" class="btn yellow block" data-ok>Usar este punto</button>`;
    document.body.appendChild(el);
    document.body.classList.add('zoomed');
    const map = el.querySelector('[data-map]');
    const tiles = el.querySelector('[data-tiles]');
    const draw = () => {
      const w = map.clientWidth;
      const h = map.clientHeight;
      const x0 = c.x - w / 2;
      const y0 = c.y - h / 2;
      const max = 2 ** z;
      let html = '';
      for (let tx = Math.floor(x0 / TILE); tx <= Math.floor((x0 + w) / TILE); tx++) {
        for (let ty = Math.floor(y0 / TILE); ty <= Math.floor((y0 + h) / TILE); ty++) {
          if (ty < 0 || ty >= max) continue;
          const wx = ((tx % max) + max) % max;
          html += `<img alt="" draggable="false" src="${TILES}/${z}/${wx}/${ty}.png" style="left:${tx * TILE - x0}px;top:${ty * TILE - y0}px">`;
        }
      }
      tiles.innerHTML = html;
    };
    let drag = null;
    map.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; drag = { x: e.clientX, y: e.clientY, c: { ...c } }; map.setPointerCapture(e.pointerId); });
    map.addEventListener('pointermove', (e) => { if (!drag) return; c = { x: drag.c.x - (e.clientX - drag.x), y: drag.c.y - (e.clientY - drag.y) }; draw(); });
    map.addEventListener('pointerup', () => { drag = null; });
    el.querySelectorAll('[data-z]').forEach((b) => b.addEventListener('click', () => {
      const nz = Math.max(3, Math.min(18, z + Number(b.dataset.z)));
      const ll = unproject(c.x, c.y, z);
      z = nz;
      c = project(ll.lat, ll.lon, z);
      draw();
    }));
    const done = (value) => { el.remove(); document.body.classList.remove('zoomed'); resolve(value); };
    el.querySelector('[data-close]').addEventListener('click', () => done(null));
    el.querySelector('[data-ok]').addEventListener('click', () => done(unproject(c.x, c.y, z)));
    requestAnimationFrame(draw);
  });
}
