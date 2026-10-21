# Constitución — first-app

## Objetivo

`first-app` es una aplicación educativa de gestión de usuarios construida con Node.js y SQLite.

El objetivo es aprender a desarrollar una aplicación sencilla por capas, entendiendo el recorrido de los datos y la responsabilidad de cada archivo.

## Alcance actual

Actualmente la aplicación permite:

- crear un usuario;
- buscar un usuario por email;
- buscar un usuario por id;
- actualizar un usuario;
- borrar un usuario;
- listar los usuarios;
- contar los usuarios según el género de su nombre;
- crear la tabla `users`;
- comprobar las operaciones desde la terminal.

La aplicación no tiene frontend, API HTTP, Jupyter Notebook ni autenticación.

Contar por género llama a Ollama en local desde `logic/count-users-by-gender.js`, modelo `gemma4`, con `fetch`. No añade una capa. Primero lee los usuarios ya guardados y, solo si hay filas, consulta el modelo.

## Árbol actual

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
    ├── CONSTITUTION.md
    └── specs/
        ├── classifier/
        │   ├── spec.md
        │   ├── plan.md
        │   └── tasks.md
        └── gestor-pnpm/
            ├── spec.md
            ├── plan.md
            └── tasks.md
```

El árbol representa solamente los archivos y funcionalidades existentes.

## Flujo de una operación

```text
clients/terminal/
        ↓
logic/
        ↓
queries/users.js
        ↓
queries/queries/*.sql
        ↓
db/connection.js
        ↓
db/users.sqlite
```

Ninguna capa accede directamente a otra capa que no sea la siguiente del recorrido.

## Responsabilidades

### `clients/terminal/`

Es el cliente actual de la aplicación.

Sus archivos ejecutan funciones de `logic/`, proporcionan datos de ejemplo y muestran el resultado.

Cada archivo contiene una sola línea de ejemplo: el caso correcto.

### `logic/`

Es el núcleo de la aplicación.

Contiene las funcionalidades para crear, buscar, actualizar, borrar y listar usuarios, y para contarlos según el género del nombre. Aplica las reglas de negocio y decide qué resultado recibe el cliente.

Cada función recibe solo los datos que necesita:

- `createUser(name, email)` crea un usuario y devuelve `id`, `name`, `email`, `createdAt` y `updatedAt`;
- `findUserById(id)` busca por id y devuelve ese mismo usuario, o lanza un error si no existe;
- `findUserByEmail(email)` busca por email y devuelve ese mismo usuario, o lanza un error si no existe;
- `updateUser(id, changes)` cambia `name` y `email` solo cuando esas propiedades vienen en `changes`. Si falta una, conserva la que ya está guardada. Devuelve el usuario completo;
- `deleteUser(id)` borra el usuario y no devuelve un valor;
- `listUsers()` no recibe datos y devuelve la lista de usuarios;
- `countUsersByGender()` no recibe datos y devuelve `{ female, male, undefined }`.

`logic/` no calcula `createdAt` ni `updatedAt` y no los envía a las consultas. Esas fechas las escribe SQLite.

`count-users-by-gender.js` llama a Ollama en local, modelo `gemma4`, sin capa nueva. El diagrama de SQLite de arriba no cambia: la lectura sigue siendo `listUserRows()`.

### `queries/users.js`

Es la capa de ejecución de consultas.

Lee los archivos SQL, prepara las consultas, proporciona sus parámetros y las ejecuta mediante la conexión compartida.

Al cargar este módulo, crea la tabla `users` si todavía no existe.

### `queries/queries/`

Contiene un archivo `.sql` por consulta.

Los archivos contienen exclusivamente SQL y no contienen JavaScript ni reglas de negocio.

### `db/`

`db/connection.js` abre la única conexión SQLite.

`db/users.sqlite` es el único archivo de base de datos.

## Usuario

La tabla `users` contiene:

- `id`;
- `name`;
- `email`;
- `created_at`;
- `updated_at`.

Las reglas de tipo, formato y validación están definidas en `AGENTS.md`.

En una base creada con el script actual, `created_at` y `updated_at` usan `DEFAULT (datetime('now', 'localtime'))`. Las consultas de alta y de modificación también escriben esa fecha en SQL. `CREATE TABLE IF NOT EXISTS` no cambia una tabla que ya existía.

## Decisiones fundamentales

- Existe una sola conexión SQLite.
- Existe un solo archivo de base de datos.
- Cada funcionalidad de negocio tiene su propio archivo.
- Cada consulta SQL tiene su propio archivo.
- Los archivos `.sql` están separados del código JavaScript.
- Las reglas de negocio viven en `logic/`.
- Las consultas se ejecutan desde `queries/users.js`.
- El cliente actual es la terminal.
- Ninguna funcionalidad se añade sin una tarea concreta.
- Cada pedido tiene su carpeta `docs/specs/<nombre>/` con `spec.md`, `plan.md` y `tasks.md`.

## Specs

El nombre de la carpeta va en kebab-case. La carpeta de contar usuarios por género es `docs/specs/classifier/`.

Esos tres ficheros describen ese pedido. No describen el estado del código. El estado real del proyecto es esta constitución.

Antes de modificar el código de un pedido, hay que leer por completo `spec.md`, `plan.md` y `tasks.md` de su carpeta.

Si contradicen esta constitución, no se programa. Se señala la contradicción y se espera una decisión.

### `docs/specs/<nombre>/spec.md`

Es la parte de negocio.

Recoge el pedido del product owner: qué se podrá hacer, un ejemplo correcto, un ejemplo que debe fallar y cómo se nota en la terminal que está terminado.

No contiene archivos, SQL ni capas.

Si el pedido es una forma de trabajar, describe la regla, a quién obliga y cómo se comprueba que se está siguiendo.

### `docs/specs/<nombre>/plan.md`

Es la parte técnica.

Explica qué capas y archivos del recorrido actual se usan, qué entra y qué sale de `logic/`, y cómo se comprobará.

No copia reglas que ya están en `AGENTS.md`.

### `docs/specs/<nombre>/tasks.md`

Son los pasos para implementar el pedido, en el orden en que los haría una persona.

Cada paso abre un sitio, hace una cosa y deja un resultado que se puede mirar. Un paso ocupa como mucho cuatro líneas.

No son tickets de agente.

## Gestión de dependencias

Por política de seguridad, el gestor del proyecto es pnpm 10. También en las próximas funcionalidades.

pnpm 10 no ejecuta los scripts de instalación de las dependencias hasta que se autorizan. Esos scripts son código de terceros y se lanzan al instalar. Además, cada paquete solo puede usar lo que declaró.

- No se usan `npm` ni `npx`. Tampoco yarn ni bun.
- Instalar lo declarado: `pnpm install`.
- Añadir una dependencia: `pnpm add`.
- Ejecutar un script: `pnpm run`.
- Ejecutar una herramienta ya instalada: `pnpm exec`.
- Descargar una herramienta de forma temporal: `pnpm dlx`.
- El archivo de bloqueo que se conserva es `pnpm-lock.yaml`. No se genera `package-lock.json`.
- `package.json` declara `packageManager` con `pnpm@10.34.7`. El script `preinstall` termina con error si el instalador no es pnpm, así que `npm install` no llega a instalar.
- Revisar las dependencias y los scripts de instalación antes de autorizar su ejecución. Usar pnpm no sustituye esta revisión.
