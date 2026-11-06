# Plan — cliente de extensión de Visual Studio Code

Cumple `docs/specs/vscode-extension-client/spec.md`.

No hay operación nueva ni SQL nuevo. Listar, crear, modificar y eliminar siguen en la lógica que ya existe. Buscar y contar el género no entran. Crear la tabla no se pide aparte.

No se añade un paquete de Node. `vscode` lo aporta el editor. No se añade Fastify ni otro programa HTTP: la spec no pide un segundo origen, solo el de consultas. Express `5.3.0`, Electron `45.2.3` y Fastify `5.12.8` se quedan como están.

## Validación Socket

No hay paquete de Node nuevo ni cambio de versión. `vscode` no es un paquete de esta app. `@types/vscode` no se añade: no hay TypeScript. No se llama a Socket. Eso no es ausencia de avisos: no había qué comprobar.

## Ficheros

Se crea `src/clients/vscode/`:

- `package.json` es el manifiesto de la extensión. Visual Studio Code exige ese nombre en la carpeta que se carga.
- `extension.js` corre en el editor, importa la lógica y registra la vista.
- `index.html` es la vista.
- `app.js` pide listar, crear, modificar y eliminar al proceso del editor.
- `styles.css` pinta el libro de registro.
- `icon.svg` es el icono de la barra de actividad. El editor lo pide para un contenedor propio.

`src/clients/vscode/package.json` no es un paquete de pnpm. No tiene `dependencies` ni `scripts`. `pnpm-workspace.yaml` no lo añade. El `package.json` de `first-app` sigue siendo el de la app.

El manifiesto usa `"type": "module"` y `engines.vscode` `^1.100.0`, porque esta app ya es ESM y el editor admite extensiones ESM desde esa versión. El nombre visible es Usuarios. `contributes.viewsContainers.activitybar` abre un contenedor Usuarios con `icon.svg`. `contributes.views` pone en ese contenedor una vista `webview` llamada Usuarios. No hay comandos. No hay script remoto.

`extension.js` importa `listUsers`, `createUser`, `updateUser` y `deleteUser`. Carga `index.html` en la vista y deja que `app.js` y `styles.css` salgan de la propia extensión. La política de la vista deja los scripts en la extensión y permite las hojas y las fuentes de `fonts.googleapis.com` y `fonts.gstatic.com`, igual que el popup. `app.js` no importa la lógica: la webview no puede. Pide las cuatro operaciones al proceso del editor. Si la lógica lanza un `Error`, ese proceso envía `error.message` y la vista lo muestra.

No se tocan `src/logic`, `src/queries`, `src/db`, `src/clients/terminal`, `src/clients/jupyter`, `src/clients/browser`, `src/clients/http`, `src/clients/electron` ni `src/clients/chrome`.

Se toca `package.json` de `first-app`. El script `vscode` queda `code --extensionDevelopmentPath="%CD%\\src\\clients\\vscode" "%CD%"`. Se lanza con `pnpm vscode` desde `first-app`, en Windows, con `pnpm server` en marcha. Hace falta Visual Studio Code y el comando `code`. No hay otro script para este cliente. El script `format` también escribe `src/clients/vscode/**/*.js`.

