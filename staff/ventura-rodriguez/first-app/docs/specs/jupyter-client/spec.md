# Cliente Jupyter

El CEO abre un documento por cada acción que ya se puede probar y comprueba la prueba de concepto. No programa. Ejecuta el bloque y lee el resultado.

Lo usa el CEO.

El Jupyter es el de la app. Se arranca con el comando de la app. La primera vez lo prepara y abre el navegador. Las siguientes solo lo abre. Se ve la lista de documentos, en la interfaz de notebooks. No se abre Lab. No usa el Jupyter instalado en el ordenador.

Entra un documento de esa lista. El bloque busca la app subiendo de carpeta y ejecuta ahí la acción.

Sale el resultado de esa acción en una tabla. El encabezado va en color. Si la acción no devuelve datos, la tabla lo dice. Si no hay filas, se ven los encabezados y ninguna fila.

Ejemplo al guardar a Ada, ada@example.com, con id 1 y fecha 2026-10-21 13:00:00:

| id  | name | email           | createdAt           | updatedAt           |
| --- | ---- | --------------- | ------------------- | ------------------- |
| 1   | Ada  | ada@example.com | 2026-10-21 13:00:00 | 2026-10-21 13:00:00 |

Cada documento trae, en este orden: título, qué hace, qué pasa en la base de datos, qué acción de la app usa, anotaciones, el bloque que la ejecuta y el resultado de esa ejecución.

Si la acción falla, no sale la tabla de datos. Se ve el mensaje que esa acción ya usa: `Name is empty`, `Email is invalid`, `Email is already used`, `User not found`, `Could not create the user`, `Could not update the user`, `Could not delete the user`, `Could not list the users`, `Could not find the user` o `Could not classify the users`.

Si el bloque no encuentra la app, se para y se ve `No encuentro la app.`

Queda fuera cambiar las acciones, añadir acciones que el cliente de terminal no tiene, usar el Jupyter del ordenador, abrir Lab y guardar datos nuevos.
