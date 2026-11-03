# First App

Aplicación educativa de gestión de usuarios con Node.js y SQLite. Tiene clientes de terminal, Jupyter, navegador y HTTP. El navegador usa HTML, CSS y JavaScript vanilla, sin frameworks.

## Arrancar

Se necesita Node 24, pnpm 10 y Google Chrome. Desde la carpeta `first-app`, con las dependencias instaladas mediante `pnpm install`:

```sh
pnpm start
```

Arranca el **servidor de datos** en `http://127.0.0.1:3000`. Es el único proceso que abre `src/db/users.sqlite`, y todos los clientes le piden los datos a él. Tiene que estar arrancado antes de usar cualquier cliente. Solo escucha en el equipo local. Para detenerlo, usar `Ctrl+C` en esa terminal.

Con el servidor de datos arrancado, cada cliente se usa por separado:

| Cliente   | Cómo se abre                                                         |
| --------- | -------------------------------------------------------------------- |
| Navegador | `pnpm run web` abre Chrome con `src/clients/web/index.html`.         |
| HTTP      | `pnpm run start:http` escucha en `http://127.0.0.1:3001`.            |
| Terminal  | Copiar una línea de `src/clients/terminal/`.                         |
| Jupyter   | `./scripts/jupyter.sh` abre los cuadernos de `src/clients/jupyter/`. |

`pnpm run web` abre Chrome con un perfil temporal y `--allow-file-access-from-files`, porque la página se abre desde `file://` e importa módulos JavaScript de `src/logic/`. Chrome bloquea esos imports sin esa opción.

## Qué muestra cada pantalla del navegador

1. **Selección:** elegir un usuario existente por su id, nombre y email y pulsar «Continuar», o crear uno nuevo con nombre y email. No se pide contraseña.
2. **Menú:** ver el usuario seleccionado, volver a la selección o abrir «Modificar usuario». «Ir a notas» está deshabilitada y no abre otra pantalla.
3. **Edición:** cambiar nombre y email y guardar, volver sin guardar o eliminar el usuario tras confirmar. Cancelar el borrado conserva los datos.

Los cambios guardados se conservan al reiniciar. Recargar la página vuelve a la selección. El navegador funciona aunque el cliente HTTP no esté arrancado.

## Cliente HTTP

Responde en JSON a tres operaciones:

| Método y ruta           | Cuerpo                  | Respuesta             |
| ----------------------- | ----------------------- | --------------------- |
| `POST /api/users`       | `{ "name", "email" }`   | `201` con el usuario. |
| `PATCH /api/users/:id`  | `name`, `email` o ambos | `200` con el usuario. |
| `DELETE /api/users/:id` | —                       | `204` sin cuerpo.     |

Ya no sirve la página web ni lista o busca usuarios.

## Dónde está el código

- `src/db/server.js`: el servidor de datos. Recibe SQL por `POST /execute` y lo ejecuta en SQLite.
- `src/queries/`: cada consulta es un módulo `.js` que exporta su SQL; `users.js` lo envía al servidor de datos con `fetch`.
- `src/logic/`: validación y operaciones de usuarios que comparten todos los clientes.
- `src/clients/web/`: `index.html`, `styles.css` y `app.js`. Importa `src/logic/` directamente.
- `src/clients/http/`: `app.js` y tres archivos pequeños para leer JSON, responder y traducir errores.

El recorrido es cliente → lógica → consultas → servidor de datos → SQLite. Ningún cliente abre la base directamente. Las guías completas están en `docs/CONSTITUTION.md` y sus enlaces.

## Comprobaciones

```sh
pnpm test
pnpm format
pnpm lint
```

`pnpm test` crea sus propias bases temporales y elimina sus datos al terminar. No usa la base real. Las pruebas arrancan su propio servidor de datos en el puerto `3000`, así que hay que detener `pnpm start` antes de ejecutarlas; si el puerto está ocupado, fallan antes de enviar ninguna consulta.

Para arrancar el servidor de datos con otro archivo, definir `FIRST_APP_DATABASE_FILE` antes de iniciarlo:

```sh
FIRST_APP_DATABASE_FILE=/ruta/temporal/users.sqlite pnpm start
```

La carpeta elegida debe existir. Todos los clientes usan entonces ese archivo, porque todos pasan por el servidor de datos.

La explicación completa del código, archivo por archivo, está en [la guía del cliente](docs/WEB-CLIENT-GUIDE.md).
