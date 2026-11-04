Issue: #790

# Tareas del cliente REST de usuarios

## Paquete

1. Añadir `express` fijado en `5.3.0` a `dependencies` y el script `http` a `package.json`. Instalar con `pnpm install`.
   Resultado: `pnpm-lock.yaml` cambia y `express` queda en `5.3.0`.
2. Comparar en `pnpm-lock.yaml` las versiones de `express` y sus dependencias hasta tres niveles con las revisadas en el plan.
   Resultado: coinciden. Si una no coincide, se para y esa versión vuelve a Socket.

## Cliente

3. Crear `src/clients/http/app.js` con Express en `127.0.0.1:3001`, las cinco rutas y, dentro de cada una, la conversión del id y sus errores, sin funciones con nombre.
   Resultado: con el servidor de datos arrancado, `pnpm run http` escribe la dirección del cliente.
4. Añadir el middleware que responde `400` a un JSON roto y el que responde `404` vacío a otra ruta.
   Resultado: un JSON roto da `Request JSON is invalid` y `GET /no-existe` da `404` sin cuerpo.

## Pruebas

5. Crear `tests/http-client.test.js` con una base temporal y `app.js` como proceso hijo.
   Resultado: comprueba las cinco rutas y los errores de la spec, y `pnpm test` pasa.

## Documentación

6. Actualizar `README.md` y `docs/TREE.md` con el comando, el uso con Postman y los archivos nuevos.
   Resultado: el árbol y el arranque describen el cliente REST.
7. Actualizar `docs/ARCHITECTURE.md`: la línea de `src/clients/http/`, la frase de los clientes y los comandos.
   Resultado: ya no nombra `node:http` para este cliente.
8. Actualizar `docs/ERRORS.md` con la excepción de los mensajes en inglés y un apartado del cliente REST.
   Resultado: la guía y el cliente dicen lo mismo.
9. Enmendar los apartados 1 y 3 de `docs/CONSTITUTION.md`.
   Resultado: el alcance incluye el cliente REST y las decisiones tecnológicas incluyen Express.
10. Actualizar la issue #790 con las cinco operaciones.
    Resultado: la issue y la spec piden lo mismo.

## Cierre

11. `pnpm format` sobre los archivos del pedido, `pnpm lint` y `pnpm test`.
    Resultado: todo pasa y `src/logic/` y `src/queries/` no cambian.
12. Con una base temporal, comprobar en Postman los casos de la spec, con el servidor de datos arrancado y parado.
    Resultado: las respuestas coinciden con la spec y queda anotado lo que no se pudo comprobar.
13. Crear un usuario en Postman y abrirlo con `pnpm run web`; modificarlo en la web y verlo en Postman.
    Resultado: los dos clientes ven la misma base.
