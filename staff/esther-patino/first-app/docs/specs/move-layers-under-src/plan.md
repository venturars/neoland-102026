# Plan — capas dentro de src

Issue: #594.

No es una funcionalidad nueva. No se reemplaza ningún fichero de `logic/`. No hay firma nueva ni SQL nuevo. No hay paquete nuevo ni cambio de versión. Los mensajes de «Errores» siguen siendo los de ahora.

Las cuatro carpetas se mueven juntas bajo `src/`. Siguen siendo hermanas. El código de cada función no cambia.

## Ficheros

Se crea la carpeta `src/`.

Se mueven, con lo que ya contienen:

- `clients/` a `src/clients/`
- `db/` a `src/db/`
- `queries/` a `src/queries/`
- `logic/` a `src/logic/`

`users.sqlite` se mueve con `db/` y sigue sin estar en git. Es el mismo fichero.

Se tocan:

- los nueve `.txt` de `src/clients/terminal/`
- los nueve `.ipynb` de `src/clients/jupyter/`
- `scripts/jupyter.js`
- `docs/tree.md`
- `docs/ARCHITECTURE.md`
- `docs/database.md`
- `docs/style.md`
- `docs/CONSTITUTIONS.md`
- `AGENTS.md`

No se tocan los `.js` de `logic/`, `queries/` ni `db/`. No se tocan los `.sql`. No se tocan `package.json`, `eslint.config.js` ni las specs ya escritas.

## Imports que se quedan

`logic/` sigue importando `../queries/users.js`. `queries/users.js` sigue importando `../db/connection.js`. `db/connection.js` sigue abriendo `users.sqlite` al lado de ese fichero, y sigue leyendo `../queries/queries/create-users-table.sql`.

## Terminal

El comentario sigue diciendo que el directorio actual es `first-app`. Solo cambia la ruta del import.

`create-users-table.txt` importa desde `./src/db/connection.js`. Los otros ocho importan desde `./src/logic/` con el mismo nombre de fichero que ya tienen.

## Jupyter

El documento queda tres carpetas por debajo de `first-app`. El bloque sigue lanzando Node con el directorio de trabajo en `first-app`. Los imports pasan a `./src/logic/` y, en crear la tabla, a `./src/db/connection.js`.

`scripts/jupyter.js` arranca Jupyter sobre `src/clients/jupyter`. El resto del script no cambia.

## Árbol y arquitectura

`docs/tree.md` muestra `db/`, `logic/`, `queries/` y `clients/` dentro de `src/`. El resto del árbol no cambia.

`docs/ARCHITECTURE.md` nombra esas mismas rutas con el prefijo `src/`. La función de cada carpeta no cambia.

`docs/database.md` dice que la base es `src/db/users.sqlite`. `src/db/connection.js` abre siempre ese archivo. `src/queries/users.js` lee los `.sql` de `src/queries/queries/`. El fichero no se reemplaza.

`docs/style.md` nombra los `.txt` de `src/clients/terminal/`, la acción en `src/logic/` y el SQL en `src/queries/queries/`.

`docs/CONSTITUTIONS.md` deja el cliente en `src/clients/terminal/` y el parecido en `src/logic/`.

`AGENTS.md` nombra `src/db/users.sqlite`, el cliente en `src/clients/terminal/` y la función de `src/logic/`.

## Firmas

No cambian:

- `createUser(input)` devuelve el usuario plano.
- `listUsers()` devuelve la lista. Si no hay filas, devuelve `[]`.
- `findUserByEmail(email)` devuelve el usuario plano, o lanza `User not found`.
- `findUserById(id)` devuelve el usuario plano, o lanza `User not found`.
- `findUserByName(name)` devuelve la lista, o lanza `Could not find the user` si la lectura falla.
- `updateUser(id, changes)` devuelve el usuario plano.
- `deleteUser(id)` termina en `removeUser` y no devuelve el usuario.
- `usersGenderCount()` devuelve `{ women, men, undefinedUser }`.

## Errores

Cada fallo de la spec sigue con su frase. No se añade una frase. No se cambia una frase.

## Pregunta

`docs/database.md` dice que la base es `db/users.sqlite` y que no se abre otra ruta. `docs/style.md`, `docs/CONSTITUTIONS.md` y `AGENTS.md` nombran `clients/terminal/`, `logic/` y `queries/` en la raíz. La issue solo manda cambiar `docs/tree.md` y `docs/ARCHITECTURE.md`.

¿Esas otras guías pasan también a `src/`, con la base en `src/db/users.sqlite`?

Sí. Esos cambios van en `tasks.md`. El código se escribe cuando se pidan esas tareas.
