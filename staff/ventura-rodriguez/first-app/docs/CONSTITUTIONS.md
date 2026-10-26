# Constitución — first-app

first-app es una app para aprender los conceptos básicos de login. Se construye con IA siguiendo el sistema SDD. Un desarrollo nuevo no empieza en el código: pasa por `spec.md`, `plan.md` y `tasks.md`, y un humano lee cada uno antes de seguir.

## Guías

- `docs/ARCHITECTURE.md` dice la responsabilidad de cada capa y de cada fichero.
- `docs/TREE.md` es el árbol.
- `docs/DATABASE.md` es la base de datos y las queries.
- `docs/ERRORS.md` es la lista de errores.
- `docs/STYLE.md` es la forma de cada línea y las convenciones.

## Specs

`spec.md` es el negocio. Lo lee quien decide si la funcionalidad es la que quiere, sin abrir el código. Dice qué se pide, quién lo usa, qué entra, qué sale con un ejemplo, y qué fallo se ve. Un fallo nombra un mensaje de la lista de «Errores». También dice qué queda fuera. No nombra ficheros, funciones ni SQL.

`plan.md` es la técnica. Lo lee quien comprueba que el desarrollo cabe en esta constitución. Dice:

- qué ficheros se crean y cuáles se tocan
- a qué fichero de `logic/` se parece, sin pegar su código
- la firma: nombre, parámetros y salida
- el SQL nuevo, con los parámetros con nombre (`:id`, `:name`, `:email`)
- qué mensaje de «Errores» corresponde a cada fallo de la spec

Una funcionalidad nueva es un fichero nuevo. Si la constitución, el código actual y la spec no dicen lo mismo, la pregunta se escribe al final del plan y ahí se para. No hay tareas ni código hasta tener la respuesta.

`tasks.md` son los pasos, en el orden en que los haría una persona. Cada paso abre un sitio, hace una cosa y deja un resultado que se puede mirar. Un paso son como mucho cuatro líneas.

Si el desarrollo no es una funcionalidad nueva, los pasos siguen teniendo el mismo grano: mirar lo que ya existe, cambiar un sitio, comprobar.

Estos ficehros deben contener la información d forma escueta, concreta y determinista. Tratando de no agregar complejidad a la lectura de los ficheros.

## Paquetes

Un paquete de Node nuevo, o un cambio de su versión, se valida con Socket.

## Logic no se reemplaza

`logic/` no es un adaptador ni una capa intercambiable. No se sustituye por otra implementación, no se convierte en plugins y no se mueven sus reglas a `queries/` ni a `clients/`.

Cada funcionalidad es un fichero. Un fichero de `logic/` ya creado no se reemplaza para encajar otra tarea. Una funcionalidad nueva es un fichero nuevo.

## Un fichero de logic

Un fichero, una función. El nombre, la entrada y la salida los define la firma. No hay un comentario de contrato encima de la función.

El nombre es la acción (`createUser`, `updateUser`, `deleteUser`, `listUsers`). Los parámetros van en la firma, con su nombre (`name`, `email`, `id`). `createUser` recibe un objeto con `name` y `email`. `updateUser` recibe el `id` y un objeto con los cambios. Un campo `undefined` de ese objeto conserva el valor guardado.

El cuerpo sigue este orden, y no se mezcla:

1. Validar los parámetros de entrada.
2. Validar el resto de reglas de negocio.
3. Aplicar la lógica de negocio.
4. Estructurar la salida y sanear la respuesta.
