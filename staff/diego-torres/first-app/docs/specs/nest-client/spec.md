Issue: #1040

# Cliente de usuarios con una API Nest

Una API HTTP hecha con Nest para crear, listar, ver, modificar y borrar usuarios. La usa quien prueba la app en su ordenador, por HTTP, sin abrir la web, Electron, las extensiones, la terminal ni Jupyter.

No hay contraseña ni login. No hay página propia. La API escucha en `http://127.0.0.1:3003`, solo en este ordenador. La base tiene que estar en marcha.

## Qué entra y qué sale

- **Crear:** entran el nombre y el email. Sale el usuario.
- **Listar:** no entra nada. Sale la lista de usuarios. Si no hay usuarios, la lista está vacía.
- **Ver:** entra el id. Sale el usuario.
- **Modificar:** entran el id y el nombre, el email o los dos. Lo que no entra conserva el valor guardado. Sale el usuario con los datos nuevos.
- **Borrar:** entra el id. No sale ningún usuario.

Un usuario tiene el id, el nombre, el email y las dos fechas, la de creación y la de la última modificación.

Cualquier otra dirección responde que no existe, sin cuerpo.

## Ejemplo

Se crea Ada con ada@example.com. Sale el id 1, el nombre Ada, el email ada@example.com y las dos fechas. La lista la muestra. Se pide el id 1 y se ven los mismos datos. Se cambia el nombre a Ada Lovelace: se ve el id 1, el nombre Ada Lovelace y el email ada@example.com. Se borra el id 1: la respuesta no trae ningún usuario y Ada ya no sale en la lista.

## Errores

Los mensajes son los de la app, tal como llegan:

- Si el nombre queda vacío, se ve `Name is empty`.
- Si el email no vale, se ve `Email is invalid`.
- Si el email es de otro usuario, se ve `Email is already used`.
- Si ese usuario no está, se ve `User not found`.
- Si no se llega a la base al crear, se ve `Could not create the user`.
- Si no se llega al listar, se ve `Could not list the users`.
- Si no se llega al ver uno, se ve `Could not find the user`.
- Si no se llega al modificar, se ve `Could not update the user`.
- Si no se llega al borrar, se ve `Could not delete the user`.

## Quién puede llamarla

Una página web abierta en el navegador no puede usar esta API: su petición se rechaza. Tampoco se atiende una petición dirigida a otra dirección que no sea la de la API. Esto no es un login: cualquier programa de este ordenador puede llamarla.

## Qué queda fuera

La contraseña, el login, los permisos, buscar por nombre o por email, el recuento de géneros, las notas, una página propia, TypeScript, abrir la API a otros ordenadores, una regla nueva, un mensaje de error nuevo y cambiar lo que ya hacen las reglas, las consultas, la base y los demás clientes.
