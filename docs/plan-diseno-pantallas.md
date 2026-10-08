# Plan revisado de navegación y muestras

**Fecha:** 2026-10-08  
**Propósito:** registrar las decisiones de diseño después de revisar las primeras muestras con el usuario. Este documento orienta los siguientes bocetos; no cambia la app.

## 1. Decisiones del usuario convertidas en diseño

- **Inicio:** tomar como referencia la portada actual de la app: cinco accesos grandes, verticales, con iconos, contraste alto y el clima destacado. No usar la nueva portada tipo tablero.
- **Calendario y clima:** conservar las pantallas actuales de la app. En la galería se mostrarán esas pantallas reales dentro del marco del teléfono, para que el cambio sea fiel y no una reinterpretación.
- **Peces:** mantener el catálogo visual tipo Pokédex de la primera muestra.
- **Detalle de especie:** simplificarlo. Mostrar nombre, variables con rótulos claros, tamaño y peso máximos respaldados y medias solo cuando haya datos confiables. Si una medida no existe, omitirla; no mostrar un bloque “sin datos”. No enseñar una pantalla de fuentes ni una explicación metodológica extensa.
- **Qué ayuda a pescar:** sumar bloques breves con carnadas y señuelos, dónde buscar el pez y sus hábitos (horario, estación y efecto del frío) cuando el material disponible lo respalde. No inventar una recomendación para llenar un espacio.
- **Mis capturas:** agrupar registros por especie como el catálogo; guardar los registros sin especie bajo “Sin identificar”. Mantener foto, lugar, especie, largo, peso y nota opcionales.
- **Ubicación:** pedir permiso solo al elegir agregar ubicación. La pantalla de permiso existe como estado condicional dentro de ese flujo, no como destino de navegación.
- **Nudos:** conservar la selección de nudos por situación con etiquetas cortas que dicen qué se quiere unir, como en la primera muestra. Mantener Nudos y Checklist como accesos separados, siguiendo la portada actual. El tutorial sí usa la app actual y conserva todos los pasos a la vista.
- **Tutorial de nudos y checklist:** usar las pantallas de la app actual; el tutorial muestra todos sus pasos a la vista y la checklist conserva sus controles actuales.
- **Fuentes de datos:** las fuentes y límites se guardan en documentación de proyecto para verificar el contenido, pero no se presentan como pantalla ni como bloque visible del detalle. Los créditos de las fotografías se conservan de forma discreta porque identifican el origen y la licencia de cada imagen.

## 2. Recorrido propuesto

~~~text
Inicio actual
├── Clima → pantalla actual
├── Calendario → pantalla actual → selección de fecha
├── Peces → catálogo tipo Pokédex
│              ├── ficha breve → registrar captura de esta especie
│              └── Mis capturas → registros agrupados por especie
│                                  └── captura → editar / ver detalle
├── Nudos → situaciones con etiquetas breves → tutorial actual con todos los pasos
└── Checklist → pantalla actual
                 Nueva captura → foto, lugar, especie, largo, peso y nota opcionales
                                  └── ubicación solo si la persona la elige
                                      ├── permitir
                                      └── omitir / continuar sin ubicación
~~~

El botón atrás conserva lo ingresado en el formulario. Cambiar de sección no crea ni publica un registro. Ninguna captura ni ubicación se comparte públicamente.

## 3. Muestras previstas

La galería conserva un índice externo para navegar las pantallas de muestra; ese índice es una herramienta de revisión y no propone una navegación nueva dentro de la app.

| # | Pantalla / estado | Base | Contenido y criterio |
|---|---|---|---|
| 1 | Inicio | App actual | Cinco accesos, composición y jerarquía actuales. |
| 2 | Calendario | App actual | Vista real del calendario y selección de día. |
| 3 | Clima | App actual | Vista real de clima, lugar y pronóstico. |
| 4 | Pokédex — catálogo | Muestra aprobada | Cuadrícula visual de especies; acceso discreto a Mis capturas. |
| 5 | Ficha breve | Nueva | Nombre, rasgos en iconos, medidas disponibles, carnadas/señuelos, dónde buscar, horario/estación/frío y acción para registrar. Sin pantalla de fuentes. |
| 6 | Mis capturas | Nueva | Secciones agrupadas por especie; “Sin identificar” para las restantes; estado vacío. |
| 7 | Nueva captura | Nueva | Foto, ubicación, especie, largo, peso y nota; todo opcional, incluso el guardado vacío. |
| 8 | Permiso de ubicación | Estado condicional | Aparece solo tras pedir agregar ubicación. Permitir, omitir o seguir sin lugar. |
| 9 | Captura guardada / detalle | Nueva | Solo los datos ingresados, opción de editar y regreso al grupo de su especie. |
| 10 | Elegir un nudo | Muestra aprobada | Situaciones con etiquetas cortas y simples: línea, anzuelo, señuelo, empalme. |
| 11 | Tutorial de nudo | App actual | Todos los pasos visibles en la misma pantalla, con sus dibujos actuales. |
| 12 | Checklist | App actual | Lista y controles actuales, incluyendo “Nueva salida”. |

