# Base de datos y consultas

La aplicación utiliza únicamente `src/db/users.sqlite` y la conexión exportada por `src/db/connection.js`. No se crean bases ni conexiones alternativas. El archivo SQLite y sus auxiliares permanecen fuera de Git.

## Conservar la base al actualizar un checkout

Git no mueve los archivos ignorados. Si este checkout conserva la base anterior, **mueve `db/users.sqlite` a `src/db/users.sqlite` a mano antes de abrir la app o ejecutar un notebook**. Si falta el archivo en el destino, SQLite puede crear uno vacío; eso no traslada los datos existentes. Al cambiar de máquina, lleva también una copia local de la base: hacer clone o pull no la descarga.

1. Cierra los clientes y las conexiones de la app. Guarda una copia de seguridad de la base y de los auxiliares presentes fuera de Git.
2. Comprueba que `db/users.sqlite` existe y que no existe `src/db/users.sqlite` ni un auxiliar de destino. Si hay archivos en ambas ubicaciones, detente y decide qué conjunto conserva los datos que necesitas; no sobrescribas ninguno.
3. Traslada la base a `src/db/` y, si siguen presentes con las conexiones cerradas, sus archivos `users.sqlite-wal`, `users.sqlite-shm` y `users.sqlite-journal`, sin cambiarles el nombre ni separarlos de su base. No copies ni muevas una base mientras haya escrituras activas.
4. Comprueba la existencia y los hashes de los archivos trasladados antes de abrir la app. Conserva el respaldo hasta confirmar los datos; no añadas SQLite ni sus auxiliares a Git.

Si la base ya está en `src/db/`, no repitas el traslado. Esta reorganización documenta el paso manual; no ejecuta una migración automática ni fusiona bases distintas.

La tabla `users` tiene estas reglas:

- `id` es `INTEGER PRIMARY KEY` y SQLite lo genera de forma incremental.
- `email` es `VARCHAR(64) NOT NULL UNIQUE`.
- `name` es `TEXT NOT NULL`.
- `createdAt` y `updatedAt` se almacenan como `TEXT` con el formato `YYYY-MM-DD HH:MM:SS`, producido por `datetime('now', 'localtime')`.

## Consultas SQL

El texto SQL no se escribe dentro de la función de lógica que lo utiliza. En `src/queries/queries/` cada consulta tiene su propio `.sql`, que contiene solo SQL y parámetros nombrados (`:id`, `:name`, `:email`). `src/queries/users.js` carga esos archivos, prepara las sentencias con `db` y las ejecuta; sus funciones pueden ser llamadas desde `src/logic/`.
