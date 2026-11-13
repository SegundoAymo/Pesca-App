# Plan de rediseño — noviembre 2026

**Pedido del usuario (13/11/2026):** que la app sea práctica; que al entrar buscando algo la información esté a la vista, de forma visual y amigable (no párrafos ni dibujos apagados); que la navegación sea intuitiva. "Si hay que rediseñar algo o cambiar cómo funciona, se hace."

**Cómo se armó este plan.** Claude hizo el diagnóstico con capturas de todas las pantallas y abrió un debate con cuatro miradas independientes (modelos distintos), que después se cruzaron entre sí:

| Mirada | Qué aportó |
| --- | --- |
| Pescador de Navarro (persona) | Las 10 situaciones reales de uso y dónde se traba en cada una |
| Investigación de otras apps | Patrones de Fishbrain, solunares, Animated Knots, Merlin, Windy, listas de equipaje |
| Diseño de navegación (UX) | Mapa de rutas, puentes entre secciones, jerarquía de cada pantalla |
| Dirección de arte | Ilustración de peces, render de nudos, escenas de armados, íconos, componentes |

Los informes completos quedaron fuera del repo (eran de trabajo); lo que se decidió está acá. La segunda ronda (crítica del plan) está al final.

---

## 1. Diagnóstico

1. **Cinco silos.** El pescador hace una cadena de preguntas (¿voy hoy? → ¿qué pica? → ¿con qué carnada? → ¿cómo lo armo? → ¿qué nudo?) y cada respuesta lo manda de vuelta al Inicio. El Calendario dice "bagre 83" y no lleva al bagre; el armado dice "Emerillón con Palomar" y no lleva al Palomar.
2. **Lo más consultado está enterrado.** La carnada principal está a 4 toques y en viñetas. Época y horario son texto, aunque son naturalmente visuales (12 meses, 4 momentos del día).
3. **Dibujos apagados.** Peces en silueta plana (8 de 11 negras e iguales entre sí). Nudos con líneas planas y el tono "ya hecho" casi invisible al sol. Armados como esquema sin contexto.
4. **Calendario:** el detalle del día queda fuera de la pantalla al tocar; puntaje sin palabra (¿83 es bueno?); texto técnico.
5. **Clima:** la lista de horas arranca a las 0 h (hay que bajar 15 renglones para llegar a "Ahora"); no muestra la presión, que sí usa el puntaje; la flecha del viento confunde.
6. **Nudos:** 9 situaciones solo en texto; los nudos se eligen por nombre sin ver cómo son; leyenda de 7 símbolos arriba de todo.
7. **Checklist:** lista plana sin grupos ni relación con lo que se va a pescar.

Lo que **no** se toca porque funciona y le gusta al usuario: los 5 botones grandes del Inicio con Clima en amarillo; la grilla de colores del Calendario; los tutoriales con todos los pasos a la vista; los armados con colores de material y "Piezas que faltan"; la Checklist simple con "Nueva salida"; el estilo Señal S7.

## 2. Principios

1. **Primero la respuesta, después el detalle.** Lo que se busca en la orilla, sin scroll; el resto, plegado o más abajo.
2. **Dibujado, no escrito.** Meses, momentos del día, profundidad, carnadas y alertas se muestran con íconos rotulados; el texto aclara.
3. **Todo nombre lleva a su lugar** (puentes): un pez, un armado, un nudo, un día.
4. **No inventar.** Si un dato no está en las fichas, su elemento visual no aparece (no se muestra "sin dato" como bloque).
5. **Mismo estilo S7**, más vivo: contorno negro + color + una sombra + un brillo, como los íconos del Inicio.

## 3. Decisiones (con lo que se discutió)

