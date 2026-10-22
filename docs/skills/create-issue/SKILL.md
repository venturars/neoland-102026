---
name: create-issue
description: >-
  Deja una tarea escrita como issue de GitHub. Úsala cuando el alumno pide
  crear una issue, dejar la tarea escrita, o dice «crear una issue» o
  «crea la issue». No abre SKILL.md ni MCP.md.
---

# Dejar la tarea escrita

Lee solo esta skill, `.github/issue_template.md` y `scripts/new-issue.sh`. No abras `SKILL.md`, `MCP.md`, ni los `AGENTS.md` que te encuentres anidados.

1. La tarea sale de lo que dijo el alumno.
2. Rellena `.github/issue_template.md`. El título va en inglés, es concreto y tiene menos de 72 caracteres. La descripción va en español. Utiliza markdown.
3. Enseña solo la persona asignada y el título, y espera el sí. No enseñes el cuerpo. El comando es `scripts/new-issue.sh --dry-run`. La primera línea de stdin es el título. El resto es el cuerpo.
4. Con el sí, lanza el mismo script sin `--dry-run`. La respuesta incluye la persona asignada, el número, el título y la URL de la issue.
