# Investigación para diseñar una guía de pesca visual y útil

**Propósito:** averiguar qué necesita decidir un pescador de Laguna de Navarro y alrededores, reunir solo la información que respalda esas decisiones y convertirla en una referencia visual para mejorar la app. El resultado es de diseño; no modifica la app ni autoriza implementar recomendaciones.

**Pregunta guía:** «Con el tiempo y el equipo que tengo hoy, ¿qué conviene probar y cómo lo hago?»

## Decisiones de contenido

- Priorizar cuatro decisiones: **qué especie intentar**, **qué carnada o señuelo del kit elegir**, **cómo armarlo** y **qué ambiente/condición hace razonable esa elección**.
- Empezar por tararira, carpa, bagre y pejerrey porque son las especies de mayor utilidad para la guía y el calendario actual. Confirmar presencia local antes de dar recomendaciones.
- Revisar las otras especies ya incluidas solo para decidir si aportan valor local y qué nivel de ficha merecen. No investigar once fichas con la misma profundidad por defecto.
- Investigar primero el equipo que el usuario ya tiene. No convertir los señuelos del PDF de referencia en una enciclopedia ni recomendar compras sin una necesidad local clara.
- No mostrar puntos de pesca con nombre. Usar hábitat, profundidad y tipo de ambiente; precisar la zona solo cuando una fuente local lo permita.
- Una condición (clima, agua, luz o temporada) entra en una recomendación solo si cambia qué hacer y existe respaldo pertinente.

## Cantidad y jerarquía que se evaluarán

**Vista rápida:** una imagen o ilustración principal, tres o cuatro iconos con rótulos breves y una acción recomendada. Como objetivo de diseño, no superar **35 palabras visibles**, sin contar nombres propios de controles. Mostrar solo: objetivo, opción principal del kit, armado básico y una pista de ambiente/condición.

**Al ampliar:** hasta dos alternativas, explicación corta de por qué, pasos o medidas del armado, límites de la recomendación y fuentes. La normativa y los avisos relevantes de seguridad deben quedar visibles cuando apliquen.

**Visual primero:** usar iconos para categorías repetidas (pez, carnada, señuelo, profundidad, horario, clima, armado); diagramas para explicar cómo montar o trabajar un equipo; fotos/ilustraciones para reconocer especies. Todo icono debe tener rótulo accesible, no depender solo del color y distinguirse de decoración. Usar imágenes con permiso o licencia registrada. El texto orienta y aclara; no repite lo que ya explica claramente el dibujo.

Estos límites son hipótesis de diseño para validar, no hechos de pesca. Si una recomendación no cabe sin perder seguridad o precisión, se conserva el dato esencial y se pasa el detalle al nivel ampliado.

## Pasos de investigación

Marcar [x] únicamente cuando se cumple la meta observable. Si falta evidencia, registrar qué falta y dejar el paso abierto.

### 1. Entender qué decisión resuelve cada pantalla

| Estado | Tarea | Meta de cierre |
|---|---|---|
| [ ] | 1.1 Revisar README, spec y pantallas actuales. | Una tabla asigna a cada pantalla una pregunta concreta del pescador y señala solapamientos o huecos. |
| [ ] | 1.2 Revisar las fichas y el kit existentes. | Cada dato actual queda etiquetado: ayuda a decidir, explica/enseña, es repetido o necesita verificación. |
| [ ] | 1.3 Ordenar las decisiones por frecuencia e importancia. | Quedan definidas 3–4 decisiones principales y qué información es secundaria; cada prioridad tiene una razón vinculada al uso. |

### 2. Delimitar qué especies y equipo merecen investigación

| Estado | Tarea | Meta de cierre |
|---|---|---|
| [ ] | 2.1 Confirmar presencia local de tararira, carpa, bagre y pejerrey. | Cada especie tiene fuente pertinente a Navarro o a la cuenca, fecha/alcance y nivel de confianza; sin confirmación no se formula recomendación local. |
| [ ] | 2.2 Clasificar las demás especies del catálogo. | Cada especie queda como prioritaria, secundaria, solo identificación o fuera de foco, con razón y evidencia disponible. |
| [ ] | 2.3 Mapear el kit actual a decisiones de pesca. | Una matriz relaciona cada pieza del kit con las especies/técnicas para las que hay evidencia; los elementos sin uso respaldado quedan sin recomendación. |
| [ ] | 2.4 Detectar faltantes de equipo que impidan una recomendación útil. | Solo se proponen investigaciones sobre equipo nuevo cuando resuelven una necesidad local concreta; no se amplía el catálogo por el PDF de referencia. |

