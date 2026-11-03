# Base de datos

Hay una única base local, `src/db/users.sqlite`, y un singleton `db` por proceso, exportado desde `src/db/connection.js`. La ruta se resuelve junto al módulo. La base y sus archivos auxiliares se trasladan junto a la carpeta conservando sus bytes.

## Tabla users

- `id`: INTEGER PRIMARY KEY AUTOINCREMENT.
- `name`: TEXT NOT NULL.
- `email`: TEXT NOT NULL UNIQUE, normalizado por logic.
- `createdAt` y `updatedAt`: TEXT NOT NULL, fechas UTC ISO 8601 con milisegundos.

Las fechas se generan con `strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`. Actualizar conserva createdAt. La migración aditiva de notas conserva la tabla users y sus fechas existentes.

## Consultas

El SQL vive en `src/queries/queries/`, una consulta por fichero. `src/queries/users.js` lo lee en UTF-8, prepara el SQL y pasa parámetros con nombre.

La preparación de tablas es explícita e idempotente. Las lecturas buscan por ID, correo o nombre completo y listan por ID ascendente. La búsqueda por nombre usa igualdad exacta, sensible a mayúsculas. Insertar y actualizar devuelven la fila; borrar informa a logic de si encontró una fila.

Las filas se convierten en objetos normales. El conflicto UNIQUE del correo se traduce a `Email is already used`, conservando la causa. Los demás fallos técnicos se propagan salvo que la operación documente su traducción.

Las bases y sus archivos auxiliares permanecen en local y no se versionan.

## Tabla notes y migración de la issue #782

notes contiene id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, title y content TEXT NOT NULL y las dos fechas UTC con el mismo formato que users. userId referencia users.id con ON DELETE CASCADE; el índice notes_user_id ordena por (userId, id).

initializeDatabase prepara ambas tablas y el índice con CREATE IF NOT EXISTS dentro de una transacción. Comprueba columnas, tipos, nulabilidad, clave primaria, valores iniciales de las fechas, relación de cascada e índice; un esquema incompatible se rechaza y deshace la preparación. Importar módulos no prepara tablas. createUsersTable conserva su función original de preparar solamente users para los clientes que ya la utilicen.

La conexión activa claves foráneas en cada proceso. Borrar un usuario elimina sus notas de forma atómica; el resto permanece. Las consultas individuales de notas usan userId e id juntos incluso para actualizar o borrar; una nota no cambia de usuario. Las fechas de creación se conservan al modificar, y updatedAt se genera en la escritura. Las operaciones y su orden de validación están en el [plan de notas](specs/notes/plan.md).
