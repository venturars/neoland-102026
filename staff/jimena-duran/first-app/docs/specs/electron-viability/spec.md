# Cliente de escritorio propio

Issue: #915.

Quien prueba la aplicación puede gestionar usuarios desde una ventana de
escritorio propia en Windows, macOS y Linux. La base debe estar iniciada.
El texto de la interfaz está en español; los errores conservan su texto.

Al abrir aparecen la lista, el alta y un campo para consultar por id.
La lista muestra id, nombre y email; sin usuarios queda vacía. Crear recibe
nombre y email, limpia el alta y actualiza la lista con el usuario creado.
Se puede abrir una ficha eligiendo un usuario o introduciendo su id.

La ficha muestra id, nombre, email y las fechas de creación y modificación.
Nombre y email aparecen precargados para editar uno o ambos. Guardar
actualiza la ficha y conserva el dato que no se modifica. Borrar vuelve a
la lista actualizada. Volver desde la ficha también actualiza la lista.

Ejemplo: crear Ada con ada@example.com incorpora un usuario con esos datos
y un id asignado. Abrir ese id muestra los mismos datos y sus fechas.
Cambiar solo el nombre a Ada Lovelace conserva el id y ada@example.com.
Después de borrarlo ya no aparece en la lista.

Los fallos se muestran en la ventana:

| Situación | Texto visible |
| --- | --- |
| Nombre vacío | `Name is empty` |
| Email inválido | `Email is invalid` |
| Email de otro usuario | `Email is already used` |
| Id inexistente | `User not found` |
| Base inaccesible al crear | `Could not create the user` |
| Base inaccesible al listar | `Could not list the users` |
| Base inaccesible al consultar | `Could not find the user` |
| Base inaccesible al modificar | `Could not update the user` |
| Base inaccesible al borrar | `Could not delete the user` |

No se agregan reglas ni mensajes. Los clientes actuales siguen disponibles.
Quedan fuera instaladores, reutilizar el cliente de navegador, contraseñas,
autenticación, permisos, clasificación por género y búsquedas por nombre o
email. Se conservan la lógica, las consultas y el servidor de datos.
