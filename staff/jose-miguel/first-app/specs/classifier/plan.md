# Plan técnico

Firma: `userGendersCount()`. Sin parámetros. El fichero es `logic/user-genders-count.js`. No se reemplaza ningún fichero de `logic/` ya creado.

Lee los usuarios con `listUsers` de `queries/users.js`. No hay SQL nuevo. `logic/` no abre la base de datos.

Si no hay usuarios, el resultado es 0, 0, 0.

## IA

La llamada vive en `logic/user-genders-count.js`. `queries/` sigue siendo solo SQL.

Por cada usuario ya guardado, se envía su nombre a Llama 3.2 en local, a través de nimble v3, sin coste.

Se pide el género de ese nombre. La respuesta que cuenta es mujer u hombre.

Si nimble v3 no manda un mensaje, o la respuesta no trae mujer ni hombre, ese usuario suma un no definido.

El modelo se carga una vez y se reutiliza para todos los nombres. No se guarda la respuesta.

Antes de escribir código, la constitución tiene que permitir esa llamada, porque hoy `logic/` solo puede llamar a `queries/users.js`.

La salida es un único array de tres números, en este orden: mujeres, hombres, no definidos. No se guarda.

La llamada a `queries/` va en `try/catch`. El `catch` lanza `"Could not count the users by gender"`. Ese mensaje se añade a la sección 4 de `docs/CONSTITUTIONS.md` antes de escribir código.

El cliente es `clients/terminal/user-genders-count.txt`. Importa `userGendersCount` y hace `console.log` del resultado.

## Ficheros

Se crean:

- `logic/user-genders-count.js`
- `clients/terminal/user-genders-count.txt`

Se editan:

- `docs/CONSTITUTIONS.md`, para permitir la llamada a nimble v3 y añadir el mensaje de error.

Se eliminan:

- Ninguno.
