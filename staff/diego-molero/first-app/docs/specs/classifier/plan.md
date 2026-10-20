# Plan — clasificador de géneros

**Estado:** documentación preparada; implementación pendiente.

## Etapas

1. **Activa:** separar la apertura de la conexión de la creación explícita de la
   tabla y acercar esa parte de la estructura a la PR.
2. **Pendiente:** concretar el modelo local, su integración y la operación de
   clasificación, respetando la independencia de la lógica y los resultados
   `{ ok, ... }` del proyecto.
3. **Pendiente:** añadir el cliente y las pruebas del clasificador completo.

Este documento detalla solo la etapa 1. La
[PR #139](https://github.com/venturars/neoland-102026/pull/139), revisada en el
commit `57af803c149e300e7f1a9bdc6799914a17152297`, es la referencia de estructura.

## Punto de partida

`openDatabase` abre SQLite y ejecuta automáticamente `db/schema.sql`.
`createApp` llama a esa función y construye el repositorio. El cliente
`clients/terminal/init-db.js` utiliza la aplicación para preparar la base.

La tabla ya existe en las bases inicializadas. Esta etapa extrae ese
comportamiento: no reconstruye tablas ni elimina usuarios. Los ejemplos actuales
que orientan el cambio son `db/connection.js` y el cliente de inicialización.

## Diseño de la etapa 1

- Mover el SQL actual a `queries/queries/create-users-table.sql`. Mantener
  `CREATE TABLE IF NOT EXISTS`, `AUTOINCREMENT`, el correo único y las fechas UTC.
  Retirar `db/schema.sql` al cambiar sus consumidores, evitando dos fuentes de
  verdad. No se añade ninguna columna de clasificación.
- Crear `queries/users.js` con `createUsersTable(db)`. Recibe una conexión SQLite
  abierta, lee el SQL en UTF-8 con una ruta relativa al módulo y lo ejecuta.
  Devuelve `undefined`; los errores de lectura o ejecución se propagan. No abre
  ni cierra conexiones y no aplica reglas de negocio.
- Dejar `openDatabase(databasePath)` únicamente como apertura de la conexión.
  Abrir una base no creará la tabla automáticamente.
- Ampliar `createApp` para aceptar `createApp({ db })`, además de la opción actual
  `databasePath`. Recibir ambas opciones será un error. La aplicación asume el
  cierre de la conexión recibida al llamar a `close()` y también la cierra si
  falla la construcción del repositorio. No crea la tabla ni intenta corregir
  automáticamente una base sin inicializar.
- Crear `clients/terminal/create-users-table.js` y sustituir el cliente
  `init-db.js`. El nuevo cliente abre la conexión predeterminada, crea la tabla,
  muestra su confirmación y ruta solo tras el éxito y cierra la conexión en
  `finally`. `npm run db:init` apuntará a este cliente y conservará su nombre.
- Adaptar la demo y las pruebas: abrir su base aislada, inicializarla y pasar la
  misma conexión a `createApp({ db })`. Si la inicialización falla antes de
  transferir la conexión a la aplicación, el cliente debe cerrarla.

El repositorio conserva sus operaciones y el SQL del CRUD durante esta etapa.
La separación del resto de consultas se abordará más adelante. `logic/` mantiene
sus contratos y no importa la nueva capa de consultas.

## Archivos previstos para la implementación

- Crear: `queries/queries/create-users-table.sql`, `queries/users.js` y
  `clients/terminal/create-users-table.js`.
- Modificar: `db/connection.js`, `app.js`, `package.json`, la demo y las pruebas
  de integración afectadas. Actualizar README, constitución y AGENTS al reflejar
  el comportamiento implementado.
- Retirar: `db/schema.sql` y `clients/terminal/init-db.js`, una vez sustituidas
  todas sus referencias.

En esta entrega se escriben solo documentos; esa lista no implica cambios de
código ya realizados. No se instalan dependencias ni se configura un modelo.

## Comprobaciones de la etapa 1

- **E1-01:** abrir una base vacía no crea la tabla `users`.
- **E1-02:** inicializarla crea los cinco campos actuales, la clave primaria,
  las restricciones obligatorias, el correo único y las fechas UTC.
- **E1-03:** repetir la inicialización conserva usuarios, identificadores y fechas,
  también después de cerrar y volver a abrir una base de archivo.
- **E1-04:** el CRUD y la búsqueda por correo siguen funcionando tras inicializar
  explícitamente la base. Los contratos existentes se mantienen.
- **E1-05:** demo y pruebas usan bases aisladas y reutilizan la conexión
  inicializada. La nueva opción de `createApp` y su cierre quedan probados.
- **E1-06:** un fallo de creación se propaga, el cliente libera la conexión y no
  imprime una confirmación de éxito.

Las pruebas usarán SQLite en memoria o archivos temporales. Se ejecutarán
`npm test` y `npm run demo`; el flujo de inicialización se comprobará con una
base temporal, sin usar `db/users.sqlite` como base de prueba.

Estas comprobaciones validan la preparación de la tabla. Los criterios CA-01 a
CA-06 de la spec seguirán pendientes hasta implementar el clasificador.
