# Tasks

1. El cliente Nest escucha en el puerto 3003 y no se instala TypeScript.
2. `users.service.js` llama a `listUsers`, `findUserById`, `createUser`, `updateUser` y `deleteUser`. El id de la ruta pasa a entero antes de la llamada.
3. Las cinco rutas crean, listan, ven, cambian y borran. Borrar responde 204 y un cuerpo vacío. Otra ruta responde 404 y un cuerpo vacío.
4. `npm run nest`, desde `first-app`, compila y arranca el cliente.
5. La arquitectura, la constitución, el árbol, `AGENTS.md` y `README.md` avisan del aparte de Nest. `docs/STYLE.md` y `docs/ERRORS.md` no cambian.
6. Con `npm run db` en marcha, crear una persona temporal, verla, cambiar el nombre y borrarla. Un nombre vacío muestra `Name is empty`. Una ruta desconocida responde 404. Luego `npm run format` y `npm run lint`. Quitar a esa persona.
