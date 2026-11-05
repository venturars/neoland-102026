# Cómo funcionan el navegador y el servidor de datos

Esta guía recorre el código del cliente web y del servidor de datos. Las rutas parten de la raíz de `first-app`.

## 1. Por qué existe el servidor de datos

El navegador solo entiende JavaScript estándar: `import`, `fetch`, el DOM. No tiene los módulos de Node, como `node:fs` (leer archivos del disco) o `node:sqlite` (abrir SQLite).

Antes, la cadena era así:

```text
src/logic/create-user.js
  └─ import src/queries/users.js
       ├─ import { readFileSync } from "node:fs"        ← leía los .sql del disco
       └─ import src/db/connection.js
            └─ import { DatabaseSync } from "node:sqlite"  ← abría la base
```

Basta con que un archivo de la cadena importe algo de Node para que el navegador no pueda importar ninguno de los de arriba. Por eso la web no podía usar `src/logic/` y tenía que pedirlo todo al cliente HTTP con `fetch("/api/users")`. Si el HTTP cambiaba o no estaba arrancado, la web se rompía. Una vez resuelto, el cliente HTTP dejó de hacer falta y se eliminó.

Ahora SQLite vive en un proceso aparte, `src/db/server.js`, y la cadena no toca Node:

```text
src/logic/create-user.js
  └─ import src/queries/users.js
       ├─ import { INSERT_USER } from "./queries/insert.js"  ← SQL como texto en JavaScript
       └─ fetch("http://127.0.0.1:3000/execute")             ← pide al servidor que lo ejecute
```

`import` y `fetch` existen en Node y en el navegador, así que la misma lógica funciona en terminal, Jupyter y en Chrome.

## 2. Por qué las consultas pasan de `.sql` a `.js`

Un `.sql` es texto plano. Para usarlo había que leerlo del disco con `readFileSync`, que es de Node. Un navegador no puede leer archivos sueltos así.

Un `.js` que exporta el texto, en cambio, se trae con `import`, que existe en todas partes:

```js
// src/queries/queries/find-by-id.js
export const FIND_USER_BY_ID = `SELECT id, name, email, created_at, updated_at
FROM users
WHERE id = :id;`;
```

El SQL no cambia: solo cambia el envoltorio. Sigue habiendo un archivo por consulta y los parámetros siguen siendo con nombre (`:id`), así que los datos del usuario nunca se pegan dentro del SQL.

## 3. Qué hace cada capa

| Capa              | Archivo                                     | Qué hace                                                                               |
| ----------------- | ------------------------------------------- | -------------------------------------------------------------------------------------- |
| Cliente           | `src/clients/web/app.js`, terminal, Jupyter | Recoge datos, llama a una función de la lógica y presenta el resultado o el error.     |
| Lógica            | `src/logic/*.js`                            | Valida, normaliza y aplica las reglas. Llama a las consultas con `await`.              |
| Consultas         | `src/queries/users.js`                      | Envía el SQL y sus parámetros al servidor con `execute()` y devuelve las filas.        |
| Servidor de datos | `src/db/server.js`                          | Recibe `{ method, sql, params }` y lo ejecuta en SQLite. Es el único que abre la base. |

Como todos los clientes pasan por el mismo servidor, todos ven la misma base al mismo tiempo. No hay nada que sincronizar: hay una sola copia de los datos.

### Por qué todo pasa a ser `async`

`fetch` no devuelve la respuesta al momento, devuelve una promesa. Por eso las funciones de consultas y de lógica son `async`, y quien las llama escribe `await`:

```js
const user = await createUser("Ada", "ada@example.com");
```

Sin `await`, `user` sería una promesa y no el usuario. Por eso los ejemplos de terminal, el puente de Jupyter y los dos clientes esperan cada llamada.

## 4. El servidor de datos

`src/db/server.js` escucha en `127.0.0.1:3000` y solo tiene `POST /execute`:

