Issue: #1064

# Buscar usuarios por nombre desde Chrome, VS Code y la API de Nest

Quien prueba la app busca usuarios por su nombre desde la extensión de Chrome, la extensión de VS Code o la API de Nest, sin ir a la terminal ni a Jupyter.

La búsqueda es la que ya hace la app: el nombre tiene que coincidir entero y con las mismas mayúsculas y acentos. `Ana García` encuentra a Ana García. `Ana` y `ana garcía` no la encuentran. Antes de buscar, se quitan los espacios del principio y del final.

La base tiene que estar en marcha. En Chrome, también su API local.

## Qué entra y qué sale

Entra el nombre. Sale la lista de usuarios con ese nombre, porque puede haber varios. Cada uno trae el id, el nombre, el email y las dos fechas. Si no hay ninguno, la lista está vacía y no es un error.

## Pantalla de las extensiones

Chrome y VS Code tienen un formulario «Buscar por nombre» con un campo. Al enviarlo, se ven los usuarios encontrados, separados de la lista general, que no cambia. Si no hay ninguno, se ve el aviso «No hay usuarios con ese nombre».

Lo escrito se queda en el campo, para poder corregirlo. Al hacer otra acción, los resultados desaparecen.

## API

En la API de la extensión de Chrome y en la de Nest, se pide por HTTP con el nombre y sale la lista.

Una petición desde una web o dirigida a otra dirección se rechaza, igual que en el resto de cada API.

## Ejemplo

Se busca `Ana García`. Sale una lista con un usuario: su id, Ana García, su email y las dos fechas. Se busca `Ana`. La lista sale vacía y las extensiones muestran «No hay usuarios con ese nombre». Se busca con el campo vacío y se ve `Name is empty`.

## Errores

- Si el nombre queda vacío, se ve `Name is empty`.
- Si no se llega a la base, se ve `Could not find the user`. En Chrome se ve el mismo mensaje si su API local está parada.

## Qué queda fuera

La web y Electron, buscar por email, contar por género, buscar por una parte del nombre, no distinguir mayúsculas o acentos, una regla nueva, un mensaje de error nuevo y cambiar lo que ya hacen las reglas, las consultas, la base, la terminal y Jupyter.

Las specs de Chrome, VS Code y Nest dejaban fuera esta búsqueda. Esta spec la añade a propósito.
