# Plan — personas en una ventana

Cumple `docs/specs/cliente-escritorio/spec.md`. No es una acción nueva de `src/logic/`.

## Tocar

- `src/clients/electron/main.js`: abre la ventana y carga la página.
- `src/clients/electron/index.html`: la lista, el alta, la búsqueda por número y la ficha.
- `src/clients/electron/app.js`: llama a las funciones que ya existen.
- `src/clients/electron/styles.css`: el aspecto.
- `package.json`: el script `electron` y `electron` `45.2.2` como dependencia de desarrollo.
- `eslint.config.js`: `document` en `app.js`.
- `docs/CONSTITUTIONS.md`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `AGENTS.md`: nombran este cliente.

La lista llama a `listUsers`. Abrir llama a `findUserById(id)`. Crear llama a `createUser({ name, email })`. Guardar llama a `updateUser(id, changes)` solo con el nombre o el email que cambió. Borrar llama a `deleteUser(id)`.

No hay SQL nuevo. No hay firma nueva.

## Frases

Las que ya están en `docs/ERRORS.md`:

- Nombre vacío: `Name is empty`
- Email que no vale: `Email is invalid`
- Email de otra persona: `Email is already used`
- Número que no vale o que no existe: `Invalid id` o `User not found`
- Base parada: `Database is not running. Start it with npm run db.`

## No tocar

- `src/logic/`, `src/queries/`, `src/db/`
- `src/clients/terminal/`, `src/clients/jupyter/`, `src/clients/browser/`, `src/clients/rest/`

## Comprobar

Desde `first-app`, con `npm run db` en marcha, `npm run electron`. Crear, abrir, cambiar el nombre, un nombre vacío y borrar. Luego `npm run format` y `npm run lint`.
