# Cliente del navegador

Issue: #851.

Alguien que prueba la app en el navegador elige un usuario guardado, entra en un menú sencillo y puede corregir sus datos o quitarlo del listado. No hay contraseña ni registro de sesión.

Lo usa quien valida la app desde el ordenador, en Windows o en otro sistema.

Desde `mi-primer-proyecto` se lanza el comando `browser`. Abre la interfaz como página local y permite ejecutar JavaScript en módulos. No hace falta un sitio que sirva HTML. La base de usuarios debe estar activa en segundo plano; si no, las pantallas no pueden listar ni guardar.

Para identificarse, basta el id que aparece en la lista. Para cambiar datos, entran nombre y email. Para borrar, basta confirmar la acción en la pantalla de edición.

En la pantalla inicial se ven todos los usuarios con id, nombre y email. Cada fila se puede pulsar para “ser” ese usuario. Sin filas, la pantalla queda vacía.

En la pantalla intermedia aparece quién se eligió y tres caminos: regresar al listado, ir a editar o borrar, y un acceso a notas que aún no funciona (el control no responde al clic).

En la pantalla de edición se muestran nombre y email actuales, se pueden guardar cambios o eliminar al usuario. Tras un guardado correcto, el id no cambia y los datos visibles coinciden con lo guardado. Tras un borrado, ese id deja de salir al volver al listado.

Ejemplo: existe el usuario 2, Luis, luis@example.com. Se elige el 2, se cambia el nombre a Luis García y se guarda. Sigue siendo el id 2 con email luis@example.com. Si se elimina, el 2 ya no aparece al listar.

Ante nombre vacío: `Name is empty`. Ante email mal formado: `Email is invalid`. Ante email de otro usuario: `Email is already used`. Ante id inválido en una operación: `User id is not valid`. Si el usuario ya no existe: `No user exists with that id`. Si la base no responde al listar: `Could not list the users`. Al guardar sin base: `Could not update the user`. Al borrar sin base: `Could not delete the user`.

Queda fuera contraseña, login, alta de usuarios desde el navegador, notas con contenido, servir la página por HTTP, API REST de usuarios, acciones nuevas, mensajes nuevos y cambiar las reglas que ya aplican en terminal o Jupyter.
