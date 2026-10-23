# first-app

Aplicación de gestión de usuarios. Permite crear, actualizar, eliminar, listar y buscar usuarios con `id`, `name` y `email`. No tiene pantalla ni servidor. La entrada es una llamada a una función de `logic`, o un archivo de `clients/terminal` ejecutado desde la terminal. La salida se guarda en SQLite.

El `id` lo asigna la base de datos. El email se guarda en minúsculas y no se puede repetir. `package.json` incluye la dependencia `openai` `7.39.0`. pnpm escribe `pnpm-lock.yaml`.

## Estructura

```text
first-app/
  db/
    connection.js
    users.sqlite
  logic/
    shared.js
    create-user.js
    update-user.js
    delete-user.js
    list-users.js
    find-user-by-id.js
    find-user-by-email.js
  clients/
    terminal/
      create-user.txt
      update-user.txt
      delete-user.txt
      list-users.txt
      find-user-by-id.txt
      find-user-by-email.txt
  queries/
    users.js
    queries/
      create-table-users.sql
      create-user.sql
      update-user.sql
      delete-user.sql
      list-users.sql
      find-user-by-id.sql
      find-user-by-email.sql
  package.json
  pnpm-lock.yaml
  docs/
    CONSTITUTIONS.MD
  AGENTS.MD
```

## Componentes

**Base de datos.** Guarda a los usuarios en `users.sqlite`: un `id` que pone SQLite, un nombre y un email que no se puede repetir. Abre el archivo y no ejecuta SQL.

**Lógica.** Recibe lo que se quiere hacer, comprueba que el `id`, el nombre y el email sean válidos, y elige crear, actualizar, eliminar, listar o buscar. Si los datos no valen, se detiene y no toca la base. Listar no recibe datos.

**Cliente de terminal.** Es otra forma de pedir la misma operación, sin pantalla. Cada archivo guarda una línea: el comando de cmd que llama a la lógica. Esa línea se tira desde cmd, en la raíz del repositorio. Crear lleva el nombre y el email. Actualizar lleva el id y los cambios `name=` y `email=`, uno o los dos. Eliminar lleva el id. Listar no lleva argumentos. Buscar lleva el id o el email. No comprueba los datos y no toca la base.

**Consultas.** Ejecuta todo el SQL, también el que crea la tabla si no existe, y el de la operación que pidió la lógica. No revisa los datos: inserta, modifica, borra o lee.

**Documentación.** Explica el proyecto para una persona. No crea, no actualiza, no elimina, no lista y no busca usuarios. `AGENTS.MD`, en la raíz, son las instrucciones del agente y se actualizan cuando hay una instrucción nueva.

## Pasos de funcionamiento

Crear, actualizar, eliminar, listar y buscar siguen el mismo camino.

1. Se pide una operación con los datos del usuario, llamando a la lógica o desde el cliente de terminal.
2. La lógica valida esos datos cuando la operación los lleva. Listar no lleva datos. Si no valen, lanza un `Error` y termina.
3. Las consultas crean la tabla si no existe y ejecutan el SQL de esa operación.
4. La base de datos guarda el cambio, lo rechaza si el email ya existe o el usuario no está, o devuelve las filas.

Al crear, la base asigna el `id` y se devuelve el usuario. Al actualizar, se puede cambiar el nombre, el email o los dos, y lo que no se envía se queda igual. Al eliminar, desaparece la fila de ese `id`. Si ese usuario no existe, la operación no cambia nada y se avisa con un `Error`. Al listar, una sola consulta devuelve todos los usuarios. Si no hay ninguno, la lista va vacía. Al buscar, se devuelve el usuario de ese `id` o de ese email. Si no existe, se avisa con un `Error`.
