# Tasks: Cliente de extensión de VS Code

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden** y todas seguidas.

## T1. El manifiesto y el proceso
- [ ] Crear `src/clients/vscode/package.json` y `icon.svg` como dice el plan.
- [ ] Crear `src/clients/vscode/extension.js` como dice el plan.
- [ ] Añadir a `package.json` el script `vscode` y `src/clients/vscode/**/*.{js,html,css,json}` al script `format`.

## T2. El panel
- [ ] Crear `src/clients/vscode/index.html` con las marcas de la CSP, el nonce y las rutas, las dos pantallas y el aviso de borrar.
- [ ] Crear `src/clients/vscode/styles.css` con los colores del tema.
- [ ] Crear `src/clients/vscode/panel.js` como dice el plan.
- [ ] `eslint.config.js`: el bloque de `panel.js`.

## T3. Comprobación
- [ ] Guardar la salida de `list-users.txt` justo antes de empezar.
- [ ] Con CDP y el usuario temporal `tmp-1042-1`: lista, alta, ficha, guardar nombre, email y los dos, borrar cancelando y confirmando, y volver sin guardar.
- [ ] Los errores de la spec, cada uno con su mensaje.
- [ ] Con la base parada, el error de base parada.
- [ ] Una llamada a la base desde el panel se bloquea, y un nombre con HTML se ve como texto.
- [ ] No queda ningún `tmp-1042-*` y `list-users.txt` da lo mismo que al empezar.
- [ ] `pnpm format` y `pnpm lint` sin errores.

## T4. Guías
- [ ] `ARCHITECTURE.md`: los ficheros nuevos y la sección del cliente de VS Code.
- [ ] `TREE.md`: `src/clients/vscode/`.
- [ ] `AGENTS.md`: el comando `pnpm vscode`, con `pnpm db` antes.
