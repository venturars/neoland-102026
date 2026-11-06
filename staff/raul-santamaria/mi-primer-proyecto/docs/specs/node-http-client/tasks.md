# Tareas — cliente HTTP nativo de usuarios

Un paso. Quien lo revisa marca `- [x]`.

- [x] 1. Abrir `package.json`.
  Añade el script `node-http` que arranca `src/clients/node-http/app.js`, el script `node-http-jupyter` que arranca `start-node-http-jupyter.js` y el glob `src/clients/node-http/**/*.js` en `format`.
  El resto de scripts y dependencias no cambia.

- [x] 2. Abrir `docs/TREE.md`, `docs/ARCHITECTURE.md` y `README.md`.
  El árbol incluye `src/clients/node-http/` con `app.js` y `jupyter/` con los cinco notebooks, y `start-node-http-jupyter.js` en la raíz.
  La arquitectura dice que `src/clients/node-http/` llama a `src/logic/`, escucha en el puerto 3004 y no repite sus reglas.
  El README documenta `node-http` en 3004 y `node-http-jupyter`.

- [x] 3. Crear `src/clients/node-http/app.js`.
  Importa las cinco funciones desde `../../logic/` con extensión `.js`. `ORIGIN` es `http://127.0.0.1:3004`.
  `createServer` de `node:http`. Rutas del plan. Éxito: 201, 200, 200, 200 y 204 vacío.
  Error: JSON `{ message }` con el HTTP de Express. Otra ruta: 404 vacío. Al arrancar, la consola escribe `ORIGIN`.

- [x] 4. Crear `start-node-http-jupyter.js`.
  Copia `start-jupyter.js` y arranca Jupyter Notebook en `src/clients/node-http/jupyter`. No arranca Lab.
  `pnpm jupyter` sigue abriendo `src/clients/jupyter`.

- [x] 5. Crear `src/clients/node-http/jupyter/create-user.ipynb`.
  El markdown lleva título, qué hace, qué pasa en la base, qué ruta usa y las anotaciones de crear.
  El bloque pide `POST /users` a `ORIGIN` con `request` de `node:http` y escribe el código HTTP y el cuerpo. No importa `src/logic/`.

- [x] 6. Crear `src/clients/node-http/jupyter/list-users.ipynb`.
  El markdown lleva las cuatro partes para listar.
  El bloque pide `GET /users` a `ORIGIN` con `node:http` y escribe el código HTTP y el cuerpo.

- [x] 7. Crear `src/clients/node-http/jupyter/find-user-by-id.ipynb`.
  El markdown lleva las cuatro partes para ver uno.
  El bloque pide `GET /users/:id` a `ORIGIN` con `node:http` y escribe el código HTTP y el cuerpo.

- [x] 8. Crear `src/clients/node-http/jupyter/update-user.ipynb`.
  El markdown lleva las cuatro partes para cambiar.
  El bloque pide `PATCH /users/:id` a `ORIGIN` con `node:http` (nombre Ada Lovelace) y escribe el código HTTP y el cuerpo.

- [x] 9. Crear `src/clients/node-http/jupyter/delete-user.ipynb`.
  El markdown lleva las cuatro partes para borrar.
  El bloque pide `DELETE /users/:id` a `ORIGIN` con `node:http`. En 204 escribe el código y ningún JSON.

- [x] 10. Lanzar `pnpm format` y `pnpm lint` desde `mi-primer-proyecto`.
  `pnpm format` escribe `src/clients/node-http/app.js` y `start-node-http-jupyter.js`. `pnpm lint` termina bien.

- [x] 11. Lanzar `pnpm server` y `pnpm node-http`. Probar el flujo Ada y las validaciones en el puerto 3004.
  La consola escribe `http://127.0.0.1:3004`. `GET /no-existe` responde 404 vacío.
  Crear, listar, ver, renombrar a Ada Lovelace y borrar: mismos cuerpos y códigos que Express.
  Nombre vacío, email inválido, email duplicado e id inexistente: mismos `{ message }` y HTTP que Express.

- [x] 12. Lanzar `pnpm node-http-jupyter` y comprobar que el resto no cambia.
  El navegador lista los cinco documentos de `src/clients/node-http/jupyter`, en la interfaz de notebooks. Al ejecutarlos se ve la respuesta HTTP del puerto 3004.
  `pnpm jupyter` sigue listando solo `src/clients/jupyter`. Express en 3001, Chrome en 3002 y Nest en 3003 responden como antes.
  No hay colección Bruno.
