# Plan: Guías por tema

Implementa [spec.md](spec.md). Cambia [CONSTITUTIONS.md](../../CONSTITUTIONS.md) con el permiso explícito del usuario, que lo ha pedido en la issue.

## Archivos
```
docs/ARCHITECTURE.md   NUEVO
docs/TREE.md           NUEVO
docs/DATABASE.md       NUEVO
docs/ERRORS.md         NUEVO
docs/STYLE.md          NUEVO
docs/CONSTITUTIONS.md  principios sin detalle, sección «Guías», versión 2.0.0
AGENTS.md              sin «Stack», «Estructura» ni «Estilo»; enlaza a las guías
```
No se toca código.

## De dónde sale cada regla
| Regla de hoy | Dónde está hoy | Dónde queda |
|---|---|---|
| Flujo `terminal → logic → queries → db/connection.js` y qué hace cada capa | Constitución §1, `AGENTS.md` «Estructura» | `ARCHITECTURE.md`. La constitución deja el principio de una sola responsabilidad por capa |
| Una operación = fichero en `logic/` + `.txt` + `.ipynb`; contrato de un fichero de `logic/` | Constitución §2, `AGENTS.md` «Estilo» | `ARCHITECTURE.md` |
| Forma de los comandos de `clients/terminal/` | `AGENTS.md` «Comandos» | `ARCHITECTURE.md`, en «Clientes». `AGENTS.md` deja cómo se lanzan |
| Lista de carpetas | `AGENTS.md` «Estructura» | `TREE.md` |
| Columnas de `users`, `updated_at`, email en minúsculas, un único `users.sqlite`, SQL solo en `queries/` | Constitución §3 y §4, `AGENTS.md` «Stack» y «Nunca» | `DATABASE.md`. La constitución deja los principios de esquema protegido y datos intactos |
| Mensajes de error | Solo en el código | `ERRORS.md` |
| Idioma, comentarios, código explícito, plantilla de `logic/` | Constitución §5, `AGENTS.md` «Estilo» | `STYLE.md`. La constitución deja el principio de código legible para un junior |

## Contenido de cada guía

### `ARCHITECTURE.md`
- Flujo y responsabilidad de cada capa: `clients/`, `logic/`, `queries/`, `db/`.
- Qué hace cada fichero que existe hoy, uno por línea.
- Una operación tiene un fichero en `logic/`, una función en `queries/users.js` si usa la base, un `.txt` en `clients/terminal/` y un `.ipynb` en `clients/jupyter/`, con el mismo nombre.
- Un fichero de `logic/` exporta una función. Valida, llama a `queries/` y devuelve el resultado o lanza un error de `ERRORS.md`. No lee `process.argv`, no imprime y no llama a `process.exit`.
- Clientes: forma del `.txt` (`-e "` arriba, código sangrado, `"` al final; comillas simples y sin `${...}` dentro) y del notebook (sube hasta la app, lanza Node, tabla con `cli-table3`).

### `TREE.md`
El árbol de hoy, sin `node_modules/` ni `users.sqlite`, con una línea por carpeta que dice qué guarda.

### `DATABASE.md`
- Un solo fichero, `db/users.sqlite`, y una sola conexión, la de `db/connection.js`.
- Tabla `users`: `id` `INTEGER PRIMARY KEY AUTOINCREMENT`, `name` `TEXT NOT NULL`, `email` `TEXT NOT NULL UNIQUE`, `created_at` y `updated_at` `TEXT NOT NULL DEFAULT (datetime('now'))`.
- `updated_at` se actualiza en cada modificación. El email se guarda sin espacios y en minúsculas.
- El SQL vive en `queries/users.js`, con parámetros `?`. `queries/` no valida.
- Lo que devuelve `logic/` usa `createdAt` y `updatedAt`. La traducción desde `created_at` y `updated_at` la hace `logic/`. Hoy `logic/` devuelve los nombres de la tabla: lo alinea la tarea siguiente.

