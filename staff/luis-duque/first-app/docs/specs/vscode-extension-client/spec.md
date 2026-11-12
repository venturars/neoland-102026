# Cliente de extensión de Visual Studio Code

Una vista Usuarios en la barra lateral de Visual Studio Code para listar, crear, modificar y eliminar usuarios. Tiene su propio icono en la barra de actividad. Las vistas son las del popup de Chrome y de la ventana de escritorio: la lista, Crear, Elegir, el menú y Modificar. El aspecto es el del libro de registro, el mismo de las pantallas, de la ventana y del popup: una persona es una línea, el nombre elegido es lo único grande y el resto se queda quieto.

Listar no entra nada. Sale cada usuario en una línea, con su id, su nombre y su email. Si no hay ninguno, la lista se queda vacía y eso no es un fallo.

Crear se pide desde la lista. Entra el nombre y el email. Sale esa persona en la lista, con el id que asigna la base. Crear vuelve a la lista.

Elegir entra el id. El menú muestra el nombre grande. Las acciones son Volver y Modificar usuario.

Modificar entra el id y el nombre, el email o los dos. Sale el cambio en la lista. Guardar vuelve a la lista.

Eliminar entra el id. Esa persona deja de verse. Eliminar vuelve a la lista.

No busca por id, por email ni por nombre. No cuenta el género. No hay pantalla de notas.

Si los datos no valen, se ve el mismo fallo de siempre y no se guarda el cambio. Si ese usuario no está, no se cambia nada y se ve el mismo fallo. Si el email ya existe, la base lo rechaza y se ve ese fallo. Si el programa de consultas no está en marcha, la vista no completa la operación.

El programa que ejecuta las consultas sigue en `127.0.0.1`, puerto `3000`. La terminal, Jupyter, las pantallas del navegador, la ventana de escritorio, el popup de Chrome y el cliente HTTP se quedan como están. La lógica y la base no cambian.
