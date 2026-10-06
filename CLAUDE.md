# Kit de Pesca — guía para Claude

- Leer primero `README.md` y `docs/spec.md`. La spec es la fuente de verdad: si algo no está ahí, preguntar o decidir y anotarlo en la spec.
- El usuario habla español (Argentina). Responderle siempre en español, también los resúmenes y lo que traen los agentes. Textos de la app en español; nombres internos del código en inglés.
- Sin framework, sin dependencias, sin paso de compilación. Pruebas del puntaje con `node --test`.
- Orden de trabajo y decisiones: sección "Decisiones para programar" de `docs/spec.md`.
- Estilo visual: Señal S7 (`design/mockups/S7-Final.dc.html`, íconos en `design/icons/`). Sin modo oscuro.
- No inventar datos: sin presión, el puntaje se recalcula sin presión; sin pronóstico, se dice que no hay.
- En Hábitat no recomendar lugares puntuales.
- Dibujos de nudos: seguir las reglas de "Control de cada dibujo de nudo" en `docs/spec.md`. Antes de mostrar un nudo: `node --test`, `node tools/nudos/cruces.mjs <id>` y el agente `revisor-nudos`.
