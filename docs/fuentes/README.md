# Fuentes: documentos e imágenes de donde sacar datos

Todo lo que se usa como referencia (para los dibujos de nudos, las fichas, el puntaje) se guarda acá y se anota en este índice. Si un dato de la app sale de una fuente, la fuente tiene que estar acá o con su enlace.

## Carpetas

| Carpeta | Qué va |
|---|---|
| `docs/fuentes/` | Documentos ya revisados e indexados (PDF, guías) |
| `docs/fuentes/imagenes/` | Imágenes sueltas de referencia, con nombre `<tema>-<qué>-<n>.png` (por ejemplo `nudo-fg-paso1.png`) |
| `docs/fuentes/entrada/` | **Bandeja de entrada del usuario**: subir acá lo nuevo sin ordenar. El primer agente que lo vea lo mira, lo renombra, lo mueve a la carpeta que va y lo anota abajo |

Archivos de más de 50 MB no entran en GitHub: guardarlos en Google Drive y anotar el enlace abajo.

## Índice

| Archivo o enlace | Qué es | De dónde salió | Para qué se usa | Páginas útiles |
|---|---|---|---|---|
| `guia-A-como-hacer-bien-sus-nudos.pdf` | "Cómo hacer bien sus nudos prácticos de pesca", 7 nudos en color | Documento de Google, exportado a PDF | Disposición de los dibujos de nudos | Ver `docs/referencias-nudos.md` |
| `guia-B-wilson-nudos-y-aparejos.pdf` | Geoff Wilson, *Guía completa de nudos y aparejos de pesca* (Tutor, 2004) | Libro gratuito publicado en internet (según el usuario) | Nudos y aparejos. **Página del PDF = página del libro − 1** | Ver `docs/referencias-nudos.md` |
| `correcciones-usuario-2026-10.pdf` | Imágenes n1 a n6 que pasó el usuario (Snell, Rapala, Albright, FG, Bimini, Tope) | El usuario, 7/10/2026 | Rehacer esos nudos | Ver `docs/plan-nudos.md`, "Correcciones pedidas por el usuario" |
| `docs/kit.md` | El Kit original: equipo, señuelos, carnadas | El usuario | Fichas y Checklist | — |
| `docs/fichas.md`, `docs/nudos.md`, `docs/armados.md` | Contenido de la app ya armado | Chats anteriores | Datos de la app | — |
| `tools/simulacion/` | Simulación del puntaje | Chats anteriores | Calibrar el modelo | — |
| Pesca Argentina — Especies argentinas (https://www.pescaargentina.com.ar/contenidos/especies-argentinas) | Portal público con índice de más de 40 especies y fichas enlazadas | Sitio web Pesca Argentina; acceso comprobado el 2026-10-08 | Referencia inicial para identificación, distribución/localidades, tamaños y pesos, modalidades, carnadas, temporadas y vedas. Acceso web disponible. Es información editorial/general: corroborar datos locales, medidas y normativa con fuentes científicas u oficiales antes de usarlos en la app. Fichas revisadas: Pejerrey, Carpa y Tararira | Índice y fichas individuales |
| Open-Meteo (https://open-meteo.com) | Clima y presión | API pública | Clima y Calendario | — |

Fuentes del modelo de puntaje (temperatura del agua, luna, presión): `docs/spec.md`, sección "Fuentes".

## Uso

- La guía es personal y sin fin comercial: se puede copiar la disposición de los dibujos (decisión del usuario).
- Al usar una página como referencia de un nudo, citarla en `docs/referencias-nudos.md` y en la tabla de cruces (`test/knots-crossings.test.js`).
- Para mirar una página de un PDF: `pdftoppm -r 110 -f <pág> -l <pág> -png <pdf> <salida>`.
