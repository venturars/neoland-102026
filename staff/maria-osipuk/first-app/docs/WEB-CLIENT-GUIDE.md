# Cómo funciona el cliente de navegador

Esta guía recorre todo el código añadido para el cliente vanilla. Las rutas parten de la raíz de `first-app`.

## 1. Dónde está cada parte del enunciado

| Pedido                                         | Pantalla                                                                         | Archivos principales                                                              |
| ---------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Seleccionar un usuario por id, sin contraseña. | Selección: lista con id, nombre y email y botón «Continuar».                     | `index.html`, `load-user-selection.js` y `select-user.js`, en `src/clients/web/`. |
| Elegir entre volver, modificar o ir a notas.   | Menú del usuario seleccionado. «Ir a notas» está deshabilitada.                  | `index.html`, `show-user-menu.js` y `navigate.js`.                                |
| Modificar o eliminar el usuario.               | Edición: nombre, email, guardar, volver sin guardar y eliminar con confirmación. | `index.html`, `open-user-editor.js`, `save-user.js` y `delete-selected-user.js`.  |
| Usar JavaScript, CSS y HTML vanilla.           | Las tres pantallas comparten estructura y diseño.                                | Los archivos de `src/clients/web/`, sin frameworks.                               |

Las pantallas son tres secciones dentro del mismo HTML. Cambiar de pantalla muestra una sección y oculta las otras; no descarga una página distinta.

## 2. HTML: la estructura

`src/clients/web/index.html` contiene los textos y controles que se ven:

- `head` declara idioma, tamaño adaptable, título, hoja CSS y módulo JavaScript.
- `header` contiene la marca y el nombre de la aplicación.
- `main` contiene el mensaje común y las tres secciones.
- `selection-screen` contiene el formulario con `select` y «Continuar».
- `menu-screen` muestra el usuario y sus opciones.
- `edit-screen` contiene el formulario y el área de borrado.

Un `id` permite encontrar un elemento concreto desde JavaScript. Por ejemplo, `user-name` identifica el campo de nombre. Un `label` con `for="user-name"` relaciona el texto «Nombre» con ese campo.

`hidden` oculta las pantallas que no se están usando. `data-screen` identifica las secciones que hay que recorrer al cambiar de pantalla. `data-action` indica qué navegación solicita un botón: selección, menú o edición.

El botón de notas lleva `disabled` y no tiene `data-action` ni función asociada. No existen pantalla, peticiones ni almacenamiento de notas.

Los formularios usan `required` y el email usa `type="email"` y `maxlength="64"`. Son ayudas del navegador; las reglas definitivas siguen comprobándose en el servidor.

El mensaje tiene `role="status"` para que las ayudas de accesibilidad puedan anunciarlo. Los encabezados tienen `tabindex="-1"`: JavaScript puede llevarles el foco al cambiar de pantalla, sin añadirlos al recorrido normal de Tab.

## 3. CSS: el aspecto

`src/clients/web/styles.css` controla todos los colores, tamaños, espacios y estados visuales.

Las variables del principio permiten cambiar el tema en un solo lugar:

```css
--color-primary: #8655b9;
--color-background: #f4edff;
```

`var(--color-primary)` reutiliza el lila en botones y detalles. El fondo combina dos `radial-gradient`: manchas suaves de color dibujadas por CSS, sin imágenes. `min-height: 100vh` cubre al menos la ventana; `no-repeat` evita repetir el fondo y `fixed` mantiene el degradado continuo al desplazarse.

La tipografía usa Avenir Next si está disponible y otras fuentes locales como alternativa. No se descargan fuentes externas.

`.app` limita el ancho y centra el contenido. `.card` dibuja la tarjeta clara. `.actions` distribuye botones; `.menu-actions` los apila. `.field` separa los campos y `.danger-zone` distingue la eliminación.

El selector sigue siendo un `select` nativo. `.select-control` coloca una flecha decorativa dentro del control. `appearance: none` retira la flecha original y el espacio de la derecha evita que texto, flecha y borde se pisen. La flecha no recibe clics ni se anuncia como otro control.

`:focus-visible` dibuja el foco de teclado en los controles. Los encabezados reciben foco para anunciar el cambio de pantalla, sin un recuadro visual. `:disabled` comunica que un control está temporalmente bloqueado o no disponible.

La regla `@media (max-width: 480px)` reduce márgenes y coloca los botones de formulario en columna para móvil.

## 4. JavaScript del navegador

Todo está en `src/clients/web/`. Cada archivo de función tiene una sola función. `state.js` solo contiene datos.

