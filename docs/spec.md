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

Navegación por situación: elegís qué querés unir, ves los nudos que sirven (el recomendado para tu kit primero) y abrís el tutorial con diagrama paso a paso, sin video. Son 9 situaciones, 18 nudos y 3 armados de plomada; la clasificación completa, con resistencia, dificultad y pasos de cada uno, está en Nudos.

Ilustraciones (obligatorias en la app):

- Nudos: un dibujo por paso, con la línea principal y la punta en colores distintos y una flecha que marca el movimiento de ese paso. Son 18 nudos y unos 84 pasos.
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
- Los dibujos de nudos son esquemas de 330 × 170 con la línea principal en negro, la punta en naranja y el movimiento en rojo. En los nudos que unen dos líneas, el naranja es la otra línea.
- Rediseño de los dibujos de nudos (en prueba con el Clinch mejorado; si se aprueba, se pasa a los 18): línea principal en negro, lo que se hizo en pasos anteriores en naranja claro (el gris queda para el metal del anzuelo), lo que se mueve en este paso en naranja, la punta termina en un rombo. El color dice qué tipo de indicación es y la forma cuál: en rojo el camino de la punta (flecha fina de trazos); en azul las fuerzas, "tirar para apretar" (flecha gruesa y llena que sale de la línea que se tira) y "sostener" (dos flechitas llenas enfrentadas que aprietan el punto donde se sostiene). Los cruces muestran qué tramo va por encima y cuál por debajo, y el nudo terminado se dibuja con sus vueltas, sin bloques ni pelotitas. La leyenda de arriba muestra cada uno de estos signos.
- Publicación: un workflow de GitHub Actions corre las pruebas y publica en GitHub Pages en cada push a main.

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
