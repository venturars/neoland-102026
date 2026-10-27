---
name: create-issue
description: >-
  Deja una tarea escrita como issue de GitHub. Úsala cuando el alumno pide
  crear una issue, dejar la tarea escrita, o dice «crear una issue» o
  «crea la issue». No abre SKILL.md ni MCP.md.
---

# Dejar la tarea escrita

Lee solo esta skill, `.github/issue_template.md` y `scripts/new-issue.sh`. No abras `SKILL.md`, `MCP.md`, ni los `AGENTS.md` que te encuentres anidados.

1. La tarea es lo que dijo el alumno. Una carpeta o una app que nombre es una referencia, no una lista de requisitos. No abras su README, su spec ni su código para completar la issue. Si sus palabras admiten dos tareas, pregunta cuál es y espera. No redactes hasta que quede una.
2. Rellena `.github/issue_template.md`. El título va en inglés, en texto plano, sin prefijo tipo `chore:` o `feat:`, es concreto y tiene menos de 72 caracteres. La descripción va en español. Utiliza markdown. «Qué hay que hacer» dice esa tarea. «Cómo probarlo» comprueba esa tarea: el compañero mira el resultado pedido. No añadas pruebas de comportamiento que el alumno no haya incluido.
3. Enseña la persona asignada y el título, y espera el sí. No enseñes la descripción. El comando es `scripts/new-issue.sh --dry-run`: comprueba el título y que el cuerpo tenga las dos secciones, y solo imprime la persona y el título. La primera línea de stdin es el título. El resto es el cuerpo.
4. Con el sí, lanza el mismo script sin `--dry-run`. La respuesta incluye la persona asignada, el número, el título y la URL de la issue.
