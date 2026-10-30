# Cliente Jupyter

El CEO valida, sin leer código, cada funcionalidad que ya se puede probar. Abre un documento, ejecuta el bloque y lee el resultado. No programa.

Lo usa el CEO.

Hay un documento por cada funcionalidad que ya existe. El Jupyter se queda al nivel de este entorno: la misma base de usuarios y las mismas funcionalidades. No añade acciones ni cambia lo que ya se puede hacer.

Entra el documento de esa funcionalidad. El bloque la ejecuta.

Sale el resultado en una tabla, dibujada con una librería. El encabezado va en color. Si no hay filas, se ven los encabezados y ninguna fila. Si la funcionalidad no devuelve datos, la tabla lo dice.

Ejemplo al guardar a Ada, ada@example.com, con id 1 y fecha 2026-10-21 13:00:00:

| id  | name | email           | createdAt           | updatedAt           |
| --- | ---- | --------------- | ------------------- | ------------------- |
| 1   | Ada  | ada@example.com | 2026-10-21 13:00:00 | 2026-10-21 13:00:00 |

Cada documento trae, en este orden: el título, qué hace, qué pasa en la base de datos, qué acción de la app usa, las anotaciones que hay que tener en cuenta, el bloque que la ejecuta y el resultado de esa ejecución.

Si la funcionalidad falla, no sale la tabla de datos. Se ve el mensaje que esa funcionalidad ya usa: `Name is empty`, `Email is invalid`, `Email is already used`, `Invalid id`, `User not found`, `Could not find the user` o `Could not classify the users`.

Queda fuera cambiar las funcionalidades, añadir una que todavía no se puede probar, sustituir la base de datos y guardar el sexo.
