# Cliente de usuarios en VS Code

Issue: #904 · PR: #906, hacia staging.

## Propósito

Como persona que usa first-app-ai, quiero gestionar los contactos desde un panel propio dentro de VS Code, para trabajar con los mismos usuarios disponibles en los demás clientes.

## Comportamiento y aceptación

- Al abrir el panel se muestra la lista de contactos guardados, ordenados por ID. Si no hay contactos, se indica que la lista está vacía.
- Se puede crear un contacto introduciendo nombre y email. Al guardar, se muestra el contacto creado y la lista actualizada. Si los datos no son válidos o el email ya está en uso, se explica el error y se conservan los datos introducidos para corregirlos.
- Se puede buscar por nombre, email o ID y ver los resultados. La búsqueda por nombre devuelve todas las coincidencias exactas, distinguiendo mayúsculas y minúsculas; una búsqueda sin resultados se comunica claramente. Los criterios y resultados respetan las reglas de los usuarios existentes.
- Se puede seleccionar un contacto y modificar su nombre o email. Cancelar conserva los datos guardados; un error al guardar se muestra sin perder los cambios introducidos. El éxito se comunica cuando el cambio se ha guardado.
- Se puede eliminar un contacto seleccionado después de escribir el email guardado como confirmación. Se ignoran los espacios en los extremos y las diferencias entre mayúsculas y minúsculas. Un email vacío o diferente no elimina al contacto y permite corregirlo o cancelar. Cancelar no lo elimina. Tras un borrado confirmado y completado, se muestra la lista actualizada.
- Las operaciones utilizan los mismos contactos que los clientes existentes. Los cambios persisten al cerrar y volver a abrir el panel y son visibles desde los demás clientes.
- Si no se pueden cargar o guardar datos, se informa del fallo y se permite reintentar. Si un contacto seleccionado ya no existe, se comunica y se permite actualizar la lista. No se muestra éxito antes de que termine la operación.
- Se puede recorrer y utilizar el panel con teclado. Se proporcionan instrucciones para abrirlo y preparar los datos necesarios.

## Alcance

El panel es un cliente independiente dentro de VS Code para crear, listar, buscar, editar y borrar contactos. Mantiene las reglas y los datos de la aplicación. La clasificación por género, las notas, la autenticación y la publicación de la extensión quedan fuera de esta tarea.

## Comprobación

Con datos ficticios en una copia de prueba, crear contactos, listarlos, buscarlos por los tres criterios, editarlos y borrar uno. Comprobar cancelación, datos inválidos, email duplicado, lista vacía, búsqueda sin resultados, contacto inexistente y servicio de datos detenido. Volver a abrir el panel y consultar los cambios desde otro cliente; recorrer las acciones con teclado.
