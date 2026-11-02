# Plan técnico 006 · Imagen Neoland

> Versión 1.1 · Estado: **Aprobado** (2026-10-27) · Spec: [spec.md](spec.md) v1.0 · Arquitectura: [ARCHITECTURE.md](../../ARCHITECTURE.md) v1.1 · Creado: 2026-10-27

Este documento explica **cómo** se cambia el aspecto de las tres pantallas para que se parezcan a neoland.es sin cambiar lo que hacen (spec 006).

---

## 1. Visión general

Todo el cambio vive en `static/`. Ni el servidor, ni las reglas, ni la base de datos cambian.

```
static/
├── styles.css      # casi todo el cambio: colores, letras, botones, cabecera
├── index.html      # cabecera nueva
├── profesor.html   # cabecera nueva
├── alumno.html     # cabecera nueva
└── fonts/          # NUEVO: Montserrat y Roboto + sus licencias
```

Flask ya sirve todo `static/` en la raíz (`create_app`, `static_url_path=""`), y Python 3.13 conoce el tipo de `.woff2` (`font/woff2`). No hace falta ninguna ruta nueva.

`profesor.js` y `alumno.js` no cambian: el aspecto sale de las clases CSS que ya usan (`.card`, `.badge`, `.message`, `button.secondary`…).

---

## 2. Decisiones clave

### 2.1 Colores (CA-01, CA-06; spec P1)

Se cambian solo los valores de las variables de `:root`; los nombres se mantienen, así que el resto de `styles.css` sigue funcionando. Se añaden `--header-bg`, `--header-text`, `--accent-soft`, `--control-border` y `--danger-text`.

| Variable | Claro | Oscuro | Para qué |
| --- | --- | --- | --- |
| `--bg` | `#F5F5F5` | `#161616` | fondo de la página |
| `--surface` | `#FFFFFF` | `#222222` | tarjetas |
| `--text` | `#333333` | `#F2F2F2` | texto |
| `--muted` | `#5F5F5F` | `#A8A8A8` | texto secundario |
| `--border` | `#E0E0E0` | `#3A3A3A` | bordes decorativos (tarjetas, filas) |
| `--control-border` | `#8A8A8A` | `#8A8A8A` | borde de los campos (3:1) |
| `--accent` | `#D01F45` | `#FF5C7A` | botones, enlaces, foco |
| `--accent-text` | `#FFFFFF` | `#1A0A0E` | texto sobre `--accent` |
| `--accent-soft` | `#FDE8EC` | `#3A1720` | fondo del botón secundario al pasar el ratón *(v1.1: ya no es el de la etiqueta "abierta", §2.5)* |
| `--header-bg` | `#333333` | `#0B0B0B` | cabecera |
| `--header-text` | `#FFFFFF` | `#F2F2F2` | texto de la cabecera |
| `--danger` | `#333333` | `#E0E0E0` | botones de peligro (§2.4) |
| `--danger-text` | `#FFFFFF` | `#161616` | texto sobre `--danger` |

`--ok-*`, `--error-*` y `--warn-*` se quedan como están (ya cumplen).

Contrastes medidos (WCAG), todos ≥ 4,5:1 en texto y ≥ 3:1 en bordes de controles y foco:

| Par | Claro | Oscuro |
| --- | --- | --- |
| texto / fondo | 11,6 | 16,2 |
| secundario / fondo, tarjeta | 5,9 / 6,4 | 7,6 / 6,7 |
| rojo / fondo, tarjeta | 4,9 / 5,3 | 6,1 / 5,4 |
| texto del botón / rojo | 5,3 | 6,5 |
| rojo / rosa | 4,5 | 5,3 |
| etiqueta "abierta" (`--ok-text` / `--ok-bg`, sin cambios) | 7,4 | 9,4 |
| cabecera | 12,6 | > 15 |
| borde de campo / tarjeta | 3,5 | 4,6 |
| peligro / tarjeta; texto / peligro sólido | 12,6 / 12,6 | 12,1 / 13,7 |

