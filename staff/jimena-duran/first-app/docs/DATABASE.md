# Base de datos y consultas

La aplicación utiliza únicamente `src/db/users.sqlite`, abierto por `src/db/server.js`. Los clientes no abren SQLite: acceden al servidor a través de queries. El archivo y sus auxiliares permanecen fuera de Git.

## Servidor local

Desde first-app, en PowerShell:

```powershell
node src/db/server.js
```

`pnpm server` ejecuta el mismo archivo cuando pnpm está disponible. El servidor escucha en `127.0.0.1:3000`; mantener esa terminal abierta mientras se ejecutan los clientes. Detener el proceso propio con Ctrl+C al terminar. No arrancar otra copia sobre un puerto ocupado ni mover una base en uso.

El servidor abre o crea users.sqlite junto a server.js. El esquema no se prepara automáticamente: ejecutar el cliente `create-users-table.txt` o su notebook para crear la tabla y comprobar listTables. Terminal y Jupyter esperan los resultados con await y utilizan la misma base del servidor. Para ensayos, utilizar un servidor y datos ficticios de una copia desechable; no inicializar ni migrar la base personal como efecto de una prueba.

POST /execute recibe `{ method, sql, params }` y ejecuta exec/get/all/run. Devuelve `{ ok: true }`, `{ row }` (null si falta), `{ rows }` o `{ changes }`. El SQL y sus parámetros nombrados proceden de queries; no se añade una capa de operaciones de usuarios. CORS permite * y OPTIONS admite POST/content-type. Rutas o métodos no previstos responden 404; JSON inválido o fallo de ejecución responde 500.

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

El texto SQL no se escribe dentro de logic. Cada consulta vive como constante exportada de un módulo .js en src/queries/queries/: create-users-table, find-all, find-by-email, find-by-id, find-by-name, insert, list-tables, remove y update. Los parámetros son :id, :name y :email.

src/queries/users.js importa las constantes y envía HTTP/JSON al servidor mediante fetch; no usa readFile ni importa la base. Sus nueve funciones son asíncronas y los clientes/logic esperan el resultado. El servidor enlaza los parámetros con las sentencias y es el único propietario de SQLite.
