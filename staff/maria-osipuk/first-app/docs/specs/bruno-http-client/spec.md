Issue: #1119

# Colección de Bruno para el cliente HTTP de usuarios

## Qué se pide y por qué

Quien prueba el cliente HTTP necesita lanzar sus peticiones desde Bruno y ver si cada respuesta es la esperada, sin escribir a mano cada petición ni cada cuerpo, como hace hoy con Postman.

La colección recorre las cinco operaciones del cliente y los errores que puede dar. Cada petición comprueba su propia respuesta, de modo que al lanzar la colección entera se ve en una pasada qué pasa y qué falla.

## Cómo se usa

Se arrancan el servidor de datos y el cliente HTTP, y se abre la colección en Bruno. Las peticiones van a `http://127.0.0.1:3001`.

La colección tiene dos carpetas, en este orden:

1. **Con el servidor de datos en marcha.** Parte de una lista vacía y sigue una historia: crea a Ada, la lista, la ve, le cambia el nombre, prueba los errores y la borra. El id de Ada que devuelve la creación se guarda y lo usan las peticiones siguientes, así que no hay que copiar ningún id.
2. **Con el servidor de datos parado.** Se detiene el servidor de datos, se deja el cliente HTTP abierto y se lanzan las cinco operaciones para ver su error de servidor.

Cada petición lleva su nombre y su número, para que el orden de lanzamiento sea el de la lista.

### Peticiones de la primera carpeta

| Petición                    | Qué envía                                         | Respuesta esperada                                                     |
| --------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------- |
| Lista vacía                 | `GET /users`                                      | `200` y `[]`                                                           |
| Crear a Ada                 | `POST /users` con `Ada` y `ada@example.com`       | `201` y el usuario con `id`, `name`, `email`, `createdAt`, `updatedAt` |
| Listar                      | `GET /users`                                      | `200` y una lista con Ada                                              |
| Ver a Ada                   | `GET /users/` con el id de Ada                    | `200` y los mismos datos                                               |
| Cambiar el nombre           | `PATCH /users/` con el id de Ada y `Ada Lovelace` | `200`, el nombre nuevo y el email sin cambios                          |
| Crear con nombre vacío      | `POST /users` con el nombre en blanco             | `400` y `User name is required`                                        |
| Crear con email inválido    | `POST /users` con `invalid` como email            | `400` y `User email is invalid`                                        |
| Crear con email repetido    | `POST /users` con el email de Ada                 | `409` y `User email is already registered`                             |
| Ver un id que no existe     | `GET /users/999999`                               | `404` y `User does not exist`                                          |
| Modificar uno que no existe | `PATCH /users/999999`                             | `404` y `User does not exist`                                          |
| Borrar uno que no existe    | `DELETE /users/999999`                            | `404` y `User does not exist`                                          |
| Borrar a Ada                | `DELETE /users/` con el id de Ada                 | `204` sin cuerpo                                                       |
| Lista tras borrar           | `GET /users`                                      | `200` y `[]`                                                           |

### Peticiones de la segunda carpeta

Con el servidor de datos parado, todas responden `500` y un `message` en inglés, sin traducir:

| Petición  | `message`               |
| --------- | ----------------------- |
| Crear     | `Unable to create user` |
| Listar    | `Unable to list users`  |
| Ver uno   | `Unable to find user`   |
| Modificar | `Unable to update user` |
| Borrar    | `Unable to find user`   |

## Casos de aceptación

### Caso correcto

Con una base de prueba vacía y los dos procesos en marcha, lanzar la primera carpeta entera: las trece peticiones pasan todos sus tests. Al terminar, la base vuelve a estar vacía.

### Caso que debe fallar

- Con el servidor de datos parado, lanzar la segunda carpeta: las cinco peticiones pasan sus tests, es decir, responden el error de la tabla.
- Con el cliente HTTP parado, las peticiones fallan por conexión y no se hace pasar eso por un resultado correcto.
- Lanzar la primera carpeta con usuarios ya creados hace fallar la lista vacía y el email repetido: la colección está pensada para una base vacía.

## Cómo se reconoce que está terminado

- La colección se abre en Bruno sin configuración adicional y su dirección base apunta al cliente HTTP.
- Los mensajes y estados de los tests son los que el cliente HTTP responde hoy.
- El cliente HTTP, el servidor de datos, la lógica y los demás clientes no cambian.
- Las comprobaciones que escriben o borran usan una base temporal, no la real.

## Fuera del pedido

Cambiar el cliente HTTP, las reglas o los mensajes de usuarios; colecciones para los clientes Nest o de Chrome; lanzar la colección desde un comando del proyecto o desde pruebas automáticas; instalar Bruno o su línea de comandos como dependencia; peticiones con ids mal formados (`abc`, `0`, `1.5`) o con JSON roto.
