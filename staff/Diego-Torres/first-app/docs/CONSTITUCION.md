# Constitución — first-app

Si una tarea y esta constitución chocan, gana la constitución.

## Quién sabe qué

| Carpeta o fichero | Qué sabe |
| --- | --- |
| `logic/user.js` | Qué es un nombre y un email válidos |
| `logic/create-user.js` y el resto, un fichero por operación | Crear, actualizar, eliminar y las tres lecturas |
| `logic/errors.js` | Los tres errores |
| `logic/index.js` | Reexporta la lógica. No exporta SQLite |
| `queries/queries/*.sql` | Las frases SQL, una por fichero. `create-users-table.sql` es la tabla `users` |
| `queries/users.js` | El almacén de verdad |
| `db/connection.js` | La única conexión, a `db/users.sqlite` |
| `test/memory-store.js` | El doble de las pruebas |
| `test/users.test.js` | Las pruebas |
| `ejemplo.js` | Une lógica y SQLite y hace `console.log` |
| `clients/terminal/*.txt` | Un cliente por operación. Se pega en la terminal, le pasa el almacén y hace `console.log` |
| `logic/users-gender-count.js` | Cuenta usuarios por género del nombre. No guarda nada |
| `clients/jupyter/*.ipynb` | Cliente que abre Jupyter y llama a las operaciones |


## Base de datos

`db/` solo tiene dos cosas: `connection.js` y `users.sqlite`. No hay esquema, SQL ni almacén en esa carpeta.

`db/connection.js` abre `db/users.sqlite` con `node:sqlite` y exporta `db`. Es la única conexión al fichero. No se abre otra base ni otra conexión para ese fichero. Las pruebas no importan `connection.js`: le pasan a `queries/users.js` una conexión en `:memory:`.

`queries/users.js` recibe esa conexión ya abierta. Ejecuta `queries/queries/create-users-table.sql` y prepara el resto de `.sql`.

Tabla `users`:

- `id` es `INTEGER PRIMARY KEY`. SQLite lo incrementa solo.
- `name` es `TEXT NOT NULL`.
- `email` es `VARCHAR(64) NOT NULL UNIQUE`.
- `createdAt` y `updatedAt` son `TEXT NOT NULL`. La fecha es `YYYY-MM-DD HH:MM:SS`, la de `datetime('now', 'localtime')`.

## Usuario

Un usuario guardado es `{ id, nombre, email }`.

- `id` es texto (`"1"`, `"2"`). SQLite guarda el entero y `queries/users.js` lo devuelve como texto.
- `nombre` es la columna `name`.
- `email` es la columna `email`.
- `createdAt` y `updatedAt` no forman parte del usuario.

Para crearlo hacen falta los dos campos. El nombre se recorta y no puede quedar vacío. El email se recorta, pasa a minúsculas y tiene la forma texto, una `@` y un punto en el dominio, sin espacios.

Para cambiarlo hace falta el nombre, el email o los dos. El que no llega no se toca. El nombre que llega se recorta y no puede quedar vacío. El email que llega se normaliza igual que al crear.

El email es único. Lo decide `logic` mirando el almacén. El `UNIQUE` de la tabla cierra la base; no es la regla que se lee para decidir.

## Almacén

Cualquier almacén ofrece estas funciones `async` y ninguna regla:

- `save(user)` devuelve la copia con `id`. Sin `id` inserta. Con `id` actualiza.
- `findById(id)` devuelve la copia o `null`.
- `findByEmail(email)` devuelve la copia o `null`.
- `findByName(name)` devuelve un array de copias con ese nombre.
- `findAll()` devuelve un array de copias.
- `remove(id)` indica si existía.

`queries/users.js` es el almacén de verdad. `test/memory-store.js` es solo el doble de las pruebas. Un almacén nuevo es un fichero nuevo. No se reescribe SQLite para simular memoria.

## Operaciones

Cada operación es un fichero de `logic/`. Estas funciones reciben el almacén como primer argumento:

- `createUser(store, data)`
- `updateUser(store, id, changes)`
- `deleteUser(store, id)`
- `findUserById(store, id)`
- `listUsers(store)`
- `findUserByEmail(store, email)`
- `findUserByName(store, name)`

`usersGenderCount(store)` vive en `logic/users-gender-count.js`. No es una de las operaciones de usuarios. Devuelve `{ women, men, genderUndefined }`. Si no hay usuarios, los tres números son 0 y no llama a la IA.

El orden interno es siempre el mismo: primero lo que se decide con los datos en la mano, después lo que mira el almacén, después guardar o borrar, al final la copia de salida.

## Errores

Solo estas tres clases. No se añaden clases ni mensajes.

- `InvalidData`: `Name is required`
- `InvalidData`: `Email is invalid`
- `InvalidData`: `A name or an email is required`
- `DuplicateEmail`: `Email <email> is already registered`
- `UserNotFound`: `There is no user with id <id>`

`InvalidData` lo lanza `logic/user.js`. `DuplicateEmail` y `UserNotFound` los lanzan las operaciones.

`No se han podido clasificar los usuarios` lo lanza `logic/users-gender-count.js` si el almacén no se puede leer o la llamada a la IA falla. No es una de las tres clases.

## Qué no entra

HTTP y frontend no se añaden. Jupyter llama a las operaciones que ya existen. No copia la regla de que el email es único.
