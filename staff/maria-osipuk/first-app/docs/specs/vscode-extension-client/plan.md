Issue: #1007

# Plan del cliente de extensión de VS Code

## Enfoque

No hay funcionalidad nueva en `src/logic/`, ni consultas nuevas, ni cambios en `src/db/server.js` ni en los demás clientes. Hay una carpeta nueva de cliente, `src/clients/vscode/`, con dos partes que se hablan por mensajes:

- **El proceso de la extensión:** corre en el host de Node de VS Code. `user-actions.js` llama a `src/logic/` y `extension.js` registra la vista, recibe los mensajes y confirma el borrado.
- **La vista:** un webview con `index.html`, `view.js` y `styles.css`. Muestra, pide y traduce los errores. No importa `src/logic/` ni otro cliente.

El recorrido es vista → proceso de la extensión → lógica → consultas → servidor de datos → SQLite.

## Por qué no hace falta una API

El proceso de la extensión es Node y carga módulos fuera de su carpeta, así que importa `../../logic/` directamente. Solo el webview está aislado: no puede importar esos archivos, y por eso pide por mensajes. No se abre ningún puerto. El cliente REST del puerto 3001 no se usa, para no depender de otro cliente.

## Entradas y salidas de la lógica

| Acción de la vista | Mensaje enviado                     | Función de `user-actions.js`           | Llamada                   |
| ------------------ | ----------------------------------- | -------------------------------------- | ------------------------- |
| Abrir la lista     | `{ action: "list" }`                | `listUsersAction()`                    | `listUsers()`             |
| Crear              | `{ action: "create", name, email }` | `createUserAction(name, email)`        | `createUser(name, email)` |
| Elegir un usuario  | `{ action: "view", id }`            | `findUserAction(id)`                   | `findUserById(id)`        |
| Guardar            | `{ action: "update", id, changes }` | `updateUserAction(id, changes)`        | `updateUser(id, changes)` |
| Pedir el borrado   | `{ action: "delete", id }`          | `deleteUserAction(id)`, si se confirma | `deleteUser(id)`          |

Cada función de `user-actions.js` devuelve `{ data }` si va bien y `{ error }` con el mensaje en inglés de `src/logic/` si falla. `deleteUserAction` devuelve `{ data: null }`, porque `deleteUser` no devuelve nada.

No se importan `find-user-by-email.js` ni `count-users-by-gender.js`.

## Mensajes entre la vista y el proceso

- **Cada petición lleva un número `request`.** `view.js` lo incrementa y guarda en un `Map` la función que resuelve esa petición. El proceso copia ese número en la respuesta.
- **`call(action, values)` es el único envoltorio de `postMessage`.** Devuelve una promesa, así que cada acción de la vista se lee en orden con `await`.
- **La respuesta es `{ request, data }`, `{ request, error }` o `{ request, cancelled: true }`.** La última solo sale de un borrado cancelado.
- **Una acción desconocida responde `{ request, error }`,** para que su promesa no se quede esperando. La vista la muestra con la frase genérica.

## Detalles del proceso de la extensión

- **`createUser` recibe dos argumentos**, no un objeto.
- **El id llega como número.** La vista lo toma de la lista y `postMessage` conserva el tipo, así que no hay conversión de texto. La vista nunca lo pide escrito a mano.
- **`user-actions.js` no importa `vscode`.** Así `node --test` puede probarlo sin abrir el editor.
- **`extension.js` exporta `activate`** y registra la vista con `registerWebviewViewProvider`. Importa `vscode`, que lo entrega el editor al cargarla y no se instala.
- **El borrado se confirma en `extension.js`,** con `vscode.window.showWarningMessage` y `{ modal: true }`, el texto `¿Eliminar este usuario?`, el detalle `Esta acción no se puede deshacer.` y el botón `Eliminar`. VS Code añade Cancelar y entonces devuelve `undefined`. Al estar en el proceso, nada en la vista puede borrar sin pasar por el diálogo.
- **El HTML se prepara al resolver la vista.** Lee `index.html` y sustituye las rutas de `styles.css` y `view.js` por las de `asWebviewUri`, y el origen de la política de seguridad por `webview.cspSource`.
- **`enableScripts`** es verdadero y `localResourceRoots` es solo la carpeta de la extensión.
- **`retainContextWhenHidden` no se activa.** Al ocultarse, la vista se destruye y vuelve a la lista, como pide la spec.

## Detalles de la vista

