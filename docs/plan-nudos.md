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

- `node --test`: todas las pruebas. Los nudos rehechos (lista `REDRAWN` en `js/data/knots.js`: la usan las pruebas y la app, que los muestra primero con "Dibujo nuevo") tienen que pasar sin problemas. Al terminar un nudo, agregarlo al final de esa lista y subir `VERSION` en `sw.js` para que el teléfono baje los dibujos nuevos.
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
- **Sangre, lo leve que quedó de la revisión:** el tramo verde de arriba del hueco se ve como un guion corto entre las dos puntas (lo mismo pasa en la Brazolada: es el borde de arriba del hueco). En el paso 3, las puntas pasan por detrás del tramo de abajo, que está en tono claro, y eso se ve poco; el texto lo dice. Wilson usa 4 vueltas por lado y otras fuentes, 5 a 7: si en la mano se desliza, subir a 5.
- **Pendiente del usuario:** atar en la mano el carrete, el palomar, el clinch, el uni, el snell, el cirujano, el doble uni, el lazo de cirujano, la brazolada y la sangre, y contar si aguantan. Si alguno falla, volver a la fuente antes de tocar el dibujo.

## Correcciones pedidas por el usuario (7 de octubre de 2026)

El usuario probó la app y pidió **no corregir en ese chat**, sino dejarlo anotado para el siguiente. Pasó un PDF con imágenes de referencia, guardado en `docs/fuentes/correcciones-usuario-2026-10.pdf` (5 páginas; mirar con `pdftoppm -r 110 -f <pág> -l <pág> -png docs/fuentes/correcciones-usuario-2026-10.pdf <salida>`). Las imágenes van numeradas n1 a n6:

| Imagen | Página del PDF | Nudo | Fuente de la imagen |
|---|---|---|---|
| n1 | 1 | Snell | sin nombre (dibujo en línea, 3 pasos) |
| n2 | 2 | Rapala | sin nombre (señuelo, 6 pasos con texto en español) |
| n3 | 3 | Albright | Peche.com (4 pasos) |
| n4 | 4 | FG | Peche.com (pasos 4 a 8; los pasos 1 a 3 no están en la imagen) |
| n5 | 5, arriba | Bimini | 101Knots, "Bimini Twist Directions" (8 pasos) |
| n6 | 5, abajo | Tope corredizo | sin nombre (3 pasos con texto en español) |

Lo que dijo de cada nudo (sus palabras, resumidas) y lo que muestra su imagen:

