# CONSTITUTIONS.md — first-app

Reglas estables del proyecto. El código se adapta a este documento, no al revés. Los clients cambian; la logic no se reemplaza.

## 1. Árbol

```
first-app/
  db/
    connection.js       Única conexión a la base de datos
    users.sqlite        Único fichero de la base de datos
  queries/
    users.js            Lee y ejecuta cada consulta
    queries/
      create-users-table.sql
      find-all.sql
      find-by-email.sql
      find-by-id.sql
      insert.sql
      remove.sql
      update.sql
  logic/
    create-user.js      Una funcionalidad por fichero
    update-user.js
    delete-user.js
    list-users.js
    find-user-by-email.js
    users-gender-count.js
  clients/
    terminal/           Primer cliente. Sirve de test manual
  docs/
    CONSTITUTIONS.md    Esta base
  specs/
    <nombre>/           Un desarrollo
      spec.md           Negocio
      plan.md           Técnica
      tasks.md          Pasos
```

- `clients/` no importa SQL ni abre la base de datos. Solo llama a `logic/`.
- `logic/` no escribe SQL y no abre SQLite. Solo llama a `queries/users.js`. `logic/users-gender-count.js` también puede usar la librería `openai`.
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

`logic/` no es un adaptador ni una capa intercambiable. No se sustituye por otra implementación, no se convierte en plugins y no se mueven sus reglas a `queries/` ni a `clients/`.

Cada funcionalidad es un fichero. Un fichero de `logic/` ya creado no se reemplaza para encajar otra tarea. Una funcionalidad nueva es un fichero nuevo.

### Un fichero de logic

Un fichero, una función. El nombre de la función es la acción. Los parámetros van en la firma, cada uno con su nombre. No se recibe un objeto `input` genérico.

Ejemplos de firma:

- `createUser(input)`
- `updateUser(id, changes)`
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

El error depende del paso del cuerpo:

1. Validar los parámetros de entrada. Las reglas de negocio lanzan el error del dato y quedan **fuera** del `try`.
   - `"Name is required"`
   - `"Name cannot exceed 100 characters"`
   - `"Email is required"`
   - `"Email cannot exceed 255 characters"`
   - `"Email is not valid"`
2. Validar el resto de reglas de negocio. Las reglas de negocio lanzan el error de la regla y quedan **fuera** del `try`, después de la consulta que comprueba la regla.
   - `"A user with that email already exists"`
   - `"User does not exist"`
3. Aplicar la lógica de negocio. El `try/catch` envuelve **solo** las llamadas a `queries/`. El `catch` no compara mensajes: lanza el error de la operación. Así no se muestran errores de SQLite.
   - `"Could not create the user"`
   - `"Could not update the user"`
   - `"Could not delete the user"`
   - `"Could not list the users"`
   - `"Could not find the user"`
   - `"Could not count the users by gender"`
4. Estructurar la salida y sanear la respuesta. Este paso no lanza error. Devuelve el dato saneado.

El client de terminal no captura el error para maquillarlo. Lo muestra.

No hay envoltorios del tipo `{ ok, data }` ni tipos `ValidationError` / `NotFoundError`.

## 5. Queries

`queries/` tiene una subcarpeta, `queries/queries/`. Cada consulta vive en su fichero `.sql`.

`users.js` lee ese fichero y lo ejecuta con `db.exec` o `db.prepare`. Los parámetros son `:id`, `:name` y `:email`.

Queries no valida nombre, email ni unicidad de negocio. Queries no captura errores. Eso es logic.

## 6. Constantes

Un nombre en mayúsculas es un valor fijo. No cambia durante la ejecución. Si el nombre tiene varias palabras, van en mayúsculas y se separan con `_`.

`MAX_NAME_LENGTH` es una constante. `trimmedName` es una variable normal y sigue en camelCase.

Las funciones y las variables normales siguen en camelCase.

## 7. SDD

Un desarrollo nuevo vive en `specs/<nombre>/`. Son tres ficheros cortos. Se leen enteros.

- `spec.md` es el negocio: qué se pide, reglas, salida y errores. Sin código.
- `plan.md` es la técnica: qué ficheros se tocan y cómo encaja en `logic/`, `queries/` y `clients/`.
- `tasks.md` son los pasos, en orden, como los haría una persona. Un paso, una acción.

Una persona revisa `spec.md`, después `plan.md`, después `tasks.md`. El código se escribe solo cuando esos tres están aceptados.

No hay bucle. Un fichero anterior no se reescribe salvo que la persona lo pida.
