# Plan técnico 008 · Aspecto de Neoland

> Estado: **Aprobado v1.1 (2026-10-28)** · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-28

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué requisitos (`RF-n`) y criterios (`CA-xx`) cubre.

---

## 1. Visión general

El cambio es casi todo de `static/styles.css`: las variables de color, tipografía y radios pasan a ser las de neoland.es, y cada regla de hoy se ajusta a esas variables. Los selectores no cambian, así que `profesor.js` y `alumno.js` siguen pintando las mismas clases y **no se tocan** (RF-9, CA-01). El HTML solo cambia en tres sitios pequeños: dos etiquetas pasan a una clase nueva y la tarjeta del código gana una clase.

Las tipografías se guardan como archivos en `static/fonts/` y las sirve la propia app (RF-10, CA-06). No se añade ninguna dependencia.

---

## 2. Decisiones

### 2.1 Variables de `styles.css` (RF-1, RF-2, RF-3, RF-7)

Medidas en neoland.es el 2026-10-28 con los estilos calculados del navegador.

| Variable | Claro | Oscuro | Para qué |
| --- | --- | --- | --- |
| `--bg` | `#F5F5F5` | `#262626` | fondo de la página |
| `--surface` | `#FFFFFF` | `#333333` | tarjetas |
| `--text` | `#3A3A3A` | `#F2F2F2` | texto |
| `--heading` | `#000000` | `#FFFFFF` | títulos |
| `--muted` | `#6B6B6B` | `#BDBDBD` | texto secundario |
| `--border` | `#E5E5E5` | `#4A4A4A` | bordes de campos y separadores |
| `--accent` | `#E6284E` | `#E6284E` | rellenos, bordes y foco (texto blanco encima solo a 18 px en negrita) |
| `--accent-ink` | `#C41E42` | `#FF6B86` | carmesí para texto pequeño y botones pequeños rellenos |
| `--accent-text` | `#FFFFFF` | `#FFFFFF` | texto sobre carmesí |
| `--charcoal` | `#333333` | `#1F1F1F` | banda del código |
| `--accent-on-dark` | `#FF6B86` | `#FF6B86` | carmesí para texto sobre la banda oscura (v1.1) |
| `--font-heading` | `"Montserrat", system-ui, sans-serif` | igual | títulos y números del código |
| `--font-body` | `"Roboto", system-ui, -apple-system, "Segoe UI", sans-serif` | igual | todo lo demás |
| `--radius-card` | `25px` | igual | tarjetas, como neoland.es |
| `--radius-field` | `12px` | igual | campos y filas de la lista del alumno (14 px) |
| `--radius-pill` | `999px` | igual | botones y estados |

`--ok-*`, `--warn-*` y `--error-*` se quedan con sus colores de hoy (RF-6). `--danger` pasa a ser `--accent-ink`.

**Contraste (RF-11, CA-04).** Blanco sobre `#E6284E` da 4,4:1. Vale para texto grande (18 px en negrita), así que los botones principales usan 18 px en negrita, como en neoland.es («Saber más»: 18 px, 700). En botones pequeños rellenos y en texto carmesí pequeño se usa `--accent-ink` (`#C41E42`, 5,8:1 sobre blanco; `#FF6B86`, 4,6:1 sobre `#333333`). Cada par se comprueba con un script en las tasks.

### 2.2 Reglas que cambian en `styles.css` (RF-2 a RF-7)

- **Base:** `body` en `--font-body`; `h1` y `h2` en `--font-heading`, peso 800 y color `--heading` (`h1` 2 rem, `h2` 1,35 rem).
- **`.card`:** `--surface`, sin borde ni sombra, radio `--radius-card`. `.list.card` y `.section-head` mantienen su separación (RF-25 de la spec 007).
- **Campos** (`input`, `select`, `textarea`): fondo `--bg`, borde 1 px `--border`, radio `--radius-field`; al enfocarlos, borde `--accent`.
- **Botones:**
  - `button` y `.button`: píldora, 18 px, peso 700, relleno `--accent`;
  - `.secondary`: transparente, borde 2 px `--text`, texto `--text`;
  - `.danger`: transparente, borde 2 px `--accent`, texto `--accent-ink`;
  - `.danger-solid`: relleno `--accent-ink`;
  - `.small`: 14 px y relleno `--accent-ink` si no es secundario ni de peligro.
