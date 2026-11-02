# Cliente de navegador

Quien usa first-app elige quién es en una lista, sin contraseña, para ver sus opciones y cambiar o borrar ese usuario.

Lo usa quien ya tiene usuarios guardados.

Hay tres pantallas. Los textos de las pantallas están en español.

Entra la lista de usuarios ya guardados. Cada uno se ve con su id, su nombre y su email. Se elige uno por su id. No se escribe una contraseña.

Sale la pantalla de ese usuario. Ahí se elige volver a la lista, modificar el usuario o ir a notas.

Ir a notas se ve y no abre otra pantalla.

Modificar abre otra pantalla. Se cambia el nombre y el email, o se borra el usuario. Volver sin guardar deja los datos como estaban. Borrar pide confirmación. Cancelar el borrado no quita al usuario.

Ejemplo. Están Ada, ada@example.com, con id 1, y Grace, grace@example.com, con id 2. Se elige el id 1. Se cambia el nombre a Ada Lovelace y el email a ada.lovelace@example.com. Al volver a la lista, el id 1 se ve con esos datos. Grace sigue igual. Esos datos siguen ahí al abrir la aplicación otra vez.

Si se borra el id 1 y se confirma, la lista solo muestra a Grace. Si se cancela el borrado, Ada sigue.

Si el nombre queda vacío, el fallo es `Name is empty`.

Si el email no vale, el fallo es `Email is invalid`.

Si el email es el de otro usuario, el fallo es `Email is already used`.

Si el id no es un entero mayor o igual que 1, el fallo es `Invalid id`.

Si ese usuario ya no está, el fallo es `User not found`.

Si no hay usuarios, se ve que la lista está vacía. No es un fallo.

Queda fuera pedir contraseña, crear un usuario desde estas pantallas, la pantalla de notas, contar usuarios según el sexo del nombre, y cambiar lo que ya se puede hacer desde la terminal y desde Jupyter.
