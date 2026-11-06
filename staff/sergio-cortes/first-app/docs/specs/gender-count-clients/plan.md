Issue: #1155.

# Plan — recuento de género en los clientes

No es una funcionalidad nueva de negocio. No hay fichero nuevo en `src/logic/`, ni firma nueva, ni SQL nuevo. `usersGenderCount()` (`src/logic/user-gender-count.js`) ya existe y no cambia. Cada cliente la llama directamente o pide su ruta.

No hay paquete nuevo ni cambio de versión. No hay validación de Socket que hacer.

## Relación con otras specs

- `node-http-users-client`: no se toca. Esta spec sustituye su línea «Añadir el conteo por género a los clientes que ya existen» para Express, Chrome, Nest, VS Code y Electron.
- `electron-desktop-client/plan.md` (línea «No importan `user-gender-count.js`») y `vscode-extension-user-client/plan.md` (línea «No se importa `user-gender-count.js`»): quedan sustituidas aquí. Electron importa la función en `app.js`. El proceso de la extensión la importa en `extension.js`. El panel de VS Code sigue sin importar `src/logic/`.
- `chrome-extension-user-client/plan.md`: sigue valiendo. El popup no importa `src/logic/`; pide el recuento por `fetch`.

## Ficheros

No se crea ninguno. Se tocan:

- `src/clients/http/server.js`: import y ruta nueva.
- `src/clients/chrome/server.js`: import y ruta nueva.
- `src/clients/nest/users.controller.js`: ruta nueva con decoradores de Swagger.
- `src/clients/nest/users.service.js`: método nuevo `genderCount()`.
- `src/clients/chrome/index.html` y `src/clients/chrome/popup.js`: panel y lógica.
- `src/clients/electron/index.html` y `src/clients/electron/app.js`: panel y lógica.
- `src/clients/vscode/index.html`, `src/clients/vscode/panel.js` y `src/clients/vscode/extension.js`: panel, mensaje nuevo y lógica.

No se tocan `src/logic/`, `src/queries/`, `src/db/`, `styles.css`, `package.json`, `eslint.config.js` ni `docs/STYLE.md`. Los paneles usan las clases que ya existen (`panel`, `eyebrow`, `description`, `actions`, `help`). Las variables globales `document` y `fetch` ya están declaradas para estos ficheros.

`docs/TREE.md` y `docs/ARCHITECTURE.md` no cambian: no hay fichero añadido ni quitado.

No se tocan `src/clients/web/`, `src/clients/node-http/`, `src/clients/terminal/` ni `src/clients/jupyter/`.

## Firma

- `GET /users/gender-count`: llama a `usersGenderCount()`, sin parámetros. Responde `{ woman, man, genderUndefined }`.
- Nest, `UsersService.genderCount()`: `async`. Hace `await usersGenderCount()` y devuelve el objeto.
- Chrome, `popup.js`: `fetchGenderCount()` (fetch a `${ORIGIN}/users/gender-count`, con `throwApiError` si no es ok), `showGenderCount(count)` y `countGenders()` (el manejador del botón).
- Electron, `app.js`: `countGenders()` (llama a `usersGenderCount()` con `await`) y `showGenderCount(count)`.
- VS Code, `panel.js`: `countGenders()` (llama a `callExtension("genderCount")`) y `showGenderCount(count)`. Lee `data.count`.
- VS Code, `extension.js`: `handleGenderCount(webview, message)`, con el mismo patrón que `handleList`. Responde con `postReply(webview, request, { count })`.

`showGenderCount(count)` escribe tres líneas en el panel con `textContent`: «Mujer: n», «Hombre: n» y «Sin clasificar: n», donde `n` sale de `woman`, `man` y `genderUndefined`.

## Llamadas

| Cliente          | Llamada                                                      | Éxito              | Fallo                                                                 |
| ---------------- | ------------------------------------------------------------ | ------------------ | --------------------------------------------------------------------- |
| Express          | `usersGenderCount()`                                         | 200                | `DatabaseError` → 500 `{ message }` (manejador que ya existe)         |
| Chrome (Fastify) | `usersGenderCount()`                                         | 200                | `DatabaseError` → 500 `{ message }` (manejador que ya existe)         |
| Nest             | `UsersService.genderCount()` → `usersGenderCount()`          | 200                | `HttpExceptionFilter` ya mapea `DatabaseError` a 500                  |
| Chrome (popup)   | `fetchGenderCount()` → `GET /users/gender-count`             | 200                | `throwApiError` lanza `Error` con el mensaje de la respuesta          |
| Electron         | `usersGenderCount()`                                         | objeto             | `DatabaseError` → su mensaje                                          |
| VS Code          | `callExtension("genderCount")` → `handleGenderCount` → `usersGenderCount()` | `{ count }` | `postError` → su mensaje                                              |

