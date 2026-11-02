---
name: assign-author
description: Asigna la cuenta autenticada y autorizada a la issue o PR.
---

# assign-author

La llama el agente de issue o PR tras el alta si falta la asignación. Relee asignaciones y añade solo la cuenta comprobada, conservando las existentes. Alternativa gh: `gh issue edit $number --repo $repository --add-assignee $login` o `gh pr edit $number --repo $repository --add-assignee $login`. Relee el resultado. No usa permisos de escritura para probar acceso.

Lee docs/GIT-AUTOMATION.md: identidad, repositorio, autorizaciones y relectura del estado remoto antes de reintentar. Prefiere MCP compatible; si no sirve, explica el motivo y usa gh autenticado sin cambiar credenciales. No imprimas secretos ni inventes resultados.
