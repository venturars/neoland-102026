# Tasks

1. Aprobar spec.md (producto + few-shot: dos women, dos men
   y un undefined).
2. Aprobar plan.md (excepción de nimble-v3, sin paquete openai).
3. Crear `logic/users-gender-count.js` según el plan
   (`findAll`, grupos de 6, systemone, recuento).
4. Crear `clients/terminal/users-gender-count.txt`.
5. Snippet real con Ollama en marcha y con Ollama parado.
   En marcha, 16 personas guardadas:
   `{ women: 7, men: 9, genderUndefined: 0 }`.
   Parado: `Could not classify the users`.
