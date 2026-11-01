# Arquitectura

Aplicación de gestión de usuarios. Permite crear, actualizar, eliminar, listar y buscar usuarios con `id`, `name` y `email`. También cuenta el género de los nombres ya guardados, sin pedir nombres nuevos y sin modificar los datos. No tiene pantalla propia ni servidor propio. La entrada es una llamada a una función de `src/logic`, un archivo de `src/clients/terminal` ejecutado desde la terminal, o un documento de `src/clients/jupyter`. La salida de crear, actualizar y eliminar se guarda en SQLite. El recuento de género solo se muestra.

El `id` lo asigna la base de datos. El email se guarda en minúsculas y no se puede repetir. `package.json` incluye la dependencia `openai` `7.39.0` y declara pnpm `12.15.0` como gestor de paquetes. pnpm escribe `pnpm-lock.yaml`.

## Componentes

**Base de datos.** Guarda a los usuarios en `users.sqlite`: un `id` que pone SQLite, un nombre y un email que no se puede repetir. Abre el archivo y no ejecuta SQL.

**Lógica.** Recibe lo que se quiere hacer, comprueba que el `id`, el nombre y el email sean válidos, y elige crear, actualizar, eliminar, listar o buscar. Buscar por nombre usa el nombre ya guardado: si hay uno, devuelve ese usuario; si hay varios, devuelve la lista; si no hay ninguno, lanza `User ${name} was not found`. Si los datos no valen, se detiene y no toca la base. Listar no recibe datos. También puede contar el género de los nombres ya guardados: lee esos usuarios, pregunta a Ollama de seis en seis con `nimble-v3` y devuelve cuántos son `women`, cuántos son `man` y cuántos son `undefined`. No modifica los usuarios. No escribe una línea por nombre: la terminal muestra solo el recuento completo. Si Ollama no contesta, o la lectura falla, se detiene y lanza un `Error` con el texto `no se han podido clasificar usuarios`.

Contar el género no valida datos de entrada y no escribe en la base. Se pide con `usersGender`, desde la lógica o desde `users-gender.txt`. La lógica lee los usuarios que ya están. Si no hay ninguno, devuelve `{ women: 0, man: 0, undefined: 0 }` y no llama a Ollama. Si hay nombres, los envía de seis en seis y suma cada respuesta. Otra respuesta cuenta como `undefined`. Si no hay mensaje, no se puede leer el JSON o el grupo no trae una línea por nombre, esos nombres también cuentan como `undefined`. Devuelve solo el recuento.

**Cliente de terminal.** Es otra forma de pedir la misma operación, sin pantalla. Cada archivo guarda una línea: el comando de cmd que llama a la lógica. Esa línea se tira desde cmd, en la raíz del repositorio. Crear lleva el nombre y el email. Actualizar lleva el id y los cambios `name=` y `email=`, uno o los dos. Eliminar lleva el id. Listar no lleva argumentos. Buscar lleva el id, el email o el nombre. Buscar por nombre llama a `findUserByName` desde `find-user-by-name.txt` y muestra el resultado. Contar el género no lleva argumentos: la línea llama a `usersGender` y muestra el recuento. No comprueba los datos y no toca la base.

**Cliente de Jupyter.** Es otra forma de pedir la misma operación, en el navegador: un documento por operación y el resultado en una tabla con el encabezado en color. Se abre con el Jupyter de la app, el `.venv` de `first-app` con `notebook` `7.6.3`, mediante `pnpm jupyter` desde `first-app`. No usa el Jupyter instalado en el equipo. No comprueba los datos y no abre la base.

**Consultas.** Ejecuta todo el SQL, también el que crea la tabla si no existe, y el de la operación que pidió la lógica. No revisa los datos: inserta, modifica, borra o lee.

**Documentación.** Explica el proyecto para una persona. No crea, no actualiza, no elimina, no lista y no busca usuarios. `docs/specs/<nombre>/` guarda el negocio, la técnica y los pasos de un desarrollo. Esos tres ficheros se leen antes de escribir el código. `AGENTS.MD`, en la raíz, son las instrucciones del agente y se actualizan cuando hay una instrucción nueva.