- **Foco:** contorno de 3 px en `--accent` (P5).
- **`.badge`:** píldora con los colores de hoy («abierta» verde, «cerrada» gris).
- **`.message`:** radio 16 px y los colores de hoy.
- **Banda del código** (RF-4), con `.card.dark`:
  - fondo `--charcoal` y texto blanco;
  - `.code` en `--font-heading` 800, blanco;
  - `.countdown` en gris claro;
  - `.link-box` oscura con borde `#4A4A4A`;
  - los botones `.secondary` dentro, con borde y texto blancos;
  - el `label` del enlace, en gris claro.
- **`.eyebrow`** (nueva, RF-5): Roboto 700, 0,8 rem, mayúsculas, espaciado 0,06 em, color `--accent-ink` (en la banda oscura, `--accent-on-dark`).
- **Lista del alumno** (`.roster`): filas con radio 14 px y borde `--border`; registradas tachadas y atenuadas, como hoy.
- **Casillas** (`.boxes`): «×» en píldora secundaria; con problema, borde `--accent` y nota en `--accent-ink`.
- **Móvil:** con menos de 480 px, `--radius-card` baja a 20 px y `h1` a 1,7 rem (CA-05).

### 2.3 Tipografías dentro de la app (RF-2, RF-10, CA-06)

Archivos de `@fontsource/montserrat` y `@fontsource/roboto` **5.3.0** (licencia OFL-1.1, que permite incluirlas en la app si va su licencia), desde cdn.jsdelivr.net, subconjunto «latin» (incluye á, é, í, ó, ú, ñ, ü, ¿ y ¡):

| Archivo en `static/fonts/` | Origen | Tamaño |
| --- | --- | --- |
| `montserrat-latin-800-normal.woff2` | `@fontsource/montserrat@5.3.0/files/` | 19 012 bytes |
| `roboto-latin-400-normal.woff2` | `@fontsource/roboto@5.3.0/files/` | 21 884 bytes |
| `roboto-latin-500-normal.woff2` | `@fontsource/roboto@5.3.0/files/` | 22 200 bytes |
| `roboto-latin-700-normal.woff2` | `@fontsource/roboto@5.3.0/files/` | 22 240 bytes |
| `OFL-Montserrat.txt` | `@fontsource/montserrat@5.3.0/LICENSE` | 4 509 bytes |
| `OFL-Roboto.txt` | `@fontsource/roboto@5.3.0/LICENSE` | 4 512 bytes |

- Se descargan solo con tu sí, en su propia tarea.
- `@font-face` al principio de `styles.css`, con `src: url("fonts/…woff2") format("woff2")` y `font-display: swap`. Si no cargan, se ven las tipografías del sistema (RF-10).
- El peso 600 de hoy pasa a 500 (etiquetas) o 700 (botones), los pesos que se incluyen.
- Flask ya sirve `.woff2` como `font/woff2` desde `static/`; no hace falta tocar `app.py`.

### 2.4 Cambios en el HTML (RF-4, RF-5)

Solo clases, nada de textos (RF-9):

- `alumno.html`: `<p class="muted small">Pasar lista</p>` pasa a `<p class="eyebrow">Pasar lista</p>`. El `style="margin-top:1rem"` de la etiqueta «Escribe tu nombre» pasa a una clase.
- `profesor.html`: `<div id="code-card" class="card">` pasa a `class="card dark"`, y la etiqueta «Código para pasar lista» pierde su `style` y pasa a `class="eyebrow"`.
- `index.html`: sin cambios; se ve con las reglas nuevas.

`profesor.js` y `alumno.js` no cambian.

### 2.5 Documentación

- `README.md`: una línea con el aspecto de Neoland, y que las tipografías están en `static/fonts/` con su licencia.
- `AGENTS.md`: `fonts/` en el árbol de §3 y la fila de la spec 008 en §8.

---

## 3. Archivos

