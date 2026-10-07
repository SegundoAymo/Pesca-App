# Bitácora

Qué hizo cada agente, una entrada por sesión o por pull request, **la más nueva arriba**. Se agrega, nunca se borra lo del otro.

Formato de cada entrada:

```
## AAAA-MM-DD — Agente (Claude / ChatGPT) — título corto
- Rama y pull request:
- Qué se hizo:
- Pruebas: `node --test` (resultado)
- Qué quedó pendiente o a medias:
- Para el próximo (lo que conviene saber antes de seguir):
```

---

## 2026-10-07 — ChatGPT — Plan de investigación y verificación de contenidos
- Rama y pull request: `chatgpt/plan-investigacion-pesca`, [PR #12](https://github.com/SegundoAymo/Pesca-App/pull/12).
- Qué se hizo: se agregó `docs/plan-investigacion-pesca.md` con alcance, tareas pequeñas, criterios de cierre y controles de fuentes para especies, señuelos, condiciones y futura referencia de diseño. Se enlazó desde `README.md`. No se modificó código ni contenido de la app.
- Pruebas: `node --test` se ejecuta mediante GitHub Actions en el pull request; resultado pendiente.
- Qué quedó pendiente o a medias: ejecutar la investigación siguiendo las tareas del plan; el plan no agrega información nueva a la app.
- Para el próximo: antes de empezar, leer `AGENTS.md`, el tablero y este plan. Mantener el alcance local y dejar las tareas abiertas hasta cumplir sus criterios.

## 2026-10-07 — Claude — Coordinación con ChatGPT
- Rama y pull request: `claude/tender-carson-p5xf7z`.
- Qué se hizo: `AGENTS.md` con las reglas comunes (Claude lo lee desde `CLAUDE.md`); carpeta `docs/equipo/` con tablero, bitácora, aprendizajes y herramientas; índice de fuentes `docs/fuentes/README.md` con carpetas `entrada/` e `imagenes/`; plantilla de pull request. El repo pasa a ser la fuente de verdad (ChatGPT no puede abrir los artifacts de claude.ai).
- Pruebas: `node --test` pasa.
- Pendiente: nada de esta tarea. Los nudos siguen en el orden del tablero.
- Para el próximo: leer `AGENTS.md` primero.

## 2026-10-04 a 2026-10-07 — Claude — Historia anterior (resumen)
- Pull requests 1 a 10, unidos a `main`.
- App programada con las 6 pantallas, puntaje con pruebas y publicación en GitHub Pages.
- Nudos rehechos en 3D y revisados: Lazo perfecto, Carrete, Palomar, Clinch mejorado, Uni, Snell, Cirujano, Doble uni, Lazo de cirujano, Brazolada y Sangre. Lista `REDRAWN` y "Dibujo nuevo" en la app.
- Correcciones del usuario del 7/10 anotadas en `docs/plan-nudos.md`, sin tocar los dibujos.
- Detalle completo: `git log`.
