# Plan — recuento de géneros

Cumple `docs/specs/recuento-generos/spec.md` (tres números y el few-shot).
Aquí solo el encaje en first-app.

## Excepción del modelo aprobado

La única diferencia aprobada es la petición. `nimble-v3` no habla
chat, así que no hay paquete `openai` ni `/v1/chat/completions`.
No hay mensajes user/assistant ni un JSON con un array `genders`.

`usersGenderCount()` es una sola función: `findAll`, grupos de 6,
recuento `{ women, men, genderUndefined }`, y
`Could not classify the users` si falla la base o la petición.

El cuerpo de la petición es lo distinto:
`POST http://127.0.0.1:11434/v1/systemone`.
Modelo `process.env.OLLAMA_MODEL` o `nimble-v3`.
Como máximo 6 nombres en `state.names` y una pregunta `choice`
por nombre (`women` / `men` / `undefined`). El few-shot del spec
va en las instrucciones: Carmen, Lucia, Javier, Pablo, Kim.

## Reutilizar

- `findAll` en `queries/users.js` para leer a todas las personas
  ya guardadas.

## Nuevo

- `usersGenderCount()` en `logic/users-gender-count.js`
  (sin argumentos, sin funciones auxiliares, sin `decide`).
- Lee con `findAll` dentro de try/catch. Tabla vacía devuelve
  `{ women: 0, men: 0, genderUndefined: 0 }` y no llama a Ollama.
- Grupos de 6. Si `fetch` lanza o la respuesta no es ok:
  `Could not classify the users`.
- Si faltan respuestas o no hay una por nombre, ese grupo entero
  suma a `genderUndefined` y se sigue.
- Si la choice no es `women` ni `men`, esa persona suma a
  `genderUndefined`.
- `clients/terminal/users-gender-count.txt` hace `console.log`
  del recuento.

## No tocar

- create, update, delete, find-by-email, find-user-by-id.
- No guardar el recuento en SQLite.
- No el paquete `openai`.
