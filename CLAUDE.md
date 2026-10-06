# Kit de Pesca — guía para Claude

- Leer primero `README.md` y `docs/spec.md`. Para los dibujos de nudos, empezar por `docs/plan-nudos.md` (estado, lo que sigue, cómo quiere trabajar el usuario y dónde están las guías en PDF). La spec es la fuente de verdad: si algo no está ahí, preguntar o decidir y anotarlo en la spec.
- El usuario habla español (Argentina). Responderle siempre en español, también los resúmenes y lo que traen los agentes. Textos de la app en español; nombres internos del código en inglés.
- Sin framework, sin dependencias, sin paso de compilación. Pruebas del puntaje con `node --test`.
- Orden de trabajo y decisiones: sección "Decisiones para programar" de `docs/spec.md`.
- Estilo visual: Señal S7 (`design/mockups/S7-Final.dc.html`, íconos en `design/icons/`). Sin modo oscuro.
- No inventar datos: sin presión, el puntaje se recalcula sin presión; sin pronóstico, se dice que no hay.
- En Hábitat no recomendar lugares puntuales.
- Dibujos de nudos: seguir el "Proceso para dibujar un nudo" de `docs/spec.md` (referencia ilustrada en `docs/referencias-nudos.md`, tabla de cruces, 3D, `node --test`, una revisión con `revisor-nudos`, prueba en la mano del usuario) y actualizar la tabla de estado.
