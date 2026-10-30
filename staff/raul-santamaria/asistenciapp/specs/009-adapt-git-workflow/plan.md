# Plan técnico 009 · Adaptar el flujo de git y los momentos humanos

> Estado: **Implementado** · Spec: [spec.md](spec.md) · Creado: 2026-10-30 · Issue: #618

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios (`CA-xx`) cubre.

---

## 1. Visión general

Se copia la plantilla `exercises/git-workflow-agent-template` dentro de `staff/raul-santamaria/asistenciapp/` y se reescriben las rutas de las skills que llaman a scripts. Se reescribe el §2 de `AGENTS.md` con los cinco momentos. Se enmienda `docs/CONSTITUTION.md` §4. Se actualiza el árbol y un párrafo en `docs/ARCHITECTURE.md`.

No se toca `asistencia/`, `static/`, `app.py`, `bot_discord.py`, `tests/` ni `requirements.txt`.

---

## 2. Dependencias (P3)

Ninguna nueva de Python. La plantilla trae scripts bash y referencia al MCP remoto de GitHub (ya usado en el monorepo). No hay paquete pip nuevo.

---

## 3. Decisiones

### 3.1 Copia de la plantilla (CA-08, CA-09)

Origen: `exercises/git-workflow-agent-template/`.

Destino bajo `staff/raul-santamaria/asistenciapp/`:

| Carpeta | Contenido |
| --- | --- |
| `agents/` | Orquestador + subagentes (`git-workflow-agent.md`, `help-me-to-think.md`, `create-issue.md`, `create-branch.md`, `create-commit.md`, `create-pr.md`, `launch-push.md`) |
| `skills/` | Las 15 skills de la plantilla |
| `tools/` | Los 7 scripts `.sh` |
| `templates/` | `issues/basic_issue.md`, `pull-request/basic-pull-request.md` |
| `MCPS/github-mcp-server/` | `mcp.txt` |

En las siete skills cuyo comando es `./tools/…`, cada `./tools/` pasa a `staff/raul-santamaria/asistenciapp/tools/`. El resto del texto de esas skills no cambia. Las skills sin script no cambian.

El enlace issue–PR sigue la plantilla: `Closes #N` (CA-02).

### 3.2 AGENTS.md (CA-07)

- El §2 deja de parar tras el spec, tras el plan y tras las tasks.
- Pasa a los cinco momentos de la issue #618 / spec (CA-01 a CA-05).
- El trabajo de git sigue `agents/git-workflow-agent.md` de esta carpeta.
- «Nada de commits ni pushes» queda: commit y push solo en el momento 2 (commit vacío) y en el momento 5, cuando lo piden.
- Se actualiza la tabla «Estado actual» con la 009.

### 3.3 Constitución — enmienda 3.2 (CA-10)

La issue pedía «3.1 (2026-10-30)», pero **3.1 ya existe** (2026-10-27, Discord). Esta enmienda será **3.2** (2026-10-30).

Cambios en §4:

- Ya no exige ok humano entre el spec y el plan.
- El orden de ficheros sigue siendo spec → plan → tasks → implementación.
- Issue y draft van antes de las specs.
- Spec, plan y tasks se escriben en el mismo momento.
- Implementación y pull request son momentos distintos.
- P1–P6 no cambian.
- Se mantiene: issue / rama / PR no sustituyen al spec ni autorizan cambios sin los tres ficheros y el momento de implementar (CA-06).

### 3.4 ARCHITECTURE.md (CA-10)

- En el árbol de `asistenciapp/`, **antes de** `docs/`, entran `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`.
- Un párrafo corto: el orquestador reconoce el momento y llama al subagente o a la skill que toca.

### 3.5 Comprobación (CA-11)

Desde la raíz del monorepo: `staff/raul-santamaria/asistenciapp/tools/check-status.sh` (vía Git Bash en Windows si hace falta). Debe terminar bien y escribir repositorio, rama y remoto.

No hay tests pytest nuevos: el cambio no toca lógica de asistencia. La verificación es el script + lectura de los tres docs (cubre §5 de la constitución para CAs documentales).

### 3.6 Archivos

| Archivo / carpeta | Cambio |
| --- | --- |
| `agents/`, `skills/`, `tools/`, `templates/`, `MCPS/` | Copia desde la plantilla + rutas en skills |
| `AGENTS.md` | §2 + puntero git + estado 009 |
| `docs/CONSTITUTION.md` | §4 + fila 3.2 en historial |
| `docs/ARCHITECTURE.md` | Árbol + párrafo orquestador |
| `specs/009-adapt-git-workflow/` | Ya creados en momento 3 |

---

## 4. Comprobación de la constitución

| Principio / sección | Cómo lo cumple este plan |
| --- | --- |
| P1 Utilidad | Quien trabaja con IA marca menos paradas y usa el flujo de git del curso en su carpeta. |
| P2 Simplicidad | Copia de plantilla existente; sin lógica nueva de asistencia. |
| P3 Dependencias | Sin paquetes pip nuevos. |
| P4 Datos | No guarda datos de alumnos ni secretos nuevos. |
| P5 UX | No cambia pantallas. |
| P6 Español | Docs y cuerpos de issue/PR en español; títulos EN como el curso. |
| §4 SDD | Se enmienda de forma explícita (3.2); se mantiene la puerta del código (CA-06). |
| §5 Calidad | Verificación manual/script documentada; sin pytest de dominio. |
| §6 Seguridad | Sin cambios de autenticación ni almacenamiento. |
| §7 Alcance | Solo dentro de `staff/raul-santamaria/asistenciapp/`. |

---

## 5. Mapa criterio → comprobación

| Criterio | Qué lo cubre |
| --- | --- |
| CA-01–CA-05 | Texto de `AGENTS.md` §2 alineado con la issue. |
| CA-06 | Constitución §4 enmendada + `AGENTS.md`. |
| CA-07 | `AGENTS.md` §2 y regla de commit/push. |
| CA-08 | Carpetas copiadas presentes. |
| CA-09 | Skills con ruta `staff/raul-santamaria/asistenciapp/tools/`. |
| CA-10 | Constitución 3.2 + árbol y párrafo en arquitectura. |
| CA-11 | `tools/check-status.sh` desde la raíz. |
