# Plan técnico 679 · Formato de specs e historial

> Estado: **Implementado** (2026-11-03) · Spec: [spec.md](spec.md) v1.3 · Creado: 2026-10-30

Issue: #679.

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre. Lo que hace la app no cambia: en el código y en los tests solo cambian comentarios.

---

## 1. Visión general

- Nace `specs/000-historial/` con `specs.md`, `enmienda.md` y `resumen.md`.
- Las specs nuevas se llaman `specs/<issue>-nombre/`. Esta es la primera: `specs/679-formato-de-specs-e-historial/`.
- La constitución pasa a 4.1: §4, §5 y §6 cortos, sin tabla de historial.
- `AGENTS.md` y `docs/ARCHITECTURE.md` se ajustan.
- Se borran `001` a `004`, ya resumidas, con enlaces permanentes (v1.3).
- Ni los tests ni los comentarios del código nombran specs (v1.3).

Un `000` nunca choca con una issue: GitHub no da la issue 0.

---

## 2. Decisiones

### 2.1 Nombre y orden (CA-01 a CA-03)

- `AGENTS.md` §3: «Las specs nuevas se llaman `<issue>-nombre-en-kebab-case`, con el número de la issue que las abre: `679-formato-de-specs-e-historial`. Una issue, una spec. Las specs `001` a `008` conservan su nombre.»
- Orden: `001` a `008`, después por número de issue. Lo recoge `specs.md`.
- `AGENTS.md` §1 (punto 4) y §2.1: `specs/NNN-nombre/` pasa a `specs/<issue>-nombre/`.

### 2.2 Regla de resúmenes (CA-04 a CA-07)

`AGENTS.md` §3 gana:

> Cuando hay **8 specs sin resumir**, las **4 más antiguas** se resumen al final de `specs/000-historial/resumen.md`. No cuentan `000-historial`, el resumen ni las specs descartadas. Por cada spec, el resumen dice qué resolvió, qué decisiones siguen vigentes y qué cambió después, con un enlace a la original. Lo ya resumido **no se reescribe**: en un bloque escrito solo se actualizan sus enlaces y se añaden líneas en «Qué cambió después», con la spec que lo cambió. Si añadir un bloque haría pasar el fichero de **300 líneas**, se sigue en `resumen-2.md` (después `resumen-3.md`, y así). Las specs resumidas **se borran** en la misma pull request, sin editarlas antes, y cada enlace a ellas pasa a un enlace permanente a su carpeta en un commit de `staging` donde aún existe. El resumen lo escribe el agente en el momento 4 de la spec que hace llegar a 8 las specs sin resumir, en la misma pull request.

Cada bloque del resumen tiene, por spec: enlace a la original, **qué resolvió** (una o dos frases), **decisiones vigentes** y **qué cambió después** (con la spec que lo cambió).

El primer bloque, `## Specs 001 a 004`, se escribe leyendo las cuatro specs. Cada bloque abre con su fecha y la spec que lo escribió (CA-21). Ni este fichero ni `specs.md` copian el título de la spec 004: `tests/test_personal_references.py` (CA-02 de la spec 004) busca ese nombre en todos los `.md` salvo la carpeta de esa spec. Se usa el nombre de carpeta, `quitar-referencias-personales`.

Quién y cuándo (CA-20): el agente, en el momento 4 de la spec que hace llegar a 8 las specs sin resumir, dentro de esa misma pull request. La regla de `AGENTS.md` §3 termina con esa frase.

### 2.3 `specs/000-historial/specs.md` (CA-08, CA-10)

Una tabla con estas columnas: `ID` · `Nombre` · `Issue` · `Fecha` · `Tipo` · `Estado` · `Resumida en` · `Notas`.