| Archivo | Cambio |
| --- | --- |
| `specs/008-estilo-neoland/` | `plan.md`, `tasks.md` |
| `static/fonts/` | **Nuevo**: 4 tipografías y 2 licencias (§2.3) |
| `static/styles.css` | Variables, `@font-face` y reglas (§2.1, §2.2) |
| `static/profesor.html`, `static/alumno.html` | Clases (§2.4) |
| `README.md`, `AGENTS.md` | §2.5 |
| `tests/test_contrast.py` | **Nuevo** (v1.1): lee las variables de `styles.css` y comprueba el contraste de cada par en claro y oscuro (CA-04) |

No cambian `app.py`, `asistencia/`, `profesor.js`, `alumno.js`, `index.html` ni los tests que ya existen.

---

## 4. Plan de pruebas

| CA | Cómo se comprueba |
| --- | --- |
| CA-01 | `pytest` completo en verde sin tocar tests; `git diff --stat` sin cambios en `.js` ni `.py`; en el navegador, recorrer crear y editar un grupo, sesión rápida y con grupo, registrarse, liberar, cerrar, decidir sobre un nuevo y descargar |
| CA-02 | Capturas de inicio, panel, «Nuevo grupo», «Editar grupo» (con «Repetido» y «Subir igualmente»), sesión abierta con grupo, sesión cerrada con un nuevo, sesión rápida y página del alumno (formulario rápido, código y lista), comparadas con neoland.es |
| CA-03 | Las mismas capturas en modo oscuro |
| CA-04 | `tests/test_contrast.py`: calcula el contraste de cada par de variables (texto y fondo, texto de botón y relleno, etiqueta sobre la banda oscura, mensajes) en claro y oscuro; todos AA (3:1 solo para el texto blanco de 18 px en negrita sobre `--accent`) |
| CA-05 | Capturas a 400 px y comprobación de que no hay desplazamiento lateral (`scrollWidth` ≤ ancho); recorrido con el teclado (Tab, Intro) con el foco visible |
| CA-06 | En el navegador, `document.fonts` dice que Montserrat 800 y Roboto 400/500/700 están cargadas, y la lista de peticiones solo tiene `localhost` |

Al terminar, parar la app y comprobar con `lsof -nP -iTCP:<puerto> -sTCP:LISTEN` que el puerto queda libre (`AGENTS.md` §5).

---

## 5. Comprobación de la constitución

| Regla | Cómo la cumple el plan |
| --- | --- |
| P1 · Independiente de la plataforma | No cambia. |
| P2 · Simplicidad | Solo CSS y tres clases en el HTML; los mismos selectores, sin JavaScript nuevo. |
| P3 · Dependencias mínimas | Las tipografías son archivos que sirve la app, no dependencias de código: `requirements.txt` no cambia y no se instala nada. |
| P4 · Privacidad mínima | No se guarda nada nuevo. Las tipografías se sirven desde la app: ningún navegador pide nada a Google ni a otro servicio. |
| P5 · Accesible y móvil | Contraste AA medido en claro y oscuro, foco visible, botones de al menos 44 px (36 px los pequeños, como hoy), probado a 400 px. |
| P6 · Todo en español | Los textos no cambian. |
| §3 Stack | Sin cambios: HTML, CSS y JS sin frameworks. |
| §4 SDD | Spec 008 aprobada; este plan, luego tasks, luego el cambio. |
| §7 Alcance | Todo dentro de `staff/ella-deyavorsky/asistenciapp/`. |

---

## 6. Riesgos

- **Los botones principales crecen** a 18 px. En móvil, alguna fila con varios botones puede pasar a dos líneas; ya tienen `flex-wrap`. Se revisa en las capturas a 400 px.
- **Rama sobre la spec 007.** Si la PR #540 cambia sus pantallas antes de fusionarse, esta rama tendrá que incorporar esos cambios.
- **Licencia de las tipografías.** OFL-1.1 obliga a incluir la licencia junto a los archivos; van en `static/fonts/`.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-28 | Borrador inicial | Spec 008 v1.0 aprobada |
| 1.0 | 2026-10-28 | Aprobado | Ok de la persona que trabaja en esta carpeta |
| 1.1 | 2026-10-28 | El contraste se comprueba con un test nuevo, `tests/test_contrast.py`, en vez de un script suelto (§3, §4); variable `--accent-on-dark` para la etiqueta sobre la banda (§2.1, §2.2) | Al desglosar las tareas: así la comprobación se queda y vuelve a pasar en cada cambio |
