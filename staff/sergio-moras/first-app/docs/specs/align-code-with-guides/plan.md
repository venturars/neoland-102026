# Plan: Alinear el código con las guías

Implementa [spec.md](spec.md). Respeta [CONSTITUTIONS.md](../../CONSTITUTIONS.md) y sus guías. No cambia la tabla.

## Decisiones del usuario
- `?.` se cambia por un `if`.
- `classifyGender` se reescribe en esta tarea.
- El `.gitattributes` entra en esta tarea.

## Renombrados
Con `git mv`, para conservar el historial. 18 ficheros:

| Antes | Después |
|---|---|
| `classifyGender` | `classify-gender` |
| `createUser` | `create-user` |
| `deleteUser` | `delete-user` |
| `findUserByEmail` | `find-user-by-email` |
| `listUsers` | `list-users` |
| `updateUser` | `update-user` |

En `logic/` (`.js`), `clients/terminal/` (`.txt`) y `clients/jupyter/` (`.ipynb`). Se cambia cada `import` de los `.txt` y de los notebooks.

## Campos devueltos
Cada función que devuelve un usuario construye el objeto de salida al final, campo a campo:
```js
return {
  id: createdUser.id,
  name: createdUser.name,
  email: createdUser.email,
  createdAt: createdUser.created_at,
  updatedAt: createdUser.updated_at,
};
```
`listUsers` lo hace para cada fila con un `for...of` y `push`. No hay una función genérica de traducción: cada fichero de `logic/` lo hace con sus pasos, como pide `STYLE.md`.

Como el objeto de salida es un objeto normal, la terminal deja de mostrar `[Object: null prototype]`.

## Una acción por línea
| Hoy | Después |
|---|---|
| `const trimmedName = name?.trim();` | `let trimmedName = "";` y `if (typeof name === "string") { trimmedName = name.trim(); }` |
| `email?.trim().toLowerCase()` | Igual que el nombre, con `trimmedEmail` y después `const normalizedEmail = trimmedEmail.toLowerCase();` |
| `name?.trim() \|\| null` (`updateUser`) | `let newName = null;`, el recorte con `if` y `if (trimmedName !== "") { newName = trimmedName; }` |
| `if (!Number.isInteger(userId) \|\| userId <= 0)` | Dos `if`, cada uno con `throw new Error(\`Invalid id: ${id}\`)` |
| `if (userWithSameEmail && userWithSameEmail.id !== userId)` | Dos `if` anidados |
| `return insertUser(...)` y similares | Primero se guarda el resultado en una variable y después se construye la salida |

Una condición que junta valores ya calculados sin llamar a nada (`!trimmedName && !normalizedEmail`) cuenta como una comprobación.

Con `typeof name === "string"`, un nombre que no es texto da `Name is required.` en lugar de romper con un `TypeError`. Es el único cambio de comportamiento y solo afecta a datos que no son texto.

### `classify-gender.js`
- `buildState`: los ejemplos se construyen con un `for...of` y `push`. El `join` va en su propia línea.
- `askModelForGenders`:
  - Las preguntas con un `for` con índice.
  - El cuerpo de la petición (`JSON.stringify`) y la señal de tiempo (`AbortSignal.timeout`) se calculan cada uno en su línea antes de `fetch`.
  - La lectura de cada respuesta con `if` en lugar de `answers?.[...]`, y la comprobación de `ALLOWED_GENDERS.includes(...)` en su propio `if`.
- `countGenders`: `slice` y la lista de nombres en líneas separadas. Los nombres con un `for...of` y `push`.
- Mismos mensajes, mismo `cause`, mismas constantes y mismo conteo.

`queries/users.js` y `db/connection.js` ya cumplen: una llamada por línea y el resultado guardado antes de devolverlo. Solo se revisan.

## Clientes
- `.txt`: el `import` con el nombre nuevo. Los que muestran usuarios no cambian: imprimen el objeto que devuelve `logic/`.
- Notebooks: el `import` con el nombre nuevo y `user.createdAt` / `user.updatedAt` en la tabla. Encabezados `createdAt` y `updatedAt`. El texto «Qué comando usa» con el `.txt` nuevo.
- Ejemplos de `update-user` y `delete-user`: el id 3 ya no existe. Pasan al id actual de Pedro, en los `.txt` y en los notebooks.

## `.gitattributes`
En `first-app/`:
```
*.js text eol=lf
```
Después, `git add --renormalize` sobre los `.js`.

## Guías
- `STYLE.md`: sin «Pendiente». Plantillas con los nombres nuevos. Una línea: no se usa `?.`; se comprueba con `if`.
- `DATABASE.md`: sin la nota de que `logic/` aún devuelve `created_at`.
- `ARCHITECTURE.md`, `TREE.md` y `AGENTS.md`: nombres nuevos.
- Las specs de tareas anteriores no se tocan: cuentan lo que se hizo entonces.

## Cómo se prueba
- Foto antes (con los nombres de hoy) y después (con los nuevos) de los 22 casos de la terminal y de `classifyGender` con Ollama apagado. La comparación es igual salvo:
  - `created_at` → `createdAt` y `updated_at` → `updatedAt`;
  - sin `[Object: null prototype]`;
  - fechas e ids.
- Los 6 notebooks se ejecutan en orden (`update-user`, `delete-user`, `create-user`, `find-user-by-email`, `list-users`, `classify-gender`) y se guarda su resultado, como en #381. Cambia y vuelve a crear a Pedro, con permiso del usuario.
- `pnpm format` dos veces: la segunda no cambia nada y `git status` no marca ningún `.js`. `pnpm lint` sin errores.
- No queda ningún usuario temporal.
