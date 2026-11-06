# Plan — API con el HTTP de Node documentada en Jupyter

Issue: #1160

Cliente nuevo en `src/clients/node-http/`. No hay firma nueva en `src/logic/`, ni SQL nuevo, ni mensaje de error nuevo. `src/db/`, `src/queries/`, `src/logic/` y los demás clientes no cambian.

No hay paquetes nuevos ni cambios de versión: `node:http` viene con Node, y `cli-table3` y `notebook` 7.6.3 ya están en el proyecto. No hace falta la comprobación con Socket.

Esta rama sale de `staging`. No hay que fusionar otras ramas ni seguir un orden de fusión.

## Cómo funciona

```
Cuaderno → /users... → src/clients/node-http/app.js → src/logic/ → src/queries/ → src/db/server.js
```

`pnpm node-http` arranca la API. `pnpm jupyter-node-http` abre sus cuadernos.

## Ficheros

Se crean:

- `src/clients/node-http/app.js` — la API.
- `src/clients/node-http/jupyter/*.ipynb` — ocho cuadernos, uno por ruta.

Se tocan:

- `package.json`:
  - El script `node-http` (`node src/clients/node-http/app.js`).
  - El script `jupyter-node-http` (`node scripts/jupyter.js src/clients/node-http/jupyter`).
  - `src/clients/node-http/**/*.js` en `format`.
- `scripts/jupyter.js` — acepta una carpeta como argumento. Sin argumento abre `src/clients/jupyter`, como ahora.
- `AGENTS.md` — los comandos, el formato, y la API en la lista de clientes que necesitan `pnpm start` y en la de los que usan `openai`.
- `docs/ARCHITECTURE.md` — fila de `src/clients/node-http/*`, y la API allí donde se nombran los clientes de `src/logic/`.
- `docs/TREE.md` — `clients/node-http/`.

`eslint.config.js` no cambia. `app.js` importa `console`, `process` y `URL`. `pnpm-lock.yaml` tampoco cambia.

## `src/clients/node-http/app.js`

Responde igual que `src/clients/http/server.js`, sin Express. Sigue `docs/STYLE.md`, con funciones pequeñas y de arriba abajo. Lleva un comentario en castellano por `import`, por función y por bloque.

Constantes: `HOST` (`127.0.0.1`), `PORT` (`3004`), `LIMITE_CUERPO` (100 KB) y el mapa `ESTADOS`, igual que en Express.

| Función | Qué hace |
| --- | --- |
| `responderJson(response, estado, datos)` | Escribe el estado, la cabecera `content-type` y el JSON |
| `responderVacio(response, estado)` | Responde solo con el estado, sin cuerpo |
| `responderError(response, error, mensajeDeFallo)` | Usa el estado de `ESTADOS` y `{ message }`. Si el error no es de las reglas, 500 con `mensajeDeFallo` |
| `esPeticionPermitida(request)` | Es falso si `Host` no es `127.0.0.1:3004` o si llega `Origin` |
| `leerCuerpo(request)` | Junta los trozos del cuerpo. Falla si pasa de `LIMITE_CUERPO` |
| `convertirCuerpo(request, texto)` | Devuelve el objeto o el array recibido. Sin cuerpo o sin `content-type` JSON devuelve `{}`. Falla si el JSON está mal o si es un valor suelto, como `"hola"` |
| `sacarId(ruta)` | Devuelve el id de `/users/:id`, ya decodificado. Si la ruta no tiene esa forma, devuelve `null` |
| `responderAccion(response, estado, mensajeDeFallo, accion)` | Lanza una acción y responde con sus datos o con su fallo, para no repetir el `try` en cada ruta |
| `modificarUsuario(id, cuerpo)` | Prepara los cambios con lo que llega y llama a `updateUser` |
| `borrarUsuario(response, id)` | Llama a `deleteUser` y responde sin cuerpo |
| `atenderRuta(request, response, cuerpo)` | Elige la acción según el método y la ruta |
| `atenderPeticion(request, response)` | Comprueba, lee el cuerpo, llama a `atenderRuta` y atiende lo que falle |

Orden de `atenderPeticion`, el mismo que en Express:

1. Si no es una petición permitida, 403 sin cuerpo.
2. Lee y convierte el cuerpo. Un JSON mal escrito da 400 sin cuerpo. Un cuerpo demasiado grande o cualquier otro error da 500 sin cuerpo.
3. Separa la ruta y los parámetros con `URL`. La barra final se ignora, como en Express.
4. Elige la ruta. Las tres rutas fijas de `GET` se miran antes que `/users/:id`.
5. Si ninguna coincide, 404 sin cuerpo.

Un id mal codificado da 400 sin cuerpo.

`searchParams.get` devuelve `null` si falta el parámetro y Express da `undefined`. Se convierte con `?? undefined`, para que la lógica reciba lo mismo.

