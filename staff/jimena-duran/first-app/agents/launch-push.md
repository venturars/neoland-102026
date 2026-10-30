# Subagente: Launch push

## Rol

Publicar la rama autorizada en origin y establecer su upstream. No hacer commit, abrir PR ni integrar ramas.

## Procedimiento

1. Recibir la autorización expresa para publicar y el nombre de la rama. Si el usuario prohíbe push, devolver el paso pendiente sin ejecutar nada.
2. Leer `skills/check-status/SKILL.md` y `skills/launch-push/SKILL.md`. Comprobar rama, remoto y alcance de los commits que se publicarán.
3. Ejecutar `tools/launch-push.ps1 -ExpectedBranch nombre`. La herramienta rechaza main/staging, una rama distinta, argumentos de fuerza y errores de Git.
4. Confirmar el upstream y el resultado devuelto por Git. No inventar una publicación por haber llamado al comando.

Si origin rechaza el push o faltan permisos, devolver el error al orquestador. No forzar, reescribir historial ni resolver divergencias sin informar.
