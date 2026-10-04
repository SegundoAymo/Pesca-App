# Kit de Pesca

App para el teléfono (PWA, Android) para pescar en la laguna de Navarro y alrededores: Clima, Calendario de pique, Peces, Nudos y Checklist.

**Estado:** diseño y especificación terminados. Todavía no hay código de la app.

## Dónde está cada cosa

| Carpeta / archivo | Qué hay |
| --- | --- |
| [`docs/spec.md`](docs/spec.md) | Especificación completa: pantallas, Calendario, Clima, modelo de puntaje, arquitectura, decisiones y orden de trabajo. **Empezar por acá.** |
| [`docs/fichas.md`](docs/fichas.md) | Fichas de las 11 especies (carnadas, hábitat, equipo, tips, vedas). |
| [`docs/nudos.md`](docs/nudos.md) | 18 nudos y 3 armados de plomada, clasificados en 9 situaciones, con pasos. |
| [`docs/armados.md`](docs/armados.md) | 8 armados de línea para tararira, bagre y carpa, glosario y lista de compras. |
| [`design/mockups/`](design/mockups) | Todas las muestras de diseño (calendario A–F6, Inicio, Calendario, Clima, estilos, variantes S1–S7, catálogo de íconos). |
| [`design/icons/`](design/icons) | Íconos elegidos en SVG (Clima, Calendario, Peces, Nudos, Checklist) y el ícono de la app. |
| [`tools/simulacion/`](tools/simulacion) | Scripts de Python con los que se calibró el modelo de puntaje. |

## Versiones vivas (fuente de verdad)

Los archivos de `docs/` y `design/` son copias exportadas. Las versiones que se siguen editando están en:

- Spec (con pestañas Fichas, Nudos y Armados): https://claude.ai/code/artifact/7a4393ec-ede8-4ac3-bdcc-4daae4a87f87
- Lienzo de diseños: https://claude.ai/artifact/SFLVG9zwdgi5i9Yx82bRs1

Si se cambia algo en el doc o en el lienzo, volver a exportarlo acá para que los demás chats lo vean.

## Decisiones clave (resumen)

- **Estilo:** Señal, formato S7 — negro `#0B0B0B`, blanco, amarillo `#FFC400`, rojo de alerta `#C8102E`. Letras Barlow Semi Condensed (600/800) y Barlow (500/700). Inicio: una columna de 5 botones grandes, Clima primero y en amarillo. Ver [`design/mockups/S7-Final.dc.html`](design/mockups/S7-Final.dc.html).
- **Calendario:** diseño F6 (fondo del mejor pez + días sin pez apagados), piso 70. Colores: tararira `#C2410C`, carpa `#0F766E`, bagre `#3730A3`.
- **Puntaje:** temporada / luna / presión con pesos por especie (tararira 35/45/20, carpa 30/20/50, bagre 15/65/20) y compuerta de frío. Detalle completo en la spec.
- **Técnica:** HTML, CSS y JavaScript simple (módulos ES), sin framework ni compilación; Open-Meteo para clima y presión; Service Worker para uso sin conexión; GitHub Pages.
