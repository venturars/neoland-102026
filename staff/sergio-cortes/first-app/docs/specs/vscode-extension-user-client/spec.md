# Cliente de VS Code para usuarios

Issue: #1018.

## Qué se pide

Quien usa first-app elige quién es en una lista, sin contraseña, para ver sus opciones, crear un usuario, buscarlo, cambiarlo o borrarlo desde un panel visual en VS Code.

El panel se abre como pestaña de editor con el comando `First App: Abrir usuarios`. El flujo y el aspecto son los del cliente de navegador: tres pantallas, textos visibles en español, tonos crema y cyan/teal, legible y sobria. Este cliente es independiente: no cambia los otros.

En la primera pantalla entra la lista de usuarios ya guardados. Cada uno se ve con su id, su nombre y su email en un desplegable. Se elige uno por su id y se continúa. No se escribe una contraseña. En esa misma pantalla hay alta (nombre y email) y búsqueda.

La búsqueda pide un criterio (nombre, email o id) y el valor exacto. No se adivina el criterio ni se busca un trozo del nombre. Si la búsqueda devuelve un solo usuario, se abre la pantalla de menú de ese usuario. Si devuelve varios (solo puede pasar por nombre), el desplegable muestra esos resultados y hay que elegir uno y continuar. Si no hay coincidencias, el desplegable se ve vacío. Actualizar la lista, crear, guardar o borrar vuelven a la pantalla de selección con todos los usuarios.

En la segunda sale el resumen de ese usuario. Las acciones principales van en una fila horizontal: modificar usuario e ir a notas. Ir a notas se ve deshabilitado, con un tooltip que explica que aún no está disponible, y no abre otra pantalla. Volver a la selección va en un bloque aparte, ancho completo, claramente secundario.

Modificar abre la tercera pantalla. Se cambia el nombre y el email, o se borra el usuario. Volver sin guardar deja los datos como estaban. Al pedir borrar, aparece un popover sobre la pantalla con el texto de confirmación y un campo para el email guardado. Confirmar queda deshabilitado hasta que el email coincida, sin espacios de más y sin distinguir mayúsculas. Si no coincide, no se borra y no hay aviso extra. Cancelar, la tecla Escape y pulsar fuera del popover cierran el popover sin borrar. Tras un borrado confirmado, se vuelve a la pantalla de selección y la lista se actualiza sin ese usuario.

El panel se usa con teclado: controles de formulario nativos, foco visible, Tab llega a todas las acciones y Escape cierra la confirmación de borrado.

El panel no habla con Express ni con Fastify ni abre un puerto nuevo. Usa las mismas operaciones de usuarios que ya existen. La base sigue donde está: si no está en marcha, se arranca aparte.

En first-app quedan escritas las instrucciones para arrancar y reabrir este cliente y para usar el de Chrome.

## Quién lo usa

Quien ya tiene, o quiere tener, usuarios guardados y quiere elegir uno y gestionarlo desde VS Code, sin el navegador de la app, el escritorio, Chrome, la terminal ni Express.

## Entrada

La misma que ya usan listar, crear, buscar por nombre, por email o por id, actualizar y borrar: la lista de usuarios guardados; al buscar, el criterio y el valor; al elegir uno, su id; al crear o editar, nombre y email; al borrar, el email guardado en el popover.

## Salida

El mismo resultado que esas funcionalidades ya devuelven, mostrado en el panel. La lista de selección muestra id, nombre y email por usuario.

Ejemplo. Están Ada, ada@example.com, con id 1, y Grace, grace@example.com, con id 2. Se abre el comando. Se crea Ana, ana@mail.com. Ana aparece en el desplegable. Se elige el criterio nombre y se busca Ada: se abre el menú de Ada. Buscar ada no la muestra. Se elige el criterio email y se busca ada@example.com: se abre el menú de Ada. Se elige el criterio id y se busca el 1: se abre el mismo menú. Desde el menú se modifica el usuario. Se cambia el nombre a Ada Lovelace y el email a ada.lovelace@example.com. Al volver a la lista completa, el id 1 se ve con esos datos. Grace sigue igual. Esos datos siguen ahí al cerrar VS Code y volver a abrir el panel.

Si se borra el id 1 y se confirma con el email guardado, la lista solo muestra a Grace y a Ana. Si se cancela el borrado, o el email no coincide, Ada sigue.

## Fallo

Si el nombre queda vacío, el fallo es `Name is empty`.

Si el email no vale, el fallo es `Email is invalid`.

Si el email es el de otro usuario, el fallo es `Email is already used`.

Si el id no es un entero mayor o igual que 1, el fallo es `Id is invalid`.

Si ese usuario ya no está, el fallo es `User not found`.

Si no se puede crear, el fallo es `Could not create the user`.

Si no se puede listar, el fallo es `Could not list the users`.

Si no se puede buscar o ver uno, el fallo es `Could not find the user`.

Si no se puede guardar, el fallo es `Could not update the user`.

Si no se puede borrar, el fallo es `Could not delete the user`.

Si no hay usuarios, se ve que la lista está vacía. No es un fallo.

Si el nombre buscado no coincide con nadie, la lista se ve vacía. No es un fallo.

Un fallo se muestra con el mensaje de Errores, sin traducir.

## Fuera

Publicar en el Marketplace. Pedir contraseña. La pantalla de notas. Contar usuarios según el sexo del nombre. Buscar por un trozo del nombre. Adivinar el criterio. Una API o un puerto HTTP nuevos. VS Code en la web o en remoto. Un cliente `.txt` de terminal. Operaciones, SQL o errores nuevos. Cambiar lo que ya se puede hacer desde la terminal, Jupyter, el navegador, el escritorio, Chrome, el cliente HTTP con Express o en las reglas de usuarios.