- Filas de `001` a `008` y `679`. La issue, solo si consta en la spec. La fecha, la de creación.
- Tipo: `001` y `006` son **funcionalidad**; `002`, `003`, `004`, `005`, `007` y `679` son **proceso**; `008` es **funcionalidad** (cambia el freno).
- `001` a `004`: «Resumida en» = `resumen.md`.
- `006`: la nota de `AGENTS.md` §7 («El recuento, la duración del bloqueo y la IP con túnel los cambia la 008»).
- La tabla de `AGENTS.md` §7 desaparece. El §7 queda en una línea: «El estado de cada spec y la spec activa están en `specs/000-historial/specs.md`. El agente actualiza esa tabla cada vez que una spec cambia de fase.»

### 2.4 `specs/000-historial/enmienda.md` (CA-09, CA-16)

- Se mueve, con el mismo texto, la tabla «Historial de enmiendas» de `docs/CONSTITUTION.md`, de la 1.0 a la 4.0.
- Fila nueva **4.1** (2026-10-30): §4, §5 y §6 resumidos; §6 sin nombrar specs; el historial sale a este fichero; las specs de funcionalidad comprueban el propósito. Motivo: issue #679.
- Por qué 4.1 y no 5.0: según §8, se sube la mayor si se elimina o contradice un principio. P1–P6 no cambian y la comprobación del propósito es un añadido.

### 2.5 Constitución 4.1 (CA-14 a CA-16)

- Cabecera: `Versión 4.1 · Ratificada: 2026-10-19 · Última enmienda: 2026-10-30`.
- **§4**, texto acordado:

  > ## 4. Forma de trabajo: desarrollo guiado por especificaciones (SDD)
  >
  > El proyecto se trabaja con **SDD**: primero se escribe **qué** se quiere y **por qué**, después **cómo**, después los **pasos**, y solo entonces se cambia nada.
  >
  > - **Ningún fichero de esta carpeta cambia sin una spec que lo cubra.**
  > - Toda spec sirve al propósito (§1). Si no, no sigue adelante.
  > - La spec dice el qué y el porqué; el plan, el cómo, y comprueba esta constitución; las tareas, los pasos.
  > - Las dudas se resuelven antes de implementar. No se inventan requisitos.
  >
  > Cómo se aplica día a día está en `AGENTS.md`.

- **§5**, texto acordado:

  > - Todo lo que pide una spec se comprueba: con un test o, si no se puede automatizar, a mano.
  > - Los tests pasan antes de dar algo por terminado.
  > - Los errores que ve el usuario son claros y dicen qué hacer.

- **§6**, texto acordado:

  > - Los códigos de asistencia **caducan** y no se pueden adivinar **a mano** antes de caducar.
  > - Hay un **freno** contra quien prueba códigos sin parar: cuenta los fallos y bloquea **un tiempo**. **Nunca** puede impedir que la clase pase lista.
  > - Un mismo alumno no puede registrarse dos veces en la misma sesión.
  > - Una sesión cerrada no acepta más registros.
  > - Toda entrada del usuario se valida en el servidor y se escapa al mostrarla.

- **§8**: «Cada enmienda sube la versión (…) y se anota en `specs/000-historial/enmienda.md` con fecha y motivo.» Sale la subsección «Historial de enmiendas» con su tabla.
- P1–P6, §1, §3 y §7 no cambian.
- `tests/test_architecture.py`: `Versión 4.0` pasa a `Versión 4.1`. Las frases de P4 que busca siguen.

### 2.6 Comprobación del propósito (CA-11 a CA-13)

`AGENTS.md` §2.1:

- La estructura de `spec.md` gana, al principio, **Tipo** (`funcionalidad` o `proceso`) y, solo en las de funcionalidad, **Para qué sirve**: a cuál de los dos objetivos de la constitución §1 sirve (ahorrar tiempo al profesor o dejar constancia de quién asistió).
- Una funcionalidad es lo que cambia lo que ven o hacen el profesor o el alumno. Lo demás es proceso.
- Si una funcionalidad no sirve a ninguno: `[NECESITA ACLARACIÓN]`, no se escriben ni plan ni tareas, y quien trabaja en la carpeta decide: **descartarla** (fila «Descartada» en `specs.md`), **reformularla** o **enmendar el propósito** (§8, versión mayor).

