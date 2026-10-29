---
name: check-status
description: "Resume la rama actual, la rama base, el remoto, si hay token de GitHub y los cambios sin commit. Úsala antes de elegir el momento del flujo de git."
---

### Herramienta: CHECK_STATUS

- **Descripción**: Úsala única y exclusivamente cuando necesites saber la rama actual, la rama base, si hay cambios sin commit, si la rama sigue a un remoto y si hay token para el MCP de GitHub.

- **Comando de Terminal**: `"${CLAUDE_SKILL_DIR}/scripts/check-status.sh"`

El comando se lanza desde cualquier carpeta del repositorio git: el script se mueve solo a su raíz.

#### Especificación de Argumentos

No recibe argumentos.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: El script escribe, en este orden, el repositorio, la rama, la rama base, el token de GitHub, el remoto con los commits por subir y por bajar, el último commit, los ficheros preparados, los modificados sin preparar y los que no tienen seguimiento. Si el código de salida no es 0, lee el error y comunícalo. No inventes la rama ni los ficheros.
- **Si la rama base no se detecta**: Pide al alumno que defina `GIT_WORKFLOW_BASE` con el nombre de su rama base.
- **Si falta el token de GitHub**: Las skills que usan el MCP van a fallar. Pide al alumno que defina `GITHUB_TOKEN` (por ejemplo `export GITHUB_TOKEN=$(gh auth token)`) y reinicie Claude Code, que lee la variable al arrancar.
