Issue: #790

# Cliente REST de usuarios

## Qué se pide y por qué

Quien prueba la aplicación necesita crear, listar, ver, modificar y borrar usuarios por HTTP, sin abrir el navegador ni la terminal. Se pide un cliente REST construido con Express que se pueda probar con Postman.

Este pedido sustituye la decisión de quitar el cliente HTTP: la aplicación vuelve a tener cuatro clientes (web, terminal, Jupyter y REST). El cliente REST es independiente de los demás y no usa nada de ellos.

## Cómo se usa

Se arranca el servidor de datos y después este cliente, con su propio comando. El cliente solo escucha en el equipo local, en `http://127.0.0.1:3001`. Lee y escribe en la misma base que los demás clientes.

Las peticiones y las respuestas van en JSON:

| Operación | Petición            | Entra                     | Respuesta correcta            |
| --------- | ------------------- | ------------------------- | ----------------------------- |
| Crear     | `POST /users`       | `name` y `email`          | `201` y el usuario creado     |
| Listar    | `GET /users`        | Nada                      | `200` y la lista              |
| Ver uno   | `GET /users/:id`    | El id en la ruta          | `200` y el usuario            |
| Modificar | `PATCH /users/:id`  | `name`, `email` o los dos | `200` y el usuario modificado |
| Borrar    | `DELETE /users/:id` | El id en la ruta          | `204` sin cuerpo              |

El usuario tiene `id`, `name`, `email`, `createdAt` y `updatedAt`. Si no hay usuarios, la lista está vacía. Al modificar, un dato que no se envía conserva el valor guardado.

Cualquier otra ruta responde `404` sin cuerpo.

## Errores

Un error responde JSON con la clave `message` y el mensaje en inglés de la aplicación, sin traducirlo y sin detalles internos de la base ni del servidor.

| Situación                                               | Estado | `message`                            |
| ------------------------------------------------------- | ------ | ------------------------------------ |
| El id no es un entero mayor que cero                    | `400`  | `User id must be a positive integer` |
| El nombre falta o queda vacío                           | `400`  | `User name is required`              |
| El email falta o no es válido                           | `400`  | `User email is invalid`              |
| El cuerpo no se puede leer como JSON                    | `400`  | `Request JSON is invalid`            |
| El email ya es de otro usuario                          | `409`  | `User email is already registered`   |
| El usuario no existe                                    | `404`  | `User does not exist`                |
| No se llega al servidor de datos al crear               | `500`  | `Unable to create user`              |
| No se llega al servidor de datos al listar              | `500`  | `Unable to list users`               |
| No se llega al servidor de datos al ver uno o al borrar | `500`  | `Unable to find user`                |
| No se llega al servidor de datos al modificar           | `500`  | `Unable to update user`              |
| Falla el borrado después de encontrar al usuario        | `500`  | `Unable to delete user`              |

Cualquier otro fallo responde `500` con el mensaje `Unable to` de esa operación.

## Casos de aceptación

### Caso correcto

Con Postman y una base de prueba: se crea Ada con `ada@example.com` y responde `201` con su id y sus dos fechas. La lista la muestra. Al pedir ese id se ven los mismos datos. Se cambia solo el nombre a Ada Lovelace: responde `200` y el email no cambia. Se borra: responde `204` y Ada ya no sale en la lista.

Un usuario creado por este cliente aparece en la web, y lo modificado en la web se ve por este cliente.

### Caso que debe fallar

- Crear con el nombre vacío, con un email inválido o con el email de otro usuario responde el error de la tabla y no crea nada.
- Crear sin cuerpo o con un JSON roto responde `400` y no muestra una página de error del servidor.
- Ver, modificar o borrar un id que no existe responde `404`.
- Ver, modificar o borrar con `abc`, `0`, `1.5` o `1e3` como id responde `400`.
- Con el servidor de datos parado, las cinco operaciones responden `500` con su mensaje.

## Cómo se reconoce que está terminado

- Las cinco operaciones y los errores anteriores se comprueban en Postman.
- El cliente REST no usa archivos de otro cliente y ningún otro cliente usa los suyos.
- El cliente no repite las reglas de usuarios: solo traduce la petición y la respuesta.
- Web, terminal y Jupyter siguen funcionando igual.
- Las comprobaciones usan datos de prueba y no modifican la base real.

## Fuera del pedido

Contraseñas, autenticación, permisos, notas, contar por género, buscar por email como ruta propia, cambios en las reglas de usuarios o en el esquema de la tabla, cambios en el servidor de datos y entregar la página web desde este cliente.
