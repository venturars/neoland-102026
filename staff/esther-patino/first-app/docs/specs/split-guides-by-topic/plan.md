# Plan — cada tema de las guías en su sitio

Documentación. No reemplaza ningún fichero de `logic/`. No guarda datos. No instala un paquete ni cambia su versión.

El código actual no se toca. Las reglas nuevas quedan escritas y no se aplican a los `.js` ni a los `.sql`.

La constitución hoy junta los temas en un solo documento. La spec los reparte y deja un enlace. No hay otra regla que lo prohíba. El código y la spec dicen lo mismo: este cambio no altera el comportamiento de la app.

## Ficheros

Se crean:

- `docs/tree.md`
- `docs/ARCHITECTURE.md`
- `docs/database.md`
- `docs/errors.md`
- `docs/style.md`

Se tocan:

- `docs/CONSTITUTIONS.md` — el tema que se va deja el título y una frase con el enlace
- `AGENTS.md` de first-app — los comandos y el estilo pasan a `docs/style.md`, y la lectura previa nombra los archivos nuevos

No se toca el `AGENTS.md` de la raíz.

No se tocan los `.js`, los `.sql`, `package.json` ni las specs ya escritas en `docs/specs/`.

## Parecido

No hay fichero de `logic/` al que se parezca. No hay firma ni parámetros. No hay SQL nuevo.

El cambio deja las guías repartidas. `docs/CONSTITUTIONS.md` sigue mandando el comportamiento. `AGENTS.md` sigue diciendo cómo se trabaja.

## Errores

Ningún fallo de esta spec usa un mensaje de la sección 6. La lista de errores se muda entera a `docs/errors.md`.

El fallo se ve en las guías: un tema largo escrito dos veces no se acepta, y tampoco se acepta si desaparece `docs/CONSTITUTIONS.md` o `AGENTS.md`, o si el diff cambia código.

## docs/tree.md

El archivo es solo el diagrama de la sección 3, tal cual. No se añade título. No se añaden `docs/tree.md`, `docs/ARCHITECTURE.md`, `docs/database.md`, `docs/errors.md` ni `docs/style.md`.

## docs/ARCHITECTURE.md

Una frase por carpeta:

- `scripts/` arranca Jupyter sobre `clients/jupyter/`.
- `db/` abre la base de datos y no tiene reglas de negocio.
- `docs/` guarda la constitución y las specs.
- `docs/specs/<nombre>/` es un desarrollo.
- `logic/` guarda las reglas de negocio.
- `queries/` guarda el SQL y lo ejecuta. No hay reglas de negocio.
- `clients/` agrupa los clientes.
- `clients/terminal/` llama a `logic/` y es el test manual.
- `clients/jupyter/` sirve para validar las funcionalidades desde Jupyter.

Debajo de cada carpeta, una frase por archivo que hay dentro. En la raíz del proyecto:

- `AGENTS.md` dice cómo se trabaja: el orden de un cambio, el estilo y qué hacer al cerrar una tarea.
- `package.json` declara el proyecto. El script `jupyter` arranca `scripts/jupyter.js`.
- `pnpm-lock.yaml` fija las versiones de las dependencias.

En `scripts/`:

- `scripts/jupyter.js` arranca Jupyter sobre `clients/jupyter/`.

En `db/`:

- `db/connection.js` abre `db/users.sqlite`.
- `db/users.sqlite` es la base de datos del proyecto.

En `docs/`:

- `docs/CONSTITUTIONS.md` manda el comportamiento de la app.
- `docs/tree.md` es el árbol.
- `docs/ARCHITECTURE.md` dice la función de cada carpeta y de cada archivo.
- `docs/database.md` dice la base de datos y las consultas.
- `docs/errors.md` dice los errores.
- `docs/style.md` dice los comandos y el estilo.
- `docs/specs/<nombre>/spec.md` es el negocio.
- `docs/specs/<nombre>/plan.md` es la técnica.
- `docs/specs/<nombre>/tasks.md` son los pasos.

En `logic/`:

- `logic/shared.js` comprueba el nombre, el email y el id, y deja el usuario plano.
- `logic/create-user.js` crea un usuario.
- `logic/list-users.js` lista los usuarios.
- `logic/find-user-by-email.js` busca un usuario por email.
- `logic/find-user-by-id.js` busca un usuario por id.
- `logic/find-user-by-name.js` busca usuarios por nombre.
- `logic/update-user.js` cambia un usuario.
- `logic/delete-user.js` borra un usuario.
- `logic/users-gender-count.js` cuenta los usuarios según el sexo que sugiere el nombre. No guarda el sexo.

En `queries/`:

- `queries/users.js` lee los `.sql` y los ejecuta.
- `queries/queries/create-users-table.sql` crea la tabla `users`.
- `queries/queries/insert-user.sql` inserta un usuario.
- `queries/queries/find-all.sql` lee todos los usuarios.
- `queries/queries/find-by-email.sql` busca por email.
- `queries/queries/find-by-id.sql` busca por id.
- `queries/queries/find-by-name.sql` busca por nombre.
- `queries/queries/update-user.sql` cambia un usuario.
- `queries/queries/remove-user.sql` borra un usuario.

