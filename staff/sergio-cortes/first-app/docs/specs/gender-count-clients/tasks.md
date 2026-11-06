Issue: #1155.

# Tareas — recuento de género en los clientes

Pasos en el orden en que los haría una persona. Ninguno toca `src/logic/`, `src/queries/` ni `src/db/`. Ningún paso instala paquetes. Ninguno crea un `.txt` en `src/clients/terminal/`.

Pregunta P1 del plan: se aplica la recomendación aprobada. Cualquier fallo del recuento muestra `Could not classify the users`.

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

11. En `src/clients/electron/index.html`, añadir el mismo panel del paso 8. Resultado: la ventana muestra el panel con la frase inicial.

12. En `src/clients/electron/app.js`, importar `usersGenderCount` de `../../logic/user-gender-count.js`. Añadir `countGenders()`, con `await usersGenderCount()`, y `showGenderCount(count)`. Registrar el botón en `initializeClient`. Resultado: el botón muestra los tres números.

## VS Code

13. En `src/clients/vscode/index.html`, añadir el mismo panel del paso 8. Resultado: el panel aparece en el webview.

14. En `src/clients/vscode/extension.js`, importar `usersGenderCount`. Añadir `handleGenderCount(webview, message)` con el patrón de `handleList`, que responde `postReply(webview, request, { count })`. En `handleMessage`, añadir `if (action === "genderCount")`. Resultado: `handleMessage` despacha `genderCount`.

15. En `src/clients/vscode/panel.js`, añadir `countGenders()` con `callExtension("genderCount")`, que lee `data.count`, y `showGenderCount(count)`. Usar los mismos pasos del plan. Registrar el botón en `initializeClient`. Resultado: el panel muestra los tres números.

## Verificación

16. Con Ollama en marcha, pulsar el botón en Chrome (`pnpm chrome` y la extensión), en Electron (`pnpm electron`) y en VS Code (`pnpm vscode`). Resultado: en cada uno se ve «Cargando…» y luego los mismos tres números.

17. Con Ollama parado, pulsar el botón en los tres. Resultado: el aviso dice `Could not classify the users`, y el panel conserva el último resultado o la frase inicial.

18. Mientras cuenta, probar la lista, la búsqueda y el alta en Chrome, Electron y VS Code. Resultado: las tres siguen funcionando.

19. Comprobar con `git status` que no cambian `docs/TREE.md`, `docs/ARCHITECTURE.md` ni `src/clients/terminal/`, y que las specs anteriores no tienen cambios. Resultado: solo aparecen los ficheros de los pasos anteriores y `docs/specs/gender-count-clients/`.

20. Ejecutar `pnpm run format` y `pnpm run lint`. Resultado: sin errores.
