Issue: #1011

# Tareas — Sincronizar el flujo de Git con el template

Estado: completadas tras la autorización expresa.

## 1. [x] Confirmar la fuente

Comprobar que se trabaja en la rama de la tarea y que el template coincide con `staging`.

## 2. [x] Actualizar los agentes

Copiar del template `agents/git-workflow-agent.md`, `agents/help-me-to-think.md` y `agents/create-pr.md`.
En `agents/create-pr.md`, conservar la regla local sobre una pull request que ya existe.

## 3. [x] Actualizar las entrevistas

Copiar del template `skills/grill-me/SKILL.md` y `skills/grill-with-docs/SKILL.md`.
Comprobar que ambas permiten varias preguntas por ronda.

## 4. [x] Actualizar las skills de commit y draft

Copiar del template `skills/commit-changes/SKILL.md` conservando la ruta local de `tools/`.
Copiar del template `skills/create-draft/SKILL.md`.

## 5. [x] Incorporar la creación de la pull request

Copiar `tools/create-pr-base-staging.sh` con permiso de ejecución.
Copiar `skills/create-pr-base-staging/SKILL.md` con la ruta local y la remisión a la regla de `agents/create-pr.md`.

## 6. [x] Actualizar las guías

Añadir a `docs/TREE.md` el script nuevo y la carpeta de esta spec.
Actualizar en `docs/ARCHITECTURE.md` el momento Empezar y el número de scripts.

## 7. [x] Comprobar y cerrar

Ejecutar la comprobación del plan y registrar los resultados reales en él.
Hacer commit solo de los archivos de esta tarea y subir la rama.
