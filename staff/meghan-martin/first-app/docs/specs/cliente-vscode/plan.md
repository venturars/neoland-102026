# Plan — personas en VS Code

Cumple `docs/specs/cliente-vscode/spec.md`. No es una acción nueva de `src/logic/`.

## Tocar

- `src/clients/vscode/package.json`: el manifiesto de la extensión. No es un paquete de npm y no se instala. El comando visible es `First App: Open People`.
- `src/clients/vscode/extension.cjs`: registra ese comando, abre el panel y llama a las funciones que ya existen.
- `src/clients/vscode/panel.html`, `panel.js` y `panel.css`: la lista, el alta, la búsqueda, la ficha y la confirmación. `panel.js` no importa `src/logic/`. Manda mensajes a `extension.cjs`.
- `src/clients/vscode/.vscode/launch.json`: abre el host de desarrollo de esa carpeta.
- `package.json`: el script `format` incluye `src/clients/vscode/**/*.js` y `src/clients/vscode/**/*.cjs`. No se añade ninguna dependencia.
- `eslint.config.js`: `require`, `module` y `console` en `extension.cjs`. `document` y `acquireVsCodeApi` en `panel.js`.
- `docs/CONSTITUTIONS.md`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `AGENTS.md` y `README.md`: nombran este cliente y cómo volver a abrirlo.

`extension.cjs` es CommonJS porque así arranca VS Code. Importa con `import()` los módulos de `src/logic/`, que siguen en ESM. El panel solo habla con la extensión.

La lista llama a `listUsers()`. Ya viene ordenada por número. Crear llama a `createUser({ name, email })`. Guardar llama a `updateUser(id, changes)` solo con el nombre o el email que cambió. Borrar llama a `deleteUser(id)` solo después de confirmar el email guardado.

No hay SQL nuevo. No hay firma nueva.

## Buscar

El texto se recorta. Si queda vacío, se muestra otra vez la lista.

- Si lleva `@`, es un email. Se llama a `findUserByEmail(texto)`. `Email is invalid` se muestra y el texto sigue. `User not found` se muestra como búsqueda sin resultados.
- Si no tiene letras, es un número. Si no es un entero seguro mayor o igual que 1, se muestra `Invalid id` y el texto sigue. Si vale, se llama a `findUserById(id)`. `User not found` se muestra como búsqueda sin resultados.
- En otro caso es un nombre. Se compara con el nombre entero de las personas de `listUsers()`, y las mayúsculas cuentan. `Ana` no es `ana`.

## Borrar

Se compara el texto con el email guardado, sin los espacios de los extremos y sin distinguir mayúsculas. Si está vacío o no coincide, no se llama a `deleteUser`. El panel muestra `Type the saved email.` Esa frase no es un fallo de `src/logic/`.

## Frases

Las que ya están en `docs/ERRORS.md`:

- `Name is empty`
- `Email is invalid`
- `Email is already used`
- `Invalid id`
- `User not found`, cuando la persona elegida ya no existe
- `Database is not running. Start it with npm run db.`

El panel, además:

- Lista vacía: `There are no people yet.`
- Búsqueda sin resultados: `No people match.`
- Confirmación distinta: `Type the saved email.`

Los datos se escriben como texto. No hay éxito antes de que la llamada termine. Un fallo de alta o de cambio deja lo escrito en el formulario. Cancelar restaura lo guardado.

## Arranque

Desde `first-app`, `npm run db`.

Se abre la carpeta `src/clients/vscode` en VS Code y se pulsa F5. En la paleta de comandos, `First App: Open People`.

Al cerrar VS Code se cierra ese host. Para volver a ver el panel se repite F5 y el mismo comando. La base tiene que seguir en marcha.

## Socket

No se propone ningún paquete de Node. El manifiesto no se instala. No hay puntuación que pedir.

## No tocar

- `src/logic/`, `src/queries/`, `src/db/`
- `src/clients/terminal/`, `src/clients/jupyter/`, `src/clients/browser/`, `src/clients/rest/`

## Comprobar

Leer este plan. El código queda para después de las tareas.
