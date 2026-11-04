# Plan — buscar usuarios por nombre

Funcionalidad nueva. No reemplaza ningún fichero de `logic/`. El nombre no es único: la búsqueda devuelve todos los usuarios con ese nombre. Si no hay ninguno, la lista está vacía.

## Ficheros

Se crean:

- `logic/find-user-by-name.js`
- `queries/queries/find-by-name.sql`
- `clients/terminal/find-user-by-name.txt`

Se tocan:

- `queries/user.js`
- `docs/CONSTITUTIONS.md` (árbol, firma en «Un fichero logic», cliente terminal)

## Parecido

Se parece a `logic/list-users.js`: devuelve una lista saneada con `id`, `name`, `email`, `createdAt` y `updatedAt`; si la query lanza, lanza `DatabaseError`. La validación del nombre vacío sigue el mismo criterio que en `logic/create-user.js` para `name`.

## Firma

`findUserByName(name)`

`name` es un texto.

Devuelve una lista de `{ id, name, email, createdAt, updatedAt }`, ordenada por `id`. Si no hay filas, devuelve `[]`.

## SQL

```sql
SELECT *
FROM users
WHERE name = :name
ORDER BY id
```

En `queries/user.js`, `findByName(name)` lee ese fichero y ejecuta con `.all({ name })`.

## Errores

| Fallo de la spec              | Clase             | Mensaje                   |
| ----------------------------- | ----------------- | ------------------------- |
| El nombre está vacío          | `ValidationError` | `Name is empty`           |
| No se puede leer en la base   | `DatabaseError`   | `Could not find the user` |

## Cliente

`clients/terminal/find-user-by-name.txt` importa `findUserByName`, hace `console.log` del resultado y no captura el error. El directorio actual es `first-app`. El ejemplo busca `Ada`.
