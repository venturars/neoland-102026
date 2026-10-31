Issue: #702

# Cliente de usuarios

## Qué se pide

Usar la aplicación desde el navegador mediante tres pantallas: selección de usuario, menú y edición de usuario. Los textos visibles están en español. El color principal es lila y el fondo es continuo, con matices lilas y rosados.

Se elige un usuario existente de una lista que muestra su id, nombre y email. No se introduce una contraseña. Si no hay usuarios, se explica que la lista está vacía; este cliente no permite dar de alta usuarios.

El menú identifica al usuario seleccionado y ofrece volver a la selección, modificar el usuario e «Ir a notas». Volver a la selección elimina la selección anterior. Volver desde edición conserva el usuario seleccionado.

## Opción «Ir a notas»

Solo se muestra la opción en el menú, deshabilitada por ahora. No abre una pantalla ni realiza ninguna operación. La gestión de notas queda fuera de esta tarea.

## Modificar y eliminar un usuario

El formulario permite modificar nombre y email, guardar o volver sin guardar. Se aplican las reglas actuales: nombre no vacío, email válido de hasta 64 caracteres y distinto del de otro usuario. Un error conserva lo escrito para poder corregirlo.

Eliminar requiere una confirmación. Cancelar conserva el usuario. Confirmar elimina únicamente el usuario seleccionado y devuelve a la selección; los demás usuarios se conservan. Se reutiliza el comportamiento de borrado existente.

Los cambios guardados permanecen al cerrar y volver a abrir la aplicación. Al recargar se vuelve a seleccionar usuario. Los cambios sin guardar no se conservan al abandonar el formulario.

## Casos observables

### Caso correcto

Con dos usuarios ficticios, se selecciona uno por su id y se comprueban las tres opciones del menú. «Ir a notas» aparece deshabilitada. Se modifica el nombre y se guarda. Al volver a abrir la aplicación y seleccionar ese usuario, el cambio sigue disponible.

Se vuelve a edición, se cambia el nombre y se sale sin guardar: se conserva el último nombre guardado. Se cancela el borrado y el usuario sigue existiendo. Después se confirma el borrado: desaparece de la selección y el segundo usuario conserva sus datos.

### Casos que deben fallar

- Guardar un nombre vacío o un email inválido o ya usado muestra un mensaje y conserva los datos guardados anteriormente.
- Pedir o modificar un usuario que ya no existe muestra un error sin modificar otros datos y permite volver a la selección.
- Si falla una carga o un guardado, se muestra un mensaje comprensible; no se anuncia un éxito ni se reemplaza una lista fallida por una lista vacía.

## Cómo se reconoce que está terminado

Las tres pantallas permiten completar los casos anteriores con ratón y teclado, en escritorio y móvil. Los formularios tienen etiquetas, el foco acompaña el cambio de pantalla y los mensajes de error son visibles. Mientras una operación se guarda no se puede enviarla dos veces.

Los clientes existentes conservan sus operaciones. Las comprobaciones usan datos de prueba y no modifican la base real.

## Fuera del pedido

Gestionar notas, crear usuarios desde el navegador, contraseñas, autenticación, permisos y cambios del recuento por género, del almacenamiento o de las reglas de trabajo.