## 4. Contenido de las fichas de especie

Orden visual: nombre e imagen primero; medidas disponibles en una línea compacta; luego tres bloques con iconos y rótulos cortos:

1. **Qué usar:** carnadas y señuelos aplicables.
2. **Dónde buscar:** vegetación/fondo/profundidad o tipo de agua respaldados; nunca un punto privado de pesca.
3. **Cuándo:** día/noche, estación y relación con agua fría cuando haya respaldo.

Los valores máximos deben decir si corresponden a largo o peso. Una media solo aparece si existe una muestra apropiada para el ámbito indicado. La ausencia de media local no se reemplaza con un promedio regional. Las referencias de cuenca se pueden usar solo si el informe de especies las respalda; se rotulan brevemente como “referencia regional”. No mostrar cifras como récord de Navarro.

### Valores que sí están respaldados para la primera muestra

- **Tararira:** largo de referencia de hasta 63 cm para *Hoplias argentinensis* (SIB/APN); no hay media local confiable ni peso máximo local. Hábitat, horario y frío provienen del material de fichas existente; señuelos y carnadas se condensan desde la ficha del kit.
- **Carpa:** referencia de cuenca de hasta 100 cm y 20 kg (SAGyP); no hay media local. Carnadas, fondo y horario salen de la ficha existente; temperaturas se mantienen como orientación general, sin atribuirlas a Navarro.
- **Bagre sapo:** referencia general cercana a 55 cm (SAGyP); no hay peso máximo ni media local confiable. Mantener “bagre” separado de “bagre amarillo” y no presentar la taxonomía como resuelta. Carnada/hábitos se marcan como generales para el bagre sapo, no como certeza local.
- **Pejerrey:** referencia general de hasta 74 cm (SAGyP); el dato general de 40 cm/800 g del SIB no se presenta como media local porque no especifica muestra o método. No hay media local confiable. Carnada, búsqueda en cardumen y cambios de profundidad se condensan desde la ficha; los avisos normativos no se agregan a la muestra sin verificación vigente.

Fuentes y notas de alcance completas: [relevamiento de especies prioritarias](fuentes/relevamiento-especies-prioritarias-2026-10.md) y [fichas del proyecto](fichas.md). Esas referencias son para producción y revisión; no se dibujará una pantalla de fuentes.

## 5. Capturas y privacidad

- Cada dato es independiente y opcional: foto, ubicación, especie, largo, peso y nota.
- La agrupación usa la especie elegida por la persona. No intenta identificar peces en fotos.
- Los registros sin especie van al grupo “Sin identificar”; no quedan escondidos ni se descartan.
- Ubicación y foto no se comparten. En el prototipo, la ubicación es simulada y nunca se accede al GPS.
- El estado vacío permite entrar a registrar sin una plantilla obligatoria.

## 6. Imágenes y créditos

Mantener las cuatro imágenes ya seleccionadas, con alt-text que indique cuando son ilustraciones o referencias no locales. Tararira y bagre requieren la nota de identidad ya registrada en el prototipo. El crédito/licencia de la imagen se conserva junto a la imagen en tamaño secundario; no habrá una pantalla de bibliografía dentro del recorrido.

## 7. Criterios de cierre

1. Inicio, Calendario, Clima, Nudos, tutorial y Checklist corresponden a las pantallas actuales; tutorial y checklist conservan sus patrones actuales.
2. El catálogo conserva la propuesta visual tipo Pokédex.
3. La ficha de especie evita párrafos largos y solo muestra medidas disponibles con sus variables bien nombradas.
4. No se muestra un promedio inventado ni un bloque redundante cuando faltan medidas; medias locales sin respaldo se omiten.
5. La ficha incluye solo recomendaciones e hábitos respaldados; se distinguen claramente las referencias regionales.
6. Mis capturas está agrupado por especie y conserva un estado para registros sin identificación.
7. Todos los campos de captura son opcionales; la ubicación se solicita solo si se elige agregarla.
8. No hay pantalla de fuentes dentro del recorrido; los créditos de imágenes siguen visibles en forma discreta.
9. La galería permite recorrer las 12 pantallas/estados; las pantallas actuales se cargan desde la app publicada sin modificarla.

## 8. Secuencia de trabajo

1. Registrar por escrito las decisiones surgidas del feedback antes de modificar el prototipo.
2. Actualizar las muestras y mantener una clara separación entre los previews de la app existente y las pantallas nuevas.
3. Revisar cada pantalla contra los criterios de cierre y anotar límites de datos.
4. Publicar la galería en la ruta separada `/muestras/`; la portada y el comportamiento principal de la app permanecen en la raíz.
5. La galería es referencia de diseño; no convierte estas decisiones en cambios funcionales de la app.
