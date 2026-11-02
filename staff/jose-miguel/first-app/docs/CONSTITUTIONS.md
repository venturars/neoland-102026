# CONSTITUTIONS.md — first-app

Reglas estables del proyecto. El código se adapta a este documento, no al revés. Los clients cambian; la logic no se reemplaza.

## Guías

- `docs/ARCHITECTURE.md` dice la responsabilidad de cada capa y de cada fichero.
- `docs/TREE.md` es el árbol.
- `docs/DATABASE.md` es la base de datos y las queries.
- `docs/ERRORS.md` es la lista de errores.
- `docs/STYLE.md` es la forma de cada línea y las convenciones.

## Logic no se reemplaza

`logic/` no es un adaptador ni una capa intercambiable. No se sustituye por otra implementación, no se convierte en plugins y no se mueven sus reglas a `queries/` ni a `clients/`.

Cada funcionalidad es un fichero. Un fichero de `logic/` ya creado no se reemplaza para encajar otra tarea. Una funcionalidad nueva es un fichero nuevo.

### Un fichero de logic

Un fichero, una función. El nombre es la acción (`createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserByEmail`). Los parámetros van en la firma, con su nombre. `createUser` recibe un array con nombre y email en las posiciones 0 y 1. `updateUser` recibe el `id` y un array con los cambios en las posiciones 0 y 1.

Ejemplos de firma:

- `createUser(input)`
- `updateUser(id, changes)`
- `deleteUser(id)`
- `listUsers()`
- `findUserByEmail(email)`

El cuerpo sigue este orden y **no se mezcla**:

1. Validar los parámetros de entrada.
2. Validar el resto de reglas de negocio.
3. Aplicar la lógica de negocio.
4. Estructurar la salida y sanear la respuesta.

La salida del paso 4 es el dato de la operación: el usuario, la lista de usuarios, o nada si la operación no devuelve datos. Solo incluye los campos que el client necesita (`id`, `name`, `email`, `createdAt`, `updatedAt`). No salen objetos de SQLite ni errores internos de la base de datos.

La forma de cada línea está en `docs/STYLE.md`.

Reglas de los datos:

- El nombre es obligatorio, se recorta, máximo 100 caracteres.
- El email es obligatorio, se recorta, se guarda en minúsculas, máximo 255 caracteres, y tiene formato de email.
- El email no puede repetirse.

## SDD

Un desarrollo nuevo vive en `docs/specs/<nombre>/`. Son tres ficheros cortos. Se leen enteros.

- `spec.md` es el negocio: qué se pide, reglas, salida y errores. Sin código.
- `plan.md` es la técnica: qué ficheros se tocan y cómo encaja en `logic/`, `queries/` y `clients/`.
- `tasks.md` son los pasos, en orden, como los haría una persona. Un paso, una acción. Si el desarrollo añade o cambia paquetes de Node, el primer paso de `tasks.md` dice que solo se ejecuta tras aprobación del `spec.md` y del `plan.md` (y de las alertas Socket, si las hubo).

Una persona revisa `spec.md`, después `plan.md`, después `tasks.md`. El código se escribe solo cuando esos tres están aceptados.

No hay bucle. Un fichero anterior no se reescribe salvo que la persona lo pida.

## Paquetes

Un paquete de Node nuevo, o un cambio de su versión, se valida con Socket antes de que una persona apruebe el `spec.md` y el `plan.md` de ese desarrollo.

Entra el paquete principal con la **versión exacta** que propone el plan. Entran sus dependencias de ecosistema `npm` hasta **3 capas**, cada una con versión concreta en el resumen (no rangos).

Si el plan propone paquetes, el `plan.md` incluye la sección `## Validación Socket` descrita en `AGENTS.md` **antes** de pedir esa aprobación. El resumen dice, para el paquete y para cada dependencia revisada, si hay campaña, si hay alertas relevantes y si alguna stat queda por debajo de 50 puntos.

Las alertas abiertas relevantes las decide la persona: no se sigue con esas dependencias hasta que diga si las acepta.

Si la consulta Socket no se completa, no se inventa el resumen. Se documenta el motivo en el `plan.md` y la pregunta queda al final del plan. No hay `tasks.md` hasta tener respuesta.

Nadie instala ni cambia versiones en `package.json` ni en `pnpm-lock.yaml` por un desarrollo hasta que un humano haya leído y aprobado el `spec.md` y el `plan.md` de ese desarrollo (y, si hubo alertas, las haya aceptado o rechazado).

Queda fuera comprobar paquetes que no son de Node, comprobar un paquete cuya versión no cambia en el plan, mirar más de 3 capas, decidir alertas sin la persona y sustituir Socket por otra herramienta para esta validación.

El procedimiento concreto (MCP, árbol de dependencias y tabla) está en `AGENTS.md`.
