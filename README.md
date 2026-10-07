# Kit de Pesca

App para el teléfono (PWA, Android) para pescar en la laguna de Navarro y alrededores: Clima, Calendario de pique, Peces, Nudos y Checklist.

**Estado:** primera versión de la app programada (las 6 pantallas, con los dibujos de nudos y armados). Falta probarla en el teléfono y publicarla.

## Probarla en la computadora

Hace falta un servidor local (los módulos de JavaScript no cargan abriendo el archivo directo):

```
python3 -m http.server 8000
```

y abrir http://localhost:8000. Pruebas de la lógica: `node --test` (Node 20 o más nuevo, sin instalar nada).

## Publicarla en GitHub Pages

1. Unir esta rama a `main`.
2. En GitHub: Settings → Pages → Source: **GitHub Actions**.
3. Cada push a `main` corre las pruebas y publica la app (`.github/workflows/pages.yml`).
4. En el teléfono, abrir la dirección en Chrome y tocar **Instalar app**.

Al subir una versión nueva, cambiar `VERSION` en `sw.js` para que los teléfonos la bajen; la app muestra "Hay una versión nueva: tocar para actualizar".

## Dónde está cada cosa

| Carpeta / archivo | Qué hay |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | Reglas para los dos agentes (Claude y ChatGPT): cómo empezar, cómo terminar, cómo no pisarse. |
| [`docs/equipo/`](docs/equipo) | Coordinación: tablero de tareas, bitácora de lo que hizo cada agente, aprendizajes y herramientas. |
| [`docs/fuentes/`](docs/fuentes) | Documentos e imágenes de referencia, con índice. `entrada/` es la bandeja para subir lo nuevo. |
| [`docs/spec.md`](docs/spec.md) | Especificación completa: pantallas, Calendario, Clima, modelo de puntaje, arquitectura, decisiones y orden de trabajo. **Empezar por acá.** |
| [`docs/fichas.md`](docs/fichas.md) | Fichas de las 11 especies (carnadas, hábitat, equipo, tips, vedas). |
| [`docs/nudos.md`](docs/nudos.md) | 18 nudos y 3 armados de plomada, clasificados en 9 situaciones, con pasos. |
| [`docs/armados.md`](docs/armados.md) | 8 armados de línea para tararira, bagre y carpa, glosario y lista de compras. |
| [`design/mockups/`](design/mockups) | Todas las muestras de diseño (calendario A–F6, Inicio, Calendario, Clima, estilos, variantes S1–S7, catálogo de íconos). |
| [`design/icons/`](design/icons) | Íconos elegidos en SVG (Clima, Calendario, Peces, Nudos, Checklist) y el ícono de la app. |
| [`docs/kit.md`](docs/kit.md) | El Kit original (equipo, señuelos, carnadas), del que salen varias fichas. |
| [`tools/simulacion/`](tools/simulacion) | Scripts de Python con los que se calibró el modelo de puntaje. |
| `index.html`, `css/`, `js/`, `fonts/`, `icons/`, `sw.js`, `manifest.webmanifest` | La app. |
| [`test/`](test) | Pruebas automáticas (`node --test`). |

## Código de la app

| Carpeta | Qué hay |
| --- | --- |
| `js/logic/` | Lógica sin pantalla: fechas, luna, temperatura del agua, presión, puntaje y resumen del clima. Con pruebas. |
| `js/data/` | Contenido: fichas de las 11 especies, nudos y armados. |
| `js/drawings/` | Dibujos de los pasos de los nudos y de los armados, hechos en código. |
| `js/screens/` | Una pantalla por archivo: inicio, calendario, clima, peces, nudos, checklist. |
| `js/app.js` | Navegación (por `#/` en la dirección) y aviso de versión nueva. |
| `js/weather-service.js` | Ubicación, búsqueda de lugares y pronóstico de Open-Meteo, guardado en el teléfono. |

## Versiones en claude.ai

Desde el 7 de octubre de 2026 **la fuente de verdad es el repositorio**: ChatGPT también trabaja en el proyecto y no puede abrir los artifacts de claude.ai. Estas versiones quedan como referencia:

- Spec (con pestañas Fichas, Nudos y Armados): https://claude.ai/code/artifact/7a4393ec-ede8-4ac3-bdcc-4daae4a87f87
- Lienzo de diseños: https://claude.ai/artifact/SFLVG9zwdgi5i9Yx82bRs1

Si se cambia algo en el doc o en el lienzo, exportarlo acá en la misma tarea.

## Decisiones clave (resumen)

- **Estilo:** Señal, formato S7 — negro `#0B0B0B`, blanco, amarillo `#FFC400`, rojo de alerta `#C8102E`. Letras Barlow Semi Condensed (600/800) y Barlow (500/700). Inicio: una columna de 5 botones grandes, Clima primero y en amarillo. Ver [`design/mockups/S7-Final.dc.html`](design/mockups/S7-Final.dc.html).
- **Calendario:** diseño F6 (fondo del mejor pez + días sin pez apagados), piso 70. Colores: tararira `#C2410C`, carpa `#0F766E`, bagre `#3730A3`.
- **Puntaje:** temporada / luna / presión con pesos por especie (tararira 35/45/20, carpa 30/20/50, bagre 15/65/20) y compuerta de frío. Detalle completo en la spec.
- **Técnica:** HTML, CSS y JavaScript simple (módulos ES), sin framework ni compilación; Open-Meteo para clima y presión; Service Worker para uso sin conexión; GitHub Pages.
