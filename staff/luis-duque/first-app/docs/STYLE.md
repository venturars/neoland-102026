# Estilo

## Cómo nombrar

Escribe los nombres de archivo en inglés.

Usa un archivo por acción, con la forma `accion-user`. Listar es la excepción y va en plural: `list-users`, porque devuelve todos los usuarios. No uses `list-user`. Buscar por `id` se llama `find-user-by-id`. Buscar por email se llama `find-user-by-email`. Buscar por nombre se llama `find-user-by-name`. En `src/logic` no termines un nombre en `query`. El recuento de género se llama `users-gender` en el archivo y `usersGender` en la función.

Nombra cada módulo de una consulta igual que su acción: `create-user.js`, `update-user.js`, `delete-user.js`, `list-users.js`, `find-user-by-id.js`, `find-user-by-email.js`, `find-user-by-name.js`. El esquema se llama `create-table-users.js`. No uses `users.sql`.

En `src/queries/users.js`, la función que pide cada consulta se llama igual que ese archivo, en camelCase: `createTableUsers`, `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail` y `findUserByName`. No uses `insertUser`, `saveUser`, `removeUser`, `selectUsers`, `selectUserById` ni `selectUserByEmail`. `createTableUsers` se espera antes de cada operación y no se llama a sí misma.

En `src/clients/terminal` usa el mismo nombre de acción y la extensión `.txt`.

No llames al esquema `users.sqlite` ni `schema.sql`.

Llama `users.sqlite` al archivo que crea SQLite. No uses `users.db`.

En `src/logic/shared.js` llama a las validaciones `validateNombre`, `validateEmail` y `validateId`. La del nombre lleva `Nombre`.

## Cómo escribir el código

Usa módulos de JavaScript: `import` y `export`. `package.json` ya tiene `"type": "module"`.

La dependencia `openai` está en `package.json`, versión `7.39.0`. El gestor de paquetes es pnpm `12.15.0`, declarado en `package.json` con `packageManager`. Instala y añade dependencias con pnpm desde `first-app`. `pnpm-lock.yaml` lo escribe pnpm. No lo edites a mano. No uses npm ni yarn, y no crees `package-lock.json` ni `yarn.lock`.

El único que abre la base y ejecuta SQL es `src/db/server.js`. La conexión no se exporta. No crees `connection.js` ni una función `openDatabase`. No abras la base en ningún otro archivo.

`src/queries/users.js` pide la ejecución a `http://127.0.0.1:3000/execute` y espera. El texto de cada consulta está en su módulo. Lo importa. No lo lee del disco en cada llamada.

No escribas SQL en `src/logic` y no abras SQLite desde ahí. Valida y llama a la función de `src/queries/users.js` con el mismo nombre: `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail` o `findUserByName`. Importa ese archivo como módulo, porque `src/logic` ya exporta una función con ese nombre.

No escribas SQL ni validación en `src/clients`. El cliente de terminal solo llama a `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail`, `findUserByName` o `usersGender`. El cliente del navegador solo llama a `listUsers`, `updateUser` y `deleteUser`. El cliente HTTP es la excepción a un archivo por acción: solo `src/clients/http/app.js`. Llama a `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail` y `findUserByName`. La colección Bruno vive en `src/clients/http/bruno`. Cada petición es un fichero `.bru` propio. El cliente Electron es `src/clients/electron`. `app.js` llama a `listUsers`, `createUser`, `updateUser` y `deleteUser`. No llama a las búsquedas ni a `usersGender`. No valida, no escribe SQL y no abre la base. El popup de Chrome es `src/clients/chrome`. `app.js` pide listar, crear, modificar y eliminar a `http://127.0.0.1:3002`. `server.js` usa Fastify `5.12.8` y llama a `listUsers`, `createUser`, `updateUser` y `deleteUser`. No llama a las búsquedas ni a `usersGender`. No valida, no escribe SQL y no abre la base. El manifiesto es `src/clients/chrome/manifest.json`. Se arranca con `pnpm chrome`. La vista de Visual Studio Code es `src/clients/vscode`. `extension.js` llama a `listUsers`, `createUser`, `updateUser` y `deleteUser`. No llama a las búsquedas ni a `usersGender`. No valida, no escribe SQL y no abre la base. `app.js` pide esas cuatro operaciones al proceso del editor y no importa la lógica. El manifiesto es `src/clients/vscode/package.json`. Se arranca con `pnpm vscode`. `vscode` lo aporta el editor. `engines.vscode` queda en `^1.100.0`. El cliente NestJS es `src/clients/nest`. `main.js` monta la página con `@nestjs/swagger` `12.1.0`. `users.controller.js` describe listar, crear, modificar, eliminar y buscar por id. `users.service.js` llama a `listUsers`, `createUser`, `updateUser`, `deleteUser` y `findUserById`. No llama a `findUserByEmail`, `findUserByName` ni a `usersGender`. No valida, no escribe SQL y no abre la base. Se arranca con `pnpm nest`. NestJS queda en `12.3.3`. El cliente HTTP de Node es un solo fichero, `src/clients/node-http/app.js`. Llama a `listUsers`, `createUser`, `updateUser`, `deleteUser` y `findUserById`. No llama a `findUserByEmail`, `findUserByName` ni a `usersGender`. No valida, no escribe SQL y no abre la base. Los documentos viven en `src/clients/node-http/jupyter`. Se arranca con `pnpm node-http`. Se abren con `pnpm jupyter-node-http`.

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

El menú de las pantallas deja el nombre grande y tres acciones en columna: Volver, Modificar usuario, Notas. Las pantallas del navegador conservan Notas.

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

La ventana Electron usa esta misma dirección. La lista añade Crear. Crear usuario pide el nombre y el email, y debajo van Guardar y Volver. El menú de esta ventana es Volver y Modificar usuario. No tiene Notas.

```
Usuarios
12  Ana García
    ana@example.com
————————
4   Luis Martín
    luis@example.com

Id [        ]  Elegir
Crear
```

```
Crear usuario

Nombre [        ]
Email  [        ]

Guardar
Volver
```

```
Ana García
id 12

Volver
Modificar usuario
```

## Dirección del popup de Chrome

El popup usa la misma dirección que las pantallas y la ventana: el libro de registro. Chapa `#E4E8EA`, tinta `#1B2830`, latón `#A6843D`, óxido `#8F3D36`, niebla `#F7F8F8` y grafito `#5C6B73`. Literata para el título de la vista y el nombre elegido. Familjen Grotesk para la lista, las etiquetas, los campos, los botones y los fallos. Una persona es una línea, separada por una raya. El nombre elegido es lo único grande. El latón solo marca el id y el foco. El óxido solo marca el fallo y Eliminar. No hay Notas ni animación. El popup mide 360 píxeles de ancho.

## Dirección de la vista de Visual Studio Code

La vista usa la misma dirección que las pantallas, la ventana y el popup: el libro de registro. Chapa `#E4E8EA`, tinta `#1B2830`, latón `#A6843D`, óxido `#8F3D36`, niebla `#F7F8F8` y grafito `#5C6B73`. Literata para el título de la vista y el nombre elegido. Familjen Grotesk para la lista, las etiquetas, los campos, los botones y los fallos. Una persona es una línea, separada por una raya. El nombre elegido es lo único grande. El latón solo marca el id y el foco. El óxido solo marca el fallo y Eliminar. No hay Notas ni animación. La vista ocupa el ancho de la barra lateral.
