---
name: commit-changes
description: Guarda solo los archivos explícitos de una tarea mediante un commit autorizado conservando el índice ajeno.
---

# Guardar un trozo

La ejecuta `agents/create-commit.md`. Recibe una lista explícita de archivos, mensaje convencional en inglés y rama autorizada. Revisa el diff de esos archivos antes de guardar; no amplíes la lista para incluir todos los cambios. Nunca en main o staging y nunca sin autorización de commit.

Desde la raíz:

```powershell
& .\staff\jimena-duran\first-app\tools\commit-changes.ps1 -Message $message -Paths $filePaths -ExpectedBranch $branchName
```

`$filePaths` es un array de rutas de archivos relativas a la raíz del repositorio; cita literalmente las rutas con espacios. Desde `first-app`, usa `& .\tools\commit-changes.ps1` con las mismas rutas relativas a la raíz, no al directorio actual. No pases directorios, comodines ni opciones como archivos.

El script usa un índice temporal y conserva los archivos preparados que no forman parte del commit. Verifica el hash, los archivos incluidos y el índice posterior. Si falla, informa y comprueba el estado antes de reintentar. No uses `git add .`, reset, clean ni stash automático. No hagas push ni abras PR desde esta skill. Las restricciones de la entrega actual prevalecen.
