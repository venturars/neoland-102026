# Tareas de refactorización

Issue: #488. [Spec](./spec.md) · [Plan](./plan.md).

- [x] Mantener en `docs/STYLE.md` las reglas generales y aclarar el uso de métodos de bibliotecas; documentar en `docs/CONSTITUTIONS.md` las firmas existentes.
- [x] Separar acceso a propiedades, limpieza y validaciones en `logic/create-user.js`, `logic/update-user.js` y `logic/find-user-by-email.js`, conservando firmas, resultados y errores.
- [x] Separar la preparación de nombres y las comprobaciones de respuesta en `logic/users-gender-count.js`, conservando petición, lotes, conteos y errores.
- [x] Separar rutas, lectura de SQL y preparación y ejecución de sentencias en `queries/users.js`; separar ruta y apertura en `db/connection.js`, conservando interfaces y consultas.
- [x] Separar preparación y ejecución de la consulta en `clients/terminal/create-users-table.txt`, conservando la consulta y su salida.
- [x] Revisar el diff, ejecutar `pnpm format` y `pnpm lint`, y confirmar que solo cambiaron los archivos previstos y que `db/users.sqlite` permanece intacta.
