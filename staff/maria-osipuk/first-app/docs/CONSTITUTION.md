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
- crear la tabla `users`;
- comprobar las operaciones desde la terminal.

La aplicación no tiene frontend, API HTTP, Jupyter Notebook ni autenticación.

## Árbol actual

```text
first-app/
├── AGENTS.md
├── .gitignore
├── package.json
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
│   ├── create-user.js
│   ├── delete-user.js
│   ├── find-user-by-email.js
│   ├── find-user-by-id.js
│   ├── list-users.js
│   └── update-user.js
│
├── clients/
│   └── terminal/
│       ├── create-users-table.txt
│       ├── create-user.txt
│       ├── delete-user.txt
│       ├── find-user-by-email.txt
│       ├── find-user-by-id.txt
│       ├── list-users.txt
│       └── update-user.txt
│
└── docs/
    └── CONSTITUTION.md
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

Contiene las funcionalidades para crear, buscar, actualizar, borrar y listar usuarios. Aplica las reglas de negocio y decide qué resultado recibe el cliente.

### `queries/users.js`

Es la capa de ejecución de consultas.

Lee los archivos SQL, prepara las consultas, proporciona sus parámetros y las ejecuta mediante la conexión compartida.

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

## Gestión de dependencias

- Por política de seguridad del proyecto, utiliza siempre `pnpm` como gestor de paquetes, también en las próximas funcionalidades.
- Nunca utilices `npm` ni `npx` para instalar dependencias, ejecutar scripts o lanzar herramientas.
- Utiliza `pnpm add` para añadir dependencias, `pnpm install` para instalarlas y `pnpm run` para ejecutar scripts.
- Para ejecutar herramientas, utiliza `pnpm exec` o, cuando sea necesario descargar una herramienta temporalmente, `pnpm dlx`.
- Revisa las dependencias y los scripts de instalación antes de autorizar su ejecución. Usar `pnpm` no sustituye esta revisión.
- Cuando se incorporen dependencias, conserva `pnpm-lock.yaml` y no generes `package-lock.json`.
