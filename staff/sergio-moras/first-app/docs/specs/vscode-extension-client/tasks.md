# Tasks: Cliente de extensión de VS Code

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden** y todas seguidas.

## T1. El manifiesto y el proceso
- [x] Crear `src/clients/vscode/package.json` y `icon.svg` como dice el plan.
- [x] Crear `src/clients/vscode/extension.js` como dice el plan.
- [x] Añadir a `package.json` el script `vscode` y `src/clients/vscode/**/*.{js,html,css,json}` al script `format`.

## T2. El panel
- [x] Crear `src/clients/vscode/index.html` con las marcas de la CSP, el nonce y las rutas, las dos pantallas y el aviso de borrar.
- [x] Crear `src/clients/vscode/styles.css` con los colores del tema.
- [x] Crear `src/clients/vscode/panel.js` como dice el plan.
- [x] `eslint.config.js`: el bloque de `panel.js`.

## T3. Comprobación
- [x] Guardar la salida de `list-users.txt` justo antes de empezar.
- [x] Con CDP y el usuario temporal `tmp-1042-1`: lista, alta, ficha, guardar nombre, email y los dos, borrar cancelando y confirmando, y volver sin guardar.
- [x] Los errores de la spec, cada uno con su mensaje.
- [x] Con la base parada, el error de base parada.
- [x] Una llamada a la base desde el panel se bloquea, y un nombre con HTML se ve como texto.
- [x] No queda ningún `tmp-1042-*` y `list-users.txt` da lo mismo que al empezar.
- [x] `pnpm format` y `pnpm lint` sin errores.

## T4. Guías
- [x] `ARCHITECTURE.md`: los ficheros nuevos y la sección del cliente de VS Code.
- [x] `TREE.md`: `src/clients/vscode/`.
- [x] `AGENTS.md`: el comando `pnpm vscode`, con `pnpm db` antes.
