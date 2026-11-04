# Estilo

## Cómo nombrar

Escribe los nombres de archivo en inglés.

Usa un archivo por acción, con la forma `accion-user`. Listar es la excepción y va en plural: `list-users`, porque devuelve todos los usuarios. No uses `list-user`. Buscar por `id` se llama `find-user-by-id`. Buscar por email se llama `find-user-by-email`. Buscar por nombre se llama `find-user-by-name`. En `src/logic` no termines un nombre en `query`. El recuento de género se llama `users-gender` en el archivo y `usersGender` en la función.

Nombra cada `.sql` de una acción igual que su acción: `create-user.sql`, `update-user.sql`, `delete-user.sql`, `list-users.sql`, `find-user-by-id.sql`, `find-user-by-email.sql`, `find-user-by-name.sql`. El esquema se llama `create-table-users.sql`. No uses `users.sql`.

En `src/queries/users.js`, la función que ejecuta cada consulta se llama igual que ese archivo, en camelCase: `createTableUsers`, `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail` y `findUserByName`. No uses `insertUser`, `saveUser`, `removeUser`, `selectUsers`, `selectUserById` ni `selectUserByEmail`. `createTableUsers` se ejecuta al cargar `src/queries/users.js`.

En `src/clients/terminal` usa el mismo nombre de acción y la extensión `.txt`.

No llames al esquema `users.sqlite` ni `schema.sql`.

Llama `users.sqlite` al archivo que crea SQLite. No uses `users.db`.

En `src/logic/shared.js` llama a las validaciones `validateNombre`, `validateEmail` y `validateId`. La del nombre lleva `Nombre`.

## Cómo escribir el código

Usa módulos de JavaScript: `import` y `export`. `package.json` ya tiene `"type": "module"`.

La dependencia `openai` está en `package.json`, versión `7.39.0`. El gestor de paquetes es pnpm `12.15.0`, declarado en `package.json` con `packageManager`. Instala y añade dependencias con pnpm desde `first-app`. `pnpm-lock.yaml` lo escribe pnpm. No lo edites a mano. No uses npm ni yarn, y no crees `package-lock.json` ni `yarn.lock`.

Deja la conexión solo en `src/db/connection.js`. Mantenla corta: exporta `database` directamente con `new DatabaseSync` sobre `users.sqlite`. No crees una función `openDatabase`. No leas ni ejecutes SQL ahí. No abras la base en ningún otro archivo.

Haz que `src/queries/users.js` sea el único archivo que lee y ejecuta las consultas, incluida `create-table-users.sql`.

No escribas SQL en `src/logic` y no abras SQLite desde ahí. Valida y llama a la función de `src/queries/users.js` con el mismo nombre: `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail` o `findUserByName`. Importa ese archivo como módulo, porque `src/logic` ya exporta una función con ese nombre.

No escribas SQL ni validación en `src/clients`. El cliente de terminal solo llama a `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail`, `findUserByName` o `usersGender`.

No valides dentro de `src/queries`. Ejecuta la consulta que corresponde.

## Dirección del cliente web

El cliente web es un libro de registro de personas, no un panel. La chapa es el fondo. El nombre elegido es lo único grande. El resto se queda quieto.

### Paleta

- Chapa `#E4E8EA`: fondo de la página.
- Tinta `#1B2830`: texto y el nombre elegido.
- Latón `#A6843D`: el id y el foco del teclado. No decora nada más.
- Óxido `#8F3D36`: el fallo y Eliminar.
- Niebla `#F7F8F8`: el relleno del campo.
- Grafito `#5C6B73`: el email y el texto secundario.

### Tipografías

Literata es el título de la vista y el nombre elegido. Familjen Grotesk es la lista, las etiquetas, los campos, los botones y los fallos. No hay una tercera.

### Composición

El texto va alineado a la izquierda. Una sola columna, de menos de 80 caracteres. En una ventana estrecha el email baja bajo el nombre y el id se queda en la primera línea. Los botones ocupan el ancho de la columna.

La lista es una línea por persona, separada por una raya. No es una tarjeta. El id va delante, el nombre después y el email debajo, en grafito.

```
Usuarios
12  Ana García
    ana@example.com
————————
4   Luis Martín
    luis@example.com

Id [        ]  Elegir
```

El menú deja el nombre grande y tres acciones en columna: Volver, Modificar usuario, Notas.

```
Ana García
id 12

Volver
Modificar usuario
Notas
```

Modificar deja el id, el nombre y el email. Guardar, Eliminar y Volver van debajo. Notas dejan la frase que ya está y Volver. El vacío se queda vacío.

### Principios

Una persona es una línea del libro. El latón solo marca el id y el foco, con un contorno sólido y separado, sin brillo. El óxido solo significa fallo o eliminar. No hay animación. Si el sistema pide menos movimiento, no hay nada que quitar. El texto que ya se ve no se reescribe.