- **Política de seguridad.** `index.html` lleva una etiqueta `Content-Security-Policy` con `default-src 'none'`, y `style-src` y `script-src` limitados a `webview.cspSource`. No hay scripts ni estilos en línea.
- **El script no es un módulo y no importa nada.** Toma el canal con `acquireVsCodeApi()`, que solo se puede llamar una vez.
- **Guardar envía `name` y `email`.** El formulario llega relleno, y `src/logic/` admite que un usuario conserve su propio email.
- **Lo que se escribe en la página usa `textContent`**, porque un nombre guardado puede tener caracteres HTML.
- **La selección se guarda en memoria.** Al destruirse la vista se pierde.
- **Los colores salen de las variables `--vscode-*`** del editor, para seguir el tema. No hay paleta propia.

## Manifiesto

`src/clients/vscode/package.json` es el manifiesto, porque VS Code exige ese nombre. No es un paquete que `pnpm` instale: no tiene `dependencies` ni `devDependencies`.

- `name` `first-app-users`, `displayName` `Usuarios`, `publisher` `first-app` (el manifiesto lo exige; no hay cuenta ni publicación), `version` `0.0.0`.
- `type` `module`, `main` `./extension.js` y `engines.vscode` `^1.100.0`, la primera versión que carga extensiones ESM. En este equipo `code` es 1.145.0.
- `contributes.viewsContainers.activitybar`: contenedor `firstAppUsers`, título `Usuarios`, icono `users.svg`.
- `contributes.views.firstAppUsers`: vista `firstAppUsers.view` de tipo `webview`, nombre `Usuarios`.

## Errores

`user-actions.js` captura el error de `src/logic/` y responde `{ error }` con su mensaje en inglés. `view.js` lo traduce con su propia tabla `MESSAGES`, y un mensaje desconocido muestra la frase genérica, como pide [ERRORS.md](../../ERRORS.md). Las frases son las de la spec. No hay excepción a esa guía.

`deleteUser` busca antes de borrar, así que sin servidor de datos lanza `Unable to find user`. La spec lo recoge así y `src/logic/` no cambia.

## Archivos

Se crean:

- `src/clients/vscode/package.json`, `extension.js`, `user-actions.js`, `index.html`, `view.js`, `styles.css` y `users.svg`.
- `tests/vscode-client.test.js`: con un servidor de datos y una base temporales, prueba las cinco funciones de `user-actions.js`, los errores de negocio y el `{ error }` de cada una con el servidor parado.

Se modifican:

- `package.json`: el script `vscode`, `code --extensionDevelopmentPath="$(pwd)/src/clients/vscode" "$(pwd)"`. La ruta es absoluta porque VS Code no resuelve una relativa desde la carpeta actual.
- `eslint.config.js`: un bloque para `src/clients/vscode/view.js` con `document`, `window` y `acquireVsCodeApi`.
- `README.md`: fila del cliente, cómo abrirlo y dónde está su código.
- `docs/ARCHITECTURE.md`: apartado del cliente, frase de los clientes, comando en `package.json`, descripción de `eslint.config.js` y sus archivos.
- `docs/TREE.md`: `src/clients/vscode/`, la prueba y esta spec.
- `docs/ERRORS.md`: apartado del cliente.
- `docs/STYLE.md`: excepciones de `extension.js`, `user-actions.js` y `view.js`, que reúnen funciones en un archivo, de `{ data }` o `{ error }` entre las partes del cliente y de `call` como único envoltorio de `postMessage`.
- `docs/CONSTITUTION.md`: el cliente en los apartados 1 y 3.

No cambian `src/logic/`, `src/queries/`, `src/db/`, `pnpm-lock.yaml` ni los demás clientes. `pnpm format` ya cubre la carpeta nueva.

## Paquetes

No se añade ningún paquete Node ni cambia ninguna versión, así que no hay revisión con Socket. `vscode` lo aporta el editor y no se declara.

## Verificación

1. `pnpm exec prettier --write` sobre los archivos de esta tarea, `pnpm lint` y `pnpm test`, con `pnpm start` y `pnpm run http` parados.
2. Con `FIRST_APP_DATABASE_FILE` apuntando a una base temporal, `pnpm start` y `pnpm run vscode`.
3. Recorrer en la vista los casos de la spec. Esta parte es manual: `view.js` y `extension.js` no tienen prueba automática.
4. Parar el servidor de datos y repetir las acciones.
5. Base compartida: con `pnpm run web` y `pnpm run http`, sobre la misma base temporal.

## Decisiones

1. **Constitución:** se aprueba añadir el cliente a los apartados 1 y 3. Se aplica al implementar.
2. **Idioma de los errores:** español, con la tabla `MESSAGES` de la vista, como pide ERRORS.md.
3. **Acciones:** `user-actions.js`, sin importar `vscode`, con respuestas `{ data }` o `{ error }`.
4. **Confirmar el borrado:** diálogo modal en el proceso de la extensión.
5. **Respuestas:** cada una se reconoce por su número `request`, con `call()` en la vista.
