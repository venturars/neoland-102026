# First App

Aplicación educativa de gestión de usuarios con Node.js y SQLite. Tiene clientes de terminal, Jupyter y navegador. El navegador usa HTML, CSS y JavaScript vanilla, sin frameworks.

## Abrir el cliente de navegador

Se necesita Node 24 y pnpm 10. Desde la carpeta `first-app`, con las dependencias instaladas mediante `pnpm install`:

```sh
pnpm start
```

Abrir [First App](http://127.0.0.1:3000). El servidor solo escucha en el equipo local. Para detenerlo, usar `Ctrl+C` en esa terminal. Si el puerto está ocupado, detener la otra instancia antes de volver a arrancar.

La aplicación abre `src/db/users.sqlite`. No crea usuarios de ejemplo automáticamente. Si la lista está vacía, se puede crear un usuario con las operaciones existentes de terminal o Jupyter; los ejemplos están en `src/clients/terminal/` y `src/clients/jupyter/`.

## Qué muestra cada pantalla

1. **Selección:** elegir un usuario existente por su id, nombre y email y pulsar «Continuar». No se pide contraseña.
2. **Menú:** ver el usuario seleccionado, volver a la selección o abrir «Modificar usuario». «Ir a notas» está deshabilitada y no abre otra pantalla.
3. **Edición:** cambiar nombre y email y guardar, volver sin guardar o eliminar el usuario tras confirmar. Cancelar el borrado conserva los datos.

Los cambios guardados se conservan al reiniciar. Recargar la página vuelve a la selección. Las notas, la creación de usuarios desde navegador y la autenticación no forman parte de este cliente.

## Dónde está el código

- `src/clients/web/index.html`: estructura de las tres pantallas.
- `src/clients/web/styles.css`: diseño adaptable; las variables del principio definen el lila y el fondo suave.
- `src/clients/web/main.js`: conecta los controles con sus funciones. Cada función del navegador está en su propio archivo de esa carpeta.
- `src/clients/http/`: sirve los archivos públicos y conecta las peticiones con las funciones existentes.
- `src/logic/`: validación y operaciones de usuarios que comparten los clientes.
- `src/queries/` y `src/db/`: consultas y almacenamiento existentes, sin cambios en esta tarea.
- `docs/specs/vanilla-user-client/`: especificación, plan y comprobaciones de la tarea.

El recorrido es navegador → HTTP → lógica → consultas → SQLite. El navegador nunca abre la base directamente. Las guías completas están en `docs/CONSTITUTION.md` y sus enlaces.

## Comprobaciones

```sh
pnpm test
pnpm format
pnpm lint
```

`pnpm test` crea su propia base temporal, comprueba las peticiones HTTP y elimina sus datos al terminar. No usa la base real.

Para arrancar manualmente con otro archivo de datos, definir `FIRST_APP_DATABASE_FILE` antes de iniciar el proceso:

```sh
FIRST_APP_DATABASE_FILE=/ruta/temporal/users.sqlite pnpm start
```

La carpeta elegida debe existir. Terminal y HTTP respetan esa variable; el puente Jupyter utiliza la base predeterminada de su copia de la aplicación.

La explicación completa del código, archivo por archivo, está en [la guía del cliente](docs/WEB-CLIENT-GUIDE.md).
