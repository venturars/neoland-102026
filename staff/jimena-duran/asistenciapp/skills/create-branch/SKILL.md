---
name: create-branch
description: Crea o recupera la rama desde una base distinta autorizada.
---

# create-branch

La ejecuta agents/create-branch.md. Para staging usa create-branch-from-staging. Consulta la plantilla del tipo de templates/issues/ o la más cercana. Desde AsistenciApp: `& .\tools\create-branch.ps1 -Base $base -Issue $issueNumber -Type $type -Description $description`. Añade `-BranchName $branchName` solo para un nombre autorizado. No reemplaces ramas ni integres otras automáticamente. No commit, push ni PR.
