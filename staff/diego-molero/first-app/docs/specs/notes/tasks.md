# Tareas de notas por usuario

Issue: #778. Estado: desglose preparado para revisión; implementación pendiente. Las casillas siguientes no se marcan por haber redactado estos documentos.

- [ ] **N-T01:** Registrar en una copia temporal las filas y fechas de usuarios del esquema anterior y preparar los escenarios de verificación manual, sin tocar la base personal. N-08, N-09.
- [ ] **N-T02:** Escribir create-table.sql para notes y su índice; mantener la relación y borrado en cascada. N-01, N-08, N-09.
- [ ] **N-T03:** Escribir los cinco SQL de lectura/escritura parametrizados y notes.js; filtrar siempre ambos IDs en operaciones individuales. N-01 a N-05, N-07.
- [ ] **N-T04:** Declarar claves foráneas activas en cada conexión e implementar initializeDatabase con transacción, validación de columnas/clave foránea/índice y rollback, conservando createUsersTable. N-08, N-09.
- [ ] **N-T05:** Adaptar únicamente el cliente de preparación y su notebook para usar el inicializador; repetir la migración y comparar datos anteriores. N-08.
- [ ] **N-T06:** Implementar createNote con validación y comentario breve explicativo. N-01, N-06, N-07, N-10.
- [ ] **N-T07:** Implementar listNotes y findNoteById, una operación por fichero. N-02, N-03, N-06, N-07.
- [ ] **N-T08:** Implementar updateNote con cambios parciales y control de pertenencia. N-04, N-06, N-07, N-10.
- [ ] **N-T09:** Implementar deleteNote y comprobar borrado conjunto desde deleteUser, sin cambiar su firma. N-05, N-07, N-09.
- [ ] **N-T10:** Añadir los cinco ejemplos de terminal e integrar sus comandos en ejecución; documentar esquema, errores y nuevo efecto del borrado de usuarios. N-01 a N-09.
- [ ] **N-T11:** Comprobar CRUD, errores, persistencia, IDs mezclados, textos Unicode, preparación repetida, rollback y cascada en copias aisladas; incluir una tabla notes con columnas correctas pero relación sin cascada y comprobar que se rechaza. N-01 a N-10.
- [ ] **N-T12:** Revisar sintaxis, UTF-8, enlaces, árbol y notebooks sin salidas; registrar resultados y límites reales, conservando datos privados y lockfile. N-01 a N-10.

## Estado de esta entrega documental

El usuario autorizó preparar spec, plan y tareas. No se ha creado la tabla, ejecutado migraciones ni verificado los escenarios funcionales anteriores. La implementación empieza cuando Diego la solicite.

## Comprobación documental · agente · 2026-11-03

Se revisaron nueve documentos de esta entrega con lectura UTF-8 estricta y 35 enlaces locales existentes. Los dos tríos reúnen 22 criterios y 26 tareas de implementación, todas sin marcar; cada tarea enlaza criterios. El subagente de revisión detectó que CREATE IF NOT EXISTS no basta para asegurar la cascada de un esquema ya existente: el plan y las tareas se precisaron con comprobación de metadatos y el escenario de relación incorrecta. git diff --check pasó. Los cambios se limitan a docs; src, scripts, dependencias y automatización permanecen intactos. No se ha ejecutado la aplicación ni comprobado aún la migración o los escenarios funcionales.
