# Tareas — cliente HTTP de Node documentado con Jupyter

Plan aceptado. No se añade ningún paquete. Cada paso hace una cosa.

1. Abre `package.json` en `first-app`.
   El script `node-http` queda `node src/clients/node-http/app.js`. El script `jupyter-node-http` queda `sh scripts/jupyter-node-http.sh`. `format` también escribe `src/clients/node-http/**/*.js`.
   El script `jupyter` se queda. No se tocan `dependencies` ni `devDependencies`.
   `pnpm-lock.yaml` no cambia. No se usa npm ni yarn.

2. Crea `src/clients/node-http/app.js`.
   Importa `listUsers`, `createUser`, `updateUser`, `deleteUser` y `findUserById`. No importa `usersGender`, `findUserByEmail` ni `findUserByName`. No llama a `/execute`.
   `createServer` de `node:http`. `ORIGIN` es `http://127.0.0.1:3004`. Al escuchar, escribe esa dirección.
   Las cinco rutas, los estados y `{ "message": texto }` son los del plan. No valida, no escribe SQL y no abre la base. El fichero se puede leer.

3. Crea `scripts/jupyter-node-http.sh`.
   Copia `scripts/jupyter.sh`. Solo cambia la carpeta que abre: `src/clients/node-http/jupyter`.
   Reutiliza el mismo `.venv` y `notebook` `7.6.3`.
   `scripts/jupyter.sh` no cambia. El fichero se puede leer.

4. Crea `src/clients/node-http/jupyter/create-user.ipynb`.
   El texto en español dice que crea un usuario. El bloque es `POST /users` con Ada y ada@example.com a `http://127.0.0.1:3004`.
   Node se lanza en la app con `--input-type=module` y `FORCE_COLOR=1`. `cli-table3` dibuja la tabla y el encabezado es `["cyan", "bold"]`. Un fallo muestra el `message` y no la tabla.
   No importa la lógica. No valida, no escribe SQL y no abre la base.

5. Crea `src/clients/node-http/jupyter/list-users.ipynb`.
   El texto en español dice que lista los usuarios. El bloque es `GET /users` a `http://127.0.0.1:3004`.
   Node se lanza en la app con `--input-type=module` y `FORCE_COLOR=1`. `cli-table3` dibuja la tabla y el encabezado es `["cyan", "bold"]`. Un fallo muestra el `message` y no la tabla.
   Una lista vacía sale sin filas. No importa la lógica. No valida, no escribe SQL y no abre la base.

6. Crea `src/clients/node-http/jupyter/find-user-by-id.ipynb`.
   El texto en español dice que busca por id. El bloque es `GET /users/:id` a `http://127.0.0.1:3004` con el id de Ada escrito en el bloque.
   Node se lanza en la app con `--input-type=module` y `FORCE_COLOR=1`. `cli-table3` dibuja la tabla y el encabezado es `["cyan", "bold"]`. Un fallo muestra el `message` y no la tabla.
   No importa la lógica. No valida, no escribe SQL y no abre la base.

7. Crea `src/clients/node-http/jupyter/update-user.ipynb`.
   El texto en español dice que actualiza un usuario. El bloque es `PATCH /users/:id` a `http://127.0.0.1:3004` con el id de Ada y solo el nombre Ada Lovelace.
   Node se lanza en la app con `--input-type=module` y `FORCE_COLOR=1`. `cli-table3` dibuja la tabla y el encabezado es `["cyan", "bold"]`. Un fallo muestra el `message` y no la tabla.
   No importa la lógica. No valida, no escribe SQL y no abre la base.

8. Crea `src/clients/node-http/jupyter/delete-user.ipynb`.
   El texto en español dice que elimina un usuario. El bloque es `DELETE /users/:id` a `http://127.0.0.1:3004` con el id de Ada escrito en el bloque.
   Node se lanza en la app con `--input-type=module` y `FORCE_COLOR=1`. `cli-table3` dibuja la tabla y el encabezado es `["cyan", "bold"]`. Un fallo muestra el `message` y no la tabla.
   Si responde 204, la tabla sale sin filas. No importa la lógica. No valida, no escribe SQL y no abre la base.

