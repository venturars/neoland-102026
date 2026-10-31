Issue: #702

# Plan del cliente de usuarios y notas

## Estado y decisión técnica

Propuesta pendiente de revisión. Solo se preparan estos tres documentos; todavía no se modifica código, esquema ni constitución.

Se usará HTML, CSS y JavaScript del navegador, sin frameworks. Un servidor local con `node:http` servirá los archivos públicos y adaptará las peticiones a las funciones de negocio. Se conserva SQLite y se usan `node:sqlite` y `node:test`, disponibles en Node 24. No se añaden paquetes ni se cambian sus versiones; no hay dependencias nuevas que validar con Socket.

El código nuevo seguirá `docs/STYLE.md`: funciones pequeñas, una función por archivo, pasos visibles y nombres descriptivos. Los comentarios en inglés sencillo explicarán la validación, el recorrido de los datos, la pertenencia de las notas y los fallos que hay que tratar. No se reescriben funciones antiguas solo para cambiar su estilo.

## Recorrido y archivos

El recorrido nuevo será navegador → cliente HTTP → `src/logic/` → consultas → conexión compartida → SQLite. Los clientes de terminal y Jupyter conservan su recorrido actual. El navegador y el adaptador HTTP no contienen SQL ni reglas de negocio.

| Ubicación                                                                                              | Cambio previsto                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/clients/web/index.html`                                                                           | Cuatro secciones: selección, menú, edición de usuario y notas; formularios y mensajes accesibles.                                                           |
| `src/clients/web/styles.css`                                                                           | Distribución adaptable, foco visible y controles legibles, sin biblioteca externa.                                                                          |
| `src/clients/web/main.js` y `state.js`                                                                 | Inicialización y datos de la selección y edición actual; no se guardan credenciales.                                                                        |
| `src/clients/web/*.js`                                                                                 | Una función por archivo para mostrar cada pantalla y manejar selección, navegación, formularios y confirmaciones.                                           |
| `src/clients/http/start-http-server.js` y `create-http-server.js`                                      | Arranque en `127.0.0.1:3000` y creación del servidor, separada para probar con un puerto libre.                                                             |
| `src/clients/http/handle-request.js`                                                                   | Elegir el recurso y método; llamar a manejadores específicos sin duplicar reglas de negocio.                                                                |
| `src/clients/http/read-json-body.js`, `send-json.js`, `serve-public-file.js` y `send-http-error.js`    | Leer entradas, enviar respuestas y servir solo archivos públicos conocidos; una función concreta por archivo.                                               |
| `src/clients/http/handle-users.js` y `handle-notes.js`                                                 | Traducir peticiones y respuestas de cada recurso; llamar a lógica existente o nueva.                                                                        |
| `src/logic/create-note.js`, `find-note-by-id.js`, `list-notes.js`, `update-note.js` y `delete-note.js` | Validar las operaciones de notas y devolver los datos saneados.                                                                                             |
| `src/queries/notes/*.js`                                                                               | Seis funciones, cada una en su archivo, para preparar la tabla, insertar, buscar, listar, actualizar y borrar filas.                                        |
| `src/queries/queries/notes-*.sql`                                                                      | Seis consultas correspondientes, con parámetros con nombre.                                                                                                 |
| `src/db/connection.js`                                                                                 | Hacer explícita la opción `enableForeignKeyConstraints: true` de la conexión compartida para que el borrado en cascada se aplique desde todos los clientes. |
| `src/clients/terminal/*-note*.txt`                                                                     | Un ejemplo correcto por operación de notas, con las mismas firmas de negocio.                                                                               |
| `tests/notes.test.js` y `tests/http-client.test.js`                                                    | Comprobaciones de negocio e integración con una base temporal por proceso.                                                                                  |
| `package.json`                                                                                         | Añadir `start` para el servidor y sustituir el marcador de `test` por `node --test`.                                                                        |
| `eslint.config.js`                                                                                     | Declarar los globals del navegador solo para sus archivos, manteniendo las comprobaciones actuales.                                                         |
| `README.md` y guías de `docs/`                                                                         | Explicar arranque y uso y describir el estado implementado.                                                                                                 |

Los manejadores del navegador tendrán responsabilidades visibles: cargar la selección, seleccionar un usuario, mostrar el menú, abrir y guardar la edición de usuario, confirmar su borrado, cargar notas, abrir y guardar una nota y confirmar su borrado. Los botones de navegación pueden compartir un manejador de acciones explícitas. No se creará un sistema genérico de componentes, rutas o peticiones.

Se reutilizan `listUsers()`, `findUserById(id)`, `updateUser(id, changes)` y `deleteUser(id)` sin cambiar sus firmas. No se reestructura `src/queries/users.js`. El cambio de borrado consiste en la relación nueva de SQLite, no en una segunda eliminación manual.

## Contratos de notas

| Función de `src/logic/`           | Entrada                                  | Resultado correcto                             |
| --------------------------------- | ---------------------------------------- | ---------------------------------------------- |
| `createNote(userId, content)`     | Id del usuario y texto.                  | Nota creada.                                   |
| `findNoteById(userId, id)`        | Id del usuario y de la nota.             | Nota de ese usuario.                           |
| `listNotes(userId)`               | Id del usuario.                          | Lista por id ascendente; `[]` si no hay notas. |
| `updateNote(userId, id, content)` | Ambos ids y texto completo de reemplazo. | Nota actualizada.                              |
| `deleteNote(userId, id)`          | Ambos ids.                               | Sin valor de retorno.                          |

Una nota saneada contiene `id`, `userId`, `content`, `createdAt` y `updatedAt`. Los ids siguen el tipo y la validación de `docs/DATABASE.md`. `content` debe ser texto; se aplica `trim()` y se rechaza el resultado vacío. No se aceptan fechas desde el cliente.

Cada función valida tipos y contenido antes de consultar, comprueba la existencia del usuario y limita sus consultas por `user_id`. Buscar, actualizar o borrar una nota ajena se trata como una nota inexistente. Los fallos de SQLite se sustituyen por el mensaje de la operación, siguiendo `docs/ERRORS.md`.

Los mensajes nuevos son `Note id must be a positive integer`, `Note content is required`, `Note does not exist` y `Unable to create/find/list/update/delete note`, uno por operación. Los errores de usuario existentes se conservan.

## Esquema, efecto en datos y migración propuesta

Actualmente solo existe `users`, con id, nombre, email y fechas. Se añadirá `notes`, con estos campos:

| Campo                      | Definición                                                                      |
| -------------------------- | ------------------------------------------------------------------------------- |
| `id`                       | `INTEGER PRIMARY KEY AUTOINCREMENT`.                                            |
| `user_id`                  | `INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE`.                      |
| `content`                  | `TEXT NOT NULL`; el contenido no vacío se valida en lógica.                     |
| `created_at`, `updated_at` | `TEXT NOT NULL`, fechas escritas por SQLite con `datetime('now', 'localtime')`. |

No se cambian columnas ni datos de usuarios. La tabla nueva empieza vacía y solo se prepara con `CREATE TABLE IF NOT EXISTS`. `create-notes-table.js` lee el SQL y prepara la tabla al cargar el módulo; las consultas de notas importan esa preparación una vez. La preparación de `users` existente se conserva. No se crean tablas desde lógica.

Las consultas de lectura y modificación de una nota incluyen su id y su usuario. El alta asigna `user_id` desde el argumento validado, nunca desde un campo libre del formulario. La fecha de creación se conserva al actualizar; solo cambia `updated_at`.

El borrado en cascada elimina exclusivamente las notas del usuario eliminado, incluso si se llama desde terminal o Jupyter. Se verificó la opción de claves foráneas en una conexión en memoria con Node 24; las pruebas también comprobarán su comportamiento con el esquema propuesto.

La revisión de este plan autorizará esta ampliación de esquema y el efecto de borrado descrito. Durante las comprobaciones solo se preparará en bases temporales. El primer arranque posterior de la aplicación preparará la tabla en la base configurada; no se ejecutará sobre la base real durante el desarrollo. No hay conversión ni importación de datos antiguos.

## Interfaz HTTP

| Método y ruta                         | Operación y respuesta                                |
| ------------------------------------- | ---------------------------------------------------- |
| `GET /api/users`                      | Lista con id, nombre y email para seleccionar; 200.  |
| `GET /api/users/:userId`              | Usuario seleccionado; 200.                           |
| `PATCH /api/users/:userId`            | `updateUser` con los cambios de nombre y email; 200. |
| `DELETE /api/users/:userId`           | `deleteUser`; 204 sin cuerpo.                        |
| `GET /api/users/:userId/notes`        | Lista de notas del usuario; 200.                     |
| `POST /api/users/:userId/notes`       | Crear con `{ content }`; 201.                        |
| `GET /api/users/:userId/notes/:id`    | Consultar una nota del usuario; 200.                 |
| `PATCH /api/users/:userId/notes/:id`  | Reemplazar el contenido con `{ content }`; 200.      |
| `DELETE /api/users/:userId/notes/:id` | Borrar esa nota; 204 sin cuerpo.                     |

Los segmentos numéricos de las rutas se comprueban antes de convertirlos en números. La lógica sigue rechazando ids de otro tipo. El JSON debe ser un objeto válido; las fechas, ids y otros campos no editables no se pasan a la lógica. La lectura del cuerpo tendrá un límite de 64 KiB y devolverá 413 si se supera; es un límite de transporte, no una nueva regla de longitud del contenido.

Los errores de validación o JSON devuelven 400, los recursos inexistentes 404, un email ocupado 409 y los fallos internos 500. Un método no admitido devuelve 405. Los errores HTTP contienen una frase en español en `{ error }`, sin detalles de SQLite. No cambia el contrato de las funciones de negocio.

Solo se sirven los archivos declarados del cliente web. Ninguna ruta permite descargar la base, consultas, código del servidor o ficheros fuera del cliente. Se usa el mismo origen para páginas y peticiones; no se añade CORS ni autenticación.

## Pantallas

`index.html` mantiene las cuatro secciones y muestra una cada vez. La selección y la nota en edición viven en memoria. La lista de usuarios muestra id, nombre y email; la de notas muestra el texto como texto, mediante `textContent`, nunca como HTML interpretado.

Los formularios usan etiquetas, botones y validación HTML básica; la lógica sigue validando en el servidor. El formulario de usuario utiliza `type="email"` y `maxlength="64"`. Los errores se muestran en una zona anunciable y no borran los campos. Los botones de envío se desactivan mientras se guarda y se recuperan al acabar.

Volver al menú descarta la edición sin guardar; volver a selección limpia el contexto y carga la lista. La confirmación de borrado de usuario nombra la eliminación de sus notas. Una cancelación no envía ninguna petición de borrado. El foco se mueve al encabezado al cambiar de pantalla. El estado vacío se distingue de un error y permite volver a intentar una carga.

## Comprobación y documentación

Las pruebas asignan `FIRST_APP_DATABASE_FILE` antes de importar módulos y crean dos usuarios ficticios. Cubren notas completas, errores de tipo y contenido, pertenencia, conservación de fechas y datos tras reabrir la conexión, y borrado en cascada sin afectar al otro usuario. Incluyen regresión de modificación parcial y email único de usuarios.

Las pruebas HTTP usan un puerto libre en `127.0.0.1`: comprueban JSON, estados y errores, separación por usuario, recursos públicos y rechazo de rutas de archivos privados. El servidor y la conexión se cierran y la carpeta temporal se elimina al acabar.

Se ejecutan los ejemplos nuevos de terminal con la base temporal. El puente de Jupyter fuerza la ruta predeterminada: sus comprobaciones se harán desde una copia temporal de la aplicación, con datos ficticios, para que tampoco toque la base real. No se cambia ese puente ni se amplía su catálogo a notas.

La revisión en navegador recorre el caso de negocio, errores de carga y guardado, cancelaciones, contenido con signos HTML, teclado y un ancho móvil. No se da por comprobado lo que no se ejecute.

Después de implementar, se actualizan `docs/TREE.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md` y `docs/ERRORS.md`. `README.md` indica Node 24, `pnpm start`, URL local, base usada y cómo partir de usuarios existentes sin crear ejemplos automáticamente. Se actualiza únicamente el alcance y recorrido real de `docs/CONSTITUTION.md` para reflejar el navegador y las notas, sin cambiar las reglas del proceso.

Se ejecutan `pnpm test`, `pnpm format` y `pnpm lint`, y se comprueba que los cambios se limitan a esta tarea. El PR sigue en borrador hasta que corresponda pedir revisión de la implementación.
