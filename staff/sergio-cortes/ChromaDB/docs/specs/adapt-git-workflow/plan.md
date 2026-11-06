# Plan · El flujo de git en ChromaDB

Spec: [spec.md](spec.md). Issue #752.

Este plan dice cómo se cumple la spec. No hay código de aplicación, ni dependencia nueva, ni suite de tests. Las comprobaciones son leer los ficheros y lanzar `check-status.sh`.

## Ficheros

Rutas desde la raíz del repositorio. El origen es `exercises/git-workflow-agent-template/`. El destino es `staff/sergio-cortes/ChromaDB/`.

Se copian con el mismo texto. `agents/developer.md`, `agents/tester.md` y `skills/python-docs/` ya están y se quedan:

- `agents/help-me-to-think.md`
- `agents/create-issue.md`
- `agents/create-branch.md`
- `agents/create-commit.md`
- `agents/create-pr.md`
- `agents/launch-push.md`
- `skills/grill-with-docs/SKILL.md`
- `skills/grill-me/SKILL.md`
- `skills/create-issue/SKILL.md`
- `skills/assign-author/SKILL.md`
- `skills/create-pr-base-staging/SKILL.md`
- `skills/create-draft/SKILL.md`
- `skills/link-pr-to-issue/SKILL.md`
- `skills/assign-reviewers/SKILL.md`
- `tools/check-status.sh`
- `tools/pull-changes.sh`
- `tools/create-branch-from-staging.sh`
- `tools/create-branch.sh`
- `tools/create-empty-commit.sh`
- `tools/commit-changes.sh`
- `tools/launch-push.sh`
- `templates/issues/` (feat, fix, chore, docs, refactor, test)
- `templates/pull-request/` (feat, fix, chore, docs, refactor, test)
- `MCPS/github-mcp-server/mcp.txt`

Se copian y después se cambia solo el comando:

- `skills/check-status/SKILL.md`
- `skills/pull-changes/SKILL.md`
- `skills/create-branch-from-staging/SKILL.md`
- `skills/create-branch/SKILL.md`
- `skills/create-empty-commit/SKILL.md`
- `skills/commit-changes/SKILL.md`
- `skills/launch-push/SKILL.md`

En esas siete, cada `./tools/` pasa a `staff/sergio-cortes/ChromaDB/tools/`. La frase de lanzar el comando desde la raíz del repositorio git se queda. El resto de la skill no cambia.

Se adapta, a partir del texto de la plantilla:

- `agents/git-workflow-agent.md`

Se adapta el que ya hay:

- `AGENTS.md`

No se tocan:

- `agents/developer.md`
- `agents/tester.md`
- `skills/python-docs/SKILL.md`
- `README.md`
- `docs/CONSTITUTION.md`
- `scripts/`
- `src/`
- `exercises/git-workflow-agent-template/`
- `exercises/ChromaDB/agents/git-workflow-agent.md`

Los scripts se copian con el bit de ejecución. Siguen lanzándose desde la raíz del git.

## Decisiones

`developer` y `tester` conviven con los agentes de git. No se borra el ciclo de rondas.

El orquestador parte del texto de `exercises/git-workflow-agent-template/agents/git-workflow-agent.md`. En el paso 3, después de dejar la issue escrita, sigue sin esperar un sí:

1. `skills/pull-changes`, que adelanta `staging`.
2. `agents/create-branch.md` con `create-branch-from-staging`.
3. `agents/create-commit.md` con `create-empty-commit`.
4. `agents/launch-push.md`.
5. `agents/create-pr.md` con `create-pr-base-staging`, `assign-author` y `create-draft`. Este agente no enlaza la issue.
6. `skills/link-pr-to-issue`.
7. La implementación es el ciclo de esta carpeta: `spec.md`, `plan.md`, `tasks.md` y las rondas de `developer` y `tester`. El orquestador no la escribe él.
8. Al terminar la implementación, `agents/create-commit.md` con los ficheros de ese trozo y `agents/launch-push.md`.
9. Si la issue nombra a dos personas, `skills/assign-reviewers` con esos nombres y la pull request sale de draft.
10. Si la issue no nombra a dos personas, se para antes de pedir la revisión. La pull request sigue en draft.

El momento «Que la revisen: el alumno nombra revisores» no se queda como parada. Los nombres salen de la issue. Si faltan, no se inventan. «Empezar» deja de ser un momento aparte: queda dentro de lo que sigue a la issue. «Pensar la tarea» y «Guardar un trozo» se quedan como en la plantilla.

En el alcance, crear la issue basta para arrancar. En las herramientas se nombran `skills/assign-reviewers`, `agents/developer.md` y `agents/tester.md`.

En el manejo de errores se añade: si al implementar aparece una llave, como el fallo de la ronda 9, se para y no se pide la revisión. Otra pasada solo arranca con la contraseña.

En `AGENTS.md`, la sección «Ciclo de un cambio» abre diciendo que el trabajo de git sigue `agents/git-workflow-agent.md` de esta carpeta. El párrafo que empieza por «Tú eres el agente principal» se queda. El bullet de la contraseña al arrancar y el bullet que manda escribir la spec se sustituyen por estos:

- El humano solo interviene al crear la issue. Crear la issue basta para arrancar. No pidas la contraseña para empezar.
- Desde esa issue se implementa: escribe `docs/specs/<cambio>/spec.md`, `plan.md` y `tasks.md` en español y lanza la ronda 1.
- La rama sale de `staging`. Al terminar, la pull request queda abierta y lista para revisión, asignada a las dos personas que nombre la issue.
- Si la issue no nombra a esas dos personas, el ciclo se para antes de pedir la revisión.
- La contraseña solo corta el ciclo si, al implementar, aparece una llave, como el fallo de la ronda 9. Recuérdala. No la copies a ningún fichero.

Los bullets del encargo, de las rondas, del alcance del developer, del tester y del reporte de la ronda 9 se quedan. «Proyecto», «Comandos» y «Al terminar una tarea» no se tocan.

Al pasar las comprobaciones se borra `tasks.md`. `spec.md` y `plan.md` se quedan. Este cambio no toca `src/core` ni `src/sdk`, así que el ciclo no llama al tester.

## Comprobación de la constitución

| Condición | Cómo |
| --- | --- |
| El agente consulta la documentación con scripts, no con un MCP | `skills/python-docs/` y `scripts/` no se tocan. El MCP de GitHub es solo el del flujo de git. |
| `python-docs/`, `python-docs-md/`, `chroma_db/` y `.venv/` no van a git | `.gitignore` no se toca. |
| No se añade una dependencia | `requirements.txt` no se toca. |

El estilo de código no entra: no se edita ningún `.py`.

## Qué mirar

| Comprobación de la spec | Dónde |
| --- | --- |
| 1 | Agentes, skills, tools, `templates/issues/`, `templates/pull-request/` y `MCPS/github-mcp-server/mcp.txt`. Siguen `agents/developer.md`, `agents/tester.md` y `skills/python-docs/SKILL.md`. |
| 2 | Las siete skills de terminal |
| 3 | `AGENTS.md` y `agents/git-workflow-agent.md` |
| 4 | Diff vacío en la plantilla, `README.md`, `docs/CONSTITUTION.md`, `scripts/` y `src/` |
| 5 | `staff/sergio-cortes/ChromaDB/tools/check-status.sh` desde la raíz del repositorio |
