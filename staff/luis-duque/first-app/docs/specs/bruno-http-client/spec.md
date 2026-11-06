# Colección Bruno del cliente HTTP

Issue: #1149.

Quien prueba el cliente HTTP lanza y comprueba crear, listar, buscar por id, buscar por email, buscar por nombre, actualizar y eliminar desde Bruno, con un comando, sin escribir cada petición a mano. No hay contraseña.

Se arranca el programa de consultas, que sigue en `127.0.0.1`, puerto `3000`, y el cliente HTTP, en `127.0.0.1`, puerto `3001`. La colección usa esa dirección.

Hay peticiones con el programa de consultas en marcha y peticiones con ese programa parado. Las de en marcha se ejecutan con la lista vacía.

Listar no entra nada. Sale cada usuario, con su id, su nombre y su email. Si no hay ninguno, sale ninguno y eso no es un fallo.

Crear entra el nombre y el email. Sale el usuario guardado: `id`, `name` y `email`.

Buscar por id entra el id. Sale ese usuario. Buscar por email entra el email. Sale ese usuario. Buscar por nombre entra el nombre. Si hay uno, sale ese usuario. Si hay varios, salen esos usuarios.

Modificar entra el id y el nombre, el email o los dos. Sale el `id` y los campos enviados.

Eliminar entra el id. Sale que ese usuario ya no está.

El comando comprueba el código de estado y, si hay fallo, el mensaje.

Ejemplo: se crea Ada con ada@example.com. Sale el id, el nombre Ada y el email ada@example.com. La lista lo muestra. Se pide ese id, ese email y ese nombre, y se ven los mismos datos. Se modifica solo el nombre a Ada Lovelace. Sale el mismo id y el nombre Ada Lovelace. Si se borra, Ada ya no sale en la lista.

Si los datos no valen, se ve el mismo fallo de siempre y no se guarda el cambio. Si ese usuario no está, no se cambia nada y se ve el mismo fallo. Si el email ya existe, la base lo rechaza y se ve ese fallo. Si el programa de consultas no está en marcha, se ve el fallo de esa llamada.

Cada petición pide la operación que ya existe. No añade otra y no cambia lo que esa operación ya hace. Crear, actualizar y eliminar siguen guardando el cambio. Listar y buscar no escriben.

Crear la tabla no se pide aparte. Sigue ocurriendo sola antes de cada operación, como ahora.

Queda fuera contar el género, la autenticación, un mensaje nuevo y cambiar las rutas del cliente HTTP. La terminal, Jupyter, las pantallas del navegador, la ventana de escritorio, el popup de Chrome, la vista de Visual Studio Code y el cliente NestJS se quedan como están. La lógica y la base no cambian.
