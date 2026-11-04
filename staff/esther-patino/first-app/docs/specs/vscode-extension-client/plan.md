# Plan — cliente de VS Code

Issue: #983.

No es una funcionalidad nueva de usuarios. No se reemplaza ningún
fichero de `src/logic/`, `src/queries/` ni `src/db/`. No hay firma
nueva ni SQL nuevo. No se añade un `.txt` en `src/clients/terminal/`.

No hay paquete de Node nuevo ni un cambio de versión. El editor
aporta `vscode`. No se instala. No toca `package.json` ni
`pnpm-lock.yaml`. No hay chequeo de Socket: no entra un paquete.

Todo el cliente vive en `src/clients/vscode/`. No abre la página de
`src/clients/web/` ni importa sus ficheros. No pide la API de
`src/clients/http/` ni la de `src/clients/chrome/`. No abre la
ventana de `src/clients/electron/` ni importa sus ficheros. La parte
que abre el panel llama a `src/logic/`. La página no importa
`src/logic/`: pide esa acción a la parte que abre el panel. Se
parece a `src/clients/electron/main.js`: la llamada está en el
cliente y la regla sigue en `src/logic/`.

Crear usa `createUser({ name, email })`. Listar usa `listUsers()`.
Ver uno usa `findUserById(id)`. Buscar por nombre usa
`findUserByName(name)`. Buscar por correo usa `findUserByEmail(email)`.
Buscar por id usa `findUserById(id)`. Modificar usa
`updateUser(id, changes)`. Borrar usa `deleteUser(id)`. No se
importa `users-gender-count.js`.

`validateId` rechaza un texto: el fallo es `Invalid id`. El id que
se escribe es texto. `extension.js` lo pasa a número con `Number`
antes de llamar, como hace la API de Chrome. No lanza su propio
mensaje. `Number("1")` es `1`. `Number("abc")` es `NaN` y
`validateId` lanza `Invalid id`. El nombre y el email se pasan como
llegan. El cliente no los valida.

Esas funciones solo llegan a `src/queries/users.js` y a los textos
SQL. Usan `fetch` contra `http://127.0.0.1:3000`. No importan
módulos de Node ni paquetes de `node_modules`.
`users-gender-count.js` importa `openai`, y este cliente no lo usa.

`src/clients/vscode/package.json` es el manifiesto de la extensión,
como `manifest.json` lo es en Chrome. No sustituye al `package.json`
de la raíz. `"type"` es `"module"`, para importar `src/logic/` igual
que el resto de la app. `engines.vscode` es `^1.94.0`: desde esa
versión el editor carga una extensión que es un módulo ES. `main` es
`./extension.js`. Hay un comando. Su título, el que se lee en la
paleta, es «Abrir usuarios». Activar la extensión es pedir ese
comando. No se publica. El campo `main` de la raíz sigue en
`index.js`.

`.vscode/launch.json` está en `first-app`. Su configuración abre la
ventana de desarrollo con `extensionDevelopmentPath` en
`src/clients/vscode`. Se lanza con la carpeta `first-app` abierta.
Ese lanzamiento no escucha en un puerto.

`extension.js` importa `vscode` y las siete funciones desde
`../../logic/`, con extensión `.js`. Registra el comando. Si el
panel ya está abierto, lo muestra. Si no, abre una pestaña del
editor y carga el HTML de esa carpeta. El script y la hoja se leen
desde esa carpeta. Otra origen no entra. La página los usa y no
importa `vscode`.

La página manda la acción. `extension.js` llama a la función. El id
de ver, modificar y borrar es el del usuario elegido. No se teclea.
El id de buscar sí se teclea y pasa por `Number`. Si un campo no
viene al modificar, no entra en `changes`, y `updateUser` conserva
el valor guardado. Si lo lanzado es un `Error` con un mensaje de la
tabla de abajo, el panel muestra ese texto. Si el mensaje no está
en la tabla, el panel muestra el `Could not` de esa acción. No
inventa un mensaje. `Query failed` no se muestra. Buscar por nombre
y no encontrar a nadie devuelve la lista vacía. No es un fallo.

