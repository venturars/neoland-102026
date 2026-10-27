# Plan de refactorización

Issue: #488. Spec: [spec.md](./spec.md).

## Archivos y cambios

- `logic/create-user.js`, `logic/update-user.js` y `logic/find-user-by-email.js`: separar acceso a propiedades, limpieza y validaciones en pasos de una acción. Mantener `createUser(input)`, `updateUser(id, changes)` y `findUserByEmail(email)`, incluidas las reglas de `undefined`, duplicados y errores actuales.
- `logic/users-gender-count.js`: separar la preparación de nombres y las comprobaciones de la respuesta del modelo. Conservar lotes de seis, modelo, petición, conteos, tratamiento de respuestas inválidas y errores.
- `queries/users.js`: separar la construcción de rutas, lectura de SQL y preparación y ejecución de sentencias. Mantener exportaciones, firmas, parámetros con nombre, archivos SQL y valores devueltos.
- `db/connection.js`: separar la obtención de la ruta y la apertura de la base de datos. Mantener la exportación `db` y su ubicación actual.
- `clients/terminal/create-users-table.txt`: separar la preparación y ejecución de la consulta del ejemplo; conservar su consulta y salida.
- `docs/STYLE.md`: aclarar las excepciones necesarias para describir las firmas existentes y el uso de métodos de bibliotecas, sin cambiar las demás reglas.

Los demás archivos no presentan cambios necesarios para este alcance. No se crean ni eliminan archivos de la aplicación; no cambian SQL, dependencias, mensajes de error ni la base local.

## Contradicciones que requieren decisión

`docs/STYLE.md` pide argumentos directos y prohíbe clases y métodos, mientras el código vigente usa `createUser(input)`, `updateUser(id, changes)`, `new OpenAI`, `new DatabaseSync` y métodos de bibliotecas. La spec exige conservar firmas y comportamiento. Se propone aclarar la guía para admitir esas firmas y llamadas existentes; la prohibición de definir clases, usar `this` y definir métodos propios sigue vigente. Esta interpretación requiere aprobación antes de implementar.

## Comprobación

Revisar el diff para confirmar las mismas firmas, consultas, resultados y errores; ejecutar `pnpm format` y `pnpm lint` sobre el proyecto y comprobar que solo cambien los archivos previstos. No ejecutar operaciones que escriban en `db/users.sqlite`.
