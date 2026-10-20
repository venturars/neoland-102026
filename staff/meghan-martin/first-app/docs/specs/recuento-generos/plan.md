# Plan — recuento de géneros

Cumple `docs/specs/recuento-generos/spec.md` (salida: tres números
y el few-shot). Aquí solo el encaje en first-app.

## Reutilizar
- `listUsers()` en `logic/list-users.js` para leer a todas las
  personas ya guardadas (`findAll` en `queries/users.js`).

## Nuevo
- `countUsersByGender()` en `logic/count-users-by-gender.js`
  (fichero nuevo; no reemplaza logic existente).
- `nimble-v3` no habla chat. Por cada `user.name`, `POST`
  `http://127.0.0.1:11434/v1/systemone` (decisión local).
  Few-shot del spec va en las instrucciones. La respuesta es el
  `choice` (`women` / `men` / `undefined`).
- Devuelve `{ women, men, undefined }`.
- Error en inglés si Ollama no responde: `Could not classify the user`.
- `clients/terminal/count-users-by-gender.txt` hace `console.log`
  del recuento.
- `tests/users.test.js` finge la decisión (sin Ollama en `npm test`).

## No tocar
- `queries/users.js`, create, update, delete, find-by-email,
  find-user-by-id.
- No guardar el recuento en SQLite.
- No llamar a `api.openai.com`.
