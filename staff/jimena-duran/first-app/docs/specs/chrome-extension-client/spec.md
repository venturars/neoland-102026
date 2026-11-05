Issue: #945

# Extensión de Chrome para gestionar usuarios

Quien prueba la aplicación puede gestionar usuarios desde una extensión de
Chrome con pantalla propia en español. La extensión utiliza exclusivamente
su API local, en http://127.0.0.1:3002, con la base de datos en marcha.

Crear recibe nombre y email y muestra el usuario guardado. La lista muestra
todos los usuarios; cuando no hay ninguno, queda vacía. Consultar recibe un
id y muestra ese usuario. Modificar recibe el id y nombre, email o ambos;
un dato omitido conserva el valor anterior. Borrar recibe el id, elimina el
usuario y actualiza la lista sin mostrar un usuario como resultado.

Cada usuario se presenta con id, nombre, email, fecha de creación y fecha
de actualización. La lista se carga al abrir la extensión y se actualiza
después de crear, modificar o borrar. Las acciones comparten una pantalla.
En modificación, un campo vacío se omite; en creación se envían ambos
campos aunque estén vacíos.

Por ejemplo, crear Ada con ada@example.com devuelve su id y las dos fechas.
La lista y la consulta por ese id muestran los mismos datos. Al cambiar
solo el nombre a Ada Lovelace se conservan id y email. Cambiar solo el
email conserva id y nombre. Tras borrar, Ada desaparece de la lista.

Los errores visibles conservan los mensajes de la aplicación:

| Situación | Mensaje |
| --- | --- |
| Nombre vacío | `Name is empty` |
| Email inválido | `Email is invalid` |
| Email ocupado por otro usuario | `Email is already used` |
| Id inexistente al consultar, modificar o borrar | `User not found` |
| Base inaccesible al crear | `Could not create the user` |
| Base inaccesible al listar | `Could not list the users` |
| Base inaccesible al consultar | `Could not find the user` |
| Base inaccesible al modificar | `Could not update the user` |
| Base inaccesible al borrar | `Could not delete the user` |

Quedan fuera contraseña, autenticación, permisos, clasificación por género,
búsqueda por nombre o email, reglas y mensajes nuevos. Se conservan los
clientes existentes, el servidor SQL y las operaciones actuales.

La entrega incluye documentar el arranque y la carga manual de la
extensión, y actualizar los documentos de estructura y arquitectura.