### 2.7 El manual sin el detalle del orquestador (CA-17, CA-18)

- La línea 5 de `AGENTS.md` y el momento 2 no cambian.
- Sale del §2: «El orquestador de git (`agents/git-workflow-agent.md`) encadena los pasos **de un mismo momento** sin pedir un sí, pero tampoco pasa al siguiente.» Esa regla ya está en el propio orquestador.
- Sale del §4: «Las únicas dependencias de Python son Flask y pytest. Las herramientas externas (`cloudflared`, `git`, `gh`, el MCP de GitHub) están en la constitución P3. Los scripts de `tools/` son de bash: en Windows, se lanzan desde Git Bash.» La tabla de comandos se queda.
- §2.4: «(constitución §4.1)» pasa a «(constitución §4)».
- §6, definición de terminado: gana «La fila de la spec en `specs/000-historial/specs.md` está al día».

### 2.8 Arquitectura

En el árbol de `docs/ARCHITECTURE.md`, `specs/` muestra `000-historial/` (con `specs.md`, `enmienda.md` y `resumen.md`) y `<issue>-nombre/` en lugar de `NNN-nombre/`.

### 2.9 Borrar `001` a `004` con enlaces permanentes (CA-02, CA-06, CA-07, CA-22)

- Se borran las carpetas `specs/001-checkin-codigo/`, `specs/002-spec-antes-del-cambio/`, `specs/003-activar-el-entorno/` y `specs/004-quitar-referencias-personales/`.
- Commit fijo: `90d8be4e` (`90d8be4e5f19ef4d3bab29dacdc29904393a2e82`), de `staging`, que tiene las cuatro carpetas. Un commit de `staging` no se pierde con un squash ni al borrar ramas.
- Enlace de cada spec: `https://github.com/venturars/neoland-102026/tree/90d8be4e5f19ef4d3bab29dacdc29904393a2e82/staff/ventura-rodriguez/asistenciapp/specs/<carpeta>`.
- Cambian a ese enlace:
  - `specs.md`: la columna «Nombre» de `001` a `004`, y la nota «Borrada el 2026-11-03».
  - `resumen.md`: los encabezados `### 001` a `### 004`.
  - `README.md`: la línea que enlaza `specs/001-checkin-codigo/`.
- `specs.md` y `resumen.md` dejan de decir que las specs resumidas «no se editan ni se borran» o «siguen intactas».

### 2.10 Qué se toca de un bloque escrito (CA-23)

En el bloque `Specs 001 a 004` de `resumen.md` solo cambian los cuatro enlaces y se añaden líneas en «Qué cambió después»:

- En las cuatro: «La **679** la borró; está en su enlace permanente.»
- En la `004`, además: «La **679** quitó el test que leía las notas de la `001`; el test de nombres ya no excluye ninguna carpeta.»
- La frase de la `004` sobre `tests/test_personal_references.py` no se reescribe: la corrige la línea nueva.

### 2.11 El README sin specs borradas

- La línea que enlaza la especificación pasa a enlazar el historial: `specs/000-historial/specs.md`.
- La sección de tests deja de enlazar `specs/001-…/plan.md §6`. Pasa a: «Cada spec tiene en su `plan.md` una tabla que dice qué test comprueba cada criterio. Las specs ya resumidas se consultan desde [el historial](specs/000-historial/specs.md).»

### 2.12 Tests y código sin specs (CA-24, CA-25)

- `tests/test_personal_references.py`:
  - Sale `test_notes_keep_the_date_and_the_result` y su `PRESERVED`: leía `specs/001-…`, que ya no existe.
  - `_markdown_files` deja de excluir `specs/004-…`. Con la `004` borrada, ningún `.md` nombra a esa persona, así que el test de nombres sigue pasando sin excepciones.
