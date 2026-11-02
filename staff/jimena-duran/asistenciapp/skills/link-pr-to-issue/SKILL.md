---
name: link-pr-to-issue
description: Enlaza la issue desde el orquestador sin cerrarla manualmente.
---

# link-pr-to-issue

La ejecuta el orquestador después de create-pr; ese agente no la llama. Lee issue, PR y cuerpo completos. En la sección Issue de la plantilla seleccionada deja una única línea `Closes #N` real, preservando el resto del cuerpo y otros vínculos. El marcador Closes # ya se retiró al alta. Si la referencia existe, no la dupliques. Alternativa gh: `gh pr edit $number --repo $repository --body-file $bodyPath`.

Lee Development por separado antes y después. Verifica la rama predeterminada: la palabra de cierre no garantiza vínculo o cierre al fusionar en staging si esta no es la predeterminada. Conserva vínculos ajenos. No copies mutaciones GraphQL sin verificar contrato, soporte y permiso. Si no puede verificarse el vínculo, devuélvelo pendiente, sin inventarlo ni cerrar la issue.

Lee docs/GIT-AUTOMATION.md: identidad, repositorio, autorizaciones y relectura del estado remoto antes de reintentar. Prefiere MCP compatible; si no sirve, explica el motivo y usa gh autenticado sin cambiar credenciales. No imprimas secretos ni inventes resultados.
