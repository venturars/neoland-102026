# Plan de notas por usuario

Issue: #778. Propuesta técnica para revisión; ninguna migración ni operación nueva está ejecutada.

## Capas y contratos

Aplican la [constitución](../../CONSTITUTIONS.md), la [arquitectura](../../ARCHITECTURE.md) y el [estilo](../../STYLE.md). Una operación por archivo de src/logic, llamadas directas a queries, datos ordinarios y Error sin códigos ni clases propios. Todas las funciones son síncronas.

| Operación | Resultado |
| --- | --- |
| createNote(userId, { title, content }) | Nota creada |
| listNotes(userId) | Lista de notas por ID ascendente |
| findNoteById(userId, noteId) | Nota |
| updateNote(userId, noteId, changes) | Nota actualizada |
| deleteNote(userId, noteId) | Sin valor de retorno |

Cada nota pública contiene id, userId, title, content, createdAt y updatedAt. No se modifica userId mediante cambios. Las operaciones residen en create-note.js, list-notes.js, find-note-by-id.js, update-note.js y delete-note.js. Cada una valida y llama a src/queries/users.js y src/queries/notes.js, sin introducir repositorios, adaptadores ni helpers genéricos.

## Persistencia y migración aditiva

Conservar el singleton y la ubicación src/db/users.sqlite. Declarar explícitamente enableForeignKeyConstraints: true al abrir cada conexión en connection.js, antes de cualquier transacción. Importar abre la conexión como ahora, pero nunca crea tablas.

Crear notes con id INTEGER PRIMARY KEY AUTOINCREMENT; userId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE; title y content TEXT NOT NULL; createdAt y updatedAt con el mismo formato UTC y valor inicial que users. Añadir índice (userId, id). Listar filtra userId y ordena id ASC. Las consultas individuales filtran siempre userId e id, también UPDATE y DELETE. Insertar/actualizar devuelven la fila; eliminar devuelve a logic si se encontró la fila.

El SQL parametrizado se guarda en src/queries/queries/notes/: create-table.sql, find-all.sql, find-by-id.sql, insert.sql, update.sql y remove.sql. src/queries/notes.js carga ese SQL en UTF-8 y convierte filas en objetos normales.

Añadir src/queries/initialize-database.js con initializeDatabase(), sin retorno: abre una transacción, llama al createUsersTable existente y a createNotesTable de notes.js, y confirma; ante error hace rollback y propaga la causa. La creación de notes y de su índice constituye la primera migración aditiva de esta ampliación, mediante CREATE TABLE/INDEX IF NOT EXISTS. No se recrea users, no se alteran sus columnas ni se renumeran sus IDs. No se añade un sistema genérico de migraciones. Después del DDL y antes de confirmar, initializeDatabase comprueba dentro de la misma transacción PRAGMA table_info(notes) y PRAGMA foreign_key_list(notes): columnas, tipos, nulabilidad y clave primaria descritos, además de userId → users.id con ON DELETE CASCADE. Comprueba asimismo el índice por (userId, id). Si la tabla existente no cumple ese contrato, lanza Error("Notes schema is incompatible") y hace rollback; no borra ni repara silenciosamente. En particular, una tabla con columnas correctas pero sin la relación de cascada se rechaza.

El comando de preparación actual y el notebook create-users-table pasarán a llamar a initializeDatabase. createUsersTable conserva su función pública anterior. deleteUser y su SQL mantienen su firma y funcionamiento; la clave foránea hace atómico el borrado conjunto. Registrar ese nuevo efecto en las specs de usuarios y las guías durante la implementación.

## Validaciones y errores

Crear: validar userId, objeto plano no nulo ni array y campos admitidos, existencia del usuario, título y contenido. Se exigen ambos textos al crear; title.trim() no puede estar vacío, content conserva sus bytes de texto sin trim. Listar: validar userId y existencia. Consultar/borrar: validar userId, noteId, usuario y nota del mismo usuario. Actualizar: validar ambos IDs, objeto/campos admitidos, al menos un campo distinto de undefined, existencia del usuario y nota, y validar los valores finales. undefined conserva el campo; null es inválido.

Mensajes: User ID is invalid; Note ID is invalid; Input is invalid; No changes provided; User not found; Note not found; Note title is invalid; Note content is invalid. Los fallos técnicos se propagan. Actualizar conserva createdAt y genera updatedAt en UTC; dos escrituras dentro del mismo milisegundo pueden compartir fecha. No se aceptan fechas ni IDs en el objeto de entrada.

## Clientes, documentación y comprobación

Añadir cinco ejemplos sencillos en src/clients/terminal, uno por operación, con importar, llamar y mostrar. Reunir los futuros comandos únicamente en la sección de ejecución de la constitución. No se añaden notebooks de notas en esta entrega funcional; se adapta solo el de preparación existente. Actualizar DATABASE, ERRORS, arquitectura, árbol, contratos de usuarios y sus tareas con evidencia de la ampliación. No añadir dependencias ni suite de tests.

En una copia temporal sin la base personal: preparar una base nueva y otra con usuarios del esquema anterior, guardar sus filas/fechas, migrar dos veces y cotejarlas; recorrer CRUD con dos usuarios; mezclar IDs para comprobar ausencia de acceso cruzado; reiniciar; observar errores y borrado en cascada; provocar un fallo de preparación en un esquema incompatible para comprobar rollback. Conservar evidencia real en tasks y parar procesos propios.

## Fuentes técnicas

La [documentación de node:sqlite para Node 24.14.0](https://github.com/nodejs/node/blob/v24.14.0/doc/api/sqlite.md) describe DatabaseSync, la opción de claves foráneas y exec. La implementación debe usar la versión mínima declarada por el proyecto, sin actualizar paquetes.
