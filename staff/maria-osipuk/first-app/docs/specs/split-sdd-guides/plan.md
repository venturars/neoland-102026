# Guías separadas por tema

Issue: #451.

No hay capa nueva, ni firma nueva, ni SQL nuevo. No se reescribe el JavaScript ni el SQL. No se tocan las specs ya escritas.

Hoy no hay una sección «Constantes». La regla de las constantes en mayúsculas se escribe en `docs/STYLE.md`. No hay una frase que diga «leer el código con if». La regla declarativa de `docs/STYLE.md` es la que trae la issue.

«Orden de una función de negocio» tiene seis pasos, no cuatro. Se mueven los seis, tal cual. No se reescriben a cuatro. La frase «Los pasos deben ser visibles y no combinarse en una única expresión compleja» es la regla de la línea. No se copia en `docs/CONSTITUTION.md`.

## Ficheros

Se crean:

- `docs/ARCHITECTURE.md`
- `docs/TREE.md`
- `docs/DATABASE.md`
- `docs/ERRORS.md`
- `docs/STYLE.md`

Se edita `docs/CONSTITUTION.md` y se conserva su nombre.

Se edita `AGENTS.md` de first-app.

No se toca el `AGENTS.md` de la raíz. No se tocan el código, `package.json` ni las specs ya escritas.

## Árbol

`docs/TREE.md` tiene el título `# Árbol` y este árbol. Nada más.

```text
first-app/
├── AGENTS.md
├── .gitignore
├── package.json
├── pnpm-lock.yaml
│
├── db/
│   ├── connection.js
│   └── users.sqlite
│
├── queries/
│   ├── queries/
│   │   ├── create-users-table.sql
│   │   ├── delete.sql
│   │   ├── find-by-email.sql
│   │   ├── find-by-id.sql
│   │   ├── insert.sql
│   │   ├── list.sql
│   │   └── update.sql
│   └── users.js
│
├── logic/
│   ├── count-users-by-gender.js
│   ├── create-user.js
│   ├── delete-user.js
│   ├── find-user-by-email.js
│   ├── find-user-by-id.js
│   ├── list-users.js
│   └── update-user.js
│
├── clients/
│   ├── jupyter/
│   │   ├── actualizar-usuario.ipynb
│   │   ├── bienvenida.ipynb
│   │   ├── borrar-usuario.ipynb
│   │   ├── buscar-usuario-por-email.ipynb
│   │   ├── buscar-usuario-por-id.ipynb
│   │   ├── contar-usuarios-por-genero.ipynb
│   │   ├── crear-usuario.ipynb
│   │   ├── listar-usuarios.ipynb
│   │   ├── preparar-tabla-usuarios.ipynb
│   │   └── run_logic.py
│   └── terminal/
│       ├── count-users-by-gender.txt
│       ├── create-users-table.txt
│       ├── create-user.txt
│       ├── delete-user.txt
│       ├── find-user-by-email.txt
│       ├── find-user-by-id.txt
│       ├── list-users.txt
│       └── update-user.txt
│
└── docs/
    ├── ARCHITECTURE.md
    ├── TREE.md
    ├── DATABASE.md
    ├── ERRORS.md
    ├── STYLE.md
    ├── CONSTITUTION.md
    └── specs/
        ├── classifier/
        │   ├── spec.md
        │   ├── plan.md
        │   └── tasks.md
        ├── gestor-pnpm/
        │   ├── spec.md
        │   ├── plan.md
        │   └── tasks.md
        ├── jupyter-client/
        │   ├── spec.md
        │   ├── plan.md
        │   └── tasks.md
        └── split-sdd-guides/
            ├── spec.md
            ├── plan.md
            └── tasks.md
```

No hay frases de responsabilidad.

## Arquitectura

`docs/ARCHITECTURE.md` queda así. Cada frase sale de la constitución actual. No se añade una responsabilidad que hoy no esté escrita.

