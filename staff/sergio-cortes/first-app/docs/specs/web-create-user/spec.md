# Alta de usuario en el cliente de navegador

Issue: #962.

## Qué se pide

Quien usa first-app en el navegador da de alta un usuario sin salir de la pantalla inicial.

Todo va en esa misma pantalla de selección. Hay dos recuadros, cada uno con título y descripción propios, en este orden:

1. Listar usuarios: el desplegable para elegir uno, como ahora.
2. Crear usuario: se pide nombre y email y se crea. Tras crearlo, aparece en el desplegable.

Los textos visibles van en español. La interfaz sigue los tonos crema y cyan/teal.

## Quién lo usa

Quien abre el cliente de navegador y quiere añadir un usuario en la pantalla inicial.

## Entrada

Nombre y email.

## Salida

El alta deja un usuario nuevo, el mismo resultado que ya se obtiene al crear. El desplegable muestra id, nombre y email.

Ejemplo. Están Ada, ada@example.com, con id 1, y Grace, grace@example.com, con id 2. Se crea Ana, ana@mail.com. Ana aparece en el desplegable y se puede elegir.

Si no hay usuarios, el desplegable se ve vacío. No es un fallo. Tras el alta, el nuevo sale en la lista.

## Fallo

Si el nombre queda vacío, el fallo es `Name is empty`.

Si el email no vale, el fallo es `Email is invalid`.

Si el email es el de otro usuario, el fallo es `Email is already used`.

Si no se puede guardar el usuario, el fallo es `Could not create the user`.

## Fuera

Pedir contraseña. El conteo por género. Añadir este recuadro en el menú o en la edición. Cambiar lo que ya se puede hacer desde la terminal, Jupyter, el escritorio, Chrome, el cliente HTTP o en las reglas de usuarios.
