Issue: #1116

# Cliente node:http de usuarios documentado con Jupyter

## Qué se pide y por qué

Quien prueba la aplicación necesita crear, listar, ver, modificar y borrar usuarios por HTTP con el módulo `node:http` de Node, sin Express, Fastify ni Nest, y ver en cuadernos Jupyter qué entra y qué sale en cada operación.

Es una cuarta forma de construir la misma API que ya existe en los clientes REST, Nest y Chrome. Sirve para ver qué hace un framework por debajo. El cliente es independiente de los demás y no usa nada de ellos.

## Cómo se usa

Se arranca el servidor de datos y después este cliente, con su propio comando. El cliente solo escucha en el equipo local, en `http://127.0.0.1:3004`. Lee y escribe en la misma base que los demás clientes.

Las peticiones y las respuestas van en JSON, con las mismas rutas que el cliente REST:

| Operación | Petición            | Entra                     | Respuesta correcta            |
| --------- | ------------------- | ------------------------- | ----------------------------- |
| Crear     | `POST /users`       | `name` y `email`          | `201` y el usuario creado     |
| Listar    | `GET /users`        | Nada                      | `200` y la lista              |
| Ver uno   | `GET /users/:id`    | El id en la ruta          | `200` y el usuario            |
| Modificar | `PATCH /users/:id`  | `name`, `email` o los dos | `200` y el usuario modificado |
| Borrar    | `DELETE /users/:id` | El id en la ruta          | `204` sin cuerpo              |

El usuario tiene `id`, `name`, `email`, `createdAt` y `updatedAt`. Si no hay usuarios, la lista está vacía. Al modificar, un dato que no se envía conserva el valor guardado.

Cualquier otra ruta responde `404` sin cuerpo.

Los cuadernos tienen su propio comando de arranque, `pnpm run jupyter-node-http`, y se abren con el Jupyter de la aplicación, sin tocar el que abre los cuadernos de las acciones. Hay un cuaderno por operación: crear, listar, ver uno, modificar y borrar. Cada uno explica en español qué hace, qué pasa en la base de datos, qué petición usa y qué errores puede dar, y la ejecuta contra este cliente. Los cuadernos se ejecutan con la lista vacía.

Si hay datos, salen en tabla: un usuario es una fila con `id`, `name`, `email`, `createdAt` y `updatedAt`, y una lista es una fila por usuario. Una lista vacía muestra `No rows.`; el borrado, que no devuelve datos, muestra `No data returned.` Si falla, se ve el mensaje y no la tabla.

## Errores

Un error responde JSON con la clave `message` y el mensaje en inglés de la aplicación, sin traducirlo y sin detalles internos de la base ni del servidor. Son los mismos estados y mensajes que el cliente REST:

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

Con una base de prueba: se crea Ada con `ada@example.com` y responde `201` con su id y sus dos fechas. La lista la muestra. Al pedir ese id se ven los mismos datos. Se cambia solo el nombre a Ada Lovelace: responde `200` y el email no cambia. Se borra: responde `204` y Ada ya no sale en la lista.

Cada paso se puede repetir desde su cuaderno y se ve en tabla. Un usuario creado por este cliente aparece en los demás, y lo modificado en otro cliente se ve por este.

### Caso que debe fallar

- Crear con el nombre vacío, con un email inválido o con el email de otro usuario responde el error de la tabla y no crea nada.
- Crear sin cuerpo o con un JSON roto responde `400` y no muestra una página de error del servidor.
- Ver, modificar o borrar un id que no existe responde `404`.
- Ver, modificar o borrar con `abc`, `0`, `1.5` o `1e3` como id responde `400`.
- Con el servidor de datos parado, las cinco operaciones responden `500` con su mensaje, y los cuadernos lo muestran sin tabla.

## Cómo se reconoce que está terminado

- Las cinco operaciones y los errores anteriores se comprueban con la prueba automática y desde los cuadernos.
- Este cliente no usa archivos de otro cliente y ningún otro cliente usa los suyos.
- El cliente no repite las reglas de usuarios: solo traduce la petición y la respuesta.
- Los demás clientes y los cuadernos de las acciones siguen funcionando igual.
- Las comprobaciones que escriben o borran usan datos de prueba y una base temporal.

## Fuera del pedido

Contraseñas, autenticación, permisos, contar por género, buscar por email como ruta propia, reglas o mensajes nuevos, cambios en el esquema de la tabla, en el servidor de datos o en los cuadernos de las acciones, contar o buscar por otros campos y una página propia.
