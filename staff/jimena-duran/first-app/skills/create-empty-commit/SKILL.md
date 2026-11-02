---
name: create-empty-commit
description: Crea el commit vacío de apertura de una issue únicamente cuando la acción está autorizada.
---

# Commit de apertura

La ejecuta `agents/create-commit.md`. Necesita número de issue existente, rama autorizada de la tarea y autorización para crear el commit; crear una rama no concede esa autorización. Comprueba primero el estado. Nunca en main o staging.

Desde la raíz:

```powershell
& .\staff\jimena-duran\first-app\tools\create-empty-commit.ps1 -Issue $issueNumber -ExpectedBranch $branchName
```

Desde `first-app`, usa `& .\tools\create-empty-commit.ps1` con los mismos argumentos. El script usa un índice temporal para no incluir archivos preparados ajenos y produce `chore: open #N`. La rama esperada procede de la tarea actual, nunca de un nombre personal fijado en el script.

Devuelve hash, mensaje y rama verificados; confirma que el índice previo se conserva. Ante error, no vuelvas a intentar a ciegas: comprueba si el commit llegó a crearse. No hace push ni abre PR. La prohibición de commits de una entrega prevalece sobre este paso del flujo habitual.
