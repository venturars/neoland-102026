# Plan — cliente de usuarios en una extensión de VS Code

Issue: #1002

Funcionalidad nueva, solo en `src/clients/` y `scripts/`. No hay firma nueva en `src/logic/`, ni SQL nuevo, ni mensaje nuevo. `src/db/server.js`, `src/queries/` y los demás clientes no cambian.

No hay paquete nuevo y no cambia ninguna versión, así que no entra Socket. El módulo `vscode` lo entrega el editor. `pnpm-lock.yaml` no cambia.

El diseño toma de referencia el cliente de VS Code de Ventura (issue #950), por decisión de Diego. Hay tres diferencias: borrar pide confirmación, el código lleva comentarios por bloques en castellano, y se abre con un script que funciona en Windows.

## Cómo funciona

```
vista (panel.js)
  → postMessage
    → extension.js, en Node
      → src/logic/
        → src/queries/
          → src/db/server.js (127.0.0.1:3000)
```

- `panel.js` no llama a la red. Manda cada acción a `extension.js` y pinta la respuesta.
- `extension.js` llama a `src/logic/`, importando las operaciones fichero a fichero. Así no carga `openai`.
- La lógica llega a la base con `fetch`, sin `Origin`, y `src/db/server.js` lo atiende sin cambios.
- Quien prueba la app lanza `pnpm start` y luego `pnpm vscode`.

## Ficheros

Se crean en `src/clients/vscode/`:

- `package.json` — manifiesto de la extensión: `"type": "module"`, `"main": "./extension.js"`, `engines.vscode` `^1.100.0` y la vista `firstApp.users`, de tipo `webview`, en `explorer`. Sin dependencias. No lleva comentarios, porque es JSON.
- `extension.js` — registra la vista, carga `index.html` con las direcciones de `asWebviewUri` y atiende los mensajes de la vista. Activa `enableScripts` y limita `localResourceRoots` a esta carpeta.
- `index.html` — la lista, los cuatro formularios, el usuario visto, la confirmación y `<p id="message" role="status">`. Tiene una política de contenido que solo deja cargar estilos y scripts de la propia extensión. Los campos son `type="text"` y sin `required`, para que los mensajes sean los de `logic`.
- `panel.js` — envía cada acción con `postMessage` y pinta las respuestas con `textContent`. Modificar solo envía los campos con texto. Borrar no envía nada hasta pulsar «Confirmar».
- `styles.css` — el aspecto de la vista, con los colores del tema del editor. El mensaje de error se distingue del resto.

Se crea `scripts/vscode.js`, que abre el editor con `code --extensionDevelopmentPath=<ruta absoluta de src/clients/vscode> <ruta absoluta de first-app>`. Sigue el patrón de `scripts/browser.js`. No usa `$(pwd)`, porque no funciona en la terminal de Windows.

Se tocan:

- `package.json` — script `"vscode": "node scripts/vscode.js"` y `src/clients/vscode/**/*.{js,html,css}` en `format`.
- `eslint.config.js` — `document`, `window` y `acquireVsCodeApi` para `src/clients/vscode/panel.js`.
- `AGENTS.md` — comando `pnpm vscode`, alcance de `pnpm format` y clientes que necesitan el servidor.
- `docs/ARCHITECTURE.md` — fila en «Quién sabe qué» y sitios donde se ejecuta `logic`.
- `docs/TREE.md` — `clients/vscode/` y `scripts/vscode.js`.

## Mensajes entre la vista y la extensión

| La vista envía | Operación | La extensión responde |
| --- | --- | --- |
| `{ action: "list" }` | `listUsers()` | `{ users }` |
| `{ action: "create", name, email }` | `createUser({ name, email })` | `{ created: true }`, y la lista |
| `{ action: "view", id }` | `findUserById(id)` | `{ user }` |
| `{ action: "update", id, changes }` | `updateUser(id, changes)` | `{ user }`, y la lista |
| `{ action: "delete", id }` | `deleteUser(id)` | `{ deleted: true }`, y la lista |

Cada respuesta lleva también su `action`, para que la vista sepa qué formulario vaciar. Si `logic` lanza un error, la extensión responde `{ action, error: "<mensaje>" }`, tal como llega.

## Confirmación de borrado

`confirm()` no funciona en una vista de VS Code, así que «Borrar» muestra «Confirmar» y «Cancelar» en la misma vista, con el id que se va a borrar. «Cancelar» no envía nada.

## Estilo

Comentarios por bloques en castellano, cortos y fáciles de leer, también encima de cada import. Líneas de código cortas. Lo que ve la persona está en castellano.

## Firma

No hay función nueva en `src/logic/`. El cliente usa `createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser`.

## SQL

No hay SQL.

## Errores

La vista muestra el mensaje tal como llega.

| Fallo de la spec | Mensaje de `docs/ERRORS.md` |
| --- | --- |
| El nombre queda vacío | `Name is empty` |
| El email no vale | `Email is invalid` |
| El email es de otro usuario | `Email is already used` |
| El usuario no está | `User not found` |
| No se llega al crear | `Could not create the user` |
| No se llega al listar | `Could not list the users` |
| No se llega al ver uno | `Could not find the user` |
| No se llega al modificar | `Could not update the user` |
| No se llega al borrar | `Could not delete the user` |

## Pruebas

En este equipo `code` abre Cursor (motor 1.128) y no se ha encontrado VS Code de Microsoft. La extensión se prueba en Cursor. El enunciado pide VS Code: esa comprobación queda sin hacer si no se instala.

La lista y los mensajes pasan por `extension.js`, que necesita el editor, así que la vista la prueba Diego a mano. Si la extensión no carga como módulo ES en Cursor, se para y se pregunta.
