# Plan de los dibujos de nudos — empezar acá

Este archivo es para arrancar un chat nuevo sin perder nada. Leerlo entero antes de tocar un nudo.
Al terminar cada nudo, actualizar la sección "Estado" y la tabla de estado de `docs/spec.md`, y pasarlo todo a `main` con un pull request unido enseguida (regla obligatoria de `CLAUDE.md`).

## Qué leer y en qué orden

1. `CLAUDE.md` (reglas generales del proyecto).
2. Este archivo.
3. `docs/spec.md`, sección "Decisiones tomadas al programar": el **Proceso para dibujar un nudo** (8 pasos), las reglas numeradas de dibujo (hasta la 36) y la tabla de estado.
4. `docs/referencias-nudos.md`: en qué página de cada guía está cada nudo, qué muestra cada dibujo y cuál es la versión más simple.
5. El código de un nudo ya hecho que se parezca al que toca (ver "Qué reusar").

## Cómo quiere trabajar el usuario (lo que se decidió en el chat)

- Hablarle siempre en español, también los resúmenes y lo que traen los agentes.
- La guía es personal, sin fin comercial: se puede copiar la disposición de los dibujos de las guías ilustradas.
- Antes de dibujar: mirar la página de la guía y copiar su disposición. Si hay varias fuentes, elegir la forma más simple aunque sean los mismos movimientos.
- Pocos pasos, con piezas que el pescador ya conoce ("hacer un nudo simple"). No partir un paso en movimientos chiquitos.
- Apretar y cortar van en pasos separados.
- Sin bordes intermedios: el borde de papel va solo donde se cruzan líneas del mismo tono.
- Cuando algo sale mal, convertirlo en regla para el que dibuja (spec) y para el que revisa (`.claude/agents/revisor-nudos.md`).
- Un nudo recién está terminado cuando el usuario lo ata en la mano y aguanta. El Lazo perfecto viejo era un nudo corredizo y se deshacía: por eso se rehízo todo en 3D desde las fuentes.
- Para gastar menos: empezar un chat nuevo cada 3 o 4 nudos (cada respuesta relee toda la conversación). Una sola revisión por nudo.

## Las dos guías en PDF

Se nombran en `docs/referencias-nudos.md`:

- **A** = "Cómo hacer bien sus nudos": un documento de Google, de 1 MB.
- **B** = "Guía Completa de Nudos y Aparejos de Pesca" (Wilson): un libro, de 22 MB. La página del PDF es la del libro menos 1.

Están en el repositorio, en `docs/fuentes/`:

- `guia-A-como-hacer-bien-sus-nudos.pdf`
- `guia-B-wilson-nudos-y-aparejos.pdf`

El usuario aclaró que el libro es gratuito y ya está publicado en internet.

Para mirar una página: `pdftoppm -r 110 -f <pág> -l <pág> -png <pdf> <salida>`, y leer la imagen.

## Herramientas

- `node --test`: todas las pruebas. Los nudos rehechos (lista `REDRAWN` en `test/knots-drawing.test.js`) tienen que pasar sin problemas.
- `node tools/nudos/chequeo.mjs <id> > /dev/null`: solo los problemas de dibujo de ese nudo, paso por paso.
- `node tools/nudos/pasos.mjs <id> [pasos]`: pasos en grande, en `tools/nudos/salida/pasos.png`, para mirar mientras se dibuja.
- `node tools/nudos/hoja.mjs <id>`: la hoja completa (todos los pasos con su texto) en `tools/nudos/salida/<id>.png`. Es la que se le manda al usuario.
- `node tools/nudos/cruces.mjs <id>`: lista de cruces de cada paso (quién va encima de quién). El revisor la usa en vez de adivinar mirando.
- Agente `revisor-nudos`: una revisión por nudo, pasándole la hoja, las páginas de referencia y cómo está pensado el nudo. Arreglar lo grave y lo medio.

## Qué reusar (en `js/drawings/knots.js`)

