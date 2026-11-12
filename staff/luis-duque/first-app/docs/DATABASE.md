# Base de datos

El `id` lo asigna la base de datos. El email se guarda en minúsculas y no se puede repetir.

Guarda a los usuarios en `users.sqlite`: un `id` que pone SQLite, un nombre y un email que no se puede repetir. `src/db/server.js` abre el archivo y ejecuta lo que le piden en `/execute`. No hay otra tabla ni otro archivo de datos.

La tabla se llama `users`. Si no existe, se crea antes de cada operación. Tiene tres columnas:

- `id` es un entero. Es la clave primaria y SQLite lo incrementa solo. No se escribe al crear.
- `name` es texto y no puede ir vacío. Se guarda tal como llega, ya recortado. `Ana` y `ana` no son el mismo nombre.
- `email` es texto, no puede ir vacío y no se puede repetir. Se guarda en minúsculas.

Las consultas no revisan los datos. Cada una ejecuta un solo SQL:

# queries

`src/db/server.js` abre `users.sqlite` y ejecuta lo que le piden en `/execute`. Ahí está el archivo de la base. No hay otro.

El texto de cada consulta vive en `src/queries/queries`, un módulo por operación. `src/queries/users.js` no abre la base: se lo pide a ese programa. Crea la tabla si no existe. No revisa los datos: inserta, modifica, borra o lee. Ni `src/logic` ni los clientes escriben SQL ni abren la base.
