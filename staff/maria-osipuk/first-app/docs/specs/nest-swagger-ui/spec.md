Issue: #1114

# Página Swagger UI en el cliente Nest

## Qué se pide y por qué

Quien prueba la aplicación necesita crear, listar, ver, modificar y borrar usuarios desde el navegador, sin escribir las peticiones a mano en Postman. Para eso el cliente Nest, que ya escucha en `http://127.0.0.1:3003`, publica una página Swagger UI en esa misma dirección.

No es un cliente nuevo con su propio puerto: es la página del cliente Nest. Las cinco operaciones, sus rutas, sus cuerpos, sus respuestas y sus errores no cambian. La página solo las describe y permite lanzarlas.

## Cómo se usa

Se arranca el servidor de datos y después el cliente Nest, con los comandos que ya existen. Al abrir `http://127.0.0.1:3003` en el navegador se ve una página Swagger UI titulada `Users` con las cinco operaciones:

| Operación | Qué pide la página                                                |
| --------- | ----------------------------------------------------------------- |
| Crear     | Un cuerpo con `name` y `email`, los dos obligatorios, con ejemplo |
| Listar    | Nada                                                              |
| Ver uno   | El `id`, obligatorio, con ejemplo                                 |
| Modificar | El `id` y un cuerpo con `name`, `email` o los dos, con ejemplo    |
| Borrar    | El `id`, obligatorio, con ejemplo                                 |

Desde la página se lanza cada operación y se ve el estado y el cuerpo de la respuesta, sin salir de ella. Las respuestas y los errores son los de la spec del cliente Nest de usuarios: `201` al crear, `204` sin cuerpo al borrar y los mismos mensajes en inglés.

Con la base de datos y el cliente en marcha, Postman y los demás clientes siguen usando las mismas cinco rutas sin cambios.

## Casos de aceptación

### Caso correcto

Con una base de prueba: se abre la página y se ven las cinco operaciones. Se crea Ada con `ada@example.com` y la página muestra `201` con su id y sus dos fechas. Al listar sale Ada. Al pedir su id salen los mismos datos. Se cambia solo el nombre a Ada Lovelace y el email no cambia. Se borra y la página muestra `204` sin cuerpo; al pedirla otra vez, `404` con `User does not exist`.

Un usuario creado desde la página aparece en la web y en el cliente REST.

### Caso que debe fallar

- Crear con el nombre vacío, con un email inválido o con el email de otro usuario muestra el error de la spec del cliente Nest y no crea nada.
- Ver, modificar o borrar con `abc`, `0`, `1.5` o `1e3` como id muestra `400` con `User id must be a positive integer`.
- Con el servidor de datos parado, las cinco operaciones muestran `500` con su mensaje.
- Una ruta que no existe, como `/no-existe`, sigue respondiendo `404` sin cuerpo.

## Cómo se reconoce que está terminado

- La página se abre en `http://127.0.0.1:3003` y las cinco operaciones se lanzan desde ella con sus respuestas y errores.
- Las cinco rutas del cliente Nest responden igual que antes, y el resto de clientes sigue funcionando igual.
- Las comprobaciones usan datos de prueba y no modifican la base real.

## Fuera del pedido

Contraseñas, autenticación, permisos, contar por género, buscar por email como ruta propia, TypeScript, cambios en las reglas de usuarios, en el esquema de la tabla, en el servidor de datos, en los errores o en los demás clientes, y un cliente nuevo con otro puerto.
