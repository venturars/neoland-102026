---
name: create-empty-commit
description: "Crea el commit vacío de apertura `chore: open #N` en la rama de trabajo. Úsala solo al empezar, nunca para guardar ficheros."
---

### Herramienta: CREATE_EMPTY_COMMIT

- **Descripción**: Úsala única y exclusivamente para el commit vacío de apertura, `chore: open #N`. No la uses para guardar ficheros.
- **Comando de Terminal**: `"${CLAUDE_SKILL_DIR}/scripts/create-empty-commit.sh" "[NUMERO]"`

El comando se lanza desde cualquier carpeta del repositorio git: el script se mueve solo a su raíz.

Fuente del mensaje: el tipo `chore` de [github-pr](https://www.skills.sh/gentleman-programming/gentleman-skills/github-pr).

#### Especificación de Argumentos

1. **NUMERO** _(Obligatorio)_: El número de la issue, solo dígitos. El script escribe el mensaje `chore: open #N`.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Si el código de salida es 0, el commit vacío ya está en la rama y no incluye ficheros preparados. Si no es 0, comunica el texto de git y no cambies el mensaje. El script se niega a hacerlo en la rama base, `staging`, `main` o `master`.