### 3. Buscar datos que cambian qué hacer

| Estado | Tarea | Meta de cierre |
|---|---|---|
| [ ] | 3.1 Investigar una opción principal de carnada/señuelo por especie prioritaria. | Para cada especie hay una opción inicial con especie, zona, método y fuente explícitos; si no hay sustento, se registra la incertidumbre. |
| [ ] | 3.2 Investigar armado y uso de las opciones respaldadas por el kit. | Cada armado elegido tiene un diagrama o pasos verificables, medidas/unidades cuando importen y compatibilidad con el equipo registrado. |
| [ ] | 3.3 Investigar hábitat y profundidad relevantes. | Cada guía describe el ambiente (sin punto nombrado) y distingue información local de referencias más amplias. |
| [ ] | 3.4 Comprobar si temporada, horario o condiciones ambientales cambian la elección. | Solo se conservan relaciones condición→acción respaldadas; las demás no generan consejos. |
| [ ] | 3.5 Verificar normativa y seguridad aplicables. | Cada aviso tiene jurisdicción, fuente oficial vigente y fecha de consulta; los avisos pertinentes se marcan como información prioritaria. |

### 4. Comprobar la calidad de la información

| Estado | Tarea | Meta de cierre |
|---|---|---|
| [ ] | 4.1 Registrar cada afirmación importante y su fuente. | El índice de fuentes anota autor/organismo, título, enlace/archivo, fecha consultada, región y afirmación respaldada. |
| [ ] | 4.2 Contrastar afirmaciones de alto impacto. | Normativa se confirma con autoridad oficial; presencia y biología con fuentes técnicas/científicas; técnica con fuentes pertinentes o experiencia local identificada como tal. |
| [ ] | 4.3 Resolver desacuerdos y asignar confianza. | Cada dato usado tiene confianza alta/media/baja y motivo; diferencias no resueltas quedan visibles, sin presentarse como regla segura. |
| [ ] | 4.4 Identificar derechos de imágenes e ilustraciones. | Cada imagen candidata tiene origen y licencia/permiso registrado; las no autorizadas se reemplazan por diagramas propios o iconos permitidos. |

### 5. Convertir los hallazgos en diseño fácil de escanear

| Estado | Tarea | Meta de cierre |
|---|---|---|
| [ ] | 5.1 Diseñar una muestra de vista rápida para una especie prioritaria. | La muestra responde qué probar, cómo armarlo y qué pista del ambiente mirar en hasta 35 palabras, usando iconos/imagen con rótulos. |
| [ ] | 5.2 Diseñar el nivel ampliado de esa muestra. | Alternativas, explicación, medidas, límites y fuentes quedan disponibles sin sobrecargar la vista rápida. |
| [ ] | 5.3 Revisar comprensión con pescadores locales. | En una prueba exploratoria con 5 personas, al menos 4 encuentran opción, armado y motivo en 10 segundos; si no, se simplifica y se repite. |
| [ ] | 5.4 Cerrar la referencia de diseño. | El informe separa hallazgos confirmados, dudas, contenido excluido y decisiones visuales; no se implementa sin una decisión posterior del usuario. |

## Criterios para las fuentes

- Una afirmación por registro, vinculada a una fuente concreta, su región, especie, método y fecha.
- Normativa: organismo oficial de la jurisdicción y vigencia comprobada.
- Presencia/biología: universidades, institutos y publicaciones científicas pertinentes a la cuenca.
- Técnica: fuentes técnicas pertinentes al equipo y ambiente local; señalar por separado el consejo anecdótico.
- No inferir que una recomendación aplica a Navarro solo porque funciona en otra región.
- Las fuentes comerciales pueden explicar un producto, pero por sí solas no justifican una recomendación.
- Registrar fuentes nuevas en `docs/fuentes/README.md` y conservar referencias según sus reglas.
- Si el respaldo es débil, acotar el consejo o dejarlo como duda. No rellenar huecos por intuición.

