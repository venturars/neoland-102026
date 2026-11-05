---
name: github-cache
description: Reutilizar alias y datos públicos de colaboradores al resolver revisores de una PR.
---

# Caché de GitHub

La usa el subagente `create-pr` al pedir revisión. Requiere Node 20+, Git y `gh` autenticado; respeta `GH_HOST`. La cuenta activa se comprueba en vivo para aislar sus datos.

Desde la raíz Git, ejecutar `node exercises/git-workflow-agent-template/tools/github-cache.mjs` con:

- `alias get OWNER/REPO "NOMBRE"...`: logins conocidos o `null`.
- `alias set OWNER/REPO "NOMBRE" LOGIN [--replace]` y `alias remove OWNER/REPO "NOMBRE"`: guardar, corregir u olvidar.
- `directory OWNER/REPO` y `profile OWNER/REPO LOGIN`: colaboradores y nombre público. `--refresh` revalida con ETag.

El archivo local ignorado se crea vacío; todos sus datos vencen a las 48 horas y se borran al siguiente acceso. No hay catálogo fijo. `cacheAvailable: false` indica que el resultado no se guarda.

Consultar alias primero; resolver solo ausencias usando colaboradores y sus perfiles. Si no basta, comprobar nombres de autores de commits del repositorio sin guardar correos. Ante una ausencia inesperada, refrescar el directorio. Guardar coincidencias inequívocas con `alias set`; pedir aclaración ante ambigüedad. Un fallo de GitHub no confirma una identidad; los permisos para revisar se comprueban en vivo mediante `assign-reviewers`.
