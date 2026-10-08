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

## 2026-10-08 — ChatGPT — Ajustar muestras según feedback
- Rama y pull request: `chatgpt/ajustar-muestras-pesca`, [PR #20](https://github.com/SegundoAymo/Pesca-App/pull/20).
- Qué se hizo: se registraron primero las nuevas decisiones de diseño; se enlazaron Inicio, Calendario, Clima, tutorial y Checklist a vistas de la app actual; se simplificó el detalle de especie, se agruparon capturas por especie y se conservaron etiquetas breves para elegir nudos. La galería quedó en 12 pantallas y se actualizó README y aprendizajes.
- Pruebas: no ejecutadas localmente; cambios de diseño y documentación. El workflow publica con pruebas automáticas.
- Qué quedó pendiente o a medias: confirmar la galería tras el despliegue de Pages.
- Para el próximo: promedios no respaldados y máximos ausentes no se muestran; los detalles de fuentes quedan en la documentación, no en la interfaz.

## 2026-10-08 — ChatGPT — Publicar prototipo visual sin reemplazar la app
- Rama y pull request: `chatgpt/publicar-muestra-pantallas`, [PR #19](https://github.com/SegundoAymo/Pesca-App/pull/19).
- Qué se hizo: se configuró GitHub Pages para copiar el prototipo a `/muestras/`, conservando la app y su entrada en la raíz.
- Pruebas: no ejecutadas localmente; el workflow de publicación ya ejecuta `node --test` antes del despliegue.
- Qué quedó pendiente o a medias: confirmar el despliegue de Pages tras integrar el PR.
- Para el próximo: usar la ruta `/muestras/` para abrir el prototipo; la app sigue en la raíz.

## 2026-10-08 — ChatGPT — Muestras navegables de pantallas
- Rama y pull request: `chatgpt/muestras-pantallas-pesca`, PR #18.
- Qué se hizo: prototipo HTML navegable con 14 pantallas/estados, navegación principal, catálogo de cuatro especies prioritarias, registro opcional de capturas, estados vacíos, clima de demostración y créditos de imágenes. Incluye datos con alcance explícito y ejemplos ficticios marcados.
- Pruebas: no ejecutadas; artefacto de diseño sin cambios de código de la app.
- Qué quedó pendiente o a medias: validar el recorrido y la comprensión con pescadores; el prototipo es una referencia, no una implementación.
- Para el próximo: usar junto con `docs/plan-diseno-pantallas.md`; reemplazar los datos de demostración solo con fuentes y alcance corroborados.

## 2026-10-08 — ChatGPT — Planificar pantallas y navegación
- Rama y pull request: `chatgpt/plan-muestras-pantallas`, [PR #17](https://github.com/SegundoAymo/Pesca-App/pull/17).
- Qué se hizo: antes de dibujar se definieron propósito, cuatro destinos principales, recorrido, 14 pantallas/estados, uso separado de datos reales y ficticios, créditos de imágenes, privacidad y criterios de revisión. El plan quedó escrito en `docs/plan-diseno-pantallas.md`.
- Pruebas: no ejecutadas; cambio documental, sin cambios de código.
- Qué quedó pendiente o a medias: producir muestras navegables basadas en este plan.
- Para el próximo: consultar el plan publicado antes de hacer la primera muestra; no mostrar las cifras generales como medidas de Navarro.

## 2026-10-08 — ChatGPT — Relevamiento de especies prioritarias
- Rama y pull request: `chatgpt/relevamiento-especies-prioritarias`, [PR #16](https://github.com/SegundoAymo/Pesca-App/pull/16).
- Qué se hizo: se documentó la evidencia de presencia local/regional, taxonomía, tamaños disponibles y límites de los datos para tararira, carpa, bagre sapo y pejerrey. Se propuso cómo presentar medias y máximos sin atribuir cifras de cuenca u otras lagunas a Navarro; se indexó el informe y sus fuentes.
- Pruebas: no ejecutadas; cambio documental, sin cambios de código.
- Qué quedó pendiente o a medias: no hay medias locales confiables; falta una nueva etapa sobre carnadas/técnicas, normativa vigente y prueba visual con pescadores.
- Para el próximo: mantener “bagre” separado de “bagre amarillo”; revisar los nombres científicos (*Hoplias argentinensis* / *H. malabaricus*, *Rhamdia quelen* / *R. sapo*) y rotular con claridad los datos regionales.

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
