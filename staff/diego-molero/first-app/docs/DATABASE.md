# Base de datos

Hay una única base local, `src/db/users.sqlite`, y un singleton `db` por proceso, exportado desde `src/db/connection.js`. La ruta se resuelve junto al módulo. La base y sus archivos auxiliares se trasladan junto a la carpeta conservando sus bytes.

## Tabla users

- `id`: INTEGER PRIMARY KEY AUTOINCREMENT.
- `name`: TEXT NOT NULL.
- `email`: TEXT NOT NULL UNIQUE, normalizado por logic.
- `createdAt` y `updatedAt`: TEXT NOT NULL, fechas UTC ISO 8601 con milisegundos.

Las fechas se generan con `strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`. Actualizar conserva createdAt. No se cambia el esquema ni se convierten fechas existentes; un cambio futuro del esquema requiere migración.

## Consultas

El SQL vive en `src/queries/queries/`, una consulta por fichero. `src/queries/users.js` lo lee en UTF-8, prepara el SQL y pasa parámetros con nombre.

La preparación de tablas es explícita e idempotente. Las lecturas buscan por ID, correo o nombre completo y listan por ID ascendente. La búsqueda por nombre usa igualdad exacta, sensible a mayúsculas. Insertar y actualizar devuelven la fila; borrar informa a logic de si encontró una fila.

Las filas se convierten en objetos normales. El conflicto UNIQUE del correo se traduce a `Email is already used`, conservando la causa. Los demás fallos técnicos se propagan salvo que la operación documente su traducción.

Las bases y sus archivos auxiliares permanecen en local y no se versionan.
