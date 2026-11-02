---
name: create-branch-from-staging
description: Crea o recupera la rama desde staging actualizado.
---

# create-branch-from-staging

La ejecuta agents/create-branch.md con issue real, tipo y descripción. Consulta la plantilla del tipo de templates/issues/ o la más cercana. Desde AsistenciApp: `& .\tools\create-branch-from-staging.ps1 -Issue $issueNumber -Type $type -Description $description`. Solo añade `-BranchName $branchName` si ese nombre fue autorizado. Usa argumentos separados; comprueba la rama real y conserva sus commits existentes. No commit, push ni PR.
