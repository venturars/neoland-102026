# Plan — reglas nuevas del flujo de git

Issue: #836.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`. No hay firma. No hay parámetros. No hay salida. No hay SQL. No hay paquete de Node ni cambio de versión.

## Ficheros

Ya dice lo mismo que la plantilla:

- `agents/git-workflow-agent.md`, salvo la frase que cierra la issue con la API cuando la pull request ya está fusionada. Esa frase sale en las tareas.

Se tocan para que el tipo de la rama sea el de la plantilla, y no una lista repetida:

- `agents/create-branch.md`
- `skills/create-branch/SKILL.md`
- `skills/create-branch-from-staging/SKILL.md`
- `tools/create-branch.sh`
- `tools/create-branch-from-staging.sh`
- `docs/ARCHITECTURE.md`, en los puntos de esos ficheros

La ruta de cada script sigue siendo `staff/esther-patino/first-app/tools/`.

No se toca `templates/`. Esas doce plantillas ya coinciden con `exercises/git-workflow-agent-template/templates`. No se toca `logic/`, `queries/`, `db/`, `clients/`, `scripts/` ni `package.json`.

## Orquestador

En `agents/git-workflow-agent.md` ya están las tres reglas de la plantilla:

- Para hacer cambios en un proyecto, se hace desde una rama nueva y una pull request nueva en draft.
- Antes de crear la issue, se mira si el problema, el resultado esperado, el alcance y cómo comprobarlo están claros y son coherentes con el proyecto. Si lo están, se crea la issue y se dice por qué. Si quedan dudas o contradicciones, se llama a `agents/help-me-to-think.md`. No se repite una entrevista ya resuelta.
- Al empezar, la issue ya está escrita. La rama nueva sale de `staging` antes de hacer cambios.

## Rama

En `agents/create-branch.md` y en las dos skills, el tipo es el de la plantilla. Si ese tipo no tiene plantilla, se elige la más cercana y se crea la rama. No se pregunta.

`tools/create-branch.sh` y `tools/create-branch-from-staging.sh` dejan de rechazar un tipo que no sea `feat`, `fix`, `docs`, `refactor`, `test` o `chore`. La descripción sigue en minúsculas y con guiones.

## Errores

No hay fallo de la lista «Errores».

## Enlace

La spec `close-issue-on-merge` ya dice el camino de la plantilla. Se ha modificado antes de abrir la skill.

Después, `skills/link-pr-to-issue/SKILL.md` deja `Closes #N` y no llama a la API para cerrar la issue. GitHub la cierra al fusionar en la rama por defecto. Si esa rama sigue siendo `main`, fusionar en `staging` no la cierra. Antes de escribir, el header de `MCPS/github-mcp-server/mcp.txt` está en `mcp.json`.

En `agents/git-workflow-agent.md` sale el paso que cierra la issue con la API cuando la pull request ya está fusionada.

## Decisión

El enlace sigue la plantilla. La spec `close-issue-on-merge` se modifica antes de tocar `skills/link-pr-to-issue/SKILL.md`. Hay `tasks.md`. El trabajo sigue en la rama `836-docs-sync-latest-orchestrator-rules`. La issue #836 sigue abierta. La pull request #837 sigue en draft.
