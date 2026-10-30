---
name: link-pr-to-issue
description: Vincula desde el orquestador una PR existente con Closes y conserva Development sin cerrar issues manualmente.
---

# Relacionar la tarea

La ejecuta el orquestador después de recibir la PR de `create-pr`; no la llama ese subagente. Recibe issue y PR existentes en el repositorio comprobado, con base staging.

1. Lee ambos recursos y el cuerpo completo de la PR. Comprueba identidad `jiji-mena`; prefiere MCP compatible con esa cuenta y, si no es suficiente o la identidad difiere, informa y usa `gh` autenticado como Jimena.
2. Conserva el resto del cuerpo y deja en su sección Issue una única línea `Closes #N`, con el número real. Si ya existe, no la dupliques. Sustituye `Related to #N` u otra referencia aislada de esa misma issue por `Closes #N`; no alteres referencias a otras issues. Usa un archivo temporal UTF-8 si la alternativa es `gh pr edit $prNumber --repo $repository --body-file $bodyPath`. Comprueba `$LASTEXITCODE`.
3. Lee Development antes de modificar y conserva sus vínculos existentes. Relee el cuerpo para confirmar la línea. La palabra de cierre no acredita por sí sola un enlace en Development cuando la PR apunta a staging y esta no es la rama predeterminada. Si falta el enlace y la herramienta permite crearlo, comprueba primero contrato, autorización y resultado; no copies una mutación GraphQL sin verificar su soporte. Si no puede verificarse, informa de que Development queda pendiente; no elimines enlaces para recrearlos.
4. Devuelve por separado el resultado del cuerpo y el de Development. No llames a una API ni a `gh issue close` para cerrar la issue. No crees una PR o issue nueva ni cambies la base staging desde esta skill.

GitHub interpreta las palabras de cierre de una PR solo si esta apunta a la rama predeterminada del repositorio. Comprueba esa rama en los metadatos, sin asumirla. Si es main y la PR apunta a staging, `Closes #N` no crea automáticamente el vínculo ni cierra la issue al fusionar en staging. Al promover el cambio a la rama predeterminada se debe conservar y verificar la referencia de cierre en la PR o commit que llegue a ella; no prometer cierre por el solo hecho de añadir esta línea a la PR de staging.

Esta skill modifica una PR y necesita autorización aplicable. Si la entrega actual prohíbe operaciones sobre PR, informa de que el paso está pendiente y no lo ejecutes como prueba.

En los comandos, `$repository` es el repositorio `owner/name` comprobado a partir de origin y del contexto de esta tarea. No lo tomes de un nombre personal fijo ni actúes sobre otro repositorio.

Antes de reintentar una escritura fallida o cambiar a gh, aplica la [consulta del estado remoto](../../docs/GIT-AUTOMATION.md#consultar-el-estado-remoto-antes-de-reintentar): relee el cuerpo completo y Development por separado. Conserva los resultados aplicados y completa solo lo confirmado como pendiente y autorizado. Si no puede determinarse, detente e informa; no dupliques referencias ni recrees vínculos. La regla incluye comprobar el almacén de Windows ante un 401 dentro del sandbox.
