# Plan: Base de datos en un servidor local

Implementa [spec.md](spec.md). Respeta [CONSTITUTIONS.md](../../CONSTITUTIONS.md) y sus guías. Sin paquetes nuevos ni cambios en la tabla, así que no hay validación de Socket.

## Cómo queda el camino de una operación
Hoy `queries/` importa la conexión y ejecuta el SQL en el mismo proceso. Con el cambio, entre `queries/` y `db/` hay una petición HTTP local:

```
clients (terminal, Jupyter)
   │ import
   ▼
src/logic/*                     igual que hoy, pero con await
   │ import
   ▼
src/queries/users.js            pide una consulta por su nombre con fetch
   │ POST http://127.0.0.1:4000/query   { "query": "selectAllUsers", "params": [] }
   ▼
src/db/server.js                busca ese nombre en src/queries/users-sql.js y lo ejecuta
   │ import
   ▼
src/db/connection.js  →  src/db/users.sqlite
```

`queries/users.js` ya no importa nada de Node: solo usa `fetch`, que existe en Node y en el navegador. Por eso `logic/` se podrá importar desde el navegador en la tarea siguiente.

## Ficheros
```
src/queries/users-sql.js            NUEVO: el texto SQL de cada consulta, por nombre
src/db/server.js                    NUEVO: abre la base y ejecuta las consultas por nombre
src/queries/users.js                pide las consultas al servidor; sus funciones pasan a ser async
src/logic/*.js                      await en cada llamada a queries; las funciones pasan a ser async
src/clients/terminal/*.txt          await en cada llamada a logic
src/clients/jupyter/*.ipynb         await en el código y una anotación de que hace falta la base
package.json                        script db
eslint.config.js                    console como global (cambio aprobado 1.1)
docs/ARCHITECTURE.md, docs/TREE.md, docs/DATABASE.md, docs/ERRORS.md, AGENTS.md
```
`src/db/connection.js` no cambia: sigue siendo la única conexión y crea la tabla. Ahora solo la importa `server.js`.

## Decisiones técnicas
| Tema | Decisión | Motivo |
|---|---|---|
| Servidor | `node:http` en `127.0.0.1:4000`. `HOST` y `PORT` son constantes | Viene con Node. Solo escucha en este equipo. El 3000 queda para el cliente de navegador |
| Arranque | `pnpm db`, que lanza `node --no-warnings src/db/server.js` y escribe `Database: http://127.0.0.1:4000`. Se para con Ctrl+C | Un solo comando. `--no-warnings` oculta el aviso de `node:sqlite`, como en la terminal |
| Qué recibe | Solo `POST /query` con `{ "query": "<nombre>", "params": [ ... ] }` | Se pide una consulta por su nombre, no se envía SQL |
| Qué ejecuta | Busca el nombre en `USER_QUERIES` con `Object.hasOwn` y ejecuta ese SQL con `prepare(sql).all(...params)` | No ejecuta SQL que le llegue de fuera: solo el que ya está escrito en `queries/`. `Object.hasOwn` evita que `toString` u otros nombres heredados cuenten como consulta |
| Una forma de respuesta | Siempre `all`, que devuelve una lista de filas. `queries/users.js` toma la primera cuando espera una sola | El servidor no necesita saber qué tipo de consulta es |
| Borrar | `DELETE ... RETURNING id`. `deleteUserById` devuelve `true` si la lista trae una fila | Con `all` no hay `changes`; la fila devuelta dice si se borró |
| Respuestas | Bien: 200 y `{ "rows": [ ... ] }`. Nombre desconocido: 404 y `{ "error": "Unknown query: <nombre>" }`. Cuerpo que no es JSON, o sin `query` de texto o sin `params` en lista: 400 y `{ "error": "Invalid request." }`. Otra ruta u otro método: 404 y `{ "error": "Not found." }`. Fallo de SQLite: 500 y `{ "error": "<mensaje de SQLite>" }` | `queries/` lanza ese `error` tal cual, igual que hoy deja pasar los fallos de SQLite |
| Base parada | Si `fetch` no conecta, `queries/users.js` lanza `Database is not running. Start it with pnpm db.` con el error original en `cause` | Sin esto se vería `Error: fetch failed`, que no dice qué hacer. Es el único mensaje que decide `queries/`; va en [ERRORS.md](../../ERRORS.md) y [ARCHITECTURE.md](../../ARCHITECTURE.md) lo dice |
| Dónde está el SQL | En `src/queries/users-sql.js`, que solo exporta `USER_QUERIES`: un objeto con un texto SQL por nombre. Lo importa `db/server.js` | El SQL sigue solo en `queries/` (principio 1). El servidor importa textos, no llama a funciones de `queries/` |
| Dirección | `queries/users.js` tiene la constante `DATABASE_URL = "http://127.0.0.1:4000/query"` | Si cambia el puerto, se cambia en `server.js` y aquí |
| Async | Las funciones de `queries/users.js` y de `logic/` pasan a ser `async` y se llaman con `await`. Los clientes también usan `await` | `fetch` es asíncrono. Los comandos ya son módulos, así que `await` funciona fuera de una función |
| Lo que devuelve cada función | Igual que hoy: `queries/` devuelve la fila, `undefined`, la lista o `true`/`false`, y `logic/` los mismos objetos en camelCase | Los clientes y los errores no cambian |
| Estilo | El de [STYLE.md](../../STYLE.md) | Igual que el resto del código |