| Tema | Decisión | Por qué / qué se descartó |
| --- | --- | --- |
| Navegación | Inicio de 5 botones + **puentes** + botón **Inicio** (casita) en la barra superior. **Sin barra inferior.** | La investigación proponía barra inferior; UX y la preferencia del usuario (eligió el hub y rechazó el tablero) pesaron más. El recorrido real es una cadena, no un ir y venir entre secciones; una barra quita 60 px al tutorial y al Calendario y queda junto a la zona de gestos de Android. |
| Volver | Vuelve a donde estabas (historial). Elegir día, pestaña o sección dentro de una pantalla no suma pasos al historial. Las rutas viejas siguen andando. | — |
| Inicio | Una sola línea de dato vivo por botón; una alerta reemplaza al dato y va en rojo. | El pescador quería "hoy" en una pantalla; esto lo da sin convertir el Inicio en tablero. |
| Ficha de pez | **Una sola pantalla**: ilustración, estado, Carnada, Cuándo (12 meses + momentos), Dónde, Señuelos, Armado, Consejos. Se eliminan las 4 subpantallas. | Pestañas dentro de la ficha volverían a esconder lo mismo. |
| Catálogo | Grilla de 2 columnas tipo Pokédex con ilustración a color y hasta 3 marcas (temporada, veda, Calendario). Orden fijo. | Sin porcentajes ni "3 de 11": el usuario no quiere insignias. |
| Calendario | Grilla igual; el día elegido en un **panel pegado abajo** que siempre se ve; palabra junto al puntaje; "¿Por qué?" plegado; cada fila lleva al pez y al Clima. | Se discutió poner el detalle arriba de la grilla: obliga a subir y bajar al comparar días. |
| Palabras del puntaje | Menos de 70 **Flojo** · 70–84 **Bueno** · 85 o más **Muy bueno**. Si el día va sin presión, el panel lo dice ("Sin presión"). | Es presentación, no dato nuevo: se anota en la spec. Se probaron cuatro palabras; la crítica mostró que el bagre daba "Excelente" en la mitad de sus días, casi todo por la luna (el factor con menos respaldo): quedaron tres. |
| Clima | Hoy, la lista empieza en **Ahora** (las horas pasadas, plegadas). **Presión** visible con tendencia en palabras. Viento con una palabra simple por rango de la escala Beaufort (calma, leve, moderado, fuerte, muy fuerte, temporal). | Sin meteograma: ordenar la lista resuelve casi todo. Las palabras oficiales ("brisa fresca" a 30 km/h) suenan suaves cuando en la orilla ya molesta. |
| Flecha del viento | **Apunta hacia donde sopla** y siempre lleva "del SE". | Cambia una decisión anterior de la spec ("indica de dónde viene"): es la convención de casi todas las apps del tiempo y al pescador lo confundía. |
| Nudos | Las 4 etiquetas grandes con pictograma (LÍNEA, ANZUELO, SEÑUELO, EMPALME) + 5 situaciones más chicas. En cada situación, botones de decisión ("¿mismo grosor? Sangre / Cirujano") y **miniatura del nudo terminado**. Tutorial con todos los pasos, leyenda en una línea, último paso con marco, **tocar un dibujo lo abre en grande con anterior/siguiente**. Cirujano y Snell, con correcciones del usuario pendientes, van marcados "en corrección". | El pescador pedía un paso por pantalla; el usuario quiere todos a la vista. El zoom da las dos cosas. |
| Render de nudos | Render **tipo tubo**: contorno oscuro + color + brillo (el brillo solo en los tonos oscuro y fuerte); el tono "ya hecho" conserva su relleno claro con contorno medio. Sin tocar la geometría ni los cruces. Línea + contorno = 6,6, debajo de los 7 que pide la prueba de distancias. | Una revisión independiente (`revisor-nudos`) miró seis nudos con el render nuevo. Se vuelve al aspecto anterior con `TUBE = false`. |
| Armados | Pantalla propia `#/armados/:id`; en los armados **con boya**, el dibujo va sobre una franja de agua (la superficie cruza la boya, la carnada cuelga sobre las plantas); cada pieza con nudo enlaza al tutorial; "Te falta" + **Sumar a la checklist**. | En los de fondo no se dibuja el agua: el esquema vertical pone la plomada arriba y parecería que flota. |
| Checklist | Grupos (Caña y línea, Terminales, Carnada y señuelos, Herramientas, Otros) con contador; grupo completo se pliega; ítems sumados desde un armado. | El dato guardado pasa a versión 2 con migración: no se pierde nada. |
| Mis capturas | Segunda pestaña de Peces. Formulario de una pantalla, todo opcional, fotos achicadas en IndexedDB, ubicación solo si se pide, "se guarda solo en este teléfono", botón para guardar una copia (sin fotos) y pedido a Chrome de no borrar los datos solo. | Pedido del usuario del 8/10. No es un sexto botón. |
| Fuentes | Fuera de la interfaz (quedan en `js/data/` y `docs/`). Se mantiene "Datos: Open-Meteo" por licencia. | Pedido del usuario del 8/10. |

## 4. Pantalla por pantalla

### Inicio
Clima: temperatura + "viento SE 21 · lluvia 12 %" (o la tormenta en rojo). Calendario: mini peces de hoy + "Bagre 83". Peces: "Pejerrey en veda hasta el 30/11" o las especies en temporada. Nudos: el último nudo abierto (o el recomendado). Checklist: "5 de 12 listos".

### Calendario `#/calendario[/fecha]`
Grilla y leyenda en una línea. Panel del día pegado abajo: fecha y luna; fila del tiempo (lleva a Clima); una fila por pez con barra con borde, piso de 70, número y palabra (lleva a la ficha); "¿Por qué?" con tres chips (agua estimada, luna, presión) y los consejos generales de presión, luna y temperatura que antes estaban en "Tips generales".

