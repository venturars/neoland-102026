Issue: #1066

# Buscar un usuario por email desde Chrome, VS Code y la API de Nest

Quien prueba la app busca un usuario por su email desde la extensión de Chrome, la extensión de VS Code o la API de Nest, sin ir a la terminal ni a Jupyter.

La búsqueda es la que ya hace la app: el email se recorta y pasa a minúsculas antes de buscar, y tiene que coincidir entero. `ANA@ejemplo.com` encuentra a quien tiene `ana@ejemplo.com`. `ana` no encuentra a nadie, porque no tiene forma de email.

La base tiene que estar en marcha. En Chrome, también su API local.

## Qué entra y qué sale

Entra el email. Sale un usuario, porque el email es único: el id, el nombre, el email y las dos fechas.

## Pantalla de las extensiones

Chrome y VS Code tienen un formulario «Buscar por email» con un campo. Al enviarlo, el usuario se ve en el mismo sitio que al usar «Ver». Lo escrito se queda en el campo.

## API

En la API de la extensión de Chrome y en la de Nest, se pide por HTTP con el email y sale el usuario.

Una petición desde una web o dirigida a otra dirección se rechaza, igual que en el resto de cada API.

## Ejemplo

Se busca `ana@ejemplo.com`. Sale el usuario con ese email, con su id, Ana García y las dos fechas. Se busca `nadie@ejemplo.com` y se ve `User not found`. Se busca `ana` y se ve `Email is invalid`.

## Errores

- Si el email no vale, también si está vacío, se ve `Email is invalid`.
- Si ese usuario no está, se ve `User not found`.
- Si no se llega a la base, se ve `Could not find the user`. En Chrome se ve el mismo mensaje si su API local está parada.

## Qué queda fuera

La web y Electron, buscar por nombre, contar por género, buscar por una parte del email, una regla nueva, un mensaje de error nuevo y cambiar lo que ya hacen las reglas, las consultas, la base, la terminal y Jupyter.

Las specs de Chrome, VS Code y Nest dejaban fuera esta búsqueda. Esta spec la añade a propósito.
