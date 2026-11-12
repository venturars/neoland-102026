# Diseño del frontend web

Quien usa first-app en la web reconoce la aplicación. El cliente web entero deja de verse como un formulario genérico. El color, el tipo y la composición se eligen para esta aplicación de usuarios. No se copian de una plantilla.

Esa dirección sigue la skill Frontend Design. Se tiene en cuenta solo cuando el trabajo es un diseño web, salvo que el desarrollo diga otra cosa. Esta spec no la escribe ni la usa. Se escribe al terminar esta fase. Se usa cuando se escriba la dirección, antes de cambiar el aspecto.

Antes de cambiar el aspecto se escribe una dirección corta: una paleta de 4 a 6 colores, las tipografías y el papel de cada una, la composición y los principios. Esa dirección se revisa. Solo después se aplica a todo el cliente web, no a una vista suelta.

Se ve una vista cada vez. La primera lista los usuarios que ya están guardados. Cada uno muestra el id, el nombre y el email. Si no hay ninguno, la lista queda vacía. Para seguir se escribe un id y se elige.

Si el id no es un entero positivo, se ve `User id must be a positive integer` y se sigue en la lista. Si es un entero positivo y ese usuario no está en la lista que se acaba de ver, se ve `User ${id} was not found` y no se abre su menú.

Si está, se abre su menú. Se ve el nombre y el id. Desde ahí se vuelve a la lista, se modifica o se abren las notas.

Modificar muestra el nombre y el email que ya tiene. Se puede cambiar el nombre, el email o los dos, y guardar. También se puede eliminar. Guardar o eliminar vuelve a la lista, ya actualizada. Volver desde modificar regresa al menú de ese usuario, sin guardar.

Las notas dicen `Esta pantalla no tiene utilidad.` Volver desde las notas regresa al menú de ese usuario. No guardan nada.

No se crea un usuario desde la web. No se cuenta el género. No se añade otra operación. Listar, modificar y eliminar siguen haciendo lo que ya hacen. Si los datos no valen, o el usuario ya no está, se ve el mismo fallo de siempre, en la vista donde se pidió. Si la lista no se puede leer, se ve ese fallo y no se inventan usuarios.

Se puede usar en una ventana estrecha. El foco del teclado se ve. Si el sistema pide menos movimiento, la página no anima.

Jupyter y la terminal se quedan como están. La lógica, las consultas y el programa local no cambian. No se añade un marco de interfaz ni una biblioteca de estilos.
