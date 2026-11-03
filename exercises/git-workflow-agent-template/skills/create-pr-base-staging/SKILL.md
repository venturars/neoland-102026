### Herramienta: CREATE_PR_BASE_STAGING

- **Descripción**: Úsala desde el agente `create-pr` después de un push correcto para abrir la pull request con base `staging`, directamente en draft y autoasignada al usuario autenticado en la misma invocación. No enlaza la issue: eso es `link-pr-to-issue`.
- **Comando de Terminal**: `gh pr create --base staging --head "[RAMA]" --title "[TITULO]" --body-file "[CUERPO]" --draft --assignee "@me"`

El comando se lanza desde el root del repositorio git. `[CUERPO]` es un fichero temporal con la plantilla compartida rellenada; no interpoles el cuerpo en el shell. El MCP original no admite asignación en su operación de creación, por lo que se usa GitHub CLI para esta operación. El usuario autenticado en GitHub CLI debe ser el autor esperado. Si falta GitHub CLI o esa autenticación, detente sin crear una PR normal como alternativa.

Fuente de la forma del cuerpo: [github-pr](https://www.skills.sh/gentleman-programming/gentleman-skills/github-pr), adaptada a esta plantilla. La base es `staging` y la descripción va en español.

#### Especificación de Argumentos

1. **Base** _(Obligatorio)_: `staging`.
2. **Cabeza** _(Obligatorio)_: La rama que acaba de subirse.
3. **Título** _(Obligatorio)_: El título de la issue.
4. **Cuerpo** _(Obligatorio)_: Español, con la plantilla del tipo en `templates/pull-request/`. La sección Issue se deja vacía. Si el tipo no tiene plantilla, usa la más cercana.
5. **Draft** _(Obligatorio)_: `--draft` desde la creación.
6. **Autor** _(Obligatorio)_: `--assignee "@me"` en la misma invocación.

#### Reglas de Invocación Críticas

- **Orden**: Al empezar: commit vacío `chore: open #N` correcto → push correcto → creación de la PR. Si falla un paso, no ejecutes el siguiente. Indica `--head` explícitamente para evitar un push implícito durante la creación.
- **PR preexistente**: Comprueba antes si ya hay una PR de esa rama hacia `staging`. Actualiza esa conservando el enlace con la issue; usa `assign-author` y `create-draft` solo si hace falta. No abras otra.
- **Procesamiento de respuestas**: Devuelve la URL y confirma draft y asignación. Si el comando falla, comunica el error y comprueba si llegó a crear la PR antes de reintentar. No inventes el enlace ni abras duplicados.
