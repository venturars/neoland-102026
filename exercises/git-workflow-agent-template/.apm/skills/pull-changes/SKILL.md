---
name: pull-changes
description: "Adelanta la rama base local a su remoto con un fast-forward, sin cambiar de rama. Úsala al empezar, antes de crear la rama de trabajo."
---

### Herramienta: PULL_CHANGES

- **Descripción**: Úsala única y exclusivamente para adelantar la rama base con un fast-forward desde `origin`. El orquestador siempre actualiza la rama base, esté en la rama que esté. No la uses si la rama base exige un merge o un rebase.
- **Comando de Terminal**: `"<carpeta de esta skill>/scripts/pull-changes.sh"`

El comando se lanza desde la raíz del repositorio git. La carpeta de esta skill es la que contiene este `SKILL.md`: en Claude Code, `${CLAUDE_SKILL_DIR}`; en Cursor y Codex, `.agents/skills/pull-changes`.

#### Especificación de Argumentos

No recibe argumentos. Adelanta la rama base local a la de `origin`. La rama base es `GIT_WORKFLOW_BASE` si está definida, si no `staging` si existe en `origin`, y si no la rama por defecto del remoto. No cambia de rama.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: El script escribe la rama base y en qué commit quedó. Si el código de salida no es 0, la rama base no se pudo adelantar. Comunica el texto y no fuerces la integración. La rama en la que estabas no importa.
