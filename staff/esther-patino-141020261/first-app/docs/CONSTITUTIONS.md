# Constitución — first-app

## 1. Qué hace la app

first-app guarda usuarios. No es una web. Se usa desde la terminal, con Node.

Se puede crear un usuario, listarlos, buscar uno, cambiarlo y borrarlo.

Un usuario es un objeto con estos campos y ningún otro:

- `id` — número entero. Lo escribe SQLite. El código no lo inventa.
- `name` — texto.
- `email` — texto en minúsculas. En la tabla es `VARCHAR(64)` y `UNIQUE`.
- `createdAt` — texto con la fecha. Lo escribe SQLite al crear.
- `updatedAt` — texto con la fecha. Lo escribe SQLite al crear y otra vez al cambiar.

## 2. La base de datos

Hay una sola base de datos: el archivo `db/users.sqlite`.

Ese archivo es el del proyecto y no se reemplaza. No se borra para empezar de cero, no se cambia por otra copia, no se renombra y no se abre otra ruta. Tampoco se usa una base en memoria. `db/connection.js` abre siempre `db/users.sqlite`.

La tabla se llama `users`. Las columnas son estas:

- `id INTEGER PRIMARY KEY`. Al insertar no se manda el id. SQLite pone el siguiente número: 1, luego 2, luego 3. Son valores incrementales.
- `name TEXT NOT NULL`.
- `email VARCHAR(64) NOT NULL UNIQUE`. Cabe en 64 caracteres y no puede repetirse.
- `createdAt TEXT NOT NULL`. Valor por defecto: `datetime('now', 'localtime')`.
- `updatedAt TEXT NOT NULL`. El mismo valor por defecto al crear.

## 3. Árbol y para qué es cada archivo

```
first-app/
  AGENTS.md
  package.json
  db/
    connection.js
    users.sqlite
  docs/
    CONSTITUTION.md
  logic/
    shared.js
    create-user.js
    list-users.js
    find-user-by-email.js
    find-user-by-id.js
    update-user.js
    delete-user.js
  queries/
    users.js
    queries/
      create-users-table.sql
      insert-user.sql
      find-all.sql
      find-by-email.sql
      find-by-id.sql
      update-user.sql
      remove-user.sql
  clients/
    terminal/
      create-users-table.txt
      insert-user.txt
      find-all.txt
      find-by-email.txt
      find-by-id.txt
      update-user.txt
      remove-user.txt
```

`AGENTS.md` dice cómo se trabaja en esta app: el orden de un cambio, el estilo y qué hacer al cerrar una tarea.
`docs/CONSTITUTION.md` es este documento. Manda sobre el comportamiento de la app.
`db/` abre la base de datos y no contiene reglas de negocio.
`queries/queries/` guarda el SQL en ficheros `.sql`. `queries/users.js` los lee y los ejecuta. No hay reglas de negocio aquí.
`logic/` es el núcleo de la app. Aquí viven las reglas de negocio.
`clients/terminal/` llama a `logic/` y muestra el resultado. Es el primer cliente y el test manual de cada funcionalidad.

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

## 6. Errores

Si algo falla, se lanza el error y se corta la función: throw new Error("Email is invalid");

Inglés y es uno de esta lista:

| Frase | Cuándo |
| --- | --- |
| `Name is empty` | El nombre no es texto o, después de quitar espacios, queda vacío. |
| `Email is invalid` | No es texto, no tiene una sola `@` con texto a cada lado, lleva un espacio o pasa de 64 caracteres. |
| `Email is already used` | Ese email ya está en otra fila. |
| `Invalid id` | El id no es un entero mayor o igual que 1. |
| `User not found` | Se busca, se cambia o se borra un id que no está, o se busca un email que no está. |

El email se guarda en minúsculas. `validateEmail` le quita los espacios de los extremos y lo pasa a minúsculas antes de mirar la longitud y la `@`.


## 7. Al terminar una funcionalidad

Cuando se termina de crear una funcionalidad, se crea un cliente.

El cliente es un archivo en `clients/terminal/`. El nombre dice la acción, en kebab-case, y acaba en `.txt`.

Ese archivo se pega en la terminal desde la raíz del repositorio. Entra en `first-app`, importa la función y hace `console.log` del resultado. No captura el error. Es la prueba manual de esa funcionalidad.