9. Abre `docs/ARCHITECTURE.md`.
   Este cliente lista, crea, modifica, elimina y busca por id con el HTTP de Node, documentado con Jupyter, en `127.0.0.1:3004`.
   Llama a la lógica, no busca por email ni por nombre y no cuenta el género. Se arranca con `pnpm node-http`. Los documentos se abren con `pnpm jupyter-node-http`. `pnpm jupyter` sigue abriendo `src/clients/jupyter`.
   La terminal, Jupyter, las pantallas, la ventana, el popup, la vista, el cliente HTTP, Bruno y NestJS siguen igual. El fichero se puede leer.

10. Abre `docs/TREE.md`.
    Añade `clients/node-http/` con `app.js` y `jupyter/`.
    Añade `scripts/jupyter-node-http.sh`.
    El fichero se puede leer.

11. Abre `docs/STYLE.md`.
    El cliente es un solo fichero, `src/clients/node-http/app.js`. Llama a `listUsers`, `createUser`, `updateUser`, `deleteUser` y `findUserById`.
    No llama a `findUserByEmail`, `findUserByName` ni a `usersGender`. No valida, no escribe SQL y no abre la base.
    Los documentos viven en `src/clients/node-http/jupyter`. Se arranca con `pnpm node-http`. Se abren con `pnpm jupyter-node-http`. El fichero se puede leer.

12. Abre `docs/ERRORS.md`.
    Si este cliente no está en marcha, los documentos de `pnpm jupyter-node-http` no completan la petición.
    Si el programa de consultas no está en marcha, se ve el fallo de esa llamada.
    Los mensajes que ya estaban se quedan.

13. Abre `docs/CONSTITUTIONS.MD` y `AGENTS.MD`.
    Cuentan este cliente, `pnpm node-http`, `pnpm jupyter-node-http`, `127.0.0.1:3004` y `src/clients/node-http`. El desarrollo abierto pasa a ser `docs/specs/node-http-client/`.
    `app.js` importa `listUsers`, `createUser`, `updateUser`, `deleteUser` y `findUserById`. `pnpm jupyter` y `src/clients/jupyter` se quedan.
    Los dos se pueden leer.

14. Lee `src/logic`, `src/queries`, `src/db` y el resto de `src/clients`.
    Siguen igual. `docs/DATABASE.md` no se toca. `scripts/jupyter.sh` no se toca. `src/clients/jupyter` no se toca.
    `eslint.config.js` y el `.gitignore` de la raíz no se tocan. No se crea un `README`. No existe `scripts/run-node-http.js`.
    `package.json` no gana ningún paquete.

15. Desde `first-app`, lanza `pnpm format` y `pnpm lint`.
    Formatean el JavaScript de `src/clients/node-http` y no dejan avisos. Los `.ipynb` no los formatea Prettier.
    No se tocan la terminal, Jupyter, las pantallas, el cliente HTTP, Bruno, Nest, la ventana, el popup ni la vista.
    Los dos comandos terminan.

16. Desde `first-app`, lanza `pnpm node-http`, con `pnpm server` en marcha.
    La consola muestra `http://127.0.0.1:3004`.
    El programa de consultas sigue en `127.0.0.1:3000`.
    Buscar por email, por nombre y contar el género no tienen petición.

17. Desde `first-app`, lanza `pnpm jupyter-node-http`.
    El navegador abre los cinco documentos de este cliente, en `127.0.0.1`. `pnpm jupyter` sigue abriendo solo los de ahora.
    Con la lista vacía, crear Ada, listar, buscar por id, modificar el nombre a Ada Lovelace y eliminar coinciden con el plan.
    Si este cliente no está en marcha, el documento no completa la petición.
