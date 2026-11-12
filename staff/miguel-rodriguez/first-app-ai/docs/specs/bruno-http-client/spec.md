# Colección Bruno del cliente Express

Issue: [#1159](https://github.com/venturars/neoland-102026/issues/1159).
Estado: aprobada por Miguel el 2026-11-06.

## Propósito

Quien prueba first-app-ai puede ejecutar una colección de peticiones en Bruno
para comprobar el CRUD de Express y sus errores sin preparar cada petición a mano.

## Uso y resultados

Con la tabla inicializada y vacía, se arrancan el servicio de datos y Express.
El grupo online comprueba el cliente en `http://127.0.0.1:3001`.

| Operación | Entrada | Resultado esperado |
| --- | --- | --- |
| Crear | Nombre y email. | `201` y el contacto creado. |
| Listar | Ninguna. | `200` y contactos por ID ascendente; `[]` si no hay ninguno. |
| Consultar | ID del contacto. | `200` y el contacto encontrado. |
| Modificar | ID; nombre, email o ambos. | `200` y el contacto actualizado; cada campo omitido conserva su valor. |
| Eliminar | ID del contacto. | `204` sin cuerpo; el contacto desaparece de la lista. |

Cada contacto contiene exactamente `id`, `name`, `email`, `createdAt` y
`updatedAt`. Una modificación conserva el ID y la fecha de creación.
Las consultas y las operaciones rechazadas por validación o por ID inexistente
conservan todos los registros y sus fechas.

La colección comprueba los resultados y muestra qué peticiones pasan o fallan.
Se ejecuta el grupo online con `pnpm bruno`. Una guía breve explica cómo preparar
los datos desechables, ejecutar cada grupo y consultar sus resultados.
El árbol y la descripción de responsabilidades del proyecto reflejan la colección.

## Fallos comprobados

| Situación | Estado | Mensaje |
| --- | --- | --- |
| Nombre vacío tras quitar espacios exteriores, al crear o modificar. | `400` | `Name is empty` |
| Email inválido, al crear o modificar. | `400` | `Email is invalid` |
| Email de otro contacto, al crear o modificar. | `409` | `Email is already used` |
| ID inexistente, al consultar, modificar o eliminar. | `404` | `User not found` |
| Servicio de datos detenido al crear. | `500` | `Could not create the user` |
| Servicio de datos detenido al listar. | `500` | `Could not list the users` |
| Servicio de datos detenido al consultar. | `500` | `Could not find the user` |
| Servicio de datos detenido al modificar. | `500` | `Could not update the user` |
| Servicio de datos detenido al eliminar. | `500` | `Could not delete the user` |

El grupo offline se ejecuta por separado, con Express todavía en marcha y solo
el servicio de datos detenido. Usa entradas válidas para comprobar los cinco
fallos correspondientes, sin confundirlos con errores de validación.

## Ejemplo y comprobación

En una copia desechable con la tabla vacía, crear Ada y Grace con emails distintos.
Listar y consultar los IDs devueltos permite comprobar los cinco campos y el orden.
Cambiar solo el nombre de Ada a Ada Lovelace conserva su email; cambiar después
solo su email conserva el nombre. Intentar crear o modificar con nombre vacío,
email inválido o un email ocupado devuelve los errores indicados y conserva todos
los contactos y sus fechas.

Consultar, modificar y eliminar un ID inexistente devuelve `User not found`
y conserva todos los contactos y sus fechas.
Eliminar los contactos de prueba devuelve `204` sin cuerpo y deja la lista vacía.
Después se detiene solo el servicio de datos y se ejecuta el grupo offline.
Al terminar se elimina la copia; la base de trabajo permanece intacta.

## Alcance

La entrega incorpora la colección CRUD, su ejecución y su guía junto al cliente
HTTP existente. La dependencia necesaria se revisa con Socket antes de instalarla.
Si las pruebas revelan un defecto de Express, se informa antes de ampliar el cambio.
