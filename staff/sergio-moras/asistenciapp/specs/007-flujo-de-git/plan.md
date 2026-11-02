# Plan 007 · Flujo de git del curso en cinco momentos

> Estado: **Aprobado** (2026-11-02) · Spec: [spec.md](spec.md) v1.0

---

## 1. Resumen

| Qué | Dónde | Cambio |
| --- | --- | --- |
| Flujo de git | `agents/`, `skills/`, `tools/`, `templates/`, `MCPS/` | Copia de `exercises/git-workflow-agent-template/` (versión actual de `staging`) |
| Rutas | 7 `skills/*/SKILL.md` | `./tools/…` pasa a `staff/sergio-moras/asistenciapp/tools/…` |
| Manual | `AGENTS.md` | §1, §2, §2.4, §5 y §7: cinco momentos, quién hace cada uno y cuándo hay commit |
| Reglas | `docs/CONSTITUTION.md` | §4 sin ok entre spec, plan y tasks. Versión 3.1 |
| Arquitectura | `docs/ARCHITECTURE.md` | Las cinco carpetas en el árbol y una sección del flujo |
| Test | `tests/test_git_workflow.py` | Nuevo: copia fiel, rutas y permisos |

`app.py`, `asistencia/`, `static/` y los tests de la app no se tocan (CA-13).

---

## 2. La copia (CA-01, CA-02, CA-04)

Se copian las cinco carpetas completas, con `cp -r` desde la raíz del repositorio: 7 agentes, 15 skills, 7 scripts, 12 plantillas (6 de issue y 6 de PR, una por tipo) y `MCPS/github-mcp-server/mcp.txt`.

Lo único que cambia son las 7 líneas «Comando de Terminal» de estas skills:

`check-status`, `commit-changes`, `create-branch`, `create-branch-from-staging`, `create-empty-commit`, `launch-push` y `pull-changes`.

En ellas, `./tools/` pasa a `staff/sergio-moras/asistenciapp/tools/`, porque los comandos se lanzan desde la raíz del repositorio.

El resto de rutas de la plantilla (`agents/…`, `skills/…`, `templates/…`, `MCPS/…`) son relativas a esta carpeta y se quedan igual. Los scripts ya hacen `cd` a la raíz del repositorio con `git rev-parse --show-toplevel`, así que no hay que tocarlos.

---

## 3. Permisos (CA-03)

En la plantilla, los 7 scripts están en git con modo `100755`. Se comprueba que la copia queda igual con `git ls-files -s`. Si en Windows se pierde el permiso, se fija con `git update-index --chmod=+x`.

---

## 4. Los cinco momentos en `AGENTS.md` (CA-05 a CA-10)

**§2 se reescribe.** Deja de ser «una parada tras cada fase» y pasa a esta tabla. El agente reconoce qué momento se pide, lo hace entero y para. No encadena el siguiente ni pide un ok en medio.

| Momento | Qué hace el agente | Subagentes y skills (vía `agents/git-workflow-agent.md`) |
| --- | --- | --- |
| 1. Crear la issue | Escribe qué hay que hacer y cómo se comprueba. Si la tarea no está clara, primero hace preguntas, una cada vez. No abre rama | `help-me-to-think` (si hace falta) y `create-issue`, con `templates/issues/` |
| 2. Crear el draft | Adelanta `staging`, crea la rama `N-tipo-descripcion`, hace el commit vacío `chore: open #N`, la sube, abre la PR en borrador con autor y la enlaza con `Closes #N`. No escribe specs | `pull-changes`, `create-branch` + `create-branch-from-staging`, `create-commit` + `create-empty-commit`, `launch-push`, `create-pr` + `create-pr-base-staging` + `assign-author` + `create-draft`, y `link-pr-to-issue` |
| 3. Crear las specs | Escribe `spec.md`, `plan.md` y `tasks.md` en la misma pasada. Si falta un dato, lo pregunta y no lo inventa. No toca la app | — |
| 4. Implementar | Hace las tasks en orden y las marca. Sin commit ni push | — |
| 5. La pull request | Solo lo que se pida: subir ficheros (commit de trabajo y push), pedir revisión (sale de draft) u otra cosa sobre la PR. Nunca hace merge a `staging` | `create-commit` + `commit-changes`, `launch-push`, `assign-reviewers` |

