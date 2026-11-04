# Plan 006 · Flujo de git del curso en AsistenciApp

Spec: [spec.md](spec.md). Issue #777.

No hay código de aplicación nuevo, ni dependencia nueva, ni cambios en tests. Las comprobaciones son leer ficheros. El paso de lista no se toca.

## Origen y destino

- Origen: `exercises/git-workflow-agent-template/`
- Destino: `staff/luis-duque/asistenciapp/`
- Los scripts se lanzan desde la raíz del repositorio git.

## Ficheros

### Se sustituyen con el texto de la plantilla

`agents/` (salvo el orquestador, que se adapta después):

- `help-me-to-think.md`
- `create-issue.md`
- `create-branch.md`
- `create-commit.md`
- `create-pr.md`
- `launch-push.md`

`skills/` (las que no lanzan script), cada una con `SKILL.md`:

- `assign-author`
- `assign-reviewers`
- `create-draft`
- `create-issue`
- `create-pr-base-staging`
- `grill-me`
- `grill-with-docs`
- `link-pr-to-issue`

`tools/`:

- `check-status.sh`
- `commit-changes.sh`
- `create-branch.sh`
- `create-branch-from-staging.sh`
- `create-empty-commit.sh`
- `launch-push.sh`
- `pull-changes.sh`

`templates/issues/` (seis) y `templates/pull-request/` (seis).

`MCPS/github-mcp-server/mcp.txt`.

### Se copian y después se cambia solo el comando

- `skills/check-status/SKILL.md`
- `skills/pull-changes/SKILL.md`
- `skills/create-branch/SKILL.md`
- `skills/create-branch-from-staging/SKILL.md`
- `skills/create-empty-commit/SKILL.md`
- `skills/commit-changes/SKILL.md`
- `skills/launch-push/SKILL.md`

En esas siete, cada `./tools/` pasa a `./staff/luis-duque/asistenciapp/tools/`. La frase de lanzar el comando desde la raíz del repositorio git se queda. El resto de la skill no cambia.

### Se adaptan (no se dejan tal cual de la plantilla)

- `agents/git-workflow-agent.md`
- `AGENTS.md`
- `docs/CONSTITUTION.md` (§7 únicamente)

### No se tocan

- `app.py`, `asistencia/`, `static/`, `tests/`, `requirements.txt`, `pytest.ini`, `README.md`
- Specs 001–005
- El `AGENTS.md` de la raíz del repositorio
- La plantilla en `exercises/git-workflow-agent-template/`

## Decisiones

1. **Copia completa.** Se sustituye lo que hubiera en `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/` por la plantilla (decisión de la spec). Luego se reajustan las siete skills de script.

2. **Orquestador.** Tras la copia, en `agents/git-workflow-agent.md` se añade en los límites que no se salta la parada de la spec, la del plan ni la de las tareas. Sigue sin hacer merge a `staging`. El resto del flujo de la plantilla (pensar, dejar escrita, empezar, guardar un trozo, pedir revisión) se queda.

3. **`AGENTS.md`.** Al inicio del manual se declara que el flujo de git de esta app es `agents/git-workflow-agent.md`, entero: pensar una tarea, dejarla escrita, empezar, guardar un trozo y pedir revisión. El flujo SDD (§2) **se queda**. Una frase deja claro que el flujo de git no quita esas paradas. En §3 (estructura de carpetas) entran `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`. La regla de «nada de commits ni pushes sin que lo pidan» se alinea con el orquestador: esos pasos los dispara el flujo de git cuando toca, no fuera de él. El resto del manual (lectura obligatoria, fases, comandos de la app, definición de terminado, estado actual) se conserva.

4. **Constitución §7.** La ruta del proyecto pasa de `staff/victor-chang/asistenciapp/` a `staff/luis-duque/asistenciapp/`. Es corrección de alcance del fork, no un cambio de principios. Se anota enmienda 2.2 en el historial. No se tocan P1–P6 ni §1–§6.

5. **Ya hecho fuera de las tareas (contexto).** La issue #777 existe. La sustitución desde la plantilla y el ajuste de rutas de skills pueden estar hechos al llegar a la implementación; las tareas los comprueban o los completan si faltan.

## Comprobación de la constitución

| Condición | Cómo lo cumple este plan |
| --- | --- |
| P1 Independiente de la plataforma | No toca el registro de asistencia ni integraciones. |
| P2 Simplicidad primero | Copia la plantilla del curso y ajusta solo rutas y dos docs de trabajo. |
| P3 Dependencias mínimas | No se añade ningún paquete. `requirements.txt` no se toca. |
| P4 Privacidad mínima | No se guarda ni se envía ningún dato de alumnos. |
| P5 Accesible en móvil | No cambia HTML/CSS/JS. |
| P6 Todo en español | Spec, plan, tasks y textos tocados en `AGENTS.md` / orquestador van en español. |
| §5 Calidad | No hay criterios de producto de la app; la verificación es leer ficheros (CA-01 a CA-05). `pytest` no aplica a este cambio. |
| §6 Seguridad | No se tocan códigos de asistencia ni validación de registros. |
| §7 Alcance | Solo se edita dentro de `staff/luis-duque/asistenciapp/`; el §7 se alinea a esa ruta. |
| §4 SDD | Orden spec → plan → tasks → implementación; sin saltar fases. |

## Cómo se verifica (sin tests nuevos)

1. Listar ficheros relativos en destino y compararlos con la plantilla (CA-01).
2. Leer las siete skills de script (CA-02).
3. Leer el inicio de `AGENTS.md` y la sección de estructura (CA-03).
4. Leer los límites de `agents/git-workflow-agent.md` (CA-04).
5. Confirmar que `requirements.txt`, `app.py`, `asistencia/`, `static/` y `tests/` no cambian por este plan (CA-05).
