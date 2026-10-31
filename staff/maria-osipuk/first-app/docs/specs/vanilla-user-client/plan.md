Issue: #702

# Plan del cliente de usuarios

## Estado y decisión técnica

Diseño revisado e implementación autorizada. Se desarrolla el alcance de usuarios descrito en la spec; la opción de notas queda deshabilitada.

Se usará HTML, CSS y JavaScript del navegador, sin frameworks. Un servidor local con `node:http` servirá los archivos públicos y adaptará las peticiones a las funciones de usuarios existentes. Se conserva SQLite sin modificar tablas, conexión, consultas ni contratos de negocio. No hay migración ni borrado en cascada nuevo.

Se usarán Node 24 y `node:test`. No se añaden paquetes ni se cambian sus versiones; no hay dependencias nuevas que validar con Socket.

El código nuevo seguirá `docs/STYLE.md`: funciones pequeñas, una función por archivo, pasos visibles y nombres descriptivos. Los comentarios en inglés sencillo explicarán la validación, el recorrido de los datos y los fallos que hay que tratar. No se reescriben funciones antiguas solo para cambiar su estilo.

## Recorrido y archivos

El recorrido nuevo será navegador → cliente HTTP → `src/logic/` → consultas existentes → conexión compartida → SQLite. Los clientes de terminal y Jupyter conservan su recorrido actual. El navegador y el adaptador HTTP no contienen SQL ni reglas de negocio.

| Ubicación                                                                                           | Cambio previsto                                                                                                         |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `src/clients/web/index.html`                                                                        | Tres secciones: selección, menú y edición de usuario; formularios y mensajes accesibles.                                |
| `src/clients/web/styles.css`                                                                        | Distribución adaptable, foco visible y controles legibles, sin biblioteca externa.                                      |
| `src/clients/web/main.js` y `state.js`                                                              | Inicialización y datos del usuario seleccionado; no se guardan credenciales.                                            |
| `src/clients/web/*.js`                                                                              | Una función por archivo para mostrar cada pantalla y manejar selección, navegación, guardado y confirmación de borrado. |
| `src/clients/http/start-http-server.js` y `create-http-server.js`                                   | Arranque en `127.0.0.1:3000` y creación del servidor, separada para probar con un puerto libre.                         |
| `src/clients/http/handle-request.js` y `handle-users.js`                                            | Elegir el recurso y método y llamar a las funciones de usuarios existentes.                                             |
| `src/clients/http/read-json-body.js`, `send-json.js`, `serve-public-file.js` y `send-http-error.js` | Leer entradas, enviar respuestas y servir solo archivos públicos conocidos; una función concreta por archivo.           |
| `tests/http-client.test.js`                                                                         | Comprobaciones de integración con servidor y base temporales.                                                           |
| `package.json`                                                                                      | Añadir `start` para el servidor y sustituir el marcador de `test` por `node --test`.                                    |
| `eslint.config.js`                                                                                  | Declarar los globals del navegador solo para sus archivos, manteniendo las comprobaciones actuales.                     |
| `README.md` y guías de `docs/`                                                                      | Explicar arranque y uso y describir el estado implementado.                                                             |

Los manejadores del navegador tendrán responsabilidades visibles: cargar la selección, seleccionar un usuario, mostrar el menú, abrir y guardar la edición y confirmar el borrado. Los botones de navegación pueden compartir un manejador de acciones explícitas. No se creará un sistema genérico de componentes, rutas o peticiones.

No se crearán archivos de lógica, consultas, tablas, rutas o pantallas de notas. «Ir a notas» será únicamente un botón visible con el atributo `disabled`, sin manejador ni petición asociada.

## Operaciones reutilizadas

| Función existente         | Uso del cliente                                                           |
| ------------------------- | ------------------------------------------------------------------------- |
| `listUsers()`             | Cargar la selección de usuarios.                                          |
| `findUserById(id)`        | Recuperar el usuario seleccionado antes de mostrar sus datos.             |
| `updateUser(id, changes)` | Guardar nombre y email, conservando el contrato de actualización parcial. |
| `deleteUser(id)`          | Eliminar el usuario tras confirmar; conserva su retorno sin valor.        |

La normalización, validación, unicidad de email y fechas siguen en las funciones y consultas existentes. No se modifican `src/logic/`, `src/queries/` ni `src/db/`.

