# Plan técnico 009 · Alinear el flujo de git con la plantilla

> Estado: **Implementado** (2026-11-05) · Spec: [spec.md](spec.md) v1.0 (aprobada 2026-11-05) · Creado: 2026-11-05 · Aprobado: 2026-11-05 · Issue: [#1145](https://github.com/venturars/neoland-102026/issues/1145)

> Nota: la copia ya está en la rama `1145-chore-align-asistenciapp-git-workflow` (commit `0d018e3d`), subida antes de escribir el spec. Este plan la describe y añade los pasos que faltan para cerrar los criterios.

Este documento explica **cómo** se cumple la spec. No hay modelo de datos, rutas ni dependencias nuevas. No se añade ningún paquete, así que no hay sección de Socket. La comprobación es manual, más `pytest` para ver que la app no se ha movido.

---

## 1. Visión general

La plantilla `exercises/git-workflow-agent-template` es la fuente de la verdad. Se copian a `staff/sergio-cortes/asistenciapp/` los ficheros de flujo que han cambiado. La plantilla no se edita. Las únicas diferencias que quedan son las rutas propias de esta carpeta. Y las herramientas de esa carpeta, incluida la que abre pull requests, quedan ejecutables.

---

## 2. Decisiones

### 2.1 Qué se copia (CA-01)

Se copian desde la plantilla, con su texto:

- `agents/`: siete ficheros.
- `skills/`: quince skills.
- `tools/`: ocho scripts.
- `templates/issues/`: siete plantillas (feat, fix, chore, docs, refactor, test, knowledge).
- `templates/pull-request/`: siete plantillas, del mismo tipo.

`MCPS/github-mcp-server/mcp.txt` ya es idéntico y no cambia.

Quedan **nueve** ficheros de flujo con cambio real frente a la versión anterior de la copia: cuatro agentes, cinco skills (`commit-changes`, `create-draft`, `create-pr-base-staging`, `grill-me`, `grill-with-docs`), dos plantillas nuevas de `knowledge` y el script `create-pr-base-staging.sh`.

### 2.2 Rutas propias (CA-02)

La plantilla usa `./tools/...` y `bash ./exercises/git-workflow-agent-template/tools/...`. En esta carpeta esas rutas pasan a `staff/sergio-cortes/asistenciapp/tools/...`. Son **ocho** skills con una sola línea distinta:

- `check-status`, `pull-changes`, `create-branch-from-staging`, `create-branch`, `create-empty-commit`, `commit-changes`, `launch-push` (la línea `./tools/...`).
- `create-pr-base-staging` (la línea `bash ./exercises/...`).

Ningún otro texto se cambia. La skill `link-pr-to-issue` se copia igual.

### 2.3 Permiso ejecutable (CA-04, CA-05)

`tools/create-pr-base-staging.sh` se copia y se marca como ejecutable en disco (`chmod +x`) y en el índice de Git (`git update-index --chmod=+x`). Git lo registra como `100755`. El resto de herramientas ya era `100755`.

El script no cambia en contenido. Con el sin argumentos sale con código 1 y muestra el mensaje de uso.

### 2.4 Diferencia temporal con la plantilla (CA-06)

Hasta que se fusione la PR [#1143](https://github.com/venturars/neoland-102026/pull/1143), `staging` tiene el script en `100644`. La copia de esta carpeta ya está en `100755`. Es la única diferencia entre las dos, y se elimina al fusionar #1143. No se edita la plantilla desde aquí.

### 2.5 Manual de la carpeta (CA-07)

`AGENTS.md` solo cambia en la tabla §7, con la fila de esta spec. La tabla se actualiza en cada cambio de fase, como dice el propio manual. No se toca nada más del manual.

Antes de cerrar, hay que comprobar que el §2 de `AGENTS.md` sigue siendo coherente con `agents/git-workflow-agent.md` copiado. Si no lo es, se para y se propone el cambio en este plan, sin editarlo a ciegas.

### 2.6 Lo que no se toca (CA-07, CA-08)

No se modifican `app.py`, `asistencia/`, `static/`, `tests/`, `requirements.txt` ni `README.md`. No entran `test.py` ni `contextlibtest.py`. No se edita `exercises/git-workflow-agent-template`. Tampoco se toca nada fuera de `staff/sergio-cortes/asistenciapp/`.

---

## 3. Comprobación manual

Cada criterio de la spec tiene al menos un paso verificable.

| Criterio | Qué mirar |
| --- | --- |
| CA-01 | `diff -r` entre `exercises/git-workflow-agent-template/{agents,skills,templates,tools}` y las mismas carpetas de la app. Solo deben diferir las **ocho** skills de §2.2, cada una en su línea de comando. Ningún otro fichero difiere |
| CA-02 | `grep` de `` `./tools/ `` y de `exercises/git-workflow-agent-template` en `staff/sergio-cortes/asistenciapp/skills/` no devuelve nada. Las ocho líneas apuntan a `staff/sergio-cortes/asistenciapp/tools/` |
| CA-03 | `git diff --quiet origin/staging...HEAD -- exercises/` sale con código 0 |
| CA-04 | `git ls-files -s staff/sergio-cortes/asistenciapp/tools/` muestra `100755` en los ocho scripts |
| CA-05 | Ejecutar `./staff/sergio-cortes/asistenciapp/tools/create-pr-base-staging.sh` sin argumentos. Debe mostrar el mensaje de uso, salir con código 1 y no mostrar `Permission denied` |
| CA-06 | Al fusionar #1143, `git ls-files -s` de `exercises/.../create-pr-base-staging.sh` en `staging` muestra `100755`, igual que la copia. Se marca entonces |
| CA-07 | `git diff --name-only origin/staging...HEAD` lista solo ficheros de `staff/sergio-cortes/asistenciapp/`: agentes, skills, plantillas, `tools/`, `AGENTS.md` y `specs/009-…`. Ninguno de `app.py`, `asistencia/`, `static/`, `tests/`, `requirements.txt` ni `README.md` |
| CA-08 | `pytest` en `staff/sergio-cortes/asistenciapp/` pasa con 96 tests |

---

## 4. Comprobación de la constitución (v2.5)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de la plataforma | Sí | No se toca el registro de asistencia ni ninguna plataforma |
| P2 Simplicidad | Sí | Se copia un flujo que ya existe. No se crea ninguna abstracción |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia. `requirements.txt` no cambia |
| P4 Privacidad | Sí | No se guarda ningún dato nuevo |
| P5 Accesible y móvil | Sí | No se tocan pantallas |
| P6 Español | Sí | Spec, plan, `AGENTS.md` y el texto copiado están en español |
| §3 Stack | Sí | El stack no cambia |
| §4 SDD | **Con nota** | El spec está aprobado antes de la fase de plan. La copia se subió antes de escribir el spec (commit `0d018e3d`). El plan lo reconoce y la comprobación de CA-01 a CA-08 se hace contra el spec aprobado. Ver §5, punto 1 |
| §5 Calidad | Sí | Cada criterio tiene un paso en §3. `pytest` se ejecuta antes de cerrar |
| §6 Seguridad | Sí | No se toca el registro, los códigos ni el límite por conexión |
| §7 Alcance | Sí | Todo queda en `staff/sergio-cortes/asistenciapp/`. La plantilla no se edita |
| §8 Enmiendas | Sí | No hay enmiendas a la constitución en este cambio |

---

## 5. Decisiones tomadas

1. **Copia antes del spec** (2026-11-05): la copia se subió antes de escribir el spec. No se revierte. Se documenta aquí y en la PR, y el spec se aprobó con ese estado conocido.
2. **Script ejecutable en la copia** (2026-11-05): la copia lleva `100755` aunque `staging` aún tenga `100644`. Así la herramienta queda autorizada cuando se alinee. La diferencia se elimina al fusionar #1143.
3. **AGENTS.md solo en §7** (2026-11-05): el único cambio en el manual es la fila de la tabla de estado. Se considera parte del flujo y no código de la app.
4. **Sin Socket** (2026-11-05): no hay paquetes nuevos, así que no hay sección de validación.
