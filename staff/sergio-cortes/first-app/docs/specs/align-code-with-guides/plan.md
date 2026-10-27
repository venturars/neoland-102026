# Plan — alinear el código con las guías

Issue: #513.

No es una funcionalidad nueva. No se crea ni se borra ningún fichero de
`logic/`. No hay SQL nuevo. No hay paquete nuevo. Las firmas y los
mensajes de «Errores» siguen siendo los de ahora.

El código junta varias acciones en una línea. Cada acción pasa a su
propia línea, con su nombre. Prettier no junta dos sentencias. El
resultado de cada función sigue igual.

Las firmas no cambian: `createUser(input)`, `updateUser(input)`,
`deleteUser(id)`, `findUserById(id)`, `findUserByEmail(email)`,
`findUserByName(name)`, `listUsers()`, `usersGenderCount()`.

## Ficheros

No se crean ficheros.

Se tocan:

- `logic/create-user.js`
- `logic/update-user.js`
- `logic/find-user-by-email.js`
- `logic/find-user-by-name.js`
- `logic/user-gender-count.js`
- `queries/user.js`
- `db/connections.js`

No se tocan `logic/errors.js`, `logic/delete-user.js`,
`logic/find-user-by-id.js` ni `logic/list-users.js`. Cada línea relevante
de esos ficheros ya es una llamada o una comprobación simple.

No se tocan los `.sql`, `clients/`, `eslint.config.js`, `package.json`,
`AGENTS.MD` ni las guías en `docs/`.

## Validación de nombre (create, update, find by name)

Donde hoy aparece `typeof … !== "string" || ….trim() === ""` con
`ValidationError("Name is empty")`, la condición se parte sin cambiar
cuándo se lanza el error: no string o string solo con espacios sigue
siendo «Name is empty». El valor que se usa después en la función no
cambia (p. ej. en `createUser` no se añade `.trim()` al guardar si antes
no se hacía).

## Validación de email (create, update, find by email)

Donde hoy aparece `typeof email !== "string" || email.includes(" ")`
con `ValidationError("Email is invalid")`, se parte igual que el nombre.

El bloque con `indexOf`, `lastIndexOf`, `slice` y `lastIndexOf` en el
dominio se mantiene. Solo se evita leer propiedades encadenadas en la
misma línea que otra acción si hoy comparten línea con otra comprobación.

## Crear y cambiar usuario

`logic/create-user.js` y `logic/update-user.js` siguen el orden de la
constitución: validar entrada, reglas de negocio (incluidas lecturas con
`findByEmail` / `findById`), aplicar cambio, estructurar salida. Los
`try`/`catch` que mapean a `DatabaseError` no cambian de mensaje.

En `updateUser`, la condición `owner !== undefined && owner.id !== id`
para `ConflictError("Email is already used")` se parte en comprobaciones
con nombres intermedios, sin cambiar cuándo sale el conflicto.

## Conteo por género

En `logic/user-gender-count.js` la firma sigue siendo `usersGenderCount()`.
La salida sigue siendo `{ woman, man, genderUndefined }`. `MODEL`,
`BATCH_SIZE`, `EXAMPLES`, `RESPONSE_FORMAT` y la URL de Ollama no cambian.

Se parten líneas que hoy mezclan comprobaciones, acceso a propiedades y
continuaciones del bucle, por ejemplo:

- comprobar `choices` y leer `choice` antes de usar `choice.message`;
- comprobar que `message` es string no vacío antes de `JSON.parse`;
- validar `parsed.classifications` antes del bucle interno;
- comprobar `item.gender` e `item.name` antes de `genders.set`.

Los `continue` del bucle deben ejecutarse en los mismos casos que ahora.

## Queries

Las firmas de `queries/user.js` siguen igual. `createUsersTable(database)`
sigue recibiendo la base que le pasa el cliente.

Cada `return db.prepare(…).get|all|run(…)` pasa a dos líneas: `prepare` en
una constante `statement`, luego el método con el mismo argumento que ahora.

Las constantes `readFileSync` con `new URL(…)` pueden quedar como están si
cada línea ya tiene una sola acción; si alguna línea mezcla acciones, se
parte igual que en el resto del fichero.

## Conexión

`db/connections.js` sigue exportando `db` y abriendo `users.sqlite` junto
al fichero. Si `join` y `fileURLToPath` comparten línea con otra acción,
cada paso va en su propia constante, como en `docs/STYLE.md`.

## Errores

No hay un mensaje nuevo.

| Situación                         | Comportamiento esperado                                      |
| --------------------------------- | ------------------------------------------------------------ |
| Un resultado cambia               | No es un fallo de la lista; el desarrollo no está hecho      |
| Un mensaje cambia                 | No es un fallo de la lista; el desarrollo no está hecho      |
| Una línea sigue con dos acciones  | No es un fallo de la lista; el desarrollo no está hecho      |

## Parecido

No hay fichero nuevo en `logic/`. El refactor copia la forma de
`docs/STYLE.md` y el patrón de ficheros que ya cumplen la guía
(`logic/find-user-by-id.js`, `logic/delete-user.js`).

## Documentación del proyecto

No se actualizan `docs/TREE.md` ni `docs/ARCHITECTURE.md`: no entra ni
sale ningún fichero del árbol.
