# Constitución — first-app

first-app es una app para aprender los conceptos básicos de login. Se construye con IA siguiendo el sistema SDD.

## Árbol

```
first-app/
  db/
    connection.js       Única conexión a la base de datos
    users.sqlite        Único fichero de la base de datos
  queries/
    queries/            Texto SQL, un fichero por query, reutilizable
    users.js            Funciones que importan ese SQL y lo ejecutan
  logic/
    create-user.js      Una funcionalidad por fichero
    update-user.js
    delete-user.js
    list-users.js
  clients/
    terminal/           Primer cliente. Sirve de test manual
  docs/
    CONSTITUTIONS.md    Esta base
```

- `db/` abre la base de datos y no contiene reglas de negocio.
- `queries/queries/` guarda el SQL. `queries/users.js` lo ejecuta. No hay reglas de negocio aquí.
- `logic/` es el núcleo de la app. Aquí viven las reglas de negocio.
- `clients/terminal/` llama a `logic/` y muestra el resultado. Es el primer cliente y el test manual de cada funcionalidad.

## Base de datos

Hay una sola base de datos: `db/users.sqlite`. Hay una sola conexión: el `db` que exporta `db/connection.js`. No se abre otra base de datos ni otra conexión.

Tabla `users`:

- `id` es `INTEGER PRIMARY KEY`. SQLite lo incrementa solo: 1, 2, 3…
- `email` es `VARCHAR(64) NOT NULL UNIQUE`.
- `name` es `TEXT NOT NULL`.
- `createdAt` y `updatedAt` son fechas. SQLite no tiene un tipo `DATE` propio. El tipo adecuado es `TEXT` con la fecha en `YYYY-MM-DD HH:MM:SS`, que es lo que devuelve `datetime('now', 'localtime')`.

## Logic no se reemplaza

`logic/` no es un adaptador ni una capa intercambiable. No se sustituye por otra implementación, no se convierte en plugins y no se mueven sus reglas a `queries/` ni a `clients/`.

Cada funcionalidad es un fichero. Un fichero de `logic/` ya creado no se reemplaza para encajar otra tarea. Una funcionalidad nueva es un fichero nuevo.

## Un fichero de logic

Un fichero, una función. El nombre, la entrada, la salida y el cuerpo quedan definidos en el propio fichero.

La primera línea es un comentario con el contrato, en inglés:

```js
// createUser(name, email) -> created user
```

El nombre es la acción (`createUser`, `updateUser`, `deleteUser`, `listUsers`). Los parámetros van en la firma, con su nombre (`name`, `email`, `id`). No se agrupa la entrada en un único objeto si los datos ya se conocen.

El cuerpo sigue este orden, y no se mezcla:

1. Validar los parámetros de entrada.
2. Validar el resto de reglas de negocio.
3. Aplicar la lógica de negocio.
4. Estructurar la salida y sanear la respuesta.

La salida del paso 4 es el dato de la operación: el usuario, la lista de usuarios, o nada si la operación no devuelve datos. Solo incluye los campos que el cliente necesita (`id`, `name`, `email`, `createdAt`, `updatedAt`). No salen objetos de SQLite ni errores internos de la base de datos.

## Errores

La forma actual de `logic/`, devolver `{ ok: true, user }` o `{ ok: false, error: "CODIGO" }`, no es un buen manejo de errores. No se copia en código nuevo. El código que ya la usa no se cambia hasta que se pida.

La forma correcta:

- Si falla la entrada o una regla de negocio, la función lanza `new Error("...")` con un mensaje claro en inglés.
- Si todo va bien, devuelve el dato del paso 4, sin envolverlo en `{ ok: true }`.
- No se usan códigos opacos ni clases de error propias.
- Un error crudo de SQLite no llega al cliente. `logic/` lo convierte en un `Error` con un mensaje que un junior entienda.

## Queries

El SQL no vive dentro de la función que lo ejecuta.

- `queries/queries/` tiene un fichero por query. Ese fichero exporta solo el texto SQL, con parámetros con nombre (`:id`, `:name`, `:email`).
- `queries/users.js` importa esos textos, los prepara con `db` y los ejecuta. Las funciones de este fichero se pueden reutilizar desde `logic/`.
