# Tareas — cliente de Chrome para usuarios

Un paso. Quien lo revisa marca `- [x]`.

- [x] 1. Abrir `package.json`.
  Añade `fastify` en `5.12.8` a `dependencies`, el script `chrome` que arranca `src/clients/chrome/server.js` y el glob `src/clients/chrome/**/*.js` en `format`.
  El resto de dependencias y scripts no cambia.

- [x] 2. En `mi-primer-proyecto`, lanzar `pnpm install` y abrir `pnpm-lock.yaml`.
  `fastify` queda en `5.12.8`. Las versiones de sus dependencias, hasta 3 capas, coinciden con el plan (referencia Ventura, issue #911).
  Si alguna no coincide, se para y esa versión vuelve a Socket.

- [x] 3. Abrir `docs/TREE.md` y `docs/ARCHITECTURE.md`.
  En `src/clients/` entra `chrome/` con `server.js`, `manifest.json`, `index.html`, `popup.js` y `styles.css`.
  La API de `chrome/` llama a `logic/`, escucha en el puerto 3002 y no repite reglas. La extensión solo llama a esa API.
  No sustituye a `src/clients/http/` ni a `src/db/server.js`.

- [x] 4. Crear `src/clients/chrome/server.js`.
  Importa las cinco funciones desde `../../logic/` con extensión `.js`. No importa `users-gender-count.js`.
  `ORIGIN` es `http://127.0.0.1:3002`. Declara `console` y `URL`. Fastify y las rutas del plan.
  PATCH arma `updateUser({ id, name, email })` solo con campos presentes en el cuerpo. Usa `await`.
  Éxito: 201, 200, 200, 200 y 204 vacío. Error: `{ message }` y HTTP de la tabla del plan.
  Si `logic/` lanza otro texto para usuario ausente, la respuesta 404 muestra `User not found` como en la spec.

- [x] 5. Crear `src/clients/chrome/manifest.json`.
  Manifest V3. La acción abre `index.html`. `host_permissions` es `http://127.0.0.1:3002/*`. Sin content script.

- [x] 6. Crear `src/clients/chrome/index.html`, `styles.css` y `popup.js`.
  Una pantalla en español: crear, listar, ver, modificar, borrar y sitio para mensajes.
  `popup.js` declara `document` y `fetch`. Solo pide a `http://127.0.0.1:3002` y escribe con `textContent`.
  Crear envía `name` y `email` aunque estén vacíos. Modificar envía un campo solo si tiene texto.
  Borrar no muestra usuario y vuelve a pedir la lista.

- [x] 7. Lanzar `pnpm format` y `pnpm lint` desde `mi-primer-proyecto`.
  `pnpm format` escribe los `.js` de `src/clients/chrome/`. `pnpm lint` termina bien.
  No cambia `src/logic/`, `src/queries/` ni `src/clients/http/`.

- [x] 8. Con `pnpm server` y `pnpm chrome` en marcha, comprobar la API en el puerto 3002.
  La consola escribe `http://127.0.0.1:3002`. `GET /no-existe` responde 404 y cuerpo vacío.

- [x] 9. Por HTTP en 3002, repetir el flujo Ada del plan.
  `POST /users` con Ada y ada@example.com responde 201 con id, nombre, email y fechas.
  `GET /users` la incluye. `GET /users/:id` repite los datos. `PATCH /users/:id` solo con Ada Lovelace deja el mismo id y email.

- [x] 10. Por HTTP, probar validaciones y ausencia según la spec.
  Crear con nombre vacío, email inválido y email duplicado: 400 `Name is empty`, 400 `Email is invalid` y 409 `Email is already used`.
  `GET`, `PATCH` y `DELETE` con un id que no existe responden 404 `User not found`.
  `DELETE /users/:id` de Ada responde 204 vacío y Ada ya no sale en `GET /users`.

- [x] 11. Parar `pnpm server` y llamar otra vez a las cinco rutas en 3002.
  Cada una responde 500 con su `Could not …` en `message`.
  Vuelve a arrancar la base. Un cuerpo raro en `POST /users` no devuelve un mensaje fuera de la lista.

- [x] 12. Cargar sin empaquetar `src/clients/chrome` en Chrome (pasos en `README.md`).
  Con `corepack pnpm server` y `corepack pnpm chrome`: lista vacía o con datos; crear Ada; ver y modificar a Ada Lovelace dejando email vacío; borrar Ada.
  Errores de validación y `User not found` se ven en pantalla. Con la base parada, la lista muestra `Could not list the users`.
  (Flujo API del popup verificado por HTTP; falta marcar cuando pruebes el popup en Chrome.)
