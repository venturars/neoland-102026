# Plan — guías separadas por tema

Issue: #402.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`.
No hay firma nueva ni SQL nuevo.

El código actual junta varias acciones en una línea. La issue #402 ya
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

No se toca el `AGENTS.md` de la raíz.

No se tocan el código, `package.json` ni las specs ya escritas.

## Árbol

`docs/TREE.md` queda así:

```
# Árbol

first-app/
  db/
    connection.js
    users.sqlite
  queries/
    queries/
    users.js
  logic/
    create-user.js
    update-user.js
    delete-user.js
    list-users.js
    find-user-by-email.js
    find-user-by-id.js
    find-user-by-name.js
    users-gender-count.js
  clients/
    terminal/
    jupyter/
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
```

## Arquitectura

`docs/ARCHITECTURE.md` queda así:

```
# Arquitectura

- `db/` abre la base de datos y no contiene reglas de negocio.
- `db/connection.js` es la única conexión a la base de datos.
- `db/users.sqlite` es el único fichero de la base de datos.
- `queries/queries/` guarda el SQL. Hay un fichero `.sql` por query.
- `queries/users.js` lee esos ficheros, prepara el SQL y lo ejecuta.
  No hay reglas de negocio en `queries/`.
- `logic/` es el núcleo de la app. Aquí viven las reglas de negocio.
  Una funcionalidad por fichero.
- `logic/create-user.js` crea un usuario.
- `logic/update-user.js` actualiza un usuario.
- `logic/delete-user.js` borra un usuario.
- `logic/list-users.js` lista los usuarios.
- `logic/find-user-by-email.js` busca un usuario por email.
- `logic/find-user-by-id.js` busca un usuario por id.
- `logic/find-user-by-name.js` busca un usuario por nombre.
- `logic/users-gender-count.js` cuenta los usuarios por género.
- `clients/terminal/` llama a `logic/` y muestra el resultado. Es el
  primer cliente y el test manual de cada funcionalidad.
- `clients/jupyter/` es el cliente que se abre con el Jupyter de la app.
- `docs/ARCHITECTURE.md` dice la responsabilidad de cada capa y de cada
  fichero.
- `docs/TREE.md` es el árbol de carpetas y ficheros.
- `docs/DATABASE.md` es la base de datos y las queries.
- `docs/ERRORS.md` es la lista de errores.
- `docs/STYLE.md` es el estilo y las convenciones.
- `docs/CONSTITUTIONS.md` conserva las specs, los paquetes y el
  contrato de `logic/`. Enlaza a las otras guías.
- `docs/specs/<nombre>/` es un desarrollo. `<nombre>` va en kebab-case.
  Ahí viven su spec, su plan y sus tareas.
```

## Base de datos

`docs/DATABASE.md` se lleva el texto actual de «Base de datos» y de
«Queries», tal cual:

```
# Base de datos

Hay una sola base de datos: `db/users.sqlite`. Hay una sola conexión: el `db` que exporta `db/connection.js`. No se abre otra base de datos ni otra conexión.

Tabla `users`:

- `id` es `INTEGER PRIMARY KEY`. SQLite lo incrementa solo: 1, 2, 3…
- `email` es `VARCHAR(64) NOT NULL UNIQUE`.
- `name` es `TEXT NOT NULL`.
- `createdAt` y `updatedAt` son fechas. SQLite no tiene un tipo `DATE` propio. El tipo adecuado es `TEXT` con la fecha en `YYYY-MM-DD HH:MM:SS`, que es lo que devuelve `datetime('now', 'localtime')`.

## Queries

El SQL no vive dentro de la función que lo ejecuta.

- `queries/queries/` tiene un fichero `.sql` por query. Ese fichero contiene solo el texto SQL, con parámetros con nombre (`:id`, `:name`, `:email`).
- `queries/users.js` lee esos ficheros, prepara el texto con `db` y lo ejecuta. Las funciones de este fichero se pueden reutilizar desde `logic/`.
```

## Errores

`docs/ERRORS.md` se lleva el texto actual de «Errores», tal cual:

```
# Errores

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
```

## Estilo

`docs/STYLE.md` queda así:

```
# Estilo y convenciones

El código se escribe en inglés. Los comentarios de los clientes de terminal están en español, porque el proyecto es para alumnos hispanohablantes.

Ficheros en kebab-case, funciones y variables en camelCase, exportaciones con nombre e imports ESM con extensión `.js`. El SQL usa parámetros con nombre (`:id`, `:name`, `:email`). El contrato de `logic/` está en `docs/CONSTITUTIONS.md`. Los errores están en `docs/ERRORS.md`.

Una función por fichero. No hay clases, no hay `this` y no hay métodos.

Cada línea deja una sola acción en un nombre. Una acción es una llamada o una comprobación. `input.name` y `.trim()` van en líneas distintas. Prettier no las junta.

Un fallo de la lista se comprueba con `if` y `throw new Error`, en su propia línea.

Se escribe como lo escribiría un junior a mano. Se evita el código que un programador sin IA no escribiría: envoltorios de resultado, clases de error, helpers genéricos y abstracciones que oculten los pasos.

Un valor fijo de la app es una constante. Su nombre va en mayúsculas (`MODEL`). Una variable sigue en camelCase.

El formato es el estándar de Prettier, sin configuración propia: comillas dobles, punto y coma, coma final, indentación de 2 espacios y ancho de 80.
```

## Constitución

Se quitan «Árbol», «Base de datos», «Constantes», «Errores» y «Queries».

Se añade «Guías» después de la introducción:

```
## Guías

- `docs/ARCHITECTURE.md` dice la responsabilidad de cada capa y de cada fichero.
- `docs/TREE.md` es el árbol.
- `docs/DATABASE.md` es la base de datos y las queries.
- `docs/ERRORS.md` es la lista de errores.
- `docs/STYLE.md` es la forma de cada línea y las convenciones.
```

En «Un fichero de logic» se añade esta frase y no se repite la regla de
la línea:

```
La forma de cada línea está en `docs/STYLE.md`.
```

«Specs», «Paquetes», «Logic no se reemplaza» y los cuatro pasos siguen
igual.

## AGENTS.md

En «Proyecto», la frase de la arquitectura pasa a ser:

```
Las reglas de base están en `docs/CONSTITUTIONS.md`. Esa guía enlaza a la arquitectura, el árbol, la base de datos, los errores y el estilo.
```

«Estilo y convenciones» pasa a ser:

```
## Estilo y convenciones

La forma de cada línea y las convenciones están en `docs/STYLE.md`.
```

En «Reglas», la frase de seguir el estilo del código actual pasa a ser:

```
- En cada tarea: investiga antes de escribir y compara si la tarea tiene parentesco con otra ya resuelta. El código que ya existe sirve para ver a qué fichero se parece una función nueva. La forma de cada línea se copia de `docs/STYLE.md`. Un spec nuevo no se para porque el código ya escrito no tenga esa forma.
```

Se añade:

```
- Si un desarrollo añade o quita un fichero, su spec también actualiza `docs/TREE.md` y `docs/ARCHITECTURE.md`.
```

«Orden», «Paquetes», «Comandos» y «Al terminar una tarea» siguen igual.

## Contrato

No hay función de `logic/`, firma pública ni SQL.

No hay un mensaje nuevo de «Errores».