## Interfaz HTTP

| Método y ruta               | Operación y respuesta                                |
| --------------------------- | ---------------------------------------------------- |
| `GET /api/users`            | Lista con id, nombre y email para seleccionar; 200.  |
| `GET /api/users/:userId`    | Usuario seleccionado; 200.                           |
| `PATCH /api/users/:userId`  | `updateUser` con los cambios de nombre y email; 200. |
| `DELETE /api/users/:userId` | `deleteUser`; 204 sin cuerpo.                        |

Los segmentos numéricos de las rutas se comprueban antes de convertirlos en números. La lógica sigue rechazando ids de otro tipo. El JSON debe ser un objeto válido; solo las propiedades de nombre y email que estén presentes se pasan a `updateUser`. Los campos no editables no se pasan a la lógica.

La lectura del cuerpo tendrá un límite de 64 KiB y devolverá 413 si se supera. Los errores de validación o JSON devuelven 400, los recursos inexistentes 404, un email ocupado 409 y los fallos internos 500. Un método no admitido devuelve 405. Los errores HTTP contienen una frase en español en `{ error }`, sin detalles de SQLite. No cambia el contrato de las funciones de negocio.

Solo se sirven los archivos declarados del cliente web. Ninguna ruta permite descargar la base, consultas, código del servidor o ficheros fuera del cliente. Se usa el mismo origen para páginas y peticiones; no se añade CORS ni autenticación.

## Pantallas

El tema visual usa lila como color principal, fondo continuo con matices lilas y rosados y tarjetas claras. Los colores compartidos se definen al principio de `styles.css` con variables CSS para poder ajustarlos en un solo sitio.

`index.html` mantiene las tres secciones y muestra una cada vez. La selección vive en memoria. La lista muestra id, nombre y email como texto, mediante `textContent`, nunca como HTML interpretado.

Los formularios usan etiquetas, botones y validación HTML básica; la lógica sigue validando en el servidor. El formulario utiliza `type="email"` y `maxlength="64"`. Los errores se muestran en una zona anunciable y no borran los campos. Los botones de envío se desactivan mientras se guarda y se recuperan al acabar.

Volver al menú descarta la edición sin guardar; volver a selección limpia el contexto y carga la lista. La confirmación de borrado se refiere únicamente al usuario. Una cancelación no envía ninguna petición de borrado. El foco se mueve al encabezado al cambiar de pantalla. El estado vacío se distingue de un error y permite volver a intentar una carga.

## Comprobación y documentación

Las pruebas asignan `FIRST_APP_DATABASE_FILE` antes de importar módulos y crean dos usuarios ficticios. El servidor usa un puerto libre en `127.0.0.1`. Se comprueban selección, actualización parcial, validación, email único, persistencia y borrado del usuario sin afectar al otro, además de JSON, estados de error y rechazo de rutas de archivos privados. Se cierran servidor y conexión y se elimina la carpeta temporal al acabar.

La revisión en navegador recorre el caso de negocio, errores de carga y guardado, cancelaciones, teclado y un ancho móvil. Comprueba que «Ir a notas» permanece deshabilitada, sin abrir otra pantalla ni enviar peticiones.

Se ejecutan los ejemplos existentes de terminal con una base temporal. El puente de Jupyter fuerza la ruta predeterminada: sus comprobaciones se harán desde una copia temporal de la aplicación, con datos ficticios, para que tampoco toque la base real. No se cambia ese puente ni su catálogo.

Después de implementar, se actualizan `docs/TREE.md` y `docs/ARCHITECTURE.md`. `docs/WEB-CLIENT-GUIDE.md` explica el código añadido, archivo por archivo. `README.md` indica Node 24, `pnpm start`, URL local, base usada y cómo partir de usuarios existentes sin crear ejemplos automáticamente. Se actualiza únicamente el alcance y recorrido real de `docs/CONSTITUTION.md` para reflejar el cliente de navegador, sin cambiar las reglas del proceso. `docs/DATABASE.md` y `docs/ERRORS.md` se revisan; no se cambia el esquema ni se añaden errores de negocio.

Se ejecutan `pnpm test`, `pnpm format` y `pnpm lint`, y se comprueba que los cambios se limitan a esta tarea. El PR sigue en borrador hasta que corresponda pedir revisión de la implementación.
