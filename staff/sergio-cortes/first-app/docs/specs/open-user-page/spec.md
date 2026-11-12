# Página de usuarios en el navegador

Issue: #843.

## Qué se pide

Quien usa first-app abre la página en Brave y elige quién es, sin contraseña, para ver sus opciones y cambiar o borrar ese usuario. La página se abre directo: no hay un servicio de la aplicación entre el navegador y las operaciones de usuarios que ya existen.

El estilo, la interfaz y las tres pantallas siguen como están. Los textos visibles van en español. La interfaz sigue en tonos crema y teal.

En la primera pantalla entra la lista de usuarios ya guardados. Cada uno se ve con su id, su nombre y su email en un desplegable. Se elige uno por su id y se continúa.

En la segunda sale el resumen de ese usuario. Las acciones principales van en una fila horizontal: modificar usuario e ir a notas. Ir a notas se ve deshabilitado, con un tooltip que explica que aún no está disponible, y no abre otra pantalla. Volver a la selección va en un bloque aparte, ancho completo, claramente secundario.

Modificar abre la tercera pantalla. Se cambia el nombre y el email, o se borra el usuario. Volver sin guardar deja los datos como estaban. Al pedir borrar, aparece un popover sobre la pantalla con el texto de confirmación, un campo para escribir el email de ese usuario y las opciones confirmar o cancelar. Confirmar eliminación se ve deshabilitado hasta que lo escrito coincida con el email del usuario; la comparación no distingue mayúsculas y minúsculas. Si el email no coincide, confirmar sigue deshabilitado y no se muestra ningún mensaje extra. Cancelar cierra el popover y no quita al usuario. La tecla Escape y pulsar fuera del popover cierran el popover sin borrar. Al cerrar el popover, el campo de email se vacía y confirmar vuelve a quedar deshabilitado. Tras un borrado confirmado, se vuelve a la pantalla de selección y la lista se actualiza sin ese usuario.

## Quién lo usa

Quien ya tiene usuarios guardados y quiere elegir uno y gestionarlo en el navegador.

## Entrada

La misma que ya usan listar, buscar por id, actualizar y borrar: la lista de usuarios guardados y, al elegir uno, su id; en la edición, nombre y email; en el popover de borrado, el email escrito para confirmar.

## Salida

El mismo resultado que esas funcionalidades ya devuelven, mostrado en pantalla. La lista de selección muestra id, nombre y email por usuario.

Ejemplo. Están Ada, ada@example.com, con id 1, y Grace, grace@example.com, con id 2. Se elige el id 1. Se cambia el nombre a Ada Lovelace y el email a ada.lovelace@example.com. Al volver a la lista, el id 1 se ve con esos datos. Grace sigue igual. Esos datos siguen ahí al abrir la aplicación otra vez.

Si se pide borrar el id 1 y en el popover se escribe grace@example.com, confirmar sigue deshabilitado. Si se escribe ada@example.com o Ada@Example.com, confirmar se habilita; al confirmar, la lista solo muestra a Grace. Si se cancela el borrado, Ada sigue.

## Fallo

Si el nombre queda vacío, el fallo es `Name is empty`.

Si el email no vale, el fallo es `Email is invalid`.

Si el email es el de otro usuario, el fallo es `Email is already used`.

Si el id no es un entero mayor o igual que 1, el fallo es `Id is invalid`.

Si ese usuario ya no está, el fallo es `User not found`.

Si no hay usuarios, se ve que la lista está vacía. No es un fallo.

## Fuera

Pedir contraseña, crear un usuario desde estas pantallas, la pantalla de notas, contar usuarios según el sexo del nombre, cambiar lo que ya se puede hacer desde la terminal, desde Jupyter o en las reglas de negocio, y quitar el servidor que ya guarda los usuarios.