| `method` | Para qué          | Ejemplo de uso en `users.js`                   |
| -------- | ----------------- | ---------------------------------------------- |
| `exec`   | SQL sin resultado | `createUsersTable()`                           |
| `get`    | Una fila          | `findUserById(id)`                             |
| `all`    | Todas las filas   | `listUserRows()`                               |
| `run`    | Escribir          | `insertUser`, `updateUserRow`, `deleteUserRow` |

- Un fallo de SQLite o un JSON roto responde `500` sin cuerpo. `users.js` lanza `Query failed` y la lógica lo cambia por su error (`Unable to create user`, etc.), así que nadie ve el mensaje interno de SQLite.
- Responde a `OPTIONS` y añade `access-control-allow-origin: *`. La página se abre desde `file://` y Chrome le da el origen `null`; sin esa cabecera bloquearía la respuesta.
- Crea la tabla `users` al arrancar.
- Ejecuta el SQL que le llega. Es aceptable solo porque escucha en `127.0.0.1`: nadie fuera del equipo puede alcanzarlo.

## 5. El cliente de navegador

La carpeta tiene tres archivos: `index.html`, `styles.css` y `app.js`. Se abre con `pnpm run web`, que lanza Chrome con `--allow-file-access-from-files`: sin esa opción, Chrome no deja que una página de `file://` importe otros archivos `.js`, como `../../logic/create-user.js`.

`index.html` enlaza `./styles.css` y `./app.js` con rutas relativas, para que funcionen desde `file://`. Las pantallas son tres secciones del mismo documento:

| Pantalla  | Qué hay                                                                      | Funciones de `app.js`                              |
| --------- | ---------------------------------------------------------------------------- | -------------------------------------------------- |
| Selección | Lista con id, nombre y email, «Continuar» y el formulario «Crear usuario».   | `loadUserSelection`, `selectUser`, `createNewUser` |
| Menú      | Usuario elegido, «Modificar usuario», «Ir a notas» (deshabilitada) y volver. | `showUserMenu`, `navigate`                         |
| Edición   | Nombre, email, guardar, volver sin guardar y eliminar con confirmación.      | `openUserEditor`, `saveUser`, `deleteSelectedUser` |

Las funciones de apoyo son `showScreen` (muestra una sección y lleva el foco a su encabezado), `showMessage` (pinta el mensaje con `textContent`, nunca como HTML), `setDisabled` (bloquea controles mientras se espera) y `translateError` (cambia el mensaje de la lógica por la frase en español de `MESSAGES`).

`STATE` guarda en memoria el usuario elegido y si hay una operación en curso. Recargar la página vuelve a la selección; los datos siguen en la base.

### Recorrido de «Guardar cambios»

1. El formulario lanza `submit` y `saveUser` evita que la página se recargue.
2. Lee nombre y email, bloquea los controles y llama a `await updateUser(id, { name, email })`.
3. `updateUser` valida y normaliza, y llama a `await findUserById`, `findUserByEmail` y `updateUserRow` de `src/queries/users.js`.
4. Cada consulta hace `fetch` a `/execute` y el servidor de datos ejecuta el `UPDATE` o el `SELECT` en SQLite.
5. La lógica devuelve el usuario saneado. `saveUser` lo guarda en `STATE`, muestra el menú y anuncia «Datos guardados».
6. Si algo falla, el `catch` muestra la frase traducida y el formulario conserva lo escrito. `finally` desbloquea los controles.

## 6. Pruebas

- `tests/database-server.test.js`: el servidor de datos con una base temporal, sus cuatro `method` y sus respuestas `404` y `500` sin detalles.
- `tests/shared-database.test.js`: lo creado desde otro proceso, como un ejemplo de terminal, aparece en `listUsers()` (el camino de la web); lo guardado con `updateUser()` lo encuentra ese otro proceso; y con el servidor parado, `listUsers()` falla con `Unable to list users`.

Esta última arranca su servidor de datos temporal en el `3000`, porque `src/queries/users.js` siempre pregunta ahí. Si el servidor real está arrancado, falla al escuchar y no envía ninguna consulta: la base real nunca se toca. `pnpm test` las ejecuta de una en una.