## `src/queries/users-sql.js`
Comentario inicial con su responsabilidad y un objeto:

```js
export const USER_QUERIES = {
  insertUser: "INSERT INTO users (name, email) VALUES (?, ?) RETURNING *",
  selectUserByEmail: "SELECT * FROM users WHERE email = ?",
  selectAllUsers: "SELECT * FROM users ORDER BY id",
  selectUsersByName: "SELECT * FROM users WHERE name = ? ORDER BY id",
  updateUserById: "UPDATE users SET ... WHERE id = ? RETURNING *", // el mismo SQL de hoy
  deleteUserById: "DELETE FROM users WHERE id = ? RETURNING id",
};
```
Los comentarios que hoy explican el SQL (`RETURNING *`, `COALESCE`, los `?`) se mueven con él.

## `src/queries/users.js`
1. `runQuery(queryName, params)`: hace el `fetch`, lanza `Database is not running. Start it with pnpm db.` si no conecta, lanza `data.error` si la respuesta no es 200 y devuelve `data.rows`.
2. Las seis funciones de hoy, con el mismo nombre y los mismos parámetros, ahora `async`. Cada una llama a `runQuery` y devuelve lo mismo que hoy.

## `src/db/server.js`
1. Comentario inicial con su responsabilidad.
2. Importa `createServer` de `node:http`, `connection` de `./connection.js` y `USER_QUERIES` de `../queries/users-sql.js`.
3. `sendJson(response, status, data)` y `readBody(request)`, que junta los trozos del cuerpo y devuelve el texto.
4. `handleRequest(request, response)`: comprueba la ruta y el método, lee el cuerpo, lo comprueba, busca la consulta y la ejecuta. Cada caso responde como dice la tabla.
5. `createServer(handleRequest).listen(PORT, HOST)` y escribe la dirección.

## Clientes
- **Terminal:** cada llamada a `logic` lleva `await` delante. Lo demás del `.txt` no cambia.
- **Jupyter:** el código de Node lleva `await` en la llamada. En Anotaciones, una línea nueva al principio: `⚠️ Necesita la base en marcha: pnpm db desde first-app/.` Las salidas guardadas no se tocan.

## Riesgos
- Si `pnpm db` se olvida, todo falla. El mensaje lo dice y `AGENTS.md` lo explica.
- El principio 1 dice "solo `queries/` contiene SQL y toca la base de datos". El SQL sigue solo en `queries/` y es `queries/` quien decide qué consulta se hace, pero quien la ejecuta ahora es `db/server.js`. Con el texto actual se cumple si "tocar la base" se lee como decidir qué se hace en ella. Este plan no cambia la constitución.

## Cambios aprobados
| Versión | Fecha | Cambio | Motivo |
|---|---|---|---|
| 1.1 | 2026-11-03 | `eslint.config.js` añade `console` a las globales del bloque general | `server.js` escribe su dirección con `console.log` y `pnpm lint` daba `'console' is not defined`. Es la misma línea que añade #768 |
