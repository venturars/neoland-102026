# Plan: Buscar usuarios por nombre

Implementa [spec.md](spec.md). Respeta [CONSTITUTIONS.md](../../CONSTITUTIONS.md) y sus guías. Sin paquetes nuevos ni cambios en la tabla.

## Ficheros
```
src/queries/users.js                          función nueva: selectUsersByName
src/logic/find-user-by-name.js                NUEVO
src/clients/terminal/find-user-by-name.txt    NUEVO
src/clients/jupyter/find-user-by-name.ipynb   NUEVO
docs/ARCHITECTURE.md, docs/TREE.md, docs/ERRORS.md, AGENTS.md
```
Se parece a `find-user-by-email.js` (validar la entrada) y a `list-users.js` (devolver una lista).

## Firma
`findUserByName(name)` → lista de `{ id, name, email, createdAt, updatedAt }`.

## SQL
```js
export function selectUsersByName(name) {
  const statement = connection.prepare(
    "SELECT * FROM users WHERE name = ? ORDER BY id",
  );
  return statement.all(name);
}
```
En SQLite, `=` sobre texto distingue mayúsculas: `Ana` no coincide con `ana`.

## `src/logic/find-user-by-name.js`
1. `let trimmedName = "";` y, si `typeof name === "string"`, `trimmedName = name.trim();`.
2. Si `trimmedName === ""`, `throw new Error("Name is required.")`.
3. `const rows = selectUsersByName(trimmedName);`.
4. Un `for...of` construye cada usuario en camelCase con `push`, como `list-users.js`.
5. Devuelve la lista.

| Fallo de la spec | Mensaje |
|---|---|
| Nombre vacío o que no es texto | `Name is required.` |

## Clientes
- `.txt`: como `find-user-by-email.txt`, con `findUserByName('Ana')` y `console.log('Users found:', users)`.
- Notebook: como `list-users.ipynb`, con `findUserByName("Ana")`. Si la lista está vacía, después de los encabezados escribe `No users with that name.` Anotación: la coincidencia es exacta y distingue mayúsculas. Se guarda con el resultado de su ejecución.

## Guías
- `ARCHITECTURE.md`: el fichero nuevo y `selectUsersByName` en la lista de `queries/users.js`.
- `TREE.md`: `find-user-by-name.js` en `src/logic/`.
- `ERRORS.md`: `findUserByName` en la fila de `Name is required.`
- `AGENTS.md`: el comando nuevo en «Comandos».

## Cómo se prueba
Con dos usuarios temporales que se llaman igual (`Tmp Repetido`, `tmp-718-1@example.com` y `tmp-718-2@example.com`):
- `Tmp Repetido` y `  Tmp Repetido  ` dan los dos, por id.
- `tmp repetido` y `Tmp` dan una lista vacía.
- `""`, sin argumento y `123` dan `Error: Name is required.`
- El notebook, con un nombre que existe y con uno que no.
- Se borran los temporales. Las demás operaciones dan lo mismo que antes.
- `pnpm format` sin cambios y `pnpm lint` sin errores.
