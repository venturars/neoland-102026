# Cliente Jupyter

El CEO y quien desarrolla abren un documento por cada acción que ya se puede probar en el cliente de terminal y comprueban la prueba de concepto. No hace falta programar: se abre el documento, se puede cambiar un dato de ejemplo, se ejecuta el bloque y se lee el resultado.

Lo usan el CEO y el desarrollador.

El Jupyter es el del entorno de la app. Se arranca con el comando de la app. La primera vez prepara ese entorno y abre el navegador. Las siguientes solo lo abre. Se ve la lista de documentos, en la interfaz de notebooks. No se abre Lab. No se usa un Jupyter instalado aparte en el ordenador.

Entra un documento de esa lista. El bloque busca la app subiendo de carpeta y ejecuta ahí la acción. Los datos de ejemplo del bloque se pueden cambiar antes de ejecutar.

Sale el resultado de esa acción en una tabla. El encabezado va en color. Si la acción no devuelve datos, la tabla lo dice. Si no hay filas, se ven los encabezados y ninguna fila.

Ejemplo al guardar a Ada, ada@example.com, con id 1 y fecha 2026-10-21:

| id  | name | email           | createdAt  | updatedAt  |
| --- | ---- | --------------- | ---------- | ---------- |
| 1   | Ada  | ada@example.com | 2026-10-21 | 2026-10-21 |

Cada documento trae, en este orden: título, qué hace, qué pasa en la base de datos, qué acción de la app usa, anotaciones, el bloque que la ejecuta (visible y editable) y el resultado de esa ejecución.

Hay un documento por cada acción del cliente de terminal: crear usuario, listar usuarios, cambiar usuario, borrar usuario y contar usuarios por género.

Si la acción falla, no sale la tabla de datos. Se ve el mensaje que esa acción ya usa: `Name is empty`, `Email is invalid`, `Email is already used`, `User id is not valid`, `No user exists with that id`, `Could not create the user`, `Could not update the user`, `Could not delete the user`, `Could not list the users` o `Could not classify the users`.

Si el bloque no encuentra la app, se para y se ve `No encuentro la app.`

Queda fuera cambiar las acciones, añadir acciones que el cliente de terminal no tiene, usar un Jupyter ajeno al entorno de la app, abrir Lab, ocultar el código y guardar datos nuevos más allá de lo que ya hace cada acción.
