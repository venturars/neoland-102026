# Tareas de notas por usuario

Issue de propuesta: #778. Implementación: #782. Las tareas se marcan únicamente con evidencia de implementación y comprobación del agente; no implican aprobación final ni merge.

- [x] **N-T01:** Registrar en una copia temporal las filas y fechas de usuarios del esquema anterior y preparar los escenarios de verificación manual, sin tocar la base personal. N-08, N-09.
- [x] **N-T02:** Escribir create-table.sql para notes y su índice; mantener la relación y borrado en cascada. N-01, N-08, N-09.
- [x] **N-T03:** Escribir los cinco SQL de lectura/escritura parametrizados y notes.js; filtrar siempre ambos IDs en operaciones individuales. N-01 a N-05, N-07.
- [x] **N-T04:** Declarar claves foráneas activas en cada conexión e implementar initializeDatabase con transacción, validación de columnas/clave foránea/índice y rollback, conservando createUsersTable. N-08, N-09.
- [x] **N-T05:** Adaptar únicamente el cliente de preparación y su notebook para usar el inicializador; repetir la migración y comparar datos anteriores. N-08.
- [x] **N-T06:** Implementar createNote con validación y comentario breve explicativo. N-01, N-06, N-07, N-10.
- [x] **N-T07:** Implementar listNotes y findNoteById, una operación por fichero. N-02, N-03, N-06, N-07.
- [x] **N-T08:** Implementar updateNote con cambios parciales y control de pertenencia. N-04, N-06, N-07, N-10.
- [x] **N-T09:** Implementar deleteNote y comprobar borrado conjunto desde deleteUser, sin cambiar su firma. N-05, N-07, N-09.
- [x] **N-T10:** Añadir los cinco ejemplos de terminal e integrar sus comandos en ejecución; documentar esquema, errores y nuevo efecto del borrado de usuarios. N-01 a N-09.
- [x] **N-T11:** Comprobar CRUD, errores, persistencia, IDs mezclados, textos Unicode, preparación repetida, rollback y cascada en copias aisladas; incluir una tabla notes con columnas correctas pero relación sin cascada y comprobar que se rechaza. N-01 a N-10.
- [x] **N-T12:** Revisar sintaxis, UTF-8, enlaces, árbol y notebooks sin salidas; registrar resultados y límites reales, conservando datos privados y lockfile. N-01 a N-10.

## Historial de la entrega documental, anterior a la implementación

El usuario autorizó preparar spec, plan y tareas. No se ha creado la tabla, ejecutado migraciones ni verificado los escenarios funcionales anteriores. La implementación empieza cuando Diego la solicite.

## Comprobación documental · agente · 2026-11-03

Se revisaron nueve documentos de esta entrega con lectura UTF-8 estricta y 35 enlaces locales existentes. Los dos tríos reúnen 22 criterios y 26 tareas de implementación, todas sin marcar; cada tarea enlaza criterios. El subagente de revisión detectó que CREATE IF NOT EXISTS no basta para asegurar la cascada de un esquema ya existente: el plan y las tareas se precisaron con comprobación de metadatos y el escenario de relación incorrecta. git diff --check pasó. Los cambios se limitan a docs; src, scripts, dependencias y automatización permanecen intactos. No se ha ejecutado la aplicación ni comprobado aún la migración o los escenarios funcionales.

## Implementación autorizada · 2026-11-03 · Issue #782

Diego solicitó continuar con la persistencia y lógica de notas tras recibir los documentos. Autoriza implementar, comprobar y entregar este bloque con sus clientes de terminal y el notebook de preparación. Se conserva el registro documental previo; no se atribuye una revisión individual distinta de esa autorización. El cliente web sigue fuera de este bloque. La PR de implementación depende de las specs de la PR #781 mientras no estén integradas.

N-T01 comprobada por el principal: copia nueva bajo .venv/notes-check-20261103-qyqt6ddf, sin copiar users.sqlite personal. Esquema users anterior preparado con dos filas (IDs 7 y 12); filas y fechas registradas para comparar tras migrar.

