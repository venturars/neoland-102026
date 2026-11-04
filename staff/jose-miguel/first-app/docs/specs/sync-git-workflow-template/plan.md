# Plan · Sincronizar flujo git con la plantilla del curso

Issue: #858 · Fuente: `exercises/git-workflow-agent-template` @ `665b92a5`.

Chore de documentación y agentes. No hay cambios en `logic/`, SQL, clientes ni paquetes npm.

## Ficheros

| Acción | Fichero |
| --- | --- |
| Crear | `docs/specs/sync-git-workflow-template/spec.md`, `plan.md`, `tasks.md` |
| Copiar literal | `agents/git-workflow-agent.md` |
| Copiar | `tools/*.sh` (7 scripts) |
| Copiar + rutas | `skills/check-status`, `pull-changes`, `create-branch`, `create-branch-from-staging`, `create-empty-commit`, `commit-changes`, `launch-push` — sustituir `./tools/` por `staff/jose-miguel/first-app/tools/` |
| Alinear | `skills/create-pr-base-staging/SKILL.md` (argumento Título como plantilla) |
| Tocar | `docs/ARCHITECTURE.md` (bullet del orquestador) |
| Tocar | `docs/TREE.md` (entrada de esta spec) |

No se toca: `templates/`, `MCPS/socket-mcp/`, `src/`, `package.json`, `scripts/start-*.js`.

## Verificación

- `git diff` plantilla vs app en orquestador y tools → vacío.
- Skills: única diferencia permitida vs plantilla = ruta del comando.
- `pnpm format` y `pnpm lint` en `first-app`.
