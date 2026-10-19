# CONSTITUTIONS.md — first-app

Reglas estables del proyecto. El código se adapta a este documento, no al revés. Los clients cambian; la logic no se reemplaza.

## 1. Árbol

```
first-app/
  db/
    connection.js       Única conexión a la base de datos
    users.sqlite        Único fichero de la base de datos
  queries/
    users.js            Único fichero. Todas las consultas a la base de datos
  logic/
    create-user.js      Una funcionalidad por fichero
    update-user.js
    delete-user.js
    list-users.js
    find-user-by-email.js
  clients/
    terminal/           Primer cliente. Sirve de test manual
  docs/
    CONSTITUTIONS.md    Esta base
```

- `clients/` no importa SQL ni abre la base de datos. Solo llama a `logic/`.
- `logic/` no escribe SQL y no abre SQLite. Solo llama a `queries/users.js`.
- `queries/users.js` no valida reglas de negocio. Solo ejecuta SQL.
- `db/` no conoce usuarios. Solo abre la conexión.

## 2. Base de datos

- Motor: SQLite con `node:sqlite`.
- Un solo fichero: `db/users.sqlite`.
- Una sola conexión: `db/connection.js` abre ese fichero.
- `queries/users.js` crea la tabla `users` si no existe.

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

- `id` es un entero autonumérico. Lo asigna SQLite.
- `name` y `email` son texto. Un nombre o un correo no son un número.
- `created_at` y `updated_at` son fechas. SQLite rellena `created_at` al insertar.
- `email` es único en la tabla.

`db/` no valida el formato del email ni decide si se puede borrar un usuario.

## 3. Logic

La logic **no se reemplaza**. Un frontend, HTTP o Jupyter es un client nuevo. Los ficheros de `logic/` siguen. La logic no sabe quién la llama.

Logic importa `queries/users.js`. No abre `db/users.sqlite`.

### Un fichero de logic

Un fichero, una función. El nombre de la función es la acción. Los parámetros van en la firma, cada uno con su nombre. No se recibe un objeto `input` genérico.

Ejemplos de firma:

- `createUser(name, email)`
- `updateUser(id, name, email)`
- `deleteUser(id)`
- `listUsers()`
- `findUserByEmail(email)`

El cuerpo sigue este orden y **no se mezcla**:

1. Validar los parámetros de entrada.
2. Validar el resto de reglas de negocio.
3. Aplicar la lógica de negocio.
4. Estructurar la salida y sanear la respuesta.

La salida del paso 4 es el dato de la operación: el usuario, la lista de usuarios, o nada si la operación no devuelve datos. Solo incluye los campos que el client necesita (`id`, `name`, `email`, `createdAt`, `updatedAt`). No salen objetos de SQLite ni errores internos de la base de datos.


Reglas de los datos:

- El nombre es obligatorio, se recorta, máximo 100 caracteres.
- El email es obligatorio, se recorta, se guarda en minúsculas, máximo 255 caracteres, y tiene formato de email.
- El email no puede repetirse.

## 4. Manejo de errores

El manejo de errores está **solo en `logic/`**. `queries/` no usa `try/catch`.

Sin clases de error. Se usa `throw new Error("clear English message")`.

- Los `if` de validación y de reglas de negocio lanzan el error de la aplicación (nombre, email, duplicado, no existe). Quedan **fuera** del `try`.
- El `try/catch` envuelve **solo** las llamadas a `queries/`. El `catch` no compara mensajes: lanza el error de la operación en inglés (`Could not create the user`). Así no se muestran errores de SQLite.

Mensajes:

- `"Name is required"`
- `"Name cannot exceed 100 characters"`
- `"Email is required"`
- `"Email cannot exceed 255 characters"`
- `"Email is not valid"`
- `"A user with that email already exists"`
- `"User does not exist"`
- `"Could not create the user"`
- `"Could not update the user"`
- `"Could not delete the user"`
- `"Could not list the users"`
- `"Could not find the user"`

El client de terminal no captura el error para maquillarlo. Lo muestra.

No hay envoltorios del tipo `{ ok, data }` ni tipos `ValidationError` / `NotFoundError`.

## 5. Queries

`queries/` **no tiene subcarpetas**. El único fichero es `users.js`. Ahí van todas las consultas a la base de datos.

Cada función de `users.js` prepara y ejecuta su SQL con `db.prepare` y parámetros `:id`, `:name`, `:email`. No hay carpeta de `.sql` aparte.

Queries no valida nombre, email ni unicidad de negocio. Queries no captura errores. Eso es logic.
