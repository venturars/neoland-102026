# Tareas — cliente REST de usuarios

Un paso. Quien lo revisa marca `- [x]`.

- [x] 1. Abrir `docs/ERRORS.md` y `docs/CONSTITUTIONS.md`.
  En errores de SQLite al ver uno entra `Could not find the user`.
  En funciones de `logic/` entra `findUserById(id)` con la salida de un usuario.

- [x] 2. Crear `src/logic/find-user-by-id.js`.
  Valida el id como `update-user.js`. Si SQLite falla, lanza `Could not find the user`.
  Si no hay fila, lanza `No user exists with that id`. Devuelve id, name, email, createdAt y updatedAt.

- [x] 3. Crear `src/clients/terminal/find-user-by-id.txt` y pegarlo en la terminal desde `mi-primer-proyecto`.
  Con un id existente, `console.log` muestra ese usuario. Con un id inexistente, sale `No user exists with that id`.

- [x] 4. Abrir `package.json`.
  Añade `express` en `5.3.0` a `dependencies`, el script `http` y el glob `src/clients/http/**/*.js` en `format`.
  El resto de dependencias y scripts no cambia.

- [x] 5. En `mi-primer-proyecto`, lanzar `pnpm install` y abrir `pnpm-lock.yaml`.
  `express` queda en `5.3.0`. Las versiones de sus dependencias, hasta 3 capas, coinciden con el plan de referencia de Ventura.
  Si alguna no coincide, se para y esa versión vuelve a Socket.

- [x] 6. Abrir `docs/TREE.md` y `docs/ARCHITECTURE.md`.
  El árbol incluye `logic/find-user-by-id.js`, `clients/http/app.js` y `clients/terminal/find-user-by-id.txt`.
  La arquitectura dice que `clients/http/` llama a `logic/`, escucha en el puerto 3001 y no repite sus reglas.

- [x] 7. Crear `src/clients/http/app.js`.
  Importa las cinco funciones desde `../../logic/` con extensión `.js`.
  `ORIGIN` es `http://127.0.0.1:3001`. Rutas del plan. Éxito: 201, 200, 200, 200 y 204 vacío.
  Error: JSON `{ message }` con el HTTP de la tabla del plan. Otra ruta: 404 vacío.

- [x] 8. Lanzar `pnpm format` y `pnpm lint` desde `mi-primer-proyecto`.
  `pnpm format` escribe `src/clients/http/app.js`. `pnpm lint` termina bien.

- [x] 9. Lanzar `pnpm http` desde `mi-primer-proyecto`.
  La consola escribe `http://127.0.0.1:3001`. `GET /no-existe` responde 404 y un cuerpo vacío.

- [x] 10. `POST /users` con Ada y ada@example.com; luego `GET /users`, `GET /users/:id` y `PATCH /users/:id` solo con nombre Ada Lovelace.
  Crear responde 201 con id, nombre, email y fechas. Listar incluye a Ada. Ver uno repite los datos. Modificar deja el mismo id y email.

- [x] 11. Probar validaciones y ausencia.
  Crear con nombre vacío, email inválido y email duplicado: 400 `Name is empty`, 400 `Email is invalid` y 409 `Email is already used`.
  `GET`, `PATCH` y `DELETE` con un id que no existe responden 404 `No user exists with that id`.

- [x] 12. `DELETE /users/:id` de Ada. Responde 204 vacío. Ada ya no sale en `GET /users`.
  Renombrar `src/db/users.sqlite`, llamar a las cinco rutas y ver 500 con cada `Could not …`. Restaurar el fichero.
