Issue: #1155.

# Tareas — recuento de género en los clientes

Pasos en el orden en que los haría una persona. Ninguno toca `src/logic/`, `src/queries/` ni `src/db/`. Solo el paso 25 toca `package.json`, en el script `format`. Ningún paso instala paquetes. Ninguno crea un `.txt` en `src/clients/terminal/`.

Pregunta P1 del plan: se aplica la recomendación aprobada. Cualquier fallo del recuento muestra `Could not classify the users`.
Pregunta P2 del plan: se aplica. `package.json` cambia solo en el script `format`.

## Servidores HTTP

1. En `src/clients/http/server.js`, importar `usersGenderCount` de `../../logic/user-gender-count.js`. Añadir `app.get("/users/gender-count")` antes de `app.get("/users/:id")`. Responde 200 con `res.status(200).json(count)`. Resultado: `node --check` pasa y la ruta no responde `Id is invalid`.

2. En `src/clients/chrome/server.js`, hacer lo mismo con Fastify: importar la función y añadir la ruta antes de `app.get("/users/:id")`. Devuelve el objeto con `return count`. Resultado: `node --check` pasa.

3. En `src/clients/nest/users.service.js`, importar `usersGenderCount` y añadir `async genderCount()`, que hace `await usersGenderCount()` y devuelve el objeto. Resultado: el resto del servicio no cambia.

4. En `src/clients/nest/users.controller.js`, añadir `GENDER_COUNT_SCHEMA` junto a `MESSAGE_SCHEMA` y `USER_SCHEMA`. Añadir el método `@Get("users/gender-count")` antes de `@Get("users/:id")`, con `@ApiResponse` 200 (con `GENDER_COUNT_SCHEMA`) y 500 (`Could not classify the users`, con `MESSAGE_SCHEMA`). Llama a `this.usersService.genderCount()`. Resultado: el método aparece en Swagger.

5. Con Ollama en marcha y `llama3.2` descargado, arrancar `pnpm http`, `pnpm chrome` y `pnpm nest`. Con `curl` a `127.0.0.1:3001`, `3002` y `3003` en `/users/gender-count`. Resultado: las tres responden 200 con `woman`, `man` y `genderUndefined`.

6. Con Ollama parado, repetir el paso 5. Resultado: las tres responden 500 con `{ "message": "Could not classify the users" }`.

7. En una base de prueba sin usuarios y con Ollama parado, repetir el paso 5. Resultado: las tres responden 200 con 0, 0 y 0, sin llamar a la IA.

## Chrome (popup)

8. En `src/clients/chrome/index.html`, dentro de `#selection-screen` y después del panel «Alta», añadir el panel de recuento: `p.eyebrow` «Estadística», `h2` «Recuento por género», `p.description`, `div.actions` con `<button id="gender-count-button" type="button">` (sin `data-action`) y `div#gender-count-result.help` con `aria-live="polite"` y la frase inicial. Resultado: el panel se ve con la frase inicial.

9. En `src/clients/chrome/popup.js`, añadir `fetchGenderCount()` (fetch a `${ORIGIN}/users/gender-count` con `throwApiError`), `showGenderCount(count)` (tres líneas con `textContent`), la variable `LAST_GENDER_COUNT` y `countGenders()` con los cinco pasos del plan. Resultado: el fichero no importa `src/logic/`.

10. En `initializeClient` de `popup.js`, registrar `document.getElementById("gender-count-button")` con `addEventListener("click", countGenders)`. Resultado: pulsar el botón llama a `countGenders`.

## Electron

11. En `src/clients/electron/index.html`, dentro de `#selection-screen` y después del panel «Alta», añadir el mismo panel del paso 8. Resultado: la ventana muestra el panel con la frase inicial.

12. Crear `src/clients/electron/preload.cjs`. Con `const { contextBridge, ipcRenderer } = require("electron");`, exponer `firstApp` con `contextBridge.exposeInMainWorld` y el método `countGenders: () => ipcRenderer.invoke("gender-count")`. Resultado: el fichero solo hace `require("electron")` y no importa ningún fichero local.

