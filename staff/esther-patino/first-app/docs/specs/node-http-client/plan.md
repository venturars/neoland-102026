# Plan — cliente HTTP con node:http

Issue: #1112.

No es una funcionalidad nueva de usuarios. No se reemplaza ningún
fichero de `src/logic/`, `src/queries/` ni `src/db/`. No hay firma
nueva ni SQL nuevo. No se añade un `.txt` en `src/clients/terminal/`.

No se añade ningún paquete de Node. El servidor usa `node:http`. No
hay chequeo de Socket.

El cliente importa las funciones que ya existen y devuelve su
resultado. Se parece a `src/clients/http/app.js`: la llamada HTTP
está en el cliente y la regla sigue en `src/logic/`. Las rutas, los
estados y los mensajes son los de la spec y de `express-rest-client`.

Crear usa `createUser({ name, email })`. Listar usa `listUsers()`. Ver
uno usa `findUserById(id)`. Modificar usa `updateUser(id, changes)`.
Borrar usa `deleteUser(id)`. No se importa `users-gender-count.js`,
`find-user-by-name.js` ni `find-user-by-email.js`.

El id de la ruta es texto. El cliente lo pasa a número con `Number`
antes de llamar. `Number("1")` es `1`. `Number("abc")` es `NaN` y la
lógica lanza `Invalid id`.

El SQL sigue en `src/db/server.js`, en `http://127.0.0.1:3000`. Se
arranca con `pnpm server`. Este cliente escucha en
`http://127.0.0.1:3004`. La constante es `ORIGIN`. `package.json`
tiene el script `node-http`. Se lanza con `pnpm node-http` desde
`first-app`. Al arrancar escribe esa dirección.

El servidor lee el cuerpo JSON en `POST /users` y `PATCH /users/:id`.
Si un campo no viene en el patch, no entra en `changes`, y
`updateUser` conserva el valor guardado. El cliente no valida el
nombre ni el email. Si lo lanzado no es un `Error` con un mensaje de
la tabla de abajo, responde 500 con el `Could not` de esa acción. No
inventa un mensaje.

Las rutas:

- `POST /users` crea. Responde 201 y el usuario.
- `GET /users` lista. Responde 200 y la lista. Si no hay usuarios, la
  lista es `[]`.
- `GET /users/:id` ve uno. Responde 200 y el usuario.
- `PATCH /users/:id` modifica. Responde 200 y el usuario.
- `DELETE /users/:id` borra. Responde 204 y un cuerpo vacío.

Otra ruta responde 404 y un cuerpo vacío. No hay mensaje nuevo.

Si la función lanza un `Error` con un mensaje de la tabla de abajo, el
cuerpo es JSON con la clave `message` y ese texto.

## Jupyter en este cliente

Hay cinco documentos, uno por cada operación habitual de la spec. Viven
en `src/clients/node-http/jupyter/`. `app.js` queda en
`src/clients/node-http/`. No sustituyen los de `src/clients/jupyter/`.

El texto de cada documento está en español. El bloque llama a esta API
con `fetch` desde un trozo Node lanzado en subprocess, como los Jupyter
de la lógica. La tabla la dibuja Node con `cli-table3` y
`@colors/colors`, igual que `jupyter-client`.

Cada documento trae, en este orden: el título, qué hace, qué pasa en la
base de datos, qué ruta HTTP usa, las anotaciones, el bloque y el
resultado de esa ejecución.

Antes de ejecutar un bloque hace falta `pnpm server` y `pnpm
node-http` en terminales aparte. La anotación lo dice.

Los cinco documentos, en `src/clients/node-http/jupyter/`:

- `post-user.ipynb` — `POST /users` con Ada y ada@example.com.
- `list-users.ipynb` — `GET /users`.
- `get-user-by-id.ipynb` — `GET /users/:id` con el id del ejemplo.
- `patch-user.ipynb` — `PATCH /users/:id` cambiando el nombre a Ada
  Lovelace.
- `delete-user.ipynb` — `DELETE /users/:id` y luego comprobar la
  lista.

El bloque Python arranca Node con el directorio de trabajo en
`first-app`. Desde un `.ipynb` en `jupyter/` son cuatro carpetas hacia
arriba hasta la raíz de la app.

Si la petición falla con un mensaje de la spec, no sale la tabla de
datos. Se ve ese mensaje. Borrar con éxito no devuelve usuario: la
tabla lo indica como en `remove-user.ipynb` de la lógica.

El script `jupyter-node-http` de `package.json` se lanza con `pnpm
jupyter-node-http` desde `first-app`. Usa `scripts/jupyter-node-http.js`.
Ese script es como `scripts/jupyter.js`, pero arranca el notebook sobre
`src/clients/node-http/jupyter/`. No cambia el script `jupyter` que
sigue en `src/clients/jupyter/`.

## Ficheros

Se crean:

- `src/clients/node-http/app.js`
- `src/clients/node-http/jupyter/post-user.ipynb`
- `src/clients/node-http/jupyter/list-users.ipynb`
- `src/clients/node-http/jupyter/get-user-by-id.ipynb`
- `src/clients/node-http/jupyter/patch-user.ipynb`
- `src/clients/node-http/jupyter/delete-user.ipynb`
- `scripts/jupyter-node-http.js`

Se tocan:

- `package.json`
- `docs/ARCHITECTURE.md`
- `docs/tree.md`
- `docs/style.md`
- `docs/CONSTITUTIONS.md`

`package.json` añade los scripts `node-http` y `jupyter-node-http`. No
cambia dependencias.

`docs/tree.md` añade `node-http/` con `app.js` y `jupyter/` con los
cinco `.ipynb`.

`docs/ARCHITECTURE.md` describe `src/clients/node-http/`: llama a
`src/logic/`, escucha en el puerto 3004, lleva Jupyter en
`node-http/jupyter/` y no sustituye a `src/clients/http/` ni a
`src/db/server.js`.

`docs/style.md` añade `pnpm node-http` y `pnpm jupyter-node-http`.

`docs/CONSTITUTIONS.md`, en la sección 1, dice también este cliente en
el puerto 3004. En la sección 7 dice que este cambio añade el cliente
node-http y no añade un `.txt`.

No se tocan `docs/errors.md` ni los mensajes: ya están en la lista.
No se tocan `src/clients/http/`, Bruno, la terminal ni
`src/clients/jupyter/`.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec                          | Mensaje                     | Estado |
| ----------------------------------------- | --------------------------- | ------ |
| El nombre queda vacío                     | `Name is empty`             | 400    |
| El email no vale                          | `Email is invalid`          | 400    |
| El email es de otro usuario               | `Email is already used`     | 409    |
| El id no es un entero mayor o igual que 1 | `Invalid id`                | 400    |
| Ese usuario no está                       | `User not found`            | 404    |
| No se llega a la base al crear            | `Could not create the user` | 500    |
| No se llega al listar                     | `Could not list the users`  | 500    |
| No se llega al ver uno                    | `Could not find the user`   | 500    |
| No se llega al modificar                  | `Could not update the user` | 500    |
| No se llega al borrar                     | `Could not delete the user` | 500    |

La lista vacía no es un fallo.
