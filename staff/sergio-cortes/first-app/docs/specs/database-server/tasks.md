# Tareas — servidor de la base de usuarios

Issue: #827.

1. Abre [package.json](../../../package.json). Añade el script `"server":
   "node src/db/server.js"`. No cambies `start`, `jupyter`, `format`, `lint` ni
   `test`.

2. Crea [src/db/server.js](../../../src/db/server.js) y borra
   [src/db/connections.js](../../../src/db/connections.js). El servidor abre
   `users.sqlite`, lee cada `.sql` de
   [src/queries/queries/](../../../src/queries/queries/) por su nombre de
   fichero, escucha en `127.0.0.1:3000`, atiende
   `POST /execute` con `{ method, file, params }` y ejecuta `exec`, `get`,
   `all` o `run` como indica el plan. Si `get` no devuelve fila, o si `exec`
   termina, responde JSON `null`. `OPTIONS` y las respuestas JSON permiten el
   origen de la página.

3. Abre [src/queries/user.js](../../../src/queries/user.js). Quita
   `readFileSync` y la conexión. Cada export pasa a `async` y hace `POST`
   `http://127.0.0.1:3000/execute` con el mismo cuerpo que el plan.
   `createUsersTable` usa `exec`. `createUsersTable`
   ya no recibe la base. Si el cuerpo es `null`, devuelve `undefined`. Si la
   respuesta no es correcta, lanza.

4. Abre los ocho ficheros de [src/logic/](../../../src/logic/). Cada función
   exportada pasa a `async`. Dentro de cada `try` que llama a una query, usa
   `await`. Nombre, parámetros, reglas y mensajes de error no cambian.

5. Abre cada `.txt` de [src/clients/terminal/](../../../src/clients/terminal/).
   La llamada a `logic/` o a `createUsersTable` lleva `await`. En
   `create-user-table.txt`, quita el import de la conexión; solo importa
   `createUsersTable` y haz `await createUsersTable()`.

6. Abre cada cuaderno de [src/clients/jupyter/](../../../src/clients/jupyter/).
   Deja el bloque de Node igual que el `.txt` del mismo nombre.

7. Abre [docs/DATABASE.md](../../DATABASE.md), [docs/ARCHITECTURE.md](../../ARCHITECTURE.md),
   [docs/TREE.md](../../TREE.md) y [docs/CONSTITUTIONS.md](../../CONSTITUTIONS.md).
   Actualiza lo que dice el plan: `server.js`, `pnpm server`, queries por HTTP
   y `logic/` en promesa.

8. Desde `first-app`, en una terminal ejecuta `pnpm server`. Debe quedar
   escuchando en `127.0.0.1:3000`. No arranques `pnpm start`.

9. En otra terminal, desde `first-app`, pega cada cliente de
   [src/clients/terminal/](../../../src/clients/terminal/). El resultado debe
   ser el mismo que antes del refactor.

10. Desde `first-app`, ejecuta `pnpm run format` y `pnpm run lint`. Corrige
    hasta que lint termine sin errores.
