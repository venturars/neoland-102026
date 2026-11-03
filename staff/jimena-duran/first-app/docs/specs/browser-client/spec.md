Issue: #832

# Cliente del navegador

Estado: alcance y trece tareas aprobados, implementados y comprobados localmente. Resultados y límites en verification.md; entrega aprobada para publicación en la PR draft #834, sin revisores ni merge.

## Resultado esperado

La persona selecciona un usuario por su ID, abre su menú y puede modificarlo o eliminarlo, sin contraseña ni autenticación. El cliente utiliza las mismas reglas y usuarios que los clientes de terminal y Jupyter.

Ejemplo con datos ficticios: Ada tiene ID 1 y correo ada@example.com. Al elegirla y guardar el nombre Ada Lovelace, se conserva el ID 1 y el correo, y se muestran los datos guardados sin salir de edición. Al eliminarla, vuelve el listado y Ada ya no aparece; los demás usuarios se conservan.

Los textos de las pantallas están en español; los mensajes de error mantienen el catálogo existente.

## Criterios de aceptación

- CA-01. El listado muestra ID, nombre y correo. Elegir un usuario abre su menú; sin usuarios no existe una selección válida.
- CA-02. El menú muestra nombre e ID y ofrece Volver, Modificar usuario y Notas. Volver muestra el listado actualizado. Notas está desactivado, no realiza ninguna acción ni abre otra pantalla.
- CA-03. Editar muestra el ID no modificable y nombre/correo actuales. Guardar aplica las reglas, muestra el resultado y permanece en edición. Volver regresa al menú sin guardar entradas pendientes.
- CA-04. Eliminar actúa inmediatamente sobre el usuario seleccionado y vuelve al listado sin selección activa. No hay creación web, diálogo de confirmación ni frase escrita.
- CA-05. Se muestran los mensajes correspondientes: `Name is empty`, `Email is invalid`, `Email is already used`, `User not found`, `Could not list the users`, `Could not update the user` o `Could not delete the user`. No se presentan fallos como éxitos.
- CA-06. Los clientes observan los mismos usuarios persistidos al actualizar su listado o reejecutar celdas. Las salidas guardadas no se actualizan automáticamente. Las comprobaciones de escritura usan exclusivamente usuarios ficticios y conservan otros usuarios y datos personales.

## Límites

Tres pantallas y selección, edición y borrado con las reglas existentes. Sin creación web, autenticación, búsqueda adicional, clasificación, funcionalidad de notas ni dependencias nuevas. La revisión de tareas precede a cualquier implementación.