## Ruteo

La ruta literal `/users/gender-count` tiene que ir antes que `/users/:id`. Si no, `gender-count` se toma como id y responde `Id is invalid`.

- Express: `app.get("/users/gender-count", ...)` antes de `app.get("/users/:id", ...)`.
- Fastify: igual, antes de `app.get("/users/:id", ...)`.
- Nest: `@Get("users/gender-count")` antes de `@Get("users/:id")` en el controlador.

Las tres rutas no reciben cuerpo.

## Nest: Swagger

El controlador documenta cada ruta con `@ApiResponse`. La ruta nueva sigue el mismo patrón:

- 200 con un esquema nuevo `GENDER_COUNT_SCHEMA` (tres propiedades enteras `woman`, `man` y `genderUndefined`), junto a `MESSAGE_SCHEMA` y `USER_SCHEMA`.
- 500 con descripción `Could not classify the users` y `MESSAGE_SCHEMA`.

## Pantalla (Chrome, Electron y VS Code)

En `index.html`, dentro de `#selection-screen`, después del panel «Alta», se añade un `div.panel` con:

- `p.eyebrow` «Estadística».
- `h2` «Recuento por género».
- `p.description` «Cuenta los usuarios por el género que sugiere su nombre.».
- `div.actions` con `<button id="gender-count-button" type="button">Contar género usuarios</button>`. No lleva `data-action`.
- `div#gender-count-result.help` con `aria-live="polite"`. Su texto inicial es «Pulsa «Contar género usuarios» para ver el recuento.».

El texto del botón y del resultado se cambia solo desde `countGenders()` y `showGenderCount()`.

## Lógica de `countGenders()` (los tres clientes)

1. Deshabilita el botón y limpia el aviso con `showMessage("", false)`.
2. Pone «Cargando…» en `#gender-count-result`.
3. Pide el recuento. Si llega, guarda el objeto en una variable del módulo (`LAST_GENDER_COUNT`) y llama a `showGenderCount()`.
4. Si falla, muestra el aviso `showMessage("Could not classify the users", true)`. Después pinta de nuevo `LAST_GENDER_COUNT` si existe, o la frase inicial si no.
5. En `finally`, vuelve a habilitar el botón.

No usa `STATE.isBusy`. Como el botón no lleva `data-action`, `navigate` lo ignora y no cambia nada de la lista ni de la búsqueda.

## Errores

El aviso usa el mensaje ya existente `Could not classify the users`, sin texto nuevo. Ver pregunta P1 sobre el fallo de red en Chrome.

## Verificación

- Con Ollama en marcha y el modelo `llama3.2` descargado: `curl` a 3001, 3002 y 3003 en `/users/gender-count` responde 200 con los tres números.
- Con Ollama parado y usuarios en la base: las mismas peticiones responden 500 con `{ "message": "Could not classify the users" }`.
- Con la base vacía y Ollama parado: responde 200 con 0, 0 y 0, sin llamar a la IA.
- Chrome, Electron y VS Code: los pasos de la issue #1155 en la pantalla inicial.
- No se crea `.txt` en `src/clients/terminal/`.
- Al terminar la implementación: `pnpm run format` y `pnpm run lint`.

## Decisiones

1. La lógica no cambia: los tres clientes usan `usersGenderCount()` o su ruta.
2. La ruta literal va antes de `:id` en los tres servidores.
3. El panel repite el patrón visual de los demás paneles (eyebrow, h2, descripción, botón, resultado).
4. Al fallar, el panel conserva el último resultado correcto. Si no hubo ninguno, muestra la frase inicial.
5. El botón no usa `data-action` ni `STATE.isBusy`, para no afectar a la lista, la búsqueda ni el alta.
6. Nest documenta la ruta con Swagger como el resto de rutas del controlador.
7. Electron y VS Code importan `usersGenderCount()`, en vez de pedir el recuento por HTTP. Así sustituyen la línea de sus specs anteriores sobre `user-gender-count.js`.

## Preguntas

**P1. Fallo de red en Chrome.** Si el servidor de Chrome (3002) no responde, el navegador lanza `TypeError` con el texto «Failed to fetch». Ese texto no está en la lista de errores. Para que el aviso sea siempre uno de los establecidos, propongo que el panel muestre `Could not classify the users` en cualquier fallo del recuento, también en Electron y VS Code.

➡️ Recomendación: sí, siempre `Could not classify the users`.

El plan queda aquí. No hay `tasks.md` hasta revisar la spec, el plan y esta pregunta.
