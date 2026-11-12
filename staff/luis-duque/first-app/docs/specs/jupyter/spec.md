# Jupyter

Se puede probar cada operación que ya existe sin escribir código. Hay un documento por operación: crear un usuario, actualizarlo, eliminarlo, listar los que hay, buscar por id, buscar por email, buscar por nombre y contar el género de los nombres.

Cada documento dice qué hace esa operación y deja un bloque preparado. Quien lo abre ejecuta el bloque. No escribe el bloque.

Entra lo mismo que ya entra en esa operación. Crear entra el nombre y el email. Actualizar entra el id y el nombre, el email o los dos. Eliminar entra el id. Listar no entra nada. Buscar entra el id, el email o el nombre. Contar el género no entra nada.

Sale el resultado de esa operación, en una tabla. El encabezado va en color. Crear, actualizar y buscar muestran el usuario. Si buscar por nombre encuentra varios, la tabla muestra esos usuarios. Listar muestra los usuarios, o una tabla vacía si no hay ninguno. Contar el género muestra el recuento. Eliminar muestra que ese usuario ya no está.

El bloque pide la operación que ya existe. No añade otra y no cambia lo que esa operación ya hace. Crear, actualizar y eliminar siguen guardando el cambio. El resto no escribe.

Se abre desde la aplicación, en el navegador, con el Jupyter de la aplicación. No se usa el Jupyter que haya instalado en el equipo. La lista enseña un documento por operación.

Se busca la aplicación subiendo de carpeta. Si no aparece, se ve `No encuentro la app.` Si aparece, se abre un documento por cada acción.

En Windows, el texto se lee entero. Las tildes y la eñe no se rompen.

Si los datos no valen, o el usuario no está, se ve el mismo fallo que ya se ve al pedir esa operación. Abrir la lista no cambia los datos. Una operación que no escribe tampoco los cambia.
