# Plan técnico 679 · Formato de specs e historial

> Estado: **Implementado** (2026-10-30) · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-30

Issue: #679.

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre. El código de la app no se toca.

---

## 1. Visión general

- Nace `specs/000-historial/` con `specs.md`, `enmienda.md` y `resumenes/001-004.md`.
- Las specs nuevas se llaman `specs/<issue>-nombre/`. Esta es la primera: `specs/679-formato-de-specs-e-historial/`.
- La constitución pasa a 4.1: §4, §5 y §6 cortos, sin tabla de historial.
- `AGENTS.md` y `docs/ARCHITECTURE.md` se ajustan.

Un `000` nunca choca con una issue: GitHub no da la issue 0.

---

## 2. Decisiones

### 2.1 Nombre y orden (CA-01 a CA-03)

- `AGENTS.md` §3: «Las specs nuevas se llaman `<issue>-nombre-en-kebab-case`, con el número de la issue que las abre: `679-formato-de-specs-e-historial`. Una issue, una spec. Las specs `001` a `008` conservan su nombre.»
- Orden: `001` a `008`, después por número de issue. Lo recoge `specs.md`.
- `AGENTS.md` §1 (punto 4) y §2.1: `specs/NNN-nombre/` pasa a `specs/<issue>-nombre/`.

### 2.2 Regla de resúmenes (CA-04 a CA-07)

`AGENTS.md` §3 gana:

> Cuando hay **8 specs sin resumir**, las **4 más antiguas** se resumen en `specs/000-historial/resumenes/<primera>-<última>.md`. No cuentan `000-historial`, los resúmenes ni las specs descartadas. Las specs resumidas **no se editan ni se borran**. Quien empieza una tarea lee el resumen en vez de esas 4 specs. El resumen lo escribe el agente en el momento 4 de la spec que hace llegar a 8 las specs sin resumir, en la misma pull request.

Cada resumen tiene, por spec: enlace a la original, **qué resolvió** (una o dos frases), **decisiones vigentes** y **qué cambió después** (con la spec que lo cambió).

El resumen `001-004.md` se escribe leyendo las cuatro specs. Ni este fichero ni `specs.md` copian el título de la spec 004: `tests/test_personal_references.py` (CA-02 de la spec 004) busca ese nombre en todos los `.md` salvo la carpeta de esa spec. Se usa el nombre de carpeta, `quitar-referencias-personales`.

Quién y cuándo (CA-20): el agente, en el momento 4 de la spec que hace llegar a 8 las specs sin resumir, dentro de esa misma pull request. La regla de `AGENTS.md` §3 termina con esa frase.

### 2.3 `specs/000-historial/specs.md` (CA-08, CA-10)

Una tabla con estas columnas: `ID` · `Nombre` · `Issue` · `Fecha` · `Tipo` · `Estado` · `Resumida en` · `Notas`.

- Filas de `001` a `008` y `679`. La issue, solo si consta en la spec. La fecha, la de creación.
- Tipo: `001` y `006` son **funcionalidad**; `002`, `003`, `004`, `005`, `007` y `679` son **proceso**; `008` es **funcionalidad** (cambia el freno).
- `001` a `004`: «Resumida en» = `resumenes/001-004.md`.
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

En el árbol de `docs/ARCHITECTURE.md`, `specs/` muestra `000-historial/` (con `specs.md`, `enmienda.md` y `resumenes/`) y `<issue>-nombre/` en lugar de `NNN-nombre/`.

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
| CA-02, CA-06 | `git diff` sin cambios en `specs/001-…` a `specs/008-…`. `tests/test_personal_references.py` sigue pasando |
| CA-04, CA-07, CA-20 | Leer la regla en `AGENTS.md` §3 y que existe `resumenes/001-004.md` |
| CA-05 | Leer `resumenes/001-004.md`: cuatro apartados con enlace, qué resolvió, decisiones vigentes y qué cambió |
| CA-08, CA-10 | Leer `specs.md` y `AGENTS.md` §7 |
| CA-09 | `enmienda.md` tiene de la 1.0 a la 4.1. `CONSTITUTION.md` no tiene la tabla |
| CA-11 a CA-13 | Leer `AGENTS.md` §2.1 |
| CA-14, CA-15 | Leer §4, §5 y §6: sin `pytest`, sin ejemplos, sin «spec 008» |
| CA-16 | `test_constitution_names_the_new_folders` busca `Versión 4.1` |
| CA-17, CA-18 | Leer `AGENTS.md`: línea 5 y momento 2 iguales; ni la frase del §2 ni la del §4 |
| CA-19 | `pytest` |
