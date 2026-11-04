# Plan — cliente del navegador

Issue: #864.

Incluye el servidor SQL en Node que exige la referencia del curso, porque
hoy `src/queries/users.js` usa SQLite en proceso y el navegador no puede
importarlo con `file://`. No hay paquete npm nuevo. No entra Socket.

Patrón: `staff/ventura-rodriguez/first-app/docs/specs/host-sql-on-node-server/`
y `browser-client/`. Las firmas de `logic/` siguen
`docs/CONSTITUTIONS.md` de mi-primer-proyecto (`updateUser({ id, name,
email })`, `deleteUser({ id })`, etc.). Las funciones pasan a `async` y
los clientes terminal y Jupyter esperan con `await`. No se importa
`users-gender-count.js` en el browser.

`src/db/server.js` escucha en `http://127.0.0.1:3000`. Script `server`.
`src/queries/users.js` ejecuta SQL vía `fetch` al servidor. El SQL sigue
en módulos bajo `src/queries/queries/` (como Ventura).

Browser: `index.html`, `app.js`, `styles.css` en `src/clients/browser/`.
`type="module"`, importa `listUsers`, `updateUser` y `deleteUser` desde
`../../logic/`. Tres pantallas; texto visible en español. Botón notas
desactivado. Script `browser` en `package.json`: en Windows abre Chrome
con perfil en `%TEMP%` y `--allow-file-access-from-files` hacia el
`file://` de `index.html` (como Jimena en first-app).

## Ficheros

Crean: `src/db/server.js`, `src/clients/browser/index.html`,
`src/clients/browser/app.js`, `src/clients/browser/styles.css` y los
módulos `.js` de consulta que pida el plan de referencia host-sql.

Tocan: `src/queries/users.js`, ficheros de `src/logic/`, clientes
terminal y Jupyter que llamen a `logic/`, `package.json`,
`docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/DATABASE.md`.

## Errores

Los de la spec; mensajes en `docs/ERRORS.md`. El browser muestra
`error.message` en pantalla. Un solo `tasks.md` cubre host-sql y browser.
