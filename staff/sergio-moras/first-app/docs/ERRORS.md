# Errores

Un fallo se señala con `throw new Error("...")` desde `logic/`. El mensaje está en inglés y es uno de esta lista. No hay códigos ni clases de error propias.

Los clientes lo muestran como `Error: <mensaje>`.

| Mensaje | Lo lanza |
|---|---|
| `Name is required.` | `createUser`, `findUserByName` |
| `Email is required.` | `createUser`, `findUserByEmail` |
| `Invalid email: <email>` | `createUser`, `updateUser` |
| `Email already exists: <email>` | `createUser`, `updateUser` |
| `User not found: <email>` | `findUserByEmail` |
| `User not found: id <id>` | `updateUser`, `deleteUser` |
| `Invalid id: <id>` | `updateUser`, `deleteUser` |
| `Provide a new name, a new email, or both.` | `updateUser` |
| `Users could not be classified: <motivo>` | `classifyGender` |

`<email>` es el email ya normalizado, sin espacios y en minúsculas. `<id>` es el valor recibido.

## Dentro de `classifyGender`
`classifyGender` usa por dentro `the model did not respond (<motivo>)`, cuando Ollama no contesta, y `the model did not respond (HTTP <estado>)`, cuando contesta con un error. Esos textos solo salen como `<motivo>` del último mensaje de la lista. Cuando un error se lanza dentro de un `catch`, el error original va en `cause`.

## Base parada
Si el servidor de la base no está en marcha, `queries/users.js` lanza `Database is not running. Start it with pnpm db.`, con el error original en `cause`. Es el único mensaje que no lanza `logic/`. Sale tal cual en todas las operaciones, salvo en `classifyGender`, que lo envuelve: `Users could not be classified: Database is not running. Start it with pnpm db.`

Las respuestas de error del servidor (`Unknown query: <nombre>`, `Invalid request.`, `Not found.`, `Forbidden origin.` y los mensajes de SQLite) están en [ARCHITECTURE.md](ARCHITECTURE.md#servidor-de-la-base). `queries/` las lanza tal cual.

## Un mensaje nuevo
Una operación nueva que necesite un mensaje que no está en la lista lo añade aquí en su misma tarea.
