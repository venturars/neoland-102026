---
name: assign-author
description: Asigna una issue o PR autorizada a la cuenta comprobada de Jimena sin cambiar su autoría.
---

# Asignar a Jimena

Recibe tipo de recurso y número o URL comprobados. Verifica cuenta `jiji-mena`, repositorio y asignaciones existentes antes de escribir. Asignar no cambia quién creó el recurso.

Prefiere MCP GitHub si su identidad coincide con Jimena y soporta el paso. Si no es suficiente o pertenece a otra cuenta, informa y usa `gh` con la sesión comprobada. Desde PowerShell: `gh issue edit $number --repo $repository --add-assignee jiji-mena` o `gh pr edit $number --repo $repository --add-assignee jiji-mena`, según el recurso. Comprueba `$LASTEXITCODE`.

Si ya está asignada, no escribas. Conserva las demás personas asignadas. Relee el recurso y devuelve la asignación real, o el error y la operación pendiente. No crees recursos ni asignes revisores desde esta skill.

En los comandos, `$repository` es el repositorio `owner/name` comprobado a partir de origin y del contexto de esta tarea. No lo tomes de un nombre personal fijo ni actúes sobre otro repositorio.

Si una escritura falla o su respuesta es incierta, antes de reintentar o cambiar a gh aplica la [consulta del estado remoto](../../docs/GIT-AUTOMATION.md#consultar-el-estado-remoto-antes-de-reintentar): relee las asignaciones y reutiliza el resultado aplicado; reintenta solo lo confirmado como no aplicado y detente si no puede determinarse. La regla incluye la comprobación del almacén de Windows ante un 401 dentro del sandbox.
