# Kit de Pesca — reglas para cualquier agente (Claude Code y ChatGPT)

Este proyecto lo trabajan dos agentes: **Claude Code** y **ChatGPT** (Codex / ChatGPT Work). Este archivo vale para los dos. Claude lo lee a través de `CLAUDE.md`; ChatGPT lo lee directo.

## Antes de empezar (siempre, en este orden)

1. `git checkout main && git pull` y crear la rama de la tarea desde ahí (ver "Ramas").
2. Leer `docs/equipo/tablero.md`: qué está haciendo el otro agente. **No tocar archivos de una tarea "En curso" del otro.**
3. Leer las últimas entradas de `docs/equipo/bitacora.md` y todo `docs/equipo/aprendizajes.md`.
4. Leer `README.md` y `docs/spec.md`. Para los dibujos de nudos, empezar por `docs/plan-nudos.md`. La spec es la fuente de verdad: si algo no está ahí, preguntar o decidir y anotarlo en la spec.
5. Anotar la tarea en el tablero como "En curso", con agente, rama y archivos que va a tocar, y hacer commit de eso solo, apenas se empieza (así el otro lo ve).

## Reglas del proyecto

- El usuario habla español (Argentina). Responderle siempre en español, también los resúmenes y lo que traen los agentes o subagentes. Textos de la app en español; nombres internos del código en inglés.
- Sin framework, sin dependencias, sin paso de compilación. Pruebas: `node --test`.
- Orden de trabajo y decisiones: sección "Decisiones para programar" de `docs/spec.md`.
- Estilo visual: Señal S7 (`design/mockups/S7-Final.dc.html`, íconos en `design/icons/`). Sin modo oscuro.
- No inventar datos: sin presión, el puntaje se recalcula sin presión; sin pronóstico, se dice que no hay.
- En Hábitat no recomendar lugares puntuales.
- Dibujos de nudos: seguir el "Proceso para dibujar un nudo" de `docs/spec.md` (referencia ilustrada en `docs/referencias-nudos.md`, tabla de cruces, 3D, `node --test`, una revisión independiente, prueba en la mano del usuario) y actualizar la tabla de estado.
- Los datos y las imágenes de referencia salen de `docs/fuentes/` (índice en `docs/fuentes/README.md`). Si se usa una fuente nueva, guardarla ahí y anotarla en el índice.

## Al terminar algo (obligatorio, sin que el usuario lo pida)

Cada vez que se termina algo (un nudo, una corrección, una regla nueva, la tabla de estado o el plan actualizados):

1. `node --test` tiene que pasar.
2. Agregar una entrada en `docs/equipo/bitacora.md` (arriba de todo).
3. Si hubo una corrección del usuario o un error propio, agregarlo a `docs/equipo/aprendizajes.md` y, si es una regla de dibujo, también en la spec y en el revisor (`.claude/agents/revisor-nudos.md`).
4. Pasar la tarea del tablero a "Hecho" (o dejar anotado qué falta).
5. Commit, push a la rama, pull request a `main` (con la plantilla) y unirlo enseguida (merge, sin squash). Antes de unir no puede haber conflictos con `main`: si hay, traer `main` a la rama, resolverlos y volver a correr `node --test`.

El usuario ya dio permiso para esto: no preguntarle cada vez. Así el chat siguiente, de cualquiera de los dos agentes, arranca con todo desde `main`.

## Ramas y commits

- Claude: ramas `claude/...`. ChatGPT: ramas `chatgpt/...` (o `codex/...` si la herramienta la pone sola).
- Una tarea, una rama, un pull request chico. Unirlo apenas está listo: las ramas largas son las que generan conflictos.
- En el mensaje de commit, la última línea dice quién lo hizo: `Agente: Claude` o `Agente: ChatGPT`.
- Nunca reescribir la historia de `main` ni de la rama del otro (nada de `push --force` ahí).

## Cómo no pisarse

- Archivos "de a uno" (los toca un solo agente por vez, según el tablero): `js/drawings/knots.js`, `js/drawings/knot3d.js`, `js/data/knots.js`, `test/knots-crossings.test.js`, `sw.js` (la `VERSION`), `docs/spec.md` (tabla de estado) y `docs/plan-nudos.md`.
- Archivos "de todos" (cualquiera agrega, nunca borra lo del otro): `docs/equipo/bitacora.md`, `docs/equipo/aprendizajes.md`, `docs/equipo/tablero.md`. Se escribe agregando entradas; si hay conflicto, quedarse con las dos.
- Si una tarea del tablero lleva más de 2 días "En curso" sin bitácora, preguntar al usuario antes de tomarla.
- Cada agente puede revisar el trabajo del otro: es la revisión independiente más útil (ver `docs/equipo/herramientas.md`).

## Dónde está cada cosa de la coordinación

| Archivo | Para qué |
| --- | --- |
| `docs/equipo/tablero.md` | Qué hay para hacer, qué está en curso y quién lo tiene |
| `docs/equipo/bitacora.md` | Qué hizo cada agente en cada sesión, con su pull request |
| `docs/equipo/aprendizajes.md` | Correcciones del usuario y errores, convertidos en reglas |
| `docs/equipo/herramientas.md` | Qué herramientas se usan, cómo instalarlas y qué puede usar cada agente |
| `docs/fuentes/README.md` | Índice de documentos e imágenes de donde sacar datos |
| `.github/pull_request_template.md` | Plantilla de cada pull request |
