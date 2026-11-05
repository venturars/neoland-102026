# Alta de usuario en Chrome y Electron

Issue: #1005.

## Qué se pide

Quien usa first-app en la extensión de Chrome o en el cliente de escritorio da de alta un usuario sin salir de la pantalla inicial, con la misma disposición que el cliente de navegador (#962).

Todo va en esa misma pantalla de selección. Hay dos recuadros, cada uno con título y descripción propios, en este orden:

1. Listar usuarios: el desplegable para elegir uno, como ahora.
2. Crear usuario: se pide nombre y email y se crea. Tras crearlo, aparece en el desplegable.

Los textos visibles van en español. La interfaz sigue los tonos crema y cyan/teal.

## Quién lo usa

Quien abre la extensión de Chrome o el cliente Electron y quiere añadir un usuario en la pantalla inicial.

## Entrada

Nombre y email.

## Salida

El alta deja un usuario nuevo, el mismo resultado que ya se obtiene al crear. El desplegable muestra id, nombre y email.

## Fallo

Si el nombre queda vacío, el fallo es `Name is empty`.

Si el email no vale, el fallo es `Email is invalid`.

Si el email es el de otro usuario, el fallo es `Email is already used`.

Si no se puede guardar el usuario, el fallo es `Could not create the user` (o el mensaje genérico de conexión en la interfaz).

## Fuera

Cambiar `src/clients/web/`. Pedir contraseña. El conteo por género. Añadir este recuadro en el menú o en la edición. Cambiar la API de Fastify, Express, terminal o Jupyter.