- **Motor 3D**: `js/drawings/knot3d.js` (`figure`, `warp`, `pinch`, `pullAlong`, `endOf`, `render`).
- **Cada paso**: `step3(items, ...resto)`; `{ tight: true }` para el nudo apretado; `{ back: svg }` para un objeto detrás de las líneas.
- **Nudo simple**: `overhand3`, `overhandPieces`, `overhandAt`.
- **Vueltas en hélice**:
  - `wrapsPart`: clinch.
  - `unWraps`: uni, con media vuelta extra.
  - `snWraps`: alrededor de una pata.
  - `cjWraps`: alrededor de un par de líneas.
- **Dos Uni enfrentados** (doble uni): `duWraps`, `duGreen` y `duTurn` (el segundo nudo es el primero girado media vuelta).
- **Nudo doble con la línea doblada** (lazo de cirujano): `lcDoubled` sobre `cjKnot`; la doblez es el lazo final.
- **Tramo doble retorcido** (brazolada): `brStretch` (vueltas en espejo a cada lado de un hueco); el paso apretado se arma con las mismas partes (regla 40).
- **Dos líneas retorcidas con las puntas por el hueco** (sangre): `sgPair` sobre `brStretch`; la naranja se arma al revés y se da vuelta con `sgBack` para que termine en su punta.
- **Línea doblada** (dos hebras de la misma línea): `doubledFig` (palomar).
- **Dos líneas distintas juntas, como si fueran una**: `cjPair` (cirujano). Sus partes se llaman "(verde)" y "(naranja)".
- **Anzuelos y objetos**:
  - `CL_HOOK`: anzuelo con ojo, horizontal.
  - `PHOOK`: anzuelo colgando.
  - `SN_HOOK` y `SN_PADDLE`: anzuelo de paleta.
  - `reel`: bobina del carrete.
- **Tabla de cruces esperados**: `test/knots-crossings.test.js`, citando la fuente.

## Errores que ya pasaron (no repetirlos)

- **Dibujar sin fuente:** dibujar de memoria. El Lazo perfecto salió corredizo porque la segunda vuelta no rodeaba la línea.
- **Leer los cruces a ojo:** el revisor se equivocaba mirando la imagen. Por eso existen `cruces.mjs` y la tabla de cruces.
- **Demasiados pasos:** el carrete tenía el nudo simple partido en movimientos sueltos, y el usuario mostró que las guías lo hacen en un paso.
- **Vueltas con mucha separación:** cuando cada vuelta cruza tres cosas, hay que separarlas más (pruebas: 8 de distancia entre cruces, 5 en el nudo apretado).
- **Apretar de más:** el nudo apretado hecho con un `pinch` muy fuerte deja cruces rozándose. Conviene apretar más a lo ancho que a lo largo.
- **Tonos de lo que se mueve:** lo que se mueve o se tira va en tono fuerte; lo quieto, en oscuro; lo ya hecho, en claro. La línea que pasa entera por un lazo también se mueve.
- **Tijera mal ubicada:** la tijera va sobre el sobrante, cerca de la punta (las pruebas lo controlan).

## Estado

Al 6 de octubre de 2026:

- **Dibujados en 3D y revisados:** Lazo perfecto (probado en la mano), Nudo de carrete, Palomar, Clinch mejorado, Uni, Snell, Cirujano, Doble uni, Lazo de cirujano, Brazolada y Sangre.
- **Pendiente del usuario:** atar en la mano el carrete, el palomar, el clinch, el uni, el snell, el cirujano, el doble uni, el lazo de cirujano, la brazolada y la sangre, y contar si aguantan. Si alguno falla, volver a la fuente antes de tocar el dibujo.

## Lo que sigue, en este orden

| Orden | Nudo | Referencia | Nota |
|---|---|---|---|
| 1 | Albright | Wilson p. 25 | Wilson da 5 vueltas de ida y 5 de vuelta; la app da 10 |
| 2 | Haywire | Wilson p. 69 | Acero: gris azulado |
| 3 | Manguito (crimp) | Wilson p. 64, arriba | Manguito en bronce |
| 4 | Bimini, Rapala | referencia débil | Buscar mejor fuente antes |
| 5 | FG, Tope corredizo | sin referencia ilustrada | Pedirle una imagen al usuario |

Después: pasar los armados (aparejos) al mismo sistema (emerillón en bronce, brazolada de acero).
