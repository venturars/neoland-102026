---
name: create-draft
description: Comprueba o restaura el estado borrador de una PR autorizada sin crear otra ni publicarla para revisión.
---

# Mantener el borrador

La llama `agents/create-pr.md` después de abrir o recuperar una PR. Recibe número o URL, rama y base staging comprobados. Lee su estado: si ya es draft, no escribas. Si está cerrada o fusionada, informa y detente.

Comprueba identidad `jiji-mena`. Prefiere la herramienta MCP correspondiente cuando exista y use esa identidad; de lo contrario informa y usa `gh` autenticado como Jimena:

```powershell
gh pr ready $number --repo $repository --undo
```

Comprueba `$LASTEXITCODE` y relee `isDraft`. Devuelve el estado real. No cambies base, cuerpo, revisores ni issue desde esta skill. No saques de draft una PR sin que Jimena pida revisión; eso corresponde a `assign-reviewers`.

En los comandos, `$repository` es el repositorio `owner/name` comprobado a partir de origin y del contexto de esta tarea. No lo tomes de un nombre personal fijo ni actúes sobre otro repositorio.

Si falla una escritura o su respuesta es incierta, antes de reintentar o cambiar a gh aplica la [consulta del estado remoto](../../docs/GIT-AUTOMATION.md#consultar-el-estado-remoto-antes-de-reintentar): relee draft, conserva el resultado si ya se aplicó y reintenta solo si se confirma que no se aplicó. Si no puede determinarse, detente e informa. La regla incluye comprobar el almacén de Windows ante un 401 dentro del sandbox.
