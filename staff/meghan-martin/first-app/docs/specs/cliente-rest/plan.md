# Plan — personas por HTTP

Cumple `docs/specs/cliente-rest/spec.md`. No es una acción nueva de `src/logic/`.

## Tocar

- `src/clients/rest/server.js`: escucha en `127.0.0.1:3001`. Llama a las funciones que ya existen.
- `package.json`: el script `api` es `node src/clients/rest/server.js`. Se añade `express` `5.3.0`.
- `eslint.config.js`: `console` en ese fichero.
- `docs/CONSTITUTIONS.md`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `AGENTS.md`: nombran este cliente.

Listar llama a `listUsers`. El número llama a `findUserById(id)`. El email llama a `findUserByEmail(email)`. Crear llama a `createUser({ name, email })`. Cambiar llama a `updateUser(id, changes)`. Borrar llama a `deleteUser(id)` y responde `{ id }`. El recuento llama a `usersGenderCount()`.

El número de la dirección se convierte en un entero antes de llamar. No hay SQL nuevo. No hay firma nueva.

## Frases

Las que ya están en `docs/ERRORS.md`. El código HTTP lo elige este cliente:

- `Name is empty`, `Email is invalid`, `Invalid id`: 400
- Cuerpo que no es JSON: 400 `Invalid request.`
- `User not found`: 404
- Ruta desconocida: 404 `Not found.`
- `Email is already used`: 409
- `Database is not running. Start it with npm run db.`: 503
- `Could not ...`: 500

## No tocar

- `src/logic/`, `src/queries/`, `src/db/`
- `src/clients/terminal/`, `src/clients/jupyter/`, `src/clients/browser/`

## Comprobar

Desde `first-app`, con `npm run db` en marcha, `npm run api`. Curl a `http://127.0.0.1:3001`. Luego `npm run format` y `npm run lint`.
