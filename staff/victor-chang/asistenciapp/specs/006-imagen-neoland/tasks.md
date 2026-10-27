# Tareas 006 · Imagen Neoland

> Versión 1.0 · Estado: **Aprobado** (2026-10-27) · Plan: [plan.md](plan.md) v1.0 · Creado: 2026-10-27

Cómo leer esta lista:
- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- `🧪` = se escribe primero el test, se ve fallar y luego se escribe el código hasta que pase.
- `👤` = necesita que **Victor** haga algo (aprobar una descarga o revisar las capturas).
- **Regla de todas las tareas:** al acabar, `pytest`, `ruff check`, `ruff format --check` y `mypy` están en verde (AGENT.md §6), y `profesor.js` y `alumno.js` no han cambiado (CA-05).
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.

---

## Fase A · Antes de tocar nada

- [x] **T01** · Capturas "antes" (plan §5):
  - Arrancar la app con una BD temporal y un servidor de prueba con una función de Meet falsa (fuera del proyecto, como en la spec 004 · T14).
  - Capturas en Chrome de inicio, panel, clase de código, clase de Meet y página del alumno, en claro y oscuro, a 400 px y en escritorio.
  - Parar el servidor y comprobar que el puerto queda libre.
  - *Cubre:* referencia para CA-01 a CA-07.
  - **Hecha (2026-10-27):** 15 capturas en la carpeta temporal de la sesión (`antes/`), con 5 nombres inventados, una clase de código abierta, una de Meet y una cerrada; el servidor de vista previa se paró y el 8012 quedó libre.
    - Modo oscuro (el del sistema de Victor) y claro (quitando en el navegador las reglas oscuras), en escritorio y en móvil.
    - **Límite encontrado:** la ventana de Chrome no baja de **500 px**, así que el "móvil" de estas capturas es de 500 px. Para la revisión de T08 a 400 px se usará un marco (`iframe`) de 400 px en una página de la carpeta temporal.
    - Lo que ya se ve: los botones de peligro ("Quitar", "Cerrar asistencia") son del mismo rojo que el principal pasará a tener, como prevé el plan §2.4.

## Fase B · Letras (plan §2.2)

- [x] **T02** 🧪 · Tests de letras y de "nada sale de la app" en `tests/test_static.py`:
  - cada `url(...)` de `@font-face` en `styles.css` apunta a un archivo de `static/fonts/` que existe, y la app lo sirve con `200` y tipo `font/woff2`;
  - ningún `<link>`, `<script>`, `url(...)` ni `@import` de `static/` apunta a otra dirección (`http://`, `https://` o `//`);
  - los `.woff2` pesan menos de 300 KB en total.
  - Deben fallar (aún no hay `@font-face`).
  - *Cubre:* CA-02, CA-08.
  - **Hecha (2026-10-27):** 18 tests nuevos en `tests/test_static.py`; los 12 de letras fallaron todos (sin `@font-face` ni archivos). 441 tests en verde y 12 `xfail`; `ruff` y `mypy` sin avisos.
    - Además de lo previsto: cada letra lleva `font-display: swap` (CA-02), sus dos licencias existen y los `.woff2` empiezan por `wOF2`.
    - Los 6 de "nada sale de la app" pasan ya, porque hoy las pantallas no piden nada fuera; quedan como red para T04–T07. Se comprobó a mano que la expresión detecta `https://…`, `//…` y comillas, y deja pasar `fonts/…`, `styles.css` y `/api/…`.
    - Para que la regla "todo en verde al acabar cada tarea" se cumpla, los tests de letras llevan la marca `FONTS_PENDING` (`xfail` estricto: si pasan antes de tiempo, fallan). T03 la quita de los tests de archivos (servir, licencias, tamaño) y T04 de los de `@font-face`.
- [x] **T03** 👤 · Descargar las letras (con permiso de Victor: nombres, origen y tamaño):
  - `montserrat-latin-700-normal.woff2`, `montserrat-latin-800-normal.woff2`, `roboto-latin-400-normal.woff2`, `roboto-latin-700-normal.woff2` de los paquetes de Fontsource, con versión fija;
  - sus licencias como `OFL-Montserrat.txt` y `OFL-Roboto.txt` en `static/fonts/`.
  - Comprobar que son archivos `woff2` de verdad (cabecera `wOF2`) y el tamaño total.
  - *Cubre:* CA-08 (las letras viven en la app).
  - **Hecha (2026-10-27)**, con permiso de Victor: Fontsource 5.3.0 desde cdn.jsdelivr.net. Los cuatro `.woff2` empiezan por `wOF2` y suman **81 960 bytes** (~80 KB, < 300 KB); sus tamaños coinciden con los que publica el paquete. Las dos licencias son la SIL Open Font License 1.1.
    - Se quita `FONTS_PENDING` de los tests de archivos (servir, licencias, tamaño), que ahora pasan; la mantienen los 5 de `@font-face` hasta T04. 448 tests en verde y 5 `xfail`; `ruff` y `mypy` sin avisos.
