// Reportar un problema o pedir un cambio (pedido del usuario del 18/11/2026). No hay
// servidor: el reporte se arma acá y se manda como "issue" del repositorio en GitHub (lo
// leen los dos agentes que trabajan en la app), o se copia para mandarlo por otro lado.
import { screen, esc } from '../ui.js';
import { ICON } from '../icons.js';
import { APP_VERSION } from '../version.js';

export const ISSUES_URL = 'https://github.com/SegundoAymo/Pesca-App/issues/new';

/** Title and body of the report (pure, tested). */
export function buildReport({ kind, text, where, version = APP_VERSION, ua = '' }) {
  const label = kind === 'cambio' ? 'Pedido de cambio' : 'Problema';
  const first = String(text || '').trim().split('\n')[0].slice(0, 70);
  return {
    title: `${label}: ${first || '(sin título)'}`,
    body: `${String(text || '').trim()}\n\n---\nPantalla: ${where || 'Inicio'}\nVersión: ${version}${ua ? `\nTeléfono: ${ua}` : ''}\nEnviado desde la app (Reportar).`,
  };
}

export function reportUrl(r) {
  return `${ISSUES_URL}?title=${encodeURIComponent(r.title)}&body=${encodeURIComponent(r.body)}`;
}

export function render(params) {
  const where = params.length ? `#/${params.join('/')}` : '';
  const body = `
    <form class="catch-form" data-report>
      <div class="seg" role="radiogroup" aria-label="Tipo">
        <label class="seg-opt"><input type="radio" name="kind" value="problema" checked hidden><span>Algo anda mal</span></label>
        <label class="seg-opt"><input type="radio" name="kind" value="cambio" hidden><span>Quiero un cambio</span></label>
      </div>
      <label class="field"><span>Contalo con tus palabras</span><textarea class="input" name="text" rows="6" maxlength="3000" required placeholder="Qué pasó o qué te gustaría cambiar"></textarea></label>
      ${where ? `<p class="small muted">Se agrega la pantalla donde estabas (${esc(where)}) y la versión de la app (${APP_VERSION}).</p>` : `<p class="small muted">Se agrega la versión de la app (${APP_VERSION}).</p>`}
      <button type="submit" class="btn yellow block">Enviar por GitHub</button>
      <button type="button" class="btn white block" data-copy>Copiar el texto</button>
      <p class="small muted" data-msg aria-live="polite">Enviar por GitHub abre la página del proyecto con el reporte ya escrito: hace falta estar con tu cuenta de GitHub y tocar "Submit". Si no, copiá el texto y mandalo por mensaje.</p>
    </form>`;
  return {
    title: 'Reportar',
    html: screen('Reportar', body, 'Problemas y pedidos de cambio'),
    mount(root) {
      const f = root.querySelector('[data-report]');
      const sync = () => f.querySelectorAll('.seg-opt').forEach((l) => l.classList.toggle('on', l.querySelector('input').checked));
      f.addEventListener('change', sync);
      sync();
      const report = () => buildReport({ kind: f.kind.value, text: f.text.value, where, ua: navigator.userAgent });
      f.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!f.text.value.trim()) return;
        window.open(reportUrl(report()), '_blank', 'noopener');
      });
      root.querySelector('[data-copy]').addEventListener('click', async () => {
        const r = report();
        const msg = root.querySelector('[data-msg]');
        try {
          await navigator.clipboard.writeText(`${r.title}\n\n${r.body}`);
          msg.textContent = 'Copiado. Pegalo donde quieras mandarlo.';
        } catch {
          msg.textContent = 'No se pudo copiar: mantené apretado el texto para copiarlo a mano.';
        }
      });
      void ICON;
    },
  };
}
