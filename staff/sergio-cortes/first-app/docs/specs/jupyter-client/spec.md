# Cliente Jupyter

## Qué se pide

Un cliente que se abre y se ejecuta como cuaderno. Hay un documento por cada funcionalidad de usuarios que ya se usa desde la terminal, conteo por género incluido.

Lo lee un CEO que no conoce la programación y no quiere aprender. El texto le dice qué hace esa funcionalidad. No tiene que escribir código.

Cada documento tiene, en este orden:

1. Título
2. Descripción de la funcionalidad, con estas partes: qué hace, qué pasa en la base de datos, qué funciones del dominio usa y qué anotaciones existen
3. El bloque muestra el texto de esa funcionalidad en la terminal, tal cual: el comando `node --input-type=module` y, dentro, las líneas del `.txt` sin cambiar una palabra. Solo se sustituye el `console.log` por la tabla con colores. El CEO no redacta ese texto.
4. Respuesta de la ejecución, en una tabla con colores y encabezados

## Quién lo usa

Un CEO que no programa.

## Entrada

La misma entrada que esa funcionalidad ya tiene. El documento trae el ejemplo escrito, con ese mismo texto. El CEO lo ejecuta; no lo redacta.

## Salida

El mismo resultado que esa funcionalidad ya devuelve, pintado como tabla con colores y encabezados. Los encabezados son los datos que ya salen.

Ejemplo al guardar una Ada, ada@example.com, con id 1 y las fechas 2026-10-21 13:00:00. La tabla muestra una fila:

| id | name | email | createdAt | updatedAt |
| --- | --- | --- | --- | --- |
| 1 | Ada | ada@example.com | 2026-10-21 13:00:00 | 2026-10-21 13:00:00 |

Si el resultado es una lista, hay una fila por elemento.

## Fallo

Se ve el mismo mensaje que esa funcionalidad ya muestra. El documento no lo cambia ni lo esconde.

Si el nombre está vacío, se ve `Name is empty`. Si no hay usuario al buscar por id, se ve `User not found`. Si el conteo no puede hacerse, se ve `Could not classify the users`.

## Fuera

- Funcionalidades que la terminal aún no tiene.
- Cambiar lo que cada funcionalidad ya hace.
- Un script en otra aplicación para listar estos documentos o para arrancar el cuaderno.
- Enseñar a programar al CEO.
- Traducir los mensajes de fallo.
