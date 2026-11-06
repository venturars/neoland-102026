# Documentación OpenAPI en el cliente Nest

Issue: #1121.

Como quien prueba first-app, quiero abrir `http://127.0.0.1:3003` en el navegador y usar Swagger UI para crear, listar, ver, modificar y borrar usuarios, para comprobar la API Nest sin montar cada petición a mano.

Arranco la base como siempre y `pnpm nest`. La misma URL que ya imprime la terminal muestra Swagger UI en la raíz. Desde ahí ejecuto las cinco operaciones y veo la respuesta de cada una.

No cambia las reglas de negocio, las consultas, los datos guardados ni el resto de clientes. Los mensajes visibles siguen siendo los de la logic (`Name is empty`, `Email is invalid`, `Email is already used`, `User not found`, los `Could not …`).

Entradas y salidas igual que en el cliente Nest de la issue #1016: crear pide `name` y `email` (201); listar no pide nada (200); ver, modificar y borrar piden `id`; en patch, un campo omitido conserva el valor; borrar devuelve 204 sin cuerpo.

Ejemplo en la UI: crear con nombre y correo nuevos, listar, abrir por `id`, cambiar solo el nombre, borrar y comprobar 404 al volver a abrir.

Queda fuera contraseña, auth, permisos, contar por género, búsquedas extra, reglas o mensajes nuevos, tocar `logic/`, `queries/`, `db/`, TypeScript y paquetes de validación opcionales de Nest.
