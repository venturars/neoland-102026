# Plan — recuento en los clientes

Issue: #1045.

No es una funcionalidad nueva de usuarios. No se reemplaza ningún fichero de `src/logic/`, `src/queries/` ni `src/db/`. No hay firma nueva ni SQL nuevo. No se añade un paquete de Node. No hay chequeo de Socket. No se añade un `.txt` en `src/clients/terminal/`.

El recuento sigue en `src/logic/users-gender-count.js`. Cada cliente llama a `usersGenderCount()` y no repite la regla. Se parece a los clientes de `src/clients/terminal/`: la llamada está en el cliente y la regla sigue en `src/logic/`.

`usersGenderCount()` no recibe datos. Devuelve `{ women, men, undefinedUser }`. Si no hay usuarios, los tres números son 0. Si la IA no responde, o SQLite falla al leer, lanza `Could not classify the users`. El cliente no inventa otro mensaje.

La página de la extensión, la del panel y la de la ventana no importan `src/logic/`. Quien llama a `usersGenderCount()` es la parte que ya corre en Node: `server.js`, `extension.js` y `main.js`. El popup pide la ruta de su API con `fetch`. El panel manda un mensaje. La ventana usa `preload.js`.

`src/clients/web/` no llama a `usersGenderCount()`. Esa página se abre desde el disco e importa reglas en el navegador. `users-gender-count.js` importa `openai`, y ese paquete corre en Node.

## Rutas

En HTTP, en la API de Chrome y en Nest, la ruta nueva es `GET /users/gender-count`. Se registra antes de `GET /users/:id`. Así `gender-count` no se lee como un id.

Responde 200 y el objeto `{ women, men, undefinedUser }`. Si no hay usuarios, responde 200 y los tres ceros. Si la función lanza `Could not classify the users`, responde 500 y JSON con la clave `message` y ese texto. Si lo lanzado no es ese `Error`, también responde 500 con ese mismo texto. No hay mensaje nuevo.

Nest se escribe en `src/clients/nest/users.controller.js`. El método nuevo va antes de `Get("users/:id")`. `src/clients/nest-run/` se genera con `pnpm nest` y no se edita.

## Pestaña

En el popup, en el panel y en la ventana hay una pestaña Recuento. Al abrirla se ve esa sección y se oculta la de usuarios. Dentro hay un botón que pide el recuento. La sección muestra solo los tres números, con los nombres `women`, `men` y `undefinedUser`, en ese orden. No muestra la lista de usuarios.

Si la llamada falla, el aviso que ya tiene la página muestra `Could not classify the users`.

El texto que ve la persona está en español. El código está en inglés. La pestaña se llama Recuento.

En el panel, el mensaje es `users-gender-count`. En la ventana, `preload.js` publica `usersGenderCount` y `main.js` la recibe con `ipcMain.handle`.

El SQL sigue en `src/db/server.js`, en `http://127.0.0.1:3000`. HTTP sigue en el puerto 3001, Chrome en el 3002 y Nest en el 3003. El panel y la ventana no escuchan en un puerto. Los comandos siguen siendo `pnpm http`, `pnpm chrome`, `pnpm nest` y `pnpm electron`.

## Ficheros

No se crea ningún fichero de código.

Se tocan:

- `src/clients/http/app.js`
- `src/clients/chrome/server.js`
- `src/clients/chrome/index.html`
- `src/clients/chrome/popup.js`
- `src/clients/chrome/styles.css`
- `src/clients/vscode/extension.js`
- `src/clients/vscode/index.html`
- `src/clients/vscode/app.js`
- `src/clients/vscode/styles.css`
- `src/clients/electron/main.js`
- `src/clients/electron/preload.js`
- `src/clients/electron/index.html`
- `src/clients/electron/app.js`
- `src/clients/electron/styles.css`
- `src/clients/nest/users.controller.js`
- `docs/ARCHITECTURE.md`
- `docs/tree.md`
- `docs/style.md`
- `docs/CONSTITUTIONS.md`

`src/clients/http/app.js` importa `usersGenderCount` y registra `GET /users/gender-count` antes de `GET /users/:id`.

`src/clients/chrome/server.js` hace lo mismo en el puerto 3002. `popup.js` pide esa ruta con `fetch` y no importa `src/logic/`.

`src/clients/vscode/extension.js` importa `usersGenderCount`. Si el mensaje es `users-gender-count`, llama a esa función. `app.js` pide esa acción y no importa `src/logic/` ni `vscode`.

`src/clients/electron/main.js` importa `usersGenderCount` y la expone con `ipcMain.handle`. `preload.js` publica `usersGenderCount`. `app.js` la usa y no importa `src/logic/` ni `electron`.

`src/clients/nest/users.controller.js` importa `usersGenderCount` y declara `Get("users/gender-count")` antes de `Get("users/:id")`.

`docs/ARCHITECTURE.md` dice que HTTP, Chrome, el panel, la ventana y Nest también piden este recuento, y que la página no importa `src/logic/`. Añade `src/clients/electron/`: abre su ventana, llama a `src/logic/` desde `main.js` y no repite sus reglas. La página no importa `src/logic/`. No sustituye a `src/db/server.js` ni a los clientes HTTP, Chrome o web. No escucha en un puerto. `src/clients/web/` sigue sin contar.

`docs/tree.md` añade `electron/` dentro de `clients/`, con `main.js`, `preload.js`, `index.html`, `app.js` y `styles.css`. Esos ficheros ya están. No se añade otro.

`docs/style.md` añade el comando `pnpm electron` desde `first-app`. La ventana no escucha en un puerto. La base sigue en `127.0.0.1:3000`.

`docs/CONSTITUTIONS.md`, en la sección 1, dice que también se crea, se lista, se ve, se cambia y se borra un usuario desde la ventana de escritorio, y que la base sigue en el puerto 3000. Dice que el recuento también se pide desde HTTP, la extensión, el panel, esa ventana y Nest. En la extensión, en el panel y en la ventana se abre en una pestaña. Las tres pantallas del navegador no lo piden. En la sección 7 dice que este cambio no añade un `.txt`.

`docs/errors.md` no cambia. `Could not classify the users` ya está.

No se tocan `src/logic/users-gender-count.js`, `src/queries/`, `src/db/`, la terminal, Jupyter, `src/clients/web/` ni `src/clients/nest-run/`.

## Firma

No hay función nueva.

`async function usersGenderCount()`

No recibe parámetros. Devuelve `{ women, men, undefinedUser }`.

## SQL

No hay SQL.

## Errores

| Fallo de la spec                                    | Mensaje                        |
| --------------------------------------------------- | ------------------------------ |
| La IA no responde, o no se pueden leer los usuarios | `Could not classify the users` |

Sin usuarios, los tres números son 0. No es un fallo. No hay mensaje nuevo.