### Clima `#/clima[/fecha]`
Lugar en una fila; tira de 16 días; tarjeta del día con cuatro bloques (viento, lluvia, presión, sol) y mínima/máxima en el título; fila "Pesca este día" (lleva al Calendario); hora por hora desde Ahora. Tormenta: aviso rojo con "salir del agua y guardar la caña".

### Peces `#/peces` y `#/peces/capturas`
Control segmentado Especies | Mis capturas. Grilla de tarjetas: ilustración sobre agua clara, nombre, marcas.

### Ficha `#/peces/:id[/:bloque]`
Ilustración grande; chips (temporada / veda / hoy en el Calendario / largo de referencia / + captura); alerta (dientes, espinas, veda). **Carnada**: la principal en grande con ícono, alternativas en chips. **Cuándo**: tira de 12 meses (temporada, menos activa, fuera, veda) con el mes actual marcado, y los 4 momentos del día. **Dónde**: chips con ícono (vegetación, barro, fondo, cardumen…). **Señuelos del kit** agrupados por zona (superficie, media agua, fondo). **Armado** recomendado con miniatura y enlace; **Con tu kit**: lo que falta. **Consejos** cortos. "Cómo reconocerlo" y nombre científico, plegados.

### Armado `#/armados/:id`
"Por qué" en dos líneas; dibujo con escena de agua y piezas nombradas; piezas con nudo como botones; "Te falta" y "Sumar a la checklist"; medidas y glosario plegados; otros armados de ese pez.

### Nudos `#/nudos`, `#/nudos/:situación`, `#/nudos/:situación/:nudo`
Ver decisiones. En la lista, los nudos sin dibujo revisado van en un grupo aparte ("Dibujo provisorio"); desaparece el texto interno "Dibujo nuevo". En el tutorial, chips (dificultad con puntos, resistencia, líneas), "Se usa en" (armados que lo usan) y "Otros para esto".

### Checklist `#/checklist`
Barra de progreso, grupos plegables, ítems sumados desde armados, "Editar lista" (antes "Ordenar o borrar"), "Nueva salida".

## 5. Sistema visual

- **Peces:** ilustraciones nuevas de las 11 especies en SVG (contorno negro, colores naturales, aletas con radios, ojo con brillo, patrón propio: manchas, escamas, franja, barras, placas, bigotes). Los colores de especie del Calendario no pintan al pez: van en chips y barras. El Calendario conserva los pececitos planos chicos.
- **Íconos de datos** (`js/drawings/glyphs.js`): momentos del día, profundidad, ambientes, carnadas, señuelos, alertas, situaciones de nudos, grupos de la checklist. Grilla 24, trazo 1,8, un acento.
- **Chips:** amarillo significa solo "recomendado" (con estrella); rojo, alerta o veda; negro con letra amarilla, categoría; gris, sin dibujo revisado.
- **Tira de 12 meses:** temporada negra con letra amarilla; menos activa blanca con borde; fuera gris; veda roja.
- **Barra de puntaje:** con borde negro; debajo del piso, gris.

## 6. Datos nuevos (todos salen de textos que ya estaban)

- `facts` en cada especie de `js/data/species.js`: largo de referencia (solo donde está respaldado), meses (temporada / menos activa), momentos del día, dónde (ícono + frase), carnada principal y alternativas con ícono, señuelos con zona, armado recomendado o texto del armado, lo que falta del kit, alertas y consejos cortos.
- Piezas de los armados con su nudo (`knot`), para los puentes y "Se usa en".
- Nudos: dificultad 1–3 y datos para los botones de decisión.
- Checklist: grupo de cada ítem (versión 2 del dato guardado).

## 7. Qué NO se hace

Barra inferior, menú, buscador; portada tablero; carrusel en lugar de la lista de pasos; pestañas dentro de la ficha; meteograma, mapas o radar; pantallas de señuelos; filtros en el catálogo; insignias, porcentajes o rankings; mostrar conceptos internos ("Dibujo nuevo", "piso de 70" explicado en texto); rellenar huecos; recomendar lugares; tocar la geometría de los nudos.

## 8. Orden de trabajo

1. Datos estructurados + infraestructura (botón Inicio, rutas, puentes, alias de rutas viejas).
2. Ficha única + catálogo + ilustraciones de peces + íconos.
3. Calendario (panel, palabras, por qué).
4. Clima (desde Ahora, presión, viento).
5. Nudos (selector, miniaturas, decisión, tutorial, zoom, render tubo).
6. Armados (pantalla propia, escena de agua, piezas con nudo, sumar a la checklist).
7. Inicio con líneas vivas.
8. Checklist agrupada.
9. Mis capturas.
10. Pruebas, `VERSION` del Service Worker, spec, README, bitácora.

## 9. Preguntas para el usuario (no frenan el trabajo)