## Resultados de implementación · agente · 2026-11-03

- N-T02–N-T04: tabla e índice añadidos mediante SQL parametrizado y módulo de consultas. Migración transaccional con comprobación de columnas, fechas por defecto, clave foránea y orden del índice. La conexión declara enableForeignKeyConstraints en cada proceso. Revisión estática del subagente sin hallazgos.
- N-T05–N-T09: cinco operaciones de notas implementadas con datos directos y Error ordinario. Preparación de terminal y notebook adaptada. El principal ejecutó 144 comprobaciones de contratos sobre la copia temporal: datos normalizados, contenido Unicode conservado, campos públicos, listados, cambios parciales, fechas, entradas inválidas, usuario/nota ausentes e IDs mezclados; se verificaron también las consultas individuales directamente.
- N-T08/N-T11: migración repetida preservó las filas, IDs y fechas de los dos usuarios del esquema anterior. Otra ejecución Node recuperó las notas guardadas. Se verificó que importar no crea tablas y que la preparación de una base nueva y la repetida funciona.
- N-T09/N-T11: trigger de borrado bloqueado provocó error y conservó usuario y notas, probando atomicidad; el borrado posterior eliminó solo las notas del usuario elegido. Otra nota y usuario permanecieron. PRAGMA foreign_key_check vacío. La siguiente alta de usuario conservó la secuencia anterior (ID 13).
- N-T11: tres esquemas de notas incompatibles (sin cascada, fecha por defecto incorrecta e índice invertido) fueron rechazados sin modificar sus datos. Un cuarto escenario conservó el esquema anterior completo: la tabla users y el índice creados durante la preparación fallida desaparecieron tras rollback. No se reconstruyen tablas incompatibles.
- N-T10: instalación aislada con lockfile congelado y modo offline, reutilizando siete versiones existentes con pnpm 11.25.0. El primer intento de Corepack dentro del sandbox no accedió al registro; el reintento con acceso permitido terminó sin descargar paquetes de la app ni cambiar versiones.
- N-T10/N-T12: ejecutados 12 comandos distintos de preparación/usuarios/notas mediante pnpm real, además de repetir create-note y ejecutar delete-user para verificar cascada entre procesos. La celda Python del notebook de preparación ejecutó Node real desde su carpeta aislada y mostró users y notes. Se ejecutó como celda extraída, sin arrancar servidor ni kernel Jupyter; no se presenta como comprobación de una sesión Jupyter completa.
- Sintaxis de los 17 módulos JavaScript y las celdas de los nueve notebooks correcta. Los notebooks originales conservan contadores nulos y ninguna salida. El hash de la base personal se conserva; el clasificador no se repitió. Comprobación real en Windows con Node 24.14.1; Linux y macOS pendientes. No se añaden paquetes ni suite de tests y no se han arrancado procesos persistentes.

### Relación de criterios y evidencia

| Criterios | Comprobación real |
| --- | --- |
| N-01 a N-05 | CRUD, campos devueltos, listados por ID, cambios parciales, fechas y borrado; clientes de terminal reales. |
| N-06 y N-07 | Matrices de entradas inválidas y usuarios/notas ausentes, IDs mezclados en logic y consultas; sin cambios tras rechazos. |
| N-08 | Esquema anterior migrado dos veces y cotejado; base nueva; recuperación desde otro proceso; esquema incompatible con rollback. |
| N-09 | Cascada desde logic y cliente de usuario en proceso distinto; trigger con fallo y conservación del usuario y sus notas; otro usuario intacto. |
| N-10 | Tildes, emoji, espacios, salto de línea y contenido con aspecto de HTML conservados exactamente como texto. La presentación web queda pendiente. |

N-T12 cerrada: 33 archivos de implementación previstos revisados en UTF-8 estricto; 43 enlaces locales resueltos, imports y sintaxis válidos, árbol actualizado y nueve notebooks originales sin salidas. git diff --check sin incidencias. Lockfile, automatización, specs web y hash de base personal conservados. La entrega Git y su PR se realizan después de este registro y se verifican por separado; revisión humana y merge quedan pendientes.
