# Cliente HTTP

Se puede probar cada consulta de usuarios que ya existe desde Postman, sin escribir código. Hay una petición por consulta: crear un usuario, actualizarlo, eliminarlo, listar los que hay, buscar por id, buscar por email y buscar por nombre.

Cada petición entra lo mismo que ya entra en esa consulta. Crear entra el nombre y el email. Actualizar entra el id y el nombre, el email o los dos. Eliminar entra el id. Listar no entra nada. Buscar entra el id, el email o el nombre.

Sale el resultado de esa consulta. Crear y actualizar muestran el usuario guardado: `id`, `name` y `email`. Buscar por id o por email muestra ese usuario. Si buscar por nombre encuentra uno, muestra ese usuario. Si encuentra varios, muestra esos usuarios. Listar muestra los usuarios, o ninguno si no hay. Eliminar muestra que ese usuario ya no está.

La petición pide la consulta que ya existe. No añade otra y no cambia lo que esa consulta ya hace. Crear, actualizar y eliminar siguen guardando el cambio. Buscar y listar no escriben.

Se llama desde Postman, en el propio equipo. El programa que ejecuta las consultas sigue en `127.0.0.1`, puerto `3000`. Este cliente responde en `127.0.0.1`, puerto `3001`, para no pisarlo.

Si los datos no valen, se ve el mismo fallo de siempre y no se guarda el cambio. Si ese usuario no está, no se cambia nada y se ve el mismo fallo de siempre. Si el email ya existe, la base lo rechaza y se ve ese fallo. Si el programa de consultas no está en marcha, la petición no se completa.

Crear la tabla no se pide aparte. Sigue ocurriendo sola antes de cada operación, como ahora. Contar el género no entra: no es una consulta de usuarios.

La terminal, Jupyter y las pantallas se quedan como están. La lógica y la base no cambian.
