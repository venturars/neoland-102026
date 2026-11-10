# Cliente HTTP de Node documentado con Jupyter

Issue: [#1167](https://github.com/venturars/neoland-102026/issues/1167).
Estado: aprobada por Miguel.

## Propósito

Quien prueba first-app-ai puede gestionar contactos mediante una API HTTP de
Node y recorrer sus operaciones desde Jupyter. Cada notebook explica su uso en
español y envía peticiones a esa API.

## Operaciones

Con la tabla inicializada, el servicio de datos y la nueva API arrancados, los
notebooks permiten ejecutar las siguientes operaciones:

| Operación | Entrada | Respuesta HTTP |
| --- | --- | --- |
| Crear | Nombre y email. | `201` y el contacto creado. |
| Listar | Ninguna. | `200` y los contactos por ID ascendente; `[]` cuando no hay contactos. |
| Consultar | ID del contacto. | `200` y el contacto encontrado. |
| Modificar | ID y objeto de cambios: nombre y email opcionales, incluso `{}`. | `200` y el contacto actualizado. Los campos omitidos conservan su valor. |
| Eliminar | ID del contacto. | `204` sin cuerpo. |

Cada contacto tiene exactamente `id`, `name`, `email`, `createdAt` y
`updatedAt`. Una modificación conserva el ID y la fecha de creación. Las
consultas y los rechazos por validación, ID inexistente o JSON mal formado
conservan todos los registros y fechas. Las operaciones mantienen las reglas
y mensajes existentes de la aplicación.

## Presentación en Jupyter

Hay un notebook por operación, junto al nuevo cliente. Los resultados con
contactos se muestran en una tabla con sus cinco campos. Una lista vacía indica
que no hay filas; eliminar indica que no se devuelven datos. Una respuesta HTTP
de error muestra el mensaje recibido o, si no incluye mensaje, el estado HTTP.
En ambos casos no se presenta una tabla de contactos.

Un comando arranca la API y otro abre sus notebooks usando el entorno Notebook
del proyecto. `pnpm jupyter` sigue abriendo los notebooks existentes de las
operaciones. Los nuevos documentos prueban la API mediante HTTP.

## Errores visibles

Para los siguientes errores, la API devuelve el estado y el mensaje indicados;
los notebooks muestran el mensaje recibido.

Una petición con JSON mal formado devuelve `500`: al crear, el mensaje es
`Could not create the user`; al modificar, `Could not update the user`.

| Situación | Estado | Mensaje |
| --- | --- | --- |
| Nombre vacío tras quitar espacios exteriores. | `400` | `Name is empty` |
| Email inválido. | `400` | `Email is invalid` |
| Email ocupado por otro contacto. | `409` | `Email is already used` |
| ID inexistente al consultar, modificar o eliminar. | `404` | `User not found` |
| Fallo de datos al crear. | `500` | `Could not create the user` |
| Fallo de datos al listar. | `500` | `Could not list the users` |
| Fallo de datos al consultar. | `500` | `Could not find the user` |
| Fallo de datos al modificar. | `500` | `Could not update the user` |
| Fallo de datos al eliminar. | `500` | `Could not delete the user` |

## Ejemplo y comprobación

En una copia desechable con la tabla vacía, crear Ada y Grace con emails
distintos. Listar y consultar sus IDs permite comprobar el orden y los cinco
campos. Cambiar solo el nombre de Ada conserva su email; cambiar después solo
su email conserva el nombre. Enviar `{}` conserva ambos valores y sigue las
comprobaciones habituales.

Comprobar nombre vacío, email inválido, email ocupado, ID inexistente y JSON
mal formado al crear y al modificar, junto con la conservación de registros y
fechas tras cada rechazo. Eliminar Ada devuelve `204` y Grace permanece igual.
Detener solo el servicio de datos, mantener la API abierta y comprobar desde los
notebooks los cinco errores de datos. Comprobar que ambos comandos de Jupyter
abren sus respectivos documentos. Al terminar se detienen los procesos y se
elimina la copia desechable.

## Alcance

Se incorpora una API de `node:http` y sus notebooks para las cinco operaciones,
reutilizando la lógica compartida, el servicio de datos y las dependencias
existentes. La documentación de uso, el árbol y la descripción de arquitectura
reflejan el nuevo cliente.
