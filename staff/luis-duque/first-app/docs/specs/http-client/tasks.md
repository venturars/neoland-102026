# Tareas — cliente HTTP

1. Abre `package.json` en `first-app`.
   pnpm añade `express` `5.3.0`. El script `http` queda `node src/clients/http/app.js`.
   `format` también escribe `src/clients/http/**/*.js`.
   `pnpm-lock.yaml` lo escribe pnpm. No se edita a mano.

2. Crea `src/clients/http/app.js`.
   Express escucha en `http://127.0.0.1:3001`, escribe esa dirección y lee JSON. Las siete rutas llaman a la lógica del plan; email y nombre van antes de `:id`.
   Crear responde 201, listar y buscar 200, actualizar 200 con lo que devuelve `updateUser`, eliminar 204 sin cuerpo. Validación 400, `was not found` 404, `UNIQUE constraint` 409 y otro `Error` 500. El texto no cambia.
   Ruta desconocida: 404 sin cuerpo. Cuerpo que no es JSON: 400 con `{ "message": texto }`. No valida, no escribe SQL, no abre la base y no importa `usersGender`.

3. Abre `docs/ARCHITECTURE.md`.
   El cliente HTTP es otra forma de crear, actualizar, eliminar, listar y buscar desde Postman, en `127.0.0.1:3001`.
   Importa la lógica. Actualizar devuelve el `id` y los campos enviados. No cuenta el género.
   Se arranca con `pnpm http`. Terminal, Jupyter y las pantallas siguen igual. El fichero se puede leer.

4. Abre `docs/TREE.md`.
   Añade `clients/http/app.js`.
   No añade más ficheros en esa carpeta.
   El fichero se puede leer.

5. Abre `docs/STYLE.md`.
   El cliente HTTP es la excepción a un archivo por acción: solo `src/clients/http/app.js`.
   Llama a `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail` y `findUserByName`.
   No valida, no escribe SQL y no abre la base. El fichero se puede leer.

6. Abre `docs/ERRORS.md`.
   Si este cliente no está en marcha, Postman no completa la petición.
   Los mensajes que ya estaban se quedan.
   El fichero se puede leer.

7. Abre `docs/CONSTITUTIONS.MD` y `AGENTS.MD`.
   Cuentan el cliente HTTP, `pnpm http` y Express `5.3.0` en `src/clients/http/app.js`. El desarrollo abierto pasa a ser `docs/specs/http-client/`.
   Sigue prohibido otro framework. Este cliente es la excepción ya aceptada.
   Los dos se pueden leer y coinciden con el código.

8. Lee `src/logic/`, `src/queries/`, `src/db/` y el resto de `src/clients/`.
   Siguen igual. `docs/DATABASE.md` no se toca.
   No hay otra dependencia nueva.
   `express` en `package.json` es `5.3.0`.

9. Desde `first-app`, lanza `pnpm format` y `pnpm lint`.
   Formatean `src/clients/http/app.js` y no dejan avisos.
   No se tocan la terminal, Jupyter ni las pantallas.
   Los dos comandos terminan.

10. Desde `first-app`, lanza `pnpm http`, con `pnpm server` en marcha.
    La consola muestra `http://127.0.0.1:3001`.
    Postman puede crear, actualizar, eliminar, listar y buscar. Actualizar devuelve el `id` y los campos enviados.
    Contar el género no tiene petición.
