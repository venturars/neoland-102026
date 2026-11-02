---
name: commit-changes
description: Guarda solo los archivos explícitos autorizados.
---

# commit-changes

La ejecuta agents/create-commit.md. Desde AsistenciApp: `& .\tools\commit-changes.ps1 -Message $message -Paths $filePaths -ExpectedBranch $branchName`. El mensaje es convencional en inglés, de una línea; conserva esa regla independiente de las plantillas. `$filePaths` es un array real de archivos relativos a la raíz Git, incluso al invocar desde la aplicación. No directorios, comodines, opciones ni incorporación masiva. Revisa diff, hash, contenido del commit e índice posterior. No push ni PR.