### `ERRORS.md`
- Un fallo se señala con `throw new Error("...")`. El mensaje está en inglés y es uno de la lista.
- Los clientes lo muestran como `Error: <mensaje>`.
- La lista, por función, con los datos que lleva cada mensaje:

| Mensaje | Lo lanza |
|---|---|
| `Name is required.` | `createUser` |
| `Email is required.` | `createUser`, `findUserByEmail` |
| `Invalid email: <email>` | `createUser`, `updateUser` |
| `Email already exists: <email>` | `createUser`, `updateUser` |
| `User not found: <email>` | `findUserByEmail` |
| `User not found: id <id>` | `updateUser`, `deleteUser` |
| `Invalid id: <id>` | `updateUser`, `deleteUser` |
| `Provide a new name, a new email, or both.` | `updateUser` |
| `Users could not be classified: <motivo>` | `classifyGender` |

- `classifyGender` usa por dentro `the model did not respond (<motivo>)`. Ese texto solo sale como `<motivo>` del mensaje anterior. El error original va en `cause`.

### `STYLE.md`
- Código, nombres y mensajes en inglés. Comentarios en español, solo donde haya algo no evidente, más uno al principio de cada fichero con su responsabilidad.
- Ficheros en kebab-case (`create-user.js`, `create-user.txt`, `create-user.ipynb`). Funciones y variables en camelCase. Un valor fijo de la app es una constante en mayúsculas (`MODEL_NAME`).
- Imports ESM con extensión `.js`. Exportaciones con nombre. Sin clases.
- Una acción por línea: una llamada o una comprobación. `email?.trim().toLowerCase()` se escribe en líneas separadas, cada una con su nombre.
- Un fallo se comprueba con `if` y `throw new Error`, en su propia línea.
- El formato es el estándar de Prettier, sin configuración propia. Se lanza con `pnpm format`.
- Plantilla de `logic/`: `logic/createUser.js`. Plantilla de cliente: `clients/terminal/createUser.txt`.
- Al final, un apartado «Pendiente» dice qué no cumple hoy el código: nombres de ficheros en camelCase y líneas con más de una acción. Lo alinea la tarea siguiente.

## `docs/CONSTITUTIONS.md`
- Después de la introducción, una sección «Guías» con las cinco guías y una línea sobre qué trata cada una.
- Cada principio se queda con su regla y su motivo, y enlaza a la guía que da el detalle:
  - §1 se queda con que cada capa tiene una sola responsabilidad y solo `queries/` toca la base. Enlaza a `ARCHITECTURE.md`.
  - §2 se queda con que la forma es fija y no se crean, mueven ni borran ficheros sin pedirlo. Enlaza a `ARCHITECTURE.md` y `TREE.md`.
  - §3 se queda con que cambiar el esquema necesita permiso. Enlaza a `DATABASE.md`.
  - §4 no cambia.
  - §5 se queda con que el código es legible para un junior. Enlaza a `STYLE.md` y `ERRORS.md`.
  - §6, §7 y §8 no cambian.
- La versión pasa a 2.0.0, porque cambia dónde están las reglas.

## `AGENTS.md`
- Se quitan «Stack», «Estructura» y «Estilo».
- La introducción dice que antes de tocar código se leen la constitución y las guías del tema, con enlaces.
- «Comandos» se queda con cómo se lanzan los `.txt` y `pnpm format` / `pnpm lint`. La forma del `.txt` pasa a `ARCHITECTURE.md`.
- «Nunca» deja de repetir reglas de la base y enlaza a `DATABASE.md`.
- El resto no cambia.

## Cómo se prueba
- Cada regla de la tabla «De dónde sale cada regla» se busca y aparece en un solo documento.
- Todos los enlaces entre documentos llevan a un fichero que existe.
- Los mensajes de `ERRORS.md` coinciden con los `throw new Error` del código.
- `TREE.md` coincide con `git ls-files`.
- `pnpm format` y `pnpm lint` siguen sin cambios ni errores.
