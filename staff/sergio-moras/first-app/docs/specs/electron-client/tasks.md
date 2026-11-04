# Tasks: Cliente de escritorio

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden** y todas seguidas. Desde la versión 1.1 del plan, T1 a T4 usan el Electron de la carpeta de prueba, fuera del proyecto, y T5 instala el paquete a partir del 2026-11-04 a las 22:43.

## T1. La ventana
- [ ] Crear `src/clients/electron/main.js` como dice el plan.
- [ ] Añadir a `package.json` el script `electron` y `src/clients/electron/**/*.{js,html,css}` al script `format`.

## T2. La página
- [ ] Crear `src/clients/electron/index.html` con la CSP, las dos pantallas y el aviso de borrar.
- [ ] Crear `src/clients/electron/styles.css`.
- [ ] Crear `src/clients/electron/app.js` como dice el plan.
- [ ] `eslint.config.js`: `document` también en `src/clients/electron/**/*.js`.

## T3. Comprobación
- [ ] Guardar la salida de `list-users.txt` antes de empezar.
- [ ] Con CDP y el usuario temporal `tmp-974-1`: lista, alta, ficha, guardar nombre, email y los dos, y borrar cancelando y confirmando.
- [ ] Los errores de la spec, cada uno con su mensaje.
- [ ] Con la base parada, el error de base parada.
- [ ] Una llamada a otro puerto desde la página se bloquea.
- [ ] No queda ningún `tmp-974-*` y `list-users.txt` da lo mismo que al empezar.
- [ ] `pnpm format` y `pnpm lint` sin errores.

## T4. Guías
- [ ] `ARCHITECTURE.md`: los ficheros nuevos y la sección del cliente de escritorio.
- [ ] `TREE.md`: `src/clients/electron/`.
- [ ] `AGENTS.md`: el comando `pnpm electron`, con `pnpm db` antes.

## T5. El paquete (a partir de las 22:43)
- [ ] `pnpm add -D electron@45.2.2 --save-exact`, sin `pnpm-workspace.yaml` ni excepciones.
- [ ] Comprobar que `package.json` tiene `"electron": "45.2.2"` en `devDependencies` y que `pnpm-lock.yaml` cambió.
- [ ] Con `pnpm electron`, la ventana abre y lista los usuarios.
