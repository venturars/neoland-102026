# Página Swagger del cliente Nest

Issue: [#1151](https://github.com/venturars/neoland-102026/issues/1151).
Estado: aprobada por Miguel el 2026-11-06.

## Propósito

Como persona que prueba first-app-ai, quiero crear, listar, consultar,
modificar y eliminar contactos desde una página interactiva, para comprobar
la API sin preparar cada petición a mano.

## Uso

Con la tabla inicializada, tras arrancar el servicio de datos y Nest, abrir
`http://127.0.0.1:3003/` muestra Swagger UI con las cinco operaciones.
Cada operación presenta sus entradas, permite enviar la petición y muestra
el estado HTTP y la respuesta recibida en la misma página.

| Operación | Entrada | Resultado |
| --- | --- | --- |
| Crear | Nombre y email obligatorios. | `201` y el contacto creado. |
| Listar | Ninguna. | `200` y los contactos por ID ascendente; `[]` si no hay contactos. |
| Consultar | ID del contacto. | `200` y el contacto encontrado. |
| Modificar | ID; nombre y email opcionales. | `200` y el contacto actualizado; los campos omitidos conservan su valor. |
| Eliminar | ID del contacto. | `204` sin cuerpo. |

Los contactos contienen exactamente `id`, `name`, `email`, `createdAt`
y `updatedAt`. La página describe los campos obligatorios y opcionales y
permite introducir el ID cuando corresponde. Las operaciones conservan
sus reglas actuales, incluidas la normalización y la validación.

## Fallos visibles

La página muestra el estado HTTP y el mensaje existente en la respuesta.

| Situación | Estado | Mensaje |
| --- | --- | --- |
| Nombre vacío tras quitar espacios exteriores. | `400` | `Name is empty` |
| Email inválido. | `400` | `Email is invalid` |
| Email ocupado por otro contacto. | `409` | `Email is already used` |
| Contacto inexistente. | `404` | `User not found` |
| Fallo al crear. | `500` | `Could not create the user` |
| Fallo al listar. | `500` | `Could not list the users` |
| Fallo al consultar. | `500` | `Could not find the user` |
| Fallo al modificar. | `500` | `Could not update the user` |
| Fallo al eliminar. | `500` | `Could not delete the user` |

Con entradas válidas y el servicio de datos detenido, cada operación
presenta su fallo correspondiente de la tabla.

## Ejemplo

Crear Ada con `ada@example.com`, listar los contactos y consultar el ID
devuelto. Cambiar solo el nombre a Ada Lovelace conserva el email, el ID
y la fecha de creación. Cambiar solo el email conserva el nombre.
Eliminar ese contacto devuelve `204`; consultarlo después devuelve
`404` con `User not found`.

## Alcance y comprobación

La entrega añade la página y su guía de uso al CRUD existente.
Autenticación, nuevas operaciones y nuevas reglas de validación quedan fuera.
La guía de uso, el árbol del proyecto y la descripción de responsabilidades
reflejarán la incorporación de la página.

Se comprueba en una copia con datos desechables, recorriendo las cinco
operaciones desde Swagger UI, la edición parcial y los errores de la tabla.
Las consultas y los rechazos por validación conservan los registros y sus fechas.
Una modificación conserva el ID y la fecha de creación.
