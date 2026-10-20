# Tasks

1. Aprobar spec.md (producto + few-shot).
2. Aprobar plan.md (ficheros y openai local).
3. `npm install openai` en `first-app`.
4. Crear `logic/count-users-by-gender.js` según el plan
   (`listUsers`, cliente Ollama, few-shot del spec, recuento).
5. Crear `clients/terminal/count-users-by-gender.txt`.
6. Tests en `tests/users.test.js`: mock del cliente
   (Ada/Juan/Alex → 1, 1, 1; vacía → ceros; fallo →
   `Could not classify the user`).
7. Desde `first-app`: `npm test`.
8. Snippet real solo si Ollama está en marcha con el modelo del plan.