`#E6284E` (el rojo exacto) se usa solo en el guion bajo decorativo del nombre (§2.3). Sobre la cabecera da 2,9:1, pero es decoración oculta a los lectores de pantalla y no transmite información, así que no se le aplica el mínimo.

### 2.2 Letras (CA-02, CA-08)

- **Montserrat** 700 y 800 para títulos, el código de asistencia y el total; **Roboto** 400 y 700 para el resto. Roboto no tiene un 600 de serie: lo que hoy es 600 (etiquetas, botones) pasa a 700.
- Cuatro archivos `.woff2`, solo caracteres latinos (incluye ñ, tildes, ü, ¿, ¡, ·, …), ~20–35 KB cada uno, ~110 KB en total (< 300 KB).
- Origen: los paquetes de **Fontsource** (`@fontsource/montserrat`, `@fontsource/roboto`), que publican esos archivos ya recortados y con su licencia. Se descargan **una vez** al implementar (con permiso previo) y se guardan en el repositorio; la app nunca los pide fuera.
- Licencia: SIL Open Font License 1.1 para las dos; se guardan `static/fonts/OFL-Montserrat.txt` y `static/fonts/OFL-Roboto.txt`.
- `@font-face` con `font-display: swap`: si la letra aún no ha llegado, se ve la del sistema (CA-02). La pila de respaldo es la actual (`system-ui, -apple-system, "Segoe UI", …`).

### 2.3 Cabecera (CA-01, CA-04)

Una franja oscura arriba en las tres páginas, fuera de `<main>`:

```html
<header class="brand">
  <p class="wordmark">AsistenciApp<span aria-hidden="true">_</span></p>
</header>
```

- El guion bajo rojo recuerda el cursor que escribe en la portada de Neoland; es decoración (`aria-hidden`).
- En `index.html` el `<h1>AsistenciApp</h1>` actual **pasa a ser** el nombre de la cabecera (`<h1 class="wordmark">`), para no repetirlo. En las otras dos páginas es un `<p>`, porque su `<h1>` es el de la página ("Panel del profesor", el título de la clase).
- Ningún texto, logotipo ni imagen de Neoland (CA-04).

### 2.4 Botones (CA-03, CA-07)

| Clase | Aspecto |
| --- | --- |
| `button` (principal) | rojo sólido, texto en negrita, esquinas de 4 px |
| `.secondary` | borde rojo, sin relleno, esquinas totalmente redondeadas |
| `.danger` ("Cerrar asistencia", "Quitar") | borde gris carbón (`--danger`), sin relleno, esquinas de 4 px |
| `.danger-solid` ("Sí, cerrar") | gris carbón sólido con `--danger-text` (en oscuro, gris claro con texto oscuro) |

**Por qué el peligro deja de ser rojo:** si el principal ya es rojo, un botón de peligro rojo no se distingue (CA-03). El gris carbón es el otro color de Neoland, y la confirmación dentro de la página (spec 001) sigue igual. Todos mantienen al menos 44 px de alto (CA-07); los `.small` siguen en 36 px como hoy.

### 2.5 Resto de piezas

- **Tarjetas:** esquinas de 8 px y una sombra muy suave; en oscuro, solo el borde.
- **Etiquetas:** "abierta" **en verde, como antes** (`--ok-text` sobre `--ok-bg`; v1.1); "cerrada" en gris; el modo ("Meet" / "código"), con borde, como hoy.
- **Campos:** borde `--control-border` (hoy no llega a 3:1), foco rojo.
- **Foco del teclado:** contorno de 3 px en `--accent`, como hoy (cambia solo el color).
- **Fondo:** gris muy claro, para que las tarjetas blancas destaquen, como las franjas de Neoland.

---

## 3. Modelo de datos y API

Sin cambios.

---

## 4. Archivos

