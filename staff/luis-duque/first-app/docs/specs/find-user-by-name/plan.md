# Plan — buscar un usuario por nombre

Cumple `docs/specs/find-user-by-name/spec.md`.

## Ficheros

Se crea:

- `logic/find-user-by-name.js`
- `queries/queries/find-user-by-name.sql`
- `clients/terminal/find-user-by-name.txt`

`find-user-by-name.txt` es una sola línea de cmd, como el resto de `clients/terminal`.

Se toca `queries/users.js`: lee esa consulta y exporta `findUserByName`. No cambia las funciones que ya existen.

Se tocan, en el mismo cambio que el código:

- `docs/CONSTITUTIONS.MD`
- `AGENTS.MD`

No se toca `package.json`, `pnpm-lock.yaml`, `db/connection.js`, `logic/shared.js` ni las operaciones que ya existen.

## Firma

`findUserByName(name)`

Es `async`, como `findUserByEmail`. Valida con `validateNombre` y llama a `findUserByName` de `queries/users.js`. El import de `queries` es `import * as users`, porque `logic` exporta una función con el mismo nombre.

`validateNombre` recorta los extremos, rechaza el vacío con `Name is required` y rechaza más de 100 caracteres con `Name must be at most 100 characters`. No pasa el nombre a minúsculas. `Ana` y `ana` siguen siendo distintos.

Si la consulta devuelve un usuario, la función devuelve ese usuario: `{ id, name, email }`.

Si devuelve varios, la función devuelve la lista. Cada elemento es `{ id, name, email }`.

Si no devuelve ninguno, lanza `User ${name} was not found`, con el nombre ya recortado. No escribe en la base.

## SQL

Una consulta nueva, sin escrituras. El texto va en `queries/queries/find-user-by-name.sql`. La ejecuta solo `queries/users.js`, con `.all()`.

```sql
SELECT *
FROM users
WHERE name = ?;
```

La comparación es la del nombre ya recortado, tal como está guardado.

## Cliente

El txt se crea en `clients/terminal/find-user-by-name.txt`. Es una sola línea de cmd. Importa `findUserByName` desde `./staff/luis-duque/first-app/logic/find-user-by-name.js` y hace `console.log` del resultado. El nombre va al final del comando. No valida, no escribe SQL y no abre la base.

Se tira desde cmd, en la raíz del repositorio, porque Node resuelve el `import` desde la carpeta de trabajo.
