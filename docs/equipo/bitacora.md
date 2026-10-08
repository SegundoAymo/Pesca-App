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

## 2026-10-08 — ChatGPT — Registro de Pesca Argentina como fuente
- Rama y pull request: `chatgpt/indice-pesca-argentina`, [PR #15](https://github.com/SegundoAymo/Pesca-App/pull/15).
- Qué se hizo: se comprobó acceso al índice general y a fichas de Pejerrey, Carpa y Tararira; se añadió el portal al índice de fuentes con su alcance y límites. Contiene fichas enlazadas para más de 40 especies con información descriptiva, distribución/localidades, medidas, modalidades, carnadas y temporadas.
- Pruebas: no ejecutadas; cambio documental, sin cambios de código.
- Qué quedó pendiente o a medias: verificar cada dato que se use con fuentes científicas u oficiales y fuentes pertinentes a Navarro.
- Para el próximo: tratar el sitio como referencia exploratoria/editorial; en especial, no usar sus datos generales como cifras locales ni como normativa vigente sin corroboración.



## 2026-10-08 — ChatGPT — Pokédex y registro opcional de capturas
- Rama y pull request: `chatgpt/pokedex-registro-capturas`, [PR #14](https://github.com/SegundoAymo/Pesca-App/pull/14).
- Qué se hizo: se anotó en la spec el catálogo de peces visual y lúdico tipo Pokédex, la preferencia por largo/peso medios y máximos con fuente y alcance, y el registro personal con foto, ubicación, especie, largo y peso opcionales. El plan quedó dividido en tareas de investigación, privacidad y prueba de uso.
- Pruebas: no ejecutadas; cambio solo documental, sin cambios de código.
- Qué quedó pendiente o a medias: investigar medidas confiables por especie y preparar bocetos para validar antes de programar.
- Para el próximo: diferenciar máximo científico, récord y máximo observado; no mezclar registros personales con estadísticas de especie; todos los campos de captura deben seguir siendo opcionales.

## 2026-10-07 — ChatGPT — Replanteo de la investigación desde el uso y lo visual
- Rama y pull request: `chatgpt/reencuadrar-contenido-pesca`, [PR #13](https://github.com/SegundoAymo/Pesca-App/pull/13).
- Qué se hizo: se reemplazó el plan extenso de especies y señuelos por pasos pequeños orientados a decisiones del pescador: qué especie intentar, qué elegir del kit, cómo armarlo y qué condición mirar. Se definieron prioridades locales, vista rápida de hasta 35 palabras, detalle ampliado, iconos rotulados, diagramas, permisos de imagen y prueba exploratoria de comprensión. Sin cambios de código ni nuevas recomendaciones.
- Pruebas: `node --test` pendiente de GitHub Actions.
- Qué quedó pendiente o a medias: realizar la investigación y validar la muestra visual con pescadores locales.
- Para el próximo: comenzar por la pantalla y decisiones actuales; no implementar contenido nuevo hasta una decisión posterior del usuario. El límite de 35 palabras es una hipótesis de diseño que debe validarse.

## 2026-10-07 — ChatGPT — Plan de investigación y verificación de contenidos
- Rama y pull request: `chatgpt/plan-investigacion-pesca`, [PR #12](https://github.com/SegundoAymo/Pesca-App/pull/12).
- Qué se hizo: se agregó `docs/plan-investigacion-pesca.md` con alcance, tareas pequeñas, criterios de cierre y controles de fuentes para especies, señuelos, condiciones y futura referencia de diseño. Se enlazó desde `README.md`. No se modificó código ni contenido de la app.
- Pruebas: `node --test` pasa en GitHub Actions (run 26).
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
