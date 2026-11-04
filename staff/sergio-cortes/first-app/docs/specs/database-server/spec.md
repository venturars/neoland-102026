# Servidor de la base de usuarios

Issue: #827.

## Qué se pide

La base de usuarios vive en un proceso aparte que hay que arrancar antes de usar la app desde la terminal o desde Jupyter. Crear la tabla, insertar, buscar por id, buscar por email, buscar por nombre, listar, actualizar y borrar ya no leen el SQL en el mismo proceso que las reglas de negocio: envían una petición con la sentencia guardada, la forma de ejecutarla y los mismos datos de ahora, y esperan la respuesta.

El SQL sigue en ficheros aparte, uno por sentencia, sin JavaScript. Solo el proceso de la base abre el fichero de la base y ejecuta ese SQL.

Las reglas de negocio conservan su nombre, sus parámetros y el mismo orden de pasos. Pasan a esperar la respuesta de cada operación.

## Quién lo usa

Quien construye first-app con IA, quien pega un cliente de terminal con el directorio actual en first-app, y quien quiere más adelante llamar a las mismas operaciones desde JavaScript en el navegador sin depender de Node en ese proceso.

## Entrada

El directorio actual en first-app, el proceso de la base arrancado con `pnpm server` y escuchando en `127.0.0.1:3000`, y los mismos datos que ya entran hoy en crear la tabla, crear usuario, listar, buscar, actualizar y borrar.

## Salida

En la terminal y en Jupyter se ve el mismo resultado que ahora al insertar, buscar, listar, actualizar y borrar: la fila con id, name, email, createdAt y updatedAt; la lista de esas filas; o changes y lastInsertRowid al borrar. Crear la tabla no devuelve fila ni conteo.

Ejemplo: con el proceso de la base en marcha, se pega el cliente que lista usuarios. Sale la misma lista que antes de este cambio.

## Fallo

No hay un mensaje nuevo de la lista «Errores».

Se siguen viendo `Name is empty`, `Email is invalid`, `Email is already used`, `Id is invalid`, `User not found`, y los `Could not …` cuando la operación falla. Si el proceso de la base no está arrancado, la llamada falla y se ve el mismo `Could not …` que corresponde a esa operación.

## Fuera

- El cliente HTTP y las pantallas del navegador de first-app.
- Añadir paquetes de Node o cambiar su versión.
- Cambiar el texto del SQL o el esquema de la base de datos.
- Cambiar los mensajes de error.
- Una funcionalidad nueva de negocio.
