Issue: #1116

# Tareas del cliente node:http de usuarios documentado con Jupyter

1. **Añadir las dos tablas.** Desde la raíz de la app, `pnpm add --save-exact cli-table3@0.6.5 @colors/colors@1.6.1`.
   Resultado: `package.json` y `pnpm-lock.yaml` las declaran con esas versiones exactas.

2. **Añadir los scripts.** En `package.json`, `node-http` (`node src/clients/node-http/app.js`) y `jupyter-node-http` (`sh scripts/jupyter-node-http.sh`).
   Resultado: `pnpm run node-http` y `pnpm run jupyter-node-http` existen.

3. **Crear `scripts/jupyter-node-http.sh`.** Copia `scripts/jupyter.sh` y cambia solo la carpeta: `src/clients/node-http/jupyter`.
   Resultado: `scripts/jupyter.sh` no cambia y el nuevo abre esa carpeta.

4. **Crear `src/clients/node-http/app.js`: arranque y ayudas.** `createServer` de `node:http`, constantes de mensajes en mayúsculas, lectura del cuerpo, conversión del id y `404` sin cuerpo para otra ruta.
   Escucha en `127.0.0.1:3004` y avisa si el puerto está ocupado.
   Resultado: arranca y `curl -i http://127.0.0.1:3004/otra` da `404`.

5. **Añadir `POST /users` y `GET /users`.** Llaman a `createUser(name, email)` y `listUsers()`, con los estados y mensajes de la spec.
   Un JSON roto responde `400` con `Request JSON is invalid`.
   Resultado: crear a Ada da `201`; listar la muestra.

6. **Añadir `GET`, `PATCH` y `DELETE /users/:id`.** Llaman a `findUserById`, `updateUser` y `deleteUser`. `changes` solo lleva las claves enviadas.
   Resultado: ver da `200`, modificar da `200` con el email intacto, borrar da `204` vacío.

7. **Crear `tests/node-http-client.test.js`.** Sigue `tests/http-client.test.js`: base temporal, `app.js` como proceso hijo, cinco rutas y errores de la spec.
   Resultado: `pnpm test` pasa y no usa la base real.

8. **Crear `create-user.ipynb`.** Texto en español con las partes del plan y celda Python que lanza `node` con `fetch` y dibuja la tabla.
   Crea a Ada; si falla, muestra el `message` sin tabla.
   Resultado: con la base de prueba, sale la fila de Ada.

9. **Crear `list-users.ipynb` y `find-user-by-id.ipynb`.** Mismo patrón. La lista vacía muestra `No rows.` y el segundo pide el id de Ada.
   Resultado: ambos muestran la tabla; un id inexistente muestra `User does not exist`.

10. **Crear `update-user.ipynb` y `delete-user.ipynb`.** Mismo patrón. El primero cambia solo el nombre a Ada Lovelace; el segundo borra a Ada y muestra `No data returned.`
    Resultado: ambos funcionan en orden con la base de prueba.

11. **Comprobar los cuadernos con la base parada.** Con este cliente abierto y el servidor de datos parado, ejecutar los cinco.
    Resultado: cada uno muestra el `Unable to` de su operación y no la tabla. Guardar los cuadernos con las salidas limpias.

12. **Actualizar `docs/ARCHITECTURE.md`, `docs/TREE.md` y `docs/ERRORS.md`.** Describir el cliente, su puerto, sus cuadernos y los archivos nuevos; añadirlo a las excepciones de traducción.
    Resultado: las guías describen lo implementado.

13. **Actualizar `README.md` y `docs/CONSTITUTION.md`.** README: fila del cliente, cuadernos y puerto 3004 en el párrafo de `pnpm test`. Constitución: apartados 1 y 3, ya autorizados.
    Resultado: los dos describen el cliente.

14. **Cerrar.** `pnpm format` y `pnpm lint` limitados a los archivos del pedido, y `pnpm test`.
    Recorrer con `curl` y con los cuadernos la base temporal; comprobar que un usuario creado aparece en `pnpm run web`.
    Resultado: todo pasa; informar de los archivos, las guías revisadas y por qué la constitución cambió.
