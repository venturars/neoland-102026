# Plan técnico 006 · Flujo de git y cinco momentos

> Estado: **Aprobado** (2026-11-01) · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-11-01

Issue: #712.

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre. La comprobación es manual, más `pytest` para ver que el pasar lista no se ha movido.

---

## 1. Visión general

Se copia el flujo de git de `exercises/git-workflow-agent-template` dentro de esta carpeta. La plantilla no se edita. Luego se enmiendan el manual, la constitución y la arquitectura para los cinco momentos.

El código de la app no se toca.

---

## 2. Decisiones

### 2.1 Copia del flujo (CA-06)

Se copian, con el mismo texto, `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`.

En estas skills, `./tools/` pasa a `staff/jose-miguel/asistenciapp/tools/`:

- `skills/check-status/SKILL.md`
- `skills/pull-changes/SKILL.md`
- `skills/create-branch-from-staging/SKILL.md`
- `skills/create-branch/SKILL.md`
- `skills/create-empty-commit/SKILL.md`
- `skills/commit-changes/SKILL.md`
- `skills/launch-push/SKILL.md`

Los scripts quedan ejecutables. `Closes #N`, `OWNER` y `REPO` se quedan como en la plantilla. No se añade la herramienta Task ni se cambia el enlace a `Related to #N`.

### 2.2 Los cinco momentos en el manual (CA-01 a CA-05, CA-07)

`AGENTS.md` deja de parar tras el spec, tras el plan y tras las tasks. El orden de quien trabaja aquí queda así:

1. Crear la issue. Si falta definición, la entrevista va aquí. No se abre la rama.
2. Crear el draft: adelantar `staging`, rama desde `staging`, commit vacío `chore: open #N`, push, pull request en draft contra `staging`, autor y `Closes #N`. Sin specs.
3. Crear las specs: `spec.md`, `plan.md` y `tasks.md` en la misma pasada. La spec abre con el número de la issue. Sin código.
4. Implementar la spec. Sin commit y sin push.
5. La pull request: solo lo que se pida. Sin merge a `staging`.

El git lo reconoce `agents/git-workflow-agent.md`. El agente elige un solo momento y no sigue al siguiente. Commit y push solo en el momento 2 (commit vacío) y en el momento 5, cuando se piden.

### 2.3 Constitución 3.2 (CA-08)

`docs/CONSTITUTION.md` sube de 3.1 a 3.2. El §4 deja de exigir un ok entre spec y plan. El orden de los ficheros sigue siendo spec, plan, tasks e implementación. La issue y el draft van antes de las specs. Plan y tasks se escriben en el mismo momento que la spec. El código espera a las tres specs y al momento de implementar. Una issue, una rama o una pull request no lo autorizan. P1–P6 no cambian. El historial gana la fila 3.2, con fecha 2026-11-01.

### 2.4 Arquitectura (CA-09)

En el árbol de `docs/ARCHITECTURE.md`, antes de `docs/`, entran `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`, sin listar los ficheros de dentro. Un párrafo dice que el orquestador reconoce el momento y llama al subagente o a la skill que toca.

### 2.5 Lo que no se edita (CA-10)

No se modifican `app.py`, `asistencia/`, `static/` ni `README.md`. `tests/test_architecture.py` solo cambia el assert de versión 3.2 si hace falta. La tabla de `AGENTS.md` marca esta spec como implementada al cerrar.

---

## 3. Comprobación manual

| Criterio | Qué mirar |
| --- | --- |
| CA-01 | Issue #712, asignada, con las dos secciones. La rama nació después |
| CA-02 | Rama `712-docs-asistenciapp-git-workflow`, commit `chore: open #712`, pull request #713 en draft, base `staging`, cuerpo con `Closes #712` |
| CA-03 | `specs/006-flujo-de-git/` con spec, plan y tasks. La spec abre con `Issue: #712` |
| CA-04, CA-05 | Tras implementar, el trabajo nuevo no está en un commit hasta el momento 5. No hay merge a `staging` |
| CA-06 | Las cinco carpetas existen. `git diff` de la plantilla vacío. Las siete skills apuntan a `staff/jose-miguel/asistenciapp/tools/` |
| CA-07 | `AGENTS.md` describe los cinco momentos |
| CA-08 | Constitución 3.2 y el §4 sin el ok entre spec y plan. P1–P6 iguales |
| CA-09 | El árbol de `docs/ARCHITECTURE.md` |
| CA-10 | `pytest` pasa. Sin diff en `app.py`, `asistencia/`, `static/` ni `README.md` |

---

## 4. Comprobación de la constitución (v3.2)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se añade una plataforma ni se cambia el registro |
| P2 Simplicidad | Sí | Se copia un flujo que ya existe y se acortan las paradas |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia |
| P4 Privacidad | Sí | No se guardan datos nuevos |
| P5 Accesible y móvil | Sí | No se tocan pantallas |
| P6 Español | Sí | Spec, plan, tasks, manual y enmienda están en español |
| §3 Stack | Sí | El stack no cambia |
| §4 SDD | Sí | Esta enmienda es el §4 nuevo: los ficheros siguen en orden y el ok del humano son los cinco momentos |
| §5 Calidad | Sí | Cada criterio tiene un paso en §3. `pytest` comprueba que la app no se ha movido |
| §6 Seguridad | Sí | No se toca el registro ni los códigos |
| §7 Alcance | Sí | Todo queda en `staff/jose-miguel/asistenciapp/` |
| §8 Enmiendas | Sí | La pide quien trabaja en esta carpeta y queda en el historial como 3.2 |