Además:

- **§1:** el orden de lectura añade `agents/git-workflow-agent.md`.
- **§2.1 a §2.3:** se mantienen. Dicen cómo se escribe cada documento, que sigue igual.
- **§2.4:** añade que al implementar no hay commit ni push.
- **§5:** «Nada de commits ni pushes sin que lo pida…» pasa a «Commit y push solo en el momento 2 (commit vacío) y en el momento 5, cuando se piden».
- **§7:** fila de la 007.

---

## 5. Constitución 3.1 (CA-08, CA-11)

§4:

- **Punto 1:** antes de modificar cualquier fichero de la app tienen que estar escritas la spec, el plan y las tasks del cambio. Pedir el momento 4 es darlas por buenas.
- **Punto 2:** el orden de los ficheros sigue siendo spec → plan → tasks → implementación, pero se escriben juntos en el momento 3, sin ok entre ellos. La issue y el draft van antes. La implementación y la PR son momentos aparte.
- **Punto 3:** issue, rama y PR siguen sin autorizar cambios en la app.
- **Puntos 4 a 6:** sin cambios.

**Versión 3.1:** cambia el proceso del §4, pero no se quita ni se contradice ningún principio (P1–P6). Según §8, es una versión menor. Se anota en el historial.

---

## 6. Arquitectura (CA-12)

`docs/ARCHITECTURE.md`:

- El árbol añade `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`, sin listar lo que hay dentro.
- Una sección nueva, «Flujo de git», dice qué es cada carpeta y que el orquestador es `agents/git-workflow-agent.md`. Remite a `AGENTS.md` §2 para los momentos.
- Aclara que estas carpetas no son código de la app y que `tests/test_architecture.py` no las analiza.

---

## 7. Test

`tests/test_git_workflow.py`:

- **Fidelidad (CA-01, CA-02):** cada fichero de la plantilla tiene su copia, y no hay ficheros de más. Su contenido es igual, cambiando `./tools/` por `staff/sergio-moras/asistenciapp/tools/`.
- **Rutas (CA-02):** ninguna skill de la copia contiene `./tools/`, y las 7 rutas apuntan a scripts que existen.
- **Permisos (CA-03):** los 7 scripts tienen modo `100755` en el índice de git.

---

## 8. Verificación manual (CA-03, CA-04)

- Lanzar desde la raíz del repositorio `staff/sergio-moras/asistenciapp/tools/check-status.sh`, que solo lee el estado, y comprobar que responde.
- `git diff --stat origin/staging` no muestra cambios en `exercises/` ni fuera de esta carpeta.

---

## 9. Lo que no entra

- La cadena de ramas y las PRs en borrador sin revisores que usa quien trabaja aquí. Son una práctica personal para encadenar tareas pendientes de revisión, no una regla de la app.
- Configurar el MCP de GitHub en el editor.

---

## 10. Comprobación de la constitución (3.1)

| Regla | Cumple | Motivo |
| --- | --- | --- |
| P1–P6 | Sí | La app no cambia; documentos en español |
| §3 Stack | Sí | Sin dependencias nuevas; los scripts son bash, y la plantilla ya los usaba |
| §4 SDD | Sí, con la enmienda 3.1 | Esta tarea se hace todavía con paradas tras spec, plan y tasks; los cinco momentos rigen desde que esté implementada |
| §5 Calidad | Sí | Test nuevo y verificación manual |
| §7 Alcance | Sí | Solo `staff/sergio-moras/asistenciapp/`; `exercises/` intacto |
