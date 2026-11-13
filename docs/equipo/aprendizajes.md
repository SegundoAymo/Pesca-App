# Aprendizajes y correcciones

Lo que salió mal y lo que corrigió el usuario, convertido en regla para no repetirlo. Lo leen los dos agentes **antes de empezar**. Se agrega abajo de la sección que corresponda; no se borra lo del otro.

Formato:

```
- **AAAA-MM-DD, Agente — Título corto.** Qué pasó. **Regla:** qué hacer de ahora en más. (Anotado también en: spec / revisor / plan, si corresponde)
```

Las reglas numeradas de dibujo (hasta la 40) están en `docs/spec.md`, "Control de cada dibujo de nudo". Acá va el porqué y lo general; la regla exacta vive en la spec.

## Cómo trabajar con el usuario

- **2026-10, Claude — Responder en español.** El usuario es de Argentina. **Regla:** todo en español, también lo que traen los subagentes.
- **2026-10, Claude — Corregir solo cuando lo pide.** El 7/10 el usuario pidió dejar las correcciones anotadas para el chat siguiente, sin tocar los dibujos. **Regla:** si el usuario dice "anotalo", anotar y no programar.
- **2026-10, Claude — Gastar menos.** Cada respuesta relee toda la conversación. **Regla:** chat nuevo cada 3 o 4 nudos; una sola revisión por nudo.
- **2026-10, Claude — Pasar todo a main.** Si no se une el pull request, el chat siguiente no ve el trabajo. **Regla:** al terminar algo, pull request a `main` y unirlo enseguida (ver `AGENTS.md`).

## Diseño de pantallas

- **2026-10-08, usuario — Usar las pantallas actuales como referencia.** El usuario prefiere Inicio, Calendario, Clima, tutoriales de nudos y Checklist de la app actual; en la ficha quiere información corta con medidas disponibles, carnadas/señuelos, lugar y hábitos; las capturas deben agruparse por especie. **Regla:** al revisar muestras, reutilizar esas vistas actuales; quitar explicaciones de fuentes de la interfaz y no rellenar datos ausentes.

- **2026-11-13, usuario — App práctica y visual.** Pidió que al entrar buscando algo la información esté a la vista, dibujada y no en párrafos, con dibujos vivos y navegación intuitiva. **Regla:** primero la respuesta (sin scroll), después el detalle; datos repetidos (meses, horarios, profundidad, carnadas) como íconos rotulados; todo nombre lleva a su lugar (puentes entre secciones); un dato que no está no se dibuja. (Anotado también en: spec, "Rediseño de noviembre 2026"; plan en `docs/plan-rediseno-2026-11.md`)
- **2026-11-13, Claude — Pasar texto a datos visuales pierde matices.** Al convertir las fichas en `facts` se perdieron marcas "sin fuente", se invirtió un rango de meses y se eligió el mayor de dos máximos que no coinciden; lo encontró la crítica del plan. **Regla:** cada dato visual conserva el matiz del texto ("a confirmar", "sin fuente", "dato de río", "las fuentes no coinciden") a la vista, y una segunda persona (o agente) compara `facts` contra el texto antes de publicar.
- **2026-11-13, Claude — Un dibujo "de escena" puede mentir.** El esquema vertical de los armados de fondo pone la plomada arriba: con agua de fondo parecía que flotaba. **Regla:** un fondo realista solo donde el orden del dibujo coincide con la posición real (armados con boya); si no, esquema limpio.

## Dibujos de nudos

- **2026-10, Claude — Dibujar sin fuente.** El Lazo perfecto se dibujó de memoria y salió corredizo: el usuario lo ató y se deshacía. **Regla:** mirar antes la página de la guía y escribir la tabla de cruces citando la fuente.
- **2026-10, Claude — Leer cruces a ojo.** El revisor se equivocó varias veces mirando qué tramo iba encima. **Regla:** usar `node tools/nudos/cruces.mjs <id>`.
- **2026-10, Claude — Demasiados pasos.** El carrete tenía el nudo simple partido en movimientos sueltos. **Regla:** pocos pasos, con piezas que el pescador ya conoce; apretar y cortar, en pasos separados.
- **2026-10, Claude — Vueltas muy juntas o nudo apretado de más.** Cruces rozándose. **Regla:** 8 de distancia entre cruces (5 en el apretado); apretar más a lo ancho que a lo largo; el apretado es el flojo achicado, no redibujado.
- **2026-10, Claude — Tonos de lo que se mueve.** **Regla:** fuerte lo que se mueve o se tira (también la línea que pasa entera por un lazo), oscuro lo quieto, claro lo ya hecho.
- **2026-10, Claude — Tijera mal ubicada.** **Regla:** la tijera va sobre el sobrante, cerca de la punta (lo controlan las pruebas).
- **2026-10-07, usuario — Correcciones de Snell, Rapala, Cirujano, Albright, FG, Bimini y Tope.** Detalle en `docs/plan-nudos.md`. **Regla:** cuando el usuario pasa una imagen, copiar su disposición y su cantidad de pasos.

- **2026-11-13, Claude — Render tubo.** Contorno y brillo hacen los dibujos más legibles, pero el brillo en el tono claro lo hacía ver como dos rayas y un contorno ancho pasaba la distancia que controla la prueba. **Regla:** brillo solo en tonos oscuro y fuerte; línea + contorno por debajo de los 7 de distancia mínima; cualquier cambio de render se mira en las hojas de varios nudos y pasa por `revisor-nudos`. (Anotado también en: spec y revisor)

## Código y repositorio

- **2026-10-07, Claude — Dos agentes en el mismo repo.** **Regla:** leer el tablero antes de empezar, ramas cortas, archivos "de a uno" (lista en `AGENTS.md`).
- **2026-11-13, Claude — Clases CSS genéricas chocan.** Una clase `.block` nueva (secciones) pisó a `.btn.block` (botón ancho) y apiló el ícono sobre el texto. **Regla:** nombres de clase específicos (`.sblock`) y mirar capturas de pantallas con botones después de agregar CSS.
- **2026-11-13, Claude — Historial con "volver" adivinado.** Detectar "atrás" comparando con la pantalla anterior falla en ciclos (Calendario → Bagre → Calendario). **Regla:** cada entrada del historial guarda su índice en `history.state` (`js/app.js`).
- **2026-10, Claude — Versión nueva que el teléfono no baja.** **Regla:** al cambiar dibujos o la app, subir `VERSION` en `sw.js`.
