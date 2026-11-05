# Plan: Cliente de extensión de VS Code

Implementa [spec.md](spec.md). Respeta [CONSTITUTIONS.md](../../CONSTITUTIONS.md) y sus guías. Sin paquetes nuevos: el módulo `vscode` lo pone VS Code al cargar la extensión. Sin cambios en la tabla.

## Dónde encaja
Una extensión de VS Code tiene dos partes. El proceso de la extensión corre en Node dentro de VS Code: es un cliente como la terminal e importa `logic/`. El panel es una página aislada (webview) que solo pinta y le pide cada operación al proceso con mensajes.

```
panel (webview: index.html + panel.js)
   │ postMessage { id, action, ... }        ▲ postMessage { id, ok, result | error }
   ▼                                        │
src/clients/vscode/extension.js (proceso de la extensión, Node)
   │ import
   ▼
src/logic/*  →  src/queries/users.js  →  servidor de la base (4000)
```

Ni el panel ni el proceso validan ni deciden mensajes: el resultado y el mensaje del error salen de `logic` tal cual.

## Ficheros
```
src/clients/vscode/package.json   NUEVO: el manifiesto de la extensión
src/clients/vscode/extension.js   NUEVO: registra el panel y atiende sus mensajes con logic/
src/clients/vscode/index.html     NUEVO: las dos pantallas y el aviso de borrar
src/clients/vscode/styles.css     NUEVO: el aspecto, con los colores del tema de VS Code
src/clients/vscode/panel.js       NUEVO: pide las operaciones al proceso y pinta los resultados
src/clients/vscode/icon.svg       NUEVO: el icono de la barra de actividad
package.json                      el script vscode y format de la carpeta nueva
eslint.config.js                  las variables del panel
docs/ARCHITECTURE.md, docs/TREE.md, AGENTS.md
```
No se tocan `src/logic/`, `src/queries/`, `src/db/` ni los otros clientes.

## Comprobado antes del plan
Con una extensión mínima en una carpeta aparte, abierta en una ventana de desarrollo de VS Code 1.145 con un perfil aparte:
- **Módulo ES.** VS Code arranca una extensión con `"type": "module"` y `import`.
- **`logic/`.** El proceso de la extensión importa `list-users.js` del proyecto y lee la base: devolvió los 7 usuarios. Es Node, así que no envía `Origin` y la base no cambia.
- **Mensajes.** El panel pide con `postMessage` y el proceso contesta con `webview.postMessage`.
- **CSP.** Con `default-src 'none'`, una llamada del panel a la base se bloquea: todo pasa por el proceso.
- **CDP.** Con `--remote-debugging-port`, se pulsa el icono de la barra de actividad desde la página de VS Code y se llega al `iframe` del panel para leerlo y manejarlo.

