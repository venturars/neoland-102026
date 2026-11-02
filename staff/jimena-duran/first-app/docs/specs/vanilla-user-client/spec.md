Issue: #757

# Cliente de usuarios

Estado: spec, plan y T01–T18 aprobados. Implementación y comprobaciones realizadas; pendiente de revisión humana. Commit selectivo, push y PR draft contra staging autorizados en la rama existente; sin revisores ni merge. Evidencia en [verification.md](verification.md).

## Comportamiento y aceptación

1. La persona ve una lista de usuarios existentes ordenada por ID. Cada opción identifica su ID y nombre; por ejemplo, `17 · Usuario de ejemplo`. Selecciona uno y entra sin contraseña. La selección no constituye autenticación. Si la lista está vacía, se informa y no se permite entrar con una selección inexistente.
2. Con el usuario seleccionado aparece una pantalla que identifica su ID, nombre y correo y ofrece únicamente «Volver» y «Modificar usuario». «Volver» regresa a la lista sin modificar datos.
3. «Modificar usuario» abre una pantalla con el nombre y correo actuales, «Guardar», «Eliminar usuario» y «Volver». El ID no se modifica. Volver regresa al menú del usuario sin guardar lo escrito.
4. Guardar actualiza únicamente al usuario seleccionado. Por ejemplo, cambiar el nombre del usuario 17 conserva su ID y correo si este no se cambia. Se mantienen las reglas existentes de recorte de espacios, normalización del correo y unicidad. Tras guardar se vuelve al menú mostrando los datos devueltos.
5. Eliminar pide confirmación. Cancelar no cambia datos; confirmar elimina únicamente al usuario seleccionado y vuelve a la lista actualizada sin selección activa. No se incluyen borrados masivos ni creación de usuarios.
6. Los errores visibles conservan los mensajes existentes: `Name is empty`, `Email is invalid`, `Email is already used` y `User not found`; los fallos de operación muestran `Could not list the users`, `Could not find the user`, `Could not update the user` o `Could not delete the user`, según corresponda. Un fallo no se presenta como éxito ni cambia silenciosamente de usuario; se permite corregir o volver.
7. La aplicación conserva sus operaciones existentes y sus clientes anteriores. Las comprobaciones usan datos desechables y no abren ni modifican datos personales. La documentación de estructura y arquitectura refleja los archivos del cliente.

## Fuera de alcance

Contraseñas, registro, autenticación real, cambios de las reglas de usuarios, búsqueda adicional, clasificación, frameworks y nuevas dependencias. No se modifican otras aplicaciones ni trabajos en revisión.
