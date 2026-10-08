# Tablero de tareas

Quién hace qué. Lo leen y lo escriben los dos agentes (Claude y ChatGPT). Reglas en `AGENTS.md`.

- Al **tomar** una tarea: moverla a "En curso" con agente, rama, fecha y archivos que va a tocar, y hacer commit de ese cambio solo, enseguida.
- Al **terminar**: moverla a "Hecho" con el número de pull request.
- Si una tarea "En curso" es del otro agente, no tocar sus archivos. Si lleva más de 2 días sin movimiento en la bitácora, preguntarle al usuario.
- El orden de "Para hacer" es el que pidió el usuario: tomar la primera libre salvo que el usuario diga otra cosa.

## En curso

| Tarea | Agente | Rama | Desde | Archivos que toca |
|---|---|---|---|---|
| Planificar navegación y muestras de pantallas | ChatGPT | `chatgpt/plan-muestras-pantallas` | 2026-10-08 | `docs/plan-diseno-pantallas.md`, `docs/equipo/tablero.md`, `docs/equipo/bitacora.md` |

## Para hacer (en este orden)

Detalle de cada nudo en `docs/plan-nudos.md`, "Lo que sigue" y "Correcciones pedidas por el usuario".

| # | Tarea | Referencia | Nota |
|---|---|---|---|
| 1 | Nudo Cirujano: corregir | guía A p. 4, Wilson p. 45, explicación del usuario | Qué extremo de la naranja pasa por el lazo |
| 2 | Nudo Snell: rehacer | imagen n1 | Copiar su disposición |
| 3 | Nudo Albright | imagen n3, Wilson p. 25 | 5 vueltas de ida y 5 de vuelta |
| 4 | Nudo Rapala | imagen n2 | 6 pasos como la imagen |
| 5 | Tope corredizo | imagen n6 | Forma fácil; buscar si sirve el nylon |
| 6 | Nudo Bimini | imagen n5 | 8 pasos como la imagen |
| 7 | Nudo FG | imagen n4 | Faltan los pasos 1 a 3 |
| 8 | Haywire | Wilson p. 69 | Acero gris azulado |
| 9 | Manguito (crimp) | Wilson p. 64 | Manguito en bronce |
| 10 | Armados al sistema nuevo | `docs/armados.md` | Emerillón en bronce, brazolada de acero |
| 11 | Probar la app en el teléfono y publicarla | `README.md` | GitHub Pages |

## Esperando al usuario

| Qué | Desde |
|---|---|
| Atar en la mano: carrete, palomar, clinch, uni, snell, cirujano, doble uni, lazo de cirujano, brazolada y sangre, y decir si aguantan | 2026-10-06 |
| Pasos 1 a 3 del FG (o permiso para buscarlos) | 2026-10-07 |

## Hecho

| Tarea | Agente | Pull request | Fecha |
|---|---|---|---|
| Coordinación Claude + ChatGPT (este tablero, bitácora, aprendizajes, herramientas, fuentes) | Claude | ver bitácora | 2026-10-07 |
| Plan de investigación y verificación de contenidos para la app | ChatGPT | [#12](https://github.com/SegundoAymo/Pesca-App/pull/12) | 2026-10-07 |
| Replantear investigación según necesidades del pescador y diseño visual | ChatGPT | [#13](https://github.com/SegundoAymo/Pesca-App/pull/13) | 2026-10-07 |
| Incorporar catálogo tipo Pokédex y registro opcional de capturas | ChatGPT | [#14](https://github.com/SegundoAymo/Pesca-App/pull/14) | 2026-10-08 |
| Registrar Pesca Argentina como fuente de especies | ChatGPT | [#15](https://github.com/SegundoAymo/Pesca-App/pull/15) | 2026-10-08 |
| Relevamiento inicial de especies prioritarias y medidas para la Pokédex | ChatGPT | [#16](https://github.com/SegundoAymo/Pesca-App/pull/16) | 2026-10-08 |
