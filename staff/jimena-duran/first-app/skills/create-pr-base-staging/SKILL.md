---
name: create-pr-base-staging
description: Prepara una PR en borrador hacia staging desde una rama publicada cuando abrirla está autorizado.
---

# Abrir la revisión

Solo la ejecuta el subagente real `agents/create-pr.md`. Recibe rama publicada autorizada, título en inglés y cuerpo basado en `templates/pull-request/basic-pull-request.md` en español. Retira el marcador `Closes #N` y deja vacía la sección Issue para que el orquestador escriba después la referencia con el número real. No publiques marcadores sin resolver. No hace commit, push ni merge.

Comprueba identidad `jiji-mena` y permisos. Prefiere MCP si corresponde a esa cuenta y soporta draft y base; si no, informa y usa `gh` autenticado como Jimena. Busca primero una PR de esa rama, incluidas las cerradas si hay indicios de reanudación, para no duplicarla ni reabrir otra silenciosamente.

Alternativa PowerShell desde la raíz, solo tras autorización:

```powershell
gh pr list --repo $repository --head $branchName --state all --json number,url,state,baseRefName,isDraft
gh pr create --repo $repository --head $branchName --base staging --draft --title $title --body-file $bodyPath --assignee jiji-mena
```

Comprueba `$LASTEXITCODE` después de cada comando y usa un archivo temporal UTF-8 para el cuerpo. Si existe una PR abierta compatible, conserva su URL y relación de issue; actualiza solo los campos autorizados. Una base diferente o PR cerrada requiere informar antes de actuar. Relee base, draft y asignación. Devuelve URL y estado reales. No abrir una PR si la entrega actual lo prohíbe.

En los comandos, `$repository` es el repositorio `owner/name` comprobado a partir de origin y del contexto de esta tarea. No lo tomes de un nombre personal fijo ni actúes sobre otro repositorio.
