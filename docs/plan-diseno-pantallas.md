# Plan de navegación y muestras de pantallas

**Fecha:** 2026-10-08  
**Propósito:** planificar la experiencia completa antes de producir la primera muestra visual. Es un documento de diseño; no cambia la app ni define una implementación técnica.

## 1. Qué tiene que poder hacer la persona

La app debe ayudar a resolver cuatro momentos de una salida:

1. **Antes de salir:** mirar condiciones y decidir qué explorar.
2. **Reconocer y aprender:** buscar una especie con una Pokédex visual, entendiendo si un dato es local o general.
3. **Preparar el equipo:** encontrar un nudo o checklist sin navegar por textos largos.
4. **Guardar un recuerdo:** registrar una captura en pocos toques, aunque solo tenga una foto o una especie aproximada.

La experiencia se siente como una bitácora de exploración y colección: hay descubrimiento y progreso personal, pero no puntos, rachas, ranking, presión para completar especies ni contenido social.

## 2. Decisiones antes de dibujar

- **Navegación principal de cuatro destinos:** Inicio, Peces, Capturas, Equipo. Barra inferior fija en todas las pantallas principales y oculta solo durante formularios de foco completo.
- **Inicio responde “¿qué hago ahora?”** Muestra lugar elegido, estado del día y una acción clara: explorar peces o registrar una captura. Calendario y clima son accesos secundarios, no dos pantallas competidoras en la portada.
- **Peces se presenta como una Pokédex de campo.** Imagen grande, nombre común, iconos con rótulos y una ficha ampliable. No se usa la marca ni el arte de Pokémon.
- **Las medidas se muestran con alcance explícito.** En la tarjeta: “media local” solo si hay una muestra local apropiada; si no, “sin muestra local confiable”. En detalle se permiten referencias generales, separadas de medidas de Navarro. Un máximo nunca se dibuja como un objetivo.
- **Capturas propias son privadas.** El alta no exige ningún campo. Se puede guardar sin foto, ubicación, especie ni medidas; se puede omitir o retirar una ubicación. La muestra no publica ni sincroniza capturas.
- **Los datos ficticios se marcan a la vista.** Condiciones del día, relatos de capturas, fechas y nombre del pescador se rotulan “EJEMPLO FICTICIO”. Los datos científicos se rotulan con su ámbito, no se mezclan con ejemplos.
- **Imagen primero, texto después.** En vistas rápidas se usan foto/ilustración, iconos reconocibles y etiquetas cortas. El detalle ampliado explica incertidumbre, unidad, fuente y permisos.
- **Estilo propuesto: “Bitácora de campo”.** Fondo claro cálido para leer al sol; tinta oscura, verde agua para navegación y naranja como acento de acción; fotografía recortada de peces, tramas sutiles de mapa/cuaderno y botones táctiles. Mantener contraste alto y no heredar automáticamente el negro/amarillo de S7. La paleta es una hipótesis para evaluar en la muestra, no una decisión de programación.
- **Sin puntos de pesca sugeridos.** La ubicación solo registra dónde estuvo la persona cuando lo elige; no se presentan sitios de captura públicos ni ubicaciones de terceros.
- **No simular datos en vivo.** El clima de muestra es una tarjeta de demostración, no un pronóstico vigente. En la app final, si no hay dato, se mostrará claramente que no está disponible.
- **Accesibilidad:** iconos siempre rotulados; color nunca como única señal; botones grandes, controles con texto y alternativas para permisos denegados; la app debe seguir siendo entendible sin animación.

## 3. Recorrido y mapa de navegación

~~~text
Inicio
├── Condiciones → Clima
├── Próxima salida → Calendario → detalle del día
├── Explorar especies → Peces → ficha de especie
│                              └── Ver medidas y fuentes
├── Registrar captura → Capturas → Nueva captura → Captura guardada → detalle
│                                      ├── Foto opcional
│                                      ├── Ubicación opcional (GPS o sin ubicación)
│                                      └── Especie, largo y peso opcionales
└── Preparar equipo → Equipo
                       ├── Nudos → tutorial de nudo
                       └── Checklist → marcar, destildar, nueva salida
~~~