## Resultado esperado

Una guía de diseño breve y visual, basada en tareas reales del pescador: qué merece atención inmediata, qué se revela al ampliar y qué no hace falta mostrar. Debe incluir la muestra de ficha, decisiones de iconografía/diagramas, fuentes y nivel de confianza, y los datos que requieren revisión.

## Investigación para las funciones pedidas por el usuario (2026-10-08)

El usuario quiere que la app se sienta simple y algo lúdica, con un catálogo visual tipo Pokédex; ver tamaño y peso medios y máximos de cada pez; y llevar un registro personal de capturas con foto, ubicación, especie, largo y peso. **Todos esos campos de captura son opcionales.** Son objetivos de diseño e investigación; no implican programar estas funciones ahora.

### 6. Diseñar el catálogo tipo Pokédex y las medidas por especie

| Estado | Tarea | Meta de cierre |
|---|---|---|
| [ ] | 6.1 Proponer la tarjeta visual de especie. | Una muestra prioriza imagen/ilustración e iconos rotulados, identificación y datos de un vistazo; el detalle ampliado contiene texto breve y organizado, no una ficha larga. |
| [ ] | 6.2 Definir qué significan “tamaño medio”, “peso medio” y “máximo”. | Para largo y peso se especifican unidad, etapa/sexo si aplica, ámbito geográfico, fuente y método; “máximo” se rotula como máximo científico, ejemplar récord o máximo observado según la evidencia, sin mezclarlos. |
| [ ] | 6.3 Reunir valores de largo y peso por especie. | Cada valor mostrado tiene fuente trazable y alcance claro; promedio y máximo se distinguen; cuando no haya un promedio local confiable, se indica “sin dato confiable” en vez de inventarlo. |
| [ ] | 6.4 Elegir la forma compacta de mostrar medidas. | La tarjeta permite comparar largo y peso medios/máximos en una mirada, con iconos y unidades legibles; la persona puede entender qué compara una prueba rápida de comprensión. |
| [ ] | 6.5 Definir la lógica lúdica del catálogo. | Un boceto demuestra cómo recorrer/descubrir especies al estilo Pokédex sin añadir texto innecesario, ocultar información útil ni exigir completar el catálogo para usar la app. |

### 7. Diseñar el registro personal de capturas

| Estado | Tarea | Meta de cierre |
|---|---|---|
| [ ] | 7.1 Definir la tarjeta de una captura propia. | El registro contempla foto, ubicación, especie, largo y peso, y permite guardar una captura con cualquier combinación de esos datos, incluso si falta especie, foto o medidas. |
| [ ] | 7.2 Definir la carga visual y rápida. | Un boceto usa iconos con rótulos claros para cargar o consultar los cinco datos; no hace obligatorio ningún campo y evita pedir texto libre cuando sirve una opción visual. |
| [ ] | 7.3 Resolver permisos y privacidad de foto/ubicación. | La ubicación se pide solo con permiso explícito, puede omitirse o quitarse, y se deja claro dónde queda guardada; no se comparte públicamente sin una decisión expresa del usuario. |
| [ ] | 7.4 Definir cómo convive el registro con la Pokédex. | Un flujo muestra cómo una captura personal se vincula a una especie y cómo se consulta el historial, sin confundir datos personales con promedios o máximos de la especie. |
| [ ] | 7.5 Probar comprensión y facilidad de carga. | En una prueba exploratoria con 5 pescadores, al menos 4 pueden iniciar un registro, omitir datos que no tienen y encontrar una captura guardada; registrar fricciones y ajustes. |

Las reglas de fuentes, derechos de imágenes, incertidumbre y validación visual de las secciones anteriores también aplican a estas funciones. No sumar insignias, puntajes, rankings o uso compartido como requisitos sin evidencia de que ayudan y una decisión posterior del usuario.