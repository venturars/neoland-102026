# Cliente del navegador

Issue: #815.

Quien prueba la app elige quién es y, desde ahí, cambia o borra a ese usuario. No hay contraseña.

Lo usa quien prueba la app en el navegador.

Se abre con el comando `browser` de la app, desde `first-app`. Ese comando arranca Brave con un perfil aparte y con permiso para cargar los módulos del archivo. No se sirve. La base tiene que estar en marcha, porque las acciones son las de la app.

Entra el id de un usuario de la lista. Si se modifica, entran el nombre y el email. Si se borra, entra la orden de borrarlo.

La primera pantalla lista los usuarios. Cada uno se ve con su id, su nombre y su email. Se elige uno y no se pide contraseña. Si no hay usuarios, la lista está vacía.

La segunda pantalla deja volver a la lista o modificar a ese usuario. También muestra el botón de notas, desactivado. No se puede pulsar.

La tercera pantalla modifica o elimina al usuario elegido. Al guardar, se ve el usuario con el mismo id y los datos guardados. Al eliminar, ese usuario ya no sale en la lista.

Ejemplo: en la lista está Ada, ada@example.com, con id 1. Se elige el 1. Se cambia el nombre a Ada Lovelace. Se ve el id 1, el nombre Ada Lovelace y el email ada@example.com. Si se elimina, Ada ya no sale en la lista.

Si el nombre queda vacío, se ve `Name is empty`.

Si el email no vale, se ve `Email is invalid`.

Si el email es de otro usuario, se ve `Email is already used`.

Si ese usuario ya no está, se ve `User not found`.

Si no se llega a la base al listar, se ve `Could not list the users`.

Si no se llega al modificar, se ve `Could not update the user`.

Si no se llega al borrar, se ve `Could not delete the user`.

Queda fuera la contraseña, servir la página, activar el botón de notas, guardar notas, una acción nueva, un mensaje nuevo y cambiar lo que ya hace cada acción.
