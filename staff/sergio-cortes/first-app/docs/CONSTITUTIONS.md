# Constitución

first-app es una app para aprender los conceptos básicos de login. Se construye con IA siguiendo el sistema SDD. Un desarrollo nuevo no empieza en el código: pasa por `spec.md`, `plan.md` y `tasks.md`, y un humano lee cada uno antes de seguir.

## Árbol

```text
first-app/
  AGENTS.MD                   Reglas del agente; apunta a esta constitución
  docs/
    CONSTITUTIONS.md          Esta información base
    specs/
      <nombre>/               Una funcionalidad; el nombre lo elige quien la pide
        spec.md               Negocio
        plan.md               Técnica
        tasks.md              Pasos
  db/
    connections.js            Única conexión a la base de datos
    users.sqlite              Único fichero de la base de datos
  queries/
    queries/                  Texto SQL, un fichero .sql por sentencia
    user.js                   Lee esos ficheros y ejecuta el SQL
  logic/
    errors.js                 Clases de error compartidas
    create-user.js            Una funcionalidad por fichero
    update-user.js
    delete-user.js
    find-user-by-id.js
    find-user-by-email.js
    find-user-by-name.js
    list-users.js
  clients/
    terminal/
      create-user-table.txt   Crea la tabla vía queries
      create-user.txt         Llama a logic y muestra el resultado
      update-user.txt
      delete-user.txt
      find-user-by-id.txt
      find-user-by-email.txt
      find-user-by-name.txt
      list-users.txt
```

- `docs/specs/<nombre>/` es donde empieza un desarrollo. `<nombre>` es la funcionalidad, en kebab-case.
- `db/` abre la base de datos y no contiene reglas de negocio.
- `queries/queries/` guarda el SQL en ficheros `.sql`. `queries/user.js` los lee y los ejecuta. No hay reglas de negocio aquí.
- `logic/` es el núcleo de la app. Aquí viven las reglas de negocio.
- `clients/terminal/` llama a `logic/` y muestra el resultado. Es el primer cliente y el test manual de cada funcionalidad.

## Specs

Una funcionalidad vive en `docs/specs/<nombre>/`. El nombre va en kebab-case. Ahí hay tres ficheros, y se escriben en este orden: `spec.md`, `plan.md`, `tasks.md`. Cada uno se lee de un tirón. Lo que dice uno no se repite en el otro. El texto es escueto, concreto y determinista.

`spec.md` es el negocio. Lo lee quien decide si la funcionalidad es la que quiere, sin abrir el código. Dice qué se pide, quién lo usa, qué entra, qué sale con un ejemplo, y qué fallo se ve. Un fallo nombra un mensaje de la lista de «Errores». También dice qué queda fuera. No nombra ficheros, funciones ni SQL.

`plan.md` es la técnica. Lo lee quien comprueba que el desarrollo cabe en esta constitución. Dice:

- qué ficheros se crean y cuáles se tocan
- si hace falta, qué cambios van en `docs/CONSTITUTIONS.md` (árbol, firmas en «Un fichero logic», clientes terminal)
- a qué fichero de `logic/` se parece, sin pegar su código
- la firma: nombre, parámetros y salida
- el SQL nuevo, con los parámetros con nombre (`:id`, `:name`, `:email`)
- qué mensaje de «Errores» corresponde a cada fallo de la spec

Una funcionalidad nueva es un fichero nuevo en `logic/`. Si la constitución, el código actual y la spec no dicen lo mismo, la pregunta se escribe al final del `plan.md` y ahí se para. No hay `tasks.md` ni código hasta tener la respuesta.

`tasks.md` son los pasos, en el orden en que los haría una persona. Cada paso abre un sitio, hace una cosa y deja un resultado que se puede mirar. Un paso son como mucho cuatro líneas. Si el desarrollo no es una funcionalidad nueva, el grano es el mismo: mirar lo que ya existe, cambiar un sitio, comprobar.

## Base de datos

Hay una sola base de datos: `db/users.sqlite`. Hay una sola conexión: el `db` que exporta `db/connections.js`. No se abre otra base de datos ni otra conexión.

La tabla se llama `users`. Su formato es este:

