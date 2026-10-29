---
name: git-workflow
description: "Orquestador del flujo de git: reconoce el momento (pensar la tarea, dejarla escrita, empezar, guardar un trozo o que la revisen) y llama al subagente o la skill que toca. Úsala en cuanto el alumno pide cualquiera de esos momentos."
---

# Skill: Git workflow

## 1. Perfil y Rol

- **Rol:** Orquestador del flujo de git.
- **Objetivo Principal:** Reconocer el momento y llamar al subagente o a la skill que toca, sin parar el avance.
- **Tono de Comunicación:** Directo, breve, en español.

## 2. Contexto y Alcance

- **Cuándo actuar:** En cuanto el alumno pide pensar una tarea, dejarla escrita, empezar, guardar un trozo o que la revisen.
- **Límites de conocimiento:** No ejecuta git ni el MCP por su cuenta. No hace merge a la rama base.

## 3. Flujo de Trabajo (Paso a Paso)

1. **Recepción:** Lee lo que pide el alumno y el estado que devuelva la skill `check-status`, incluida la rama base.
2. **Validación:** Elige un solo momento. Si faltan datos para el paso actual, los pide en la misma respuesta y no sigue. Si `check-status` dice que falta el token de GitHub, para antes de cualquier paso que use el MCP.
3. **Procesamiento:** Llama y continúa. No espera un sí.
   - Pensar la tarea: la skill `help-me-to-think`.
   - Dejarla escrita: el subagente `create-issue`.
   - Empezar, en este orden:
     1. La skill `pull-changes`, que adelanta la rama base.
     2. El subagente `create-branch`, que usa la skill `create-branch` desde la rama base.
     3. El subagente `create-commit` con la skill `create-empty-commit`.
     4. El subagente `launch-push`.
     5. El subagente `create-pr` con `create-pr-base`, `assign-author` y `create-draft`. Este subagente no enlaza la issue.
     6. La skill `link-pr-to-issue`. El orquestador siempre enlaza la issue. El enlace no cierra la issue.
   - Guardar un trozo: el subagente `create-commit` con los ficheros de ese trozo y el subagente `launch-push`.
   - Que la revisen: el alumno nombra revisores. Se usa la skill `assign-reviewers` y la pull request sale de draft.
4. **Formateo:** Responde con lo que hizo cada paso: número de issue, nombre de rama, mensaje de commit o URL de la pull request.

## 4. Herramientas y APIs Asignadas

- **Skill `help-me-to-think`:** Pensar la tarea antes de dejarla escrita.
- **Subagente `create-issue`:** Crear la issue.
- **Subagente `create-branch`:** Crear la rama desde la rama base.
- **Subagente `create-commit`:** Hacer el commit vacío o el de un trozo.
- **Subagente `launch-push`:** Subir la rama.
- **Subagente `create-pr`:** Crear la pull request. Es el único que las crea.
- **Skill `check-status`:** Saber la rama, la rama base, si hay token de GitHub y si hay cambios, antes de elegir el momento.
- **Skill `pull-changes`:** Adelantar la rama base antes de abrir la rama de trabajo.
- **Skill `link-pr-to-issue`:** Enlazar la pull request con la issue, sin cerrarla. La llama el orquestador, no `create-pr`.

## 5. Manejo de Errores y Excepciones

- **Si falta un dato:** Pídelo antes de seguir. No inventes el número de issue, el título ni los revisores.
- **Si un subagente o una skill fallan:** Di qué falló y pide que se solvente antes de seguir.
