# Plan del cliente vanilla y HTTP

Issue: #778. Propuesta técnica para revisión. Depende de implementar y comprobar primero [notas](../notes/plan.md). No hay servidor ni pantallas nuevas en esta entrega.

## Arquitectura y arranque

Mantener clients → logic → queries → db. Añadir src/clients/http/ con start-http-server.js, handle-request.js, handle-users.js, handle-notes.js, read-json-body.js, send-json.js, send-http-error.js y serve-public-file.js. Son funciones pequeñas de interfaz; no deciden validaciones de negocio ni acceden a db/queries. Llaman a listUsers, findUserById, updateUser, deleteUser y las cinco operaciones de notas.

Usar node:http, node:fs y node:url existentes en Node; no instalar paquetes. Servidor en 127.0.0.1:3000, puerto configurable mediante PORT entero de 1 a 65535. El comando start futuro se documentará únicamente en ejecución de la constitución. Un puerto ocupado provoca un error claro y fin del proceso, sin detener procesos ajenos ni buscar otro puerto automáticamente. Ctrl+C cierra el servidor y permite terminar el proceso.

La preparación de la base se ejecuta explícitamente antes de arrancar, con el inicializador de notas. Arrancar HTTP no crea ni migra tablas; antes de preparar una base existente, realizar copia local con la aplicación detenida. Las comprobaciones funcionales usan exclusivamente una copia temporal sin la base personal.

## API mínima

Respuestas de éxito con datos directos en JSON, sin envoltorios ok/data. Usuario conserva sus cinco campos actuales; nota usa el contrato de notes. Los DELETE devuelven 204 sin cuerpo.

| Método y ruta | Entrada | Éxito |
| --- | --- | --- |
| GET /api/users | Ninguna | 200, lista de usuarios |
| GET /api/users/:userId | Ninguna | 200, usuario |
| PATCH /api/users/:userId | Objeto parcial name/email | 200, usuario |
| DELETE /api/users/:userId | Ninguna | 204, usuario y notas eliminados |
| GET /api/users/:userId/notes | Ninguna | 200, lista de notas |
| POST /api/users/:userId/notes | Objeto title/content | 201, nota creada |
| GET /api/users/:userId/notes/:noteId | Ninguna | 200, nota |
| PATCH /api/users/:userId/notes/:noteId | Objeto parcial title/content | 200, nota |
| DELETE /api/users/:userId/notes/:noteId | Ninguna | 204 |

Los IDs de ruta deben ser cadenas decimales completas y convertirse a enteros positivos seguros: nunca aceptar prefijos mediante parseInt. Los campos desconocidos de los cuerpos se rechazan conforme a logic; un array o null no es un objeto de cambios válido. Los listados sin datos son [].

POST/PATCH requieren Content-Type application/json; leer bytes UTF-8 hasta un máximo de 1 MiB y rechazar con 413 al excederlo. JSON inválido o cuerpo vacío produce 400, tipo de contenido incorrecto 415. Un método no admitido en una ruta conocida produce 405 con Allow; ruta desconocida 404. JSON de error contiene únicamente message en español. Las excepciones conocidas de logic se traducen en el cliente HTTP: validación 400, User/Note not found 404, Email is already used 409; un fallo técnico genera 500 con mensaje genérico sin stack. Se conserva Error en inglés dentro de logic.

Solo GET sirve /, /index.html, /styles.css y los módulos web enumerados en serve-public-file.js; se usa un mapa explícito de rutas a archivos y MIME UTF-8, sin convertir rutas arbitrarias en rutas de disco. No se sirven src/db, documentos, SQL, configuración ni node_modules. Frontend y API comparten origen; no se añade CORS ni sesiones.

## Pantallas y estado

Añadir src/clients/web/index.html y styles.css, con módulos main.js, state.js, api.js, show-screen.js, user-selection.js, user-menu.js, user-editor.js, notes-list.js y note-editor.js. api.js solo hace fetch y convierte respuestas HTTP; el estado guarda en memoria selectedUserId y la nota en edición. No usar cookies ni almacenamiento persistente para la selección.

HTML en español con secciones para selección, menú, edición de usuario, listado de notas y formulario de nota. show-screen oculta las otras secciones y mueve el foco al encabezado visible. CSS sencillo con controles legibles, foco visible y adaptación a móvil. Mensajes con aria-live, labels en los campos y títulos/contenidos insertados con textContent o value. Las fechas se presentan mediante Intl.DateTimeFormat en español, conservando UTC en los datos.

Seleccionar consulta al usuario antes de abrir el menú. Tras editar usuario se refrescan nombre/correo y se vuelve al menú. Tras crear o guardar nota se vuelve al listado actualizado; abrir una nota carga los datos completos en el editor. Crear comienza con título y contenido vacíos, sin escribir hasta guardar. Volver/cancelar descarta cambios locales. El editor permite borrar solo notas ya guardadas.

Eliminar usa confirmación nativa window.confirm: usuario «Se eliminarán este usuario y todas sus notas. ¿Continuar?»; nota «Se eliminará esta nota. ¿Continuar?». Cancelar no llama a DELETE. Tras borrar usuario se limpia todo el estado y se recarga selección; tras borrar nota se actualiza el listado. Durante solicitudes se desactivan sus botones y se restauran al terminar. Un error conserva el formulario; al fallar la carga del listado hay mensaje y botón Reintentar. Si falta usuario se vuelve a selección; si falta nota, al listado. Un GET del usuario distingue ambos casos antes de interpretar un 404 de nota.

## Comprobación y documentación

En copia aislada con dos usuarios y notas diferenciadas: recorrer todas las pantallas, cancelar/confirmar eliminaciones, comprobar datos tras reiniciar, recargar selección, ausencia de usuarios/notas y mensajes de error. Hacer llamadas HTTP directas con IDs mezclados/malformados, JSON inválido, campos desconocidos, MIME incorrecto, cuerpo superior a 1 MiB, métodos y rutas no admitidos. Comprobar que assets privados no se sirven y que texto con aspecto de HTML no se ejecuta. Verificar teclado, foco, 390 px y carga/fallos de red mediante navegador real. No añadir suite de tests. Cerrar servidor propio al terminar y comprobar puerto libre.

Actualizar las guías y contratos afectados únicamente cuando se implemente: arquitectura, árbol, errores, ejecución y evidencia de tasks. Esta fase documental solo enlaza los desarrollos previstos. No se añade dependencia nueva: no se requiere una revisión Socket de nuevas versiones.

## Fuentes

[HTTP nativo de Node 24](https://nodejs.org/docs/latest-v24.x/api/http.html) documenta la creación y cierre del servidor. Las APIs de almacenamiento y sus reglas se detallan en el [plan de notas](../notes/plan.md), sin replicarlas en el cliente.
