# Plan — cliente de VS Code para usuarios

Issue: #950.

No es una funcionalidad nueva. No se reemplaza ningún fichero de
`logic/`. No hay firma nueva. No hay SQL nuevo. No hay mensaje nuevo.

No hay paquete de Node nuevo ni cambio de versión. No entra Socket.
`pnpm-lock.yaml` no cambia.

El cliente nuevo es `src/clients/vscode/`. No reutiliza
`src/clients/browser/`, `src/clients/electron/` ni
`src/clients/chrome/`. El proceso de la extensión llama a
`src/logic/`. Se parece a `src/clients/electron/app.js`: la llamada
está en el cliente y la regla sigue en `logic/`. La vista no importa
`logic/` ni otro cliente. Se parece a `src/clients/chrome/popup.js`:
solo muestra y pide.

Crear usa `createUser({ name, email })`. Listar usa `listUsers()`.
Ver uno usa `findUserById(id)`. Modificar usa
`updateUser(id, changes)`. Borrar usa `deleteUser(id)`. El `id` es
el texto del campo. No se importa `users-gender-count.js`,
`find-user-by-name.js` ni `find-user-by-email.js`.

Esas cinco funciones solo llegan a `src/queries/users.js` y a los
textos SQL. Usan `fetch`. No importan módulos de Node ni paquetes de
`node_modules`. El proceso de la extensión sí puede importarlas: es
el host de Node de VS Code y `first-app` ya es ESM.

Ese host admite una extensión ESM desde VS Code 1.100.0. En esta
máquina, `code` es 1.138.0. El manifiesto pone `"type": "module"` y
`engines.vscode` en `^1.100.0`. El módulo `vscode` lo entrega el
editor al importarlo. No se instala y no se declara en `dependencies`.

El manifiesto es `package.json` porque VS Code lo exige con ese
nombre. No es un paquete que se instale. No tiene `dependencies` ni
`devDependencies`. `pnpm` no lo instala. El `package.json` de la app
no gana ninguna dependencia.

El manifiesto lleva `name` `users`, `displayName` `Usuarios`,
`publisher` `first-app`, `version` `0.0.0`, `license` `MIT`,
`main` `./extension.js` y `activationEvents` `onView:firstApp.users`.
`publisher` es el texto que el manifiesto exige. No hay cuenta ni
publicación. La contribución es una vista en `explorer`, de tipo
`webview`, con id `firstApp.users` y nombre `Usuarios`. No hay otro
contenedor ni icono.

`extension.js` exporta `activate`. No hay clase ni `this`. Registra
la vista `firstApp.users`. El proveedor es un objeto cuya función
`resolveWebviewView` está declarada aparte. Declara el global que
use, como `src/clients/electron/main.js`. Importa `vscode`, las cinco
funciones de `src/logic/` y `readFileSync` de `node:fs`.

Al resolver la vista, `enableScripts` queda en verdadero y
`localResourceRoots` es la carpeta de la extensión. Lee `index.html`,
que está junto a `extension.js`. Sustituye `./styles.css` y
`./panel.js` por las direcciones de `asWebviewUri`. Asigna ese HTML
a la vista y escucha los mensajes. La vista no valida. Si la función
lanza un `Error`, responde con `error.message`. No inventa un
mensaje.

`panel.js` no importa nada. Declara los globales `document` y
`acquireVsCodeApi`. El script de `index.html` no es `type="module"`.
El texto que ve la persona está en español. El código está en inglés.
Lo que escribe en la página usa `textContent`, como
`src/clients/chrome/popup.js`.

La pantalla es la de `src/clients/chrome/index.html`: crear, lista,
ver, modificar, borrar y un sitio para el mensaje.

- Al abrir, pide la lista.
- Crear envía `name` y `email`, aunque estén vacíos. Muestra el
  usuario y vuelve a pedir la lista.
- La lista muestra cada usuario con `id`, `name`, `email`,
  `createdAt` y `updatedAt`. Si no hay usuarios, está vacía.
- Ver envía el id y muestra esos cinco datos.
- Modificar envía el id. `name` entra en `changes` solo si el campo
  tiene texto. `email` entra solo si el campo tiene texto. Un campo
  vacío no entra. Muestra el usuario y vuelve a pedir la lista.
- Borrar envía el id. No muestra un usuario. Después vuelve a pedir
  la lista.

Si la respuesta trae `message`, se ve ese texto.

Los mensajes de la vista son `list`, `create`, `view`, `update` y
`delete`. La respuesta de `list` trae `users`. La de `create`, `view`
y `update` trae `user`. La de `delete` no trae un usuario. Un fallo
trae `message`.

El SQL sigue en `src/db/server.js`, en `http://127.0.0.1:3000`. Se
arranca con el comando que ya existe. `package.json` tiene el script
`vscode`. Se lanza con `pnpm vscode` desde `first-app`. El comando es
`code --extensionDevelopmentPath="$(pwd)/src/clients/vscode" "$(pwd)"`.
La ruta es absoluta porque la ventana de VS Code resuelve una ruta
relativa desde `/` y no carga la extensión. Abre `first-app` en la
ventana de desarrollo. La persona abre la barra lateral y la vista
Usuarios.
No sustituye a `src/clients/http/`, que sigue en el puerto 3001, ni a
`src/clients/chrome/`, que sigue en el puerto 3002. El script
`format` también incluye `src/clients/vscode/**/*.js`.

No se genera un instalador. No se publica. No se crea `.vscode/`.

## Ficheros

Se crean:

- `src/clients/vscode/package.json`
- `src/clients/vscode/extension.js`
- `src/clients/vscode/index.html`
- `src/clients/vscode/panel.js`
- `src/clients/vscode/styles.css`

Se tocan:

- `package.json`
- `docs/ARCHITECTURE.md`
- `docs/TREE.md`

`eslint.config.js` ya cubre `**/*.js` y no se toca.

En el árbol, `clients/` incluye `vscode/` con esos cinco ficheros. En
la arquitectura, el proceso de `src/clients/vscode/` llama a
`src/logic/` y la vista solo muestra el resultado. No hay API nueva.
No sustituye a `src/clients/http/`, ni a `src/clients/chrome/`, ni a
`src/db/server.js`.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec                  | Mensaje                     |
| --------------------------------- | --------------------------- |
| El nombre queda vacío             | `Name is empty`             |
| El email no vale                  | `Email is invalid`          |
| El email es de otro usuario       | `Email is already used`     |
| El usuario no está                | `User not found`            |
| No se llega a la base al crear    | `Could not create the user` |
| No se llega al listar             | `Could not list the users`  |
| No se llega al ver uno           | `Could not find the user`   |
| No se llega al modificar          | `Could not update the user` |
| No se llega al borrar             | `Could not delete the user` |

No hay mensaje nuevo. La vista muestra el que ya lanza `logic/`.