1. **Snell (ya rehecho en 3D, hay que rehacerlo).** "No se entiende y por lo que vi en internet es un poco diferente." Imagen n1: anzuelo horizontal, ojo a la izquierda y curva a la derecha. (1) La línea entra por el ojo, corre a lo largo de la caña y forma un círculo grande colgando debajo. (2) Con el lado del círculo se dan 5 vueltas alrededor de la caña y de la línea, desde el ojo hacia la curva, mientras el círculo se achica. (3) Se tira de la línea y las vueltas quedan apretadas junto al ojo, con la línea saliendo por debajo de la caña. Copiar esa disposición.
2. **Rapala (sin rehacer).** "El nudo simple está mal dibujado; en el paso 3 la tanza no es continua; del paso 4 al 5 no se entiende qué hay que hacer: faltaría un paso más o un dibujo mejor." Imagen n2, 6 pasos: (1) nudo simple a 12 cm (5") de la punta y la punta por el ojo del señuelo; (2) la punta vuelve por dentro del nudo simple; (3) 3 vueltas con la punta alrededor de la línea; (4) la punta pasa por la parte de atrás del nudo simple; (5) la punta pasa por la curva que se forma; (6) mojar, apretar y cortar.
3. **Cirujano (ya rehecho en 3D, hay que aclararlo).** "Me costó bastante entenderlo y tuve que ver un video." En el nudo simple pasan juntos la **punta de la línea verde** y la **naranja entera, por su otro extremo** (el largo, el que va al resto de la línea), **no la punta naranja** que se había puesto al principio junto a la verde, con 15 cm de sobra de cada lado. Hay que aclararlo en el dibujo y en el texto (qué extremo de la naranja pasa por el lazo).
4. **Albright (sin rehacer).** "No se entiende el dibujo del paso 4: el texto dice que sale por donde entró, pero en el dibujo sale por encima de la línea gruesa y entra por debajo de ella." Imagen n3: le pareció interesante cómo empieza. La línea fina (a) entra en el lazo de la gruesa (b) y da vueltas alrededor del lazo alejándose de la curva, hacia las dos patas de la gruesa (paso 2, con flecha). Después pega la vuelta y sale por el lazo (paso 3). Paso 4: apretado, con las vueltas sobre la gruesa. Comparar con Wilson p. 25 y elegir la forma más simple (regla 33).
5. **FG (sin rehacer).** "No se entiende nada, ni los dibujos ni la explicación. En los dibujos actuales no se ve ningún nudo simple como en la guía." Imagen n4 (pasos 4 a 8): (4) de 20 a 30 vueltas cruzadas del trenzado sobre el líder; (5) 6 medios nudos alrededor de las dos líneas, tirando; (6) cortar el líder a 3 mm; (7) 10 medios nudos del trenzado solo; (8) quemar la punta con un encendedor. Los pasos 1 a 3 no están en la imagen: buscarlos en Peche.com o pedírselos al usuario.
6. **Bimini (sin rehacer).** "Está mal dibujado: hacerlo como en la imagen n5 y con una explicación que vaya con el dibujo." Imagen n5, 8 pasos:
   1. Hacer un lazo alrededor de un apoyo y retorcer la punta 20 veces.
   2. Separar los extremos para que las vueltas se junten.
   3. Pasar la punta por encima de las vueltas, tirándola hacia el apoyo.
   4. Pasarla alrededor de la pata de arriba del lazo.
   5. Pasarla por el lazo chico de abajo y subirla.
   6. Apretar y dar 4 o 5 vueltas alrededor de todo el lazo.
   7. Tirar para apretar.
   8. Cortar el sobrante.
7. **Tope corredizo (sin rehacer).** "Fue complejo de hacer para lo que representa el nudo; en internet hay una forma más fácil de hacer el mismo nudo." Imagen n6, 3 pasos:
   1. Se apoya el nylon sobre la línea, haciendo una curva.
   2. Se dan 3 o 4 vueltas sobre la línea.
   3. Se tira muy fuerte de las dos puntas y se cortan los sobrantes con un alicate.

   **Además pidió buscar en internet** si pasa algo cuando se hace con nylon o si conviene otro hilo (por ejemplo, si el nylon roza o daña la línea al correr, o si se afloja), y aclararlo en la app con las fuentes.

Mientras no estén corregidos, el Snell y el Cirujano siguen en `REDRAWN` (la app los muestra como "Dibujo nuevo"). Al rehacerlos, volver a pasar por todo el proceso de la spec. Cada uno lleva tabla de cruces citando la imagen del usuario y otra fuente, una revisión y la prueba en la mano.

## Lo que sigue, en este orden

| Orden | Nudo | Referencia | Nota |
|---|---|---|---|
| 1 | Cirujano | guía A p. 4, Wilson p. 45, explicación del usuario | Aclarar qué extremo de la naranja pasa por el lazo (dibujo y texto) |
| 2 | Snell | imagen n1 | Rehacer copiando su disposición |
| 3 | Albright | imagen n3 y Wilson p. 25 | Vueltas alejándose de la curva y después de vuelta; Wilson da 5 de ida y 5 de vuelta; la app da 10 |
| 4 | Rapala | imagen n2 | 6 pasos como la imagen; nudo simple bien dibujado y línea continua |
| 5 | Tope corredizo | imagen n6 | La forma fácil, y buscar si el nylon sirve o conviene otro hilo |
| 6 | Bimini | imagen n5 | 8 pasos como la imagen, con textos acordes |
| 7 | FG | imagen n4 (pasos 4 a 8) | Faltan los pasos 1 a 3: buscarlos o pedirlos |
| 8 | Haywire | Wilson p. 69 | Acero: gris azulado |
| 9 | Manguito (crimp) | Wilson p. 64, arriba | Manguito en bronce |

Después: pasar los armados (aparejos) al mismo sistema (emerillón en bronce, brazolada de acero).
