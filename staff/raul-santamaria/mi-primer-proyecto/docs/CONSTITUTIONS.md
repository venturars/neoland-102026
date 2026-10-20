# CONSTITUTIONS.md — mi-primer-proyecto

Base de la app. Primera app con IA para alumnos junior de AI Engineering, en español, con el código en inglés. Node y una sola base SQLite. Sigue SDD.

## Árbol

```text
mi-primer-proyecto/
  package.json                 Sin paquetes.
  .gitignore                   Ignora node_modules/.
  AGENTS.md                    Reglas para quien modifica el proyecto.
  clients/terminal/            Primer cliente de cada funcionalidad. Ficheros .txt para pegar en la terminal.
    create-user.txt
    list-users.txt
    update-user.txt
    delete-user.txt
  db/connection.js             Abre una vez el único fichero SQLite y deja la conexión abierta. No contiene SQL.
  db/users.sqlite              La base. Se crea al abrir la conexión. No hay otra.
  docs/CONSTITUTIONS.md        Este documento.
  logic/                       Reglas de negocio. Una funcionalidad, un fichero. Esta capa no se reemplaza.
    create-user.js
    list-users.js
    update-user.js
    delete-user.js
  queries/users.js             Almacén de usuarios. Importa las queries. No escribe el SQL.
  queries/queries/             Una query por fichero. SQL reutilizable.
```

`logic/` no importa la base de datos. Recibe el almacén. Cuando una funcionalidad de `logic/` existe, no se mueve a otra carpeta ni se sustituye por otra implementación. Pueden cambiar el cliente y el SQL. Las reglas no.

## Base de datos

Hay una sola base: `db/users.sqlite`.

- `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`.
- `email`: `VARCHAR(64) NOT NULL UNIQUE`.
- `name`: `VARCHAR(64) NOT NULL`.
- `created_at`: fecha de alta. `TEXT` en ISO-8601 (`YYYY-MM-DD`).
- `updated_at`: fecha de última actualización. `TEXT` en ISO-8601 (`YYYY-MM-DD`).
- Una fecha se guarda como `TEXT` en ISO-8601 (`YYYY-MM-DD`). SQLite no valida un tipo `DATE`.

La conexión se abre al cargar `db/connection.js` y se queda abierta. Las queries no la abren ni la cierran.

El SQLite de Node ejecuta cada sentencia en el momento. Las funciones de `queries/users.js` son síncronas.

El `CREATE TABLE` vive en una query de `queries/queries/`. `queries/users.js` la lee y la ejecuta al cargar el módulo.

## Código para un junior

El código lo tiene que poder leer y escribir un junior sin experiencia y sin ayuda de IA. Prettier con su configuración por defecto: comillas dobles, punto y coma, dos espacios.

Una funcionalidad de `logic/` es un fichero. El fichero define el nombre, los parámetros de entrada, el cuerpo y la salida.

Orden del cuerpo:

1. Validar los parámetros de entrada.
2. Validar las reglas de negocio.
3. Aplicar la logica de negocio.
4. Montar la salida y dejar solo los datos que salen de la función.

El error no se devuelve como objeto. Se lanza con `throw new Error("mensaje en inglés")` dentro de `try/catch`.

## Funciones de logic

`createUser({ name, email })`  
Entrada: nombre y email.  
Salida: el usuario creado, con `id`, `name`, `email`, `createdAt` y `updatedAt`.

`listUsers()`  
Entrada: ninguna.  
Salida: la lista de usuarios, cada uno con `id`, `name`, `email`, `createdAt` y `updatedAt`.

`updateUser({ id, name, email })`  
Entrada: id y los campos enviados (`name`, `email`).  
Salida: el usuario ya actualizado, con `id`, `name`, `email`, `createdAt` y `updatedAt`. `updatedAt` pasa a ser el día del cambio.

`deleteUser({ id })`  
Entrada: id.  
Salida: ninguna. No devuelve un objeto.

## Queries

Cada sentencia SQL es un fichero `.sql` en `queries/queries/`. Solo contiene SQL. `queries/users.js` lee esos ficheros y los ejecuta.

## Cliente

Al terminar una funcionalidad, su primer cliente es un `.txt` en `clients/terminal/`. El fichero es el bloque que se pega en Git Bash, con el directorio actual en `mi-primer-proyecto`. Ese bloque practica la query.