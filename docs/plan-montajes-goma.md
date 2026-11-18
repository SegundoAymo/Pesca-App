# Montajes de señuelo de goma (16/11/2026)

**Pedido del usuario:** sumar los montajes de un video que pasó (https://www.youtube.com/watch?v=CrhuERhqR1Q): Texas, Free rig, Drop shot, Wacky y Damiki, con cómo funcionan, cuándo no conviene, para qué peces, cómo armarlos y sus variantes. Antes de programar se le mostró un boceto de cómo queda cada uno y confirmó que coinciden con los del video: `docs/fuentes/imagenes/montajes-goma-boceto-aprobado.png`.

## Fuentes y límites
- El video no se pudo ver (YouTube está bloqueado en el entorno de Claude).
- Guías de pesca de black bass que coinciden entre sí: Tackle Warehouse, Wired2Fish, Bassmaster, Mike Iaconelli (free rig), Outdoor Life, Major League Fishing y Bassmaster (Damiki), Mustad y Kayak Angler (wacky). En este entorno solo se pudieron leer por resúmenes de búsqueda, no las páginas completas: **conviene verificarlas si se habilitan esos sitios**.
- Texas y Carolina, además: Wilson, p. 79 del PDF (`docs/fuentes/guia-B-wilson-nudos-y-aparejos.pdf`).
- Ninguna fuente los prueba con tararira. La regla del líder de acero es de la app; dónde va el acero en cada montaje lo definió Claude (pedido del usuario: "lo que no está definido, definilo vos").
- Medidas: solo las que dan las fuentes, como rango; donde no coinciden, se dice (largo de la punta del drop shot, tamaño del offset, forma del plomo del free rig).

## Cómo se presentan en la app
- **Nudos → Más → "Señuelos de goma: montajes"** (`#/nudos/gomas`): los 6 con miniatura y para qué sirve cada uno en una línea.
- Ficha de cada montaje (`#/armados/:id`): dibujo en el agua, cómo funciona, cómo armarlo (pasos), medidas, **variantes** (tarjetas de a dos con su dibujo, qué cambia y cuándo), cuándo no conviene, para qué peces, el aviso de la tararira, nudos (Palomar), lo que falta del kit con "Sumar a la checklist".
- Desde las fichas de peces: los señuelos de goma (tararira) y "el curly tail de fondo con plomo" (carpa, bagre) llevan a los montajes.

## Variantes elegidas
| Montaje | Variantes (con dibujo cuando cambian la forma) |
| --- | --- |
| Texas | Libre (dibujo), Pegado (dibujo), Sin plomo |
| Free rig | Plomo cilíndrico (dibujo), Plomo campana, Con topes (dibujo) |
| Drop shot | Punta corta (dibujo), Punta larga (dibujo) |
| Wacky | Clásico (dibujo), Neko (dibujo), Aro corrido |
| Damiki | Cabeza liviana (dibujo), Cabeza pesada, Con cucharita (underspin) |
| Carolina | — |

## Para tararira (aprobados el 18/11/2026)
Rana antienganche (hueca y maciza), spinnerbait y goma en cabeza jig, recomendados para tararira/traíra por guías de Argentina (Suiza Outdoor, Pescabox) y Brasil (Guia Pesca Esportiva, Guia o Melhor), vistas por búsqueda. Boceto aprobado: `docs/fuentes/imagenes/montajes-tararira-boceto-aprobado.png`. El líder de acero armado (emerillón a la madre, señuelo en el mosquetón) lo definió Claude. La sección pasó a llamarse "Montajes de señuelos", con dos grupos: "Recomendados para tararira" y "Otros montajes de goma".

## Anzuelos (18/11/2026)
Pedido del usuario: los anzuelos "parecen un alambre". Nuevo `js/drawings/hook.js`: ojal, pata, curva, punta con rebaba y la forma de cada tipo (offset con doblez en Z, doble de rana, pata larga, curva abierta, de drop shot, cabeza jig con trabas). Lo usan todos los dibujos de montajes y los armados de línea, y cada montaje tiene una sección "El anzuelo" con el dibujo ampliado.
