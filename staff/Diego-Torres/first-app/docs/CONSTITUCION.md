# Constitución — first-app

first-app enseña a separar las reglas de los usuarios del sitio donde se guardan. Se construye con IA siguiendo esta constitución. Si una tarea y esta constitución chocan, gana la constitución.

## Quién sabe qué

| Carpeta | Sabe | No sabe |
|---|---|---|
| `src/dominio` | Si un nombre y un email son válidos | Si ese email ya existe, ni dónde se guarda |
| `src/casos-de-uso` | Qué pasa al crear, cambiar, borrar o leer | Cómo está hecho el `Map` |
| `src/almacen` | Guardar y recuperar `{ id, nombre, email }` | Si el email es válido o está repetido |
| `paso-1.js`, `ejemplo.js`, `test/` | Llamar y mostrar el resultado | Las reglas. No las repiten |

Las importaciones van en una sola dirección: un cliente llama a un caso de uso, un caso de uso llama al dominio y al almacén, el dominio no llama a nadie de la app. `src/index.js` solo reexporta. No contiene reglas.

## El usuario

Un usuario guardado es `{ id, nombre, email }`.

- `id` es un texto. Lo asigna el almacén: `"1"`, `"2"`, `"3"`. El dominio no lo inventa.
- `nombre` es texto sin espacios al principio ni al final. Vacío no vale.
- `email` va en minúsculas y tiene forma de email: algo, una `@` y un punto.

La salida de un caso de uso lleva solo esos tres campos. No sale el `Map`, ni la fila interna, ni el almacén.

## Almacén

Hoy hay uno: `crearAlmacenMemoria()` en `src/almacen/memoria.js`. No se abre una base de datos.

Cualquier almacén ofrece estas cinco funciones, todas `async`, y ninguna regla:

- `guardar(usuario)` devuelve la copia guardada, con `id`.
- `buscarPorId(id)` devuelve la copia o `null`.
- `buscarPorEmail(email)` devuelve la copia o `null`.
- `listar()` devuelve un array de copias.
- `borrar(id)` devuelve si existía.

El caso de uso recibe el almacén como primer argumento. No elige memoria, SQLite ni HTTP. Un almacén nuevo cumple esas cinco funciones en un fichero nuevo. No se reescribe `memoria.js` para ello.

Al guardar y al leer, el almacén devuelve una copia. Quien la modifique no cambia lo guardado.

## Casos de uso

Las operaciones viven juntas en `src/casos-de-uso/usuarios.js`. No se sacan de esa carpeta. El nombre de la función es la acción y la firma es el contrato: no se pone un comentario de contrato encima. Una operación nueva es una función nueva en ese fichero. Sus reglas no se mudan al dominio, al almacén ni a un cliente.

| Función | Hace | Devuelve |
|---|---|---|
| `crearUsuario(almacen, { nombre, email })` | Valida. Si el email ya está, falla. Guarda. | El usuario con `id` |
| `actualizarUsuario(almacen, id, cambios)` | Si el id no existe, falla. Valida el cambio. Si el email nuevo es de otro, falla. Guarda. | El usuario ya cambiado |
| `eliminarUsuario(almacen, id)` | Si el id no existe, falla. Borra. | El usuario que borró |
| `obtenerUsuario(almacen, id)` | Si el id no existe, falla. | El usuario |
| `listarUsuarios(almacen)` | Lee la lista. | El array, vacío si no hay nadie |
| `buscarUsuarioPorEmail(almacen, email)` | Valida el email. Lo busca. | El usuario, o `null` si no está |

`crearUsuario` recibe `{ nombre, email }` porque el dominio valida ese objeto entero. `actualizarUsuario` recibe el `id` y los `cambios` por separado. `cambios` trae `nombre`, `email` o los dos. Si no trae ninguno, falla.

El orden dentro de la función no se mezcla: primero la regla que se puede decidir con los datos en la mano, después la que necesita mirar el almacén, después guardar o borrar, y al final el dato de salida. En `actualizarUsuario` el usuario se busca antes de validar el cambio, porque el cambio se aplica sobre el usuario que ya existe.

## Errores

Solo existen estas tres clases, en `src/dominio/usuario.js`. El mensaje es exactamente uno de estos:

- `DatosInvalidos`: `El nombre es obligatorio`
- `DatosInvalidos`: `El email no es válido`
- `DatosInvalidos`: `Hay que indicar un nombre o un email`
- `EmailDuplicado`: `El email <email> ya está registrado`
- `UsuarioNoEncontrado`: `No existe un usuario con id <id>`

`DatosInvalidos` lo lanza el dominio. `EmailDuplicado` y `UsuarioNoEncontrado` los lanzan los casos de uso. No se añaden clases, códigos ni mensajes nuevos.

## Dominio

`src/dominio/usuario.js` no importa el almacén.

- `validarEmail(email)` recorta el email, lo pasa a minúsculas y lo devuelve. Si no tiene forma de email, falla.
- `validarUsuarioNuevo({ nombre, email })` recorta el nombre, pasa el email a minúsculas y devuelve `{ nombre, email }`.
- `validarCambios(actual, cambios)` parte del usuario guardado y cambia el nombre, el email o los dos.

El dominio no comprueba si el email ya existe. Esa regla vive en el caso de uso, porque hace falta mirar a los demás.

## Qué no entra todavía

SQLite, HTTP, Jupyter y el frontend no se añaden hasta que se pida esa iteración. Cuando lleguen, llaman a los casos de uso que ya existen. No copian la regla de “el email es único”.
