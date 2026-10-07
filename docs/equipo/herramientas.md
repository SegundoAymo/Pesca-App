# Herramientas

Qué se usa en el proyecto, cómo instalarlo y qué puede usar cada agente.

## Para la app (lo único que necesita la app)

| Herramienta | Para qué | Cómo |
|---|---|---|
| Node 20 o más nuevo | Pruebas | `node --test` (sin instalar nada: no hay dependencias) |
| Python 3 | Servidor local para probar la app | `python3 -m http.server 8000` y abrir http://localhost:8000 |
| GitHub Actions | Pruebas en cada pull request y publicación en GitHub Pages al unir a `main` | `.github/workflows/pages.yml` |
| Chrome para Android | Instalar la app y probar GPS y modo sin conexión | "Instalar app" |
| Open-Meteo | Clima y presión (sin clave) | `js/weather-service.js` |

No se agregan frameworks, paquetes de npm ni pasos de compilación (`AGENTS.md`).

## Para dibujar y revisar nudos (solo desarrollo)

| Herramienta | Para qué | Cómo |
|---|---|---|
| Playwright + Chromium, instalado global con npm | Hacer las imágenes de los pasos | `npm i -g playwright && npx playwright install chromium` (en Claude ya viene) |
| `tools/nudos/chequeo.mjs` | Problemas de dibujo de un nudo | `node tools/nudos/chequeo.mjs <id> > /dev/null` |
| `tools/nudos/pasos.mjs` | Pasos en grande mientras se dibuja | `node tools/nudos/pasos.mjs <id> [pasos]` → `tools/nudos/salida/pasos.png` |
| `tools/nudos/hoja.mjs` | Hoja completa del nudo, la que se le muestra al usuario | `node tools/nudos/hoja.mjs <id>` → `tools/nudos/salida/<id>.png` |
| `tools/nudos/cruces.mjs` | Qué tramo va encima en cada cruce | `node tools/nudos/cruces.mjs <id>` |
| poppler-utils (`pdftoppm`) | Ver una página de las guías en PDF | `pdftoppm -r 110 -f <pág> -l <pág> -png <pdf> <salida>` |
| Python 3 | Simulación con la que se calibró el puntaje | `tools/simulacion/` |

`tools/nudos/salida/` no se sube al repo (está en `.gitignore`).

## Qué puede usar cada agente

| Cosa | Claude Code | ChatGPT (Codex / Work) |
|---|---|---|
| Leer y escribir el repo, correr `node --test`, abrir pull requests | Sí | Sí |
| Ver imágenes (hojas de nudos, páginas de PDF) | Sí | Sí, si su entorno puede leer imágenes; si no, pedirle al usuario que las mire |
| Subagente `revisor-nudos` | Sí (`.claude/agents/revisor-nudos.md`) | No como subagente: usar ese archivo como lista de control, o pedir la revisión a Claude |
| Artifacts de claude.ai (spec viva, lienzo de diseños) | Sí | No: solo ve las copias del repo. Por eso el repo es la fuente de verdad |
| Google Drive del usuario | Sí, con el conector | Según los conectores que tenga configurados |

## Configurar el entorno de ChatGPT (Codex)

En la configuración del entorno del repositorio:

- Imagen con Node 20 o más nuevo y Python 3.
- Script de preparación (opcional, solo para dibujar nudos):
  ```
  apt-get update && apt-get install -y poppler-utils
  npm i -g playwright && npx playwright install --with-deps chromium
  ```
- Prueba que tiene que pasar: `node --test`.
- Acceso a internet: activarlo si va a buscar fuentes nuevas (por ejemplo, el FG o lo del nylon).

## Revisión cruzada

Lo más útil de tener dos agentes es que cada uno revise lo del otro sin saber qué se quiso hacer:

- Nudo dibujado por ChatGPT → pedirle a Claude que lo revise con `revisor-nudos`.
- Nudo dibujado por Claude → pedirle a ChatGPT que lo revise siguiendo `.claude/agents/revisor-nudos.md`.
- Lo que encuentre la revisión, si es un error que se repite, va a `docs/equipo/aprendizajes.md`.
