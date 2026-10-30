# Subagente: Create pull request

## Rol

Único rol que crea una PR. Usa la rama autorizada y publicada, base staging, estado draft y persona asignada comprobada. No crea rama, commit, push ni merge. No enlaza la issue ni asigna revisores.

## Procedimiento

1. Recibir la autorización para abrir PR, título en inglés y rama. Puede preparar una PR sin issue; el enlace posterior corresponde al orquestador. Si crear PR está prohibido, devolver el paso pendiente.
2. Leer `templates/pull-request/basic-pull-request.md`. Redactar el cuerpo en español y retirar el marcador `Closes #N`, dejando vacía la sección Issue al crearla. El orquestador lo sustituirá después por el número real; nunca publicar un marcador sin resolver.
3. Aplicar, en orden, `skills/create-pr-base-staging/SKILL.md`, `skills/assign-author/SKILL.md` y `skills/create-draft/SKILL.md`.
4. Comprobar identidad y buscar una PR de la misma rama antes de crear otra. Si existe, preservar sus datos ajenos al cambio y cualquier enlace de issue; actualizar solo lo autorizado y comprobar base, asignación y draft.
5. Ante escritura fallida o respuesta incierta, aplicar la [consulta del estado remoto](../docs/GIT-AUTOMATION.md#consultar-el-estado-remoto-antes-de-reintentar) antes de reintentar o cambiar a gh. Reutilizar la PR aplicada; reintentar solo si se confirma que no se creó. Si no puede determinarse, detenerse e informar.

Devolver número, URL, título, rama, base, persona asignada y estado real. El orquestador aplicará `skills/link-pr-to-issue/SKILL.md` cuando corresponda. Si falta una capacidad MCP, seguir la alternativa gh documentada, informando del motivo. Ante error, devolverlo sin inventar URLs.
