# Constitución — first-app

first-app es una app para aprender a gestionar usuarios con Node.js y SQLite.
Se construye con IA siguiendo SDD: primero se define el comportamiento y después
se implementa y se comprueba.

## Árbol

```text
first-app/
  db/
    connection.js                  Abre e inicializa la base de datos
    schema.sql                     Define la tabla users
    users.sqlite                   Datos locales, fuera de Git
  repositories/
    sqlite-user-repository.js      Consultas SQL y acceso a datos
  logic/
    validate-user.js               Validaciones compartidas
    create-user.js                 Crear un usuario
    update-user.js                 Actualizar un usuario
    delete-user.js                 Eliminar un usuario
    list-users.js                  Listar los usuarios
  clients/
    terminal/                     Ejemplos de uso y prueba manual
  tests/                          Pruebas de negocio y de SQLite
  docs/
    constitution.md               Esta base
  app.js                          Conecta la lógica con el repositorio
```

- `db/` abre la base y define su estructura. No contiene reglas de negocio.
- `repositories/` ejecuta SQL y devuelve objetos normales de JavaScript.
- `logic/` contiene las reglas de negocio y recibe el repositorio como argumento.
- `clients/` llama a la aplicación y muestra el resultado.
- `app.js` elige el repositorio y lo proporciona a las funciones de `logic/`.

## Base de datos

La aplicación guarda sus datos en `db/users.sqlite`. Cada instancia de la
aplicación abre una conexión y la cierra al terminar. Las pruebas y la demo usan
bases aisladas, en memoria o en archivos temporales.

La tabla `users` contiene:

- `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`, generado por SQLite.
- `name`: `TEXT NOT NULL`.
- `email`: `TEXT NOT NULL UNIQUE`.
- `createdAt` y `updatedAt`: `TEXT`, con fechas UTC en formato ISO 8601.

`schema.sql` permite crear la tabla sin borrar los datos existentes. El archivo
`users.sqlite` no se sube a Git.

## Lógica de negocio

Cada operación tiene su fichero y su función. Las validaciones comunes viven en
`validate-user.js` para que crear y actualizar apliquen las mismas reglas.

Las funciones reciben el repositorio y los datos que necesitan. No importan
SQLite, no ejecutan SQL, no imprimen mensajes y no conocen HTTP ni el frontend.
Las interfaces futuras reutilizan estas funciones.

El cuerpo de una operación sigue este orden:

1. Validar las entradas.
2. Comprobar las reglas de negocio.
3. Pedir al repositorio que consulte o modifique los datos.
4. Devolver el resultado con los campos necesarios.

El nombre es obligatorio. El correo se recorta, se pasa a minúsculas, debe tener
un único `@`, contenido a ambos lados, ningún espacio interior y un máximo de
64 caracteres como regla del ejercicio. No puede pertenecer a otro usuario.
Actualizar conserva los campos omitidos. Eliminar borra definitivamente.

## Repositorio

El repositorio ofrece `findById`, `findByEmail`, `findAll`, `insert`, `update` y
`remove`. Su contrato está descrito en el README.

El SQL vive en `sqlite-user-repository.js` y utiliza parámetros con nombre, como
`:id`, `:name` y `:email`. Las reglas de negocio permanecen en `logic/`.

Se puede cambiar el almacenamiento manteniendo ese contrato. Si el nuevo
repositorio es asíncrono, habrá que adaptar las llamadas con `async`/`await`.

## Resultados y errores

- Crear o actualizar devuelve `{ ok: true, user }`.
- Listar devuelve `{ ok: true, users }`.
- Eliminar devuelve `{ ok: true }`.
- Un error de negocio devuelve `{ ok: false, error: "CODIGO" }`.

Los códigos son `INVALID_INPUT`, `INVALID_ID`, `INVALID_NAME`, `INVALID_EMAIL`,
`EMPTY_CHANGES`, `EMAIL_ALREADY_USED` y `USER_NOT_FOUND`.

El repositorio convierte los conflictos de correo de SQLite en
`EMAIL_ALREADY_USED`. Los fallos técnicos inesperados lanzan una excepción y el
cliente se encarga de gestionarla. Los resultados correctos contienen objetos
JavaScript con `id`, `name`, `email`, `createdAt` y `updatedAt`.

## Trabajo con SDD

- Antes de cambiar un comportamiento, escribir una especificación breve con el
  objetivo, el alcance, las reglas y ejemplos de éxito y error.
- Anotar el plan y las tareas en `docs/`. La documentación debe ser proporcional
  al cambio y mantenerse actualizada.
- Comprobar lo implementado con los criterios de la especificación y las pruebas
  afectadas. Usar `npm test` y la demo cuando corresponda.
- Mantener funciones sencillas y añadir dependencias solo cuando sean necesarias.
- Guardar todo en UTF-8 y añadir algún comentario corto y explicativo por cada
  funcionalidad nueva.
