# Cliente HTTP de Node documentado con Jupyter

Issue: #1156.

Quien prueba first-app lista, crea, modifica, elimina y busca por id usuarios por HTTP, con el HTTP de Node, sin Express y sin Nest. Cada operación tiene un documento Jupyter propio, en otra carpeta. No hay contraseña. No busca por email ni por nombre. No cuenta el género.

Listar no entra nada. Sale cada usuario, con su id, su nombre y su email. Si no hay ninguno, sale ninguno y eso no es un fallo.

Crear entra el nombre y el email. Sale el usuario guardado: `id`, `name` y `email`.

Modificar entra el id y el nombre, el email o los dos. Sale el `id` y los campos enviados.

Eliminar entra el id. Sale que ese usuario ya no está.

Buscar por id entra el id. Sale ese usuario, con su id, su nombre y su email.

Cada petición pide la operación que ya existe. No añade otra y no cambia lo que esa operación ya hace. Crear, modificar y eliminar siguen guardando el cambio. Listar y buscar por id no escriben.

Se arranca el programa de consultas, que sigue en `127.0.0.1`, puerto `3000`, y este cliente, en `127.0.0.1`, puerto `3004`. El cliente HTTP sigue en el `3001`, el popup de Chrome en el `3002` y NestJS en el `3003`.

Hay un documento por operación. Cada documento dice qué hace esa operación y deja un bloque preparado. Quien lo abre ejecuta el bloque. No escribe el bloque. El bloque pide esa operación a este cliente por HTTP. Si hay datos, salen en una tabla. El encabezado va en color. Si falla, se ve el mensaje y no la tabla.

Los documentos se abren con el Jupyter de la aplicación, con un comando aparte. No se usa el Jupyter que haya instalado en el equipo. `pnpm jupyter` sigue abriendo solo los documentos de ahora. Esos documentos no se cambian.

Ejemplo: se crea Ada con ada@example.com. Sale el id, el nombre Ada y el email ada@example.com. La lista lo muestra. Se pide ese id y se ven los mismos datos. Se modifica solo el nombre a Ada Lovelace. Sale el mismo id y el nombre Ada Lovelace. Si se borra, Ada ya no sale en la lista.

Si los datos no valen, se ve el mismo fallo de siempre y no se guarda el cambio. Si ese usuario no está, no se cambia nada y se ve el mismo fallo. Si el email ya existe, la base lo rechaza y se ve ese fallo. Si el programa de consultas no está en marcha, la petición no se completa. Si este cliente no está en marcha, el documento no completa la petición.

Crear la tabla no se pide aparte. Sigue ocurriendo sola antes de cada operación, como ahora.

Queda fuera contar el género, buscar por email, buscar por nombre, la autenticación, un mensaje nuevo y un paquete nuevo. La terminal, Jupyter, las pantallas del navegador, la ventana de escritorio, el popup de Chrome, la vista de Visual Studio Code, el cliente HTTP, Bruno y el cliente NestJS se quedan como están. La lógica y la base no cambian.
