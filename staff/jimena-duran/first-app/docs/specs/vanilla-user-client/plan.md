Issue: #757

# Plan del cliente vanilla de usuarios

Estado: spec, plan y T01–T18 aprobados. Implementación y comprobaciones realizadas; pendiente de revisión humana. Commit selectivo, push y PR draft contra staging autorizados en la rama existente; sin revisores ni merge. Evidencia en [verification.md](verification.md).

## Base y conexión mínima

Rama `757-feat-vanilla-user-client`, creada desde staging actualizado en `50094711`. Las rutas siguientes son relativas a first-app. Estado inicial antes de implementar: inspección de código y documentación, sin ejecutar funciones sobre la base local.

En el estado inicial no existían cliente web ni servidor de usuarios en esta aplicación. Las funciones de usuarios dependen de queries y, finalmente, de `node:sqlite`, `node:fs` y una conexión local: el navegador no puede importarlas directamente.

Incorporar un servidor local con `node:http` que sirva los tres archivos web y una API pequeña en el mismo origen. El navegador usa HTML, CSS y JavaScript vanilla con fetch relativo. Flujo: navegador → cliente HTTP → lógica existente → consultas existentes → conexión única. No introducir servicios, frameworks, CORS separado ni otra capa de negocio.

El menú del usuario contiene únicamente «Volver» y «Modificar usuario». No se añaden controles deshabilitados ni pantallas alternativas.

## Funciones y contratos reutilizados

| Función existente         | Resultado y responsabilidad                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `listUsers()`             | Lista ordenada por ID, o `[]`; cada usuario contiene id, name, email, createdAt y updatedAt.            |
| `findUserById(id)`        | Usuario limpio o `User not found`; recibe el ID convertido a número por el transporte.                  |
| `updateUser(id, changes)` | Usuario actualizado; conserva campos omitidos y aplica validación, normalización y unicidad existentes. |
| `deleteUser(id)`          | Sin valor de retorno; comprueba existencia antes de borrar.                                             |

Conservar firmas y código en `src/logic/`, consultas y `src/db/connection.js`. Las referencias locales de presentación son los cuatro clientes terminal de esas operaciones; siguen siendo sus primeros clientes y no requieren otro envoltorio de lógica. Los notebooks permanecen intactos.

SQL reutilizado, sin archivos nuevos ni modificaciones: `SELECT * FROM users ORDER BY id`, búsqueda `WHERE id = :id`, actualización con `:id`, `:name`, `:email` y fecha existente, y `DELETE FROM users WHERE id = :id`. El transporte y el navegador no ejecutan SQL ni abren conexiones alternativas.

## API propuesta

| Petición                | Lógica invocada           | Respuesta correcta                                                 |
| ----------------------- | ------------------------- | ------------------------------------------------------------------ |
| `GET /api/users`        | `listUsers()`             | 200, lista JSON sin envoltorio.                                    |
| `GET /api/users/:id`    | `findUserById(id)`        | 200, usuario JSON.                                                 |
| `PATCH /api/users/:id`  | `updateUser(id, changes)` | 200, usuario actualizado; campos name/email enviados como cadenas. |
| `DELETE /api/users/:id` | `deleteUser(id)`          | 204, sin cuerpo.                                                   |

El adaptador convierte y comprueba el ID, interpreta el JSON y comprueba su forma y tipos antes de llamar a la lógica, que presupone entradas apropiadas. No replica la validación del nombre o correo. Solo sirve las rutas estáticas previstas; no publica el árbol del proyecto ni el archivo SQLite.

Errores como texto plano con los mensajes exactos de `docs/ERRORS.md`: nombre vacío y correo inválido → 400; correo usado → 409; usuario inexistente o ID no válido → 404 `User not found`; fallo de operación → 500 con su `Could not ...` correspondiente. JSON o tipos inválidos en modificación → 400 `Could not update the user`. Ante fallo de red, la pantalla usa el mensaje de operación correspondiente. No cambiar el catálogo ni devolver errores internos de SQLite.

## Archivos previstos

| Ruta                                                 | Alcance                                                                                                                                                                                                    |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/clients/web/index.html`, `styles.css`, `app.js` | Lista, menú y edición; estado de selección en memoria, navegación, confirmación de borrado y mensajes. Etiquetas y botones semánticos; datos mostrados como texto. Validaciones de negocio en el servidor. |
| `src/clients/http/create-user-client-server.js`      | Nueva función `createUserClientServer()` que devuelve el servidor: archivos estáticos y traducción de las cuatro operaciones HTTP a lógica, sin reglas de negocio propias.                                 |
| `src/clients/http/start-user-client.js`              | Arranque local en `127.0.0.1:3000`. Comprobar que existe la base esperada antes de importar el servidor y su lógica; no crear, mover ni migrar una base como efecto del arranque.                          |
| `tests/vanilla-user-client.test.js`                  | Pruebas del transporte con `node:test` y una copia desechable de la aplicación. Sin dependencias adicionales.                                                                                              |
| `package.json`                                       | Solo un comando `start:vanilla` para el arranque; dependencias y versiones intactas.                                                                                                                       |
| `eslint.config.js`                                   | Declarar únicamente los globals necesarios de los nuevos clientes, sin relajar las reglas existentes.                                                                                                      |
| `AGENTS.md`, `docs/TREE.md`, `docs/ARCHITECTURE.md`  | Añadir comando, archivos y responsabilidad del cliente HTTP/web. Conservar el SDD y las cuatro capas.                                                                                                      |
| `docs/VANILLA-CLIENT.md`                             | Uso local desde PowerShell, selección sin autenticación y requisito de conservar la base existente.                                                                                                        |

No hay paquetes nuevos ni cambios de versión, por lo que no se activa una revisión de dependencias nuevas con Socket. No tocar la conexión única ni ejecutar la inicialización de tablas automáticamente.

## Comprobación prevista tras autorizar implementación

- Copia temporal que excluya SQLite real y sus auxiliares; crear allí usuarios ficticios con el esquema existente y cerrar la conexión de preparación antes de arrancar la copia. Nunca importar la lógica del checkout real para estas pruebas.
- Probar lista vacía y ordenada, selección y consulta por ID, modificación válida, nombre vacío, correo inválido o duplicado, usuario ausente y borrado. Comprobar respuestas, mensajes, forma de petición inválida y conservación de otros usuarios; usar los errores existentes para fallos controlados.
- Recorrer lista → menú → edición, volver sin guardar, guardar y confirmar/cancelar eliminación. Comprobar mensajes, menú de exactamente dos acciones y navegación en navegador con la herramienta disponible, sin instalar paquetes; registrar si alguna ejecución queda pendiente.
- Comprobar los clientes terminal existentes en la copia desechable, el formato y lint afectados y `git diff --check`. El script test actual es un marcador: usar el comando específico de `node:test`, sin presentarlo como una suite existente.
- Revisar diff y hashes: lógica, consultas, conexión, notebooks, dependencias, datos, specs anteriores y trabajos ajenos intactos. Registrar únicamente resultados realmente ejecutados cuando se autorice implementar.

## Aprobación y pausa

Spec y plan aprobados para selección de usuario, menú de dos acciones y modificación o eliminación. No quedan decisiones de alcance pendientes. T01–T18 aprobados e implementación autorizada, con pruebas sobre copias desechables. Commit selectivo, push y PR draft contra staging autorizados para los 16 archivos de esta entrega; pendiente revisión del código, sin revisores ni merge.
