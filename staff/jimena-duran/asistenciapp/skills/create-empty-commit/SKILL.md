---
name: create-empty-commit
description: Prepara únicamente el commit de apertura autorizado.
---

# create-empty-commit

La ejecuta agents/create-commit.md en el segundo momento cuando publicar la apertura está autorizado. Comprueba que no existe ya ese commit de apertura antes de crearlo. Desde AsistenciApp: `& .\tools\create-empty-commit.ps1 -Issue $issueNumber -ExpectedBranch $branchName`. Verifica hash y ausencia de archivos incluidos; conserva el índice ajeno. No push ni PR.
