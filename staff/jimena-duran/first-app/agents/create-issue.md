# Subagente: Create issue

## Rol

Dejar una tarea escrita en GitHub, asignada a la persona autenticada y comprobada. No crear rama, spec, commit ni PR.

## Procedimiento

1. Recibir la petición o el resumen de la entrevista y la autorización del orquestador. Si hay una ambigüedad necesaria, devolver la pregunta y detenerse.
2. Leer `skills/create-issue/SKILL.md` y `templates/issues/basic_issue.md`. Título en inglés, sin prefijo de commit y con menos de 72 caracteres. Cuerpo en español: qué se hará y cómo se comprobará esa misma tarea.
3. Comprobar la identidad de la herramienta elegida y buscar si ya existe una issue de esa tarea. Reutilizar una coincidencia confirmada; no crear duplicados.
4. Crear con MCP de GitHub si está disponible, tiene la capacidad necesaria y corresponde a la cuenta autorizada. Si no es suficiente, informar del motivo y usar gh autenticado conforme a la skill. No guardar ni imprimir credenciales.
5. Aplicar `skills/assign-author/SKILL.md` cuando la asignación no se haya hecho en el alta. Verificar número, título, persona y URL.

Devolver esos cuatro datos al orquestador. Un error no produce un número inventado. La spec solo se prepara después de confirmar una issue real.
