# Plan — buscar usuarios por nombre

Funcionalidad nueva. No reemplaza ningún fichero de `logic/`. La salida se parece a `logic/list-users.js`. La validación del nombre se parece a `logic/find-user-by-email.js`.

El nombre no es único. La búsqueda devuelve todos los usuarios con ese nombre. Si no hay ninguno, la lista está vacía.

## Ficheros

Se crean:

- `logic/find-user-by-name.js`
- `queries/queries/find-by-name.sql`
- `clients/terminal/find-user-by-name.txt`

Se tocan:

- `queries/users.js`
- `docs/CONSTITUTIONS.md`

En el árbol, `logic/` incluye `find-user-by-name.js`.

## Firma

`findUserByName(name)`

`name` es un texto.

Devuelve una lista de `{ id, name, email, createdAt, updatedAt }`, ordenada por `id`. Si no hay filas, devuelve `[]`.

## SQL

```sql
SELECT * FROM users WHERE name = :name ORDER BY id
```

## Errores

| Fallo de la spec     | Mensaje                   |
| -------------------- | ------------------------- |
| El nombre está vacío | `Name is empty`           |
| No se puede leer     | `Could not find the user` |

## Cliente

`clients/terminal/find-user-by-name.txt` importa `findUserByName` y hace `console.log` del resultado. El directorio actual es `first-app`. El ejemplo busca `Ada`.