- `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`. La base asigna el número.
- `email`: `TEXT NOT NULL UNIQUE`.
- `name`: `TEXT NOT NULL`.
- `createdAt` y `updatedAt` son fechas. SQLite no tiene un tipo `DATE` propio. El tipo es `TEXT` con la fecha en `YYYY-MM-DD HH:MM:SS`, que es lo que devuelve `datetime('now', 'localtime')`. El alta no escribe esas columnas: las pone el default de la tabla. Al actualizar, el SQL pone `updatedAt = datetime('now', 'localtime')`.

## Logic no se reemplaza

Los ficheros de `logic/` no son un adaptador ni una capa intercambiable. No se sustituyen por otra implementación, no se convierten en plugins y no se mueven sus reglas a `queries/` ni a `clients/`.

## Un fichero logic

Un fichero, una función. El nombre, la entrada y la salida los define la firma. No hay un comentario de contrato encima de la función.

El nombre es la acción (`createUser`, `updateUser`, `deleteUser`, `findUserById`, `findUserByEmail`, `findUserByName`, `listUsers`).

Si la función usa varios datos, como `name`, `email` e `id`, recibe un solo `input` y lee ahí cada valor. Si el dato es uno solo, como `id`, `email` o `name`, el argumento es ese valor. No se mete en un objeto.

`createUser(input)` lee `name` y `email`. `updateUser(input)` lee `id`, `name` y `email`. `deleteUser(id)` y `findUserById(id)` reciben el `id`. `findUserByEmail(email)` recibe el `email`. `findUserByName(name)` recibe el `name`. `listUsers()` no recibe argumentos.

Cada funcionalidad nueva añade su firma aquí y en el árbol, en el mismo desarrollo que crea su `logic/`, según el `plan.md`.

Ningún fichero de `logic/` abre la base. Llaman a `queries/user.js`. Donde hay una fila, devuelven `id`, `name`, `email`, `createdAt` y `updatedAt`.

El cuerpo sigue este orden, y no se mezcla:

1. Validar los parámetros de entrada.
2. Validar el resto de reglas de negocio. Ahí se puede llamar a una query de lectura, como `findById` o `findByEmail`, para comprobar la regla antes de escribir.
3. Aplicar la lógica de negocio.
4. Estructurar la salida y sanear la respuesta.

## Queries

El SQL no vive dentro de la función que lo ejecuta. Vive aparte.

`queries/queries/` contiene solo SQL agnóstico. Cada sentencia está en su propio `.sql`, sin JavaScript.

`queries/` contiene la función que llama a ese SQL. En este proyecto es `queries/user.js`: lee el `.sql`, lo guarda en una constante y, al final del fichero, la función exportada lo ejecuta con `run`, `all` o `get`.

## Errores

Los errores de entrada y de negocio salen de `logic/errors.js`. Ese fichero no exporta una función de negocio: exporta las clases. Cada una extiende `Error`. El constructor recibe `message` y asigna `this.name`. Pueden añadirse más clases en ese mismo fichero.

- `ValidationError`: el dato de entrada no vale. Mensajes: `"Id is invalid"`, `"Name is empty"`, `"Email is invalid"`.
- `NotFoundError`: no hay fila. Mensaje: `"User not found"`.
- `ConflictError`: el email ya existe. Mensaje: `"Email is already used"`.
- `DatabaseError`: SQLite lanzó y ese error no sale de `logic/`. Mensajes: `"Could not create the user"`, `"Could not update the user"`, `"Could not delete the user"`, `"Could not list the users"`, `"Could not find the user"`. `"Could not classify the users"` queda reservado para una función futura. Ninguna función lo lanza todavía.

Una entrada o una regla de negocio que no llama a una query se comprueba con `if` y lanza esa clase con el mensaje. No va dentro de `try/catch`.

Cada llamada a un querie va dentro de `try/catch`. Si la query lanza, el `catch` lanza la clase global de esa llamada, con su mensaje fijo. No relanza el error de SQLite. Si la query devuelve, la regla que mira ese resultado queda fuera del `try`: un `if` y el `throw` de la clase.

El cliente no captura el error. Llama a la función y muestra el resultado. Si logic lanza, el error sale solo.
