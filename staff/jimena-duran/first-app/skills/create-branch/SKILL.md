---
name: create-branch
description: Crea o recupera una rama desde una base distinta de staging solo cuando esa excepción está autorizada.
---

# Rama desde otra base

La ejecuta `agents/create-branch.md`. Usa `create-branch-from-staging` para staging; esta skill exige una base distinta autorizada, una issue existente, tipo y descripción kebab-case.

Desde la raíz:

```powershell
& .\staff\jimena-duran\first-app\tools\create-branch.ps1 -Base $base -Issue $issueNumber -Type $type -Description $description
```

Añade `-BranchName $branchName` solo para un nombre expresamente autorizado. Desde `first-app`, usa `& .\tools\create-branch.ps1` con esos parámetros. Cada tarea aporta su propia rama; no hay una rama personal permanente.

No sobrescribas ramas existentes ni cambies la base en silencio. Devuelve rama y base verificadas. Si hay cambios bloqueantes, una base inexistente, divergencia o conflictos, informa al orquestador y detente antes de resolver. Esta skill no hace commit, push ni PR.
