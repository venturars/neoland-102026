---
name: create-issue
description: "Crea la issue en GitHub con título en inglés y cuerpo en español según la plantilla, asignada al usuario autenticado. Úsala para dejar la tarea escrita."
---

### Herramienta: CREATE_ISSUE

- **Descripción**: Úsala única y exclusivamente para dejar la tarea escrita en GitHub. No la uses para abrir la rama ni la pull request.
- **MCP**: El servidor MCP `github`, declarado en `apm.yml`. No uses `gh` ni un script.

#### Especificación de Argumentos

1. **Título** _(Obligatorio)_: Inglés, menos de 72 caracteres.
2. **Cuerpo** _(Obligatorio)_: Español. Rellena la plantilla `<carpeta de esta skill>/assets/basic_issue.md` (en Claude Code, `${CLAUDE_SKILL_DIR}`; en Cursor y Codex, `.agents/skills/create-issue`) con «Qué hay que hacer» y «Cómo probarlo».
3. **Persona asignada** _(Obligatorio)_: El usuario autenticado en el MCP.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Quédate con el número, el título y la URL. Si el MCP devuelve un error, comunícalo y no inventes el número.
