# Plan — buscar usuarios por nombre

Autora: Jimena Durán. Issue: #219. Estado: implementación autorizada.

## Arquitectura y referencias

`clients/terminal/` llama a `logic/`, que valida, consulta y limpia la salida.
`queries/users.js` carga SQL y ejecuta sentencias con la conexión única de
`db/connection.js`. Esta conexión abre únicamente `db/users.sqlite`.

Referencias de esta aplicación, sin copiar implementaciones:
`find-user-by-email.js` valida y traduce fallos de consulta;
`find-user-by-id.js` devuelve un usuario o lanza `User not found`;
`list-users.js` transforma todas las filas y admite una lista vacía.
Las búsquedas únicas usan `.get()`; esta operación necesita `.all()`.

## Archivos y firma

- Crear `logic/find-users-by-name.js`: exportar solo `findUsersByName(name)`.
- Crear `queries/queries/find-by-name.sql` con SQL parametrizado.
- Ampliar `queries/users.js` para cargarlo y exportar `findByName(name)`.
- Crear `clients/terminal/find-users-by-name.txt`, ejecutable desde first-app
  mediante PowerShell y Node, como el cliente de búsqueda por email.
- No modificar otras operaciones de lógica ni la conexión o el esquema.

La función recibe una cadena y devuelve una lista de objetos con solo
id, name, email, createdAt y updatedAt. Comprueba `name.trim()` para rechazar
vacíos, pero consulta el valor original para preservar la coincidencia exacta.

SQL propuesto: `SELECT * FROM users WHERE name = :name`.
La consulta usa `.all({ name })`; no se añade un requisito de orden.

## Errores y comprobación prevista

| Caso | Resultado |
| --- | --- |
| Cadena vacía o solo espacios | `Name is empty` |
| Fallo de SQLite durante la consulta | `Could not find the user` |
| Ninguna coincidencia | `[]`, sin `User not found` |
| Una o varias coincidencias | Lista con los cinco campos definidos |

Comprobar con el cliente coincidencias múltiples, ninguna coincidencia,
cadena vacía, espacios y diferencias de mayúsculas, acentos y espacios.
Comprobar la traducción de un fallo de lectura de forma controlada, sin
alterar la base de datos personal ni crear conexiones alternativas.

## Decisión aprobada

La constitución aclara que las operaciones que devuelven listas retornan
`[]` cuando no hay resultados. La contradicción queda resuelta.
