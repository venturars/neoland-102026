---
name: link-pr-to-issue
description: Relaciona desde el orquestador una PR existente con su issue sin crear recursos ni prometer cierre automático.
---

# Relacionar la tarea

La ejecuta el orquestador después de recibir la PR de `create-pr`; no la llama ese subagente. Recibe issue y PR existentes en el repositorio comprobado, con base staging.

1. Lee ambos recursos y el cuerpo completo de la PR. Comprueba identidad `jiji-mena`; prefiere MCP compatible con esa cuenta y, si no es suficiente o la identidad difiere, informa y usa `gh` autenticado como Jimena.
2. Conserva el resto del cuerpo y deja en su sección Issue una única línea `Related to #N`. Sustituye cualquier referencia de cierre de esa misma issue por esa relación; no alteres otras referencias sin revisar su propósito. Usa un archivo temporal UTF-8 si la alternativa es `gh pr edit $prNumber --repo $repository --body-file $bodyPath`. Comprueba `$LASTEXITCODE`.
3. Relee el cuerpo para confirmar la relación. La línea por sí sola no acredita un enlace en Development. Si la herramienta disponible permite ese enlace, verifica antes su contrato, autorización y resultado; no copies una mutación GraphQL sin comprobar su soporte. Si no puede verificarse, informa de que Development queda pendiente.
4. Devuelve por separado el resultado del cuerpo y el de Development. No afirmes cierre automático al fusionar en staging, no cierres la issue y no crees una PR o issue nueva.

Esta skill modifica una PR y necesita autorización aplicable. Si la entrega actual prohíbe operaciones sobre PR, informa de que el paso está pendiente y no lo ejecutes como prueba.

En los comandos, `$repository` es el repositorio `owner/name` comprobado a partir de origin y del contexto de esta tarea. No lo tomes de un nombre personal fijo ni actúes sobre otro repositorio.