- **Carnada principal del bagre:** la ficha dice "lombriz colorada en racimo"; la nota de los armados dice "hígado de pollo (la mejor)". La app nueva muestra la de la ficha; hay que decidir cuál vale.
- **Ilustraciones de peces:** son nuevas; conviene que el usuario diga si reconoce cada especie.
- **Render de nudos:** cambia el aspecto de todos los dibujos revisados (no su geometría). Se puede volver al aspecto anterior con una sola constante (`TUBE` en `js/drawings/knot3d.js`).

## 10. Segunda ronda: crítica del plan

Con el plan escrito y la primera versión programada, dos revisores más lo atacaron: un abogado del diablo (producto y datos) y un revisor técnico (código, accesibilidad, rendimiento). Qué se cambió y qué no:

| Crítica | Qué se hizo |
| --- | --- |
| La escena de agua ponía la plomada de los armados de fondo pegada a la superficie, y las plantas a la altura de la carnada. | Agua solo en los armados con boya; plantas debajo del anzuelo. |
| "Así tiene que quedar" sobre un paso que es "cortar el sobrante" (con tijera y punta larga). | Se sacó el rótulo; el último paso conserva el marco. La miniatura usa ese paso sin tijera ni textos. |
| Brillo en el tono claro: "ya hecho" parecía dos rayas. Contorno de 2,2 pasaba los 7 de distancia que controla la prueba. | Brillo solo en tonos oscuro y fuerte; contorno de 1,6. |
| Errores en los datos visuales: meses del dientudo, marcas "sin fuente" perdidas (vieja, boga, patí, dientudo), largo de la tararira de otra especie científica, máximo del pejerrey elegido entre dos fuentes que no coinciden, peces del Salado contados "en temporada" en el Inicio. | Corregido: meses; marcas de vuelta; alcance de cada medida a la vista ("tararira pampeana", "las fuentes no coinciden: 60 a 74 cm"); el Inicio solo cuenta peces de la laguna. |
| Cuatro palabras de puntaje: el bagre daba "Excelente" en 51 de 108 días visibles, casi todo por la luna. | Tres palabras; "Sin presión" a la vista cuando corresponde. |
| Palabras oficiales de Beaufort engañosas ("brisa fresca" a 30 km/h). | Palabras simples por rango. |
| Cirujano y Snell tienen correcciones del usuario pendientes. | Marcados "en corrección" y en el grupo provisorio. |
| Rasgos de reconocimiento plegados (la situación "picó algo raro"). | "Cómo reconocerlo" a la vista bajo la ilustración. Momentos del día con la hora de salida y puesta del sol. |
| Historial: un "volver" detectado por comparación falla en recorridos Calendario → Bagre → Calendario. | El router guarda un índice en cada entrada del historial; Volver vuelve a donde estabas y recupera el scroll. |
| Panel del día con scroll dentro de otro scroll. | Al abrir "¿Por qué?", el panel deja de estar pegado y se lee con el resto de la pantalla. |
| Mis capturas: los datos se pueden perder. | `navigator.storage.persist()` y "Guardar una copia (sin fotos)". |
| Checklist: una copia vieja de la app podría pisar la versión 2. | Se guarda un respaldo de la versión 1 al migrar. |
| Chips que son enlaces, chicos para el dedo. | Los chips-enlace miden 44 px de alto. |

**Sin cambio, con su motivo:**

- *Flecha del viento:* la crítica pedía preguntarle al usuario. Se mantiene el cambio (apunta hacia donde sopla, con "del SE" al lado): el texto despeja cualquier duda y es la convención de casi todas las apps. Queda como pregunta abierta y se revierte en una línea (`windArrow` en `js/icons.js`).
- *Datos vivos en Peces y Nudos del Inicio:* se mantienen (la veda es un dato legal con fecha; "Último nudo" es el atajo de "se me cortó la línea"). Siguen siendo una línea por botón, no un tablero.
- *Un pull request por etapa en rama `claude/…`:* esta sesión trabaja en la rama que le asigna el entorno y sube todo en un pull request, con un commit por etapa.

## 11. Pendientes después de esta tarea

- Que el usuario mire las 11 ilustraciones de peces y diga si reconoce cada una (sobre todo vieja, patí y dientudo).
- Resolver las contradicciones de datos que salieron al cruzar fuentes: carnada principal del bagre (ficha: lombriz; nota de armados: hígado de pollo) y "1,5 m entre tope y carnada" contra "emerillón 30–40 cm debajo del tope" en la boya de tararira.
- Probar en el teléfono: al sol (contraste del render nuevo y de las franjas de meses), con GPS y sin conexión (capturas con foto).
- Ícono de pata de rana y algunos señuelos chicos se leen poco a 24 px: mejorarlos si molestan.
