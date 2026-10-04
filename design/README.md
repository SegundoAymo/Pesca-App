# Diseños

Las muestras de `mockups/` son mesas de trabajo del lienzo de diseño (formato `.dc.html`). Se ven bien en el lienzo vivo: https://claude.ai/artifact/SFLVG9zwdgi5i9Yx82bRs1. Abiertas sueltas en el navegador no cargan (les falta el `support.js` del lienzo), pero el HTML y los estilos se pueden leer y copiar.

## Elegidos

| Archivo | Qué es |
| --- | --- |
| `S7-Final.dc.html` | **Pantalla de inicio elegida**: estilo Señal S7 con los íconos C2, K1, P1, N3, L2. |
| `F6-Fondo-apagados.dc.html` | **Diseño de calendario elegido** (octubre 2026 con el modelo final). |
| `Calendario.dc.html` | Calendario F6 con el desglose del día, resumen del tiempo y "Ver por hora". |
| `Clima.dc.html` | Pantalla Clima: tira de 16 días, resumen y 24 horas (datos de ejemplo). |
| `Iconos-S7.dc.html` | Catálogo de 30 íconos (C1–C6, K1–K6, P1–P6, N1–N6, L1–L6). |

`Calendario.dc.html`, `Clima.dc.html` e `Inicio.dc.html` todavía tienen el estilo anterior: hay que pasarlos al estilo Señal.

## Descartados (de referencia)

- Calendario: `Main`, `Tres-peces`, `Franjas`, `Por-especie`, `Ganador-puntos`, `Solo-resaltados` (A–F) y `F1`–`F5`.
- Estilos generales: `Estilo-Laguna`, `Estilo-Senal`, `Estilo-Cuaderno`, `Estilo-Deportivo`.
- Variantes de Señal: `S1-Renglones` … `S7-Gigantes`.

## Íconos (`icons/`)

SVG con `viewBox="0 0 24 24"`, listos para usar: `clima` (termómetro), `calendario` (hoja con el número del día — en la app el número es el día de hoy), `peces` (tararira), `nudos` (anzuelo atado), `checklist` (caja de pesca) y `app-icon` (tararira sobre amarillo, 512 px).
