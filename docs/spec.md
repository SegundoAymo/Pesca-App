# Spec — Rediseño App Kit de Pesca (para Claude Code)

Oct 3, 2026 · armado junto con @Segundo

## Objetivo y restricciones

Rediseño a botones grandes con ícono y texto mínimo; luna y temporada corren siempre en el cliente, sin red.

- Pantallas principales resueltas con pocos botones grandes, no listas de texto largas.
- Luna y temporada se calculan localmente — nunca dependen de conexión ni se inventan.
- La presión atmosférica y el pronóstico de Clima son los únicos datos que necesitan red. Sin dato reciente, el puntaje del día se recalcula sin presión, nunca con un valor inventado.
- La app carga y funciona completa sin conexión (ver Arquitectura técnica).

## Pantalla principal

Cinco botones grandes con ícono: Peces, Calendario, Clima, Nudos, Checklist. Mismo patrón en todas las pantallas de segundo nivel: elegís una opción grande, entrás, ves lo justo.

Diseño del inicio ([muestra](https://claude.ai/artifact/SFLVG9zwdgi5i9Yx82bRs1)): estilo Señal, formato S7: una sola columna de 5 botones grandes que llenan la pantalla. Clima va primero y más alto, en amarillo, con la temperatura de ahora y el aviso de tormenta; debajo Calendario, Peces, Nudos y Checklist.

Mapa de navegación:

- Inicio
  1. Peces → las 11 especies del catálogo → Carnadas / Hábitat / Equipo / Tips
  2. Calendario → mes → día → desglose de tararira, carpa y bagre + resumen del tiempo → Ver por hora (abre Clima en ese día)
  3. Clima → hoy (o el día elegido) → resumen + 24 horas; se pasa a los días siguientes
  4. Nudos → situación → nudos aplicables → tutorial con diagrama
  5. Checklist → ítems con casillero

## Peces

Once especies en el catálogo, pero solo tres entran al puntaje del Calendario (tararira, carpa y bagre). Vieja del agua y las siete especies de la zona sumadas abajo quedan afuera de ese cálculo.

Cada especie abre cuatro botones: Carnadas, Hábitat, Equipo, Tips.

- Carnadas, Equipo y Tips de tararira, bagre y carpa ya están redactados — fuente en la última sección de este documento.
- Hábitat: investigado para las 11 especies (ver Fichas).

Qué lleva cada botón, criterio de fuentes y orden de investigación: Fichas

El botón Equipo de tararira, bagre y carpa muestra sus armados de línea (fondo y boya), con un dibujo de cada armado, piezas, medidas y el recomendado primero: Armados

### Especies de la zona sumadas al catálogo

Siete especies más de Navarro y alrededores (laguna de Lobos, río Salado). Solo van al catálogo, no al Calendario. Sus fichas completas están en la pestaña Fichas.

| Especie | Dónde aparece | Qué tan seguido | Nota |
| --- | --- | --- | --- |
| Pejerrey | Laguna de Navarro, laguna de Lobos, río Salado | Habitual | Se pesca con el frío, hasta agosto. Veda en la provincia del 1 de septiembre al 30 de noviembre |
| Dientudo | Laguna de Navarro, río Salado | Habitual | Su filete también se usa como carnada |
| Mojarra | Laguna de Navarro, río Salado | Habitual | Se usa más como carnada viva que como pesca objetivo |
| Lisa | Río Salado, laguna de Lobos | Habitual en el Salado | Pez de mar que entra por el Salado. El sabalito es otro pez, más chico, que se usa como carnada |
| Patí | Río Salado | Sin dato | No aparece en la laguna de Navarro |
| Bagre amarillo | Río Salado | Sin dato | No aparece en la laguna de Navarro |
| Boga | Río Salado | Ocasional | No figura en la laguna de Navarro |

Datos tomados de resúmenes de búsqueda, sin leer cada artículo completo: verificar la frecuencia antes de redactar las fichas. Fuentes: [Resurgió la laguna de Navarro — Weekend](https://weekend.perfil.com/noticias/pesca/resurgio-la-laguna-de-navarro-un-ambito-cercano-a-capital-federal.phtml), [Pesca del Río Salado — Sentí la Pesca](https://sentilapesca.com.ar/pesca-del-rio-salado/), [Comunidad de peces de la cuenca del Río Salado del Sur — Bioikos](https://periodicos.puc-campinas.edu.br/bioikos/article/download/2330/2220/8224), [Boga — ArgentiNat](https://www.argentinat.org/taxa/1015178-Megaleporinus-obtusidens), [Laguna de Lobos y pejerrey — Canal 26](https://www.canal26.com/turismo/2026/05/17/laguna-de-lobos-cuando-ir-para-tener-la-mejor-pesca-de-pejerrey-y-las-mejores-opciones-para-dormir-frente-al-agua/).

## Nudos

Navegación por situación: elegís qué querés unir, ves los nudos que sirven (primero los que ya tienen el dibujo nuevo, en 3D y revisado, marcados "Dibujo nuevo"; el recomendado para tu kit, en amarillo) y abrís el tutorial con diagrama paso a paso, sin video. Son 9 situaciones, 18 nudos y 3 armados de plomada; la clasificación completa, con resistencia, dificultad y pasos de cada uno, está en Nudos.

Ilustraciones (obligatorias en la app):

- Nudos: un dibujo por paso, con el sistema de colores y flechas de "Decisiones tomadas al programar" (dibujos de nudos y armados). Son 18 nudos y 88 pasos.
- Armados de línea: un dibujo vertical de cada armado, de la madre al anzuelo, con cada pieza nombrada y las medidas (largo de brazolada, separación, distancia boya–carnada) marcadas al costado. Son 8 armados y los 3 de plomada.
- Cómo se hacen: dibujos vectoriales propios dentro del código de la app, con un mismo estilo. Funcionan sin conexión, se ven nítidos en cualquier pantalla y no dependen de imágenes con permisos de terceros.
- Se dibujan durante la programación, a partir de los pasos de las pestañas Nudos y Armados.

## Checklist

Lista de antes de salir con casilleros tildables, guardada en el teléfono (localStorage o IndexedDB) — no necesita cuenta ni backend. Se pueden agregar, borrar y reordenar ítems, y el botón "Nueva salida" destilda todo.

Iniciales (del kit ya armado):

- Caña y reel
- Línea principal cargada
- Líderes: alambre de acero (tararira) y fluorocarbono (bagre/carpa)
- Anzuelos: bagre, carpa, offset lastrado
- Plomadas
- Emerillones y mosquetones
- Señuelos
- Carnada natural
- Alicate, tijera, caja o bolso, balanza, salabre

## Calendario: diseño y lógica de colores

Diseño elegido: F6, "fondo + días apagados" ([muestras](https://claude.ai/artifact/SFLVG9zwdgi5i9Yx82bRs1)). Cada día muestra solo los peces que llegan al piso, con un fondo suave del color del mejor pez; los días sin ningún pez quedan apagados.

- Íconos: tararira arriba, carpa al medio, bagre abajo, siempre en ese lugar. Un pez debajo del piso no se dibuja y su lugar queda vacío.
- Tono de cada ícono: de suave en 70 a fuerte en 100, según el puntaje de ese pez.
- Fondo del día: tinte suave del color del pez con mejor puntaje, más intenso cuanto mejor el día.
- Día sin ningún pez sobre el piso: sin tarjeta, solo el número en gris tenue. Se puede tocar igual.
- Tocar un día abre el desglose de tararira, carpa y bagre, con barra de puntaje y una marca en el piso mínimo.
- Colores de especie: tararira #C2410C, carpa #0F766E, bagre #3730A3.
- Piso mínimo de puntaje: 70. Un pez con menos de 70 no se dibuja ese día.

## Pronóstico del tiempo

Botón principal nuevo, aparte del calendario de pique. Abre en el día de hoy y permite pasar a los días siguientes, para ver rápido el tiempo del día en que se está pescando.

- Lugar: por defecto la ubicación del teléfono; sin permiso de ubicación, Navarro. Es el mismo lugar para Clima y para la presión del Calendario. Se puede buscar otro lugar por nombre.
- Alcance: hasta 16 días, el límite de Open-Meteo. Más allá se muestra "sin pronóstico todavía"; nunca se inventa.
- Sin conexión: se muestra el último pronóstico guardado, con "actualizado hace X".
- Desde el desglose de un día en el calendario, un botón "Ver por hora" abre esta pantalla en ese día.

Nivel 1, resumen del día (también aparece en el desglose del calendario):

| Bloque | Qué muestra |
| --- | --- |
| Cielo | Ícono y una palabra: soleado, nublado, lluvia, tormenta, niebla |
| Temperatura | Mínima y máxima |
| Lluvia | Probabilidad máxima del día y milímetros totales |
| Viento | Velocidad máxima, ráfagas y flecha con la dirección |

Nivel 2, las 24 horas: una fila por hora con hora, cielo, temperatura, probabilidad de lluvia y mm, viento con flecha de dirección y ráfaga. Marca la hora actual, la salida y la puesta del sol. Una tormenta eléctrica se destaca en rojo, en el resumen y en su hora.

Diseño ([muestra](https://claude.ai/artifact/SFLVG9zwdgi5i9Yx82bRs1)): arriba el lugar con botón para cambiarlo; una tira deslizable con los 16 días; el aviso de tormenta en rojo; la tarjeta del resumen con 4 bloques (temperatura, lluvia, viento y sol); y la lista de 24 horas con la hora actual en celeste, las horas de tormenta en rojo y la salida y puesta del sol como filas propias. En el desglose del Calendario, el resumen va en una línea y el botón "Ver por hora" debajo; para días pasados o a más de 16 días dice que no hay pronóstico.

El calendario de peces pasa a llamarse Calendario; Clima es el pronóstico.

### Para más adelante

- Indicador de clima en las celdas del Calendario, por ejemplo una gota si hay lluvia probable o un rayo si hay tormenta.

## Modelo de puntaje por especie

El puntaje de cada pez va de 0 a 100 y combina temporada, luna y presión con un peso distinto por especie. Un pez con menos de 70 no se dibuja en el Calendario.

| Especie | Temporada | Luna | Presión | Confianza |
| --- | --- | --- | --- | --- |
| Tararira | 35% | 45% | 20% | Temporada y luna con fuentes de pesca; presión, patrón general |
| Carpa | 30% | 20% | 50% | Confirmado con fuentes: presión y temperatura por sobre luna |
| Bagre | 15% | 65% | 20% | Parcialmente estimado — ver nota |

Pesos ajustados con una simulación de todo 2026. Con los originales (45/35/20, 40/20/40 y 15/50/35) la tararira pasaba 70 todos los días del verano y la luna no llegaba a mover el puntaje. El bagre baja presión porque es de los menos sensibles a ella.

Puntaje = 100 × (peso temporada × temporada + peso luna × luna + peso presión × presión) × compuerta de frío. Cada factor va de 0 a 1.

### Temporada: temperatura del agua

La temporada sale de la temperatura estimada del agua para ese día y de cuánto come cada pez a esa temperatura.

| Ene | Feb | Mar | Abr | May | Jun | Jul | Ago | Sep | Oct | Nov | Dic |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 23 °C | 23 | 21 | 17,5 | 13,5 | 10 | 9,4 | 10,5 | 13 | 16,5 | 19,5 | 22 |

Valores de una laguna pampeana poco profunda, a partir de mediciones en Chascomús (CONICET). Cada valor se toma a mitad de mes y se interpola día a día. Es una estimación fija dentro de la app, no una medición en Navarro.

| Especie | Factor 0 (no come) | Factor 1 (óptimo) | Base |
| --- | --- | --- | --- |
| Tararira | 11 °C o menos | 21 a 28 °C | Baja su actividad debajo de 14 °C y deja de comer en pleno invierno |
| Carpa | 8 °C o menos | 22 a 28 °C | Consumo de alimento por temperatura; puntos intermedios 0,25 a 12,5 °C y 0,6 a 17,5 °C |
| Bagre | 6 °C o menos | 18 a 28 °C | Rango de confort del jundá en acuicultura; estimado |

Entre puntos, el factor sube en línea recta.

### Compuerta de frío

Si el factor de temporada de un pez es menor a 0,5, el puntaje se multiplica por ese factor dividido 0,5. Así la luna o la presión no pueden dar un buen día con el agua fría. Resultado: de junio a agosto ningún pez llega a 70.

### Luna

Factor = (1 + cos(2π × edad lunar ÷ 29,53)) ÷ 2: vale 1 en luna nueva, 0,5 en los cuartos y 0 en luna llena. Es igual para las tres especies; la diferencia está en el peso. Se calcula en el teléfono, sin red.

La tararira no tiene pico secundario en luna llena: no hay estudios sobre tararira y luna, y las fuentes de pesca ponen la luna llena como la peor fase.

### Presión

Viene de Open-Meteo: presión a nivel del mar del mediodía comparada con la del mediodía anterior. Se usa solo para los próximos 7 días, porque más adelante el pronóstico de presión no es confiable.

&#91;embedded content: Curva definida en este spec · cambio de presión a nivel del mar en 24 h, de −12 a +10 hPa\]

Entre puntos, en línea recta. Misma curva para las tres especies. Sin dato de presión, su peso se reparte proporcionalmente entre temporada y luna, nunca con un valor inventado. El desglose del día dice si se calculó con o sin presión.

Nota sobre bagre: no hay estudio de *Rhamdia quelen* específico para luna o presión. La fobia lunar está documentada en peces nocturnos no visuales de otra familia (electrorreceptores amazónicos, no Rhamdia); la dirección de la presión viene de literatura de pesca general sobre catfish. Si aparece data más específica de bagre sudamericano, ajustar esta tabla.

### Fuentes

- [Bagre sapo — SIB Argentina](https://sib.gob.ar/especies/rhamdia-quelen) — hábitat y distribución de *Rhamdia quelen*
- [Peces del Paraná: Rhamdia quelen — Primera Edición](https://www.primeraedicion.com.ar/nota/100915542/peces-del-rio-parana-rhamdia-quelen/) — hábito nocturno, mayor actividad diurna con turbidez alta, amplio rango de tolerancia a temperatura
- [A sensory ecology of fear — Ecology (2025)](https://esajournals.onlinelibrary.wiley.com/doi/10.1002/ecy.70133) — fobia lunar en peces eléctricos neotropicales de ojo chico
- [Pesca de Carpa — Calendario Solunar](https://xtrembass.com/lunar/carpa/) — carpa: presión y temperatura por sobre luna
- [Guía para pescar tarariras en Argentina](https://pescabox.com.ar/guias/tararira) — rango de temperatura y temporada de tararira

* [Laguna Chascomús: aportes de la ciencia — CONICET](https://ri.conicet.gov.ar/bitstream/handle/11336/205574/CONICET_Digital_Nro.c6be72d3-8169-4a1b-8fed-5c3eba450d66_A.pdf?sequence=5&isAllowed=y) — temperatura del agua de una laguna pampeana por estación
* [Tararira (Hoplias malabaricus) — Sentí la Pesca](http://sentilapesca.com.ar/tararira-hoplias-malabaricus) — actividad de la tararira según temperatura
* [Carpa — Wikipeces](https://wikipeces.net/carpa/) — consumo de alimento de la carpa por rango de temperatura
* [El jundá Rhamdia quelen — Epagri](https://docweb.epagri.sc.gov.br/website_epagri/Cedap/Livro/1-Livro-piscicultura-jundia-gestao-sistema-de-cultivo-reproducao-nutricao-genetica.pdf) — rango térmico de confort del bagre
* [La pesca y la luna — Pesca10](https://pesca10.com/la-pesca-y-la-luna/) — orden de fases: nueva, cuartos, llena

## Arquitectura técnica

&#91;embedded content: flujo de presión en vivo con reserva en caché, 2 ramas\]

Luna y temporada nunca pasan por este flujo: se calculan en el cliente, siempre, sin red. Hosting en GitHub Pages (el repo ya está en GitHub; HTTPS gratis, que el GPS y el Service Worker necesitan; no hay backend que justifique Netlify o Vercel); API Open-Meteo (sin key, CORS habilitado, presión a nivel del mar por hora, hasta 16 días); el cacheo lo maneja un Service Worker.

- Tecnología: HTML, CSS y JavaScript simple con módulos del navegador, sin framework, sin dependencias y sin paso de compilación. Son seis pantallas con poco estado; publicar es subir los archivos, y no hay librerías que actualizar ni que cachear para usar sin conexión.
- Orden del código: la lógica (luna, temporada, presión, puntaje) en módulos aparte de las pantallas, con pruebas automáticas usando el test runner que trae Node.
- Instalable (PWA): manifiesto con nombre e ícono para agregarla a la pantalla de inicio. El Service Worker guarda la app completa al instalarla; para Open-Meteo intenta la red y, si falla, usa la última respuesta guardada.
- Sin modo oscuro: la app se usa al aire libre, y el modo claro con contraste alto se lee mejor al sol.

## Contenido fuente ya armado

El equipo, señuelos, nudos base, línea/anzuelos y carnada por especie ya están redactados en dos lugares — se porta desde ahí, no se reescribe.

- [Kit de Pesca - Navarro (documento)](https://claude.ai/code/artifact/9da07aa9-0ab7-4c8f-86c5-25b3329a9845) — equipo, señuelos propios, catálogo de referencia, técnicas de recuperación, línea/líderes/anzuelos/plomadas, nudos base, notas y tips.
- [Kit de Pesca - Navarro (app publicada, versión con pestañas)](https://claude.ai/artifact/PArJDpimzbCBvQ1hpN4qDn) — mismo contenido maquetado para mobile, incluye carnada de las 4 especies.

## Decisiones para programar

Detalles que no estaban definidos y se resolvieron antes de empezar el código.

| Tema | Decisión |
| --- | --- |
| Nombre de la app | Kit de Pesca. Estilo visual: Señal, formato S7 (negro, blanco y amarillo #FFC400; letra Barlow Semi Condensed + Barlow; una columna de botones grandes con íconos de 84 px en amarillo y negro). Íconos: termómetro (Clima), hoja con el número del día (Calendario), tararira (Peces), anzuelo atado (Nudos), caja de pesca (Checklist). Ícono de la app: la tararira sobre amarillo. |
| Orden de los peces | Primero los 3 del Calendario (tararira, carpa, bagre), después pejerrey, dientudo, mojarra, vieja del agua, lisa, bagre amarillo, patí y boga. |
| Íconos de peces | Una silueta propia por especie, en el mismo estilo que los dibujos de nudos. |
| Veda en la ficha | La ficha del pejerrey muestra "En veda hasta el 30 de noviembre" cuando corresponde, calculado con la fecha del teléfono. |
| Meses del Calendario | Desde el mes anterior hasta 12 meses adelante. Abre en el mes actual con el día de hoy elegido. |
| Checklist inicial | Los ítems del kit más lo de la lista de compras de Armados (boyas, hilo para topes, municiones). Se pueden editar. |
| Datos guardados | Checklist, lugares buscados y último pronóstico, en el teléfono. Cada dato con número de versión para poder cambiar el formato en el futuro sin perder lo guardado. |
| Tipografía | Barlow Semi Condensed para títulos y números, Barlow para texto, guardadas dentro de la app para que funcione sin conexión (licencia libre). |
| Presión de hoy | Se pide el pronóstico con el día anterior incluido, para tener la presión del mediodía de ayer y calcular el cambio de hoy. |
| Actualizaciones de la app | Cuando hay una versión nueva, aparece un aviso "Hay una versión nueva: tocar para actualizar". |
| Pruebas | Pruebas automáticas del puntaje con fechas conocidas (por ejemplo la luna nueva del 10 de octubre de 2026) antes de dibujar pantallas. |
| Código | Textos de la app en español; nombres internos del código en inglés. Teléfono de uso: Android, instalación desde Chrome con "Instalar app"; las pruebas de GPS y modo sin conexión se hacen en Chrome para Android. |
| Orden de trabajo | 1) lógica de puntaje con pruebas, 2) Calendario, 3) Clima, 4) Peces, 5) Nudos y Armados con sus dibujos, 6) Checklist, 7) instalación y modo sin conexión, 8) publicación en GitHub Pages. |

## Decisiones tomadas al programar

- Presión en el Calendario: se usa el último pronóstico guardado solo si tiene menos de 24 horas; si es más viejo, el puntaje va sin presión.
- La luna se calcula al mediodía de Argentina. La simulación de calibración la tomaba al mediodía de Greenwich; la diferencia es de hasta 2 puntos.
- Pantallas internas: barra negra arriba con el botón Volver en amarillo y fondo claro para leer al sol. El Inicio conserva el marco negro de S7.
- En Clima la hora actual va en amarillo (en la muestra era celeste), para usar los colores del estilo Señal.
- El GPS se vuelve a pedir cada 30 minutos como mucho.
- Checklist: se tilda con un toque en el ítem. Ordenar y borrar van en un modo aparte ("Ordenar o borrar"), para que los botones chicos no estorben; al borrar aparece "Deshacer".
- Dibujos de nudos y armados: esquemas de 330 × 170 (los armados, verticales). Sistema de dibujo:
  - El color dice qué es cada cosa. Tanzas: verde la línea; naranja la otra línea (en los nudos que unen dos, el hilo del tope y las brazoladas de los armados). Metal en gris: anzuelo, emerillón, plomada, manguito y alambre de acero. Herramientas (tijera, pinza) en negro. Objetos con su color: boya amarilla y blanca, señuelo amarillo, perla blanca.
  - En cada tanza el tono dice qué le pasa en ese paso: oscuro, queda quieta; fuerte, se mueve en este paso; claro, ya se hizo en un paso anterior. Los armados no tienen pasos y van en el tono oscuro.
  - La punta termina en un rombo.
  - Indicaciones: en rojo el movimiento (flecha fina de trazos que marca por dónde va lo que se mueve: la punta, un lazo o el anzuelo; en forma de giro para "girar"). En azul las fuerzas: tirar (flecha gruesa y llena, separada del final de la línea que se tira), sostener (dos flechitas enfrentadas que aprietan, también para la pinza) y abrir (dos flechitas hacia afuera, para mantener un lazo abierto). La gota de "mojar" en celeste.
  - Superposición: la línea que se dibuja después tapa a la de abajo, sin borde. El borde del color del fondo va solo donde se cruzan dos líneas del mismo tono, en la que pasa por encima. El borde es parte del cruce, no del paso: se mantiene en los pasos siguientes.
  - La línea pasa por el ojo del anzuelo sin taparle el borde y vuelve por debajo, lejos de la pata. Los nudos (también los terminados) se dibujan con sus vueltas y cruces, sin bloques ni pelotitas.
  - La leyenda de cada nudo se arma con lo que usan sus dibujos.
  - Piezas base: línea doble (dos hebras de verdad, abiertas donde se separan y unidas solo en el doblez); nudo simple (tres cruces: encima, debajo, encima); vueltas (el frente entero cruza la línea y la parte de atrás va más clara, como un resorte); torsión de dos hebras (en cada cruce la de arriba lleva borde y se alterna); lo que pasa por detrás de un objeto (bobina, señuelo, manguito, boya) va en puntitos del color de la línea, para no confundirse con la flecha de trazos.
  - Metales separados: anzuelo en gris oscuro; acero (alambre y brazoladas de acero) en gris azulado, con sus tres tonos cuando se mueve; emerillón y manguito en bronce.
- Proceso para dibujar un nudo (el orden importa; las reglas numeradas de abajo son el detalle):
  1. Referencia: buscar el nudo en `docs/referencias-nudos.md` (páginas de las guías ilustradas que pasó el usuario) y mirar esas páginas. Copiar la disposición de la más simple: cuántos pasos, desde dónde se ve, qué muestra cada paso (reglas 34 y 35). Si no hay referencia ilustrada, pedírsela al usuario antes de dibujar.
  2. Cómo se ata: confirmarlo con al menos dos fuentes (las guías y las páginas de nudos reconocidas), sin usar la memoria (regla 30).
  3. Textos de los pasos: pocos pasos, con piezas conocidas ("hacer un nudo simple alrededor de la línea"), y "por delante / por detrás" cuando haga falta (reglas 31 y 35).
  4. Tabla de cruces en `test/knots-crossings.test.js`, citando la fuente, antes de dibujar (regla 18).
  5. Dibujo en 3D con las piezas base (nudo simple, vueltas, bobina, anzuelo) y `pullAlong` para el paso de apretar (reglas 17 y 19).
  6. `node --test` hasta que pase todo; mirar la hoja (`node tools/nudos/hoja.mjs <id>`) al lado de la referencia.
  7. Una revisión con el agente `revisor-nudos` (le pasa la referencia); arreglar lo grave y lo medio (regla 36).
  8. Mostrarle la hoja al usuario y que lo ate. Con eso el nudo queda terminado (regla 32).
- Pendiente del usuario: probar en la mano el Nudo de carrete, el Palomar, el Clinch mejorado, el Uni, el Snell, el Cirujano, el Doble uni, el Lazo de cirujano, la Brazolada y la Sangre (ya dibujados y revisados) y contar si aguantan.
- Estado de cada nudo (se actualiza al terminar cada etapa):

  | Nudo | Referencia | Dibujo 3D | Revisión | Probado en la mano |
  |---|---|---|---|---|
  | Lazo perfecto | fuentes web | sí | sí | sí |
  | Nudo de carrete | imagen del usuario | sí | sí | falta |
  | Palomar | guía A p. 2, Wilson p. 6 | sí | sí | falta |
  | Clinch mejorado | Wilson p. 5 (arriba) | sí | sí | falta |
  | Uni | guía A p. 1, Wilson p. 9 | sí | sí | falta |
  | Snell | guía A p. 3, Wilson p. 12; rehacer con la imagen n1 del usuario | sí (rehacer) | sí | no se entiende |
  | Cirujano | guía A p. 4, Wilson p. 45 | sí (aclarar) | sí | costó: aclarar qué extremo pasa |
  | Doble uni | Wilson p. 22 | sí | sí | falta |
  | Lazo de cirujano | Wilson p. 16 (centro) | sí | sí | falta |
  | Brazolada | Wilson p. 14 (abajo) | sí | sí | falta |
  | Sangre | Wilson p. 23 (arriba) | sí | sí | falta |
  | Haywire, Manguito | ver `docs/referencias-nudos.md` | no | — | — |
  | Rapala, Albright, FG, Bimini, Tope corredizo | imágenes del usuario (`docs/fuentes/correcciones-usuario-2026-10.pdf`) | no | — | — |

- Control de cada dibujo de nudo, antes de darlo por bueno (salió de revisar los errores de la primera versión):
  1. Continuidad: cada línea es un solo recorrido de punta a punta. Los tramos se tocan en el mismo punto; no hay tramos sueltos, huecos ni corrimientos (por ejemplo, la línea a otra altura que el nudo al que entra).
  2. Igual entre pasos: lo ya hecho se dibuja con la misma forma y en el mismo lugar que en el paso anterior; solo cambia de tono.
  3. Fiel al texto: el dibujo muestra lo que dice el paso. Si dice "cruzar", las líneas se cruzan; si dice "alrededor de la otra línea", las vueltas envuelven solo a esa; si dice "al revés", va en sentido contrario; si dice "por el lazo", se ve cuál lazo.
  4. Se reconoce el nudo: un nudo simple, una vuelta o un lazo se dibujan con la forma de la pieza base, nunca como un rulo, una mancha o un bloque. El nudo terminado deja ver sus vueltas.
  5. Delante y detrás: cada cruce dice qué va encima. Lo que va detrás de un objeto, en puntitos; ninguna línea pasa por encima de un objeto si en la realidad va por detrás.
  6. Línea doble: nunca un tramo cerrado salvo el doblez del lazo.
  7. Flechas: la de tirar sale del extremo de la línea que se tira, en su misma dirección; la de mover va junto a lo que se mueve y no lo tapa. Nada de flechas sueltas.
  8. Herramientas al lado de lo que tocan: la tijera, junto al sobrante que se corta (y el sobrante se ve); la pinza o el sostener, sobre la pieza.
  9. Colores: cada cosa con su color de material; el tono de la tanza según el paso; metales que no se confunden entre sí.
  10. Bordes y textos: nada a menos de 8 px del borde del dibujo; los textos no tapan líneas ni objetos y entran enteros.
  11. Revisión: cada dibujo se mira al menos a 1,5× de tamaño antes de mostrarlo.
  12. Pasos suficientes: al rehacer un nudo, revisar si falta algún paso intermedio para que se entienda (por ejemplo, cómo queda algo antes de apretar) y agregarlo; no quedarse con los pasos que ya había.
  13. Por el ojo: si un nudo va atado a un ojo (anzuelo, emerillón, señuelo), en todos los pasos se ve la línea pasando por el ojo, también con el nudo apretado.
  14. Lo que se tira se mueve: en los pasos de apretar, la línea de la que se tira y el nudo que se cierra van en tono fuerte; lo que se sostiene, con la flecha de sostener.
  15. Apretar y cortar, en pasos separados: primero se ve el nudo cerrado y después, en su propio paso, la tijera junto al sobrante.
  16. El nudo terminado con su forma: cada nudo apretado se dibuja con su estructura propia (sus vueltas, cruces y pasadas), no con un resorte que sirve para cualquiera.
  Reglas que salieron de las revisiones de Carrete, Palomar, Clinch y Lazo perfecto (los errores que más se repitieron):
  17. Un cruce se decide una sola vez: qué va encima sale de la profundidad de la línea en ese punto (dibujo en 3D), no de elegirlo tramo por tramo. Así no cambia entre pasos ni se contradice.
  18. Los cruces se escriben primero desde el nudo real: antes de dibujar, una tabla de qué parte pasa por encima de cuál en cada paso (`test/knots-crossings.test.js`). El dibujo tiene que dar esa misma tabla.
  19. El nudo apretado es el flojo achicado: se aprieta el centro del mismo dibujo (sin que nada pase a través de nada), no se redibuja a mano. Tiene los mismos cruces que el flojo.
  20. Tamaño mínimo: el nudo apretado no se achica hasta volverse una mancha; entre dos tramos paralelos queda al menos el ancho de una línea de papel.
  21. Cruces legibles: ninguno casi paralelo (al menos 30°) ni con las dos líneas a casi la misma profundidad.
  22. Si una línea pasa alrededor de un objeto (el anzuelo por el lazo del Palomar), el lazo se dibuja bien abierto, con el objeto adentro; recién después se cierra.
  23. Al cortar se ve el sobrante, con su punta, y la tijera encima. Ninguna flecha tapa la punta.
  Reglas que salieron de rehacer el Lazo perfecto en 3D:
  24. Cruces separados: entre dos cruces, al menos 8 unidades. En el paso de apretar el nudo se ve cerrado, como en las guías: ahí alcanzan 5 unidades y los tramos pueden ir juntos, porque los cruces ya se comprobaron en el nudo flojo.
  25. Sin tramos montados: dos tramos que no se cruzan no corren pegados (a menos de un ancho de línea más papel). Vale también para una vuelta en U demasiado cerrada.
  26. Flecha de mover junto a lo que se mueve, nunca en el vacío. Si el movimiento pasa por detrás de algo (un lazo que atraviesa a otro), se dibuja a medio camino, no solo con una flecha.
  27. Medir, no estimar: para que una parte cruce a otra se toman las coordenadas reales de la otra, y se confirma con la lista de cruces. Después de cada cambio, `node --test`.
  28. Lo que el paso no mueve no cambia de largo ni de lugar: por ejemplo, la línea arranca en el mismo punto en dos pasos seguidos.
  29. Si un arreglo choca con una regla, no se la saltea: o se busca otro arreglo, o se cambia la regla acá, con el motivo. (Pasó con la regla 14 en el Clinch apretado: el nudo quedó en tono claro; se corrige al pasarlo a 3D.)
  Reglas que salieron de atar el Lazo perfecto de verdad (el dibujo se podía seguir, pero el nudo salía corredizo y se desarmaba: la segunda vuelta estaba dibujada "por delante" del primer lazo, cuando en el nudo real rodea la línea, por delante y por detrás):
  30. Referencia externa, nunca de memoria: cada nudo se arma comparando varias fuentes de nudos de pesca reconocidas (al menos dos o tres, por ejemplo Orvis, Netknots, Animated Knots, Wikipedia), y la tabla de cruces cita la frase de la fuente que justifica cada pasada. Si las fuentes no coinciden en una pasada, se busca otra fuente hasta despejar la duda; si no se despeja, se pregunta. Ni quien dibuja ni el revisor usan solo lo que recuerdan del nudo.
  34. Copiar la disposición de una guía ilustrada: antes de dibujar, mirar cómo lo dibujan las guías de nudos reconocidas (imágenes, no solo texto) y copiar la de la más simple: cuántos pasos, desde dónde se mira y qué se ve en cada paso. Se redibuja con el estilo de la app (colores, rombo, flechas). Si en este entorno no se pueden abrir las imágenes, se le pide al usuario una de referencia antes de dibujar.
  35. Pocos pasos, con piezas que el pescador ya conoce: un nudo simple, una vuelta o un lazo se muestran de una vez ("hacer un nudo simple alrededor de la línea"), no pasada por pasada. Se descompone un paso solo si la prueba en la mano muestra que no se entiende. La regla 12 (pasos suficientes) no es para sumar pasos: es para no saltear uno que haga falta.
  36. Una sola revisión por nudo: primero se corrige todo lo que marca la prueba automática; después una revisión; se arregla lo grave y lo medio y no se vuelve a revisar salvo que el arreglo cambie el nudo. Lo leve se anota.
  33. La forma más simple: muchos nudos se pueden atar o mostrar de varias maneras (otro orden de pasos, otra orientación, la vuelta hacia un lado o hacia el otro). Se elige la que resulte más simple y fácil de seguir, aunque el nudo terminado sea el mismo, y se anota en la tabla de cruces cuál se eligió y por qué.
  Reglas que salieron de la revisión del Doble uni:
  37. Apretado no es corrido: si un paso dice que el nudo queda apretado, se ve más chico y con el lazo pegado a las vueltas que en el paso anterior. Deslizar un nudo sin achicarlo no cuenta como apretarlo.
  38. Las vueltas que dice el texto son las pasadas que se ven por delante: "4 vueltas" son 4 tramos por delante, no 5.
  39. El texto dice qué cruza el lazo de verdad: si el lazo sale de una línea, cruza solo la otra ("por delante de la otra línea").
  40. Cuando al apretar el material corre a lo largo de la línea (en la brazolada, el lazo baja por el hueco y lo de arriba se achica), achicar el dibujo no alcanza: el paso apretado se arma con las mismas partes en su forma apretada, y la tabla de cruces confirma que es el mismo nudo.
  31. Textos completos: el texto de cada paso dice todas las pasadas, con "por delante", "por detrás" o "alrededor de". Una pasada que el texto omite es la que después se dibuja mal.
  32. Prueba en la mano: un nudo no está terminado hasta que alguien lo ata siguiendo solo los dibujos y prueba los extremos (el Lazo perfecto ya pasó esta prueba): tirar de la línea y del lazo (o del anzuelo) no lo hace correr, y tirar del sobrante no lo desarma. Las pruebas automáticas y el revisor no reemplazan esto: comprueban que el dibujo es coherente, no que el nudo aguanta.
- Nudos dibujados en 3D (`js/drawings/knot3d.js`; por ahora el Lazo perfecto, después el resto): el nudo es una línea en el espacio, con partes con nombre ("primer lazo", "punta entre lazos"…) y una profundidad en cada punto que cambia de a poco. El programa la aplana al dibujo de siempre (mismos colores, rombo, flechas y borde solo entre tramos del mismo tono), calcula los cruces y dibuja encima, en cada uno, lo que está más cerca. El nudo apretado sale del flojo apretando su centro.
- Cómo se controlan los dibujos de nudos:
  - Prueba automática (`test/knots-drawing.test.js`, corre con `node --test` y en cada publicación): mide lo que no necesita criterio. Nada fuera del borde, textos enteros y sin tapar el dibujo, colores de la paleta, flecha de tirar saliendo de una línea, rombo pegado a su línea, tijera junto a un sobrante con su punta, ninguna flecha encima de la punta y una línea pasando por cada ojo. Flecha de mover junto a una línea. En los nudos en 3D, además: cruces de al menos 30°, con profundidad clara y separados entre sí, y ningún tramo montado sobre otro.
  - Prueba de cruces (`test/knots-crossings.test.js`): en los nudos en 3D, los cruces de cada paso son los de la tabla escrita desde el nudo real (regla 18). Los nudos todavía sin rehacer figuran como pendientes y no frenan la publicación; al rehacer uno, se agrega a la lista de rehechos (`REDRAWN` en `js/data/knots.js`), que también los pone primero en la app, y se sube `VERSION` en `sw.js`.
  - Revisión independiente: el agente `revisor-nudos` (`.claude/agents/revisor-nudos.md`) mira las imágenes de cada paso sin saber qué se quiso dibujar y las compara con las reglas y con cómo se ata el nudo de verdad. Las imágenes salen de `node tools/nudos/hoja.mjs` (usa Playwright, solo para desarrollo). Qué va por encima en cada cruce no lo juzga mirando: lo lee de `node tools/nudos/cruces.mjs <id>` (en los nudos en 3D) y lo compara con cómo se ata el nudo. Separa lo que está mal (enseña mal el nudo) de lo que se puede leer mal (claridad). Se usa después de dibujar o cambiar un nudo y antes de mostrarlo.
- Publicación: un workflow de GitHub Actions corre las pruebas y publica en GitHub Pages en cada push a main.
- Dos agentes (7 de octubre de 2026): Claude Code y ChatGPT trabajan en el mismo repositorio. Reglas comunes en `AGENTS.md`; coordinación en `docs/equipo/` (tablero, bitácora, aprendizajes, herramientas); fuentes en `docs/fuentes/README.md`. El repositorio pasa a ser la fuente de verdad, por encima de los artifacts de claude.ai.

## Pendientes y preguntas abiertas

Todo lo que falta definir antes de programar: lo ya anotado en el documento más lo que apareció al revisarlo.

Ya conocidos:

- [x] Hábitat de las 11 especies.
- [x] Carnadas, Equipo y Tips de las 7 especies de la zona.
- [x] Nudo para atar la línea al carretel y nudo para la plomada.

Modelo de puntaje:

- [x] Escribir las curvas exactas de temporada por mes y de luna para cada especie. Las muestras del calendario usan valores aproximados.
- [x] Definir cómo puntúa la presión: qué cuenta como "estable" o "bajando de a poco" y en cuántas horas se mide.
- [x] La presión solo existe para los próximos 16 días; del 17 en adelante el puntaje va sin presión y puede haber un salto entre días. Decidir si se marca qué días la incluyen.
- [x] Aclarar "dato reciente cargado desde el chat" en el modelo: según Arquitectura técnica la presión viene de Open-Meteo.

Ubicación:

- [x] Calendario (presión) y Clima usan el mismo lugar.
- [x] Sin permiso de ubicación, usar Navarro por defecto.
- [x] Buscar otro lugar necesita conexión. Se guardan los últimos 5 lugares buscados para elegirlos sin red.

Clima:

- [x] Unidades: °C, km/h y mm, con horario de Argentina.
- [x] La flecha del viento indica de dónde viene (convención meteorológica).
- [x] El pronóstico se actualiza al abrir la app si tiene más de 3 horas.

Checklist:

- [x] Se pueden agregar, borrar y reordenar ítems.
- [x] Botón "Nueva salida" que destilda todo.

Nudos:

- [x] Los diagramas paso a paso se dibujan propios, dentro de la app.

App y técnica:

- [x] Hosting en GitHub Pages; tecnología HTML, CSS y JavaScript simple, sin framework ni paso de compilación.
- [x] Instalable en el teléfono (PWA), para abrirla como app y usarla sin conexión.
- [x] Legible al sol: contraste alto y textos grandes. Sin modo oscuro.
- [x] Dibujar las ilustraciones: 84 pasos de nudos, 8 armados de línea y 3 de plomada (ver Nudos).

Ideas para más adelante:

- Veda del pejerrey (1 de septiembre al 30 de noviembre) visible en su ficha.
- Talla mínima, cupos y licencia de pesca de la provincia en cada ficha.
- Estimar la temperatura del agua con la temperatura del aire de Open-Meteo, en vez de la tabla fija de Chascomús. Una laguna de 1 m de profundidad sigue al aire con pocos días de atraso; habría que definir cuántos días promediar.


## Nuevas decisiones de producto — 2026-10-08

Preferencias expresadas por el usuario para una futura mejora de la app. Son decisiones de producto para orientar el diseño; todavía no se implementan.

- **Experiencia simple y lúdica:** el catálogo de peces se diseña como una Pokédex, con imagen/ilustración e iconos primero y poco texto. Los rótulos deben ser claros; el detalle adicional se descubre al abrir cada especie.
- **Medidas por especie:** mostrar largo y peso medios y máximos cuando existan datos confiables. Cada dato debe indicar unidad, fuente y alcance; distinguir máximo científico, récord y máximo observado. Si falta respaldo, indicarlo claramente.
- **Registro personal de capturas:** permitir guardar foto, ubicación, especie, largo y peso. Ninguno de esos campos es obligatorio; se admite una captura parcial.
- **Foto y ubicación:** solicitar permiso cuando corresponda, permitir omitir/quitar esos datos y explicar dónde se guardan. El registro es personal; no compartir ubicación ni capturas públicamente sin pedido expreso.
- **Separar datos:** las medidas medias/máximas describen la especie; no se calculan a partir de registros personales sin explicar la muestra y obtener una decisión del usuario.
- **Alcance:** investigar y preparar una referencia visual antes de programar. No agregar puntos, insignias, puntajes, rankings ni publicación social como requisitos por inferencia.