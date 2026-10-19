# CONSTITUTIONS.md — mi-primer-proyecto

Base de la app. Primera app con IA para alumnos junior de AI Engineering, en español, con el código en inglés. Node y una sola base SQLite. Sigue SDD.

## Árbol

```text
mi-primer-proyecto/
  package.json                 Dependencia sqlite3 y "type": "module".
  .gitignore                   Ignora node_modules/.
  AGENTS.md                    Reglas para quien modifica el proyecto.
  clients/terminal/            Primer cliente de cada funcionalidad. Ficheros .txt para pegar en la terminal.
    create-user.txt
    list-users.txt
    update-user.txt
    delete-user.txt
  db/connection.js             Abre y cierra el único fichero SQLite. No contiene SQL.
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

`logic/` no importa `sqlite3`. Recibe el almacén. Cuando una funcionalidad de `logic/` existe, no se mueve a otra carpeta ni se sustituye por otra implementación. Pueden cambiar el cliente y el SQL. Las reglas no.

## Base de datos

Hay una sola base: `db/users.sqlite`.

- `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`.
- `email`: `VARCHAR(64) NOT NULL UNIQUE`.
- `name`: `VARCHAR(64) NOT NULL`.
- `created_at`: fecha de alta. `TEXT` en ISO-8601 (`YYYY-MM-DD`).
- `updated_at`: fecha de última actualización. `TEXT` en ISO-8601 (`YYYY-MM-DD`).
- Una fecha se guarda como `TEXT` en ISO-8601 (`YYYY-MM-DD`). SQLite no valida un tipo `DATE`.

El `CREATE TABLE` vive en una query de `queries/queries/`. `queries/users.js` la importa y la ejecuta al preparar el almacén.

## Código para un junior

El código lo tiene que poder leer y escribir un junior sin experiencia y sin ayuda de IA. Prettier con su configuración por defecto: comillas dobles, punto y coma, dos espacios.

Una funcionalidad de `logic/` es un fichero. El fichero define el nombre, los parámetros de entrada, el cuerpo y la salida.

Orden del cuerpo:

1. Validar los parámetros de entrada.
2. Validar las reglas de negocio.
3. Aplicar la regla.
4. Montar la salida y dejar solo los datos que salen de la función.

El error no se devuelve como objeto. Se lanza con `throw new Error("mensaje en inglés")` dentro de `try/catch`.

## Funciones de logic

`createUser(users, email, name)`  
Entrada: almacén, email, nombre.  
Salida: el usuario creado, con `id`, `email`, `name`, `created_at` y `updated_at`.

`listUsers(users)`  
Entrada: almacén.  
Salida: la lista de usuarios, cada uno con `id`, `email`, `name`, `created_at` y `updated_at`.

`updateUser(users, id, changes)`  
Entrada: almacén, id y los campos enviados (`email`, `name`).  
Salida: el usuario ya actualizado, con `id`, `email`, `name`, `created_at` y `updated_at`. `updated_at` pasa a ser el día del cambio.

`deleteUser(users, id)`  
Entrada: almacén e id.  
Salida: ninguna. No devuelve un objeto.

## Queries

Cada sentencia SQL es un fichero en `queries/queries/`. `queries/users.js` importa esas funciones y las usa. La query no conoce las reglas de `logic/`.

## Cliente

Al terminar una funcionalidad, su primer cliente es un `.txt` en `clients/terminal/`. El fichero es el bloque que se pega en Git Bash, con el directorio actual en `mi-primer-proyecto`. Ese bloque practica la query.