En el mismo cambio que el código se tocan `docs/CONSTITUTIONS.MD`, `AGENTS.MD`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/STYLE.md` y `docs/ERRORS.md`. `docs/DATABASE.md` no cambia: la base sigue igual.

## Firma

No hay función de negocio nueva. `extension.js` importa cuatro funciones que ya existen. `app.js` las pide al proceso del editor.

| Acción en la vista | Mensaje | Llamada en el editor |
| --- | --- | --- |
| Listar | listar | `listUsers()` |
| Crear | crear con `name` y `email` | `createUser({ name, email })` |
| Modificar | modificar con `id`, `name` y `email` | `updateUser(id, { name, email })` |
| Eliminar | eliminar con `id` | `deleteUser(id)` |

El proceso del editor no importa `usersGender`, `findUserById`, `findUserByEmail` ni `findUserByName`. No llama a `/execute`. No valida, no escribe SQL y no abre la base. No escucha en un puerto.

El formulario de modificar muestra el nombre y el email ya guardados y envía los dos. La lógica sigue aceptando solo uno. Esta vista no usa ese caso.

Para elegir, el id se busca en la lista ya cargada. Si no es un entero positivo, se ve `User id must be a positive integer`. Si no está en la lista, se ve `User ${id} was not found`. Esa elección no llama a buscar.

## SQL

No hay SQL nuevo. Cada acción usa la operación que ya está escrita.

## Dirección

La vista usa la dirección que ya está en `docs/STYLE.md`, la del libro de registro. Es la misma de las pantallas, de la ventana y del popup. Chapa `#E4E8EA`, tinta `#1B2830`, latón `#A6843D`, óxido `#8F3D36`, niebla `#F7F8F8` y grafito `#5C6B73`. Literata para el título de la vista y el nombre elegido. Familjen Grotesk para la lista, las etiquetas, los campos, los botones y los fallos. Texto a la izquierda, una columna, una línea por persona y botones al ancho de la columna. El latón solo marca el id y el foco. El óxido solo marca el fallo y Eliminar. No hay animación. La vista ocupa el ancho de la barra lateral.

La lista se llama Usuarios. Cada línea lleva el id, el nombre y el email. Si no hay nadie, la lista se queda vacía y no se muestra un fallo. Debajo están el id, Elegir y Crear.

```
Usuarios
12  Ana García
    ana@example.com
————————
4   Luis Martín
    luis@example.com

Id [        ]
Elegir
Crear
```

Elegir abre el menú de esa persona. El nombre va grande. Las acciones son Volver y Modificar usuario. No hay Notas.

```
Ana García
id 12

Volver
Modificar usuario
```

Crear usuario pide el nombre y el email. Guardar y Volver van debajo. Modificar deja el id, el nombre y el email. Guardar, Eliminar y Volver van debajo. Guardar y Eliminar vuelven a la lista. Volver vuelve al menú.

Si la función lanza un `Error`, se muestra `error.message` y no se cambia de vista. El texto no se reescribe. Ahí entran `Name is required`, `Name must be at most 100 characters`, `Email is required`, `Email is not valid`, `User id must be a positive integer`, `Provide a name or an email to update`, un mensaje que termina en `was not found` y un mensaje que contiene `UNIQUE constraint`. Si el programa de consultas no está en marcha, se muestra el fallo de esa llamada y la operación no se completa.

## Documentación

`docs/ARCHITECTURE.md` gana la extensión de Visual Studio Code: otra forma de listar, crear, modificar y eliminar, en una vista de la barra lateral. El icono Usuarios está en la barra de actividad. Se arranca con `pnpm vscode`. El proceso del editor llama a la lógica. La vista no importa la lógica. No busca y no cuenta el género. No incluye notas. No escucha en un puerto. El aspecto es el del libro de registro. La terminal, Jupyter, las pantallas, la ventana, el popup de Chrome y el cliente HTTP siguen igual.

`docs/TREE.md` añade `clients/vscode/` con `package.json`, `extension.js`, `index.html`, `app.js`, `styles.css` e `icon.svg`.

`docs/STYLE.md` deja la vista en la misma dirección que las pantallas, la ventana y el popup: el libro de registro.

`docs/ERRORS.md` añade que, si la extensión no se abre, no se puede pedir la operación desde ahí. Si el programa de consultas no está en marcha, la vista muestra el fallo de esa llamada.

`docs/CONSTITUTIONS.MD` cuenta la vista, `pnpm vscode` y `src/clients/vscode`. El desarrollo abierto pasa a ser `docs/specs/vscode-extension-client/`.

`AGENTS.MD` deja la regla: el cliente vive en `src/clients/vscode`. El manifiesto vive en `src/clients/vscode/package.json`. `extension.js` importa `listUsers`, `createUser`, `updateUser` y `deleteUser`. No importa `usersGender` ni las búsquedas. No llama a `/execute`. No valida, no escribe SQL y no abre la base. Se arranca con `pnpm vscode` desde `first-app`. `app.js` pide esas cuatro operaciones al proceso del editor. No se añade otro framework. `vscode` lo aporta el editor. `engines.vscode` queda en `^1.100.0`.
