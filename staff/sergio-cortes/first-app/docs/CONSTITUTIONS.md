# Constitución

first-app es una app para aprender los conceptos básicos de login. Se construye con IA siguiendo el sistema SDD. Un desarrollo nuevo no empieza en el código: antes está la issue, escrita por su subagente; después pasa por `spec.md`, `plan.md` y `tasks.md`, y un humano lee cada uno antes de seguir. La spec abre con `Issue: #N`.

## Guías

- `docs/ARCHITECTURE.md` dice la responsabilidad de cada capa y de cada fichero.
- `docs/TREE.md` es el árbol.
- `docs/DATABASE.md` es la base de datos y las queries.
- `docs/ERRORS.md` es la lista de errores.
- `docs/STYLE.md` es la forma de cada línea y las convenciones.

## Specs

Una funcionalidad vive en `docs/specs/<nombre>/`. El nombre va en kebab-case. Ahí hay tres ficheros, y se escriben en este orden: `spec.md`, `plan.md`, `tasks.md`. Cada uno se lee de un tirón. Lo que dice uno no se repite en el otro. El texto es escueto, concreto y determinista.

`spec.md` es el negocio. Lo lee quien decide si la funcionalidad es la que quiere, sin abrir el código. Dice qué se pide, quién lo usa, qué entra, qué sale con un ejemplo, y qué fallo se ve. Un fallo nombra un mensaje de la lista de «Errores». También dice qué queda fuera. No nombra ficheros, funciones ni SQL.

`plan.md` es la técnica. Lo lee quien comprueba que el desarrollo cabe en esta constitución. Dice:

- qué ficheros se crean y cuáles se tocan
- si hace falta, qué cambios van en `docs/TREE.md`, en `docs/ARCHITECTURE.md` y en `docs/CONSTITUTIONS.md` (firmas en «Un fichero logic», clientes terminal)
- a qué fichero de `logic/` se parece, sin pegar su código
- la firma: nombre, parámetros y salida
- el SQL nuevo, con los parámetros con nombre (`:id`, `:name`, `:email`)
- qué mensaje de «Errores» corresponde a cada fallo de la spec

Una funcionalidad nueva es un fichero nuevo en `src/logic/`. Si la constitución, el código actual y la spec no dicen lo mismo, la pregunta se escribe al final del `plan.md` y ahí se para. No hay `tasks.md` ni código hasta tener la respuesta.

`tasks.md` son los pasos, en el orden en que los haría una persona. Cada paso abre un sitio, hace una cosa y deja un resultado que se puede mirar. Un paso son como mucho cuatro líneas. Si el desarrollo no es una funcionalidad nueva, el grano es el mismo: mirar lo que ya existe, cambiar un sitio, comprobar. Si el desarrollo añade o cambia paquetes de Node, el primer paso de `tasks.md` dice que solo se ejecuta tras la aprobación de «Paquetes».

## Paquetes

Un paquete de Node nuevo, o un cambio de su versión, se valida con Socket antes de aceptar el plan.

Entra ese paquete en la versión exacta que propone el plan, y sus dependencias hasta 3 capas, cada una con versión concreta.

El plan incluye, antes de pedir aprobación, un resumen por cada paquete revisado: si esa versión está en una campaña, si tiene alerta, las puntuaciones license, maintenance, quality, supplyChain y vulnerability, y si alguna baja de 50.

Las alertas las decide la persona. El agente no las acepta por su cuenta.

Si el resumen no está, o la consulta no se pudo completar, el plan no está listo: la pregunta queda al final del plan y no hay `tasks.md`.

Nadie instala ni cambia `package.json` ni el lock de ese desarrollo hasta que la persona haya aprobado el `spec.md` y el `plan.md`, y haya aceptado las alertas abiertas si las hubo.

Queda fuera un paquete que no es de Node, un paquete cuya versión no cambia, mirar más de 3 capas y que el agente decida las alertas.

El procedimiento para consultar Socket está en `AGENTS.md`.

## Logic no se reemplaza

Los ficheros de `src/logic/` no son un adaptador ni una capa intercambiable. No se sustituyen por otra implementación, no se convierten en plugins y no se mueven sus reglas a `src/queries/` ni a `src/clients/`.

## Un fichero logic

Un fichero, una función. El nombre, la entrada y la salida los define la firma. No hay un comentario de contrato encima de la función.

El nombre es la acción (`createUser`, `updateUser`, `deleteUser`, `findUserById`, `findUserByEmail`, `findUserByName`, `listUsers`, `usersGenderCount`).

Esos nombres son solo ejemplos; no hay que ampliar la lista en cada funcionalidad nueva.

Si la función usa varios datos, como `name`, `email` e `id`, recibe un solo `input` y lee ahí cada valor. Si el dato es uno solo, como `id`, `email` o `name`, el argumento es ese valor. No se mete en un objeto.

Ningún fichero de `src/logic/` abre la base. Llaman a `src/queries/user.js`. Donde hay una fila, devuelven `id`, `name`, `email`, `createdAt` y `updatedAt`.

El cuerpo sigue este orden, y no se mezcla:

1. Validar los parámetros de entrada.
2. Validar el resto de reglas de negocio. Ahí se puede llamar a una query de lectura, como `findById` o `findByEmail`, para comprobar la regla antes de escribir.
3. Aplicar la lógica de negocio.
4. Estructurar la salida y sanear la respuesta.