| Ruta | Función de `src/logic/` | Respuesta buena | Fallos | Mensaje del 500 |
| --- | --- | --- | --- | --- |
| `POST /users` | `createUser` | 201, usuario | 400, 409, 500 | `Could not create the user` |
| `GET /users` | `listUsers` | 200, lista | 500 | `Could not list the users` |
| `GET /users/by-email` | `findUserByEmail` | 200, usuario | 400, 404, 500 | `Could not find the user` |
| `GET /users/by-name` | `findUserByName` | 200, lista | 400, 500 | `Could not find the user` |
| `GET /users/gender-count` | `usersGenderCount` | 200, recuentos | 500 | `Could not classify the users` |
| `GET /users/:id` | `findUserById` | 200, usuario | 404, 500 | `Could not find the user` |
| `PATCH /users/:id` | `updateUser` | 200, usuario | 400, 404, 409, 500 | `Could not update the user` |
| `DELETE /users/:id` | `deleteUser` | 204, sin cuerpo | 404, 500 | `Could not delete the user` |

`PATCH` solo pasa a `changes` lo que llega, como en Express.

Al arrancar, la consola muestra la dirección. Si el puerto está ocupado, da el mismo aviso que Express y termina con `process.exitCode = 1`.

## `src/clients/node-http/jupyter/`

Hay ocho cuadernos, con los nombres de `src/clients/jupyter/` menos `create-users-table`, que no es una ruta: `create-user`, `list-users`, `find-user-by-id`, `find-user-by-email`, `find-user-by-name`, `users-gender-count`, `update-user` y `delete-user`.

Cada uno tiene dos celdas y usa `nbformat` 4.5 y el kernel `python3`, como los que ya existen.

**Celda de markdown, en castellano:**

- Título.
- Qué hace.
- La petición: método, ruta y cuerpo.
- Qué pasa en la base.
- Las respuestas posibles, con su estado y su mensaje.
- Qué hay que tener en marcha: `pnpm start` y `pnpm node-http`, y Ollama en `users-gender-count`.

**Celda de código:** la misma técnica que `src/clients/jupyter/find-user-by-name.ipynb`. Python busca la carpeta de la app y lanza `node --input-type=module -e` con `cwd` en esa carpeta, para encontrar `cli-table3`.

El código de Node:

- Lleva arriba los datos que se pueden cambiar: `id`, `name` o `email`.
- Llama con `fetch` a `http://127.0.0.1:3004`.
- Imprime el método, la ruta y el estado.
- Lee la respuesta como texto y solo la convierte si trae algo, porque un 204, un 403 o un 404 de ruta desconocida no traen cuerpo.
- Si la respuesta no es buena, imprime `message` y no pinta la tabla.
- Si es buena, pinta la tabla: una fila con un usuario, una por usuario con una lista y tres recuentos en `users-gender-count`.

Si la API está parada, `fetch` falla y se ve el error de Node, con la misma celda que los cuadernos actuales. No se añade ningún mensaje.

Datos de ejemplo: Ada y `ada@example.com`. Los cuadernos que usan un id empiezan con `id = 1`, y su markdown avisa de que hay que cambiarlo por el que dio el de crear.

Los cuadernos se guardan sin salidas, como los de `src/clients/jupyter/`, para no subir datos de la base local.

## `scripts/jupyter.js`

Se añade una constante y cambia la última llamada:

```js
// Abre la carpeta recibida. Sin argumento, abre los cuadernos de siempre.
const carpeta = process.argv[2] ?? "src/clients/jupyter";
```

`run(envPython, ["-m", "notebook", carpeta], ...)` usa esa carpeta. El resto no cambia.

## Comprobación

1. Con `pnpm start` y `pnpm node-http`, la consola muestra `http://127.0.0.1:3004`.
2. `pnpm jupyter-node-http` abre los ocho cuadernos. Se ejecutan en este orden:
   - Crear a Ada, listar y ver por id.
   - Buscar por email y buscar por nombre.
   - Modificar el nombre y volver a ver.
   - Borrar y listar.
3. Con Ollama y `llama3.2`, `users-gender-count` muestra los tres recuentos.
4. Con `curl` contra los puertos 3001 y 3004, cada caso da el mismo estado y el mismo cuerpo:
   - Nombre vacío, email que no vale, email usado e id que no está.
   - Ruta desconocida, JSON mal escrito y cuerpo que es un valor suelto.
   - `POST` sin cuerpo y cuerpo de más de 100 KB.
   - `by-email` y `by-name` sin parámetro.
   - `Host: localhost` y una cabecera `Origin`.
5. Con `pnpm start` parado, cada ruta da 500 con su mensaje de la tabla.
6. Con otro proceso en el puerto 3004, `pnpm node-http` da el aviso de puerto ocupado.
7. `pnpm jupyter` sigue abriendo `src/clients/jupyter/`.
8. `pnpm format` y `pnpm lint` pasan.

## Riesgo

- La comparación con Express cubre los casos del paso 4. No se han comparado otros detalles, como `HEAD` o las mayúsculas en la ruta.
- La spec pide 400 para un id mal codificado. Comprobado: Express responde 500 en ese caso. Se mantiene el 400 de la spec, porque el error es de la petición. Es la única diferencia encontrada.
- `pnpm format` pasa a LF los ficheros de las carpetas que cubre, porque en Windows Git los deja en CRLF. No cambia su contenido, pero `git status` los marca como modificados. Hay que restaurarlos antes de hacer commit.

## Sin preguntas abiertas

La constitución, el código actual y esta spec dicen lo mismo. Diego ha aceptado las ocho rutas al aprobar el plan general, en lugar de las cinco de la issue #1092.
