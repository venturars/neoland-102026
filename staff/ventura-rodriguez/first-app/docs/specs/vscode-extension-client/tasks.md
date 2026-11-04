# Tareas — cliente de VS Code para usuarios

1. Abre `package.json`.
   Añade el script `vscode`: `code --extensionDevelopmentPath="$(pwd)/src/clients/vscode" "$(pwd)"`.
   Añade el glob `src/clients/vscode/**/*.js` en `format`.
   No hay dependencia nueva. `pnpm-lock.yaml` y el resto de scripts no cambian.

2. Abre `docs/TREE.md`, en `src/clients/`.
   Añade `vscode/` con `package.json`, `extension.js`, `index.html`, `panel.js` y `styles.css`.
   El resto del árbol no cambia.
   Esas líneas se leen en el árbol.

3. Abre `docs/ARCHITECTURE.md`, junto a los otros clientes.
   El proceso de `src/clients/vscode/` llama a `src/logic/` y la vista solo muestra el resultado.
   No hay API nueva. No sustituye a `src/clients/http/`, ni a `src/clients/chrome/`, ni a `src/db/server.js`.
   Esas líneas se leen en la arquitectura.

4. Crea `src/clients/vscode/package.json`.
   `name` es `users`, `displayName` es `Usuarios`, `publisher` es `first-app`, `version` es `0.0.0` y `license` es `MIT`.
   `type` es `module`, `main` es `./extension.js`, `engines.vscode` es `^1.100.0` y la activación es `onView:firstApp.users`.
   La vista está en `explorer`, es `webview`, su id es `firstApp.users` y su nombre es `Usuarios`. No hay `dependencies` ni `devDependencies`.

5. Crea `src/clients/vscode/index.html`.
   Una sola pantalla, como `src/clients/chrome/index.html`: crear, lista, ver, modificar, borrar y un sitio para el mensaje.
   El texto visible está en español. El estilo es `./styles.css`.
   El script es `./panel.js` y no es `type="module"`.

6. Crea `src/clients/vscode/styles.css`.
   Da aspecto a la pantalla de `index.html`.
   No cambia el texto ni las acciones.
   El fichero se lee.

7. Crea `src/clients/vscode/extension.js`.
   Exporta `activate`, sin clase ni `this`. Importa `vscode`, `readFileSync` de `node:fs` y `createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser` desde `../../logic/`, con extensión `.js`.
   Registra `firstApp.users`. `enableScripts` es verdadero, `localResourceRoots` es la carpeta de la extensión, lee `index.html` y sustituye `./styles.css` y `./panel.js` con `asWebviewUri`.
   `list` responde `users`. `create`, `view` y `update` responden `user`. `delete` no responde un usuario. Un `Error` responde `error.message`. No importa los otros tres ficheros de `logic/`.

8. Crea `src/clients/vscode/panel.js`.
   No importa nada. Declara `document` y `acquireVsCodeApi`. Escribe con `textContent`.
   Al abrir pide `list`. Crear envía `name` y `email` aunque estén vacíos, muestra `user` y vuelve a pedir la lista.
   Ver envía el texto del id y muestra `id`, `name`, `email`, `createdAt` y `updatedAt`. Modificar envía un campo solo si tiene texto. Borrar no muestra un usuario y vuelve a pedir la lista. Un `message` se ve.

9. En `first-app`, lanza `pnpm format` y `pnpm lint`.
   `pnpm format` escribe los `.js` de `src/clients/vscode/`.
   `pnpm lint` termina bien.
   No cambia `src/logic/`, `src/queries/` ni `pnpm-lock.yaml`.

10. Arranca la base con el comando que ya existe y la extensión con `pnpm vscode`.
    Se abre la ventana de desarrollo. En la barra lateral, la vista Usuarios muestra la lista.
    La base sigue en el puerto 3000. No aparece `.vscode/`.
    Si no hay usuarios, la lista está vacía.

11. Crea Ada con ada@example.com.
    Se ve el id, el nombre Ada, el email ada@example.com y las dos fechas.
    La lista también muestra a Ada.
    Pedir ese id muestra los mismos cinco datos.

12. Cambia el nombre a Ada Lovelace y deja el email vacío.
    Se ve el mismo id, el nombre Ada Lovelace y el email ada@example.com.
    Crea con el nombre vacío, con un email que no vale y con el email de Ada.
    Se ven `Name is empty`, `Email is invalid` y `Email is already used`. Esos tres no cambian a Ada.

13. Pide, modifica o borra un id que no existe.
    Se ve `User not found`.
    Borra a Ada. No se muestra un usuario y Ada ya no sale en la lista.
    Si no queda ninguno, la lista está vacía.

14. Para la base y, en la vista, pide la lista.
    Se ve `Could not list the users`.
    Ver, modificar y borrar muestran su `Could not`.
    Crear muestra `Could not create the user`.
