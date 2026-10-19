# Constitución — first-app

Este archivo es el reglamento de mi first-app. Lo escribí después de hablar cómo se construye la app. Cursor debe seguir esto y no inventar otra estructura.

first-app es una app pequeña en Node para usuarios. No es una web. Se usa desde la terminal. Más adelante puede crecer hacia login. Por ahora solo crea, lista, actualiza, busca y borra usuarios en SQLite.

## Carpetas

```
first-app/
  db/                 Abre la base de datos. Sin reglas de negocio.
  queries/            Solo SQL. Nada de "¿este email es válido?"
  logic/              Las reglas. Un fichero por acción.
  clients/terminal/   Texto que pegas para probar cada acción.
  tests/              Tests automáticos con una base temporal.
  docs/               Esta constitución.
  AGENTS.md           Cómo debe trabajar Cursor en esta carpeta.
  package.json
```

- `db/connection.js` es la única conexión. El fichero en disco es `db/users.sqlite`. No se sube a git. Los tests pueden usar `USERS_DB_PATH` hacia un fichero temporal para no tocar mis datos reales.
- `queries/users.js` ejecuta el SQL (crear tabla, buscar, insertar, actualizar, borrar, listar).
- `logic/` es la app. Cada acción es su propio fichero. `user-fields.js` guarda las comprobaciones compartidas de nombre, email e id para que create/update/find sean iguales.
- `clients/terminal/*.txt` no son programas. Se pegan con el directorio actual en `first-app`.

Funcionalidad nueva = fichero nuevo en logic + `.txt` nuevo en terminal. No conviertas un fichero viejo en un cajón de sastre. No muevas las reglas a queries ni a clients.

## Tabla users

- `id` — INTEGER PRIMARY KEY (1, 2, 3…)
- `name` — TEXT, obligatorio
- `email` — único, máximo 64 caracteres
- `createdAt` / `updatedAt` — TEXT con `datetime('now', 'localtime')`

## Cómo funciona una función de logic

Se lee de arriba abajo:

1. Comprobar las entradas (nombre, email, id).
2. Comprobar el resto de reglas (email duplicado, el usuario existe).
3. Hablar con queries (SQLite dentro de try/catch).
4. Devolver un usuario plano: `id`, `name`, `email`, `createdAt`, `updatedAt`. Delete no devuelve nada. No devolver una fila cruda de SQLite.

Nombres de las acciones: `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserByEmail`.

## Errores

Si falla, `throw new Error("...")` con una de estas frases en inglés. No devolver `{ ok: false }`.

Entrada y reglas:

- `Name is empty` — nombre vacío, o un nombre que solo es `"\0"`
- `Email is invalid` — falta `@`, demasiado largo, o espacios dentro del email
- `Email is already used`
- `User not found`
- `Invalid id` — falta o no es un entero positivo (comprobar esto antes de SQLite)

Si falla SQLite:

- `Could not create the user`
- `Could not update the user`
- `Could not delete the user`
- `Could not list the users`
- `Could not find the user`

## Orden de construcción

1. Conexión + crear tabla, y comprobar que la tabla existe.
2. Crear un usuario y luego listar, para saber que se guardó.
3. Actualizar (si solo cambia el nombre, el email se mantiene).
4. Buscar por email.
5. Borrar y volver a listar.

Después de cada acción, pegar el snippet de terminal o ejecutar `npm test`.
