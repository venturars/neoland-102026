# Plan — capas dentro de src

Issue: #579.

No es una funcionalidad nueva. No se reemplaza ningún fichero de
`logic/`. No hay firma nueva ni SQL nuevo. No hay paquete nuevo. Los
mensajes de «Errores» siguen siendo los de ahora.

Las cuatro carpetas se mueven juntas bajo `src/`. Siguen siendo
hermanas. El código de cada función no cambia.

## Ficheros

Se crea la carpeta `src/`.

Se mueven, con lo que ya contienen:

- `clients/` a `src/clients/`
- `db/` a `src/db/`
- `queries/` a `src/queries/`
- `logic/` a `src/logic/`

`db/users.sqlite` se mueve con `db/` y sigue sin estar en git.

Se tocan:

- `src/clients/terminal/create-users-table.txt`
- `src/clients/terminal/create-user.txt`
- `src/clients/terminal/update-user.txt`
- `src/clients/terminal/delete-user.txt`
- `src/clients/terminal/list-users.txt`
- `src/clients/terminal/find-user-by-email.txt`
- `src/clients/terminal/find-user-by-id.txt`
- `src/clients/terminal/find-user-by-name.txt`
- `src/clients/terminal/users-gender-count.txt`
- `scripts/jupyter.sh`
- `package.json`
- `docs/TREE.md`
- `docs/ARCHITECTURE.md`

No se tocan los `.js` de `logic/`, `queries/` ni `db/`. No se tocan los
`.sql`. No se tocan los notebooks. No se tocan `eslint.config.js`, las
specs ya escritas ni el `.gitignore`.

## Imports que se quedan

`logic/` sigue importando `../queries/users.js`. `queries/users.js`
sigue importando `../db/connection.js`. `db/connection.js` sigue
abriendo `users.sqlite` al lado de ese fichero.

## Terminal

El comentario sigue diciendo que el directorio actual es first-app. Solo
cambia la ruta del import.

`create-users-table.txt` importa desde `./src/queries/users.js` y
`./src/db/connection.js`. Los otros ocho importan desde `./src/logic/`
con el mismo nombre de fichero que ya tienen.

## Jupyter

Cada notebook busca hacia arriba la carpeta que contiene `logic/` y
lanza Node ahí. Esa carpeta pasa a ser `src/`. Los imports `./logic/`,
`./queries/` y `./db/` del bloque siguen valiendo. No se editan.

`scripts/jupyter.sh` arranca el notebook en `src/clients/jupyter`. El
resto del script no cambia.

## Formato

En `package.json`, `format` queda así. `lint` no cambia.

```json
"format": "prettier --write \"src/db/**/*.js\" \"src/queries/**/*.js\" \"src/logic/**/*.js\""
```

## Árbol

`docs/TREE.md` muestra las cuatro carpetas dentro de `src/`. El resto
del árbol no cambia.

```
first-app/
  eslint.config.js
  src/
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
  agents/
  skills/
  tools/
  templates/
  MCPS/
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

En `docs/ARCHITECTURE.md`, las rutas de esas cuatro capas llevan el
prefijo `src/`. La responsabilidad de cada capa no cambia. El resto del
documento no cambia.

- `src/db/` abre la base de datos y no contiene reglas de negocio.
- `src/db/connection.js` es la única conexión a la base de datos.
- `src/db/users.sqlite` es el único fichero de la base de datos.
- `src/queries/queries/` guarda el SQL. Hay un fichero `.sql` por query.
- `src/queries/users.js` lee esos ficheros, prepara el SQL y lo ejecuta.
  No hay reglas de negocio en `src/queries/`.
- `src/logic/` es el núcleo de la app. Aquí viven las reglas de negocio.
  Una funcionalidad por fichero.
- `src/logic/create-user.js` crea un usuario.
- `src/logic/update-user.js` actualiza un usuario.
- `src/logic/delete-user.js` borra un usuario.
- `src/logic/list-users.js` lista los usuarios.
- `src/logic/find-user-by-email.js` busca un usuario por email.
- `src/logic/find-user-by-id.js` busca un usuario por id.
- `src/logic/find-user-by-name.js` busca un usuario por nombre.
- `src/logic/users-gender-count.js` cuenta los usuarios por género.
- `src/clients/terminal/` llama a `src/logic/` y muestra el resultado. Es el
  primer cliente y el test manual de cada funcionalidad.
- `src/clients/jupyter/` es el cliente que se abre con el Jupyter de la app.

## Errores

No hay un mensaje nuevo.

| Fallo de la spec                         | Mensaje        |
| ---------------------------------------- | -------------- |
| Un resultado cambia                      | no es un fallo de la lista: el desarrollo no está hecho |
| Un mensaje cambia                        | no es un fallo de la lista: el desarrollo no está hecho |
| Una capa sigue fuera de src              | no es un fallo de la lista: el desarrollo no está hecho |

## Decisión

`docs/DATABASE.md` y `AGENTS.md` se quedan como están. No nombran
`src/`. El árbol y la arquitectura sí.
