---
name: pull-changes
description: Actualiza staging mediante fast-forward para empezar una tarea sin reemplazar cambios locales ni forzar referencias.
---

# Actualizar la base

La llama el orquestador cuando el alcance autorizado incluye empezar una tarea. Primero lee `skills/check-status/SKILL.md`. No implica autorización para commit, push o PR.

Desde la raíz del repositorio:

```powershell
& .\staff\jimena-duran\first-app\tools\pull-changes.ps1
```

Desde `first-app`, usa `& .\tools\pull-changes.ps1`. No recibe argumentos. El script debe conservar la rama actual y actualizar staging únicamente si puede avanzarla de forma segura. Comprueba el resultado y comunica el commit alcanzado.

Si hay divergencia, cambios que bloquean la operación, otro worktree, un conflicto o fallo nativo, detén el flujo e informa antes de resolver. No uses reset, clean, stash automático ni una actualización forzada para sortear el fallo.
