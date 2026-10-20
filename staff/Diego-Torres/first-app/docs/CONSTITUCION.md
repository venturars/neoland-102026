# Constitución — first-app

Si una tarea y esta constitución chocan, gana la constitución.

## Quién sabe qué

| Carpeta o fichero | Qué sabe |
| --- | --- |
| `logic/usuario.js` | Qué es un nombre y un email válidos |
| `logic/operaciones.js` | Crear, actualizar, eliminar y las tres lecturas |
| `logic/errores.js` | Los tres errores |
| `logic/index.js` | Reexporta la lógica. No exporta SQLite |
| `queries/*.sql` | Las frases SQL, una por fichero. `queries/esquema.sql` es la tabla `users` |
| `queries/sqlite.js` | El almacén de verdad |
| `db/connection.js` | La única conexión, a `db/users.sqlite` |
| `test/almacen-memoria.js` | El doble de las pruebas |
| `test/usuarios.test.js` | Las pruebas |
| `ejemplo.js` | Une lógica y SQLite y hace `console.log` |


## Base de datos

`db/` solo tiene dos cosas: `connection.js` y `users.sqlite`. No hay esquema, SQL ni almacén en esa carpeta.

`db/connection.js` abre `db/users.sqlite` con `node:sqlite` y exporta `db`. Es la única conexión al fichero. No se abre otra base ni otra conexión para ese fichero. Las pruebas no importan `connection.js`: le pasan a `queries/sqlite.js` una conexión en `:memory:`.

`queries/sqlite.js` recibe esa conexión ya abierta. Ejecuta `queries/esquema.sql` y prepara el resto de `.sql`.

Tabla `users`:

- `id` es `INTEGER PRIMARY KEY`. SQLite lo incrementa solo.
- `name` es `TEXT NOT NULL`.
- `email` es `VARCHAR(64) NOT NULL UNIQUE`.
- `createdAt` y `updatedAt` son `TEXT NOT NULL`. La fecha es `YYYY-MM-DD HH:MM:SS`, la de `datetime('now', 'localtime')`.

## Usuario

Un usuario guardado es `{ id, nombre, email }`. El `id` lo asigna el almacén como texto (`"1"`, `"2"`). SQLite guarda un entero y `queries/sqlite.js` lo devuelve como texto. Traduce `name` a `nombre`. `createdAt` y `updatedAt` no salen del almacén.

- Nombre: texto recortado. Vacío no vale.
- Email: minúsculas y forma `algo@algo.algo`.
- Email único: lo decide `logic`, mirando el almacén. El `UNIQUE` del esquema cierra la tabla. No es la regla que se lee aquí para decidir.

## Almacén

Cualquier almacén ofrece estas funciones `async` y ninguna regla:

- `guardar(usuario)` devuelve la copia con `id`. Sin `id` inserta. Con `id` actualiza.
- `buscarPorId(id)` devuelve la copia o `null`.
- `buscarPorEmail(email)` devuelve la copia o `null`.
- `listar()` devuelve un array de copias.
- `borrar(id)` indica si existía.

`queries/sqlite.js` es el almacén de verdad. `test/almacen-memoria.js` es solo el doble de las pruebas. Un almacén nuevo es un fichero nuevo. No se reescribe SQLite para simular memoria.

## Operaciones

Las seis funciones de `logic/operaciones.js` reciben el almacén como primer argumento:

- `crearUsuario(almacen, datos)`
- `actualizarUsuario(almacen, id, cambios)`
- `eliminarUsuario(almacen, id)`
- `obtenerUsuario(almacen, id)`
- `listarUsuarios(almacen)`
- `buscarUsuarioPorEmail(almacen, email)`

El orden interno es siempre el mismo: primero lo que se decide con los datos en la mano, después lo que mira el almacén, después guardar o borrar, al final la copia de salida.

## Errores

Solo estas tres clases. No se añaden clases ni mensajes.

- `DatosInvalidos`: `El nombre es obligatorio`
- `DatosInvalidos`: `El email no es válido`
- `DatosInvalidos`: `Hay que indicar un nombre o un email`
- `EmailDuplicado`: `El email <email> ya está registrado`
- `UsuarioNoEncontrado`: `No existe un usuario con id <id>`

`DatosInvalidos` lo lanza `logic/usuario.js`. `EmailDuplicado` y `UsuarioNoEncontrado` los lanzan las operaciones.

## Qué no entra

HTTP, Jupyter y frontend no se añaden. Cuando lleguen, llaman a las operaciones que ya existen. No copian la regla de que el email es único.