**Reglas de vuelta:** “atrás” vuelve al origen del flujo conservando lo cargado; cambiar de destino principal no guarda un formulario incompleto; al elegir “Guardar captura”, se puede guardar con cualquier combinación de campos; una confirmación anuncia qué se guardó y qué quedó vacío.

## 4. Muestras que se van a producir

Se diseñará una muestra de teléfono para cada pantalla/estado siguiente. Se incluirán enlaces/hotspots simples para recorrerlas en el orden natural, más una hoja índice donde las pantallas estén identificadas. No se considera una especificación de código ni un diseño final.

| # | Pantalla | Pregunta que responde | Contenido principal |
|---|---|---|---|
| 1 | Inicio | ¿Qué puedo hacer en esta salida? | Resumen de lugar y condiciones de demostración, accesos a calendario, peces y captura rápida. |
| 2 | Calendario | ¿Qué día quiero mirar? | Calendario mensual con eventos/condiciones ficticios explícitos; selección por fecha. |
| 3 | Clima | ¿Qué condiciones hay durante el día? | Lluvia, temperatura y viento de ejemplo ficticio con gráfica/horas y estado sin dato. |
| 4 | Pokédex — catálogo | ¿Qué especies puedo consultar? | Cuadrícula visual de las 11 especies ya catalogadas; prioridad visual para las cuatro investigadas. |
| 5 | Pokédex — detalle de especie | ¿Cómo reconozco este pez y qué tamaño tiene? | Imagen, rasgos, estado de presencia, media local, referencia de tamaño, unidad, alcance y fuentes. |
| 6 | Medidas y procedencia | ¿De dónde sale este número? | Desglose de “media local”, “referencia regional” y “máximo publicado/observado”, incluso cuando falta dato. |
| 7 | Capturas — bitácora | ¿Qué guardé? | Lista cronológica privada con fotos y resúmenes; estado vacío para primera captura. |
| 8 | Nueva captura | ¿Qué quiero recordar? | Formulario opcional, por secciones visuales: foto, ubicación, especie, largo, peso, nota breve. Acción de omitir y guardar. |
| 9 | Ubicación y permiso | ¿Quiero agregar el lugar? | Explica permiso; opciones “Usar ubicación”, “Elegir luego” y “Guardar sin ubicación”; estado de permiso denegado. |
| 10 | Captura guardada / detalle | ¿Qué registré y qué me falta? | Tarjeta personal, campos ausentes como “no agregado”, editar/quitar foto o ubicación. |
| 11 | Equipo | ¿Qué preparo antes de salir? | Dos accesos claros: Nudos y Checklist; piezas del kit existentes en segundo plano. |
| 12 | Nudos — selección | ¿Qué nudo necesito? | Situaciones en iconos rotulados: línea, anzuelo, señuelo, empalme. Acceso a tutorial. |
| 13 | Nudo — tutorial | ¿Cómo lo ato? | Diagrama de un paso activo, texto mínimo, anterior/siguiente, piezas y aviso de que es una muestra. |
| 14 | Checklist | ¿Qué no quiero olvidarme? | Lista táctil por grupos; marcar, reordenar en la futura app y “Nueva salida”. |

Las pantallas 2–3 y 11–14 conservan funciones que ya existen, pero se vuelven a ordenar dentro de la navegación propuesta. No se agregan subproductos de torneo, redes, trofeos o geolocalización pública.

## 5. Datos para las muestras

### Datos respaldados que se pueden usar, con su alcance

Se usarán solo cifras del [relevamiento de especies prioritarias](docs/fuentes/relevamiento-especies-prioritarias-2026-10.md), rotuladas así:

- Tararira: referencia SIB/APN de hasta 63 cm para *Hoplias argentinensis*; no es media ni dato de Navarro.
- Carpa: referencia SAGyP de hasta 100 cm y 20 kg para Río de la Plata/cuenca del Salado; no es media ni medida local.
- Bagre sapo: referencia general de SAGyP cercana a 55 cm para *Rhamdia quelen*; no es récord ni medida local. La identificación sigue sujeta a la diferencia de nombres científicos observada.
- Pejerrey: el dato general de SIB/APN de aproximadamente 40 cm y 800 g se presenta solo como referencia sin método local; el máximo de SAGyP de hasta 74 cm se etiqueta como cifra general. No se presenta como valor de Navarro.
- Para las cuatro: **media local de largo y peso: sin muestra local confiable**.

