# Tasks

1. Aprobar spec.md (producto + few-shot: dos women, dos men
   y un undefined).
2. Aprobar plan.md (excepción de nimble-v3, sin paquete openai).
3. Crear `logic/users-gender-count.js` según el plan
   (`findAll`, grupos de 6, systemone, recuento).
4. Crear `clients/terminal/users-gender-count.txt`.
5. Tests en `tests/users.test.js`: mock de `fetch`
   (URL systemone; 7 personas → 2 peticiones; respuesta corta →
   ese grupo `genderUndefined`; fallo →
   `Could not classify the users`; tabla vacía no llama a fetch;
   tabla ausente lanza el mismo error).
6. Desde `first-app`: `npm test`.
7. Snippet real con Ollama en marcha y con Ollama parado.
