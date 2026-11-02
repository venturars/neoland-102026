# TASK CHECKLIST: [Código de la Issue]

<!--
  Cada task lleva el agente que la ejecuta.
  Los cuatro del cambio son concept_developer, code_developer, code_tester
  y concept_tester. Los pasos de git conservan su agente de git.
-->

## FASE 1: PREPARACIÓN Y ENTORNO

- [ ] **TASK-01:** Crear rama del feature a partir de `staging`
  - **Agente:** `create-branch`
- [ ] **TASK-02:** Ejecutar la suite de tests actual para asegurar la consistencia del estado actual
  - **Agente:** `code_tester`

## FASE 2: IMPLEMENTACIÓN DE CÓDIGO

- [ ] **TASK-03:** Modificar o crear la lógica técnica definida en `plan.md`
  - **Agente:** `code_developer`
- [ ] **TASK-04:** Implementar el manejo de errores y los casos de borde de `spec.md`
  - **Agente:** `code_developer`
- [ ] **TASK-05:** Si `code_developer` dejó documentación desfasada, actualizarla en la misma ronda. Si no, se marca hecha sin editar.
  - **Agente:** `concept_developer`

## FASE 3: VERIFICACIÓN Y VALIDACIÓN

- [ ] **TASK-06:** Escribir y ejecutar los tests de pytest definidos en `plan.md`
  - **Agente:** `code_tester`
- [ ] **TASK-07:** Comprobar que la documentación y la spec dicen lo mismo que el código
  - **Agente:** `concept_tester`
- [ ] **TASK-08:** Ejecutar Black y Ruff
  - **Agente:** `code_developer`

## FASE 4: PREPARACIÓN DE PULL REQUEST

- [ ] **TASK-09:** Generar el mensaje de commit y guardar el trozo
  - **Agente:** `create-commit`
- [ ] **TASK-10:** Crear la pull request apuntando a `staging`
  - **Agente:** `create-pr`