En `clients/terminal/`:

- `clients/terminal/create-users-table.txt` prueba crear la tabla.
- `clients/terminal/insert-user.txt` prueba crear un usuario.
- `clients/terminal/find-all.txt` prueba listar los usuarios.
- `clients/terminal/find-by-email.txt` prueba buscar por email.
- `clients/terminal/find-by-id.txt` prueba buscar por id.
- `clients/terminal/find-user-by-name.txt` prueba buscar por nombre.
- `clients/terminal/update-user.txt` prueba cambiar un usuario.
- `clients/terminal/remove-user.txt` prueba borrar un usuario.
- `clients/terminal/users-gender-count.txt` prueba el recuento por sexo del nombre.

En `clients/jupyter/`:

- `clients/jupyter/create-users-table.ipynb` valida crear la tabla.
- `clients/jupyter/insert-user.ipynb` valida crear un usuario.
- `clients/jupyter/find-all.ipynb` valida listar los usuarios.
- `clients/jupyter/find-by-email.ipynb` valida buscar por email.
- `clients/jupyter/find-by-id.ipynb` valida buscar por id.
- `clients/jupyter/find-user-by-name.ipynb` valida buscar por nombre.
- `clients/jupyter/update-user.ipynb` valida cambiar un usuario.
- `clients/jupyter/remove-user.ipynb` valida borrar un usuario.
- `clients/jupyter/users-gender-count.ipynb` valida el recuento por sexo del nombre.

## docs/database.md

Empieza con el texto actual de la sección 2, tal cual.

Después, este párrafo:

`queries/users.js` lee los `.sql` de `queries/queries/` y los ejecuta. No hay reglas de negocio aquí. El SQL usa parámetros con nombre (`:id`, `:name`, `:email`).

## docs/errors.md

El texto actual de la sección 6, tal cual, incluida la frase del email en minúsculas.

## docs/style.md

En este orden:

1. El texto actual de `## Comandos` de `AGENTS.md`, tal cual.
2. El texto actual de `## Estilo y convenciones` de `AGENTS.md`, con dos frases cambiadas.
3. El texto actual de la sección 4, tal cual.
4. El texto actual de la sección 5, tal cual.
5. Las cuatro reglas nuevas, al final:

Cada línea hace una sola cosa.

Cada línea dice lo que hace.

Una constante es un valor que no cambia. Se escribe al principio del archivo y su nombre va en mayúsculas, con `_` entre palabras. Una variable sigue en camelCase.

Lo tiene que poder leer una persona que empieza, como escrito a mano.

Las dos frases que cambian dentro del estilo que se trae de `AGENTS.md`:

- «El contrato de `logic/` y el manejo de errores están en `docs/CONSTITUTIONS.md`.» pasa a: «El contrato de `logic/` está en `docs/CONSTITUTIONS.md`. El manejo de errores está en `docs/errors.md`.»
- «El orden del cuerpo es el de la constitución.» pasa a: «El orden del cuerpo está en este archivo, más abajo.»

El resto de ese texto se copia tal cual.

## CONSTITUTIONS.md

Siguen enteras las secciones 1, 7, 8 y 9. Los números no cambian.

La sección 2 queda así:

La base de datos y las consultas están en `docs/database.md`.

La sección 3 pierde el diagrama y las frases de las carpetas. Queda así:

El árbol está en `docs/tree.md`.

La función de cada carpeta está en `docs/ARCHITECTURE.md`.

`AGENTS.md` dice cómo se trabaja en esta app: el orden de un cambio, el estilo y qué hacer al cerrar una tarea.

`docs/CONSTITUTIONS.md` es este documento. Manda sobre el comportamiento de la app.

La sección 4 queda así:

Cómo se lee el código está en `docs/style.md`.

La sección 5 queda así:

El orden del cuerpo de la función está en `docs/style.md`.

La sección 6 queda así:

Los errores están en `docs/errors.md`.

## AGENTS.md

Siguen el proyecto, el orden, las reglas, la validación de paquetes y el cierre de una tarea.

En el proyecto, la segunda frase pasa a ser:

Los campos del usuario están en `docs/CONSTITUTIONS.md`. Ese documento manda sobre el comportamiento de la app. La arquitectura está en `docs/ARCHITECTURE.md`. Los mensajes de error están en `docs/errors.md`. Los nombres de las funciones están en `docs/style.md`.

En las reglas, la frase de leer antes de tocar código pasa a ser:

Lee `docs/CONSTITUTIONS.md`, `docs/style.md`, `docs/ARCHITECTURE.md`, `docs/database.md`, `docs/errors.md`, `docs/tree.md` y la spec activa antes de tocar código. Si no hay spec para ese cambio, se crea y se para.

`## Comandos` queda así:

Los comandos están en `docs/style.md`.

`## Estilo y convenciones` queda así:

El estilo está en `docs/style.md`.
