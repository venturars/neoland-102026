# Plan de refactorización

Issue: #488. Spec: [spec.md](./spec.md).

## Archivos y cambios

- `logic/create-user.js`, `logic/update-user.js` y `logic/find-user-by-email.js`: separar acceso a propiedades, limpieza y validaciones en pasos de una acción. Mantener `createUser(input)`, `updateUser(id, changes)` y `findUserByEmail(email)`, incluidas las reglas de `undefined`, duplicados y errores actuales.
- `logic/users-gender-count.js`: separar la preparación de nombres y las comprobaciones de la respuesta del modelo. Conservar lotes de seis, modelo, petición, conteos, tratamiento de respuestas inválidas y errores.
- `queries/users.js`: separar la construcción de rutas, lectura de SQL y preparación y ejecución de sentencias. Mantener exportaciones, firmas, parámetros con nombre, archivos SQL y valores devueltos.
- `db/connection.js`: separar la obtención de la ruta y la apertura de la base de datos. Mantener la exportación `db` y su ubicación actual.
- `clients/terminal/create-users-table.txt`: separar la preparación y ejecución de la consulta del ejemplo; conservar su consulta y salida.
- `docs/STYLE.md`: conservar las reglas generales y aclarar el uso de métodos de bibliotecas.
- `docs/CONSTITUTIONS.md`: documentar las firmas existentes `createUser(input)` y `updateUser(id, changes)`.

Los demás archivos no presentan cambios necesarios para este alcance. No se crean ni eliminan archivos de la aplicación; no cambian SQL, dependencias, mensajes de error ni la base local.

## Compatibilidad con las guías

`docs/STYLE.md` establece las convenciones generales de estilo y prohíbe definir clases, utilizar `this` y crear métodos propios. Se permiten las instancias y llamadas a métodos de bibliotecas existentes. Las firmas `createUser(input)` y `updateUser(id, changes)` se documentan en `docs/CONSTITUTIONS.md`, evitando duplicarlas en la guía de estilo.

## Comprobación

Revisar el diff para confirmar las mismas firmas, consultas, resultados y errores; ejecutar `pnpm format` y `pnpm lint` sobre el proyecto y comprobar que solo cambien los archivos previstos. No ejecutar operaciones que escriban en `db/users.sqlite`.