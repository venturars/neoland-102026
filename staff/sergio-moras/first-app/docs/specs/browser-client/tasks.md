# Tasks: Cliente de navegador

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden** y todas seguidas.

## T1. Servidor
- [x] Crear `src/clients/browser/server.js` con las rutas del plan.
- [x] Añadir el script `browser` a `package.json`.

## T2. Pantallas
- [x] Crear `src/clients/browser/public/index.html` con las tres pantallas.
- [x] Crear `src/clients/browser/public/styles.css`.
- [x] Crear `src/clients/browser/public/app.js`.

## T3. Formato y lint
- [x] Añadir los ficheros nuevos al script `format` de `package.json`.
- [x] Añadir las globales del plan a `eslint.config.js`.

## T4. Comprobación
- [x] Guardar la salida de `list-users.txt` antes de empezar.
- [x] Las rutas con `curl` y el usuario temporal `tmp-768-1`, con todos los casos del plan.
- [x] Las tres pantallas en el navegador con el usuario temporal `tmp-768-2`, de principio a fin.
- [x] No queda ningún `tmp-768-*` y `list-users.txt` da lo mismo que al empezar.
- [x] `pnpm format` y `pnpm lint` sin errores.

## T5. Guías
- [x] `ARCHITECTURE.md`: el fichero `server.js` y el cliente de navegador en la sección Clientes.
- [x] `TREE.md`: la carpeta `src/clients/browser/`.
- [x] `STYLE.md`: los textos de las pantallas del navegador van en español; los errores, tal cual los lanza `logic`.
- [x] `AGENTS.md`: el comando `pnpm browser`.

## T6. Aspecto y confirmación propia (plan 1.1)
- [ ] `index.html`: la lista de filas, las pantallas 2 y 3 con el orden de la sección Aspecto, y el `<dialog>` de confirmación.
- [ ] `styles.css`: rehecho con los criterios de la sección Aspecto.
- [ ] `app.js`: las filas como botones con iniciales, `askDeleteConfirmation()` y `removeUser()` desde la ventana.
- [ ] `eslint.config.js`: quitar `confirm` de las globales.

## T7. Comprobación del cambio
- [ ] Las tres pantallas en el navegador con un usuario temporal `tmp-768-3`: elegir con el ratón y con el teclado, Notas desactivada, volver, modificar, los errores, y la ventana de borrado cancelada con `Cancelar`, con `Esc` y confirmada.
- [ ] Una captura de cada pantalla y de la ventana, en escritorio y en móvil.
- [ ] No queda ningún `tmp-768-*` y `list-users.txt` da lo mismo que al empezar.
- [ ] `pnpm format` y `pnpm lint` sin errores.
