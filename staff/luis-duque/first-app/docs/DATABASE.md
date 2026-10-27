# Base de datos

El `id` lo asigna la base de datos. El email se guarda en minúsculas y no se puede repetir.

Guarda a los usuarios en `users.sqlite`: un `id` que pone SQLite, un nombre y un email que no se puede repetir. Abre el archivo y no ejecuta SQL. No hay otra tabla ni otro archivo de datos.

La tabla se llama `users`. Si no existe, se crea al cargar las consultas. Tiene tres columnas:

- `id` es un entero. Es la clave primaria y SQLite lo incrementa solo. No se escribe al crear.
- `name` es texto y no puede ir vacío. Se guarda tal como llega, ya recortado. `Ana` y `ana` no son el mismo nombre.
- `email` es texto, no puede ir vacío y no se puede repetir. Se guarda en minúsculas.

Las consultas no revisan los datos. Cada una ejecuta un solo SQL:

`db` abre `users.sqlite` y no ejecuta SQL. Ahí está el archivo de la base. No hay otro.

`queries` es la única carpeta que lee y ejecuta el SQL. El texto de cada consulta está en `queries/queries`, un archivo por operación. `queries` no revisa los datos: inserta, modifica, borra o lee, y crea la tabla si no existe. Ni `logic` ni los clientes escriben SQL ni abren la base.