| Archivo                   | Qué hace                                                                                                                                                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main.js`                 | `initializeClient()` encuentra los formularios y botones, conecta sus eventos y carga la selección inicial. El módulo se ejecuta después de que el HTML esté disponible.                                          |
| `state.js`                | Exporta `STATE`: `selectedUser` empieza en `null` e `isBusy` en `false`. La selección vive en memoria y se pierde al recargar; los datos guardados siguen en SQLite.                                              |
| `show-screen.js`          | `showScreen(screenName)` recorre las secciones, deja visible la solicitada, limpia el mensaje anterior y lleva el foco al encabezado.                                                                             |
| `show-message.js`         | `showMessage(text, isError)` actualiza el mensaje común y su estilo de error. Usa `textContent` para mostrar texto sin interpretarlo como HTML.                                                                   |
| `load-user-selection.js`  | `loadUserSelection()` limpia la selección anterior, bloquea los controles, pide usuarios y crea una opción por usuario. Distingue una lista vacía de una petición fallida. Al acabar permite actualizar de nuevo. |
| `select-user.js`          | `selectUser(event)` evita que el formulario recargue la página, lee el id y pide ese usuario. Esta segunda consulta comprueba que siga existiendo. Guarda la selección y muestra el menú.                         |
| `show-user-menu.js`       | `showUserMenu()` muestra id, nombre y email de `STATE.selectedUser`, usando únicamente los últimos datos guardados.                                                                                               |
| `open-user-editor.js`     | `openUserEditor()` rellena los campos con los datos guardados y muestra la edición. Al abrirlo de nuevo no recupera un borrador descartado.                                                                       |
| `navigate.js`             | `navigate(event)` encuentra un botón con `data-action`, comprueba que no haya una operación pendiente y llama a la función de selección, menú o edición.                                                          |
| `save-user.js`            | `saveUser(event)` lee nombre y email, bloquea envíos repetidos y solicita el guardado. Si funciona, actualiza la selección y vuelve al menú. Si falla, conserva los campos y muestra el error.                    |
| `delete-selected-user.js` | `deleteSelectedUser()` pide confirmación. Cancelar termina sin petición. Confirmar solicita el borrado y, cuando funciona, carga de nuevo la selección.                                                           |

### Las instrucciones que se repiten

- `import` trae una función o dato de otro archivo. `export` permite que otro archivo lo importe.
- `const` declara una referencia que no se reasigna. Por eso `STATE` puede conservar la misma referencia y cambiar sus propiedades.
- `async` permite usar `await`. `await` espera una operación, como recibir la respuesta del servidor, sin bloquear toda la página.
- `fetch` hace una petición HTTP; no abre SQLite.
- `response.ok` indica si el servidor respondió con un estado de éxito. `response.json()` lee el cuerpo JSON, pero no decide por sí mismo si la operación funcionó.
- `event.preventDefault()` evita el envío tradicional del formulario, que recargaría la página.
- `try` intenta una operación; `catch` trata el fallo; `finally` recupera los controles aunque haya un error o un `return`.
- `return` termina esa ejecución. Se usa, por ejemplo, para no seguir guardando después de detectar un error.
- `for...of` recorre elementos de una lista, como opciones o controles del formulario.

## 5. El servidor HTTP

El navegador no puede importar los módulos de Node que abren SQLite. Los archivos de `src/clients/http/` reciben sus peticiones y llaman a la lógica existente.

| Archivo                 | Qué hace                                                                                                                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `start-http-server.js`  | `startHttpServer()` crea el servidor, escucha en `127.0.0.1:3000`, espera a que esté disponible y muestra la URL. Un fallo de arranque termina con un mensaje comprensible.                                                               |
| `create-http-server.js` | `createHttpServer()` crea el servidor con `handleRequest`, sin arrancarlo. Las pruebas pueden elegir otro puerto.                                                                                                                         |
| `handle-request.js`     | `handleRequest(request, response)` lee la ruta y deriva a usuarios o a archivos públicos. Su `catch` transforma cualquier fallo en una respuesta segura.                                                                                  |
| `handle-users.js`       | `handleUsers(request, response, pathname)` decide qué operación de usuario pide la ruta y el método. Comprueba el texto del id antes de convertirlo a número. En una modificación copia únicamente nombre y email presentes en el cuerpo. |
| `read-json-body.js`     | `readJsonBody(request)` comprueba el formato, lee los fragmentos de entrada y los une antes de interpretar JSON, para conservar caracteres acentuados. Solo admite un objeto y limita los datos acumulados a 64 KiB.                      |
| `send-json.js`          | `sendJson(response, statusCode, value)` pone el estado y el tipo JSON, desactiva la caché y envía el valor convertido a texto.                                                                                                            |
| `send-http-error.js`    | `sendHttpError(response, error)` traduce mensajes conocidos al español y elige su estado HTTP. Un error desconocido recibe un mensaje general, sin detalles internos.                                                                     |
| `serve-public-file.js`  | `servePublicFile(request, response, pathname)` busca la ruta en una lista cerrada de archivos públicos y envía su contenido. No convierte libremente una ruta recibida en una ruta del disco.                                             |

### Las cuatro peticiones de usuarios

| Petición              | Significado                      | Función existente        |
| --------------------- | -------------------------------- | ------------------------ |
| `GET /api/users`      | Listar los usuarios disponibles. | `listUsers()`            |
| `GET /api/users/1`    | Buscar el usuario de id 1.       | `findUserById(1)`        |
| `PATCH /api/users/1`  | Modificar sus datos enviados.    | `updateUser(1, changes)` |
| `DELETE /api/users/1` | Eliminar ese usuario.            | `deleteUser(1)`          |

El id 1 es un ejemplo. El cliente usa el id elegido de la lista, no una posición fija.

`200` indica una consulta o guardado correcto. `204` indica un borrado correcto sin cuerpo: por eso el navegador no intenta leer JSON al eliminar. `400` indica entrada incorrecta, `404` un recurso inexistente, `405` un método no permitido, `409` un email ocupado, `413` demasiados datos y `500` un fallo interno.

Una respuesta de error HTTP tiene `{ error: "Mensaje en español" }`. Es el formato del transporte; las funciones de negocio conservan sus contratos y siguen lanzando sus propios errores.

## 6. La lógica y la base de datos

Se reutilizan las funciones de `src/logic/` sin modificarlas. `updateUser(id, changes)` valida el identificador y los valores enviados, normaliza nombre y email y comprueba que otra fila no tenga el mismo email. Si falta una propiedad, conserva la que ya estaba guardada.

Las funciones solicitan operaciones a `src/queries/users.js`. Ese módulo utiliza los SQL de `src/queries/queries/` y la única conexión de `src/db/connection.js`. SQLite genera las fechas. Esta tarea no añade tablas, consultas ni cambios de esquema.

## 7. Recorrido completo de «Guardar cambios»

1. El formulario genera un evento `submit` y `main.js` lo dirige a `saveUser`.
2. `saveUser` evita recargar la página, lee los campos y bloquea controles mientras espera.
3. Envía un `PATCH` con un texto JSON como `{"name":"Usuario de ejemplo","email":"usuario@example.com"}`.
4. `handleRequest` reconoce la ruta de usuarios y llama a `handleUsers`.
5. `handleUsers` comprueba el id, lee el objeto mediante `readJsonBody` y llama a `updateUser` con las propiedades editables presentes.
6. `updateUser` aplica las reglas existentes y pide la modificación a la capa de consultas.
7. La consulta actualiza SQLite y la lógica devuelve el usuario saneado.
8. El adaptador devuelve los datos que necesita el navegador con estado 200.
9. `saveUser` actualiza `STATE.selectedUser`, muestra el menú y anuncia «Datos guardados».
10. `finally` recupera los controles. Si algo falló, se conserva el formulario y se muestra el mensaje correspondiente.

## 8. Configuración y pruebas

`package.json` añade `pnpm start` para arrancar el servidor y activa `pnpm test` con el ejecutor incluido en Node. Las dependencias y sus versiones se conservan.

`eslint.config.js` reconoce `document`, `window` y `fetch` en el navegador. Solo reconoce `fetch` en las pruebas. Esta separación permite seguir detectando por error el uso de un objeto del navegador dentro del servidor.

`tests/http-client.test.js` contiene una prueba de integración que realiza varias operaciones reales:

- Crea una carpeta y una base temporales y define `FIRST_APP_DATABASE_FILE` antes de importar la conexión.
- Arranca un servidor en un puerto libre y comprueba las rutas públicas y las operaciones de usuarios.
- Prueba cambios parciales, entradas inválidas, email duplicado, JSON incorrecto e identificadores inválidos.
- Abre otro proceso Node para comprobar que los datos se leen del disco después del guardado.
- Comprueba que borrar un usuario conserva al otro y que los archivos privados no se pueden descargar.
- Cierra la conexión temporal para comprobar un fallo real de almacenamiento y su mensaje seguro.
- En `finally`, cierra el servidor y elimina los datos de prueba.

También se comprueban las pantallas con teclado, ancho móvil, cancelaciones, errores de conexión y lista vacía. Los ejemplos de terminal y el puente Jupyter se ejecutan desde una copia temporal. La base real no se usa en las comprobaciones.
