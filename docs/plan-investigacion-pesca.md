# Plan de investigación y verificación de contenidos de pesca

**Propósito:** decidir, con información local y verificable, qué contenido de pesca conviene mostrar en la app y cómo organizarlo. Este plan es de investigación y diseño: **no autoriza cambios de código ni define por sí solo nuevas funciones**.

**Alcance inicial:** la app de Pesca de Laguna de Navarro y alrededores, según `README.md` y `docs/spec.md`; incluir Laguna de Lobos y río Salado solo cuando las fuentes indiquen que el dato aplica allí. No recomendar puntos de pesca con nombre. Empezar por las 11 especies ya incluidas en `docs/fichas.md` y por los señuelos del kit. Ampliar la región o el catálogo requiere una decisión del usuario.

## Cómo marcar una tarea

Marcarla `[x]` solo cuando se cumpla el criterio de cierre escrito en su fila. Si falta evidencia, anotar el faltante y dejarla abierta; no completar por intuición.

## Fase A — Preparar la investigación

| Estado | # | Tarea | Terminada cuando… |
|---|---:|---|---|
| [ ] | A1 | Fijar alcance geográfico, especies y tipos de pesca incluidos. | El alcance local y las excepciones están escritos en este documento y no se mezclan datos de otras cuencas sin advertencia. |
| [ ] | A2 | Auditar `docs/fichas.md`, `docs/kit.md`, `docs/spec.md` y el índice de fuentes. | Hay una matriz de afirmaciones actuales con fuente, confianza, región y estado: confirmada, revisar o sin respaldo. |
| [ ] | A3 | Preparar el registro de fuentes. | Cada referencia nueva registra autor u organismo, título, enlace o archivo, fecha consultada, región, tema y qué afirmación respalda; además queda anotada en `docs/fuentes/README.md`. |
| [ ] | A4 | Aplicar criterios de calidad antes de recopilar datos. | El registro distingue normativa oficial, investigación científica, material técnico, experiencia local y fuente comercial; ninguna fuente comercial prueba por sí sola una recomendación de pesca. |

## Fase B — Revisar especies

Hacer una tarea por especie. Usar el mismo cierre para cada fila: presencia en la zona, reconocimiento, hábitat y profundidad, temporada u horario si hay evidencia, carnada/equipo/técnica relevante, normativa aplicable y nivel de confianza. Los datos que no se puedan confirmar se anotan como faltantes, no se inventan.

| Estado | # | Especie |
|---|---:|---|
| [ ] | B1 | Tararira |
| [ ] | B2 | Carpa |
| [ ] | B3 | Bagre |
| [ ] | B4 | Pejerrey |
| [ ] | B5 | Dientudo |
| [ ] | B6 | Vieja del agua |
| [ ] | B7 | Mojarra |
| [ ] | B8 | Lisa |
| [ ] | B9 | Patí |
| [ ] | B10 | Bagre amarillo |
| [ ] | B11 | Boga |

**Cierre de cada tarea B:** sus campos aplicables están respaldados, los datos de otras zonas están identificados como tales y las dudas tienen una nota y responsable de revisión.

## Fase C — Revisar señuelos y condiciones

Para cada tipo, investigar función, especies compatibles en la zona, profundidad, movimiento/recuperación, condiciones de uso, equipo necesario, errores comunes y si el kit actual lo incluye. No trasladar automáticamente reglas de otras especies o ambientes.

| Estado | # | Tipo de señuelo |
|---|---:|---|
| [ ] | C1 | Popper |
| [ ] | C2 | Jerkbait |
| [ ] | C3 | Stick |
| [ ] | C4 | Spinnerbait |
| [ ] | C5 | Jig |
| [ ] | C6 | Shad |
| [ ] | C7 | Frog |
| [ ] | C8 | Crankbait |
| [ ] | C9 | Minnow |

