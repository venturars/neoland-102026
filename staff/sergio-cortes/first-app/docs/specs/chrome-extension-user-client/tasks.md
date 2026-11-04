# Tareas — cliente de Chrome para usuarios

Issue: #973.

El paso 1 solo se ejecuta tras la aprobación de «Paquetes».

1. Desde `first-app`, ejecutar `pnpm add fastify@5.12.8 --save-exact`.
   `package.json` queda con `fastify` en `dependencies`, `5.12.8`, sin `^`.
   Cambia `pnpm-lock.yaml`. No se añade ninguna otra dependencia.

2. Abrir `pnpm-lock.yaml`.
   Las versiones de `fastify` y de sus dependencias, hasta 3 capas, son las del plan.
   Si una no coincide, se para y esa versión vuelve a Socket.
   No se instala otra versión para hacerla coincidir.

3. Abrir `package.json`. Añadir el script `chrome`: si nada escucha en
   `127.0.0.1:3000` (`nc -z`), arranca `src/db/server.js` en segundo plano y lo
   para al salir; después ejecuta `node src/clients/chrome/server.js`.
   No se tocan `server`, `web`, `http`, `electron`, `jupyter`, `format`, `lint` ni `test`.

4. Abrir `eslint.config.js`. Declarar `console` como global para
   `src/clients/chrome/server.js`. Declarar `document` y `fetch` como globales
   para `src/clients/chrome/popup.js`. No se cambian los bloques de `http/`, `web/` ni `electron/`.

5. Abrir `docs/STYLE.md`. La excepción de varias funciones en un fichero cubre
   también `src/clients/chrome/popup.js`. El resto de la guía no cambia.

6. Abrir `docs/ERRORS.md`. Añadir que `Body is invalid` e `Internal error`
   también los usa el cliente de Chrome, no solo el HTTP. No se añaden mensajes nuevos.

7. Copiar `src/clients/web/index.html` y `styles.css` a `src/clients/chrome/`.
   En `index.html`, el script apunta a `popup.js`. No se edita `src/clients/web/`.

8. Crear `src/clients/chrome/popup.js` a partir de `src/clients/web/app.js`.
   Las tres pantallas y el popover siguen. No importa `src/logic/`.
   Pide a `http://127.0.0.1:3002` con `fetch` y muestra el `error` del JSON.
   No hay alta de usuario. No se toca `src/clients/web/app.js`.

9. Crear `src/clients/chrome/server.js`, siguiendo `docs/STYLE.md` y el plan.
   Escucha en `127.0.0.1:3002` (`HOST`, `ORIGIN`, `PORT`) y escribe esa dirección con `console.log`.
   Las cinco rutas llaman a `src/logic/` como Express: 200, 200, 201, 200 y 200.
   `setErrorHandler` responde `{ error: message }` con los estados del plan. JSON mal formado: 400 `Body is invalid`.

10. Crear `src/clients/chrome/manifest.json`. Manifest V3. La acción abre
    `index.html` en el popup. `host_permissions` es `http://127.0.0.1:3002/*`.
    No hay content script.

11. Abrir `docs/TREE.md` y `docs/ARCHITECTURE.md`.
    Añadir `src/clients/chrome/` con `server.js`, `manifest.json`, `index.html`, `styles.css` y `popup.js`.
    Fastify llama a `src/logic/` en el puerto 3002. El popup solo habla con esa API.
    El script `chrome` arranca la base si el puerto 3000 está libre, como `http`.

12. `pnpm run format` y `pnpm run lint` sobre lo tocado.
    No cambia `src/logic/`, `src/queries/`, `src/db/` ni los otros clientes.

13. Desde `first-app`, `pnpm chrome`. Fastify queda en `http://127.0.0.1:3002`.
    Con curl, las cinco rutas: éxito, `Id is invalid`, `User not found`,
    `Email is already used`, `Name is empty` y `Body is invalid`.
    Cargar `src/clients/chrome/` en Chrome sin empaquetar. El popup muestra las tres pantallas; no hay alta. Un usuario creado por POST sale en la lista. No hay cliente `.txt` de terminal.
