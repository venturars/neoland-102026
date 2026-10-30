# Plan — guías SDD separadas por tema

Issue: #416.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`.
No hay firma nueva ni SQL nuevo. No se toca `logic/errors.js`.

El código actual junta varias acciones en una línea. La issue #416 ya
decidió que esta spec no se para por eso. El código no se reescribe.

## Ficheros

Se crean:

- `docs/ARCHITECTURE.md`
- `docs/TREE.md`
- `docs/DATABASE.md`
- `docs/ERRORS.md`
- `docs/STYLE.md`

Se tocan:

- `docs/CONSTITUTIONS.md`
- `AGENTS.md` de first-app

No se toca el `AGENTS.md` de la raíz del bootcamp.

No se tocan `logic/`, `queries/`, `db/`, `clients/`, `package.json` ni
las specs ya escritas (salvo esta carpeta).

## Árbol

`docs/TREE.md` queda así (solo carpetas y ficheros; sin párrafos de
responsabilidad):

```text
# Árbol

first-app/
  AGENTS.md
  package.json
  docs/
    ARCHITECTURE.md
    TREE.md
    DATABASE.md
    ERRORS.md
    STYLE.md
    CONSTITUTIONS.md
    specs/
      <nombre>/
        spec.md
        plan.md
        tasks.md
  db/
    connections.js
    users.sqlite
  queries/
    queries/
    user.js
  logic/
    errors.js
    create-user.js
    update-user.js
    delete-user.js
    find-user-by-id.js
    find-user-by-email.js
    find-user-by-name.js
    list-users.js
    user-gender-count.js
  clients/
    terminal/
      create-user-table.txt
      create-user.txt
      update-user.txt
      delete-user.txt
      find-user-by-id.txt
      find-user-by-email.txt
      find-user-by-name.txt
      list-users.txt
      user-gender-count.txt
    jupyter/
      create-user-table.ipynb
      create-user.ipynb
      update-user.ipynb
      delete-user.ipynb
      find-user-by-id.ipynb
      find-user-by-email.ipynb
      find-user-by-name.ipynb
      list-users.ipynb
      user-gender-count.ipynb
```

## Arquitectura

`docs/ARCHITECTURE.md` queda así:

```text
# Arquitectura

- `docs/specs/<nombre>/` es donde empieza un desarrollo. `<nombre>` es la funcionalidad, en kebab-case.
- `db/` abre la base de datos y no contiene reglas de negocio.
- `db/connections.js` es la única conexión a la base de datos.
- `db/users.sqlite` es el único fichero de la base de datos.
- `queries/queries/` guarda el SQL en ficheros `.sql`. Hay un fichero por sentencia.
- `queries/user.js` lee esos ficheros y los ejecuta. No hay reglas de negocio en `queries/`.
- `logic/` es el núcleo de la app. Aquí viven las reglas de negocio.
- `logic/errors.js` exporta las clases de error compartidas. No es una funcionalidad de negocio.
- `logic/create-user.js` crea un usuario.
- `logic/update-user.js` actualiza un usuario.
- `logic/delete-user.js` borra un usuario.
- `logic/find-user-by-id.js` busca un usuario por id.
- `logic/find-user-by-email.js` busca un usuario por email.
- `logic/find-user-by-name.js` busca un usuario por nombre.
- `logic/list-users.js` lista los usuarios.
- `logic/user-gender-count.js` cuenta usuarios por género.
- `clients/terminal/` llama a `logic/` y muestra el resultado. Es el primer cliente y el test manual de cada funcionalidad.
- `clients/jupyter/` es el cuaderno, uno por cada `.txt` de `clients/terminal/`. El bloque muestra ese texto: arranca `node --input-type=module` y, dentro, los `import` y la llamada quedan igual. El `console.log` se sustituye por la tabla. `cli-table3` y `@colors/colors` pintan esa tabla con colores y encabezados. Si la función falla, se ve ese mensaje. En esa carpeta no hay ficheros `.py` ni `requirements.txt`. Se abre con `pnpm jupyter` desde `first-app`.
- `docs/ARCHITECTURE.md` dice la responsabilidad de cada capa y de cada fichero.
- `docs/TREE.md` es el árbol de carpetas y ficheros.
- `docs/DATABASE.md` es la base de datos y las queries.
- `docs/ERRORS.md` es la lista de errores y cómo usarlos.
- `docs/STYLE.md` es la forma de cada línea y las convenciones.
- `docs/CONSTITUTIONS.md` conserva las specs, los paquetes y el contrato de `logic/`. Enlaza a las otras guías.
- `AGENTS.md` son las reglas del agente; apunta a la constitución y a las guías.
```

## Base de datos

`docs/DATABASE.md` se lleva el texto actual de «Base de datos» y de
«Queries», tal cual:

```text
# Base de datos

Hay una sola base de datos: `db/users.sqlite`. Hay una sola conexión: el `db` que exporta `db/connections.js`. No se abre otra base de datos ni otra conexión.

La tabla se llama `users`. Su formato es este:

- `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`. La base asigna el número.
- `email`: `TEXT NOT NULL UNIQUE`.
- `name`: `TEXT NOT NULL`.
- `createdAt` y `updatedAt` son fechas. SQLite no tiene un tipo `DATE` propio. El tipo es `TEXT` con la fecha en `YYYY-MM-DD HH:MM:SS`, que es lo que devuelve `datetime('now', 'localtime')`. El alta no escribe esas columnas: las pone el default de la tabla. Al actualizar, el SQL pone `updatedAt = datetime('now', 'localtime')`.

## Queries

El SQL no vive dentro de la función que lo ejecuta. Vive aparte.

`queries/queries/` contiene solo SQL agnóstico. Cada sentencia está en su propio `.sql`, sin JavaScript.

`queries/` contiene la función que llama a ese SQL. En este proyecto es `queries/user.js`: lee el `.sql`, lo guarda en una constante y, al final del fichero, la función exportada lo ejecuta con `run`, `all` o `get`.
```

