# first-app

Aplicación de gestión de usuarios. Permite crear, actualizar, eliminar, listar y buscar usuarios con `id`, `name` y `email`. También cuenta el género de los nombres ya guardados, sin pedir nombres nuevos y sin modificar los datos. No tiene pantalla ni servidor. La entrada es una llamada a una función de `logic`, o un archivo de `clients/terminal` ejecutado desde la terminal. La salida de crear, actualizar y eliminar se guarda en SQLite. El recuento de género solo se muestra.

El `id` lo asigna la base de datos. El email se guarda en minúsculas y no se puede repetir. `package.json` incluye la dependencia `openai` `7.39.0` y declara pnpm `12.15.0` como gestor de paquetes. pnpm escribe `pnpm-lock.yaml`.

## Desarrollos

Un desarrollo nuevo no empieza en el código. Se escribe en `docs/specs/<nombre>/`. `<nombre>` va en kebab-case. El desarrollo abierto es `docs/specs/find-user-by-name/`.

Pedir el cambio no abre el código. Primero se escribe `spec.md` y una persona lo lee. Después `plan.md` y lo lee. Después `tasks.md` y lo lee. El código, `package.json` y el resto de ficheros de la app se tocan cuando esa persona pide ejecutar las tareas.

`spec.md` es el negocio: qué se pide, qué entra, qué sale y qué fallo se ve. No nombra ficheros, funciones ni SQL.

`plan.md` es la técnica: qué ficheros se crean o se tocan, la firma, el SQL y cómo encaja en esta app.

`tasks.md` son los pasos, en el orden en que los haría una persona. Cada paso abre un sitio, hace una cosa y deja un resultado que se puede mirar. Un paso son como mucho cuatro líneas.

Es un SDD de iniciación. Una persona lee cada fichero antes del siguiente. No hay un bucle que los reescriba. El código empieza cuando esa persona pide ejecutar las tareas: se siguen y no se inventan pasos.

Si la constitución, el código y la spec no dicen lo mismo, la pregunta queda al final del plan y no hay tareas.

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
    find-user-by-name.js
    users-gender.js
  clients/
    terminal/
      create-user.txt
      update-user.txt
      delete-user.txt
      list-users.txt
      find-user-by-id.txt
      find-user-by-email.txt
      find-user-by-name.txt
      users-gender.txt
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
      find-user-by-name.sql
  package.json
  pnpm-lock.yaml
  docs/
    CONSTITUTIONS.MD
    specs/
      <nombre>/
        spec.md
        plan.md
        tasks.md
  AGENTS.MD
```

## Componentes

**Base de datos.** Guarda a los usuarios en `users.sqlite`: un `id` que pone SQLite, un nombre y un email que no se puede repetir. Abre el archivo y no ejecuta SQL.

**Lógica.** Recibe lo que se quiere hacer, comprueba que el `id`, el nombre y el email sean válidos, y elige crear, actualizar, eliminar, listar o buscar. Buscar por nombre usa el nombre ya guardado: si hay uno, devuelve ese usuario; si hay varios, devuelve la lista; si no hay ninguno, lanza `User ${name} was not found`. Si los datos no valen, se detiene y no toca la base. Listar no recibe datos. También puede contar el género de los nombres ya guardados: lee esos usuarios, pregunta a Ollama de seis en seis con `nimble-v3` y devuelve cuántos son `women`, cuántos son `man` y cuántos son `undefined`. No modifica los usuarios. No escribe una línea por nombre: la terminal muestra solo el recuento completo. Si Ollama no contesta, o la lectura falla, se detiene y lanza un `Error` con el texto `no se han podido clasificar usuarios`.

**Cliente de terminal.** Es otra forma de pedir la misma operación, sin pantalla. Cada archivo guarda una línea: el comando de cmd que llama a la lógica. Esa línea se tira desde cmd, en la raíz del repositorio. Crear lleva el nombre y el email. Actualizar lleva el id y los cambios `name=` y `email=`, uno o los dos. Eliminar lleva el id. Listar no lleva argumentos. Buscar lleva el id, el email o el nombre. Buscar por nombre llama a `findUserByName` desde `find-user-by-name.txt` y muestra el resultado. Contar el género no lleva argumentos: la línea llama a `usersGender` y muestra el recuento. No comprueba los datos y no toca la base.

**Consultas.** Ejecuta todo el SQL, también el que crea la tabla si no existe, y el de la operación que pidió la lógica. No revisa los datos: inserta, modifica, borra o lee.

**Documentación.** Explica el proyecto para una persona. No crea, no actualiza, no elimina, no lista y no busca usuarios. `docs/specs/<nombre>/` guarda el negocio, la técnica y los pasos de un desarrollo. Esos tres ficheros se leen antes de escribir el código. `AGENTS.MD`, en la raíz, son las instrucciones del agente y se actualizan cuando hay una instrucción nueva.

## Pasos de funcionamiento

Crear, actualizar, eliminar, listar y buscar siguen el mismo camino.

1. Se pide una operación con los datos del usuario, llamando a la lógica o desde el cliente de terminal.
2. La lógica valida esos datos cuando la operación los lleva. Listar no lleva datos. Si no valen, lanza un `Error` y termina.
3. Las consultas crean la tabla si no existe y ejecutan el SQL de esa operación.
4. La base de datos guarda el cambio, lo rechaza si el email ya existe o el usuario no está, o devuelve las filas.

Al crear, la base asigna el `id` y se devuelve el usuario. Al actualizar, se puede cambiar el nombre, el email o los dos, y lo que no se envía se queda igual. Al eliminar, desaparece la fila de ese `id`. Si ese usuario no existe, la operación no cambia nada y se avisa con un `Error`. Al listar, una sola consulta devuelve todos los usuarios. Si no hay ninguno, la lista va vacía. Al buscar, se devuelve el usuario de ese `id` o de ese email. Si no existe, se avisa con un `Error`. Al buscar por nombre, `findUserByName` devuelve ese usuario si hay uno, o la lista si hay varios. Si no hay ninguno, lanza `User ${name} was not found` y no cambia los usuarios guardados. Un nombre vacío se rechaza. Un nombre de más de 100 caracteres se rechaza. `Ana` y `ana` no son el mismo nombre.

Contar el género no valida datos de entrada y no escribe en la base. Se pide con `usersGender`, desde la lógica o desde `users-gender.txt`. La lógica lee los usuarios que ya están. Si no hay ninguno, devuelve `{ women: 0, man: 0, undefined: 0 }` y no llama a Ollama. Si hay nombres, los envía de seis en seis y suma cada respuesta. Otra respuesta cuenta como `undefined`. Si no hay mensaje, no se puede leer el JSON o el grupo no trae una línea por nombre, esos nombres también cuentan como `undefined`. Devuelve solo el recuento. Si Ollama o la lectura fallan, lanza `no se han podido clasificar usuarios` y se detiene.
