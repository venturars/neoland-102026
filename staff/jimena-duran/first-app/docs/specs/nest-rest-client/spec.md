Issue: #1054

# API REST de usuarios con NestJS

Quien prueba first-app puede crear, listar, consultar, modificar y borrar
usuarios desde un cliente HTTP adicional, disponible localmente en
http://127.0.0.1:3003. El servicio de datos y la API actual siguen disponibles.

Crear recibe nombre y email. Consultar, modificar y borrar reciben el id.
Modificar acepta nombre, email o ambos; conserva el dato que se omite.
Crear, consultar y modificar devuelven id, name, email, createdAt y updatedAt.
Listar devuelve esos usuarios o una lista vacía. Borrar no devuelve contenido.

Por ejemplo, crear a Ana con ana@example.com devuelve sus datos e identificador.
La lista la incluye y consultar ese identificador devuelve el mismo usuario.
Cambiar solo su nombre a Ana Durán conserva su email e identificador.
Tras borrarla deja de aparecer en la lista.

Crear responde 201; listar, consultar y modificar responden 200; borrar
responde 204 sin cuerpo. Una ruta desconocida responde 404 sin cuerpo.
PATCH devuelve 200 con el usuario actualizado.
Los errores se devuelven como JSON con message:

| Situación | Mensaje | Estado |
| --- | --- | --- |
| Nombre vacío | Name is empty | 400 |
| Email inválido | Email is invalid | 400 |
| Email usado por otra persona | Email is already used | 409 |
| Usuario inexistente | User not found | 404 |
| Fallo al crear | Could not create the user | 500 |
| Fallo al listar | Could not list the users | 500 |
| Fallo al consultar | Could not find the user | 500 |
| Fallo al modificar | Could not update the user | 500 |
| Fallo al borrar | Could not delete the user | 500 |

Los fallos inesperados usan el mensaje de fallo de su operación.
No se añaden validaciones ni mensajes. Un campo requerido ausente puede
producir ese fallo 500, conforme al comportamiento actual.

El alcance incluye JavaScript, la estructura de NestJS, comandos compatibles
con Windows y comprobación de las cinco operaciones, errores y convivencia
con la API actual. Quedan fuera TypeScript, autenticación, permisos,
contraseñas, búsquedas adicionales, estadísticas y nuevas reglas de negocio.

La documentación de estructura y arquitectura reflejará este cliente y
su convivencia con los clientes existentes.

