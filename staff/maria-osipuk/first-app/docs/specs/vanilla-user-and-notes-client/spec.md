Issue: #702

# Cliente de usuarios y notas

## Qué se pide

Usar la aplicación desde el navegador mediante pantallas de selección, menú, edición de usuario y notas. Los textos visibles están en español.

Se elige un usuario existente de una lista que muestra su id, nombre y email. No se introduce una contraseña. Si no hay usuarios, se explica que la lista está vacía; este cliente no permite dar de alta usuarios.

El menú identifica al usuario seleccionado y ofrece volver a la selección, modificar el usuario e ir a sus notas. Volver a la selección elimina la selección anterior. Volver desde edición o notas conserva el usuario seleccionado.

## Modificar y eliminar un usuario

El formulario permite modificar nombre y email, guardar o volver sin guardar. Se aplican las reglas actuales: nombre no vacío, email válido de hasta 64 caracteres y distinto del de otro usuario. Un error conserva lo escrito para poder corregirlo.

Eliminar requiere una confirmación que avisa de que también se eliminarán todas las notas de ese usuario. Cancelar conserva todos los datos. Confirmar elimina el usuario y sus notas y devuelve a la selección. Los demás usuarios y sus notas se conservan. Esta relación se respeta también al eliminar desde los clientes existentes.

## Gestionar notas

Cada nota pertenece a un usuario y contiene un texto, sin título adicional. Desde sus notas se puede:

- ver una lista ordenada por identificador, con el contenido de cada nota;
- escribir y guardar una nota nueva;
- abrir una nota para modificar su texto y guardar o cancelar la edición;
- eliminar una nota después de confirmar, o cancelar sin cambios;
- volver al menú del mismo usuario.

No se admite un contenido que quede vacío al quitar los espacios del principio y del final. Las notas del otro usuario no aparecen ni pueden modificarse mediante el contexto del usuario seleccionado. Esta separación organiza los datos; no añade autenticación ni permisos.

Los cambios guardados permanecen al cerrar y volver a abrir la aplicación. Al recargar se vuelve a seleccionar usuario. Los cambios sin guardar no se conservan al abandonar su formulario.

## Casos observables

### Caso correcto

Con dos usuarios ficticios, se selecciona uno por su id, se modifica su nombre y se guarda. Se crean dos notas, se modifica una y se cancela el borrado de la otra. Ambas siguen en su lista. Al elegir el segundo usuario, esas notas no aparecen. Al volver al primero y reabrir la aplicación, los cambios guardados siguen disponibles.

Después se confirma el borrado de una nota: la otra sigue existiendo. Al confirmar la eliminación del primer usuario, desaparece de la selección junto con su nota restante; los datos del segundo se conservan.

### Casos que deben fallar

- Guardar un nombre vacío o un email inválido o ya usado muestra un mensaje y conserva los datos guardados anteriormente.
- Guardar una nota vacía o compuesta solo por espacios muestra un error y no crea ni modifica ninguna nota.
- Pedir una nota desde un usuario distinto, o un usuario o una nota que ya no existe, muestra un error sin modificar otros datos.
- Si falla una carga o un guardado, se muestra un mensaje comprensible; no se anuncia un éxito ni se reemplaza una lista fallida por una lista vacía.

## Cómo se reconoce que está terminado

Las cuatro pantallas permiten completar los casos anteriores con ratón y teclado, en escritorio y móvil. Los formularios tienen etiquetas, el foco acompaña el cambio de pantalla y los mensajes de error son visibles. Mientras una operación se guarda no se puede enviarla dos veces.

También se observan los casos correctos e incorrectos de las nuevas operaciones desde terminal, usando datos de prueba. Los clientes existentes conservan sus operaciones. Ninguna comprobación modifica la base real.

## Fuera del pedido

Crear usuarios desde el navegador, contraseñas, autenticación, permisos, adjuntos, texto enriquecido, compartir notas y cambios del recuento por género o de las reglas de trabajo.