### Ejemplos inventados para que la interfaz tenga contenido

- Captura ficticia: “Tararira · 42 cm · peso no agregado · foto de ejemplo · ubicación no compartida”. No representa un registro real del usuario.
- Clima/calendario: fechas y valores de muestra; cada elemento incluye distintivo “DEMO”. No se consulta el tiempo actual ni se muestra como pronóstico real.
- Nombre y datos del pescador: no usar datos personales del usuario; usar “Pescador” o “Ejemplo”.

### Imágenes y atribución

Para que la muestra tenga peces reconocibles sin asumir derechos de cualquier fotografía, se evaluarán imágenes de Wikimedia Commons con sus licencias y créditos en la pantalla de referencias:
- Tararira: archivo identificado en Commons como *Hoplias malabaricus*, foto de Ictiología Universidad Católica de Oriente, CC BY 2.0. Mostrar como referencia con nota de identidad taxonómica pendiente para la tararira pampeana; no rotular como ejemplar de Navarro.
- Carpa: “Common carp.jpg”, U.S. Fish and Wildlife Service, dominio público.
- Bagre: ilustración histórica “Rhamdia quelen.jpg”, Paul Louis Oudart (1847), dominio público por antigüedad; señalar que es lámina histórica.
- Pejerrey: “Pejerrey Odontesthes Bonariensis.jpg”, Uli7, CC0.
- Foto de captura de usuario: en la muestra solo se reutilizará una imagen identificada como demostración; no se sugiere que sea una captura real del usuario.
- Si la atribución no cabe junto a la imagen, va en el detalle de referencias, enlazada desde el crédito corto de la ficha.

## 6. Criterios para saber si se cumplió

La muestra se considera completa cuando:

1. Están las 14 pantallas/estados de la tabla y se puede identificar para qué sirve cada una.
2. Se pueden recorrer desde Inicio hasta una especie, hasta una captura guardada y hasta un tutorial/checklist sin callejones sin salida.
3. Una captura puede guardarse con todos los campos vacíos salvo el acto de guardar; existe un ejemplo de permiso rechazado y de guardar sin ubicación.
4. Ningún dato ficticio parece clima real o captura del usuario.
5. Ninguna media o máximo regional se presenta como estadística de Navarro; cada cifra tiene unidad y alcance visibles en su detalle.
6. Las imágenes tienen crédito/licencia visible o enlace accesible y no se confunden con fotos de ejemplares locales.
7. Cada pantalla cabe en un teléfono de 320–390 px, los controles principales son táctiles y los iconos tienen rótulo.
8. No se ha programado ni cambiado la app; son muestras de diseño navegables y una guía textual.

## 7. Orden de trabajo

1. **Planificar:** este documento fija propósito, navegación, pantallas, datos reales y ficticios, uso de imágenes, privacidad y criterios de revisión. Completarlo y publicarlo en GitHub antes de dibujar.
2. **Preparar muestras:** a partir del plan, construir una galería navegable de las 14 pantallas con fotos/ilustraciones atribuidas. No reutilizar la app como plantilla; es una propuesta exploratoria nueva.
3. **Revisar contra el plan:** recorrer cada camino, comprobar etiquetas de datos/alcances y que los campos sigan opcionales; anotar cualquier diferencia.
4. **Compartir para feedback:** dejar cambios de producto abiertos. No convertir la muestra en código de la app hasta que el usuario dé una decisión posterior.

## 8. Fuentes visuales consultadas al planificar

- [Hoplias malabaricus — Wikimedia Commons, archivo y CC BY 2.0](https://commons.wikimedia.org/wiki/File:Hoplias_malabaricus_(16521590825).jpg)
- [Common carp.jpg — Wikimedia Commons, dominio público](https://commons.wikimedia.org/wiki/File:Common_carp.jpg)
- [Rhamdia quelen.jpg — Wikimedia Commons, lámina de 1847](https://commons.wikimedia.org/wiki/File:Rhamdia_quelen.jpg)
- [Pejerrey Odontesthes Bonariensis.jpg — Wikimedia Commons, CC0](https://commons.wikimedia.org/wiki/File:Pejerrey_Odontesthes_Bonariensis.jpg)