## Errores

`docs/ERRORS.md` se lleva el texto actual de «Errores», tal cual:

```text
# Errores

Los errores de entrada y de negocio salen de `logic/errors.js`. Ese fichero no exporta una función de negocio: exporta las clases. Cada una extiende `Error`. El constructor recibe `message` y asigna `this.name`. Pueden añadirse más clases en ese mismo fichero.

- `ValidationError`: el dato de entrada no vale. Mensajes: `"Id is invalid"`, `"Name is empty"`, `"Email is invalid"`.
- `NotFoundError`: no hay fila. Mensaje: `"User not found"`.
- `ConflictError`: el email ya existe. Mensaje: `"Email is already used"`.
- `DatabaseError`: SQLite lanzó y ese error no sale de `logic/`. Mensajes: `"Could not create the user"`, `"Could not update the user"`, `"Could not delete the user"`, `"Could not list the users"`, `"Could not find the user"`, `"Could not classify the users"`. Este último lo lanza `usersGenderCount`.

Una entrada o una regla de negocio que no llama a una query se comprueba con `if` y lanza esa clase con el mensaje. No va dentro de `try/catch`.

Cada llamada a un querie va dentro de `try/catch`. Si la query lanza, el `catch` lanza la clase global de esa llamada, con su mensaje fijo. No relanza el error de SQLite. Si la query devuelve, la regla que mira ese resultado queda fuera del `try`: un `if` y el `throw` de la clase.

El cliente no captura el error. Llama a la función y muestra el resultado. Si logic lanza, el error sale solo.
```

## Estilo

`docs/STYLE.md` queda así:

```text
# Estilo y convenciones

El código se escribe en inglés y está pensado para alumnos hispanohablantes.

Ficheros en kebab-case. Funciones en camelCase. El nombre es la acción. Una función, un propósito. Exportaciones con nombre e imports ESM con extensión `.js`. El SQL usa parámetros con nombre (`:id`, `:name`, `:email`). El contrato de `logic/` está en `docs/CONSTITUTIONS.md`. Cómo usar los errores está en `docs/ERRORS.md`.

Una función por fichero. No hay clases, no hay `this` y no hay métodos, salvo las clases definidas en `logic/errors.js`. Pueden añadirse más clases de error en ese fichero.

Cada línea deja una sola acción en un nombre. Una acción es una llamada o una comprobación. `input.name` y `.trim()` van en líneas distintas. Prettier no las junta.

Un fallo de la lista se comprueba con `if` y `throw` de la clase que toca, en su propia línea.

El código se lee de arriba a abajo, con nombres que digan qué hacen. Se escribe como lo escribiría un junior a mano. Se evita el código que un programador sin IA no escribiría: envoltorios de resultado, helpers genéricos y abstracciones que oculten los pasos.

Una constante de fichero va en mayúsculas con guion bajo (`const MODEL`).

El formato es el estándar de Prettier, sin configuración propia: comillas dobles, punto y coma, coma final, indentación de 2 espacios y ancho de 80.
```

## Constitución

Se quitan «Árbol», «Base de datos», «Queries» y «Errores».

Se añade «Guías» después de la introducción:

```text
## Guías

- `docs/ARCHITECTURE.md` dice la responsabilidad de cada capa y de cada fichero.
- `docs/TREE.md` es el árbol.
- `docs/DATABASE.md` es la base de datos y las queries.
- `docs/ERRORS.md` es la lista de errores.
- `docs/STYLE.md` es la forma de cada línea y las convenciones.
```

En «Specs», el bullet del `plan.md` pasa a ser:

```text
- si hace falta, qué cambios van en `docs/TREE.md`, en `docs/ARCHITECTURE.md` y en `docs/CONSTITUTIONS.md` (firmas en «Un fichero logic», clientes terminal)
```

En «Un fichero logic», después del párrafo de nombres de acción, se añade:

```text
Esos nombres son solo ejemplos; no hay que ampliar la lista en cada funcionalidad nueva.

La forma de cada línea está en `docs/STYLE.md`. Los errores están en `docs/ERRORS.md`.
```

«Specs» (resto), «Paquetes», «Logic no se reemplaza» y los cuatro pasos siguen igual.

## AGENTS.md

En «Proyecto», la frase pasa a ser:

```text
Las reglas de base están en `docs/CONSTITUTIONS.md`. Esa guía enlaza a la arquitectura, el árbol, la base de datos, los errores y el estilo.
```

«Estilo y convenciones» pasa a ser:

```text
## Estilo y convenciones

La forma de cada línea y las convenciones están en `docs/STYLE.md`.
```

En «Reglas», la frase de estilo pasa a ser:

```text
- En cada tarea: investiga antes de escribir y compara si la tarea tiene parentesco con otra ya resuelta. El código que ya existe sirve para ver a qué fichero se parece una función nueva. La forma de cada línea se copia de `docs/STYLE.md`. Un spec nuevo no se para porque el código ya escrito no tenga esa forma.
```

Se añade:

```text
- Si un desarrollo añade o quita un fichero, su plan también actualiza `docs/TREE.md` y `docs/ARCHITECTURE.md`.
```

«Orden», «Paquetes», «Comandos» y «Al terminar una tarea» siguen igual.

## Contrato

No hay función de `logic/`, firma pública ni SQL.

No hay un mensaje nuevo de «Errores».
