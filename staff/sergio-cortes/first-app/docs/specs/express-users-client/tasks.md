# Tareas — cliente HTTP con Express para usuarios

Issue: #887.

1. Desde `first-app`, ejecutar `pnpm add express@5.3.0 --save-exact`.
   `package.json` queda con `express` en `5.3.0`, sin `^`. Cambia
   `pnpm-lock.yaml`. No se añade ninguna otra dependencia.

2. Abrir `package.json`. Añadir el script `http`: si nada escucha en
   `127.0.0.1:3000` (`nc -z`), arranca `src/db/server.js` en segundo plano y lo
   para al salir; después ejecuta `node src/clients/http/server.js`. No se
   tocan `format`, `lint` ni `test`.

3. Abrir `docs/ERRORS.md`. Añadir `"Body is invalid"` (`ValidationError`) e
   `"Internal error"`, con una nota de que los lanza el cliente HTTP y no
   `src/logic/`. Igual que en el plan, sección «Errores».

4. Crear `src/clients/http/server.js`, siguiendo `docs/STYLE.md`. Igual que el
   plan:
   - Escucha en `127.0.0.1:3001` (`HOST`, `ORIGIN`, `PORT`) y escribe esa dirección con `console.log`. En `eslint.config.js` se declara `console` como global para `src/clients/http/`. Usa el parser JSON de Express.
   - `GET /users` llama a `listUsers()`. Responde 200.
   - `GET /users/:id` llama a `findUserById(id)`. Responde 200.
   - `POST /users` llama a `createUser({ name, email })`. Responde 201.
   - `PATCH /users/:id` llama a `updateUser({ id, name, email })`. Responde 200.
   - `DELETE /users/:id` llama a `deleteUser(id)`. Responde 200.
   - Las rutas son `async` y no capturan errores.
   - `:id` se comprueba entero con la regla de `parseUserId` de
     `src/clients/web/app.js` antes de pasarlo a número. Si no vale, lanza
     `ValidationError("Id is invalid")`.
   - `POST` y `PATCH` lanzan `ValidationError("Body is invalid")` si `req.body`
     es `undefined` o no es un objeto.
   - El middleware de errores responde `{ error: message }`: `ValidationError`
     400, `NotFoundError` 404, `ConflictError` 409, `DatabaseError` 500. Un
     error con `type` `entity.parse.failed` responde 400 `Body is invalid`.
     Cualquier otro responde 500 `Internal error`.

5. Abrir `docs/TREE.md` y `docs/ARCHITECTURE.md`. Añadir
   `src/clients/http/server.js`, el script `http` y que arranca la base
   si no está en marcha.

6. Con `pnpm server` en una terminal y `pnpm http` en otra, probar con `curl`
   las 5 rutas en `http://127.0.0.1:3001`: éxito (200 y 201), `Id is invalid`
   (`/users/1abc`), `User not found`, `Email is already used`, `Name is empty`
   y `Body is invalid` (JSON roto). No hay cliente `.txt` de terminal.

7. `pnpm run format` y `pnpm run lint` sobre lo tocado.
