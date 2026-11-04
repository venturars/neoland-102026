# Plan — actualizar el flujo de git con la plantilla del curso

Issue: #993

La referencia es `exercises/git-workflow-agent-template`, en `origin/staging` (`10bf0bd8`). No hay función, SQL, mensaje ni paquete nuevos. No se toca `src/`.

## Ficheros

Se copian de la plantilla tal cual:

- `agents/create-pr.md`
- `agents/git-workflow-agent.md`
- `agents/help-me-to-think.md`
- `skills/create-draft/SKILL.md`
- `skills/grill-me/SKILL.md`
- `skills/grill-with-docs/SKILL.md`
- `tools/create-pr-base-staging.sh`, nuevo y con el mismo permiso de ejecución que los otros scripts

Se copian de la plantilla con una adaptación:

- `skills/commit-changes/SKILL.md` — entra la regla del mensaje técnico. El comando sigue siendo `staff/diego-torres/first-app/tools/commit-changes.sh`.
- `skills/create-pr-base-staging/SKILL.md` — entra el texto nuevo. El comando pasa a `staff/diego-torres/first-app/tools/create-pr-base-staging.sh`, como las demás skills de esta carpeta. Se quita la frase para quien copia la plantilla, porque esta carpeta ya es la copia.

No cambian:

- Las otras skills. Su única diferencia con la plantilla es la ruta propia de `tools/`.
- `templates/`, que ya es igual que la plantilla.
- `MCPS/socket-mcp/mcp.txt`, que la plantilla no tiene y `AGENTS.md` necesita.
- `AGENTS.md` y `docs/`: no nombran nada de lo que cambia.

## Cómo se crea ahora la pull request

`tools/create-pr-base-staging.sh` lanza `gh pr create` con base `staging`, `--draft` y `--assignee "@me"`. Necesita GitHub CLI con sesión iniciada: esa cuenta es la autora y la persona asignada. El cuerpo llega en un fichero temporal con la plantilla rellena.

`assign-author` y `create-draft` siguen disponibles para una pull request que ya existe.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

No hay mensaje nuevo de `docs/ERRORS.md`. Los errores de este cambio son los que ya devuelven los scripts y `gh`.

## Socket

No entra: no se añade ningún paquete ni cambia ninguna versión.

## Comprobación

- La diferencia con la plantilla en `agents/`, `skills/`, `tools/` y `templates/` se queda en las rutas de `tools/`, la adaptación de `create-pr-base-staging` y nada más. `MCPS/` solo se diferencia en `socket-mcp`.
- `tools/create-pr-base-staging.sh` sin argumentos responde con su uso y sale con error, sin crear nada.
- `pnpm lint` termina bien.
- No se crea una pull request de prueba: el script se estrena la próxima vez que se empiece una tarea.
