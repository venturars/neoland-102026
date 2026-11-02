---
name: pull-changes
description: Adelanta staging solo por avance rápido conservando la rama actual.
---

# pull-changes

La usa el orquestador en el segundo momento autorizado. Lee check-status. Desde AsistenciApp: `& .\tools\pull-changes.ps1`. Verifica el commit alcanzado y conserva la rama actual. Ante worktree, cambios versionados, divergencia o colisión, informa y detente sin resolver automáticamente. No autoriza commit, push ni PR.
