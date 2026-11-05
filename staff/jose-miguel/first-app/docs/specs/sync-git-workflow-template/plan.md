# Plan · Sincronizar flujo git con la plantilla del curso

Issue: #932 · Fuente: `exercises/git-workflow-agent-template` @ `0d548411`.

Chore de documentación y agentes. No hay cambios en `logic/`, SQL, clientes ni paquetes npm. No aplica validación Socket.

## Ficheros

| Acción | Fichero |
| --- | --- |
| Actualizar | `docs/specs/sync-git-workflow-template/spec.md`, `plan.md`, `tasks.md` |
| Copiar literal | `agents/git-workflow-agent.md`, `agents/create-pr.md` |
| Crear | `tools/create-pr-base-staging.sh` |
| Copiar + rutas | `skills/commit-changes` (regla Mensaje técnico), `skills/create-draft`, `skills/create-pr-base-staging` |
| Tocar | `docs/ARCHITECTURE.md` (orquestador + script PR) |
| Tocar | `docs/TREE.md` (`create-pr-base-staging.sh`) |

No se toca: `templates/`, `MCPS/socket-mcp/`, `src/`, `package.json`, `scripts/start-*.js`.

## Verificación

- `git diff` plantilla vs app en orquestador, create-pr y tools → vacío en contenido (skills: única diferencia = ruta del comando).
- `pnpm format` y `pnpm lint` en `first-app`.
