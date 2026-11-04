# Cliente de VS Code

Issue: #983.

Quien prueba la app abre un panel dentro de VS Code. Ese panel no
es el del navegador, ni el de la extensión de Chrome, ni la ventana
de escritorio. Desde él crea, lista, busca, ve, modifica y borra
usuarios. No hay contraseña.

Lo usa quien prueba la app sin salir del editor y sin abrir las
pantallas del navegador.

Se arranca la base, que sigue donde ya está. El panel se abre con
un comando, en la ventana de desarrollo de la extensión, y queda
como una pestaña del editor. No escucha en un puerto nuevo.

Al crear entran el nombre y el email. Al listar no entra nada. Al
buscar entran el criterio y el valor. El criterio es el nombre, el
correo o el id. Al ver uno entra el id del usuario elegido en la
lista. Al modificar entra ese id y el nombre, el email o los dos.
Un dato que no entra conserva el valor guardado. Al borrar entra
ese id.

Sale el usuario que ya devuelve la app: el id, el nombre, el email
y las dos fechas. Al listar sale esa lista, con id, nombre y email.
Si no hay usuarios, la lista está vacía. Al elegir uno se ven los
cinco datos. Al borrar no sale un usuario y ese usuario ya no está
en la lista.

Buscar por nombre usa el nombre entero y las mismas mayúsculas.
Puede salir más de un usuario. Si no hay ninguno, la lista está
vacía y no es un fallo. Buscar por correo sale un usuario. Buscar
por id sale un usuario. Después de buscar, la lista muestra ese
resultado. Crear, guardar y borrar vuelven a mostrar la lista de
todos.

Ejemplo. Se crea Ada con ada@example.com. Sale el id 1, el nombre
Ada, el email ada@example.com y las dos fechas. La lista lo muestra.
Se elige el criterio nombre y se busca Ada. La lista muestra a Ada.
Buscar ada no la muestra. Se elige el criterio correo y se busca
ada@example.com. Se ve ese usuario. Se elige el criterio id y se
busca el 1. Se ve el mismo usuario. Se elige el 1 y se ven los
cinco datos. Se cambia el nombre a Ada Lovelace. Se ve el id 1, el
nombre Ada Lovelace y el email ada@example.com. Si se borra, Ada
ya no sale en la lista.

Si el nombre queda vacío, se ve `Name is empty`.

Si el email no vale, se ve `Email is invalid`.

Si el email es el de otro usuario, se ve `Email is already used`.

Si el id no es un entero mayor o igual que 1, se ve `Invalid id`.

Si ese usuario no está, se ve `User not found`.

Si no se llega a la base al crear, se ve `Could not create the user`.

Si no se llega al listar, se ve `Could not list the users`.

Si no se llega al ver uno o al buscar, se ve `Could not find the user`.

Si no se llega al modificar, se ve `Could not update the user`.

Si no se llega al borrar, se ve `Could not delete the user`.

Si no hay usuarios, la lista está vacía. No es un fallo. Si el
nombre buscado no está, la lista está vacía. No es un fallo.

Las reglas siguen en un solo sitio y este panel solo las muestra.
No sustituye esas reglas. No escucha en un puerto nuevo.

Queda fuera la contraseña, la autenticación, los permisos, contar
usuarios según el sexo del nombre, buscar por un trozo del nombre,
adivinar el criterio, la barra lateral, publicar la extensión, una
regla nueva, un mensaje nuevo y cambiar lo que ya hacen la terminal,
Jupyter, el navegador, HTTP, Chrome y la ventana de escritorio.
Tampoco se reutilizan las pantallas del navegador ni se sustituye
el programa que guarda la base.
