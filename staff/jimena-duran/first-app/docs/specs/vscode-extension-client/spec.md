Issue: #996

# Usuarios desde VS Code

La persona que prueba la aplicación puede crear, listar, consultar, modificar
y borrar usuarios en una única vista Usuarios de la barra lateral de VS Code.
La base se inicia como hasta ahora. Desde la carpeta de la aplicación, el
comando `vscode` abre una ventana de desarrollo con esa vista.

Crear solicita nombre y email. Listar no solicita datos. Consultar y borrar
solicitan el id. Modificar solicita el id y permite enviar nombre, email o
ambos; los campos omitidos conservan su valor.

Los resultados de crear, consultar y modificar contienen id, nombre, email,
fecha de creación y fecha de modificación. La lista presenta esos mismos
datos por usuario y queda vacía cuando no hay usuarios. Borrar no presenta
un usuario. Crear, modificar y borrar actualizan la lista.

Por ejemplo, crear Ada con `ada@example.com` muestra su id y sus cinco datos
y la incorpora a la lista. Consultar ese id muestra la misma información.
Modificar únicamente el nombre a Ada Lovelace conserva su id y email.
Después de borrarla, Ada desaparece de la lista.

Los errores visibles conservan los textos de la aplicación:

| Caso | Mensaje |
| --- | --- |
| Nombre vacío | `Name is empty` |
| Email inválido | `Email is invalid` |
| Email utilizado por otra persona | `Email is already used` |
| Id inexistente al consultar, modificar o borrar | `User not found` |
| Base inaccesible al crear | `Could not create the user` |
| Base inaccesible al listar | `Could not list the users` |
| Base inaccesible al consultar | `Could not find the user` |
| Base inaccesible al modificar | `Could not update the user` |
| Base inaccesible al borrar | `Could not delete the user` |

El cliente se ejecuta desde el proyecto de Jimena en Windows/PowerShell.
La entrega incluye actualizar la documentación del árbol y de la arquitectura.

Quedan fuera instalación, publicación en Marketplace, paquetes nuevos,
otra API o puerto, contraseña, autenticación, permisos, clasificación por
género, búsqueda por nombre o email y reglas o mensajes nuevos. Se conserva
el comportamiento de la lógica, las consultas, la base y los demás clientes.