13. En `src/clients/electron/main.js`, importar `ipcMain` de `electron` y `usersGenderCount` de `../../logic/user-gender-count.js`. En `startApp()`, antes de `createWindow()`, registrar `ipcMain.handle("gender-count", () => usersGenderCount())`. En `createWindow()`, añadir a `BrowserWindow` la opción `webPreferences: { preload: path.join(folder, "preload.cjs") }`. Resultado: `pnpm electron` arranca sin errores y la ventana carga el preload.

14. En `src/clients/electron/app.js`, quitar el import de `user-gender-count.js` (línea 9). En `countGenders()`, sustituir la llamada directa por `await window.firstApp.countGenders()`. Mantener `showGenderCount(count)` y la lógica del plan. Si el botón no está registrado en `initializeClient`, registrarlo. Resultado: `grep -n "import" src/clients/electron/app.js` no devuelve nada.

15. En `eslint.config.js`, añadir `window: "readonly"` al bloque de `src/clients/electron/app.js`. Resultado: `pnpm run lint` no marca `window` en `app.js`.

16. Ejecutar `pnpm run lint`. Si marca `require` o `module` en `preload.cjs`, añadir un bloque en `eslint.config.js` para ese fichero con `sourceType: "commonjs"`. Si no los marca, no se toca más `eslint.config.js`. Resultado: `pnpm run lint` pasa en `preload.cjs`.

## VS Code

17. En `src/clients/vscode/index.html`, añadir el mismo panel del paso 8. Resultado: el panel aparece en el webview.

18. En `src/clients/vscode/extension.js`, importar `usersGenderCount`. Añadir `handleGenderCount(webview, message)` con el patrón de `handleList`, que responde `postReply(webview, request, { count })`. En `handleMessage`, añadir `if (action === "genderCount")`. Resultado: `handleMessage` despacha `genderCount`.

19. En `src/clients/vscode/panel.js`, añadir `countGenders()` con `callExtension("genderCount")`, que lee `data.count`, y `showGenderCount(count)`. Usar los mismos pasos del plan. Registrar el botón en `initializeClient`. Resultado: el panel muestra los tres números.

## Documentación

20. En `docs/TREE.md`, bajo `electron/`, añadir `preload.cjs` después de `main.js`. En `docs/ARCHITECTURE.md`, el bloque de Electron describe `preload.cjs`, el canal `gender-count` y que el recuento no sigue el camino de `src/logic/` desde `app.js`. La línea de `eslint.config.js` declara `window` para `app.js`. Resultado: `grep preload` encuentra la entrada en los dos ficheros.

## Verificación

21. Con Ollama en marcha, pulsar el botón en Chrome (`pnpm chrome` y la extensión), en Electron (`pnpm electron`) y en VS Code (`pnpm vscode`). En Electron, abrir DevTools y comprobar que no hay errores de módulo. Resultado: en cada uno se ve «Cargando…» y luego los mismos tres números.

22. Con Ollama parado, pulsar el botón en los tres. Resultado: el aviso dice `Could not classify the users`, y el panel conserva el último resultado o la frase inicial.

23. Mientras cuenta, probar la lista, la búsqueda y el alta en Chrome, Electron y VS Code. Resultado: las tres siguen funcionando.

24. Comprobar con `git status` que solo cambian los ficheros de los pasos anteriores y `docs/specs/gender-count-clients/`. Las specs anteriores no tienen cambios. Resultado: `git status` no lista ningún otro `docs/specs/` ni `src/clients/terminal/`.

25. En `package.json`, añadir `"src/clients/**/*.cjs"` al final de los patrones del script `format`. Resultado: `node -e 'require("./package.json")'` no falla y el script lista el patrón nuevo. Después ejecutar `pnpm run format` y `pnpm run lint`. Resultado: sin errores, y `preload.cjs` queda formateado.
