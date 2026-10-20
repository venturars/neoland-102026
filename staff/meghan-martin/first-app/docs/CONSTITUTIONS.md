# Constitución — first-app

Este archivo es el reglamento de mi first-app. Cursor debe seguir esto y no inventar otra estructura.

first-app es una app pequeña en Node para usuarios. No es una web. Se usa desde la terminal. Más adelante puede crecer hacia login. Por ahora solo crea, lista, actualiza, busca y borra usuarios en SQLite.

## Flujo de trabajo (obligatorio)

Ningún código de una funcionalidad nueva se escribe antes de spec, plan y tasks.

Por cada funcionalidad nueva se crea una carpeta nueva en `docs/specs/` con `spec.md`, `plan.md` y `tasks.md`. No se sobrescriben.

- **spec** — solo lógica de producto (qué ve quien usa la app, few-shot). Sin nombres de ficheros ni `pnpm`.
- **plan** — cómo se encaja aquí: funciones y ficheros. No copiar el spec entero.
- **tasks** — pasos de trabajo, en orden.

No hay loop. Una persona lee spec → plan → tasks y luego se implementa.

1. Constitución — este archivo.
2. `docs/specs/<nombre>/spec.md`
3. Revisión humana de la spec.
4. `plan.md` y `tasks.md` en esa misma carpeta.
5. Implementación.
6. El snippet de `clients/terminal/` de esa acción.

El snippet es obligatorio. Paquete: **pnpm**, no npm.

## Carpetas

```
first-app/
  db/                 Abre la base de datos. Sin reglas de negocio.
  queries/            Solo SQL. Nada de "¿este email es válido?"
  logic/              Las reglas. Un fichero por acción.
  clients/terminal/   Texto que pegas para probar cada acción.
  docs/               Constitución y specs (una carpeta por función).
  AGENTS.md           Cómo debe trabajar Cursor en esta carpeta.
  package.json
```

- `db/connection.js` es la única conexión. El fichero en disco es `db/users.sqlite`. No se sube a git.
- `queries/users.js` ejecuta el SQL. Las sentencias están en `queries/queries/*.sql` (crear tabla, buscar, insertar, actualizar, borrar, listar).
- `logic/` es la app. Cada acción es su propio fichero. Las comprobaciones de nombre, email e id están dentro de esa acción.
- `clients/terminal/*.txt` no son programas. Se pegan con el directorio actual en `first-app`.
- `docs/specs/<funcion>/` — spec, plan y tasks de esa función. Carpeta nueva cada vez.

Funcionalidad nueva = fichero nuevo en logic + `.txt` nuevo en terminal. Un fichero de `logic/` ya creado no se reemplaza para encajar otra tarea. No conviertas un fichero viejo en un cajón de sastre. No muevas las reglas a queries ni a clients.

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
4. Devolver el valor del contrato (abajo). No devolver una fila cruda de SQLite.

## Contratos de logic

Un usuario plano es un objeto con exactamente: `id` (entero), `name` (string), `email` (string en minúsculas), `createdAt` (string), `updatedAt` (string).

Normalización de email (create, update si se envía email, find): trim, minúsculas, un solo `@` con las dos partes no vacías, sin espacios, longitud ≤ 64. Si no, `Email is invalid`.

- `createUser({ name, email })` → un usuario plano.
  Nombre vacío o `"\0"` → `Name is empty`.
  Email ya usado (tras normalizar) → `Email is already used`.

- `listUsers()` → array de usuarios planos, ordenados por `id`.
  Tabla vacía → `[]`, no un error.

- `updateUser(id, changes)` → un usuario plano.
  `id` debe ser un entero ≥ 1; si no, `Invalid id` (antes de SQLite).
  `changes.name` y `changes.email` son opcionales. Si omites uno, se deja el valor actual. Puedes enviar solo `{ name }`, solo `{ email }`, o ambos.
  Si el usuario no existe → `User not found`.
  Si el email nuevo es de otro usuario → `Email is already used`.

- `findUserByEmail(email)` → un usuario plano.
  Si no hay fila → `User not found` (no `null`, no `[]`).

- `findUserById(id)` → un usuario plano.
  `id` igual que update/delete (`Invalid id` antes de SQLite).
  Si no hay fila → `User not found`.
  Si SQLite falla → `Could not find the user`.

- `deleteUser(id)` → no devuelve nada (`undefined`).
  `Invalid id` / `User not found` igual que update.

- `usersGenderCount()` → `{ women, men, genderUndefined }` (números).
  Sin argumentos. Tabla vacía → ceros. Si no se puede leer la base o Ollama no responde → `Could not classify the users`.
  Solo `women` y `men` suman a su número. Cualquier otra respuesta de una persona cuenta como `genderUndefined`. Si a un grupo le faltan respuestas, ese grupo entero cuenta como `genderUndefined`.
  No se guarda en SQLite.

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
- `Could not classify the users`

## Orden de construcción

1. Conexión + crear tabla, y comprobar que la tabla existe.
2. Crear un usuario y luego listar, para saber que se guardó.
3. Actualizar (si solo cambia el nombre, el email se mantiene).
4. Buscar por email.
5. Buscar por id.
6. Recuento de géneros (`docs/specs/classifier/`; todas las personas; salida: tres números).
7. Borrar y volver a listar.

Después de cada acción: snippet de terminal.