- En los comentarios y docstrings de `tests/`, `app.py`, `asistencia/` y `static/` salen los `CA-xx`, `Txx`, «spec 00x», «plan §x» y sus paréntesis. Queda la parte que describe. Ejemplos:
  - `# ---------- T06 · base y acceso del profesor (CA-15, CA-17) ----------` → `# ---------- base y acceso del profesor ----------`
  - `def test_create_session_with_title(client, teacher):  # CA-01` → sin el comentario.
  - `// Todo texto que viene del servidor se pinta con textContent (CA-12).` → `// Todo texto que viene del servidor se pinta con textContent.`
- Lo que hace cada test y cada función no cambia. Sale un test: `pytest` pasa con 113.
- Comprobación: `grep -rnE "CA-[0-9]|[Ss]pec 0|plan §|specs/|T[0-9]{2} ·|\(T[0-9]{2}|T[0-9]{2}\)" tests app.py asistencia static` no encuentra nada (sin contar `__pycache__`). El patrón no usa `T[0-9]{2}` suelto: también casaría con las fechas de los tests (`2026-10-23T09:00`).

---

## 3. Comprobación de la constitución

| Regla | Cómo la cumple |
| --- | --- |
| §1 | Spec de tipo proceso: no cambia lo que ven el profesor ni el alumno |
| P1–P2 | Sin código nuevo. Un índice y un resumen en vez de leer ocho specs |
| P3 | Sin dependencias nuevas |
| P4–P5 | No cambian |
| P6 | Todo en español |
| §4 | Esta spec, su plan y sus tareas cubren cada fichero que cambia |
| §5 | Cada CA tiene un test o una comprobación manual (§4 de este plan) |
| §6 | No cambia de fondo: el texto se resume |
| §7 | Solo se edita `staff/ventura-rodriguez/asistenciapp/` |
| §8 | Enmienda 4.1, anotada en `enmienda.md`. La aprueba quien trabaja en esta carpeta |

---

## 4. Comprobación

| Criterio | Test o paso |
| --- | --- |
| CA-01, CA-03 | Leer `AGENTS.md` §3 y el orden de `specs.md` |
| CA-02, CA-06, CA-07 | `specs/001-…` a `specs/004-…` no existen; `git diff` sin cambios en `specs/005-…` a `specs/008-…` |
| CA-22 | Abrir los cuatro enlaces permanentes y el del README: cargan la carpeta |
| CA-23 | Leer el bloque `Specs 001 a 004`: solo cambian los enlaces y hay líneas nuevas en «Qué cambió después» |
| CA-24, CA-25 | El `grep` del §2.12 no encuentra nada |
| CA-04, CA-07, CA-20, CA-21 | Leer la regla en `AGENTS.md` §3; existe `resumen.md` con el bloque `Specs 001 a 004` y no pasa de 300 líneas |
| CA-05 | Leer `resumen.md`: cuatro apartados con enlace, qué resolvió, decisiones vigentes y qué cambió |
| CA-08, CA-10 | Leer `specs.md` y `AGENTS.md` §7 |
| CA-09 | `enmienda.md` tiene de la 1.0 a la 4.1. `CONSTITUTION.md` no tiene la tabla |
| CA-11 a CA-13 | Leer `AGENTS.md` §2.1 |
| CA-14, CA-15 | Leer §4, §5 y §6: sin `pytest`, sin ejemplos, sin «spec 008» |
| CA-16 | `test_constitution_names_the_new_folders` busca `Versión 4.1` |
| CA-17, CA-18 | Leer `AGENTS.md`: línea 5 y momento 2 iguales; ni la frase del §2 ni la del §4 |
| CA-19 | `pytest`: 113 tests en verde |
