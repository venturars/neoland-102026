# Tareas — clasificador de géneros, etapa 1

**Estado:** documentos preparados. Todas las tareas de implementación están
pendientes. Esta lista cubre solo la creación explícita de la tabla.

- [ ] **1. Extraer el SQL.** Mover `db/schema.sql` a
  `queries/queries/create-users-table.sql`, conservando exactamente el esquema.
  Comprobar los cinco campos, las restricciones y las fechas UTC. (E1-02)

- [ ] **2. Añadir la operación de consultas.** Crear `createUsersTable(db)` en
  `queries/users.js`; leer el SQL relativo al módulo en UTF-8 y ejecutarlo.
  No devolver datos ni abrir o cerrar conexiones. (E1-02, E1-03, E1-06)

- [ ] **3. Separar la conexión.** Quitar la ejecución del esquema de
  `db/connection.js`. Comprobar en una base vacía que abrirla no crea `users`.
  (E1-01)

- [ ] **4. Adaptar la aplicación.** Aceptar una conexión inicializada con
  `createApp({ db })`, rechazar combinarla con `databasePath` y respetar el cierre
  y los errores definidos en el plan. (E1-04, E1-05)

- [ ] **5. Añadir el cliente.** Crear `clients/terminal/create-users-table.js`
  y sustituir el cliente anterior en `npm run db:init`. Confirmar el éxito solo
  después de crear la tabla y cerrar la conexión en `finally`. (E1-06)

- [ ] **6. Adaptar la demo.** Inicializar su base en memoria antes de construir
  la aplicación y reutilizar la misma conexión. Comprobar que se mantienen
  las operaciones y los resultados mostrados. (E1-04, E1-05)

- [ ] **7. Ajustar las pruebas.** Inicializar explícitamente las bases de
  integración y añadir comprobaciones E1-01 a E1-06, incluida la conservación
  de datos y el cierre de recursos ante errores.

- [ ] **8. Retirar referencias antiguas.** Eliminar `db/schema.sql` y el cliente
  `init-db.js` tras sustituir sus consumidores. Buscar referencias para comprobar
  que solo queda una ubicación del SQL de creación.

- [ ] **9. Actualizar la documentación.** Reflejar en README, constitución y
  AGENTS la inicialización explícita, el comando y el uso de `createApp({ db })`.
  Mantener el clasificador marcado como pendiente.

- [ ] **10. Verificar y registrar.** Ejecutar `npm test`, `npm run demo` y probar
  el flujo de inicialización con una base temporal. Revisar UTF-8 y el diff;
  registrar resultados reales sin marcar los criterios del clasificador completo.
