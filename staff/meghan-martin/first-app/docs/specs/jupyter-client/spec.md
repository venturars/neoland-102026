# Cliente Jupyter

Quien prueba la app abre una lista de documentos. Hay uno por cada acción que ya se puede probar en la terminal. No programa. Ejecuta el bloque y lee el resultado.

Lo usa esa persona.

El Jupyter es el de la app. Se arranca con el comando de la app. La primera vez lo prepara y abre el navegador. Las siguientes solo lo abre. Se ve la lista de documentos, en la interfaz de notebooks. No se abre Lab. No usa el Jupyter instalado en el ordenador.

Entra un documento de esa lista. El bloque busca la app subiendo de carpeta y ejecuta ahí la acción que ya existe.

Sale el resultado en una tabla. El encabezado va en color. Si la acción no devuelve datos, la tabla lo dice. Si no hay filas, se ven los encabezados y ninguna fila.

Ejemplo al guardar a Ada, ada@example.com:

| id | name | email | createdAt | updatedAt |
| --- | --- | --- | --- | --- |
| 1 | Ada | ada@example.com | 2026-10-26 12:00:00 | 2026-10-26 12:00:00 |

Cada documento trae, en este orden: título, qué hace, qué pasa en la base de datos, qué acción de la app usa, anotaciones, el bloque que la ejecuta y el resultado de esa ejecución.

Si la acción falla, no sale la tabla de datos. Se ve el mensaje que esa acción ya usa.

Si el bloque no encuentra la app, se para y se ve `No encuentro la app.`

Queda fuera cambiar las acciones, añadir una acción que el cliente de terminal no tiene, usar el Jupyter del ordenador, abrir Lab y guardar datos nuevos.