**Cierre de cada tarea C:** la ficha comparativa tiene todos los campos aplicables, identifica límites y excepciones y cita sus fuentes. Si el señuelo no corresponde al kit o a la zona, queda señalado en vez de presentarse como recomendación.

| Estado | # | Tarea | Terminada cuando… |
|---|---:|---|---|
| [ ] | C10 | Verificar criterios ambientales: claridad del agua, profundidad, luz/nubosidad, temperatura, viento o corriente. | Cada relación condición-recomendación tiene fuente y alcance; las que no tienen respaldo quedan fuera de las recomendaciones. |
| [ ] | C11 | Revisar reglas de elección combinada. | Hay una tabla que conecta especie + ambiente + profundidad + técnica con una sugerencia, y cada sugerencia se puede rastrear a sus fuentes. |

## Fase D — Chequear y resolver dudas

| Estado | # | Tarea | Terminada cuando… |
|---|---:|---|---|
| [ ] | D1 | Contrastar afirmaciones importantes con una segunda fuente independiente cuando sea posible. | Las normas se contrastaron con la autoridad competente; las afirmaciones biológicas/técnicas tienen respaldo pertinente o quedaron marcadas como inciertas. |
| [ ] | D2 | Resolver diferencias entre fuentes. | Cada diferencia tiene explicación (zona, temporada, especie o método) y se eligió una formulación acotada; si no se resuelve, el dato queda pendiente. |
| [ ] | D3 | Revisar datos cambiantes: vedas, cupos, tallas, licencias y temporadas. | Cada dato legal tiene jurisdicción, fuente oficial, fecha de consulta y fecha de próxima revisión. |
| [ ] | D4 | Pedir revisión a una persona con experiencia local. | Quedaron registradas sus observaciones y se aceptó, corrigió o dejó pendiente cada una; la experiencia no reemplaza una fuente oficial para normativa. |
| [ ] | D5 | Asignar confianza a cada afirmación. | Todo dato usado tiene nivel alto/medio/bajo con motivo; ningún dato de baja confianza se presenta como regla segura. |

## Fase E — Convertir evidencia en referencia de diseño

| Estado | # | Tarea | Terminada cuando… |
|---|---:|---|---|
| [ ] | E1 | Proponer el recorrido de consulta. | Un esquema muestra cómo llegar desde especie o condiciones a una recomendación, y qué hacer cuando faltan datos. |
| [ ] | E2 | Proponer una plantilla de ficha. | La plantilla separa recomendación breve, explicación, pasos, errores y fuente; cada campo se puede completar con datos investigados. |
| [ ] | E3 | Decidir qué conviene mostrar con texto, tabla, icono o ilustración. | Cada recurso visual tiene un propósito informativo y su fuente o permiso está identificado; no se copian imágenes sin derechos claros. |
| [ ] | E4 | Revisar legibilidad y carga de información en celular. | Una muestra de contenido cabe en pantalla pequeña, prioriza lo necesario y conserva el detalle sin texto ilegible. |
| [ ] | E5 | Presentar hallazgos, dudas y propuesta de diseño al usuario. | El resumen separa hechos confirmados, datos inciertos y decisiones de producto; no se implementa contenido nuevo hasta recibir aprobación. |

## Reglas de verificación

- **Normativa:** usar la autoridad oficial de la jurisdicción; registrar vigencia y fecha de revisión.
- **Biología y distribución:** priorizar universidades, institutos y publicaciones científicas.
- **Técnica de pesca:** priorizar fuentes técnicas pertinentes a la zona; etiquetar la experiencia anecdótica.
- **Afirmaciones atómicas:** una afirmación por fila del registro, con su fuente específica.
- **Unidades y alcance:** anotar unidades, especie, región, temporada y condiciones a las que aplica.
- **Trazabilidad:** conservar los documentos de referencia en `docs/fuentes/` según su índice; los enlaces por sí solos se anotan con fecha de consulta.
- **Criterio de salida:** ninguna recomendación pasa a la app si contradice la spec, no indica su alcance o depende de un dato sin fuente suficiente.