| Archivo | Cambio |
| --- | --- |
| `static/styles.css` | variables, `@font-face`, cabecera, botones, tarjetas, etiquetas, campos |
| `static/index.html`, `profesor.html`, `alumno.html` | cabecera (§2.3) |
| `static/fonts/*.woff2` | NUEVO: 4 archivos |
| `static/fonts/OFL-*.txt` | NUEVO: licencias |
| `tests/test_static.py` | NUEVO: comprobaciones de §5 |
| `README.md` | una línea: de dónde vienen las letras y su licencia |

---

## 5. Trazabilidad: criterio → cómo se prueba

| CA | Prueba |
| --- | --- |
| CA-01 | **Test:** las tres páginas tienen `<header class="brand">` con "AsistenciApp". **Manual:** colores en Chrome |
| CA-02 | **Test:** cada `url(...)` de `@font-face` apunta a un archivo que existe en `static/fonts/` y la app lo sirve como `font/woff2`. **Manual:** en Chrome, la letra calculada es Montserrat/Roboto |
| CA-03 | **Manual:** los cuatro tipos de botón se distinguen (claro y oscuro) |
| CA-04 | **Manual:** revisión de las tres páginas |
| CA-05 | **Test:** todos los tests existentes siguen pasando; `profesor.js` y `alumno.js` sin cambios (`git diff`) |
| CA-06 | **Test:** lee las variables de `styles.css` (claro y oscuro) y comprueba el contraste de cada par de §2.1. **Manual:** foco visible al recorrer con el teclado |
| CA-07 | **Manual:** Chrome a 400 px, sin desplazamiento horizontal, en las tres páginas y en los dos modos de clase |
| CA-08 | **Test:** ningún `<link>`, `<script>`, `url(...)` ni `@import` de `static/` apunta a otra dirección; las letras pesan < 300 KB. **Manual:** pestaña Red de Chrome, solo peticiones a la app |

La revisión manual sigue la de la spec 004 (T14): servidor de prueba con una función de Meet falsa en la carpeta temporal, capturas antes/después para la revisión, y el puerto libre al terminar. Sin Playwright (spec §6).

---

## 6. Comprobaciones

### 6.1 Constitución (v3.1)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | ✅ | No toca las fuentes de asistencia |
| P2 Simplicidad | ✅ | Solo CSS y una cabecera en HTML; mismas clases, mismos nombres de variables |
| P3 Dependencias mínimas | ✅ | Ninguna dependencia: las letras son archivos estáticos, como el CSS |
| P4 Privacidad | ✅ | Nada se guarda nuevo; la página no pide nada fuera de la app (CA-08) |
| P5 Accesible y móvil | ✅ | Contraste medido y comprobado por test; foco visible; 400 px; 44 px |
| P6 Español | ✅ | Ningún texto nuevo salvo el nombre de la app |
| §3 Stack | ✅ | HTML + CSS sin frameworks |
| §5 Calidad | ✅ | Cada CA con test o paso manual (§5) |
| §6 Seguridad | ✅ | Sin cambios en el servidor |

### 6.2 Arquitectura (v1.1)

Solo cambia `static/` y se añade un archivo de tests (`tests/test_static.py`, que usa el cliente de Flask como los demás `test_web_*`). Ninguna regla de código de Python se ve afectada. **Excepciones:** ninguna.

---

## 7. Orden de trabajo (resumen para `tasks.md`)

1. Tests de §5 que fallan (cabecera, letras, sin direcciones externas, contraste).
2. Letras: descarga (con permiso), licencias, `@font-face`.
3. Variables de color y cabecera en las tres páginas.
4. Botones, tarjetas, etiquetas y campos.
5. Revisión manual en Chrome (claro/oscuro, 400 px, teclado, dos modos de clase, pestaña Red) con capturas.
6. Cierre: README, AGENT.md, comprobaciones y puertos libres.

---

## 8. Historial de cambios

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-10-27 | Borrador inicial |
| 1.1 | 2026-10-27 | §2.1 y §2.5: la etiqueta "abierta" del panel vuelve al verde de antes; `--accent-soft` queda para el botón secundario (revisión del aspecto) |
