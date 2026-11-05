# Cliente NestJS

Se puede listar, crear, modificar y eliminar usuarios desde Postman, sin pantallas. El cliente es NestJS `12.3.3`. No busca por id, por email ni por nombre. No cuenta el género.

Listar no entra nada. Sale cada usuario, con su id, su nombre y su email. Si no hay ninguno, sale ninguno y eso no es un fallo.

Crear entra el nombre y el email. Sale el usuario guardado: `id`, `name` y `email`.

Modificar entra el id y el nombre, el email o los dos. Sale el `id` y los campos enviados.

Eliminar entra el id. Sale que ese usuario ya no está.

Cada petición pide la operación que ya existe. No añade otra y no cambia lo que esa operación ya hace. Crear, modificar y eliminar siguen guardando el cambio. Listar no escribe.

Se llama desde Postman, en el propio equipo. El programa que ejecuta las consultas sigue en `127.0.0.1`, puerto `3000`. Este cliente responde en `127.0.0.1`, puerto `3003`. El cliente HTTP sigue en el `3001` y el popup de Chrome en el `3002`.

Si los datos no valen, se ve el mismo fallo de siempre y no se guarda el cambio. Si ese usuario no está, no se cambia nada y se ve el mismo fallo. Si el email ya existe, la base lo rechaza y se ve ese fallo. Si el programa de consultas no está en marcha, la petición no se completa.

Crear la tabla no se pide aparte. Sigue ocurriendo sola antes de cada operación, como ahora.

La terminal, Jupyter, las pantallas del navegador, la ventana de escritorio, el popup de Chrome, la vista de Visual Studio Code y el cliente HTTP se quedan como están. La lógica y la base no cambian.
