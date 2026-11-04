# Plan — personas en VS Code

Cumple `docs/specs/cliente-vscode/spec.md`. No es una acción nueva de `src/logic/`.

## Tocar

- `src/clients/vscode/package.json`: el manifiesto. No es un paquete de npm y no se instala. La vista `People` va en el explorador.
- `src/clients/vscode/extension.js`: registra la vista. Importa `listUsers`, `findUserById`, `createUser`, `updateUser` y `deleteUser`.
- `src/clients/vscode/index.html`, `panel.js` y `styles.css`: crear, listar, ver, cambiar y borrar. `panel.js` no importa `src/logic/`. Manda mensajes a la extensión.
- `package.json`: el script `vscode` abre la ventana de desarrollo. `format` incluye `src/clients/vscode/**/*.js`. No se añade ninguna dependencia.
- `eslint.config.js`: `document`, `acquireVsCodeApi` y `window` en `panel.js`.
- `docs/CONSTITUTIONS.md`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `AGENTS.md` y `README.md`: nombran este cliente y `npm run vscode`.

La lista llama a `listUsers()`. Ver llama a `findUserById(id)`. Crear llama a `createUser({ name, email })`. Cambiar llama a `updateUser(id, changes)` solo con el nombre o el email que se escribió. Borrar llama a `deleteUser(id)`. El número del formulario se convierte en un entero antes de llamar. No hay SQL nuevo. No hay firma nueva.

## Frases

Las que ya devuelve `src/logic/`. El panel muestra `error.message`:

- `Name is empty`
- `Email is invalid`
- `Email is already used`
- `Invalid id`
- `User not found`
- `Database is not running. Start it with npm run db.`

## Arranque

Desde `first-app`, `npm run db` y `npm run vscode`. La vista People está en el explorador.

Al cerrar VS Code se cierra esa ventana. Para volver a verla se ejecuta otra vez `npm run vscode`. La base tiene que seguir en marcha.

## Socket

No se propone ningún paquete de Node. El manifiesto no se instala. No hay puntuación que pedir.

## No tocar

- `src/logic/`, `src/queries/`, `src/db/`
- `src/clients/terminal/`, `src/clients/jupyter/`, `src/clients/browser/`, `src/clients/rest/`

## Comprobar

Desde `first-app`, con la base en marcha, `npm run vscode`. Crear una persona temporal, verla, cambiar el nombre, borrarla, y probar un nombre vacío. Luego `npm run format` y `npm run lint`. Quitar a esa persona.
