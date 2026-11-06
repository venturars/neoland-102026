# Tareas — cliente HTTP con node:http

1. Abre `docs/specs/node-http-client/spec.md` y `plan.md`.
   Leen igual que la issue #1112 y el cliente Express.
   Las cinco operaciones son crear, listar, ver, modificar y borrar.

2. Abre `package.json`.
   Añade el script `node-http` que arranca `src/clients/node-http/app.js`.
   Añade el script `jupyter-node-http` que arranca `scripts/jupyter-node-http.js`.
   No cambia dependencias.

3. Crea `scripts/jupyter-node-http.js`.
   Es como `scripts/jupyter.js`, pero `JUPYTER_DIRECTORY` es `src/clients/node-http/jupyter`.

4. Abre `docs/tree.md`, en `clients/`.
   Añade `node-http/` con `app.js` y `jupyter/` con los cinco `.ipynb` del plan.

5. Abre `docs/ARCHITECTURE.md`, junto a los otros clientes HTTP.
   `src/clients/node-http/` llama a `src/logic/`, escucha en 3004, Jupyter en `jupyter/` y no sustituye `src/clients/http/`.

6. Abre `docs/style.md`, en Comandos.
   Añade `pnpm node-http` en `127.0.0.1:3004`.
   Añade `pnpm jupyter-node-http` y que hace falta `pnpm server` y `pnpm node-http` antes de los bloques.

7. Abre `docs/CONSTITUTIONS.md`, secciones 1 y 7.
   Entra el puerto 3004 y que no hay `.txt` nuevo.

8. Crea `src/clients/node-http/app.js`.
   Usa `createServer` de `node:http`.
   `ORIGIN` es `http://127.0.0.1:3004`.
   Importa las cinco funciones de `../../logic/` como en `src/clients/http/app.js`.
   Las rutas y la tabla de errores son las del plan.

9. Crea los cinco `.ipynb` en `src/clients/node-http/jupyter/`.
   Cada uno sigue el orden de `jupyter-client`.
   El bloque usa `fetch` contra `ORIGIN` y muestra tabla o mensaje de error.
   El subprocess Node usa `first-app` como cwd (cuatro `.parent` desde el notebook).

10. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    Terminan bien.
    No cambia `src/logic/` ni `src/queries/`.

11. Arranca `pnpm server` y `pnpm node-http`.
    El cliente escribe `http://127.0.0.1:3004`.
    `GET /no-existe` responde 404 y cuerpo vacío.

12. Prueba manual las cinco rutas como en `express-rest-client/tasks.md` pasos 12 a 17, pero en el puerto 3004 y con `pnpm node-http`.

13. Con la base y el cliente en marcha, ejecuta cada `.ipynb` de `src/clients/node-http/jupyter/`.
    Cada bloque muestra el resultado esperado del plan o el mensaje de la spec.

14. Lanza `pnpm jupyter-node-http` desde `first-app`.
    Abre la carpeta `src/clients/node-http/jupyter/`.
    No cambia el comportamiento de `pnpm jupyter` sobre `src/clients/jupyter/`.
