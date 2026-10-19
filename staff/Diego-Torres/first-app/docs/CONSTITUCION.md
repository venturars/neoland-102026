# Constitución — first-app

first-app es una app para aprender a separar las reglas de los usuarios del sitio donde se guardan. Se construye con IA siguiendo esta constitución.

## Árbol

```
first-app/
  src/
    dominio/
      usuario.js          Qué es un usuario válido. No mira a los demás
      errores.js          DatosInvalidos, EmailDuplicado, UsuarioNoEncontrado
    casos-de-uso/
      crear-usuario.js    Una operación por fichero
      actualizar-usuario.js
      eliminar-usuario.js
      consultar-usuarios.js
    almacen/
      contrato.js         Las 5 funciones que cualquier almacén debe tener
      memoria.js          El almacén de ahora: un Map
    index.js              Reexporta dominio, casos de uso y almacén
  paso-1.js               Primer cliente. Solo llama al dominio
  ejemplo.js              Cliente manual de los casos de uso
  test/
    usuarios.test.js      Prueba las reglas con el almacén en memoria
  docs/
    CONSTITUCION.md       Esta base
```

- `src/dominio/` dice si un nombre y un email son válidos. No abre un almacén, no busca duplicados y no asigna `id`.
- `src/casos-de-uso/` es el núcleo. Aquí viven las reglas que necesitan mirar a los demás usuarios.
- `src/almacen/` guarda y recupera. No contiene reglas de negocio.
- `paso-1.js` es el primer cliente. Sirve de prueba manual del dominio. `ejemplo.js` hace lo mismo con los casos de uso.

## Almacén

Hoy hay un solo almacén: el que devuelve `crearAlmacenMemoria()` en `src/almacen/memoria.js`. No se abre una base de datos.

Cualquier almacén, el de memoria o uno que llegue después, exporta estas funciones y ninguna regla:

- `guardar(usuario)` devuelve el usuario con `id`.
- `buscarPorId(id)` devuelve el usuario o `null`.
- `buscarPorEmail(email)` devuelve el usuario o `null`.
- `listar()` devuelve un array.
- `borrar(id)` devuelve si existía.

Las cinco son `async`. Un caso de uso recibe el almacén como primer argumento. No elige la memoria, SQLite ni el navegador.

El usuario que sale del almacén tiene `id`, `nombre` y `email`. El `id` es un texto. El almacén copia el objeto al guardarlo y al leerlo.

## Los casos de uso no se reemplazan

`src/casos-de-uso/` no es un adaptador. No se sustituye por otra implementación, no se convierte en plugins y no se mueven sus reglas a `src/dominio/`, a `src/almacen/` ni a un cliente.

Cada operación es un fichero. Un fichero ya creado no se reemplaza para encajar otra tarea. Una operación nueva es un fichero nuevo. `consultar-usuarios.js` agrupa las dos lecturas, `obtenerUsuario` y `listarUsuarios`, y no se usa para escribir.

## Un fichero de caso de uso

Un fichero, una operación. El nombre, la entrada y la salida los define la firma. No hay un comentario de contrato encima de la función.

El nombre es la acción (`crearUsuario`, `actualizarUsuario`, `eliminarUsuario`, `obtenerUsuario`, `listarUsuarios`). El primer parámetro es siempre `almacen`. El resto lleva su nombre (`datos`, `id`, `cambios`). `crearUsuario` recibe `{ nombre, email }` porque el dominio valida ese objeto. `actualizarUsuario` recibe el `id` y los `cambios`.

El cuerpo sigue este orden, y no se mezcla:

1. Validar la entrada con el dominio.
2. Validar el resto de reglas, las que miran el almacén.
3. Guardar o borrar.
4. Devolver el usuario o la lista. Solo `id`, `nombre` y `email`.

`eliminarUsuario` devuelve el usuario que borró. `listarUsuarios` devuelve el array. Ninguna función devuelve el `Map` ni un error interno del almacén.

## Errores

Un fallo de las reglas se señala con una clase de `src/dominio/errores.js`. El mensaje está en español. No se inventan otras clases ni otros textos.

En los pasos 1 y 2:

- `DatosInvalidos`: `El nombre es obligatorio`
- `DatosInvalidos`: `El email no es válido`
- `DatosInvalidos`: `Hay que indicar un nombre o un email`
- `EmailDuplicado`: `El email <email> ya está registrado`
- `UsuarioNoEncontrado`: `No existe un usuario con id <id>`

El dominio solo lanza `DatosInvalidos`. El email repetido y el usuario que no existe los lanzan los casos de uso, porque para saberlo hay que mirar el almacén.

## Dominio

`src/dominio/usuario.js` no importa el almacén.

- `validarUsuarioNuevo` exige nombre con texto y email con forma de email. Recorta el nombre y pasa el email a minúsculas.
- `validarCambios` parte de un usuario ya guardado. Aplica nombre, email o los dos. Si no viene ninguno, falla.

El dominio no comprueba si el email ya existe.
