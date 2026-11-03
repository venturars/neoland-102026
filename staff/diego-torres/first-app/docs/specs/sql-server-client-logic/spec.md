Issue: #824

# Lógica en el cliente con la base en un servidor

Quien usa first-app hace lo mismo que ahora desde el navegador, la terminal o Jupyter: listar, buscar, crear, modificar, borrar y contar por género. Cambia dónde se aplican las reglas y cómo se ve un usuario.

Las reglas se aplican en el propio cliente. La base de datos vive en un servidor local, que solo guarda y lee. Para usar cualquier cliente, el servidor tiene que estar en marcha. El servidor no sirve la web: la página se abre como fichero en el navegador, con su propio comando.

Lo usa quien prueba la app en su ordenador.

## Qué entra

Lo mismo que hoy: un id, un nombre, un email, o los cambios de nombre y email.

Al modificar, puede llegar solo el nombre, solo el email o los dos. Lo que no llega se queda como estaba.

## Qué sale

Un usuario se ve con su id, su nombre, su email y sus fechas de creación y de último cambio.

Ejemplo al cambiar el nombre de Ana, con id 1:

{ id: 1, name: "Ana Torres", email: "ana@ejemplo.com", createdAt: "2026-11-03 12:14:00", updatedAt: "2026-11-03 16:02:10" }

El recuento por género sale igual que ahora: { women, men, genderUndefined }.

## Fallos

Si el dato no vale:

- nombre vacío → `Name is empty`
- email mal escrito → `Email is invalid`
- email de otro usuario → `Email is already used`
- el usuario no existe → `User not found`

Si no se llega a la base, por ejemplo con el servidor parado:

- al crear → `Could not create the user`
- al modificar → `Could not update the user`
- al borrar → `Could not delete the user`
- al listar → `Could not list the users`
- al buscar → `Could not find the user`
- al contar por género → `Could not classify the users`

## Seguridad

Solo se llega a la base desde este ordenador: desde la terminal, desde Jupyter y desde la página abierta como fichero. Una web de otro sitio abierta en el navegador no puede leer ni cambiar los datos. El servidor no entrega ningún fichero, tampoco el de la base.

## Qué queda fuera

Contraseña o login, notas, abrir la app a otros ordenadores, operaciones nuevas, cambiar las pantallas de la web y añadir paquetes.
