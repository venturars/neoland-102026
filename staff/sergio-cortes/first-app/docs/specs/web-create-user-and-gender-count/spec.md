# Alta y conteo por género en el cliente de navegador

Issue: #962.

## Qué se pide

Quien usa first-app en el navegador da de alta un usuario y ve cuántos hay de cada género sin salir de la pantalla inicial.

Todo va en esa misma pantalla de selección. Hay tres recuadros, cada uno con título y descripción propios, en este orden:

1. Listar usuarios: el desplegable para elegir uno, como ahora.
2. Crear usuario: se pide nombre y email y se crea. Tras crearlo, aparece en el desplegable.
3. Conteo por género: tres números (mujer, hombre e indefinido). El género lo decide la clasificación que ya existe a partir del nombre; no se pide ni se guarda.

Los textos visibles van en español. La interfaz sigue los tonos crema y cyan/teal.

## Quién lo usa

Quien abre el cliente de navegador y quiere añadir un usuario o ver el desglose por género en la pantalla inicial.

## Entrada

Para el alta, nombre y email. Para el conteo, no hay entrada: se clasifican todos los usuarios que ya están.

## Salida

El alta deja un usuario nuevo, el mismo resultado que ya se obtiene al crear. El desplegable muestra id, nombre y email. El conteo es un objeto con tres números, en este orden: woman, man y genderUndefined.

Ejemplo. Están Ada, ada@example.com, con id 1, y Grace, grace@example.com, con id 2. Se crea Ana, ana@mail.com. Ana aparece en el desplegable. El conteo incluye a las tres.

Si no hay usuarios, el desplegable se ve vacío y el conteo es `{ "woman": 0, "man": 0, "genderUndefined": 0 }`. No es un fallo.

## Fallo

Si el nombre queda vacío, el fallo es `Name is empty`.

Si el email no vale, el fallo es `Email is invalid`.

Si el email es el de otro usuario, el fallo es `Email is already used`.

Si no se puede guardar el usuario, el fallo es `Could not create the user`.

Si no se puede clasificar, el fallo es `Could not classify the users`. El desplegable y el alta siguen usables.

## Fuera

Pedir contraseña. Mostrar el género de cada persona. Guardar el género o el conteo. Más grupos que woman, man y genderUndefined. Añadir estos recuadros en el menú o en la edición. Cambiar lo que ya se puede hacer desde la terminal, Jupyter, el escritorio, Chrome, el cliente HTTP o en las reglas de usuarios.
