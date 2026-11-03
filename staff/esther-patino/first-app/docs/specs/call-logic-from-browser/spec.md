# El navegador llama a las reglas

Issue: #826.

Las tres pantallas siguen siendo las de `docs/specs/vanilla-user-client`. Esa spec no se modifica.

Quien usa first-app sigue eligiendo quién es en una lista, sin contraseña, para ver sus opciones y cambiar o borrar ese usuario. Lo usa quien ya tiene usuarios guardados.

Entra lo mismo que en aquella spec. No entra un dato nuevo ni una pantalla nueva. Los textos siguen en español.

Sale lo mismo. Ir a notas se ve y no abre otra pantalla. Volver sin guardar deja los datos como estaban. Borrar pide confirmación. Cancelar el borrado no quita al usuario.

Ejemplo. Están Ada, ada@example.com, con id 1, y Grace, grace@example.com, con id 2. Se elige el id 1. Se cambia el nombre a Ada Lovelace y el email a ada.lovelace@example.com. Al volver a la lista, el id 1 se ve con esos datos. Grace sigue igual. Esos datos siguen ahí al abrir la aplicación otra vez. Si se borra el id 1 y se confirma, la lista solo muestra a Grace. Si se cancela el borrado, Ada sigue.

Si el nombre queda vacío, el fallo es `Name is empty`.

Si el email no vale, el fallo es `Email is invalid`.

Si el email es el de otro usuario, el fallo es `Email is already used`.

Si el id no es un entero mayor o igual que 1, el fallo es `Invalid id`.

Si ese usuario ya no está, el fallo es `User not found`.

Si no hay usuarios, se ve que la lista está vacía. No es un fallo.

Lo que cambia es quién pide los datos. El navegador pide la lista, la lectura de un id, el cambio y el borrado a las mismas reglas que ya usa la terminal. Esas reglas se las piden al programa que ya está encendido y guarda la base. No aparece otra puerta de usuarios.

Las pantallas se abren en una dirección de este equipo, distinta de la de ese programa. Las dos pueden estar encendidas a la vez. Abrir el archivo de la pantalla desde el disco no llega a ese programa.

Queda fuera lo que ya quedaba fuera en `docs/specs/vanilla-user-client`: pedir contraseña, crear un usuario desde estas pantallas, la pantalla de notas, contar usuarios según el sexo del nombre, y cambiar lo que ya se puede hacer desde la terminal y desde Jupyter. También queda fuera cambiar las reglas, los mensajes y el programa que guarda la base.
