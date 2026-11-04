Issue: #965

# Cliente de usuarios en una extensión de Chrome

Una extensión de Chrome para crear, listar, ver, modificar y borrar usuarios desde su ventana. La usa quien prueba la app en su ordenador, sin abrir la web, la terminal ni Jupyter.

No hay contraseña ni login. La extensión se carga a mano en Chrome. La base y la API local de la extensión tienen que estar en marcha.

## Pantalla

La extensión es una sola pantalla. Al abrirla, sale la lista de usuarios guardados. Cada uno muestra el id, el nombre, el email y las dos fechas, la de creación y la de la última modificación. Si no hay usuarios, la lista está vacía.

Debajo están los cuatro formularios:

- **Crear:** entran el nombre y el email. Si sale bien, el usuario aparece en la lista.
- **Ver:** entra el id. Se ven el id, el nombre, el email y las dos fechas de ese usuario.
- **Modificar:** entran el id y el nombre, el email o los dos. Un campo vacío no cambia: conserva el valor guardado. Si sale bien, se ve el usuario con los datos nuevos y la lista se actualiza.
- **Borrar:** entra el id. Pide confirmación dentro de la misma ventana, con «Confirmar» y «Cancelar». Si confirmas y sale bien, no se muestra ningún usuario y la lista se actualiza. Si cancelas, no pasa nada.

Al cerrar la ventana de la extensión, lo escrito se pierde. Al abrirla otra vez, se carga la lista.

## Ejemplo

Se crea Ada con ada@example.com. La lista muestra el id 1, el nombre Ada, el email ada@example.com y las dos fechas. Se pide el id 1 y se ven los mismos datos. Se modifica el id 1 con el nombre Ada Lovelace y el email vacío: se ve el id 1, el nombre Ada Lovelace y el email ada@example.com. Se borra el id 1 y se confirma: Ada ya no sale en la lista.

## Errores

Los mensajes son los de la app, tal como llegan:

- Si el nombre queda vacío, se ve `Name is empty`.
- Si el email no vale, se ve `Email is invalid`.
- Si el email es de otro usuario, se ve `Email is already used`.
- Si ese usuario no está, se ve `User not found`.
- Si no se llega a la base o a la API al crear, se ve `Could not create the user`.
- Si no se llega al listar, se ve `Could not list the users`.
- Si no se llega al ver uno, se ve `Could not find the user`.
- Si no se llega al modificar, se ve `Could not update the user`.
- Si no se llega al borrar, se ve `Could not delete the user`.

## Qué queda fuera

Publicar la extensión en la tienda de Chrome, buscar por nombre o por email, el recuento de géneros, las notas, cualquier login o contraseña, abrir la app a otros ordenadores, una regla nueva, un mensaje de error nuevo y cambiar lo que ya hacen las reglas, las consultas, la base y los demás clientes.