La página es HTML, CSS y JavaScript, sin otro paquete. El texto que
ve la persona está en español. El código está en inglés. La lista
muestra id, nombre y email. Si no hay usuarios, está vacía. Al
abrir, la lista es la de todos. Una búsqueda la sustituye por el
resultado: varios si el nombre se repite, uno si es correo o id.
Crear, guardar y borrar vuelven a la lista de todos. Elegir uno
muestra el id, el nombre, el email y las dos fechas. Desde ahí se
modifica el nombre y el email, o se borra. Al borrar, ese usuario
sale de la lista.

El SQL sigue en `src/db/server.js`, en `http://127.0.0.1:3000`. La
base se arranca con `pnpm server`. Este cliente no escucha en un
puerto. No se añade un script a `package.json`. Los scripts
`server`, `http`, `chrome`, `electron`, `open`, `format` y `lint`
siguen. `format` sigue siendo `prettier --write .`.

No se publica la extensión.

## Ficheros

Se crean:

- `src/clients/vscode/package.json`
- `src/clients/vscode/extension.js`
- `src/clients/vscode/index.html`
- `src/clients/vscode/app.js`
- `src/clients/vscode/styles.css`
- `.vscode/launch.json`

Se tocan:

- `docs/ARCHITECTURE.md`
- `docs/tree.md`
- `docs/style.md`
- `docs/CONSTITUTIONS.md`

`docs/tree.md` añade `vscode/` dentro de `clients/`, con
`package.json`, `extension.js`, `index.html`, `app.js` y
`styles.css`. Añade `.vscode/launch.json`.

`docs/ARCHITECTURE.md` dice que `src/clients/vscode/` abre su panel
en una pestaña, llama a `src/logic/` desde `extension.js` y no
repite sus reglas. La página no importa `src/logic/`. No sustituye
a `src/db/server.js` ni a los clientes HTTP, Chrome, Electron o web.
No escucha en un puerto.

`docs/style.md` dice que el panel se abre desde `first-app`, con la
configuración de `.vscode/launch.json` y el comando «Abrir
usuarios». La base sigue en `127.0.0.1:3000`. Este cliente no
escucha en un puerto.

`docs/CONSTITUTIONS.md` dice, en la sección 1, que también se crea,
se lista, se busca, se ve, se cambia y se borra un usuario desde un
panel de VS Code, y que la base sigue en el puerto 3000. En la
sección 7 dice que este cambio añade el cliente de VS Code y no
añade un `.txt`. `AGENTS.md` no cambia: el `.txt` sigue siendo el
cliente de una funcionalidad nueva, y esta no lo es.

`docs/errors.md` no cambia. Los mensajes de la tabla ya están.

No se tocan `src/logic/`, `src/queries/`, `src/db/`, `package.json`,
`pnpm-lock.yaml`, la terminal, Jupyter, `src/clients/web/`,
`src/clients/http/`, `src/clients/chrome/` ni `src/clients/electron/`.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec                          | Mensaje                     |
| ----------------------------------------- | --------------------------- |
| El nombre queda vacío                     | `Name is empty`             |
| El email no vale                          | `Email is invalid`          |
| El email es el de otro usuario            | `Email is already used`     |
| El id no es un entero mayor o igual que 1 | `Invalid id`                |
| Ese usuario no está                       | `User not found`            |
| No se llega a la base al crear            | `Could not create the user` |
| No se llega al listar                     | `Could not list the users`  |
| No se llega al ver uno o al buscar        | `Could not find the user`   |
| No se llega al modificar                  | `Could not update the user` |
| No se llega al borrar                     | `Could not delete the user` |

La lista vacía no es un fallo. Un nombre que no está tampoco. No hay
mensaje nuevo.