- [x] **T04** · `@font-face` en `styles.css` con `font-display: swap`; Montserrat en `h1`, `h2`, `.code`, `.total`, `.wordmark`; Roboto en `body`; lo que hoy es `font-weight: 600` pasa a `700`.
  - Los tests de T02 pasan.
  - *Cubre:* CA-02.
  - **Hecha (2026-10-27):** 4 `@font-face` con `font-display: swap`; Montserrat (800 en `h1`, 700 en `h2`) para títulos, código, total y `.wordmark` (aún sin usar, llega en T06); Roboto para el resto, con la pila del sistema detrás. Los tres `600` (etiquetas, leyenda del modo y botones) pasan a `700`. Se quita `FONTS_PENDING`: 453 tests en verde, sin `xfail`; `ruff` y `mypy` sin avisos.
    - Comprobado en Chrome con el servidor de vista previa: las cuatro letras quedan `loaded`, el título usa Montserrat y el texto Roboto, y ninguna petición sale de la app. Servidor parado y 8012 libre.

## Fase C · Colores y cabecera (plan §2.1, §2.3)

- [x] **T05** 🧪 · Tests en `tests/test_static.py`:
  - contraste: lee las variables de `:root` y del bloque oscuro de `styles.css` y comprueba cada par de la tabla del plan §2.1 (≥ 4,5:1 en texto, ≥ 3:1 en bordes de controles y foco);
  - cabecera: `index.html`, `profesor.html` y `alumno.html` tienen `<header class="brand">` con "AsistenciApp".
  - Deben fallar (colores y cabecera actuales).
  - *Cubre:* CA-01, CA-06.
  - **Hecha (2026-10-27):** 39 tests nuevos: 17 pares de colores × claro y oscuro, la fórmula de contraste con valores de referencia (blanco/negro 21:1; blanco sobre `#E6284E` 4,4:1), el rojo `#D01F45` (spec P1) y la cabecera en las tres páginas. Fallaron 14 (variables nuevas que aún no existen, el rojo y la cabecera); los demás pares ya cumplen hoy y quedan como red. 478 en verde y 14 `xfail` estrictos (`LOOK_PENDING`, que quita T06); `ruff` y `mypy` sin avisos.
    - La cabecera se busca solo dentro de `<body>`, porque el `<title>` también dice "AsistenciApp"; y el nombre debe aparecer una sola vez (plan §2.3).
    - La etiqueta "abierta" en oscuro usa el mismo `--accent` (`#FF5C7A` sobre `#3A1720`: 5,3:1), así que no hace falta el `#FF8FA3` que mencionaba el plan §2.1: una variable menos.
- [ ] **T06** · Variables nuevas en `styles.css` (claro y oscuro) y cabecera en las tres páginas; en `index.html` el `<h1>` pasa a la cabecera.
  - Los tests de T05 pasan.
  - *Cubre:* CA-01, CA-04, CA-06.

## Fase D · Piezas (plan §2.4, §2.5)

- [ ] **T07** · Botones (principal, `.secondary`, `.danger`, `.danger-solid`), tarjetas, etiquetas, campos y fondo.
  - Ningún botón baja de 44 px (los `.small`, 36 px como hoy).
  - *Cubre:* CA-03, CA-06, CA-07.

## Fase E · Revisión y cierre

- [ ] **T08** 👤 · Revisión manual en Chrome (plan §5), con el mismo montaje que T01:
  - claro y oscuro, 400 px y escritorio, las tres páginas y los dos modos de clase;
  - sin desplazamiento horizontal a 400 px;
  - recorrido con el teclado: el foco se ve en todos los controles;
  - letra calculada Montserrat/Roboto;
  - pestaña Red: solo peticiones a la app;
  - capturas "después" para Victor, que da el visto bueno.
  - Parar el servidor y comprobar que el puerto queda libre.
  - *Cubre:* CA-01 a CA-08 (parte manual).
- [ ] **T09** · Cierre:
  - README: de dónde vienen las letras y su licencia;
  - AGENT.md: estado;
  - lista de comprobación de `ARCHITECTURE.md` (§13) y de la constitución (plan §6);
  - `pytest`, `ruff` y `mypy` en verde; `git diff` sin cambios en `profesor.js` ni `alumno.js`; puertos libres.
  - *Cubre:* CA-05.
