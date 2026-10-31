# Plan: Flujo de git en first-app

Implementa [spec.md](spec.md). Respeta [CONSTITUTIONS.md](../../CONSTITUTIONS.md): no toca `logic/`, `queries/`, `db/` ni `clients/`.

## Decisiones técnicas
| Tema | Decisión | Motivo |
|---|---|---|
| Origen | Se copian tal cual las 5 carpetas de `exercises/git-workflow-agent-template` en la versión de `staging`: `agents/` (7), `skills/` (15), `tools/` (7), `templates/` (12) y `MCPS/` (1). 42 ficheros | Es la versión más nueva, con plantillas de issue y de pull request por tipo. El profe y los compañeros copiaron una versión anterior |
| Cómo se copian | Con git, desde la plantilla, para que los 7 scripts de `tools/` conserven el permiso de ejecución (`100755`) | En Windows, copiar con el explorador pierde ese permiso |
| Paradas | Sin paradas, como la plantilla: el orquestador llama y continúa | Decisión del usuario |
| `AGENTS.md` | Se añade una sola línea, después del título: `El trabajo de git sigue [agents/git-workflow-agent.md](agents/git-workflow-agent.md) de esta carpeta.` | Es lo que hace que el agente use el flujo. Una sola línea evita conflictos con #638 y #381, que también tocan `AGENTS.md` |
| MCP de GitHub | `MCPS/github-mcp-server/mcp.txt` se copia sin cambios. En Claude Code el MCP de GitHub ya está conectado fuera del repositorio | El header de `mcp.txt` es para Cursor. No se guarda ningún token en el repositorio |
| Scripts | Se lanzan con Git Bash desde la app: `./tools/<script>.sh`. Cada script sube solo a la raíz del repositorio | Son scripts de bash |

## Archivos
```
agents/       NUEVO, 7 ficheros
skills/       NUEVO, 15 carpetas con SKILL.md
tools/        NUEVO, 7 scripts
templates/    NUEVO, 6 de issue y 6 de pull request
MCPS/         NUEVO, 1 fichero
AGENTS.md     una línea
```

## Cómo se prueba
- Los 42 ficheros son idénticos a los de la plantilla y los scripts tienen permiso de ejecución.
- `check-status.sh` y `pull-changes.sh` se ejecutan y responden. No cambian de rama.
- `create-branch-from-staging.sh`, `create-empty-commit.sh`, `commit-changes.sh` y `launch-push.sh` se lanzan con datos que no valen y se paran con su mensaje. No crean nada.
- El MCP de GitHub responde con el usuario autenticado.
- La prueba completa (dejar escrita y empezar una tarea) se hace con la siguiente tarea real, cuando esta esté en `staging`. Antes, crear la rama desde `staging` dejaría fuera los ficheros del flujo.
