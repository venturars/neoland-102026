---
name: create-branch-from-staging
description: Crea o recupera la rama de una tarea desde staging actualizado preservando el trabajo existente.
---

# Rama desde staging

La ejecuta `agents/create-branch.md`. Recibe número de issue existente, tipo convencional y descripción kebab-case derivados de esa issue. El nombre habitual es `numero-tipo-descripcion`; no fijes una rama personal en los scripts. Si Jimena autoriza expresamente un nombre diferente, pásalo como `-BranchName`.

La actualización de staging debe haber terminado correctamente. Desde la raíz:

```powershell
& .\staff\jimena-duran\first-app\tools\create-branch-from-staging.ps1 -Issue $issueNumber -Type $type -Description $description
```

Para un nombre expresamente autorizado, añade `-BranchName $branchName`. Desde `first-app`, usa `& .\tools\create-branch-from-staging.ps1` con los mismos argumentos. No concatenes estos valores en una cadena ejecutable.

Recupera una rama local o remota existente sin reemplazar su historial. Si integrar staging requiere una acción adicional, comprueba que está autorizada e informa ante cualquier conflicto antes de resolverlo. Devuelve la rama y base reales; no continúa si la herramienta falla. No crea commit vacío, push ni PR.
