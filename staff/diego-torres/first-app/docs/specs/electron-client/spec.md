Issue: #935

# Cliente de escritorio de usuarios

Una aplicación de escritorio propia, con su ventana, para crear, listar, ver, modificar y borrar usuarios. La usa quien prueba la app en su ordenador, sin abrir el navegador, la terminal ni Jupyter.

No hay contraseña ni login. La base tiene que estar en marcha.

## Pantallas

### 1. Lista

Es la primera pantalla. Sale la lista de usuarios guardados. Cada uno muestra el id, el nombre y el email, por ejemplo `#1 · Ada — ada@example.com`. Si no hay usuarios, se ve `No hay usuarios todavía`.

- Alta: entran el nombre y el email. Al pulsar «Crear», el usuario aparece en la lista y el formulario se vacía. Si falla, se queda lo escrito y se ve el mensaje de error.
- Ver uno: entra el id. Al pulsar «Ver» se abre su ficha.
- Pulsar un usuario de la lista abre su ficha.

### 2. Ficha

Se ven el id, el nombre, el email y las dos fechas, la de creación y la de la última modificación.

- «Guardar»: guarda el nombre y el email del formulario, que ya vienen rellenos. Si sale bien, la ficha muestra los datos nuevos y se ve `Datos guardados`. Si falla, se queda lo escrito y se ve el mensaje de error.
- «Eliminar»: pide confirmación. Si confirmas, se borra el usuario y se vuelve a la lista, donde ya no aparece. Si cancelas, no pasa nada.
- «Volver»: vuelve a la lista sin guardar.

## Ejemplo

Se crea Ada con ada@example.com. La lista muestra `#1 · Ada — ada@example.com`. Se pide el id 1 y se ven los mismos datos y las dos fechas. Se cambia el nombre a Ada Lovelace: se ve el id 1, el nombre Ada Lovelace y el email ada@example.com. Se elimina y se confirma: Ada ya no sale en la lista.

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

## Qué queda fuera

Generar instaladores, reutilizar el cliente de navegador, buscar por nombre o por email, el recuento de géneros, las notas, cualquier login o contraseña, una regla nueva, un mensaje de error nuevo y cambiar lo que ya hacen las reglas, las consultas, la base y los demás clientes.