## Decisiones técnicas
| Tema | Decisión | Motivo |
|---|---|---|
| Arranque | `pnpm vscode`, que lanza `code --extensionDevelopmentPath="%CD%\src\clients\vscode" "%CD%"`: una ventana de desarrollo con la extensión cargada y `first-app` abierto | Sin empaquetar ni instalar. Usa `%CD%` como `pnpm browser`, porque `pnpm` lanza los scripts con `cmd` en Windows |
| Manifiesto | `src/clients/vscode/package.json`: `name` `first-app-users`, `displayName` `first-app usuarios`, `publisher` `sergio-moras`, `"type": "module"`, `main` `./extension.js`, `engines.vscode` `^1.100.0`. Sin `dependencies` | Es lo que lee VS Code. No lo lee `pnpm`: no es un paquete del proyecto |
| Panel | Un contenedor propio en la barra de actividad (`viewsContainers.activitybar`, con `icon.svg`) y dentro una vista `webview` `firstAppUsers.panel` | Un icono propio en la barra lateral, sin mezclarse con el explorador |
| Activación | Sin `activationEvents`: VS Code activa la extensión al abrir su vista | Desde VS Code 1.74 lo deduce del manifiesto |
| Página | `extension.js` lee `index.html` y cambia tres marcas: `{{cspSource}}`, `{{nonce}}` y las rutas de `styles.css` y `panel.js` por las de `webview.asWebviewUri` | Los ficheros del panel se cargan desde la carpeta de la extensión, como pide VS Code |
| Seguridad del panel | `enableScripts: true` y `localResourceRoots` solo con la carpeta de la extensión. CSP: `default-src 'none'; style-src {{cspSource}}; script-src 'nonce-{{nonce}}'`. El nonce es aleatorio cada vez (`crypto.randomUUID()`) | Solo corre `panel.js`, solo carga sus estilos y no puede llamar a ninguna dirección. Comprobado antes del plan |
| Mensajes | El panel envía `{ id, action, data }` con `action` `list`, `create`, `update` o `delete`, y los datos de la operación en `data`. El proceso contesta `{ id, ok: true, result }` o `{ id, ok: false, error }`. `callExtension(action, data)` del panel devuelve una promesa que se cumple o falla con esa respuesta | Cada respuesta va con el `id` de su pregunta, así no se mezclan. Los datos van aparte para que el id de un usuario no pise el de la pregunta |
| Proceso | `handleMessage` busca la acción en un objeto `ACTIONS` con `Object.hasOwn` y llama a `listUsers`, `createUser`, `updateUser` o `deleteUser` con `await`. Una acción que no está se ignora | Solo se ejecuta lo que hay en la lista. El panel nunca envía otra |
| Ficha | Los datos salen del usuario elegido en la lista. Después de guardar, salen de lo que devuelve `updateUser` | Sin función nueva para buscar por id |
| Borrar | Un `<dialog>` propio con **Cancelar** y **Borrar** | Igual que Electron y la extensión de Chrome. `confirm()` no funciona en un webview |
| Aspecto | Colores y letra del tema de VS Code (`--vscode-foreground`, `--vscode-button-background`, `--vscode-input-background`...) | El panel se ve como el resto del editor, con tema claro u oscuro |
| Errores en pantalla | `Error: <mensaje>` en un párrafo propio de cada pantalla, que se borra al empezar la siguiente acción | Igual que los otros clientes |
| Textos | En la página con `textContent`, nunca con HTML | Un nombre con `<` se ve tal cual |
| ESLint | Un bloque para `src/clients/vscode/panel.js` con `document`, `window` y `acquireVsCodeApi` | Son las variables del panel. `extension.js` no necesita nada más |
| Formato | `format` incluye `src/clients/vscode/**/*.{js,html,css,json}` | Como los otros clientes |
| Estilo | El de [STYLE.md](../../STYLE.md): funciones con nombre, una acción por línea, sin `?.` | Igual que el resto del código |

## `extension.js`
1. Comentario inicial con su responsabilidad.
2. Imports: `node:fs`, `node:crypto`, `vscode` y las cuatro funciones de `logic/`.
3. `VIEW_ID` y `ACTIONS`, que lleva cada acción a su función.
4. `handleMessage(webview, message)`: llama a la acción y contesta con `ok` y `result` o `error`.
5. `buildHtml(webview, extensionUri)`: lee `index.html` y pone la CSP, el nonce y las rutas.
6. `resolveWebviewView(view)`: opciones, HTML y escucha de mensajes.
7. `activate(context)`: registra el proveedor del panel. `deactivate()` vacío.

## `panel.js`
1. Comentario inicial, `acquireVsCodeApi()` y las preguntas pendientes por `id`.
2. `callExtension(action, data)` y la escucha de respuestas.
3. `showScreen`, `showError`, `clearError`, `writeText`.
4. `loadUsers`, `addUser`, `showUser`, `openUser`, `saveUser`, `askDelete`, `closeDeleteDialog`, `removeUser` y `goBack`.
5. `connectButtons()` y la carga inicial de la lista.

## Cómo se prueba
- Guardar la salida de `list-users.txt` justo antes de empezar.
- Con `pnpm db` en marcha, abrir la ventana de desarrollo con el mismo `--extensionDevelopmentPath` que `pnpm vscode`, más un perfil aparte y `--remote-debugging-port`. Pulsar el icono con CDP y manejar el panel dentro de su `iframe`.
- Con el usuario temporal `tmp-1042-1`: la lista, el alta, la ficha con sus cinco datos, guardar el nombre, el email y los dos, borrar cancelando y confirmando, y volver sin guardar.
- Los errores de la spec, cada uno con su mensaje. El email repetido se saca de la lista en ese momento. Un usuario borrado desde la terminal con la ficha abierta.
- Con la base parada, la lista enseña el error de base parada.
- La CSP: desde el panel, una llamada a la base se bloquea.
- Un nombre con HTML se ve como texto.
- Al terminar no queda ningún `tmp-1042-*` y `list-users.txt` da lo mismo que al empezar.
- `pnpm format` y `pnpm lint` sin errores.
- Después, el alumno lanza `pnpm vscode` y lo prueba a mano.
