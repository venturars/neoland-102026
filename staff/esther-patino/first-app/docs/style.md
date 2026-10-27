## Comandos

- Ejecutar: no hay comando de arranque.
- Tests: los `.txt` de `clients/terminal/`. Se pegan en PowerShell desde la raíz del repositorio. El fragmento entra en `first-app` y no captura errores. No hay `npm test`.
- Lint/formato: `format` lanza Prettier, sin fichero de configuración. `lint` lanza ESLint con `eslint.config.js`.

## Estilo y convenciones

El código se escribe en inglés. El proyecto es para personas hispanohablantes: los comentarios pueden ir en español.

Ficheros en kebab-case, funciones y variables en camelCase, exportaciones con nombre e imports ESM con extensión `.js`. El SQL usa parámetros con nombre (`:id`, `:name`, `:email`). El contrato de `logic/` está en `docs/CONSTITUTIONS.md`. El manejo de errores está en `docs/errors.md`.

El orden del cuerpo está en este archivo, más abajo. En una acción que guarda o borra: comprobar lo que llega, llamar a la consulta que busca, lanzar el error si no se puede seguir y llamar a la consulta que guarda o borra. Si guarda, devuelve el usuario plano. Borrar termina en `removeUser` y no devuelve el usuario. `listUsers` no guarda ni borra: lee con `findAll` y devuelve la lista. Si la tabla está vacía, devuelve `[]`. La lógica no abre los `.sql` y no inventa el `id` ni la hora.

El código tiene que leerse de arriba a abajo, con `if` y con nombres que digan qué hacen. Se evita el código que un programador sin IA no escribiría: envoltorios de resultado, clases de error, helpers genéricos y abstracciones que oculten los pasos.

El formato es el estándar de Prettier, sin configuración propia: comillas dobles, punto y coma, coma final, indentación de 2 espacios y ancho de 80.

## 4. Cómo se lee el código

El código está en inglés. Lo tiene que poder seguir una persona que empieza, leyéndolo de arriba abajo.

Se escribe con `if`, con `throw new Error("...")` y con nombres que dicen la acción: `createUser`, `validateEmail`, `findById`.

Una acción de negocio, un archivo en `logic/`. El SQL, un archivo en `queries/queries/`.

No se añaden capas para esconder un paso: ni clases de error, ni helpers genéricos, ni un objeto que envuelva el resultado.

## 5. Orden del cuerpo de la función

Dentro de una acción que guarda o borra, el cuerpo va en este orden:

1. Comprobar lo que llega.
2. Llamar a la consulta que busca.
3. Si no se puede seguir, lanzar el error.
4. Llamar a la consulta que guarda o borra.
5. Si guarda, devolver el usuario plano. Borrar no devuelve el usuario: termina en `removeUser`.

`listUsers` no guarda ni borra. Lee con `findAll` y devuelve la lista. Si la tabla está vacía, devuelve `[]`.

`findUserByEmail` no guarda ni borra. Comprueba el email, lee con `findByEmail` y devuelve el usuario plano. Si no hay fila, lanza `User not found`.

`findUserById` no guarda ni borra. Comprueba el id, lee con `findById` y devuelve el usuario plano. Si no hay fila, lanza `User not found`.

Cada línea hace una sola cosa.

Cada línea dice lo que hace.

Una constante es un valor que no cambia. Se escribe al principio del archivo y su nombre va en mayúsculas, con `_` entre palabras. Una variable sigue en camelCase.

Lo tiene que poder leer una persona que empieza, como escrito a mano.
