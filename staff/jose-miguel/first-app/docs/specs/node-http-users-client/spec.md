# Cliente HTTP con node:http

Issue: #1131.

Como quien prueba first-app, quiero un cliente HTTP de usuarios que use solo `node:http` en `http://127.0.0.1:3004`, con las mismas cinco operaciones que Express y una ruta de conteo por género, para comparar otra forma de servir la misma logic. La API se documenta con un cuaderno Jupyter por ruta.

Arranco `pnpm server` y `pnpm node-http`. Las peticiones y respuestas son JSON. El usuario lleva `id`, `name`, `email`, `createdAt` y `updatedAt`.

| Ruta | Acción | OK |
| --- | --- | --- |
| `GET /users` | Lista | 200 |
| `POST /users` | Crea `{ name, email }` | 201 |
| `GET /users/:id` | Ve uno | 200 |
| `PATCH /users/:id` | Modifica campos enviados | 200 |
| `DELETE /users/:id` | Borra | 204 vacío |
| `GET /users/gender-count` | Conteo `{ women, men, genderUndefined }` | 200 |

Otra ruta o método: 404 sin cuerpo.

Fallos visibles: `Id is invalid`, `Body is invalid`, `Name is empty`, `Email is invalid` (400); `Email is already used` (409); `User not found` (404); `Could not …` / `Could not classify the users` (500).

Hay un notebook por ruta en `src/clients/node-http/jupyter/`, abiertos con `pnpm jupyter-node-http`. El de gender-count necesita Ollama `llama3.2` si se quiere un conteo real; si falla el entorno, no bloquea el CRUD.

Queda fuera tocar `logic/`, `queries/`, `db/`, Express, Nest, Chrome, Bruno, frameworks HTTP y depurar el clasificador.
