Issue: #1001

# Tareas del cliente de extensión de Chrome

## Paquete

1. Añadir `fastify` fijado en `5.12.8` a `dependencies` y el script `chrome` a `package.json`. Instalar con `pnpm install`.
   Resultado: `pnpm-lock.yaml` cambia y `fastify` queda en `5.12.8`.
2. Comparar en `pnpm-lock.yaml` las versiones de `fastify` y sus dependencias hasta tres niveles con las revisadas en el plan.
   Resultado: coinciden. Si una no coincide, se para y esa versión vuelve a Socket.

## API

3. Crear `src/clients/chrome/api.js` con Fastify en `127.0.0.1:3002`, las cinco rutas y, dentro de cada una, la conversión del id, el cuerpo vacío o `null` y sus errores, sin funciones con nombre.
   Resultado: `pnpm run chrome` escribe su dirección y `GET /users` responde con el servidor de datos arrancado sobre una base temporal.
4. Añadir a `api.js` `setErrorHandler`, con `400` y `Request JSON is invalid`, y `setNotFoundHandler`, con `404` vacío.
   Resultado: un JSON roto y una ruta desconocida no muestran el texto de Fastify.
5. Crear `tests/chrome-client.test.js` con lo que lista el plan. Ejecutar `pnpm test` con los servidores parados.
   Resultado: las pruebas pasan, también las de los demás clientes.

## Extensión

6. Crear `src/clients/chrome/manifest.json` con Manifest V3, la acción `popup.html` y `host_permissions` solo para la API.
   Resultado: Chrome carga `src/clients/chrome/` sin errores.
7. Crear `src/clients/chrome/popup.html` con las pantallas de lista y detalle, los formularios, los botones de confirmar y cancelar el borrado y el sitio del mensaje.
   Resultado: los textos están en español y no hay scripts en línea.
8. Crear `src/clients/chrome/styles.css` para el ancho de la ventana de la extensión.
   Resultado: las dos pantallas se leen sin desplazamiento horizontal.
9. Crear `src/clients/chrome/popup.js` con la lista, el alta y el detalle, usando `fetch` hacia la API y `textContent`.
   Resultado: en Chrome se lista, se crea y se ve un usuario. No importa `src/logic/` ni otro cliente.
10. Añadir a `popup.js` guardar y borrar con confirmación. `DELETE` no envía `content-type`.
    Resultado: guardar muestra los datos nuevos, cancelar conserva el usuario y confirmar vuelve a la lista.
11. Añadir a `popup.js` los errores: el `message` sin traducir, `Unable to reach the API` y `Unable to complete the operation`.
    Resultado: cada fallo de la spec muestra su mensaje en inglés y lo escrito se conserva.
12. Añadir a `eslint.config.js` el bloque de `src/clients/chrome/popup.js` con `document` y `fetch`.
    Resultado: `pnpm lint` termina sin errores.

## Guías

13. Actualizar `README.md`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/ERRORS.md` y `docs/STYLE.md` como indica el plan.
    Resultado: describen lo implementado y `docs/CONSTITUTION.md` no necesita más cambios.

## Comprobación

14. Aplicar Prettier solo a los archivos de esta tarea y ejecutar `pnpm lint` y `pnpm test`.
    Resultado: todo pasa y no aparecen cambios ajenos.
15. Con una base temporal, recorrer en Chrome el caso correcto y los casos que deben fallar de la spec, con el cliente REST parado.
    Resultado: se cumplen todos.
16. Comprobar la base compartida con `pnpm run web` y `pnpm run http`, y que esos clientes funcionan con la API de este cliente parada.
    Resultado: ven los mismos datos y ningún cliente depende de otro.
