# Plan — Flujo de git del curso

Issue: #586.

## Recorrido

Este cambio no es una funcionalidad. No crea una capa, no cambia `logic/`, no añade SQL y no modifica el comportamiento de la app.

La plantilla está en `exercises/git-workflow-agent-template/`: siete subagentes, quince skills, siete scripts, dos plantillas de texto y la dirección del MCP de GitHub. `first-app` no tiene ninguna de esas carpetas.

`AGENTS.md` abre con «Qué primero», que manda a `docs/GIT-WORKFLOW.md`, a `docs/skills/create-issue/SKILL.md` y a `.github/issue_template.md`. Ninguno existe. Esa sección se sustituye por el flujo nuevo.

## Ficheros

Se crean, copiados de la plantilla:

- `agents/`: los siete subagentes, entre ellos `git-workflow-agent.md`.
- `skills/`: las quince skills, una carpeta con su `SKILL.md` cada una.
- `tools/`: los siete scripts `.sh`, con permiso de ejecución.
- `templates/issues/basic_issue.md` y `templates/pull-request/basic-pull-request.md`.
- `MCPS/github-mcp-server/mcp.txt`.
- `docs/specs/adapt-git-workflow/` con `spec.md`, `plan.md` y `tasks.md`.

Se tocan:

- Siete skills que lanzan un script: `check-status`, `pull-changes`, `create-branch-from-staging`, `create-branch`, `create-empty-commit`, `commit-changes` y `launch-push`.
- `AGENTS.md`.
- `docs/TREE.md`.
- `docs/ARCHITECTURE.md`.

No se tocan `logic/`, `queries/`, `db/`, `clients/`, `package.json` ni `scripts/`.

## Rutas

Los scripts se lanzan desde la raíz del repositorio git. En esas siete skills, cada `./tools/` se adapta a la ubicación de `tools/` dentro de la aplicación, relativa a esa raíz. Las demás skills hablan con el MCP y no llevan ruta.

Los scripts no cambian. Calculan la raíz con `git rev-parse --show-toplevel`, así que funcionan desde cualquier carpeta.

## AGENTS.md

La sección «Qué primero» se sustituye por un texto corto que dice:

- El trabajo de git sigue `agents/git-workflow-agent.md` de esta carpeta, aunque el mensaje no nombre ese fichero ni diga «issue».
- Una tarea es una issue, una rama desde `staging` y una pull request en draft hacia `staging`.
- Las paradas de «Antes de editar» siguen. El flujo de git no las quita.
- El orden es: issue, rama, pull request en draft, y en esa rama la spec.

En «Validación de paquetes con Socket», la frase «el de `MCP.md` en la raíz del repositorio» desaparece, porque `MCP.md` no existe. Queda «El servidor es `socket-mcp`.» El resto de esa sección no cambia.

El resto del fichero sigue igual. En «Forma de trabajar», la regla «No hagas `commit`, `push`, merge ni pull request sin autorización» se queda. Pedir al orquestador empezar una tarea, guardar un trozo o pedir revisión es la autorización de ese paso.

## Árbol

En `docs/TREE.md` entran `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`, con los nombres de sus ficheros, y la carpeta de esta spec dentro de `docs/specs/`. El resto del árbol sigue igual.

## Arquitectura

`docs/ARCHITECTURE.md` gana una sección «Flujo de git», entre «Capas» y «Ficheros». Cuenta el orden del orquestador por momento y qué subagente y qué skill entran en cada uno. No repite el árbol.

En «Ficheros» entra un punto por cada una de las cinco carpetas nuevas y un punto para esta spec. El punto de `AGENTS.md` pasa a decir que enlaza con el flujo de git.

## Firma

No hay función. No hay parámetros. No hay salida.

## SQL

No hay SQL.

## Errores

No hay fallo de la lista «Errores».

## Paquetes

No hay paquete de Node. No hace falta Socket.

## Decisión

El flujo viejo y el nuevo no conviven: el viejo apunta a ficheros borrados. Se sustituye el viejo por el nuevo.

Se mantiene de la sección vieja que, antes de crear la issue, se enseñan la persona asignada y el título y se espera el sí. La plantilla no para ahí. Esta app sí. Si la persona responsable prefiere que la issue salga sin esa parada, se cambia al revisar el plan.

`pnpm format` formatea también los `.md` copiados, así que algún texto puede cambiar solo de forma, no de contenido. Eso es esperado.

## Comprobación

- El script `tools/check-status.sh`, invocado con la ruta de la aplicación desde la raíz del repositorio, termina bien.
- `grep -rn "\./tools/" skills` no devuelve ninguna línea.
- Cada ruta que escribe `AGENTS.md` existe.
- `pnpm format` y `pnpm lint` terminan bien desde `first-app`.
- `git diff --check` no encuentra errores de espacios.
- `git status` no muestra cambios en `logic/`, `queries/`, `db/`, `clients/` ni `package.json`.
