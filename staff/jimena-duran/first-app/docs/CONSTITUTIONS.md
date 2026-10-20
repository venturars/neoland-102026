# Constitución — first-app

first-app es una app para aprender los conceptos básicos de login. Se construye siguiendo el sistema SDD.

## Árbol

```
first-app/
  db/
    connection.js       Única conexión a la base de datos
    users.sqlite        Único fichero de la base de datos
  queries/
    queries/            Texto SQL, un fichero .sql por query
    users.js            Lee esos ficheros, prepara el SQL y lo ejecuta
  logic/
    create-user.js      Una funcionalidad por fichero
    update-user.js
    delete-user.js
    list-users.js
    find-user-by-email.js
    find-user-by-id.js
    users-gender-count.js
  clients/
    terminal/           Primer cliente. Sirve de test manual
  docs/
    CONSTITUTIONS.md    Esta base
    specs/
      <nombre>/
        spec.md         Negocio del desarrollo
        plan.md         El qué se implementa
        tasks.md        Pasos para hacerlo (el cómo)
```

- `db/` abre la base de datos y no contiene reglas de negocio.
- `queries/queries/` guarda el SQL en ficheros `.sql`. `queries/users.js` los lee y los ejecuta. No hay reglas de negocio aquí.
- `logic/` es el núcleo de la app. Aquí viven las reglas de negocio.
- `clients/terminal/` llama a `logic/` y muestra el resultado. Es el primer cliente y el test manual de cada funcionalidad.
- `docs/specs/<nombre>/` es un desarrollo. `<nombre>` es la funcionalidad, en kebab-case. Ahí viven su spec, su plan y sus tareas.

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

Estos ficheros deben contener la información de forma escueta, concreta y determinista. Tratando de no agregar complejidad a la lectura de los ficheros.

## Base de datos

Hay una sola base de datos: `db/users.sqlite`. Hay una sola conexión: el `db` que exporta `db/connection.js`. No se abre otra base de datos ni otra conexión.

Tabla `users`:

- `id` es `INTEGER PRIMARY KEY`. SQLite lo incrementa solo: 1, 2, 3…
- `email` es `VARCHAR(64) NOT NULL UNIQUE`.
- `name` es `TEXT NOT NULL`.
- `createdAt` y `updatedAt` son fechas. SQLite no tiene un tipo `DATE` propio. El tipo adecuado es `TEXT` con la fecha en `YYYY-MM-DD HH:MM:SS`, que es lo que devuelve `datetime('now', 'localtime')`.

## Logic no se reemplaza

`logic/` no es un adaptador ni una capa intercambiable. No se sustituye por otra implementación, no se convierte en plugins y no se mueven sus reglas a `queries/` ni a `clients/`.

Cada funcionalidad es un fichero. Un fichero de `logic/` ya creado no se reemplaza para encajar otra tarea. Una funcionalidad nueva es un fichero nuevo.

## Un fichero de logic

Un fichero, una función. El nombre, la entrada y la salida los define la firma. No hay un comentario de contrato encima de la función.

El nombre es la acción (`createUser`, `updateUser`, `deleteUser`, `listUsers`). Los parámetros van en la firma, con su nombre (`name`, `email`, `id`). No se agrupa la entrada en un único objeto si los datos ya se conocen.

La salida del clasificador son `women`, `men` y `genderUndefined`.

El cuerpo sigue este orden, y no se mezcla:

1. Validar los parámetros de entrada.
2. Validar el resto de reglas de negocio.
3. Aplicar la lógica de negocio.
4. Estructurar la salida y sanear la respuesta.

## Constantes

Un valor fijo de la app es una constante. Su nombre va en mayúsculas (`MODEL`). Una variable sigue en camelCase.

## Errores

Un fallo se señala con `throw new Error("...")`. El mensaje está en inglés y es siempre uno de los de esta lista. No hay códigos ni clases de error propias.

En los pasos 1 y 2, si la entrada o una regla de negocio falla:

- `Name is empty`
- `Email is invalid`
- `Email is already used`
- `User not found`

En el paso 3, si SQLite falla, ese error no sale de `logic/`. Se lanza uno de estos:

- `Could not create the user`
- `Could not update the user`
- `Could not delete the user`
- `Could not list the users`
- `Could not find the user`
- `Could not classify the users`

En el paso 4, si todo va bien, la función devuelve el dato saneado. Si la operación no tiene datos, no devuelve nada.

## Queries

El SQL no vive dentro de la función que lo ejecuta.

- `queries/queries/` tiene un fichero `.sql` por query. Ese fichero contiene solo el texto SQL, con parámetros con nombre (`:id`, `:name`, `:email`).
- `queries/users.js` lee esos ficheros, prepara el texto con `db` y lo ejecuta. Las funciones de este fichero se pueden reutilizar desde `logic/`.
