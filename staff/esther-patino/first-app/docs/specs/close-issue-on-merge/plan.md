# Plan — cerrar la issue al fusionar en la rama por defecto

Issue: #706.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`. No hay firma. No hay parámetros. No hay salida. No hay SQL. No hay paquete de Node ni cambio de versión.

## Ficheros

Esta escritura toca la spec. No abre `skills/link-pr-to-issue/SKILL.md`. Ese fichero se toca después, en las tareas de `latest-orchestrator-rules`.

El cierre queda dicho aquí, en `spec.md` y en este plan. `agents/git-workflow-agent.md` ya deja `Closes #N` y la issue abierta al enlazar. El paso que cierra la issue con la API sale de ese orquestador en esas mismas tareas, no en esta escritura.

No se toca `logic/`, `queries/`, `db/`, `clients/`, `scripts/`, `package.json` ni la plantilla de `exercises/`.

## Enlace

La línea del cuerpo es `Closes #N`. Ese paso no cambia el estado de la issue. La barra Development sigue con `addCloseIssueReferences`. Nadie llama a la API para cerrar la issue.

La base de la pull request es `staging`. GitHub cierra la issue al fusionar la pull request que lleva `Closes #N` en la rama por defecto. Si esa rama sigue siendo `main`, fusionar en `staging` deja la issue abierta. No se cierra justo después.

Antes de escribir el cuerpo, el header de `MCPS/github-mcp-server/mcp.txt` está en `mcp.json`.

## Errores

No hay fallo de la lista «Errores».

## Decisión

La issue #836 responde la pregunta: esta spec se modifica antes de tocar `skills/link-pr-to-issue/SKILL.md`. El camino es el de la plantilla. No se llama a la API para cerrar la issue.