```markdown
# Arquitectura

## Capas

`clients/terminal/` es el cliente de terminal. Sus archivos ejecutan funciones de `logic/`, proporcionan datos de ejemplo y muestran el resultado. Cada archivo contiene una sola línea de ejemplo: el caso correcto.

`clients/jupyter/` es el cliente Notebook de las mismas operaciones. Los cuadernos llaman a las funciones existentes mediante `run_logic.py`, muestran los errores en español y escriben el detalle en `clients/jupyter/jupyter-client.log`.

Los cuadernos se abren con `pnpm jupyter`, usan el Jupyter del `.venv`, el kernel `first-app` y la misma base de datos que la terminal.

`logic/` es el núcleo de la aplicación. Contiene las funcionalidades para crear, buscar, actualizar, borrar y listar usuarios, y para contarlos según el género del nombre. Aplica las reglas de negocio y decide qué resultado recibe el cliente.

`logic/` no calcula `createdAt` ni `updatedAt` y no los envía a las consultas. Esas fechas las escribe SQLite.

`queries/users.js` lee los archivos SQL, prepara las consultas, proporciona sus parámetros y las ejecuta mediante la conexión compartida. Al cargar este módulo, crea la tabla `users` si todavía no existe.

`queries/queries/` contiene un archivo `.sql` por consulta. Los archivos contienen exclusivamente SQL y no contienen JavaScript ni reglas de negocio.

`db/connection.js` abre la conexión SQLite.

`db/users.sqlite` es la base de la aplicación. Si el proceso tiene `FIRST_APP_DATABASE_FILE`, la conexión abre esa ruta. Si no la tiene, abre `db/users.sqlite`.

Ninguna capa accede directamente a otra capa que no sea la siguiente del recorrido: `clients/terminal/` o `clients/jupyter/`, `logic/`, `queries/users.js`, `queries/queries/*.sql`, `db/connection.js`, `db/users.sqlite`.

## Ficheros

- `AGENTS.md` guarda el proceso SDD, los comandos y el cierre de una tarea. Enlaza a `docs/STYLE.md`.
- `.gitignore` deja fuera `node_modules/`, `.env`, los archivos de SQLite, los checkpoints de Jupyter y el log del cliente Jupyter.
- `package.json` declara los módulos ESM, `packageManager` con `pnpm@10.34.7`, el comando `pnpm jupyter` y el control que impide instalar con otro gestor.
- `pnpm-lock.yaml` es el archivo de bloqueo que se conserva.
- `db/connection.js` abre la conexión SQLite. Acepta `FIRST_APP_DATABASE_FILE` para que un proceso use otra ruta.
- `db/users.sqlite` es la base de la aplicación cuando no se configura otra ruta.
- `queries/users.js` lee, prepara y ejecuta las consultas. Al cargarse, crea la tabla `users` si no existe.
- `queries/queries/create-users-table.sql` es el SQL que crea la tabla `users` si no existe.
- `queries/queries/insert.sql` es el SQL que inserta un usuario.
- `queries/queries/find-by-email.sql` es el SQL que busca un usuario por email.
- `queries/queries/find-by-id.sql` es el SQL que busca un usuario por id.
- `queries/queries/update.sql` es el SQL que actualiza un usuario.
- `queries/queries/delete.sql` es el SQL que borra un usuario.
- `queries/queries/list.sql` es el SQL que lista los usuarios.
- `logic/create-user.js` es `createUser(name, email)`. Crea un usuario y devuelve `id`, `name`, `email`, `createdAt` y `updatedAt`.
- `logic/find-user-by-id.js` es `findUserById(id)`. Busca por id y devuelve ese usuario, o lanza un error si no existe.
- `logic/find-user-by-email.js` es `findUserByEmail(email)`. Busca por email y devuelve ese usuario, o lanza un error si no existe.
- `logic/update-user.js` es `updateUser(id, changes)`. Cambia `name` y `email` solo cuando esas propiedades vienen en `changes`. Si falta una, conserva la que ya está guardada. Devuelve el usuario completo.
- `logic/delete-user.js` es `deleteUser(id)`. Borra el usuario y no devuelve un valor.
- `logic/list-users.js` es `listUsers()`. No recibe datos y devuelve la lista de usuarios.
- `logic/count-users-by-gender.js` es `countUsersByGender()`. No recibe datos y devuelve `{ female, male, undefined }`. Llama a Ollama en local, modelo `gemma4`, con el paquete `openai` apuntando a `http://127.0.0.1:11434/v1`. Los nombres salen en partes de hasta 6. No añade una capa. La lectura sigue siendo `listUserRows()`.
- Cada `.txt` de `clients/terminal/` contiene una sola línea: el caso correcto de esa operación.
- `clients/jupyter/bienvenida.ipynb` es el índice de los cuadernos.
- Los cuadernos de operación ejecutan los mismos casos que sus clientes de terminal.
- `clients/jupyter/preparar-tabla-usuarios.ipynb` prepara la tabla y explica que no es una acción de usuario.
- `clients/jupyter/run_logic.py` arranca Node y comunica los cuadernos con las funciones existentes.
- `docs/ARCHITECTURE.md` dice la responsabilidad de cada capa y de cada fichero.
- `docs/TREE.md` es el árbol.
- `docs/DATABASE.md` es la base de datos y las queries.
- `docs/ERRORS.md` es la lista de errores.
- `docs/STYLE.md` es la forma de cada línea y las convenciones.
- `docs/CONSTITUTION.md` conserva las specs, los paquetes y los pasos de `logic/`. Enlaza a las otras guías.
- `docs/specs/<nombre>/` describe un pedido, con `spec.md`, `plan.md` y `tasks.md`. No describe el estado del código. `<nombre>` va en kebab-case.
```

## Base de datos

`docs/DATABASE.md` junta, tal cual, estos textos. No se reescriben. El orden es el de esta lista.

De `docs/CONSTITUTION.md`:

- «`queries/users.js`», los dos párrafos;
- «`queries/queries/`», los dos párrafos;
- «`db/`», los dos párrafos;
- «Usuario», la sección entera;
- de «Decisiones fundamentales», solo estas cinco viñetas: una conexión SQLite por proceso, `db/users.sqlite` como base con `FIRST_APP_DATABASE_FILE` como alternativa, una consulta SQL por archivo, los `.sql` separados del JavaScript, y las consultas ejecutadas desde `queries/users.js`.

De `AGENTS.md`:

- de «Reglas de implementación», estas viñetas: leer los SQL una vez al cargar el módulo, parámetros con nombre, no concatenar datos del usuario, no cambiar el esquema como efecto secundario, y que `logic/` no llama a `createUsersTable()`;
- «Cambios en la base de datos», la sección entera.

El título del fichero es `# Base de datos`. Los títulos de las secciones copiadas se quedan.

## Errores

`docs/ERRORS.md` se lleva, tal cual, «Gestión de errores» de `AGENTS.md`, desde el párrafo «Los errores se gestionan en `logic/`» hasta el ejemplo de `Unable to find user`, incluido.

No entran los párrafos que empiezan en «Cuando una operación funciona». Esos hablan de la respuesta que sale bien y se quedan en `AGENTS.md`.

El título del fichero es `# Errores`. El resto del texto no se cambia.

## Estilo

`docs/STYLE.md` queda así:

```markdown
# Estilo

El código y los nombres técnicos se escriben en inglés. Los comentarios de los clientes de terminal se escriben en español.

Los ficheros van en kebab-case. Las funciones y las variables van en camelCase. Los exports son con nombre. Los imports de JavaScript llevan la extensión `.js`. El SQL usa parámetros con nombre. No hay envoltorios ni helpers genéricos. El formato es el estándar de Prettier. Una constante va en mayúsculas.

Una función por fichero, sin clases, sin `this` y sin métodos. Un usuario sigue siendo un registro con `id`, `name`, `email`, `createdAt` y `updatedAt`. Cada línea deja una sola acción en un nombre. Una acción es una llamada o una comprobación, así que `input.name` y `.trim()` van en líneas distintas y Prettier no las junta. Un fallo de la lista se comprueba con `if` y `throw new Error` en su propia línea. Se escribe como lo escribiría un junior a mano.
```

En `AGENTS.md`, «Idioma y formato» se sustituye por:

```markdown
## Estilo

La forma de cada línea y las convenciones están en `docs/STYLE.md`.
```

De «Nivel del código» se quitan las viñetas que ya dice esa guía: clases innecesarias, helpers genéricos y expresiones demasiado compactas. El resto de esa sección se queda.

## Constitución

`docs/CONSTITUTION.md` conserva su nombre.

Se quitan «Árbol actual», «Responsabilidades» y «Usuario». De «Decisiones fundamentales» se quitan las cinco viñetas que pasan a `docs/DATABASE.md`.

Después de «Alcance actual» se añade:

```markdown
## Guías

- `docs/ARCHITECTURE.md` dice la responsabilidad de cada capa y de cada fichero.
- `docs/TREE.md` es el árbol.
- `docs/DATABASE.md` es la base de datos y las queries.
- `docs/ERRORS.md` es la lista de errores.
- `docs/STYLE.md` es la forma de cada línea y las convenciones.
```

«Flujo de una operación» se queda con los dos clientes. «Specs» y «Gestión de dependencias» se quedan. En dependencias se conservan tanto la regla de Jupyter en el `.venv` como la validación de paquetes Node con Socket, sin marcadores de conflicto.

Al final se añade «Orden de una función de negocio» con los seis pasos, tal cual están hoy en `AGENTS.md`. Sin la frase de no combinarlos en una expresión.

Ahí no se repite la regla de la línea.

## AGENTS.md

Se conserva «Qué va primero», «Antes de editar», «Forma de trabajar», «Validación de paquetes con Socket» y «Verificación».

No hay una sección de comandos aparte. Los comandos de pnpm siguen en «Gestión de dependencias» de `docs/CONSTITUTION.md`. El cierre de una tarea sigue siendo «Verificación».

«Fuente de verdad» pasa a nombrar `docs/CONSTITUTION.md`. Esa guía enlaza a la arquitectura, el árbol, la base de datos, los errores y el estilo.

En «Antes de editar» se añaden estas tres frases:

```markdown
Si un desarrollo añade o quita un fichero, su spec también actualiza `docs/TREE.md` y `docs/ARCHITECTURE.md`.

La forma de cada línea se copia de `docs/STYLE.md`. El código que ya existe sirve para ver a qué fichero se parece una función nueva. Esta issue no lo reescribe. Un desarrollo posterior puede alinearlo. Mientras tanto, un spec nuevo no se para por esa diferencia.
```

«Orden de una función de negocio» sale de este fichero. La lista de errores, hasta el ejemplo de `Unable to find user`, sale de este fichero. Las viñetas de SQL y «Cambios en la base de datos» salen de este fichero.

Todas las referencias siguen usando `docs/CONSTITUTION.md`.

Se quedan en este fichero, porque la issue no les da otro sitio: los tipos y formatos, la firma, las actualizaciones parciales, los comentarios educativos, la seguridad, las reglas de implementación que no son SQL, y los párrafos de la respuesta que sale bien.

## Contrato

No hay función de `logic/`, firma pública ni SQL nuevo.

No hay un mensaje nuevo en la lista de errores.
