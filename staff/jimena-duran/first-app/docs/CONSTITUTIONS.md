# Constitución de first-app

first-app es una aplicación educativa para practicar los fundamentos de login. El desarrollo se organiza con SDD.

## Organización

```
first-app/
  db/connection.js       conexión única a SQLite
  db/users.sqlite        base de datos única
  queries/queries/       un archivo .sql por consulta
  queries/users.js       carga y ejecuta las consultas
  logic/                  una función de negocio por archivo
    create-user.js, update-user.js, delete-user.js
    list-users.js, find-user-by-email.js, find-user-by-id.js
    find-users-by-name.js
    users-gender-count.js
  clients/terminal/       cliente inicial y prueba manual
  docs/CONSTITUTIONS.md   reglas de este proyecto
  docs/specs/<nombre>/    spec.md, plan.md y tasks.md
```

`db/` solo abre la base. El SQL permanece en `queries/queries/`; `queries/users.js` lo lee y lo ejecuta, sin reglas de negocio. Las decisiones de negocio viven en `logic/`. Los clientes de terminal invocan esa capa y muestran su resultado. El nombre de cada spec usa kebab-case.

## Documentación de funcionalidades

`spec.md` explica el comportamiento desde el punto de vista del negocio: usuario, entradas, salidas ejemplificadas, errores visibles y límites. No incluye nombres de archivos, funciones ni SQL. Cada error debe corresponder a un mensaje de la sección «Errores».

`plan.md` describe la solución técnica: archivos afectados, una implementación existente que sirva de referencia sin copiarla, firma de la función, SQL con parámetros nombrados (`:id`, `:name`, `:email`) y el error asociado a cada caso de la spec.

Una funcionalidad nueva ocupa un archivo nuevo. Si las reglas, el código y la spec discrepan, la duda se anota al final del plan y se detiene el trabajo hasta resolverla. `tasks.md` divide el trabajo en acciones ordenadas, cada una con un único resultado comprobable y no más de cuatro líneas. Para cambios que no agregan una funcionalidad se conserva ese mismo nivel de detalle: inspeccionar, modificar y verificar.

La documentación debe ser breve, concreta y determinista; no se añade complejidad que dificulte leerla.

## Persistencia

La aplicación utiliza únicamente `db/users.sqlite` y la conexión exportada por `db/connection.js`. No se crean bases ni conexiones alternativas.

La tabla `users` tiene estas reglas:

- `id` es `INTEGER PRIMARY KEY` y SQLite lo genera de forma incremental.
- `email` es `VARCHAR(64) NOT NULL UNIQUE`.
- `name` es `TEXT NOT NULL`.
- `createdAt` y `updatedAt` se almacenan como `TEXT` con el formato `YYYY-MM-DD HH:MM:SS`, producido por `datetime('now', 'localtime')`.

## Capa de lógica

`logic/` es el núcleo estable de la aplicación. No se reemplaza por adaptadores, plugins o implementaciones intercambiables, y sus reglas no se trasladan a `queries/` ni a `clients/`. Cada operación tiene su propio archivo; una operación nueva no modifica otro archivo para reutilizarlo.

Cada archivo de `logic/` exporta una sola función. La firma define el nombre, las entradas y la salida, y no se acompaña de un comentario de contrato. Las acciones usan nombres como `createUser`, `updateUser`, `deleteUser` y `listUsers`; los argumentos se declaran directamente (`name`, `email`, `id`) en vez de envolverlos en un objeto cuando ya se conocen.

El clasificador devuelve únicamente `women`, `men` y `genderUndefined`.

El cuerpo de una función mantiene este orden:

1. Comprobar los argumentos recibidos.
2. Comprobar las demás reglas del negocio.
3. Ejecutar la operación de negocio.
4. Preparar y limpiar el valor que se devuelve.

## Valores y errores

Los valores fijos se declaran como constantes en MAYÚSCULAS; las variables normales usan camelCase.

Los fallos se comunican con `throw new Error("...")`. No se definen códigos ni clases de error propias. El texto siempre está en inglés y pertenece a esta lista:

- `Name is empty`
- `Email is invalid`
- `Email is already used`
- `User not found`
- `Could not create the user`
- `Could not update the user`
- `Could not delete the user`
- `Could not list the users`
- `Could not find the user`
- `Could not classify the users`

Los cuatro primeros mensajes corresponden a validación de entrada o reglas de negocio. Si SQLite falla durante la operación se utiliza el mensaje `Could not ...` correspondiente y el error de la base no se propaga desde `logic/`. Cuando la operación termina correctamente se entrega el dato limpio; las operaciones que devuelven listas retornan `[]` cuando no hay resultados. En las demás operaciones, si no hay datos que devolver, la función no devuelve ningún valor.

## Consultas SQL

El texto SQL no se escribe dentro de la función de lógica que lo utiliza. En `queries/queries/` cada consulta tiene su propio `.sql`, que contiene solo SQL y parámetros nombrados (`:id`, `:name`, `:email`). `queries/users.js` carga esos archivos, prepara las sentencias con `db` y las ejecuta; sus funciones pueden ser llamadas desde `logic/`.
