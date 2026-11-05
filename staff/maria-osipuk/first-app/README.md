# First App

Aplicación educativa de gestión de usuarios con Node.js y SQLite. Tiene clientes de terminal, Jupyter, navegador, REST y escritorio. El navegador usa HTML, CSS y JavaScript vanilla, sin frameworks.

## Arrancar

Se necesita Node 24, pnpm 10 y Google Chrome. Desde la carpeta `first-app`, con las dependencias instaladas mediante `pnpm install`:

```sh
pnpm start
```

Arranca el **servidor de datos** en `http://127.0.0.1:3000`. Es el único proceso que abre `src/db/users.sqlite`, y todos los clientes le piden los datos a él. Tiene que estar arrancado antes de usar cualquier cliente. Solo escucha en el equipo local. Para detenerlo, usar `Ctrl+C` en esa terminal.

Con el servidor de datos arrancado, cada cliente se usa por separado:

| Cliente    | Cómo se abre                                                         |
| ---------- | -------------------------------------------------------------------- |
| Navegador  | `pnpm run web` abre Chrome con `src/clients/web/index.html`.         |
| Terminal   | Copiar una línea de `src/clients/terminal/`.                         |
| Jupyter    | `./scripts/jupyter.sh` abre los cuadernos de `src/clients/jupyter/`. |
| REST       | `pnpm run http` arranca el cliente en `http://127.0.0.1:3001`.       |
| Escritorio | `pnpm run electron` abre la aplicación en su propia ventana.         |

`pnpm run web` abre Chrome con un perfil temporal y `--allow-file-access-from-files`, porque la página se abre desde `file://` e importa módulos JavaScript de `src/logic/`. Chrome bloquea esos imports sin esa opción.

## Probar el cliente REST con Postman

Con `pnpm start` y `pnpm run http` en dos terminales, las peticiones van a `http://127.0.0.1:3001`. Para enviar datos, en Postman se elige **Body → raw → JSON**:

| Operación | Petición          | Cuerpo de ejemplo                               | Respuesta        |
| --------- | ----------------- | ----------------------------------------------- | ---------------- |
| Crear     | `POST /users`     | `{ "name": "Ada", "email": "ada@example.com" }` | `201` y usuario  |
| Listar    | `GET /users`      |                                                 | `200` y lista    |
| Ver uno   | `GET /users/1`    |                                                 | `200` y usuario  |
| Modificar | `PATCH /users/1`  | `{ "name": "Ada Lovelace" }`                    | `200` y usuario  |
| Borrar    | `DELETE /users/1` |                                                 | `204` sin cuerpo |

Un error responde JSON con la clave `message`. Para no tocar la base real, arrancar el servidor de datos con `FIRST_APP_DATABASE_FILE`, como se explica en «Comprobaciones».

## Qué muestra cada pantalla del navegador

1. **Selección:** elegir un usuario existente por su id, nombre y email y pulsar «Continuar», o crear uno nuevo con nombre y email. No se pide contraseña.
2. **Menú:** ver el usuario seleccionado, volver a la selección o abrir «Modificar usuario». «Ir a notas» está deshabilitada y no abre otra pantalla.
3. **Edición:** cambiar nombre y email y guardar, volver sin guardar o eliminar el usuario tras confirmar. Cancelar el borrado conserva los datos.

Los cambios guardados se conservan al reiniciar. Recargar la página vuelve a la selección.

## Qué muestra la aplicación de escritorio

`pnpm run electron` abre una ventana propia. El primer arranque necesita internet y tarda más, porque descarga el binario de Electron. Si falla con `does not provide an export named 'BrowserWindow'`, la terminal tiene definida `ELECTRON_RUN_AS_NODE`: ejecutar antes `unset ELECTRON_RUN_AS_NODE`.

- **Lista, a la izquierda:** los usuarios, el botón «Actualizar» y el botón «Nuevo usuario».
- **Panel, a la derecha:** el alta o, al elegir un usuario, su detalle para guardar cambios o eliminarlo.

Eliminar pide confirmación con un diálogo del sistema. Cerrar la ventana termina la aplicación, también en macOS.

## Dónde está el código

- `src/db/server.js`: el servidor de datos. Recibe SQL por `POST /execute` y lo ejecuta en SQLite.
- `src/queries/`: cada consulta es un módulo `.js` que exporta su SQL; `users.js` lo envía al servidor de datos con `fetch`.
- `src/logic/`: validación y operaciones de usuarios que comparten todos los clientes.
- `src/clients/web/`: `index.html`, `styles.css` y `app.js`. Importa `src/logic/` directamente.
- `src/clients/http/app.js`: el cliente REST con Express. Importa `src/logic/` directamente.
- `src/clients/electron/`: la aplicación de escritorio. Su proceso principal llama a `src/logic/`, y su página le pide las acciones mediante `preload.cjs`.

El recorrido es cliente → lógica → consultas → servidor de datos → SQLite. Ningún cliente abre la base directamente. Las guías completas están en `docs/CONSTITUTION.md` y sus enlaces.

## Comprobaciones

```sh
pnpm test
pnpm format
pnpm lint
```

`pnpm test` crea sus propias bases temporales y elimina sus datos al terminar. No usa la base real. Las pruebas arrancan su propio servidor de datos en el puerto `3000`, y lanzan el cliente REST en el `3001`, así que hay que detener `pnpm start` y `pnpm run http` antes de ejecutarlas; si el puerto está ocupado, fallan antes de enviar ninguna consulta.

Para arrancar el servidor de datos con otro archivo, definir `FIRST_APP_DATABASE_FILE` antes de iniciarlo:

```sh
FIRST_APP_DATABASE_FILE=/ruta/temporal/users.sqlite pnpm start
```

La carpeta elegida debe existir. Todos los clientes usan entonces ese archivo, porque todos pasan por el servidor de datos.

La explicación completa del código, archivo por archivo, está en [la guía del cliente](docs/WEB-CLIENT-GUIDE.md).
