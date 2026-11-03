# Tareas — lógica en el cliente con la base en un servidor

1. Crea `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/DATABASE.md`, `docs/ERRORS.md` y `docs/STYLE.md` con el contenido de «Docs» del plan.
   Reescribe `docs/CONSTITUCION.md` como índice de esas guías, con las reglas SDD, los paquetes y «Qué no entra».
   Cada guía dice el usuario `{ id, name, email, createdAt, updatedAt }` y los mensajes nuevos.

2. Abre `AGENTS.md`.
   Apunta a las guías nuevas en lugar de repetirlas. «Estilo» pasa a `docs/STYLE.md`.
   Avisa de que `pnpm start` tiene que estar en marcha para cualquier cliente.

3. Crea un `.js` en `src/queries/queries/` por cada `.sql`, con el mismo nombre.
   Cada uno exporta una constante en mayúsculas con el mismo texto SQL.
   Borra los `.sql`.

4. Crea `src/db/execute-sql.js`, `src/db/serve-file.js` y `src/db/server.js`.
   `/execute` atiende `exec`, `get`, `all` y `run`. Cualquier otra cosa da 500 con el cuerpo vacío. No hay cabeceras CORS.
   `serveFile` solo sirve `.html`, `.css` y `.js` de la tabla del plan, y la ruta resuelta tiene que quedar dentro de su carpeta.
   Al arrancar se ejecuta `CREATE_USERS_TABLE` y se escribe `First App: http://127.0.0.1:3000`.

5. Reescribe `src/queries/users.js`.
   `execute(method, sql, params)` hace `fetch` a `ORIGIN + "/execute"` y lanza un `Error` si `response.ok` es falso.
   Exporta `createUsersTable`, `findAll`, `findById`, `findByEmail`, `findByName`, `insert`, `update` y `remove`.

6. Abre `src/logic/shared.js`.
   `validateName` lanza `Name is empty` y `validateEmail` lanza `Email is invalid`.
   Quita `A name or an email is required`.

7. Reescribe las operaciones de `src/logic/` con las firmas del plan, sin `store`.
   Cada llamada a `queries` va en su `try` y su fallo da el `Could not …` de esa operación. Los errores de reglas se lanzan fuera del `try`.
   La salida es `{ id, name, email, createdAt, updatedAt }`. Actualiza `index.js`.

8. Abre `src/logic/users-gender-count.js`.
   `usersGenderCount()` llama a `findAll` de `queries` y lee `name`.
   Si falla la base o la IA, lanza `Could not classify the users`.

9. Borra `src/clients/http/`.
   En `src/clients/web/`, cada módulo importa su operación de `/logic/<fichero>.js` y deja de usar `fetch("/api/…")`.
   Usa `name` y `error.message`. Las pantallas no cambian.

10. Reescribe `src/clients/terminal/*.txt`.
    Sin `db` ni `createSqliteStore`, con `name`. `create-users-table.txt` llama a `createUsersTable`.
    El comentario avisa de que antes hay que lanzar `pnpm start`.

11. Reescribe el código de `src/clients/jupyter/*.ipynb`, igual que la terminal.
    Las tablas muestran `id`, `name`, `email`, `createdAt` y `updatedAt`.
    La celda markdown avisa de que antes hay que lanzar `pnpm start`.

12. Abre `package.json` y `eslint.config.js`.
    `start` es `node src/db/server.js`. `format` ya no nombra `src/clients/http/`.
    `fetch` es un global para `src/queries/**/*.js`.

13. En `first-app`, ejecuta `pnpm format` solo sobre los ficheros tocados y luego `pnpm lint`.
    Lint termina sin errores.

14. Lanza `pnpm start` y recorre la comprobación del plan.
    Terminal, web y los `curl` de seguridad dan lo que dice el plan.
